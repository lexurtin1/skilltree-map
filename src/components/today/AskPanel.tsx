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

/** Optional book-wide ask panel — Today uses the inline card by default. */
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
        <button type="button" onClick={onToggleCollapse} aria-expanded={false}>
          Ask
        </button>
      </aside>
    );
  }

  return (
    <aside className="today-ask" aria-label="Ask anything panel">
      <header>
        <div>
          <span>ASK ANYTHING</span>
          <h2>{contextLabel}</h2>
        </div>
        <div>
          {selectedId && (
            <button type="button" onClick={onClearContext}>
              Clear context
            </button>
          )}
          <button type="button" onClick={onToggleCollapse} aria-expanded>
            Collapse
          </button>
        </div>
      </header>
      <div role="group" aria-label="Suggested questions">
        {chips.map((chip) => (
          <button key={chip} type="button" onClick={() => ask(chip)}>
            {chip}
          </button>
        ))}
      </div>
      <div ref={threadRef} aria-live="polite">
        {messages.length === 0 ? (
          <p>Answers come from the same briefing data as Today.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id}>
              <p>{m.text}</p>
              {m.answer?.bullets?.length ? (
                <ul>
                  {m.answer.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))
        )}
      </div>
      <form onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="today-ask-input">
          Ask a question
        </label>
        <input
          id="today-ask-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask about coverage, confidence, products…"
          autoComplete="off"
        />
        <button type="submit" disabled={!draft.trim()}>
          Ask
        </button>
      </form>
    </aside>
  );
}
