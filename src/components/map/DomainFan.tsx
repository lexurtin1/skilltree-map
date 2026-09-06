"use client";

import { useMemo, useState } from "react";
import {
  getDomain,
  groupsForDomain,
  hasConstellation,
  intraDomainLinks,
  nodesForGroup,
  STATUS,
  type CompanyMapNode,
  type DomainId,
} from "@/lib/company-map";
import { nodeSize } from "@/lib/company-map/visuals";
import { MapNode } from "./MapNode";

const FAN_SPAN = (186 * Math.PI) / 180;
const R0 = 260;
const R_BASE = 430;
const R_STEP = 150;

function P(r: number, a: number): [number, number] {
  return [r * Math.sin(a), -r * Math.cos(a)];
}

/**
 * Radius of the outermost node ring. The camera adds its own padding, so this
 * stays the raw geometry rather than a padded guess — an over-padded extent is
 * what pushed the fan to a scale where nothing was readable.
 */
export function domainFanExtent(id: DomainId): number {
  const deepest = groupsForDomain(id).reduce(
    (max, group) => Math.max(max, nodesForGroup(group.id).length),
    0,
  );
  return R_BASE + Math.max(0, deepest - 1) * R_STEP;
}

type DomainFanProps = {
  domainId: DomainId;
  selectedId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDrillDown: (nodeId: string) => void;
  onSelectDomain: () => void;
};

