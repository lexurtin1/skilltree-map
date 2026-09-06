import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function DeliveryPage() {
  const mod = MODULE_BY_ID["delivery"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
