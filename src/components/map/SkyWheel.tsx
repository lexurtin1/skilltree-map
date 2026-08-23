"use client";

import { useRef, useState } from "react";
import { TREE, type AutonomyLevel, type Department } from "@/lib/tree";

const N = TREE.length;
/** Equal wedge for every department. */
export const W_STEP = 360 / N;

/**
 * Exact SkillTree sky mini-tree constants (from map.html).
 * Roots sit on R_ROOT; branches fan outward in polar coords with zigzag.
 */
const R_ROOT = 310;
/** Outside foliage tips (root + R_MAX ≈ 624) so names stay clear of nodes. */
const R_LABEL = 700;
const SPAN = (140 * Math.PI) / 180;
const R0 = 80;
const RB = 146;
const R_STEP = 56;
const R_MAX = RB + 3 * R_STEP; // 314 — uniform outer silhouette

type SkyWheelProps = {
  wheelAngle: number;
  focusedIndex: number;
  onDive: (deptIndex: number) => void;
  onHubClick: () => void;
};

type HoverTarget = {
  dept: number;
  arm: number | null;
  job: number | null;
};

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: r * Math.sin(a), y: -r * Math.cos(a) };
}

/** Local polar: a=0 points up (−Y); after rotate(deptDeg) that is radially outward. */
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

type BranchSeg = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  op: number;
};

type JobNode = {
  x: number;
  y: number;
  name: string;
  level: AutonomyLevel;
};

type Arm = {
  fnIndex: number;
  fnName: string;
  aC: number;
  stump: BranchSeg;
  fn: { x: number; y: number };
  jobSegs: BranchSeg[];
  jobs: JobNode[];
};

type MiniShape = {
  arms: Arm[];
};

/**
 * Port of SkillTree map.html sky mini builder, kept as per-arm structures
 * so hover can light one branch and label its nodes.
 */
function buildMiniTree(dept: Department): MiniShape {
  const arms: Arm[] = [];
  const nf = dept.functions.length;
  let cursor = -SPAN / 2;

  const litOf = (level: AutonomyLevel) =>
    level === "autonomous" ? 0.42 : level === "assisted" ? 0.26 : 0.12;

  dept.functions.forEach((fn, fi) => {
    const jobs = fn.jobs.length;
    const span = SPAN / nf;
    const aC = cursor + span / 2;
    const [ex, ey] = P(R0, aC);
    const [sx, sy] = P(36, aC);

    const jobSegs: BranchSeg[] = [];
    const jobNodes: JobNode[] = [];
    let px = ex;
    let py = ey;
    fn.jobs.forEach((job, ji) => {
      const zig =
        (ji % 2 ? 1 : -1) *
        Math.min(span * 0.22, 0.075) *
        (ji ? 1 : 0.45);
      const r = RB + (jobs > 1 ? (ji * (R_MAX - RB)) / (jobs - 1) : 0);
      const [jx, jy] = P(r, aC + zig);
      jobSegs.push({
        x1: px,
        y1: py,
        x2: jx,
        y2: jy,
        op: litOf(job.level),
      });
      jobNodes.push({ x: jx, y: jy, name: job.name, level: job.level });
      px = jx;
      py = jy;
    });

    arms.push({
      fnIndex: fi,
      fnName: fn.name,
      aC,
      stump: { x1: sx, y1: sy, x2: ex, y2: ey, op: 0.2 },
      fn: { x: ex, y: ey },
      jobSegs,
      jobs: jobNodes,
    });

    cursor += span;
  });

  return { arms };
}

const TREE_SHAPES = TREE.map((d) => buildMiniTree(d));

