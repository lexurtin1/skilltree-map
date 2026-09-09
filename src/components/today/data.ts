/** Today briefing for Ross Fox, CCO, Calastone. */

export const TEAL = "#2F9B8E";
export const AMBER = "#D99A3E";
export const CRIM = "#C4675F";
export const SLATE = "#5A7391";

export type AccountStateColor = typeof TEAL | typeof AMBER | typeof CRIM | typeof SLATE;

export type CoverageCell = "a" | "t" | "n" | "g" | "r";

export interface ChainStep {
  k: string;
  t: string;
  m: string;
  dot: AccountStateColor;
}

export interface AccountAction {
  title: string;
  when: string;
  cta: string;
}

export interface AskPair {
  body: string;
  src: string;
}

export interface MapFund {
  name: string;
  dom: string;
  aum: string;
  to: string[];
}

export interface TodayAccount {
  id: string;
  name: string;
  full: string;
  short: string;
  recordId?: string;
  state: AccountStateColor;
  kind: string;
  note: string;
  rev: number;
  hq: string;
  overnight: string;
  head: string;
  chain: ChainStep[];
  action: AccountAction;
  conf: 1 | 2 | 3;
  confLabel: string;
  services: string[];
  stats: [string, string][];
  talk: string[];
  people: [string, string][];
  evidence: string[];
  funds: MapFund[];
  answers: Record<string, AskPair> & { default: AskPair };
  prepareQuestions: string[];
}

export const CITY_COORDS: Record<string, [number, number]> = {
  London: [-0.1278, 51.5074],
  Edinburgh: [-3.1883, 55.9533],
  Dublin: [-6.2603, 53.3498],
  Luxembourg: [6.1319, 49.6116],
  Frankfurt: [8.6821, 50.1109],
  Milan: [9.19, 45.4642],
  Paris: [2.3522, 48.8566],
  Madrid: [-3.7038, 40.4168],
  Zurich: [8.5417, 47.3769],
  Amsterdam: [4.9041, 52.3676],
  Vienna: [16.3738, 48.2082],
  Stockholm: [18.0686, 59.3293],
  Copenhagen: [12.5683, 55.6761],
  Oslo: [10.7522, 59.9139],
  Helsinki: [24.9384, 60.1699],
};

