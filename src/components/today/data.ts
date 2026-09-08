/** Illustrative Today briefing — Broadridge Growth Intelligence redesign. */

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
    state: TEAL,
    kind: "New opportunity",
    note: "Meeting 09:45",
    rev: 8.4,
    hq: "London",
    overnight: "Distribution filing at 08:12 — new markets indicated",
    head: "A filing this morning changed what your 09:45 with Fidelity is about.",
    chain: [
      {
        k: "What changed",
        t: "European distribution expansion indicated",
        m: "Issuer filing · 08:12 today",
        dot: TEAL,
      },
      {
        k: "Account",
        t: "Fidelity International",
        m: "£8.4m book · FCS, Cross-border, Registration live",
        dot: TEAL,
      },
      {
        k: "Relationship",
        t: "No executive sponsor since May",
        m: "COO seat uncovered · two warm Ops contacts",
        dot: AMBER,
      },
      {
        k: "What's at stake",
        t: "More markets means more FCS and registration load",
        m: "Hypothesis to test — not a stated need",
        dot: TEAL,
      },
    ],
    action: {
      title: "Fidelity International · quarterly review",
      when: "Today, 09:45–10:30 · with Ravi Patel",
      cta: "Prepare me for this",
    },
    conf: 2,
    confLabel: "Moderate confidence",
    services: [
      "Fund Communication Solutions",
      "Cross-border fund distribution",
      "Registration and legal representation",
    ],
    stats: [
      ["Revenue with us", "£8.4m"],
      ["Services live", "3 of 7"],
      ["Last meeting", "11 days ago"],
      ["Renewal", "March 2027"],
    ],
    talk: [
      "Ask which markets the filing covers and when registrations go in.",
      "Offer to map what Fund Communication Solutions and Registration add for each new market before they plan around it.",
      "Ask Ravi Patel to bring Elena Marsh (COO) into the next session.",
    ],
    people: [
      ["Ravi Patel", "Head of Operations · your sponsor"],
      ["Elena Marsh", "COO · never met you"],
      ["Tom Bell", "Fund reporting · day to day"],
    ],
    evidence: [
      "Issuer filing · 7 Sep",
      "FCS contract",
      "Meeting history",
      "Contact records",
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
        body: "Fidelity is your strongest relationship by revenue and the only one with a live signal today. They already run Fund Communication Solutions, Cross-border fund distribution and Registration. The gap is seniority: your two advocates both sit in operations.",
        src: "Issuer filing, FCS relationship record, last six meetings and CRM contact history.",
      },
      "Why does this matter today?": {
        body: "The filing lands three weeks before their launch window, and the meeting is already on the calendar. You get one natural chance to frame the FCS and registration operating cost before they plan around it.",
        src: "Issuer filing 7 Sep · meeting agenda · fund registrations, 12 months.",
      },
      "Who else should I talk to?": {
        body: "Elena Marsh, their COO, is the uncovered seat. Ravi Patel in operations already sponsors your Fund Communication Solutions work and is the warmest route to her.",
        src: "Contact history · org coverage · two shared meetings with Ravi.",
      },
      "How confident are you?": {
        body: "Moderate. The filing is fact. The claim that Cross-border and Registration load will rise is our inference — no one at Fidelity has asked for anything yet.",
        src: "One primary source, one inference. Flagged as unconfirmed.",
      },
    },
    prepareQuestions: [
      "Which markets are in the filing, and when do registrations need to land?",
      "Where would Fund Communication Solutions or Registration create delays in the operating model?",
      "Who owns the distribution operating model — and can Elena join the next session?",
    ],
  },
  {
    id: "nordea",
    name: "Nordea",
    full: "Nordea Asset Management",
    short: "Nordea",
    recordId: "acc-nordea",
    state: TEAL,
    kind: "New opportunity",
    note: "New partners",
    rev: 5.2,
    hq: "Stockholm",
    overnight: "Two distribution partners replaced in the Nordics",
    head: "Nordea quietly changed distribution partners in two markets.",
    chain: [
      {
        k: "What changed",
        t: "Two distribution partners replaced",
        m: "Registry update · Friday",
        dot: TEAL,
      },
      {
        k: "Account",
        t: "Nordea Asset Management",
        m: "£5.2m book · Document production + Translation live",
        dot: TEAL,
      },
      {
        k: "Relationship",
        t: "Broad and healthy coverage",
        m: "COO, CIO and Ops all active",
        dot: TEAL,
      },
      {
        k: "What's at stake",
        t: "New partners mean new fund document and language packs",
        m: "Worth one exploratory call on Document production",
        dot: TEAL,
      },
    ],
    action: {
      title: "Nordea · call Annika before month end",
      when: "Suggested this week · 20 minutes",
      cta: "Draft the call",
    },
    conf: 2,
    confLabel: "Moderate confidence",
    services: [
      "Fund document production and distribution",
      "Translation and language services",
      "Fund Communication Solutions",
      "Fund data management and distribution",
    ],
    stats: [
      ["Revenue with us", "£5.2m"],
      ["Services live", "4 of 7"],
      ["Last meeting", "6 days ago"],
      ["Renewal", "July 2027"],
    ],
    talk: [
      "Ask who now distributes in Stockholm and Copenhagen.",
      "Check whether Document production and Translation need re-papering for the new partners.",
      "Keep it exploratory — nothing is at risk here.",
    ],
    people: [
      ["Annika Berg", "Head of Distribution · your sponsor"],
      ["Lars Holm", "COO · met twice"],
      ["Mia Kallio", "Operations · day to day"],
    ],
    evidence: ["Registry update · Friday", "Document production contract", "Engagement trend"],
    funds: [
      {
        name: "Nordic Equity SICAV",
        dom: "Luxembourg",
        aum: "£2.2bn",
        to: ["Stockholm", "Oslo", "Helsinki", "Copenhagen"],
      },
      {
        name: "Euro Credit Fund",
        dom: "Luxembourg",
        aum: "£0.8bn",
        to: ["Frankfurt", "Amsterdam"],
      },
    ],
    answers: {
      default: {
        body: "Nordea is healthy and growing quietly. Document production and Translation already cover the Nordic footprint. Nothing is at risk — this is the one account where a new conversation on partner re-papering is genuinely warranted.",
        src: "Registry update, engagement trend and coverage map.",
      },
    },
    prepareQuestions: [
      "Who replaced the distribution partners in Stockholm and Copenhagen?",
      "Do the new partners change Document production or Translation scope?",
      "Is there a natural moment to review Fund Communication Solutions alongside?",
    ],
  },
  {
    id: "mg",
    name: "M&G",
    full: "M&G Investments",
    short: "M&G",
    state: CRIM,
    kind: "Revenue at risk",
    note: "Renews 29 Sep",
    rev: 7.1,
    hq: "London",
    overnight: "Third delivery ticket still open — renews 29 Sep",
    head: "M&G renews in 22 days with three delivery tickets still open.",
    chain: [
      {
        k: "What changed",
        t: "Third Fund Communication Solutions ticket opened Friday",
        m: "Reporting latency · unresolved",
        dot: CRIM,
      },
      {
        k: "Account",
        t: "M&G Investments",
        m: "£7.1m book · FCS renews 29 September",
        dot: CRIM,
      },
      {
        k: "Relationship",
        t: "Engagement down 52% in six months",
        m: "Procurement contact unknown",
        dot: CRIM,
      },
      {
        k: "What's at stake",
        t: "Largest FCS renewal exposure in your book",
        m: "Recovery review, not a renewal chase",
        dot: CRIM,
      },
    ],
    action: {
      title: "M&G · recovery review with delivery",
      when: "Book before Thursday · 45 minutes",
      cta: "Set up the review",
    },
    conf: 3,
    confLabel: "High confidence",
    services: ["Fund Communication Solutions", "Regulatory reporting", "Fund data management"],
    stats: [
      ["Revenue at risk", "£7.1m"],
      ["Open tickets", "3"],
      ["Renews in", "22 days"],
      ["Last meeting", "48 days ago"],
    ],
    talk: [
      "Lead with the three open Fund Communication Solutions tickets and a date each will be closed by.",
      "Bring delivery into the room — do not present this alone.",
      "Find out who signs the FCS renewal; procurement contact is unknown.",
    ],
    people: [
      ["Sara Whitfield", "Head of Fund Ops · frustrated"],
      ["Unknown", "Procurement · no contact"],
      ["Dan Foley", "COO · met once in 2025"],
    ],
    evidence: ["Delivery tickets", "FCS contract · renews 29 Sep", "Meeting history"],
    funds: [
      {
        name: "Optimal Income SICAV",
        dom: "Luxembourg",
        aum: "£4.6bn",
        to: ["Milan", "Madrid", "Paris"],
      },
      {
        name: "UK Income Trust",
        dom: "London",
        aum: "£1.1bn",
        to: ["London"],
      },
    ],
    answers: {
      default: {
        body: "This is the one to lose sleep over. Declining engagement, three open Fund Communication Solutions tickets and a renewal date inside a month all point the same way.",
        src: "Delivery tickets, meeting history and FCS contract dates.",
      },
    },
    prepareQuestions: [
      "What is the close date for each of the three open FCS tickets?",
      "Who signs the Fund Communication Solutions renewal?",
      "What service-quality proof does Sara Whitfield need before 29 September?",
    ],
  },
  {
    id: "schroders",
    name: "Schroders",
    full: "Schroders",
    short: "Schroders",
    recordId: "acc-schroders",
    state: AMBER,
    kind: "Relationship gap",
    note: "Deal blocked",
    rev: 4.6,
    hq: "London",
    overnight: "Deal unchanged for three weeks — no senior sponsor",
    head: "The Schroders deal has not moved because nobody senior has seen it.",
    chain: [
      {
        k: "What changed",
        t: "Third week without buyer contact",
        m: "Cross-border expansion deal unchanged since 18 Aug",
        dot: AMBER,
      },
      {
        k: "Account",
        t: "Schroders",
        m: "£4.6m book · FCS live · one open Cross-border deal",
        dot: AMBER,
      },
      {
        k: "Relationship",
        t: "Only operations-level access",
        m: "No CEO, COO or procurement contact",
        dot: AMBER,
      },
      {
        k: "What's at stake",
        t: "A live Cross-border deal quietly going stale",
        m: "Access problem, not a pricing problem",
        dot: AMBER,
      },
    ],
    action: {
      title: "Schroders · request an executive introduction",
      when: "Suggested today · one email",
      cta: "Draft the introduction",
    },
    conf: 2,
    confLabel: "Moderate confidence",
    services: [
      "Fund Communication Solutions",
      "Fund document production and distribution",
    ],
    stats: [
      ["Revenue with us", "£4.6m"],
      ["Open deal", "£0.7m Cross-border"],
      ["Deal age", "21 days no movement"],
      ["Last meeting", "19 days ago"],
    ],
    talk: [
      "Ask your operations contact for a warm introduction upwards.",
      "Do not re-pitch Fund Communication Solutions or Cross-border; the price was never the problem.",
      "Agree a decision date with whoever owns the budget.",
    ],
    people: [
      ["Priya Shah", "Fund Operations · supportive"],
      ["Unknown", "Procurement · no contact"],
      ["Unknown", "COO · no contact"],
    ],
    evidence: ["Deal history", "FCS Luxembourg relationship", "Contact coverage"],
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
        body: "Nothing has gone wrong at Schroders. They already hold Fund Communication Solutions in Luxembourg. The Cross-border expansion deal simply has no senior sponsor, and every week without one lowers the odds.",
        src: "Deal history, FCS contract and contact coverage.",
      },
    },
    prepareQuestions: [
      "Who can Priya introduce for the Cross-border decision?",
      "What must be true before the economic owner will engage?",
      "What decision date keeps the Cross-border deal alive?",
    ],
  },
  {
    id: "janus",
    name: "Janus Henderson",
    full: "Janus Henderson Investors",
    short: "Janus Henderson",
    recordId: "acc-janushenderson",
    state: AMBER,
    kind: "Relationship gap",
    note: "Going quiet",
    rev: 3.4,
    hq: "London",
    overnight: "Quiet for seven weeks since the CIO change",
    head: "Janus Henderson has gone quiet since their CIO changed in June.",
    chain: [
      {
        k: "What changed",
        t: "Engagement down 41% since June",
        m: "No meetings booked in seven weeks",
        dot: AMBER,
      },
      {
        k: "Account",
        t: "Janus Henderson Investors",
        m: "£3.4m book · FCS + Document production live",
        dot: AMBER,
      },
      {
        k: "Relationship",
        t: "New CIO never met you",
        m: "Predecessor was your only sponsor",
        dot: AMBER,
      },
      {
        k: "What's at stake",
        t: "FCS relationship reverting to vendor status",
        m: "Reintroduction via SalesWatch context, not a pitch",
        dot: AMBER,
      },
    ],
    action: {
      title: "Janus Henderson · reintroduce yourself to the new CIO",
      when: "Suggested this week",
      cta: "Draft the note",
    },
    conf: 2,
    confLabel: "Moderate confidence",
    services: [
      "Fund Communication Solutions",
      "Fund document production and distribution",
    ],
    stats: [
      ["Revenue with us", "£3.4m"],
      ["Services live", "2 of 7"],
      ["Last meeting", "51 days ago"],
      ["Renewal", "Nov 2026"],
    ],
    talk: [
      "Reintroduce yourself to the new CIO — short, no pitch.",
      "Recap Fund Communication Solutions delivery today so nothing looks like a surprise at renewal.",
      "Offer a SalesWatch or Market intelligence brief only if they ask what peers are doing.",
    ],
    people: [
      ["New CIO", "Appointed June · never met you"],
      ["Ex-sponsor", "Left the firm in June"],
      ["Kate Lyons", "Operations · still responsive"],
    ],
    evidence: ["Meeting history", "Public leadership change", "FCS renewal window"],
    funds: [
      {
        name: "Horizon Euro Corporate",
        dom: "Luxembourg",
        aum: "£1.2bn",
        to: ["Paris", "Milan"],
      },
      {
        name: "Pan European Alpha",
        dom: "Dublin",
        aum: "£0.6bn",
        to: ["Amsterdam", "Copenhagen"],
      },
    ],
    answers: {
      default: {
        body: "The quiet started the month their CIO changed. Fund Communication Solutions is still live. That is usually a coverage problem rather than a satisfaction problem — reintroduce before you mention SalesWatch or FundFile.",
        src: "Meeting history, public leadership change and FCS contract.",
      },
    },
    prepareQuestions: [
      "Who replaced your old sponsor for day-to-day FCS decisions?",
      "What does the new CIO care about in the first 90 days?",
      "Is a short SalesWatch peer brief useful, or too early?",
    ],
  },
  {
    id: "waystone",
    name: "Waystone",
    full: "Waystone",
    short: "Waystone",
    recordId: "acc-waystone",
    state: SLATE,
    kind: "Steady",
    note: "Steady",
    rev: 2.8,
    hq: "Dublin",
    overnight: "Nothing changed since yesterday",
    head: "Waystone is steady, and nothing today needs you.",
    chain: [
      {
        k: "What changed",
        t: "A regulatory workflow fit worth watching",
        m: "PRIIPs / UCITS thread · not yet qualified",
        dot: SLATE,
      },
      {
        k: "Account",
        t: "Waystone",
        m: "£2.8m book · stable Document production",
        dot: SLATE,
      },
      {
        k: "Relationship",
        t: "CIO and Ops both active",
        m: "Coverage is fine",
        dot: TEAL,
      },
      {
        k: "What's at stake",
        t: "Nothing urgent",
        m: "Revisit Regulatory workflow after the quarter",
        dot: SLATE,
      },
    ],
    action: {
      title: "Waystone · no action needed today",
      when: "Next check-in 24 September",
      cta: "See the account",
    },
    conf: 1,
    confLabel: "Low confidence",
    services: [
      "Fund document production and distribution",
      "Fund Communication Solutions",
    ],
    stats: [
      ["Revenue with us", "£2.8m"],
      ["Services live", "2 of 7"],
      ["Last meeting", "9 days ago"],
      ["Renewal", "Sept 2027"],
    ],
    talk: [
      "Nothing needs saying today.",
      "Keep the September check-in as planned.",
      "Watch the Regulatory workflow thread; act only if PRIIPs / UCITS scope firms up.",
    ],
    people: [
      ["Ciara Nolan", "CIO · active"],
      ["Sean Doyle", "Operations · active"],
      ["—", "No gaps to close"],
    ],
    evidence: ["Delivery health", "Regulatory monitoring"],
    funds: [
      {
        name: "Managed Platform ICAV",
        dom: "Dublin",
        aum: "£0.9bn",
        to: ["London", "Luxembourg"],
      },
    ],
    answers: {
      default: {
        body: "Waystone is quietly fine. We are only watching one Regulatory workflow thread (PRIIPs, UCITS and related filings), and it is not qualified enough to act on.",
        src: "Delivery health and regulatory monitoring.",
      },
    },
    prepareQuestions: [
      "Has the regulatory workflow thread firmed into a scoped need?",
      "Is budget owned by the ManCo or the group?",
      "Should the September check-in stay as a health review only?",
    ],
  },
];

