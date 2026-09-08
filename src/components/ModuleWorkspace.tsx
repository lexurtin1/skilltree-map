"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DASHBOARDS } from "./control-centres/dashboards";
import { PublicFunds } from "./PublicFunds";
import type { ModuleId } from "@/lib/gi/metrics";
import { portfolioGrid } from "@/lib/gi/portfolio-view";
import { healthColor } from "@/lib/gi/spectrum";
import { BROADRIDGE_SERVICES } from "@/lib/gi/taxonomy";
import {
  allAccounts,
  allFunds,
  allPeople,
  allEvents,
  allEvidence,
  allHypotheses,
  allOpportunities,
  allServiceRelationships,
  allTasks,
  getAccount,
  getService,
  getMarket,
  sourcesForEvidence,
} from "@/lib/gi/select";

type Row = {
  id: string;
  title: string;
  detail: string;
  state: string;
  href?: string;
  accountId?: string;
  marketIds?: string[];
  serviceIds?: string[];
};

function rowsFor(id: ModuleId | "tasks"): Row[] {
  switch (id) {
    case "accounts":
      return portfolioGrid().map((a) => {
        const live = allServiceRelationships()
          .filter((s) => s.accountId === a.id)
          .map((s) => s.serviceId);
        return {
          id: a.id,
          title: a.label,
          detail: `${a.whatChanged} Next: ${getAccount(a.id)?.whatToDoNext}`,
          state: `${a.healthWord}${a.opportunity ? " · Opportunity spotted" : ""}`,
          href: a.href,
          accountId: a.id,
          serviceIds: live,
        };
      });
    case "growth":
      return allHypotheses().map((h) => ({
        id: h.id,
        title: h.title,
        detail: `${h.whyItMayMatter} Still to learn: ${h.stillToLearn.join("; ")}`,
        state: h.state,
        accountId: h.accountId,
        serviceIds: h.serviceIds,
        href: `/accounts/${h.accountId}`,
      }));
    case "deals":
      return allOpportunities().map((d) => ({
        id: d.id,
        title: d.name,
        detail: d.statement,
        state: `${d.stage} · £${d.value.toLocaleString("en-GB")} · ${d.mainGap}`,
        accountId: d.accountId,
        serviceIds: d.serviceIds,
        href: `/deals/${d.id}`,
      }));
    case "people":
      return allPeople().map((p) => {
        const related = [
          ...allHypotheses()
            .filter((h) => h.accountId === p.accountId)
            .flatMap((h) => h.serviceIds),
          ...allServiceRelationships()
            .filter((s) => s.accountId === p.accountId)
            .map((s) => s.serviceId),
        ];
        return {
          id: p.id,
          title: p.identity.name,
          detail: `${p.identity.title} · ${p.identity.org}. ${p.commercial.whatWeNeed} ${p.commercial.bestRoute ?? ""}`,
          state: p.commercial.engagement,
          accountId: p.accountId,
          serviceIds: [...new Set(related)],
          href: p.accountId ? `/accounts/${p.accountId}` : undefined,
        };
      });
    case "delivery":
      return allServiceRelationships().map((s) => ({
        id: s.id,
        title: `${getAccount(s.accountId)?.name} · ${getService(s.serviceId)?.name}`,
        detail: s.note ?? "Review the account's Broadridge product relationship and next action.",
        state: `${s.health} · ${s.lifecycle}${s.renewalInDays !== undefined ? ` · renewal in ${s.renewalInDays} days` : ""}`,
        accountId: s.accountId,
        serviceIds: [s.serviceId],
        href: `/accounts/${s.accountId}`,
      }));
    case "knowledge-graph":
      return allFunds().map((f) => ({
        id: f.id,
        title: f.name,
        detail: `${getAccount(f.accountId)?.name} → ${f.structure} → ${f.assetClass}. Domicile: ${getMarket(f.domicileMarketId)?.name}. Distribution: ${f.hostMarketIds.map((m) => getMarket(m)?.name).join(", ")}.`,
        state: `Illustrative range · ${f.shareClasses} share classes`,
        accountId: f.accountId,
        marketIds: f.hostMarketIds,
        serviceIds: ["svc-registration", "svc-fcs", "svc-funddata"],
        href: `/accounts/${f.accountId}`,
      }));
    case "evidence":
      return allEvidence().map((e) => ({
        id: e.id,
        title: e.statement,
        detail: `Confidence: ${e.confidence}. Sources: ${sourcesForEvidence(e)
          .map((s) => `${s.publisher}: ${s.label}`)
          .join("; ")}. Updated ${e.lastUpdated}.`,
        state: `Illustrative record · ${e.state}`,
        accountId: getAccount(e.matchedToId)?.id,
        href: getAccount(e.matchedToId) ? `/accounts/${e.matchedToId}` : undefined,
      }));
    case "tasks":
      return allTasks().map((t) => ({
        id: t.id,
        title: t.title,
        detail: `${t.whyThisMatters} ${t.blockedBy ? `Blocked by: ${t.blockedBy}` : ""}`,
        state: `${t.status} · ${t.dueLabel}`,
        accountId: t.accountId,
        href: `/accounts/${t.accountId}`,
      }));
    default:
      return allEvents().map((e) => ({
        id: e.id,
        title: e.headline,
        detail: `${e.detail} Research hypothesis: ${e.commercialInterpretation}`,
        state: `Illustrative event · ${e.effectiveDate}`,
        accountId: e.accountId,
        marketIds: e.hostMarketIds,
        serviceIds: e.relevantServiceIds,
        href: `/accounts/${e.accountId}`,
      }));
  }
}

