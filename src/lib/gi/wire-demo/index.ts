/**
 * Demo content for Priorities / Client / Board / Executive.
 * Calastone CCO briefing: every figure is a change, a gap or a risk,
 * and every item on the main screens joins two systems.
 *
 * Headline arithmetic (literals, already summed):
 * FY target 48.0 · committed 39.8 · deliverable 37.1 · gap 8.2
 * Friday committed 40.6 · Friday gap 7.4 · gap_change +0.8 (worse)
 * Movement: 40.6 − 0.8 (abrdn) − 0.4 (HL) + 0.4 (Jupiter) = 39.8
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
  title: "Priorities",
  stamp: "Tuesday 08:12 — 5 of 17. £8.2m short of FY, £800k worse since Friday",
};

export const WIRE_FEED: WireCard[] = [
  {
    rank: 1,
    account: "Fidelity International",
    headline: "Fidelity contracting stalled at twice the median",
    tag: "Not moving",
    tagTone: "risk",
    bullets: [
      "Salesforce opp-00F31 is day 94 in contracting. Closed order-routing deals like this had a 38-day median.",
      "Of 12 order-routing deals past twice that median since 2024, 9 died before signature.",
      "Paul Elflain's team last touched the record on 22 August. Marcus Hale only takes Ross's calls.",
      "£3.1m annual sits in weighted pipeline. It has not moved since Friday.",
    ],
    actions: [
      { label: "Call Marcus Hale this week", href: "/accounts?id=acc-fidelityintl", primary: true },
      { label: "Open Fidelity", href: "/accounts?id=acc-fidelityintl" },
    ],
    sources: [
      "Salesforce, opp-00F31, 08:12",
      "Closed-deal history, 12 routing deals, 08:12",
    ],
  },
  {
    rank: 2,
    account: "abrdn",
    headline: "abrdn's sold 15 Sep go-live slips three weeks",
    tag: "At risk",
    tagTone: "risk",
    bullets: [
      "Salesforce promised 15 September. Jira CAL-2409 now says 6 October — three weeks late, £2.4m at risk.",
      "Transfers squad is booked to Jupiter until 20 September. Moving them holds abrdn and slips Jupiter.",
      "Stephen Leggett will not pull the squad without Ross. The date gets worse if this sits until Friday.",
      "This one item is the £800k of committed that went backwards since Friday.",
    ],
    actions: [
      { label: "Tell abrdn the date moves", href: "/executive", primary: true },
      { label: "Pull Transfers off Jupiter", href: "/executive" },
      { label: "Read Jira CAL-2409", href: "/executive" },
    ],
    sources: [
      "Salesforce, opp-00A19, 08:12",
      "Jira, CAL-2409, 08:12",
    ],
  },
  {
    rank: 3,
    account: "Hargreaves Lansdown",
    headline: "Hargreaves Lansdown DMI forecast fell £400k since Friday",
    tag: "Forecast down",
    tagTone: "risk",
    bullets: [
      "Weighted DMI forecast was £1.5m on Friday. Salesforce now has it at £1.1m, down £400k this week.",
      "Stage moved from commit to propose on Monday. Owner is Priya Nair, not Ross.",
      "The same DMI motion at HL last October recovered in 11 days. This one is day 2.",
    ],
    actions: [
      { label: "Ask Priya Nair for the Monday note", href: "/executive", primary: true },
    ],
    sources: [
      "Salesforce, opp-00H04 Friday snapshot, 08:12",
      "Salesforce, opp-00H04 Tuesday, 08:12",
    ],
  },
  {
    rank: 4,
    account: "Schroders",
    headline: "Schroders still invoices last year's routing this quarter",
    tag: "Not recognised",
    tagTone: "risk",
    bullets: [
      "Closed-won expansion is £1.8m in Salesforce. NetSuite INV-4418 still bills the old £0.9m run-rate this quarter.",
      "Go-live was 1 August. The first expanded invoice is still in draft, dated 8 September.",
      "Finance has it waiting-on-ops. Ops has it waiting-on-finance. £900k is not moving.",
    ],
    actions: [
      { label: "Get INV-4418 out of draft", href: "/accounts?id=acc-schroders", primary: true },
      { label: "Open Schroders", href: "/accounts?id=acc-schroders" },
    ],
    sources: [
      "Salesforce, opp-00S11 closed-won, 08:12",
      "NetSuite, INV-4418, 08:12",
    ],
  },
  {
    rank: 5,
    account: "Allfunds",
    headline: "Allfunds platform head Elena Vázquez left on Sunday",
    tag: "Buyer gone",
    tagTone: "risk",
    bullets: [
      "Elena Vázquez, head of platform, left on Sunday. Salesforce opp-00A72 is still open at £720k annual.",
      "Funds Europe posted the departure at 07:40 Monday. NetSuite 12-month revenue on the account is £1.4m.",
      "The open opportunity names her as economic buyer. No replacement is on the record.",
    ],
    actions: [
      { label: "Name the new Allfunds buyer", href: "/accounts", primary: true },
    ],
    sources: [
      "Funds Europe, 7 Sep 07:40",
      "Salesforce, opp-00A72, 08:12",
      "NetSuite, Allfunds 12m, 08:12",
    ],
  },
];

export const LEDGER: LedgerItem[] = [
  { title: "abrdn slip — £800k off committed since Friday", due: "Due Wed", dueTone: "risk" },
  { title: "HL DMI — £400k off the Friday forecast", due: "Due Fri", dueTone: "attention" },
  { title: "Jupiter data services — £400k closed, waiting on invoice", due: "Waiting on NetSuite", dueTone: "quiet" },
];

export const LEDGER_NOTE =
  "£8.2m short of the FY number. The gap grew £800k since Friday because abrdn onboarding slipped against a date Salesforce already sold.";

export const SILENCE: SilenceRow[] = [
  { name: "Allfunds", months: 11, label: "11m" },
  { name: "M&G", months: 8, label: "8m" },
  { name: "Amundi Lux", months: 6, label: "6m" },
  { name: "Baillie Gifford", months: 3, label: "3m" },
  { name: "Eurizon", months: 3, label: "3m" },
];

/* ── Client · Amundi ──────────────────────────────────────────────────────── */

