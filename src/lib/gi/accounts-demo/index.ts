/**
 * Account dossiers for the Accounts workspace — illustrative commercial
 * intelligence with named source systems on every fact.
 */

export type SourceSystem =
  | "Salesforce"
  | "Jira"
  | "Granola"
  | "Bloomberg"
  | "Contract system"
  | "CSSF register"
  | "Careers feed"
  | "Exchange"
  | "FundFile"
  | "NewsWire"
  | "ServiceNow"
  | "Outlook";

export type Tone = "risk" | "attention" | "stable" | "strong" | "neutral";

export interface Sourced<T = string> {
  value: T;
  source: SourceSystem;
  asOf?: string;
}

export interface AccountListItem {
  id: string;
  name: string;
  short: string;
  aum: string;
  relationship: string;
  health: Tone;
  owner: string;
}

export interface ContactEvent {
  when: string;
  who: string;
  channel: string;
  summary: string;
  source: SourceSystem;
}

export interface SharePoint {
  date: string;
  close: number;
}

export interface OpsConcern {
  title: string;
  severity: Tone;
  detail: string;
  source: SourceSystem;
}

export interface UpcomingEvent {
  date: string;
  title: string;
  kind: string;
  source: SourceSystem;
}

export interface NewsItem {
  date: string;
  headline: string;
  source: SourceSystem;
}

export interface ProductBar {
  label: string;
  held: number;
  peer: number;
}

export interface AccountDossier {
  id: string;
  name: string;
  initials: string;
  legalName: string;
  hq: string;
  relationship: Sourced<string>;
  health: Tone;
  owner: string;
  arr: Sourced<string>;
  productsHeld: Sourced<string>;
  nextRenewal: Sourced<string>;
  lastContact: ContactEvent;
  shareTicker?: string;
  shareCurrency?: string;
  shareSeries: SharePoint[];
  shareDelta: Sourced<string>;
  opsConcerns: OpsConcern[];
  upcoming: UpcomingEvent[];
  news: NewsItem[];
  productMix: ProductBar[];
  engagementTrend: number[]; // 0–100 last 6 months
  notes: Sourced<string>;
}

export const ACCOUNT_LIST: AccountListItem[] = [
  { id: "acc-amundi", name: "Amundi", short: "AM", aum: "€2.2tn", relationship: "Existing", health: "attention", owner: "M. Oliveira" },
  { id: "acc-nordea", name: "Nordea Asset Management", short: "NO", aum: "€280bn", relationship: "Existing", health: "risk", owner: "T. Eriksen" },
  { id: "acc-robeco", name: "Robeco", short: "RO", aum: "€200bn", relationship: "Existing", health: "stable", owner: "L. Chen" },
  { id: "acc-schroders", name: "Schroders", short: "SC", aum: "£750bn", relationship: "Existing", health: "stable", owner: "A. Curtin" },
  { id: "acc-fidelityintl", name: "Fidelity International", short: "FI", aum: "$900bn", relationship: "Existing", health: "attention", owner: "A. Curtin" },
  { id: "acc-seb", name: "SEB Investment Management", short: "SE", aum: "SEK 900bn", relationship: "Existing", health: "attention", owner: "T. Eriksen" },
  { id: "acc-eurizon", name: "Eurizon Capital", short: "EU", aum: "€430bn", relationship: "Existing", health: "attention", owner: "M. Oliveira" },
  { id: "acc-unioninvestment", name: "Union Investment", short: "UI", aum: "€480bn", relationship: "Prospect", health: "stable", owner: "D. Lange" },
  { id: "acc-blackrock", name: "BlackRock", short: "BR", aum: "$11.5tn", relationship: "Existing", health: "strong", owner: "L. Chen" },
  { id: "acc-dws", name: "DWS", short: "DW", aum: "€1tn", relationship: "Existing", health: "stable", owner: "D. Lange" },
  { id: "acc-candriam", name: "Candriam", short: "CA", aum: "€150bn", relationship: "Existing", health: "attention", owner: "M. Oliveira" },
  { id: "acc-handelsbanken", name: "Handelsbanken Fonder", short: "HA", aum: "SEK 800bn", relationship: "Prospect", health: "stable", owner: "T. Eriksen" },
];

