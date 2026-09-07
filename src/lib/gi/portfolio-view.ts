/**
 * The portfolio, as the Accounts grid and the fund stories read it.
 *
 * `gallery.ts` answers "what shape is this" for the eight other panels. This
 * file exists separately because the Accounts panel asks something none of the
 * others do: it wants a *continuous* reading of how every account is doing, not
 * a state marker, and it wants the fund-level facts underneath that reading so
 * that clicking a cell lands on a sentence rather than on a colour.
 *
 * Nothing here is a literal. Health is composed from the account's own recorded
 * state, its coverage, its live service relationships and its renewal windows,
 * and the composition is documented at the point it happens — because a single
 * number standing for "how is this client" is exactly the kind of figure that
 * has to be explainable or withdrawn.
 */
import {
  allAccounts,
  daysFromToday,
  fundsForAccount,
  hypothesesForAccount,
  marketsForAccount,
  opportunitiesForAccount,
  serviceRelationshipsForAccount,
  getAccount,
  allFunds,
  allPeople,
} from "./select";
import { healthWord } from "./spectrum";
import { MARKET_BY_ID } from "./taxonomy";
import type { HealthState } from "./types";

/* ── Health, as a number ──────────────────────────────────────────────────── */

/**
 * The account's own recorded health is the anchor. Everything after it is a
 * correction of a few points, never a re-rating: the seed says what state this
 * relationship is in and this function is not entitled to overrule it.
 */
const ANCHOR: Record<HealthState, number> = {
  risk: 0.14,
  attention: 0.44,
  stable: 0.78,
  strong: 0.94,
};

/** Same anchor for a service relationship, so the two can be averaged. */
const SERVICE_ANCHOR: Record<HealthState, number> = ANCHOR;

export interface AccountHealth {
  /** 0–1, on the red-to-green spectrum. */
  value: number;
  word: string;
  /** The corrections that were applied, in the order they were applied. */
  reasons: string[];
}

/**
 * Composed health for one account.
 *
 * The corrections are all small and all named:
 *
 *   · a service relationship in trouble pulls the account toward its own state,
 *     because an account is not healthier than what Broadridge is delivering
 *   · thin or unassigned coverage is a penalty, because we cannot claim an
 *     account is healthy when nobody is close enough to know
 *   · a renewal inside 90 days on an account already needing attention is the
 *     combination that actually goes wrong, so it is penalised once, here,
 *     rather than being left for a human to spot
 */
export function accountHealth(accountId: string): AccountHealth {
  const account = getAccount(accountId);
  if (!account) return { value: 0.5, word: healthWord(0.5), reasons: [] };

  let value = ANCHOR[account.health];
  const reasons: string[] = [`Recorded as ${account.health}`];

  const services = serviceRelationshipsForAccount(accountId);
  if (services.length) {
    const mean =
      services.reduce((sum, r) => sum + SERVICE_ANCHOR[r.health], 0) / services.length;
    /* Weighted a third, so delivery moves the reading without replacing it. */
    value = value * 0.67 + mean * 0.33;
    const poor = services.filter((r) => r.health === "risk" || r.health === "attention").length;
    if (poor) reasons.push(`${poor} of ${services.length} services need support`);
  }

  if (account.coverage === "thin") {
    value -= 0.06;
    reasons.push("Coverage is thin");
  } else if (account.coverage === "unassigned") {
    value -= 0.12;
    reasons.push("No owner assigned");
  }

  const soon = services.filter(
    (r) => r.renewalInDays !== undefined && r.renewalInDays <= 90,
  ).length;
  if (soon && (account.health === "attention" || account.health === "risk")) {
    value -= 0.07;
    reasons.push(`${soon} renewing inside 90 days while unsettled`);
  }

  if (account.marker === "risk") {
    value -= 0.06;
    reasons.push("Carries a material risk marker");
  }

  const clamped = Math.max(0.04, Math.min(1, value));
  return { value: clamped, word: healthWord(clamped), reasons };
}

/* ── The grid ─────────────────────────────────────────────────────────────── */

export interface AccountCell {
  id: string;
  label: string;
  href: string;
  /** Treemap area. The number of markets this group's funds actually touch. */
  value: number;
  health: number;
  healthWord: string;
  /** An opportunity has been spotted here. Carried as light, not as colour. */
  opportunity: boolean;
  /** What the opportunity is, in a few words. Empty when there is none. */
  opportunityNote: string;
  client: boolean;
  tier: string;
  aum: string;
  funds: number;
  shareClasses: number;
  markets: number;
  /** Host markets registered recently — the cross-border story, per account. */
  newMarkets: string[];
  whatChanged: string;
}

/**
 * Every account, sized by footprint, coloured by health, flagged for
 * opportunity.
 *
 * Footprint is used for size rather than a revenue figure because revenue is
 * not in the ontology for prospects, and a grid where half the cells are zero
 * is not a picture of a portfolio.
 *
 * "Opportunity spotted" is a real disjunction over the ontology, not a mood: an
 * open commercial hypothesis, an open opportunity record, or a fund range that
 * has picked up new host-market registrations. Those are the three ways this
 * product is allowed to say there is something here.
 */
