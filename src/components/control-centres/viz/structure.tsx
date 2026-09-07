/**
 * The forms that draw structure rather than quantity.
 *
 * A treemap for a portfolio, because a portfolio is a whole divided into parts.
 * A network for the ontology, because the ontology's claim is that everything
 * connects. A radial graph for a buying group, because a buying group has a
 * centre and orbits. A flow for provenance, because evidence travels from a
 * source, through a state, to a use — and that journey is the product's whole
 * argument.
 *
 * Every layout here is deterministic: fixed input order in, identical geometry
 * out, on the server and in the browser.
 */
import type { ModulePalette } from "@/lib/gi/palette";
import { squarifyLayout } from "@/lib/gi/squarify";

/* ── Treemap ──────────────────────────────────────────────────────────────── */

export interface TreemapCell {
  id: string;
  label: string;
  value: number;
  /** Fill. Comes from a state token, not from the module hue. */
  tone: string;
  /** Second line, only drawn where the cell is big enough to hold it. */
  note?: string;
}

export function Treemap({
  cells,
  width = 430,
  height = 250,
}: {
  cells: TreemapCell[];
  width?: number;
  height?: number;
}) {
  const laid = squarifyLayout(cells, 0, 0, width, height);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {laid.map((c) => {
        /* A 2px surface gap between cells, so adjacent fills never touch. */
        const w = Math.max(c.w - 2, 0);
        const h = Math.max(c.h - 2, 0);
        const roomy = w > 52 && h > 26;
        return (
          <g key={c.id}>
            <rect x={c.x + 1} y={c.y + 1} width={w} height={h} rx={5} fill={c.tone} />
            {roomy && (
              <text x={c.x + 8} y={c.y + 16} fontSize="10" fontWeight="600" fill="#0b1f33">
                {c.label.length > Math.floor(w / 6) ? `${c.label.slice(0, Math.floor(w / 6))}…` : c.label}
              </text>
            )}
            {roomy && c.note && h > 40 && (
              <text x={c.x + 8} y={c.y + 29} fontSize="8.5" fill="#5b6b7c">
                {c.note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Network ──────────────────────────────────────────────────────────────── */

export interface NetworkNode {
  id: string;
  label: string;
  /** Count of objects of this class. Drives radius. */
  value: number;
  /** Unit-circle position, hand-placed so the graph is stable and legible. */
  x: number;
  y: number;
  /** The hub is drawn filled; everything else is drawn as a ring. */
  hub?: boolean;
}

export interface NetworkLink {
  from: string;
  to: string;
  label: string;
}

/**
 * A node-link diagram with a fixed layout.
 *
 * A force simulation would settle somewhere different on every render and
 * differently again on the server, and the ontology's shape is known — so the
 * positions are authored. What is read from the data is what varies: the size
 * of each class and the relationships that actually exist between them.
 */
export function Network({
  nodes,
  links,
  palette,
  width = 430,
  height = 250,
}: {
  nodes: NetworkNode[];
  links: NetworkLink[];
  palette: ModulePalette;
  width?: number;
  height?: number;
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const px = (n: NetworkNode) => width / 2 + n.x * (width / 2 - 34);
  const py = (n: NetworkNode) => height / 2 + n.y * (height / 2 - 26);
  const max = Math.max(...nodes.map((n) => n.value), 1);
  const radius = (n: NetworkNode) => 6 + Math.sqrt(n.value / max) * 15;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      <g stroke={palette.base} strokeWidth="1" opacity="0.34">
        {links.map((l, i) => {
          const a = byId.get(l.from);
          const b = byId.get(l.to);
          if (!a || !b) return null;
          return <line key={i} x1={px(a)} y1={py(a)} x2={px(b)} y2={py(b)} />;
        })}
      </g>

      {nodes.map((n) => {
        const r = radius(n);
        return (
          <g key={n.id}>
            {/* A 2px surface ring, so an edge passing behind a node reads as behind it. */}
            <circle cx={px(n)} cy={py(n)} r={r + 2} fill="#ffffff" />
            <circle
              cx={px(n)}
              cy={py(n)}
              r={r}
              fill={n.hub ? palette.base : palette.soft}
              stroke={palette.ink}
              strokeWidth={n.hub ? 0 : 1.2}
            />
            <text
              x={px(n)}
              y={py(n) + r + 11}
              fontSize="8.5"
              fontWeight="600"
              textAnchor="middle"
              fill="#3d4f63"
            >
              {n.label}
            </text>
            <text
              x={px(n)}
              y={py(n) + 3.5}
              fontSize="9.5"
              fontWeight="700"
              textAnchor="middle"
              fill={n.hub ? "#ffffff" : palette.ink}
            >
              {n.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Radial buying group ──────────────────────────────────────────────────── */

export interface RadialGroup {
  id: string;
  label: string;
  /** People inside this organisation, in the order they should be drawn. */
  members: Array<{ id: string; label: string; role: string; known: boolean }>;
}

/**
 * The buying picture as an orbit: Broadridge at the centre, each organisation
 * on its own arm, each named individual out at the rim.
 *
 * A hollow ring on a person means the role is inferred rather than established,
 * which is the distinction the whole people model turns on — so it is encoded in
 * the mark, not only in a caption.
 */
export function RadialGroups({
  groups,
  palette,
  centreLabel,
  width = 300,
  height = 250,
}: {
  groups: RadialGroup[];
  palette: ModulePalette;
  centreLabel: string;
  width?: number;
  height?: number;
}) {
  const cx = width / 2;
  const cy = height / 2;
  const rGroup = Math.min(width, height) * 0.24;
  const rPerson = Math.min(width, height) * 0.43;
  /* Start at the top and go clockwise, so the first group is where the eye lands. */
  const angle = (i: number, n: number) => (i / n) * Math.PI * 2 - Math.PI / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      <circle cx={cx} cy={cy} r={rGroup} fill="none" stroke="rgba(0,31,90,0.08)" strokeDasharray="2 4" />
      <circle cx={cx} cy={cy} r={rPerson} fill="none" stroke="rgba(0,31,90,0.06)" strokeDasharray="2 4" />

      {groups.map((g, gi) => {
        const a = angle(gi, groups.length);
        const gx = cx + Math.cos(a) * rGroup;
        const gy = cy + Math.sin(a) * rGroup;
        /* Each organisation's people fan out around its own arm. */
        const spread = Math.min(0.5, (Math.PI * 2) / groups.length / 2.1);

        return (
          <g key={g.id}>
            <line x1={cx} y1={cy} x2={gx} y2={gy} stroke={palette.base} strokeWidth="1.2" opacity="0.4" />
            {g.members.map((m, mi) => {
              const offset =
                g.members.length === 1 ? 0 : (mi / (g.members.length - 1) - 0.5) * spread * 2;
              const pa = a + offset;
              const mx = cx + Math.cos(pa) * rPerson;
              const my = cy + Math.sin(pa) * rPerson;
              return (
                <g key={m.id}>
                  <line x1={gx} y1={gy} x2={mx} y2={my} stroke={palette.base} strokeWidth="0.8" opacity="0.28" />
                  <circle cx={mx} cy={my} r={4.6} fill="#ffffff" />
                  <circle
                    cx={mx}
                    cy={my}
                    r={3.4}
                    fill={m.known ? palette.base : "#ffffff"}
                    stroke={palette.ink}
                    strokeWidth="1.1"
                  />
                </g>
              );
            })}
            {/* Numbered rather than named: five organisation labels around a
                300px circle collide with each other and with the people on
                their own arm. The numeral keys into the list beside the graph,
                which is where the names and counts already are. */}
            <circle cx={gx} cy={gy} r={9} fill="#ffffff" />
            <circle cx={gx} cy={gy} r={7.5} fill={palette.ink} />
            <text x={gx} y={gy + 3} fontSize="8.5" fontWeight="700" textAnchor="middle" fill="#ffffff">
              {gi + 1}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={18} fill="#ffffff" />
      <circle cx={cx} cy={cy} r={16} fill={palette.base} />
      <text x={cx} y={cy + 3.5} fontSize="9" fontWeight="700" textAnchor="middle" fill="#ffffff">
        {centreLabel}
      </text>
    </svg>
  );
}

/* ── Provenance flow ──────────────────────────────────────────────────────── */

export interface FlowColumn {
  title: string;
  rows: Array<{ id: string; label: string; value: number; tone?: string }>;
}

export interface FlowLink {
  from: string;
  to: string;
  value: number;
}

/**
 * A three-column flow: where a claim came from, how far it is trusted, and what
 * leans on it. Band thickness is the count, so the eye reads the proportion of
 * the product's knowledge that is genuinely verified before it reads a number.
 *
 * The ribbons are the real cross-tabulation, not a decorative full mesh. Every
 * evidence record already names its sources, its state and what uses it, so the
 * flow between two columns is counted rather than assumed. On a product whose
 * entire claim is traceability, a diagram that implied connections it had not
 * checked would be the worst possible thing to draw.
 */
export function FlowChain({
  columns,
  links,
  palette,
  width = 430,
  height = 246,
}: {
  /** Exactly three columns, left to right. */
  columns: [FlowColumn, FlowColumn, FlowColumn];
  /** Counted links across the first gap, then the second. */
  links: [FlowLink[], FlowLink[]];
  palette: ModulePalette;
  width?: number;
  height?: number;
}) {
  const colW = 104;
  const gap = (width - colW * 3) / 2;
  const top = 16;
  const plotH = height - top - 4;

  /* Band heights are shares of each column's own total, so a column with fewer
     records still fills the height and the comparison stays about proportion. */
  const stacks = columns.map((col) => {
    const total = col.rows.reduce((s, r) => s + r.value, 0) || 1;
    const spacing = 3 * Math.max(col.rows.length - 1, 0);
    const usable = plotH - spacing;
    let y = top;
    const bands = new Map<string, { y: number; h: number; row: FlowColumn["rows"][number] }>();
    for (const row of col.rows) {
      const h = Math.max((row.value / total) * usable, 2);
      bands.set(row.id, { y, h, row });
      y += h + 3;
    }
    return bands;
  });

  const ribbons = ([0, 1] as const).flatMap((gapIndex) => {
    const from = stacks[gapIndex];
    const to = stacks[gapIndex + 1];
    const set = links[gapIndex];

    const fromTotal = new Map<string, number>();
    const toTotal = new Map<string, number>();
    for (const l of set) {
      fromTotal.set(l.from, (fromTotal.get(l.from) ?? 0) + l.value);
      toTotal.set(l.to, (toTotal.get(l.to) ?? 0) + l.value);
    }

    const fromCursor = new Map<string, number>();
    const toCursor = new Map<string, number>();

    return set.flatMap((l) => {
      const a = from.get(l.from);
      const b = to.get(l.to);
      if (!a || !b || l.value <= 0) return [];

      /* Each end of a ribbon is sized against its own band, so both ends of the
         column stay exactly full however lopsided the counts are. */
      const ha = (l.value / (fromTotal.get(l.from) || 1)) * a.h;
      const hb = (l.value / (toTotal.get(l.to) || 1)) * b.h;
      const ay = fromCursor.get(l.from) ?? a.y;
      const by = toCursor.get(l.to) ?? b.y;
      fromCursor.set(l.from, ay + ha);
      toCursor.set(l.to, by + hb);

      const x1 = gapIndex * (colW + gap) + colW;
      const x2 = (gapIndex + 1) * (colW + gap);
      const mid = (x1 + x2) / 2;

      return [
        {
          key: `${gapIndex}-${l.from}-${l.to}`,
          d: `M${x1},${ay} C${mid},${ay} ${mid},${by} ${x2},${by} L${x2},${by + hb} C${mid},${by + hb} ${mid},${ay + ha} ${x1},${ay + ha} Z`,
        },
      ];
    });
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      {/* The last column's title is right-aligned to its band — set from the
          left it runs off the end of the viewBox and is silently clipped. */}
      {columns.map((col, ci) => (
        <text
          key={col.title}
          x={ci === 2 ? ci * (colW + gap) + colW : ci * (colW + gap)}
          y={8}
          fontSize="8"
          fontWeight="700"
          fill="#8794a5"
          letterSpacing="0.6"
          textAnchor={ci === 2 ? "end" : "start"}
        >
          {col.title.toUpperCase()}
        </text>
      ))}

      <g fill={palette.base} opacity="0.24">
        {ribbons.map((r) => (
          <path key={r.key} d={r.d} />
        ))}
      </g>

      {stacks.map((bands, ci) =>
        [...bands.entries()].map(([id, band]) => (
          <g key={`${ci}-${id}`}>
            <rect
              x={ci * (colW + gap)}
              y={band.y}
              width={colW}
              height={band.h}
              rx={3}
              fill={band.row.tone ?? palette.base}
            />
            {band.h > 14 && (
              <text
                x={ci * (colW + gap) + 6}
                y={band.y + band.h / 2 + 3.2}
                fontSize="8.5"
                fontWeight="600"
                fill="#ffffff"
              >
                {band.row.label}
                <tspan opacity="0.72">{`  ${band.row.value}`}</tspan>
              </text>
            )}
          </g>
        )),
      )}
    </svg>
  );
}
