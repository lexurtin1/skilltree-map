/**
 * Derived time series.
 *
 * The dashboards need trends, and the ontology holds dates rather than history.
 * Everything here is computed from those dates — events bucketed by the month
 * they were detected, pipeline bucketed by the month it is forecast to close,
 * renewals bucketed by how far out they fall.
 *
 * Nothing is invented. Where a module has no honest series, it gets a
 * distribution instead of a trend line, because a fabricated curve on a product
 * whose entire argument is traceability would be the worst possible detail to
 * get wrong.
 */
import {
  allEvents,
  allOpportunities,
  allServiceRelationships,
  allTasks,
  allAccounts,
  allEvidence,
  allPeople,
  dealState,
  healthScore,
  hypothesesForAccount,
  renewalsWithin,
  TODAY,
} from "./select";
import { marketActivity } from "./metrics";
import { MARKET_BY_ID } from "./taxonomy";

export interface Point {
  label: string;
  value: number;
}

export interface BarRow {
  label: string;
  value: number;
  /** Pre-formatted for display — the chart never formats. */
  display: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthKey = (iso: string) => iso.slice(0, 7);
const monthLabel = (key: string) => MONTHS[Number(key.slice(5, 7)) - 1] ?? key;

/**
 * The N months ending at the last *complete* month, oldest first.
 *
 * The reference date is the 6th, so the current month is a fifth of the way
 * through. Including it puts a partial bucket at the end of every series, which
 * makes each sparkline fall off a cliff and each period-on-period delta read
 * something like −72% — an artefact of the calendar being asked to compare six
 * days against thirty-one. Dropping the incomplete month is the only honest
 * comparison available; the alternative is annualising, which invents data.
 */
function monthWindow(count: number, endIso: string = TODAY): string[] {
  const [y, m] = endIso.split("-").map(Number);
  const day = Number(endIso.slice(8, 10));
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const complete = day >= daysInMonth ? 0 : 1;

  const keys: string[] = [];
  for (let i = count - 1 + complete; i >= complete; i--) {
    const total = y * 12 + (m - 1) - i;
    const yy = Math.floor(total / 12);
    const mm = (total % 12) + 1;
    keys.push(`${yy}-${String(mm).padStart(2, "0")}`);
  }
  return keys;
}

/** Months forward from the reference date, for anything forecast. */
function forwardWindow(count: number, startIso: string = TODAY): string[] {
  const [y, m] = startIso.split("-").map(Number);
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    const total = y * 12 + (m - 1) + i;
    keys.push(`${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, "0")}`);
  }
  return keys;
}

function bucket(keys: string[], rows: Array<{ key: string; value: number }>): Point[] {
  const totals = new Map(keys.map((k) => [k, 0]));
  for (const row of rows) {
    if (totals.has(row.key)) totals.set(row.key, (totals.get(row.key) ?? 0) + row.value);
  }
  return keys.map((k) => ({ label: monthLabel(k), value: totals.get(k) ?? 0 }));
}

const gbpShort = (n: number) =>
  n >= 1_000_000 ? `£${(n / 1_000_000).toFixed(1)}m` : `£${Math.round(n / 1000)}k`;

/* ── Trends, by module ────────────────────────────────────────────────────── */

/** Verified market changes detected per month — the Growth and Markets trend. */
export function eventsByMonth(months = 6): Point[] {
  const keys = monthWindow(months);
  return bucket(
    keys,
    allEvents().map((e) => ({ key: monthKey(e.detectedDate), value: 1 })),
  );
}

/** One signal type, bucketed by month — e.g. leadership changes over time. */
export function eventsByMonthOfType(type: string, months = 6): Point[] {
  const keys = monthWindow(months);
  return bucket(
    keys,
    allEvents()
      .filter((e) => e.type === type)
      .map((e) => ({ key: monthKey(e.detectedDate), value: 1 })),
  );
}

/**
 * Period-on-period movement for a series, so a figure only ever shows a delta it
 * can actually compute. Returns null when there is nothing to compare against —
 * an absent delta is honest, an invented one is not.
 *
 * A base under three is treated as no base at all. One record last month and
 * thirty-seven this month is arithmetically +3600%, and a tile reading "+3600%"
 * tells a seller nothing except that the denominator was tiny. Small-base rates
 * are noise wearing the costume of a measurement.
 */
const MIN_BASE = 3;

/**
 * And a series where one bucket holds most of the total is not a trend at all.
 *
 * Several object types in the ontology carry a single load date, so their
 * monthly series is a spike with flat ground either side. The arithmetic still
 * produces a percentage — "+800%" — but what it measures is when the data was
 * captured, not anything that happened in the business. A figure that changes
 * when the loader runs is not a business metric, so no delta is shown.
 */
const MAX_CONCENTRATION = 0.6;

/**
 * Whether a series is a trend at all, rather than a load date wearing one.
 * A sparkline drawn from a spike is as misleading as the percentage would be,
 * so the same test gates both.
 */
