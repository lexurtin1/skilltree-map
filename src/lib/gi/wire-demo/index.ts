/**
 * Screenshot-faithful demo content for the Wire / Client / Board IA.
 * Mixes Broadridge post-trade and fund-servicing products in one narrative.
 */

export type WireTagTone = "risk" | "opportunity" | "expansion" | "neutral";

export interface WireAction {
  label: string;
  href: string;
  primary?: boolean;
}

export interface WireCard {
  rank: number;
  account: string;
  headline: string;
  tag: string;
  tagTone: WireTagTone;
  bullets: string[];
  actions: WireAction[];
  sources: string[];
}

export interface LedgerItem {
  title: string;
  due: string;
  dueTone: "risk" | "attention" | "quiet";
}

export interface SilenceRow {
  name: string;
  months: number;
  label: string;
}

export type HoldState = "held" | "partial" | "peer-gap" | "na";

export interface ProductHoldRow {
  product: string;
  paris: HoldState;
  lux: HoldState;
  dublin: HoldState;
  cpr: HoldState;
  peer: string;
  peerPct: number;
}

export interface ClockItem {
  days: number;
  label: string;
  detail: string;
  tone: "risk" | "attention" | "quiet";
}

export interface RelEdge {
  from: string;
  to: string;
  strength: "strong" | "weak" | "none";
  note: string;
}

export type EvidenceCell = "confirmed" | "inferred" | "nothing" | "na";

export interface BoardStakeholder {
  id: string;
  name: string;
  role: string;
}

export interface BoardCriterion {
  id: string;
  label: string;
}

export interface ExecUnblock {
  title: string;
  detail: string;
  note: string;
  action: string;
  href: string;
}

export interface AtRiskDeal {
  name: string;
  value: string;
  status: string;
  confirmed: number;
  inferred: number;
  nothing: number;
}

/* ── The Wire ─────────────────────────────────────────────────────────────── */

export const WIRE_META = {
  title: "The Wire",
  stamp: "Tuesday 08:12, ranked by consequence",
};

export const WIRE_FEED: WireCard[] = [
  {
    rank: 1,
    account: "Amundi Luxembourg",
    headline: "Amundi Luxembourg files ManCo scope extension with the CSSF",
    tag: "Renewal at risk",
    tagTone: "risk",
    bullets: [
      "GPTM + Fund Communication Solutions renewal in 214 days — €1.14M combined ARR.",
      "Candriam and DPAM won similar ManCo scope work in the last cycle; Amundi has had no commercial contact for 11 months.",
      "Sean Doyle (Northern Trust alumni network) sits one hop from Amundi Lux Head of Ops — strongest path below executive.",
      "Cross-border registration filings still open in IT/ES; attach rate for FCS on peer expansions is 71%.",
    ],
    actions: [
      { label: "Draft intro request to Sean Doyle", href: "/client", primary: true },
      { label: "Open Amundi", href: "/client" },
    ],
    sources: [
      "CSSF register",
      "Contract system",
      "Salesforce",
      "Distribution Intelligence",
      "Personnel graph",
    ],
  },
  {
    rank: 2,
    account: "Robeco",
    headline: "Robeco posts two settlement-operations roles referencing T+1 readiness",
    tag: "White space",
    tagTone: "opportunity",
    bullets: [
      "Hiring signal maps to Global Post Trade Management and Settlement / T+1 — neither live at Robeco today.",
      "6 of 9 peer firms already run GPTM or equivalent; Robeco is the gap in the set.",
      "ESMA T+1 calendar (11 Oct 2027) puts the renewal window for neighbouring accounts inside the same readiness band.",
      "FundFile shows rising preference for post-trade outsourcing language in RFPs from NL peer set.",
    ],
    actions: [{ label: "Build T+1 readiness brief", href: "/today", primary: true }],
    sources: ["Careers feed", "ESMA calendar", "Ontology — peer set v4"],
  },
  {
    rank: 3,
    account: "Nordea Deal",
    headline: "Nordea deal is now in a stall state — day 71 of stage 4",
    tag: "Evidence gap",
    tagTone: "risk",
    bullets: [
      "Global Post Trade Management + Asset Servicing · €3.2M · stage 4.",
      "SME holding 14 questionnaires; 41 of 63 evidence cells still empty.",
      "11 comparable deals: median close 290d, median death 160d — day 71 sits past the early-kill window.",
      "Strongest death predictor in the set: no confirmed economic buyer by day 60.",
    ],
    actions: [{ label: "Open The Board", href: "/board", primary: true }],
    sources: ["Exchange", "Closed-deal history"],
  },
  {
    rank: 4,
    account: "Union Investment",
    headline: "Union Investment adds a fifth cross-border market — Acolin footprint expands",
    tag: "Expansion",
    tagTone: "expansion",
    bullets: [
      "Italy and Spain registration filings landed this week; Cross-border + Registration are the natural attach.",
      "Peer attach rate for Fund Communication Solutions on fifth-market expansions is 71%.",
      "Reconciliation & Matching not held — peer density 8/9 on that row.",
    ],
    actions: [{ label: "Open peer matrix pattern", href: "/client", primary: true }],
    sources: ["Fund registries", "Acolin platform"],
  },
];

