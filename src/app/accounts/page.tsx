import { Suspense } from "react";
import { AccountsPage } from "@/components/accounts/AccountsPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading accounts…</div>}>
      <AccountsPage />
    </Suspense>
  );
}
