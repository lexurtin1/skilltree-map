"use client";

/**
 * The parts a gallery dashboard is assembled from.
 *
 * There is deliberately no shared frame any more. Nine modules answering nine
 * different questions were being poured into one six-tile grid, and the result
 * was nine cards that looked identical from across the room — which is exactly
 * what a wall of exhibits must not be. What is shared now is the *vocabulary*:
 * the same figure, the same well, the same rail, the same rhythm of type. Each
 * module composes them into its own shape.
 *
 * Minimalism lives in the spacing and the type, not in the amount of
 * information: large figures, generous gutters, one accent colour per panel, and
 * a hairline only where a gap will not do.
 */
import { Sparkline } from "../viz/plots";
import type { ModulePalette } from "@/lib/gi/palette";
import type { Point } from "@/lib/gi/series";

export type Trend = "up" | "down" | "flat";

const TREND_COLOR: Record<Trend, string> = {
  up: "var(--state-progress)",
  down: "var(--state-risk)",
  flat: "var(--text-4)",
};
const TREND_GLYPH: Record<Trend, string> = { up: "↗", down: "↘", flat: "→" };

/* ── Figures ──────────────────────────────────────────────────────────────── */

export function Stat({
  label,
  value,
  note,
  delta,
  trend,
  spark,
  palette,
  size = "md",
}: {
  label: string;
  value: string;
  note?: string;
  delta?: string;
  trend?: Trend;
  spark?: Point[];
  palette: ModulePalette;
  size?: "sm" | "md" | "lg";
}) {
  const figure = size === "lg" ? "text-[34px]" : size === "md" ? "text-[25px]" : "text-[18px]";
  return (
    <div className="min-w-0">
      <div className="flex items-baseline gap-1.5">
        <span className="truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {label}
        </span>
        {delta && trend && (
          <span className="shrink-0 text-[9px] font-bold tabular-nums" style={{ color: TREND_COLOR[trend] }}>
            {TREND_GLYPH[trend]} {delta}
          </span>
        )}
      </div>
      <p className={`mt-1 ${figure} font-semibold leading-none tracking-[-0.025em] tabular-nums text-[var(--text-1)]`}>
        {value}
      </p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        {note && <span className="min-w-0 truncate text-[9.5px] leading-tight text-[var(--text-3)]">{note}</span>}
        {spark && spark.length > 1 && <Sparkline points={spark} palette={palette} width={52} height={15} />}
      </div>
    </div>
  );
}

/**
 * The liquid-glass figure card.
 *
 * A raised, rounded, refracting tile rather than a recessed well — used where
 * the numbers are the headline rather than the supporting cast.
 */
export function GlassStat({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note?: string;
  /** A status colour, when the figure is a state rather than a quantity. */
  tone?: string;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl px-3.5 py-3"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.62))",
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "0 10px 22px -12px rgba(0,31,90,0.28), inset 0 1px 0 0 rgba(255,255,255,1)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
        {label}
      </span>
      <p
        className="mt-1.5 text-[27px] font-semibold leading-none tracking-[-0.03em] tabular-nums"
        style={{ color: tone ?? "var(--text-1)" }}
      >
        {value}
      </p>
      {note && <p className="mt-1.5 truncate text-[9.5px] leading-tight text-[var(--text-3)]">{note}</p>}
    </div>
  );
}

/* ── Containers ───────────────────────────────────────────────────────────── */

/** A recessed well holding a visualisation. */
export function Plot({
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
    <div className={`gi-plot relative flex min-h-0 flex-col overflow-hidden rounded-xl px-3 pb-2.5 pt-2.5 ${className}`}>
      <div className="flex shrink-0 items-baseline gap-2">
        <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">{title}</p>
        {subtitle && <p className="truncate text-[9px] leading-none text-[var(--text-4)]">{subtitle}</p>}
      </div>
      <div className="mt-1.5 min-h-0 flex-1">{children}</div>
    </div>
  );
}

/** A named list down the side of a panel. Three or four rows, never more. */
export function Rail({
  title,
  items,
  palette,
}: {
  title: string;
  items: Array<{ id: string; lead: string; rest: string; mark?: string }>;
  palette: ModulePalette;
}) {
  return (
    <div className="gi-tile flex min-h-0 flex-col rounded-xl px-3 py-2.5">
      <p className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">{title}</p>
      <ul className="mt-2 flex min-h-0 flex-1 flex-col justify-between gap-2">
        {items.map((item) => (
          <li key={item.id} className="flex min-w-0 gap-2">
            <span
              className="mt-[5px] h-[6px] w-[6px] shrink-0 rounded-full"
              style={{ background: item.mark ?? palette.base }}
            />
            <p className="min-w-0 text-[9.5px] leading-[1.45] text-[var(--text-3)]">
              <span className="font-semibold text-[var(--text-1)]">{item.lead}</span> {item.rest}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Identity for anything encoded as more than one fill, per the accessibility pass. */
export function Legend({ items }: { items: Array<{ label: string; tone: string; hollow?: boolean }> }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1" aria-hidden>
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={
              item.hollow
                ? { border: `1.5px solid ${item.tone}`, background: "#fff" }
                : { background: item.tone }
            }
          />
          <span className="text-[8.5px] font-medium text-[var(--text-3)]">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

/* ── The panel's own head and foot ────────────────────────────────────────── */

/**
 * The line at the top of a dashboard that says what question it is answering.
 * The module's *name* is set large in the band along the bottom of the card, so
 * this is free to be the question rather than the label.
 */
export function Head({
  question,
  range,
  palette,
  children,
}: {
  question: string;
  range?: string;
  palette: ModulePalette;
  /** Optional figures pinned to the right of the head. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <span
        className="h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ background: palette.base, boxShadow: `0 0 0 3px ${palette.soft}` }}
      />
      <p className="min-w-0 flex-1 truncate text-[12.5px] font-semibold tracking-[-0.012em] text-[var(--text-1)]">
        {question}
      </p>
      {children}
      {range && (
        <span className="shrink-0 rounded-md border border-[rgba(0,31,90,0.1)] px-1.5 py-[2px] text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-4)]">
          {range}
        </span>
      )}
    </div>
  );
}

/** The one sentence under a panel that says why any of it matters. */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="shrink-0 truncate text-[10px] leading-none text-[var(--text-3)]">{children}</p>
  );
}
