import { redirect } from "next/navigation";

/** Deep links land on the Accounts workspace with the dossier selected. */
export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  redirect(`/accounts?id=${encodeURIComponent(accountId)}`);
}
