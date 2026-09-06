"use client";

/**
 * The shared dashboard frame.
 *
 * Every module fills the same shape — six KPI tiles, a three-item signals row,
 * a chart beside a ranked list — so the ring reads as nine views of one system
 * rather than nine unrelated screens. Only the content and the hue change.
 *
 * Minimalism here lives in the spacing and the type, not in the amount of
 * information: large figures, generous gutters, one accent colour, and a hairline
 * only where a gap will not do.
 */
import { Sparkline } from "./charts";
import type { ModulePalette } from "@/lib/gi/palette";
import type { Point } from "@/lib/gi/series";

export type Trend = "up" | "down" | "flat";

export interface Kpi {
  label: string;
  value: string;
  /** Signed movement, e.g. "+18%". Optional — not every figure has a delta. */
  delta?: string;
  trend?: Trend;
  /** One short clause on what the figure means. */
  note?: string;
  spark?: Point[];
}

export interface Signal {
  tone: "risk" | "progress" | "info";
  /** The lead clause, emphasised. */
  lead: string;
  /** The rest of the sentence. */
  rest: string;
}

const TREND_COLOR: Record<Trend, string> = {
  up: "var(--state-progress)",
  down: "var(--state-risk)",
  flat: "var(--text-4)",
};

const TREND_GLYPH: Record<Trend, string> = { up: "↗", down: "↘", flat: "→" };

/* ── KPI tile ─────────────────────────────────────────────────────────────── */

export function KpiTile({ kpi, palette }: { kpi: Kpi; palette: ModulePalette }) {
  return (
    <div className="gi-tile min-w-0 rounded-xl px-3 py-2.5">
      <div className="flex items-baseline gap-1.5">
        <span className="truncate text-[8.5px] font-medium uppercase tracking-[0.09em] text-[var(--text-4)]">
          {kpi.label}
        </span>
        {kpi.delta && kpi.trend && (
          <span
            className="ml-auto shrink-0 text-[8.5px] font-semibold tabular-nums"
            style={{ color: TREND_COLOR[kpi.trend] }}
          >
            {TREND_GLYPH[kpi.trend]} {kpi.delta}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-[19px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[var(--text-1)]">
        {kpi.value}
      </p>

      <div className="mt-1.5 flex items-end justify-between gap-2">
        <span className="min-w-0 truncate text-[8.5px] leading-tight text-[var(--text-3)]">
          {kpi.note ?? ""}
        </span>
        {kpi.spark && kpi.spark.length > 1 && (
          <Sparkline points={kpi.spark} palette={palette} width={54} height={16} />
        )}
      </div>
    </div>
  );
}

/* ── Signals ──────────────────────────────────────────────────────────────── */

const SIGNAL_MARK: Record<Signal["tone"], { glyph: string; color: string }> = {
  risk: { glyph: "▲", color: "var(--state-risk)" },
  progress: { glyph: "✓", color: "var(--state-progress)" },
  info: { glyph: "●", color: "var(--state-new)" },
};

export function SignalRow({ signals }: { signals: Signal[] }) {
  return (
    <div className="gi-tile rounded-xl px-3 py-2.5">
      <p className="mb-2 text-[8.5px] font-medium uppercase tracking-[0.09em] text-[var(--text-4)]">
        Signals
      </p>
      <div className="grid grid-cols-3 gap-x-4">
        {signals.slice(0, 3).map((s, i) => {
          const mark = SIGNAL_MARK[s.tone];
          return (
            <div key={i} className="flex min-w-0 gap-1.5">
              <span className="mt-[2px] shrink-0 text-[7px] leading-none" style={{ color: mark.color }}>
                {mark.glyph}
              </span>
              <p className="min-w-0 text-[9px] leading-[1.45] text-[var(--text-3)]">
                <span className="font-semibold text-[var(--text-1)]">{s.lead}</span> {s.rest}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Panel ────────────────────────────────────────────────────────────────── */

export function DashPanel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`gi-tile flex min-h-0 flex-col rounded-xl px-3 py-2.5 ${className}`}>
      <p className="text-[8.5px] font-medium uppercase tracking-[0.09em] text-[var(--text-4)]">
        {title}
      </p>
      {subtitle && (
        <p className="mt-[3px] truncate text-[8.5px] leading-tight text-[var(--text-4)]">{subtitle}</p>
      )}
      <div className="mt-2 min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* ── The frame ────────────────────────────────────────────────────────────── */

export function DashboardFrame({
  eyebrow,
  range,
  kpis,
  signals,
  palette,
  children,
}: {
  /** The dashboard's own title, inside the glass — not the card's title band. */
  eyebrow: string;
  /** The period selector. Static: this is a preview, not a control. */
  range?: string;
  kpis: Kpi[];
  signals: Signal[];
  palette: ModulePalette;
  /** The chart row — an AreaChart panel beside a BarList panel. */
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="h-[7px] w-[7px] shrink-0 rounded-full"
          style={{ background: palette.bright, boxShadow: `0 0 10px ${palette.glow}` }}
        />
        <p className="truncate text-[11.5px] font-semibold tracking-[-0.01em] text-[var(--text-1)]">
          {eyebrow}
        </p>
        {range && (
          <span className="ml-auto shrink-0 rounded-md border border-white/[0.08] px-1.5 py-[2px] text-[8px] font-medium uppercase tracking-[0.08em] text-[var(--text-4)]">
            {range}
          </span>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-6 gap-1.5">
        {kpis.slice(0, 6).map((kpi) => (
          <KpiTile key={kpi.label} kpi={kpi} palette={palette} />
        ))}
      </div>

      <div className="shrink-0">
        <SignalRow signals={signals} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[1.35fr_1fr] gap-1.5">{children}</div>
    </div>
  );
}
