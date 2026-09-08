/**
 * Derivations for the gallery visualisations.
 *
 * `series.ts` answers "how has this moved"; this file answers "what shape is
 * this". Both read only through `select.ts`, and neither invents anything: where
 * the ontology cannot support a figure, the function returns nothing rather than
 * a plausible number.
 *
 * The nine dashboards each ask a different question, so each gets its own
 * derivation here rather than a shared summariser. That is the point — a
 * portfolio is a hierarchy, a market is a place, provenance is a flow, and
 * flattening them all into the same six tiles was what made the wall of cards
 * read as one card repeated nine times.
 */
import {
  allAccounts,
  allEvents,
  allEvidence,
  allHypotheses,
  allOpportunities,
  allPeople,
  allServiceRelationships,
  dataset,
  getHypothesis,
  getOpportunity,
  marketsForAccount,
  recentEvents,
  sourcesForEvidence,
} from "./select";
import { marketActivity } from "./metrics";
import { priorityFor } from "./score";
import { MARKET_BY_ID, MARKETS, REGIONS, SOURCE_KINDS, STATE_MARKERS } from "./taxonomy";
import type { EvidenceState, Region, SourceKind } from "./types";

/* ── Growth: the shape of the portfolio's priority ────────────────────────── */

export interface SwarmAccount {
  id: string;
  label: string;
  x: number;
  filled: boolean;
  called: boolean;
}

/**
 * Every account on the 0–100 priority axis.
 *
 * Filled means Broadridge already serves them, which changes what "high
 * priority" means: a high score against an existing client is an expansion
 * conversation, the same score against a prospect is a cold approach.
 */
export function prioritySwarm(named = 3): SwarmAccount[] {
  const scored = allAccounts().map((a) => ({
    id: a.id,
    label: a.name,
    x: priorityFor(a.id).total,
    filled: a.relationship === "existing-client",
  }));
  const cutoff = [...scored].sort((a, b) => b.x - a.x).slice(0, named).map((s) => s.id);
  return scored.map((s) => ({ ...s, called: cutoff.includes(s.id) }));
}

/** The highest-scoring hypotheses, as reasons rather than as scores. */
export function topReasons(limit = 3) {
  return allHypotheses()
    .map((h) => ({ h, score: priorityFor(h.accountId, h).total }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ h, score }) => ({
      id: h.id,
      accountId: h.accountId,
      account: allAccounts().find((a) => a.id === h.accountId)?.name ?? h.accountId,
      value: h.potentialValue ?? 0,
      title: h.title,
      score,
      state: h.state,
      serviceIds: h.serviceIds,
    }));
}

/* ── Accounts: the portfolio as a divided whole ───────────────────────────── */

export interface PortfolioCell {
  id: string;
  label: string;
  value: number;
  tone: string;
  note?: string;
}

/**
 * Accounts sized by the number of markets their funds actually touch, coloured
 * by the state marker they currently carry.
 *
 * Footprint is used for size rather than a revenue figure because revenue is not
 * in the ontology for prospects, and a treemap where half the cells are zero is
 * not a picture of a portfolio.
 */
export function portfolioCells(): PortfolioCell[] {
  return allAccounts()
    .map((a) => ({
      id: a.id,
      label: a.name,
      value: Math.max(marketsForAccount(a.id).length, 1),
      tone: STATE_MARKERS[a.marker].bg,
      note: `${a.tier} · ${marketsForAccount(a.id).length} markets`,
    }))
    .sort((a, b) => b.value - a.value);
}

export function markerCounts(): Array<{ id: string; label: string; tone: string; count: number }> {
  const counts = new Map<string, number>();
  for (const a of allAccounts()) counts.set(a.marker, (counts.get(a.marker) ?? 0) + 1);
  return (["new", "attention", "uncertain", "quiet"] as const)
    .filter((m) => counts.get(m))
    .map((m) => ({
      id: m,
      label: STATE_MARKERS[m].label,
      tone: STATE_MARKERS[m].bg,
      count: counts.get(m) ?? 0,
    }));
}

/* ── Markets: what moved, and where ───────────────────────────────────────── */

/**
 * ISO numeric → 0–1 shading weight, on a square-root scale.
 *
 * Luxembourg carries roughly twice the change of anywhere else because it is
 * where the funds are domiciled. On a linear ramp that single value flattens
 * every other market to almost nothing, and the map stops answering "which
 * countries moved". The root scale keeps Luxembourg clearly first while leaving
 * the rest legible — a compression of the scale, not of the data.
 */
