import { DOMAIN_BY_ID, LIVE_STATUSES, STATUS } from "./taxonomy";
import type { CompanyMapEdge, CompanyMapNode, NodeStatus } from "./types";

/**
 * Visual encoding rules, kept in one place so the sky wheel, the domain fan
 * and the drill-down constellation all read as the same language.
 *
 *   node size    → business materiality (importance)
 *   node fill    → domain identity
 *   node ring    → status
 *   node glyph   → node type
 *   edge width   → materiality / dependency strength
 *   edge colour  → health, risk or opportunity (domain colour when neutral)
 *   edge opacity → confidence and freshness
 *   motion       → only genuinely new, changing or urgent signals
 */

/** Node diameter in world units, by importance, per view scale. */
export function nodeSize(node: Pick<CompanyMapNode, "importance">, scale = 1): number {
  const base = [0, 22, 27, 33, 40, 48][node.importance] ?? 30;
  return Math.round(base * scale);
}

export function edgeWidth(edge: Pick<CompanyMapEdge, "importance">, scale = 1): number {
  return (0.8 + edge.importance * 0.5) * scale;
}

/** Confidence carries most of the weight; unknown freshness costs a little. */
export function edgeOpacity(
  edge: Pick<CompanyMapEdge, "confidence" | "freshness">,
): number {
  const confidence = edge.confidence ?? 0.7;
  const stale = edge.freshness ? 1 : 0.82;
  return Math.max(0.12, Math.min(0.85, confidence * stale));
}

const NEUTRAL_EDGE = "rgb(var(--lnrgb))";

/** Status colours the edge when it carries one; otherwise the domain owns it. */
export function edgeColor(
  edge: Pick<CompanyMapEdge, "status">,
  fallbackDomainColor?: string,
): string {
  if (edge.status && edge.status !== "neutral") return STATUS[edge.status].color;
  return fallbackDomainColor ?? NEUTRAL_EDGE;
}

export function nodeFill(node: Pick<CompanyMapNode, "domain" | "type">): string {
  const color = DOMAIN_BY_ID[node.domain].color;
  // Entities read as solid presence; everything else is a marker on the graph.
  return node.type === "entity" ? color : `color-mix(in srgb, ${color} 22%, #12151d)`;
}

export function nodeRing(node: Pick<CompanyMapNode, "status" | "domain">): string {
  return node.status === "neutral"
    ? `color-mix(in srgb, ${DOMAIN_BY_ID[node.domain].color} 55%, transparent)`
    : STATUS[node.status].color;
}

export function ringWidth(status: NodeStatus): number {
  return 1 + STATUS[status].weight * 2;
}

/** Motion is reserved for urgency and upside — never decoration. */
export function motionClass(node: Pick<CompanyMapNode, "status" | "type">): string {
  if (node.status === "critical") return "cm-urgent";
  if (node.status === "opportunity") return "cm-glow";
  if (node.type === "insight") return "cm-signal";
  return "";
}

export function isLive(status: NodeStatus): boolean {
  return LIVE_STATUSES.includes(status);
}

/** Halo colour behind a selected or focused node. */
export function haloColor(node: Pick<CompanyMapNode, "status" | "domain">): string {
  return node.status === "neutral" || node.status === "healthy"
    ? DOMAIN_BY_ID[node.domain].color
    : STATUS[node.status].color;
}