export const AMUNDI = {
  name: "Amundi",
  initials: "AM",
  summary:
    "4 legal entities. Order routing live in Paris and Dublin. Lux volume is still last year's. NetSuite 12-month £2.1m.",
  kpis: [
    { label: "Days to Dublin renewal", value: "214", tone: "risk" as const },
    { label: "Recognised vs sold, this quarter", value: "£0.4m short", tone: "brand" as const },
    { label: "Delivery dates that have slipped", value: "1", tone: "attention" as const },
    { label: "Entities live on routing", value: "2 of 4", tone: "neutral" as const },
    { label: "Peers on DMI, Amundi not", value: "6 of 9", tone: "neutral" as const },
  ],
  matrixTitle: "What they hold, and what their peers hold that they don't",
  entities: ["Paris", "Lux", "Dublin", "CPR AM"] as const,
  peerSet:
    "Eurizon, DWS, Schroders, Fidelity International, Allfunds, NN, Generali, Allianz GI, BNP Paribas AM",
  historyNote:
    "Every red cell carries its own history. Data services, Paris — proposed March 2026, lost on price, 18% concession asked, sponsor left 2 August.",
};

export const AMUNDI_HOLDINGS: ProductHoldRow[] = [
  {
    product: "Order routing",
    paris: "held",
    lux: "partial",
    dublin: "held",
    cpr: "na",
    peer: "8/9",
    peerPct: 89,
  },
  {
    product: "Transfers",
    paris: "held",
    lux: "held",
    dublin: "peer-gap",
    cpr: "partial",
    peer: "7/9",
    peerPct: 78,
  },
  {
    product: "Automated onboarding",
    paris: "peer-gap",
    lux: "peer-gap",
    dublin: "held",
    cpr: "na",
    peer: "8/9",
    peerPct: 89,
  },
  {
    product: "Data services",
    paris: "peer-gap",
    lux: "na",
    dublin: "peer-gap",
    cpr: "na",
    peer: "5/9",
    peerPct: 56,
  },
  {
    product: "Distributed market infrastructure",
    paris: "peer-gap",
    lux: "peer-gap",
    dublin: "partial",
    cpr: "held",
    peer: "6/9",
    peerPct: 67,
  },
];

