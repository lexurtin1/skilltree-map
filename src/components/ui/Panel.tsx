/**
 * Layout primitives.
 *
 * Depth in this product comes from layered white surfaces and hairline rules,
 * not from darkness. `Panel` is the single elevated surface every module
 * composes from, so elevation stays consistent across eleven screens.
 */

type Elevation = 0 | 1 | 2 | 3;

const SHADOW: Record<Elevation, string> = {
  0: "none",
  1: "var(--shadow-1)",
  2: "var(--shadow-2)",
  3: "var(--shadow-3)",
};

export function Panel({
  children,
  elevation = 1,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: React.ReactNode;
  elevation?: Elevation;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`rounded-lg border border-[var(--line)] bg-[var(--surface-1)] ${className}`}
      style={{ boxShadow: SHADOW[elevation] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** The small uppercase eyebrow used above every section title. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-4)] ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>}
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--text-1)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 max-w-[62ch] text-[13px] leading-relaxed text-[var(--text-3)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * A single figure with its label. Deliberately restrained — the product argues
 * against wallpapering a screen in KPI tiles, so these read as supporting
 * detail rather than as the point.
 */
export function MetricStat({
  value,
  label,
  size = "md",
  className = "",
}: {
  value: string;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const valueClass =
    size === "lg"
      ? "text-[24px]"
      : size === "sm"
        ? "text-[15px]"
        : "text-[19px]";
  const labelClass = size === "sm" ? "text-[10px]" : "text-[11px]";
  return (
    <div className={`min-w-0 ${className}`}>
      <p
        className={`${valueClass} font-semibold leading-none tracking-[-0.02em] text-[var(--text-1)] tabular-nums`}
      >
        {value}
      </p>
      <p className={`${labelClass} mt-1.5 leading-tight text-[var(--text-3)]`}>{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="text-[14px] font-semibold text-[var(--text-2)]">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-[46ch] text-[12.5px] leading-relaxed text-[var(--text-3)]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Buttons ──────────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost";

const BUTTON: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand)] text-white hover:bg-[var(--brand-bright)] border border-transparent",
  secondary:
    "bg-[var(--surface-1)] text-[var(--text-2)] border border-[var(--line)] hover:border-[var(--brand-bright)] hover:text-[var(--brand)]",
  ghost:
    "bg-transparent text-[var(--text-3)] border border-transparent hover:bg-[var(--surface-2)] hover:text-[var(--text-1)]",
};

export function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: "sm" | "md";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const pad = size === "sm" ? "px-2.5 py-1.5 text-[11.5px]" : "px-3.5 py-2 text-[12.5px]";
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-colors ${pad} ${BUTTON[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** The persistent demo-state marker. Not dismissible, by design. */
export function IllustrativeDataNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[10.5px] leading-tight text-[var(--text-4)] ${className}`}>
      Illustrative prototype data. Client relationships, opportunities and market activity
      shown are examples only.
    </p>
  );
}
