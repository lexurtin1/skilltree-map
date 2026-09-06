"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Eyebrow } from "../ui/Panel";

/**
 * The Prepare me entry sheet.
 *
 * Deliberately not a chat window. A seller preparing for a client meeting has
 * a specific job, and the eight entry points below are that job — each one
 * opens a structured preparation canvas rather than a blank prompt.
 *
 * The canvas itself lands in a later phase; this sheet is the entry contract.
 */
const ENTRIES: Array<{ id: string; label: string; hint: string }> = [
  { id: "client-meeting", label: "Client meeting", hint: "What changed, what to ask, what to agree." },
  { id: "account-review", label: "Account review", hint: "The full current picture of a client group." },
  { id: "deal-review", label: "Deal review", hint: "What would need to be true for this to close." },
  { id: "executive-introduction", label: "Executive introduction", hint: "The route in, and what it is for." },
  { id: "renewal-conversation", label: "Renewal conversation", hint: "Service quality first, scope second." },
  { id: "market-entry", label: "Market-entry discussion", hint: "What a new host market actually requires." },
  { id: "prospecting-outreach", label: "Prospecting outreach", hint: "Whether there is a credible reason to make contact." },
  { id: "rfp", label: "RFP", hint: "What we know, what we must not assume." },
];

export function PrepareMeSheet({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prepare-title"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(11,31,51,0.28)]"
      />
      <div
        ref={ref}
        className="gi-rise relative w-full max-w-[560px] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-1)]"
        style={{ boxShadow: "var(--shadow-4)" }}
      >
        <div className="border-b border-[var(--line-soft)] px-6 py-5">
          <Eyebrow className="mb-1.5">Prepare me</Eyebrow>
          <h2 id="prepare-title" className="text-[19px] font-semibold tracking-[-0.015em] text-[var(--text-1)]">
            What are you preparing for?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-[var(--line-soft)] sm:grid-cols-2">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.id}
              href={`/prepare?for=${entry.id}`}
              onClick={onClose}
              className="group bg-[var(--surface-1)] px-5 py-3.5 transition-colors hover:bg-[var(--brand-wash)]"
            >
              <p className="text-[13px] font-semibold text-[var(--text-1)] group-hover:text-[var(--brand)]">
                {entry.label}
              </p>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[var(--text-3)]">{entry.hint}</p>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--line-soft)] px-6 py-3">
          <p className="text-[11px] text-[var(--text-4)]">
            Preparation draws only on verified records and states what is still unknown.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md px-2.5 py-1.5 text-[12px] font-semibold text-[var(--text-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
