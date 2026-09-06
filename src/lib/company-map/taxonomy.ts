import type {
  DomainId,
  DomainMeta,
  EdgeType,
  MapNodeType,
  NodeStatus,
} from "./types";

/**
 * Domain colour identity. Six hues are carried over from the previous
 * category palette; Organisation takes a periwinkle so that #EF4444 can be
 * reserved exclusively for `critical` status.
 *
 * Colour channels are kept separate on purpose:
 *   node fill / intra-domain lines → domain colour
 *   node ring, glyph, status edges → status colour
 */
export const DOMAINS: DomainMeta[] = [
  {
    id: "customers",
    label: "Customers",
    subtitle: "value, relationships, retention",
    color: "#C45B6A",
    intro:
      "Where the revenue already lives. Which accounts create value, which are quietly drifting, and which have room to grow before anyone has to sell anything new.",
  },
  {
    id: "growth",
    label: "Growth",
    subtitle: "pipeline, expansion, conversion",
    color: "#C46B3A",
    intro:
      "The revenue creation system. Pipeline quality rather than pipeline volume — what is genuinely moving, what is stalled, and what is blocking the deals that matter.",
  },
  {
    id: "market",
    label: "Market",
    subtitle: "segments, whitespace, routes to market",
    color: "#2B6CB0",
    intro:
      "Where the next book of business comes from. Segments worth owning, accounts worth entering, the routes that get you in the room, and the signals that open a window.",
  },
  {
    id: "delivery",
    label: "Delivery",
    subtitle: "execution, capacity, commitments",
    color: "#0D7A6F",
    intro:
      "The ability to convert signed commitments into live customers and billed revenue. Delivery is where retention is won or lost long before a renewal date.",
  },
  {
    id: "product",
    label: "Product",
    subtitle: "adoption, differentiation, readiness",
    color: "#5B6BA8",
    intro:
      "What customers actually use, what wins competitive deals, and what is ready to carry the next stage of growth. Adoption is the leading indicator for everything else.",
  },
  {
    id: "organisation",
    label: "Organisation",
    subtitle: "ownership, capability, momentum",
    color: "#4A5D8A",
    intro:
      "Who owns what, where capability is thin, and whether the company can execute the plan it has signed up to. Ownership gaps show up as delivery and pipeline gaps a quarter later.",
  },
  {
    id: "capital",
    label: "Capital",
    subtitle: "economics, investment, runway",
    color: "#A67C2D",
    intro:
      "The economics underneath the map. Unit margin, cash conversion, where investment is committed, and which decisions are consuming the runway.",
  },
];

export const DOMAIN_BY_ID: Record<DomainId, DomainMeta> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, DomainMeta>;

export const DOMAIN_IDS: DomainId[] = DOMAINS.map((d) => d.id);

export interface StatusMeta {
  label: string;
  color: string;
  /** Relative visual weight of the status ring, 0–1. */
  weight: number;
}

export const STATUS: Record<NodeStatus, StatusMeta> = {
  healthy: { label: "Healthy", color: "#2F7D5B", weight: 0.25 },
  watch: { label: "Watch", color: "#B8860B", weight: 0.55 },
  risk: { label: "At risk", color: "#C45B1A", weight: 0.8 },
  critical: { label: "Critical", color: "#B42318", weight: 1 },
  opportunity: { label: "Opportunity", color: "#0D7A6F", weight: 0.7 },
  neutral: { label: "Steady", color: "#5B6B7C", weight: 0.15 },
};

/** Statuses that earn motion in the default quiet state. */
export const LIVE_STATUSES: NodeStatus[] = ["critical", "opportunity"];

export interface NodeTypeMeta {
  label: string;
  /** Glyph key consumed by <NodeGlyph />. */
  glyph:
    | "domain"
    | "entity"
    | "signal"
    | "calendar"
    | "warning"
    | "spark"
    | "split"
    | "programme";
  /** Node types that carry a ring in addition to a fill. */
  ring: boolean;
}

export const NODE_TYPES: Record<MapNodeType, NodeTypeMeta> = {
  domain: { label: "Domain", glyph: "domain", ring: true },
  entity: { label: "Entity", glyph: "entity", ring: false },
  insight: { label: "Insight", glyph: "signal", ring: true },
  event: { label: "Event", glyph: "calendar", ring: false },
  risk: { label: "Risk", glyph: "warning", ring: true },
  opportunity: { label: "Opportunity", glyph: "spark", ring: true },
  decision: { label: "Decision", glyph: "split", ring: true },
  initiative: { label: "Initiative", glyph: "programme", ring: false },
};

/** Fallback relationship copy when an edge omits its own label. */
export const EDGE_LABEL: Record<EdgeType, string> = {
  generates: "generates",
  uses: "uses",
  depends_on: "depends on",
  blocks: "blocks",
  influences: "influences",
  owns: "owns",
  sponsors: "sponsors",
  enables: "enables",
  puts_at_risk: "puts at risk",
  requires: "requires",
  validates: "validates",
  competes_with: "competes with",
  introduces: "introduces",
  contributes_to: "contributes to",
};
