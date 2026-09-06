/**
 * The trust and state vocabulary, as components.
 *
 * These four are the product's most-repeated interface elements. They exist so
 * that "Verified fact" looks and reads identically in Growth, in a graph focus
 * tray, on a deal and inside an evidence drawer — a user should learn the
 * language once.
 *
 * Colour is always paired with a glyph and a word. Nothing here relies on hue
 * alone to carry its meaning.
 */
import {
  AlertIcon,
  CheckIcon,
  DashedIcon,
  DotIcon,
  GapIcon,
  LockIcon,
  QuestionIcon,
  RingIcon,
  ShieldIcon,
  SparkIcon,
  WarningIcon,
} from "./Icons";
import { CONFIDENCE, EVIDENCE_STATES, SOURCE_KINDS, STATE_MARKERS } from "@/lib/gi/taxonomy";
import type { Confidence, EvidenceState, Source, StateMarker } from "@/lib/gi/types";

const MARKER_GLYPH = {
  dot: DotIcon,
  ring: RingIcon,
  alert: AlertIcon,
  warning: WarningIcon,
  check: CheckIcon,
  dashed: DashedIcon,
} as const;

const EVIDENCE_GLYPH = {
  shield: ShieldIcon,
  spark: SparkIcon,
  question: QuestionIcon,
  gap: GapIcon,
} as const;

/* ── Status marker ────────────────────────────────────────────────────────── */

export function StatusMarker({
  marker,
  showLabel = true,
  size = "md",
  className = "",
}: {
  marker: StateMarker;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = STATE_MARKERS[marker];
  const Glyph = MARKER_GLYPH[meta.glyph];
  const iconSize = size === "sm" ? 11 : 13;

  if (!showLabel) {
    return (
      <span
        title={`${meta.label} — ${meta.description}`}
        className={`inline-flex items-center justify-center ${className}`}
        style={{ color: meta.color }}
      >
        <Glyph size={iconSize} />
        <span className="sr-only">{meta.label}</span>
      </span>
    );
  }

  return (
    <span
      title={meta.description}
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] font-semibold ${
        size === "sm" ? "text-[10px]" : "text-[11px]"
      } ${className}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      <Glyph size={iconSize} />
      {meta.label}
    </span>
  );
}

/**
 * The ring drawn around a node or card to carry its state. Dashed for
 * "uncertain", so an unvalidated item is legible without reading its colour.
 */
export function markerRingStyle(marker: StateMarker): React.CSSProperties {
  const meta = STATE_MARKERS[marker];
  if (marker === "quiet") return { boxShadow: `inset 0 0 0 1px var(--line)` };
  if (marker === "uncertain") {
    return { outline: `1.5px dashed ${meta.color}`, outlineOffset: "-1.5px" };
  }
  if (marker === "progress") {
    return { boxShadow: `inset 0 0 0 1px var(--line), inset 3px 0 0 0 ${meta.color}` };
  }
  return { boxShadow: `inset 0 0 0 1.5px ${meta.color}` };
}

/* ── Evidence state ───────────────────────────────────────────────────────── */

export function EvidenceStateLabel({
  state,
  size = "md",
  className = "",
}: {
  state: EvidenceState;
  size?: "sm" | "md";
  className?: string;
}) {
  const meta = EVIDENCE_STATES[state];
  const Glyph = EVIDENCE_GLYPH[meta.glyph];
  return (
    <span
      title={meta.definition}
      className={`inline-flex items-center gap-1.5 rounded px-2 py-[3px] font-semibold uppercase tracking-[0.06em] ${
        size === "sm" ? "text-[9.5px]" : "text-[10px]"
      } ${state === "still-to-learn" ? "border border-dashed" : ""} ${className}`}
      style={{
        color: meta.color,
        background: state === "still-to-learn" ? "transparent" : meta.bg,
        borderColor: state === "still-to-learn" ? meta.color : undefined,
      }}
    >
      <Glyph size={size === "sm" ? 10 : 11} />
      {meta.label}
    </span>
  );
}

/* ── Confidence ───────────────────────────────────────────────────────────── */

export function ConfidenceBadge({
  confidence,
  className = "",
}: {
  confidence: Confidence;
  className?: string;
}) {
  const meta = CONFIDENCE[confidence];
  const filled = confidence === "high" ? 3 : confidence === "medium" ? 2 : 1;
  return (
    <span
      title={`Confidence: ${meta.label}`}
      className={`inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[var(--text-3)] ${className}`}
    >
      <span className="flex items-end gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-[1px]"
            style={{
              height: `${5 + i * 2.5}px`,
              background: i < filled ? "var(--brand-bright)" : "var(--line)",
            }}
          />
        ))}
      </span>
      {meta.label} confidence
    </span>
  );
}

/* ── Source pill ──────────────────────────────────────────────────────────── */

export function SourcePill({
  source,
  className = "",
}: {
  source: Source;
  className?: string;
}) {
  const kind = SOURCE_KINDS[source.kind];
  return (
    <span
      title={`${source.label} — ${source.publisher}, ${source.published}`}
      className={`inline-flex max-w-full items-center gap-1.5 rounded border border-[var(--line)] bg-[var(--surface-1)] px-1.5 py-[2px] text-[10px] text-[var(--text-3)] ${className}`}
    >
      {source.restricted && <LockIcon size={10} className="shrink-0 text-[var(--text-4)]" />}
      <span className="truncate">{kind.label}</span>
    </span>
  );
}

/** "2 sources" — the compact form used beside a generated statement. */
export function SourceCount({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  if (count === 0) {
    return (
      <span
        title="No source record is attached to this statement."
        className={`text-[10.5px] font-medium text-[var(--ev-hypothesis)] ${className}`}
      >
        No source
      </span>
    );
  }
  return (
    <span
      title="Open the evidence drawer to read the underlying records."
      className={`inline-flex items-center gap-1 text-[10.5px] font-medium text-[var(--text-3)] ${className}`}
    >
      <ShieldIcon size={11} className="text-[var(--ev-fact)]" />
      {count} {count === 1 ? "source" : "sources"}
    </span>
  );
}

/* ── Freshness ────────────────────────────────────────────────────────────── */

export function LastUpdated({
  date,
  className = "",
}: {
  date: string;
  className?: string;
}) {
  return (
    <span className={`text-[10.5px] text-[var(--text-4)] ${className}`}>
      Last updated {formatDate(date)}
    </span>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Deterministic date formatting — no locale drift between server and client. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
