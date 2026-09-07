"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ACCOUNT_CHIPS,
  BOOK_CHIPS,
  answerQuery,
  type AskAnswer,
  type AskDataSnapshot,
} from "./askQuery";

export type AskMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  answer?: AskAnswer;
};

type AskPanelProps = {
  selectedId: string | null;
  selectedName: string | null;
  data: AskDataSnapshot;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClearContext: () => void;
};

let msgSeq = 0;
const nextId = () => `ask-${++msgSeq}-${Date.now()}`;

export function AskPanel({
  selectedId,
  selectedName,
  data,
  collapsed,
  onToggleCollapse,
  onClearContext,
}: AskPanelProps) {
  const [messages, setMessages] = useState<AskMessage[]>([]);
  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const chips = selectedId ? ACCOUNT_CHIPS : BOOK_CHIPS;
  const contextLabel = selectedName
    ? `Ask about: ${selectedName}`
    : "Ask about your book";

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q) return;
    const answer = answerQuery(q, selectedId, data);
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: q },
      { id: nextId(), role: "assistant", text: answer.text, answer },
    ]);
    setDraft("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  if (collapsed) {
    return (
      <aside className="today-ask today-ask-collapsed" aria-label="Ask panel">
        <button
          type="button"
          className="today-ask-expand"
          onClick={onToggleCollapse}
          aria-expanded={false}
        >
          Ask
        </button>
      </aside>
    );
  }

  return (
    <aside className="today-ask" aria-label="Ask anything panel">
      <header className="today-ask-header">
        <div>
          <span className="today-ask-kicker">ASK ANYTHING</span>
          <h2>{contextLabel}</h2>
        </div>
        <div className="today-ask-header-actions">
          {selectedId && (
            <button type="button" onClick={onClearContext}>
              Clear context
            </button>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded={true}
            aria-label="Collapse ask panel"
          >
            Collapse
          </button>
        </div>
      </header>

      <div className="today-ask-chips" role="group" aria-label="Suggested questions">
        {chips.map((chip) => (
          <button key={chip} type="button" onClick={() => ask(chip)}>
            {chip}
          </button>
        ))}
      </div>

      <div className="today-ask-thread" ref={threadRef} aria-live="polite">
        {messages.length === 0 ? (
          <p className="today-ask-empty">
            Answers come from the same briefing data as the feed. Select an
            account to focus questions, or ask across your book.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`today-ask-msg ${m.role}${m.answer?.gap ? " is-gap" : ""}`}
            >
              <p>{m.text}</p>
              {m.answer?.bullets && m.answer.bullets.length > 0 && (
                <ul>
                  {m.answer.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {m.answer?.sources && m.answer.sources.length > 0 && (
                <div className="today-ask-cites">
                  {m.answer.sources.map((s) => (
                    <span key={s.label + s.detail.slice(0, 24)} title={s.detail}>
                      {s.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className="today-ask-compose" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="today-ask-input">
          Ask a question
        </label>
        <input
          id="today-ask-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about coverage, confidence, deals…"
          autoComplete="off"
        />
        <button type="submit" disabled={!draft.trim()}>
          Ask
        </button>
      </form>
    </aside>
  );
}
