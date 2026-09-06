/**
 * People.
 *
 * Two populations, deliberately governed by different rules:
 *
 *   Broadridge staff (`internal: true`) are fictional. They own accounts,
 *   relationships and tasks, so they need commitments and history — which is
 *   only safe to invent for invented people.
 *
 *   Client-side people are real individuals in real, publicly announced roles.
 *   `identity` is sourced and may be stated as fact. `commercial` is never
 *   stated as fact: every buying role is a `seller-hypothesis` or
 *   `still-to-learn`, engagement defaults to "no relationship recorded", and
 *   nothing here records a real person as having met us, agreed anything or
 *   sponsored anything. Where a required buying role has no sourced incumbent,
 *   there is simply no record — the People module renders that absence as a
 *   missing role, which is the honest and more useful outcome.
 */
import type { Person } from "../types";

/* ── Broadridge team (fictional) ──────────────────────────────────────────── */

const internal = (
  id: string,
  name: string,
  title: string,
  decisionRelevance: 1 | 2 | 3 | 4 | 5,
  accountId?: string,
): Person => ({
  id,
  accountId,
  internal: true,
  identity: { name, title, org: "Broadridge", verified: true },
  commercial: {
    likelyRole: "broadridge-team",
    roleConfidence: "high",
    roleState: "verified-fact",
    engagement: "engaged",
    whatWeNeed: "—",
    decisionRelevance,
    committed: true,
  },
});

export const INTERNAL_PEOPLE: Person[] = [
  internal("bp-sarah-patel", "Sarah Patel", "Client Director, Luxembourg", 4, "acc-schroders"),
  internal("bp-james-howard", "James Howard", "Strategic Account Director, UK", 5, "acc-schroders"),
  internal("bp-marta-oliveira", "Marta Oliveira", "Specialist Seller, Cross-border Distribution", 4),
  internal("bp-tom-eriksen", "Tom Eriksen", "Account Director, Nordics", 5, "acc-nordea"),
  internal("bp-claire-dubois", "Claire Dubois", "Client Services Lead, Fund Communications", 3, "acc-janushenderson"),
  internal("bp-ravi-nair", "Ravi Nair", "Account Director, ManCo and Fund Services", 4, "acc-waystone"),
  internal("bp-elena-costa", "Elena Costa", "Account Director, Platforms and Distribution", 4, "acc-allfunds"),
  internal("bp-david-lange", "David Lange", "Regional Sales Lead, DACH", 4),
  internal("bp-anna-weber", "Anna Weber", "Solutions Consultant, Regulatory", 3),
  internal("bp-nadia-haddad", "Nadia Haddad", "Head of European Market Intelligence", 4),
  internal("bp-peter-quinn", "Peter Quinn", "Delivery Lead, Fund Communications", 3),
  internal("bp-lucy-chen", "Lucy Chen", "Commercial Director, Northern Europe", 5),
];

/* ── Client-side people (real, sourced) ───────────────────────────────────── */

