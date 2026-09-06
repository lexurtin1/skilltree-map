/**
 * Module colour identity.
 *
 * These nine values were not chosen by eye. They were generated as evenly
 * stepped OKLCH hues with alternating lightness, then run through the data-viz
 * palette validator against the gallery's dark surface until every check passed:
 *
 *   Lightness band      all 9 inside L 0.48–0.67
 *   Chroma floor        all 9 >= 0.10          (nothing reads as grey)
 *   CVD separation      worst adjacent pair ΔE 14.7 under deuteranopia
 *   Normal-vision floor worst adjacent pair ΔE 15.1
 *   Contrast vs surface WARN on three slots at 2.7–3.0:1
 *
 * Three earlier attempts failed hard — a "cool spectrum" of nine hues collapses
 * in the blue region, where five of them came out at ΔE 1.2 under protanopia.
 * The palette therefore reaches from green through to plum, and separates on
 * lightness as well as hue.
 *
 * The contrast WARN is discharged, not dismissed: every card names its module in
 * large letterspaced type, so identity is never carried by colour alone, and
 * text always wears a text token — never the mark colour.
 *
 * The ring order below is the validated adjacency. Reordering the ring without
 * re-running the validator will silently break the separation guarantee.
 */
import type { ModuleId } from "./metrics";

export interface ModulePalette {
  /** The validated mark colour. Area fills, bars, KPI accents. */
  base: string;
  /** Lifted for thin strokes and the title dot on dark glass. Never for text. */
  bright: string;
  /** The floor of an area-fill gradient. */
  deep: string;
  /** Outer glow around the front card of the ring. */
  glow: string;
  /** The tint inside the glass. Very low alpha, over navy. */
  wash: string;
  /** Hairline edge that reads as the lit rim of a glass panel. */
  rim: string;
  /** Wave field colours while this module is at the front of the ring. */
  waves: { horizon: string; wave: string; crest: string };
}

/**
 * Broadridge navy is the room the whole gallery sits in, so every wave field
 * fades to the same horizon. Only the body and crest carry module identity.
 */
const HORIZON = "#040B1A";

const identity = (base: string, bright: string, deep: string): ModulePalette => ({
  base,
  bright,
  deep,
  glow: `${bright}4d`,
  wash: `${base}24`,
  rim: `${bright}59`,
  waves: { horizon: HORIZON, wave: deep, crest: base },
});

export const MODULE_PALETTE: Record<ModuleId, ModulePalette> = {
  growth: identity("#007644", "#58B07C", "#00401A"),
  delivery: identity("#00AC97", "#61DCC7", "#007262"),
  markets: identity("#007295", "#59ACCF", "#003E59"),
  "knowledge-graph": identity("#00A2CF", "#60D4FF", "#006A8D"),
  accounts: identity("#0065A7", "#549FE2", "#003266"),
  global: identity("#6C8EE5", "#9EC1FF", "#40599E"),
  deals: identity("#5E50A8", "#948AE3", "#302166"),
  people: identity("#AA79D1", "#DCADFF", "#70498F"),
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
