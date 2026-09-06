/**
 * Source records.
 *
 * Illustrative prototype data. Public-record sources point at genuine, dated
 * announcements where one exists — those are what make a `verified-fact`
 * defensible. CRM, contract and internal-note sources are Broadridge-side and
 * therefore fictional, and are marked `restricted` where a real system would
 * be permissioned.
 */
import type { Source } from "../types";

export const SOURCES: Source[] = [
  /* ── Public record: appointments ─────────────────────────────────────── */
  {
    id: "src-schroders-schwyzer",
    kind: "public-announcement",
    label: "Schroders appoints Patrick Schwyzer head of client group, Europe",
    publisher: "Private Banker International",
    published: "2026-02-11",
    url: "https://www.privatebankerinternational.com/news/schroders-europe-client-group-head/",
  },
  {
    id: "src-schroders-bergh",
    kind: "public-announcement",
    label:
      "Schroders names Henriette Bergh head of Europe product and manager solutions",
    publisher: "WealthBriefing",
    published: "2026-05-20",
    url: "https://newserver.wealthbriefing.com/html/article.php/Schroders-Names-New-Head-Of-Europe-Product,-Manager-Solutions",
  },
  {
    id: "src-nordea-andersen",
    kind: "public-announcement",
    label: "Nordea Asset Management appoints Stina Rathsach Andersen head of private markets",
    publisher: "AMWatch",
    published: "2026-03-18",
    url: "https://amwatch.com/AMNews/People/article19090275.ece",
  },
  {
    id: "src-waystone-serban",
    kind: "public-announcement",
    label:
      "Waystone appoints Alexandra Serban-Liebsch CEO of Waystone Management Company (Lux)",
    publisher: "Asset Servicing Times",
    published: "2026-07-02",
    url: "https://www.assetservicingtimes.com/assetservicesnews/peoplemovesarticle.php?article_id=18279",
  },
  {
    id: "src-waystone-grosso",
    kind: "public-announcement",
    label:
      "Waystone appoints John Grosso head of Luxembourg administration service — product",
    publisher: "Asset Servicing Times",
    published: "2026-07-02",
    url: "https://www.assetservicingtimes.com/assetservicesnews/peoplemovesarticle.php?article_id=18279",
  },
  {
    id: "src-waystone-ryan",
    kind: "public-announcement",
    label: "Waystone announces strategic leadership appointments to global client solutions",
    publisher: "Waystone",
    published: "2026-06-24",
    url: "https://www.waystone.com/waystone-announces-strategic-leadership-appointments-to-strengthen-global-client-solutions/",
  },
  {
    id: "src-waystone-sawhney",
    kind: "public-announcement",
    label: "Waystone appoints Sanjiv Sawhney as global CEO",
    publisher: "Waystone",
    published: "2025-09-30",
    url: "https://www.waystone.com/waystone-appoints-sanjiv-sawhney-as-global-ceo/",
  },
  {
    id: "src-allfunds-spring",
    kind: "public-announcement",
    label: "Allfunds Group appoints Annabel Spring as chief executive",
    publisher: "Private Banker International",
    published: "2025-06-11",
    url: "https://www.privatebankerinternational.com/news/allfunds-group-appoints-ceo/",
  },
  {
    id: "src-allfunds-alonso",
    kind: "public-announcement",
    label: "Allfunds names Daniel Jesus Alonso head of US",
    publisher: "Family Wealth Report",
    published: "2026-06-30",
    url: "https://www.familywealthreport.com/article.php/Allfunds-Names-New-US-Head",
  },
  {
    id: "src-jh-cain",
    kind: "public-announcement",
    label: "Janus Henderson appoints Suzanne Cain global head of distribution",
    publisher: "Janus Henderson Investors",
    published: "2022-02-08",
    url: "https://www.janushenderson.com/en-us/advisor/press-releases/janus-henderson-investors-appoints-suzanne-cain-as-global-head-of-distribution/",
  },
  {
    id: "src-jh-delamaza",
    kind: "public-announcement",
    label: "Janus Henderson bolsters EMEA and LatAm distribution team",
    publisher: "RankiaPro",
    published: "2023-07-17",
    url: "https://rankiapro.com/en/news/janus-henderson-bolsters-emea-latam-distribution-team/",
  },
  {
    id: "src-waystone-allfunds-manco",
    kind: "public-announcement",
    label:
      "Waystone completes integration of the Allfunds management company businesses",
    publisher: "Waystone",
    published: "2026-06-24",
    url: "https://www.waystone.com/waystone-announces-strategic-leadership-appointments-to-strengthen-global-client-solutions/",
  },

  /* ── Regulatory and fund data (illustrative records) ─────────────────── */
  {
    id: "src-reg-schroders-de",
    kind: "regulatory-record",
    label: "Cross-border marketing notification — Germany",
    publisher: "Host-market regulator filing",
    published: "2026-08-14",
  },
  {
    id: "src-reg-schroders-it",
    kind: "regulatory-record",
    label: "Cross-border marketing notification — Italy",
    publisher: "Host-market regulator filing",
    published: "2026-08-14",
  },
  {
    id: "src-reg-schroders-es",
    kind: "regulatory-record",
    label: "Cross-border marketing notification — Spain",
    publisher: "Host-market regulator filing",
    published: "2026-08-21",
  },
  {
    id: "src-funddata-schroders-range",
    kind: "fund-data",
    label: "Sub-fund and share-class register, Luxembourg SICAV range",
    publisher: "Broadridge fund data",
    published: "2026-09-01",
  },
  {
    id: "src-reg-nordea-priips",
    kind: "regulatory-record",
    label: "PRIIPs KID refresh obligation, 2027 cycle",
    publisher: "Regulatory calendar",
    published: "2026-07-30",
  },
  {
    id: "src-reg-waystone-permissions",
    kind: "regulatory-record",
    label: "Management company permissions extension, Luxembourg",
    publisher: "Host-market regulator filing",
    published: "2026-07-10",
  },
  {
    id: "src-funddata-jh-range",
    kind: "fund-data",
    label: "Fund register and host-market coverage, Irish ICAV range",
    publisher: "Broadridge fund data",
    published: "2026-08-28",
  },
  {
    id: "src-reg-allfunds-shift",
    kind: "fund-data",
    label: "Platform distribution flow record, Iberia and Italy",
    publisher: "Broadridge fund data",
    published: "2026-08-19",
  },

  /* ── Broadridge market intelligence ──────────────────────────────────── */
  {
    id: "src-mi-crossborder",
    kind: "market-intelligence",
    label: "European cross-border registration volumes, H1 2026",
    publisher: "Broadridge market intelligence",
    published: "2026-08-05",
  },
  {
    id: "src-mi-saleswatch-nordics",
    kind: "market-intelligence",
    label: "SalesWatch Nordics — net flows by channel",
    publisher: "Broadridge SalesWatch",
    published: "2026-08-31",
  },
  {
    id: "src-mi-fundfile-iberia",
    kind: "market-intelligence",
    label: "FundFile — product preference shift, Iberian intermediaries",
    publisher: "Broadridge FundFile",
    published: "2026-08-26",
  },

  /* ── Internal, permissioned ──────────────────────────────────────────── */
  {
    id: "src-crm-schroders",
    kind: "crm",
    label: "Account record, activity history and ownership",
    publisher: "CRM",
    published: "2026-09-04",
    restricted: true,
  },
  {
    id: "src-contract-schroders-fcs",
    kind: "contract",
    label: "Fund Communication Solutions agreement and renewal window",
    publisher: "Contract register",
    published: "2026-01-06",
    restricted: true,
  },
  {
    id: "src-contract-jh-fcs",
    kind: "contract",
    label: "Fund Communication Solutions agreement and renewal window",
    publisher: "Contract register",
    published: "2025-11-21",
    restricted: true,
  },
  {
    id: "src-crm-nordea-deal",
    kind: "crm",
    label: "Opportunity record, stage history and activity log",
    publisher: "CRM",
    published: "2026-09-02",
    restricted: true,
  },
  {
    id: "src-note-nordea-meeting",
    kind: "internal-note",
    label: "Fund operations working session — summary",
    publisher: "Account team",
    published: "2026-07-24",
    restricted: true,
  },
  {
    id: "src-note-jh-quiet",
    kind: "internal-note",
    label: "Service review notes — no scope agreed",
    publisher: "Client services",
    published: "2026-06-18",
    restricted: true,
  },
  {
    id: "src-crm-allfunds",
    kind: "crm",
    label: "Account plan and relationship map",
    publisher: "CRM",
    published: "2026-08-29",
    restricted: true,
  },
];

export const SOURCE_BY_ID = Object.fromEntries(
  SOURCES.map((s) => [s.id, s]),
) as Record<string, Source>;
