"use client";

import Link from "next/link";
import { DASHBOARDS } from "./dashboards";
import { MODULE_PALETTE } from "@/lib/gi/palette";
import type { ModuleDef } from "../modules";

/**
 * One panel on the ring.
 *
 * A 16:9 sheet of glass carrying a full dashboard, with the module's name set
 * large and letterspaced in a band along the bottom. The dashboard is what you
 * read; the band is what you confirm — and it is the only part still legible on
 * a panel that has turned most of the way round, which is why the name lives
 * there rather than in the chrome.
 *
 * Two glass tiers by distance from the front. Only the nearest panels get a real
 * `backdrop-filter` — nine live refraction layers composited over a full-screen
 * shader drops frames, and once a panel is turned away and hazed the difference
 * is not visible.
 *
 * Back-facing panels are deliberately left legible-as-composition: the browser
 * mirrors them for free, and that reversed dashboard is the whole point of a
 * clear carousel.
 */
export function ControlCentreCard({
  module: mod,
  active,
  distance,
  onSeat,
}: {
  module: ModuleDef;
  active: boolean;
  /** Ring positions away from the front, 0 = front. */
  distance: number;
  /** Rotate this panel to the front. */
  onSeat: () => void;
}) {
  const palette = MODULE_PALETTE[mod.id];
  const Dashboard = DASHBOARDS[mod.id];
  const { Icon } = mod;

  /* Real refraction only where it can be seen. */
  const glassTier = distance <= 1.2 ? "gi-glass-live" : "gi-glass-flat";

  const body = (
    <>
      {/* Clipped: the name band along the bottom is how you identify a panel
          that has turned away, so nothing is allowed to spill into it. */}
      <div className="min-h-0 flex-1 overflow-hidden px-5 pb-2.5 pt-4">
        <Dashboard />
      </div>

      <div className="shrink-0 border-t border-[rgba(0,31,90,0.08)] px-6 pb-4 pt-3">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: palette.base, boxShadow: `0 0 0 4px ${palette.soft}` }}
          />
          <h3 className="min-w-0 flex-1 truncate text-[22px] font-medium uppercase leading-none tracking-[0.2em] text-[var(--text-1)]">
            {mod.label}
          </h3>
          <span className="shrink-0" style={{ color: palette.ink, opacity: 0.62 }}>
            <Icon size={20} />
          </span>
        </div>
        <p className="mt-2 truncate text-[12px] leading-none text-[var(--text-3)]">{mod.description}</p>
      </div>
    </>
  );

  const shell = `gi-glass ${glassTier} flex h-full w-full flex-col overflow-hidden rounded-[20px] text-left`;
  const style = { "--tint": palette.wash, "--rim": palette.rim } as React.CSSProperties;

  if (active) {
    return (
      <Link
        href={mod.href}
        className={`${shell} outline-offset-8`}
        style={style}
        aria-label={`Open ${mod.label}. ${mod.description}`}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onSeat}
      className={shell}
      style={style}
      aria-label={`${mod.label} — bring to front`}
    >
      {body}
    </button>
  );
}
