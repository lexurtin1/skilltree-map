"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ControlCentreCarousel } from "./ControlCentreCarousel";
import { MODULE_BY_ID } from "../modules";
import { ArrowRightIcon } from "../ui/Icons";
import type { ModuleId } from "@/lib/gi/metrics";

/**
 * The default landing page.
 *
 * The carousel is the entry point, not a gate. Anyone who lives in this
 * product all day gets the top navigation, number-key shortcuts and the resume
 * link below — the gallery is for choosing, not for paying a toll.
 */
/** Storage is read-only here and never changes mid-session, so nothing to watch. */
const noSubscribe = () => () => {};

/** No localStorage during server rendering — the link appears after hydration. */
const serverSnapshot = (): ModuleId | null => null;

function readLastModule(): ModuleId | null {
  try {
    const stored = window.localStorage.getItem("gi.lastModule");
    return stored && stored in MODULE_BY_ID ? (stored as ModuleId) : null;
  } catch {
    /* Private browsing — the resume link simply does not appear. */
    return null;
  }
}

export function ControlCentres({ initialCard }: { initialCard: string | null }) {
  /* localStorage does not exist during server rendering, so the server
     snapshot is null and the link appears after hydration. */
  const last = useSyncExternalStore(noSubscribe, readLastModule, serverSnapshot);

  return (
    <div className="gi-stage relative flex h-full flex-col overflow-hidden">
      <header className="relative z-10 shrink-0 px-6 pb-1 pt-6 text-center sm:pt-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-4)]">
          The commercial operating view
        </p>
        <h1
          className="mt-2 text-[34px] leading-none tracking-[-0.02em] text-[var(--text-1)] sm:text-[42px]"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          Control Centres
        </h1>
        <p className="mx-auto mt-2.5 max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--text-3)]">
          Choose the view that helps you make the next decision.
        </p>

        {last && (
          <Link
            href={MODULE_BY_ID[last].href}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand-tint)]"
          >
            Resume {MODULE_BY_ID[last].label}
            <ArrowRightIcon size={13} />
          </Link>
        )}
      </header>

      <ControlCentreCarousel initialCard={initialCard} />
    </div>
  );
}
