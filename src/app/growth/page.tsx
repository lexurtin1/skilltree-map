import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function GrowthPage() {
  const mod = MODULE_BY_ID["growth"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
