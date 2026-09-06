"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "I'm your company capability assistant. Ask about any domain, account, or signal — the map feeds this view.",
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
        text: "Chat wiring comes next — for now this is the hub entry point from the capability map. Your message was received.",
      },
    ]);
  }

  return (
    <div className="flex h-full flex-col bg-[var(--bg)] px-4 pb-6 pt-6">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--bg-3)] shadow-[0_8px_28px_-12px_rgba(11,31,51,0.18)]">
        <header className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo variant="mark" height={36} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--copper)]">
                CAPABILITY ASSISTANT
              </p>
              <h1 className="text-xl font-semibold text-[var(--ivory)]">
                AI chat
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-md border border-[var(--line)] px-3 py-1.5 text-[11px] font-semibold text-[var(--ivory-2)] transition hover:border-[var(--copper)] hover:text-[var(--copper)]"
          >
            ← Map
          </Link>
        </header>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-md px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                m.role === "user"
                  ? "ml-auto bg-[var(--copper)] text-white"
                  : "bg-[var(--bg-2)] text-[var(--ivory-2)]"
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
            placeholder="Ask about capabilities…"
            className="min-w-0 flex-1 rounded-md border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-[13px] text-[var(--ivory)] outline-none placeholder:text-[var(--ink-3)] focus:border-[var(--copper)]"
          />
          <button
            type="submit"
            className="rounded-md bg-[var(--copper)] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[var(--brand-bright)]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
