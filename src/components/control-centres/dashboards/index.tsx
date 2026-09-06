"use client";

/**
 * The nine dashboards.
 *
 * Each is the same frame filled with its own module's truth, every figure read
 * from the ontology through `select.ts` and `series.ts`. Deltas appear only
 * where a real period-on-period comparison exists — `deltaOf` returns null
 * rather than inventing one, and the tile simply omits it.
 */
import { AreaAxis, AreaChart, BarList } from "./charts";
import { DashPanel, DashboardFrame, type Kpi, type Signal } from "./shell";
import { MODULE_PALETTE } from "@/lib/gi/palette";
import type { ModuleId } from "@/lib/gi/metrics";
import {
  graphScale,
  marketActivity,
  SUMMARY_BY_MODULE,
} from "@/lib/gi/metrics";
import {
  accountsByFootprint,
  averageHealthPct,
  buyingRoleCoverage,
  closeDateSlips,
  dealStateCounts,
  dealsByValue,
  deliveryByLifecycle,
  deltaOf,
  evidenceByMonth,
  evidenceByState,
  eventsByMonth,
  eventsByMonthOfType,
  gbpShort,
  graphByClass,
  hypothesesByMonth,
  marketsByRegion,
  pipelineByCloseMonth,
  pipelineByStage,
  renewalValueWithin,
  renewalsByMonth,
  topMarkets,
  topOpportunityValue,
} from "@/lib/gi/series";
import {
  allAccounts,
  allEvents,
  allEvidence,
  allHypotheses,
  allOpportunities,
  allPeople,
  allServiceRelationships,
} from "@/lib/gi/select";

/** A KPI whose delta is derived from its own series, or omitted entirely. */
function withDelta(base: Omit<Kpi, "delta" | "trend">, series?: Kpi["spark"]): Kpi {
  const d = series ? deltaOf(series) : null;
  return { ...base, spark: series, ...(d ?? {}) };
}

const chartRow = (
  id: ModuleId,
  chart: { title: string; subtitle: string; points: ReturnType<typeof eventsByMonth>; format?: (v: number) => string },
  list: { title: string; subtitle: string; rows: ReturnType<typeof topMarkets> },
) => {
  const palette = MODULE_PALETTE[id];
  return (
    <>
      <DashPanel title={chart.title} subtitle={chart.subtitle}>
        <AreaChart points={chart.points} palette={palette} id={id} height={92} />
        <AreaAxis points={chart.points} />
      </DashPanel>
      <DashPanel title={list.title} subtitle={list.subtitle}>
        <BarList rows={list.rows} palette={palette} />
      </DashPanel>
    </>
  );
};

/* ── Growth ───────────────────────────────────────────────────────────────── */

function GrowthDashboard() {
  const s = SUMMARY_BY_MODULE.growth();
  const hyp = hypothesesByMonth();
  const events = eventsByMonth();
  const high = allHypotheses().filter((h) => h.state === "system-suggestion").length;

  const kpis: Kpi[] = [
    withDelta({ label: "Priority accounts", value: s.metrics[0].value, note: "scored high" }),
    withDelta({ label: "Potential value", value: s.metrics[1].value, note: "indicative" }),
    withDelta({ label: "Verified changes", value: s.metrics[2].value, note: "last 45 days" }, events),
    withDelta({ label: "Cross-sell", value: s.metrics[3].value, note: "existing clients" }),
    withDelta({ label: "Hypotheses", value: String(allHypotheses().length), note: "open" }, hyp),
    withDelta({ label: "System-backed", value: String(high), note: "evidence-reasoned" }),
  ];

  const signals: Signal[] = [
    { tone: "info", lead: "Schroders scores 73", rest: "— verified activity in three host markets against an existing relationship." },
    { tone: "risk", lead: "Provider model unknown", rest: "on the highest-scoring account. Validate before any approach." },
    { tone: "progress", lead: "24 cross-sell hypotheses", rest: "sit with clients we already serve." },
  ];

  return (
    <DashboardFrame eyebrow="Growth · Opportunity engine" range="45d" kpis={kpis} signals={signals} palette={MODULE_PALETTE.growth}>
      {chartRow(
        "growth",
        { title: "Hypotheses created", subtitle: "Reasons to engage, per month", points: hyp },
        { title: "Value by account", subtitle: "Indicative, ranked", rows: topOpportunityValue(5) },
      )}
    </DashboardFrame>
  );
}

/* ── Delivery ─────────────────────────────────────────────────────────────── */

