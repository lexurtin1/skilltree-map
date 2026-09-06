/**
 * The module registry.
 *
 * Navigation, the gallery ring and every breadcrumb read from this
 * one list, so a module's name, description and route can never disagree
 * between the card that opens it and the page it opens.
 *
 * Names are plain and literal on purpose. A Broadridge employee should know
 * what a module does from its label alone.
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
    description: "Accounts and market changes that may create new work.",
    question:
      "Which accounts have changed in a way that may make a Broadridge capability relevant, and what should we do next?",
    Icon: GrowthIcon,
  },
  {
    id: "accounts",
    label: "Accounts",
    href: "/accounts",
    description: "The current picture across strategic client groups.",
    question:
      "What is the full current picture of this client group, what changed, where do we stand and what should happen next?",
    Icon: AccountsIcon,
  },
  {
    id: "deals",
    label: "Deals",
    href: "/deals",
    description: "The real condition of active opportunities.",
    question:
      "What would need to be true for this deal to close, and which important conditions are still missing?",
    Icon: DealsIcon,
  },
  {
    id: "markets",
    label: "Markets",
    href: "/markets",
    description: "Fund, regulatory and distribution movement across Europe.",
    question:
      "Where are fund groups changing, and which changes create a credible reason for Broadridge to help?",
    Icon: MarketsIcon,
  },
  {
    id: "people",
    label: "People",
    href: "/people",
    description: "The people who matter and the routes to reach them.",
    question: "Who matters to this account or deal, what is their role and what is the best route to them?",
    Icon: PeopleIcon,
  },
  {
    id: "delivery",
    label: "Delivery",
    href: "/delivery",
    description: "Client health, renewals and responsible expansion.",
    question:
      "Are we delivering well, what is changing for this client and where is a responsible expansion conversation justified?",
    Icon: DeliveryIcon,
  },
  {
    id: "knowledge-graph",
    label: "Knowledge Graph",
    href: "/knowledge-graph",
    description: "The connected view behind every account, fund, market and decision.",
    question:
      "How are the account, fund, market, people, product, deal, evidence and action connected?",
    Icon: GraphIcon,
  },
  {
    id: "global",
    label: "Global",
    href: "/global",
    description: "Broadridge's worldwide interests, relationships and active commercial work.",
    question:
      "Where in the world does Broadridge have strategic commercial interest, active client relationships, open opportunities and emerging market movement?",
    Icon: GlobeIcon,
  },
  {
    id: "evidence",
    label: "Evidence",
    href: "/evidence",
    description: "Sources, facts and the reasoning behind every recommendation.",
    question: "Why should I trust this fact, recommendation or score?",
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
 * a logo is for.
 */
export const NAV_MODULES: Array<{ label: string; href: string }> = MODULES.map((m) => ({
  label: m.label,
  href: m.href,
}));
