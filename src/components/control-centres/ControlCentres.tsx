"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { ControlCentreRing } from "./ControlCentreRing";
import { MODULE_BY_ID } from "../modules";
import { ArrowRightIcon } from "../ui/Icons";
import { RING_ORDER } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";
import { PublicFunds } from "../PublicFunds";

/**
 * The gallery.
 *
 * A light room with Broadridge navy drawn through it, and nine screens hanging
 * in it. The room is not a separate theme — it is the same light product the
 * modules are, which is what lets a screen and the page it opens look like the
 * same object seen at two distances.
 *
 * The header is one band, not a stack: the name of whatever is at the front of
 * the ring, set large in the middle. It is deliberately shallow, because every
 * pixel it does not take is a pixel the screens get — and the screens being too
 * small was the thing wrong with this room.
 *
 * The Broadridge lockup is not repeated here. It is in the bar, at full weight,
 * on every page — two of the same mark forty pixels apart is not more identity,
 * it is a typo.
 *
 * The field behind everything is React Bits' Ghost Fibers, ported to
 * TypeScript and loaded on demand so `ogl` never reaches a module page. The
 * filaments and glow are both Broadridge navy on a solid pale ground.
 */
const GhostFibers = dynamic(() => import("./GhostFibers"), {
  ssr: false,
  loading: () => null,
});

/** Storage is read-only here and never changes mid-session. */
const noSubscribe = () => () => {};
const serverSnapshot = (): ModuleId | null => null;

function readLastModule(): ModuleId | null {
  try {
    const stored = window.localStorage.getItem("gi.lastModule");
    return stored && stored in MODULE_BY_ID ? (stored as ModuleId) : null;
  } catch {
    return null;
  }
}

export function ControlCentres({ initialCard }: { initialCard: string | null }) {
  const last = useSyncExternalStore(noSubscribe, readLastModule, serverSnapshot);

  const initialFront =
    initialCard && RING_ORDER.includes(initialCard as ModuleId)
      ? (initialCard as ModuleId)
      : RING_ORDER[0];
  const [front, setFront] = useState<ModuleId>(initialFront);
  const onFrontChange = useCallback((id: ModuleId) => setFront(id), []);

  const mod = MODULE_BY_ID[front];

  return (
    <div
      className="gi-room relative flex h-full flex-col overflow-hidden"
    >
      <GhostFibers
        className="gi-field"
        lineColor="#001F5A"
        glowColor="#001F5A"
        lightMode
        /* Tuned to be a room rather than a picture: slow, few layers, soft
           filaments, and only a third opaque over the page's own ground. A
           background you notice is a background competing with the exhibits. */
        speed={0.1}
        scale={3.6}
        rotationSpeed={0.035}
        layers={6}
        waveAmplitude={0.05}
        waveFrequency={2.2}
        waveSpeed={0.09}
        twist={0.2}
        lineFrequency={2}
        lineSpacing={1}
        /* The single most important number here. The shader mixes its fiber
           ink in proportion to how much line has accumulated, so a high
           sharpness gives hairlines that vanish on a light ground. At 4 the
           filaments are broad enough to read as structure behind the glass. */
        lineSharpness={4}
        glowIntensity={0.9}
        brightness={1.5}
        /* The shader fades its own filaments toward the frame. The room wants
           the opposite, so the vignette is nearly off here and `.gi-field`
           supplies the curve the other way round. */
        vignette={0.12}
        grain={0.03}
        opacity={0.95}
      />

      {/* One shallow band. Logo left at full weight, front module in the middle,
          resume on the right — so nothing is stacked and the ring gets the
          height back. */}
      <header className="relative z-10 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 pb-2 pt-4">
        <p className="flex min-w-0 items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--text-4)]">
          <span className="h-px w-7 bg-[rgba(0,31,90,0.2)]" aria-hidden />
          Control Centres
        </p>

        <div className="min-w-0 text-center">
          <h1
            className="truncate text-[30px] leading-none tracking-[-0.015em] text-[var(--text-1)] sm:text-[36px]"
            style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
          >
            <span className="hidden md:inline">{mod.label}</span><span className="md:hidden">Control Centres</span>
          </h1>
          <p className="mx-auto mt-1.5 max-w-[64ch] truncate text-[12px] leading-relaxed text-[var(--text-3)]">
            {mod.description}
          </p>
        </div>

        <div className="flex justify-end">
          {last && last !== front && (
            <Link
              href={MODULE_BY_ID[last].href}
              className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,31,90,0.1)] bg-white/70 px-3 py-1.5 text-[11.5px] font-semibold text-[var(--text-2)] backdrop-blur transition-colors hover:border-[rgba(0,31,90,0.28)] hover:text-[var(--text-1)]"
            >
              Resume {MODULE_BY_ID[last].label}
              <ArrowRightIcon size={13} />
            </Link>
          )}
        </div>
      </header>

      <div className="relative z-10 hidden min-h-0 flex-1 flex-col md:flex">
        <ControlCentreRing initialCard={initialCard} onFrontChange={onFrontChange} />
      </div>
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-8 md:hidden">
        <p className="mb-4 mt-2 text-sm text-[var(--text-3)]">Choose a workspace to explore its accounts, signals and fund research.</p>
        <div className="grid gap-3">{RING_ORDER.map(id => {
          const destination = MODULE_BY_ID[id];
          return <Link key={id} href={destination.href} className="gi-record flex items-center gap-4">
            <span className="rounded-2xl bg-[var(--brand)] p-3 text-white"><destination.Icon size={22} /></span>
            <span><strong className="text-lg">{destination.label}</strong><span className="mt-1 block text-sm text-[var(--text-3)]">{destination.description}</span></span><ArrowRightIcon size={18} />
          </Link>;
        })}</div>
        <PublicFunds />
      </div>
    </div>
  );
}
