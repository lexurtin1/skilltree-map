"use client";

import Link from "next/link";
import { PREVIEWS } from "./previews";
import { StatusMarker, markerRingStyle } from "../ui/StateChips";
import { ArrowRightIcon } from "../ui/Icons";
import type { ModuleDef } from "../modules";
import { SUMMARY_BY_MODULE } from "@/lib/gi/metrics";
import { STATE_MARKERS } from "@/lib/gi/taxonomy";

/**
 * One Control Centre card.
 *
 * The whole card is one link, so a mouse click anywhere lands and a keyboard
 * user gets a single focusable target with a full description. The miniature
 * fills the upper two thirds; the name only appears large at the bottom, in a
 * title band, so the working preview is what you read first and the label is
 * what you read to confirm.
 *
 * Inactive cards are inert — hidden from assistive technology and from the tab
 * order — because reaching them is the carousel's job, not the card's.
 */
export function ControlCentreCard({
  module: mod,
  active,
}: {
  module: ModuleDef;
  active: boolean;
}) {
  const summary = SUMMARY_BY_MODULE[mod.id]();
  const Preview = PREVIEWS[mod.id];
  const { Icon } = mod;
  const marker = STATE_MARKERS[summary.marker];

  const body = (
    <>
      {/* The miniature. Inert by design — the card is the control. */}
      <div className="min-h-0 flex-1 px-3.5 pt-3.5" aria-hidden style={{ pointerEvents: "none" }}>
        <div className="h-full overflow-hidden rounded-lg bg-[var(--surface-2)] p-2">
          <Preview />
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-4 gap-x-3 px-4 pt-3">
        {summary.metrics.slice(0, 4).map((m) => (
          <div key={m.label} className="min-w-0">
            <p className="text-[14px] font-semibold leading-none tracking-[-0.02em] text-[var(--text-1)] tabular-nums">
              {m.value}
            </p>
            <p className="mt-1 truncate text-[9.5px] leading-tight text-[var(--text-3)]">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Title band. The cinematic beat: the name, large and spaced, over the
          single sentence that says why this view matters right now. */}
      <div className="mt-3 shrink-0 border-t border-[var(--line-soft)] bg-[var(--brand-wash)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-[7px] w-[7px] shrink-0 rounded-full"
            style={{ background: marker.color }}
            aria-hidden
          />
          <h3 className="min-w-0 flex-1 truncate text-[17px] font-semibold uppercase leading-none tracking-[0.13em] text-[var(--text-1)]">
            {mod.label}
          </h3>
          <span className="shrink-0 text-[var(--brand-soft)]" aria-hidden>
            <Icon size={17} />
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[11.5px] leading-snug text-[var(--text-2)]">
          {summary.insight}
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <StatusMarker marker={summary.marker} size="sm" />
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-[6px] text-[11.5px] font-semibold transition-colors ${
              active
                ? "bg-[var(--brand)] text-white"
                : "border border-[var(--line)] text-[var(--text-3)]"
            }`}
          >
            Open {mod.label}
            <ArrowRightIcon size={12} />
          </span>
        </div>
      </div>
    </>
  );

  const shell = "flex h-full w-full flex-col overflow-hidden rounded-xl bg-[var(--surface-1)] text-left";

  if (!active) {
    return (
      <div className={shell} style={markerRingStyle(summary.marker)} aria-hidden>
        {body}
      </div>
    );
  }

  return (
    <Link
      href={mod.href}
      className={`${shell} outline-offset-4`}
      style={markerRingStyle(summary.marker)}
      aria-label={`Open ${mod.label}. ${mod.description} ${summary.insight}`}
    >
      {body}
    </Link>
  );
}
