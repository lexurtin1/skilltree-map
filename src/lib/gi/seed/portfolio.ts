/**
 * The wider account portfolio.
 *
 * The five hero accounts are authored line by line because the product is
 * demonstrated through them. The remaining groups are described by a compact
 * spec — the handful of facts that actually distinguish them — and the coherent
 * prose, health, state marker and fund footprint are composed from that spec.
 *
 * That is deliberate. Hand-writing forty account narratives guarantees drift;
 * composing them guarantees that an account presenting as "expanding" carries
 * expansion events, expansion services and expansion language everywhere it
 * appears. Depth stays with the heroes; consistency covers the portfolio.
 *
 * Illustrative prototype data. Organisation names and domiciles are public
 * facts; all commercial state is illustrative.
 */
import type {
  Account,
  AccountType,
  Fund,
  LegalEntity,
  RelationshipState,
  StateMarker,
} from "../types";
import type { HealthState } from "../types";

/** The commercial situation an account is in. Drives everything derived. */
export type Situation =
  | "expanding"
  | "renewing"
  | "regulatory"
  | "consolidating"
  | "platform-shift"
  | "new-exec"
  | "quiet"
  | "greenfield";

interface Spec {
  id: string;
  name: string;
  type: AccountType;
  hq: string;
  /** Fund domicile the group primarily uses. */
  domicile: string;
  rel: RelationshipState;
  owner: string;
  strategicValue: 1 | 2 | 3 | 4 | 5;
  aum: string;
  situation: Situation;
  /** Host markets the range is registered in. */
  hosts: string[];
  /** Host markets added recently — only meaningful when expanding. */
  newHosts?: string[];
  entity: string;
  fund: string;
  assetClass: string;
  shareClasses: number;
}

const S = (
  id: string,
  name: string,
  type: AccountType,
  hq: string,
  domicile: string,
  rel: RelationshipState,
  owner: string,
  strategicValue: 1 | 2 | 3 | 4 | 5,
  aum: string,
  situation: Situation,
  hosts: string[],
  entity: string,
  fund: string,
  assetClass: string,
  shareClasses: number,
  newHosts?: string[],
): Spec => ({
  id,
  name,
  type,
  hq,
  domicile,
  rel,
  owner,
  strategicValue,
  aum,
  situation,
  hosts,
  newHosts,
  entity,
  fund,
  assetClass,
  shareClasses,
});

