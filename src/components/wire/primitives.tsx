import Link from "next/link";
import type { WireTagTone } from "@/lib/gi/wire-demo";

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: WireTagTone | "attention" | "quiet";
}) {
  return <span className={`wire-pill wire-pill--${tone}`}>{label}</span>;
}

export function SourceTags({ sources }: { sources: string[] }) {
  return (
    <div className="wire-sources">
      {sources.map((s) => (
        <span key={s} className="wire-source">
          {s}
        </span>
      ))}
    </div>
  );
}

export function DensePanel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`wire-panel ${className}`.trim()}>
      {title ? <h2 className="wire-panel__title">{title}</h2> : null}
      {children}
    </section>
  );
}

export function ActionButton({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`wire-btn ${primary ? "wire-btn--primary" : "wire-btn--secondary"}`}
    >
      {label}
    </Link>
  );
}

export function HoldCell({ state }: { state: string }) {
  return <span className={`wire-cell wire-cell--${state}`} aria-label={state} />;
}

export function EvidenceCellMark({ state }: { state: string }) {
  return <span className={`wire-ev wire-ev--${state}`} aria-label={state} />;
}
