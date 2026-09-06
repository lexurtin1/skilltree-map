"use client";

import Image from "next/image";

type BrandLogoProps = {
  /**
   * mark — official navy mark for light surfaces
   * lockup — official primary lockup (navy on transparent) for light surfaces
   * lockupOnDark — user-provided black-background lockup (dark plates only)
   */
  variant?: "mark" | "lockup" | "lockupOnDark";
  className?: string;
  height?: number;
  priority?: boolean;
};

/** Official Broadridge primary lockup aspect (viewBox content ~336×72). */
const PRIMARY_ASPECT = 597 / 128;
const MARK_LIGHT_ASPECT = 1083 / 1200;
const DARK_LOCKUP_ASPECT = 1024 / 206;

/**
 * Broadridge logos for light UI use the official primary assets (#001F5A).
 * The black/navy split PNGs are dark-surface assets and must not be used on pale pages.
 */
export function BrandLogo({
  variant = "mark",
  className = "",
  height = 28,
  priority = false,
}: BrandLogoProps) {
  if (variant === "lockupOnDark") {
    const w = Math.round(height * DARK_LOCKUP_ASPECT);
    return (
      <Image
        src="/brand/broadridge-lockup.png"
        alt="Broadridge"
        width={w}
        height={height}
        className={`object-contain object-left ${className}`}
        priority={priority}
      />
    );
  }

  if (variant === "lockup") {
    const w = Math.round(height * PRIMARY_ASPECT);
    return (
      <Image
        src="/brand/broadridge-primary.png"
        alt="Broadridge"
        width={w}
        height={height}
        className={`object-contain object-left ${className}`}
        priority={priority}
      />
    );
  }

  const w = Math.round(height * MARK_LIGHT_ASPECT);
  return (
    <Image
      src="/brand/broadridge-mark-light.png"
      alt="Broadridge"
      width={w}
      height={height}
      className={`shrink-0 object-contain ${className}`}
      priority={priority}
    />
  );
}
