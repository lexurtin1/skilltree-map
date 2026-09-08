/**
 * The module registry.
 *
 * Navigation, the gallery ring and every breadcrumb read from this
 * one list, so a module's name, description and route can never disagree
 * between the card that opens it and the page it opens.
 *
 * Names are plain and literal on purpose. A Broadridge employee should know
 * what a module does from its label alone. Questions are product-led: the MVP
 * is to test which Broadridge fund-services products fit each commercial moment.
 */
import {
  AccountsIcon,
  DealsIcon,
  DeliveryIcon,
  EvidenceIcon,
  GlobeIcon,
  GraphIcon,
  GrowthIcon,
  MarketsIcon,
  PeopleIcon,
  TasksIcon,
} from "./ui/Icons";
import type { ModuleId } from "@/lib/gi/metrics";

export interface ModuleDef {
  id: ModuleId;
  label: string;
  href: string;
  /** Shown on the carousel card. One plain sentence. */
  description: string;
  /** The question this module exists to answer. Shown in the page header. */
  question: string;
  Icon: (props: { size?: number; className?: string }) => React.JSX.Element;
}

export const MODULES: ModuleDef[] = [
  {
    id: "growth",
    label: "Growth",
    href: "/growth",
    description:
      "Account and market changes that may make a Broadridge product relevant.",
    question:
      "Which account changes make a Broadridge product relevant — Cross-border, Registration, Fund Communication Solutions or Translation — and which product should we test next?",
    Icon: GrowthIcon,
  },
  {
    id: "accounts",
    label: "Accounts",
    href: "/accounts",
    description:
      "Strategic client groups and the Broadridge products already in force.",
    question:
      "For this client group, which Broadridge products are live, what changed, and what should happen next?",
    Icon: AccountsIcon,
  },
  {
    id: "deals",
    label: "Deals",
    href: "/deals",
    description:
      "Open opportunities for named Broadridge products, and what still blocks them.",
    question:
      "Which Broadridge product is this deal selling, what must be true to close, and which conditions are still missing?",
    Icon: DealsIcon,
  },
  {
    id: "markets",
    label: "Markets",
    href: "/markets",
    description:
      "European fund movement that creates a reason for SalesWatch, FundFile, Market intelligence or Registration.",
    question:
      "Where are fund groups changing, and which Broadridge product — SalesWatch, FundFile, Market intelligence or Registration — does that change make worth testing?",
    Icon: MarketsIcon,
  },
  {
    id: "people",
    label: "People",
    href: "/people",
    description:
      "Buyers and sponsors who own Fund Communication Solutions, Cross-border and Regulatory decisions.",
    question:
      "Who owns the Fund Communication Solutions, Cross-border or Regulatory decision at this account, and what is the best route to them?",
    Icon: PeopleIcon,
  },
  {
    id: "delivery",
    label: "Delivery",
    href: "/delivery",
    description:
      "Live Broadridge product health, renewals and responsible expansion.",
    question:
      "Are Fund Communication Solutions, Document production and Regulatory workflow delivering well, and where is a responsible expansion conversation justified?",
    Icon: DeliveryIcon,
  },
  {
    id: "knowledge-graph",
    label: "Knowledge Graph",
    href: "/knowledge-graph",
    description:
      "How funds, markets and Broadridge products connect behind every decision.",
    question:
      "How do the account, fund range, host markets and Broadridge products — Registration, Fund Communication Solutions, Fund data — connect?",
    Icon: GraphIcon,
  },
  {
    id: "global",
    label: "Global",
    href: "/global",
    description:
      "Worldwide Cross-border and Registration footprint, relationships and open work.",
    question:
      "Where in the world does Broadridge have Cross-border and Registration presence, active clients, open opportunities and emerging market movement?",
    Icon: GlobeIcon,
  },
  {
    id: "evidence",
    label: "Evidence",
    href: "/evidence",
    description:
      "Sources that justify a Broadridge product recommendation — contracts, SalesWatch, FundFile, filings.",
    question:
      "Why should I trust this fact, score or Broadridge product recommendation?",
    Icon: EvidenceIcon,
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<
  ModuleId,
  ModuleDef
>;

/**
 * Tasks sits outside the carousel — it is work, not a view over the ontology —
 * so it lives in the navigation's right-hand cluster with a live count.
 */
export const TASKS_MODULE = {
  id: "tasks" as const,
  label: "Tasks",
  href: "/tasks",
  description: "What you need to do, why it matters and what is blocking it.",
  question: "What do I need to do, why does it matter and what is blocking progress?",
  Icon: TasksIcon,
};

/**
 * Navigation.
 *
 * The bar carries three controls and nothing else: search, the one action a
 * seller starts a day with, and a menu. Every destination lives behind the menu,
 * grouped, rather than being spread across a row of tabs that had grown to
 * eleven items and still could not fit them all.
 *
 * The gallery itself is not a nav item — the logo is the way home, which is what
 * a logo is for. The menu renders `MODULES` directly, so a module can never be
 * in the ring and missing from the navigation.
 */
