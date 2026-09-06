"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ControlCentreCard } from "./ControlCentreCard";
import { MODULE_BY_ID } from "../modules";
import { ArrowLeftIcon, ArrowRightIcon } from "../ui/Icons";
import { MODULE_PALETTE, RING_ORDER } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";

/**
 * The ring.
 *
 * Nine 16:9 panels on a cylinder. The front one faces you square; the sides
 * turn away; the far ones present their backs, which the browser mirrors for
 * free. That mirrored dashboard is the point — this is a clear carousel, and you
 * are meant to see through it.
 *
 *   ring    translateZ(-R) rotateY(-position × STEP)
 *   panel i rotateY(i × STEP) translateZ(R)
 *
 * `filter: blur()` flattens `preserve-3d`, so nothing here blurs. Depth comes
 * from foreshortening, opacity and a scrim that deepens with angle — which is
 * also what the reference does.
 *
 * The ring holds still at rest. Only the waves behind it move.
 */

const CARD_W = 880;
const CARD_H = 495; /* 16:9 */
const COUNT = RING_ORDER.length;
const STEP_DEG = 360 / COUNT;

/**
 * Ring radius, derived rather than dialled in.
 *
 * The chord between adjacent panels is 2R·sin(180/9) = 0.684R, so R = W/0.684
 * seats them edge to edge *in three dimensions*. On screen they are closer than
 * that, because a neighbour at 40° has swung 0.234R further from the camera and
 * is drawn smaller. Working the projection through at perspective d = 2.1R:
 *
 *   scale   d / (d + 0.234R)          = 0.90
 *   centre  0.643R × 0.90             = 0.579R from the middle of the frame
 *   width   (W/2) × 0.90 × cos40°     = 0.345W of half-width
 *
 * so the gap between the front panel's edge and its neighbour's is
 * 0.579R − 0.345W − 0.5W. At the old 0.92 factor that came out negative — the
 * panels overlapped by about 90px, which is what made the ring read as a stack.
 * 1.22 puts roughly a sixth of a panel of clear air between them.
 */
const RADIUS = Math.round((CARD_W / 0.684) * 1.22);

/**
 * Resting height of each panel, in design pixels.
 *
 * A ring of nine identical rectangles at one height is a shelf. Lifting them by
 * different amounts turns the same geometry into a skyline, and it is the single
 * cheapest thing that makes the panels look like they are floating rather than
 * mounted. The sequence is authored, not generated, so it stays put.
 */
const FLOAT_Y = [-18, 10, -30, 4, -12, 22, -24, 14, -6];
/** Pointer travel, in px, before a press becomes a drag rather than a click. */
const DRAG_THRESHOLD = 6;
/** Fraction of a step that counts as a committed drag rather than a nudge. */
const COMMIT_FRACTION = 0.3;
/** Pixels of horizontal travel that equal one step round the ring. */
const STEP_PX = 300;

const LAST_MODULE_KEY = "gi.lastModule";

const indexOfCard = (card: string | null) =>
  card ? RING_ORDER.findIndex((id) => id === card) : -1;

/** Shortest signed distance from a to b around a ring of `COUNT` slots. */
function ringDelta(a: number, b: number): number {
  let d = b - a;
  while (d > COUNT / 2) d -= COUNT;
  while (d < -COUNT / 2) d += COUNT;
  return d;
}

