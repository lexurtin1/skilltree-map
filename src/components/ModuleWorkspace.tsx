"use client";

import Link from "next/link";
import { useState } from "react";
import { DASHBOARDS } from "./control-centres/dashboards";
import { PublicFunds } from "./PublicFunds";
import type { ModuleId } from "@/lib/gi/metrics";
import { portfolioGrid } from "@/lib/gi/portfolio-view";
import { healthColor } from "@/lib/gi/spectrum";
import { allAccounts, allFunds, allPeople, allEvents, allEvidence, allHypotheses, allOpportunities, allServiceRelationships, allTasks, getAccount, getService, getMarket, sourcesForEvidence } from "@/lib/gi/select";

type Row = { id: string; title: string; detail: string; state: string; href?: string; accountId?: string; marketIds?: string[]; serviceIds?: string[] };
function rowsFor(id: ModuleId | "tasks"): Row[] {
  switch (id) {
    case "accounts": return portfolioGrid().map(a => ({ id:a.id, title:a.label, detail:`${a.whatChanged} Next: ${getAccount(a.id)?.whatToDoNext}`, state:`${a.healthWord}${a.opportunity ? " · Opportunity spotted" : ""}`, href:a.href, accountId:a.id }));
    case "growth": return allHypotheses().map(h => ({ id:h.id, title:h.title, detail:`${h.whyItMayMatter} Still to learn: ${h.stillToLearn.join("; ")}`, state:h.state, accountId:h.accountId, serviceIds:h.serviceIds, href:`/accounts/${h.accountId}` }));
    case "deals": return allOpportunities().map(d => ({ id:d.id, title:d.name, detail:d.statement, state:`${d.stage} · £${d.value.toLocaleString("en-GB")} · ${d.mainGap}`, accountId:d.accountId, href:`/deals/${d.id}` }));
    case "people": return allPeople().map(p => ({ id:p.id, title:p.identity.name, detail:`${p.identity.title} · ${p.identity.org}. ${p.commercial.whatWeNeed} ${p.commercial.bestRoute ?? ""}`, state:p.commercial.engagement, accountId:p.accountId, href:p.accountId ? `/accounts/${p.accountId}` : undefined }));
    case "delivery": return allServiceRelationships().map(s => ({ id:s.id, title:`${getAccount(s.accountId)?.name} · ${getService(s.serviceId)?.name}`, detail:s.note ?? "Review the account's service relationship and next action.", state:`${s.health} · ${s.lifecycle}${s.renewalInDays !== undefined ? ` · renewal in ${s.renewalInDays} days` : ""}`, accountId:s.accountId, serviceIds:[s.serviceId], href:`/accounts/${s.accountId}` }));
    case "knowledge-graph": return allFunds().map(f => ({ id:f.id, title:f.name, detail:`${getAccount(f.accountId)?.name} → ${f.structure} → ${f.assetClass}. Domicile: ${getMarket(f.domicileMarketId)?.name}. Distribution: ${f.hostMarketIds.map(m=>getMarket(m)?.name).join(", ")}.`, state:`Illustrative range · ${f.shareClasses} share classes`, accountId:f.accountId, marketIds:f.hostMarketIds, href:`/accounts/${f.accountId}` }));
    case "evidence": return allEvidence().map(e => ({ id:e.id, title:e.statement, detail:`Confidence: ${e.confidence}. Sources: ${sourcesForEvidence(e).map(s=>`${s.publisher}: ${s.label}`).join("; ")}. Updated ${e.lastUpdated}.`, state:`Illustrative record · ${e.state}`, accountId:getAccount(e.matchedToId)?.id, href:getAccount(e.matchedToId) ? `/accounts/${e.matchedToId}` : undefined }));
    case "tasks": return allTasks().map(t => ({ id:t.id, title:t.title, detail:`${t.whyThisMatters} ${t.blockedBy ? `Blocked by: ${t.blockedBy}` : ""}`, state:`${t.status} · ${t.dueLabel}`, accountId:t.accountId, href:`/accounts/${t.accountId}` }));
    default: return allEvents().map(e => ({ id:e.id, title:e.headline, detail:`${e.detail} Research hypothesis: ${e.commercialInterpretation}`, state:`Illustrative event · ${e.effectiveDate}`, accountId:e.accountId, marketIds:e.hostMarketIds, serviceIds:e.relevantServiceIds, href:`/accounts/${e.accountId}` }));
  }
}

