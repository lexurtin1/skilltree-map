/**
 * Reference tables for the ontology.
 *
 * Every label the interface renders for a state, stage, service or signal type
 * comes from here. Components never hard-code business vocabulary, so the
 * language stays identical across all eleven modules.
 */
import type {
  ActionType,
  BroadridgeService,
  BuyingRole,
  Confidence,
  DealStageId,
  EngagementState,
  EntityRole,
  EvidenceState,
  GapId,
  HealthComponentId,
  HealthState,
  Market,
  ObjectKind,
  Region,
  ServiceGroup,
  ServiceLifecycle,
  SignalType,
  SourceKind,
  StateMarker,
} from "./types";

/* ── State markers ────────────────────────────────────────────────────────── */

export interface StateMarkerMeta {
  label: string;
  /** Colour is always paired with this label and a glyph — never used alone. */
  color: string;
  bg: string;
  glyph: "dot" | "ring" | "alert" | "warning" | "check" | "dashed";
  /** Sort weight: what a seller should look at first. */
  rank: number;
  description: string;
}

export const STATE_MARKERS: Record<StateMarker, StateMarkerMeta> = {
  risk: {
    label: "Material risk",
    color: "var(--state-risk)",
    bg: "var(--state-risk-bg)",
    glyph: "alert",
    rank: 5,
    description: "Revenue, delivery or relationship exposure that needs a decision.",
  },
  attention: {
    label: "Needs attention",
    color: "var(--state-attention)",
    bg: "var(--state-attention-bg)",
    glyph: "warning",
    rank: 4,
    description: "Something has moved and no one has responded to it yet.",
  },
  new: {
    label: "New change",
    color: "var(--state-new)",
    bg: "var(--state-new-bg)",
    glyph: "ring",
    rank: 3,
    description: "Verified movement recorded since the last review.",
  },
  uncertain: {
    label: "Needs validation",
    color: "var(--state-quiet)",
    bg: "var(--state-quiet-bg)",
    glyph: "dashed",
    rank: 2,
    description: "Reasoning depends on something we have not confirmed.",
  },
  progress: {
    label: "Confirmed progress",
    color: "var(--state-progress)",
    bg: "var(--state-progress-bg)",
    glyph: "check",
    rank: 1,
    description: "A customer commitment or delivery milestone was confirmed.",
  },
  quiet: {
    label: "Quiet",
    color: "var(--state-quiet)",
    bg: "var(--state-quiet-bg)",
    glyph: "dot",
    rank: 0,
    description: "No material change in the current period.",
  },
};

/* ── Evidence states ──────────────────────────────────────────────────────── */

export interface EvidenceStateMeta {
  label: string;
  color: string;
  bg: string;
  glyph: "shield" | "spark" | "question" | "gap";
  /** Shown on hover — the honest definition, in plain language. */
  definition: string;
}

export const EVIDENCE_STATES: Record<EvidenceState, EvidenceStateMeta> = {
  "verified-fact": {
    label: "Verified fact",
    color: "var(--ev-fact)",
    bg: "var(--ev-fact-bg)",
    glyph: "shield",
    definition: "Supported by a source record you can open and check.",
  },
  "system-suggestion": {
    label: "System suggestion",
    color: "var(--ev-suggestion)",
    bg: "var(--ev-suggestion-bg)",
    glyph: "spark",
    definition:
      "A recommendation reasoned from evidence. The reasoning path is shown in full.",
  },
  "seller-hypothesis": {
    label: "Seller hypothesis",
    color: "var(--ev-hypothesis)",
    bg: "var(--ev-hypothesis-bg)",
    glyph: "question",
    definition: "A commercial idea to validate with the client. Not yet established.",
  },
  "still-to-learn": {
    label: "Still to learn",
    color: "var(--ev-gap)",
    bg: "var(--ev-gap-bg)",
    glyph: "gap",
    definition: "A material gap in what we know. Named so it does not get assumed away.",
  },
};

export const CONFIDENCE: Record<Confidence, { label: string; weight: number }> = {
  high: { label: "High", weight: 1 },
  medium: { label: "Medium", weight: 0.65 },
  low: { label: "Low", weight: 0.35 },
};