export const LEDGER: LedgerItem[] = [
  { title: "Confirm SLA terms — Amundi Lux", due: "Due Fri", dueTone: "risk" },
  { title: "Send DORA evidence pack — SEB", due: "Due Tue", dueTone: "attention" },
  { title: "Reference approval — Schroders", due: "Waiting on Legal", dueTone: "quiet" },
];

export const LEDGER_NOTE =
  "Commitments made in a sales cycle stay in the graph after close, and follow the account into delivery.";

export const SILENCE: SilenceRow[] = [
  { name: "Amundi Lux", months: 11, label: "11m" },
  { name: "Eurizon", months: 8, label: "8m" },
  { name: "NN Group", months: 6, label: "6m" },
  { name: "Handelsbanken", months: 3, label: "3m" },
  { name: "Schroders", months: 0.5, label: "<1m" },
];

/* ── Client · Amundi ──────────────────────────────────────────────────────── */

export const AMUNDI = {
  name: "Amundi",
  initials: "AM",
  summary: "4 legal entities resolved · 11 source-system identities merged · ontology:client/amundi-grp",
  kpis: [
    { label: "Recurring revenue", value: "€4.31M" },
    { label: "Products held", value: "6 of 19" },
    { label: "Peer product density", value: "11 of 19" },
    { label: "Next renewal", value: "214 days" },
    { label: "Open commitments", value: "3" },
  ],
  matrixTitle: "What they hold, and what their peers hold that they don't",
  entities: ["Paris", "Lux", "Dublin", "CPR AM"] as const,
  peerSet:
    "Eurizon, DWS, Union Investment, Robeco, Candriam, NN, Generali, Allianz GI, BNP Paribas AM",
  historyNote:
    "Every red cell carries its own history. Collateral Management, Paris — proposed Q2 2023, lost on price, 22% concession requested, sponsor has since left the firm.",
};

export const AMUNDI_HOLDINGS: ProductHoldRow[] = [
  {
    product: "Global Post Trade Management",
    paris: "held",
    lux: "partial",
    dublin: "held",
    cpr: "na",
    peer: "8/9",
    peerPct: 89,
  },
  {
    product: "Asset Servicing",
    paris: "held",
    lux: "held",
    dublin: "peer-gap",
    cpr: "partial",
    peer: "7/9",
    peerPct: 78,
  },
  {
    product: "Reconciliation & Matching",
    paris: "peer-gap",
    lux: "peer-gap",
    dublin: "held",
    cpr: "na",
    peer: "8/9",
    peerPct: 89,
  },
  {
    product: "Collateral Management",
    paris: "peer-gap",
    lux: "na",
    dublin: "peer-gap",
    cpr: "na",
    peer: "5/9",
    peerPct: 56,
  },
  {
    product: "Cross-border distribution",
    paris: "held",
    lux: "held",
    dublin: "partial",
    cpr: "held",
    peer: "9/9",
    peerPct: 100,
  },
  {
    product: "Fund registration",
    paris: "held",
    lux: "held",
    dublin: "held",
    cpr: "partial",
    peer: "8/9",
    peerPct: 89,
  },
  {
    product: "Fund Communication Solutions",
    paris: "partial",
    lux: "held",
    dublin: "peer-gap",
    cpr: "peer-gap",
    peer: "6/9",
    peerPct: 67,
  },
  {
    product: "SalesWatch",
    paris: "peer-gap",
    lux: "peer-gap",
    dublin: "na",
    cpr: "na",
    peer: "4/9",
    peerPct: 44,
  },
];

export const AMUNDI_CLOCK: ClockItem[] = [
  {
    days: 397,
    label: "UK/EU T+1 — 11 Oct 2027",
    detail: "Touches settlement across three entities.",
    tone: "risk",
  },
  {
    days: 214,
    label: "GPTM renewal — Dublin",
    detail: "Falls inside the T+1 readiness window.",
    tone: "attention",
  },
  {
    days: 168,
    label: "EMIR Refit reporting change — Paris and Lux",
    detail: "Regulatory reporting + workflow attach.",
    tone: "quiet",
  },
  {
    days: 92,
    label: "DORA third-party register submission",
    detail: "Evidence pack already in flight for SEB pattern.",
    tone: "quiet",
  },
];