export function ModuleWorkspace({ id, filters = {} }: { id: ModuleId | "tasks"; filters?: Record<string, string | string[] | undefined> }) {
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState("all");
  const [clearContext, setClearContext] = useState(false);
  const Dashboard = id === "tasks" ? null : DASHBOARDS[id];
  const cells = portfolioGrid();
  const focused = String(filters.focus ?? filters.person ?? "");
  const market = String(filters.market ?? "");
  const service = String(filters.service ?? "");
  const context = !clearContext && (focused || market || service);
  const rows = rowsFor(id).filter(r => {
    if (context && focused && r.id !== focused && r.accountId !== focused) return false;
    if (context && market && !r.marketIds?.includes(market)) return false;
    if (context && service && !r.serviceIds?.includes(service)) return false;
    const cell = cells.find(c=>c.id===r.accountId);
    if (health === "opportunity" && !cell?.opportunity) return false;
    if (health === "risk" && (!cell || cell.health >= 0.5)) return false;
    if (health === "healthy" && (!cell || cell.health < 0.72)) return false;
    return `${r.title} ${r.detail} ${r.state}`.toLowerCase().includes(query.toLowerCase());
  });
  return <>
    <p className="mb-4 text-xs text-[var(--text-3)]">Commercial workspace · illustrative client relationships, health and opportunities</p>
    {Dashboard && !context && <div className="gi-module-dashboard overflow-x-auto rounded-3xl border border-white bg-white/65 p-5 shadow-xl"><div className="h-[550px] min-w-[1080px]"><Dashboard /></div></div>}
    <PublicFunds />
    <section className="mt-8" aria-label="Explore records">
      <div className="mb-4 flex flex-wrap items-center gap-3"><h2 className="mr-auto text-xl font-semibold">Explore records <span className="text-sm text-[var(--text-3)]">({rows.length})</span></h2>
        {context && <button className="rounded-full border px-4 py-2 text-sm" onClick={()=>setClearContext(true)}>Clear selected context ×</button>}
        <input aria-label="Search records" placeholder="Search this workspace…" value={query} onChange={e=>setQuery(e.target.value)} className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm" />
        {(id === "accounts" || id === "delivery") && <select aria-label="Account health filter" className="rounded-full border bg-white px-4 py-2 text-sm" value={health} onChange={e=>setHealth(e.target.value)}><option value="all">All accounts</option><option value="risk">Needs attention</option><option value="healthy">Healthy</option><option value="opportunity">Opportunity spotted</option></select>}
      </div>
      {!rows.length && <p className="gi-record">No records match this selection. Clear the context or adjust your search.</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map(r => {
        const cell = cells.find(c=>c.id===r.accountId);
        return <article key={r.id} id={r.id} className={`gi-record ${id === "accounts" && cell?.opportunity ? "gi-cell-opp" : ""}`} style={id === "accounts" && cell ? { borderTop:`4px solid ${healthColor(cell.health,1)}` } : undefined}>
          <p className="gi-eyebrow">{r.state.replaceAll("-", " ")}</p><h3 className="my-2 text-lg font-semibold">{r.title}</h3><p className="text-sm leading-relaxed text-[var(--text-3)]">{r.detail}</p>
          {r.href && <Link href={r.href} className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">{id === "deals" ? "Review deal" : "Open account story"} →</Link>}
        </article>;
      })}</div>
      {id === "knowledge-graph" && <div className="mt-5 flex flex-wrap gap-2">{allAccounts().map(a=><Link className="rounded-full border px-3 py-2 text-xs" key={a.id} href={`/accounts/${a.id}`}>{a.name} →</Link>)}</div>}
    </section>
  </>;
}