export function marketHeat(): Record<string, number> {
  const counts = new Map<string, number>();
  for (const e of allEvents()) {
    for (const id of [...e.hostMarketIds, e.domicileMarketId]) {
      if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  const max = Math.max(...counts.values(), 1);
  const out: Record<string, number> = {};
  for (const [marketId, n] of counts) {
    const market = MARKET_BY_ID[marketId];
    if (market) out[market.isoNumeric] = Math.sqrt(n / max);
  }
  return out;
}

/** The markets carrying the most change, ready to pin on the map. */
export function movedMarkets(limit = 4) {
  return marketActivity()
    .slice(0, limit)
    .map((m) => {
      const market = MARKET_BY_ID[m.marketId];
      return {
        id: m.marketId,
        label: market?.name ?? m.marketId,
        lat: market?.lat ?? 0,
        lon: market?.lon ?? 0,
        weight: 1,
        note: `${m.events} changes · ${m.accounts} accounts`,
      };
    })
    .map((m, i, all) => ({ ...m, weight: all.length > 1 ? 1 - i / all.length : 1 }));
}

/** The most recently detected verified changes, newest first. */
export function latestChanges(limit = 3) {
  /* One per market. The list is headed by the market it happened in, so two
     rows carrying the same country name read as a repeat rather than as two
     findings — even when they are two genuinely different events. */
  const seenMarkets = new Set<string>();
  return [...recentEvents(120)]
    .filter((e) => e.state === "verified-fact")
    .sort((a, b) => b.detectedDate.localeCompare(a.detectedDate))
    .filter((e) => {
      const key = e.hostMarketIds.find((m) => MARKET_BY_ID[m]) ?? e.domicileMarketId ?? "";
      if (seenMarkets.has(key)) return false;
      seenMarkets.add(key);
      return true;
    })
    .slice(0, limit)
    .map((e) => ({
      id: e.id,
      headline: e.headline,
      marketId: e.hostMarketIds.find((m) => MARKET_BY_ID[m]) ?? e.domicileMarketId ?? "",
      market: e.hostMarketIds.map((m) => MARKET_BY_ID[m]?.name).filter(Boolean)[0] ?? "Cross-border",
      accountId: e.accountId,
      account: allAccounts().find((a) => a.id === e.accountId)?.name ?? "",
      detected: e.detectedDate,
    }));
}

/* ── Global: the world footprint ──────────────────────────────────────────── */

export function globeMarkers() {
  const activity = new Map(marketActivity().map((m) => [m.marketId, m.events]));
  const max = Math.max(...activity.values(), 1);
  return MARKETS.map((m) => ({
    id: m.id,
    label: m.hub,
    lat: m.lat,
    lon: m.lon,
    weight: Math.sqrt((activity.get(m.id) ?? 0) / max),
  }));
}

export function regionRows(): Array<{ label: string; value: number; display: string }> {
  const counts = new Map<Region, { markets: number; events: number }>();
  for (const m of marketActivity()) {
    const market = MARKET_BY_ID[m.marketId];
    if (!market) continue;
    const row = counts.get(market.region) ?? { markets: 0, events: 0 };
    row.markets += 1;
    row.events += m.events;
    counts.set(market.region, row);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1].events - a[1].events)
    .map(([region, row]) => ({
      label: REGIONS[region],
      value: row.events,
      display: `${row.markets} markets`,
    }));
}

/** The busiest hubs, for the rail beside the globe. */
export function topHubs(limit = 4) {
  return marketActivity()
    .slice(0, limit)
    .map((m) => {
      const market = MARKET_BY_ID[m.marketId];
      return {
        id: m.marketId,
        hub: market?.hub ?? m.marketId,
        market: market?.name ?? m.marketId,
        events: m.events,
        accounts: m.accounts,
      };
    });
}

/* ── People: the buying picture as orbits ─────────────────────────────────── */

const ROLE_SHORT: Record<string, string> = {
  "executive-decision": "Executive",
  "business-ownership": "Business",
  "operations-delivery": "Operations",
  "legal-compliance": "Legal",
  procurement: "Procurement",
  "broadridge-team": "Broadridge",
};

/**
 * External people, grouped by the organisation they work for.
 *
 * `known` is deliberately not "we have their details" — it is whether a
 * relationship has actually been recorded. Everyone in the ontology has a name
 * and a title from a source; almost nobody has a relationship, and that gap is
 * the finding.
 */
export function buyingGroups() {
  const byOrg = new Map<string, Array<{ id: string; label: string; role: string; known: boolean }>>();
  for (const p of allPeople()) {
    if (p.internal) continue;
    const list = byOrg.get(p.identity.org) ?? [];
    list.push({
      id: p.id,
      label: p.identity.name,
      role: ROLE_SHORT[p.commercial.likelyRole] ?? p.commercial.likelyRole,
      known: p.commercial.engagement !== "no-relationship-recorded",
    });
    byOrg.set(p.identity.org, list);
  }
  return [...byOrg.entries()].map(([org, members]) => ({
    id: org,
    label: org,
    members,
  }));
}

export function peopleCoverage() {
  const external = allPeople().filter((p) => !p.internal);
  const known = external.filter((p) => p.commercial.engagement !== "no-relationship-recorded");
  const roles = new Set(external.map((p) => p.commercial.likelyRole));
  return {
    mapped: external.length,
    orgs: new Set(external.map((p) => p.identity.org)).size,
    withRelationship: known.length,
    rolesCovered: roles.size,
    /** The five buying roles the model expects to see filled. */
    rolesExpected: 5,
  };
}

/* ── Delivery: everything recurring, on the time axis ─────────────────────── */

export function renewalHorizon() {
  return allServiceRelationships()
    .filter((r) => r.renewalInDays !== undefined)
    .map((r) => ({
      id: r.id,
      label: allAccounts().find((a) => a.id === r.accountId)?.name ?? r.accountId,
      day: r.renewalInDays as number,
      value: r.arr ?? 0,
      atRisk: r.health === "risk" || r.health === "attention",
    }));
}

export function deliveryStats() {
  const rows = allServiceRelationships();
  const within = (days: number) =>
    rows.filter((r) => r.renewalInDays !== undefined && (r.renewalInDays as number) <= days);
  return {
    services: rows.length,
    live: rows.filter((r) => r.lifecycle === "live").length,
    renewals180: within(180).length,
    value180: within(180).reduce((s, r) => s + (r.arr ?? 0), 0),
    atRisk: rows.filter((r) => r.health === "risk" || r.health === "attention").length,
    expansion: rows.filter((r) => r.lifecycle === "expansion").length,
  };
}

/* ── Knowledge Graph: the ontology as a graph of itself ───────────────────── */

/**
 * The classes and the relationships between them.
 *
 * Positions are authored — a force layout would settle differently on the server
 * and in the browser, and the shape of the ontology is not something that needs
 * discovering. The counts are read from the live dataset, so the graph grows
 * with the data even though its skeleton does not move.
 */
export function ontologyGraph() {
  const d = dataset();
  const nodes = [
    { id: "account", label: "Accounts", value: d.accounts.length, x: 0, y: 0, hub: true },
    { id: "entity", label: "Entities", value: d.entities.length, x: -0.72, y: -0.62 },
    { id: "fund", label: "Funds", value: d.funds.length, x: 0.04, y: -0.82 },
    { id: "event", label: "Changes", value: d.events.length, x: 0.78, y: -0.6 },
    { id: "evidence", label: "Evidence", value: d.evidence.length, x: 0.96, y: 0.14 },
    { id: "source", label: "Sources", value: d.sources.length, x: 0.5, y: 0.82 },
    { id: "hypothesis", label: "Hypotheses", value: d.hypotheses.length, x: -0.28, y: 0.84 },
    { id: "opportunity", label: "Deals", value: d.opportunities.length, x: -0.9, y: 0.44 },
    { id: "person", label: "People", value: d.people.length, x: -1.0, y: -0.12 },
  ];
  const links = [
    { from: "account", to: "entity", label: "operates" },
    { from: "entity", to: "fund", label: "manages" },
    { from: "fund", to: "event", label: "changed in" },
    { from: "event", to: "evidence", label: "supported by" },
    { from: "evidence", to: "source", label: "cites" },
    { from: "event", to: "hypothesis", label: "triggers" },
    { from: "hypothesis", to: "opportunity", label: "becomes" },
    { from: "account", to: "person", label: "employs" },
    { from: "account", to: "opportunity", label: "holds" },
    { from: "account", to: "event", label: "affected by" },
    { from: "hypothesis", to: "evidence", label: "rests on" },
    { from: "person", to: "opportunity", label: "decides" },
  ];
  return { nodes, links };
}

/* ── Evidence: provenance as a counted flow ───────────────────────────────── */

const STATE_LABEL: Record<EvidenceState, string> = {
  "verified-fact": "Verified",
  "system-suggestion": "Suggested",
  "seller-hypothesis": "Hypothesis",
  "still-to-learn": "Unknown",
};

const STATE_TONE: Record<EvidenceState, string> = {
  "verified-fact": "var(--ev-fact)",
  "system-suggestion": "var(--ev-suggestion)",
  "seller-hypothesis": "var(--ev-hypothesis)",
  "still-to-learn": "var(--ev-gap)",
};

/**
 * Source kind → evidence state → what leans on it, counted from the records
 * themselves rather than assumed.
 *
 * A record with two sources contributes to two kinds, so the first column counts
 * record-source pairs while the second counts records. Each column is drawn as a
 * proportion of its own total, which is what makes that legitimate; the numbers
 * printed on the bands are the counts, not the shares.
 */
export function provenanceFlow() {
  const records = allEvidence();

  const kindCount = new Map<string, number>();
  const kindToState = new Map<string, number>();
  const stateCount = new Map<EvidenceState, number>();
  const stateToUse = new Map<string, number>();
  const useCount = new Map<string, number>();

  const bump = <K,>(m: Map<K, number>, k: K) => m.set(k, (m.get(k) ?? 0) + 1);

  for (const record of records) {
    bump(stateCount, record.state);

    /* A record with no source is itself a finding, so it gets its own band
       rather than being dropped out of the flow. */
    const kinds = new Set<string>(sourcesForEvidence(record).map((s) => s.kind));
    if (!kinds.size) kinds.add("unsourced");
    for (const kind of kinds) {
      bump(kindCount, kind);
      bump(kindToState, `${kind}|${record.state}`);
    }

    const uses = new Set<string>();
    for (const id of record.usedBy) {
      if (getHypothesis(id)) uses.add("hypothesis");
      else if (getOpportunity(id)) uses.add("opportunity");
    }
    if (!uses.size) uses.add("unused");
    for (const use of uses) {
      bump(useCount, use);
      bump(stateToUse, `${record.state}|${use}`);
    }
  }

  /**
   * Short forms. The taxonomy's own labels ("Broadridge market intelligence")
   * are written for a page with room; inside a 104px band they overflow into
   * the ribbon. Shortening the label is a rendering decision, so it lives here
   * rather than being pushed back into the shared taxonomy.
   */
  const KIND_SHORT: Record<string, string> = {
    unsourced: "No source",
    "public-announcement": "Announcement",
    "regulatory-record": "Regulatory",
    "fund-data": "Fund data",
    "market-intelligence": "Market intel",
    crm: "CRM",
    contract: "Contract",
    "internal-note": "Internal note",
    press: "Press",
  };
  const kindLabel = (id: string) =>
    KIND_SHORT[id] ?? SOURCE_KINDS[id as SourceKind]?.label ?? id;

  const useLabel: Record<string, string> = {
    hypothesis: "A reason",
    opportunity: "A deal",
    unused: "Nothing yet",
  };

  const kindRows = [...kindCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, value]) => ({ id, label: kindLabel(id), value }));
  const keptKinds = new Set(kindRows.map((r) => r.id));

  const stateRows = (["verified-fact", "system-suggestion", "seller-hypothesis", "still-to-learn"] as const)
    .filter((s) => stateCount.get(s))
    .map((s) => ({ id: s, label: STATE_LABEL[s], value: stateCount.get(s) ?? 0, tone: STATE_TONE[s] }));

  const useRows = ["hypothesis", "opportunity", "unused"]
    .filter((u) => useCount.get(u))
    .map((u) => ({ id: u, label: useLabel[u], value: useCount.get(u) ?? 0 }));

  const split = (m: Map<string, number>) =>
    [...m.entries()].map(([key, value]) => {
      const [from, to] = key.split("|");
      return { from, to, value };
    });

  return {
    columns: [
      { title: "Where it came from", rows: kindRows },
      { title: "How far we trust it", rows: stateRows },
      { title: "What leans on it", rows: useRows },
    ] as const,
    links: [
      split(kindToState).filter((l) => keptKinds.has(l.from)),
      split(stateToUse),
    ] as const,
    /** Headline figures the flow cannot say on its own. */
    stats: {
      records: records.length,
      sourced: records.filter((r) => sourcesForEvidence(r).length > 0).length,
      verified: stateCount.get("verified-fact") ?? 0,
      conflicts: records.filter((r) => r.conflictsWithId).length,
      needsReview: records.filter((r) => r.needsReview).length,
    },
  };
}

/* ── Deals: the funnel and the condition of what is in it ─────────────────── */

const STAGES: Array<[string, string]> = [
  ["change", "Change"],
  ["problem", "Problem"],
  ["people", "People"],
  ["solution", "Solution"],
  ["decision", "Decision"],
  ["outcome", "Outcome"],
];

const gbpShort = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}m` : n > 0 ? `£${Math.round(n / 1000)}k` : "—";

export function dealFunnel() {
  const deals = allOpportunities();
  return STAGES.map(([id, label]) => {
    const inStage = deals.filter((d) => d.stage === id);
    const value = inStage.reduce((s, d) => s + d.value, 0);
    return { id, label, value, count: inStage.length, display: gbpShort(value) };
  });
}

export { gbpShort };
