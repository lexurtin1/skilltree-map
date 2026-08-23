"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TREE, type Job } from "@/lib/tree";
import { CameraWorld, type CameraState } from "./CameraWorld";
import { DeptFan } from "./DeptFan";
import { MapChrome } from "./MapChrome";
import { SkillCard } from "./SkillCard";
import { SkyWheel, W_STEP } from "./SkyWheel";
import { Starfield } from "./Starfield";

type Mode = "sky" | "fan";

type Selection = {
  job: Job;
  fnName: string;
} | null;

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
  const n = TREE.length;
  const idx = Math.round((180 - wheel) / W_STEP);
  return ((idx % n) + n) % n;
}

/** Angle that seats department `i` at the bottom (6 o'clock). */
function angleForDept(i: number) {
  return 180 - i * W_STEP;
}

export function MapExperience() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sky");
  const [wheelAngle, setWheelAngle] = useState(180);
  const [deptIndex, setDeptIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>(null);
  const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, scale: 1 });

  const wheelRef = useRef(wheelAngle);
  const targetRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    wheelRef.current = wheelAngle;
  }, [wheelAngle]);

  const focusedIndex = mode === "sky" ? focusedFromWheel(wheelAngle) : deptIndex;
  const dept = TREE[focusedIndex];

  const fitSky = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Wheel diameter includes outer labels at R_LABEL≈700 → ~1500 span + margin
    const mx = w < 700 ? 30 : 120;
    const my = w < 700 ? 130 : 150;
    const scale = Math.min((w - mx) / 1780, (h - my) / 1780);
    setCamera({
      x: w / 2,
      y: h / 2 - h * 0.04,
      scale: Math.max(0.18, Math.min(0.95, scale)),
    });
  }, []);

  const fitFan = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = Math.min(w / 1600, h / 1400, 0.85) * (w < 800 ? 0.7 : 1);
    setCamera({
      x: w / 2 + (w > 900 ? 80 : 0),
      y: h * 0.72,
      scale,
    });
  }, []);

  useEffect(() => {
    fitSky();
    const onResize = () => {
      if (mode === "sky") fitSky();
      else fitFan();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitFan, fitSky, mode]);

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
      // Keep continuity with current angle (don't jump ±360)
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

  const snapToNearest = useCallback(() => {
    const i = focusedFromWheel(wheelRef.current);
    animateTo(angleForDept(i));
  }, [animateTo]);

  const dive = useCallback(
    (i: number) => {
      setDeptIndex(i);
      setSelection(null);
      animateTo(angleForDept(i), () => {
        setMode("fan");
        fitFan();
      });
    },
    [animateTo, fitFan],
  );

  const rise = useCallback(() => {
    setSelection(null);
    setMode("sky");
    fitSky();
    // Re-seat the current dept at the bottom
    requestAnimationFrame(() => {
      setWheelAngle(angleForDept(deptIndex));
      wheelRef.current = angleForDept(deptIndex);
    });
  }, [deptIndex, fitSky]);

  const stepDept = useCallback(
    (dir: number) => {
      const n = TREE.length;
      if (mode === "sky") {
        const next = (focusedIndex + dir + n) % n;
        animateTo(angleForDept(next));
      } else {
        const next = (deptIndex + dir + n) % n;
        setDeptIndex(next);
        setSelection(null);
        fitFan();
      }
    },
    [animateTo, deptIndex, fitFan, focusedIndex, mode],
  );

  const edgeLeft = TREE[(focusedIndex - 1 + TREE.length) % TREE.length]?.name;
  const edgeRight = TREE[(focusedIndex + 1) % TREE.length]?.name;
  const zoomPct = useMemo(() => Math.round(camera.scale * 100), [camera.scale]);

  const bumpZoom = useCallback(
    (factor: number) => {
      if (mode === "sky") return; // sky zoom locked
      setCamera((c) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const mx = w / 2;
        const my = h / 2;
        const next = Math.min(2.4, Math.max(0.18, c.scale * factor));
        const wx = (mx - c.x) / c.scale;
        const wy = (my - c.y) / c.scale;
        return { scale: next, x: mx - wx * next, y: my - wy * next };
      });
    },
    [mode],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--bg)]">
      <Starfield />

      <CameraWorld
        camera={camera}
        onCameraChange={setCamera}
        rotateMode={mode === "sky"}
        onRotate={(d) => {
          stopAnim();
          setWheelAngle((a) => {
            const next = a + d;
            wheelRef.current = next;
            return next;
          });
        }}
        onDragEnd={mode === "sky" ? snapToNearest : undefined}
        onClickWorld={() => {
          if (mode === "fan") setSelection(null);
        }}
      >
        {mode === "sky" ? (
          <SkyWheel
            wheelAngle={wheelAngle}
            focusedIndex={focusedIndex}
            onDive={dive}
            onHubClick={() => router.push("/chat")}
          />
        ) : (
          <DeptFan
            dept={TREE[deptIndex]}
            selectedJob={selection?.job.name ?? null}
            onSelectRoot={() => setSelection(null)}
            onSelectJob={(job, fnName) => setSelection({ job, fnName })}
          />
        )}
      </CameraWorld>

      {selection && mode === "fan" && (
        <SkillCard
          dept={TREE[deptIndex]}
          fnName={selection.fnName}
          job={selection.job}
          onClose={() => setSelection(null)}
        />
      )}

      <MapChrome
        mode={mode}
        deptName={dept.name}
        deptSub={dept.sub}
        zoomPct={zoomPct}
        onZoomIn={() => bumpZoom(1.12)}
        onZoomOut={() => bumpZoom(0.9)}
        onBack={mode === "fan" ? rise : undefined}
        onPrevDept={() => stepDept(-1)}
        onNextDept={() => stepDept(1)}
        edgeLeft={mode === "fan" ? edgeLeft : undefined}
        edgeRight={mode === "fan" ? edgeRight : undefined}
      />
    </div>
  );
}
