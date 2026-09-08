"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "./BrandLogo";
import { MODULES, TASKS_MODULE } from "./modules";
import { PrepareMeSheet } from "./prepare/PrepareMeSheet";
import {
  CloseIcon,
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

/** Where a search result takes you in the Wire / Client / Board IA. */
function hrefFor(ref: ObjectRef): string {
  switch (ref.kind) {
    case "account":
      if (ref.id === "acc-nordea") return "/board";
      return `/accounts?id=${encodeURIComponent(ref.id)}`;
    case "opportunity":
      if (ref.id === "opp-nordea-xborder" || ref.label.toLowerCase().includes("nordea")) {
        return "/board";
      }
      return `/deals/${ref.id}`;
    case "person":
      return "/accounts";
    case "fund":
      return "/accounts";
    case "market":
      return "/";
    case "service":
      return "/studio";
    default:
      return "/";
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const taskCount = useMemo(() => openTaskCount(), []);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  /* Close on navigation. Adjusting state during render is the documented
     pattern for this; an effect would show the stale open menu for a frame. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  return (
    <div className="relative flex h-full flex-col" style={{ background: "var(--surface-0)" }}>
      <TopBar
        onPrepare={() => setPrepareOpen(true)}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        menuButtonRef={menuButtonRef}
        taskCount={taskCount}
        pathname={pathname}
      />
      <ModuleRail pathname={pathname} />
      <main className="relative min-h-0 flex-1">{children}</main>
      <FooterRail />
      {/* A sibling of the bar, not a child of it: the panel is a fixed overlay
          across the whole app, and nesting it inside the header would put it
          inside the header's stacking context and count it as a bar control. */}
      <NavPanel
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
        taskCount={taskCount}
        returnFocusTo={menuButtonRef}
      />
      {prepareOpen && <PrepareMeSheet onClose={() => setPrepareOpen(false)} />}
    </div>
  );
}

/** Shared brand, search and preparation controls; destinations live below. */

