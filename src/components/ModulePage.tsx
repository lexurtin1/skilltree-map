import Link from "next/link";
import { Panel } from "./ui/Panel";
import { ArrowLeftIcon } from "./ui/Icons";

/**
 * The shared module page frame.
 *
 * Every module gets the same header shape — breadcrumb, name, and the single
 * question the module exists to answer. That question is not decoration: it is
 * the test each module has to pass, and keeping it on the page keeps the build
 * honest as the modules fill in.
 */
export function ModulePage({
  label,
  question,
  children,
  phase,
}: {
  label: string;
  question: string;
  children?: React.ReactNode;
  phase?: string;
}) {
  return (
    <div className="gi-scroll gi-module-page h-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-8">
        <nav className="mb-4 flex items-center gap-1.5 text-[11.5px] text-[var(--text-4)]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded px-1 py-0.5 font-medium transition-colors hover:text-[var(--brand)]"
          >
            <ArrowLeftIcon size={12} />
            All modules
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[var(--text-3)]">{label}</span>
        </nav>

        <header className="mb-5">
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[var(--text-1)]">
            {label}
          </h1>
          <p className="mt-1.5 max-w-[76ch] text-[13.5px] leading-relaxed text-[var(--text-3)]">
            {question}
          </p>
        </header>

        {children ?? (
          <Panel className="px-6 py-10 text-center">
            <p className="text-[13px] font-semibold text-[var(--text-2)]">In development</p>
            <p className="mx-auto mt-1.5 max-w-[52ch] text-[12.5px] leading-relaxed text-[var(--text-3)]">
              {phase ??
                "This module is built in a later phase. Its data model, metrics and state language are already live — the gallery panel for it is reading real values from the shared ontology now."}
            </p>
          </Panel>
        )}
      </div>
    </div>
  );
}
