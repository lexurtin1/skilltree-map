export default function ChartPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-[11px] font-bold tracking-[0.22em] text-[var(--ink-3)]">
        AUTONOMY MATRIX
      </p>
      <h1
        className="mb-3 text-4xl text-[var(--ivory)] sm:text-5xl"
        style={{ fontFamily: "var(--font-serif), serif" }}
      >
        The AI rollout
      </h1>
      <p className="max-w-md text-[15px] leading-relaxed text-[var(--ivory-2)]">
        Foundation → Capture → Generate → Orchestrate across every department
      </p>
      <p className="mt-8 rounded-full border border-[var(--line)] bg-[var(--glass)] px-4 py-2 text-[12px] text-[var(--ink-2)] backdrop-blur-md">
        Coming soon · human-led · assisted · fully autonomous grid
      </p>
    </div>
  );
}
