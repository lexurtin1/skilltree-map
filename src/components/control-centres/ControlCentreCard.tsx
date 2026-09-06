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
 * read; the band is what you confirm.
 *
 * Three glass tiers by distance from the front. Only the nearest panels get a
 * real `backdrop-filter` — nine live refraction layers composited over a
 * full-screen shader drops frames, and once a panel is rotated and dimmed the
 * difference is not visible.
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
      <div className="min-h-0 flex-1 px-5 pb-2 pt-4">
        <Dashboard />
      </div>

      <div
        className="shrink-0 border-t px-6 pb-4 pt-3"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: palette.bright, boxShadow: `0 0 12px ${palette.glow}` }}
          />
          <h3 className="min-w-0 flex-1 truncate text-[21px] font-medium uppercase leading-none tracking-[0.19em] text-[var(--text-1)]">
            {mod.label}
          </h3>
          <span className="shrink-0" style={{ color: palette.bright, opacity: 0.7 }}>
            <Icon size={20} />
          </span>
        </div>
        <p className="mt-2 truncate text-[12px] leading-none text-[var(--text-3)]">
          {mod.description}
        </p>
      </div>
    </>
  );

  const shell = `gi-glass ${glassTier} flex h-full w-full flex-col overflow-hidden rounded-2xl text-left`;
  const style = {
    "--tint": palette.wash,
    "--rim": palette.rim,
  } as React.CSSProperties;

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
