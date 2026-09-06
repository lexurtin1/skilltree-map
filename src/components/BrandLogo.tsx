"use client";

import Image from "next/image";

type BrandLogoProps = {
  variant?: "mark" | "lockup";
  className?: string;
  /** Pixel height for the image. Width follows intrinsic aspect. */
  height?: number;
  priority?: boolean;
};

const LOCKUP_ASPECT = 1024 / 206;

/** Light-theme Broadridge mark — branching motif in brand blue. */
function BlueMark({ height, className }: { height: number; className?: string }) {
  return (
    <svg
      width={height}
      height={height}
      viewBox="0 0 32 32"
      className={`shrink-0 rounded-sm ${className ?? ""}`}
      aria-hidden
    >
      <rect width="32" height="32" rx="3" fill="#00568F" />
      <path
        d="M16 16 C12 10, 8 8, 6 6 M16 16 C16 9, 18 6, 20 4 M16 16 C22 10, 26 8, 28 6 M16 16 C12 22, 8 24, 6 26 M16 16 C16 23, 18 26, 20 28 M16 16 C22 22, 26 24, 28 26"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Broadridge brand assets — blue SVG mark or full lockup on dark plates. */
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

  return <BlueMark height={height} className={className} />;
}
