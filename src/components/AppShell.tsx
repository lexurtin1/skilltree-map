"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { PRIMARY_NAV, SECONDARY_NAV, TASKS_MODULE } from "./modules";
import { PrepareMeSheet } from "./prepare/PrepareMeSheet";
import {
  ChevronDownIcon,
  FullscreenIcon,
  PrepareIcon,
  SearchIcon,
  TasksIcon,
} from "./ui/Icons";
import { openTaskCount } from "@/lib/gi/metrics";
import { search } from "@/lib/gi/select";
import { OBJECT_KINDS } from "@/lib/gi/taxonomy";
import type { ObjectRef } from "@/lib/gi/types";

/** Where a search result takes you. */
function hrefFor(ref: ObjectRef): string {
  switch (ref.kind) {
    case "account":
      return `/accounts/${ref.id}`;
    case "opportunity":
      return `/deals/${ref.id}`;
    case "person":
      return `/people?person=${ref.id}`;
    case "fund":
      return `/knowledge-graph?focus=${ref.id}`;
    case "market":
      return `/markets?market=${ref.id}`;
    case "service":
      return `/growth?service=${ref.id}`;
    default:
      return "/";
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [prepareOpen, setPrepareOpen] = useState(false);

  return (
    <div className="relative flex h-full flex-col bg-[var(--surface-0)]">
      <TopBar onPrepare={() => setPrepareOpen(true)} />
      <main className="relative min-h-0 flex-1">{children}</main>
      <FooterRail />
      {prepareOpen && <PrepareMeSheet onClose={() => setPrepareOpen(false)} />}
    </div>
  );
}

/* ── Top bar ──────────────────────────────────────────────────────────────── */

function TopBar({ onPrepare }: { onPrepare: () => void }) {
  const pathname = usePathname();
  const taskCount = useMemo(() => openTaskCount(), []);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.();
    else void document.exitFullscreen?.();
  }, []);

  /* Close the overflow menu when the route changes. Adjusting state during
     render is the documented pattern for this; an effect would render the
     stale open menu for a frame first. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMoreOpen(false);
  }

  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const secondaryActive = SECONDARY_NAV.some((s) => isActive(s.href));

  return (
    <header
      className="relative z-50 flex shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-1)] px-3 sm:px-4"
      style={{ height: "var(--topbar-h)" }}
    >
      <Link
        href="/"
        className="flex shrink-0 items-center gap-2.5"
        aria-label="Broadridge Growth Intelligence — Control Centres"
      >
        <BrandLogo variant="lockup" height={22} priority />
        <span className="hidden h-5 w-px bg-[var(--line)] lg:block" aria-hidden />
        <span className="hidden text-[12.5px] font-semibold tracking-[-0.01em] text-[var(--text-2)] lg:block">
          Growth Intelligence
        </span>
      </Link>

      <GlobalSearch />

      <nav className="ml-auto flex items-center gap-0.5" aria-label="Primary">
        {PRIMARY_NAV.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive(tab.href) ? "page" : undefined}
            className={`hidden rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-colors xl:block ${
              isActive(tab.href)
                ? "bg-[var(--brand-tint)] text-[var(--brand)]"
                : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
            }`}
          >
            {tab.label}
          </Link>
        ))}

        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.05em] transition-colors ${
              secondaryActive
                ? "bg-[var(--brand-tint)] text-[var(--brand)]"
                : "text-[var(--text-3)] hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]"
            }`}
          >
            <span className="xl:hidden">Menu</span>
            <span className="hidden xl:inline">More</span>
            <ChevronDownIcon size={12} />
          </button>
          {moreOpen && (
            <div
              role="menu"
              className="gi-rise absolute right-0 top-[calc(100%+6px)] w-52 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface-1)] py-1"
              style={{ boxShadow: "var(--shadow-3)" }}
            >
              {/* Primary destinations are listed here too, and hide themselves
                  once the inline bar appears at xl. */}
              {PRIMARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={`block px-3 py-2 text-[12.5px] transition-colors hover:bg-[var(--surface-2)] xl:hidden ${
                    isActive(item.href)
                      ? "font-semibold text-[var(--brand)]"
                      : "text-[var(--text-2)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <span className="my-1 block h-px bg-[var(--line-soft)] xl:hidden" aria-hidden />
              {SECONDARY_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={`block px-3 py-2 text-[12.5px] transition-colors hover:bg-[var(--surface-2)] ${
                    isActive(item.href)
                      ? "font-semibold text-[var(--brand)]"
                      : "text-[var(--text-2)]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onPrepare}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand)] px-3 py-[7px] text-[12px] font-semibold text-white transition-colors hover:bg-[var(--brand-bright)]"
        >
          <PrepareIcon size={14} />
          <span className="hidden sm:inline">Prepare me</span>
        </button>

        <Link
          href={TASKS_MODULE.href}
          aria-label={`Tasks — ${taskCount} open`}
          className={`relative inline-flex items-center gap-1.5 rounded-md border px-2.5 py-[7px] text-[12px] font-semibold transition-colors ${
            isActive("/tasks")
              ? "border-[var(--brand-soft)] bg-[var(--brand-tint)] text-[var(--brand)]"
              : "border-[var(--line)] text-[var(--text-2)] hover:border-[var(--brand-bright)] hover:text-[var(--brand)]"
          }`}
        >
          <TasksIcon size={14} />
          <span className="hidden sm:inline">Tasks</span>
          <span className="rounded-full bg-[var(--state-attention)] px-1.5 py-[1px] text-[10px] font-bold leading-[14px] text-white tabular-nums">
            {taskCount}
          </span>
        </Link>

        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Toggle fullscreen"
          className="hidden h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] text-[var(--text-3)] transition-colors hover:border-[var(--brand-bright)] hover:text-[var(--brand)] lg:inline-flex"
        >
          <FullscreenIcon size={14} />
        </button>

        <span
          title="Signed in as James Howard, Strategic Account Director"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[11px] font-bold text-white"
        >
          JH
        </span>
      </div>
    </header>
  );
}

/* ── Search ───────────────────────────────────────────────────────────────── */

function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (query.trim().length >= 2 ? search(query, 8) : []), [query]);

  /* Reset the highlighted result whenever the query changes. */
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setActive(0);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = useCallback(
    (ref: ObjectRef) => {
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
      router.push(hrefFor(ref));
    },
    [router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <div ref={boxRef} className="relative hidden min-w-0 flex-1 md:block md:max-w-[300px] lg:max-w-[360px]">
      <label className="relative block">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-4)]">
          <SearchIcon size={14} />
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls="gi-search-results"
          aria-autocomplete="list"
          placeholder="Search accounts, funds, people, markets, deals"
          className="w-full rounded-md border border-[var(--line)] bg-[var(--surface-0)] py-[7px] pl-8 pr-12 text-[12.5px] text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-4)] focus:border-[var(--brand-bright)] focus:bg-[var(--surface-1)]"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--line)] bg-[var(--surface-1)] px-1.5 py-[1px] text-[10px] font-medium text-[var(--text-4)] lg:block">
          ⌘K
        </kbd>
      </label>

      {open && query.trim().length >= 2 && (
        <div
          id="gi-search-results"
          role="listbox"
          className="gi-rise absolute left-0 right-0 top-[calc(100%+6px)] max-h-[62vh] overflow-y-auto rounded-lg border border-[var(--line)] bg-[var(--surface-1)] py-1"
          style={{ boxShadow: "var(--shadow-3)" }}
        >
          {results.length === 0 ? (
            <p className="px-3 py-3 text-[12px] text-[var(--text-3)]">
              Nothing matches “{query}”.
            </p>
          ) : (
            results.map((ref, i) => (
              <button
                key={`${ref.kind}-${ref.id}`}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(ref)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${
                  i === active ? "bg-[var(--surface-2)]" : ""
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-[var(--text-1)]">
                    {ref.label}
                  </span>
                  {ref.sublabel && (
                    <span className="block truncate text-[11px] text-[var(--text-3)]">
                      {ref.sublabel}
                    </span>
                  )}
                </span>
                <span className="shrink-0 rounded bg-[var(--surface-2)] px-1.5 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text-3)]">
                  {OBJECT_KINDS[ref.kind].label}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ── Footer rail ──────────────────────────────────────────────────────────── */

function FooterRail() {
  return (
    <footer
      className="relative z-40 flex shrink-0 items-center justify-between gap-4 border-t border-[var(--line)] bg-[var(--surface-1)] px-4 text-[10.5px] text-[var(--text-4)]"
      style={{ height: "var(--footrail-h)" }}
    >
      <p className="truncate">
        Illustrative prototype data. Client relationships, opportunities and market activity
        shown are examples only.
      </p>
      <p className="hidden shrink-0 tabular-nums sm:block">Data as at 6 September 2026</p>
    </footer>
  );
}
