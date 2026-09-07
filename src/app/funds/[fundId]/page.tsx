import { notFound } from "next/navigation";
import Link from "next/link";
import { ModulePage } from "@/components/ModulePage";
import { PublicFunds } from "@/components/PublicFunds";
import { PUBLIC_FUNDS } from "@/lib/gi/public-funds";
import { getAccount } from "@/lib/gi/select";

export default async function FundPage({ params }: { params: Promise<{ fundId: string }> }) {
  const { fundId } = await params;
  const fund = PUBLIC_FUNDS.find(f => f.id === fundId);
  if (!fund) notFound();
  return <ModulePage label={fund.name} question={fund.scope}>
    <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
      <section className="gi-record"><p className="gi-eyebrow">Public fund profile</p>
        <h2 className="my-3 text-2xl font-semibold">The story behind the portfolio</h2><p className="leading-relaxed">{fund.story}</p>
        <dl className="mt-6 grid grid-cols-2 gap-5">{Object.entries({ ISIN: fund.isin, Benchmark: fund.benchmark, Income: fund.income, "Share-class currency": fund.currency, Holdings: `${fund.holdings.toLocaleString("en-GB")} as at ${fund.holdingsDate}`, "Total expense ratio": fund.fee ?? "Not captured in this snapshot" }).map(([k,v]) => <div key={k}><dt className="gi-eyebrow">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>)}</dl>
      </section>
      <aside className="gi-record"><p className="gi-eyebrow">Research prompt · inference</p><h2 className="my-3 text-xl font-semibold">A reason to learn more</h2><p className="leading-relaxed">{fund.question}</p><p className="mt-4 text-sm text-[var(--text-3)]">This is a discovery question, not evidence of a Broadridge relationship or buying intent.</p>
        {getAccount(fund.accountId) && <Link className="mt-5 inline-block font-semibold underline" href={`/accounts/${fund.accountId}`}>Explore the illustrative account →</Link>}
      </aside>
    </div>
    <section className="gi-record mt-5"><h2 className="font-semibold">Source and freshness</h2><p className="my-2 text-sm">Issuer-page snapshot checked 7 September 2026. Holdings have their own dates above. Prices, performance and live NAV are not included.</p><a className="font-semibold underline" href={fund.source} target="_blank" rel="noreferrer">{fund.publisher} — official product page ↗</a></section>
    <PublicFunds />
  </ModulePage>;
}
