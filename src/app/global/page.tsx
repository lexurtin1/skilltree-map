import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function GlobalPage() {
  const mod = MODULE_BY_ID["global"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
