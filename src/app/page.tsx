import { ControlCentres } from "@/components/control-centres/ControlCentres";

/**
 * Control Centres is the default route.
 *
 * The `?card=` deep link is resolved here rather than on the client. Reading it
 * on the server means the first paint already shows the linked card and the
 * client agrees with it — the alternative renders card one, then swaps, which
 * is both a hydration mismatch and a visible flicker.
 *
 * `searchParams` is a Promise in Next 16 — synchronous access was removed.
 */
export default async function ControlCentresPage({
  searchParams,
}: {
  searchParams: Promise<{ card?: string }>;
}) {
  const { card } = await searchParams;
  return <ControlCentres initialCard={card ?? null} />;
}