export const CLIENT_PEOPLE: Person[] = [
  /* Schroders */
  {
    id: "px-schroders-schwyzer",
    accountId: "acc-schroders",
    internal: false,
    identity: {
      name: "Patrick Schwyzer",
      title: "Head of Client Group, Europe",
      org: "Schroders",
      verified: true,
      sourceId: "src-schroders-schwyzer",
      sourceNote:
        "Role and start date taken from a public appointment announcement, February 2026. Based in Zurich; joined from UBS.",
    },
    commercial: {
      likelyRole: "executive-decision",
      roleConfidence: "medium",
      roleState: "seller-hypothesis",
      engagement: "no-relationship-recorded",
      bestRoute:
        "Ask Sarah Patel, the existing Luxembourg client-services owner, whether the group can introduce us through the Fund Communications relationship.",
      routeViaPersonId: "bp-sarah-patel",
      whatWeNeed:
        "Confirm whether this role owns European distribution strategy, the operating model behind it, or both.",
      decisionRelevance: 5,
    },
  },
  {
    id: "px-schroders-bergh",
    accountId: "acc-schroders",
    internal: false,
    identity: {
      name: "Henriette Bergh",
      title: "Head of Europe Product and Manager Solutions",
      org: "Schroders",
      verified: true,
      sourceId: "src-schroders-bergh",
      sourceNote:
        "Newly created role, announced May 2026. Covers Europe excluding the UK.",
    },
    commercial: {
      likelyRole: "business-ownership",
      roleConfidence: "medium",
      roleState: "seller-hypothesis",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Confirm whether product scope includes host-market registration decisions or stops at range design.",
      decisionRelevance: 4,
    },
  },

  /* Nordea Asset Management */
  {
    id: "px-nordea-andersen",
    accountId: "acc-nordea",
    internal: false,
    identity: {
      name: "Stina Rathsach Andersen",
      title: "Head of Private Markets",
      org: "Nordea Asset Management",
      verified: true,
      sourceId: "src-nordea-andersen",
      sourceNote: "Appointment announced March 2026; started 13 April 2026.",
    },
    commercial: {
      likelyRole: "business-ownership",
      roleConfidence: "low",
      roleState: "still-to-learn",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Establish whether private markets sits inside the scope of the current cross-border conversation at all.",
      decisionRelevance: 2,
    },
  },

  /* Waystone */
  {
    id: "px-waystone-serban",
    accountId: "acc-waystone",
    internal: false,
    identity: {
      name: "Alexandra Serban-Liebsch",
      title: "Chief Executive, Waystone Management Company (Lux)",
      org: "Waystone",
      verified: true,
      sourceId: "src-waystone-serban",
      sourceNote:
        "Appointment announced July 2026. More than a decade at the firm; previously head of Operations.",
    },
    commercial: {
      likelyRole: "executive-decision",
      roleConfidence: "medium",
      roleState: "seller-hypothesis",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Confirm whether the Luxembourg ManCo buys communications and reporting services independently of group.",
      decisionRelevance: 5,
    },
  },
  {
    id: "px-waystone-grosso",
    accountId: "acc-waystone",
    internal: false,
    identity: {
      name: "John Grosso",
      title: "Head of Luxembourg Administration Service — Product",
      org: "Waystone",
      verified: true,
      sourceId: "src-waystone-grosso",
      sourceNote:
        "Announced July 2026, in role from 1 October 2026. Previously with Apex Group, Deutsche Bank and BNY Mellon.",
    },
    commercial: {
      likelyRole: "business-ownership",
      roleConfidence: "medium",
      roleState: "seller-hypothesis",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Confirm whether product scope covers the reporting and document workflows underlying administration.",
      decisionRelevance: 4,
    },
  },
  {
    id: "px-waystone-ryan",
    accountId: "acc-waystone",
    internal: false,
    identity: {
      name: "Diarmuid Ryan",
      title: "Global Head of Administration Solutions",
      org: "Waystone",
      verified: true,
      sourceId: "src-waystone-ryan",
      sourceNote: "Appointment announced June 2026.",
    },
    commercial: {
      likelyRole: "operations-delivery",
      roleConfidence: "low",
      roleState: "still-to-learn",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Establish whether global administration sets the operating standard the Luxembourg ManCo must follow.",
      decisionRelevance: 3,
    },
  },
  {
    id: "px-waystone-sawhney",
    accountId: "acc-waystone",
    internal: false,
    identity: {
      name: "Sanjiv Sawhney",
      title: "Global Chief Executive",
      org: "Waystone",
      verified: true,
      sourceId: "src-waystone-sawhney",
      sourceNote: "Appointment announced September 2025.",
    },
    commercial: {
      likelyRole: "executive-decision",
      roleConfidence: "low",
      roleState: "still-to-learn",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Group-level sponsorship is not required at this stage and should not be sought before the ManCo conversation.",
      decisionRelevance: 2,
    },
  },

  /* Janus Henderson */
  {
    id: "px-jh-cain",
    accountId: "acc-janushenderson",
    internal: false,
    identity: {
      name: "Suzanne Cain",
      title: "Global Head of Distribution",
      org: "Janus Henderson Investors",
      verified: true,
      sourceId: "src-jh-cain",
      sourceNote:
        "Role from the firm's own press release, February 2022. Source is dated — re-verify before use.",
    },
    commercial: {
      likelyRole: "executive-decision",
      roleConfidence: "low",
      roleState: "still-to-learn",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Re-verify the incumbent before any executive approach. The supporting source is more than three years old.",
      decisionRelevance: 4,
    },
  },
  {
    id: "px-jh-delamaza",
    accountId: "acc-janushenderson",
    internal: false,
    identity: {
      name: "Ignacio De La Maza",
      title: "Head of EMEA and LatAm Intermediary Distribution",
      org: "Janus Henderson Investors",
      verified: true,
      sourceId: "src-jh-delamaza",
      sourceNote: "Role referenced in a public distribution-team announcement, July 2023.",
    },
    commercial: {
      likelyRole: "business-ownership",
      roleConfidence: "low",
      roleState: "still-to-learn",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "Confirm whether intermediary distribution owns any part of the document and reporting operating model.",
      decisionRelevance: 3,
    },
  },

  /* Allfunds */
  {
    id: "px-allfunds-spring",
    accountId: "acc-allfunds",
    internal: false,
    identity: {
      name: "Annabel Spring",
      title: "Chief Executive",
      org: "Allfunds Group",
      verified: true,
      sourceId: "src-allfunds-spring",
      sourceNote:
        "Appointment announced June 2025, succeeding the founder. Previously chief executive of global private banking and wealth at HSBC.",
    },
    commercial: {
      likelyRole: "executive-decision",
      roleConfidence: "low",
      roleState: "still-to-learn",
      engagement: "no-relationship-recorded",
      whatWeNeed:
        "No executive approach is justified yet. Build the account plan first.",
      decisionRelevance: 4,
    },
  },
  {
    id: "px-allfunds-alonso",
    accountId: "acc-allfunds",
    internal: false,
    identity: {
      name: "Daniel Jesus Alonso",
      title: "Head of US",
      org: "Allfunds Group",
      verified: true,
      sourceId: "src-allfunds-alonso",
      sourceNote:
        "Appointment announced June 2026, effective 9 July. Joined from Morgan Stanley Wealth Management, where the role covered international wealth management product development.",
    },
    commercial: {
      likelyRole: "business-ownership",
      roleConfidence: "medium",
      roleState: "seller-hypothesis",
      engagement: "no-relationship-recorded",
      bestRoute:
        "Elena Costa holds the platform relationship. Ask whether the European product team can introduce us before approaching the US directly.",
      routeViaPersonId: "bp-elena-costa",
      whatWeNeed:
        "Confirm whether a product-development background signals appetite for distribution-data and preference intelligence.",
      decisionRelevance: 4,
    },
  },
];

export const PEOPLE: Person[] = [...INTERNAL_PEOPLE, ...CLIENT_PEOPLE];
