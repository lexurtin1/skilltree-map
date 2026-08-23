"use client";

import Link from "next/link";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I'm your company brain. Ask about any department, job, or how to stand up an agent — the MAP feeds me.",
    },
  ]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMsgs((m) => [
      ...m,
      { role: "user", text },
      {
        role: "assistant",
        text: "Chat wiring comes next — for now this is the hub entry point from the constellation. Your message was received.",
      },
    ]);
  }

  return (
    <div className="flex h-full flex-col px-4 pb-6 pt-20">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--glass)] backdrop-blur-xl">
        <header className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--copper)]">
              COMPANY BRAIN
            </p>
            <h1
              className="text-xl text-[var(--ivory)]"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              AI chat
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em] text-[var(--ivory-2)] transition hover:border-[var(--copper)] hover:text-[var(--ivory)]"
          >
            ← MAP
          </Link>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-[var(--ivory)] text-[#14171e]"
                  : "bg-[rgba(255,255,255,0.04)] text-[var(--ivory-2)]"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form
          onSubmit={send}
          className="flex gap-2 border-t border-[var(--line)] p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the workforce…"
            className="min-w-0 flex-1 rounded-full border border-[var(--line)] bg-transparent px-4 py-2.5 text-[13px] text-[var(--ivory)] outline-none placeholder:text-[var(--ink-3)] focus:border-[var(--copper)]"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--ivory)] px-4 py-2.5 text-[12px] font-bold text-[#14171e] transition hover:brightness-105"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
