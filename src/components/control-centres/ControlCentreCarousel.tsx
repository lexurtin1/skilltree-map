"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ControlCentreCard } from "./ControlCentreCard";
import { MODULES } from "../modules";
import { ArrowLeftIcon, ArrowRightIcon } from "../ui/Icons";

/**
 * The Control Centres carousel.
 *
 * Staging is cinematic; the light theme means depth has to come from
 * perspective, scale, focus and a grounded shadow rather than from glow. Cards
 * recede along a shallow arc over an elliptical floor ring, the near card is
 * the only sharp thing on screen, and nothing loops.
 *
 * Reachable five ways on purpose: drag, wheel, arrow buttons, arrow keys and
 * the number keys. It is the front door of the product, and a front door that
 * only opens one way is a bad door.
 */

const CARD_W = 580;
const CARD_H = 424;
/** Cards further out than this are represented by dots instead of drawn. */
const VISIBLE_SPAN = 2;
const STEP_X = 410;
const STEP_Z = 250;
/** Pointer travel, in px, before a press becomes a drag rather than a click. */
const DRAG_THRESHOLD = 6;
/** Fraction of a card-step that counts as a committed drag rather than a nudge. */
const COMMIT_FRACTION = 0.28;

const LAST_MODULE_KEY = "gi.lastModule";

const indexOfCard = (card: string | null) =>
  card ? MODULES.findIndex((m) => m.id === card) : -1;