export const AMUNDI_CLOCK_NOTE =
  "The renewal and the regulatory deadline sit in the same window. That edge is what the graph is for.";

export const AMUNDI_RELS: RelEdge[] = [
  { from: "S. Doyle (SD)", to: "Head of Ops", strength: "strong", note: "strong · North" },
  { from: "You (PR)", to: "Lux COO", strength: "weak", note: "weak · 11m silent" },
  { from: "You (PR)", to: "Group CTO", strength: "none", note: "no path" },
];

/* ── The Board · Nordea ───────────────────────────────────────────────────── */

export const NORDEA_BOARD = {
  name: "Nordea Asset Management",
  pills: [
    { label: "Global Post Trade Management + Asset Servicing", tone: "neutral" as const },
    { label: "€3.2M · stage 4 · day 71", tone: "neutral" as const },
    { label: "Stalled", tone: "risk" as const },
  ],
  summary: "Nine decision criteria. Seven people. Sixty-three cells. Forty-one are empty. The grid is the deal.",
  coverage: 35,
  confirmedPct: 22,
  inferredPct: 13,
  nothingPct: 65,
  footer: "Select any cell to see the evidence behind it, or the path to closing it.",
};

export const BOARD_STAKEHOLDERS: BoardStakeholder[] = [
  { id: "ml", name: "M. Lindqvist", role: "Head of Ops" },
  { id: "ah", name: "A. Haugen", role: "CTO" },
  { id: "kb", name: "K. Björk", role: "CFO" },
  { id: "rn", name: "R. Nissen", role: "Risk" },
  { id: "tv", name: "T. Vuori", role: "InfoSec" },
  { id: "ed", name: "E. Dahl", role: "Procurement" },
  { id: "je", name: "J. Ek", role: "New — unengaged" },
];

export const BOARD_CRITERIA: BoardCriterion[] = [
  { id: "c1", label: "Native ISO 20022 by Q1 2027" },
  { id: "c2", label: "T+1 settlement readiness, 11 Oct 2027" },
  { id: "c3", label: "Migration without parallel run" },
  { id: "c4", label: "Total cost below current in-house run" },
  { id: "c5", label: "DORA third-party register evidence" },
  { id: "c6", label: "Nordic data residency" },
  { id: "c7", label: "Penetration test within 12 months" },
  { id: "c8", label: "Named exit and reversibility plan" },
  { id: "c9", label: "Five-year price certainty" },
];

/** rows = criteria, cols = stakeholders */
export const BOARD_CELLS: EvidenceCell[][] = [
  ["confirmed", "inferred", "nothing", "na", "nothing", "nothing", "nothing"],
  ["confirmed", "confirmed", "inferred", "nothing", "nothing", "na", "nothing"],
  ["inferred", "nothing", "nothing", "na", "nothing", "nothing", "nothing"],
  ["nothing", "inferred", "confirmed", "nothing", "na", "inferred", "nothing"],
  ["confirmed", "nothing", "na", "inferred", "confirmed", "nothing", "nothing"],
  ["inferred", "confirmed", "nothing", "nothing", "inferred", "na", "nothing"],
  ["na", "nothing", "nothing", "confirmed", "confirmed", "nothing", "nothing"],
  ["nothing", "nothing", "inferred", "na", "nothing", "confirmed", "nothing"],
  ["nothing", "inferred", "confirmed", "nothing", "na", "inferred", "nothing"],
];

export const BOARD_COMPARABLES = {
  total: 11,
  won: 4,
  died: 7,
  medianClose: 290,
  medianDeath: 160,
  thisDealDay: 71,
  insight:
    "Matched on evidence topology, not on account size. The single strongest predictor of death in this set: no confirmed economic buyer by day 60.",
};

/* ── Executive ────────────────────────────────────────────────────────────── */

export const EXECUTIVE = {
  stamp: "Monday, 06:50",
  person: "M. Sleightholme — President, Broadridge International",
};

export const QUEUE_STAGES = [
  { stage: "Qualify", p90: 11, hot: false },
  { stage: "Business case", p90: 34, hot: false },
  { stage: "Security review", p90: 61, hot: true },
  { stage: "Deal desk", p90: 26, hot: false },
  { stage: "Legal", p90: 29, hot: false },
];

export const QUEUE_NOTE =
  "Medians are fine. The forecast dies in the p90 tail of the security review.";

export const EXEC_UNBLOCKS: ExecUnblock[] = [
  {
    title: "Sponsor introduction",
    detail: "Nordea Group CTO",
    note: "No path exists below your level.",
    action: "Draft",
    href: "/board",
  },
  {
    title: "Pricing exception",
    detail: "SEB, 17% on a five-year term",
    note: "Above AE authority.",
    action: "Precedent",
    href: "/executive",
  },
  {
    title: "Reference approval",
    detail: "Schroders, for the Robeco T+1 case",
    note: "Unlocks the white-space brief.",
    action: "Draft",
    href: "/",
  },
];

