/**
 * Market events and the evidence behind them.
 *
 * An event's `headline` is factual and past tense. Its
 * `commercialInterpretation` is inference and is stored — and rendered —
 * separately. The interface never lets the two blur into one another.
 *
 * Illustrative prototype data.
 */
import { SIGNAL_TYPES } from "../taxonomy";
import type { EvidenceRecord, MarketEvent } from "../types";
import { PORTFOLIO_SPECS, type Situation } from "./portfolio";

/* ── Hero events ──────────────────────────────────────────────────────────── */

export const HERO_EVENTS: MarketEvent[] = [
  {
    id: "ev-schroders-xborder",
    type: "new-market-entry",
    headline:
      "A Luxembourg UCITS range added cross-border marketing activity in Germany, Italy and Spain.",
    detail:
      "Three sub-funds of the Luxembourg SICAV range were notified for marketing into Germany and Italy on 14 August, and into Spain on 21 August.",
    accountId: "acc-schroders",
    entityId: "ent-schroders-lux",
    fundId: "fund-sisf-globaleq",
    domicileMarketId: "lu",
    hostMarketIds: ["de", "it", "es"],
    effectiveDate: "2026-08-14",
    detectedDate: "2026-08-16",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-schroders-de", "evd-schroders-it", "evd-schroders-es"],
    commercialInterpretation:
      "A wider host-market footprint typically increases registration, local representation, fund-document, translation and ongoing compliance workload. The group already holds a Fund Communication Solutions relationship, so the incremental need is likely adjacent to work we already do.",
    stillToLearn: [
      "The current registration and local-representation operating model.",
      "Whether an incumbent provider already covers these markets.",
      "The planned market-entry timetable and scale.",
      "Who owns the decision on the distribution operating model.",
    ],
    relevantServiceIds: [
      "svc-xborder",
      "svc-registration",
      "svc-fcs",
      "svc-translation",
      "svc-compliance",
    ],
    materiality: 5,
  },
  {
    id: "ev-schroders-schwyzer",
    type: "new-executive",
    headline:
      "A head of client group for Europe was appointed, joining from UBS and based in Zurich.",
    detail:
      "The appointment was announced in February 2026 with a start date of 7 April 2026, covering European client strategy.",
    accountId: "acc-schroders",
    hostMarketIds: ["ch", "de", "it", "es"],
    effectiveDate: "2026-04-07",
    detectedDate: "2026-02-11",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-schroders-schwyzer"],
    commercialInterpretation:
      "A newly seated European client leader often reviews the operating model behind distribution within the first two quarters. It may create a window, but it is not on its own a reason to sell.",
    stillToLearn: [
      "Whether the role owns distribution strategy, the operating model, or both.",
      "Whether any operating-model review is actually underway.",
    ],
    relevantServiceIds: ["svc-xborder", "svc-marketintel"],
    materiality: 3,
  },
  {
    id: "ev-schroders-renewal",
    type: "renewal-plus-change",
    headline:
      "A Fund Communication Solutions renewal window opened while host-market activity was widening.",
    detail:
      "The Luxembourg communications agreement reaches its renewal window in 120 days, in the same period the range extended into three further host markets.",
    accountId: "acc-schroders",
    entityId: "ent-schroders-lux",
    domicileMarketId: "lu",
    hostMarketIds: ["de", "it", "es"],
    effectiveDate: "2027-01-04",
    detectedDate: "2026-09-01",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-schroders-renewal"],
    commercialInterpretation:
      "A renewal that coincides with a genuine change in the client's footprint is the strongest available reason for a joint review — provided the conversation leads with their operating need rather than our renewal.",
    stillToLearn: [
      "Whether the widened footprint changed their document workload at all.",
      "Who owns the renewal decision this cycle.",
    ],
    relevantServiceIds: ["svc-fcs", "svc-docs", "svc-xborder"],
    materiality: 5,
  },
  {
    id: "ev-nordea-priips",
    type: "regulatory-deadline",
    headline:
      "A PRIIPs KID refresh obligation applies across the Luxembourg range for the 2027 cycle.",
    detail:
      "The recurring refresh cycle covers all share classes of the Luxembourg SICAV range distributed into EU host markets.",
    accountId: "acc-nordea",
    entityId: "ent-nordea-lux",
    domicileMarketId: "lu",
    hostMarketIds: ["dk", "se", "no", "fi", "de", "it", "es", "fr"],
    effectiveDate: "2027-01-01",
    detectedDate: "2026-07-30",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-nordea-priips"],
    commercialInterpretation:
      "A dated obligation across a wide share-class register creates a forcing date. Whether it is a commercial opportunity depends entirely on how the work is resourced today, which is not established.",
    stillToLearn: [
      "Whether the refresh is resourced internally or with a provider.",
      "Whether the 2027 cycle is genuinely the forcing date for the live opportunity.",
    ],
    relevantServiceIds: ["svc-regworkflow", "svc-regreporting", "svc-docs", "svc-translation"],
    materiality: 4,
  },
  {
    id: "ev-nordea-andersen",
    type: "new-executive",
    headline: "A head of private markets was appointed, starting 13 April 2026.",
    detail:
      "The appointment was announced in March 2026 and covers the private markets business.",
    accountId: "acc-nordea",
    hostMarketIds: ["dk", "se"],
    effectiveDate: "2026-04-13",
    detectedDate: "2026-03-18",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-nordea-andersen"],
    commercialInterpretation:
      "Private markets sits outside the scope of the current cross-border conversation on the evidence available. Recorded for completeness, not as a trigger.",
    stillToLearn: ["Whether private markets touches the current opportunity scope at all."],
    relevantServiceIds: [],
    materiality: 1,
  },
  {
    id: "ev-waystone-permissions",
    type: "new-manco-aifm-activity",
    headline:
      "The Luxembourg management company extended its permissions and added hosted sub-funds.",
    detail:
      "Permissions were extended in July 2026, alongside growth in the hosted sub-fund book across French and Dutch host markets.",
    accountId: "acc-waystone",
    entityId: "ent-waystone-lux",
    domicileMarketId: "lu",
    hostMarketIds: ["fr", "nl"],
    effectiveDate: "2026-07-10",
    detectedDate: "2026-07-14",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-waystone-permissions"],
    commercialInterpretation:
      "A third-party ManCo taking on more hosted funds carries the document, reporting and data workload for each underlying manager. Fit for fund communications and regulatory reporting is high — but who buys is unknown.",
    stillToLearn: [
      "Whether communications and reporting are bought at ManCo or group level.",
      "Whether underlying managers select their own document provider.",
    ],
    relevantServiceIds: ["svc-fcs", "svc-regreporting", "svc-regworkflow", "svc-funddata"],
    materiality: 4,
  },
  {
    id: "ev-waystone-consolidation",
    type: "client-consolidation",
    headline:
      "The management company businesses acquired from a platform group were integrated, under new Luxembourg leadership.",
    detail:
      "Integration completed in 2026 following the acquisition, with a new chief executive appointed to the Luxembourg management company in July 2026.",
    accountId: "acc-waystone",
    entityId: "ent-waystone-lux",
    domicileMarketId: "lu",
    hostMarketIds: ["lu", "es", "it"],
    effectiveDate: "2026-06-24",
    detectedDate: "2026-06-25",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-waystone-consolidation", "evd-waystone-serban"],
    commercialInterpretation:
      "Consolidating two management-company books normally forces a single operating standard, and with it a provider decision. The timing matters more than the fit: decisions of this kind are made once and then hard to reopen.",
    stillToLearn: [
      "How the acquired book is being operationally consolidated.",
      "Which providers came across with the acquired business.",
      "When the operating-standard decision is actually made.",
    ],
    relevantServiceIds: ["svc-fcs", "svc-docs", "svc-regworkflow", "svc-imops"],
    materiality: 5,
  },
  {
    id: "ev-jh-hosts",
    type: "fund-range-expansion",
    headline:
      "Host-market coverage widened across the Irish and Luxembourg ranges into Austria, Singapore and Hong Kong SAR.",
    detail:
      "The fund register shows added host-market coverage recorded through August 2026.",
    accountId: "acc-janushenderson",
    entityId: "ent-jh-ie",
    fundId: "fund-jh-capital-global",
    domicileMarketId: "ie",
    hostMarketIds: ["at", "sg", "hk"],
    effectiveDate: "2026-08-28",
    detectedDate: "2026-08-29",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-jh-hosts"],
    commercialInterpretation:
      "Wider coverage usually means more document versions and more languages. Whether it changed their workload materially is unverified — and this account is quiet, so the footprint is not the conversation to lead with.",
    stillToLearn: [
      "Whether the widened coverage changed document volumes at all.",
      "Whether the quiet period reflects satisfaction or disengagement.",
    ],
    relevantServiceIds: ["svc-fcs", "svc-docs", "svc-translation"],
    materiality: 3,
  },
  {
    id: "ev-jh-renewal",
    type: "renewal-plus-change",
    headline:
      "A Fund Communication Solutions renewal window opened with no agreed scope and no scheduled conversation.",
    detail:
      "The agreement reaches renewal in 76 days. No scope conversation has been held and engagement has been absent for eleven weeks.",
    accountId: "acc-janushenderson",
    domicileMarketId: "lu",
    hostMarketIds: ["gb", "de", "it"],
    effectiveDate: "2026-11-21",
    detectedDate: "2026-09-01",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-jh-renewal", "evd-jh-quiet"],
    commercialInterpretation:
      "A renewal inside 90 days with no stakeholder plan is a retention risk before it is anything else. Expansion should not be raised until the relationship is re-established.",
    stillToLearn: [
      "Who owns the renewal decision on the client side.",
      "Whether any competitor has been invited in.",
    ],
    relevantServiceIds: ["svc-fcs"],
    materiality: 5,
  },
  {
    id: "ev-allfunds-alonso",
    type: "new-executive",
    headline:
      "A head of US was appointed, effective 9 July 2026, from a wealth-management product development role.",
    detail:
      "The appointment was announced in June 2026. The incoming incumbent previously led international wealth management product development.",
    accountId: "acc-allfunds",
    hostMarketIds: ["us"],
    effectiveDate: "2026-07-09",
    detectedDate: "2026-06-30",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-allfunds-alonso"],
    commercialInterpretation:
      "A product-development background may indicate appetite for distribution-data and product-preference intelligence. That is a hypothesis to test, not a basis for outreach.",
    stillToLearn: [
      "Whether the remit covers European product decisions or US only.",
      "Whether distribution data is bought centrally or regionally.",
    ],
    relevantServiceIds: ["svc-fundfile", "svc-saleswatch", "svc-marketintel"],
    materiality: 3,
  },
  {
    id: "ev-allfunds-flows",
    type: "distribution-shift",
    headline:
      "Platform distribution flows moved measurably between channels across Iberia and Italy.",
    detail:
      "Flow records for August 2026 show a channel shift in the Iberian and Italian intermediary markets.",
    accountId: "acc-allfunds",
    entityId: "ent-allfunds-es",
    domicileMarketId: "es",
    hostMarketIds: ["es", "pt", "it"],
    effectiveDate: "2026-08-19",
    detectedDate: "2026-08-26",
    state: "verified-fact",
    confidence: "medium",
    evidenceIds: ["evd-allfunds-flows", "evd-allfunds-fundfile"],
    commercialInterpretation:
      "A measurable channel shift is the kind of change product-preference intelligence exists to explain. What it reflects commercially is not established, and the platform may already see it more clearly than we do.",
    stillToLearn: [
      "What the shift reflects commercially.",
      "Whether the platform already has this visibility internally.",
    ],
    relevantServiceIds: ["svc-fundfile", "svc-saleswatch", "svc-marketintel", "svc-funddata"],
    materiality: 3,
  },
  {
    id: "ev-allfunds-manco-divest",
    type: "client-consolidation",
    headline:
      "The group's management company businesses transferred to a third-party ManCo during 2026.",
    detail:
      "The transferred businesses were integrated by the acquiring group, completing in mid-2026.",
    accountId: "acc-allfunds",
    hostMarketIds: ["lu", "es"],
    effectiveDate: "2026-06-24",
    detectedDate: "2026-06-25",
    state: "verified-fact",
    confidence: "high",
    evidenceIds: ["evd-waystone-consolidation"],
    commercialInterpretation:
      "Moving management-company activity out of the group narrows what the platform needs from a services provider and sharpens what it needs from a data and intelligence one.",
    stillToLearn: [
      "How the transfer changed the platform's remaining service needs.",
      "Whether any provider relationships transferred with the business.",
    ],
    relevantServiceIds: ["svc-funddata", "svc-marketintel", "svc-fundfile"],
    materiality: 4,
  },
];

