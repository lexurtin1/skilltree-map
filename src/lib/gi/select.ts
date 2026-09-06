/**
 * Indexes and selectors over the ontology.
 *
 * Every module reads the dataset through this file. Nothing imports a seed file
 * directly, so the data source can be swapped without touching a component —
 * the same seam the original graph was built around.
 */
import { GI_DATA, type GiDataset } from "./seed";
import { DEAL_STAGE_BY_ID, MARKET_BY_ID, SERVICE_BY_ID } from "./taxonomy";
import type {
  Account,
  DealState,
  EvidenceRecord,
  Fund,
  HealthComponentId,
  Hypothesis,
  LegalEntity,
  Market,
  MarketEvent,
  ObjectRef,
  Opportunity,
  Person,
  RecommendedAction,
  ServiceRelationship,
  Source,
  Task,
} from "./types";

/** The reference date the prototype presents as "today". */
export const TODAY = "2026-09-06";

let data: GiDataset = GI_DATA;

function index<T extends { id: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((r) => [r.id, r]));
}

function group<T>(rows: T[], key: (row: T) => string | undefined): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const row of rows) {
    const k = key(row);
    if (!k) continue;
    const list = out.get(k) ?? [];
    list.push(row);
    out.set(k, list);
  }
  return out;
}

function buildIndexes(d: GiDataset) {
  return {
    accountById: index(d.accounts),
    entityById: index(d.entities),
    fundById: index(d.funds),
    personById: index(d.people),
    eventById: index(d.events),
    evidenceById: index(d.evidence),
    sourceById: index(d.sources),
    hypothesisById: index(d.hypotheses),
    actionById: index(d.actions),
    opportunityById: index(d.opportunities),
    taskById: index(d.tasks),
    serviceRelById: index(d.serviceRelationships),

    entitiesByAccount: group(d.entities, (r) => r.accountId),
    fundsByAccount: group(d.funds, (r) => r.accountId),
    peopleByAccount: group(d.people, (r) => r.accountId),
    eventsByAccount: group(d.events, (r) => r.accountId),
    evidenceByAccount: group(d.evidence, (r) => r.matchedToId),
    hypothesesByAccount: group(d.hypotheses, (r) => r.accountId),
    opportunitiesByAccount: group(d.opportunities, (r) => r.accountId),
    tasksByAccount: group(d.tasks, (r) => r.accountId),
    serviceRelsByAccount: group(d.serviceRelationships, (r) => r.accountId),
    serviceRelsByService: group(d.serviceRelationships, (r) => r.serviceId),
  };
}

let idx = buildIndexes(data);

/** Swap the dataset (an API-backed loader, a demo variant) and rebuild indexes. */
export function configureGi(next: GiDataset) {
  data = next;
  idx = buildIndexes(data);
}

export function dataset(): GiDataset {
  return data;
}

/* ── Direct lookups ───────────────────────────────────────────────────────── */

export const getAccount = (id: string): Account | undefined => idx.accountById.get(id);
export const getEntity = (id: string): LegalEntity | undefined => idx.entityById.get(id);
export const getFund = (id: string): Fund | undefined => idx.fundById.get(id);
export const getPerson = (id: string): Person | undefined => idx.personById.get(id);
export const getEvent = (id: string): MarketEvent | undefined => idx.eventById.get(id);
export const getEvidence = (id: string): EvidenceRecord | undefined => idx.evidenceById.get(id);
export const getSource = (id: string): Source | undefined => idx.sourceById.get(id);
export const getHypothesis = (id: string): Hypothesis | undefined => idx.hypothesisById.get(id);
export const getAction = (id: string): RecommendedAction | undefined => idx.actionById.get(id);
export const getOpportunity = (id: string): Opportunity | undefined => idx.opportunityById.get(id);
export const getTask = (id: string): Task | undefined => idx.taskById.get(id);
export const getMarket = (id: string): Market | undefined => MARKET_BY_ID[id];
export const getService = (id: string) => SERVICE_BY_ID[id];

