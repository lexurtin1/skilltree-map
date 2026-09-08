import { notFound, redirect } from "next/navigation";
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
  if (accountId === "acc-amundi") redirect("/client");
  if (accountId === "acc-nordea") redirect("/board");

  const account = getAccount(accountId);
  if (!account) notFound();

  return (
    <ModulePage label={account.name} question={account.story}>
      <AccountStory account={account} />
    </ModulePage>
  );
}
