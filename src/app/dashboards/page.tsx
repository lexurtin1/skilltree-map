import { BrandLogo } from "@/components/BrandLogo";

export default function DashboardsPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[var(--bg)] px-6 text-center">
      <div className="mb-8 rounded-md bg-[#0a0a0a] px-6 py-4">
        <BrandLogo variant="lockup" height={40} />
      </div>
      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[var(--copper)]">
        THE OUTPUT LAYER
      </p>
      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[var(--ivory)] sm:text-4xl">
        Command Centers
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-[var(--ivory-2)]">
        What each domain looks like when the work runs itself.
      </p>
      <p className="mt-8 rounded-md border border-[var(--line)] bg-[var(--bg-3)] px-4 py-2 text-[12px] text-[var(--ink-2)] shadow-sm">
        In development · live dashboard views by domain
      </p>
    </div>
  );
}
