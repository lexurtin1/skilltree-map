/**
 * Generates `src/lib/gi/geo/atlas.ts` from Natural Earth 110m topology.
 *
 * The gallery draws real coastlines, so the shapes have to come from a real
 * source rather than be sketched. Rather than ship a topology parser and a
 * 100KB atlas to the browser, the outlines are resolved and simplified here,
 * once, and committed as plain arrays of [lon, lat].
 *
 * Run: node scripts/build-geo.mjs   (needs `npm i --no-save world-atlas topojson-client`)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { feature } from "topojson-client";

const land = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const countries = JSON.parse(readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"));

const landGeo = feature(land, land.objects.land);
const countryGeo = feature(countries, countries.objects.countries);

/** Douglas–Peucker on an open polyline. */
function simplifyOpen(pts, tolerance) {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;

  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let far = -1;
    let best = tolerance;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (d > best) {
        best = d;
        far = i;
      }
    }
    if (far !== -1) {
      keep[far] = true;
      stack.push([a, far], [far, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/**
 * Simplify a closed ring.
 *
 * Douglas–Peucker cannot be run straight at a ring: its first and last points
 * are the same, so the baseline is degenerate and every interior point measures
 * zero away from it — the whole coastline collapses to two points. The ring is
 * therefore cut at the vertex furthest from its start and simplified as two
 * open polylines, then closed again.
 */
function simplifyRing(ring, tolerance) {
  const pts = ring.slice(0, -1);
  if (pts.length < 5) return ring;

  const [ox, oy] = pts[0];
  let cut = 1;
  let furthest = -1;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - ox, pts[i][1] - oy);
    if (d > furthest) {
      furthest = d;
      cut = i;
    }
  }

  const a = simplifyOpen(pts.slice(0, cut + 1), tolerance);
  const b = simplifyOpen(pts.slice(cut), tolerance);
  const out = [...a, ...b.slice(1)];
  return [...out, out[0]];
}

const round = (ring) => ring.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]);

/** All exterior rings of a feature, simplified and rounded. Holes are dropped. */
function ringsOf(geometry, tolerance, minPoints = 5) {
  const polys =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
  return polys
    .map((poly) => round(simplifyRing(poly[0], tolerance)))
    .filter((ring) => ring.length >= minPoints);
}

/* ── World land, for the globe ─────────────────────────────────────────────
   Coarse: at 340px across, anything finer is sub-pixel. */
const worldRings = landGeo.features
  .flatMap((f) => ringsOf(f.geometry, 0.9, 6))
  /* Drop islands too small to read at globe scale.
     No antimeridian filter here, unlike the country set below: the globe's
     orthographic projection is periodic in longitude and simply hides whatever
     has gone round the back, so a ring that reaches 180° draws correctly. On a
     flat map it would not — hence the different rule there. */
  .filter((ring) => {
    const xs = ring.map((p) => p[0]);
    const ys = ring.map((p) => p[1]);
    return Math.max(...xs) - Math.min(...xs) > 3 || Math.max(...ys) - Math.min(...ys) > 3;
  });

/* ── Country outlines, for the regional map ───────────────────────────────
   Finer tolerance, and only inside the window the map draws.

   The window reaches past Europe to the Atlantic, North Africa and the Levant,
   for two reasons: a fund map that stops at the Mediterranean coast reads as a
   cut-out rather than a map, and Europe alone is taller than it is wide in this
   projection, which leaves a landscape panel two-thirds empty. */
const EUROPE_WINDOW = { lon: [-28, 64], lat: [26, 72] };

/**
 * Unwrap longitudes so a ring that crosses the antimeridian stays continuous.
 *
 * Russia's outline runs east past 180° and Natural Earth expresses that by
 * jumping to −180. Left alone the polygon spans the entire world and fills as a
 * band straight across the map. Adding a turn of 360° at each jump makes the
 * ring monotone again; the part that ends up past 180°E simply falls outside
 * the drawn window and is clipped by the frame, which is exactly right — that
 * part of Russia is not in Europe.
 */
function unwrap(ring) {
  const out = [ring[0]];
  let turns = 0;
  for (let i = 1; i < ring.length; i++) {
    const step = ring[i][0] - ring[i - 1][0];
    if (step > 180) turns -= 1;
    else if (step < -180) turns += 1;
    out.push([ring[i][0] + turns * 360, ring[i][1]]);
  }
  return out;
}

/**
 * Keep a ring if it actually falls inside the drawn window.
 *
 * Two traps here. A ring that crosses the antimeridian has a bounding box the
 * full width of the world, so its centroid lands near 0°E and it passes a naive
 * centre test — then draws as a band straight across the map. And a ring can be
 * enormous (Russia) with only a sliver inside the window, which is worth
 * keeping, so the test has to be overlap rather than containment.
 */
const inWindow = (ring) => {
  const xs = ring.map((p) => p[0]);
  const ys = ring.map((p) => p[1]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)];
  const [y0, y1] = [Math.min(...ys), Math.max(...ys)];

  /* Still world-spanning after unwrapping — Antarctica. Nothing to draw here. */
  if (x1 - x0 > 300) return false;

  return (
    x1 >= EUROPE_WINDOW.lon[0] &&
    x0 <= EUROPE_WINDOW.lon[1] &&
    y1 >= EUROPE_WINDOW.lat[0] &&
    y0 <= EUROPE_WINDOW.lat[1]
  );
};

const europe = {};
for (const f of countryGeo.features) {
  const iso = String(f.id).padStart(3, "0");
  const rings = ringsOf(f.geometry, 0.22, 5).map(unwrap).filter(inWindow);
  if (rings.length) europe[iso] = rings;
}

const out = `/**
 * Coastlines, generated — do not edit by hand.
 *
 * Source: Natural Earth 1:110m via \`world-atlas\`, resolved from TopoJSON and
 * simplified by \`scripts/build-geo.mjs\`. Committed as plain coordinates so no
 * topology parser or atlas file reaches the browser.
 *
 * Coordinates are [lon, lat] in degrees, rounded to 2dp — about a kilometre,
 * which is far finer than anything drawn at these sizes.
 */

export type Ring = Array<[number, number]>;

/** World land, coarse. Islands under ~3° across are dropped. */
export const WORLD_LAND: Ring[] = ${JSON.stringify(worldRings)};

/** European country outlines by ISO 3166-1 numeric, finer. */
export const EUROPE_COUNTRIES: Record<string, Ring[]> = ${JSON.stringify(europe)};

/** The window the Europe map is framed to. */
export const EUROPE_WINDOW = { lon: [${EUROPE_WINDOW.lon}] as const, lat: [${EUROPE_WINDOW.lat}] as const };
`;

mkdirSync("src/lib/gi/geo", { recursive: true });
writeFileSync("src/lib/gi/geo/atlas.ts", out);

const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
console.log(
  `atlas.ts  ${kb}KB · world ${worldRings.length} rings / ${worldRings.reduce((s, r) => s + r.length, 0)} pts · europe ${Object.keys(europe).length} countries / ${Object.values(europe).flat().reduce((s, r) => s + r.length, 0)} pts`,
);
