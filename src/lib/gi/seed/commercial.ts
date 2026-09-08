/**
 * Service relationships, commercial hypotheses, recommended actions and deals.
 *
 * A hypothesis is not an opportunity. Schroders is the case that proves it:
 * a verified cross-border trigger, a real existing relationship, high product
 * fit — and still no cross-border deal, because nothing has been validated with
 * the client. It carries a hypothesis and a renewal opportunity, and the two
 * are never merged.
 *
 * Illustrative prototype data.
 */
import type {
  HealthComponentId,
  Hypothesis,
  Opportunity,
  RecommendedAction,
  ServiceRelationship,
} from "../types";
import { PORTFOLIO_SPECS, type Situation } from "./portfolio";

/* ── Service relationships ────────────────────────────────────────────────── */

const rel = (
  id: string,
  accountId: string,
  serviceId: string,
  lifecycle: ServiceRelationship["lifecycle"],
  ownerId: string,
  health: ServiceRelationship["health"],
  arr: number,
  extra: Partial<ServiceRelationship> = {},
): ServiceRelationship => ({
  id,
  accountId,
  serviceId,
  lifecycle,
  ownerId,
  health,
  arr,
  ...extra,
});

export const HERO_SERVICE_RELATIONSHIPS: ServiceRelationship[] = [
  rel("srv-schroders-fcs", "acc-schroders", "svc-fcs", "renewal", "bp-sarah-patel", "stable", 1_350_000, {
    marketId: "lu",
    since: "2021-03-01",
    renewalInDays: 120,
    note: "Active in Luxembourg. Operating normally; renewal scope not yet agreed.",
  }),
  rel("srv-schroders-docs", "acc-schroders", "svc-docs", "live", "bp-sarah-patel", "stable", 410_000, {
    marketId: "lu",
    since: "2022-06-01",
    note: "Document production for the Luxembourg SICAV range.",
  }),
  rel("srv-nordea-docs", "acc-nordea", "svc-docs", "live", "bp-tom-eriksen", "stable", 380_000, {
    marketId: "lu",
    since: "2023-02-01",
    note: "Document production across the Nordic distribution footprint.",
  }),
  rel("srv-nordea-translation", "acc-nordea", "svc-translation", "live", "bp-tom-eriksen", "strong", 190_000, {
    marketId: "lu",
    since: "2023-02-01",
  }),
  rel("srv-jh-fcs", "acc-janushenderson", "svc-fcs", "renewal", "bp-claire-dubois", "attention", 890_000, {
    marketId: "lu",
    since: "2020-11-01",
    renewalInDays: 76,
    note: "Operating normally. No scope agreed and no client engagement for eleven weeks.",
  }),
  rel("srv-abrdn-fcs", "acc-abrdn", "svc-fcs", "renewal", "bp-claire-dubois", "risk", 620_000, {
    marketId: "lu",
    since: "2019-08-01",
    renewalInDays: 55,
    note: "Renewal deferred twice by the client. Service is operating, the relationship is not.",
  }),
  rel("srv-mfex-funddata", "acc-mfex", "svc-funddata", "live", "bp-elena-costa", "stable", 320_000, {
    marketId: "se",
    since: "2024-01-15",
  }),
  rel("srv-schroders-xborder", "acc-schroders", "svc-xborder", "expansion", "bp-sarah-patel", "stable", 280_000, {
    marketId: "lu",
    since: "2024-09-01",
    note: "Cross-border fund distribution support adjacent to the live FCS relationship.",
  }),
  rel("srv-schroders-registration", "acc-schroders", "svc-registration", "live", "bp-sarah-patel", "stable", 210_000, {
    marketId: "lu",
    since: "2024-09-01",
    note: "Host-market registration and legal representation for DE, IT and ES filings.",
  }),
  rel("srv-allfunds-saleswatch", "acc-allfunds", "svc-saleswatch", "live", "bp-elena-costa", "strong", 450_000, {
    marketId: "se",
    since: "2023-11-01",
    note: "SalesWatch benchmarking across Iberian and Italian platform channels.",
  }),
  rel("srv-allfunds-fundfile", "acc-allfunds", "svc-fundfile", "live", "bp-elena-costa", "stable", 380_000, {
    marketId: "se",
    since: "2024-02-01",
    note: "FundFile product-preference intelligence for distributor selection.",
  }),
  rel("srv-nordea-regworkflow", "acc-nordea", "svc-regworkflow", "live", "bp-tom-eriksen", "stable", 290_000, {
    marketId: "lu",
    since: "2023-08-01",
    renewalInDays: 156,
    note: "PRIIPs / UCITS / SFDR workflow support for the Nordic SICAV range.",
  }),
  rel("srv-waystone-regworkflow", "acc-waystone", "svc-regworkflow", "change", "bp-ravi-nair", "attention", 340_000, {
    marketId: "ie",
    since: "2022-04-01",
    note: "Regulatory workflow under review after ManCo consolidation signals.",
  }),
];

