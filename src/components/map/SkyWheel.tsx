"use client";

import { useMemo, useRef, useState } from "react";
import {
  DOMAINS,
  EXECUTIVE_PULSE,
  groupsForDomain,
  hasConstellation,
  nodesForGroup,
  STATUS,
  surfacedCrossDomainEdges,
  type CompanyMapNode,
  type DomainId,
  type DomainMeta,
} from "@/lib/company-map";
import { edgeColor, edgeOpacity, edgeWidth, nodeSize } from "@/lib/company-map/visuals";
import { MapNode } from "./MapNode";

const N = DOMAINS.length;
/** Equal wedge for every domain. */
export const W_STEP = 360 / N;

/**
 * Sky geometry, carried over from the original constellation layout so the
 * silhouette and motion of the map are unchanged.
 */
const R_ROOT = 310;
/** Outside the foliage tips so domain names stay clear of nodes. */
const R_LABEL = 780;
const SPAN = (140 * Math.PI) / 180;
const R0 = 80;
const RB = 146;
const R_MAX = 314;
/** Hot children shown per branch group at the top level — keeps the sky quiet. */
const PER_ARM = 3;

type SkyWheelProps = {
  wheelAngle: number;
  focusedIndex: number;
  selectedId: string | null;
  onOpenDomain: (domainId: DomainId) => void;
  onSelectNode: (nodeId: string) => void;
  onDrillDown: (nodeId: string) => void;
  onSelectPulse: () => void;
};

type HoverTarget = { domain: number; arm: number | null; node?: string | null };

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: r * Math.sin(a), y: -r * Math.cos(a) };
}

/** Local polar: a=0 points up (−Y); after rotate(domainDeg) that is outward. */
function P(r: number, a: number): [number, number] {
  return [r * Math.sin(a), -r * Math.cos(a)];
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Seg = { x1: number; y1: number; x2: number; y2: number; op: number };

type ArmNode = { node: CompanyMapNode; x: number; y: number };

type Arm = {
  groupId: string;
  groupLabel: string;
  aC: number;
  stump: Seg;
  hub: { x: number; y: number };
  segs: Seg[];
  nodes: ArmNode[];
};

/**
 * One domain's mini constellation. Arms are the branch groups; each arm
 * surfaces its most material children, hot ones first.
 */
function buildMiniTree(domain: DomainMeta): Arm[] {
  const groups = groupsForDomain(domain.id);
  const arms: Arm[] = [];
  const span = SPAN / Math.max(1, groups.length);
  let cursor = -SPAN / 2;

  for (const group of groups) {
    const aC = cursor + span / 2;
    const [ex, ey] = P(R0, aC);
    const [sx, sy] = P(36, aC);

    const picked = [...nodesForGroup(group.id)]
      .sort(
        (a, b) =>
          Number(Boolean(b.hot)) - Number(Boolean(a.hot)) ||
          b.importance - a.importance,
      )
      .slice(0, PER_ARM);

    const segs: Seg[] = [];
    const nodes: ArmNode[] = [];
    let px = ex;
    let py = ey;

    picked.forEach((node, i) => {
      const zig = (i % 2 ? 1 : -1) * Math.min(span * 0.22, 0.075) * (i ? 1 : 0.45);
      const r = RB + (picked.length > 1 ? (i * (R_MAX - RB)) / (picked.length - 1) : 0);
      const [nx, ny] = P(r, aC + zig);
      segs.push({
        x1: px,
        y1: py,
        x2: nx,
        y2: ny,
        op: node.hot ? 0.5 : 0.16 + node.importance * 0.04,
      });
      nodes.push({ node, x: nx, y: ny });
      px = nx;
      py = ny;
    });

    arms.push({
      groupId: group.id,
      groupLabel: group.label,
      aC,
      stump: { x1: sx, y1: sy, x2: ex, y2: ey, op: 0.2 },
      hub: { x: ex, y: ey },
      segs,
      nodes,
    });

    cursor += span;
  }

  return arms;
}

const SHAPES: Arm[][] = DOMAINS.map(buildMiniTree);

/** Rotate a local mini-tree point into wheel-world coordinates. */
function toWorld(deg: number, rootX: number, rootY: number, x: number, y: number) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: rootX + x * c - y * s, y: rootY + x * s + y * c };
}