const PRODUCT_FILTER_MODULES = new Set<ModuleId | "tasks">([
  "growth",
  "accounts",
  "deals",
  "delivery",
  "markets",
  "global",
  "people",
]);

export function ModuleWorkspace({
  id,
  filters = {},
}: {
  id: ModuleId | "tasks";
  filters?: Record<string, string | string[] | undefined>;
}) {
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("all");
  const [productFilter, setProductFilter] = useState("all");
  const [clearContext, setClearContext] = useState(false);
  const Dashboard = id === "tasks" ? null : DASHBOARDS[id];
  const cells = portfolioGrid();
  const focused = String(filters.focus ?? filters.person ?? "");
  const market = String(filters.market ?? "");
  const serviceFromUrl = String(filters.service ?? "");
  const context = !clearContext && (focused || market || serviceFromUrl);
  const activeProduct = context && serviceFromUrl ? serviceFromUrl : productFilter;

  const baseRows = useMemo(() => rowsFor(id), [id]);
  const productOptions = useMemo(() => {
    const ids = new Set<string>();
    for (const r of baseRows) for (const s of r.serviceIds ?? []) ids.add(s);
    return BROADRIDGE_SERVICES.filter((s) => ids.has(s.id));
  }, [baseRows]);

  const rows = baseRows.filter((r) => {
    if (context && focused && r.id !== focused && r.accountId !== focused) return false;
    if (context && market && !r.marketIds?.includes(market)) return false;
    if (context && serviceFromUrl && !r.serviceIds?.includes(serviceFromUrl)) return false;
    if (
      !context &&
      activeProduct !== "all" &&
      PRODUCT_FILTER_MODULES.has(id) &&
      !r.serviceIds?.includes(activeProduct)
    ) {
      return false;
    }
    const cell = cells.find((c) => c.id === r.accountId);
    if (health === "opportunity" && !cell?.opportunity) return false;
    if (health === "risk" && (!cell || cell.health >= 0.5)) return false;
    if (health === "healthy" && (!cell || cell.health < 0.72)) return false;
    return `${r.title} ${r.detail} ${r.state}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      <p className="mb-4 text-xs text-[var(--text-3)]">
        Broadridge Growth Intelligence MVP · illustrative book to test a range of fund-services
        products across commercial scenarios
      </p>
      {Dashboard && !context && (
        <div className="gi-module-dashboard overflow-x-auto rounded-3xl border border-white/90 bg-white/70 p-5 shadow-[0_20px_50px_-30px_rgba(10,37,64,0.35)] backdrop-blur-md">
          <div className="h-[550px] min-w-[1080px]">
            <Dashboard />
          </div>
        </div>
      )}
      <PublicFunds />
      <section className="mt-8" aria-label="Explore records">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="mr-auto text-xl font-semibold">
            Explore records <span className="text-sm text-[var(--text-3)]">({rows.length})</span>
          </h2>
          {context && (
            <button
              className="rounded-full border px-4 py-2 text-sm"
              onClick={() => setClearContext(true)}
            >
              Clear selected context ×
            </button>
          )}
          <input
            aria-label="Search records"
            placeholder="Search this workspace…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm"
          />
          {PRODUCT_FILTER_MODULES.has(id) && productOptions.length > 0 && (
            <select
              aria-label="Broadridge product filter"
              className="rounded-full border bg-white px-4 py-2 text-sm"
              value={context && serviceFromUrl ? serviceFromUrl : productFilter}
              disabled={Boolean(context && serviceFromUrl)}
              onChange={(e) => setProductFilter(e.target.value)}
            >
              <option value="all">All Broadridge products</option>
              {productOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.short}
                </option>
              ))}
            </select>
          )}
          {(id === "accounts" || id === "delivery") && (
            <select
              aria-label="Account health filter"
              className="rounded-full border bg-white px-4 py-2 text-sm"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
            >
              <option value="all">All accounts</option>
              <option value="risk">Needs attention</option>
              <option value="healthy">Healthy</option>
              <option value="opportunity">Opportunity spotted</option>
            </select>
          )}
        </div>
        {!rows.length && (
          <p className="gi-record">
            No records match this selection. Clear the context or adjust your search.
          </p>
        )}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => {
            const cell = cells.find((c) => c.id === r.accountId);
            const products = (r.serviceIds ?? [])
              .map((sid) => getService(sid))
              .filter(Boolean);
            return (
              <article
                key={r.id}
                id={r.id}
                className={`gi-record ${id === "accounts" && cell?.opportunity ? "gi-cell-opp" : ""}`}
                style={
                  id === "accounts" && cell
                    ? { borderTop: `4px solid ${healthColor(cell.health, 1)}` }
                    : undefined
                }
              >
                <p className="gi-eyebrow">{r.state.replaceAll("-", " ")}</p>
                <h3 className="my-2 text-lg font-semibold">{r.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-3)]">{r.detail}</p>
                {products.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {products.map((s) => (
                      <span
                        key={s!.id}
                        className="rounded-full border border-[rgba(0,31,90,0.12)] bg-[var(--brand-wash)] px-2.5 py-1 text-[11px] font-semibold text-[var(--brand)]"
                      >
                        {s!.short}
                      </span>
                    ))}
                  </div>
                )}
                {r.href && (
                  <Link
                    href={r.href}
                    className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
                  >
                    {id === "deals" ? "Review deal" : "Open account story"} →
                  </Link>
                )}
              </article>
            );
          })}
        </div>
        {id === "knowledge-graph" && (
          <div className="mt-5 flex flex-wrap gap-2">
            {allAccounts().map((a) => (
              <Link className="rounded-full border px-3 py-2 text-xs" key={a.id} href={`/accounts/${a.id}`}>
                {a.name} →
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
