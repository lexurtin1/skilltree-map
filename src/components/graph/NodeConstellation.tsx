"use client";

import { useMemo } from "react";
import {
  childrenOf,
  connectionsForNode,
  DOMAIN_BY_ID,
  edgesForNode,
  getNode,
  hasConstellation,
  STATUS,
  type CompanyMapNode,
} from "@/lib/company-map";
import { edgeOpacity, edgeWidth, nodeSize } from "@/lib/company-map/visuals";
import { MapNode } from "./MapNode";

const R_SAT = 430;
const R_LINK = 720;
export const CONSTELLATION_EXTENT = R_LINK + 120;

type NodeConstellationProps = {
  nodeId: string;
  selectedId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDrillDown: (nodeId: string) => void;
  onFollow: (nodeId: string) => void;
};

/**
 * Drill-down for a single entity: the thing itself at the centre, everything
 * it is made of around it, and the cross-domain connections it participates in
 * on the outer ring.
 */
export function NodeConstellation({
  nodeId,
  selectedId,
  onSelectNode,
  onDrillDown,
  onFollow,
}: NodeConstellationProps) {
  const centre = getNode(nodeId);

  const layout = useMemo(() => {
    if (!centre) return null;
    const satellites = childrenOf(nodeId);
    const relationships = new Map<string, string>();
    for (const edge of edgesForNode(nodeId)) {
      if (edge.source === nodeId) relationships.set(edge.target, edge.relationship);
    }

    const satCount = Math.max(1, satellites.length);
    const placedSats = satellites.map((node, i) => {
      const a = (i / satCount) * Math.PI * 2 - Math.PI / 2;
      return {
        node,
        x: R_SAT * Math.cos(a),
        y: R_SAT * Math.sin(a),
        relationship: relationships.get(node.id) ?? "part of",
        delay: 0.18 + i * 0.045,
      };
    });

    const satIds = new Set(satellites.map((s) => s.id));
    const external = connectionsForNode(nodeId).filter(
      (c) => !satIds.has(c.node.id) && c.node.id !== centre.parentId,
    );
    const extCount = Math.max(1, external.length);
    const placedExternal = external.map((connection, i) => {
      const a = (i / extCount) * Math.PI * 2 - Math.PI / 2 + Math.PI / extCount;
      return {
        connection,
        x: R_LINK * Math.cos(a),
        y: R_LINK * Math.sin(a),
        delay: 0.45 + i * 0.04,
      };
    });

    return { placedSats, placedExternal };
  }, [centre, nodeId]);

  if (!centre || !layout) return null;


  return (
    <div className="relative" style={{ width: 0, height: 0 }}>
      <div
        className="pointer-events-none absolute left-1/2 top-[-1000px] -translate-x-1/2 select-none whitespace-nowrap text-[104px] font-semibold leading-none tracking-tight text-[rgba(11,31,51,0.04)]"
      >
        {centre.constellationTitle ?? "Constellation"}
      </div>

      <svg
        width={2400}
        height={2400}
        viewBox="-1200 -1200 2400 2400"
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -1200, top: -1200 }}
      >
        <circle
          r={R_SAT}
          fill="none"
          stroke="rgb(var(--lnrgb))"
          strokeOpacity={0.35}
          strokeDasharray="1 12"
        />
        <circle
          r={R_LINK}
          fill="none"
          stroke="rgb(var(--lnrgb))"
          strokeOpacity={0.04}
          strokeDasharray="1 16"
        />

        {layout.placedSats.map((sat) => (
          <path
            key={`edge-${sat.node.id}`}
            className="path-draw"
            style={{ ["--d" as string]: `${sat.delay}s` }}
            pathLength={1}
            d={`M 0 0 L ${sat.x.toFixed(1)} ${sat.y.toFixed(1)}`}
            fill="none"
            stroke={STATUS[sat.node.status].color}
            strokeOpacity={sat.node.status === "neutral" ? 0.22 : 0.42}
            strokeWidth={edgeWidth({ importance: sat.node.importance })}
            strokeLinecap="round"
          />
        ))}

        {layout.placedExternal.map((item) => (
          <path
            key={`link-${item.connection.node.id}`}
            d={`M ${(item.x * 0.55).toFixed(1)} ${(item.y * 0.55).toFixed(1)} L ${item.x.toFixed(1)} ${item.y.toFixed(1)}`}
            fill="none"
            stroke={DOMAIN_BY_ID[item.connection.node.domain].color}
            strokeOpacity={item.connection.edge ? edgeOpacity(item.connection.edge) * 0.5 : 0.22}
            strokeWidth={1.4}
            strokeDasharray="5 8"
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Relationship labels on the spokes */}
      {layout.placedSats.map((sat) => (
        <div
          key={`rel-${sat.node.id}`}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          style={{ left: sat.x * 0.52, top: sat.y * 0.52, zIndex: 6 }}
        >
          <span
            className="rounded px-1.5 py-0.5 text-[15px] tracking-[0.08em] text-[var(--ink-2)]"
            style={{ background: "var(--bg-3)", border: "1px solid var(--line)", boxShadow: "0 4px 16px rgba(11,31,51,0.1)" }}
          >
            {sat.relationship}
          </span>
        </div>
      ))}

      {/* Centre */}
      <MapNode
        node={centre}
        x={0}
        y={0}
        size={Math.round(nodeSize(centre) * 1.6)}
        selected={selectedId === centre.id}
        label="always"
        labelScale={1.35}
        delay={0.05}
        onSelect={() => onSelectNode(centre.id)}
      />

      {layout.placedSats.map((sat) => (
        <MapNode
          key={sat.node.id}
          node={sat.node}
          x={sat.x}
          y={sat.y}
          size={nodeSize(sat.node, 0.9)}
          selected={selectedId === sat.node.id}
          delay={sat.delay}
          label="always"
          labelScale={1.35}
          showSubtitle
          drillable={hasConstellation(sat.node.id)}
          onSelect={() => onSelectNode(sat.node.id)}
          onDrillDown={() => onDrillDown(sat.node.id)}
        />
      ))}

      {/* Outer ring — where this node connects into other domains */}
      {layout.placedExternal.map((item) => (
        <ExternalNode
          key={item.connection.node.id}
          node={item.connection.node}
          relationship={item.connection.relationship}
          x={item.x}
          y={item.y}
          delay={item.delay}
          selected={selectedId === item.connection.node.id}
          sameDomain={item.connection.node.domain === centre.domain}
          onFollow={() => onFollow(item.connection.node.id)}
        />
      ))}

      <div
        className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-center"
        style={{ left: 0, top: -R_LINK - 150 }}
      >
        <p className="text-[10px] font-bold tracking-[0.22em]" style={{ color: "var(--copper)" }}>
          {(centre.constellationTitle ?? "CONSTELLATION").toUpperCase()}
        </p>
      </div>
    </div>
  );
}

