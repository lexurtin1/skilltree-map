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
import Link from "next/link";
import { Sparkline } from "../viz/plots";
import { ArrowRightIcon } from "../../ui/Icons";
import type { ModulePalette } from "@/lib/gi/palette";
import type { Point } from "@/lib/gi/series";
import { SERVICE_BY_ID } from "@/lib/gi/taxonomy";

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
  const figure = size === "lg" ? "text-[46px]" : size === "md" ? "text-[35px]" : "text-[25px]";
  return (
    <div className="min-w-0">
      <div className="flex items-baseline gap-1.5">
        <span className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {label}
        </span>
        {delta && trend && (
          <span className="shrink-0 text-[10px] font-bold tabular-nums" style={{ color: TREND_COLOR[trend] }}>
            {TREND_GLYPH[trend]} {delta}
          </span>
        )}
      </div>
      <p className={`mt-1 ${figure} font-semibold leading-none tracking-[-0.025em] tabular-nums text-[var(--text-1)]`}>
        {value}
      </p>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        {note && <span className="min-w-0 truncate text-[11px] leading-tight text-[var(--text-3)]">{note}</span>}
        {spark && spark.length > 1 && <Sparkline points={spark} palette={palette} width={62} height={18} />}
      </div>
    </div>
  );
}

/**
 * The liquid-glass figure card.
 *
 * A raised, rounded, refracting tile rather than a recessed well — used where
 * the numbers are the headline rather than the supporting cast. Given an
 * `href` it becomes the thing you press to go and look at what the number is
 * made of, which is the whole reason a figure is worth putting on a screen.
 */
