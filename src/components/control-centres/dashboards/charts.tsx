"use client";

/**
 * Chart primitives for the gallery dashboards.
 *
 * Three forms, each doing one job: a sparkline for change inside a KPI tile, an
 * area chart for one series over time, a ranked bar list for magnitude with
 * identity. Every chart carries a single series in a single module hue, so none
 * of them needs a legend — the title names the series.
 *
 * Mark specs follow the data-viz rules: thin strokes, 4px rounded data-ends
 * anchored to the baseline, a 2px surface gap between bars, recessive axes, and
 * selective direct labels rather than a number on every point. Text always wears
 * a text token; the coloured mark beside it carries identity.
 *
 * Deliberate deviation: these carry no hover layer. They live inside a card that
 * is itself a single link, and a tooltip inside a click target would fight the
 * gesture. Interactive charts with crosshairs belong on the module pages, where
 * the chart is the subject rather than a preview of one.
 */
import type { BarRow, Point } from "@/lib/gi/series";
import type { ModulePalette } from "@/lib/gi/palette";

/* ── Sparkline ────────────────────────────────────────────────────────────── */

export function Sparkline({
  points,
  palette,
  width = 62,
  height = 18,
}: {
  points: Point[];
  palette: ModulePalette;
  width?: number;
  height?: number;
}) {
  if (points.length < 2) return <span style={{ display: "block", width, height }} />;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;

  const x = (i: number) => (i / (points.length - 1)) * (width - pad * 2) + pad;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={d} fill="none" stroke={palette.bright} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* The latest point is the one that matters, so it is the only marker. */}
      <circle cx={x(points.length - 1)} cy={y(values[values.length - 1])} r={2} fill={palette.bright} />
    </svg>
  );
}

/* ── Area chart ───────────────────────────────────────────────────────────── */

export function AreaChart({
  points,
  palette,
  id,
  height = 96,
}: {
  points: Point[];
  palette: ModulePalette;
  /** Unique per card — gradients are referenced by id. */
  id: string;
  height?: number;
}) {
  const W = 320;
  const padX = 4;
  const padTop = 10;
  const padBottom = 18;

  const values = points.map((p) => p.value);
  const max = Math.max(...values, 1);
  const plotH = height - padTop - padBottom;

  const x = (i: number) => (i / Math.max(points.length - 1, 1)) * (W - padX * 2) + padX;
  const y = (v: number) => padTop + plotH - (v / max) * plotH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${padTop + plotH} L${x(0).toFixed(1)},${padTop + plotH} Z`;

  /* Peak is direct-labelled; everything else is read off the shape. */
  const peakIndex = values.indexOf(Math.max(...values));

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block" }}
      aria-hidden
    >
      <defs>
        <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.base} stopOpacity="0.55" />
          <stop offset="100%" stopColor={palette.deep} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Recessive baseline. No grid — six points do not need one. */}
      <line
        x1={padX}
        y1={padTop + plotH}
        x2={W - padX}
        y2={padTop + plotH}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      <path d={area} fill={`url(#area-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={palette.bright}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={x(peakIndex)} cy={y(values[peakIndex])} r="3" fill={palette.bright} />
    </svg>
  );
}

/** Axis labels live outside the SVG so they never scale with `preserveAspectRatio`. */
export function AreaAxis({ points }: { points: Point[] }) {
  return (
    <div className="mt-1 flex justify-between px-[3px]" aria-hidden>
      {points.map((p, i) => (
        <span key={`${p.label}-${i}`} className="text-[8px] tracking-wide text-[var(--text-4)]">
          {p.label}
        </span>
      ))}
    </div>
  );
}

/* ── Ranked bar list ──────────────────────────────────────────────────────── */

export function BarList({
  rows,
  palette,
  max: providedMax,
}: {
  rows: BarRow[];
  palette: ModulePalette;
  max?: number;
}) {
  const max = providedMax ?? Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="flex flex-col gap-[7px]" aria-hidden>
      {rows.map((row, i) => (
        <div key={`${row.label}-${i}`} className="grid grid-cols-[76px_1fr_auto] items-center gap-2">
          <span className="truncate text-[9px] leading-none text-[var(--text-3)]">{row.label}</span>
          <span className="relative block h-[7px] overflow-hidden rounded-full bg-white/[0.055]">
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.max((row.value / max) * 100, row.value > 0 ? 3 : 0)}%`,
                background: palette.base,
              }}
            />
          </span>
          <span className="text-[9px] font-semibold leading-none tabular-nums text-[var(--text-2)]">
            {row.display}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Segmented meter — for a 0–1 composite like deal health ───────────────── */

export function Segments({
  values,
  palette,
}: {
  values: number[];
  palette: ModulePalette;
}) {
  return (
    <span className="flex gap-[2px]" aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          className="h-[5px] flex-1 rounded-full"
          style={{
            background: palette.base,
            opacity: 0.22 + Math.max(0, Math.min(1, v)) * 0.78,
          }}
        />
      ))}
    </span>
  );
}
