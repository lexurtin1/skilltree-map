import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function DealsPage() {
  const mod = MODULE_BY_ID["deals"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
