/**
 * The account health spectrum.
 *
 * Module colour (`palette.ts`) says *what* something is. This says *how it is
 * doing*, on one continuous red-to-green ramp, and it is the only place in the
 * product where colour is allowed to be continuous rather than categorical.
 *
 * Why a ramp at all. A portfolio grid of fifty accounts has to answer "where do
 * I look first" before it answers anything else, and five discrete state chips
 * cannot rank fifty things. A ramp can: the eye reads a field of colour as a
 * gradient of concern without being asked to decode a key.
 *
 * Why these particular stops. The obvious ramp — pure red to pure green —
 * collapses under deuteranopia and protanopia, which is most red/green colour
 * blindness. This one is built in three moves instead:
 *
 *   risk      #B42318   the state-risk token, already in the design system
 *   middle    #C98A12   amber, not a red/green midpoint mud
 *   healthy   #1C7A52   the state-progress token, deep enough to hold on white
 *
 * so the ramp separates on *lightness and saturation* as well as hue, and a
 * red-blind reader still sees dark-heavy → bright → dark-cool. The check that
 * makes it safe, though, is not the ramp: every cell carries its health as a
 * word in its own tooltip and its state as a shape in the legend, so colour is
 * never the only carrier. That is the same rule the module palette lives under.
 *
 * Opportunity is deliberately *not* a point on this ramp. An account can be in
 * trouble and carry an opportunity at the same time — those are two different
 * facts, and folding them into one colour would lose one of them. Opportunity
 * is carried as light instead: a slow pulse on the cell's rim, which reads as a
 * second channel rather than a different position on the first.
 */

/** Endpoints and midpoint of the ramp, as RGB triples. */
const RISK: [number, number, number] = [180, 35, 24]; /* #B42318 — --state-risk */
const MIDDLE: [number, number, number] = [201, 138, 18]; /* #C98A12 — amber */
const HEALTHY: [number, number, number] = [28, 122, 82]; /* #1C7A52 — --state-progress */

const mix = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];

/**
 * A health value in 0–1 to a point on the ramp.
 *
 * `alpha` is what makes it usable as a large area fill: a treemap cell at full
 * saturation is a colour field you cannot put text on, so the grid asks for the
 * same hue at around 0.2 and paints its border and its marks at full strength.
 */
export function healthColor(health: number, alpha = 1): string {
  const t = Math.max(0, Math.min(1, health));
  const [r, g, b] = t < 0.5 ? mix(RISK, MIDDLE, t * 2) : mix(MIDDLE, HEALTHY, (t - 0.5) * 2);
  return alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** The word a health value is worth. Colour is never the only carrier. */
export function healthWord(health: number): string {
  if (health < 0.3) return "Problem";
  if (health < 0.5) return "Strained";
  if (health < 0.72) return "Watch";
  if (health < 0.88) return "Stable";
  return "Healthy";
}

/** The five points the grid legend samples, low to high. */
export const HEALTH_LEGEND: Array<{ label: string; at: number }> = [
  { label: "Problem", at: 0.1 },
  { label: "Strained", at: 0.38 },
  { label: "Watch", at: 0.6 },
  { label: "Stable", at: 0.8 },
  { label: "Healthy", at: 0.96 },
];
