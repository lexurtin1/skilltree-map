import { link } from "./build";
import type { CompanyMapEdge } from "./types";

/**
 * Cross-domain edges shown in the default top-level view.
 *
 * One edge per relationship the brief calls out, plus a small number of
 * second-order links. Deliberately capped at 15: these are the connections an
 * executive needs to see without asking, not every relationship that exists.
 * Everything else is revealed on interaction through a node's own connections.
 *
 * Both endpoints of every edge must be a `hot` node, or it will not be drawn
 * on the top-level Map — `surfacedCrossDomainEdges()` filters for that.
 */
export const CROSS_DOMAIN_EDGES: CompanyMapEdge[] = [
  // Customer → Growth: account expansion opportunity
  link("cus-calder", "gro-calder-tier2", "expands into", "generates", 4, { status: "opportunity", confidence: 0.9, freshness: "Updated 2 hours ago" }),

  // Customer → Delivery: implementation and open operational issue
  link("cus-northstar", "del-atlas", "delivered by", "depends_on", 5, { status: "risk", confidence: 0.95, freshness: "Updated 3 hours ago" }),
  link("cus-bramwell", "del-bramwell-recovery", "recovered by", "depends_on", 5, { status: "critical", confidence: 0.95, freshness: "Updated today" }),

  // Customer → Product: module adoption and product gap
  link("cus-exp-crosssell", "prd-insight", "sells", "uses", 4, { status: "opportunity", confidence: 0.8, freshness: "Updated 3 weeks ago" }),

  // Customer → Capital: revenue, margin and renewal exposure
  link("cus-bramwell", "cap-rev-atrisk", "puts at risk", "puts_at_risk", 5, { status: "critical", confidence: 0.9, freshness: "Updated 4 hours ago" }),

  // Growth → Delivery: capacity conditions the close
  link("del-con-specialist", "gro-meridian", "conditions close", "blocks", 5, { status: "critical", confidence: 0.9, freshness: "Updated 3 hours ago" }),

  // Growth → Market: portfolio route into the pipeline
  link("mkt-eco-pe", "gro-route-pe", "introduces", "introduces", 4, { status: "opportunity", confidence: 0.75, freshness: "Updated 1 month ago" }),

  // Market → Product: capability the segment requires
  link("mkt-sig-regulation", "prd-road-regulatory", "requires", "requires", 5, { status: "opportunity", confidence: 0.9, freshness: "Updated 6 weeks ago" }),

  // Product → Capital: investment case tied to segment revenue
  link("prd-road-regulatory", "cap-alloc-awaiting", "requires", "requires", 5, { status: "critical", confidence: 0.9, freshness: "Updated last week" }),

  // Product → Growth: platform readiness gating a deal
  link("prd-health-security", "gro-blk-security", "gates", "blocks", 5, { status: "critical", confidence: 0.85, freshness: "Updated 2 weeks ago" }),

  // Organisation → Delivery: critical-skill dependency
  link("org-talent-key", "del-con-specialist", "staffs", "enables", 5, { status: "critical", confidence: 0.95, freshness: "Updated 3 hours ago" }),

  // Organisation → Growth: unowned initiative starving the expansion route
  link("org-own-noowner", "gro-route-expansion", "accountable for", "owns", 4, { status: "critical", confidence: 0.85, freshness: "Updated 3 hours ago" }),

  // Capital → Organisation: hiring and investment constraints
  link("cap-alloc-awaiting", "org-dec-overdue", "funds", "enables", 5, { status: "critical", confidence: 0.9, freshness: "Updated last week" }),

  // Delivery → Capital: deferred revenue activation
  link("del-mv-golive", "cap-rev-golive", "defers", "puts_at_risk", 5, { status: "risk", confidence: 0.95, freshness: "Updated 3 hours ago" }),

  // Capital → Market: the raise is priced on the segment decision
  link("cap-fund-milestone", "mkt-seg-usfintech", "validates", "validates", 5, { status: "watch", confidence: 0.75, freshness: "Updated 2 weeks ago" }),
];
