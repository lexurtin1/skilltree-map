/**
 * Backward-compatibility adapter.
 *
 * The Map's source of truth is now `@/lib/company-map`. This module keeps the
 * older `Department → Fn → Job` shape alive, derived from the Company Map, so
 * any graph component still written against it continues to compile and render
 * the current taxonomy rather than a stale copy of it.
 *
 * @deprecated Import from `@/lib/company-map` instead.
 */
import {
  DOMAINS,
  groupsForDomain,
  nodesForGroup,
  type CompanyMapNode,
} from "./company-map";

/**
 * Legacy visual-weight scale. It no longer describes autonomy — it is derived
 * from node importance and only exists so old renderers keep their three-step
 * "lit-ness" ramp.
 */
export type AutonomyLevel = "manual" | "assisted" | "autonomous";

export type Job = {
  name: string;
  desc: string;
  skills: string[];
  tools: string[];
  level: AutonomyLevel;
  /** Id of the underlying CompanyMapNode, for callers that need the real model. */
  nodeId: string;
};

export type Fn = {
  name: string;
  jobs: Job[];
};

export type Department = {
  name: string;
  sub: string;
  color: string;
  intro: string;
  functions: Fn[];
};

export const LEVEL_LABEL: Record<AutonomyLevel, string> = {
  manual: "BACKGROUND",
  assisted: "NOTABLE",
  autonomous: "MATERIAL",
};

function levelFor(node: CompanyMapNode): AutonomyLevel {
  if (node.importance >= 4) return "autonomous";
  if (node.importance === 3) return "assisted";
  return "manual";
}

function toJob(node: CompanyMapNode): Job {
  return {
    name: node.label,
    desc: node.detail?.summary ?? node.subtitle ?? "",
    skills: node.linkedNodeIds ?? [],
    tools: (node.detail?.evidence ?? []).map((e) => e.source),
    level: levelFor(node),
    nodeId: node.id,
  };
}

export const TREE: Department[] = DOMAINS.map((domain) => ({
  name: domain.label,
  sub: domain.subtitle,
  color: domain.color,
  intro: domain.intro,
  functions: groupsForDomain(domain.id).map((group) => ({
    name: group.label,
    jobs: nodesForGroup(group.id).map(toJob),
  })),
}));

export function deptJobCount(d: Department) {
  return d.functions.reduce((s, f) => s + f.jobs.length, 0);
}

export function findJob(
  dept: Department,
  jobName: string,
): { job: Job; fnName: string } | null {
  for (const fn of dept.functions) {
    const job = fn.jobs.find((j) => j.name === jobName);
    if (job) return { job, fnName: fn.name };
  }
  return null;
}
