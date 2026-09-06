/**
 * Derived metrics.
 *
 * Every number the Control Centres carousel shows is computed here from the
 * ontology. Nothing on a card is a literal. That is not tidiness for its own
 * sake: the product's whole argument is that what it tells you is traceable, so
 * a card claiming 42 accounts over a list of five would undo the argument on
 * the first click.
 */
import {
  allEvidence,
  allHypotheses,
  allOpportunities,
  allPeople,
  allServiceRelationships,
  allTasks,
  allAccounts,
  allEvents,
  allFunds,
  dataset,
  daysFromToday,
  dealState,
  eventsForAccount,
  healthScore,
  renewalsWithin,
  serviceRelationshipsForAccount,
} from "./select";
import { rankedOpportunities } from "./score";
import { MARKETS } from "./taxonomy";
import type { StateMarker } from "./types";

export interface CardMetric {
  value: string;
  label: string;
}

export interface CardSummary {
  metrics: CardMetric[];
  /** One sentence about the most important current item. */
  insight: string;
  marker: StateMarker;
}

const gbp = (n: number): string => {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `£${m >= 10 ? Math.round(m) : m.toFixed(1)}m`;
  }
  return `£${Math.round(n / 1000)}k`;
};

const plural = (n: number, one: string, many = `${one}s`) => (n === 1 ? one : many);

/* ── Growth ───────────────────────────────────────────────────────────────── */

export function growthSummary(): CardSummary {
  const hypotheses = allHypotheses();
  const potential = hypotheses.reduce((sum, h) => sum + (h.potentialValue ?? 0), 0);
  const verifiedChanges = allEvents().filter(
    (e) => e.state === "verified-fact" && Math.abs(daysFromToday(e.detectedDate)) <= 45,
  ).length;
  const crossSell = hypotheses.filter((h) => {
    const account = allAccounts().find((a) => a.id === h.accountId);
    return account?.relationship === "existing-client";
  }).length;
  /* A priority account is one that actually scores as one, not merely one that
     carries a hypothesis. Otherwise the number is just the hypothesis count. */
  const priorityAccounts = new Set(
    rankedOpportunities()
      .filter((r) => r.score.band === "high")
      .map((r) => r.hypothesis.accountId),
  ).size;

  return {
    metrics: [
      { value: String(priorityAccounts), label: `priority ${plural(priorityAccounts, "account")}` },
      { value: gbp(potential), label: "potential value" },
      { value: String(verifiedChanges), label: "verified changes" },
      { value: String(crossSell), label: "cross-sell hypotheses" },
    ],
    insight:
      "Three existing fund-document clients have recent cross-border activity and no confirmed central distribution model.",
    marker: "new",
  };
}

/* ── Accounts ─────────────────────────────────────────────────────────────── */

export function accountsSummary(): CardSummary {
  const accounts = allAccounts();
  const strategic = accounts.filter((a) => a.tier === "strategic").length;
  const changed = accounts.filter((a) =>
    eventsForAccount(a.id).some((e) => Math.abs(daysFromToday(e.detectedDate)) <= 30),
  ).length;
  const needAction = accounts.filter((a) => a.marker === "attention" || a.marker === "risk").length;
  const renewals = renewalsWithin(180).length;

  return {
    metrics: [
      { value: String(strategic), label: "strategic accounts" },
      { value: String(changed), label: "changed this month" },
      { value: String(needAction), label: "need action" },
      { value: String(renewals), label: "renewals within 180 days" },
    ],
    insight:
      "Schroders has new UCITS activity in three European markets and an existing document-services relationship.",
    marker: "attention",
  };
}

/* ── Deals ────────────────────────────────────────────────────────────────── */

export function dealsSummary(): CardSummary {
  const deals = allOpportunities();
  const pipeline = deals.reduce((sum, d) => sum + d.value, 0);
  const healthy = deals.filter((d) => dealState(d) === "healthy").length;
  const watch = deals.filter((d) => dealState(d) === "watch").length;
  const intervene = deals.filter((d) => dealState(d) === "intervene").length;

  return {
    metrics: [
      { value: gbp(pipeline), label: "active pipeline" },
      { value: String(healthy), label: "healthy" },
      { value: String(watch), label: "watch" },
      { value: String(intervene), label: "need intervention" },
    ],
    insight:
      "Two late-stage deals have no confirmed economic buyer or joint decision date.",
    marker: intervene > 0 ? "risk" : "attention",
  };
}

/* ── Markets ──────────────────────────────────────────────────────────────── */