/* ── Deal stages (§9) ─────────────────────────────────────────────────────── */

export interface DealStageMeta {
  id: DealStageId;
  index: number;
  label: string;
  /** What the stage actually means — shown in the timeline tooltip. */
  meaning: string;
}

export const DEAL_STAGES: DealStageMeta[] = [
  {
    id: "change",
    index: 0,
    label: "Change",
    meaning:
      "A credible reason the customer may consider changing, expanding or reviewing something.",
  },
  {
    id: "problem",
    index: 1,
    label: "Problem",
    meaning: "The customer has confirmed a real problem or desired outcome.",
  },
  {
    id: "people",
    index: 2,
    label: "People",
    meaning: "Required buyer roles have been identified and are engaged.",
  },
  {
    id: "solution",
    index: 3,
    label: "Solution",
    meaning:
      "Scope, desired result, Broadridge product fit and proof points are understood.",
  },
  {
    id: "decision",
    index: 4,
    label: "Decision",
    meaning:
      "Decision owner, criteria, procurement route, timeline and joint next step are clear.",
  },
  {
    id: "outcome",
    index: 5,
    label: "Outcome",
    meaning: "Win, loss, delay or disqualification recorded with a reason.",
  },
];

export const DEAL_STAGE_BY_ID = Object.fromEntries(
  DEAL_STAGES.map((s) => [s.id, s]),
) as Record<DealStageId, DealStageMeta>;

export const HEALTH_COMPONENTS: Array<{
  id: HealthComponentId;
  label: string;
  question: string;
}> = [
  {
    id: "momentum",
    label: "Customer momentum",
    question: "Has the customer done something meaningful recently?",
  },
  {
    id: "buying-group",
    label: "Buying group coverage",
    question: "Are the required buyer roles identified and engaged?",
  },
  {
    id: "next-step",
    label: "Next-step quality",
    question: "Is there a dated commitment both sides have agreed?",
  },
  {
    id: "value-case",
    label: "Value case",
    question: "Has the customer validated the value, not just heard it?",
  },
  {
    id: "decision-timing",
    label: "Decision timing",
    question: "Is the decision route and target date confirmed?",
  },
  {
    id: "competitive",
    label: "Competitive understanding",
    question: "Do we know the current provider and the alternatives in play?",
  },
  {
    id: "data-completeness",
    label: "Data completeness",
    question: "Is the record complete enough to forecast on?",
  },
];

export const GAPS: Record<GapId, { label: string; resolveWith: string }> = {
  "economic-buyer": {
    label: "Economic buyer not confirmed",
    resolveWith: "Request executive route",
  },
  "mutual-next-step": {
    label: "No mutual next step",
    resolveWith: "Create mutual action plan",
  },
  "provider-model": {
    label: "Provider model unknown",
    resolveWith: "Ask colleague",
  },
  "legal-compliance": {
    label: "Legal/compliance not engaged",
    resolveWith: "Assign research",
  },
  "value-case": {
    label: "Value case not validated",
    resolveWith: "Add question to meeting",
  },
  "close-date-slip": {
    label: "Close date moved twice",
    resolveWith: "Run decision-process review",
  },
  "procurement-route": {
    label: "Procurement route unknown",
    resolveWith: "Assign research",
  },
  "decision-date": {
    label: "No joint decision date",
    resolveWith: "Create mutual action plan",
  },
};

export const DEAL_STATES: Record<
  "healthy" | "watch" | "intervene",
  { label: string; marker: StateMarker }
> = {
  healthy: { label: "Healthy", marker: "progress" },
  watch: { label: "Watch", marker: "attention" },
  intervene: { label: "Needs intervention", marker: "risk" },
};

/* ── Signals (§7 market moments) ──────────────────────────────────────────── */

export interface SignalTypeMeta {
  label: string;
  /** What it means commercially, in one line. */
  meaning: string;
  defaultMateriality: 1 | 2 | 3 | 4 | 5;
}

