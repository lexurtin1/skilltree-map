/** Explicitly illustrative briefing scenario. Record IDs link to existing ontology. */
export type BookState = "growth" | "attention" | "risk" | "stable";
export type Focus =
  | "All priorities"
  | "Growth"
  | "Deals"
  | "Renewal risk"
  | "Relationship coverage";
export interface Source {
  id: string;
  kind:
    | "Market update"
    | "Meeting note"
    | "CRM / calendar"
    | "Delivery update"
    | "Product information";
  time: string;
  excerpt: string;
  supports: string;
}
export interface TodayAccount {
  id: string;
  name: string;
  recordId?: string;
  state: BookState;
  strategic: boolean;
  teamOnly?: boolean;
  condition: string;
  change: string;
  relevance: string;
  relationship: string;
  next: string;
  confidence: "Moderate" | "Low";
  sources: Source[];
  focus: Focus[];
  deal?: {
    name: string;
    steps: [string, string, string];
    reached: number;
    movement: string;
    blocker?: string;
    older?: boolean;
  };
}
const source = (
  id: string,
  kind: Source["kind"],
  time: string,
  excerpt: string,
  supports: string,
): Source => ({ id, kind, time, excerpt, supports });
export const ACCOUNTS: TodayAccount[] = [
  {
    id: "fidelity",
    recordId: "acc-fidelityintl",
    name: "Fidelity International",
    state: "growth",
    strategic: true,
    condition: "Meeting today · executive gap",
    change: "European distribution expansion indicated.",
    relevance:
      "Distribution reporting, registration and operational visibility may become more complex. Broadridge distribution intelligence and fund communications could be relevant; the need is unconfirmed.",
    relationship:
      "Sarah Coleman is a strong existing relationship. Marcus Lee has limited direct coverage.",
    next: "Test whether reporting, market coverage or operating complexity is slowing the expansion programme.",
    confidence: "Moderate",
    focus: ["Growth", "Deals", "Relationship coverage"],
    deal: {
      name: "European distribution",
      steps: ["Change detected", "Discovery today", "Qualify need"],
      reached: 1,
      movement: "Next step agreed · 09:45",
      blocker: "Client need still unconfirmed",
    },
    sources: [
      source(
        "fid-market",
        "Market update",
        "Today, 08:12",
        "Fidelity indicates further European distribution activity.",
        "Expansion signal; does not establish a buying requirement.",
      ),
      source(
        "fid-meeting",
        "Meeting note",
        "4 Sep, 15:20",
        "Sarah agreed to discuss the European expansion programme at Monday’s meeting.",
        "An agreed discovery conversation.",
      ),
      source(
        "fid-crm",
        "CRM / calendar",
        "Today, 08:00",
        "09:45–10:30: Sarah Coleman, Head of Distribution; Marcus Lee, COO, International. Sarah is the existing contact; no direct meeting with Marcus is recorded.",
        "Meeting participants and a possible executive coverage gap. Absence of a record is not proof of no relationship.",
      ),
      source(
        "fid-product",
        "Product information",
        "3 Sep, 12:00",
        "Broadridge capabilities include distribution intelligence, fund communications and regulatory support.",
        "Potential capability fit, not confirmed client demand.",
      ),
    ],
  },
  {
    id: "nordea",
    recordId: "acc-nordea",
    name: "Nordea Asset Management",
    state: "growth",
    strategic: true,
    condition: "Distribution change",
    change: "New distribution market under review.",
    relevance:
      "Registration support may be relevant if the new market is confirmed.",
    relationship: "Operations sponsor provides an existing route.",
    next: "Confirm market scope with the operations sponsor.",
    confidence: "Low",
    focus: ["Growth"],
    sources: [
      source(
        "nor-market",
        "Market update",
        "Today, 07:50",
        "A further European distribution market is being considered.",
        "An early signal requiring client validation.",
      ),
    ],
  },
  {
    id: "waystone",
    recordId: "acc-waystone",
    name: "Waystone",
    state: "growth",
    strategic: false,
    condition: "Regulatory fit · unqualified",
    change: "Regulatory workflow complexity raised in a working session.",
    relevance:
      "Regulatory workflow support may be relevant; budget and scope are unknown.",
    relationship: "An operational contact exists; buying owner is unconfirmed.",
    next: "Qualify the workflow problem before opening a CRM opportunity.",
    confidence: "Low",
    focus: ["Growth", "Deals"],
    deal: {
      name: "Regulatory workflow support",
      steps: ["Signal", "Qualify", "Discovery"],
      reached: 0,
      movement: "Emerging · not a CRM deal",
      blocker: "Scope and buying owner unknown",
    },
    sources: [
      source(
        "way-note",
        "Meeting note",
        "4 Sep, 10:10",
        "The operations team raised workflow complexity.",
        "A possible problem, not an approved project.",
      ),
    ],
  },
  {
    id: "schroders",
    recordId: "acc-schroders",
    name: "Schroders",
    state: "attention",
    strategic: true,
    condition: "Deal blocked · buyer access",
    change: "Meeting note records a reporting-data concern.",
    relevance:
      "Distribution intelligence could address reporting gaps; the economic owner has not validated the case.",
    relationship:
      "Operational sponsor engaged; executive economic owner not involved.",
    next: "Ask the sponsor for an introduction to the executive economic owner.",
    confidence: "Moderate",
    focus: ["Deals", "Relationship coverage"],
    deal: {
      name: "Distribution intelligence",
      steps: ["Discovery", "Validate case", "Buyer decision"],
      reached: 1,
      movement: "No progress · 18 days",
      blocker: "Executive economic owner not engaged",
    },
    sources: [
      source(
        "sch-note",
        "Meeting note",
        "Yesterday, 16:38",
        "The team described reporting-data concerns. No executive economic owner attended.",
        "A reporting concern and missing buyer participation.",
      ),
      source(
        "sch-crm",
        "CRM / calendar",
        "Today, 08:00",
        "The opportunity has not progressed for 18 days.",
        "Recorded inactivity; offline progress may be missing.",
      ),
    ],
  },
  {
    id: "janus",
    recordId: "acc-janushenderson",
    name: "Janus Henderson Investors",
    state: "attention",
    strategic: true,
    condition: "Relationship going quiet",
    change: "Senior stakeholder connection has gone quiet.",
    relevance:
      "Expansion should wait until the senior relationship and current priorities are re-established.",
    relationship:
      "Senior stakeholder has not responded; route needs reconfirming.",
    next: "Reconnect through the client services lead and confirm the senior owner.",
    confidence: "Moderate",
    focus: ["Deals", "Relationship coverage"],
    deal: {
      name: "Account expansion",
      steps: ["Existing client", "Reconnect", "Expansion"],
      reached: 0,
      movement: "Delayed · coverage weakening",
      blocker: "Senior stakeholder connection quiet",
      older: true,
    },
    sources: [
      source(
        "jan-crm",
        "CRM / calendar",
        "Friday, 11:20",
        "No recent senior stakeholder response is recorded.",
        "A coverage warning; the relationship may exist outside recorded systems.",
      ),
    ],
  },
  {
    id: "mg",
    name: "M&G",
    state: "risk",
    strategic: true,
    condition: "Renewal risk · 29 Sep",
    change: "Two unresolved service themes recorded.",
    relevance:
      "Renewal confidence depends on resolving service concerns and demonstrating delivered value.",
    relationship: "Service lead and renewal owner need a shared recovery plan.",
    next: "Arrange a value and service recovery review before 29 September.",
    confidence: "Moderate",
    focus: ["Renewal risk", "Deals"],
    deal: {
      name: "Renewal / value review",
      steps: ["Value review", "Resolve issues", "Renewal · 29 Sep"],
      reached: 0,
      movement: "At risk · action before 29 Sep",
      blocker: "Delivery confidence and value proof incomplete",
    },
    sources: [
      source(
        "mg-delivery",
        "Delivery update",
        "Friday, 14:05",
        "Two service themes remain unresolved ahead of the 29 September renewal review.",
        "Delivery concerns and a review deadline, not a confirmed lost renewal.",
      ),
    ],
  },
  {
    id: "blackrock",
    recordId: "acc-blackrock",
    name: "BlackRock",
    state: "stable",
    strategic: true,
    condition: "Stable · well covered",
    change: "No material change in the latest review.",
    relevance:
      "Maintain delivery quality and monitor adjacent needs through existing relationships.",
    relationship: "Executive and operational contacts recorded.",
    next: "Maintain the agreed account review cadence.",
    confidence: "Moderate",
    focus: [],
    sources: [
      source(
        "blk-note",
        "Meeting note",
        "4 Sep, 09:00",
        "Account review records stable delivery and active senior contacts.",
        "Stable condition within this illustrative review window.",
      ),
    ],
  },
  {
    id: "amundi",
    recordId: "acc-amundi",
    name: "Amundi",
    state: "stable",
    strategic: true,
    condition: "Healthy · monitored",
    change: "Operational review completed with no new concern.",
    relevance:
      "Existing delivery relationships offer a route to learn about adjacent needs.",
    relationship: "Client services and operational sponsor active.",
    next: "Monitor emerging requirements at the next review.",
    confidence: "Moderate",
    focus: [],
    sources: [
      source(
        "amu-note",
        "Meeting note",
        "3 Sep, 14:00",
        "The scheduled operational review recorded no new concerns.",
        "The review outcome, not a guarantee of future account health.",
      ),
    ],
  },
  {
    id: "invesco",
    name: "Invesco",
    state: "growth",
    strategic: false,
    teamOnly: true,
    condition: "Team account · discovery advanced",
    change: "Discovery completed and scope workshop agreed.",
    relevance: "A reporting scope workshop can test product fit.",
    relationship: "Team sponsor engaged; procurement route to confirm.",
    next: "Support the account owner’s scope workshop.",
    confidence: "Moderate",
    focus: ["Growth", "Deals"],
    deal: {
      name: "Reporting scope",
      steps: ["Discovery", "Scope agreed", "Validate case"],
      reached: 1,
      movement: "Advanced this week · workshop agreed",
    },
    sources: [
      source(
        "inv-note",
        "Meeting note",
        "Today, 08:05",
        "Discovery completed; scope workshop accepted by the sponsor.",
        "Recorded advancement and an agreed next step.",
      ),
    ],
  },
];
export interface ChangeItem {
  id: string;
  accountId: string;
  time: string;
  consequence: string;
  /** Optional override when the change text differs from the account's baseline `change`. */
  summary?: string;
  injected?: boolean;
}

