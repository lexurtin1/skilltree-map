"use client";

import Image from "next/image";

type BrandLogoProps = {
  /**
   * mark — official square emblem
   * lockup — official mark + wordmark for light surfaces (no black plate)
   * lockupOnDark — full PNG lockup (black background baked in; dark surfaces only)
   */
  variant?: "mark" | "lockup" | "lockupOnDark";
  className?: string;
  /** Pixel height for the image / mark. */
  height?: number;
  priority?: boolean;
};

const MARK_ASPECT = 910 / 1024;
const LOCKUP_ASPECT = 1024 / 206;

/** Official Broadridge brand assets. */
export function BrandLogo({
  variant = "mark",
  className = "",
  height = 28,
  priority = false,
}: BrandLogoProps) {
  if (variant === "lockupOnDark") {
    const w = Math.round(height * LOCKUP_ASPECT);
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

  const markW = Math.round(height * MARK_ASPECT);
  const mark = (
    <Image
      src="/brand/broadridge-mark.png"
      alt={variant === "mark" ? "Broadridge" : ""}
      width={markW}
      height={height}
      className={`shrink-0 rounded-sm object-contain ${variant === "mark" ? className : ""}`}
      aria-hidden={variant !== "mark"}
      priority={priority}
    />
  );

  if (variant === "mark") return mark;

  // Light-surface lockup: official mark + navy wordmark (matches brand, no black box)
  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      role="img"
      aria-label="Broadridge"
    >
      {mark}
      <span
        className="font-semibold tracking-tight text-[var(--copper)]"
        style={{ fontSize: Math.round(height * 0.55), lineHeight: 1 }}
      >
        Broadridge
        <sup className="ml-0.5 text-[0.45em] font-normal">®</sup>
      </span>
    </span>
  );
}
