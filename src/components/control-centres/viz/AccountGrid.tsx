"use client";

/**
 * The account grid.
 *
 * The one visualisation in the product that is built out of real DOM rather
 * than SVG, and for a reason: every cell here is a destination. An SVG rect can
 * be given an anchor, but it cannot be given a focus ring that follows its
 * corner radius, a hover lift, a pulse that respects reduced motion, or a
 * tooltip a keyboard can reach. Fifty accounts you can click is worth more than
 * fifty accounts drawn slightly more cheaply.
 *
 * Three channels, kept separate so they can be read at once:
 *
 *   size    footprint — how many markets this group's funds actually touch
 *   colour  health — one continuous red-to-green ramp (`spectrum.ts`)
 *   light   opportunity — a slow pulse on the rim
 *
 * Colour and light are independent on purpose. An account can be in trouble
 * *and* carry an opportunity, and that combination is the most interesting cell
 * on the grid — it would be destroyed by folding both facts into one hue.
 */
import Link from "next/link";
import { squarifyLayout } from "@/lib/gi/squarify";
import { HEALTH_LEGEND, healthColor } from "@/lib/gi/spectrum";
import type { AccountCell } from "@/lib/gi/portfolio-view";

export function AccountGrid({
  cells,
  width = 1000,
  height = 330,
}: {
  cells: AccountCell[];
  width?: number;
  height?: number;
}) {
  const laid = squarifyLayout(cells, 0, 0, width, height);

  return (
    <div className="relative" style={{ width, height }}>
        {laid.map((cell) => {
          const w = Math.max(cell.w - 3, 0);
          const h = Math.max(cell.h - 3, 0);
          const roomy = w > 74 && h > 34;
          const spacious = w > 118 && h > 62;
          const ink = healthColor(cell.health, 1);

          return (
            <Link
              key={cell.id}
              href={cell.href}
              aria-label={`${cell.label}: ${cell.healthWord}${cell.opportunity ? ". Opportunity spotted" : ""}`}
              title={`${cell.label} — ${cell.healthWord}. ${cell.markets} markets, ${cell.funds} fund ranges, ${cell.shareClasses} share classes.${
                cell.opportunity ? ` Opportunity: ${cell.opportunityNote}` : ""
              }`}
              className={`gi-cell group absolute overflow-hidden rounded-[9px] ${
                cell.opportunity ? "gi-cell-opp" : ""
              }`}
              style={
                {
                  left: cell.x + 1.5,
                  top: cell.y + 1.5,
                  width: w,
                  height: h,
                  /* The fill is the ramp at low alpha over white, so a mark of
                     the same hue still reads at full strength on top of it. */
                  background: `linear-gradient(152deg, ${healthColor(cell.health, 0.42)}, ${healthColor(
                    cell.health,
                    0.2,
                  )} 58%, ${healthColor(cell.health, 0.3)})`,
                  borderColor: healthColor(cell.health, 0.62),
                  "--opp": healthColor(cell.health, 0.85),
                } as React.CSSProperties
              }
            >
              {roomy ? (
                <span className="flex h-full flex-col justify-between px-2 py-[6px]">
                  <span className="flex min-w-0 items-start gap-1.5">
                    <span
                      className="mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full"
                      style={{ background: ink }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[10.5px] font-semibold leading-tight text-[var(--text-1)]">
                        {cell.label}
                      </span>
                      {spacious && (
                        <span className="mt-[1px] block truncate text-[8.5px] leading-tight text-[var(--text-3)]">
                          {cell.aum} · {cell.markets} markets
                        </span>
                      )}
                    </span>
                    {cell.opportunity && (
                      <span
                        className="mt-[2px] shrink-0 text-[9px] font-bold leading-none"
                        style={{ color: ink }}
                        aria-hidden
                      >
                        ✦
                      </span>
                    )}
                  </span>

                  {spacious && (
                    <span className="min-w-0">
                      <span className="block truncate text-[8.5px] font-medium leading-tight" style={{ color: ink }}>
                        {cell.healthWord}
                        {cell.shareClasses > 0 && (
                          <span className="text-[var(--text-4)]"> · {cell.shareClasses} share classes</span>
                        )}
                      </span>
                      {h > 84 && cell.opportunityNote && (
                        <span className="mt-[2px] block truncate text-[8.5px] leading-tight text-[var(--text-3)]">
                          {cell.opportunityNote}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              ) : (
                /* Too small for a name. It still has to say which of the three
                   channels it is carrying, so it keeps the health dot. */
                <span className="flex h-full items-center justify-center">
                  <span
                    className="h-[5px] w-[5px] rounded-full"
                    style={{ background: ink }}
                    aria-hidden
                  />
                </span>
              )}
            </Link>
          );
        })}
    </div>
  );
}

/**
 * The key.
 *
 * A continuous ramp needs its ends named or it is decoration, and the pulse
 * needs saying out loud because a moving rim is not self-explanatory.
 */
export function HealthLegend({ opportunities }: { opportunities: number }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <span className="inline-flex items-center gap-1.5">
        <span className="flex overflow-hidden rounded-full" aria-hidden>
          {HEALTH_LEGEND.map((stop) => (
            <span
              key={stop.label}
              className="h-[7px] w-[16px]"
              style={{ background: healthColor(stop.at, 1) }}
              title={stop.label}
            />
          ))}
        </span>
        <span className="text-[8.5px] font-medium text-[var(--text-3)]">
          Problem → healthy
        </span>
      </span>

      <span className="inline-flex items-center gap-1.5">
        <span className="gi-legend-pulse h-[8px] w-[8px] rounded-full" aria-hidden />
        <span className="text-[8.5px] font-medium text-[var(--text-3)]">
          Opportunity spotted · {opportunities}
        </span>
      </span>
    </div>
  );
}