/* ── Portfolio events, composed from each account's situation ─────────────── */

const SITUATION_EVENT: Record<
  Situation,
  { type: MarketEvent["type"]; headline: string; interpretation: string; services: string[] } | null
> = {
  expanding: {
    type: "new-market-entry",
    headline: "The fund range added cross-border marketing activity in further host markets.",
    interpretation:
      "A wider host-market footprint normally increases registration, document and compliance workload. Whether it does here depends on the operating model in place.",
    services: ["svc-xborder", "svc-registration", "svc-fcs", "svc-translation"],
  },
  renewing: {
    type: "renewal-plus-change",
    headline: "A service renewal window opened without an agreed scope conversation.",
    interpretation:
      "A renewal without a stakeholder plan is a retention question first. Lead on service quality, not expansion.",
    services: ["svc-fcs"],
  },
  regulatory: {
    type: "regulatory-deadline",
    headline: "A dated regulatory obligation now applies across the fund range.",
    interpretation:
      "A forcing date only becomes commercial if the work is not already resourced. That is unverified.",
    services: ["svc-regworkflow", "svc-regreporting", "svc-compliance"],
  },
  consolidating: {
    type: "client-consolidation",
    headline: "Entities or fund ranges are being consolidated across the group.",
    interpretation:
      "Consolidation usually forces a single operating standard and a provider decision with it. Timing matters more than fit.",
    services: ["svc-imops", "svc-fcs", "svc-funddata"],
  },
  "platform-shift": {
    type: "distribution-shift",
    headline: "Distribution flows moved measurably between channels.",
    interpretation:
      "A channel shift is what product-preference intelligence exists to explain, if the group does not already see it.",
    services: ["svc-fundfile", "svc-saleswatch", "svc-marketintel"],
  },
  "new-exec": {
    type: "new-executive",
    headline: "A senior appointment changed who owns the relevant decisions.",
    interpretation:
      "A new incumbent may review the operating model. On its own it is not a reason to sell.",
    services: ["svc-marketintel"],
  },
  quiet: null,
  greenfield: null,
};