export function isTrend(points: Point[]): boolean {
  if (points.length < 2) return false;
  const total = points.reduce((s, p) => s + p.value, 0);
  if (total <= 0) return false;
  return Math.max(...points.map((p) => p.value)) / total <= MAX_CONCENTRATION;
}

/** The series, or nothing — for passing straight into a sparkline. */
export function trendOrNull(points: Point[]): Point[] | undefined {
  return isTrend(points) ? points : undefined;
}

export function deltaOf(points: Point[]): { delta: string; trend: "up" | "down" | "flat" } | null {
  if (points.length < 2) return null;
  if (!isTrend(points)) return null;

  const latest = points[points.length - 1].value;
  const prior = points[points.length - 2].value;
  if (prior < MIN_BASE) return null;
  const pct = Math.round(((latest - prior) / prior) * 100);
  if (pct === 0) return { delta: "0%", trend: "flat" };
  return { delta: `${pct > 0 ? "+" : ""}${pct}%`, trend: pct > 0 ? "up" : "down" };
}

/** Pipeline value by forecast close month. */
export function pipelineByCloseMonth(months = 8): Point[] {
  const keys = forwardWindow(months);
  return bucket(
    keys,
    allOpportunities().map((o) => ({ key: monthKey(o.closeDate), value: o.value })),
  );
}

/** Recurring revenue reaching its renewal window, by month out. */
export function renewalsByMonth(months = 6): Point[] {
  const buckets = Array.from({ length: months }, (_, i) => ({ label: `${i + 1}m`, value: 0 }));
  for (const r of allServiceRelationships()) {
    if (r.renewalInDays === undefined) continue;
    const index = Math.floor(r.renewalInDays / 30);
    if (index >= 0 && index < months) buckets[index].value += r.arr ?? 0;
  }
  return buckets;
}

/** Cumulative hypotheses created per month — the Growth pipeline of reasons. */
export function hypothesesByMonth(months = 6): Point[] {
  const keys = monthWindow(months);
  const all = allAccounts().flatMap((a) => hypothesesForAccount(a.id));
  return bucket(
    keys,
    all.map((h) => ({ key: monthKey(h.createdOn), value: 1 })),
  );
}

/** Evidence records captured per month, the Evidence trend. */
export function evidenceByMonth(months = 6): Point[] {
  const keys = monthWindow(months);
  return bucket(
    keys,
    allEvidence().map((e) => ({ key: monthKey(e.lastUpdated), value: 1 })),
  );
}

/** Tasks falling due per week from the reference date. */
export function tasksByWeek(weeks = 6): Point[] {
  const start = Date.parse(TODAY);
  const buckets = Array.from({ length: weeks }, (_, i) => ({ label: `W${i + 1}`, value: 0 }));
  for (const t of allTasks()) {
    if (t.status === "completed") continue;
    const index = Math.floor((Date.parse(t.due) - start) / (7 * 86_400_000));
    if (index >= 0 && index < weeks) buckets[index].value += 1;
  }
  return buckets;
}

/* ── Distributions, for modules with no honest trend ──────────────────────── */

/** Pipeline value by deal stage — Change through Outcome. */
export function pipelineByStage(): BarRow[] {
  const stages: Array<[string, string]> = [
    ["change", "Change"],
    ["problem", "Problem"],
    ["people", "People"],
    ["solution", "Solution"],
    ["decision", "Decision"],
    ["outcome", "Outcome"],
  ];
  const totals = new Map(stages.map(([id]) => [id, 0]));
  for (const o of allOpportunities()) {
    totals.set(o.stage, (totals.get(o.stage) ?? 0) + o.value);
  }
  return stages.map(([id, label]) => ({
    label,
    value: totals.get(id) ?? 0,
    display: gbpShort(totals.get(id) ?? 0),
  }));
}

/** The markets carrying the most account-linked change. */
export function topMarkets(limit = 6): BarRow[] {
  return marketActivity()
    .slice(0, limit)
    .map((m) => ({
      label: MARKET_BY_ID[m.marketId]?.name ?? m.marketId,
      value: m.events,
      display: `${m.events}`,
    }));
}

