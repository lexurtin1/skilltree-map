/**
 * Destination registry for the Wire / Client / Board IA.
 *
 * Navigation and the menu read from this one list so a destination's name and
 * route can never disagree between the rail and the page it opens.
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

export type DestinationId =
  | "today"
  | "wire"
  | "client"
  | "board"
  | "executive"
  | "where-it-runs";

export interface ModuleDef {
  id: DestinationId;
  label: string;
  href: string;
  /** Shown in the menu. One plain sentence. */
  description: string;
  /** The question this destination exists to answer. */
  question: string;
  Icon: (props: { size?: number; className?: string }) => React.JSX.Element;
  /** Accent used by the destination rail when active. */
  accent: string;
}

export const MODULES: ModuleDef[] = [
  {
    id: "today",
    label: "Today",
    href: "/today",
    description: "Daily briefing: priority account, book health and Ask.",
    question: "What should I prepare for today, and what is the state of the book?",
    Icon: GrowthIcon,
    accent: "#007644",
  },
  {
    id: "wire",
    label: "The Wire",
    href: "/",
    description: "Overnight changes ranked by commercial consequence.",
    question: "What moved overnight that I should act on first?",
    Icon: EvidenceIcon,
    accent: "#c41e3a",
  },
  {
    id: "client",
    label: "Client · Amundi",
    href: "/client",
    description:
      "What Amundi holds, what peers hold that they don't, and who still needs a path.",
    question:
      "For Amundi, which Broadridge products are live, where is the peer gap, and who opens the next door?",
    Icon: AccountsIcon,
    accent: "#0065A7",
  },
  {
    id: "board",
    label: "The Board · Nordea",
    href: "/board",
    description: "Evidence coverage across decision criteria and stakeholders.",
    question:
      "Which cells on the Nordea deal are empty, and what closes them?",
    Icon: DealsIcon,
    accent: "#5E50A8",
  },
  {
    id: "executive",
    label: "Executive",
    href: "/executive",
    description: "Items only an executive can unblock, ranked by evidence gap.",
    question: "What needs me today — and what did we miss earlier on Nordea?",
    Icon: GlobeIcon,
    accent: "#893F84",
  },
  {
    id: "where-it-runs",
    label: "Where it runs",
    href: "/where-it-runs",
    description: "Source systems and provenance behind every Wire footer tag.",
    question: "Which systems feed The Wire, and can I open the source?",
    Icon: GraphIcon,
    accent: "#00A2CF",
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<
  DestinationId,
  ModuleDef
>;

/**
 * Tasks sits outside the destination rail — it is work, not a view —
 * so it lives in the menu under Work with a live count.
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
 * Legacy nine-module gallery metadata. Kept so orphaned Control Centres code
 * still typechecks; destinations above are the live IA.
 */
export const LEGACY_GALLERY: Record<
  ModuleId,
  {
    label: string;
    href: string;
    description: string;
    Icon: (props: { size?: number; className?: string }) => React.JSX.Element;
  }
> = {
  growth: {
    label: "Growth",
    href: "/",
    description: "Redirects to The Wire.",
    Icon: GrowthIcon,
  },
  accounts: {
    label: "Accounts",
    href: "/client",
    description: "Redirects to Client · Amundi.",
    Icon: AccountsIcon,
  },
  deals: {
    label: "Deals",
    href: "/board",
    description: "Redirects to The Board · Nordea.",
    Icon: DealsIcon,
  },
  markets: {
    label: "Markets",
    href: "/",
    description: "Redirects to The Wire.",
    Icon: MarketsIcon,
  },
  people: {
    label: "People",
    href: "/client",
    description: "Redirects to Client · Amundi.",
    Icon: PeopleIcon,
  },
  delivery: {
    label: "Delivery",
    href: "/executive",
    description: "Redirects to Executive.",
    Icon: DeliveryIcon,
  },
  "knowledge-graph": {
    label: "Knowledge Graph",
    href: "/where-it-runs",
    description: "Redirects to Where it runs.",
    Icon: GraphIcon,
  },
  global: {
    label: "Global",
    href: "/executive",
    description: "Redirects to Executive.",
    Icon: GlobeIcon,
  },
  evidence: {
    label: "Evidence",
    href: "/where-it-runs",
    description: "Redirects to Where it runs.",
    Icon: EvidenceIcon,
  },
};
