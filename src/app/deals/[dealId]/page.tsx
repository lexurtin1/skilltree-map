import { notFound } from "next/navigation";
import { ModulePage } from "@/components/ModulePage";
import { getAccount, getOpportunity } from "@/lib/gi/select";

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
      phase="The deal detail page — six-stage timeline, segmented health, buying system, value case and the What is missing checklist — is built in a later phase. This deal's health components, gaps and evidence already exist in the shared ontology."
    />
  );
}