export const SIGNAL_TYPES: Record<SignalType, SignalTypeMeta> = {
  "new-market-entry": {
    label: "New market entry",
    meaning: "A fund range became marketable in a market it was not in before.",
    defaultMateriality: 5,
  },
  "fund-range-expansion": {
    label: "Fund range expansion",
    meaning: "New funds, sub-funds or share classes were added to a range.",
    defaultMateriality: 4,
  },
  "regulatory-deadline": {
    label: "Regulatory deadline",
    meaning: "A dated obligation applies to funds this group operates.",
    defaultMateriality: 4,
  },
  "new-manco-aifm-activity": {
    label: "New ManCo or AIFM activity",
    meaning: "A management company took on new funds or new permissions.",
    defaultMateriality: 4,
  },
  "fund-structure-change": {
    label: "Fund structure change",
    meaning: "A merger, redomiciliation or restructure changed the fund set.",
    defaultMateriality: 4,
  },
  "distribution-shift": {
    label: "Distribution shift",
    meaning: "The route to investors changed — platform, channel or partner.",
    defaultMateriality: 3,
  },
  "investor-comms-change": {
    label: "Investor communications change",
    meaning: "How the group communicates with investors is being reworked.",
    defaultMateriality: 3,
  },
  "client-consolidation": {
    label: "Client consolidation",
    meaning: "Entities, ranges or operations are being brought together.",
    defaultMateriality: 4,
  },
  "service-provider-change": {
    label: "Service-provider change",
    meaning: "An incumbent provider relationship changed or came up for review.",
    defaultMateriality: 5,
  },
  "competitor-movement": {
    label: "Competitor movement",
    meaning: "A competing provider moved on this account.",
    defaultMateriality: 3,
  },
  "renewal-plus-change": {
    label: "Renewal plus change",
    meaning: "A renewal window coincides with material change at the client.",
    defaultMateriality: 5,
  },
  "new-executive": {
    label: "New executive",
    meaning: "A relevant senior appointment changed who decides.",
    defaultMateriality: 3,
  },
};

/* ── Broadridge capability (§1) ───────────────────────────────────────────── */

export const SERVICE_GROUPS: Record<ServiceGroup, { label: string; color: string }> = {
  distribution: { label: "Cross-border distribution", color: "#14477e" },
  communications: { label: "Fund communications", color: "#2f6ba8" },
  data: { label: "Fund data", color: "#3f7f9c" },
  regulatory: { label: "Regulatory", color: "#4a4f9c" },
  intelligence: { label: "Market intelligence", color: "#1c7a52" },
  technology: { label: "Operations and technology", color: "#5b6b7c" },
  "post-trade": { label: "Post trade", color: "#8a3d12" },
};

