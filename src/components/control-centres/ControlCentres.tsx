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
 * A light room with a Broadridge navy gradient for a floor, and nine panels
 * hanging in it. The room is not a separate theme any more — it is the same
 * light product the modules are, which is what lets a panel and the page it
 * opens look like the same object seen at two distances.
 *
 * The heading is the module currently at the front, not the name of the screen.
 * You already know you are in the gallery; what you need to know is what you are
 * looking at, and that changes as the ring turns.
 *
 * The gradient is React Bits' Grainient, ported to TypeScript. It is loaded on
 * demand so `ogl` never reaches a module page, and takes its middle stop from
 * the panel at the front — so the whole room shifts hue as the ring turns while
 * staying, underneath, the same navy gradient.
 */
const Grainient = dynamic(() => import("./Grainient"), {
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

  const palette = MODULE_PALETTE[front];
  const mod = MODULE_BY_ID[front];

  return (
    <div
      className="gi-room gi-room-pool gi-room-vignette relative flex h-full flex-col overflow-hidden"
      style={{ "--pool": palette.glow } as React.CSSProperties}
    >
      <Grainient
        color1={palette.gradient.pale}
        color2={palette.gradient.accent}
        color3={palette.gradient.navy}
        lightMode
        /* Tuned to be a room rather than a picture: slow, low contrast, barely
           saturated, and only a third opaque over the page's own ground. A
           gradient you notice is a gradient competing with the exhibits. */
        timeSpeed={0.1}
        warpStrength={1}
        warpFrequency={3.4}
        warpSpeed={1.1}
        warpAmplitude={72}
        blendAngle={-18}
        blendSoftness={0.34}
        rotationAmount={140}
        noiseScale={1.3}
        grainAmount={0.055}
        grainScale={2.6}
        contrast={1.06}
        saturation={0.94}
        gamma={1.04}
        zoom={1.08}
        centerY={0.06}
        opacity={0.58}
      />

      <header className="relative z-10 shrink-0 px-6 pb-1 pt-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--text-4)]">
          Growth Intelligence
        </p>
        {/* The name of the panel in front, not the name of the room. */}
        <h1
          className="mt-2 text-[40px] leading-none tracking-[-0.015em] text-[var(--text-1)] sm:text-[48px]"
          style={{ fontFamily: "var(--font-serif), Georgia, serif" }}
        >
          {mod.label}
        </h1>
        <p className="mx-auto mt-2.5 max-w-[62ch] text-[13px] leading-relaxed text-[var(--text-3)]">
          {mod.description}
        </p>

        {last && last !== front && (
          <Link
            href={MODULE_BY_ID[last].href}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--text-2)] transition-colors hover:bg-[rgba(0,31,90,0.05)] hover:text-[var(--text-1)]"
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