const SITUATION_SERVICE: Record<Situation, { serviceId: string; lifecycle: ServiceRelationship["lifecycle"]; arr: number }> = {
  expanding: { serviceId: "svc-fcs", lifecycle: "expansion", arr: 520_000 },
  renewing: { serviceId: "svc-fcs", lifecycle: "renewal", arr: 640_000 },
  regulatory: { serviceId: "svc-regworkflow", lifecycle: "live", arr: 470_000 },
  consolidating: { serviceId: "svc-docs", lifecycle: "change", arr: 580_000 },
  "platform-shift": { serviceId: "svc-funddata", lifecycle: "live", arr: 340_000 },
  "new-exec": { serviceId: "svc-fcs", lifecycle: "live", arr: 300_000 },
  quiet: { serviceId: "svc-fcs", lifecycle: "live", arr: 260_000 },
  greenfield: { serviceId: "svc-fcs", lifecycle: "live", arr: 0 },
};

/** Renewal windows, spread deterministically so the 180-day count is real. */
const RENEWAL_DAYS = [42, 68, 94, 117, 143, 168, 201, 236, 274, 311];

function portfolioServiceRelationships(): ServiceRelationship[] {
  const out: ServiceRelationship[] = [];
  let renewalCursor = 0;
  for (const spec of PORTFOLIO_SPECS) {
    if (spec.rel !== "existing-client") continue;
    /* Authored above with a service state the composer cannot express. */
    if (spec.id === "acc-abrdn") continue;
    const t = SITUATION_SERVICE[spec.situation];
    const key = spec.id.replace("acc-", "");
    const isRenewal = t.lifecycle === "renewal" || t.lifecycle === "expansion";
    const renewalInDays = isRenewal
      ? RENEWAL_DAYS[renewalCursor++ % RENEWAL_DAYS.length]
      : undefined;
    out.push(
      rel(`srv-${key}`, spec.id, t.serviceId, t.lifecycle, spec.owner, spec.situation === "renewing" ? "attention" : "stable", t.arr, {
        marketId: spec.domicile,
        since: "2023-05-01",
        renewalInDays,
      }),
    );
  }
  return out;
}

export const SERVICE_RELATIONSHIPS: ServiceRelationship[] = [
  ...HERO_SERVICE_RELATIONSHIPS,
  ...portfolioServiceRelationships(),
];

/* ── Recommended actions ──────────────────────────────────────────────────── */

export const ACTIONS: RecommendedAction[] = [
  {
    id: "act-schroders-validate",
    type: "validate-operating-model",
    what: "Ask the existing Luxembourg client director to validate the registration, local-representation and document-distribution model.",
    whyItMatters:
      "The group has expanded into three host markets and holds a communications relationship with us. Whether that expansion creates work we can help with depends entirely on how it is operated today — and we do not know.",
    evidenceIds: ["evd-schroders-de", "evd-schroders-it", "evd-schroders-es", "evd-schroders-relationship"],
    unknown: [
      "Current registration and local-representation model.",
      "Whether an incumbent provider already covers these markets.",
      "Who owns the distribution operating model.",
    ],
    ownerId: "bp-sarah-patel",
    dueLabel: "Within 5 working days",
    approvalNeeded: false,
  },
  {
    id: "act-nordea-reset",
    type: "decision-process-reset",
    what: "Agree a decision-process review with the operations sponsor. Confirm the executive owner, success criteria, current provider, procurement path and target decision date.",
    whyItMatters:
      "The problem and the sponsor are confirmed, which is more than most deals at this value. The deal is not forecast-ready because nobody has established how a decision actually gets made.",
    evidenceIds: ["evd-nordea-sponsor", "evd-nordea-nextstep", "evd-nordea-buyer"],
    unknown: [
      "Economic buyer.",
      "Procurement route.",
      "Current provider model.",
      "Joint decision date.",
    ],
    ownerId: "bp-tom-eriksen",
    dueLabel: "This week",
    approvalNeeded: false,
  },
  {
    id: "act-waystone-buyermap",
    type: "build-buyer-map",
    what: "Build the buying-system map for the Luxembourg management company before any outreach.",
    whyItMatters:
      "Product fit is high and the consolidation timing is genuinely favourable, but we do not know whether the ManCo or the group buys. Approaching the wrong level once is expensive to undo.",
    evidenceIds: ["evd-waystone-permissions", "evd-waystone-consolidation", "evd-waystone-buyer"],
    unknown: [
      "Whether communications and reporting are bought at ManCo or group level.",
      "Which providers came across with the acquired business.",
      "When the operating-standard decision is made.",
    ],
    ownerId: "bp-ravi-nair",
    dueLabel: "Within 10 working days",
    approvalNeeded: false,
  },
  {
    id: "act-jh-renewal",
    type: "prepare-account-brief",
    what: "Open the renewal conversation on service quality and rebuild the stakeholder plan. Do not raise the widened host-market footprint yet.",
    whyItMatters:
      "A renewal inside 90 days with no engagement for eleven weeks is a retention risk. Leading with expansion into that silence would confirm the client's likely suspicion that we noticed the renewal, not them.",
    evidenceIds: ["evd-jh-renewal", "evd-jh-quiet", "evd-jh-owner"],
    unknown: [
      "Who owns the renewal decision this cycle.",
      "Whether the quiet period reflects satisfaction or disengagement.",
      "Whether a competitor has been invited in.",
    ],
    ownerId: "bp-claire-dubois",
    dueLabel: "Within 3 working days",
    approvalNeeded: false,
  },
  {
    id: "act-allfunds-plan",
    type: "build-buyer-map",
    what: "Build the account plan and establish which product decisions sit regionally and which sit centrally.",
    whyItMatters:
      "There are several warm internal routes and no active deal. Spending one of those routes on an unfocused approach wastes the only real asset the account currently has.",
    evidenceIds: ["evd-allfunds-alonso", "evd-allfunds-flows", "evd-allfunds-routes", "evd-allfunds-central"],
    unknown: [
      "Whether distribution data is bought centrally.",
      "Which internal route is genuinely warm.",
      "What the flow shift reflects commercially.",
    ],
    ownerId: "bp-elena-costa",
    dueLabel: "Within 10 working days",
    approvalNeeded: false,
  },
];

