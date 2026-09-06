/**
 * Broadridge Growth Intelligence — the shared commercial ontology.
 *
 * Every module (Growth, Accounts, Deals, Markets, People, Delivery, Knowledge
 * Graph, Global, Evidence, Tasks) is a view over these types. There is exactly
 * one place a fact lives, so a single signal — a UCITS cross-border marketing
 * event, say — reads identically wherever it surfaces.
 *
 * Two rules hold the model together:
 *
 *   1. Nothing commercial is asserted without a state. Every claim carries an
 *      `EvidenceState`, so the interface can always distinguish what is known
 *      from what is reasoned, guessed, or missing.
 *
 *   2. Identity and commercial state are separate concerns — see `Person`.
 *      Who someone is can be sourced. What they will do cannot.
 */

/* ── Trust ────────────────────────────────────────────────────────────────── */

/**
 * The four states the product must visibly distinguish. Uncertain commercial
 * inference is never presented as fact.
 */
export type EvidenceState =
  | "verified-fact" /* supported by a source record */
  | "system-suggestion" /* reasoned recommendation from evidence */
  | "seller-hypothesis" /* to validate with the client */
  | "still-to-learn"; /* a material information gap */

export type Confidence = "high" | "medium" | "low";

/** The common state language shared by every card, node and row (§4). */
export type StateMarker =
  | "quiet"
  | "new"
  | "attention"
  | "risk"
  | "progress"
  | "uncertain";

export type SourceKind =
  | "regulatory-record"
  | "fund-data"
  | "public-announcement"
  | "press"
  | "market-intelligence"
  | "crm"
  | "contract"
  | "internal-note";

export interface Source {
  id: string;
  kind: SourceKind;
  /** What the record is, in plain language. */
  label: string;
  publisher: string;
  published: string; /* ISO date */
  url?: string;
  /** Renders a lock icon; restricted internal content. */
  restricted?: boolean;
}

export interface EvidenceRecord {
  id: string;
  state: EvidenceState;
  confidence: Confidence;
  /** The claim itself, written as a single plain sentence. */
  statement: string;
  sourceIds: string[];
  /** What this evidence was matched to, and how sure the match is. */
  matchedToKind: ObjectKind;
  matchedToId: string;
  matchConfidence: Confidence;
  /** Hypothesis / opportunity ids that lean on this record. */
  usedBy: string[];
  needsReview?: boolean;
  conflictsWithId?: string;
  lastUpdated: string;
}

/* ── Geography ────────────────────────────────────────────────────────────── */

export type Region = "europe" | "north-america" | "apac" | "latam" | "memea";

export interface Market {
  id: string; /* "de" */
  name: string; /* "Germany" */
  /** ISO 3166-1 numeric, as a string — joins to world-atlas topology. */
  isoNumeric: string;
  isoAlpha3: string;
  region: Region;
  /** Principal fund hub, used for globe markers and arcs. */
  hub: string;
  lat: number;
  lon: number;
  /** Fund domicile markets (Luxembourg, Ireland) behave differently. */
  isDomicile?: boolean;
  regulator?: string;
}

export interface Territory {
  id: string;
  name: string;
  marketIds: string[];
  leadPersonId: string;
}

/* ── Organisations, entities and funds ────────────────────────────────────── */

export type AccountType =
  | "asset-manager"
  | "third-party-manco"
  | "platform-distributor"
  | "wealth-manager"
  | "insurer"
  | "bank-asset-manager";

export type AccountTier = "strategic" | "growth" | "core";

export type RelationshipState = "existing-client" | "prospect" | "former-client";

export type HealthState = "strong" | "stable" | "attention" | "risk";

export type CoverageState = "covered" | "thin" | "unassigned";

export interface Account {
  id: string;
  /** Trading name as a seller would say it. */
  name: string;
  legalName?: string;
  type: AccountType;
  tier: AccountTier;
  hqMarketId: string;
  relationship: RelationshipState;
  /** Broadridge account owner (internal, fictional). */
  ownerId: string;
  /** One sentence a seller could repeat verbatim in a stand-up. */
  story: string;
  /** The persistent three-part account header (§8). */
  whatChanged: string;
  whereWeStand: string;
  whatToDoNext: string;
  /** Material knowledge gaps, rendered under the "Still to learn" heading. */
  stillToLearn: string[];
  coverage: CoverageState;
  health: HealthState;
  marker: StateMarker;
  /** 1–5. Feeds the strategic-value component of the priority score. */
  strategicValue: 1 | 2 | 3 | 4 | 5;
  aum?: string;
  /** Hero accounts are authored at full depth; the rest fill the portfolio. */
  hero?: boolean;
}