const HOST_FALLBACK = ["de", "it"];

/**
 * Detection dates, spread deterministically back from the reference date.
 * Without this every portfolio signal lands on the same day and "changed this
 * month" stops distinguishing anything.
 */
const DETECTED = [
  "2026-09-03", "2026-08-28", "2026-08-19", "2026-08-06", "2026-07-29",
  "2026-07-17", "2026-07-02", "2026-06-24", "2026-06-11", "2026-08-31",
  "2026-08-22", "2026-08-11", "2026-07-24", "2026-07-08", "2026-06-18",
];

function portfolioEvents(): MarketEvent[] {
  const out: MarketEvent[] = [];
  let cursor = 0;
  for (const spec of PORTFOLIO_SPECS) {
    const tmpl = SITUATION_EVENT[spec.situation];
    if (!tmpl) continue;
    const hosts = spec.newHosts?.length ? spec.newHosts : spec.hosts.slice(0, 2);
    const id = `ev-${spec.id.replace("acc-", "")}`;
    const detected = DETECTED[cursor++ % DETECTED.length];
    out.push({
      id,
      type: tmpl.type,
      headline: tmpl.headline,
      detail: `Recorded against ${spec.entity}.`,
      accountId: spec.id,
      entityId: `ent-${spec.id.replace("acc-", "")}`,
      fundId: `fund-${spec.id.replace("acc-", "")}`,
      domicileMarketId: spec.domicile,
      hostMarketIds: hosts.length ? hosts : HOST_FALLBACK,
      effectiveDate: detected,
      detectedDate: detected,
      state: "verified-fact",
      confidence: "medium",
      evidenceIds: [`evd-${spec.id.replace("acc-", "")}`],
      commercialInterpretation: tmpl.interpretation,
      stillToLearn: [
        "The current operating model and provider arrangement.",
        "Who owns the relevant decision.",
      ],
      relevantServiceIds: tmpl.services,
      materiality: SIGNAL_TYPES[tmpl.type].defaultMateriality,
    });
  }
  return out;
}

