"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { PortalVisualState } from "./AskPortalCanvas";
import { ASK_SUGGESTIONS } from "./data";
import type { AskAnswer } from "./askQuery";

const AskPortalCanvas = dynamic(
  () => import("./AskPortalCanvas").then((m) => m.AskPortalCanvas),
  { ssr: false },
);

const POS_KEY = "gi-ask-orb-pos";
const ORB_SIZE = 128;
const DEFAULT_POS = { x: 20, y: 132 };

type AskOrbProps = {
  accountShort: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: string;
  onDraftChange: (value: string) => void;
  asked: string | null;
  onAsk: (question: string) => void;
  answer: AskAnswer;
};

type Pos = { x: number; y: number };

function clampPos(pos: Pos, size = ORB_SIZE): Pos {
  if (typeof window === "undefined") return pos;
  const pad = 12;
  const maxX = Math.max(pad, window.innerWidth - size - pad);
  const maxY = Math.max(pad, window.innerHeight - size - 48);
  return {
    x: Math.min(maxX, Math.max(pad, pos.x)),
    y: Math.min(maxY, Math.max(pad, pos.y)),
  };
}

function readStoredPos(): Pos {
  if (typeof window === "undefined") return DEFAULT_POS;
  try {
    const raw = window.localStorage.getItem(POS_KEY);
    if (!raw) return DEFAULT_POS;
    const parsed = JSON.parse(raw) as Pos;
    if (typeof parsed?.x !== "number" || typeof parsed?.y !== "number") return DEFAULT_POS;
    return clampPos(parsed);
  } catch {
    return DEFAULT_POS;
  }
}

