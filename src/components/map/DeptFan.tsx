"use client";

import { useMemo } from "react";
import type { Department, Job } from "@/lib/tree";

const FAN_SPAN = (182 * Math.PI) / 180;
const R0 = 248;
const R_BASE = 410;
const R_STEP = 214;

export type FanNode = {
  id: string;
  kind: "root" | "function" | "job";
  name: string;
  x: number;
  y: number;
  fnName?: string;
  job?: Job;
  delay: number;
};

type DeptFanProps = {
  dept: Department;
  selectedJob: string | null;
  onSelectJob: (job: Job, fnName: string, x: number, y: number) => void;
  onSelectRoot: () => void;
};

function P(r: number, a: number): [number, number] {
  return [r * Math.sin(a), -r * Math.cos(a)];
}

export function DeptFan({
  dept,
  selectedJob,
  onSelectJob,
  onSelectRoot,
}: DeptFanProps) {
  const layout = useMemo(() => {
    const totalJobs = dept.functions.reduce((s, f) => s + f.jobs.length, 0);
    const paths: { d: string; opacity: number; delay: number }[] = [];
    const nodes: FanNode[] = [];
    const junctions: { x: number; y: number; delay: number }[] = [];

    const arc = (r: number, a0: number, a1: number) => {
      const [x0, y0] = P(r, a0);
      const [x1, y1] = P(r, a1);
      return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };

    [R0, R_BASE + R_STEP * 0.5, R_BASE + R_STEP * 2, R_BASE + R_STEP * 3.2].forEach(
      (r, i) => {
        paths.push({
          d: arc(r, -FAN_SPAN / 2 - 0.06, FAN_SPAN / 2 + 0.06),
          opacity: 0.06,
          delay: 0.1 + i * 0.07,
        });
      },
    );

    nodes.push({
      id: "root",
      kind: "root",
      name: dept.name,
      x: 0,
      y: 40,
      delay: 0.05,
    });

    let cursor = -FAN_SPAN / 2;
    dept.functions.forEach((fn, fi) => {
      const span = (FAN_SPAN * fn.jobs.length) / Math.max(1, totalJobs);
      const aC = cursor + span / 2;
      const [ex, ey] = P(R0, aC);
      const [rx, ry] = P(64, aC);
      paths.push({
        d: `M ${rx.toFixed(1)} ${ry.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        opacity: 0.22,
        delay: 0.15,
      });
      junctions.push({ x: ex, y: ey, delay: 0.3 });
      nodes.push({
        id: `fn-${fi}`,
        kind: "function",
        name: fn.name,
        x: ex,
        y: ey,
        fnName: fn.name,
        delay: 0.28 + fi * 0.04,
      });

      let px = ex;
      let py = ey;
      fn.jobs.forEach((job, ji) => {
        const zig =
          (ji % 2 ? 1 : -1) *
          Math.min(span * 0.22, 0.075) *
          (ji ? 1 : 0.45);
        const a = aC + zig;
        const r = R_BASE + ji * R_STEP;
        const [x, y] = P(r, a);
        const lit =
          job.level === "autonomous" ? 0.5 : job.level === "assisted" ? 0.3 : 0.14;
        const delay = 0.32 + ji * 0.1 + fi * 0.05;
        paths.push({
          d: `M ${px.toFixed(1)} ${py.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`,
          opacity: lit,
          delay,
        });
        if (ji > 0) {
          junctions.push({
            x: (px + x) / 2,
            y: (py + y) / 2,
            delay: delay + 0.05,
          });
        }
        nodes.push({
          id: `job-${fi}-${ji}`,
          kind: "job",
          name: job.name,
          x,
          y,
          fnName: fn.name,
          job,
          delay: delay + 0.12,
        });
        px = x;
        py = y;
      });
      cursor += span;
    });

    return { paths, nodes, junctions };
  }, [dept]);

  return (
    <div className="relative" style={{ width: 0, height: 0 }}>
      {/* Ghost watermark */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-180px] -translate-x-1/2 select-none whitespace-nowrap text-[140px] leading-none tracking-[0.12em] text-[rgba(233,228,214,0.035)]"
        style={{ fontFamily: "var(--font-serif), serif" }}
      >
        {dept.name.toUpperCase()}
      </div>

      <svg
        width={2400}
        height={1600}
        viewBox="-1200 -1400 2400 1600"
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -1200, top: -1400 }}
      >
        {layout.paths.map((p, i) => (
          <path
            key={i}
            className="path-draw"
            style={{ ["--d" as string]: `${p.delay}s` }}
            pathLength={1}
            d={p.d}
            fill="none"
            stroke="rgb(var(--lnrgb))"
            strokeOpacity={p.opacity}
            strokeWidth={p.opacity > 0.1 ? 2.2 : 1}
            strokeLinecap="round"
          />
        ))}
        {layout.junctions.map((j, i) => (
          <circle
            key={i}
            className="popdot"
            style={{ ["--d" as string]: `${j.delay}s` }}
            cx={j.x}
            cy={j.y}
            r={3.2}
            fill={dept.color}
          />
        ))}
      </svg>

      {layout.nodes.map((n) => {
        if (n.kind === "function") {
          return (
            <div
              key={n.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: n.x, top: n.y }}
            >
              <div
                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--ivory-2)]"
                style={{
                  transform: "translateY(-18px) scale(0.95)",
                  transformOrigin: "50% 100%",
                }}
              >
                {n.name}
              </div>
            </div>
          );
        }

        const selected = n.kind === "job" && selectedJob === n.name;
        const size = n.kind === "root" ? 52 : 38;

        return (
          <button
            key={n.id}
            type="button"
            data-node
            className={`node-pop absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition ${
              selected ? "z-10 scale-110" : "hover:scale-110"
            }`}
            style={{
              left: n.x,
              top: n.y,
              width: size,
              height: size,
              ["--d" as string]: `${n.delay}s`,
              background: "#E9E4D6",
              borderColor: selected ? dept.color : "rgba(14,17,24,0.55)",
              borderWidth: selected ? 2 : 1,
              boxShadow: selected
                ? `0 0 0 6px ${dept.color}33, 0 0 0 12px ${dept.color}14`
                : "0 2px 10px rgba(0,0,0,0.35)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (n.kind === "root") onSelectRoot();
              else if (n.job && n.fnName)
                onSelectJob(n.job, n.fnName, n.x, n.y);
            }}
          >
            <NodeIcon kind={n.kind} name={n.name} />
            {(n.kind === "job" || n.kind === "root") && (
              <span
                className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[12px] font-medium ${
                  selected ? "text-[var(--ivory)]" : "text-[var(--ivory-2)]"
                }`}
                style={{
                  transform: `translateX(-50%) scale(${selected ? 1.05 : 0.92})`,
                  transformOrigin: "50% 0",
                }}
              >
                {n.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function NodeIcon({ kind, name }: { kind: string; name: string }) {
  const stroke = "#181a24";
  if (kind === "root") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2">
        <path d="M3 17l5-8 4 5 3-4 6 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Simple deterministic icon by name hash
  const h = name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 6;
  const paths = [
    <path key="a" d="M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z" />,
    <path key="b" d="M4 7h16M4 12h16M4 17h10" />,
    <path key="c" d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5" />,
    <path key="d" d="M4 4h16v16H4zM4 10h16M10 4v16" />,
    <path key="e" d="M12 20V10M8 14l4-4 4 4M5 20h14" />,
    <path key="f" d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />,
  ];
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths[h]}
    </svg>
  );
}