function ExternalNode({
  node,
  relationship,
  x,
  y,
  delay,
  selected,
  sameDomain,
  onFollow,
}: {
  node: CompanyMapNode;
  relationship: string;
  x: number;
  y: number;
  delay: number;
  selected: boolean;
  sameDomain: boolean;
  onFollow: () => void;
}) {
  const domain = DOMAIN_BY_ID[node.domain];
  return (
    <button
      type="button"
      data-node
      onClick={(e) => {
        e.stopPropagation();
        onFollow();
      }}
      className="node-pop absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-2 text-left  transition hover:scale-[1.04]"
      style={{
        left: x,
        top: y,
        ["--d" as string]: `${delay}s`,
        maxWidth: 330,
        background: "var(--bg-3)",
        borderColor: selected
          ? domain.color
          : `color-mix(in srgb, ${domain.color} 35%, transparent)`,
        boxShadow: selected ? `0 0 0 4px color-mix(in srgb, ${domain.color} 18%, transparent)` : "none",
        zIndex: 5,
      }}
    >
      <span className="flex items-center gap-1.5">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: STATUS[node.status].color }}
        />
        <span
          className="text-[13px] font-bold uppercase tracking-[0.16em]"
          style={{ color: "var(--copper)" }}
        >
          {sameDomain ? relationship : domain.label}
        </span>
      </span>
      <span className="mt-1 block text-[17px] font-medium leading-tight text-[var(--ivory)]">
        {node.label}
      </span>
      {node.subtitle && (
        <span className="mt-0.5 block text-[14px] leading-snug text-[var(--ink-2)]">
          {node.subtitle}
        </span>
      )}
    </button>
  );
}