export const allAccounts = (): Account[] => data.accounts;
export const allEvents = (): MarketEvent[] => data.events;
export const allOpportunities = (): Opportunity[] => data.opportunities;
export const allTasks = (): Task[] => data.tasks;
export const allEvidence = (): EvidenceRecord[] => data.evidence;
export const allHypotheses = (): Hypothesis[] => data.hypotheses;
export const allPeople = (): Person[] => data.people;
export const allFunds = (): Fund[] => data.funds;
export const allServiceRelationships = (): ServiceRelationship[] => data.serviceRelationships;

/* ── By account ───────────────────────────────────────────────────────────── */

export const entitiesForAccount = (id: string) => idx.entitiesByAccount.get(id) ?? [];
export const fundsForAccount = (id: string) => idx.fundsByAccount.get(id) ?? [];
export const peopleForAccount = (id: string) => idx.peopleByAccount.get(id) ?? [];
export const hypothesesForAccount = (id: string) => idx.hypothesesByAccount.get(id) ?? [];
export const opportunitiesForAccount = (id: string) => idx.opportunitiesByAccount.get(id) ?? [];
export const tasksForAccount = (id: string) => idx.tasksByAccount.get(id) ?? [];
export const evidenceForAccount = (id: string) => idx.evidenceByAccount.get(id) ?? [];
export const serviceRelationshipsForAccount = (id: string) =>
  idx.serviceRelsByAccount.get(id) ?? [];
export const serviceRelationshipsForService = (id: string) =>
  idx.serviceRelsByService.get(id) ?? [];

/** Newest first — the order every timeline and feed uses. */
export function eventsForAccount(id: string): MarketEvent[] {
  return [...(idx.eventsByAccount.get(id) ?? [])].sort((a, b) =>
    b.detectedDate.localeCompare(a.detectedDate),
  );
}

/* ── Cross-cutting ────────────────────────────────────────────────────────── */

/** Every market a group touches: domiciles plus host markets. */
export function marketsForAccount(id: string): Market[] {
  const ids = new Set<string>();
  for (const fund of fundsForAccount(id)) {
    ids.add(fund.domicileMarketId);
    fund.hostMarketIds.forEach((m) => ids.add(m));
  }
  const account = getAccount(id);
  if (account) ids.add(account.hqMarketId);
  return [...ids].map((m) => MARKET_BY_ID[m]).filter(Boolean);
}

/** Accounts with any activity — domicile, host market or HQ — in a market. */
export function accountsForMarket(marketId: string): Account[] {
  return data.accounts.filter((a) => {
    if (a.hqMarketId === marketId) return true;
    return fundsForAccount(a.id).some(
      (f) => f.domicileMarketId === marketId || f.hostMarketIds.includes(marketId),
    );
  });
}

export function eventsForMarket(marketId: string): MarketEvent[] {
  return data.events.filter(
    (e) => e.hostMarketIds.includes(marketId) || e.domicileMarketId === marketId,
  );
}

export function evidenceForIds(ids: string[]): EvidenceRecord[] {
  return ids.map((id) => idx.evidenceById.get(id)).filter((e): e is EvidenceRecord => !!e);
}

export function sourcesForEvidence(record: EvidenceRecord): Source[] {
  return record.sourceIds.map((id) => idx.sourceById.get(id)).filter((s): s is Source => !!s);
}

/** Every source behind a set of evidence records, de-duplicated. */
export function sourcesForIds(evidenceIds: string[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const record of evidenceForIds(evidenceIds)) {
    for (const source of sourcesForEvidence(record)) {
      if (seen.has(source.id)) continue;
      seen.add(source.id);
      out.push(source);
    }
  }
  return out;
}

export function servicesForAccount(id: string) {
  return serviceRelationshipsForAccount(id)
    .map((r) => ({ relationship: r, service: SERVICE_BY_ID[r.serviceId] }))
    .filter((r) => !!r.service);
}

/* ── Derived state ────────────────────────────────────────────────────────── */

