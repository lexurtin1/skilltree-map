import { ModulePage } from "@/components/ModulePage";

const LABELS: Record<string, string> = {
  "client-meeting": "Client meeting",
  "account-review": "Account review",
  "deal-review": "Deal review",
  "executive-introduction": "Executive introduction",
  "renewal-conversation": "Renewal conversation",
  "market-entry": "Market-entry discussion",
  "prospecting-outreach": "Prospecting outreach",
  rfp: "RFP",
};

/** `searchParams` is a Promise in Next 16 — synchronous access was removed. */
export default async function PreparePage({
  searchParams,
}: {
  searchParams: Promise<{ for?: string }>;
}) {
  const { for: entry } = await searchParams;
  const label = (entry && LABELS[entry]) ?? "Prepare me";

  return (
    <ModulePage
      label={label}
      question="What changed, what we know, what we should not assume, what we need to learn, why Broadridge may be relevant, who matters, and the best next step."
      phase="The preparation canvas and the post-meeting Capture what changed form are built in a later phase. The eight entry points and the ontology they draw on are already live."
    />
  );
}