export function SkyWheel({
  wheelAngle,
  focusedIndex,
  selectedId,
  onOpenDomain,
  onSelectNode,
  onDrillDown,
  onSelectPulse,
}: SkyWheelProps) {
  const [hover, setHover] = useState<HoverTarget | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anyHover = hover != null;

  const clearLeave = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const enter = (next: HoverTarget) => {
    clearLeave();
    setHover(next);
  };

  const leave = () => {
    clearLeave();
    leaveTimer.current = setTimeout(() => {
      setHover(null);
      leaveTimer.current = null;
    }, 80);
  };

  /** World position of every surfaced node, recomputed as the wheel turns. */
  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    DOMAINS.forEach((domain, i) => {
      const deg = wheelAngle + i * W_STEP;
      const root = polar(R_ROOT, deg);
      for (const arm of SHAPES[i]) {
        for (const item of arm.nodes) {
          map.set(item.node.id, toWorld(deg, root.x, root.y, item.x, item.y));
        }
      }
    });
    return map;
  }, [wheelAngle]);

  const allCrossEdges = useMemo(() => surfacedCrossDomainEdges(), []);

  /**
   * Relationship lines stay hidden in the quiet default state — drawing all of
   * them at once crowds the constellation. They appear only for the node under
   * the pointer, or for the node whose detail panel is open.
   */
  const focusId = hover?.node ?? selectedId ?? null;
  const crossEdges = useMemo(
    () =>
      focusId
        ? allCrossEdges.filter(
            (edge) => edge.source === focusId || edge.target === focusId,
          )
        : [],
    [allCrossEdges, focusId],
  );

  return (
    <div className="relative" style={{ width: 0, height: 0 }}>
      {/* Orbit guides */}
      <svg
        width={1400}
        height={1400}
        viewBox="-700 -700 1400 1400"
        className="pointer-events-none absolute"
        style={{
          left: -700,
          top: -700,
          transform: `rotate(${wheelAngle}deg)`,
          opacity: anyHover ? 0.22 : 0.55,
          transition: "opacity 280ms ease",
        }}
      >
        <circle
          r={R_ROOT}
          fill="none"
          stroke="rgb(var(--lnrgb))"
          strokeOpacity={0.05}
          strokeWidth={1}
          strokeDasharray="1 12"
        />
        {DOMAINS.map((_, i) => {
          const a = (i * W_STEP * Math.PI) / 180;
          const x0 = 115 * Math.sin(a);
          const y0 = -115 * Math.cos(a);
          const x1 = (R_ROOT - 40) * Math.sin(a);
          const y1 = -(R_ROOT - 40) * Math.cos(a);
          return (
            <path
              key={i}
              d={`M ${x0.toFixed(1)} ${y0.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)}`}
              stroke="rgb(var(--lnrgb))"
              strokeOpacity={0.14}
              strokeWidth={1}
              strokeDasharray="2 6"
              fill="none"
            />
          );
        })}
      </svg>

      {/* Cross-domain relationships — drawn only for the hovered or selected node */}
      <svg
        width={2000}
        height={2000}
        viewBox="-1000 -1000 2000 2000"
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -1000, top: -1000 }}
      >
        {crossEdges.map((edge) => {
          const a = positions.get(edge.source);
          const b = positions.get(edge.target);
          if (!a || !b) return null;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const len = Math.hypot(mx, my);
          let cx: number;
          let cy: number;
          if (len < 80) {
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const l = Math.hypot(dx, dy) || 1;
            cx = (-dy / l) * 300;
            cy = (dx / l) * 300;
          } else {
            cx = mx * 1.4;
            cy = my * 1.4;
          }
          return (
            <path
              key={edge.id}
              d={`M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`}
              fill="none"
              stroke={edgeColor(edge)}
              strokeOpacity={edgeOpacity(edge)}
              strokeWidth={edgeWidth(edge, 0.9)}
              strokeLinecap="round"
              strokeDasharray={edge.type === "blocks" ? "6 7" : undefined}
            />
          );
        })}
      </svg>

      {/* Library — the centre of the ontology */}
      <button
        type="button"
        data-node
        onClick={(e) => {
          e.stopPropagation();
          onSelectPulse();
        }}
        className="hub-brain absolute flex h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 items-center justify-center transition hover:scale-[1.04]"
        style={{
          left: 0,
          top: 0,
          opacity: anyHover ? 0.32 : 1,
          transition: "opacity 280ms ease",
        }}
        title={EXECUTIVE_PULSE.label}
        aria-label={EXECUTIVE_PULSE.label}
      >
        <svg viewBox="-180 -180 360 360" width={360} height={360} className="overflow-visible">
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,86,143,0.22)" />
              <stop offset="55%" stopColor="rgba(0,119,200,0.1)" />
              <stop offset="100%" stopColor="rgba(0,86,143,0)" />
            </radialGradient>
          </defs>
          <circle className="hub-haze" cx={0} cy={0} r={150} fill="url(#hubGlow)" opacity={0.55} />
          {HUB_DOTS.map((d, k) => (
            <g
              key={k}
              className={d.reverse ? "hub-orbit hub-orbit-rev" : "hub-orbit"}
              style={{
                ["--phase" as string]: `${d.phase}deg`,
                animationDuration: `${d.spin}s`,
                animationDelay: `${d.delay}s`,
              }}
            >
              <circle
                className="hub-dot"
                cx={d.orbit}
                cy={0}
                r={d.r}
                fill={d.fill}
                opacity={d.op}
                style={{
                  ["--wobble-x" as string]: `${d.wobbleX}px`,
                  ["--wobble-y" as string]: `${d.wobbleY}px`,
                  animationDuration: `${d.wobbleDur}s`,
                  animationDelay: `${d.delay * 0.37}s`,
                }}
              />
            </g>
          ))}
          <circle className="hub-core" cx={-4} cy={-3} r={4.2} fill="var(--copper)" />
          <circle className="hub-core hub-core-b" cx={9} cy={6} r={2.8} fill="var(--brand-bright)" />
          <circle
            className="hub-core hub-core-c"
            cx={-8}
            cy={7}
            r={2}
            fill={STATUS[EXECUTIVE_PULSE.status].color}
          />
        </svg>
        <span className="pointer-events-none absolute top-[182px] text-center">
          <span
            className={`block text-[15px] font-semibold tracking-[0.12em] ${
              selectedId === EXECUTIVE_PULSE.id ? "text-[var(--copper)]" : "text-[var(--ivory)]"
            }`}
          >
            {EXECUTIVE_PULSE.label.toUpperCase()}
          </span>
          <span className="mt-1 block text-[12px] tracking-[0.02em] text-[var(--ink-2)]">
            {EXECUTIVE_PULSE.subtitle}
          </span>
        </span>
      </button>

      {DOMAINS.map((domain, i) => {
        const deg = wheelAngle + i * W_STEP;
        const root = polar(R_ROOT, deg);
        const label = polar(R_LABEL, deg);
        const focused = i === focusedIndex;
        const domainHover = hover?.domain === i;
        const dimmed = hover != null && hover.domain !== i;
        const arms = SHAPES[i];

        return (
          <div key={domain.id} className="contents">
            <div
              data-node
              className="absolute"
              style={{
                left: root.x,
                top: root.y,
                width: 0,
                height: 0,
                opacity: dimmed ? 0.14 : focused ? 1 : 0.72,
                filter: dimmed ? "grayscale(1) brightness(0.5)" : "none",
                transform: `scale(${domainHover || focused ? 1.06 : 1})`,
                transition: "opacity 220ms ease, filter 220ms ease, transform 220ms ease",
                zIndex: domainHover || focused ? 8 : dimmed ? 1 : 4,
              }}
              onPointerEnter={() => enter({ domain: i, arm: null })}
              onPointerLeave={leave}
            >
              <div className="absolute left-0 top-0" style={{ transform: `rotate(${deg}deg)` }}>
                <MiniTree
                  domain={domain}
                  deg={deg}
                  arms={arms}
                  activeArm={domainHover ? hover!.arm : null}
                  lit={!dimmed}
                  focused={focused}
                  selectedId={selectedId}
                  onArmEnter={(arm) => enter({ domain: i, arm })}
                  onNodeHover={(nodeId) =>
                    enter({ domain: i, arm: hover?.arm ?? null, node: nodeId })
                  }
                  onRootEnter={() => enter({ domain: i, arm: null })}
                  onOpenDomain={() => onOpenDomain(domain.id)}
                  onSelectNode={onSelectNode}
                  onDrillDown={onDrillDown}
                />
              </div>
            </div>

            {/* Domain name — outside the foliage, always readable */}
            <button
              type="button"
              data-node
              onPointerEnter={() => enter({ domain: i, arm: null })}
              onPointerLeave={leave}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDomain(domain.id);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                left: label.x,
                top: label.y,
                opacity: anyHover
                  ? domainHover
                    ? 1
                    : 0.2
                  : focused
                    ? 1
                    : 0.55,
                pointerEvents: "auto",
                transition: "opacity 220ms ease",
                zIndex: domainHover || focused ? 9 : 3,
                filter: dimmed ? "grayscale(0.85) opacity(0.5)" : "none",
              }}
            >
              <div
                className="whitespace-nowrap font-semibold tracking-[0.02em]"
                style={{
                  fontSize: focused || domainHover ? 22 : 18,
                  color: "var(--copper)",
                  transition: "font-size 180ms ease",
                }}
              >
                {domain.label}
              </div>
              <div
                className="mt-1 whitespace-nowrap tracking-[0.02em]"
                style={{
                  fontSize: 13,
                  color: domainHover || focused ? "var(--ivory-2)" : "var(--ink-2)",
                }}
              >
                {domain.subtitle}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MiniTree({
  domain,
  deg,
  arms,
  activeArm,
  lit,
  focused,
  selectedId,
  onArmEnter,
  onNodeHover,
  onRootEnter,
  onOpenDomain,
  onSelectNode,
  onDrillDown,
}: {
  domain: DomainMeta;
  deg: number;
  arms: Arm[];
  activeArm: number | null;
  lit: boolean;
  focused: boolean;
  selectedId: string | null;
  onArmEnter: (arm: number) => void;
  onNodeHover: (nodeId: string | null) => void;
  onRootEnter: () => void;
  onOpenDomain: () => void;
  onSelectNode: (nodeId: string) => void;
  onDrillDown: (nodeId: string) => void;
}) {
  const lineBase = "rgb(var(--lnrgb))";
  const armFocus = activeArm != null;

  return (
    <div className="absolute left-0 top-0" style={{ width: 0, height: 0 }}>
      <svg
        width={760}
        height={520}
        viewBox="-380 -420 760 520"
        className="pointer-events-none overflow-visible"
        style={{ position: "absolute", left: -380, top: -420 }}
      >
        {arms.map((arm, ai) => {
          const isArm = activeArm === ai;
          const dimArm = armFocus && !isArm;
          const stumpOp = dimArm ? 0.06 : isArm ? 0.55 : lit ? arm.stump.op : arm.stump.op * 0.45;

          return (
            <g key={arm.groupId}>
              <path
                d={`M ${arm.stump.x1.toFixed(1)} ${arm.stump.y1.toFixed(1)} L ${arm.stump.x2.toFixed(1)} ${arm.stump.y2.toFixed(1)}`}
                stroke={isArm ? domain.color : lineBase}
                strokeOpacity={stumpOp}
                strokeWidth={isArm ? 2.6 : 2}
                fill="none"
                strokeLinecap="round"
              />
              {arm.segs.map((b, bi) => {
                const op = dimArm ? 0.05 : isArm ? 0.7 : lit ? b.op : b.op * 0.4;
                return (
                  <path
                    key={bi}
                    d={`M ${b.x1.toFixed(1)} ${b.y1.toFixed(1)} L ${b.x2.toFixed(1)} ${b.y2.toFixed(1)}`}
                    stroke={isArm ? domain.color : lineBase}
                    strokeOpacity={op}
                    strokeWidth={isArm ? 2.3 : 2}
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
              <circle
                cx={arm.hub.x}
                cy={arm.hub.y}
                r={isArm ? 5.5 : 4}
                fill={domain.color}
                opacity={dimArm ? 0.2 : isArm ? 1 : lit ? 1 : 0.4}
              />
            </g>
          );
        })}
      </svg>

      {/* Broad arm hit targets — hovering lights one branch group */}
      {arms.map((arm, ai) => {
        const tip = arm.nodes[arm.nodes.length - 1] ?? arm.hub;
        const len = Math.hypot(tip.x - arm.hub.x, tip.y - arm.hub.y);
        return (
          <button
            key={`hit-${arm.groupId}`}
            type="button"
            data-node
            className="absolute"
            style={{
              left: (arm.hub.x + tip.x) / 2,
              top: (arm.hub.y + tip.y) / 2,
              width: 52,
              height: Math.max(88, len + 36),
              marginLeft: -26,
              marginTop: -Math.max(44, len / 2 + 18),
              transform: `rotate(${(arm.aC * 180) / Math.PI}deg)`,
              borderRadius: 26,
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label={arm.groupLabel}
            onPointerEnter={() => onArmEnter(ai)}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDomain();
            }}
          />
        );
      })}

      {/* Surfaced child nodes */}
      {arms.map((arm, ai) =>
        arm.nodes.map((item) => {
          const isArm = activeArm === ai;
          const dimArm = armFocus && !isArm;
          const size = Math.round(nodeSize(item.node, item.node.hot ? 0.42 : 0.3));
          return (
            <MapNode
              key={item.node.id}
              node={item.node}
              x={item.x}
              y={item.y}
              size={Math.max(11, size)}
              selected={selectedId === item.node.id}
              dimmed={dimArm}
              counterRotate={deg}
              label="hover"
              drillable={hasConstellation(item.node.id)}
              onSelect={() => onSelectNode(item.node.id)}
              onDrillDown={() => onDrillDown(item.node.id)}
              onHoverChange={(hovered) =>
                onNodeHover(hovered ? item.node.id : null)
              }
            />
          );
        }),
      )}

      {/* Branch group label appears only while its arm is lit */}
      {arms.map((arm, ai) => {
        if (activeArm !== ai) return null;
        const [lx, ly] = P(R0 - 34, arm.aC);
        return (
          <div
            key={`lbl-${arm.groupId}`}
            className="pointer-events-none absolute whitespace-nowrap"
            style={{
              left: lx,
              top: ly,
              transform: `translate(-50%, -50%) rotate(${-deg}deg)`,
              zIndex: 6,
            }}
          >
            <span
              className="rounded-md bg-[var(--bg-3)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{
                color: "var(--copper)",
                border: "1px solid var(--line)",
              }}
            >
              {arm.groupLabel}
            </span>
          </div>
        );
      })}

      {/* Domain root badge */}
      <button
        type="button"
        data-node
        className="absolute grid place-items-center rounded-full"
        style={{
          left: 0,
          top: 0,
          width: focused ? 72 : 64,
          height: focused ? 72 : 64,
          marginLeft: focused ? -36 : -32,
          marginTop: focused ? -36 : -32,
          background: "var(--bg-3)",
          border: `${focused ? 2.5 : 1.5}px solid color-mix(in srgb, ${domain.color} ${focused ? 85 : 65}%, transparent)`,
          boxShadow: focused
            ? `0 0 0 8px color-mix(in srgb, ${domain.color} 18%, transparent), 0 0 24px color-mix(in srgb, ${domain.color} 28%, transparent)`
            : `0 0 0 6px color-mix(in srgb, ${domain.color} 7%, transparent)`,
          cursor: "pointer",
          transition: "width 180ms ease, height 180ms ease, box-shadow 180ms ease",
        }}
        aria-label={`Open ${domain.label}`}
        onPointerEnter={onRootEnter}
        onClick={(e) => {
          e.stopPropagation();
          onOpenDomain();
        }}
      >
        <svg width={27} height={27} viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke={domain.color} strokeWidth={1.6} strokeLinecap="round" />
          <circle cx={12} cy={12} r={8.5} stroke={domain.color} strokeWidth={1.2} />
        </svg>
      </button>
    </div>
  );
}

const HUB_DOTS = (() => {
  const rnd = mulberry32(2026);
  const dots: {
    orbit: number;
    phase: number;
    r: number;
    fill: string;
    op: number;
    spin: number;
    delay: number;
    reverse: boolean;
    wobbleX: number;
    wobbleY: number;
    wobbleDur: number;
  }[] = [];

  const shells = [
    { count: 42, r0: 12, r1: 48, spin0: 14, spin1: 24 },
    { count: 56, r0: 40, r1: 90, spin0: 22, spin1: 40 },
    { count: 48, r0: 80, r1: 130, spin0: 34, spin1: 55 },
    { count: 28, r0: 120, r1: 165, spin0: 48, spin1: 78 },
  ];

  let k = 0;
  for (const shell of shells) {
    for (let i = 0; i < shell.count; i++, k++) {
      const t = i / shell.count;
      const orbit = shell.r0 + rnd() * (shell.r1 - shell.r0);
      dots.push({
        orbit,
        phase: t * 360 + (rnd() - 0.5) * 28,
        r: 0.7 + rnd() * (orbit < 35 ? 2.4 : 1.8),
        fill: k % 4 === 0 ? "#00568F" : DOMAINS[k % N].color,
        op: 0.28 + rnd() * 0.55,
        spin: shell.spin0 + rnd() * (shell.spin1 - shell.spin0),
        delay: -rnd() * 40,
        reverse: rnd() > 0.62,
        wobbleX: (rnd() - 0.5) * 5,
        wobbleY: (rnd() - 0.5) * 5,
        wobbleDur: 2.2 + rnd() * 3.5,
      });
    }
  }
  return dots;
})();
