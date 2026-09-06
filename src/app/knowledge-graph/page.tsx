import { ModulePage } from "@/components/ModulePage";
import { MODULE_BY_ID } from "@/components/modules";

export default function KnowledgeGraphPage() {
  const mod = MODULE_BY_ID["knowledge-graph"];
  return <ModulePage label={mod.label} question={mod.question} />;
}