export function ControlCentreRing({
  initialCard,
  onFrontChange,
}: {
  initialCard: string | null;
  /** Lets the stage tint its waves to whichever module is at the front. */
  onFrontChange?: (id: ModuleId) => void;
}) {
  const params = useSearchParams();

  const [drag, setDrag] = useState(0);

  /* Seeded from the server-resolved card so the first paint is already correct. */
  const deepLinkIndex = indexOfCard(params.get("card") ?? initialCard);
  const [chosen, setChosen] = useState<number | null>(null);
  const [lastDeepLink, setLastDeepLink] = useState(deepLinkIndex);
  if (deepLinkIndex !== lastDeepLink) {
    setLastDeepLink(deepLinkIndex);
    setChosen(null);
    setDrag(0);
  }

  /* `index` is unbounded — the ring wraps, so it may go negative or past nine. */
  const index = chosen ?? (deepLinkIndex >= 0 ? deepLinkIndex : 0);
  const setIndex = setChosen;

  const [dragging, setDragging] = useState(false);
  const [scale, setScale] = useState(0.6);

  const stageRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const dragRef = useRef(0);
  const releaseRef = useRef<(() => void) | null>(null);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** The module currently seated at the front, normalised into range. */
  const frontId = useMemo(() => {
    const normalised = ((Math.round(index) % COUNT) + COUNT) % COUNT;
    return RING_ORDER[normalised];
  }, [index]);

  useEffect(() => onFrontChange?.(frontId), [frontId, onFrontChange]);

  const applyDrag = useCallback((value: number) => {
    dragRef.current = value;
    setDrag(value);
  }, []);

  /* The ring is a fixed-size world scaled to fit, so the cylinder maths never
     has to care about the viewport. */
  useEffect(() => {
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      /* Sized to leave the neighbours visible on either side rather than to
         make the front panel as large as it will go. The multiplier is what
         decides how much of the ring is in frame; the cylinder maths above is
         what decides that the panels never touch, at any of these sizes.

         On a narrow screen the ring is allowed to run further off the sides.
         Holding the same framing there would shrink the front panel to about
         440px, at which point the dashboard on it stops being readable — and an
         unreadable dashboard framed beautifully is worth less than a readable
         one with its neighbours cropped. */
      const framing = width < 1280 ? 1.86 : 2.3;
      setScale(Math.max(0.24, Math.min(0.84, Math.min(width / (CARD_W * framing), height / (CARD_H * 1.34)))));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setIndex(i);
      applyDrag(0);
    },
    [applyDrag, setIndex],
  );

  /** Seat a slot at the front by the shortest way round. */
  const seat = useCallback(
    (slot: number) => {
      const current = ((Math.round(index) % COUNT) + COUNT) % COUNT;
      goTo(index + ringDelta(current, slot));
    },
    [goTo, index],
  );

  const step = useCallback((dir: number) => goTo(index + dir), [goTo, index]);

  const remember = useCallback((id: ModuleId) => {
    try {
      window.localStorage.setItem(LAST_MODULE_KEY, id);
    } catch {
      /* Private browsing — the ring still works without a memory. */
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
      } else if (/^[1-9]$/.test(e.key)) {
        const slot = Number(e.key) - 1;
        if (slot < COUNT) {
          e.preventDefault();
          seat(slot);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [seat, step]);

  /* ── Drag ───────────────────────────────────────────────────────────────────
     Tracked on the window for the life of the gesture. `setPointerCapture`
     retargets the click that follows a press, which silently stops a panel's
     link from ever activating. */

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    releaseRef.current?.();

    const startX = e.clientX;
    const startIndex = index;
    draggedRef.current = false;

    const onMove = (ev: PointerEvent) => {
      if (!draggedRef.current) {
        if (Math.abs(ev.clientX - startX) < DRAG_THRESHOLD) return;
        draggedRef.current = true;
        setDragging(true);
      }
      applyDrag((startX - ev.clientX) / (STEP_PX * Math.max(scale, 0.3)));
    };

    const finish = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      releaseRef.current = null;
      if (!draggedRef.current) return;

      setDragging(false);
      const d = dragRef.current;
      const settled =
        Math.abs(d) >= COMMIT_FRACTION
          ? startIndex + Math.sign(d) * Math.max(1, Math.round(Math.abs(d)))
          : Math.round(startIndex + d);
      setIndex(settled);
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
    if (Math.abs(wheelAccum.current) > 110) {
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
  const frontSlot = ((Math.round(position) % COUNT) + COUNT) % COUNT;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={stageRef}
        className="relative min-h-0 flex-1 touch-pan-y select-none"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onWheel={onWheel}
        role="group"
        aria-roledescription="carousel"
        aria-label="Control Centres"
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 0,
            height: 0,
            transform: `translate(-50%, -46%) scale(${scale})`,
            /* Camera distance.
               At 2.1R the cylinder is nearly an orthographic strip: panels more
               than one slot out fly off the sides of the frame before they have
               turned far enough to show their backs, and the ring stops reading
               as a ring. Bringing the camera in to 1.6R shortens the far side
               enough that the panels at 100–126° — the mirrored ones — curve
               back into view at the edges, which is the whole point of a clear
               carousel. It is also what produces the keystone on the
               neighbours. */
            perspective: `${RADIUS * 1.6}px`,
            perspectiveOrigin: "50% 50%",
          }}
        >
        <div
          className="gi-ring absolute left-0 top-0"
          style={{
            transform: `translateZ(${-RADIUS}px) rotateY(${-position * STEP_DEG}deg)`,
            transition: dragging ? "none" : "transform 620ms cubic-bezier(0.2,0.85,0.25,1)",
          }}
        >
          {RING_ORDER.map((id, i) => {
            const mod = MODULE_BY_ID[id];
            /* How far this panel is from the front, the short way round. */
            const offset = ringDelta(position, i);
            const distance = Math.abs(offset);
            const active = frontSlot === i && Math.abs(drag) < 0.5;

            /* A slot is 40°, so anything past 2.25 slots is turned more than
               90° away and is showing its back. Those are the mirrored panels —
               the reason this is a clear carousel — so they are kept.
               Past 3.15 slots (126°) a panel has swung round to sit squarely
               *behind* the front one, where it shows through the glass and puts
               a second dashboard on top of the one you are reading. Those are
               culled; the mirrored ones off to the side are not. */
            if (distance > 3.15) return null;

            return (
              <div
                key={id}
                className="gi-ring-card"
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  left: -CARD_W / 2,
                  top: -CARD_H / 2,
                  transform: `rotateY(${i * STEP_DEG}deg) translateZ(${RADIUS}px)`,
                  opacity: Math.max(0.2, 1 - distance * 0.145),
                  zIndex: Math.round(100 - distance * 10),
                  pointerEvents: distance > 2.25 ? "none" : "auto",
                }}
                onClickCapture={(e) => {
                  if (draggedRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  if (active) remember(id);
                }}
              >
                <div
                  className="gi-float absolute inset-0"
                  style={
                    {
                      "--fy": `${FLOAT_Y[i % FLOAT_Y.length]}px`,
                      /* Negative delays start every panel mid-cycle, so they
                         drift out of step instead of breathing in unison. */
                      "--fd": `${-(i * 1.3).toFixed(1)}s`,
                    } as React.CSSProperties
                  }
                >
                  {active && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -inset-8 -z-10 rounded-[36px]"
                      style={{
                        background: `radial-gradient(ellipse 58% 54% at 50% 62%, ${MODULE_PALETTE[id].glow}, transparent 72%)`,
                        filter: "blur(38px)",
                      }}
                    />
                  )}

                  <ControlCentreCard
                    module={mod}
                    active={active}
                    distance={distance}
                    onSeat={() => seat(i)}
                  />

                  {/* Haze: the room's air thickening across a panel as it turns
                      away. A pale wash rather than a blur — blur flattens
                      `preserve-3d` and would collapse the cylinder. */}
                  {distance > 0.12 && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 rounded-[20px]"
                      style={{
                        background: "#eef2f9",
                        opacity: Math.min(0.05 + distance * 0.16, 0.62),
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-3 pb-5">
        <div className="flex items-center gap-4">
          <StepButton side="left" onClick={() => step(-1)} />
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Control Centres">
            {RING_ORDER.map((id, i) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={i === frontSlot}
                aria-label={MODULE_BY_ID[id].label}
                onClick={() => seat(i)}
                className="group flex h-5 items-center px-[3px]"
              >
                <span
                  className="block h-[5px] rounded-full transition-all duration-300"
                  style={{
                    width: i === frontSlot ? 24 : 5,
                    background: i === frontSlot ? MODULE_PALETTE[id].base : "rgba(0,31,90,0.2)",
                  }}
                />
              </button>
            ))}
          </div>
          <StepButton side="right" onClick={() => step(1)} />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-4)]">
          Drag to spin · Click the front card to enter
        </p>
      </div>
    </div>
  );
}

function StepButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous control centre" : "Next control centre"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(0,31,90,0.12)] bg-white/70 text-[var(--text-2)] shadow-[0_2px_6px_-2px_rgba(0,31,90,0.16)] backdrop-blur-sm transition-colors hover:border-[rgba(0,31,90,0.3)] hover:text-[var(--text-1)]"
    >
      <Icon size={15} />
    </button>
  );
}
