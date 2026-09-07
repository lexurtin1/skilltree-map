"use client";

/** Next 16.3 exposes retry, as documented in the installed error.js guide. */
export default function ErrorView({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="h-full overflow-auto p-8" role="alert">
      <h1 className="text-xl text-[var(--brand)]">
        This view could not be loaded.
      </h1>
      <p className="mt-3 text-sm text-[var(--text-3)]">
        Account assessments are unavailable. Try again or use the module
        navigation.
      </p>
      <button
        className="mt-5 rounded bg-[var(--brand)] px-5 py-3 text-sm text-white"
        onClick={() => retry()}
      >
        Try again
      </button>
    </div>
  );
}