function TopBar({
  onPrepare,
  menuOpen,
  onToggleMenu,
  menuButtonRef,
  taskCount,
  pathname,
}: {
  onPrepare: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
  taskCount: number;
  pathname: string;
}) {
  const isHome = pathname === "/";

  return (
    <header
      className="gi-bar relative z-50 flex shrink-0 items-center gap-3 px-4 sm:px-5"
      style={{ height: "var(--topbar-h)" }}
    >
      <Link
        href="/"
        className="flex shrink-0 items-center gap-3 rounded-xl px-1 py-1"
        aria-label="Broadridge Growth Intelligence — home"
        aria-current={isHome ? "page" : undefined}
      >
        <BrandLogo
          variant="lockup"
          height={isHome ? 52 : 44}
          className={isHome ? "w-[180px] sm:w-[240px]" : "w-[155px] sm:w-[205px]"}
          priority
        />
        <span className="hidden h-7 w-px bg-[var(--line)] lg:block" aria-hidden />
        <span
          className={`hidden font-bold uppercase leading-[1.35] tracking-[0.16em] text-[var(--brand)] lg:block ${
            isHome ? "text-[11px]" : "text-[9.5px] text-[var(--text-3)]"
          }`}
        >
          Growth
          <br />
          Intelligence
        </span>
      </Link>

      <div className="ml-auto flex min-w-0 items-center gap-2">
        <GlobalSearch />

        <button
          type="button"
          onClick={onPrepare}
          aria-label="Prepare me"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--brand)] px-3.5 py-[8px] text-[12px] font-semibold text-white shadow-[0_6px_14px_-8px_rgba(0,31,90,0.9)] transition-colors hover:bg-[var(--brand-bright)]"
        >
          <PrepareIcon size={14} />
          <span>Prepare me</span>
        </button>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={onToggleMenu}
          aria-expanded={menuOpen}
          aria-controls="gi-menu"
          aria-label={`Menu — ${taskCount} open tasks`}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-[8px] text-[12px] font-semibold transition-colors ${
            menuOpen
              ? "border-[var(--brand-soft)] bg-[var(--chip-bg)] text-[var(--chip-fg)]"
              : "border-[var(--line)] text-[var(--text-2)] hover:border-[var(--brand-bright)] hover:text-[var(--brand)]"
          }`}
        >
          {menuOpen ? <CloseIcon size={14} /> : <MenuIcon size={14} />}
          <span>Menu</span>
          {taskCount > 0 && !menuOpen && (
            <span className="h-[6px] w-[6px] rounded-full bg-[var(--state-attention)]" aria-hidden />
          )}
        </button>
      </div>
    </header>
  );
}

/** Persistent labelled destinations for the Wire / Client / Board IA. */
function ModuleRail({ pathname }: { pathname: string }) {
  return (
    <nav className="gi-destination-rail" aria-label="Destinations">
      {MODULES.map((mod) => {
        const active = mod.href === "/" ? pathname === "/" : pathname.startsWith(mod.href);
        const { Icon } = mod;
        return (
          <Link
            key={mod.id}
            href={mod.href}
            aria-label={mod.label}
            aria-current={active ? "page" : undefined}
            data-active={active || undefined}
            className="gi-destination-link"
            style={
              {
                "--nav-accent": mod.accent,
                color: active ? mod.accent : "var(--text-3)",
                borderBottomColor: active ? mod.accent : undefined,
              } as React.CSSProperties
            }
          >
            <Icon size={16} />
            <span>{mod.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/* ── The menu ─────────────────────────────────────────────────────────────
   React Bits' StaggeredMenu, rebuilt on this stack.

   Every destination as words, in named groups, so the icon rail never has to be
   the only way to reach something. Each destination hovers to its own module
   colour, which is the same hue that screen wears on the ring — so the menu, the
   bar and the gallery all agree about what is what.

   Tasks keeps its live count here and repeats it as a dot on the button,
   because a number you have to open a menu to see is a number nobody sees. */

function NavPanel({
  open,
  onClose,
  pathname,
  taskCount,
  returnFocusTo,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
  taskCount: number;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t) && !returnFocusTo.current?.contains(t)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        returnFocusTo.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, returnFocusTo]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.();
    else void document.exitFullscreen?.();
  }, []);

  return (
    /* Kept mounted so it can transition out, and inert while closed so the nine
       links behind it never appear in the tab order. */
    <div ref={rootRef} className="sm-root" data-open={open || undefined} inert={!open}>
      <span className="sm-scrim" aria-hidden onClick={onClose} />

      {/* The two layers that arrive before the panel does. */}
      <span className="sm-layer" aria-hidden style={{ background: "var(--brand)", "--sm-d": "0ms" } as React.CSSProperties} />
      <span className="sm-layer" aria-hidden style={{ background: "var(--brand-tint)", "--sm-d": "80ms" } as React.CSSProperties} />

      <nav id="gi-menu" className="sm-panel" aria-label="All destinations" style={{ "--sm-d": "150ms" } as React.CSSProperties}>
        <div className="sm-item" style={{ "--i": -1 } as React.CSSProperties}>
          <BrandLogo variant="lockup" height={26} />
        </div>

        <div>
          <MenuHeading>Destinations</MenuHeading>
          <ul className="sm-list mt-3 flex flex-col gap-1.5" data-numbered>
            {MODULES.map((m, i) => (
              <li key={m.id} className="sm-item" style={{ "--i": i } as React.CSSProperties}>
                <Link
                  href={m.href}
                  className="sm-link"
                  style={{ "--sm-accent": m.accent } as React.CSSProperties}
                  aria-current={isActive(m.href) ? "page" : undefined}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm-item" style={{ "--i": MODULES.length } as React.CSSProperties}>
          <MenuHeading>Work</MenuHeading>
          <div className="mt-2 flex flex-col gap-0.5">
            <Link
              href={TASKS_MODULE.href}
              className={`flex items-center gap-2 rounded-lg px-2 py-[7px] text-[13px] transition-colors hover:bg-[var(--surface-2)] ${
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
              onClick={() => {
                onClose();
                toggleFullscreen();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-[7px] text-left text-[13px] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-2)]"
            >
              <FullscreenIcon size={14} />
              Full screen
            </button>
          </div>
        </div>

        <div
          className="sm-item mt-auto flex items-center gap-2.5 border-t border-[var(--line-soft)] pt-4"
          style={{ "--i": MODULES.length + 1 } as React.CSSProperties}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[11px] font-bold text-white">
            AC
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[12.5px] font-semibold text-[var(--text-1)]">Alex Curtin</span>
            <span className="block truncate text-[11px] text-[var(--text-4)]">Strategic Account Director</span>
          </span>
        </div>
      </nav>
    </div>
  );
}

function MenuHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--text-4)]">{children}</p>
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
    <div ref={boxRef} className="gi-global-search relative min-w-0 lg:w-[210px] xl:w-[260px]">
      <label className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]">
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
          aria-activedescendant={open && results.length > 0 ? `gi-search-result-${active}` : undefined}
          placeholder="Search"
          aria-label="Search accounts, people and funds"
          className="w-full rounded-full border border-[var(--line)] bg-[var(--surface-0)] py-[8px] pl-9 pr-12 text-[12.5px] text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-4)] focus:border-[var(--brand-bright)] focus:bg-[var(--surface-1)]"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--line)] bg-[var(--surface-1)] px-1.5 py-[1px] text-[10px] font-medium text-[var(--text-4)] xl:block">
          ⌘K
        </kbd>
      </label>

      {open && query.trim().length >= 2 && (
        <div
          id="gi-search-results"
          role="listbox"
          className="gi-rise absolute left-0 right-0 top-[calc(100%+8px)] max-h-[62vh] overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] py-1.5"
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
                id={`gi-search-result-${i}`}
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
                <span className="shrink-0 rounded-full bg-[var(--surface-2)] px-2 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[var(--text-3)]">
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
      <p className="flex min-w-0 items-center gap-2">
        <BrandLogo variant="mark" height={13} className="opacity-45" />
        <span className="truncate">
          Illustrative Broadridge commercial intelligence — post-trade and fund servicing.
        </span>
      </p>
      <p className="hidden shrink-0 tabular-nums sm:block">Wire ranked 8 Sep 2026</p>
    </footer>
  );
}
