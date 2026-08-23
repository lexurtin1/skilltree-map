"use client";

import { useMemo } from "react";

export function Starfield({ count = 90 }: { count?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const r = seed / 233280;
      const r2 = ((i * 233 + 17) % 1000) / 1000;
      return {
        left: `${r * 100}%`,
        top: `${r2 * 100}%`,
        size: 1 + (i % 3) * 0.6,
        delay: `${(i % 12) * 0.4}s`,
        opacity: 0.2 + (i % 5) * 0.1,
      };
    });
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-[-100px] overflow-hidden" aria-hidden>
      {stars.map((s, i) => (
        <i
          key={i}
          className="bgstar"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
