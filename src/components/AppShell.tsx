"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { BrandLogo } from "./BrandLogo";

const TABS = [
  { href: "/", label: "Map" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "/chart", label: "Chart" },
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
    <header className="relative z-50 flex shrink-0 items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--bg-3)] px-3 py-2.5 shadow-[0_1px_0_rgba(11,31,51,0.04)] sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--bg-3)] text-[var(--ivory-2)] transition hover:border-[var(--copper)] hover:text-[var(--copper)]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M16 21h3a2 2 0 002-2v-3M8 21H5a2 2 0 01-2-2v-3" />
          </svg>
        </button>

        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo variant="mark" height={36} priority />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[14px] font-semibold tracking-tight text-[var(--copper)]">
              Broadridge
            </p>
            <p className="truncate text-[11px] text-[var(--ink-2)]">
              Ontology
            </p>
          </div>
        </Link>

        <label className="relative ml-2 hidden min-w-[180px] max-w-[240px] flex-1 sm:block">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pathname === "/" ? "Search the map" : "Search panels"}
            className="w-full rounded-md border border-[var(--line)] bg-[var(--bg)] py-2 pl-9 pr-3 text-[13px] text-[var(--ivory)] outline-none placeholder:text-[var(--ink-3)] focus:border-[var(--copper)]"
          />
        </label>
      </div>

      <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rounded-md border border-[var(--line)] bg-[var(--bg)] p-0.5">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-[5px] px-3 py-1.5 text-[12px] font-semibold transition sm:px-4 ${
                active
                  ? "bg-[var(--copper)] text-white"
                  : "text-[var(--ivory-2)] hover:text-[var(--ivory)]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="https://cal.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-[var(--copper)] px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-[var(--brand-bright)] sm:px-4"
        >
          <span className="hidden sm:inline">Speak with a specialist</span>
          <span className="sm:hidden">Contact</span>
        </a>
      </div>
    </header>
  );
}
