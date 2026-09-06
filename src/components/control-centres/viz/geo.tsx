/**
 * The two geographic forms.
 *
 * Global gets a globe because its question is planetary — where in the world is
 * there interest — and a globe is the only projection that does not lie about
 * which places are near each other. Markets gets a flat European window because
 * its question is comparative — which of these countries moved — and comparison
 * needs undistorted area and a full view of every candidate at once.
 *
 * Both draw real Natural Earth coastlines from `lib/gi/geo/atlas.ts`. Both are
 * pure functions of their props: no layout measurement, no randomness, so the
 * server and the client agree.
 *
 * Colour follows the data-viz rules. Country shading is a sequential ramp in a
 * single module hue, light to dark, because it encodes magnitude. Markers use
 * the same hue at full strength because they encode the same quantity. Nothing
 * on either map is coloured to be decorative.
 */
import { EUROPE_COUNTRIES, WORLD_LAND } from "@/lib/gi/geo/atlas";
import { arcThrough, graticule, greatCircle, orthographic, ringPath, shapePath, windowed } from "@/lib/gi/geo/project";
import type { ModulePalette } from "@/lib/gi/palette";

export interface GeoMarker {
  id: string;
  label: string;
  lat: number;
  lon: number;
  /** 0–1. Drives radius; the only thing the size of a marker ever means. */
  weight: number;
  /** Rendered beside the marker. Only ever set on the few that matter. */
  note?: string;
}

/* ── Globe ────────────────────────────────────────────────────────────────── */

export function Globe({
  markers,
  palette,
  originId,
  id,
  size = 300,
  lon0 = 6,
  lat0 = 22,
}: {
  markers: GeoMarker[];
  palette: ModulePalette;
  /** Arcs are drawn from this marker to every other. Usually the home hub. */
  originId?: string;
  /** Unique per card — gradients are referenced by id. */
  id: string;
  size?: number;
  lon0?: number;
  lat0?: number;
}) {
  const r = size / 2 - 6;
  const cx = size / 2;
  const cy = size / 2;
  const project = orthographic({ lon0, lat0, radius: r, cx, cy });
  const origin = markers.find((m) => m.id === originId);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      <defs>
        {/* The lit side of a sphere. Without it the disc reads as a circle. */}
        <radialGradient id={`sphere-${id}`} cx="34%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="58%" stopColor="#eef3fa" />
          <stop offset="100%" stopColor="#dbe4f2" />
        </radialGradient>
        <radialGradient id={`limb-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="82%" stopColor="rgba(0,31,90,0)" />
          <stop offset="100%" stopColor="rgba(0,31,90,0.16)" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={r} fill={`url(#sphere-${id})`} />

      <g stroke="rgba(0,31,90,0.09)" strokeWidth="0.6" fill="none">
        {graticule(20).map((ring, i) => (
          <path key={i} d={ringPath(ring, project)} />
        ))}
      </g>

      <g fill={palette.soft} stroke={palette.line} strokeWidth="0.6" strokeLinejoin="round">
        {WORLD_LAND.map((ring, i) => (
          <path key={i} d={ringPath(ring, project)} />
        ))}
      </g>

      {/* Great circles, not straight lines — on a sphere the shortest route is
          curved, and a straight one would be a drawn falsehood. */}
      {origin && (
        <g fill="none" stroke={palette.base} strokeWidth="1" strokeLinecap="round" opacity="0.5">
          {markers
            .filter((m) => m.id !== origin.id && m.weight > 0)
            .map((m) => (
              <path key={m.id} d={ringPath(greatCircle(origin, m, 40), project)} />
            ))}
        </g>
      )}

      {/* Limb shading last, so the edge of the sphere darkens everything on it. */}
      <circle cx={cx} cy={cy} r={r} fill={`url(#limb-${id})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,31,90,0.16)" strokeWidth="0.8" />

      <g>
        {markers.map((m) => {
          const p = project(m.lon, m.lat);
          if (!p.visible) return null;
          const size = 2.4 + m.weight * 4.6;
          return (
            <g key={m.id}>
              <circle cx={p.x} cy={p.y} r={size + 1.6} fill="#ffffff" opacity="0.9" />
              <circle cx={p.x} cy={p.y} r={size} fill={m.id === originId ? palette.ink : palette.base} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── Europe ───────────────────────────────────────────────────────────────── */

/**
 * A single-hue sequential ramp: everything sits on the same colour and only its
 * strength moves, which is the one correct way to shade a choropleth. `t` is
 * already normalised 0–1 by the caller.
 */
function shade(palette: ModulePalette, t: number): string {
  const alpha = Math.round((0.1 + t * 0.85) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${palette.base}${alpha}`;
}

export function RegionMap({
  values,
  markers,
  palette,
  width = 430,
  height = 268,
}: {
  /** ISO 3166-1 numeric → 0–1 magnitude. Countries not listed are drawn inert. */
  values: Record<string, number>;
  /** The few places worth naming, with a connector back to the hub. */
  markers: GeoMarker[];
  palette: ModulePalette;
  width?: number;
  height?: number;
}) {
  /* Drawn tighter than the atlas was cut, so the countries at the edge of the
     window are clipped by the frame rather than floating in it. */
  const project = windowed({ lon: [-24, 56], lat: [30, 70], width, height });
  const pinned = markers.map((m) => ({ ...m, p: project(m.lon, m.lat) }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", display: "block" }} aria-hidden>
      <g strokeLinejoin="round">
        {Object.entries(EUROPE_COUNTRIES).map(([iso, rings]) => {
          const v = values[iso];
          return (
            <path
              key={iso}
              d={shapePath(rings, project)}
              fill={v === undefined ? "rgba(0,31,90,0.055)" : shade(palette, v)}
              stroke="#ffffff"
              strokeWidth="0.7"
            />
          );
        })}
      </g>

      {/* Connectors between the places that moved and where the move landed. */}
      <g fill="none" stroke={palette.ink} strokeWidth="0.9" strokeDasharray="2 3" opacity="0.45">
        {pinned.slice(1).map((m) => (
          <path key={m.id} d={arcThrough(pinned[0].p.x, pinned[0].p.y, m.p.x, m.p.y, 0.2)} />
        ))}
      </g>

      {/* Ranked pins, numbered rather than labelled.
          Four of the busiest markets sit inside a few hundred kilometres of
          each other, so prose beside each pin collides with the next one no
          matter how it is offset. The numeral ties the pin to its row in the
          ranked list beside the map, which is where the names and counts
          already are — the map answers *where*, the list answers *what*. */}
      <g>
        {pinned.map((m, i) => {
          const r = 7.5 + m.weight * 3;
          return (
            <g key={m.id}>
              <circle cx={m.p.x} cy={m.p.y} r={r + 1.8} fill="#ffffff" opacity="0.92" />
              <circle cx={m.p.x} cy={m.p.y} r={r} fill={palette.ink} />
              <text
                x={m.p.x}
                y={m.p.y + 3.2}
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
                fill="#ffffff"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