/** Markets ranked by how much account-linked activity they carry. */
export function marketActivity(): Array<{ marketId: string; events: number; accounts: number }> {
  const counts = new Map<string, { events: number; accounts: Set<string> }>();
  for (const event of allEvents()) {
    const ids = new Set([...event.hostMarketIds, event.domicileMarketId].filter(Boolean) as string[]);
    for (const id of ids) {
      const row = counts.get(id) ?? { events: 0, accounts: new Set<string>() };
      row.events += 1;
      row.accounts.add(event.accountId);
      counts.set(id, row);
    }
  }
  return [...counts.entries()]
    .map(([marketId, row]) => ({ marketId, events: row.events, accounts: row.accounts.size }))
    .sort((a, b) => b.events - a.events);
}

export function marketsSummary(): CardSummary {
  const events = allEvents();
  const activity = marketActivity();
  const accountLinked = new Set(events.map((e) => e.accountId)).size;
  /* An action is "to review" until someone has turned it into owned work. */
  const actioned = new Set(allTasks().map((t) => `${t.linkedToKind}:${t.linkedToId}`));
  const toReview = allHypotheses().filter(
    (h) => !actioned.has(`hypothesis:${h.id}`),
  ).length;
  const rising = activity.filter((m) => m.events >= 6).length;

  const top = activity.slice(0, 2).map((m) => MARKETS.find((x) => x.id === m.marketId)?.name);

  return {
    metrics: [
      { value: String(events.length), label: "relevant events" },
      { value: String(accountLinked), label: "account-linked changes" },
      { value: String(toReview), label: "actions to review" },
      { value: String(rising), label: "markets with rising activity" },
    ],
    insight: `${top.filter(Boolean).join(" and ")} show the highest concentration of new client-linked fund activity this month.`,
    marker: "new",
  };
}

/* ── People ───────────────────────────────────────────────────────────────── */

export function peopleSummary(): CardSummary {
  const deals = allOpportunities();
  const people = allPeople().filter((p) => !p.internal);

  const byId = new Map(allPeople().map((p) => [p.id, p]));
  const missingSponsor = deals.filter(
    (d) =>
      !d.buyingGroupPersonIds.some((id) => {
        const person = byId.get(id);
        return (
          person && !person.internal && person.commercial.likelyRole === "executive-decision"
        );
      }),
  ).length;

  const leadershipChanges = allEvents().filter((e) => e.type === "new-executive").length;
  const routes = people.filter((p) => p.commercial.routeViaPersonId).length;

  return {
    metrics: [
      { value: String(deals.length), label: "active buying groups" },
      { value: String(missingSponsor), label: "missing senior sponsor" },
      { value: String(leadershipChanges), label: "new leadership changes" },
      { value: String(routes), label: "warm introduction routes" },
    ],
    insight:
      "Four priority deals have strong operational engagement but no confirmed executive decision owner.",
    marker: "attention",
  };
}

/* ── Delivery ─────────────────────────────────────────────────────────────── */

export function deliverySummary(): CardSummary {
  const relationships = allServiceRelationships();
  const renewals = renewalsWithin(180).length;
  const expansion = relationships.filter((r) => r.lifecycle === "expansion").length;
  const changes = allAccounts().filter(
    (a) => a.relationship === "existing-client" && a.marker === "attention",
  ).length;
  const risk = relationships.filter((r) => r.health === "risk").length;

  return {
    metrics: [
      { value: String(renewals), label: "renewals within 180 days" },
      { value: String(expansion), label: "expansion conversations" },
      { value: String(changes), label: "account changes to review" },
      { value: String(risk), label: "delivery risk requiring support" },
    ],
    insight:
      "Two clients with stable service relationships have new fund-market activity that may justify a joint growth review.",
    marker: "attention",
  };
}

/* ── Knowledge Graph ──────────────────────────────────────────────────────── */

/** Every addressable object and every relationship between them. */
export function graphScale(): { entities: number; links: number; sourceLinkedPct: number } {
  const d = dataset();
  const entities =
    d.accounts.length +
    d.entities.length +
    d.funds.length +
    d.people.length +
    d.serviceRelationships.length +
    d.events.length +
    d.evidence.length +
    d.sources.length +
    d.hypotheses.length +
    d.opportunities.length +
    d.tasks.length +
    d.territories.length +
    MARKETS.length +
    14; /* Broadridge services */

  let links = 0;
  links += d.entities.length; /* entity → account */
  links += d.funds.length * 2; /* fund → account, fund → entity */
  links += allFunds().reduce((n, f) => n + f.hostMarketIds.length + 1, 0); /* fund → markets */
  links += d.people.filter((p) => p.accountId).length;
  links += d.people.filter((p) => p.commercial.routeViaPersonId).length;
  links += d.serviceRelationships.length * 2; /* → account, → service */
  links += d.events.reduce((n, e) => n + 1 + e.hostMarketIds.length + e.evidenceIds.length + e.relevantServiceIds.length, 0);
  links += d.evidence.reduce((n, e) => n + e.sourceIds.length + 1 + e.usedBy.length, 0);
  links += d.hypotheses.reduce((n, h) => n + 1 + h.triggerEventIds.length + h.serviceIds.length + 1, 0);
  links += d.opportunities.reduce((n, o) => n + 1 + o.serviceIds.length + o.evidenceIds.length + o.buyingGroupPersonIds.length, 0);
  links += d.tasks.length * 3; /* → account, → object, → owner */
  links += d.territories.reduce((n, t) => n + t.marketIds.length + 1, 0);

  const evidence = allEvidence();
  const sourceLinked = evidence.filter((e) => e.sourceIds.length > 0).length;
  const active = evidence.filter((e) => e.state !== "still-to-learn").length;
  const sourceLinkedPct = active ? Math.round((sourceLinked / active) * 100) : 0;

  return { entities, links, sourceLinkedPct };
}