const SPECS: Spec[] = [
  S("acc-amundi", "Amundi", "asset-manager", "fr", "lu", "existing-client", "bp-marta-oliveira", 5, "€2.2tn", "consolidating", ["fr", "it", "de", "es", "at", "nl", "ch", "gb"], "Amundi Luxembourg S.A.", "Amundi Funds", "Multi-asset", 64),
  S("acc-dws", "DWS", "asset-manager", "de", "lu", "existing-client", "bp-david-lange", 5, "€1tn", "regulatory", ["de", "at", "ch", "it", "es", "nl", "lu"], "DWS Investment S.A.", "DWS Invest", "Multi-asset", 58, undefined),
  S("acc-blackrock", "BlackRock", "asset-manager", "us", "ie", "existing-client", "bp-lucy-chen", 5, "$11.5tn", "quiet", ["gb", "de", "it", "es", "ch", "nl", "se", "sg"], "BlackRock Asset Management Ireland Limited", "BlackRock Global Funds", "Global equity", 72),
  S("acc-fidelityintl", "Fidelity International", "asset-manager", "gb", "lu", "existing-client", "bp-james-howard", 5, "$900bn", "renewing", ["gb", "de", "it", "es", "ch", "at", "nl"], "FIL Investment Management (Luxembourg) S.A.", "Fidelity Funds", "Global equity", 55),
  S("acc-lgim", "Legal & General Investment Management", "asset-manager", "gb", "ie", "existing-client", "bp-james-howard", 4, "£1.1tn", "expanding", ["gb", "de", "nl", "it"], "LGIM Managers (Europe) Limited", "L&G ICAV", "Index and fixed income", 31, ["de", "it"]),
  S("acc-abrdn", "abrdn", "asset-manager", "gb", "lu", "existing-client", "bp-claire-dubois", 4, "£500bn", "renewing", ["gb", "de", "ch", "it", "es"], "abrdn Investments Luxembourg S.A.", "abrdn SICAV I", "Global equity", 40),
  S("acc-mandg", "M&G Investments", "asset-manager", "gb", "lu", "existing-client", "bp-james-howard", 4, "£310bn", "expanding", ["gb", "de", "it", "es", "at", "ch"], "M&G Luxembourg S.A.", "M&G (Lux) Investment Funds 1", "Fixed income", 44, ["at"]),
  S("acc-bailliegifford", "Baillie Gifford", "asset-manager", "gb", "ie", "prospect", "bp-marta-oliveira", 3, "£220bn", "greenfield", ["gb", "de", "ch", "nl"], "Baillie Gifford Investment Management (Europe) Limited", "Baillie Gifford Worldwide Funds", "Growth equity", 22),
  S("acc-jupiter", "Jupiter Asset Management", "asset-manager", "gb", "lu", "prospect", "bp-marta-oliveira", 3, "£45bn", "new-exec", ["gb", "de", "it", "es", "ch"], "Jupiter Asset Management International S.A.", "Jupiter Global Fund", "Global equity", 26),
  S("acc-ninetyone", "Ninety One", "asset-manager", "gb", "lu", "prospect", "bp-marta-oliveira", 3, "£120bn", "expanding", ["gb", "de", "ch", "it", "za"], "Ninety One Luxembourg S.A.", "Ninety One Global Strategy Fund", "Emerging markets", 28, ["it"]),
  S("acc-columbiathreadneedle", "Columbia Threadneedle Investments", "asset-manager", "gb", "lu", "existing-client", "bp-claire-dubois", 4, "$650bn", "consolidating", ["gb", "de", "it", "es", "ch", "nl", "at"], "Threadneedle Management Luxembourg S.A.", "Threadneedle (Lux)", "Multi-asset", 47),
  S("acc-royallondon", "Royal London Asset Management", "asset-manager", "gb", "ie", "prospect", "bp-james-howard", 2, "£170bn", "greenfield", ["gb", "ie"], "RLAM Ireland Limited", "Royal London Funds ICAV", "Sterling credit", 14),
  S("acc-invesco", "Invesco", "asset-manager", "gb", "lu", "existing-client", "bp-lucy-chen", 4, "$1.8tn", "regulatory", ["gb", "de", "it", "es", "ch", "at", "nl", "se"], "Invesco Management S.A.", "Invesco Funds", "Multi-asset", 61),
  S("acc-franklintempleton", "Franklin Templeton", "asset-manager", "us", "lu", "existing-client", "bp-lucy-chen", 4, "$1.6tn", "expanding", ["de", "it", "es", "ch", "gb", "at", "pl"], "Franklin Templeton International Services S.à r.l.", "Franklin Templeton Investment Funds", "Global multi-asset", 66, ["pl"]),
  S("acc-pimco", "PIMCO", "asset-manager", "de", "ie", "existing-client", "bp-david-lange", 5, "$2tn", "regulatory", ["de", "it", "es", "ch", "gb", "nl", "at"], "PIMCO Global Advisors (Ireland) Limited", "PIMCO GIS Funds", "Fixed income", 70),
  S("acc-axaim", "AXA Investment Managers", "asset-manager", "fr", "lu", "existing-client", "bp-marta-oliveira", 4, "€880bn", "consolidating", ["fr", "de", "it", "es", "be", "ch", "gb"], "AXA Funds Management S.A.", "AXA World Funds", "Multi-asset", 52),
  S("acc-bnpparibasam", "BNP Paribas Asset Management", "bank-asset-manager", "fr", "lu", "existing-client", "bp-marta-oliveira", 4, "€600bn", "expanding", ["fr", "be", "it", "de", "es", "nl", "pt"], "BNP PARIBAS ASSET MANAGEMENT Luxembourg", "BNP Paribas Funds", "Multi-asset", 59, ["pt"]),
  S("acc-natixis", "Natixis Investment Managers", "asset-manager", "fr", "lu", "prospect", "bp-marta-oliveira", 4, "€1.2tn", "new-exec", ["fr", "it", "de", "es", "ch", "gb"], "Natixis Investment Managers S.A.", "Natixis International Funds", "Multi-affiliate", 43),
  S("acc-carmignac", "Carmignac", "asset-manager", "fr", "lu", "prospect", "bp-marta-oliveira", 3, "€34bn", "platform-shift", ["fr", "it", "de", "es", "ch", "be"], "Carmignac Gestion Luxembourg", "Carmignac Portfolio", "Multi-asset", 30),
  S("acc-candriam", "Candriam", "asset-manager", "be", "lu", "existing-client", "bp-marta-oliveira", 3, "€150bn", "renewing", ["be", "fr", "it", "de", "es", "nl"], "Candriam Luxembourg", "Candriam Sustainable", "Sustainable multi-asset", 36),
  S("acc-robeco", "Robeco", "asset-manager", "nl", "lu", "existing-client", "bp-lucy-chen", 4, "€200bn", "expanding", ["nl", "de", "ch", "it", "es", "fr", "be"], "Robeco Luxembourg S.A.", "Robeco Capital Growth Funds", "Sustainable equity", 38, ["es"]),
  S("acc-gsam", "Goldman Sachs Asset Management", "bank-asset-manager", "us", "lu", "existing-client", "bp-lucy-chen", 5, "$3tn", "consolidating", ["de", "it", "es", "ch", "gb", "nl", "se"], "Goldman Sachs Asset Management Fund Services Limited", "Goldman Sachs Funds SICAV", "Multi-asset", 63),
  S("acc-unioninvestment", "Union Investment", "bank-asset-manager", "de", "lu", "prospect", "bp-david-lange", 4, "€480bn", "regulatory", ["de", "at", "lu"], "Union Investment Luxembourg S.A.", "UniInstitutional Funds", "Multi-asset", 41),
  S("acc-deka", "Deka Investment", "bank-asset-manager", "de", "lu", "prospect", "bp-david-lange", 4, "€400bn", "regulatory", ["de", "at", "lu", "ch"], "Deka International S.A.", "Deka-Fonds", "Multi-asset", 39),
  S("acc-allianzgi", "Allianz Global Investors", "asset-manager", "de", "lu", "existing-client", "bp-david-lange", 5, "€570bn", "expanding", ["de", "at", "it", "fr", "es", "ch", "nl"], "Allianz Global Investors GmbH, Luxembourg branch", "Allianz Global Investors Fund", "Multi-asset", 57, ["nl"]),
  S("acc-eurizon", "Eurizon Capital", "bank-asset-manager", "it", "lu", "existing-client", "bp-marta-oliveira", 4, "€430bn", "expanding", ["it", "de", "es", "fr", "ch", "pl"], "Eurizon Capital S.A.", "Eurizon Fund", "Multi-asset", 45, ["pl", "es"]),
  S("acc-generaliinv", "Generali Investments", "insurer", "it", "lu", "prospect", "bp-marta-oliveira", 3, "€630bn", "consolidating", ["it", "fr", "de", "es", "at"], "Generali Investments Luxembourg S.A.", "Generali Investments SICAV", "Insurance multi-asset", 34),
  S("acc-mediolanum", "Mediolanum International Funds", "asset-manager", "ie", "ie", "existing-client", "bp-marta-oliveira", 3, "€60bn", "quiet", ["it", "es", "de", "ie"], "Mediolanum International Funds Limited", "Mediolanum Best Brands", "Multi-manager", 27),
  S("acc-santanderam", "Santander Asset Management", "bank-asset-manager", "es", "lu", "prospect", "bp-marta-oliveira", 3, "€230bn", "platform-shift", ["es", "pt", "it", "de", "cl"], "Santander Asset Management Luxembourg S.A.", "Santander SICAV", "Multi-asset", 32),
  S("acc-bbvaam", "BBVA Asset Management", "bank-asset-manager", "es", "lu", "prospect", "bp-marta-oliveira", 2, "€130bn", "greenfield", ["es", "pt"], "BBVA Asset Management S.A. SGIIC", "BBVA Durbana International Fund", "Multi-asset", 18),
  S("acc-swisscanto", "Swisscanto Invest", "bank-asset-manager", "ch", "lu", "prospect", "bp-anna-weber", 2, "CHF 200bn", "greenfield", ["ch", "de", "at", "lu"], "Swisscanto Asset Management International S.A.", "Swisscanto (LU) Portfolio Fund", "Sustainable multi-asset", 24),
  S("acc-vontobel", "Vontobel Asset Management", "asset-manager", "ch", "lu", "existing-client", "bp-anna-weber", 3, "CHF 200bn", "expanding", ["ch", "de", "it", "es", "at", "gb"], "Vontobel Asset Management S.A.", "Vontobel Fund", "Global equity", 37, ["gb"]),
  S("acc-pictet", "Pictet Asset Management", "asset-manager", "ch", "lu", "existing-client", "bp-anna-weber", 4, "CHF 250bn", "renewing", ["ch", "de", "it", "es", "fr", "gb", "nl", "sg"], "Pictet Asset Management (Europe) S.A.", "Pictet Funds", "Thematic equity", 54),
  S("acc-lombardodier", "Lombard Odier Investment Managers", "asset-manager", "ch", "lu", "prospect", "bp-anna-weber", 2, "CHF 65bn", "new-exec", ["ch", "de", "it", "gb"], "Lombard Odier Funds (Europe) S.A.", "LO Funds", "Sustainable credit", 21),
  S("acc-storebrand", "Storebrand Asset Management", "asset-manager", "no", "lu", "prospect", "bp-tom-eriksen", 2, "NOK 1.2tn", "greenfield", ["no", "se", "dk", "lu"], "Storebrand Luxembourg S.A.", "Storebrand Funds SICAV", "Sustainable equity", 16),
  S("acc-seb", "SEB Investment Management", "bank-asset-manager", "se", "lu", "existing-client", "bp-tom-eriksen", 3, "SEK 900bn", "regulatory", ["se", "dk", "no", "fi", "de", "lu"], "SEB Asset Management S.A.", "SEB SICAV 1", "Nordic multi-asset", 29),
  S("acc-handelsbanken", "Handelsbanken Fonder", "bank-asset-manager", "se", "se", "prospect", "bp-tom-eriksen", 2, "SEK 800bn", "quiet", ["se", "no", "fi", "dk"], "Handelsbanken Fonder AB", "Handelsbanken Funds", "Nordic equity", 19),
  S("acc-evli", "Evli Fund Management", "asset-manager", "fi", "fi", "prospect", "bp-tom-eriksen", 1, "€18bn", "greenfield", ["fi", "se"], "Evli Fund Management Company Ltd", "Evli Funds", "Nordic credit", 11),
  S("acc-universal", "Universal-Investment", "third-party-manco", "de", "lu", "prospect", "bp-ravi-nair", 4, "€1tn serviced", "consolidating", ["de", "lu", "at", "ie"], "Universal-Investment-Luxembourg S.A.", "Universal hosted sub-funds", "Multiple, third-party managed", 142),
  S("acc-carne", "Carne Group", "third-party-manco", "ie", "lu", "prospect", "bp-ravi-nair", 3, "$2tn serviced", "expanding", ["ie", "lu", "de", "it", "gb"], "Carne Global Fund Managers (Luxembourg) S.A.", "Carne hosted sub-funds", "Multiple, third-party managed", 88, ["it"]),
  S("acc-apex", "Apex Group", "third-party-manco", "ie", "lu", "prospect", "bp-ravi-nair", 3, "$3tn serviced", "consolidating", ["ie", "lu", "gb", "de"], "Apex Fund Services (Luxembourg) S.A.", "Apex hosted sub-funds", "Multiple, third-party managed", 76),
  S("acc-mfex", "MFEX by Euroclear", "platform-distributor", "se", "lu", "existing-client", "bp-elena-costa", 3, "€1.1tn AuA", "platform-shift", ["se", "fr", "lu", "ch", "sg"], "MFEX Mutual Funds Exchange AB", "MFEX distributed universe", "Third-party distributed", 0),
  S("acc-clearstreamfc", "Clearstream Fund Centre", "platform-distributor", "lu", "lu", "prospect", "bp-elena-costa", 3, "€3tn AuA", "platform-shift", ["lu", "de", "ch", "at", "sg"], "Clearstream Fund Centre S.A.", "Clearstream distributed universe", "Third-party distributed", 0),
];

