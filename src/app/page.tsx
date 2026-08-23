"use client";

import dynamic from "next/dynamic";

const MapExperience = dynamic(
  () =>
    import("@/components/map/MapExperience").then((m) => m.MapExperience),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-[12px] tracking-[0.2em] text-[var(--ink-3)]">
        LOADING MAP
      </div>
    ),
  },
);

export default function MapPage() {
  return <MapExperience />;
}