export const BROADRIDGE_SERVICES: BroadridgeService[] = [
  {
    id: "svc-xborder",
    name: "Cross-border fund distribution",
    short: "Cross-border distribution",
    group: "distribution",
    description:
      "Getting a fund range marketable in new host markets and keeping it that way.",
    fitSignals: ["new-market-entry", "fund-range-expansion", "client-consolidation"],
  },
  {
    id: "svc-registration",
    name: "Fund registration and legal representation",
    short: "Registration and legal representation",
    group: "distribution",
    description:
      "Filing, maintaining and representing fund registrations in each host market.",
    fitSignals: ["new-market-entry", "fund-structure-change", "new-manco-aifm-activity"],
  },
  {
    id: "svc-compliance",
    name: "Ongoing fund compliance support",
    short: "Ongoing compliance support",
    group: "regulatory",
    description:
      "Keeping a distributed range compliant across every market it is sold in.",
    fitSignals: ["regulatory-deadline", "new-market-entry", "fund-structure-change"],
  },
  {
    id: "svc-fcs",
    name: "Fund Communication Solutions",
    short: "Fund Communication Solutions",
    group: "communications",
    description:
      "Producing and distributing regulated fund documents across markets and languages.",
    fitSignals: [
      "fund-range-expansion",
      "new-market-entry",
      "investor-comms-change",
      "renewal-plus-change",
    ],
  },
  {
    id: "svc-docs",
    name: "Fund document production and distribution",
    short: "Document production",
    group: "communications",
    description:
      "Assembling, versioning and delivering fund documents to every required recipient.",
    fitSignals: ["fund-range-expansion", "regulatory-deadline", "investor-comms-change"],
  },
  {
    id: "svc-funddata",
    name: "Fund data management and distribution",
    short: "Fund data management",
    group: "data",
    description:
      "Maintaining fund reference and performance data and syndicating it to platforms.",
    fitSignals: ["fund-range-expansion", "distribution-shift", "client-consolidation"],
  },
  {
    id: "svc-regreporting",
    name: "Regulatory reporting",
    short: "Regulatory reporting",
    group: "regulatory",
    description: "Producing and filing the regulatory reports a fund range owes.",
    fitSignals: ["regulatory-deadline", "new-manco-aifm-activity", "new-market-entry"],
  },
  {
    id: "svc-regworkflow",
    name: "PRIIPs, UCITS, MiFID II, AIFMD, SFDR, SDR and EET workflow support",
    short: "Regulatory workflow",
    group: "regulatory",
    description:
      "Running the recurring regulatory document and data workflows end to end.",
    fitSignals: ["regulatory-deadline", "fund-structure-change", "new-market-entry"],
  },
  {
    id: "svc-translation",
    name: "Translation and language services",
    short: "Translation and language",
    group: "communications",
    description:
      "Regulated translation for every host-market language a range is sold into.",
    fitSignals: ["new-market-entry", "fund-range-expansion", "regulatory-deadline"],
  },
  {
    id: "svc-marketintel",
    name: "European fund market intelligence",
    short: "Market intelligence",
    group: "intelligence",
    description: "Where money is moving across European fund markets, and why.",
    fitSignals: ["distribution-shift", "competitor-movement", "client-consolidation"],
  },
  {
    id: "svc-saleswatch",
    name: "SalesWatch and fund sales benchmarking",
    short: "SalesWatch",
    group: "intelligence",
    description: "Benchmarking a group's fund sales against the market it competes in.",
    fitSignals: ["distribution-shift", "competitor-movement", "fund-range-expansion"],
  },
  {
    id: "svc-fundfile",
    name: "FundFile and product-preference intelligence",
    short: "FundFile",
    group: "intelligence",
    description: "What products distributors and investors are actually selecting.",
    fitSignals: ["distribution-shift", "fund-range-expansion", "new-executive"],
  },
  {
    id: "svc-investorcomms",
    name: "Investor communications and digital transformation",
    short: "Investor communications",
    group: "communications",
    description:
      "Modernising how investors receive, read and act on communications.",
    fitSignals: ["investor-comms-change", "client-consolidation", "new-executive"],
  },
  {
    id: "svc-imops",
    name: "Investment-management operations and technology",
    short: "Operations and technology",
    group: "technology",
    description:
      "The operating platform underneath investment and fund administration.",
    fitSignals: [
      "client-consolidation",
      "service-provider-change",
      "new-manco-aifm-activity",
    ],
  },
  {
    id: "svc-gptm",
    name: "Global Post Trade Management",
    short: "Global Post Trade Management",
    group: "post-trade",
    description:
      "Trade capture, confirmation, matching and settlement orchestration across markets.",
    fitSignals: ["regulatory-deadline", "service-provider-change", "client-consolidation"],
  },
  {
    id: "svc-asset-servicing",
    name: "Asset Servicing",
    short: "Asset Servicing",
    group: "post-trade",
    description:
      "Corporate actions, income, tax and custody-adjacent servicing for asset managers.",
    fitSignals: ["fund-structure-change", "client-consolidation", "new-executive"],
  },
  {
    id: "svc-collateral",
    name: "Collateral Management",
    short: "Collateral Management",
    group: "post-trade",
    description:
      "Margin, collateral optimisation and inventory across cleared and bilateral trades.",
    fitSignals: ["regulatory-deadline", "service-provider-change"],
  },
  {
    id: "svc-recon",
    name: "Reconciliation & Matching",
    short: "Reconciliation & Matching",
    group: "post-trade",
    description:
      "Break detection and matching across cash, positions and transactions.",
    fitSignals: ["service-provider-change", "client-consolidation"],
  },
  {
    id: "svc-settlement",
    name: "Settlement and T+1 readiness",
    short: "Settlement / T+1",
    group: "post-trade",
    description:
      "Settlement compression, exception handling and T+1 readiness across entities.",
    fitSignals: ["regulatory-deadline", "fund-structure-change"],
  },
];

