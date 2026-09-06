import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function AccountsPage() {
  const mod = MODULE_BY_ID["accounts"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
