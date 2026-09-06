"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { ControlCentreRing } from "./ControlCentreRing";
import { MODULE_BY_ID } from "../modules";
import { ArrowRightIcon } from "../ui/Icons";
import { MODULE_PALETTE, RING_ORDER } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";

/**
 * The gallery.
 *
 * A dark room with lit exhibits — the only dark surface in the product. Step
 * into any module and it becomes the light Broadridge working tool again.
 *
 * The wave field is loaded on demand so `ogl` never reaches a module page, and
 * it takes its colour from whichever panel is currently at the front, so the
 * whole room shifts hue as the ring turns.
 */
const GradientWaves = dynamic(() => import("./GradientWaves"), {
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
    (initialCard && RING_ORDER.includes(initialCard as ModuleId)
      ? (initialCard as ModuleId)
      : RING_ORDER[0]);
  const [front, setFront] = useState<ModuleId>(initialFront);
  const onFrontChange = useCallback((id: ModuleId) => setFront(id), []);

  const palette = MODULE_PALETTE[front];

  return (
    <div
      data-surface="dark"
      className="gi-gallery gi-gallery-pool gi-gallery-vignette relative flex h-full flex-col overflow-hidden"
      style={{ "--pool": palette.glow } as React.CSSProperties}
    >
      <GradientWaves
        horizonColor={palette.waves.horizon}
        waveColor={palette.waves.wave}
        crestColor={palette.waves.crest}
        speed={0.22}
        amplitude={2.4}
        waveScale={0.52}
        swell={30}
        turbulence={16}
        tilt={1.16}
        height={4.4}
        fogDepth={17}
        detail="low"
        brightness={1.05}
        opacity={0.82}
        parallaxStrength={0.28}
        grainIntensity={0.03}
      />

      <header className="relative z-10 shrink-0 px-6 pb-1 pt-7 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--text-4)]">
          The commercial operating view
        </p>
        <h1
          className="mt-2.5 text-[38px] leading-none tracking-[-0.01em] text-[var(--text-1)] sm:text-[46px]"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          Control Centres
        </h1>
        <p className="mx-auto mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-[var(--text-3)]">
          Choose the view that helps you make the next decision.
        </p>

        {last && (
          <Link
            href={MODULE_BY_ID[last].href}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--text-2)] transition-colors hover:bg-white/[0.06] hover:text-[var(--text-1)]"
          >
            Resume {MODULE_BY_ID[last].label}
            <ArrowRightIcon size={13} />
          </Link>
        )}
      </header>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <ControlCentreRing initialCard={initialCard} onFrontChange={onFrontChange} />
      </div>
    </div>
  );
}
