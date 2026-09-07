import { notFound } from "next/navigation";
import { ModulePage } from "@/components/ModulePage";
import { getAccount, getOpportunity } from "@/lib/gi/select";
import Link from "next/link";

/** `params` is a Promise in Next 16 — synchronous access was removed. */
export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const deal = getOpportunity(dealId);
  if (!deal) notFound();
  const account = getAccount(deal.accountId);

  return (
    <ModulePage
      label={deal.name}
      question={`${account?.name ?? "Account"} — ${deal.statement}`}
    >
      <p className="mb-4 text-xs">Illustrative opportunity · £{deal.value.toLocaleString("en-GB")} · Target close {deal.closeDate}</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="gi-record"><p className="gi-eyebrow">Stage · {deal.stage}</p><h2 className="my-3 text-xl font-semibold">Best next action</h2><p>{deal.bestNextAction}</p><p className="mt-4 text-sm">Next mutual commitment: {deal.nextMutualCommitment ?? "Not yet agreed"}</p><Link className="mt-5 inline-block font-semibold underline" href={`/accounts/${deal.accountId}`}>Open account story →</Link></section>
        <section className="gi-record"><h2 className="mb-4 text-xl font-semibold">Deal health</h2>{Object.entries(deal.health).map(([name,value])=><div className="mb-3" key={name}><label className="mb-1 flex justify-between text-sm" htmlFor={`health-${name}`}>{name.replaceAll("-", " ")} <span>{Math.round(value*100)}%</span></label><meter id={`health-${name}`} min={0} max={1} low={0.4} high={0.7} optimum={1} value={value} className="w-full" /></div>)}</section>
        <section className="gi-record"><h2 className="mb-4 text-xl font-semibold">What is missing</h2><ul className="space-y-3">{deal.gaps.map(g=><li key={g} className="rounded-xl bg-[var(--state-attention-bg)] p-3 text-sm">{g.replaceAll("-", " ")}</li>)}</ul><p className="mt-4 text-sm">Last buyer activity: {deal.lastBuyerActivity}</p></section>
      </div>
    </ModulePage>
  );
}