export function SkyWheel({
  wheelAngle,
  focusedIndex,
  onDive,
  onHubClick,
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

  return (
    <div className="relative" style={{ width: 0, height: 0 }}>
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
        {TREE.map((_, i) => {
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

      <button
        type="button"
        data-node
        onClick={(e) => {
          e.stopPropagation();
          onHubClick();
        }}
        className="hub-brain absolute flex h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 items-center justify-center transition hover:scale-[1.04]"
        style={{
          left: 0,
          top: 0,
          opacity: anyHover ? 0.32 : 1,
          transition: "opacity 280ms ease",
        }}
        title="Open AI chat"
        aria-label="Open AI chat"
      >
        <svg
          viewBox="-180 -180 360 360"
          width={360}
          height={360}
          className="overflow-visible"
        >
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(233,228,214,0.22)" />
              <stop offset="55%" stopColor="rgba(197,139,95,0.08)" />
              <stop offset="100%" stopColor="rgba(197,139,95,0)" />
            </radialGradient>
          </defs>
          <circle
            className="hub-haze"
            cx={0}
            cy={0}
            r={150}
            fill="url(#hubGlow)"
            opacity={0.55}
          />
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
          <circle className="hub-core hub-core-b" cx={9} cy={6} r={2.8} fill="var(--ivory)" />
          <circle
            className="hub-core hub-core-c"
            cx={-8}
            cy={7}
            r={2}
            fill={TREE[0].color}
          />
        </svg>
        <span className="pointer-events-none absolute top-[188px] text-[11px] font-bold tracking-[0.32em] text-[var(--ivory-2)]">
          CHAT
        </span>
      </button>

      {TREE.map((dept, i) => {
        const deg = wheelAngle + i * W_STEP;
        const root = polar(R_ROOT, deg);
        const label = polar(R_LABEL, deg);
        const focused = i === focusedIndex;
        const deptHover = hover?.dept === i;
        const dimmed = hover != null && hover.dept !== i;
        const opacity = dimmed ? 0.14 : 1;
        const shape = TREE_SHAPES[i];
        const activeArm = deptHover ? hover!.arm : null;
        const activeJob = deptHover ? hover!.job : null;

        return (
          <div key={dept.name} className="contents">
            <div
              data-node
              className="absolute"
              style={{
                left: root.x,
                top: root.y,
                width: 0,
                height: 0,
                opacity,
                filter: dimmed ? "grayscale(1) brightness(0.5)" : "none",
                transform: `scale(${deptHover ? 1.04 : 1})`,
                transition:
                  "opacity 220ms ease, filter 220ms ease, transform 220ms ease",
                zIndex: deptHover ? 8 : dimmed ? 1 : 4,
              }}
              onPointerEnter={() => enter({ dept: i, arm: null, job: null })}
              onPointerLeave={leave}
            >
              <div
                className="absolute left-0 top-0"
                style={{ transform: `rotate(${deg}deg)` }}
              >
                <MiniTree
                  color={dept.color}
                  deg={deg}
                  shape={shape}
                  activeArm={activeArm}
                  activeJob={activeJob}
                  deptLit={!dimmed}
                  onArmEnter={(arm, job) => enter({ dept: i, arm, job })}
                  onRootEnter={() => enter({ dept: i, arm: null, job: null })}
                  onDive={() => onDive(i)}
                />
              </div>
            </div>

            {/* Department name — outside the foliage, always readable */}
            <button
              type="button"
              data-node
              onPointerEnter={() => enter({ dept: i, arm: null, job: null })}
              onPointerLeave={leave}
              onClick={(e) => {
                e.stopPropagation();
                onDive(i);
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                left: label.x,
                top: label.y,
                opacity: anyHover
                  ? deptHover
                    ? 1
                    : 0.16
                  : focused
                    ? 0.35
                    : 1,
                pointerEvents: "auto",
                transition: "opacity 220ms ease",
                zIndex: deptHover ? 9 : 3,
                filter: dimmed ? "grayscale(1) brightness(0.45)" : "none",
              }}
            >
              <div
                className="whitespace-nowrap text-[17px] font-medium tracking-[0.22em] text-[var(--ivory)]"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  color: deptHover ? dept.color : undefined,
                  textShadow: "0 1px 12px rgba(0,0,0,0.65)",
                  transition: "color 180ms ease",
                }}
              >
                {dept.name.toUpperCase()}
              </div>
              <div
                className="mt-1 whitespace-nowrap text-[11px] tracking-[0.04em]"
                style={{
                  color: deptHover ? "var(--ivory-2)" : "var(--ink-2)",
                  textShadow: "0 1px 8px rgba(0,0,0,0.55)",
                }}
              >
                {dept.sub}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function MiniTree({
  color,
  deg,
  shape,
  activeArm,
  activeJob,
  deptLit,
  onArmEnter,
  onRootEnter,
  onDive,
}: {
  color: string;
  deg: number;
  shape: MiniShape;
  activeArm: number | null;
  activeJob: number | null;
  deptLit: boolean;
  onArmEnter: (arm: number, job: number | null) => void;
  onRootEnter: () => void;
  onDive: () => void;
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
        {shape.arms.map((arm, ai) => {
          const isArm = activeArm === ai;
          const dimArm = armFocus && !isArm;
          const stumpOp = dimArm
            ? 0.06
            : isArm
              ? 0.55
              : deptLit
                ? arm.stump.op
                : arm.stump.op * 0.45;

          return (
            <g key={ai}>
              <path
                d={`M ${arm.stump.x1.toFixed(1)} ${arm.stump.y1.toFixed(1)} L ${arm.stump.x2.toFixed(1)} ${arm.stump.y2.toFixed(1)}`}
                stroke={isArm ? color : lineBase}
                strokeOpacity={stumpOp}
                strokeWidth={isArm ? 2.6 : 2}
                fill="none"
                strokeLinecap="round"
              />
              {arm.jobSegs.map((b, bi) => {
                const isJob = isArm && activeJob === bi;
                const op = dimArm
                  ? 0.05
                  : isArm
                    ? isJob
                      ? 0.95
                      : 0.7
                    : deptLit
                      ? b.op
                      : b.op * 0.4;
                return (
                  <path
                    key={bi}
                    d={`M ${b.x1.toFixed(1)} ${b.y1.toFixed(1)} L ${b.x2.toFixed(1)} ${b.y2.toFixed(1)}`}
                    stroke={isArm ? color : lineBase}
                    strokeOpacity={op}
                    strokeWidth={isJob ? 2.8 : isArm ? 2.3 : 2}
                    fill="none"
                    strokeLinecap="round"
                  />
                );
              })}
              <circle
                cx={arm.fn.x}
                cy={arm.fn.y}
                r={isArm ? 5.5 : 4}
                fill={color}
                opacity={dimArm ? 0.2 : isArm ? 1 : deptLit ? 1 : 0.4}
              />
            </g>
          );
        })}
      </svg>

      {/* Broad arm hit targets */}
      {shape.arms.map((arm, ai) => {
        const tip = arm.jobs[arm.jobs.length - 1] ?? arm.fn;
        const len = Math.hypot(tip.x - arm.fn.x, tip.y - arm.fn.y);
        return (
          <button
            key={`hit-${ai}`}
            type="button"
            data-node
            className="absolute"
            style={{
              left: (arm.fn.x + tip.x) / 2,
              top: (arm.fn.y + tip.y) / 2,
              width: 52,
              height: Math.max(88, len + 36),
              marginLeft: -26,
              marginTop: -Math.max(44, len / 2 + 18),
              transform: `rotate(${(arm.aC * 180) / Math.PI}deg)`,
              borderRadius: 26,
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label={arm.fnName}
            onPointerEnter={() => onArmEnter(ai, null)}
            onClick={(e) => {
              e.stopPropagation();
              onDive();
            }}
          />
        );
      })}

      {/* Job dots — name tags only while that specific node is hovered */}
      {shape.arms.map((arm, ai) =>
        arm.jobs.map((job, ji) => {
          const isArm = activeArm === ai;
          const isJob = isArm && activeJob === ji;
          const dimArm = armFocus && !isArm;
          const assisted = job.level === "assisted";
          const manual = job.level === "manual";
          const showHoverLabel = isJob;

          return (
            <div
              key={`job-${ai}-${ji}`}
              className="absolute"
              style={{ left: job.x, top: job.y }}
            >
              <button
                type="button"
                data-node
                className="absolute rounded-full"
                style={{
                  left: 0,
                  top: 0,
                  width: isJob ? 20 : 15,
                  height: isJob ? 20 : 15,
                  marginLeft: isJob ? -10 : -7.5,
                  marginTop: isJob ? -10 : -7.5,
                  background: manual
                    ? "rgba(233,228,214,0.04)"
                    : assisted
                      ? "rgba(233,228,214,0.1)"
                      : "var(--ivory)",
                  border: manual
                    ? "1px solid rgba(233,228,214,0.16)"
                    : assisted
                      ? `1.5px solid ${isArm ? color : "rgba(233,228,214,0.65)"}`
                      : isJob
                        ? `2px solid ${color}`
                        : "none",
                  boxShadow: isJob
                    ? `0 0 14px color-mix(in srgb, ${color} 70%, transparent)`
                    : isArm && !assisted && !manual
                      ? `0 0 10px color-mix(in srgb, ${color} 45%, transparent)`
                      : !assisted && !manual && deptLit
                        ? "0 0 7px rgba(233,228,214,0.35)"
                        : "none",
                  opacity: dimArm ? 0.15 : 1,
                  transform: `scale(${isJob ? 1.15 : 1})`,
                  transition:
                    "width 160ms ease, height 160ms ease, box-shadow 160ms ease, opacity 160ms ease, transform 160ms ease",
                  cursor: "pointer",
                  zIndex: isJob ? 3 : 1,
                }}
                title={job.name}
                aria-label={job.name}
                onPointerEnter={() => onArmEnter(ai, ji)}
                onClick={(e) => {
                  e.stopPropagation();
                  onDive();
                }}
              />

              {showHoverLabel && (
                <div
                  className="pointer-events-none absolute whitespace-nowrap"
                  style={{
                    left: 0,
                    top: 0,
                    transform: `rotate(${-deg}deg) translate(16px, -50%)`,
                    transformOrigin: "0 50%",
                    zIndex: 5,
                  }}
                >
                  <div
                    className="rounded-md px-2.5 py-1.5 text-[12px] font-medium leading-tight text-[var(--ivory)]"
                    style={{
                      background: "rgba(12,14,18,0.9)",
                      border: `1px solid color-mix(in srgb, ${color} 55%, transparent)`,
                      boxShadow: "0 4px 18px rgba(0,0,0,0.55)",
                    }}
                  >
                    {job.name}
                  </div>
                </div>
              )}
            </div>
          );
        }),
      )}

      {/* Function mid-node hits */}
      {shape.arms.map((arm, ai) => (
        <button
          key={`fn-${ai}`}
          type="button"
          data-node
          className="absolute rounded-full"
          style={{
            left: arm.fn.x,
            top: arm.fn.y,
            width: 22,
            height: 22,
            marginLeft: -11,
            marginTop: -11,
            background: "transparent",
            cursor: "pointer",
          }}
          aria-label={arm.fnName}
          onPointerEnter={() => onArmEnter(ai, null)}
          onClick={(e) => {
            e.stopPropagation();
            onDive();
          }}
        />
      ))}

      {/* Root badge */}
      <button
        type="button"
        data-node
        className="absolute grid place-items-center rounded-full"
        style={{
          left: 0,
          top: 0,
          width: 64,
          height: 64,
          marginLeft: -32,
          marginTop: -32,
          background: "rgba(233,228,214,0.05)",
          border: `1.5px solid color-mix(in srgb, ${color} 65%, transparent)`,
          boxShadow: `0 0 0 6px color-mix(in srgb, ${color} 7%, transparent)`,
          cursor: "pointer",
        }}
        aria-label="Open department"
        onPointerEnter={onRootEnter}
        onClick={(e) => {
          e.stopPropagation();
          onDive();
        }}
      >
        <svg width={27} height={27} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12h14"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
          <circle cx={12} cy={12} r={8.5} stroke={color} strokeWidth={1.2} />
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
        fill: k % 4 === 0 ? "#E9E4D6" : TREE[k % N].color,
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
