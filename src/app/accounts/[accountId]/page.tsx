import { notFound } from "next/navigation";
import { ModulePage } from "@/components/ModulePage";
import { getAccount } from "@/lib/gi/select";

/** `params` is a Promise in Next 16 — synchronous access was removed. */
export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const account = getAccount(accountId);
  if (!account) notFound();

  return (
    <ModulePage
      label={account.name}
      question={account.story}
      phase="The account detail page — persistent What changed / Where we stand / What to do next header, four-lane activity timeline, Still to learn, and the Services relationship picture — is built in the next phase. This account's full record already exists in the shared ontology."
    />
  );
}