/* ── Hypotheses ───────────────────────────────────────────────────────────── */

export const HERO_HYPOTHESES: Hypothesis[] = [
  {
    id: "hyp-schroders-xborder",
    accountId: "acc-schroders",
    title: "Cross-border distribution support alongside the existing communications relationship",
    triggerEventIds: ["ev-schroders-xborder", "ev-schroders-renewal"],
    serviceIds: ["svc-xborder", "svc-registration", "svc-compliance", "svc-translation"],
    whyItMayMatter:
      "The group already has a Broadridge fund-document relationship. A wider market footprint may create a need for registration, local representation, fund data, document distribution and ongoing compliance support.",
    known: [
      "Verified host-market activity in three markets within 45 days.",
      "An active Fund Communication Solutions relationship in a group entity.",
      "A renewal window inside 120 days.",
    ],
    stillToLearn: [
      "Current provider model.",
      "Economic buyer.",
      "Programme scope and market-entry timetable.",
    ],
    confidence: "medium",
    state: "system-suggestion",
    recommendedActionId: "act-schroders-validate",
    potentialValue: 780_000,
    createdOn: "2026-08-24",
  },
  {
    id: "hyp-nordea-regulatory",
    accountId: "acc-nordea",
    title: "Regulatory workflow support ahead of the 2027 PRIIPs cycle",
    triggerEventIds: ["ev-nordea-priips"],
    serviceIds: ["svc-regworkflow", "svc-regreporting"],
    whyItMayMatter:
      "A dated obligation across a wide share-class register may extend the scope of the live cross-border conversation, if the refresh is not already resourced.",
    known: [
      "A dated obligation applies across the Luxembourg range.",
      "An operations sponsor is engaged on an adjacent conversation.",
    ],
    stillToLearn: [
      "Whether the refresh is resourced internally or with a provider.",
      "Whether the cycle is genuinely the forcing date.",
    ],
    confidence: "low",
    state: "seller-hypothesis",
    recommendedActionId: "act-nordea-reset",
    potentialValue: 240_000,
    createdOn: "2026-08-03",
  },
  {
    id: "hyp-waystone-manco",
    accountId: "acc-waystone",
    title: "Fund communications and regulatory reporting for the consolidated ManCo book",
    triggerEventIds: ["ev-waystone-permissions", "ev-waystone-consolidation"],
    serviceIds: ["svc-fcs", "svc-regreporting", "svc-regworkflow", "svc-funddata"],
    whyItMayMatter:
      "A third-party ManCo consolidating an acquired book normally sets one operating standard across it, which is the moment a provider decision is genuinely open.",
    known: [
      "Permissions extended in July 2026.",
      "Acquired management company businesses integrated during 2026.",
      "New Luxembourg management company leadership in place.",
    ],
    stillToLearn: [
      "Whether the ManCo or group buys.",
      "Which providers transferred with the acquired book.",
      "When the operating-standard decision lands.",
    ],
    confidence: "medium",
    state: "system-suggestion",
    recommendedActionId: "act-waystone-buyermap",
    potentialValue: 1_100_000,
    createdOn: "2026-07-16",
  },
  {
    id: "hyp-jh-renewal",
    accountId: "acc-janushenderson",
    title: "Protect the communications renewal before considering any expansion",
    triggerEventIds: ["ev-jh-renewal", "ev-jh-hosts"],
    serviceIds: ["svc-fcs"],
    whyItMayMatter:
      "The widened host-market footprint would ordinarily support an expansion conversation. Eleven weeks of silence ahead of a renewal means retention comes first.",
    known: [
      "Renewal in 76 days with no agreed scope.",
      "No client engagement recorded for eleven weeks.",
      "Host-market coverage widened across two ranges.",
    ],
    stillToLearn: [
      "Who owns the renewal decision.",
      "Whether the silence reflects satisfaction or disengagement.",
    ],
    confidence: "medium",
    state: "system-suggestion",
    recommendedActionId: "act-jh-renewal",
    potentialValue: 0,
    createdOn: "2026-09-01",
  },
  {
    id: "hyp-allfunds-intel",
    accountId: "acc-allfunds",
    title: "Distribution data and product-preference intelligence for the platform",
    triggerEventIds: ["ev-allfunds-flows", "ev-allfunds-alonso", "ev-allfunds-manco-divest"],
    serviceIds: ["svc-fundfile", "svc-saleswatch", "svc-marketintel", "svc-funddata"],
    whyItMayMatter:
      "Moving management-company activity out of the group narrows what the platform needs from a services provider and sharpens what it needs from a data one.",
    known: [
      "A measurable channel shift across Iberia and Italy.",
      "A senior product and distribution appointment.",
      "Management company businesses transferred out during 2026.",
    ],
    stillToLearn: [
      "Whether distribution data is bought centrally.",
      "Whether the platform already has this visibility internally.",
      "Which internal route is genuinely warm.",
    ],
    confidence: "low",
    state: "seller-hypothesis",
    recommendedActionId: "act-allfunds-plan",
    potentialValue: 460_000,
    createdOn: "2026-08-27",
  },
];