export const AMUNDI_CLOCK: ClockItem[] = [
  {
    days: 7,
    label: "Dublin routing renewal conversation — 15 Sep",
    detail: "Salesforce last activity on this entity: 6 months.",
    tone: "risk",
  },
  {
    days: 22,
    label: "Paris automated onboarding — now 6 Oct in Jira",
    detail: "Sold for 15 September. Already two weeks late in the sprint plan.",
    tone: "attention",
  },
  {
    days: 168,
    label: "DMI decision — Paris and Lux",
    detail: "Open Salesforce opportunity £520k. No Jira squad assigned.",
    tone: "quiet",
  },
  {
    days: 92,
    label: "DORA third-party register submission",
    detail: "NetSuite has the live routing contract. The pack is still in draft.",
    tone: "quiet",
  },
];

export const AMUNDI_CLOCK_NOTE =
  "Dublin comes up in 214 days and nobody has spoken to Lux in 6 months. That is this week's problem, not a later one.";

export const AMUNDI_RELS: RelEdge[] = [
  { from: "P. Elflain (PE)", to: "Head of Ops", strength: "strong", note: "strong · last spoke 11 Mar" },
  { from: "You (RF)", to: "Lux COO", strength: "weak", note: "weak · 6m silent" },
  { from: "You (RF)", to: "Group CTO", strength: "none", note: "no path" },
];

/* ── The Board · Nordea ───────────────────────────────────────────────────── */

export const NORDEA_BOARD = {
  name: "Nordea Asset Management",
  pills: [
    { label: "Order routing", tone: "neutral" as const },
    { label: "£1.4m · sold 15 Sep go-live · day 71", tone: "neutral" as const },
    { label: "Jira already late", tone: "risk" as const },
  ],
  summary:
    "Nine go-live criteria. Seven people. Sixty-three cells. Forty-one are empty. Jira CAL-1841 has said 6 October since July.",
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
  { id: "c1", label: "Order routing live by 15 Sep 2026" },
  { id: "c2", label: "Message specs signed this week" },
  { id: "c3", label: "No parallel run past 6 Oct" },
  { id: "c4", label: "Price at or below current Swift/fax run" },
  { id: "c5", label: "DORA third-party register pack" },
  { id: "c6", label: "Nordic data residency" },
  { id: "c7", label: "Penetration test within 12 months" },
  { id: "c8", label: "Named exit and reversibility plan" },
  { id: "c9", label: "Three-year price certainty" },
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
    "Of 11 order-routing deals with this empty-buyer pattern, 7 died. None had a confirmed economic buyer by day 60. This one is day 71.",
};

/* ── Executive ────────────────────────────────────────────────────────────── */

export const EXECUTIVE = {
  stamp: "Tuesday, 08:12",
  person: "R. Fox — Chief Commercial Officer, Calastone",
};

export const QUEUE_STAGES = [
  { stage: "Order routing", p90: 11, hot: false },
  { stage: "Transfers", p90: 34, hot: false },
  { stage: "Automated onboarding", p90: 61, hot: true },
  { stage: "Data services", p90: 26, hot: false },
  { stage: "DMI", p90: 29, hot: false },
];

export const QUEUE_NOTE =
  "Committed is £39.8m. Engineering can deliver £37.1m. The £2.7m hole is automated onboarding sitting 61 days in the p90 tail.";