const HEALTH_WEIGHTS: Record<HealthComponentId, number> = {
  momentum: 0.18,
  "buying-group": 0.18,
  "next-step": 0.18,
  "value-case": 0.14,
  "decision-timing": 0.14,
  competitive: 0.09,
  "data-completeness": 0.09,
};

/** Weighted health score, 0–1. Never shown alone — always with its components. */
export function healthScore(opportunity: Opportunity): number {
  let total = 0;
  for (const [key, weight] of Object.entries(HEALTH_WEIGHTS)) {
    total += (opportunity.health[key as HealthComponentId] ?? 0) * weight;
  }
  return total;
}

export function dealState(opportunity: Opportunity): DealState {
  const score = healthScore(opportunity);
  if (score >= 0.65) return "healthy";
  if (score >= 0.32) return "watch";
  return "intervene";
}

export function stageIndex(opportunity: Opportunity): number {
  return DEAL_STAGE_BY_ID[opportunity.stage].index;
}

/** Days between the prototype's "today" and an ISO date. Negative = past. */
export function daysFromToday(iso: string): number {
  const ms = Date.parse(iso) - Date.parse(TODAY);
  return Math.round(ms / 86_400_000);
}

/** Renewals due inside a window, soonest first. */
export function renewalsWithin(days: number): ServiceRelationship[] {
  return data.serviceRelationships
    .filter((r) => r.renewalInDays !== undefined && r.renewalInDays <= days)
    .sort((a, b) => (a.renewalInDays ?? 0) - (b.renewalInDays ?? 0));
}

/** Events detected inside a window, newest first. */
export function recentEvents(days: number): MarketEvent[] {
  return data.events
    .filter((e) => -daysFromToday(e.detectedDate) <= days)
    .sort((a, b) => b.detectedDate.localeCompare(a.detectedDate));
}

export function tasksByStatus(status: Task["status"]): Task[] {
  return data.tasks.filter((t) => t.status === status);
}

/* ── Search ───────────────────────────────────────────────────────────────── */

/**
 * One search across accounts, funds, people, markets and deals. Matches on a
 * simple case-insensitive substring — the ranking is what makes it useful:
 * a prefix match on a name beats a substring match anywhere else.
 */
export function search(query: string, limit = 12): ObjectRef[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const hits: Array<ObjectRef & { rank: number }> = [];
  const push = (ref: ObjectRef, haystack: string, base: number) => {
    const h = haystack.toLowerCase();
    const at = h.indexOf(q);
    if (at < 0) return;
    hits.push({ ...ref, rank: base + (at === 0 ? 0 : 1) + at / 400 });
  };

  for (const a of data.accounts) {
    push(
      { kind: "account", id: a.id, label: a.name, sublabel: a.hero ? "Strategic account" : "Account" },
      `${a.name} ${a.legalName ?? ""}`,
      0,
    );
  }
  for (const o of data.opportunities) {
    const account = idx.accountById.get(o.accountId);
    push(
      { kind: "opportunity", id: o.id, label: o.name, sublabel: account?.name ?? "Deal" },
      `${o.name} ${account?.name ?? ""}`,
      1,
    );
  }
  for (const p of data.people) {
    push(
      { kind: "person", id: p.id, label: p.identity.name, sublabel: `${p.identity.title} · ${p.identity.org}` },
      `${p.identity.name} ${p.identity.title} ${p.identity.org}`,
      1.5,
    );
  }
  for (const f of data.funds) {
    const account = idx.accountById.get(f.accountId);
    push(
      { kind: "fund", id: f.id, label: f.name, sublabel: `${f.structure} · ${account?.name ?? ""}` },
      f.name,
      2,
    );
  }
  for (const m of Object.values(MARKET_BY_ID)) {
    push({ kind: "market", id: m.id, label: m.name, sublabel: m.hub }, m.name, 2.5);
  }
  for (const s of Object.values(SERVICE_BY_ID)) {
    push({ kind: "service", id: s.id, label: s.name, sublabel: "Broadridge service" }, s.name, 3);
  }

  return hits
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((hit) => ({
      kind: hit.kind,
      id: hit.id,
      label: hit.label,
      sublabel: hit.sublabel,
    }));
}
