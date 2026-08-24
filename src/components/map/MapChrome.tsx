"use client";

type MapChromeProps = {
  mode: "sky" | "fan";
  deptName?: string;
  deptSub?: string;
  zoomPct: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset?: () => void;
  onBack?: () => void;
  onPrevDept?: () => void;
  onNextDept?: () => void;
  edgeLeft?: string;
  edgeRight?: string;
};

export function MapChrome({
  mode,
  deptName,
  deptSub,
  zoomPct,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onBack,
  onPrevDept,
  onNextDept,
  edgeLeft,
  edgeRight,
}: MapChromeProps) {
  return (
    <>
      {mode === "fan" && onBack && (
        <button
          type="button"
          data-ui
          onClick={onBack}
          className="absolute left-4 top-[4.5rem] z-30 flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass)] px-3 py-2 text-[11px] font-bold tracking-[0.14em] text-[var(--ivory-2)] backdrop-blur-md transition hover:border-[var(--copper)] hover:text-[var(--ivory)]"
        >
          ← ALL DEPARTMENTS
        </button>
      )}

      {mode === "fan" && edgeLeft && onPrevDept && (
        <button
          type="button"
          data-ui
          onClick={onPrevDept}
          className="absolute left-3 top-1/2 z-30 -translate-y-1/2 text-left text-[var(--ivory-2)] transition hover:text-[var(--ivory)]"
        >
          <div className="mb-1 text-[18px] opacity-70">‹</div>
          <div
            className="max-w-[72px] text-[11px] tracking-[0.16em]"
            style={{ fontFamily: "var(--font-serif), serif", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {edgeLeft.toUpperCase()}
          </div>
        </button>
      )}

      {mode === "fan" && edgeRight && onNextDept && (
        <button
          type="button"
          data-ui
          onClick={onNextDept}
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

      {/* Caption sits in the clear band under the orbit — not on top of nodes */}
      {mode === "sky" && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 text-center sm:bottom-6">
          <p
            className="text-[28px] tracking-[0.2em] text-[var(--ivory)] sm:text-[34px]"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {deptName?.toUpperCase() ?? "SALES"}
          </p>
          <p className="mt-1 text-[11px] text-[var(--ink-2)]">
            {deptSub ?? "targeting · outreach · sequencing"}
          </p>
          <div className="pointer-events-auto mt-2 flex items-center justify-center gap-8 text-[var(--ivory-2)]">
            <button
              type="button"
              data-ui
              onClick={onPrevDept}
              className="text-xl leading-none transition hover:text-[var(--ivory)]"
              aria-label="Previous department"
            >
              ‹
            </button>
            <button
              type="button"
              data-ui
              onClick={onNextDept}
              className="text-xl leading-none transition hover:text-[var(--ivory)]"
              aria-label="Next department"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {mode === "fan" && deptName && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center">
          <p
            className="text-[28px] tracking-[0.16em] text-[var(--ivory)] sm:text-[34px]"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {deptName.toUpperCase()}
          </p>
          {deptSub && (
            <p className="mt-1 text-[11px] text-[var(--ink-2)]">{deptSub}</p>
          )}
        </div>
      )}

      <div
        data-ui
        className="absolute bottom-4 right-4 z-30 flex items-center gap-2"
      >
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
