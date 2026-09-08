"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { ASK_SUGGESTIONS } from "./data";
import type { AskAnswer } from "./askQuery";

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

const ORBIT_RINGS = [
  { className: "today-dyson-ring today-dyson-ring-a", dots: 10 },
  { className: "today-dyson-ring today-dyson-ring-b", dots: 8 },
  { className: "today-dyson-ring today-dyson-ring-c", dots: 12 },
  { className: "today-dyson-ring today-dyson-ring-d", dots: 7 },
  { className: "today-dyson-ring today-dyson-ring-e", dots: 9 },
] as const;

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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onOpenChange]);

  return (
    <div className={`today-ask-sphere${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="today-ask-sphere-hit"
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
        onClick={() => onOpenChange(!open)}
      >
        <span className="sr-only">
          {open ? "Close Ask" : `Ask about ${accountShort}`}
        </span>

        <span className="today-ask-sphere-aura" aria-hidden />
        <span className="today-ask-sphere-pulse" aria-hidden />

        <span className="today-dyson" aria-hidden>
          {ORBIT_RINGS.map((ring) => (
            <span key={ring.className} className={ring.className}>
              {Array.from({ length: ring.dots }, (_, i) => (
                <i
                  key={i}
                  className="today-dyson-dot"
                  style={
                    {
                      "--dot-i": i,
                      "--dot-n": ring.dots,
                    } as CSSProperties
                  }
                />
              ))}
            </span>
          ))}
        </span>

        <span className="today-ask-sphere-core" aria-hidden>
          <span className="today-ask-sphere-shell" />
          <span className="today-ask-sphere-grid" />
          <span className="today-ask-sphere-iris" />
          <span className="today-ask-sphere-mark">
            <strong>ASK</strong>
            <em>GI · AI</em>
          </span>
        </span>
      </button>

      <div
        id={titleId}
        className="today-ask-sphere-panel"
        role="region"
        aria-label={`Ask about ${accountShort}`}
        aria-hidden={!open}
        inert={!open}
      >
        <header className="today-ask-sphere-panel-head">
          <p className="today-kicker">Intelligence channel</p>
          <h2>Ask about {accountShort}</h2>
          <button
            type="button"
            className="today-ask-sphere-close"
            onClick={() => onOpenChange(false)}
          >
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
      </div>
    </div>
  );
}
