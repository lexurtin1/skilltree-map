/**
 * Integrity check for the dataset.
 *
 * Runs in development against whatever data source is configured. It exists
 * because the product's credibility rests on internal consistency: a dangling
 * evidence id or an unsourced person shown as verified is not a cosmetic bug,
 * it is the interface telling the user something untrue.
 */
import { dataset } from "./select";
import { MARKET_BY_ID, SERVICE_BY_ID } from "./taxonomy";

export interface IntegrityIssue {
  severity: "error" | "warning";
  where: string;
  message: string;
}

export function giIntegrityCheck(): IntegrityIssue[] {
  const d = dataset();
  const issues: IntegrityIssue[] = [];

  const accountIds = new Set(d.accounts.map((a) => a.id));
  const entityIds = new Set(d.entities.map((e) => e.id));
  const fundIds = new Set(d.funds.map((f) => f.id));
  const personIds = new Set(d.people.map((p) => p.id));
  const eventIds = new Set(d.events.map((e) => e.id));
  const evidenceIds = new Set(d.evidence.map((e) => e.id));
  const sourceIds = new Set(d.sources.map((s) => s.id));
  const hypothesisIds = new Set(d.hypotheses.map((h) => h.id));
  const actionIds = new Set(d.actions.map((a) => a.id));
  const opportunityIds = new Set(d.opportunities.map((o) => o.id));

  const err = (where: string, message: string) =>
    issues.push({ severity: "error", where, message });
  const warn = (where: string, message: string) =>
    issues.push({ severity: "warning", where, message });

  const ref = (
    ok: boolean,
    where: string,
    what: string,
    id: string,
  ) => {
    if (!ok) err(where, `references a ${what} that does not exist: ${id}`);
  };

  /* Duplicate ids anywhere are a hard error — selection and navigation break. */
  const seen = new Set<string>();
  for (const row of [
    ...d.accounts,
    ...d.entities,
    ...d.funds,
    ...d.people,
    ...d.events,
    ...d.evidence,
    ...d.sources,
    ...d.hypotheses,
    ...d.actions,
    ...d.opportunities,
    ...d.tasks,
    ...d.serviceRelationships,
    ...d.territories,
  ]) {
    if (seen.has(row.id)) err(row.id, "duplicate id");
    seen.add(row.id);
  }

  for (const a of d.accounts) {
    ref(personIds.has(a.ownerId), a.id, "person", a.ownerId);
    ref(!!MARKET_BY_ID[a.hqMarketId], a.id, "market", a.hqMarketId);
  }

  for (const e of d.entities) {
    ref(accountIds.has(e.accountId), e.id, "account", e.accountId);
    ref(!!MARKET_BY_ID[e.domicileMarketId], e.id, "market", e.domicileMarketId);
  }

  for (const f of d.funds) {
    ref(accountIds.has(f.accountId), f.id, "account", f.accountId);
    ref(entityIds.has(f.entityId), f.id, "entity", f.entityId);
    ref(!!MARKET_BY_ID[f.domicileMarketId], f.id, "market", f.domicileMarketId);
    for (const m of f.hostMarketIds) ref(!!MARKET_BY_ID[m], f.id, "market", m);
    for (const m of f.newHostMarketIds ?? []) {
      if (!f.hostMarketIds.includes(m)) {
        err(f.id, `new host market ${m} is not present in hostMarketIds`);
      }
    }
  }

  for (const p of d.people) {
    if (p.accountId) ref(accountIds.has(p.accountId), p.id, "account", p.accountId);
    if (p.commercial.routeViaPersonId) {
      ref(personIds.has(p.commercial.routeViaPersonId), p.id, "person", p.commercial.routeViaPersonId);
    }
    if (p.identity.sourceId) ref(sourceIds.has(p.identity.sourceId), p.id, "source", p.identity.sourceId);

    /* The governing rule for real people: verified identity needs a source. */
    if (!p.internal && p.identity.verified && !p.identity.sourceId) {
      err(p.id, "identity is marked verified but carries no source");
    }
    /* And commercial state about a real person is never asserted as fact. */
    if (!p.internal && p.commercial.roleState === "verified-fact") {
      err(p.id, "buying role is asserted as verified fact for an external person");
    }
    if (!p.internal && p.commercial.committed) {
      err(p.id, "a commitment is recorded against an external person");
    }
  }

  for (const r of d.serviceRelationships) {
    ref(accountIds.has(r.accountId), r.id, "account", r.accountId);
    ref(!!SERVICE_BY_ID[r.serviceId], r.id, "service", r.serviceId);
    ref(personIds.has(r.ownerId), r.id, "person", r.ownerId);
    if (r.marketId) ref(!!MARKET_BY_ID[r.marketId], r.id, "market", r.marketId);
  }

  for (const e of d.events) {
    ref(accountIds.has(e.accountId), e.id, "account", e.accountId);
    if (e.entityId) ref(entityIds.has(e.entityId), e.id, "entity", e.entityId);
    if (e.fundId) ref(fundIds.has(e.fundId), e.id, "fund", e.fundId);
    if (e.domicileMarketId) ref(!!MARKET_BY_ID[e.domicileMarketId], e.id, "market", e.domicileMarketId);
    for (const m of e.hostMarketIds) ref(!!MARKET_BY_ID[m], e.id, "market", m);
    for (const s of e.relevantServiceIds) ref(!!SERVICE_BY_ID[s], e.id, "service", s);
    for (const ev of e.evidenceIds) ref(evidenceIds.has(ev), e.id, "evidence record", ev);
    if (e.state === "verified-fact" && e.evidenceIds.length === 0) {
      err(e.id, "is stated as a verified fact but has no evidence");
    }
  }

  for (const e of d.evidence) {
    for (const s of e.sourceIds) ref(sourceIds.has(s), e.id, "source", s);
    if (e.conflictsWithId) ref(evidenceIds.has(e.conflictsWithId), e.id, "evidence record", e.conflictsWithId);
    if (e.state === "verified-fact" && e.sourceIds.length === 0) {
      err(e.id, "is stated as a verified fact but has no source");
    }
    if (e.matchedToKind === "account" && !accountIds.has(e.matchedToId)) {
      err(e.id, `matched to an account that does not exist: ${e.matchedToId}`);
    }
    for (const u of e.usedBy) {
      if (!hypothesisIds.has(u) && !opportunityIds.has(u)) {
        warn(e.id, `usedBy references an unknown hypothesis or opportunity: ${u}`);
      }
    }
  }

  for (const h of d.hypotheses) {
    ref(accountIds.has(h.accountId), h.id, "account", h.accountId);
    ref(actionIds.has(h.recommendedActionId), h.id, "action", h.recommendedActionId);
    for (const t of h.triggerEventIds) ref(eventIds.has(t), h.id, "event", t);
    for (const s of h.serviceIds) ref(!!SERVICE_BY_ID[s], h.id, "service", s);
    if (h.state === "verified-fact") {
      err(h.id, "a hypothesis must never be stated as a verified fact");
    }
  }

  for (const a of d.actions) {
    ref(personIds.has(a.ownerId), a.id, "person", a.ownerId);
    for (const e of a.evidenceIds) ref(evidenceIds.has(e), a.id, "evidence record", e);
  }

  for (const o of d.opportunities) {
    ref(accountIds.has(o.accountId), o.id, "account", o.accountId);
    ref(personIds.has(o.ownerId), o.id, "person", o.ownerId);
    for (const s of o.serviceIds) ref(!!SERVICE_BY_ID[s], o.id, "service", s);
    for (const e of o.evidenceIds) ref(evidenceIds.has(e), o.id, "evidence record", e);
    for (const p of o.buyingGroupPersonIds) ref(personIds.has(p), o.id, "person", p);
    if (!o.gaps.includes(o.mainGap)) err(o.id, "mainGap is not listed in gaps");
  }

  for (const t of d.tasks) {
    ref(accountIds.has(t.accountId), t.id, "account", t.accountId);
    ref(personIds.has(t.ownerId), t.id, "person", t.ownerId);
    const pools: Record<string, Set<string>> = {
      account: accountIds,
      opportunity: opportunityIds,
      person: personIds,
      hypothesis: hypothesisIds,
      event: eventIds,
      fund: fundIds,
      entity: entityIds,
      evidence: evidenceIds,
    };
    const pool = pools[t.linkedToKind];
    if (pool) {
      ref(pool.has(t.linkedToId), t.id, t.linkedToKind, t.linkedToId);
    } else if (t.linkedToKind === "market") {
      ref(!!MARKET_BY_ID[t.linkedToId], t.id, "market", t.linkedToId);
    }
  }

  for (const t of d.territories) {
    ref(personIds.has(t.leadPersonId), t.id, "person", t.leadPersonId);
    for (const m of t.marketIds) ref(!!MARKET_BY_ID[m], t.id, "market", m);
  }

  return issues;
}

/** Throws in development if the dataset is inconsistent. */
export function assertGiIntegrity(): void {
  const issues = giIntegrityCheck();
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length) {
    const lines = errors.slice(0, 20).map((e) => `  ${e.where}: ${e.message}`);
    throw new Error(
      `Growth Intelligence dataset has ${errors.length} integrity error(s):\n${lines.join("\n")}`,
    );
  }
}