function series(base: number, wobble: number[]): SharePoint[] {
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  return wobble.map((w, i) => ({
    date: months[i] ?? `M${i}`,
    close: Math.round((base + w) * 100) / 100,
  }));
}

export const DOSSIERS: Record<string, AccountDossier> = {
  "acc-amundi": {
    id: "acc-amundi",
    name: "Amundi",
    initials: "AM",
    legalName: "Amundi S.A.",
    hq: "Paris · Lux · Dublin",
    relationship: { value: "Existing client — consolidating", source: "Salesforce", asOf: "7 Sep 2026" },
    health: "attention",
    owner: "Marta Oliveira",
    arr: { value: "€4.31M", source: "Contract system", asOf: "Q2 close" },
    productsHeld: { value: "6 of 19 Broadridge products", source: "Salesforce" },
    nextRenewal: { value: "214 days — GPTM Dublin", source: "Contract system" },
    lastContact: {
      when: "11 months ago",
      who: "Lux COO",
      channel: "Email",
      summary: "SLA clarification only — no commercial dialogue since.",
      source: "Outlook",
    },
    shareTicker: "AMUN.PA",
    shareCurrency: "€",
    shareSeries: series(68, [0, 1.2, -0.8, 2.1, 0.4, -1.5, 1.8]),
    shareDelta: { value: "+2.6% 6m", source: "Bloomberg", asOf: "8 Sep 2026" },
    opsConcerns: [
      { title: "ManCo scope extension filed with CSSF", severity: "attention", detail: "Lux entity expanding scope — renewal window overlaps T+1 readiness.", source: "CSSF register" },
      { title: "Collateral Management gap — Paris", severity: "risk", detail: "Lost on price Q2 2023; sponsor has left. Peer density 5/9.", source: "Salesforce" },
      { title: "DORA third-party register", severity: "attention", detail: "Submission due in 92 days; evidence pack pattern exists from SEB.", source: "Jira" },
    ],
    upcoming: [
      { date: "12 Sep", title: "Internal renewal prep — Dublin GPTM", kind: "Internal", source: "Outlook" },
      { date: "11 Oct 2027", title: "UK/EU T+1 go-live", kind: "Regulatory", source: "Exchange" },
      { date: "Q4 2026", title: "EMIR Refit reporting change", kind: "Regulatory", source: "Jira" },
    ],
    news: [
      { date: "5 Sep", headline: "Amundi Luxembourg files ManCo scope extension with the CSSF", source: "NewsWire" },
      { date: "28 Aug", headline: "Amundi AUM steady; European retail flows mixed", source: "Bloomberg" },
    ],
    productMix: [
      { label: "GPTM", held: 80, peer: 89 },
      { label: "Asset Servicing", held: 70, peer: 78 },
      { label: "Cross-border", held: 95, peer: 100 },
      { label: "FCS", held: 55, peer: 67 },
      { label: "Collateral", held: 10, peer: 56 },
    ],
    engagementTrend: [72, 68, 61, 48, 35, 22],
    notes: {
      value: "Strongest path is Sean Doyle → Head of Ops. No path to Group CTO below executive.",
      source: "Granola",
      asOf: "meeting 14 Mar 2025",
    },
  },
  "acc-nordea": {
    id: "acc-nordea",
    name: "Nordea Asset Management",
    initials: "NO",
    legalName: "Nordea Investment Management AB",
    hq: "Stockholm · Copenhagen · Lux",
    relationship: { value: "Existing — open GPTM + Asset Servicing deal", source: "Salesforce", asOf: "day 71" },
    health: "risk",
    owner: "Tom Eriksen",
    arr: { value: "€0.86M live · €3.2M in pipeline", source: "Contract system" },
    productsHeld: { value: "Docs + Translation + Reg workflow live", source: "Salesforce" },
    nextRenewal: { value: "Docs live stable · deal stage 4 stalled", source: "Exchange" },
    lastContact: {
      when: "9 days ago",
      who: "M. Lindqvist (Head of Ops)",
      channel: "Teams + Granola notes",
      summary: "Security questionnaires still with SME — 14 open.",
      source: "Granola",
    },
    shareTicker: "NDA-FI.HE",
    shareCurrency: "€",
    shareSeries: series(11.2, [0, -0.2, 0.3, -0.4, 0.1, -0.3, 0.2]),
    shareDelta: { value: "-1.8% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "Evidence coverage 35% — deal stall", severity: "risk", detail: "41 of 63 cells empty. No confirmed economic buyer by day 60.", source: "Exchange" },
      { title: "InfoSec questionnaire backlog", severity: "attention", detail: "14 items with SME; p90 security review is the forecast killer.", source: "Jira" },
      { title: "Nordic data residency criterion open", severity: "attention", detail: "CFO inferred only — no dated artifact.", source: "Granola" },
    ],
    upcoming: [
      { date: "15 Sep", title: "Steering committee — evidence pack", kind: "Deal", source: "Outlook" },
      { date: "Q1 2027", title: "Native ISO 20022 target", kind: "Client deadline", source: "Jira" },
      { date: "11 Oct 2027", title: "T+1 settlement readiness", kind: "Regulatory", source: "Exchange" },
    ],
    news: [
      { date: "2 Sep", headline: "Nordea AM private markets hire — Stina Rathsach Andersen", source: "NewsWire" },
      { date: "18 Aug", headline: "Nordic banks accelerate post-trade modernisation spend", source: "Bloomberg" },
    ],
    productMix: [
      { label: "GPTM", held: 0, peer: 78 },
      { label: "Asset Servicing", held: 0, peer: 67 },
      { label: "Docs", held: 100, peer: 80 },
      { label: "Reg workflow", held: 100, peer: 70 },
      { label: "Cross-border", held: 40, peer: 85 },
    ],
    engagementTrend: [40, 55, 62, 58, 45, 38],
    notes: {
      value: "Day 12 signal (ops budget line in public filing) was unactioned. Deal was never scheduled — it stalled later.",
      source: "Granola",
    },
  },
  "acc-robeco": {
    id: "acc-robeco",
    name: "Robeco",
    initials: "RO",
    legalName: "Robeco Institutional Asset Management B.V.",
    hq: "Rotterdam · Lux",
    relationship: { value: "Existing client — expansion white space", source: "Salesforce" },
    health: "stable",
    owner: "Lucy Chen",
    arr: { value: "€1.1M", source: "Contract system" },
    productsHeld: { value: "FCS live · GPTM not held", source: "Salesforce" },
    nextRenewal: { value: "FCS renewal 310 days", source: "Contract system" },
    lastContact: {
      when: "22 days ago",
      who: "Head of Settlement Ops",
      channel: "Call",
      summary: "Discussed T+1 hiring plan; open to readiness brief.",
      source: "Granola",
    },
    shareTicker: "OR.AS",
    shareCurrency: "€",
    shareSeries: series(42, [0, 0.5, 1.1, 0.2, -0.6, 0.8, 1.4]),
    shareDelta: { value: "+3.3% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "Two settlement-ops roles posted (T+1 language)", severity: "strong", detail: "Buying signal for GPTM / Settlement — 6 of 9 peers already live.", source: "Careers feed" },
      { title: "Recon & Matching peer gap", severity: "attention", detail: "Peer density 8/9; not held at Robeco.", source: "FundFile" },
    ],
    upcoming: [
      { date: "20 Sep", title: "T+1 readiness brief delivery", kind: "Sales", source: "Outlook" },
      { date: "11 Oct 2027", title: "T+1 go-live", kind: "Regulatory", source: "Exchange" },
    ],
    news: [
      { date: "6 Sep", headline: "Robeco posts settlement operations roles referencing T+1", source: "Careers feed" },
    ],
    productMix: [
      { label: "FCS", held: 100, peer: 70 },
      { label: "GPTM", held: 0, peer: 67 },
      { label: "Settlement", held: 0, peer: 56 },
      { label: "Cross-border", held: 75, peer: 90 },
    ],
    engagementTrend: [50, 52, 55, 60, 68, 74],
    notes: { value: "White-space brief should lead with peer set density, not product catalogue.", source: "Granola" },
  },
  "acc-schroders": {
    id: "acc-schroders",
    name: "Schroders",
    initials: "SC",
    legalName: "Schroders plc",
    hq: "London · Lux",
    relationship: { value: "Existing FCS client", source: "Salesforce" },
    health: "stable",
    owner: "Alex Curtin",
    arr: { value: "£1.4M", source: "Contract system" },
    productsHeld: { value: "FCS + Docs · Cross-border open", source: "Salesforce" },
    nextRenewal: { value: "120 days", source: "Contract system" },
    lastContact: {
      when: "3 days ago",
      who: "European Distribution Lead",
      channel: "In person",
      summary: "Reference approval path for Robeco T+1 case raised.",
      source: "Granola",
    },
    shareTicker: "SDR.L",
    shareCurrency: "£",
    shareSeries: series(380, [0, 5, -8, 12, 3, -4, 9]),
    shareDelta: { value: "+2.4% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "Reference approval pending Legal", severity: "attention", detail: "Blocks Robeco T+1 case reference use.", source: "Jira" },
      { title: "Cross-border model still unconfirmed", severity: "attention", detail: "New host markets DE/IT/ES without central distribution model.", source: "Salesforce" },
    ],
    upcoming: [
      { date: "18 Sep", title: "Renewal commercial review", kind: "Renewal", source: "Outlook" },
      { date: "Oct", title: "Legal reference sign-off target", kind: "Internal", source: "Jira" },
    ],
    news: [
      { date: "1 Sep", headline: "Schroders European distribution appointments continue", source: "NewsWire" },
    ],
    productMix: [
      { label: "FCS", held: 100, peer: 75 },
      { label: "Docs", held: 100, peer: 80 },
      { label: "Cross-border", held: 30, peer: 88 },
      { label: "GPTM", held: 0, peer: 55 },
    ],
    engagementTrend: [60, 62, 65, 70, 72, 78],
    notes: { value: "Strong relationship — use for references carefully; Legal gate is real.", source: "Granola" },
  },
  "acc-fidelityintl": {
    id: "acc-fidelityintl",
    name: "Fidelity International",
    initials: "FI",
    legalName: "FIL Limited",
    hq: "London · Lux · Tokyo",
    relationship: { value: "Existing — renewal in focus", source: "Salesforce" },
    health: "attention",
    owner: "Alex Curtin",
    arr: { value: "£2.1M", source: "Contract system" },
    productsHeld: { value: "FCS + Registration + SalesWatch", source: "Salesforce" },
    nextRenewal: { value: "68 days", source: "Contract system" },
    lastContact: {
      when: "Yesterday",
      who: "UK COO office",
      channel: "Teams",
      summary: "Priority meeting prep — book health discussion.",
      source: "Outlook",
    },
    shareSeries: series(0, [0, 0, 0, 0, 0, 0, 0]),
    shareDelta: { value: "Private — no listed quote", source: "Bloomberg" },
    opsConcerns: [
      { title: "Renewal inside 90 days", severity: "attention", detail: "Need mutual next step dated before commercial opens.", source: "Salesforce" },
      { title: "ServiceNow incidents on doc distribution", severity: "attention", detail: "3 P2s in 30 days — delivery narrative needed.", source: "ServiceNow" },
    ],
    upcoming: [
      { date: "9 Sep", title: "Priority account meeting", kind: "Meeting", source: "Outlook" },
      { date: "Nov", title: "Renewal commercial", kind: "Renewal", source: "Contract system" },
    ],
    news: [
      { date: "4 Sep", headline: "Fidelity International reiterates European growth focus", source: "NewsWire" },
    ],
    productMix: [
      { label: "FCS", held: 100, peer: 80 },
      { label: "Registration", held: 90, peer: 85 },
      { label: "SalesWatch", held: 100, peer: 40 },
      { label: "GPTM", held: 20, peer: 60 },
    ],
    engagementTrend: [70, 68, 72, 75, 71, 80],
    notes: { value: "Today's priority account — prepare mutual action plan before renewal.", source: "Granola" },
  },
  "acc-seb": {
    id: "acc-seb",
    name: "SEB Investment Management",
    initials: "SE",
    legalName: "SEB Investment Management AB",
    hq: "Stockholm · Lux",
    relationship: { value: "Existing client", source: "Salesforce" },
    health: "attention",
    owner: "Tom Eriksen",
    arr: { value: "€0.64M", source: "Contract system" },
    productsHeld: { value: "Reg reporting live", source: "Salesforce" },
    nextRenewal: { value: "185 days", source: "Contract system" },
    lastContact: {
      when: "16 days ago",
      who: "Risk & Compliance",
      channel: "Email",
      summary: "DORA evidence pack requested — draft in flight.",
      source: "Outlook",
    },
    shareTicker: "SEB-A.ST",
    shareCurrency: "SEK",
    shareSeries: series(145, [0, 2, -1, 3, 1, -2, 4]),
    shareDelta: { value: "+2.8% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "DORA evidence pack due", severity: "attention", detail: "Ledger item Due Tue — pattern reusable for Amundi.", source: "Jira" },
    ],
    upcoming: [
      { date: "Tue", title: "Send DORA evidence pack", kind: "Commitment", source: "Jira" },
    ],
    news: [
      { date: "30 Aug", headline: "Nordic banks publish DORA readiness updates", source: "NewsWire" },
    ],
    productMix: [
      { label: "Reg reporting", held: 100, peer: 70 },
      { label: "GPTM", held: 0, peer: 50 },
      { label: "FCS", held: 40, peer: 60 },
    ],
    engagementTrend: [55, 58, 60, 57, 62, 65],
    notes: { value: "Keep DORA pack crisp — it becomes a reference asset in Studio.", source: "Granola" },
  },
  "acc-eurizon": {
    id: "acc-eurizon",
    name: "Eurizon Capital",
    initials: "EU",
    legalName: "Eurizon Capital SGR",
    hq: "Milan · Lux",
    relationship: { value: "Existing — business case gap", source: "Salesforce" },
    health: "attention",
    owner: "Marta Oliveira",
    arr: { value: "€0.92M", source: "Contract system" },
    productsHeld: { value: "Cross-border partial", source: "Salesforce" },
    nextRenewal: { value: "Open opp €2.1M · day 44", source: "Exchange" },
    lastContact: {
      when: "8 months ago (commercial)",
      who: "Procurement",
      channel: "Email",
      summary: "Silence detection flags 8m — commercial contact stale.",
      source: "Salesforce",
    },
    shareSeries: series(0, [0, 0, 0, 0, 0, 0, 0]),
    shareDelta: { value: "Unlisted subsidiary", source: "Bloomberg" },
    opsConcerns: [
      { title: "Business case never built in their numbers", severity: "risk", detail: "Executive at-risk list — day 44.", source: "Exchange" },
    ],
    upcoming: [
      { date: "TBD", title: "Rebuild value case workshop", kind: "Deal", source: "Outlook" },
    ],
    news: [
      { date: "25 Aug", headline: "Intesa Sanpaolo AM units emphasise European platform scale", source: "NewsWire" },
    ],
    productMix: [
      { label: "Cross-border", held: 50, peer: 90 },
      { label: "GPTM", held: 0, peer: 60 },
      { label: "FCS", held: 30, peer: 65 },
    ],
    engagementTrend: [45, 42, 38, 30, 25, 20],
    notes: { value: "Do not push product — rebuild economic case first.", source: "Granola" },
  },
  "acc-unioninvestment": {
    id: "acc-unioninvestment",
    name: "Union Investment",
    initials: "UI",
    legalName: "Union Investment Privatfonds GmbH",
    hq: "Frankfurt · Lux",
    relationship: { value: "Prospect — fifth market expansion", source: "Salesforce" },
    health: "stable",
    owner: "David Lange",
    arr: { value: "—", source: "Salesforce" },
    productsHeld: { value: "None live · Acolin footprint expanding", source: "FundFile" },
    nextRenewal: { value: "n/a — prospect", source: "Salesforce" },
    lastContact: {
      when: "5 weeks ago",
      who: "Cross-border project lead",
      channel: "Intro call",
      summary: "Italy/Spain filings landed; open to FCS attach conversation.",
      source: "Granola",
    },
    shareSeries: series(0, [0, 0, 0, 0, 0, 0, 0]),
    shareDelta: { value: "Cooperative — no listing", source: "Bloomberg" },
    opsConcerns: [
      { title: "Fifth cross-border market added", severity: "strong", detail: "IT/ES registrations — 71% peer FCS attach rate.", source: "CSSF register" },
    ],
    upcoming: [
      { date: "Sep", title: "FCS attach proposal", kind: "Sales", source: "Outlook" },
    ],
    news: [
      { date: "7 Sep", headline: "Union Investment adds fifth cross-border market — Acolin expands", source: "NewsWire" },
    ],
    productMix: [
      { label: "Cross-border", held: 0, peer: 85 },
      { label: "Registration", held: 0, peer: 80 },
      { label: "FCS", held: 0, peer: 71 },
    ],
    engagementTrend: [10, 15, 20, 35, 48, 55],
    notes: { value: "Lead with peer attach rate, not Broadridge catalogue.", source: "Granola" },
  },
  "acc-blackrock": {
    id: "acc-blackrock",
    name: "BlackRock",
    initials: "BR",
    legalName: "BlackRock, Inc.",
    hq: "New York · Dublin · London",
    relationship: { value: "Existing strategic", source: "Salesforce" },
    health: "strong",
    owner: "Lucy Chen",
    arr: { value: "€6.8M", source: "Contract system" },
    productsHeld: { value: "Broad multi-product footprint", source: "Salesforce" },
    nextRenewal: { value: "Staggered — next 140 days", source: "Contract system" },
    lastContact: {
      when: "6 days ago",
      who: "EMEA Ops",
      channel: "QBR",
      summary: "Healthy QBR — expansion hypotheses parked for H1.",
      source: "Granola",
    },
    shareTicker: "BLK",
    shareCurrency: "$",
    shareSeries: series(860, [0, 12, -8, 20, 5, -10, 15]),
    shareDelta: { value: "+1.7% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "No material ops risk", severity: "strong", detail: "Monitor only — capacity for reference use.", source: "ServiceNow" },
    ],
    upcoming: [
      { date: "Oct", title: "EMEA QBR follow-up", kind: "QBR", source: "Outlook" },
    ],
    news: [
      { date: "3 Sep", headline: "BlackRock maintains European ETF and Aladdin momentum", source: "Bloomberg" },
    ],
    productMix: [
      { label: "GPTM", held: 90, peer: 90 },
      { label: "FCS", held: 80, peer: 70 },
      { label: "Cross-border", held: 95, peer: 95 },
      { label: "SalesWatch", held: 60, peer: 40 },
    ],
    engagementTrend: [80, 82, 85, 84, 88, 90],
    notes: { value: "Best-in-book health — protect, don't over-touch.", source: "Salesforce" },
  },
  "acc-dws": {
    id: "acc-dws",
    name: "DWS",
    initials: "DW",
    legalName: "DWS Group GmbH & Co. KGaA",
    hq: "Frankfurt · Lux",
    relationship: { value: "Existing — regulatory workflow opp", source: "Salesforce" },
    health: "stable",
    owner: "David Lange",
    arr: { value: "€1.9M", source: "Contract system" },
    productsHeld: { value: "Cross-border + Docs", source: "Salesforce" },
    nextRenewal: { value: "240 days", source: "Contract system" },
    lastContact: {
      when: "19 days ago",
      who: "Reg reporting lead",
      channel: "Workshop",
      summary: "Reg workflow expansion scoped.",
      source: "Granola",
    },
    shareTicker: "DWS.DE",
    shareCurrency: "€",
    shareSeries: series(38, [0, 0.4, -0.3, 0.8, 0.2, -0.5, 0.6]),
    shareDelta: { value: "+1.6% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "Reg workflow opportunity open", severity: "stable", detail: "Mapped to PRIIPs/UCITS cycle pressure.", source: "Jira" },
    ],
    upcoming: [
      { date: "Sep", title: "Reg workflow proposal review", kind: "Deal", source: "Outlook" },
    ],
    news: [
      { date: "29 Aug", headline: "DWS reiterates active and ETF European strategy", source: "NewsWire" },
    ],
    productMix: [
      { label: "Cross-border", held: 85, peer: 90 },
      { label: "Docs", held: 100, peer: 80 },
      { label: "Reg workflow", held: 20, peer: 65 },
    ],
    engagementTrend: [58, 60, 63, 66, 70, 72],
    notes: { value: "Keep regulatory narrative evidence-led.", source: "Granola" },
  },
  "acc-candriam": {
    id: "acc-candriam",
    name: "Candriam",
    initials: "CA",
    legalName: "Candriam",
    hq: "Brussels · Lux",
    relationship: { value: "Existing — renewing", source: "Salesforce" },
    health: "attention",
    owner: "Marta Oliveira",
    arr: { value: "€0.72M", source: "Contract system" },
    productsHeld: { value: "FCS renewing", source: "Salesforce" },
    nextRenewal: { value: "95 days", source: "Contract system" },
    lastContact: {
      when: "31 days ago",
      who: "Lux ManCo ops",
      channel: "Call",
      summary: "Renewal commercial framing — competitor ManCo wins noted.",
      source: "Granola",
    },
    shareSeries: series(0, [0, 0, 0, 0, 0, 0, 0]),
    shareDelta: { value: "NYLIM affiliate — no direct quote", source: "Bloomberg" },
    opsConcerns: [
      { title: "Renewal inside competitor ManCo noise", severity: "attention", detail: "Amundi peer narrative — Candriam won similar scope previously.", source: "Salesforce" },
    ],
    upcoming: [
      { date: "Oct", title: "Renewal negotiation window", kind: "Renewal", source: "Contract system" },
    ],
    news: [
      { date: "20 Aug", headline: "Candriam sustainable range continues European distribution push", source: "NewsWire" },
    ],
    productMix: [
      { label: "FCS", held: 100, peer: 70 },
      { label: "Cross-border", held: 60, peer: 85 },
    ],
    engagementTrend: [65, 60, 58, 55, 52, 50],
    notes: { value: "Defend on delivery evidence, not price alone.", source: "Granola" },
  },
  "acc-handelsbanken": {
    id: "acc-handelsbanken",
    name: "Handelsbanken Fonder",
    initials: "HA",
    legalName: "Handelsbanken Fonder AB",
    hq: "Stockholm",
    relationship: { value: "Prospect", source: "Salesforce" },
    health: "stable",
    owner: "Tom Eriksen",
    arr: { value: "—", source: "Salesforce" },
    productsHeld: { value: "None", source: "Salesforce" },
    nextRenewal: { value: "Opp €1.7M · day 118", source: "Exchange" },
    lastContact: {
      when: "3 months ago",
      who: "Ops",
      channel: "Intro",
      summary: "DORA evidence outstanding 31 days on live opp.",
      source: "Salesforce",
    },
    shareTicker: "SHB-A.ST",
    shareCurrency: "SEK",
    shareSeries: series(110, [0, 1, -0.5, 2, 0.5, -1, 1.5]),
    shareDelta: { value: "+1.4% 6m", source: "Bloomberg" },
    opsConcerns: [
      { title: "DORA evidence outstanding 31 days", severity: "attention", detail: "At-risk list — day 118.", source: "Jira" },
    ],
    upcoming: [
      { date: "Sep", title: "DORA evidence chase", kind: "Deal", source: "Jira" },
    ],
    news: [
      { date: "12 Aug", headline: "Handelsbanken maintains conservative Nordic AM posture", source: "NewsWire" },
    ],
    productMix: [
      { label: "GPTM", held: 0, peer: 45 },
      { label: "Reg reporting", held: 0, peer: 55 },
    ],
    engagementTrend: [20, 25, 40, 42, 38, 35],
    notes: { value: "Silence is short vs Amundi — keep cadence monthly.", source: "Salesforce" },
  },
};

