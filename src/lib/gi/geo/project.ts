/**
 * Map projection, by hand.
 *
 * Two projections, a graticule and a great-circle interpolator is the whole of
 * what the gallery needs, and each is a handful of lines of trigonometry. A
 * projection library would be several times the size of the coastline data it
 * was there to draw.
 *
 * Everything takes and returns plain numbers so the callers stay pure functions
 * of the ontology and render identically on the server and the client.
 */
import type { Ring } from "./atlas";

const RAD = Math.PI / 180;

export interface Projected {
  x: number;
  y: number;
  /** False when the point is on the far side of a globe. */
  visible: boolean;
}

export type Projection = (lon: number, lat: number) => Projected;

/**
 * Coordinates are rounded before they leave a projection.
 *
 * Node and the browser do not agree on the last bits of a chain of trig, so an
 * unrounded marker position serialises as 332.96931260500594 on the server and
 * 332.9693126050059 in the client — different strings for the same point, which
 * React reports as a hydration mismatch on every marker of the globe. Three
 * decimals is far finer than a pixel and identical in both.
 */
const q = (n: number) => Math.round(n * 1000) / 1000;

/**
 * Orthographic — the view of a sphere from infinitely far away. This is what
 * makes a globe look like a globe rather than a flattened world.
 */
export function orthographic(opts: {
  /** Longitude and latitude at the centre of the disc. */
  lon0: number;
  lat0: number;
  radius: number;
  cx: number;
  cy: number;
}): Projection {
  const { lon0, lat0, radius, cx, cy } = opts;
  const sinLat0 = Math.sin(lat0 * RAD);
  const cosLat0 = Math.cos(lat0 * RAD);

  return (lon, lat) => {
    const dLon = (lon - lon0) * RAD;
    const sinLat = Math.sin(lat * RAD);
    const cosLat = Math.cos(lat * RAD);
    /* cos of the angular distance from the centre of the disc. Negative means
       the point has gone round the back. */
    const c = sinLat0 * sinLat + cosLat0 * cosLat * Math.cos(dLon);
    return {
      x: q(cx + radius * cosLat * Math.sin(dLon)),
      y: q(cy - radius * (cosLat0 * sinLat - sinLat0 * cosLat * Math.cos(dLon))),
      visible: c >= 0,
    };
  };
}

/**
 * Equirectangular, corrected for the latitude it is centred on, fitted to a
 * lon/lat window. Adequate and undistorted enough for a single continent; a
 * conic would buy nothing at this size.
 */
export function windowed(opts: {
  lon: readonly [number, number];
  lat: readonly [number, number];
  width: number;
  height: number;
}): Projection {
  const { lon, lat, width, height } = opts;
  const lat0 = (lat[0] + lat[1]) / 2;
  const k = Math.cos(lat0 * RAD);

  const x0 = lon[0] * k;
  const x1 = lon[1] * k;
  const sx = width / (x1 - x0);
  const sy = height / (lat[1] - lat[0]);
  /* One scale for both axes, so the continent keeps its shape rather than
     being stretched to fill the box. */
  const s = Math.min(sx, sy);
  const padX = (width - (x1 - x0) * s) / 2;
  const padY = (height - (lat[1] - lat[0]) * s) / 2;

  return (lonDeg, latDeg) => ({
    x: q(padX + (lonDeg * k - x0) * s),
    y: q(height - padY - (latDeg - lat[0]) * s),
    visible: true,
  });
}

/**
 * An SVG path for one ring, cut wherever it crosses the horizon of a globe.
 * Without the cut, a country disappearing round the back draws a straight line
 * across the disc.
 */
export function ringPath(ring: Ring, project: Projection): string {
  let d = "";
  let open = false;
  for (const [lon, lat] of ring) {
    const p = project(lon, lat);
    if (!p.visible) {
      open = false;
      continue;
    }
    d += `${open ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    open = true;
  }
  return d;
}

/** Every ring of a shape as one path — `fill-rule` handles the pieces. */
export function shapePath(rings: Ring[], project: Projection): string {
  return rings.map((r) => ringPath(r, project)).join(" ");
}

/** Meridians and parallels, as rings ready for `ringPath`. */
export function graticule(step = 20): Ring[] {
  const rings: Ring[] = [];
  for (let lon = -180; lon <= 180; lon += step) {
    const ring: Ring = [];
    for (let lat = -80; lat <= 80; lat += 4) ring.push([lon, lat]);
    rings.push(ring);
  }
  for (let lat = -60; lat <= 60; lat += step) {
    const ring: Ring = [];
    for (let lon = -180; lon <= 180; lon += 4) ring.push([lon, lat]);
    rings.push(ring);
  }
  return rings;
}

/**
 * Points along the great circle between two places — the path a flight takes,
 * and the only honest way to draw a connection on a globe.
 */
export function greatCircle(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
  segments = 28,
): Ring {
  const φ1 = a.lat * RAD;
  const λ1 = a.lon * RAD;
  const φ2 = b.lat * RAD;
  const λ2 = b.lon * RAD;

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((φ2 - φ1) / 2) ** 2 +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin((λ2 - λ1) / 2) ** 2,
      ),
    );
  if (d === 0) return [[a.lon, a.lat]];

  const out: Ring = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(φ1) * Math.cos(λ1) + B * Math.cos(φ2) * Math.cos(λ2);
    const y = A * Math.cos(φ1) * Math.sin(λ1) + B * Math.cos(φ2) * Math.sin(λ2);
    const z = A * Math.sin(φ1) + B * Math.sin(φ2);
    out.push([Math.atan2(y, x) / RAD, Math.atan2(z, Math.hypot(x, y)) / RAD]);
  }
  return out;
}

/**
 * A quadratic control point that lifts a two-dimensional connector off the
 * straight line between its ends. Used on the flat map, where a great circle
 * would be a straight line anyway.
 */
export function arcThrough(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  lift = 0.22,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  /* Perpendicular, always bowing upward on screen. */
  const nx = -dy / len;
  const ny = dx / len;
  const sign = ny > 0 ? -1 : 1;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${(mx + nx * len * lift * sign).toFixed(1)},${(my + ny * len * lift * sign).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
}
