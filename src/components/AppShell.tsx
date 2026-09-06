"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { NAV_MODULES, TASKS_MODULE } from "./modules";
import { PrepareMeSheet } from "./prepare/PrepareMeSheet";
import {
  FullscreenIcon,
  MenuIcon,
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
    <div className="relative flex h-full flex-col" style={{ background: "var(--surface-0)" }}>
      <TopBar onPrepare={() => setPrepareOpen(true)} />
      <main className="relative min-h-0 flex-1">{children}</main>
      <FooterRail />
      {prepareOpen && <PrepareMeSheet onClose={() => setPrepareOpen(false)} />}
    </div>
  );
}

/* ── Top bar ──────────────────────────────────────────────────────────────
   Three controls, and the logo.

   The bar had eleven destinations in it, six inline and five behind an
   overflow, and still could not fit them below 1280px. Tabs are the wrong shape
   for nine peers: none of them is more important than the others, so promoting
   six of them was an arbitrary decision the user then had to work around.

   What is left is search, the one action a seller opens the day with, and a
   menu holding every destination in named groups. The gallery is not in the
   menu — the logo is the way home, which is what a logo is for. */

function TopBar({ onPrepare }: { onPrepare: () => void }) {
  const pathname = usePathname();
  const taskCount = useMemo(() => openTaskCount(), []);

  return (
    <header
      className="relative z-50 flex shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-1)] px-3 sm:px-4"
      style={{ height: "var(--topbar-h)" }}
    >
      <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Broadridge Growth Intelligence — home">
        <BrandLogo variant="lockup" height={22} priority />
        <span className="hidden h-5 w-px bg-[var(--line)] lg:block" aria-hidden />
        <span className="hidden text-[12.5px] font-semibold tracking-[-0.01em] text-[var(--text-2)] lg:block">
          Growth Intelligence
        </span>
      </Link>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <GlobalSearch />

        <button
          type="button"
          onClick={onPrepare}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[var(--brand)] px-3 py-[7px] text-[12px] font-semibold text-white transition-colors hover:bg-[var(--brand-bright)]"
        >
          <PrepareIcon size={14} />
          <span className="hidden sm:inline">Prepare me</span>
        </button>

        <NavMenu pathname={pathname} taskCount={taskCount} />
      </div>
    </header>
  );
}

/* ── The menu ─────────────────────────────────────────────────────────────
   Everything the bar used to hold, in named groups so nine peers read as nine
   peers. Tasks keeps its live count here and repeats it as a dot on the button,
   because a number you have to open a menu to see is a number nobody sees. */

function NavMenu({ pathname, taskCount }: { pathname: string; taskCount: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  /* Close on navigation. Adjusting state during render is the documented
     pattern for this; an effect would show the stale open menu for a frame. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.();
    else void document.exitFullscreen?.();
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Menu — ${taskCount} open tasks`}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-[7px] text-[12px] font-semibold transition-colors ${
          open
            ? "border-[var(--brand-soft)] bg-[var(--chip-bg)] text-[var(--chip-fg)]"
            : "border-[var(--line)] text-[var(--text-2)] hover:border-[var(--brand-bright)] hover:text-[var(--brand)]"
        }`}
      >
        <MenuIcon size={14} />
        <span className="hidden sm:inline">Menu</span>
        {taskCount > 0 && (
          <span className="h-[6px] w-[6px] rounded-full bg-[var(--state-attention)]" aria-hidden />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="gi-rise absolute right-0 top-[calc(100%+8px)] w-[280px] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-1)] py-2"
          style={{ boxShadow: "var(--shadow-3)" }}
        >
          <MenuHeading>Modules</MenuHeading>
          <div className="grid grid-cols-2 gap-x-1 px-1.5">
            {NAV_MODULES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className={`truncate rounded-md px-2 py-[7px] text-[12px] transition-colors hover:bg-[var(--surface-2)] ${
                  isActive(item.href) ? "font-semibold text-[var(--brand)]" : "text-[var(--text-2)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <span className="my-2 block h-px bg-[var(--line-soft)]" aria-hidden />

          <MenuHeading>Work</MenuHeading>
          <div className="px-1.5">
            <Link
              href={TASKS_MODULE.href}
              role="menuitem"
              className={`flex items-center gap-2 rounded-md px-2 py-[7px] text-[12px] transition-colors hover:bg-[var(--surface-2)] ${
                isActive("/tasks") ? "font-semibold text-[var(--brand)]" : "text-[var(--text-2)]"
              }`}
            >
              <TasksIcon size={14} />
              Tasks
              <span className="ml-auto rounded-full bg-[var(--state-attention)] px-1.5 py-[1px] text-[10px] font-bold leading-[14px] tabular-nums text-white">
                {taskCount}
              </span>
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                toggleFullscreen();
              }}
              className="flex w-full items-center gap-2 rounded-md px-2 py-[7px] text-left text-[12px] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)]"
            >
              <FullscreenIcon size={14} />
              Full screen
            </button>
          </div>

          <span className="my-2 block h-px bg-[var(--line-soft)]" aria-hidden />

          <div className="flex items-center gap-2.5 px-3.5 pb-1 pt-0.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[10.5px] font-bold text-white">
              JH
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-semibold text-[var(--text-1)]">James Howard</span>
              <span className="block truncate text-[10.5px] text-[var(--text-4)]">Strategic Account Director</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 pb-1.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[var(--text-4)]">
      {children}
    </p>
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
    <div ref={boxRef} className="relative hidden min-w-0 md:block md:w-[190px] lg:w-[260px]">
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
          placeholder="Search"
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
