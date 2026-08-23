"use client";

import type { Department, Job } from "@/lib/tree";
import { LEVEL_LABEL } from "@/lib/tree";

type SkillCardProps = {
  dept: Department;
  fnName: string;
  job: Job;
  onClose: () => void;
};

export function SkillCard({ dept, fnName, job, onClose }: SkillCardProps) {
  return (
    <aside
      data-ui
      className="absolute bottom-4 left-3 top-16 z-40 flex w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--glass)] shadow-[0_24px_80px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:left-4"
      style={{ ["--c" as string]: dept.color }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] px-5 pb-4 pt-5">
        <div className="min-w-0">
          <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-[var(--copper)]">
            {LEVEL_LABEL[job.level]}
          </p>
          <h2 className="text-[22px] font-semibold leading-tight text-[var(--ivory)]">
            {job.name}
          </h2>
          <p className="mt-1 text-[12px] text-[var(--ink-2)]">
            {dept.name} · {fnName}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[var(--ivory-2)] transition hover:border-[var(--copper)] hover:text-[var(--ivory)]"
        >
          ×
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <p className="mb-4 text-[13.5px] leading-relaxed text-[var(--ivory-2)]">
          {job.desc}
        </p>

        <div className="mb-4 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--copper)]">
            ↓
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] text-[var(--ivory-2)]">
              <b className="text-[var(--ivory)]">1 runnable skill file</b> · yours to download
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 text-[11px] font-bold text-[var(--copper)]"
          >
            Take it ↓
          </button>
        </div>

        <Section title="Breaks into">
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className="rounded border border-[rgba(233,228,214,0.25)] px-2 py-1 text-[11px] text-[var(--ivory-2)]"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>

        {job.tools.length > 0 && (
          <Section title="Wired into">
            <p className="text-[13px] text-[var(--ivory-2)]">
              {job.tools.join(" · ")}
            </p>
          </Section>
        )}

        {job.replaces && (
          <Section title="What it replaces">
            <p className="text-[13px] leading-relaxed text-[var(--ivory-2)]">
              {job.replaces}
            </p>
          </Section>
        )}

        {job.ladder && (
          <Section title="The ladder">
            <div className="space-y-2">
              {(
                [
                  ["manual", "HUMAN-LED"],
                  ["assisted", "HUMAN-ASSISTED"],
                  ["autonomous", "FULLY AUTONOMOUS"],
                ] as const
              ).map(([key, label]) => (
                <div
                  key={key}
                  className={`rounded-lg border px-3 py-2 ${
                    job.level === key
                      ? "border-[var(--copper)] bg-[rgba(197,139,95,0.08)]"
                      : "border-[var(--line)]"
                  }`}
                >
                  <p className="mb-0.5 text-[10px] font-bold tracking-[0.14em] text-[var(--ink-2)]">
                    {label}
                  </p>
                  <p className="text-[12.5px] leading-snug text-[var(--ivory-2)]">
                    {job.ladder![key]}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {job.human && (
          <Section title="The human">
            <p className="text-[13px] leading-relaxed text-[var(--ivory-2)]">
              {job.human}
            </p>
          </Section>
        )}

        {job.notes && (
          <Section title="Build notes">
            <p className="text-[13px] leading-relaxed text-[var(--ivory-2)]">
              {job.notes}
            </p>
          </Section>
        )}

        <Section title="Start here">
          <div className="flex items-center gap-2 text-[12px] text-[var(--ink-2)]">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: dept.color }}
            />
            Root of {dept.name} · click any node to explore
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-[var(--ink-3)]">
        {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}