export function DomainFan({
  domainId,
  selectedId,
  onSelectNode,
  onDrillDown,
  onSelectDomain,
}: DomainFanProps) {
  const domain = getDomain(domainId);

  const layout = useMemo(() => {
    const groups = groupsForDomain(domainId);
    const total = groups.reduce((s, group) => s + nodesForGroup(group.id).length, 0);
    const paths: { d: string; opacity: number; delay: number; color?: string }[] = [];
    const junctions: { x: number; y: number; delay: number }[] = [];
    const placed = new Map<string, { node: CompanyMapNode; x: number; y: number; delay: number }>();
    const groupLabels: { id: string; label: string; subtitle?: string; x: number; y: number }[] = [];

    const arc = (r: number, a0: number, a1: number) => {
      const [x0, y0] = P(r, a0);
      const [x1, y1] = P(r, a1);
      return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
    };

    [R0, R_BASE + R_STEP * 0.5, R_BASE + R_STEP * 2, R_BASE + R_STEP * 3.6].forEach((r, i) => {
      paths.push({
        d: arc(r, -FAN_SPAN / 2 - 0.06, FAN_SPAN / 2 + 0.06),
        opacity: 0.06,
        delay: 0.1 + i * 0.07,
      });
    });

    let cursor = -FAN_SPAN / 2;
    groups.forEach((group, gi) => {
      const nodes = nodesForGroup(group.id);
      const span = (FAN_SPAN * nodes.length) / Math.max(1, total);
      const aC = cursor + span / 2;
      const [ex, ey] = P(R0, aC);
      const [rx, ry] = P(66, aC);

      paths.push({
        d: `M ${rx.toFixed(1)} ${ry.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`,
        opacity: 0.24,
        delay: 0.15,
      });
      junctions.push({ x: ex, y: ey, delay: 0.3 });
      groupLabels.push({ id: group.id, label: group.label, subtitle: group.subtitle, x: ex, y: ey });

      let px = ex;
      let py = ey;
      nodes.forEach((node, ni) => {
        const zig = (ni % 2 ? 1 : -1) * Math.min(span * 0.2, 0.07) * (ni ? 1 : 0.45);
        const a = aC + zig;
        const r = R_BASE + ni * R_STEP;
        const [x, y] = P(r, a);
        const delay = 0.3 + ni * 0.07 + gi * 0.05;
        paths.push({
          d: `M ${px.toFixed(1)} ${py.toFixed(1)} L ${x.toFixed(1)} ${y.toFixed(1)}`,
          opacity: 0.1 + node.importance * 0.06,
          delay,
        });
        placed.set(node.id, { node, x, y, delay: delay + 0.1 });
        px = x;
        py = y;
      });

      cursor += span;
    });

    const links = intraDomainLinks(domainId).flatMap((link) => {
      const a = placed.get(link.source);
      const b = placed.get(link.target);
      if (!a || !b) return [];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      return [
        {
          id: link.id,
          d: `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${(mx * 0.62).toFixed(1)} ${(my * 0.62).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`,
          color: STATUS[link.status].color,
          width: 0.8 + link.importance * 0.3,
          source: link.source,
          target: link.target,
        },
      ];
    });

    return { paths, junctions, placed: [...placed.values()], groupLabels, links };
  }, [domainId]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /**
   * Relationship lines are hidden in the default state — showing every link at
   * once turns the fan into a hairball. Only the lines touching the node under
   * the pointer, or the node whose panel is open, are drawn.
   */
  const focusId = hoveredId ?? selectedId;
  const visibleLinks = useMemo(
    () =>
      focusId
        ? layout.links.filter((l) => l.source === focusId || l.target === focusId)
        : [],
    [focusId, layout.links],
  );

  return (
    <div className="relative" style={{ width: 0, height: 0 }}>
      <div
        className="pointer-events-none absolute left-1/2 top-[-190px] -translate-x-1/2 select-none whitespace-nowrap text-[140px] leading-none tracking-[0.12em] text-[rgba(11,31,51,0.04)]"
        
      >
        {domain.label.toUpperCase()}
      </div>

      <svg
        width={4200}
        height={2800}
        viewBox="-2100 -2500 4200 2800"
        className="pointer-events-none absolute overflow-visible"
        style={{ left: -2100, top: -2500 }}
      >
        {layout.paths.map((p, i) => (
          <path
            key={i}
            className="path-draw"
            style={{ ["--d" as string]: `${p.delay}s` }}
            pathLength={1}
            d={p.d}
            fill="none"
            stroke="rgb(var(--lnrgb))"
            strokeOpacity={p.opacity}
            strokeWidth={p.opacity > 0.1 ? 2.2 : 1}
            strokeLinecap="round"
          />
        ))}

        {/* Cross-branch relationships — only for the hovered or selected node */}
        {visibleLinks.map((l) => (
          <path
            key={l.id}
            d={l.d}
            fill="none"
            stroke={l.color}
            strokeOpacity={0.8}
            strokeWidth={l.width * 1.6}
            strokeLinecap="round"
            strokeDasharray="7 9"
          />
        ))}

        {layout.junctions.map((j, i) => (
          <circle
            key={i}
            className="popdot"
            style={{ ["--d" as string]: `${j.delay}s` }}
            cx={j.x}
            cy={j.y}
            r={3.4}
            fill={domain.color}
          />
        ))}
      </svg>

      {/* Domain root */}
      <button
        type="button"
        data-node
        onClick={(e) => {
          e.stopPropagation();
          onSelectDomain();
        }}
        className="node-pop absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
        style={{
          left: 0,
          top: 40,
          width: 74,
          height: 74,
          ["--d" as string]: "0.05s",
          background: "var(--bg-3)",
          border: `2px solid color-mix(in srgb, ${domain.color} 70%, transparent)`,
          boxShadow:
            selectedId === domainId
              ? `0 0 0 7px color-mix(in srgb, ${domain.color} 20%, transparent)`
              : `0 0 0 6px color-mix(in srgb, ${domain.color} 8%, transparent)`,
          cursor: "pointer",
        }}
        aria-label={domain.label}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" fill="none">
          <circle cx={12} cy={12} r={8.5} stroke={domain.color} strokeWidth={1.2} />
          <path d="M12 5v14M5 12h14" stroke={domain.color} strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      </button>

      {/* Branch group labels */}
      {layout.groupLabels.map((group) => (
        <div
          key={group.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: group.x, top: group.y }}
        >
          <div
            className="whitespace-nowrap text-[15px] font-bold uppercase tracking-[0.18em]"
            style={{ color: domain.color, transform: "translateY(-40px)" }}
          >
            {group.label}
          </div>
          {group.subtitle && (
            <div
              className="whitespace-nowrap text-[12px] tracking-[0.02em] text-[var(--ink-3)]"
              style={{ transform: "translateY(-36px)" }}
            >
              {group.subtitle}
            </div>
          )}
        </div>
      ))}

      {layout.placed.map((item) => (
        <MapNode
          key={item.node.id}
          node={item.node}
          x={item.x}
          y={item.y}
          size={nodeSize(item.node)}
          selected={selectedId === item.node.id}
          dimmed={false}
          delay={item.delay}
          // Only the material nodes carry a standing label; the rest name
          // themselves on hover. Visual hierarchy, not a wall of text.
          label={item.node.importance >= 3 ? "always" : "hover"}
          labelScale={1.35}
          drillable={hasConstellation(item.node.id)}
          onSelect={() => onSelectNode(item.node.id)}
          onDrillDown={() => onDrillDown(item.node.id)}
          onHoverChange={(hovered) => setHoveredId(hovered ? item.node.id : null)}
        />
      ))}
    </div>
  );
}
