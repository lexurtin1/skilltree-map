import { EXECUTIVE_PULSE } from "./pulse";
import { getSource } from "./source";
import { DOMAIN_BY_ID, EDGE_LABEL, NODE_TYPES, STATUS } from "./taxonomy";
import type {
  CompanyMapEdge,
  CompanyMapGraph,
  CompanyMapNode,
  DomainId,
  DomainMeta,
  MapBranchGroup,
} from "./types";

export * from "./types";
export {
  DOMAINS,
  DOMAIN_BY_ID,
  EDGE_LABEL,
  LIVE_STATUSES,
  NODE_TYPES,
  STATUS,
} from "./taxonomy";
export { EXECUTIVE_PULSE, PULSE_SUMMARY } from "./pulse";
export {
  configureCompanyMap,
  sourceFromGraph,
  STATIC_SOURCE,
  type CompanyMapSource,
} from "./source";

/* ── Graph assembly ───────────────────────────────────────────────────────
   Everything is read through the configured `CompanyMapSource`, so swapping
   demo data for an API is a one-line change in application setup. Indexes are
   built once; call `rebuildCompanyMap()` after `configureCompanyMap()`. */

type Indexes = {
  graph: CompanyMapGraph;
  nodeById: Map<string, CompanyMapNode>;
  groupById: Map<string, MapBranchGroup>;
  groupsByDomain: Map<DomainId, MapBranchGroup[]>;
  nodesByParent: Map<string, CompanyMapNode[]>;
  edgesByNode: Map<string, CompanyMapEdge[]>;
  crossDomainEdges: CompanyMapEdge[];
};

const STATUS_RANK: Record<CompanyMapNode["status"], number> = {
  critical: 5,
  risk: 4,
  watch: 3,
  opportunity: 2,
  healthy: 1,
  neutral: 0,
};

function build(): Indexes {
  const source = getSource();
  const centre = source.centre();
  const domains = source.domains();
  const groups = source.groups();
  const contentNodes = source.nodes();
  const edges = source.edges();

  /** A domain inherits the worst status carried by any of its surfaced nodes. */
  const domainStatus = (id: DomainId): CompanyMapNode["status"] => {
    let worst: CompanyMapNode["status"] = "neutral";
    for (const node of contentNodes) {
      if (node.domain !== id || !node.hot) continue;
      if (STATUS_RANK[node.status] > STATUS_RANK[worst]) worst = node.status;
    }
    return worst;
  };

  /** Domain roots, synthesised from metadata so labels live in one place. */
  const domainNodes: CompanyMapNode[] = domains.map((meta) => ({
    id: meta.id,
    label: meta.label,
    subtitle: meta.subtitle,
    domain: meta.id,
    type: "domain",
    status: domainStatus(meta.id),
    importance: 5,
    parentId: centre.id,
    detail: source.domainDetail(meta.id),
  }));

  const nodes = [centre, ...domainNodes, ...contentNodes];

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const groupById = new Map(groups.map((group) => [group.id, group]));

  const groupsByDomain = new Map<DomainId, MapBranchGroup[]>();
  for (const group of groups) {
    const list = groupsByDomain.get(group.domain) ?? [];
    list.push(group);
    groupsByDomain.set(group.domain, list);
  }

  const nodesByParent = new Map<string, CompanyMapNode[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const list = nodesByParent.get(node.parentId) ?? [];
    list.push(node);
    nodesByParent.set(node.parentId, list);
  }

  const edgesByNode = new Map<string, CompanyMapEdge[]>();
  for (const edge of edges) {
    for (const id of [edge.source, edge.target]) {
      const list = edgesByNode.get(id) ?? [];
      list.push(edge);
      edgesByNode.set(id, list);
    }
  }

  const crossDomainEdges = edges.filter((edge) => {
    const a = nodeById.get(edge.source);
    const b = nodeById.get(edge.target);
    return Boolean(a && b && a.domain !== b.domain);
  });

  return {
    graph: { centre, domains, groups, nodes, edges },
    nodeById,
    groupById,
    groupsByDomain,
    nodesByParent,
    edgesByNode,
    crossDomainEdges,
  };
}

let idx = build();

/** Rebuild the indexes after swapping the data source. */
export function rebuildCompanyMap() {
  idx = build();
}

export const COMPANY_MAP: CompanyMapGraph = idx.graph;

export function getNode(id: string): CompanyMapNode | undefined {
  return idx.nodeById.get(id);
}

export function getGroup(id: string): MapBranchGroup | undefined {
  return idx.groupById.get(id);
}

export function getDomain(id: DomainId): DomainMeta {
  return DOMAIN_BY_ID[id];
}

export function domainColor(id: DomainId): string {
  return DOMAIN_BY_ID[id].color;
}

export function groupsForDomain(id: DomainId): MapBranchGroup[] {
  return idx.groupsByDomain.get(id) ?? [];
}

export function nodesForGroup(groupId: string): CompanyMapNode[] {
  return idx.nodesByParent.get(groupId) ?? [];
}

/** Satellites of an entity — its own drill-down constellation. */
export function childrenOf(nodeId: string): CompanyMapNode[] {
  return idx.nodesByParent.get(nodeId) ?? [];
}

export function hasConstellation(nodeId: string): boolean {
  return childrenOf(nodeId).length > 0 && !idx.groupById.has(nodeId);
}

/** The 3–5 nodes per domain surfaced on the top-level Map. */
export function hotNodesForDomain(id: DomainId): CompanyMapNode[] {
  return groupsForDomain(id)
    .flatMap((group) => nodesForGroup(group.id))
    .filter((node) => node.hot)
    .sort((a, b) => b.importance - a.importance);
}