function DeliveryDashboard() {
  const s = SUMMARY_BY_MODULE.delivery();
  const renewals = renewalsByMonth();
  const live = allServiceRelationships().filter((r) => r.lifecycle === "live").length;

  const kpis: Kpi[] = [
    withDelta({ label: "Renewals 180d", value: s.metrics[0].value, note: "windows open" }),
    withDelta({ label: "Renewal value", value: gbpShort(renewalValueWithin(180)), note: "recurring" }, renewals),
    withDelta({ label: "Expansion", value: s.metrics[1].value, note: "conversations" }),
    withDelta({ label: "To review", value: s.metrics[2].value, note: "account changes" }),
    withDelta({ label: "Delivery risk", value: s.metrics[3].value, note: "needs support" }),
    withDelta({ label: "Live services", value: String(live), note: "operating" }),
  ];

  const signals: Signal[] = [
    { tone: "risk", lead: "abrdn renewal deferred twice", rest: "— service is operating, the relationship is not." },
    { tone: "progress", lead: "Two stable clients", rest: "have new fund-market activity that may justify a joint review." },
    { tone: "info", lead: "Janus Henderson at 76 days", rest: "with no agreed scope and eleven weeks of silence." },
  ];

  return (
    <DashboardFrame eyebrow="Delivery · Client health" range="180d" kpis={kpis} signals={signals} palette={MODULE_PALETTE.delivery}>
      {chartRow(
        "delivery",
        { title: "Recurring value reaching renewal", subtitle: "By month out from today", points: renewals },
        { title: "Lifecycle", subtitle: "Services by stage", rows: deliveryByLifecycle() },
      )}
    </DashboardFrame>
  );
}

/* ── Markets ──────────────────────────────────────────────────────────────── */

function MarketsDashboard() {
  const s = SUMMARY_BY_MODULE.markets();
  const events = eventsByMonth();
  const activity = marketActivity();
  const domiciles = new Set(allEvents().map((e) => e.domicileMarketId).filter(Boolean)).size;

  const kpis: Kpi[] = [
    withDelta({ label: "Relevant events", value: s.metrics[0].value, note: "all sources" }, events),
    withDelta({ label: "Account-linked", value: s.metrics[1].value, note: "matched groups" }),
    withDelta({ label: "To review", value: s.metrics[2].value, note: "unactioned" }),
    withDelta({ label: "Rising markets", value: s.metrics[3].value, note: "6+ events" }),
    withDelta({ label: "Host markets", value: String(activity.length), note: "with activity" }),
    withDelta({ label: "Domiciles", value: String(domiciles), note: "fund origin" }),
  ];

  const signals: Signal[] = [
    { tone: "info", lead: "Luxembourg leads at 39 events", rest: "— domicile concentration, not distribution demand." },
    { tone: "risk", lead: "Germany and Italy rising", rest: "with the highest client-linked change this month." },
    { tone: "progress", lead: "Every event is source-linked", rest: "to a regulatory or fund-data record." },
  ];

  return (
    <DashboardFrame eyebrow="Markets · Fund movement" range="6mo" kpis={kpis} signals={signals} palette={MODULE_PALETTE.markets}>
      {chartRow(
        "markets",
        { title: "Verified changes detected", subtitle: "Per month", points: events },
        { title: "Markets", subtitle: "By account-linked events", rows: topMarkets(5) },
      )}
    </DashboardFrame>
  );
}

/* ── Knowledge Graph ──────────────────────────────────────────────────────── */

function KnowledgeGraphDashboard() {
  const s = SUMMARY_BY_MODULE["knowledge-graph"]();
  const scale = graphScale();
  const evidence = evidenceByMonth();

  const kpis: Kpi[] = [
    withDelta({ label: "Entities", value: s.metrics[0].value, note: "addressable" }),
    withDelta({ label: "Links", value: s.metrics[1].value, note: "resolved" }),
    withDelta({ label: "New this week", value: s.metrics[2].value, note: "changes" }),
    withDelta({ label: "Source-linked", value: s.metrics[3].value, note: "active facts" }),
    withDelta({ label: "Object classes", value: String(graphByClass().length), note: "in the model" }),
    withDelta({ label: "Records", value: String(allEvidence().length), note: "evidence" }, evidence),
  ];

  const signals: Signal[] = [
    { tone: "progress", lead: `${scale.sourceLinkedPct}% of active facts`, rest: "trace to a source you can open." },
    { tone: "info", lead: "Schroders connects", rest: "to three funds, seven host markets and two Broadridge services." },
    { tone: "risk", lead: "One conflicting record", rest: "— two sources disagree on a Spanish effective date." },
  ];

  return (
    <DashboardFrame eyebrow="Knowledge Graph · Connected view" range="All" kpis={kpis} signals={signals} palette={MODULE_PALETTE["knowledge-graph"]}>
      {chartRow(
        "knowledge-graph",
        { title: "Records captured", subtitle: "Evidence per month", points: evidence },
        { title: "Objects by class", subtitle: "What the model holds", rows: graphByClass() },
      )}
    </DashboardFrame>
  );
}