export const AT_RISK: AtRiskDeal[] = [
  {
    name: "Nordea AM",
    value: "€3.2M",
    status: "Day 71 — no confirmed economic buyer — 2 stakeholders unengaged",
    confirmed: 15,
    inferred: 10,
    nothing: 75,
  },
  {
    name: "Eurizon Capital",
    value: "€2.1M",
    status: "Day 44 — business case never built in their numbers",
    confirmed: 50,
    inferred: 25,
    nothing: 25,
  },
  {
    name: "Handelsbanken",
    value: "€1.7M",
    status: "Day 118 — DORA evidence outstanding 31 days",
    confirmed: 75,
    inferred: 15,
    nothing: 10,
  },
  {
    name: "Generali Investments",
    value: "€1.4M",
    status: "Day 29 — healthy — no action required",
    confirmed: 80,
    inferred: 10,
    nothing: 10,
  },
];

export const NORDEA_TIMELINE = {
  markers: [
    { day: 0, label: "d0", hot: false },
    { day: 12, label: "d12", hot: true },
    { day: 34, label: "d34", hot: false },
    { day: 58, label: "d58", hot: false },
    { day: 71, label: "d71", hot: false },
  ],
  beats: [
    {
      title: "Day 12 — signal present, unactioned",
      body: "Their board approved the ops budget line. Visible in a public filing. Nobody read it.",
      tone: "risk" as const,
    },
    {
      title: "Day 58 — their internal deadline passed",
      body: "The deal did not stall. It was never scheduled.",
      tone: "neutral" as const,
    },
  ],
};

/* ── The case ─────────────────────────────────────────────────────────────── */

export const CASE_THESIS = {
  title: "The case",
  headline: "Consequence, not coverage.",
  lede: "Growth Intelligence ranks what moved overnight by commercial consequence across Broadridge post-trade and fund servicing — then shows the path to act.",
  steps: [
    {
      label: "The Wire",
      href: "/",
      text: "Four signals ranked: ManCo filing at Amundi, T+1 hiring at Robeco, Nordea evidence stall, Union Investment expansion.",
    },
    {
      label: "Client · Amundi",
      href: "/client",
      text: "Hold vs peer matrix mixes GPTM and Asset Servicing with Cross-border, Registration and FCS — same account, both product families.",
    },
    {
      label: "The Board · Nordea",
      href: "/board",
      text: "Sixty-three cells. The deal is the empty ones — ISO 20022, T+1, DORA, price certainty.",
    },
    {
      label: "Executive",
      href: "/executive",
      text: "Three items only a president can unblock. The p90 security-review tail is where forecasts die.",
    },
  ],
};

/* ── Where it runs ────────────────────────────────────────────────────────── */

export const WHERE_IT_RUNS = {
  title: "Where it runs",
  lede: "Every Wire footer tag is a system you can open. Nothing is invented without a source.",
  flow: [
    { id: "registers", label: "Registers & filings", examples: "CSSF, ESMA, fund registries" },
    { id: "commercial", label: "Commercial systems", examples: "Salesforce, Contract system, Exchange" },
    { id: "signals", label: "External signals", examples: "Careers feed, Acolin, public filings" },
    { id: "ontology", label: "Ontology", examples: "client/amundi-grp · peer set v4 · personnel graph" },
    { id: "wire", label: "The Wire", examples: "Ranked consequence feed" },
  ],
  systems: [
    { name: "CSSF register", feeds: "ManCo scope, entity resolution", usedBy: "Wire #1, Client" },
    { name: "Contract system", feeds: "Renewals, ARR, SLA terms", usedBy: "Wire, Ledger" },
    { name: "Salesforce", feeds: "Opportunities, commitments, silence", usedBy: "Wire, Executive" },
    { name: "Distribution Intelligence", feeds: "Peer attach, market expansion", usedBy: "Wire #4, Client" },
    { name: "Personnel graph", feeds: "Introduction paths", usedBy: "Client who-knows-whom" },
    { name: "Careers feed", feeds: "Hiring / T+1 language", usedBy: "Wire #2" },
    { name: "ESMA calendar", feeds: "Regulatory deadlines", usedBy: "Clock, Board criteria" },
    { name: "Closed-deal history", feeds: "Evidence topology comparables", usedBy: "Board sidebar" },
    { name: "FundFile / SalesWatch", feeds: "Product preference, peer density", usedBy: "Client matrix" },
  ],
};
