/**
 * The quantitative forms.
 *
 * A beeswarm where the shape of a distribution is the point, a funnel where the
 * question is what survives each stage, a horizon where the axis is time, and
 * the two small marks — sparkline and ranked bars — that support a headline
 * figure without becoming the subject.
 *
 * Mark specs follow the data-viz rules: thin strokes, rounded data-ends
 * anchored to the baseline, a 2px surface gap between adjacent fills, a 2px
 * surface ring where marks overlap, recessive axes, and direct labels only on
 * the few marks that carry the story. Text always wears a text token; the
 * coloured mark beside it carries identity.
 *
 * These carry no hover layer, deliberately. They live inside a panel that is
 * itself a single link, and a tooltip inside a click target fights the gesture.
 * Interactive charts belong on the module pages, where the chart is the subject
 * rather than a preview of one.
 */
import type { ModulePalette } from "@/lib/gi/palette";
import type { BarRow, Point } from "@/lib/gi/series";

/* ── Beeswarm ─────────────────────────────────────────────────────────────── */

export interface SwarmPoint {
  id: string;
  label: string;
  /** Position on the axis. */
  x: number;
  /** Drawn filled rather than hollow. Used for "we already work here". */
  filled?: boolean;
  /** Direct-labelled. Only ever set on a handful. */
  called?: boolean;
}

/**
 * One axis, one dot per account, stacked where they collide.
 *
 * A histogram would answer "how many are around 60"; a beeswarm answers "where
 * does my portfolio actually sit", which is the question a seller has. Nothing
 * is binned away, and the individual account survives as an individual mark.
 */
export function Beeswarm({
  points,
  palette,
  domain = [0, 100],
  bands,
  width = 428,
  height = 122,
}: {
  points: SwarmPoint[];
  palette: ModulePalette;
  domain?: [number, number];
  /** Shaded regions behind the axis, e.g. the priority bands. */
  bands?: Array<{ from: number; to: number; label: string }>;
  width?: number;
  height?: number;
}) {
  const padX = 6;
  /* Rows reserved at the top of the plot for the callout labels. */
  const LABEL_H = 12;
  const LABEL_ROWS = points.filter((p) => p.called).length;
  const bandTop = LABEL_ROWS * LABEL_H + 2;
  const baseline = height - 22;
  const r = 3.6;
  const scale = (v: number) =>
    padX + ((v - domain[0]) / (domain[1] - domain[0])) * (width - padX * 2);

  /* Lowest free lane, walking left to right. Deterministic, so the swarm looks
     identical on the server and in the browser. */
  const placed: Array<SwarmPoint & { cx: number; cy: number }> = [];
  const lanes: number[] = [];
  for (const p of [...points].sort((a, b) => a.x - b.x)) {
    const cx = scale(p.x);
    let lane = 0;
    while (lanes[lane] !== undefined && cx - lanes[lane] < r * 2.15) lane++;
    lanes[lane] = cx;
    placed.push({ ...p, cx, cy: baseline - 6 - lane * (r * 2.15) });
  }

  /* Left to right, so the leader lines never cross each other. */
  const called = placed.filter((p) => p.called).sort((a, b) => a.cx - b.cx);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {bands?.map((b) => (
        <g key={b.label}>
          <rect
            x={scale(b.from)}
            y={bandTop}
            width={scale(b.to) - scale(b.from) - 2}
            height={baseline - bandTop}
            rx={4}
            fill="rgba(0,31,90,0.032)"
          />
          {/* Inside the band, at the top: below it the label would sit on the
              axis numbers, and on the axis it would sit under the dots. */}
          <text x={scale(b.from) + 6} y={bandTop + 11} fontSize="8" fontWeight="600" fill="#a3aebd">
            {b.label.toUpperCase()}
          </text>
        </g>
      ))}

      <line x1={padX} y1={baseline} x2={width - padX} y2={baseline} stroke="rgba(0,31,90,0.14)" strokeWidth="1" />

      {placed.map((p) => (
        <g key={p.id}>
          {/* Surface ring, so touching dots never merge into a blob. */}
          <circle cx={p.cx} cy={p.cy} r={r + 1} fill="#ffffff" />
          <circle
            cx={p.cx}
            cy={p.cy}
            r={r}
            fill={p.filled ? palette.base : "#ffffff"}
            stroke={palette.ink}
            strokeWidth="1.2"
          />
        </g>
      ))}

      {/* Callouts.
          Named accounts sit close together at the high end of the axis, so their
          labels cannot go beside the dot — they collide. Each gets its own row
          at the top of the plot with a leader down to its mark, which is the
          standard way out and keeps the swarm itself uncluttered. */}
      {called.map((p, i) => {
        const ly = 8 + i * LABEL_H;
        /* Past the middle of the axis the label has to run back toward the
           centre, or it leaves the plot — and the accounts worth calling out
           are, by definition, the ones at the right-hand end. */
        const flip = p.cx > width * 0.52;
        return (
          <g key={`call-${p.id}`}>
            <path
              d={`M${p.cx},${p.cy - r - 2} L${p.cx},${ly + 3}`}
              stroke={palette.ink}
              strokeWidth="0.8"
              opacity="0.3"
              fill="none"
            />
            <text
              x={p.cx + (flip ? -5 : 5)}
              y={ly + 3}
              fontSize="8.5"
              fontWeight="600"
              textAnchor={flip ? "end" : "start"}
              fill="#0b1f33"
            >
              {p.label}
            </text>
          </g>
        );
      })}

      {[domain[0], (domain[0] + domain[1]) / 2, domain[1]].map((v) => (
        <text key={v} x={scale(v)} y={height - 6} fontSize="8" textAnchor="middle" fill="#8794a5">
          {v}
        </text>
      ))}
    </svg>
  );
}

