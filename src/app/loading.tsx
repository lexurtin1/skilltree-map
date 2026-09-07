export default function Loading() {
  return (
    <div className="h-full overflow-auto p-8" role="status" aria-busy="true">
      <h1 className="text-xl text-[var(--brand)]">Loading your view…</h1>
      <p className="mt-3 text-sm text-[var(--text-3)]">
        Account context and evidence will appear here. Navigation remains
        available.
      </p>
    </div>
  );
}