export function ControlCentreCarousel({ initialCard }: { initialCard: string | null }) {
  const router = useRouter();
  const params = useSearchParams();

  /** Live drag offset in card-widths; 0 when settled. */
  const [drag, setDrag] = useState(0);

  /* Seeded from the server-resolved card, then kept in step with any later
     in-app navigation that changes the query. The user's own choice wins until
     the URL changes again. */
  const deepLinkIndex = indexOfCard(params.get("card") ?? initialCard);
  const [chosen, setChosen] = useState<number | null>(null);
  const [lastDeepLink, setLastDeepLink] = useState(deepLinkIndex);
  if (deepLinkIndex !== lastDeepLink) {
    setLastDeepLink(deepLinkIndex);
    setChosen(null);
    setDrag(0);
  }

  const index = chosen ?? (deepLinkIndex >= 0 ? deepLinkIndex : 0);
  const setIndex = setChosen;
  const [reduced, setReduced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [scale, setScale] = useState(1);

  const trackRef = useRef<HTMLDivElement>(null);
  /** True once a press has travelled far enough to be a drag, not a click. */
  const draggedRef = useRef(false);
  /** Mirrors `drag` so the pointerup handler can read it without re-binding. */
  const dragRef = useRef(0);
  const releaseRef = useRef<(() => void) | null>(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyDrag = useCallback((value: number) => {
    dragRef.current = value;
    setDrag(value);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* The stage is a fixed-size world scaled to fit — keeps the perspective
     maths simple and the card proportions identical at every viewport. */
  useEffect(() => {
    const fit = () => {
      const el = trackRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      setScale(
        Math.max(0.42, Math.min(1.12, Math.min(width / (CARD_W * 1.9), height / (CARD_H + 40)))),
      );
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const clamp = useCallback((i: number) => Math.max(0, Math.min(MODULES.length - 1, i)), []);

  const goTo = useCallback(
    (i: number) => {
      setIndex(clamp(i));
      applyDrag(0);
    },
    [applyDrag, clamp, setIndex],
  );

  const step = useCallback((dir: number) => goTo(index + dir), [goTo, index]);

  /** Remember the last module opened, so the entry page can offer a resume. */
  const remember = useCallback((i: number) => {
    const mod = MODULES[i];
    if (!mod) return;
    try {
      window.localStorage.setItem(LAST_MODULE_KEY, mod.id);
    } catch {
      /* Private browsing — the carousel still works without a memory. */
    }
  }, []);

  /* ── Keyboard ───────────────────────────────────────────────────────────── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest('input, textarea, [contenteditable="true"]')) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(MODULES.length - 1);
      } else if (/^[1-9]$/.test(e.key)) {
        const i = Number(e.key) - 1;
        if (i < MODULES.length) {
          e.preventDefault();
          goTo(i);
          remember(i);
          router.push(MODULES[i].href);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, remember, router, step]);

  /* ── Drag ───────────────────────────────────────────────────────────────────
     Tracked on the window for the life of the gesture rather than with
     `setPointerCapture`. Capture retargets the click that follows a press to
     the capturing element, which silently stops the card's link from ever
     being activated — and it drops moves once the pointer leaves the card. */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    releaseRef.current?.();

    const startX = e.clientX;
    const startIndex = index;
    const stepPx = STEP_X * scale;
    draggedRef.current = false;

    const onMove = (ev: PointerEvent) => {
      if (!draggedRef.current) {
        if (Math.abs(ev.clientX - startX) < DRAG_THRESHOLD) return;
        draggedRef.current = true;
        setDragging(true);
      }
      const raw = startIndex - (ev.clientX - startX) / stepPx;
      /* Resist past the ends rather than rubber-banding into nothing. */
      const bounded = Math.max(-0.4, Math.min(MODULES.length - 0.6, raw));
      applyDrag(bounded - startIndex);
    };

    const finish = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      releaseRef.current = null;
      if (!draggedRef.current) return;

      setDragging(false);
      const d = dragRef.current;
      /* A deliberate drag should commit. Rounding alone means a confident
         half-card pull snaps back, which reads as the gesture being ignored. */
      const settled =
        Math.abs(d) >= COMMIT_FRACTION
          ? startIndex + Math.sign(d) * Math.max(1, Math.round(Math.abs(d)))
          : Math.round(startIndex + d);
      setIndex(clamp(settled));
      applyDrag(0);
      /* draggedRef stays set so the click this release produces is suppressed;
         the next pointerdown clears it. */
    };

    releaseRef.current = finish;
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
  };

  useEffect(() => () => releaseRef.current?.(), []);

  /* ── Wheel ──────────────────────────────────────────────────────────────── */

  const onWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccum.current += delta;
    if (Math.abs(wheelAccum.current) > 90) {
      step(wheelAccum.current > 0 ? 1 : -1);
      wheelAccum.current = 0;
    }
    if (wheelTimer.current) clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {
      wheelAccum.current = 0;
    }, 160);
  };

  useEffect(
    () => () => {
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
    },
    [],
  );

  const position = index + drag;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={trackRef}
        className="relative min-h-0 flex-1 touch-pan-y select-none"
        style={{
          perspective: reduced ? undefined : "1500px",
          perspectiveOrigin: "50% 44%",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onPointerDown={onPointerDown}
        onWheel={onWheel}
        role="group"
        aria-roledescription="carousel"
        aria-label="Control Centres"
      >
        {!reduced && <StageFloor scale={scale} />}

        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformStyle: "preserve-3d",
          }}
        >
          {MODULES.map((mod, i) => {
            const offset = i - position;
            const distance = Math.abs(offset);
            if (distance > VISIBLE_SPAN + 0.5) return null;

            const active = i === index && Math.abs(drag) < 0.5;
            const capped = Math.min(distance, VISIBLE_SPAN);
            const transform = reduced
              ? "translate(-50%, -50%)"
              : `translate(-50%, -50%) translateX(${offset * STEP_X}px) translateZ(${
                  -capped * STEP_Z
                }px) rotateY(${Math.max(-1.35, Math.min(1.35, -offset)) * 32}deg)`;

            return (
              <div
                key={mod.id}
                className="absolute left-0 top-0"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  transform,
                  transformStyle: "preserve-3d",
                  zIndex: 30 - Math.round(distance * 2),
                  opacity: reduced ? (active ? 1 : 0) : Math.max(0.1, 1 - distance * 0.3),
                  filter: distance > 0.15 ? `blur(${Math.min(distance * 1.1, 2.8)}px)` : undefined,
                  boxShadow: active
                    ? "0 64px 120px -44px rgba(11,31,51,0.45), 0 22px 44px -22px rgba(11,31,51,0.2)"
                    : "0 36px 70px -34px rgba(11,31,51,0.34)",
                  borderRadius: 14,
                  transition: dragging
                    ? "none"
                    : "transform 520ms cubic-bezier(0.22,0.9,0.28,1), opacity 420ms ease, filter 420ms ease, box-shadow 420ms ease",
                  pointerEvents: active ? "auto" : "none",
                  visibility: reduced && !active ? "hidden" : undefined,
                }}
                /* A press that turned into a drag must not also navigate. */
                onClickCapture={(e) => {
                  if (draggedRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  remember(i);
                }}
              >
                <ControlCentreCard module={mod} active={active} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-3 pb-4">
        <div className="flex items-center gap-4">
          <StepButton
            side="left"
            disabled={index === 0}
            onClick={() => step(-1)}
          />
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Control Centres">
            {MODULES.map((mod, i) => (
              <button
                key={mod.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={mod.label}
                onClick={() => goTo(i)}
                className="group flex h-5 items-center px-[3px]"
              >
                <span
                  className="block h-[5px] rounded-full transition-all duration-300 group-hover:bg-[var(--brand-bright)]"
                  style={{
                    width: i === index ? 24 : 5,
                    background: i === index ? "var(--brand)" : "var(--line-strong)",
                  }}
                />
              </button>
            ))}
          </div>
          <StepButton
            side="right"
            disabled={index === MODULES.length - 1}
            onClick={() => step(1)}
          />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-4)]">
          Drag to spin · Click the front card to enter
        </p>
      </div>
    </div>
  );
}

/**
 * The floor.
 *
 * A dotted orbit ring and a soft contact shadow. On a pale ground this is what
 * stops the cards reading as flat rectangles pasted onto paper — they sit on
 * something.
 */
function StageFloor({ scale }: { scale: number }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -z-0"
      style={{ transform: `translate(-50%, calc(-50% + ${232 * scale}px)) scale(${scale})` }}
      aria-hidden
    >
      <svg width="1320" height="360" viewBox="0 0 1320 360" fill="none">
        <defs>
          <radialGradient id="gi-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(11,31,51,0.13)" />
            <stop offset="55%" stopColor="rgba(11,31,51,0.05)" />
            <stop offset="100%" stopColor="rgba(11,31,51,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="660" cy="150" rx="430" ry="86" fill="url(#gi-pool)" />
        <ellipse
          cx="660"
          cy="164"
          rx="592"
          ry="128"
          fill="none"
          stroke="rgba(0,31,90,0.13)"
          strokeWidth="1"
          strokeDasharray="2 9"
        />
        <ellipse
          cx="660"
          cy="164"
          rx="470"
          ry="100"
          fill="none"
          stroke="rgba(0,31,90,0.09)"
          strokeWidth="1"
          strokeDasharray="2 12"
        />
      </svg>
    </div>
  );
}

function StepButton({
  side,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous control centre" : "Next control centre"}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
        disabled
          ? "cursor-default border-transparent text-[var(--text-4)] opacity-30"
          : "border-[var(--line)] bg-[var(--surface-1)] text-[var(--text-2)] hover:border-[var(--brand-bright)] hover:text-[var(--brand)]"
      }`}
      style={{ boxShadow: disabled ? "none" : "var(--shadow-1)" }}
    >
      <Icon size={15} />
    </button>
  );
}