export function getDossier(id: string): AccountDossier | undefined {
  return DOSSIERS[id];
}

/* ── Studio templates ─────────────────────────────────────────────────────── */

export type StudioKind =
  | "powerpoint"
  | "ops-questions"
  | "one-pager"
  | "executive-brief"
  | "battlecard"
  | "rfp-outline";

export interface StudioTemplate {
  id: string;
  kind: StudioKind;
  title: string;
  blurb: string;
  slidesOrSections: string[];
  brandNote: string;
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: "ppt-account-pitch",
    kind: "powerpoint",
    title: "Account pitch deck",
    blurb: "10-slide Broadridge-branded pitch for a named account — problem, peer proof, product fit, next step.",
    slidesOrSections: [
      "Title · Broadridge lockup",
      "The commercial consequence",
      "What peers already run",
      "Product fit (post-trade + fund servicing)",
      "Evidence & sources",
      "Proposed mutual plan",
      "Appendix · data room index",
    ],
    brandNote: "Navy #001F5A · white ground · IBM Plex · official lockup top-left",
  },
  {
    id: "ppt-t1-readiness",
    kind: "powerpoint",
    title: "T+1 readiness brief",
    blurb: "Settlement / GPTM narrative tied to ESMA calendar and hiring signals.",
    slidesOrSections: [
      "Title",
      "Regulatory clock",
      "Peer density on GPTM",
      "Hiring & ops signals",
      "Broadridge capability map",
      "90-day action plan",
    ],
    brandNote: "Use Priorities card #2 pattern — white space, not fear",
  },
  {
    id: "ops-discovery",
    kind: "ops-questions",
    title: "Operational discovery pack",
    blurb: "Funds-industry discovery questions across ManCo, settlement, regs, and delivery — ready to paste into Granola.",
    slidesOrSections: [
      "Entity & ManCo scope",
      "Settlement / T+1 operating model",
      "Cross-border registration owners",
      "Document production & FCS",
      "DORA / third-party register",
      "Decision criteria & economic buyer",
    ],
    brandNote: "One question per card · source field optional",
  },
  {
    id: "one-pager-leavebehind",
    kind: "one-pager",
    title: "Leave-behind one-pager",
    blurb: "Single page: consequence, peer proof, Broadridge offer, ask.",
    slidesOrSections: ["Headline", "Three bullets", "Peer strip", "CTA"],
    brandNote: "Print A4 · mark bottom-right",
  },
  {
    id: "exec-brief",
    kind: "executive-brief",
    title: "Executive unblock memo",
    blurb: "One-page memo for sponsor intros, pricing exceptions, reference approvals.",
    slidesOrSections: ["Ask", "Why only you", "Risk if delayed", "Draft language"],
    brandNote: "Matches Executive → Needs you tone",
  },
  {
    id: "battlecard",
    kind: "battlecard",
    title: "Competitive battlecard",
    blurb: "Against Candriam / Acolin / in-house — talk tracks and landmines.",
    slidesOrSections: ["When we win", "When we lose", "Trap questions", "Proof points"],
    brandNote: "Internal only · watermark",
  },
  {
    id: "rfp-outline",
    kind: "rfp-outline",
    title: "RFP response outline",
    blurb: "Section map for fund-services / post-trade RFPs with evidence placeholders.",
    slidesOrSections: [
      "Compliance & DORA",
      "Operating model",
      "Migration & exit",
      "Pricing & term",
      "References",
    ],
    brandNote: "Maps to Board evidence cells",
  },
];

export const STUDIO_KIND_LABEL: Record<StudioKind, string> = {
  powerpoint: "PowerPoint",
  "ops-questions": "Operational questions",
  "one-pager": "One-pager",
  "executive-brief": "Executive memo",
  battlecard: "Battlecard",
  "rfp-outline": "RFP outline",
};
