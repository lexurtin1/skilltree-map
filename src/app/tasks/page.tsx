import { ModulePage } from "@/components/ModulePage";
import { TASKS_MODULE } from "@/components/modules";

export default function TasksPage() {
  const mod = TASKS_MODULE;
  return <ModulePage label={mod.label} question={mod.question} />;
}