export function AskOrb({
  accountShort,
  open,
  onOpenChange,
  draft,
  onDraftChange,
  asked,
  onAsk,
  answer,
}: AskOrbProps) {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [opening, setOpening] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState<Pos>(() =>
    typeof window === "undefined" ? DEFAULT_POS : readStoredPos(),
  );
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  const visualState: PortalVisualState = (() => {
    if (dragging) return "idle";
    if (opening) return "opening";
    if (open && asked) return "answering";
    if (open) return "open";
    if (hovered) return "hover";
    return "idle";
  })();

  useEffect(() => {
    const onResize = () => setPos((p) => clampPos(p));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open && !opening) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openTimerRef.current != null) {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = null;
        }
        setOpening(false);
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKey);
    const t =
      open && !opening
        ? window.setTimeout(() => inputRef.current?.focus(), reduceMotion ? 40 : 40)
        : null;
    return () => {
      document.removeEventListener("keydown", onKey);
      if (t != null) window.clearTimeout(t);
    };
  }, [open, opening, onOpenChange, reduceMotion]);

  const beginOpen = useCallback(() => {
    if (open || opening) return;
    if (reduceMotion) {
      onOpenChange(true);
      return;
    }
    setOpening(true);
    if (openTimerRef.current != null) window.clearTimeout(openTimerRef.current);
    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = null;
      setOpening(false);
      onOpenChange(true);
    }, 780);
  }, [open, opening, onOpenChange, reduceMotion]);

  const close = () => {
    if (openTimerRef.current != null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setOpening(false);
    onOpenChange(false);
  };

  const onFloatPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    // Don't start drag from interactive controls inside an open overlay
    if ((e.target as HTMLElement).closest(".today-ask-portal-overlay")) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
      moved: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onFloatPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 6) {
      drag.moved = true;
      setDragging(true);
    }
    if (!drag.moved) return;

    setPos(clampPos({ x: drag.originX + dx, y: drag.originY + dy }));
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const wasDrag = drag.moved;
    dragRef.current = null;
    setDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (wasDrag) {
      setPos((p) => {
        const next = clampPos(p);
        try {
          window.localStorage.setItem(POS_KEY, JSON.stringify(next));
        } catch {
          /* ignore quota */
        }
        return next;
      });
      return;
    }

    // Treat as click — open / close Ask
    if (open) close();
    else beginOpen();
  };

  const onHitPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: (e.clientX - rect.left) / Math.max(rect.width, 1),
      y: 1 - (e.clientY - rect.top) / Math.max(rect.height, 1),
    });
  };

  const showOverlay = open || opening;

  return (
    <>
      <div
        ref={floatRef}
        className={`today-ask-float${dragging ? " is-dragging" : ""}${showOverlay ? " is-expanded" : ""}`}
        style={{ left: pos.x, top: pos.y }}
        onPointerDown={onFloatPointerDown}
        onPointerMove={onFloatPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <p className="today-ask-float-title">Ask AI</p>
        <button
          type="button"
          className="today-ask-portal-hit"
          aria-expanded={open}
          aria-controls={open ? titleId : undefined}
          aria-label={open ? "Close Ask AI" : `Ask AI about ${accountShort}`}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onPointerMove={onHitPointerMove}
          // Click handled via drag end so we don't double-fire
          onClick={(e) => e.preventDefault()}
        >
          <AskPortalCanvas
            visualState={open ? "idle" : visualState}
            pointer={pointer}
            reducedMotion={!!reduceMotion}
          />
        </button>
        <span className="today-ask-float-hint">Drag to move · click to ask</span>
      </div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="today-ask-portal-overlay"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.35 }}
          >
            <button
              type="button"
              className="today-ask-portal-scrim"
              aria-label="Close Ask AI"
              onClick={close}
            />

            <motion.div
              className="today-ask-portal-burst"
              aria-hidden
              initial={reduceMotion ? false : { scale: 0.35, opacity: 0.85 }}
              animate={{
                scale: opening ? [0.2, 0.08, 2.4] : 0.2,
                opacity: opening ? [0.9, 1, 0.15] : 0,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.78,
                times: [0, 0.28, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <AskPortalCanvas
                visualState="opening"
                pointer={{ x: 0.5, y: 0.5 }}
                reducedMotion={!!reduceMotion}
              />
            </motion.div>

            <motion.div
              id={titleId}
              className="today-ask-portal-shell"
              role="region"
              aria-label={`Ask AI about ${accountShort}`}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 16 }}
              animate={{
                opacity: open ? 1 : 0,
                scale: open ? 1 : 0.96,
                y: open ? 0 : 12,
              }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{
                duration: reduceMotion ? 0.15 : 0.42,
                delay: open && !reduceMotion ? 0.08 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <header className="today-ask-portal-shell-head">
                <div className="today-ask-portal-core" aria-hidden>
                  <AskPortalCanvas
                    visualState={asked ? "answering" : "open"}
                    pointer={{ x: 0.5, y: 0.55 }}
                    compact
                    reducedMotion={!!reduceMotion}
                  />
                </div>
                <div className="today-ask-portal-shell-copy">
                  <p className="today-kicker">
                    {asked ? "Preparing briefing" : "Ask AI"}
                  </p>
                  <h2>Ask about {accountShort}</h2>
                </div>
                <button type="button" className="today-ask-sphere-close" onClick={close}>
                  Close
                </button>
              </header>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAsk(draft);
                }}
              >
                <label className="sr-only" htmlFor="today-ask-field">
                  Type a question about this account
                </label>
                <input
                  ref={inputRef}
                  id="today-ask-field"
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  placeholder="Type a question about this account"
                  autoComplete="off"
                />
              </form>

              <div className="today-ask-suggestions" role="group" aria-label="Suggested questions">
                {ASK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={asked === s ? "is-active" : undefined}
                    onClick={() => onAsk(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="today-ask-answer" aria-live="polite">
                <p>{answer.text}</p>
                {answer.bullets && answer.bullets.length > 0 && (
                  <ul>
                    {answer.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                <span>
                  {answer.sources[0]?.detail ??
                    "From the illustrative briefing for this account."}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
