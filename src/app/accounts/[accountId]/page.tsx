import { notFound } from "next/navigation";
import { ModulePage } from "@/components/ModulePage";
import { getAccount } from "@/lib/gi/select";
import { AccountStory } from "@/components/AccountStory";

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
    ><AccountStory account={account} /></ModulePage>
  );
}
