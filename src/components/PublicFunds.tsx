import Link from "next/link";
import { PUBLIC_FUNDS } from "@/lib/gi/public-funds";

export function PublicFunds({ accountId }: { accountId?: string }) {
  const funds = PUBLIC_FUNDS.filter(f => !accountId || f.accountId === accountId);
  if (!funds.length) return null;
  return <section className="mt-7" aria-label="Public fund research">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div><p className="gi-eyebrow">Issuer-sourced fund facts</p><h2 className="text-xl font-semibold">Real funds. Different distribution stories.</h2></div>
      <p className="text-xs text-[var(--text-3)]">Snapshots checked 7 Sep 2026 · Open a fund for sources</p>
    </div>
    <div className="grid gap-4 md:grid-cols-3">{funds.map(f => <Link key={f.id} href={`/funds/${f.id}`} className="gi-record transition-transform hover:-translate-y-1">
      <p className="gi-eyebrow">{f.publisher}</p><h3 className="mt-2 text-lg font-semibold">{f.name}</h3>
      <p className="my-3 text-sm text-[var(--text-3)]">{f.scope}</p>
      <p className="text-3xl font-semibold tabular-nums">{f.holdings.toLocaleString("en-GB")} <span className="text-xs font-normal">holdings</span></p>
      <p className="mt-1 text-xs text-[var(--text-3)]">As at {f.holdingsDate}</p>
      <p className="mt-5 text-sm font-semibold">Explore the fund →</p>
    </Link>)}</div>
  </section>;
}