export function edgesForNode(nodeId: string): CompanyMapEdge[] {
  return idx.edgesByNode.get(nodeId) ?? [];
}

export type Connection = {
  node: CompanyMapNode;
  relationship: string;
  direction: "outbound" | "inbound" | "related";
  edge?: CompanyMapEdge;
};

/**
 * Everything reachable from a node in one hop: explicit edges in either
 * direction, plus the softer `linkedNodeIds` associations. Direct satellites
 * are excluded — the graph already shows those.
 */
export function connectionsForNode(nodeId: string): Connection[] {
  const node = getNode(nodeId);
  if (!node) return [];
  const seen = new Set<string>([nodeId]);
  const out: Connection[] = [];
  const childIds = new Set(childrenOf(nodeId).map((c) => c.id));

  for (const edge of edgesForNode(nodeId)) {
    const otherId = edge.source === nodeId ? edge.target : edge.source;
    if (seen.has(otherId) || childIds.has(otherId)) continue;
    const other = getNode(otherId);
    if (!other) continue;
    seen.add(otherId);
    out.push({
      node: other,
      relationship: edge.relationship || EDGE_LABEL[edge.type],
      direction: edge.source === nodeId ? "outbound" : "inbound",
      edge,
    });
  }

  for (const linkedId of node.linkedNodeIds ?? []) {
    if (seen.has(linkedId) || childIds.has(linkedId)) continue;
    const other = getNode(linkedId);
    if (!other) continue;
    seen.add(linkedId);
    out.push({ node: other, relationship: "connected to", direction: "related" });
  }

  return out.sort((a, b) => b.node.importance - a.node.importance);
}

/** Cross-domain edges whose endpoints are both surfaced on the top-level Map. */
export function surfacedCrossDomainEdges(): CompanyMapEdge[] {
  const surfaced = new Set(
    idx.graph.domains.flatMap((d) => hotNodesForDomain(d.id)).map((node) => node.id),
  );
  return idx.crossDomainEdges.filter(
    (edge) => surfaced.has(edge.source) && surfaced.has(edge.target),
  );
}

export type DomainLink = {
  id: string;
  source: string;
  target: string;
  status: CompanyMapNode["status"];
  importance: CompanyMapNode["importance"];
};

/**
 * The few relationships worth drawing inside a single domain view: links that
 * cross branch groups, ranked by materiality and capped so the fan stays legible.
 */
export function intraDomainLinks(id: DomainId, limit = 8): DomainLink[] {
  const groupIds = new Set(groupsForDomain(id).map((group) => group.id));
  const top = groupsForDomain(id).flatMap((group) => nodesForGroup(group.id));
  const byId = new Map(top.map((node) => [node.id, node]));
  const seen = new Set<string>();
  const links: DomainLink[] = [];

  for (const node of top) {
    for (const linkedId of node.linkedNodeIds ?? []) {
      const other = byId.get(linkedId);
      if (!other || other.parentId === node.parentId) continue;
      if (!groupIds.has(other.parentId ?? "")) continue;
      const key = [node.id, other.id].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      links.push({
        id: key,
        source: node.id,
        target: other.id,
        status: node.importance >= other.importance ? node.status : other.status,
        importance: Math.max(
          node.importance,
          other.importance,
        ) as CompanyMapNode["importance"],
      });
    }
  }

  return links.sort((a, b) => b.importance - a.importance).slice(0, limit);
}

export type Crumb = {
  id: string;
  label: string;
  kind: "pulse" | "domain" | "group" | "node";
};

/** Ancestor trail for a node, root first. Used by the Map breadcrumb. */
export function trailFor(nodeId: string): Crumb[] {
  const crumbs: Crumb[] = [];
  let cursor: string | undefined = nodeId;
  const guard = new Set<string>();

  while (cursor && !guard.has(cursor)) {
    guard.add(cursor);
    const group = idx.groupById.get(cursor);
    if (group) {
      crumbs.unshift({ id: group.id, label: group.label, kind: "group" });
      cursor = group.domain;
      continue;
    }
    const node: CompanyMapNode | undefined = getNode(cursor);
    if (!node) break;
    crumbs.unshift({
      id: node.id,
      label: node.label,
      kind:
        node.id === EXECUTIVE_PULSE.id
          ? "pulse"
          : node.type === "domain"
            ? "domain"
            : "node",
    });
    cursor = node.parentId;
  }

  return crumbs;
}

/** Node status → the ring colour used everywhere it is drawn. */
export function statusColor(node: Pick<CompanyMapNode, "status">): string {
  return STATUS[node.status].color;
}

export function typeMeta(node: Pick<CompanyMapNode, "type">) {
  return NODE_TYPES[node.type];
}

/**
 * Integrity check for a data source: surfaces ids referenced by
 * `linkedNodeIds` or edges that do not resolve to a node. Run it after
 * swapping in an API-backed source.
 */
export function danglingReferences(): string[] {
  const missing = new Set<string>();
  for (const node of idx.graph.nodes) {
    for (const id of node.linkedNodeIds ?? []) {
      if (!idx.nodeById.has(id)) missing.add(`${node.id} → ${id}`);
    }
  }
  for (const edge of idx.graph.edges) {
    if (!idx.nodeById.has(edge.source)) missing.add(`edge source ${edge.source}`);
    if (!idx.nodeById.has(edge.target)) missing.add(`edge target ${edge.target}`);
  }
  return [...missing];
}