const SITUATION_HYPOTHESIS: Record<
  Situation,
  { title: string; services: string[]; value: number; confidence: Hypothesis["confidence"] } | null
> = {
  expanding: { title: "Cross-border distribution and registration support for the new host markets", services: ["svc-xborder", "svc-registration", "svc-translation"], value: 420_000, confidence: "medium" },
  renewing: { title: "Protect the renewal and confirm scope before any expansion", services: ["svc-fcs"], value: 0, confidence: "medium" },
  regulatory: { title: "Regulatory workflow support against a dated obligation", services: ["svc-regworkflow", "svc-regreporting"], value: 310_000, confidence: "low" },
  consolidating: { title: "One operating standard across the consolidated book", services: ["svc-imops", "svc-docs"], value: 640_000, confidence: "medium" },
  "platform-shift": { title: "Product-preference intelligence to explain the channel shift", services: ["svc-fundfile", "svc-saleswatch"], value: 220_000, confidence: "low" },
  "new-exec": { title: "Confirm the new incumbent's remit before any approach", services: ["svc-marketintel"], value: 0, confidence: "low" },
  quiet: null,
  greenfield: null,
};

function portfolioHypotheses(): { hypotheses: Hypothesis[]; actions: RecommendedAction[] } {
  const hypotheses: Hypothesis[] = [];
  const actions: RecommendedAction[] = [];
  for (const spec of PORTFOLIO_SPECS) {
    const t = SITUATION_HYPOTHESIS[spec.situation];
    if (!t) continue;
    const key = spec.id.replace("acc-", "");
    const actionId = `act-${key}`;
    actions.push({
      id: actionId,
      type: spec.rel === "existing-client" ? "validate-operating-model" : "build-buyer-map",
      what:
        spec.rel === "existing-client"
          ? "Validate the current operating model with the existing service owner before proposing anything."
          : "Build the buying-system map before outreach.",
      whyItMatters:
        "The trigger is verified, but nothing about how this group operates or decides has been confirmed with them.",
      evidenceIds: [`evd-${key}`],
      unknown: ["Current operating model and provider arrangement.", "Who owns the relevant decision."],
      ownerId: spec.owner,
      dueLabel: "Within 10 working days",
      approvalNeeded: false,
    });
    hypotheses.push({
      id: `hyp-${key}`,
      accountId: spec.id,
      title: t.title,
      triggerEventIds: [`ev-${key}`],
      serviceIds: t.services,
      whyItMayMatter:
        "A verified change at the group may create work adjacent to a Broadridge capability. Whether it does depends on their current operating model.",
      known: ["A verified change recorded against the group."],
      stillToLearn: ["Current operating model and provider arrangement.", "Who owns the relevant decision."],
      confidence: t.confidence,
      state: spec.rel === "existing-client" ? "system-suggestion" : "seller-hypothesis",
      recommendedActionId: actionId,
      potentialValue: t.value,
      createdOn: "2026-08-22",
    });
  }
  return { hypotheses, actions };
}

