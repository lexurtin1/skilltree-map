import { CROSS_DOMAIN_EDGES } from "./cross-links";
import { capital } from "./domains/capital";
import { customers } from "./domains/customers";
import { delivery } from "./domains/delivery";
import { growth } from "./domains/growth";
import { market } from "./domains/market";
import { organisation } from "./domains/organisation";
import { product } from "./domains/product";
import { EXECUTIVE_PULSE } from "./pulse";
import { DOMAINS } from "./taxonomy";
import type {
  CompanyMapEdge,
  CompanyMapGraph,
  CompanyMapNode,
  DomainId,
  DomainMeta,
  MapBranchGroup,
  MapNodeDetail,
} from "./types";

/**
 * The single seam between the Map and its data.
 *
 * Everything the Map renders is read through a `CompanyMapSource`. Today that
 * is `STATIC_SOURCE`, assembled from the files in `domains/`. To move to live
 * data, implement this interface against your API and pass it to
 * `configureCompanyMap()` before the Map mounts — no component changes are
 * required, because components never import the domain files directly.
 *
 * A live implementation would typically:
 *   1. fetch nodes, groups and edges per domain,
 *   2. map API records onto `CompanyMapNode` / `CompanyMapEdge`,
 *   3. keep `id` stable across refreshes so selection and navigation survive,
 *   4. set `hot` from whatever ranking the business uses for "what matters now",
 *   5. populate `detail.evidence[].freshness` from the source system's timestamps.
 *
 * Node ids are the contract. As long as ids are stable and `linkedNodeIds`
 * resolve, the graph, drill-downs and cross-domain navigation all keep working.
 * `danglingReferences()` in `index.ts` is the check for that.
 */
export interface CompanyMapSource {
  /** Centre node. Its `detail` is the default Executive Pulse state. */
  centre(): CompanyMapNode;
  /** Seven top-level domains, in display order around the centre. */
  domains(): DomainMeta[];
  /** Branch groups across all domains. */
  groups(): MapBranchGroup[];
  /** Every node except the centre and the synthesised domain roots. */
  nodes(): CompanyMapNode[];
  /** Intra-domain and cross-domain edges. */
  edges(): CompanyMapEdge[];
  /** Domain-level summary shown when a domain root is selected. */
  domainDetail(id: DomainId): MapNodeDetail;
}

const BUNDLES = {
  customers,
  growth,
  market,
  delivery,
  product,
  organisation,
  capital,
} as const;

/** Demo data. Replace by implementing `CompanyMapSource` against your API. */
export const STATIC_SOURCE: CompanyMapSource = {
  centre: () => EXECUTIVE_PULSE,
  domains: () => DOMAINS,
  groups: () => Object.values(BUNDLES).flatMap((b) => b.groups),
  nodes: () => Object.values(BUNDLES).flatMap((b) => b.nodes),
  edges: () => [
    ...Object.values(BUNDLES).flatMap((b) => b.edges),
    ...CROSS_DOMAIN_EDGES,
  ],
  domainDetail: (id) => BUNDLES[id].detail,
};

let activeSource: CompanyMapSource = STATIC_SOURCE;

/**
 * Swap the data behind the Map. Call once, before the Map mounts. Selectors in
 * `index.ts` read through `getSource()`, so nothing else needs to change.
 */
export function configureCompanyMap(source: CompanyMapSource) {
  activeSource = source;
}

export function getSource(): CompanyMapSource {
  return activeSource;
}

/** Convenience for a source that already has a whole graph in hand. */
export function sourceFromGraph(
  graph: CompanyMapGraph,
  domainDetail: (id: DomainId) => MapNodeDetail,
): CompanyMapSource {
  return {
    centre: () => graph.centre,
    domains: () => graph.domains,
    groups: () => graph.groups,
    nodes: () => graph.nodes.filter((node) => node.type !== "domain" && node.id !== graph.centre.id),
    edges: () => graph.edges,
    domainDetail,
  };
}