export const SERVICE_BY_ID = Object.fromEntries(
  BROADRIDGE_SERVICES.map((s) => [s.id, s]),
) as Record<string, BroadridgeService>;

export const SERVICE_LIFECYCLE: Array<{
  id: ServiceLifecycle;
  label: string;
  index: number;
}> = [
  { id: "onboarding", label: "Onboarding", index: 0 },
  { id: "live", label: "Live service", index: 1 },
  { id: "change", label: "Change", index: 2 },
  { id: "renewal", label: "Renewal", index: 3 },
  { id: "expansion", label: "Expansion", index: 4 },
];

/* ── People ───────────────────────────────────────────────────────────────── */

export const BUYING_ROLES: Record<
  BuyingRole,
  { label: string; short: string; color: string; order: number }
> = {
  "executive-decision": {
    label: "Executive decision",
    short: "Executive",
    color: "#14477e",
    order: 0,
  },
  "business-ownership": {
    label: "Business ownership",
    short: "Business",
    color: "#2f6ba8",
    order: 1,
  },
  "operations-delivery": {
    label: "Operations and delivery",
    short: "Operations",
    color: "#3f7f9c",
    order: 2,
  },
  "legal-compliance": {
    label: "Legal and compliance",
    short: "Legal",
    color: "#4a4f9c",
    order: 3,
  },
  procurement: { label: "Procurement", short: "Procurement", color: "#8a5a08", order: 4 },
  "broadridge-team": {
    label: "Broadridge team",
    short: "Broadridge",
    color: "#1c7a52",
    order: 5,
  },
};

export const ENGAGEMENT: Record<EngagementState, { label: string; marker: StateMarker }> =
  {
    engaged: { label: "Engaged", marker: "progress" },
    stale: { label: "Relationship stale", marker: "attention" },
    "known-not-engaged": { label: "Known, not engaged", marker: "quiet" },
    "no-relationship-recorded": {
      label: "No relationship recorded",
      marker: "uncertain",
    },
  };

export const ENTITY_ROLES: Record<EntityRole, string> = {
  "ucits-manco": "UCITS management company",
  aifm: "AIFM",
  "third-party-manco": "Third-party ManCo",
  "distribution-entity": "Distribution entity",
  "platform-operator": "Platform operator",
  holding: "Holding company",
};

/* ── Actions (§17) ────────────────────────────────────────────────────────── */

export const ACTION_TYPES: Record<ActionType, { label: string; condition: string }> = {
  "request-introduction": {
    label: "Ask relationship owner for an introduction",
    condition: "High-value trigger and a strong relationship route",
  },
  "build-buyer-map": {
    label: "Build the buying-system map before outreach",
    condition: "High-value trigger and no buyer map",
  },
  "validate-operating-model": {
    label: "Validate the operating model with the current service owner",
    condition: "Existing communications client plus a cross-border signal",
  },
  "decision-process-reset": {
    label: "Run a decision-process reset",
    condition: "Late-stage deal with no mutual commitment",
  },
  "add-discovery-question": {
    label: "Add a discovery question or request an executive route",
    condition: "Missing economic buyer",
  },
  "create-hypothesis": {
    label: "Create a commercial hypothesis, not a CRM opportunity",
    condition: "Strong signal but no qualified opportunity",
  },
  "validate-provider": {
    label: "Validate the current provider and client need first",
    condition: "Possible competitor displacement",
  },
  "prepare-account-brief": {
    label: "Prepare a targeted account brief and approved discussion plan",
    condition: "Relevant new regulation",
  },
};