/* ── Funnel ───────────────────────────────────────────────────────────────── */

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  display: string;
  count: number;
}

/**
 * Value surviving each stage of the deal model.
 *
 * Width is the value at that stage; it is not cumulative and does not pretend
 * to be a conversion rate, because the data is a snapshot of where deals sit
 * rather than a cohort followed through. Stages with nothing in them are drawn
 * as an empty rule rather than dropped — an empty stage is a finding.
 */
export function Funnel({
  stages,
  palette,
  width = 250,
  height = 232,
}: {
  stages: FunnelStage[];
  palette: ModulePalette;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...stages.map((s) => s.value), 1);
  const rowH = height / stages.length;
  const barH = rowH - 6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {stages.map((s, i) => {
        const w = (s.value / max) * (width - 118);
        const y = i * rowH;
        return (
          <g key={s.id}>
            <text x={0} y={y + barH / 2 + 3.4} fontSize="9" fill="#5b6b7c">
              {s.label}
            </text>
            {s.value > 0 ? (
              <rect x={58} y={y} width={Math.max(w, 3)} height={barH} rx={3} fill={palette.base} />
            ) : (
              <line x1={58} y1={y + barH / 2} x2={70} y2={y + barH / 2} stroke="rgba(0,31,90,0.2)" strokeWidth="1.5" />
            )}
            <text x={58 + Math.max(w, 14) + 6} y={y + barH / 2 + 3.4} fontSize="9" fontWeight="700" fill="#0b1f33">
              {s.display}
            </text>
            {s.count > 0 && (
              <text x={64} y={y + barH / 2 + 3.4} fontSize="8.5" fontWeight="700" fill="#ffffff" opacity={w > 26 ? 1 : 0}>
                {s.count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Renewal horizon ──────────────────────────────────────────────────────── */

export interface HorizonItem {
  id: string;
  label: string;
  /** Days from today. */
  day: number;
  /** Recurring value. Drives radius. */
  value: number;
  /** Rendered with a status ring and named in the legend, never colour alone. */
  atRisk?: boolean;
}

/**
 * Everything recurring, laid out on the time axis it actually renews on.
 *
 * A bar chart of renewals by month would hide that two of them fall in the same
 * week; the axis keeps the clustering visible, which is the thing that changes
 * what a seller does this month.
 */
export function Horizon({
  items,
  palette,
  days = 365,
  width = 428,
  height = 148,
}: {
  items: HorizonItem[];
  palette: ModulePalette;
  days?: number;
  width?: number;
  height?: number;
}) {
  const padL = 10;
  const padR = 10;
  const baseline = height - 20;
  const scale = (d: number) => padL + (d / days) * (width - padL - padR);
  const max = Math.max(...items.map((i) => i.value), 1);
  const radius = (v: number) => 3 + Math.sqrt(v / max) * 7;

  const placed: Array<HorizonItem & { cx: number; cy: number; r: number }> = [];
  const lanes: number[] = [];
  for (const item of [...items].sort((a, b) => a.day - b.day)) {
    const cx = scale(item.day);
    const r = radius(item.value);
    let lane = 0;
    while (lanes[lane] !== undefined && cx - lanes[lane] < 20) lane++;
    lanes[lane] = cx;
    placed.push({ ...item, cx, r, cy: baseline - 14 - lane * 24 });
  }

  const quarters = [0, 91, 182, 273, 365];
  const quarterLabel = ["now", "3m", "6m", "9m", "12m"];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {quarters.map((d, i) => (
        <g key={d}>
          <line x1={scale(d)} y1={6} x2={scale(d)} y2={baseline} stroke="rgba(0,31,90,0.07)" strokeWidth="1" />
          <text x={scale(d)} y={height - 6} fontSize="8" textAnchor={i === 0 ? "start" : "middle"} fill="#8794a5">
            {quarterLabel[i]}
          </text>
        </g>
      ))}
      <line x1={padL} y1={baseline} x2={width - padR} y2={baseline} stroke="rgba(0,31,90,0.14)" strokeWidth="1" />

      {placed.map((p) => (
        <g key={p.id}>
          {/* The stem is what puts the mark on the axis; without it the dots
              float and the reader loses the date. */}
          <line x1={p.cx} y1={baseline} x2={p.cx} y2={p.cy} stroke={palette.base} strokeWidth="1" opacity="0.4" />
          <circle cx={p.cx} cy={p.cy} r={p.r + 1.6} fill="#ffffff" />
          <circle
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={palette.base}
            stroke={p.atRisk ? "var(--state-risk)" : "none"}
            strokeWidth={p.atRisk ? 1.8 : 0}
          />
        </g>
      ))}
    </svg>
  );
}

/* ── Small supporting marks ───────────────────────────────────────────────── */

export function Sparkline({
  points,
  palette,
  width = 62,
  height = 18,
}: {
  points: Point[];
  palette: ModulePalette;
  width?: number;
  height?: number;
}) {
  if (points.length < 2) return <span style={{ display: "block", width, height }} />;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;

  const x = (i: number) => (i / (points.length - 1)) * (width - pad * 2) + pad;
  const y = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`)
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <path d={d} fill="none" stroke={palette.base} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* The latest point is the one that matters, so it is the only marker. */}
      <circle cx={x(points.length - 1)} cy={y(values[values.length - 1])} r={2} fill={palette.ink} />
    </svg>
  );
}

export function BarList({
  rows,
  palette,
  labelWidth = 86,
  ranked = false,
}: {
  rows: BarRow[];
  palette: ModulePalette;
  labelWidth?: number;
  /** Numbers each row, so it can be read against numbered marks elsewhere. */
  ranked?: boolean;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="flex flex-col gap-[7px]" aria-hidden>
      {rows.map((row, i) => (
        <div
          key={`${row.label}-${i}`}
          className="grid items-center gap-2"
          style={{ gridTemplateColumns: `${ranked ? "12px " : ""}${labelWidth}px 1fr auto` }}
        >
          {ranked && (
            <span
              className="text-[8.5px] font-bold leading-none tabular-nums"
              style={{ color: palette.ink, opacity: i < 4 ? 1 : 0.35 }}
            >
              {i + 1}
            </span>
          )}
          <span className="truncate text-[9.5px] leading-none text-[var(--text-3)]">{row.label}</span>
          <span className="relative block h-[7px] overflow-hidden rounded-full bg-[rgba(0,31,90,0.07)]">
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.max((row.value / max) * 100, row.value > 0 ? 3 : 0)}%`,
                background: palette.base,
              }}
            />
          </span>
          <span className="text-[9.5px] font-semibold leading-none tabular-nums text-[var(--text-2)]">
            {row.display}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A 0–1 composite, drawn as segments so a partial score is countable. */
export function Segments({ values, palette }: { values: number[]; palette: ModulePalette }) {
  return (
    <span className="flex gap-[2px]" aria-hidden>
      {values.map((v, i) => (
        <span
          key={i}
          className="h-[5px] flex-1 rounded-full"
          style={{ background: palette.base, opacity: 0.16 + Math.max(0, Math.min(1, v)) * 0.84 }}
        />
      ))}
    </span>
  );
}
