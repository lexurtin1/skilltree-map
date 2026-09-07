import Link from "next/link";
import type { Account } from "@/lib/gi/types";
import { eventsForAccount, fundsForAccount, opportunitiesForAccount, peopleForAccount, serviceRelationshipsForAccount, getService } from "@/lib/gi/select";
import { PublicFunds } from "./PublicFunds";

export function AccountStory({ account: a }: { account: Account }) {
  return <>
    <p className="mb-4 text-xs text-[var(--text-3)]">Illustrative account scenario · Health: {a.health} · Relationship: {a.relationship.replaceAll("-", " ")}</p>
    <div className="grid gap-4 lg:grid-cols-3">{[["What changed", a.whatChanged], ["Where we stand", a.whereWeStand], ["What to do next", a.whatToDoNext]].map(([title,detail])=><section key={title} className="gi-record"><p className="gi-eyebrow">{title}</p><p className="mt-3 text-lg leading-relaxed">{detail}</p></section>)}</div>
    <PublicFunds accountId={a.id} />
    <div className="mt-6 grid gap-5 lg:grid-cols-2">
      <section className="gi-record"><h2 className="mb-4 text-xl font-semibold">Activity and signals</h2>{eventsForAccount(a.id).map(e=><div key={e.id} className="mb-4 border-l-2 border-[var(--brand)] pl-4"><p className="gi-eyebrow">{e.effectiveDate} · Illustrative signal</p><h3 className="my-1 font-semibold">{e.headline}</h3><p className="text-sm leading-relaxed">{e.detail}</p></div>)}{!eventsForAccount(a.id).length && <p>No recorded activity for this account.</p>}</section>
      <section className="gi-record"><h2 className="mb-4 text-xl font-semibold">Still to learn</h2><ul className="space-y-3">{a.stillToLearn.map(x=><li key={x} className="border-b border-[var(--line)] pb-3 text-sm">{x}</li>)}</ul><h2 className="mb-3 mt-6 text-xl font-semibold">Service relationships</h2>{serviceRelationshipsForAccount(a.id).map(s=><p key={s.id} className="mb-3 text-sm"><strong>{getService(s.serviceId)?.name}</strong> · {s.health} · {s.lifecycle}<br/>{s.note}</p>)}{!serviceRelationshipsForAccount(a.id).length && <p className="text-sm">No service relationships recorded.</p>}</section>
      <section className="gi-record"><h2 className="mb-4 text-xl font-semibold">Illustrative fund footprint</h2>{fundsForAccount(a.id).map(f=><Link key={f.id} className="mb-3 block rounded-xl border border-[var(--line)] p-4" href={`/knowledge-graph?focus=${f.id}`}><strong>{f.name} →</strong><p className="mt-1 text-sm">{f.structure} · {f.shareClasses} share classes · {f.hostMarketIds.length} host markets</p></Link>)}{!fundsForAccount(a.id).length && <p>No fund ranges recorded.</p>}</section>
      <section className="gi-record"><h2 className="mb-4 text-xl font-semibold">Opportunities and people</h2>{opportunitiesForAccount(a.id).map(d=><Link key={d.id} className="mb-4 block font-semibold underline" href={`/deals/${d.id}`}>{d.name} →</Link>)}{peopleForAccount(a.id).map(p=><Link key={p.id} className="mb-3 block text-sm" href={`/people?person=${p.id}`}><strong>{p.identity.name} →</strong><br/>{p.identity.title}</Link>)}{!opportunitiesForAccount(a.id).length && !peopleForAccount(a.id).length && <p>No opportunities or contacts recorded.</p>}</section>
    </div>
  </>;
}