/* ── Health, sources, object kinds ────────────────────────────────────────── */

export const HEALTH_STATES: Record<
  HealthState,
  { label: string; marker: StateMarker }
> = {
  strong: { label: "Strong", marker: "progress" },
  stable: { label: "Stable", marker: "quiet" },
  attention: { label: "Attention", marker: "attention" },
  risk: { label: "At risk", marker: "risk" },
};

export const SOURCE_KINDS: Record<SourceKind, { label: string; trusted: boolean }> = {
  "regulatory-record": { label: "Regulatory data record", trusted: true },
  "fund-data": { label: "Fund data record", trusted: true },
  "public-announcement": { label: "Public announcement", trusted: true },
  press: { label: "Press report", trusted: false },
  "market-intelligence": { label: "Broadridge market intelligence", trusted: true },
  crm: { label: "CRM record", trusted: true },
  contract: { label: "Contract record", trusted: true },
  "internal-note": { label: "Internal note", trusted: false },
};

export const OBJECT_KINDS: Record<ObjectKind, { label: string; plural: string }> = {
  account: { label: "Account", plural: "Accounts" },
  entity: { label: "Legal entity", plural: "Legal entities" },
  fund: { label: "Fund", plural: "Funds" },
  market: { label: "Market", plural: "Markets" },
  person: { label: "Person", plural: "People" },
  service: { label: "Broadridge service", plural: "Broadridge services" },
  "service-relationship": { label: "Service relationship", plural: "Service relationships" },
  opportunity: { label: "Opportunity", plural: "Opportunities" },
  event: { label: "Market event", plural: "Market events" },
  hypothesis: { label: "Hypothesis", plural: "Hypotheses" },
  evidence: { label: "Evidence", plural: "Evidence" },
  task: { label: "Task", plural: "Tasks" },
  territory: { label: "Territory", plural: "Territories" },
};

export const ACCOUNT_TYPES = {
  "asset-manager": "Asset manager",
  "third-party-manco": "Third-party ManCo",
  "platform-distributor": "Platform and distribution",
  "wealth-manager": "Wealth manager",
  insurer: "Insurer",
  "bank-asset-manager": "Bank-owned asset manager",
} as const;

/* ── Markets ──────────────────────────────────────────────────────────────── */