export const EVENTS: MarketEvent[] = [...HERO_EVENTS, ...portfolioEvents()];

/* ── Evidence ─────────────────────────────────────────────────────────────── */

const ev = (
  id: string,
  state: EvidenceRecord["state"],
  confidence: EvidenceRecord["confidence"],
  statement: string,
  sourceIds: string[],
  matchedToId: string,
  matchConfidence: EvidenceRecord["confidence"],
  usedBy: string[],
  lastUpdated: string,
  extra: Partial<EvidenceRecord> = {},
): EvidenceRecord => ({
  id,
  state,
  confidence,
  statement,
  sourceIds,
  matchedToKind: "account",
  matchedToId,
  matchConfidence,
  usedBy,
  lastUpdated,
  ...extra,
});

export const HERO_EVIDENCE: EvidenceRecord[] = [
  ev("evd-schroders-de", "verified-fact", "high", "A Luxembourg UCITS sub-fund range was notified for marketing into Germany.", ["src-reg-schroders-de"], "acc-schroders", "high", ["hyp-schroders-xborder"], "2026-08-16"),
  ev("evd-schroders-it", "verified-fact", "high", "The same range was notified for marketing into Italy on the same date.", ["src-reg-schroders-it"], "acc-schroders", "high", ["hyp-schroders-xborder"], "2026-08-16"),
  ev("evd-schroders-es", "verified-fact", "high", "A further notification covered Spain one week later.", ["src-reg-schroders-es", "src-funddata-schroders-range"], "acc-schroders", "high", ["hyp-schroders-xborder"], "2026-08-23"),
  ev("evd-schroders-schwyzer", "verified-fact", "high", "A head of client group for Europe was appointed with effect from 7 April 2026.", ["src-schroders-schwyzer"], "acc-schroders", "high", ["hyp-schroders-xborder"], "2026-02-11"),
  ev("evd-schroders-bergh", "verified-fact", "high", "A head of Europe product and manager solutions was appointed into a newly created role.", ["src-schroders-bergh"], "acc-schroders", "high", [], "2026-05-20"),
  ev("evd-schroders-relationship", "verified-fact", "high", "An active Fund Communication Solutions relationship exists in the Luxembourg entity.", ["src-crm-schroders", "src-contract-schroders-fcs"], "acc-schroders", "high", ["hyp-schroders-xborder"], "2026-09-04"),
  ev("evd-schroders-renewal", "verified-fact", "high", "The Fund Communication Solutions agreement reaches its renewal window in 120 days.", ["src-contract-schroders-fcs"], "acc-schroders", "high", ["hyp-schroders-xborder"], "2026-09-01"),
  ev("evd-schroders-provider", "still-to-learn", "low", "The registration and local-representation provider model for the new host markets is not known.", [], "acc-schroders", "low", ["hyp-schroders-xborder"], "2026-09-05", { needsReview: true }),

  ev("evd-nordea-priips", "verified-fact", "high", "A PRIIPs KID refresh obligation applies to the Luxembourg range for the 2027 cycle.", ["src-reg-nordea-priips"], "acc-nordea", "high", ["hyp-nordea-regulatory"], "2026-07-30"),
  ev("evd-nordea-andersen", "verified-fact", "high", "A head of private markets was appointed with effect from 13 April 2026.", ["src-nordea-andersen"], "acc-nordea", "high", [], "2026-03-18"),
  ev("evd-nordea-sponsor", "verified-fact", "high", "A fund operations sponsor is engaged and has confirmed the operational problem.", ["src-note-nordea-meeting", "src-crm-nordea-deal"], "acc-nordea", "high", ["opp-nordea-xborder"], "2026-07-24"),
  ev("evd-nordea-nextstep", "verified-fact", "high", "The mutual next step agreed in July passed without being rescheduled.", ["src-crm-nordea-deal"], "acc-nordea", "high", ["opp-nordea-xborder"], "2026-09-02"),
  ev("evd-nordea-buyer", "still-to-learn", "low", "No economic buyer, procurement route or target decision date is recorded.", [], "acc-nordea", "low", ["opp-nordea-xborder"], "2026-09-02", { needsReview: true }),
  ev("evd-nordea-flows", "system-suggestion", "medium", "Nordic channel flow data suggests intermediary demand is concentrating, which may raise document volumes.", ["src-mi-saleswatch-nordics"], "acc-nordea", "medium", ["hyp-nordea-regulatory"], "2026-08-31"),

  ev("evd-waystone-permissions", "verified-fact", "high", "The Luxembourg management company extended its permissions in July 2026.", ["src-reg-waystone-permissions"], "acc-waystone", "high", ["hyp-waystone-manco"], "2026-07-14"),
  ev("evd-waystone-consolidation", "verified-fact", "high", "Acquired management company businesses were integrated during 2026.", ["src-waystone-allfunds-manco"], "acc-waystone", "high", ["hyp-waystone-manco"], "2026-06-25"),
  ev("evd-waystone-serban", "verified-fact", "high", "A chief executive was appointed to the Luxembourg management company in July 2026.", ["src-waystone-serban"], "acc-waystone", "high", ["hyp-waystone-manco"], "2026-07-02"),
  ev("evd-waystone-buyer", "still-to-learn", "low", "Whether communications and reporting are bought at management company or group level is not known.", [], "acc-waystone", "low", ["hyp-waystone-manco"], "2026-09-05"),

  ev("evd-jh-hosts", "verified-fact", "high", "Host-market coverage widened across the Irish and Luxembourg ranges through August 2026.", ["src-funddata-jh-range"], "acc-janushenderson", "high", ["hyp-jh-renewal"], "2026-08-29"),
  ev("evd-jh-renewal", "verified-fact", "high", "The Fund Communication Solutions agreement reaches renewal in 76 days.", ["src-contract-jh-fcs"], "acc-janushenderson", "high", ["hyp-jh-renewal"], "2026-09-01"),
  ev("evd-jh-quiet", "verified-fact", "medium", "No client engagement has been recorded for eleven weeks.", ["src-note-jh-quiet"], "acc-janushenderson", "medium", ["hyp-jh-renewal"], "2026-09-01"),
  ev("evd-jh-owner", "still-to-learn", "low", "Who owns the renewal decision this cycle is not recorded.", [], "acc-janushenderson", "low", ["hyp-jh-renewal"], "2026-09-05", { needsReview: true }),

  ev("evd-allfunds-alonso", "verified-fact", "high", "A head of US was appointed with effect from 9 July 2026, from a product development background.", ["src-allfunds-alonso"], "acc-allfunds", "high", ["hyp-allfunds-intel"], "2026-06-30"),
  ev("evd-allfunds-flows", "verified-fact", "medium", "Platform flow records show a channel shift across Iberia and Italy in August 2026.", ["src-reg-allfunds-shift"], "acc-allfunds", "medium", ["hyp-allfunds-intel"], "2026-08-19"),
  ev("evd-allfunds-fundfile", "system-suggestion", "medium", "Product-preference data indicates the shift favours a narrower selected-fund universe.", ["src-mi-fundfile-iberia"], "acc-allfunds", "medium", ["hyp-allfunds-intel"], "2026-08-26"),
  ev("evd-allfunds-routes", "seller-hypothesis", "medium", "Several internal relationship routes are recorded, none of them tested.", ["src-crm-allfunds"], "acc-allfunds", "medium", ["hyp-allfunds-intel"], "2026-08-29"),
  ev("evd-allfunds-central", "still-to-learn", "low", "Whether distribution data and preference intelligence are bought centrally is not known.", [], "acc-allfunds", "low", ["hyp-allfunds-intel"], "2026-09-05"),

  /* Derived from other records rather than a source of its own — the reason the
     source-linked figure is not 100%, and correctly so. */
  ev("evd-schroders-derived-fit", "system-suggestion", "medium", "Cross-border distribution and Fund Communication Solutions are both mapped to multi-market expansion for this footprint.", [], "acc-schroders", "medium", ["hyp-schroders-xborder"], "2026-08-24"),
  ev("evd-waystone-derived-timing", "system-suggestion", "medium", "Consolidation of an acquired ManCo book normally forces a single operating standard within two quarters.", [], "acc-waystone", "medium", ["hyp-waystone-manco"], "2026-07-16"),

  /* A genuine conflict: two records disagree on the Spanish effective date. */
  ev("evd-schroders-es-alt", "verified-fact", "low", "A secondary record dates the Spanish notification to 14 August, one week earlier than the primary record.", ["src-mi-crossborder"], "acc-schroders", "low", ["hyp-schroders-xborder"], "2026-08-25", { needsReview: true, conflictsWithId: "evd-schroders-es" }),

  ev("evd-market-crossborder", "verified-fact", "high", "European cross-border registration volumes rose across H1 2026, concentrated in Germany and Italy.", ["src-mi-crossborder"], "acc-schroders", "high", [], "2026-08-05"),
];

function portfolioEvidence(): EvidenceRecord[] {
  return PORTFOLIO_SPECS.filter((s) => SITUATION_EVENT[s.situation]).map((s) => {
    const key = s.id.replace("acc-", "");
    return ev(
      `evd-${key}`,
      "verified-fact",
      "medium",
      `${SITUATION_EVENT[s.situation]!.headline} Recorded against ${s.entity}.`,
      ["src-mi-crossborder"],
      s.id,
      "medium",
      [`hyp-${key}`],
      "2026-08-22",
    );
  });
}

export const EVIDENCE: EvidenceRecord[] = [...HERO_EVIDENCE, ...portfolioEvidence()];