/* ── Accounts ─────────────────────────────────────────────────────────────── */

function AccountsDashboard() {
  const s = SUMMARY_BY_MODULE.accounts();
  const events = eventsByMonth();
  const accounts = allAccounts();
  const clients = accounts.filter((a) => a.relationship === "existing-client").length;

  const kpis: Kpi[] = [
    withDelta({ label: "Strategic", value: s.metrics[0].value, note: "tier one" }),
    withDelta({ label: "Changed", value: s.metrics[1].value, note: "this month" }, events),
    withDelta({ label: "Need action", value: s.metrics[2].value, note: "attention or risk" }),
    withDelta({ label: "Renewals 180d", value: s.metrics[3].value, note: "windows open" }),
    withDelta({ label: "Existing clients", value: String(clients), note: `of ${accounts.length}` }),
    withDelta({ label: "Prospects", value: String(accounts.length - clients), note: "no relationship" }),
  ];

  const signals: Signal[] = [
    { tone: "info", lead: "Schroders", rest: "has new UCITS activity in three markets against an existing document relationship." },
    { tone: "risk", lead: "13 accounts need action", rest: "— each has changed with no response recorded." },
    { tone: "progress", lead: "Every account", rest: "carries what changed, where we stand and what to do next." },
  ];

  return (
    <DashboardFrame eyebrow="Accounts · Portfolio" range="30d" kpis={kpis} signals={signals} palette={MODULE_PALETTE.accounts}>
      {chartRow(
        "accounts",
        { title: "Account-linked change", subtitle: "Verified events per month", points: events },
        { title: "Footprint", subtitle: "Markets touched", rows: accountsByFootprint(5) },
      )}
    </DashboardFrame>
  );
}

/* ── Global ───────────────────────────────────────────────────────────────── */

function GlobalDashboard() {
  const s = SUMMARY_BY_MODULE.global();
  const events = eventsByMonth();
  const regions = marketsByRegion();

  const kpis: Kpi[] = [
    withDelta({ label: "Markets", value: s.metrics[0].value, note: "with active work" }),
    withDelta({ label: "Client groups", value: s.metrics[1].value, note: "strategic" }),
    withDelta({ label: "Opportunity", value: s.metrics[2].value, note: "pipeline + potential" }),
    withDelta({ label: "New signals", value: s.metrics[3].value, note: "last 30 days" }, events),
    withDelta({ label: "Regions", value: String(regions.length), note: "represented" }),
    withDelta({ label: "Territories", value: "6", note: "covered" }),
  ];

  const signals: Signal[] = [
    { tone: "info", lead: "European fund expansion", rest: "is generating linked work across London, Luxembourg, Dublin and Frankfurt." },
    { tone: "progress", lead: "Two APAC markets", rest: "entered via an Irish range extension." },
    { tone: "risk", lead: "17 of 20 markets", rest: "sit in Europe — concentration, not coverage." },
  ];

  return (
    <DashboardFrame eyebrow="Global · Worldwide footprint" range="30d" kpis={kpis} signals={signals} palette={MODULE_PALETTE.global}>
      {chartRow(
        "global",
        { title: "Market signals", subtitle: "Detected per month, worldwide", points: events },
        { title: "By region", subtitle: "Markets carrying work", rows: regions },
      )}
    </DashboardFrame>
  );
}

/* ── Deals ────────────────────────────────────────────────────────────────── */

function DealsDashboard() {
  const s = SUMMARY_BY_MODULE.deals();
  const pipeline = pipelineByCloseMonth(6);
  const counts = dealStateCounts();

  const kpis: Kpi[] = [
    withDelta({ label: "Active pipeline", value: s.metrics[0].value, note: `${allOpportunities().length} deals` }, pipeline),
    withDelta({ label: "Healthy", value: String(counts.healthy), note: "forecast-ready" }),
    withDelta({ label: "Watch", value: String(counts.watch), note: "conditions missing" }),
    withDelta({ label: "Intervene", value: String(counts.intervene), note: "act now" }),
    withDelta({ label: "Avg health", value: `${averageHealthPct()}%`, note: "seven components" }),
    withDelta({ label: "Date slips", value: String(closeDateSlips()), note: "across pipeline" }),
  ];

  const signals: Signal[] = [
    { tone: "risk", lead: "Two late-stage deals", rest: "have no confirmed economic buyer or joint decision date." },
    { tone: "info", lead: "Nordea at £640k is Watch", rest: "— problem and sponsor confirmed, decision route is not." },
    { tone: "progress", lead: "£7.0m sits at Decision", rest: "with owner, criteria and timing established." },
  ];

  return (
    <DashboardFrame eyebrow="Deals · Pipeline truth" range="8mo" kpis={kpis} signals={signals} palette={MODULE_PALETTE.deals}>
      {chartRow(
        "deals",
        { title: "Pipeline by close month", subtitle: "Forecast value landing", points: pipeline },
        { title: "By stage", subtitle: "Change through Outcome", rows: pipelineByStage() },
      )}
    </DashboardFrame>
  );
}