/** Accounts ranked by the value of the hypotheses attached to them. */
export function topOpportunityValue(limit = 6): BarRow[] {
  return allAccounts()
    .map((a) => ({
      label: a.name,
      value: hypothesesForAccount(a.id).reduce((s, h) => s + (h.potentialValue ?? 0), 0),
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((r) => ({ ...r, display: gbpShort(r.value) }));
}

/** The largest deals, with their health as the bar. */
export function dealsByValue(limit = 6): BarRow[] {
  return [...allOpportunities()]
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((o) => ({ label: o.name, value: o.value, display: gbpShort(o.value) }));
}

/** Accounts by number of markets touched — the Accounts distribution. */
export function accountsByFootprint(limit = 6): BarRow[] {
  return allAccounts()
    .map((a) => ({ account: a, markets: marketsTouched(a.id) }))
    .sort((a, b) => b.markets - a.markets)
    .slice(0, limit)
    .map((r) => ({
      label: r.account.name,
      value: r.markets,
      display: `${r.markets} markets`,
    }));
}

function marketsTouched(accountId: string): number {
  const ids = new Set<string>();
  for (const e of allEvents()) {
    if (e.accountId !== accountId) continue;
    e.hostMarketIds.forEach((m) => ids.add(m));
    if (e.domicileMarketId) ids.add(e.domicileMarketId);
  }
  return ids.size;
}

/** Buying-group coverage by role — the People distribution. */
export function buyingRoleCoverage(): BarRow[] {
  const roles: Array<[string, string]> = [
    ["executive-decision", "Executive"],
    ["business-ownership", "Business"],
    ["operations-delivery", "Operations"],
    ["legal-compliance", "Legal"],
    ["procurement", "Procurement"],
  ];
  const counts = new Map(roles.map(([id]) => [id, 0]));
  for (const p of allPeople()) {
    if (p.internal) continue;
    counts.set(p.commercial.likelyRole, (counts.get(p.commercial.likelyRole) ?? 0) + 1);
  }
  return roles.map(([id, label]) => ({
    label,
    value: counts.get(id) ?? 0,
    display: counts.get(id) ? `${counts.get(id)} mapped` : "none mapped",
  }));
}

/** Service relationships by lifecycle stage — the Delivery distribution. */
export function deliveryByLifecycle(): BarRow[] {
  const stages: Array<[string, string]> = [
    ["onboarding", "Onboarding"],
    ["live", "Live service"],
    ["change", "Change"],
    ["renewal", "Renewal"],
    ["expansion", "Expansion"],
  ];
  const totals = new Map(stages.map(([id]) => [id, 0]));
  for (const r of allServiceRelationships()) {
    totals.set(r.lifecycle, (totals.get(r.lifecycle) ?? 0) + 1);
  }
  return stages.map(([id, label]) => ({
    label,
    value: totals.get(id) ?? 0,
    display: `${totals.get(id) ?? 0}`,
  }));
}

/** Evidence by state — the shape of what the system actually knows. */
export function evidenceByState(): BarRow[] {
  const states: Array<[string, string]> = [
    ["verified-fact", "Verified fact"],
    ["system-suggestion", "System suggestion"],
    ["seller-hypothesis", "Seller hypothesis"],
    ["still-to-learn", "Still to learn"],
  ];
  const counts = new Map(states.map(([id]) => [id, 0]));
  for (const e of allEvidence()) counts.set(e.state, (counts.get(e.state) ?? 0) + 1);
  return states.map(([id, label]) => ({
    label,
    value: counts.get(id) ?? 0,
    display: `${counts.get(id) ?? 0}`,
  }));
}

/** Ontology objects by class — the Knowledge Graph distribution. */
export function graphByClass(): BarRow[] {
  const rows: Array<[string, number]> = [
    ["Accounts", allAccounts().length],
    ["Evidence", allEvidence().length],
    ["Events", allEvents().length],
    ["People", allPeople().length],
    ["Services", allServiceRelationships().length],
    ["Deals", allOpportunities().length],
  ];
  return rows
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value, display: `${value}` }));
}

/** Regions by markets carrying active work — the Global distribution. */
export function marketsByRegion(): BarRow[] {
  const counts = new Map<string, number>();
  for (const m of marketActivity()) {
    const market = MARKET_BY_ID[m.marketId];
    if (!market) continue;
    counts.set(market.region, (counts.get(market.region) ?? 0) + 1);
  }
  const labels: Record<string, string> = {
    europe: "Europe",
    "north-america": "North America",
    apac: "Asia Pacific",
    memea: "Middle East and Africa",
    latam: "Latin America",
  };
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([region, value]) => ({
      label: labels[region] ?? region,
      value,
      display: `${value} markets`,
    }));
}

/* ── Small derived figures the KPI tiles need ─────────────────────────────── */

export function averageHealthPct(): number {
  const deals = allOpportunities();
  if (!deals.length) return 0;
  return Math.round((deals.reduce((s, d) => s + healthScore(d), 0) / deals.length) * 100);
}

export function closeDateSlips(): number {
  return allOpportunities().reduce((s, d) => s + d.closeDateMoves, 0);
}

export function dealStateCounts(): { healthy: number; watch: number; intervene: number } {
  const deals = allOpportunities();
  return {
    healthy: deals.filter((d) => dealState(d) === "healthy").length,
    watch: deals.filter((d) => dealState(d) === "watch").length,
    intervene: deals.filter((d) => dealState(d) === "intervene").length,
  };
}

export function renewalValueWithin(days: number): number {
  return renewalsWithin(days).reduce((s, r) => s + (r.arr ?? 0), 0);
}

export { gbpShort };