export const CHANGES: ChangeItem[] = [
  {
    id: "chg-fidelity",
    accountId: "fidelity",
    time: "Today, 08:12",
    consequence: "Test the need in today’s meeting",
  },
  {
    id: "chg-schroders",
    accountId: "schroders",
    time: "Yesterday, 16:38",
    consequence: "Bring the economic owner into the deal",
  },
  {
    id: "chg-mg",
    accountId: "mg",
    time: "Friday, 14:05",
    consequence: "Resolve concerns before renewal review",
  },
  {
    id: "chg-janus",
    accountId: "janus",
    time: "Friday, 11:20",
    consequence: "Re-establish the senior relationship",
  },
];

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: string;
  accountId: string;
  relationshipStrength: "strong" | "moderate" | "weak" | "gap";
  covered: boolean;
  executive: boolean;
  lastInteraction: string;
  note: string;
}

export const PEOPLE: Person[] = [
  {
    id: "p-sarah",
    name: "Sarah Coleman",
    initials: "SC",
    role: "Head of Distribution",
    accountId: "fidelity",
    relationshipStrength: "strong",
    covered: true,
    executive: true,
    lastInteraction: "4 Sep, 15:20",
    note: "Strong existing relationship; agreed discovery meeting.",
  },
  {
    id: "p-marcus",
    name: "Marcus Lee",
    initials: "ML",
    role: "COO, International",
    accountId: "fidelity",
    relationshipStrength: "gap",
    covered: false,
    executive: true,
    lastInteraction: "No direct meeting recorded",
    note: "Limited direct coverage; route depends on Sarah.",
  },
  {
    id: "p-sch-sponsor",
    name: "Operational sponsor",
    initials: "OS",
    role: "Operational sponsor",
    accountId: "schroders",
    relationshipStrength: "moderate",
    covered: true,
    executive: false,
    lastInteraction: "Yesterday, 16:38",
    note: "Engaged; can introduce the economic owner.",
  },
  {
    id: "p-sch-owner",
    name: "Executive economic owner",
    initials: "EO",
    role: "Economic owner",
    accountId: "schroders",
    relationshipStrength: "gap",
    covered: false,
    executive: true,
    lastInteraction: "Not involved in recent meetings",
    note: "Not engaged; primary deal blocker.",
  },
  {
    id: "p-jan-senior",
    name: "Senior stakeholder",
    initials: "SS",
    role: "Senior stakeholder",
    accountId: "janus",
    relationshipStrength: "weak",
    covered: false,
    executive: true,
    lastInteraction: "No recent response recorded",
    note: "Connection has gone quiet; route needs reconfirming.",
  },
  {
    id: "p-jan-csl",
    name: "Client services lead",
    initials: "CS",
    role: "Client services lead",
    accountId: "janus",
    relationshipStrength: "moderate",
    covered: true,
    executive: false,
    lastInteraction: "Last account review",
    note: "Possible reconnect route to the senior owner.",
  },
  {
    id: "p-mg-service",
    name: "Service lead",
    initials: "SL",
    role: "Service lead",
    accountId: "mg",
    relationshipStrength: "moderate",
    covered: true,
    executive: false,
    lastInteraction: "Friday, 14:05",
    note: "Needs a shared recovery plan with the renewal owner.",
  },
  {
    id: "p-mg-renewal",
    name: "Renewal owner",
    initials: "RO",
    role: "Renewal owner",
    accountId: "mg",
    relationshipStrength: "moderate",
    covered: true,
    executive: true,
    lastInteraction: "Friday, 14:05",
    note: "Shared recovery plan required before 29 September.",
  },
  {
    id: "p-blk-exec",
    name: "Executive contact",
    initials: "EC",
    role: "Executive sponsor",
    accountId: "blackrock",
    relationshipStrength: "strong",
    covered: true,
    executive: true,
    lastInteraction: "4 Sep, 09:00",
    note: "Active senior contact recorded.",
  },
  {
    id: "p-amu-ops",
    name: "Operational sponsor",
    initials: "AO",
    role: "Operational sponsor",
    accountId: "amundi",
    relationshipStrength: "strong",
    covered: true,
    executive: false,
    lastInteraction: "3 Sep, 14:00",
    note: "Client services and operational sponsor active.",
  },
  {
    id: "p-nor-ops",
    name: "Operations sponsor",
    initials: "NO",
    role: "Operations sponsor",
    accountId: "nordea",
    relationshipStrength: "moderate",
    covered: true,
    executive: false,
    lastInteraction: "Recent distribution review",
    note: "Existing route to confirm market scope.",
  },
  {
    id: "p-way-ops",
    name: "Operational contact",
    initials: "WO",
    role: "Operations",
    accountId: "waystone",
    relationshipStrength: "weak",
    covered: true,
    executive: false,
    lastInteraction: "4 Sep, 10:10",
    note: "Buying owner unconfirmed.",
  },
];

