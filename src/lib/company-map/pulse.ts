import { D, E } from "./build";
import type { CompanyMapNode } from "./types";

/**
 * Executive Pulse — the centre of the Map.
 *
 * It is not a domain. It is the standing answer to "what matters now",
 * assembled from the four things an executive is asked about in every board
 * meeting: decisions due, revenue at risk, material opportunities, and the
 * constraints stopping execution.
 */
export const EXECUTIVE_PULSE: CompanyMapNode = {
  id: "pulse",
  label: "Library",
  subtitle: "collected knowledge",
  domain: "capital",
  type: "decision",
  status: "watch",
  importance: 5,
  linkedNodeIds: [
    "cap-alloc-awaiting",
    "cus-bramwell",
    "gro-meridian",
    "del-con-specialist",
    "prd-road-regulatory",
    "org-own-noowner",
    "cap-fund-milestone",
  ],
  detail: D(
    "Four decisions overdue · £310k of revenue at risk",
    "Why it matters: three of the four open decisions unblock commitments already made. Only one — US market entry — is a genuine choice about the future, and it is the one the funding round is priced on.",
    {
      movement: "£94k of contracted revenue moved out of the year · net retention down 14 points",
      recommendedAction:
        "Clear the four open decisions at the 8 September leadership meeting rather than sequencing them across the quarter.",
      owner: "CEO",
      dueDate: "8 Sept 2026",
      metrics: [
        { label: "Decisions due", value: "4", delta: "all open >30 days", tone: "critical" },
        { label: "Revenue at risk", value: "£310k", delta: "+£150k QoQ", tone: "risk" },
        { label: "Material opportunities", value: "£58m", delta: "segment access", tone: "opportunity" },
        { label: "Execution constraints", value: "2", delta: "capacity, ownership", tone: "critical" },
      ],
      evidence: [
        E("Finance", "Revenue at risk and deferral analysis", "Updated 4 hours ago"),
        E("Plan", "Decision register and commitment owners", "Updated 3 hours ago"),
        E("Delivery", "Programme baselines against forecast", "Updated 3 hours ago"),
      ],
    },
  ),
};

/** The four standing summaries rendered in the Pulse panel's default state. */
export const PULSE_SUMMARY: Array<{
  key: "decisions" | "risk" | "opportunity" | "constraints";
  label: string;
  value: string;
  detail: string;
  nodeIds: string[];
}> = [
  {
    key: "decisions",
    label: "Decisions due",
    value: "4 open",
    detail:
      "US market entry, contract capacity cover, executive sponsorship and the raise sequencing. All open longer than a month; three of the four cost less than the revenue they are deferring.",
    nodeIds: ["prd-road-regulatory", "cap-alloc-hiring", "org-dec-awaiting", "org-dec-board"],
  },
  {
    key: "risk",
    label: "Revenue at risk",
    value: "£310k",
    detail:
      "£150k in a live competitive evaluation, £160k exposed to an unsponsored relationship, and a further £94k of contracted revenue deferred out of the year on delivery capacity.",
    nodeIds: ["cus-bramwell", "cus-risk-sponsor", "cap-rev-golive"],
  },
  {
    key: "opportunity",
    label: "Material opportunities",
    value: "£58m segment",
    detail:
      "A US segment with a dated regulatory trigger, £560k of expansion inside existing accounts, and the largest deal in the pipeline sitting behind one unclosed review.",
    nodeIds: ["mkt-seg-usfintech", "gro-route-expansion", "gro-meridian"],
  },
  {
    key: "constraints",
    label: "Execution constraints",
    value: "2 binding",
    detail:
      "Two integration engineers are named on three programmes, and three material commitments have no accountable owner — including the largest revenue initiative in the plan.",
    nodeIds: ["del-con-specialist", "org-talent-key", "org-own-noowner"],
  },
];
