import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function MarketsPage() {
  const mod = MODULE_BY_ID["markets"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
