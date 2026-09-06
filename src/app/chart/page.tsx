import { BrandLogo } from "@/components/BrandLogo";

export default function ChartPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[var(--bg)] px-6 text-center">
      <div className="mb-8">
        <BrandLogo variant="lockup" height={48} />
      </div>
      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[var(--copper)]">
        AUTONOMY MATRIX
      </p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--ivory)] sm:text-4xl">
        The AI rollout
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-[var(--ivory-2)]">
        Foundation → Capture → Generate → Orchestrate across every domain.
      </p>
      <p className="mt-8 rounded-md border border-[var(--line)] bg-[var(--bg-3)] px-4 py-2 text-[12px] text-[var(--ink-2)] shadow-sm">
        In development · human-led · assisted · fully autonomous grid
      </p>
    </div>
  );
}
