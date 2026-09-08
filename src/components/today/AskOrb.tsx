"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import type { PortalVisualState } from "./AskPortalCanvas";
import { ASK_SUGGESTIONS } from "./data";
import type { AskAnswer } from "./askQuery";

const AskPortalCanvas = dynamic(
  () => import("./AskPortalCanvas").then((m) => m.AskPortalCanvas),
  { ssr: false },
);

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
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [opening, setOpening] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  const visualState: PortalVisualState = (() => {
    if (opening) return "opening";
    if (open && asked) return "answering";
    if (open) return "open";
    if (hovered) return "hover";
    return "idle";
  })();

  useEffect(() => {
    if (!open) {
      setOpening(false);
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), reduceMotion ? 40 : 720);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onOpenChange, reduceMotion]);

  const beginOpen = () => {
    if (open || opening) return;
    if (reduceMotion) {
      onOpenChange(true);
      return;
    }
    setOpening(true);
    window.setTimeout(() => {
      setOpening(false);
      onOpenChange(true);
    }, 780);
  };

  const close = () => {
    setOpening(false);
    onOpenChange(false);
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: (e.clientX - rect.left) / Math.max(rect.width, 1),
      y: 1 - (e.clientY - rect.top) / Math.max(rect.height, 1),
    });
  };

  const showOverlay = open || opening;

  return (
    <div
      className={`today-ask-portal${showOverlay ? " is-expanded" : ""}${opening ? " is-opening" : ""}`}
    >
      <button
        type="button"
        className="today-ask-portal-hit"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        aria-label={open ? "Close Ask" : `Open Intelligence — ask about ${accountShort}`}
        onClick={() => (open ? close() : beginOpen())}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onPointerMove={onPointerMove}
      >
        <AskPortalCanvas
          visualState={open ? "idle" : visualState}
          pointer={pointer}
          reducedMotion={!!reduceMotion}
        />
        <span className="today-ask-portal-label" aria-hidden={!hovered || open}>
          Open Intelligence
        </span>
      </button>

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
              aria-label="Close Ask"
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
              aria-label={`Ask about ${accountShort}`}
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
                    {asked ? "Preparing briefing" : "Intelligence channel"}
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
    </div>
  );
}