export const DAILY_BRIEFING = {
  dateLabel: "Monday, 7 September",
  lead: "Your book overnight — what needs attention before the day starts.",
  stamp: "Illustrative briefing · Broadridge products and revenue are example data",
};

/** Roll-up for the account-manager book health board on Today. */
export function bookHealthSummary(accounts: TodayAccount[] = ACCOUNTS) {
  const bookRev = Math.round(accounts.reduce((s, a) => s + a.rev, 0) * 10) / 10;
  const opportunities = accounts.filter((a) => a.kind === "New opportunity");
  const atRisk = accounts.filter((a) => a.kind === "Revenue at risk");
  const gaps = accounts.filter((a) => a.kind === "Relationship gap");
  const steady = accounts.filter((a) => a.kind === "Steady");
  const attention = accounts.filter((a) => a.kind !== "Steady");
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
    accountCount: accounts.length,
    bookRev,
    opportunities: opportunities.length,
    atRisk: atRisk.length,
    gaps: gaps.length,
    steady: steady.length,
    attentionCount: attention.length,
    atRiskRev: Math.round(atRisk.reduce((s, a) => s + a.rev, 0) * 10) / 10,
    overnight,
  };
}

export const STATE_LEGEND = [
  { c: TEAL, t: "New opportunity" },
  { c: AMBER, t: "Relationship gap" },
  { c: CRIM, t: "Revenue at risk" },
  { c: SLATE, t: "Steady" },
] as const;