export type EntityRole =
  | "ucits-manco"
  | "aifm"
  | "third-party-manco"
  | "distribution-entity"
  | "platform-operator"
  | "holding";

export interface LegalEntity {
  id: string;
  name: string;
  accountId: string;
  role: EntityRole;
  domicileMarketId: string;
  regulator?: string;
}

export type FundStructure =
  | "UCITS"
  | "AIF"
  | "SICAV"
  | "ICAV"
  | "FCP"
  | "Unit Trust";

export interface Fund {
  id: string;
  name: string;
  accountId: string;
  /** The ManCo / AIFM legal entity that runs it. */
  entityId: string;
  domicileMarketId: string;
  structure: FundStructure;
  assetClass: string;
  /** Markets the fund is registered for marketing into. */
  hostMarketIds: string[];
  shareClasses: number;
  /** New host markets added inside the signal window — drives "changed" state. */
  newHostMarketIds?: string[];
}

/* ── Broadridge capability ────────────────────────────────────────────────── */

export type ServiceGroup =
  | "distribution"
  | "communications"
  | "data"
  | "regulatory"
  | "intelligence"
  | "technology";

export interface BroadridgeService {
  id: string;
  name: string;
  short: string;
  group: ServiceGroup;
  /** What it does for a client, in one plain sentence. */
  description: string;
  /** Signal types that make this capability credibly relevant. */
  fitSignals: SignalType[];
}

export type ServiceLifecycle =
  | "onboarding"
  | "live"
  | "change"
  | "renewal"
  | "expansion";

export interface ServiceRelationship {
  id: string;
  accountId: string;
  serviceId: string;
  lifecycle: ServiceLifecycle;
  marketId?: string;
  /** Broadridge relationship owner (internal, fictional). */
  ownerId: string;
  since?: string;
  renewalInDays?: number;
  health: HealthState;
  /** Illustrative annual recurring value, GBP. */
  arr?: number;
  note?: string;
}

/* ── Signals ──────────────────────────────────────────────────────────────── */

/** The structured "market moments" of §7. */
export type SignalType =
  | "new-market-entry"
  | "fund-range-expansion"
  | "regulatory-deadline"
  | "new-manco-aifm-activity"
  | "fund-structure-change"
  | "distribution-shift"
  | "investor-comms-change"
  | "client-consolidation"
  | "service-provider-change"
  | "competitor-movement"
  | "renewal-plus-change"
  | "new-executive";

export interface MarketEvent {
  id: string;
  type: SignalType;
  /** Factual, past tense, no interpretation. */
  headline: string;
  detail: string;
  accountId: string;
  entityId?: string;
  fundId?: string;
  domicileMarketId?: string;
  hostMarketIds: string[];
  effectiveDate: string;
  detectedDate: string;
  state: EvidenceState;
  confidence: Confidence;
  evidenceIds: string[];
  /** Kept deliberately separate from `headline` — this part is inference. */
  commercialInterpretation: string;
  stillToLearn: string[];
  relevantServiceIds: string[];
  materiality: 1 | 2 | 3 | 4 | 5;
}

/* ── Commercial reasoning ─────────────────────────────────────────────────── */

/**
 * A commercial hypothesis is the product's central output: a reason to engage,
 * assembled from a verified trigger plus relationship context. It is explicitly
 * not a CRM opportunity, and the interface never lets the two be confused.
 */
export interface Hypothesis {
  id: string;
  accountId: string;
  title: string;
  triggerEventIds: string[];
  serviceIds: string[];
  whyItMayMatter: string;
  known: string[];
  stillToLearn: string[];
  confidence: Confidence;
  state: EvidenceState;
  recommendedActionId: string;
  /** Illustrative potential value, GBP. */
  potentialValue?: number;
  createdOn: string;
}

/** Controlled action vocabulary (§17). No free-text suggestions. */
export type ActionType =
  | "request-introduction"
  | "build-buyer-map"
  | "validate-operating-model"
  | "decision-process-reset"
  | "add-discovery-question"
  | "create-hypothesis"
  | "validate-provider"
  | "prepare-account-brief";

export interface RecommendedAction {
  id: string;
  type: ActionType;
  /** What to do. */
  what: string;
  /** Why it matters. */
  whyItMatters: string;
  evidenceIds: string[];
  /** What is unknown. */
  unknown: string[];
  ownerId: string;
  dueLabel: string;
  approvalNeeded: boolean;
}

/* ── People ───────────────────────────────────────────────────────────────── */