/* ── Derivation ───────────────────────────────────────────────────────────── */

const SITUATION_HEALTH: Record<Situation, HealthState> = {
  expanding: "stable",
  renewing: "attention",
  regulatory: "stable",
  consolidating: "attention",
  "platform-shift": "stable",
  "new-exec": "stable",
  quiet: "stable",
  greenfield: "stable",
};

const SITUATION_MARKER: Record<Situation, StateMarker> = {
  expanding: "new",
  renewing: "attention",
  regulatory: "new",
  consolidating: "attention",
  "platform-shift": "new",
  "new-exec": "new",
  quiet: "quiet",
  greenfield: "uncertain",
};

function marketNames(ids: string[], all: Record<string, { name: string }>): string {
  const names = ids.map((id) => all[id]?.name ?? id);
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

interface Narrative {
  story: string;
  whatChanged: string;
  whereWeStand: string;
  whatToDoNext: string;
  stillToLearn: string[];
}

function narrative(
  spec: Spec,
  markets: Record<string, { name: string }>,
): Narrative {
  const isClient = spec.rel === "existing-client";
  const stands = isClient
    ? "An existing Broadridge service relationship is in place."
    : "No Broadridge commercial relationship is recorded.";
  const newHosts = spec.newHosts?.length
    ? marketNames(spec.newHosts, markets)
    : "";

  switch (spec.situation) {
    case "expanding":
      return {
        story: `Fund range widened into ${newHosts}. ${isClient ? "Existing relationship, wider footprint." : "No relationship yet."}`,
        whatChanged: `The ${spec.domicile === "lu" ? "Luxembourg" : "Irish"} range added host-market activity in ${newHosts}.`,
        whereWeStand: `${stands} The operating model behind the new markets is unconfirmed.`,
        whatToDoNext: `Validate how registration and local representation are handled for the new host markets before proposing anything.`,
        stillToLearn: [
          "Whether the new host markets are live or planned.",
          "Which provider handles registration today.",
          "Who owns the distribution operating model.",
        ],
      };
    case "renewing":
      return {
        story: "Renewal window approaching with scope not yet agreed.",
        whatChanged: "The contract renewal window opened without an agreed scope conversation.",
        whereWeStand: `${stands} Service is operating normally; the commercial conversation has not started.`,
        whatToDoNext:
          "Open the renewal on service quality and confirm who owns the decision this cycle.",
        stillToLearn: [
          "Who owns the renewal decision this cycle.",
          "Whether scope needs to change at all.",
          "Whether any alternative provider has been approached.",
        ],
      };
    case "regulatory":
      return {
        story: "A dated regulatory obligation applies across the range.",
        whatChanged:
          "A dated regulatory obligation now applies to funds this group operates.",
        whereWeStand: `${stands} Whether the obligation is already covered is unknown.`,
        whatToDoNext:
          "Prepare a targeted account brief on the obligation and an approved discussion plan.",
        stillToLearn: [
          "Whether the obligation is already resourced internally.",
          "Which provider handles regulatory reporting today.",
          "Who owns the regulatory workflow budget.",
        ],
      };
    case "consolidating":
      return {
        story: "Entities or ranges are being brought together, changing the operating need.",
        whatChanged:
          "Entities, fund ranges or operations are being consolidated across the group.",
        whereWeStand: `${stands} Consolidation usually changes provider arrangements; nothing is confirmed here.`,
        whatToDoNext:
          "Establish who is designing the consolidated operating model, and when decisions land.",
        stillToLearn: [
          "What the consolidated operating model looks like.",
          "Which incumbent arrangements survive it.",
          "When provider decisions are actually made.",
        ],
      };
    case "platform-shift":
      return {
        story: "The route to investors is changing — channel, platform or partner.",
        whatChanged: "Distribution flows moved measurably between channels.",
        whereWeStand: `${stands} What the shift reflects commercially is not established.`,
        whatToDoNext:
          "Use market intelligence to establish what the flow shift reflects before any approach.",
        stillToLearn: [
          "What the flow shift reflects commercially.",
          "Whether distribution data is bought centrally.",
          "Who owns channel strategy.",
        ],
      };
    case "new-exec":
      return {
        story: "A relevant senior appointment changed who decides.",
        whatChanged: "A senior appointment changed who owns the relevant decisions.",
        whereWeStand: `${stands} The new incumbent's remit is unconfirmed.`,
        whatToDoNext:
          "Confirm the remit before any approach. A new appointment is not on its own a reason to sell.",
        stillToLearn: [
          "What the appointment's remit actually covers.",
          "Whether the previous decision owner has moved on.",
          "Whether any review follows the appointment.",
        ],
      };
    case "quiet":
      return {
        story: "No material change in the current period.",
        whatChanged: "Nothing material has changed in the current period.",
        whereWeStand: `${stands} The account is stable and correctly covered.`,
        whatToDoNext: "No action needed. Review at the next cycle.",
        stillToLearn: ["Nothing material outstanding."],
      };
    case "greenfield":
    default:
      return {
        story: "Prospect with product fit and no relationship established.",
        whatChanged: "No verified change recorded in the current period.",
        whereWeStand:
          "No Broadridge commercial relationship is recorded and no buyer map exists.",
        whatToDoNext:
          "Build the buying-system map before outreach. There is no credible trigger yet.",
        stillToLearn: [
          "Who owns the relevant operating model.",
          "Which providers are in place today.",
          "Whether any credible trigger exists at all.",
        ],
      };
  }
}

export function buildPortfolio(markets: Record<string, { name: string }>): {
  accounts: Account[];
  entities: LegalEntity[];
  funds: Fund[];
} {
  const accounts: Account[] = [];
  const entities: LegalEntity[] = [];
  const funds: Fund[] = [];

  for (const spec of SPECS) {
    const n = narrative(spec, markets);
    accounts.push({
      id: spec.id,
      name: spec.name,
      type: spec.type,
      tier: spec.strategicValue >= 4 ? "strategic" : spec.strategicValue >= 2 ? "growth" : "core",
      hqMarketId: spec.hq,
      relationship: spec.rel,
      ownerId: spec.owner,
      story: n.story,
      whatChanged: n.whatChanged,
      whereWeStand: n.whereWeStand,
      whatToDoNext: n.whatToDoNext,
      stillToLearn: n.stillToLearn,
      coverage: spec.rel === "existing-client" ? "covered" : spec.strategicValue >= 3 ? "thin" : "unassigned",
      health: SITUATION_HEALTH[spec.situation],
      marker: SITUATION_MARKER[spec.situation],
      strategicValue: spec.strategicValue,
      aum: spec.aum,
    });

    entities.push({
      id: `ent-${spec.id.replace("acc-", "")}`,
      name: spec.entity,
      accountId: spec.id,
      role:
        spec.type === "third-party-manco"
          ? "third-party-manco"
          : spec.type === "platform-distributor"
            ? "platform-operator"
            : "ucits-manco",
      domicileMarketId: spec.domicile,
    });

    funds.push({
      id: `fund-${spec.id.replace("acc-", "")}`,
      name: spec.fund,
      accountId: spec.id,
      entityId: `ent-${spec.id.replace("acc-", "")}`,
      domicileMarketId: spec.domicile,
      structure: spec.domicile === "ie" ? "ICAV" : spec.domicile === "lu" ? "SICAV" : "UCITS",
      assetClass: spec.assetClass,
      hostMarketIds: spec.hosts,
      newHostMarketIds: spec.newHosts,
      shareClasses: spec.shareClasses,
    });
  }

  return { accounts, entities, funds };
}

/** Situation per account id — reused when composing signals and services. */
export const SITUATION_BY_ACCOUNT: Record<string, Situation> = Object.fromEntries(
  SPECS.map((s) => [s.id, s.situation]),
);

export const PORTFOLIO_SPECS = SPECS;