export function portfolioGrid(): AccountCell[] {
  return allAccounts()
    .map((account) => {
      const funds = fundsForAccount(account.id);
      const markets = marketsForAccount(account.id);
      const hypotheses = hypothesesForAccount(account.id);
      const deals = opportunitiesForAccount(account.id);
      const newMarkets = [
        ...new Set(funds.flatMap((f) => f.newHostMarketIds ?? [])),
      ].map((id) => MARKET_BY_ID[id]?.name ?? id);

      const health = accountHealth(account.id);

      const opportunityNote = hypotheses[0]
        ? hypotheses[0].title
        : deals[0]
          ? deals[0].name
          : newMarkets.length
            ? `New registrations in ${newMarkets.slice(0, 3).join(", ")}`
            : "";

      return {
        id: account.id,
        label: account.name,
        href: `/accounts/${account.id}`,
        value: Math.max(markets.length, 1),
        health: health.value,
        healthWord: health.word,
        opportunity: Boolean(opportunityNote),
        opportunityNote,
        client: account.relationship === "existing-client",
        tier: account.tier,
        aum: account.aum ?? "—",
        funds: funds.length,
        shareClasses: funds.reduce((sum, f) => sum + f.shareClasses, 0),
        markets: markets.length,
        newMarkets,
        whatChanged: account.whatChanged,
      };
    })
    .sort((a, b) => b.value - a.value);
}

/** Headline counts under the grid. Every one of them is a length or a sum. */
export function portfolioTotals() {
  const cells = portfolioGrid();
  return {
    accounts: cells.length,
    clients: cells.filter((c) => c.client).length,
    opportunities: cells.filter((c) => c.opportunity).length,
    problems: cells.filter((c) => c.health < 0.5).length,
    healthy: cells.filter((c) => c.health >= 0.72).length,
    shareClasses: cells.reduce((sum, c) => sum + c.shareClasses, 0),
    funds: cells.reduce((sum, c) => sum + c.funds, 0),
  };
}

/* ── The funds themselves ─────────────────────────────────────────────────── */

export interface FundStory {
  id: string;
  fund: string;
  account: string;
  accountId: string;
  href: string;
  structure: string;
  assetClass: string;
  domicile: string;
  shareClasses: number;
  hosts: number;
  /** Market names, not codes — a seller says "Germany", never "de". */
  newHosts: string[];
  /** One sentence. The fund's own facts, in the order a seller would say them. */
  line: string;
}

const marketName = (id: string) => MARKET_BY_ID[id]?.name ?? id.toUpperCase();

/**
 * Fund ranges that have moved, newest footprint first.
 *
 * The ranking is by how much new ground the range has taken — new host markets
 * first, then the size of the range behind it — because a fund newly registered
 * in three countries is a reason to call and a large static range is not.
 */
export function fundStories(limit = 6): FundStory[] {
  return allFunds()
    .map((fund) => {
      const account = getAccount(fund.accountId);
      const newHosts = (fund.newHostMarketIds ?? []).map(marketName);
      const line = newHosts.length
        ? `Newly registered in ${newHosts.join(", ")} — ${fund.shareClasses} share classes across ${fund.hostMarketIds.length} host markets.`
        : `${fund.shareClasses} share classes across ${fund.hostMarketIds.length} host markets, domiciled in ${marketName(fund.domicileMarketId)}.`;

      return {
        id: fund.id,
        fund: fund.name,
        account: account?.name ?? fund.accountId,
        accountId: fund.accountId,
        href: `/knowledge-graph?focus=${fund.id}`,
        structure: fund.structure,
        assetClass: fund.assetClass,
        domicile: marketName(fund.domicileMarketId),
        shareClasses: fund.shareClasses,
        hosts: fund.hostMarketIds.length,
        newHosts,
        line,
      };
    })
    .sort(
      (a, b) => b.newHosts.length - a.newHosts.length || b.shareClasses - a.shareClasses,
    )
    .slice(0, limit);
}

/** The cross-border picture in four figures, all counted from the fund records. */
export function crossBorderFootprint() {
  const funds = allFunds();
  const registrations = funds.reduce((sum, f) => sum + f.hostMarketIds.length, 0);
  const fresh = funds.reduce((sum, f) => sum + (f.newHostMarketIds?.length ?? 0), 0);
  const domiciles = new Set(funds.map((f) => f.domicileMarketId)).size;
  const shareClasses = funds.reduce((sum, f) => sum + f.shareClasses, 0);
  return { funds: funds.length, registrations, fresh, domiciles, shareClasses };
}

/**
 * The accounts whose ranges took new ground, with the days since it was seen.
 * Used where the panel needs a reason with a date on it rather than a total.
 */
export function expandingAccounts(limit = 4) {
  return portfolioGrid()
    .filter((c) => c.newMarkets.length > 0)
    .sort((a, b) => b.newMarkets.length - a.newMarkets.length)
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      label: c.label,
      href: c.href,
      markets: c.newMarkets,
      note: `${c.newMarkets.length} new ${c.newMarkets.length === 1 ? "market" : "markets"}`,
    }));
}

/** Days since a date, as a short phrase. Never a fabricated one. */
export function daysAgo(iso: string): string {
  const days = Math.abs(daysFromToday(iso));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.round(days / 30)}mo ago`;
}

/* ── The people, as named individuals ─────────────────────────────────────── */

export interface PersonRow {
  id: string;
  href: string;
  name: string;
  title: string;
  org: string;
  /** Whether a relationship has actually been recorded — usually it has not. */
  known: boolean;
  /** The validation question this person represents. Never a claim about them. */
  need: string;
}

/**
 * The external people who matter most, by decision relevance.
 *
 * Names and titles are the sourced part of the record; `need` is what we still
 * have to find out, which is the only thing the product is entitled to say
 * about a real person's commercial behaviour. The row therefore reads
 * "who they are · what we still need", never "what they will do".
 */
export function keyPeople(limit = 4): PersonRow[] {
  return allPeople()
    .filter((p) => !p.internal)
    .sort((a, b) => b.commercial.decisionRelevance - a.commercial.decisionRelevance)
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      href: `/people?person=${p.id}`,
      name: p.identity.name,
      title: p.identity.title,
      org: p.identity.org,
      known: p.commercial.engagement !== "no-relationship-recorded",
      need: p.commercial.whatWeNeed,
    }));
}