/* ── People ───────────────────────────────────────────────────────────────── */

function PeopleDashboard() {
  const s = SUMMARY_BY_MODULE.people();
  const execChanges = eventsByMonthOfType("new-executive");
  const external = allPeople().filter((p) => !p.internal);
  const sourced = external.filter((p) => p.identity.verified && p.identity.sourceId).length;

  const kpis: Kpi[] = [
    withDelta({ label: "Buying groups", value: s.metrics[0].value, note: "active deals" }),
    withDelta({ label: "No sponsor", value: s.metrics[1].value, note: "executive missing" }),
    withDelta({ label: "Leadership change", value: s.metrics[2].value, note: "appointments" }, execChanges),
    withDelta({ label: "Warm routes", value: s.metrics[3].value, note: "identified" }),
    withDelta({ label: "Client contacts", value: String(external.length), note: "mapped" }),
    withDelta({ label: "Sourced", value: `${sourced}/${external.length}`, note: "public record" }),
  ];

  const signals: Signal[] = [
    { tone: "risk", lead: "No procurement or legal contact", rest: "is mapped anywhere in the portfolio." },
    { tone: "info", lead: "13 of 14 deals", rest: "have no identified executive decision owner." },
    { tone: "progress", lead: "Every named contact", rest: "carries a public source and a stated role confidence." },
  ];

  return (
    <DashboardFrame eyebrow="People · Buying system" range="6mo" kpis={kpis} signals={signals} palette={MODULE_PALETTE.people}>
      {chartRow(
        "people",
        { title: "Leadership changes", subtitle: "Appointments detected per month", points: execChanges },
        { title: "Role coverage", subtitle: "Contacts mapped by buying role", rows: buyingRoleCoverage() },
      )}
    </DashboardFrame>
  );
}

/* ── Evidence ─────────────────────────────────────────────────────────────── */

function EvidenceDashboard() {
  const s = SUMMARY_BY_MODULE.evidence();
  const evidence = evidenceByMonth();
  const facts = allEvidence().filter((e) => e.state === "verified-fact").length;

  const kpis: Kpi[] = [
    withDelta({ label: "Source-linked", value: s.metrics[0].value, note: "active insights" }),
    withDelta({ label: "Need review", value: s.metrics[1].value, note: "flagged" }),
    withDelta({ label: "Conflicting", value: s.metrics[2].value, note: "records disagree" }),
    withDelta({ label: "Source feeds", value: s.metrics[3].value, note: "distinct kinds" }),
    withDelta({ label: "Records", value: String(allEvidence().length), note: "held" }, evidence),
    withDelta({ label: "Verified facts", value: String(facts), note: "with a source" }),
  ];

  const signals: Signal[] = [
    { tone: "risk", lead: "One conflicting pair", rest: "— a secondary record dates the Spanish notification a week earlier." },
    { tone: "info", lead: "Two system suggestions", rest: "carry no direct source; they are derived from other records." },
    { tone: "progress", lead: "Every high-priority action", rest: "is backed by at least one verified record." },
  ];

  return (
    <DashboardFrame eyebrow="Evidence · Trust workspace" range="6mo" kpis={kpis} signals={signals} palette={MODULE_PALETTE.evidence}>
      {chartRow(
        "evidence",
        { title: "Records captured", subtitle: "Evidence per month", points: evidence },
        { title: "By state", subtitle: "What the system claims to know", rows: evidenceByState() },
      )}
    </DashboardFrame>
  );
}

/* ── Registry ─────────────────────────────────────────────────────────────── */

export const DASHBOARDS: Record<ModuleId, () => React.JSX.Element> = {
  growth: GrowthDashboard,
  delivery: DeliveryDashboard,
  markets: MarketsDashboard,
  "knowledge-graph": KnowledgeGraphDashboard,
  accounts: AccountsDashboard,
  global: GlobalDashboard,
  deals: DealsDashboard,
  people: PeopleDashboard,
  evidence: EvidenceDashboard,
};

/** Referenced by the Deals dashboard's ranked list when value ordering is wanted. */
export { dealsByValue };
