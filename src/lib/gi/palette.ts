/**
 * Module colour identity.
 *
 * These nine values were not chosen by eye. They were generated as evenly
 * stepped OKLCH hues with alternating lightness, then run through the data-viz
 * palette validator until every check passed — against the light gallery
 * surface, and against the darker glass a mark sits on inside a panel:
 *
 *   Lightness band      all 9 inside L 0.43–0.77
 *   Chroma floor        all 9 >= 0.10          (nothing reads as grey)
 *   CVD separation      worst adjacent ΔE 14.7 (deuteranopia), 14.0 (tritanopia)
 *   Normal-vision floor worst adjacent ΔE 15.1
 *   Contrast vs surface WARN on two slots — Delivery 2.78:1, Knowledge Graph 2.89:1
 *
 * Three earlier attempts failed hard: a "cool spectrum" of nine hues collapses
 * in the blue region, where five of them came out at ΔE 1.2 under protanopia.
 * The palette therefore reaches from green through to plum and separates on
 * lightness as well as hue.
 *
 * Darkening the two WARN slots to clear 3:1 was tried and rejected — it drags
 * Delivery to ΔE 8.6 from Growth, which is a hard FAIL on the normal-vision
 * floor. Separation is the harder constraint, so the WARN stands and is
 * discharged instead: every panel names its module in large letterspaced type,
 * so identity is never carried by colour alone, and text always wears a text
 * token rather than the mark colour. On light surfaces, thin strokes and small
 * marks use `ink` — never `base` — so a hairline is never the thing relying on
 * a 2.8:1 mark.
 *
 * `ink` is a contrast step, not a second categorical palette: only one
 * module's ink is ever on screen at a time, so it is checked for contrast
 * against the panel (all nine clear 3:1 on white) and nothing else. Running the
 * nine ink values through the separation checks together would be measuring a
 * set that never appears together.
 *
 * The ring order below is the validated adjacency. Reordering the ring without
 * re-running the validator will silently break the separation guarantee.
 */
import type { ModuleId } from "./metrics";

export interface ModulePalette {
  /** The validated mark colour. Area fills, bars, large marks. */
  base: string;
  /** Lifted. Highlights and glows against a tint. Never for text. */
  bright: string;
  /**
   * The darkened step. Thin strokes, coastlines, small marks and any mark that
   * has to hold its own against a near-white panel.
   */
  ink: string;
  /** Coloured light pooling under a panel. */
  glow: string;
  /** The tint inside the glass. Very low alpha, over white. */
  wash: string;
  /** Hairline that reads as the lit rim of a glass panel. */
  rim: string;
  /** A filled area on a light surface — a map country, a treemap cell. */
  soft: string;
  /** A hairline in the module's own colour. */
  line: string;
  /**
   * The three stops the gradient field mixes while this module is at the front
   * of the ring. Pale, module, navy — so the room stays a Broadridge navy
   * gradient whichever panel is facing you, and only its middle changes hue.
   */
  gradient: { pale: string; accent: string; navy: string };
}

/**
 * The room is a light one, so the gradient reaches from a pale sky down into
 * Broadridge navy. Only the middle stop carries module identity — which is what
 * makes the whole room shift hue as the ring turns without ever stopping being
 * a navy gradient.
 */
const PALE = "#F2F6FC";
const NAVY = "#001F5A";

const identity = (base: string, bright: string, ink: string): ModulePalette => ({
  base,
  bright,
  ink,
  glow: `${base}33`,
  wash: `${base}12`,
  rim: `${bright}66`,
  soft: `${base}1f`,
  line: `${base}59`,
  gradient: { pale: PALE, accent: base, navy: NAVY },
});

export const MODULE_PALETTE: Record<ModuleId, ModulePalette> = {
  growth: identity("#007644", "#58B07C", "#00401A"),
  delivery: identity("#00AC97", "#61DCC7", "#00514A"),
  markets: identity("#007295", "#59ACCF", "#003E59"),
  "knowledge-graph": identity("#00A2CF", "#60D4FF", "#00506B"),
  accounts: identity("#0065A7", "#549FE2", "#003266"),
  global: identity("#6C8EE5", "#9EC1FF", "#33477F"),
  deals: identity("#5E50A8", "#948AE3", "#302166"),
  people: identity("#AA79D1", "#DCADFF", "#5C3A78"),
  evidence: identity("#893F84", "#C479BE", "#4E124B"),
};

/**
 * The order cards sit on the ring. This is the sequence the palette was
 * validated in — adjacent entries are the pairs the CVD check measured.
 */
export const RING_ORDER: ModuleId[] = [
  "growth",
  "delivery",
  "markets",
  "knowledge-graph",
  "accounts",
  "global",
  "deals",
  "people",
  "evidence",
];