export interface PriorityAction {
  accountId: string;
  title: string;
  meetingLabel: string;
  meetingTime: string;
  fact: { label: string; detail: string; sourceKind: string; sourceTime: string };
  assessment: { label: string; detail: string; caveat: string; confidence: "High" | "Moderate" | "Low"; confidenceReason: string };
  suggestedNextStep: string;
  whoToInvolve: { personId: string; introduction?: string }[];
  prepareQuestions: string[];
}

export const PRIORITY: PriorityAction = {
  accountId: "fidelity",
  title: "Prepare for Fidelity meeting",
  meetingLabel: "Meeting today",
  meetingTime: "Today, 09:45–10:30 BST",
  fact: {
    label: "Fact",
    detail: "European distribution expansion indicated.",
    sourceKind: "Market update",
    sourceTime: "08:12",
  },
  assessment: {
    label: "Assessment",
    detail:
      "More markets may mean more reporting and operating complexity.",
    caveat:
      "Distribution intelligence, registration or fund communications may help. A hypothesis to test, not a confirmed requirement.",
    confidence: "Moderate",
    confidenceReason:
      "A market signal and an agreed discovery meeting exist, but no source confirms a buying need.",
  },
  suggestedNextStep:
    "Find out whether reporting, market coverage or operating complexity is slowing the expansion programme.",
  whoToInvolve: [
    { personId: "p-sarah" },
    {
      personId: "p-marcus",
      introduction: "Ask Sarah to bring Marcus into the discussion",
    },
  ],
  prepareQuestions: [
    "Which markets are in scope, and what is changing in the operating model?",
    "Where is reporting or registration creating delays today?",
    "Marcus, who owns the operating priorities and how would success be measured?",
  ],
};