export function GlassStat({
  label,
  value,
  note,
  tone,
  href,
  delta,
  trend,
  spark,
  palette,
}: {
  label: string;
  value: string;
  note?: string;
  /** A status colour, when the figure is a state rather than a quantity. */
  tone?: string;
  /** Where this figure came from. Omit for a figure with nothing behind it. */
  href?: string;
  /** Period-on-period movement. Only ever passed where one actually exists. */
  delta?: string;
  trend?: Trend;
  spark?: Point[];
  palette?: ModulePalette;
}) {
  const inner = (
    <>
      <span className="flex items-baseline gap-1.5">
        <span className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
          {label}
        </span>
        {delta && trend && (
          <span className="shrink-0 text-[10px] font-bold tabular-nums" style={{ color: TREND_COLOR[trend] }}>
            {TREND_GLYPH[trend]} {delta}
          </span>
        )}
        {href && (
          <span className="gi-story-go shrink-0 text-[var(--text-3)]" aria-hidden>
            <ArrowRightIcon size={12} />
          </span>
        )}
      </span>
      <p
        className="mt-2 text-[33px] font-semibold leading-none tracking-[-0.03em] tabular-nums"
        style={{ color: tone ?? "var(--text-1)" }}
      >
        {value}
      </p>
      <span className="mt-2 flex items-end justify-between gap-2">
        {note && <span className="min-w-0 truncate text-[11px] leading-tight text-[var(--text-3)]">{note}</span>}
        {spark && palette && spark.length > 1 && (
          <Sparkline points={spark} palette={palette} width={58} height={16} />
        )}
      </span>
    </>
  );

  const shell = "gi-glassstat block min-w-0 rounded-2xl px-4 py-3.5";
  return href ? (
    <Link href={href} className={shell + " gi-story"}>
      {inner}
    </Link>
  ) : (
    <div className={shell}>{inner}</div>
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
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">{title}</p>
        {subtitle && <p className="truncate text-[10px] leading-none text-[var(--text-4)]">{subtitle}</p>}
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
  items: Array<{ id: string; lead: string; rest: string; mark?: string; href?: string }>;
  palette: ModulePalette;
}) {
  return (
    <div className="gi-tile flex min-h-0 flex-col rounded-xl px-2.5 py-2.5">
      <p className="shrink-0 px-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">{title}</p>
      <ul className="mt-2 flex min-h-0 flex-1 flex-col justify-between gap-1">
        {items.map((item) => {
          const body = (
            <>
              <span
                className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full"
                style={{ background: item.mark ?? palette.base }}
              />
              <span className="min-w-0 flex-1 text-[11px] leading-[1.4] text-[var(--text-3)]">
                <span className="font-semibold text-[var(--text-1)]">{item.lead}</span> {item.rest}
              </span>
              {item.href && (
                <span className="gi-story-go mt-[3px] shrink-0" style={{ color: palette.ink }} aria-hidden>
                  <ArrowRightIcon size={12} />
                </span>
              )}
            </>
          );
          return (
            <li key={item.id} className="min-w-0">
              {item.href ? (
                <Link href={item.href} className="gi-story flex min-w-0 gap-2 px-1 py-1">
                  {body}
                </Link>
              ) : (
                <span className="flex min-w-0 gap-2 px-1 py-1">{body}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * A line of real data that goes somewhere.
 *
 * The unit the filled-out screens are built from. A figure tells a seller where
 * to look; only a sentence tells them what to say, and only a destination lets
 * them act on it — so a story row carries all three: a name, the fact under it,
 * and the object it opens.
 */
export function Story({
  href,
  lead,
  rest,
  value,
  mark,
  palette,
  pulse,
}: {
  href: string;
  lead: string;
  rest: string;
  /** Pinned right, tabular. A value, a count, a date. */
  value?: string;
  /** Overrides the module hue — used where the mark carries a state. */
  mark?: string;
  palette: ModulePalette;
  /** An opportunity has been spotted on this row. */
  pulse?: boolean;
}) {
  return (
    <Link href={href} className="gi-story flex min-w-0 items-baseline gap-2 px-1.5 py-[5px]">
      <span
        className={`mt-[1px] h-[7px] w-[7px] shrink-0 self-start rounded-full ${pulse ? "gi-legend-pulse" : ""}`}
        style={
          pulse
            ? ({ "--opp": mark ?? palette.base } as React.CSSProperties)
            : { background: mark ?? palette.base }
        }
        aria-hidden
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11.5px] font-semibold leading-tight text-[var(--text-1)]">{lead}</span>
        <span className="mt-[2px] block truncate text-[10.5px] leading-tight text-[var(--text-3)]">{rest}</span>
      </span>
      {value && (
        <span className="shrink-0 text-[11px] font-semibold tabular-nums text-[var(--text-2)]">{value}</span>
      )}
      <span className="gi-story-go shrink-0 self-center" style={{ color: palette.ink }} aria-hidden>
        <ArrowRightIcon size={12} />
      </span>
    </Link>
  );
}

/** A named block of story rows. The rail's louder sibling. */
export function StoryList({
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
    <div className={`gi-tile flex min-h-0 flex-col overflow-hidden rounded-xl px-2 pb-1.5 pt-2.5 ${className}`}>
      <div className="flex shrink-0 items-baseline gap-2 px-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">{title}</p>
        {subtitle && <p className="truncate text-[10px] leading-none text-[var(--text-4)]">{subtitle}</p>}
      </div>
      <div className="mt-1 flex min-h-0 flex-1 flex-col justify-between">{children}</div>
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
            className="h-[8px] w-[8px] rounded-full"
            style={
              item.hollow
                ? { border: `1.5px solid ${item.tone}`, background: "#fff" }
                : { background: item.tone }
            }
          />
          <span className="text-[10px] font-medium text-[var(--text-3)]">{item.label}</span>
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
        className="h-[9px] w-[9px] shrink-0 rounded-full"
        style={{ background: palette.base, boxShadow: `0 0 0 4px ${palette.soft}` }}
      />
      <p className="min-w-0 flex-1 truncate text-[15.5px] font-semibold tracking-[-0.014em] text-[var(--text-1)]">
        {question}
      </p>
      {children}
      {range && (
        <span className="shrink-0 rounded-full border border-[rgba(0,31,90,0.12)] bg-white/60 px-2.5 py-[3px] text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">
          {range}
        </span>
      )}
    </div>
  );
}

/** The one sentence under a panel that says why any of it matters. */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="shrink-0 truncate text-[11px] leading-none text-[var(--text-3)]">{children}</p>
  );
}

/** Named Broadridge products present in this view — MVP product-range strip. */
export function ProductStrip({
  serviceIds,
  label = "Products in this view",
}: {
  serviceIds: string[];
  label?: string;
}) {
  const seen = new Set<string>();
  const products = serviceIds
    .map((id) => SERVICE_BY_ID[id])
    .filter((s): s is NonNullable<typeof s> => {
      if (!s || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });

  if (!products.length) return null;

  return (
    <div className="gi-product-strip flex shrink-0 flex-wrap items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-4)]">
        {label}
      </span>
      {products.map((s) => (
        <Link
          key={s.id}
          href={`/growth?service=${s.id}`}
          className="rounded-full border border-[rgba(0,31,90,0.12)] bg-white/75 px-2.5 py-[3px] text-[11px] font-semibold text-[var(--brand)] transition-colors hover:border-[var(--brand-soft)] hover:bg-white"
          title={s.name}
        >
          {s.short}
        </Link>
      ))}
    </div>
  );
}