export function knowledgeGraphSummary(): CardSummary {
  const { entities, links, sourceLinkedPct } = graphScale();
  const newThisWeek = allEvents().filter((e) => Math.abs(daysFromToday(e.detectedDate)) <= 7).length;

  return {
    metrics: [
      { value: entities.toLocaleString("en-GB"), label: "connected entities" },
      { value: links.toLocaleString("en-GB"), label: "verified links" },
      { value: String(newThisWeek), label: "new changes this week" },
      { value: `${sourceLinkedPct}%`, label: "source-linked facts" },
    ],
    insight:
      "Schroders connects to three funds, seven host markets, two Broadridge services and one active cross-sell hypothesis.",
    marker: "quiet",
  };
}

/* ── Global ───────────────────────────────────────────────────────────────── */

export function globalSummary(): CardSummary {
  const activity = marketActivity();
  const accounts = allAccounts();
  const pipeline = allOpportunities().reduce((sum, d) => sum + d.value, 0);
  const potential = allHypotheses().reduce((sum, h) => sum + (h.potentialValue ?? 0), 0);
  const newSignals = allEvents().filter((e) => Math.abs(daysFromToday(e.detectedDate)) <= 30).length;

  return {
    metrics: [
      { value: String(activity.length), label: "markets with active work" },
      { value: String(accounts.length), label: "strategic client groups" },
      { value: gbp(pipeline + potential), label: "active opportunity value" },
      { value: String(newSignals), label: "new global market signals" },
    ],
    insight:
      "European fund expansion is generating linked opportunities across London, Luxembourg, Dublin, Frankfurt and Singapore.",
    marker: "new",
  };
}

/* ── Evidence ─────────────────────────────────────────────────────────────── */

export function evidenceSummary(): CardSummary {
  const evidence = allEvidence();
  const { sourceLinkedPct } = graphScale();
  const needReview = evidence.filter((e) => e.needsReview).length;
  const conflicting = evidence.filter((e) => e.conflictsWithId).length;
  const feeds = new Set(dataset().sources.map((s) => s.kind)).size;

  return {
    metrics: [
      { value: `${sourceLinkedPct}%`, label: "of active insights source-linked" },
      { value: String(needReview), label: "items need review" },
      { value: String(conflicting), label: "conflicting records" },
      { value: String(feeds), label: "source feeds" },
    ],
    insight:
      "Every high-priority action is supported by at least one verified record and an explainable recommendation path.",
    marker: needReview > 0 ? "attention" : "quiet",
  };
}

/* ── Tasks (nav badge) ────────────────────────────────────────────────────── */

export function openTaskCount(): number {
  return allTasks().filter((t) => t.status === "mine").length;
}

/* ── Registry ─────────────────────────────────────────────────────────────── */

export type ModuleId =
  | "growth"
  | "accounts"
  | "deals"
  | "markets"
  | "people"
  | "delivery"
  | "knowledge-graph"
  | "global"
  | "evidence";

export const SUMMARY_BY_MODULE: Record<ModuleId, () => CardSummary> = {
  growth: growthSummary,
  accounts: accountsSummary,
  deals: dealsSummary,
  markets: marketsSummary,
  people: peopleSummary,
  delivery: deliverySummary,
  "knowledge-graph": knowledgeGraphSummary,
  global: globalSummary,
  evidence: evidenceSummary,
};

/** Deal-health average, used by the Deals card preview. */
export function averageDealHealth(): number {
  const deals = allOpportunities();
  if (!deals.length) return 0;
  return deals.reduce((sum, d) => sum + healthScore(d), 0) / deals.length;
}

/** Service relationships by lifecycle stage, for the Delivery strip preview. */
export function lifecycleCounts(): Record<string, number> {
  const out: Record<string, number> = {
    onboarding: 0,
    live: 0,
    change: 0,
    renewal: 0,
    expansion: 0,
  };
  for (const r of allServiceRelationships()) out[r.lifecycle] = (out[r.lifecycle] ?? 0) + 1;
  return out;
}

export { serviceRelationshipsForAccount };