export const EXEC_UNBLOCKS: ExecUnblock[] = [
  {
    title: "Move the abrdn date or the Jupiter squad",
    detail: "£2.4m at risk vs Jupiter transfers",
    note: "Stephen Leggett will not pull Transfers without you.",
    action: "Decide",
    href: "/executive",
  },
  {
    title: "Pricing exception",
    detail: "Fidelity, 12% on a three-year routing term",
    note: "Above Paul Elflain's authority. £3.1m annual if they sign this week.",
    action: "Approve",
    href: "/accounts?id=acc-fidelityintl",
  },
  {
    title: "Call Marcus Hale",
    detail: "Fidelity International, economic buyer",
    note: "No path exists below you. Day 94 in contracting.",
    action: "Call",
    href: "/accounts?id=acc-fidelityintl",
  },
];

export const AT_RISK: AtRiskDeal[] = [
  {
    name: "Fidelity International",
    value: "£3.1m",
    status: "Day 94 in contracting, median is 38",
    confirmed: 0,
    inferred: 12,
    nothing: 88,
  },
  {
    name: "abrdn",
    value: "£2.4m",
    status: "Jira go-live now 6 Oct, sold 15 Sep",
    confirmed: 10,
    inferred: 0,
    nothing: 90,
  },
  {
    name: "Schroders",
    value: "£0.9m",
    status: "NetSuite still on the old run-rate",
    confirmed: 50,
    inferred: 0,
    nothing: 50,
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
      title: "Day 12 — Jira already showed the miss",
      body: "CAL-1841 moved Nordea order-routing cutover from 15 September to 6 October. The ticket sat unread.",
      tone: "risk" as const,
    },
    {
      title: "Day 58 — their 15 September date is next week",
      body: "Jira has said 6 October since July. Lindqvist has not been told. That call is this week's.",
      tone: "neutral" as const,
    },
  ],
};

/* ── The case ─────────────────────────────────────────────────────────────── */

export const CASE_THESIS = {
  title: "The case",
  headline: "What changed, what it costs, what to decide.",
  lede: "Priorities shows Ross Fox what moved since Friday, what that does to the FY number, and which items only he can settle this week.",
  steps: [
    {
      label: "Priorities",
      href: "/",
      text: "Five of 17 cleared the bar. Fidelity stall, abrdn slip, HL forecast, Schroders invoices, Allfunds departure — ranked by money.",
    },
    {
      label: "Accounts",
      href: "/accounts",
      text: "A fact from one system stays on the dossier. The main screen only shows a join.",
    },
    {
      label: "Board",
      href: "/board",
      text: "Nordea order routing we already sold. Jira showed the miss on day 12. Forty-one cells still empty.",
    },
    {
      label: "Executive",
      href: "/executive",
      text: "Three items only Ross can settle. Onboarding's 61-day p90 is why deliverable is £37.1m against £39.8m committed.",
    },
  ],
};

/* ── Where it runs ────────────────────────────────────────────────────────── */

export const WHERE_IT_RUNS = {
  title: "Where it runs",
  lede: "Every footer tag is a system you can open. If a number has no source, it is not on the page.",
  flow: [
    { id: "registers", label: "External signals", examples: "Funds Europe, filings, Companies House" },
    { id: "commercial", label: "Salesforce", examples: "Commitments, stage age, last activity, weekly forecast" },
    { id: "signals", label: "Jira", examples: "Sprint dates, squad load, missed go-lives" },
    { id: "ontology", label: "NetSuite", examples: "Recognised revenue, invoices, 12-month run-rate" },
    { id: "wire", label: "Priorities", examples: "Ranked by money, then by what gets worse" },
  ],
  systems: [
    { name: "Salesforce", feeds: "Commitments, stage age, forecast movement, silence", usedBy: "Priorities, Executive" },
    { name: "Jira", feeds: "Go-live dates, squad allocation, delivery slips", usedBy: "Priorities #2, Executive queue" },
    { name: "NetSuite", feeds: "Recognised revenue, invoices, 12-month account value", usedBy: "Priorities #4–5, at-risk bars" },
    { name: "Closed-deal history", feeds: "Median stage age by product", usedBy: "Priorities #1, Board" },
    { name: "Funds Europe", feeds: "Personnel changes matched to open opportunities", usedBy: "Priorities #5" },
  ],
};
