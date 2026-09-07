import { ModulePage } from "@/components/ModulePage";
import { ModuleWorkspace } from "@/components/ModuleWorkspace";
import { MODULE_BY_ID } from "@/components/modules";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
 const mod = MODULE_BY_ID["knowledge-graph"];
 return <ModulePage label={mod.label} question={mod.question}><ModuleWorkspace id="knowledge-graph" filters={await searchParams} /></ModulePage>;
}
