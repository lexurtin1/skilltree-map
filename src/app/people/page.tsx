import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function PeoplePage() {
  const mod = MODULE_BY_ID["people"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
