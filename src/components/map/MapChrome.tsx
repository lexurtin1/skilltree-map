"use client";

import type { Crumb, DomainId } from "@/lib/company-map";
import { DOMAIN_BY_ID } from "@/lib/company-map";

export type MapMode = "overview" | "domain" | "node";

type MapChromeProps = {
  mode: MapMode;
  /** Ancestor trail for the current view, root first. */
  trail: Crumb[];
  captionTitle: string;
  captionSubtitle?: string;
  captionColor?: string;
  zoomPct: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset?: () => void;
  onBack?: () => void;
  onCrumb?: (crumb: Crumb) => void;
  onPrevDomain?: () => void;
  onNextDomain?: () => void;
  edgeLeft?: string;
  edgeRight?: string;
};

export function MapChrome({
  mode,
  trail,
  captionTitle,
  captionSubtitle,
  captionColor,
  zoomPct,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onBack,
  onCrumb,
  onPrevDomain,
  onNextDomain,
  edgeLeft,
  edgeRight,
}: MapChromeProps) {
  return (
    <>
      {mode !== "overview" && (
        <div className="absolute left-4 top-[4.5rem] z-30 flex max-w-[min(560px,calc(100vw-2rem))] flex-wrap items-center gap-2">
          {onBack && (
            <button
              type="button"
              data-ui
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-3 py-2 text-[11px] font-bold tracking-[0.14em] text-[var(--ivory-2)] backdrop-blur-md transition hover:border-[var(--copper)] hover:text-[var(--ivory)]"
            >
              ← BACK
            </button>
          )}
          <nav
            data-ui
            className="flex flex-wrap items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--glass)] px-3 py-2 backdrop-blur-md"
            aria-label="Map trail"
          >
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1;
              const color =
                crumb.kind === "domain"
                  ? DOMAIN_BY_ID[crumb.id as DomainId]?.color
                  : undefined;
              return (
                <span key={crumb.id} className="flex items-center gap-1">
                  {i > 0 && <span className="text-[10px] text-[var(--ink-3)]">›</span>}
                  <button
                    type="button"
                    disabled={last}
                    onClick={() => onCrumb?.(crumb)}
                    className={`max-w-[180px] truncate text-[11px] tracking-[0.06em] transition ${
                      last
                        ? "cursor-default text-[var(--ivory)]"
                        : "text-[var(--ink-2)] hover:text-[var(--ivory)]"
                    }`}
                    style={color && !last ? { color } : undefined}
                  >
                    {crumb.label}
                  </button>
                </span>
              );
            })}
          </nav>
        </div>
      )}

      {mode !== "overview" && edgeLeft && onPrevDomain && (
        <button
          type="button"
          data-ui
          onClick={onPrevDomain}
          className="absolute left-3 top-1/2 z-30 -translate-y-1/2 text-left text-[var(--ivory-2)] transition hover:text-[var(--ivory)]"
        >
          <div className="mb-1 text-[18px] opacity-70">‹</div>
          <div
            className="max-w-[72px] text-[11px] tracking-[0.16em]"
            style={{
              fontFamily: "var(--font-serif), serif",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            {edgeLeft.toUpperCase()}
          </div>
        </button>
      )}

      {mode !== "overview" && edgeRight && onNextDomain && (
        <button
          type="button"
          data-ui
          onClick={onNextDomain}
          className="absolute right-3 top-1/2 z-30 -translate-y-1/2 text-right text-[var(--ivory-2)] transition hover:text-[var(--ivory)]"
        >
          <div className="mb-1 text-[18px] opacity-70">›</div>
          <div
            className="ml-auto max-w-[72px] text-[11px] tracking-[0.16em]"
            style={{ fontFamily: "var(--font-serif), serif", writingMode: "vertical-rl" }}
          >
            {edgeRight.toUpperCase()}
          </div>
        </button>
      )}

      {/* Caption sits in the clear band under the graph — never on top of nodes */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 px-4 text-center sm:bottom-6">
        <p
          className="text-[26px] tracking-[0.18em] sm:text-[32px]"
          style={{ fontFamily: "var(--font-serif), serif", color: captionColor ?? "var(--ivory)" }}
        >
          {captionTitle.toUpperCase()}
        </p>
        {captionSubtitle && (
          <p className="mt-1 text-[11px] text-[var(--ink-2)]">{captionSubtitle}</p>
        )}
        {mode === "overview" && (
          <div className="pointer-events-auto mt-2 flex items-center justify-center gap-8 text-[var(--ivory-2)]">
            <button
              type="button"
              data-ui
              onClick={onPrevDomain}
              className="text-xl leading-none transition hover:text-[var(--ivory)]"
              aria-label="Previous domain"
            >
              ‹
            </button>
            <button
              type="button"
              data-ui
              onClick={onNextDomain}
              className="text-xl leading-none transition hover:text-[var(--ivory)]"
              aria-label="Next domain"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div data-ui className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--glass)] px-2 py-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={onZoomOut}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--ivory-2)] transition hover:text-[var(--ivory)]"
            aria-label="Zoom out"
          >
            −
          </button>
          <button
            type="button"
            onClick={onZoomReset}
            className="w-11 rounded-full text-center text-[11px] tabular-nums text-[var(--ink-2)] transition hover:text-[var(--ivory)]"
            title="Reset zoom (0)"
            aria-label="Reset zoom"
          >
            {zoomPct}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--ivory-2)] transition hover:text-[var(--ivory)]"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>
    </>
  );
}
