"use client";

import Image from "next/image";

type BrandLogoProps = {
  variant?: "mark" | "lockup";
  className?: string;
  /** Pixel height for the image. Width follows intrinsic aspect. */
  height?: number;
  priority?: boolean;
};

const MARK_ASPECT = 910 / 1024;
const LOCKUP_ASPECT = 1024 / 206;

/** Official Broadridge brand assets only — mark or full lockup. */
export function BrandLogo({
  variant = "mark",
  className = "",
  height = 28,
  priority = false,
}: BrandLogoProps) {
  if (variant === "lockup") {
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

  const w = Math.round(height * MARK_ASPECT);
  return (
    <Image
      src="/brand/broadridge-mark.png"
      alt="Broadridge"
      width={w}
      height={height}
      className={`shrink-0 rounded-sm object-contain ${className}`}
      priority={priority}
    />
  );
}
