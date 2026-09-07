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
const PRIMARY_ASPECT = 336 / 72;
const MARK_LIGHT_ASPECT = 64.9 / 72;

/**
 * Broadridge logos for light UI use the official primary assets (#001F5A).
 * Assets live as SVGs under /public/brand.
 */
export function BrandLogo({
  variant = "mark",
  className = "",
  height = 28,
  priority = false,
}: BrandLogoProps) {
  if (variant === "lockup" || variant === "lockupOnDark") {
    const w = Math.round(height * PRIMARY_ASPECT);
    return (
      <Image
        src="/brand/broadridge-primary.svg"
        alt="Broadridge"
        width={w}
        height={height}
        className={`object-contain object-left ${className}${variant === "lockupOnDark" ? " brightness-0 invert" : ""}`}
        priority={priority}
      />
    );
  }

  const w = Math.round(height * MARK_LIGHT_ASPECT);
  return (
    <Image
      src="/brand/broadridge-mark-light.svg"
      alt="Broadridge"
      width={w}
      height={height}
      className={`shrink-0 object-contain ${className}`}
      priority={priority}
    />
  );
}
