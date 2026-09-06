"use client";

import type { CompanyMapNode, MapNodeType } from "@/lib/company-map";
import { DOMAIN_BY_ID, STATUS } from "@/lib/company-map";
import {
  haloColor,
  motionClass,
  nodeFill,
  nodeRing,
  ringWidth,
} from "@/lib/company-map/visuals";

/**
 * The single node marker used by every view. Type decides the glyph, status
 * decides the ring, domain decides the fill, importance decides the size.
 */
export function NodeGlyph({
  type,
  color,
  size,
}: {
  type: MapNodeType;
  color: string;
  size: number;
}) {
  const s = Math.round(size * 0.46);
  const common = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "domain":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" strokeWidth={1.3} />
          <path d="M12 5.5v13M5.5 12h13" />
        </svg>
      );
    case "insight":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2.2" fill={color} stroke="none" />
          <path d="M7.2 16.8a6.8 6.8 0 010-9.6M16.8 7.2a6.8 6.8 0 010 9.6" strokeWidth={1.6} />
        </svg>
      );
    case "event":
      return (
        <svg {...common}>
          <rect x="4.5" y="6" width="15" height="13.5" rx="2" strokeWidth={1.6} />
          <path d="M4.5 10.5h15M9 4.5v3M15 4.5v3" strokeWidth={1.6} />
        </svg>
      );
    case "risk":
      return (
        <svg {...common}>
          <path d="M12 4.8 21 19.2H3z" strokeWidth={1.6} />
          <path d="M12 10.2v3.6" />
          <circle cx="12" cy="16.4" r="0.9" fill={color} stroke="none" />
        </svg>
      );
    case "opportunity":
      return (
        <svg {...common}>
          <path d="M12 3.6l2.3 6.1 6.1 2.3-6.1 2.3L12 20.4l-2.3-6.1L3.6 12l6.1-2.3z" strokeWidth={1.6} />
        </svg>
      );
    case "decision":
      return (
        <svg {...common}>
          <path d="M12 20.5V13M12 13l-6-4.5M12 13l6-4.5" strokeWidth={1.7} />
          <circle cx="5.6" cy="7.4" r="1.9" />
          <circle cx="18.4" cy="7.4" r="1.9" />
        </svg>
      );
    case "initiative":
      return (
        <svg {...common}>
          <path d="M4.5 7.5h11M4.5 12h15M4.5 16.5h8" strokeWidth={1.8} />
        </svg>
      );
    case "entity":
    default:
      return null;
  }
}

type MapNodeProps = {
  node: CompanyMapNode;
  x: number;
  y: number;
  size: number;
  selected?: boolean;
  dimmed?: boolean;
  /** Rotation to cancel so labels stay upright inside the spinning wheel. */
  counterRotate?: number;
  label?: "always" | "hover" | "none";
  /**
   * Multiplies label type size in world units. Views that sit at a low camera
   * scale (the domain fan, the drill-down constellation) pass a value above 1
   * so text is still legible once the world is scaled down to fit.
   */
  labelScale?: number;
  /**
   * Subtitles are hover-only by default — printing a second line under every
   * node is what turns a branch into a wall of text. Views with few nodes and
   * room to breathe can opt back in.
   */
  showSubtitle?: boolean;
  delay?: number;
  onSelect?: () => void;
  onDrillDown?: () => void;
  /** Fires on pointer enter/leave — drives which relationship lines are drawn. */
  onHoverChange?: (hovered: boolean) => void;
  drillable?: boolean;
};

export function MapNode({
  node,
  x,
  y,
  size,
  selected = false,
  dimmed = false,
  counterRotate = 0,
  label = "always",
  labelScale = 1,
  showSubtitle = false,
  delay,
  onSelect,
  onDrillDown,
  onHoverChange,
  drillable = false,
}: MapNodeProps) {
  const domain = DOMAIN_BY_ID[node.domain];
  const ring = nodeRing(node);
  const halo = haloColor(node);
  const glyphColor = node.type === "entity" ? "#0B1F33" : STATUS[node.status].color;
  const motion = dimmed ? "" : motionClass(node);

  return (
    <div
      className="group absolute"
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={() => onHoverChange?.(false)}
      style={{
        left: x,
        top: y,
        opacity: dimmed ? 0.16 : 1,
        transition: "opacity 220ms ease",
        zIndex: selected ? 12 : dimmed ? 1 : 4,
      }}
    >
      {/* The pop-in animation lives on the wrapper so it never fights the
          selected-state transform on the button itself. */}
      <div
        className="node-pop absolute"
        style={{
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          ["--d" as string]: delay != null ? `${delay}s` : "0s",
        }}
      >
      <button
        type="button"
        data-node
        title={node.subtitle ? `${node.label} — ${node.subtitle}` : node.label}
        aria-label={node.label}
        onClick={(e) => {
          e.stopPropagation();
          if (drillable && onDrillDown) {
            onDrillDown();
            return;
          }
          onSelect?.();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (drillable) onDrillDown?.();
        }}
        className={`absolute grid place-items-center rounded-full ${motion}`}
        style={{
          left: 0,
          top: 0,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          ["--halo" as string]: halo,
          background: nodeFill(node),
          border: `${ringWidth(node.status)}px solid ${ring}`,
          boxShadow: selected
            ? `0 0 0 5px color-mix(in srgb, ${halo} 26%, transparent), 0 0 26px color-mix(in srgb, ${halo} 55%, transparent)`
            : `0 2px 12px rgba(11,31,51,0.12)`,
          transform: `scale(${selected ? 1.12 : 1})`,
          transition: "transform 180ms ease, box-shadow 180ms ease",
          cursor: "pointer",
        }}
      >
        <NodeGlyph type={node.type} color={glyphColor} size={size} />
        {drillable && (
          <span
            className="pointer-events-none absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
            style={{ background: domain.color, boxShadow: "0 0 0 2px #ffffff" }}
            aria-hidden
          >
            ›
          </span>
        )}
      </button>
      </div>

      {label !== "none" && (
        <div
          className={`pointer-events-none absolute text-center ${
            label === "hover" && !selected
              ? "opacity-0 group-hover:opacity-100"
              : "opacity-100"
          }`}
          style={{
            left: 0,
            top: 0,
            // Unrotate first, then offset — so labels sit below the node in
            // screen space even while the sky wheel is turning.
            transform: `rotate(${-counterRotate}deg) translate(-50%, ${size / 2 + 8}px)`,
            transformOrigin: "0 0",
            transition: "opacity 180ms ease",
            zIndex: selected ? 13 : 5,
          }}
        >
          {/* Wrapped rather than nowrap: an unbounded label line is what
              collides with the neighbouring branch. */}
          <div
            className="mx-auto font-medium leading-tight"
            style={{
              fontSize: 15 * labelScale,
              maxWidth: Math.max(170, 150 * labelScale),
              color: selected ? "var(--ivory)" : "var(--ivory-2)",
            }}
          >
            {node.label}
          </div>
          {node.subtitle && (
            <div
              className={`mx-auto mt-0.5 leading-snug ${
                showSubtitle || selected
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                fontSize: 11.5 * labelScale,
                maxWidth: Math.max(170, 150 * labelScale),
                color: "var(--ink-2)",
                transition: "opacity 180ms ease",
              }}
            >
              {node.subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
