/**
 * Authoring helpers for the Company Map.
 *
 * Domain files describe *content* only — ids, labels, status, materiality and
 * relationships. Positions, colours and glyphs are derived downstream, so a
 * new branch never requires a component change.
 */
import type {
  CompanyMapEdge,
  CompanyMapNode,
  DomainId,
  EdgeType,
  Importance,
  MapBranchGroup,
  MapEvidence,
  MapNodeDetail,
  MapNodeType,
  NodeStatus,
} from "./types";

export type NodeSpec = Omit<CompanyMapNode, "domain" | "parentId"> & {
  /** Drill-down satellites — rendered as this node's own constellation. */
  children?: SatelliteSpec[];
};

export type SatelliteSpec = {
  relationship: string;
  edgeType: EdgeType;
  node: NodeSpec;
};

export type GroupSpec = {
  id: string;
  label: string;
  subtitle?: string;
  nodes: NodeSpec[];
};

export type DomainBundle = {
  groups: MapBranchGroup[];
  nodes: CompanyMapNode[];
  edges: CompanyMapEdge[];
  detail: MapNodeDetail;
};

/** Node. `subtitle` is positional because nearly every node carries one. */
export function n(
  id: string,
  label: string,
  subtitle: string,
  type: MapNodeType,
  status: NodeStatus,
  importance: Importance,
  detail?: MapNodeDetail,
  extra: Partial<NodeSpec> = {},
): NodeSpec {
  return {
    id,
    label,
    subtitle: subtitle || undefined,
    type,
    status,
    importance,
    detail,
    ...extra,
  };
}

/** Wrap a node as a drill-down satellite of its parent entity. */
export function s(
  relationship: string,
  edgeType: EdgeType,
  node: NodeSpec,
): SatelliteSpec {
  return { relationship, edgeType, node };
}

/** Branch group — one arm of the domain fan. */
export function g(
  id: string,
  label: string,
  subtitle: string,
  nodes: NodeSpec[],
): GroupSpec {
  return { id, label, subtitle: subtitle || undefined, nodes };
}

/** Detail payload for a node's contextual panel. */
export function D(
  headline: string,
  summary: string,
  rest: Omit<MapNodeDetail, "headline" | "summary"> = {},
): MapNodeDetail {
  return { headline, summary, ...rest };
}

/** Evidence row — where the statement came from and how fresh it is. */
export function E(
  source: string,
  label: string,
  freshness?: string,
): MapEvidence {
  return { source, label, freshness };
}

export function link(
  source: string,
  target: string,
  relationship: string,
  type: EdgeType,
  importance: Importance,
  opts: Partial<Pick<CompanyMapEdge, "status" | "confidence" | "freshness">> = {},
): CompanyMapEdge {
  return {
    id: `${source}->${target}`,
    source,
    target,
    relationship,
    type,
    importance,
    confidence: 0.8,
    ...opts,
  };
}

function flatten(
  domain: DomainId,
  parentId: string,
  specs: NodeSpec[],
  out: { nodes: CompanyMapNode[]; edges: CompanyMapEdge[] },
) {
  for (const spec of specs) {
    const { children, ...rest } = spec;
    out.nodes.push({ ...rest, domain, parentId });
    if (!children?.length) continue;
    for (const child of children) {
      out.edges.push(
        link(
          spec.id,
          child.node.id,
          child.relationship,
          child.edgeType,
          child.node.importance,
          { status: child.node.status },
        ),
      );
      flatten(domain, spec.id, [child.node], out);
    }
  }
}

export function defineDomain(
  domain: DomainId,
  detail: MapNodeDetail,
  groups: GroupSpec[],
  edges: CompanyMapEdge[] = [],
): DomainBundle {
  const out = { nodes: [] as CompanyMapNode[], edges: [...edges] };
  const groupRecords: MapBranchGroup[] = groups.map((group) => ({
    id: group.id,
    domain,
    label: group.label,
    subtitle: group.subtitle,
  }));
  for (const group of groups) flatten(domain, group.id, group.nodes, out);
  return { groups: groupRecords, nodes: out.nodes, edges: out.edges, detail };
}
