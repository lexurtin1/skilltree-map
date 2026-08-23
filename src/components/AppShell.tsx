"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";

const TABS = [
  { href: "/", label: "MAP" },
  { href: "/dashboards", label: "DASHBOARDS" },
  { href: "/chart", label: "CHART" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full flex-col">
      <TopBar />
      <main className="relative min-h-0 flex-1">{children}</main>
    </div>
  );
}

function TopBar() {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen?.();
    } else {
      void document.exitFullscreen?.();
    }
  }, []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
      <div className="pointer-events-auto flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--glass)] text-[var(--ivory-2)] backdrop-blur-md transition hover:border-[var(--copper)] hover:text-[var(--ivory)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M16 21h3a2 2 0 002-2v-3M8 21H5a2 2 0 01-2-2v-3" />
          </svg>
        </button>
        <label className="relative hidden min-w-[180px] max-w-[260px] flex-1 sm:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pathname === "/" ? "Search jobs" : "Search panels"}
            className="w-full rounded-full border border-[var(--line)] bg-[var(--glass)] py-2 pl-9 pr-3 text-[13px] text-[var(--ivory)] outline-none backdrop-blur-md placeholder:text-[var(--ink-3)] focus:border-[var(--copper)]"
          />
        </label>
      </div>

      <nav className="pointer-events-auto absolute left-1/2 top-3 flex -translate-x-1/2 rounded-full border border-[var(--line)] bg-[var(--glass)] p-1 backdrop-blur-md">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] transition sm:px-4 ${
                active
                  ? "bg-[var(--ivory)] text-[#14171e]"
                  : "text-[var(--ivory-2)] hover:text-[var(--ivory)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="pointer-events-auto flex items-center gap-2">
        <a
          href="https://cal.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--ivory)] px-3 py-2 text-[12px] font-semibold text-[#14171e] transition hover:brightness-105 sm:px-4"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
          </svg>
          <span className="hidden sm:inline">Book a call</span>
        </a>
      </div>
    </header>
  );
}