const portfolio = portfolioHypotheses();
export const HYPOTHESES: Hypothesis[] = [...HERO_HYPOTHESES, ...portfolio.hypotheses];
export const RECOMMENDED_ACTIONS: RecommendedAction[] = [...ACTIONS, ...portfolio.actions];

/* ── Deals ────────────────────────────────────────────────────────────────── */

type H = Record<HealthComponentId, number>;

const h = (
  momentum: number,
  buyingGroup: number,
  nextStep: number,
  valueCase: number,
  decisionTiming: number,
  competitive: number,
  dataCompleteness: number,
): H => ({
  momentum,
  "buying-group": buyingGroup,
  "next-step": nextStep,
  "value-case": valueCase,
  "decision-timing": decisionTiming,
  competitive,
  "data-completeness": dataCompleteness,
});

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-nordea-xborder",
    name: "Cross-border distribution and regulatory support",
    accountId: "acc-nordea",
    serviceIds: ["svc-xborder", "svc-compliance", "svc-regworkflow"],
    value: 640_000,
    recurring: true,
    stage: "people",
    crmStage: "Qualification",
    ownerId: "bp-tom-eriksen",
    closeDate: "2027-01-29",
    closeDateMoves: 1,
    lastBuyerActivity: "Fund operations working session",
    lastBuyerActivityDays: 44,
    nextMutualCommitment: "Follow-up operating model session",
    nextCommitmentDate: "2026-08-21",
    nextCommitmentExpired: true,
    mainGap: "economic-buyer",
    gaps: ["economic-buyer", "procurement-route", "provider-model", "decision-date"],
    health: h(0.45, 0.4, 0.1, 0.55, 0.15, 0.25, 0.5),
    statement:
      "The customer problem and operational sponsor are confirmed. The deal is not forecast-ready because no economic buyer, procurement route or target decision date has been confirmed.",
    bestNextAction:
      "Agree a decision-process review with the operations sponsor. Confirm the executive owner, success criteria, current provider, procurement path and target decision date.",
    evidenceIds: ["evd-nordea-sponsor", "evd-nordea-nextstep", "evd-nordea-buyer"],
    buyingGroupPersonIds: ["px-nordea-andersen", "bp-tom-eriksen"],
    marker: "attention",
  },
  {
    id: "opp-schroders-renewal",
    name: "Fund Communication Solutions renewal, Luxembourg",
    accountId: "acc-schroders",
    serviceIds: ["svc-fcs", "svc-docs"],
    value: 1_350_000,
    recurring: true,
    stage: "decision",
    crmStage: "Renewal",
    ownerId: "bp-sarah-patel",
    closeDate: "2027-01-04",
    closeDateMoves: 0,
    lastBuyerActivity: "Service review completed",
    lastBuyerActivityDays: 15,
    nextMutualCommitment: "Joint renewal and operating model review",
    nextCommitmentDate: "2026-09-24",
    mainGap: "value-case",
    gaps: ["value-case"],
    health: h(0.8, 0.75, 0.85, 0.5, 0.8, 0.7, 0.85),
    statement:
      "Service is healthy, the relationship owner is engaged and a dated joint review is agreed. The value case for any scope change has not been validated with the client.",
    bestNextAction:
      "Use the agreed review to establish whether the widened host-market footprint changed their document and compliance workload.",
    evidenceIds: ["evd-schroders-renewal", "evd-schroders-relationship"],
    buyingGroupPersonIds: ["px-schroders-schwyzer", "px-schroders-bergh", "bp-sarah-patel"],
    marker: "progress",
  },
  {
    id: "opp-jh-renewal",
    name: "Fund Communication Solutions renewal",
    accountId: "acc-janushenderson",
    serviceIds: ["svc-fcs"],
    value: 890_000,
    recurring: true,
    stage: "decision",
    crmStage: "Renewal",
    ownerId: "bp-claire-dubois",
    closeDate: "2026-11-21",
    closeDateMoves: 2,
    lastBuyerActivity: "Service review notes, no scope agreed",
    lastBuyerActivityDays: 80,
    mainGap: "mutual-next-step",
    gaps: ["mutual-next-step", "economic-buyer", "close-date-slip", "decision-date"],
    health: h(0.1, 0.2, 0.05, 0.3, 0.2, 0.2, 0.4),
    statement:
      "A renewal inside 90 days with no client engagement for eleven weeks, no agreed scope and no scheduled conversation. This is a retention risk, not a pipeline entry.",
    bestNextAction:
      "Open the renewal on service quality within three working days and re-establish who owns the decision this cycle.",
    evidenceIds: ["evd-jh-renewal", "evd-jh-quiet", "evd-jh-owner"],
    buyingGroupPersonIds: ["px-jh-delamaza", "bp-claire-dubois"],
    marker: "risk",
  },
  {
    id: "opp-amundi-consolidation",
    name: "Consolidated document operating model",
    accountId: "acc-amundi",
    serviceIds: ["svc-docs", "svc-imops"],
    value: 2_400_000,
    recurring: true,
    stage: "solution",
    crmStage: "Proposal",
    ownerId: "bp-marta-oliveira",
    closeDate: "2027-03-31",
    closeDateMoves: 1,
    lastBuyerActivity: "Operating model workshop",
    lastBuyerActivityDays: 21,
    nextMutualCommitment: "Scope confirmation session",
    nextCommitmentDate: "2026-09-30",
    mainGap: "procurement-route",
    gaps: ["procurement-route", "decision-date"],
    health: h(0.7, 0.6, 0.65, 0.7, 0.3, 0.5, 0.6),
    statement:
      "Scope and value are well understood and the sponsor is engaged. The procurement route for a group of this size has not been established.",
    bestNextAction: "Confirm the procurement route and the decision calendar before the scope session.",
    evidenceIds: ["evd-amundi"],
    buyingGroupPersonIds: ["bp-marta-oliveira"],
    marker: "attention",
  },
  {
    id: "opp-dws-regworkflow",
    name: "Regulatory workflow, 2027 cycle",
    accountId: "acc-dws",
    serviceIds: ["svc-regworkflow", "svc-regreporting"],
    value: 1_100_000,
    recurring: true,
    stage: "decision",
    crmStage: "Negotiation",
    ownerId: "bp-david-lange",
    closeDate: "2026-11-28",
    closeDateMoves: 0,
    lastBuyerActivity: "Commercial terms review",
    lastBuyerActivityDays: 6,
    nextMutualCommitment: "Contract review with legal",
    nextCommitmentDate: "2026-09-18",
    mainGap: "legal-compliance",
    gaps: ["legal-compliance"],
    health: h(0.85, 0.8, 0.85, 0.8, 0.75, 0.7, 0.8),
    statement:
      "Buyer roles are covered, the value case is validated and a dated commitment is in place. Legal review is the only outstanding condition.",
    bestNextAction: "Confirm the legal review date and the signature path.",
    evidenceIds: ["evd-dws"],
    buyingGroupPersonIds: ["bp-david-lange", "bp-anna-weber"],
    marker: "progress",
  },
  {
    id: "opp-pimco-regreporting",
    name: "Regulatory reporting across the Irish range",
    accountId: "acc-pimco",
    serviceIds: ["svc-regreporting", "svc-compliance"],
    value: 1_600_000,
    recurring: true,
    stage: "decision",
    crmStage: "Negotiation",
    ownerId: "bp-david-lange",
    closeDate: "2026-12-12",
    closeDateMoves: 0,
    lastBuyerActivity: "Decision criteria confirmed",
    lastBuyerActivityDays: 9,
    nextMutualCommitment: "Executive sign-off review",
    nextCommitmentDate: "2026-10-02",
    mainGap: "value-case",
    gaps: ["value-case"],
    health: h(0.8, 0.85, 0.8, 0.6, 0.8, 0.75, 0.85),
    statement:
      "Decision owner, criteria and timeline are confirmed. The value case has been presented but not validated back by the client.",
    bestNextAction: "Ask the sponsor to restate the value case in their own terms before sign-off.",
    evidenceIds: ["evd-pimco"],
    buyingGroupPersonIds: ["bp-david-lange"],
    marker: "progress",
  },
  {
    id: "opp-invesco-regworkflow",
    name: "PRIIPs and EET workflow support",
    accountId: "acc-invesco",
    serviceIds: ["svc-regworkflow"],
    value: 780_000,
    recurring: true,
    stage: "solution",
    crmStage: "Proposal",
    ownerId: "bp-lucy-chen",
    closeDate: "2027-02-26",
    closeDateMoves: 1,
    lastBuyerActivity: "Technical requirements session",
    lastBuyerActivityDays: 34,
    mainGap: "provider-model",
    gaps: ["provider-model", "mutual-next-step"],
    health: h(0.4, 0.55, 0.2, 0.6, 0.35, 0.25, 0.55),
    statement:
      "Requirements are understood and the operational contact is engaged. The incumbent provider arrangement is unknown and no next step is scheduled.",
    bestNextAction: "Validate the current provider arrangement before proposing a scope.",
    evidenceIds: ["evd-invesco"],
    buyingGroupPersonIds: ["bp-lucy-chen", "bp-anna-weber"],
    marker: "attention",
  },
  {
    id: "opp-allianzgi-xborder",
    name: "Cross-border registration, Netherlands entry",
    accountId: "acc-allianzgi",
    serviceIds: ["svc-xborder", "svc-registration"],
    value: 1_250_000,
    recurring: true,
    stage: "solution",
    crmStage: "Proposal",
    ownerId: "bp-david-lange",
    closeDate: "2026-12-19",
    closeDateMoves: 0,
    lastBuyerActivity: "Market entry planning session",
    lastBuyerActivityDays: 11,
    nextMutualCommitment: "Registration timetable review",
    nextCommitmentDate: "2026-09-26",
    mainGap: "decision-date",
    gaps: ["decision-date"],
    health: h(0.8, 0.7, 0.8, 0.75, 0.5, 0.7, 0.75),
    statement:
      "The market entry is real, dated and sponsored. A target decision date has not been agreed jointly.",
    bestNextAction: "Agree a target decision date against the registration timetable.",
    evidenceIds: ["evd-allianzgi"],
    buyingGroupPersonIds: ["bp-david-lange"],
    marker: "progress",
  },
  {
    id: "opp-eurizon-xborder",
    name: "Registration and local representation, Poland and Spain",
    accountId: "acc-eurizon",
    serviceIds: ["svc-registration", "svc-translation"],
    value: 950_000,
    recurring: true,
    stage: "solution",
    crmStage: "Proposal",
    ownerId: "bp-marta-oliveira",
    closeDate: "2027-01-22",
    closeDateMoves: 0,
    lastBuyerActivity: "Scope walkthrough",
    lastBuyerActivityDays: 13,
    nextMutualCommitment: "Commercial proposal review",
    nextCommitmentDate: "2026-10-08",
    mainGap: "value-case",
    gaps: ["value-case"],
    health: h(0.75, 0.7, 0.75, 0.55, 0.65, 0.6, 0.75),
    statement:
      "Scope, sponsor and timing are confirmed. The commercial value case has not been validated with the budget holder.",
    bestNextAction: "Take the value case to the budget holder before the proposal review.",
    evidenceIds: ["evd-eurizon"],
    buyingGroupPersonIds: ["bp-marta-oliveira"],
    marker: "progress",
  },
  {
    id: "opp-gsam-imops",
    name: "Investment operations platform consolidation",
    accountId: "acc-gsam",
    serviceIds: ["svc-imops", "svc-funddata"],
    value: 3_200_000,
    recurring: true,
    stage: "people",
    crmStage: "Discovery",
    ownerId: "bp-lucy-chen",
    closeDate: "2027-06-30",
    closeDateMoves: 1,
    lastBuyerActivity: "Architecture discovery session",
    lastBuyerActivityDays: 28,
    mainGap: "legal-compliance",
    gaps: ["legal-compliance", "economic-buyer", "procurement-route"],
    health: h(0.5, 0.35, 0.4, 0.45, 0.25, 0.4, 0.45),
    statement:
      "The operational problem is understood at architecture level. No economic buyer is confirmed and legal and compliance have not been engaged on a deal of this size.",
    bestNextAction:
      "Build the buying-system map above the architecture contact before any further solution work.",
    evidenceIds: ["evd-gsam"],
    buyingGroupPersonIds: ["bp-lucy-chen"],
    marker: "attention",
  },
  {
    id: "opp-fidelityintl-renewal",
    name: "Fund communications renewal and scope review",
    accountId: "acc-fidelityintl",
    serviceIds: ["svc-fcs", "svc-translation"],
    value: 1_400_000,
    recurring: true,
    stage: "decision",
    crmStage: "Renewal",
    ownerId: "bp-james-howard",
    closeDate: "2026-11-14",
    closeDateMoves: 0,
    lastBuyerActivity: "Renewal scope agreed",
    lastBuyerActivityDays: 4,
    nextMutualCommitment: "Contract issue and signature",
    nextCommitmentDate: "2026-10-16",
    mainGap: "procurement-route",
    gaps: ["procurement-route"],
    health: h(0.9, 0.8, 0.9, 0.85, 0.8, 0.75, 0.85),
    statement:
      "Scope is agreed, the sponsor is engaged and a dated signature path exists. Procurement has not yet confirmed its route.",
    bestNextAction: "Confirm the procurement route so the signature date holds.",
    evidenceIds: ["evd-fidelityintl"],
    buyingGroupPersonIds: ["bp-james-howard"],
    marker: "progress",
  },
  {
    id: "opp-abrdn-renewal",
    name: "Fund communications renewal",
    accountId: "acc-abrdn",
    serviceIds: ["svc-fcs"],
    value: 620_000,
    recurring: true,
    stage: "decision",
    crmStage: "Renewal",
    ownerId: "bp-claire-dubois",
    closeDate: "2026-10-31",
    closeDateMoves: 2,
    lastBuyerActivity: "Renewal discussion deferred",
    lastBuyerActivityDays: 61,
    mainGap: "close-date-slip",
    gaps: ["close-date-slip", "mutual-next-step", "economic-buyer"],
    health: h(0.15, 0.25, 0.1, 0.35, 0.15, 0.3, 0.45),
    statement:
      "The close date has moved twice and the last two attempts to schedule a renewal conversation were deferred by the client. Treat as at risk until a dated commitment exists.",
    bestNextAction: "Escalate to the account owner and seek a dated commitment this week.",
    evidenceIds: ["evd-abrdn"],
    buyingGroupPersonIds: ["bp-claire-dubois"],
    marker: "risk",
  },
  {
    id: "opp-robeco-fcs",
    name: "Fund communications, Spanish market entry",
    accountId: "acc-robeco",
    serviceIds: ["svc-fcs", "svc-translation"],
    value: 540_000,
    recurring: true,
    stage: "solution",
    crmStage: "Proposal",
    ownerId: "bp-lucy-chen",
    closeDate: "2026-12-05",
    closeDateMoves: 0,
    lastBuyerActivity: "Requirements confirmed",
    lastBuyerActivityDays: 8,
    nextMutualCommitment: "Proposal walkthrough",
    nextCommitmentDate: "2026-09-22",
    mainGap: "value-case",
    gaps: ["value-case"],
    health: h(0.8, 0.7, 0.8, 0.6, 0.7, 0.65, 0.75),
    statement:
      "The market entry is confirmed and requirements are agreed. The value case is presented but not yet validated.",
    bestNextAction: "Validate the value case at the proposal walkthrough.",
    evidenceIds: ["evd-robeco"],
    buyingGroupPersonIds: ["bp-lucy-chen"],
    marker: "progress",
  },
  {
    id: "opp-mandg-docs",
    name: "Document production, Austrian range extension",
    accountId: "acc-mandg",
    serviceIds: ["svc-docs", "svc-translation"],
    value: 460_000,
    recurring: true,
    stage: "problem",
    crmStage: "Discovery",
    ownerId: "bp-james-howard",
    closeDate: "2027-03-12",
    closeDateMoves: 0,
    lastBuyerActivity: "Initial requirements call",
    lastBuyerActivityDays: 37,
    mainGap: "provider-model",
    gaps: ["provider-model", "mutual-next-step", "economic-buyer"],
    health: h(0.35, 0.3, 0.15, 0.4, 0.2, 0.2, 0.5),
    statement:
      "The operational need is described but not confirmed as a priority, and the incumbent arrangement is unknown.",
    bestNextAction: "Validate the current provider arrangement and confirm whether this is funded work.",
    evidenceIds: ["evd-mandg"],
    buyingGroupPersonIds: ["bp-james-howard"],
    marker: "attention",
  },
  {
    id: "opp-allfunds-saleswatch",
    name: "SalesWatch and FundFile expansion, Iberia and Italy",
    accountId: "acc-allfunds",
    serviceIds: ["svc-saleswatch", "svc-fundfile", "svc-marketintel"],
    value: 520_000,
    recurring: true,
    stage: "solution",
    crmStage: "Qualify",
    ownerId: "bp-elena-costa",
    closeDate: "2026-12-18",
    closeDateMoves: 1,
    lastBuyerActivity: "Channel-shift briefing with product preference extracts",
    lastBuyerActivityDays: 12,
    mainGap: "economic-buyer",
    gaps: ["economic-buyer", "mutual-next-step"],
    health: h(0.7, 0.65, 0.35, 0.7, 0.55, 0.4, 0.6),
    statement:
      "SalesWatch and FundFile already run on the platform. The Iberian and Italian channel shift creates a case to widen scope; the economic buyer for a wider data package is not yet confirmed.",
    bestNextAction:
      "Confirm whether distribution data and preference intelligence are bought centrally, and who signs the widened SalesWatch / FundFile package.",
    evidenceIds: [
      "evd-allfunds-flows",
      "evd-allfunds-fundfile",
      "evd-allfunds-routes",
    ],
    buyingGroupPersonIds: ["bp-elena-costa"],
    marker: "progress",
  },
];