export const MARKETS: Market[] = [
  { id: "lu", name: "Luxembourg", isoNumeric: "442", isoAlpha3: "LUX", region: "europe", hub: "Luxembourg", lat: 49.61, lon: 6.13, isDomicile: true, regulator: "CSSF" },
  { id: "ie", name: "Ireland", isoNumeric: "372", isoAlpha3: "IRL", region: "europe", hub: "Dublin", lat: 53.35, lon: -6.26, isDomicile: true, regulator: "Central Bank of Ireland" },
  { id: "gb", name: "United Kingdom", isoNumeric: "826", isoAlpha3: "GBR", region: "europe", hub: "London", lat: 51.51, lon: -0.13, regulator: "FCA" },
  { id: "de", name: "Germany", isoNumeric: "276", isoAlpha3: "DEU", region: "europe", hub: "Frankfurt", lat: 50.11, lon: 8.68, regulator: "BaFin" },
  { id: "it", name: "Italy", isoNumeric: "380", isoAlpha3: "ITA", region: "europe", hub: "Milan", lat: 45.46, lon: 9.19, regulator: "CONSOB" },
  { id: "es", name: "Spain", isoNumeric: "724", isoAlpha3: "ESP", region: "europe", hub: "Madrid", lat: 40.42, lon: -3.7, regulator: "CNMV" },
  { id: "fr", name: "France", isoNumeric: "250", isoAlpha3: "FRA", region: "europe", hub: "Paris", lat: 48.86, lon: 2.35, regulator: "AMF" },
  { id: "ch", name: "Switzerland", isoNumeric: "756", isoAlpha3: "CHE", region: "europe", hub: "Zurich", lat: 47.38, lon: 8.54, regulator: "FINMA" },
  { id: "nl", name: "Netherlands", isoNumeric: "528", isoAlpha3: "NLD", region: "europe", hub: "Amsterdam", lat: 52.37, lon: 4.9, regulator: "AFM" },
  { id: "se", name: "Sweden", isoNumeric: "752", isoAlpha3: "SWE", region: "europe", hub: "Stockholm", lat: 59.33, lon: 18.07, regulator: "Finansinspektionen" },
  { id: "dk", name: "Denmark", isoNumeric: "208", isoAlpha3: "DNK", region: "europe", hub: "Copenhagen", lat: 55.68, lon: 12.57, regulator: "Finanstilsynet" },
  { id: "no", name: "Norway", isoNumeric: "578", isoAlpha3: "NOR", region: "europe", hub: "Oslo", lat: 59.91, lon: 10.75, regulator: "Finanstilsynet" },
  { id: "fi", name: "Finland", isoNumeric: "246", isoAlpha3: "FIN", region: "europe", hub: "Helsinki", lat: 60.17, lon: 24.94, regulator: "FIN-FSA" },
  { id: "at", name: "Austria", isoNumeric: "040", isoAlpha3: "AUT", region: "europe", hub: "Vienna", lat: 48.21, lon: 16.37, regulator: "FMA" },
  { id: "be", name: "Belgium", isoNumeric: "056", isoAlpha3: "BEL", region: "europe", hub: "Brussels", lat: 50.85, lon: 4.35, regulator: "FSMA" },
  { id: "pt", name: "Portugal", isoNumeric: "620", isoAlpha3: "PRT", region: "europe", hub: "Lisbon", lat: 38.72, lon: -9.14, regulator: "CMVM" },
  { id: "pl", name: "Poland", isoNumeric: "616", isoAlpha3: "POL", region: "europe", hub: "Warsaw", lat: 52.23, lon: 21.01, regulator: "KNF" },
  { id: "sg", name: "Singapore", isoNumeric: "702", isoAlpha3: "SGP", region: "apac", hub: "Singapore", lat: 1.35, lon: 103.82, regulator: "MAS" },
  { id: "hk", name: "Hong Kong SAR", isoNumeric: "344", isoAlpha3: "HKG", region: "apac", hub: "Hong Kong", lat: 22.32, lon: 114.17, regulator: "SFC" },
  { id: "jp", name: "Japan", isoNumeric: "392", isoAlpha3: "JPN", region: "apac", hub: "Tokyo", lat: 35.68, lon: 139.69, regulator: "FSA" },
  { id: "au", name: "Australia", isoNumeric: "036", isoAlpha3: "AUS", region: "apac", hub: "Sydney", lat: -33.87, lon: 151.21, regulator: "ASIC" },
  { id: "us", name: "United States", isoNumeric: "840", isoAlpha3: "USA", region: "north-america", hub: "New York", lat: 40.71, lon: -74.01, regulator: "SEC" },
  { id: "ca", name: "Canada", isoNumeric: "124", isoAlpha3: "CAN", region: "north-america", hub: "Toronto", lat: 43.65, lon: -79.38, regulator: "CSA" },
  { id: "ae", name: "United Arab Emirates", isoNumeric: "784", isoAlpha3: "ARE", region: "memea", hub: "Dubai", lat: 25.2, lon: 55.27, regulator: "DFSA" },
  { id: "za", name: "South Africa", isoNumeric: "710", isoAlpha3: "ZAF", region: "memea", hub: "Johannesburg", lat: -26.2, lon: 28.05, regulator: "FSCA" },
  { id: "cl", name: "Chile", isoNumeric: "152", isoAlpha3: "CHL", region: "latam", hub: "Santiago", lat: -33.45, lon: -70.67, regulator: "CMF" },
];

export const MARKET_BY_ID = Object.fromEntries(MARKETS.map((m) => [m.id, m])) as Record<
  string,
  Market
>;

export const REGIONS: Record<Region, string> = {
  europe: "Europe",
  "north-america": "North America",
  apac: "Asia Pacific",
  memea: "Middle East and Africa",
  latam: "Latin America",
};
