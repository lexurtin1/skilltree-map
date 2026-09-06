/**
 * Priority scoring.
 *
 * The formula is deliberately simple and deliberately visible. A seller who
 * cannot see why an account was ranked will not trust the ranking, so every
 * component returns its own score, its own weight and its own one-line reason —
 * and the "Explain this recommendation" drawer renders straight off this
 * structure rather than re-deriving anything.
 *
 *   Priority = 30% product fit
 *            + 25% trigger strength
 *            + 20% relationship access
 *            + 15% commercial timing
 *            + 10% strategic value
 *            −      uncertainty penalty
 */
import {
  allHypotheses,
  daysFromToday,
  eventsForAccount,
  fundsForAccount,
  getAccount,
  hypothesesForAccount,
  peopleForAccount,
  serviceRelationshipsForAccount,
} from "./select";
import { CONFIDENCE, SERVICE_BY_ID, SIGNAL_TYPES } from "./taxonomy";
import type { Confidence, Hypothesis } from "./types";

export type ComponentId =
  | "product-fit"
  | "trigger-strength"
  | "relationship-access"
  | "commercial-timing"
  | "strategic-value";

export interface ScoreComponent {
  id: ComponentId;
  label: string;
  /** 0–1 before weighting. */
  score: number;
  weight: number;
  /** What drove this component, in one plain sentence. */
  reason: string;
}

export interface PriorityScore {
  /** 0–100, after the uncertainty penalty. */
  total: number;
  band: "high" | "medium" | "low";
  confidence: Confidence;
  components: ScoreComponent[];
  /** Points deducted, 0–100 scale. */
  uncertaintyPenalty: number;
  /** What the penalty is for. */
  unknowns: string[];
}

const WEIGHTS: Record<ComponentId, number> = {
  "product-fit": 0.3,
  "trigger-strength": 0.25,
  "relationship-access": 0.2,
  "commercial-timing": 0.15,
  "strategic-value": 0.1,
};

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/**
 * Product fit — does the account's fund footprint, market change and client
 * type actually match the capabilities the hypothesis names?
 */
function productFit(accountId: string, hypothesis?: Hypothesis): ScoreComponent {
  const funds = fundsForAccount(accountId);
  const events = eventsForAccount(accountId);
  const serviceIds = hypothesis?.serviceIds ?? [];

  // How many of the named services are supported by a signal we have actually seen.
  const seenTypes = new Set(events.map((e) => e.type));
  let matched = 0;
  for (const id of serviceIds) {
    const service = SERVICE_BY_ID[id];
    if (service?.fitSignals.some((t) => seenTypes.has(t))) matched += 1;
  }
  const coverage = serviceIds.length ? matched / serviceIds.length : 0;

  // Footprint breadth — a range in many host markets carries more of this work.
  const hosts = new Set(funds.flatMap((f) => f.hostMarketIds));
  const breadth = clamp(hosts.size / 8);

  const score = clamp(coverage * 0.7 + breadth * 0.3);
  return {
    id: "product-fit",
    label: "Product fit",
    score,
    weight: WEIGHTS["product-fit"],
    reason: serviceIds.length
      ? `${matched} of ${serviceIds.length} named capabilities are supported by a signal type we have observed, across ${hosts.size} host markets.`
      : "No capability has been mapped to this account yet.",
  };
}

/** Trigger strength — recency, source reliability, materiality, account match. */
function triggerStrength(accountId: string): ScoreComponent {
  const events = eventsForAccount(accountId);
  if (!events.length) {
    return {
      id: "trigger-strength",
      label: "Trigger strength",
      score: 0,
      weight: WEIGHTS["trigger-strength"],
      reason: "No verified change has been recorded against this account.",
    };
  }

  let best = 0;
  let bestEvent = events[0];
  for (const event of events) {
    const ageDays = Math.abs(daysFromToday(event.detectedDate));
    const recency = clamp(1 - ageDays / 120);
    const materiality = event.materiality / 5;
    const reliability = CONFIDENCE[event.confidence].weight;
    const verified = event.state === "verified-fact" ? 1 : 0.6;
    const value = recency * 0.3 + materiality * 0.35 + reliability * 0.2 + verified * 0.15;
    if (value > best) {
      best = value;
      bestEvent = event;
    }
  }

  const age = Math.abs(daysFromToday(bestEvent.detectedDate));
  return {
    id: "trigger-strength",
    label: "Trigger strength",
    score: clamp(best),
    weight: WEIGHTS["trigger-strength"],
    reason: `Strongest signal is ${SIGNAL_TYPES[bestEvent.type].label.toLowerCase()}, detected ${age} days ago at materiality ${bestEvent.materiality} of 5.`,
  };
}