export type BuyingRole =
  | "executive-decision"
  | "business-ownership"
  | "operations-delivery"
  | "legal-compliance"
  | "procurement"
  | "broadridge-team";

/**
 * Who someone is. Sourceable, and therefore allowed to be stated as fact —
 * but only when `verified` is true and a source is attached.
 */
export interface PersonIdentity {
  name: string;
  title: string;
  org: string;
  verified: boolean;
  sourceId?: string;
  /** e.g. "Role taken from the firm's public appointment announcement." */
  sourceNote?: string;
}

export type EngagementState =
  | "no-relationship-recorded"
  | "known-not-engaged"
  | "engaged"
  | "stale";

/**
 * What we believe about someone commercially. None of this is ever asserted as
 * fact about a real individual: it renders through `roleState` and
 * `roleConfidence`, and defaults to "still to learn".
 */
export interface PersonCommercialState {
  likelyRole: BuyingRole;
  roleConfidence: Confidence;
  roleState: EvidenceState;
  engagement: EngagementState;
  lastContact?: string;
  /** Best route to them, written as an instruction to a named colleague. */
  bestRoute?: string;
  routeViaPersonId?: string;
  /** The validation question this person represents. */
  whatWeNeed: string;
  /** 1–5. Decision relevance, not job seniority — drives node size. */
  decisionRelevance: 1 | 2 | 3 | 4 | 5;
  /** A confirmed positive commitment. Internal people only. */
  committed?: boolean;
}

export interface Person {
  id: string;
  accountId?: string;
  /** Broadridge staff are fictional; client-side people are sourced or slotted. */
  internal: boolean;
  identity: PersonIdentity;
  commercial: PersonCommercialState;
}

/* ── Deals ────────────────────────────────────────────────────────────────── */

/** The six-stage timeline of §9. CRM stage is metadata, never the main visual. */
export type DealStageId =
  | "change"
  | "problem"
  | "people"
  | "solution"
  | "decision"
  | "outcome";

export type DealState = "healthy" | "watch" | "intervene";

/** The `Main gap` vocabulary — the most important column in the deal list. */
export type GapId =
  | "economic-buyer"
  | "mutual-next-step"
  | "provider-model"
  | "legal-compliance"
  | "value-case"
  | "close-date-slip"
  | "procurement-route"
  | "decision-date";

/** The seven inputs behind deal health. Never collapsed into one number alone. */
export type HealthComponentId =
  | "momentum"
  | "buying-group"
  | "next-step"
  | "value-case"
  | "decision-timing"
  | "competitive"
  | "data-completeness";

export interface Opportunity {
  id: string;
  name: string;
  accountId: string;
  serviceIds: string[];
  /** GBP. */
  value: number;
  recurring: boolean;
  stage: DealStageId;
  /** Shown as metadata only. */
  crmStage: string;
  ownerId: string;
  closeDate: string;
  closeDateMoves: number;
  lastBuyerActivity: string;
  lastBuyerActivityDays: number;
  nextMutualCommitment?: string;
  nextCommitmentDate?: string;
  nextCommitmentExpired?: boolean;
  mainGap: GapId;
  gaps: GapId[];
  /** 0–1 per component. `dealState()` derives the headline from these. */
  health: Record<HealthComponentId, number>;
  /** Plain-English health statement — what is confirmed, what is not. */
  statement: string;
  bestNextAction: string;
  evidenceIds: string[];
  buyingGroupPersonIds: string[];
  marker: StateMarker;
}

/* ── Work ─────────────────────────────────────────────────────────────────── */

export type TaskStatus = "mine" | "team" | "waiting" | "completed";

export interface Task {
  id: string;
  title: string;
  /** Every task is bound to a real object. No orphan to-dos. */
  linkedToKind: ObjectKind;
  linkedToId: string;
  accountId: string;
  whyThisMatters: string;
  ownerId: string;
  due: string;
  dueLabel: string;
  suggestedRoute?: string;
  status: TaskStatus;
  blockedBy?: string;
  approvalNeeded?: boolean;
  /** Audit line (§18). */
  createdBy: string;
  approvedBy?: string;
  completedBy?: string;
}

/* ── Object identity ──────────────────────────────────────────────────────── */

/** Every addressable thing in the ontology. Used by evidence, tasks and search. */
export type ObjectKind =
  | "account"
  | "entity"
  | "fund"
  | "market"
  | "person"
  | "service"
  | "service-relationship"
  | "opportunity"
  | "event"
  | "hypothesis"
  | "evidence"
  | "task"
  | "territory";

export interface ObjectRef {
  kind: ObjectKind;
  id: string;
  label: string;
  sublabel?: string;
}