export const ASK_SUGGESTIONS = [
  "Why does this matter today?",
  "Who else should I talk to?",
  "How confident are you?",
] as const;

export const COVERAGE_ROLES = ["CEO", "COO", "CIO", "Ops", "Proc"] as const;

export const COVERAGE_ROWS: { name: string; accountId: string; cells: CoverageCell[] }[] = [
  { name: "Fidelity", accountId: "fidelity", cells: ["t", "g", "a", "a", "t"] },
  { name: "M&G", accountId: "mg", cells: ["n", "t", "t", "a", "r"] },
  { name: "Schroders", accountId: "schroders", cells: ["n", "n", "t", "a", "r"] },
  { name: "Nordea", accountId: "nordea", cells: ["t", "a", "a", "a", "t"] },
  { name: "Janus H.", accountId: "janus", cells: ["n", "n", "g", "t", "n"] },
  { name: "Waystone", accountId: "waystone", cells: ["t", "t", "a", "a", "t"] },
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

/** 12-month renewal bars (Sep → Aug). Height % and optional label. */
export const RENEWAL_BARS: { h: number; label: string | null; hot: boolean; warm: boolean }[] = [
  { h: 22, label: null, hot: false, warm: false },
  { h: 88, label: "£2.1m", hot: true, warm: false },
  { h: 14, label: null, hot: false, warm: false },
  { h: 31, label: null, hot: false, warm: false },
  { h: 54, label: "£0.9m", hot: false, warm: true },
  { h: 19, label: null, hot: false, warm: false },
  { h: 26, label: null, hot: false, warm: false },
  { h: 44, label: "£0.6m", hot: false, warm: true },
  { h: 12, label: null, hot: false, warm: false },
  { h: 34, label: null, hot: false, warm: false },
  { h: 20, label: null, hot: false, warm: false },
  { h: 41, label: null, hot: false, warm: false },
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
    pts: "0,20 20,17 40,18 60,12 80,9 100,4",
    c: TEAL,
    tc: "#1F6D63",
    delta: "+34%",
  },
  {
    accountId: "nordea",
    name: "Nordea",
    pts: "0,18 20,15 40,16 60,11 80,13 100,8",
    c: TEAL,
    tc: "#1F6D63",
    delta: "+18%",
  },
  {
    accountId: "waystone",
    name: "Waystone",
    pts: "0,14 20,13 40,15 60,14 80,12 100,13",
    c: SLATE,
    tc: "#5A7391",
    delta: "flat",
  },
  {
    accountId: "janus",
    name: "Janus H.",
    pts: "0,8 20,10 40,13 60,17 80,20 100,23",
    c: AMBER,
    tc: "#8A5E12",
    delta: "−41%",
  },
  {
    accountId: "mg",
    name: "M&G",
    pts: "0,6 20,9 40,11 60,16 80,21 100,24",
    c: CRIM,
    tc: "#96453E",
    delta: "−52%",
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