export const ACCOUNTS: TodayAccount[] = [
  {
    id: "fidelity",
    name: "Fidelity",
    full: "Fidelity International",
    short: "Fidelity",
    recordId: "acc-fidelityintl",
    state: AMBER,
    kind: "Not moving",
    note: "Day 94",
    rev: 3.1,
    hq: "London",
    overnight: "Still day 94 in contracting — 2.5× the routing median",
    head: "Fidelity contracting is day 94. Closed routing deals like this had a 38-day median.",
    chain: [
      {
        k: "What changed",
        t: "No stage movement since Friday",
        m: "Salesforce opp-00F31 · 08:12",
        dot: AMBER,
      },
      {
        k: "Account",
        t: "Fidelity International",
        m: "£3.1m annual · order routing · not moving",
        dot: AMBER,
      },
      {
        k: "Join",
        t: "94 days vs 38-day median for routing",
        m: "Closed-deal history · 12 deals · 9 died past 2×",
        dot: CRIM,
      },
      {
        k: "What Ross decides",
        t: "Marcus Hale only takes your calls",
        m: "Paul Elflain last touched the record 22 August",
        dot: AMBER,
      },
    ],
    action: {
      title: "Call Marcus Hale — Fidelity economic buyer",
      when: "This week · no path below you",
      cta: "Prepare the call",
    },
    conf: 3,
    confLabel: "High confidence",
    services: ["Order routing"],
    stats: [
      ["Annual not moving", "£3.1m"],
      ["Days vs median", "94 vs 38"],
      ["Died past 2×", "9 of 12"],
      ["Last Salesforce touch", "22 Aug"],
    ],
    talk: [
      "Call Marcus Hale this week. He only takes your calls.",
      "Do not leave it with Paul Elflain — day 94 is past where those deals die.",
      "The 12% three-year term is above Paul's authority. Approve it if that is what signs this week.",
    ],
    people: [
      ["Marcus Hale", "Economic buyer · only takes Ross"],
      ["Paul Elflain", "Sales · last touch 22 Aug"],
      ["Ravi Patel", "Ops · day to day"],
    ],
    evidence: [
      "Salesforce, opp-00F31, 08:12",
      "Closed-deal history, 12 routing deals, 08:12",
    ],
    funds: [
      {
        name: "Global Dividend SICAV",
        dom: "Luxembourg",
        aum: "£3.1bn",
        to: ["London", "Frankfurt", "Milan"],
      },
      {
        name: "Emerging Markets ICAV",
        dom: "Dublin",
        aum: "£1.4bn",
        to: ["Zurich", "Amsterdam"],
      },
    ],
    answers: {
      default: {
        body: "£3.1m annual order routing is not moving. Salesforce opp-00F31 is day 94 in contracting. Closed routing deals had a 38-day median. Of 12 that sat past twice that, 9 died. Marcus Hale only takes your calls.",
        src: "Salesforce opp-00F31, 08:12 · closed-deal history, 12 routing deals, 08:12.",
      },
      "Why does this matter today?": {
        body: "It has not moved since Friday and it is already past the window where comparable routing deals died. Waiting until next week is how those nine died.",
        src: "Salesforce opp-00F31, 08:12 · closed-deal history, 12 routing deals.",
      },
      "Who else should I talk to?": {
        body: "Marcus Hale. Paul Elflain's team last touched the record on 22 August. There is no path below you.",
        src: "Salesforce opp-00F31 activity, 08:12.",
      },
      "How confident are you?": {
        body: "High on the stall and the median. The 12% term is a separate decision sitting with you, not with sales.",
        src: "Salesforce opp-00F31 · closed-deal history.",
      },
    },
    prepareQuestions: [
      "Will Marcus take a call from you this week?",
      "Does the 12% three-year term get a signature this week?",
      "What dies if this is still in contracting on Friday?",
    ],
  },
  {
    id: "abrdn",
    name: "abrdn",
    full: "abrdn",
    short: "abrdn",
    recordId: "acc-abrdn",
    state: CRIM,
    kind: "At risk",
    note: "3 weeks late",
    rev: 2.4,
    hq: "Edinburgh",
    overnight: "Sold 15 Sep go-live now 6 Oct in Jira — £2.4m at risk",
    head: "abrdn's sold 15 September go-live is three weeks late in Jira.",
    chain: [
      {
        k: "What changed",
        t: "Jira CAL-2409 moved cutover to 6 October",
        m: "Three weeks late · read 08:12",
        dot: CRIM,
      },
      {
        k: "Account",
        t: "abrdn",
        m: "£2.4m at risk · automated onboarding",
        dot: CRIM,
      },
      {
        k: "Join",
        t: "Salesforce promised 15 September",
        m: "opp-00A19 · Jira CAL-2409 says 6 October",
        dot: CRIM,
      },
      {
        k: "What Ross decides",
        t: "Tell abrdn, or pull Transfers off Jupiter",
        m: "Stephen Leggett will not pull the squad without you",
        dot: CRIM,
      },
    ],
    action: {
      title: "Move the abrdn date or the Jupiter squad",
      when: "Due Wednesday · worsens if it sits",
      cta: "Prepare the decision",
    },
    conf: 3,
    confLabel: "High confidence",
    services: ["Automated onboarding", "Transfers"],
    stats: [
      ["At risk", "£2.4m"],
      ["Sold date", "15 Sep"],
      ["Jira date", "6 Oct"],
      ["Committed hit since Friday", "−£800k"],
    ],
    talk: [
      "Tell abrdn the 15 September date moves, or pull Transfers off Jupiter for two sprints.",
      "Stephen Leggett will not pull the squad without you.",
      "This one item is the £800k of committed that went backwards since Friday.",
    ],
    people: [
      ["Stephen Leggett", "COO · will not pull Transfers without Ross"],
      ["Claire Dunn", "abrdn ops · expecting 15 Sep"],
      ["Jupiter Transfers squad", "Booked until 20 Sep"],
    ],
    evidence: ["Salesforce, opp-00A19, 08:12", "Jira, CAL-2409, 08:12"],
    funds: [
      {
        name: "abrdn SICAV I",
        dom: "Luxembourg",
        aum: "£2.8bn",
        to: ["Edinburgh", "London", "Luxembourg"],
      },
    ],
    answers: {
      default: {
        body: "Salesforce sold 15 September. Jira CAL-2409 now says 6 October. £2.4m automated onboarding is at risk. Transfers is on Jupiter until 20 September. This is the £800k committed slip since Friday.",
        src: "Salesforce opp-00A19, 08:12 · Jira CAL-2409, 08:12.",
      },
      "Why does this matter today?": {
        body: "The date gets worse if you leave it until Friday. Wednesday is when you tell abrdn or you pull the Jupiter squad.",
        src: "Salesforce opp-00A19 · Jira CAL-2409, 08:12.",
      },
      "Who else should I talk to?": {
        body: "Stephen Leggett, then Claire Dunn at abrdn. The Transfers squad cannot move without both of you.",
        src: "Jira CAL-2409 assignment · Salesforce opp-00A19.",
      },
      "How confident are you?": {
        body: "High. Both dates are in the systems. The only open question is which client you disappoint.",
        src: "Salesforce opp-00A19 · Jira CAL-2409.",
      },
    },
    prepareQuestions: [
      "Do we tell abrdn before Wednesday?",
      "Does Transfers come off Jupiter for two sprints?",
      "What does Jupiter's transfer cutover become if we pull the squad?",
    ],
  },
  {
    id: "hl",
    name: "Hargreaves Lansdown",
    full: "Hargreaves Lansdown",
    short: "HL",
    state: TEAL,
    kind: "Forecast down",
    note: "−£400k",
    rev: 1.1,
    hq: "London",
    overnight: "DMI forecast fell £400k since Friday — now £1.1m",
    head: "Hargreaves Lansdown DMI dropped £400k since Friday. Priya Nair owns it.",
    chain: [
      {
        k: "What changed",
        t: "Weighted forecast £1.5m on Friday, £1.1m now",
        m: "Salesforce opp-00H04 · 08:12",
        dot: TEAL,
      },
      {
        k: "Account",
        t: "Hargreaves Lansdown",
        m: "£1.1m DMI · annual · down £400k this week",
        dot: TEAL,
      },
      {
        k: "Join",
        t: "Stage moved commit to propose on Monday",
        m: "Friday snapshot vs Tuesday read of the same opp",
        dot: AMBER,
      },
      {
        k: "What Ross decides",
        t: "Nothing this morning — Priya Nair owns it",
        m: "Same motion last October recovered in 11 days. This is day 2.",
        dot: SLATE,
      },
    ],
    action: {
      title: "Ask Priya Nair for the Monday note",
      when: "Due Friday · not yours to work",
      cta: "See the movement",
    },
    conf: 3,
    confLabel: "High confidence",
    services: ["Distributed market infrastructure"],
    stats: [
      ["Forecast now", "£1.1m"],
      ["Since Friday", "−£400k"],
      ["Stage", "Propose, was commit"],
      ["Owner", "Priya Nair"],
    ],
    talk: [
      "Ask Priya Nair what changed on Monday.",
      "You do not need to take this off her. It still sits on the board because of the money.",
      "Last October the same DMI motion recovered in 11 days.",
    ],
    people: [
      ["Priya Nair", "Owner · your org"],
      ["HL platform", "Stage dropped Monday"],
    ],
    evidence: [
      "Salesforce, opp-00H04 Friday snapshot, 08:12",
      "Salesforce, opp-00H04 Tuesday, 08:12",
    ],
    funds: [
      {
        name: "HL Multi-Manager",
        dom: "London",
        aum: "£1.8bn",
        to: ["London"],
      },
    ],
    answers: {
      default: {
        body: "Weighted DMI was £1.5m on Friday. Salesforce now has £1.1m. Stage dropped from commit to propose on Monday. Priya Nair owns it, not you. The £400k move clears the weekly bar.",
        src: "Salesforce opp-00H04 Friday snapshot and Tuesday read, 08:12.",
      },
    },
    prepareQuestions: [
      "What did HL say on Monday?",
      "Does Priya still expect it back inside two weeks?",
      "Does anything here need you before Friday?",
    ],
  },
  {
    id: "schroders",
    name: "Schroders",
    full: "Schroders",
    short: "Schroders",
    recordId: "acc-schroders",
    state: AMBER,
    kind: "Not moving",
    note: "£900k invoices",
    rev: 0.9,
    hq: "London",
    overnight: "Closed-won £1.8m still billed at the old £0.9m run-rate",
    head: "Schroders still invoices last year's routing. £900k is not recognised this quarter.",
    chain: [
      {
        k: "What changed",
        t: "INV-4418 still in draft, dated 8 September",
        m: "NetSuite · 08:12",
        dot: AMBER,
      },
      {
        k: "Account",
        t: "Schroders",
        m: "£1.8m closed-won · £0.9m still unrecognised this quarter",
        dot: AMBER,
      },
      {
        k: "Join",
        t: "Salesforce closed-won vs NetSuite old run-rate",
        m: "opp-00S11 · INV-4418",
        dot: AMBER,
      },
      {
        k: "What Ross decides",
        t: "Get the expanded invoice out of draft",
        m: "Finance says waiting-on-ops. Ops says waiting-on-finance.",
        dot: AMBER,
      },
    ],
    action: {
      title: "Get INV-4418 out of draft",
      when: "This week · £900k this quarter",
      cta: "Chase the invoice",
    },
    conf: 3,
    confLabel: "High confidence",
    services: ["Order routing"],
    stats: [
      ["Not recognised this quarter", "£900k"],
      ["Closed-won", "£1.8m"],
      ["Go-live", "1 August"],
      ["Invoice", "Draft 8 Sep"],
    ],
    talk: [
      "The expansion went live 1 August. NetSuite is still on the old run-rate.",
      "Pick finance or ops and close INV-4418. They are pointing at each other.",
      "£900k this quarter does not move until that invoice leaves draft.",
    ],
    people: [
      ["Tom Bell", "Finance · waiting-on-ops"],
      ["Priya Shah", "Ops · waiting-on-finance"],
    ],
    evidence: [
      "Salesforce, opp-00S11 closed-won, 08:12",
      "NetSuite, INV-4418, 08:12",
    ],
    funds: [
      {
        name: "Global Cities Real Estate",
        dom: "Luxembourg",
        aum: "£1.9bn",
        to: ["Frankfurt", "Vienna", "Zurich"],
      },
    ],
    answers: {
      default: {
        body: "Closed-won order-routing expansion is £1.8m in Salesforce. NetSuite INV-4418 still bills the old £0.9m run-rate this quarter. Go-live was 1 August. The expanded invoice is still in draft.",
        src: "Salesforce opp-00S11, 08:12 · NetSuite INV-4418, 08:12.",
      },
    },
    prepareQuestions: [
      "Who signs INV-4418 out of draft this week?",
      "Is ops or finance actually blocked?",
      "Does Q3 recognition slip if this waits until Monday?",
    ],
  },
  {
    id: "allfunds",
    name: "Allfunds",
    full: "Allfunds",
    short: "Allfunds",
    recordId: "acc-allfunds",
    state: TEAL,
    kind: "Forecast down",
    note: "Buyer left",
    rev: 0.72,
    hq: "Madrid",
    overnight: "Elena Vázquez left Sunday — £720k open opportunity still names her",
    head: "Allfunds platform head Elena Vázquez left on Sunday. The £720k opp still names her.",
    chain: [
      {
        k: "What changed",
        t: "Elena Vázquez left on Sunday",
        m: "Funds Europe · 7 Sep 07:40",
        dot: TEAL,
      },
      {
        k: "Account",
        t: "Allfunds",
        m: "NetSuite 12-month £1.4m · open opp £720k annual",
        dot: TEAL,
      },
      {
        k: "Join",
        t: "Departure matched to opp-00A72",
        m: "She is the named economic buyer. No replacement on the record.",
        dot: AMBER,
      },
      {
        k: "What Ross decides",
        t: "Name the new buyer this week",
        m: "Last commercial contact: 11 months",
        dot: AMBER,
      },
    ],
    action: {
      title: "Name the new Allfunds buyer",
      when: "This week · £720k annual still open",
      cta: "Name the buyer",
    },
    conf: 2,
    confLabel: "Moderate confidence",
    services: ["Order routing", "Data services"],
    stats: [
      ["Open opp", "£720k annual"],
      ["Revenue 12m", "£1.4m"],
      ["Left", "Sunday"],
      ["Last commercial contact", "11 months"],
    ],
    talk: [
      "Elena Vázquez left Sunday. The open opportunity still names her.",
      "Funds Europe posted it at 07:40 Monday. NetSuite 12-month on the account is £1.4m.",
      "Name her replacement before the opp is working a ghost.",
    ],
    people: [
      ["Elena Vázquez", "Head of platform · left Sunday"],
      ["—", "Replacement · not on the record"],
    ],
    evidence: [
      "Funds Europe, 7 Sep 07:40",
      "Salesforce, opp-00A72, 08:12",
      "NetSuite, Allfunds 12m, 08:12",
    ],
    funds: [
      {
        name: "Allfunds platform",
        dom: "Luxembourg",
        aum: "€1.5tn AuA",
        to: ["Madrid", "Luxembourg", "Milan"],
      },
    ],
    answers: {
      default: {
        body: "Elena Vázquez, head of platform, left on Sunday. Salesforce opp-00A72 is still open at £720k annual and names her as buyer. NetSuite 12-month revenue is £1.4m. No replacement is on the record.",
        src: "Funds Europe 7 Sep 07:40 · Salesforce opp-00A72, 08:12 · NetSuite Allfunds 12m, 08:12.",
      },
    },
    prepareQuestions: [
      "Who replaces Elena Vázquez this week?",
      "Does opp-00A72 stay open without a named buyer?",
      "Who last spoke to Allfunds, and when?",
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    full: "Jupiter Asset Management",
    short: "Jupiter",
    recordId: "acc-jupiter",
    state: SLATE,
    kind: "Watch",
    note: "Squad conflict",
    rev: 0.4,
    hq: "London",
    overnight: "Transfers squad holds abrdn if you pull them — Jupiter cutover then slips",
    head: "Jupiter is only on this board because abrdn's slip lands on their Transfers squad.",
    chain: [
      {
        k: "What changed",
        t: "Nothing at Jupiter overnight",
        m: "The conflict is the abrdn date",
        dot: SLATE,
      },
      {
        k: "Account",
        t: "Jupiter Asset Management",
        m: "Data services £400k closed since Friday, invoice waiting on NetSuite",
        dot: TEAL,
      },
      {
        k: "Join",
        t: "Squad booked until 20 September",
        m: "Jira load vs abrdn Salesforce go-live",
        dot: AMBER,
      },
      {
        k: "What Ross decides",
        t: "Do not treat Jupiter as the problem",
        m: "If you pull Transfers, this is the client who pays",
        dot: SLATE,
      },
    ],
    action: {
      title: "Jupiter is the cost of saving abrdn",
      when: "Tied to the Wednesday abrdn decision",
      cta: "See the conflict",
    },
    conf: 2,
    confLabel: "Moderate confidence",
    services: ["Transfers", "Data services"],
    stats: [
      ["Closed since Friday", "+£400k"],
      ["Invoice", "Waiting on NetSuite"],
      ["Squad booked to", "20 Sep"],
      ["If pulled", "Cutover slips"],
    ],
    talk: [
      "Jupiter is not the problem. abrdn is.",
      "If you pull Transfers, Jupiter's cutover is what you are spending.",
      "The £400k data-services close is waiting on a NetSuite invoice. That is not this week's decision.",
    ],
    people: [
      ["Transfers squad", "Booked to Jupiter until 20 Sep"],
      ["Stephen Leggett", "Will not pull them without you"],
    ],
    evidence: ["Jira, CAL-2409, 08:12", "NetSuite, Jupiter invoice, 08:12"],
    funds: [
      {
        name: "Jupiter Global Fund",
        dom: "Luxembourg",
        aum: "£0.9bn",
        to: ["London", "Luxembourg"],
      },
    ],
    answers: {
      default: {
        body: "Jupiter is on the board because the abrdn go-live and their Transfers squad are the same people. Data services closed £400k since Friday; the invoice is waiting on NetSuite. Nothing at Jupiter itself crossed a threshold.",
        src: "Jira CAL-2409, 08:12 · NetSuite Jupiter invoice, 08:12.",
      },
    },
    prepareQuestions: [
      "If Transfers move to abrdn, what date does Jupiter get?",
      "Is the £400k invoice actually stuck, or just unsent?",
      "Does Jupiter know they are in this trade-off?",
    ],
  },
];

export const DAILY_BRIEFING = {
  dateLabel: "Tuesday, 8 September",
  lead: "£8.2m short of the FY number, £800k worse since Friday — start with Fidelity then abrdn.",
  stamp: "5 of 17 · Salesforce, Jira, NetSuite · read 08:12",
};

export const BOOK_COPY = {
  title: "Ross Fox · FY number, UK & Europe",
  stamp: "Checked 08:12 · 17 records considered",
  gapLabel: "Short of FY",
  gapEm: "£800k worse since Friday · target £48.0m",
  attentionLabel: "Needs you",
  attentionEm: "5 of 17 cleared the bar",
  riskLabel: "At risk this week",
  riskEm: "abrdn onboarding · Salesforce vs Jira",
  overnightLabel: "Since Friday",
  overnightEm: "New joins that cleared a threshold",
  productsKicker: "Calastone products",
  footerStamp: "Salesforce, Jira, NetSuite read 8 Sep 2026 08:12",
};

export const CHART_NOTES = {
  risk: "abrdn is the £800k committed slip this month. HL is the £400k DMI drop. Neither is a renewal calendar.",
  coverage: "Marcus Hale at Fidelity is uncovered below you. abrdn's Claire Dunn is live. Allfunds has no named replacement.",
  changed:
    "Fidelity flat. abrdn −£800k. HL −£400k. Schroders £900k still unrecognised. Allfunds £720k now has no buyer.",
};

/** Headline arithmetic is authored here, not summed from account cards. */
export function bookHealthSummary(accounts: TodayAccount[] = ACCOUNTS) {
  const forecast = accounts.filter((a) => a.kind === "Forecast down");
  const atRisk = accounts.filter((a) => a.kind === "At risk");
  const notMoving = accounts.filter((a) => a.kind === "Not moving");
  const watch = accounts.filter((a) => a.kind === "Watch");
  const attention = accounts.filter((a) => a.kind !== "Watch");
  const overnight = accounts
    .filter((a) => a.overnight.trim().length > 0)
    .map((a) => ({
      id: a.id,
      full: a.full,
      short: a.short,
      kind: a.kind,
      state: a.state,
      overnight: a.overnight,
      note: a.note,
    }));

  return {
    accountCount: 5,
    bookRev: 8.2,
    opportunities: forecast.length,
    atRisk: atRisk.length,
    gaps: notMoving.length,
    steady: watch.length,
    attentionCount: attention.length,
    atRiskRev: 2.4,
    overnight,
  };
}

export const STATE_LEGEND = [
  { c: TEAL, t: "Forecast down" },
  { c: AMBER, t: "Not moving" },
  { c: CRIM, t: "At risk" },
  { c: SLATE, t: "Watch" },
] as const;

export const ASK_SUGGESTIONS = [
  "Why does this matter today?",
  "Who else should I talk to?",
  "How confident are you?",
] as const;

export const COVERAGE_ROLES = ["CEO", "COO", "CIO", "Ops", "Proc"] as const;

export const COVERAGE_ROWS: { name: string; accountId: string; cells: CoverageCell[] }[] = [
  { name: "Fidelity", accountId: "fidelity", cells: ["n", "g", "t", "a", "n"] },
  { name: "abrdn", accountId: "abrdn", cells: ["t", "a", "t", "a", "t"] },
  { name: "HL", accountId: "hl", cells: ["n", "t", "n", "a", "t"] },
  { name: "Schroders", accountId: "schroders", cells: ["n", "t", "t", "a", "t"] },
  { name: "Allfunds", accountId: "allfunds", cells: ["n", "n", "g", "t", "n"] },
  { name: "Jupiter", accountId: "jupiter", cells: ["t", "t", "a", "a", "t"] },
];

export const COVERAGE_CELL_STYLE: Record<
  CoverageCell,
  { bg: string; bd: string; label: string }
> = {
  a: {
    bg: "rgba(47,155,142,0.85)",
    bd: "1px solid rgba(47,155,142,0.2)",
    label: "Active",
  },
  t: {
    bg: "rgba(140,163,188,0.35)",
    bd: "1px solid rgba(140,163,188,0.2)",
    label: "Thin",
  },
  n: {
    bg: "rgba(10,37,64,0.05)",
    bd: "1px solid rgba(10,37,64,0.05)",
    label: "None",
  },
  g: {
    bg: "rgba(217,154,62,0.16)",
    bd: `1px dashed ${AMBER}`,
    label: "Decision-maker uncovered",
  },
  r: {
    bg: "rgba(196,103,95,0.14)",
    bd: `1px dashed ${CRIM}`,
    label: "At risk",
  },
};

/** 12 months Sep → Aug. Hot bar is this month's committed slip. */
export const RENEWAL_BARS: { h: number; label: string | null; hot: boolean; warm: boolean }[] = [
  { h: 18, label: null, hot: false, warm: false },
  { h: 88, label: "£0.8m", hot: true, warm: false },
  { h: 14, label: null, hot: false, warm: false },
  { h: 22, label: null, hot: false, warm: false },
  { h: 40, label: "£0.4m", hot: false, warm: true },
  { h: 16, label: null, hot: false, warm: false },
  { h: 20, label: null, hot: false, warm: false },
  { h: 28, label: null, hot: false, warm: false },
  { h: 12, label: null, hot: false, warm: false },
  { h: 24, label: null, hot: false, warm: false },
  { h: 18, label: null, hot: false, warm: false },
  { h: 30, label: null, hot: false, warm: false },
];

export const RENEWAL_MONTHS = ["S", "S", "O", "N", "D", "J", "F", "M", "A", "M", "J", "J"];

export const ENGAGEMENT_TRENDS: {
  accountId: string;
  name: string;
  pts: string;
  c: AccountStateColor;
  tc: string;
  delta: string;
}[] = [
  {
    accountId: "fidelity",
    name: "Fidelity",
    pts: "0,10 20,10 40,10 60,10 80,10 100,10",
    c: AMBER,
    tc: "#8A5E12",
    delta: "flat",
  },
  {
    accountId: "abrdn",
    name: "abrdn",
    pts: "0,8 20,9 40,10 60,14 80,20 100,24",
    c: CRIM,
    tc: "#96453E",
    delta: "−£800k",
  },
  {
    accountId: "hl",
    name: "HL",
    pts: "0,8 20,9 40,10 60,12 80,16 100,20",
    c: TEAL,
    tc: "#1F6D63",
    delta: "−£400k",
  },
  {
    accountId: "schroders",
    name: "Schroders",
    pts: "0,12 20,12 40,12 60,12 80,12 100,12",
    c: AMBER,
    tc: "#8A5E12",
    delta: "−£900k",
  },
  {
    accountId: "allfunds",
    name: "Allfunds",
    pts: "0,8 20,10 40,11 60,14 80,18 100,22",
    c: TEAL,
    tc: "#1F6D63",
    delta: "buyer gone",
  },
];

export const TEXT_FOR_STATE: Record<string, string> = {
  [TEAL]: "#1F6D63",
  [AMBER]: "#8A5E12",
  [CRIM]: "#96453E",
  [SLATE]: "#5A7391",
};

export function accountById(id: string): TodayAccount | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}

export function haloFor(color: string): string {
  if (color === TEAL) return "rgba(47,155,142,0.16)";
  if (color === AMBER) return "rgba(217,154,62,0.18)";
  if (color === CRIM) return "rgba(196,103,95,0.18)";
  return "rgba(140,163,188,0.2)";
}