export const DAILY_BRIEFING = {
  lead: "Start with Fidelity.",
  body: "A new distribution signal gives today’s conversation a sharper purpose. M&G’s renewal needs a recovery review.",
  stamp: "Illustrative briefing · 08:30 BST",
};

/** Template used by the demo toolbar to inject a live feed update. */
export const DEMO_SIGNAL: ChangeItem & {
  accountPatch: Partial<TodayAccount>;
  source: Source;
} = {
  id: "chg-demo-amundi",
  accountId: "amundi",
  time: "Just now",
  summary: "Peer distribution programme referenced in an industry brief.",
  consequence: "Check whether Amundi’s next review should explore adjacent needs",
  injected: true,
  accountPatch: {
    state: "growth",
    condition: "New signal · peer activity",
    change: "Peer distribution programme referenced in an industry brief.",
    relevance:
      "A peer move may surface adjacent distribution needs; this is an early signal only.",
    next: "Raise the peer signal at the next operational review and ask whether scope is changing.",
    confidence: "Low",
    focus: ["Growth"],
  },
  source: source(
    "amu-demo-market",
    "Market update",
    "Just now",
    "An industry brief references peer European distribution programme activity relevant to Amundi’s operating footprint.",
    "An early external signal; does not establish Amundi buying intent.",
  ),
};

export const BOOK_STATES: Record<BookState, { label: string; mark: string }> = {
  growth: { label: "New opportunity", mark: "↗" },
  attention: { label: "Needs attention", mark: "△" },
  risk: { label: "Material risk", mark: "!" },
  stable: { label: "Stable", mark: "●" },
};

export function personById(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id);
}

export function accountById(id: string): TodayAccount | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}
