/**
 * Company Map — typed domain model.
 *
 * The Map is an executive surface: it answers what matters now, what changed,
 * what is at risk or emerging, what is connected, and where to intervene.
 * Every label rendered on the graph comes from this model — components never
 * hard-code business copy.
 */

export type DomainId =
  | "customers"
  | "growth"
  | "market"
  | "delivery"
  | "product"
  | "organisation"
  | "capital";

export type MapNodeType =
  | "domain"
  | "entity"
  | "insight"
  | "event"
  | "risk"
  | "opportunity"
  | "decision"
  | "initiative";

export type NodeStatus =
  | "healthy"
  | "watch"
  | "risk"
  | "critical"
  | "opportunity"
  | "neutral";

/** 1 = background detail, 5 = board-level materiality. Drives node size. */
export type Importance = 1 | 2 | 3 | 4 | 5;

export type EdgeType =
  | "generates"
  | "uses"
  | "depends_on"
  | "blocks"
  | "influences"
  | "owns"
  | "sponsors"
  | "enables"
  | "puts_at_risk"
  | "requires"
  | "validates"
  | "competes_with"
  | "introduces"
  | "contributes_to";

export interface MapEvidence {
  source: string;
  label: string;
  freshness?: string;
}

export interface MapMetric {
  label: string;
  value: string;
  /** Signed movement, e.g. "+6% QoQ" or "−11% MoM". */
  delta?: string;
  tone?: NodeStatus;
}

export interface MapNodeDetail {
  headline?: string;
  summary?: string;
  movement?: string;
  recommendedAction?: string;
  owner?: string;
  dueDate?: string;
  metrics?: MapMetric[];
  evidence?: MapEvidence[];
}

export interface CompanyMapNode {
  id: string;
  label: string;
  subtitle?: string;
  domain: DomainId;
  type: MapNodeType;
  status: NodeStatus;
  importance: Importance;
  /** Branch group id, or the id of the entity this node hangs off in a drill-down. */
  parentId?: string;
  linkedNodeIds?: string[];
  /** Surfaced on the top-level Map. Capped at 3–5 per domain by convention. */
  hot?: boolean;
  /** Title used when this node is opened as its own constellation. */
  constellationTitle?: string;
  detail?: MapNodeDetail;
}

export interface CompanyMapEdge {
  id: string;
  source: string;
  target: string;
  /** Human relationship label rendered on the graph, e.g. "governed by". */
  relationship: string;
  type: EdgeType;
  importance: Importance;
  status?: NodeStatus;
  /** 0–1. Drives edge opacity together with freshness. */
  confidence?: number;
  freshness?: string;
}

/** A named cluster of child nodes inside a domain — one arm of the domain fan. */
export interface MapBranchGroup {
  id: string;
  domain: DomainId;
  label: string;
  subtitle?: string;
}

export interface DomainMeta {
  id: DomainId;
  label: string;
  subtitle: string;
  color: string;
  /** One-paragraph framing shown when the domain is opened. */
  intro: string;
}

export interface CompanyMapGraph {
  centre: CompanyMapNode;
  domains: DomainMeta[];
  groups: MapBranchGroup[];
  nodes: CompanyMapNode[];
  edges: CompanyMapEdge[];
}
