import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function EvidencePage() {
  const mod = MODULE_BY_ID["evidence"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
