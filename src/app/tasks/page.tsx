import { ModulePage } from "@/components/ModulePage";
import { ModuleWorkspace } from "@/components/ModuleWorkspace";
import { TASKS_MODULE } from "@/components/modules";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
 const mod = TASKS_MODULE;
 return <ModulePage label={mod.label} question={mod.question}><ModuleWorkspace id="tasks" filters={await searchParams} /></ModulePage>;
}