/** Relationship access — service owners, account owners, routes we can use. */
function relationshipAccess(accountId: string): ScoreComponent {
  const account = getAccount(accountId);
  const relationships = serviceRelationshipsForAccount(accountId);
  const people = peopleForAccount(accountId);

  const hasService = relationships.length > 0 ? 0.45 : 0;
  const covered = account?.coverage === "covered" ? 0.2 : account?.coverage === "thin" ? 0.08 : 0;
  const routes = people.filter((p) => !p.internal && p.commercial.routeViaPersonId).length;
  const routeScore = clamp(routes / 2) * 0.2;
  const engaged = people.filter((p) => !p.internal && p.commercial.engagement === "engaged").length;
  const engagedScore = clamp(engaged / 2) * 0.15;

  const score = clamp(hasService + covered + routeScore + engagedScore);
  const parts: string[] = [];
  if (relationships.length) parts.push(`${relationships.length} existing service relationship${relationships.length > 1 ? "s" : ""}`);
  if (routes) parts.push(`${routes} identified introduction route${routes > 1 ? "s" : ""}`);
  if (engaged) parts.push(`${engaged} engaged contact${engaged > 1 ? "s" : ""}`);

  return {
    id: "relationship-access",
    label: "Relationship access",
    score,
    weight: WEIGHTS["relationship-access"],
    reason: parts.length
      ? `${parts.join(", ")}. Account coverage is ${account?.coverage ?? "unassigned"}.`
      : "No service relationship, engaged contact or introduction route is recorded.",
  };
}

/** Commercial timing — renewal windows, dated obligations, deal stage. */
function commercialTiming(accountId: string): ScoreComponent {
  const relationships = serviceRelationshipsForAccount(accountId);
  const events = eventsForAccount(accountId);

  const renewals = relationships
    .map((r) => r.renewalInDays)
    .filter((d): d is number => d !== undefined);
  const soonest = renewals.length ? Math.min(...renewals) : undefined;
  const renewalScore = soonest === undefined ? 0 : clamp(1 - soonest / 240);

  const dated = events.filter((e) => daysFromToday(e.effectiveDate) > 0);
  const datedScore = dated.length ? 0.4 : 0;

  const score = clamp(renewalScore * 0.7 + datedScore * 0.3);
  return {
    id: "commercial-timing",
    label: "Commercial timing",
    score,
    weight: WEIGHTS["commercial-timing"],
    reason:
      soonest !== undefined
        ? `Renewal window in ${soonest} days${dated.length ? `, with ${dated.length} dated event${dated.length > 1 ? "s" : ""} ahead.` : "."}`
        : dated.length
          ? `${dated.length} dated event${dated.length > 1 ? "s" : ""} ahead, no renewal window in this cycle.`
          : "No renewal window or dated obligation in this cycle.",
  };
}

/** Strategic value — account tier, opportunity value, Broadridge priorities. */
function strategicValue(accountId: string, hypothesis?: Hypothesis): ScoreComponent {
  const account = getAccount(accountId);
  const tier = (account?.strategicValue ?? 1) / 5;
  const value = clamp((hypothesis?.potentialValue ?? 0) / 1_500_000);
  const score = clamp(tier * 0.65 + value * 0.35);
  return {
    id: "strategic-value",
    label: "Strategic value",
    score,
    weight: WEIGHTS["strategic-value"],
    reason: `${account?.tier ?? "core"} tier at strategic value ${account?.strategicValue ?? 1} of 5${
      hypothesis?.potentialValue ? `, indicative value £${Math.round(hypothesis.potentialValue / 1000)}k.` : "."
    }`,
  };
}

/**
 * Uncertainty penalty. Incomplete entity resolution, an unknown provider model
 * or an unowned decision all reduce the score — a high-scoring account we
 * cannot act on is worse than an honest medium one.
 */
function uncertainty(accountId: string, hypothesis?: Hypothesis): {
  penalty: number;
  unknowns: string[];
} {
  const account = getAccount(accountId);
  const unknowns = [
    ...(hypothesis?.stillToLearn ?? []),
    ...(hypothesis ? [] : account?.stillToLearn ?? []),
  ];
  const confidencePenalty = hypothesis
    ? (1 - CONFIDENCE[hypothesis.confidence].weight) * 12
    : 8;
  const gapPenalty = Math.min(unknowns.length * 2.5, 12);
  return { penalty: Math.round(confidencePenalty + gapPenalty), unknowns };
}

/** Score an account, optionally in the context of one of its hypotheses. */
export function priorityFor(accountId: string, hypothesis?: Hypothesis): PriorityScore {
  const hyp = hypothesis ?? hypothesesForAccount(accountId)[0];
  const components = [
    productFit(accountId, hyp),
    triggerStrength(accountId),
    relationshipAccess(accountId),
    commercialTiming(accountId),
    strategicValue(accountId, hyp),
  ];

  const weighted = components.reduce((sum, c) => sum + c.score * c.weight, 0) * 100;
  const { penalty, unknowns } = uncertainty(accountId, hyp);
  const total = Math.max(0, Math.round(weighted - penalty));

  return {
    total,
    band: total >= 60 ? "high" : total >= 35 ? "medium" : "low",
    confidence: hyp?.confidence ?? "low",
    components,
    uncertaintyPenalty: penalty,
    unknowns,
  };
}

/** Accounts ranked by priority — the order the Growth module opens in. */
export function rankedOpportunities(
  limit?: number,
): Array<{ hypothesis: Hypothesis; score: PriorityScore }> {
  const scored = allHypotheses()
    .map((hypothesis) => ({
      hypothesis,
      score: priorityFor(hypothesis.accountId, hypothesis),
    }))
    .sort((a, b) => b.score.total - a.score.total);
  return limit === undefined ? scored : scored.slice(0, limit);
}
