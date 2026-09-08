"use client";

import Link from "next/link";
import { DASHBOARDS } from "./dashboards";
import { ArrowRightIcon } from "../ui/Icons";
import { MODULE_PALETTE } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";
import { LEGACY_GALLERY } from "../modules";

/**
 * One screen on the ring.
 *
 * A 16:9 sheet of glass carrying a full dashboard, with the module's name set
 * large and letterspaced in a band along the bottom. The dashboard is what you
 * read; the band is what you confirm — and it is the only part still legible on
 * a screen that has turned most of the way round, which is why the name lives
 * there rather than in the chrome.
 *
 * ── Why the whole card is not one link any more ──────────────────────────────
 *
 * It used to be. That made the screen a picture: everything on it went to the
 * same place, so none of it was worth reading closely. Now the figures on the
 * front screen are themselves destinations — an account cell opens that account,
 * a fund line opens that fund, a deal opens that deal — and nested anchors are
 * not a thing HTML has.
 *
 * So the module link is a transparent backdrop across the whole card at `z-0`,
 * and the dashboard sits above it in a `gi-passthrough` wrapper: the wrapper
 * itself ignores the pointer, so every gap between the figures falls through to
 * the backdrop and still enters the module, while the links and buttons inside
 * it take their own clicks. Clicking anywhere empty still enters. Clicking a
 * fund goes to the fund.
 *
 * Two glass tiers by distance from the front. Only the nearest screens get a
 * real `backdrop-filter` — nine live refraction layers composited over a
 * full-screen shader drops frames, and once a screen is turned away and hazed
 * the difference is not visible.
 */
export function ControlCentreCard({
  moduleId,
  active,
  distance,
  onSeat,
}: {
  moduleId: ModuleId;
  active: boolean;
  /** Ring positions away from the front, 0 = front. */
  distance: number;
  /** Rotate this screen to the front. */
  onSeat: () => void;
}) {
  const mod = LEGACY_GALLERY[moduleId];
  const palette = MODULE_PALETTE[moduleId];
  const Dashboard = DASHBOARDS[moduleId];
  const { Icon } = mod;

  /* Real refraction only where it can be seen. */
  const glassTier = distance <= 1.2 ? "gi-glass-live" : "gi-glass-flat";

  const style = {
    "--tint": palette.wash,
    "--rim": palette.rim,
    /* Everything inside the screen reads from these, so a module's colour runs
       from the light on its top edge through to the wells under its charts. */
    "--crown": `${palette.base}14`,
    "--well-0": `${palette.base}0d`,
    "--well-1": `${palette.base}1c`,
    "--well-line": `${palette.base}26`,
  } as React.CSSProperties;

  return (
    <div
      className={`gi-glass ${glassTier} relative flex h-full w-full flex-col overflow-hidden rounded-[26px] text-left`}
      style={style}
    >
      {/* The backdrop link. Only on the front screen — a link on a screen that
          is turned away is a link nobody meant to press. */}
      {active && (
        <Link
          href={mod.href}
          className="absolute inset-0 z-0 outline-offset-8"
          aria-label={`Open ${mod.label}. ${mod.description}`}
        />
      )}

      {/* Clipped: the name band along the bottom is how you identify a screen
          that has turned away, so nothing is allowed to spill into it. */}
      <div inert={!active} className="gi-passthrough relative z-10 min-h-0 flex-1 overflow-hidden px-6 pb-3 pt-5">
        <Dashboard />
      </div>

      <div className="pointer-events-none relative z-10 shrink-0 px-7 pb-5 pt-4">
        {/* The rule under the dashboard is the module's colour, fading out — a
            hairline in neutral grey here would be the one part of the screen
            that belonged to no module. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, ${palette.line}, rgba(0,31,90,0.06) 62%, transparent)` }}
        />
        <div className="flex items-center gap-3.5">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: palette.base, boxShadow: `0 0 0 5px ${palette.soft}` }}
          />
          <h3 className="min-w-0 flex-1 truncate text-[29px] font-medium uppercase leading-none tracking-[0.21em] text-[var(--text-1)]">
            {mod.label}
          </h3>

          {/* The explicit way in. The whole card is still clickable, but a
              screen full of its own links needs to say which click is the one
              that opens the module. */}
          {active && (
            <span
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-[0.02em] sm:inline-flex"
              style={{ background: palette.soft, color: palette.ink }}
            >
              Open module
              <ArrowRightIcon size={12} />
            </span>
          )}

          <span className="shrink-0" style={{ color: palette.ink, opacity: 0.62 }}>
            <Icon size={24} />
          </span>
        </div>
        <p className="mt-2.5 truncate text-[13px] leading-none text-[var(--text-3)]">{mod.description}</p>
      </div>

      {/* A screen that is not at the front takes one click to bring it there,
          and nothing inside it is reachable until it arrives. */}
      {!active && (
        <button
          type="button"
          onClick={onSeat}
          className="absolute inset-0 z-20 cursor-pointer"
          aria-label={`${mod.label} — bring to front`}
        />
      )}
    </div>
  );
}
