"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DOMAINS,
  DOMAIN_BY_ID,
  EXECUTIVE_PULSE,
  getGroup,
  getNode,
  hasConstellation,
  trailFor,
  type Crumb,
  type DomainId,
} from "@/lib/company-map";
import { CameraWorld, ZOOM_MAX, ZOOM_MIN, type CameraState } from "./CameraWorld";
import { DomainFan, domainFanExtent } from "./DomainFan";
import { MapChrome, type MapMode } from "./MapChrome";
import { CONSTELLATION_EXTENT, NodeConstellation } from "./NodeConstellation";
import { NodeDetailPanel } from "./NodeDetailPanel";
import { SkyWheel, W_STEP } from "./SkyWheel";
import { Starfield } from "./Starfield";

type View =
  | { kind: "overview" }
  | { kind: "domain"; domainId: DomainId }
  | { kind: "node"; nodeId: string };

function normalizeAngle(a: number) {
  return ((a % 360) + 360) % 360;
}

/** Shortest signed delta from `from` → `to` in degrees. */
function angleDelta(from: number, to: number) {
  let d = to - from;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

function focusedFromWheel(wheel: number) {
  const n = DOMAINS.length;
  const idx = Math.round((180 - wheel) / W_STEP);
  return ((idx % n) + n) % n;
}

/** Angle that seats domain `i` at the bottom (6 o'clock). */
function angleForDomain(i: number) {
  return 180 - i * W_STEP;
}

function domainIndexOf(id: DomainId) {
  const i = DOMAINS.findIndex((d) => d.id === id);
  return i < 0 ? 0 : i;
}

/* ── Camera framing, one pure function per view ──────────────────────────── */

function skyCamera(): CameraState {
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Wheel diameter includes the outer labels at R_LABEL ≈ 700 → ~1500 span.
  const mx = w < 700 ? 30 : 120;
  const my = w < 700 ? 130 : 150;
  const scale = Math.min((w - mx) / 1780, (h - my) / 1780);
  return {
    x: w / 2,
    y: h / 2 - h * 0.04,
    scale: Math.max(0.18, Math.min(0.95, scale)),
  };
}

/**
 * The fan is a half-disc: 2R wide, R tall, rooted near the bottom of the
 * viewport. Framing it against its real geometry rather than a padded square
 * buys roughly a quarter more scale, which is the difference between labels
 * that read and labels that do not.
 */
function fanCamera(domainId: DomainId): CameraState {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const r = domainFanExtent(domainId);
  const halfWidth = r + 130; // label overhang at the flanks
  const height = r + 90; // node radius plus the root's offset below centre
  // Leave the top chrome and the bottom caption band clear.
  const usableH = Math.max(320, h - 210);
  const scale = Math.min(w / (2 * halfWidth), usableH / height, 0.95);
  return {
    x: w / 2,
    y: Math.max(h * 0.7, h - 150),
    scale: Math.max(ZOOM_MIN, scale),
  };
}

function constellationCamera(): CameraState {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const usableH = Math.max(320, h - 190);
  const scale = Math.min(
    w / (2.1 * CONSTELLATION_EXTENT),
    usableH / (2.05 * CONSTELLATION_EXTENT),
    0.95,
  );
  return { x: w / 2, y: h / 2 - 10, scale: Math.max(ZOOM_MIN, scale) };
}

function cameraFor(view: View): CameraState {
  if (view.kind === "overview") return skyCamera();
  if (view.kind === "domain") return fanCamera(view.domainId);
  return constellationCamera();
}

/**
 * The view a node lives in: a satellite belongs to its parent's constellation,
 * anything else belongs to its domain fan.
 */
function viewForNode(nodeId: string): View | null {
  if (nodeId === EXECUTIVE_PULSE.id) return { kind: "overview" };
  const node = getNode(nodeId);
  if (!node) return null;
  if (node.type === "domain") return { kind: "domain", domainId: node.domain };
  const parentId = node.parentId;
  if (parentId && !getGroup(parentId) && parentId !== EXECUTIVE_PULSE.id) {
    return { kind: "node", nodeId: parentId };
  }
  return { kind: "domain", domainId: node.domain };
}

function sameView(a: View, b: View) {
  if (a.kind !== b.kind) return false;
  if (a.kind === "domain" && b.kind === "domain") return a.domainId === b.domainId;
  if (a.kind === "node" && b.kind === "node") return a.nodeId === b.nodeId;
  return true;
}

export function MapExperience() {
  const [stack, setStack] = useState<View[]>([{ kind: "overview" }]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wheelAngle, setWheelAngle] = useState(180);
  const [domainIndex, setDomainIndex] = useState(0);
  const [camera, setCamera] = useState<CameraState>(skyCamera);

  const view = stack[stack.length - 1];
  const mode: MapMode = view.kind;

  const wheelRef = useRef(wheelAngle);
  const targetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    wheelRef.current = wheelAngle;
  }, [wheelAngle]);

  const focusedIndex = view.kind === "overview" ? focusedFromWheel(wheelAngle) : domainIndex;
  const focusedDomain = DOMAINS[focusedIndex];

  useEffect(() => {
    const onResize = () => setCamera(cameraFor(view));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [view]);

  const stopAnim = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    targetRef.current = null;
  }, []);

  const animateTo = useCallback(
    (target: number, onDone?: () => void) => {
      stopAnim();
      // Keep continuity with the current angle (don't jump ±360).
      const current = wheelRef.current;
      const dest = current + angleDelta(current, target);
      targetRef.current = dest;

      const tick = () => {
        const t = targetRef.current;
        if (t == null) return;
        const cur = wheelRef.current;
        const d = t - cur;
        if (Math.abs(d) < 0.15) {
          setWheelAngle(normalizeAngle(t));
          wheelRef.current = normalizeAngle(t);
          targetRef.current = null;
          rafRef.current = null;
          onDone?.();
          return;
        }
        const next = cur + d * 0.18;
        wheelRef.current = next;
        setWheelAngle(next);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopAnim],
  );

  useEffect(() => () => stopAnim(), [stopAnim]);

  const push = useCallback((next: View) => {
    setStack((s) => (sameView(s[s.length - 1], next) ? s : [...s, next]));
    setCamera(cameraFor(next));
  }, []);

  /** Reset the trail to a domain — used by the breadcrumb. */
  const goToDomain = useCallback((domainId: DomainId) => {
    setDomainIndex(domainIndexOf(domainId));
    setSelectedId(null);
    setStack([{ kind: "overview" }, { kind: "domain", domainId }]);
    setCamera(fanCamera(domainId));
  }, []);

  const goToOverview = useCallback((select: string | null = null) => {
    setStack([{ kind: "overview" }]);
    setSelectedId(select);
    setCamera(skyCamera());
  }, []);

  const openDomain = useCallback(
    (domainId: DomainId) => {
      setDomainIndex(domainIndexOf(domainId));
      setSelectedId(null);
      animateTo(angleForDomain(domainIndexOf(domainId)), () =>
        push({ kind: "domain", domainId }),
      );
    },
    [animateTo, push],
  );

  const openConstellation = useCallback(
    (nodeId: string) => {
      if (!hasConstellation(nodeId)) return;
      push({ kind: "node", nodeId });
      setSelectedId(nodeId);
    },
    [push],
  );

  /** Follow a relationship — into another domain if that is where it leads. */
  const follow = useCallback(
    (nodeId: string) => {
      const target = viewForNode(nodeId);
      if (!target) return;
      if (target.kind === "overview") {
        goToOverview(nodeId === EXECUTIVE_PULSE.id ? EXECUTIVE_PULSE.id : null);
        return;
      }
      if (target.kind === "domain") setDomainIndex(domainIndexOf(target.domainId));
      if (!sameView(view, target)) push(target);
      setSelectedId(nodeId);
    },
    [goToOverview, push, view],
  );

  const back = useCallback(() => {
    setSelectedId(null);
    setStack((s) => {
      if (s.length <= 1) return s;
      const next = s.slice(0, -1);
      const top = next[next.length - 1];
      setCamera(cameraFor(top));
      if (top.kind === "domain") setDomainIndex(domainIndexOf(top.domainId));
      return next;
    });
  }, []);

  const onClickWorld = useCallback(() => {
    if (selectedId) {
      setSelectedId(null);
      return;
    }
    back();
  }, [back, selectedId]);

  const stepDomain = useCallback(
    (dir: number) => {
      const n = DOMAINS.length;
      if (view.kind === "overview") {
        const next = (focusedIndex + dir + n) % n;
        animateTo(angleForDomain(next));
        return;
      }
      const next = (domainIndex + dir + n) % n;
      const domainId = DOMAINS[next].id;
      setDomainIndex(next);
      setSelectedId(null);
      setStack((s) => [...s.slice(0, -1), { kind: "domain", domainId }]);
      setCamera(fanCamera(domainId));
    },
    [animateTo, domainIndex, focusedIndex, view.kind],
  );

  const onCrumb = useCallback(
    (crumb: Crumb) => {
      if (crumb.kind === "pulse") {
        goToOverview();
        return;
      }
      if (crumb.kind === "domain") {
        goToDomain(crumb.id as DomainId);
        return;
      }
      if (crumb.kind === "group") {
        const group = getGroup(crumb.id);
        if (group) goToDomain(group.domain);
        return;
      }
      follow(crumb.id);
    },
    [follow, goToDomain, goToOverview],
  );

  const zoomPct = useMemo(() => Math.round(camera.scale * 100), [camera.scale]);

  const bumpZoom = useCallback(
    (factor: number) => {
      setCamera((c) => {
        const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, c.scale * factor));
        if (next === c.scale) return c;
        const mx = window.innerWidth / 2;
        const my = window.innerHeight / 2;
        const wx = (mx - c.x) / c.scale;
        const wy = (my - c.y) / c.scale;
        return { scale: next, x: mx - wx * next, y: my - wy * next };
      });
    },
    [],
  );

  const resetView = useCallback(() => setCamera(cameraFor(view)), [view]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest('input, textarea, [contenteditable="true"]')) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        bumpZoom(1.12);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        bumpZoom(0.9);
      } else if (e.key === "0") {
        e.preventDefault();
        resetView();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClickWorld();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bumpZoom, onClickWorld, resetView]);

  const selectedNode = selectedId ? getNode(selectedId) : null;

  const trail: Crumb[] = useMemo(() => {
    if (view.kind === "overview") return [];
    if (view.kind === "domain") return trailFor(view.domainId);
    return trailFor(view.nodeId);
  }, [view]);

  const caption = useMemo(() => {
    if (view.kind === "overview") {
      return {
        title: focusedDomain.label,
        subtitle: focusedDomain.subtitle,
        color: undefined as string | undefined,
      };
    }
    if (view.kind === "domain") {
      const domain = DOMAIN_BY_ID[view.domainId];
      return { title: domain.label, subtitle: domain.subtitle, color: domain.color };
    }
    const node = getNode(view.nodeId);
    return {
      title: node?.label ?? "",
      subtitle: node?.subtitle,
      color: node ? DOMAIN_BY_ID[node.domain].color : undefined,
    };
  }, [focusedDomain, view]);

  const edgeLeft = DOMAINS[(domainIndex - 1 + DOMAINS.length) % DOMAINS.length]?.label;
  const edgeRight = DOMAINS[(domainIndex + 1) % DOMAINS.length]?.label;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--bg)]">
      <Starfield />

      <CameraWorld
        camera={camera}
        onCameraChange={setCamera}
        onClickWorld={onClickWorld}
      >
        {view.kind === "overview" && (
          <SkyWheel
            wheelAngle={wheelAngle}
            focusedIndex={focusedIndex}
            selectedId={selectedId}
            onOpenDomain={openDomain}
            onSelectNode={setSelectedId}
            onSelectPulse={() => setSelectedId(EXECUTIVE_PULSE.id)}
          />
        )}

        {view.kind === "domain" && (
          <DomainFan
            domainId={view.domainId}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onDrillDown={openConstellation}
            onSelectDomain={() => setSelectedId(view.domainId)}
          />
        )}

        {view.kind === "node" && (
          <NodeConstellation
            nodeId={view.nodeId}
            selectedId={selectedId}
            onSelectNode={setSelectedId}
            onDrillDown={openConstellation}
            onFollow={follow}
          />
        )}
      </CameraWorld>

      {selectedNode && (
        <NodeDetailPanel
          nodeId={selectedNode.id}
          onClose={() => setSelectedId(null)}
          onFollow={follow}
          onDrillDown={openConstellation}
        />
      )}

      <MapChrome
        mode={mode}
        trail={trail}
        captionTitle={caption.title}
        captionSubtitle={caption.subtitle}
        captionColor={caption.color}
        zoomPct={zoomPct}
        onZoomIn={() => bumpZoom(1.12)}
        onZoomOut={() => bumpZoom(0.9)}
        onZoomReset={resetView}
        onBack={stack.length > 1 ? back : undefined}
        onCrumb={onCrumb}
        onPrevDomain={() => stepDomain(-1)}
        onNextDomain={() => stepDomain(1)}
        edgeLeft={view.kind === "domain" ? edgeLeft : undefined}
        edgeRight={view.kind === "domain" ? edgeRight : undefined}
      />
    </div>
  );
}
