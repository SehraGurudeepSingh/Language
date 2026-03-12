/**
 * Constants Barrel Export
 * Centralized exports of all application constants
 */

// Original theme system (legacy)
export { THEME } from "./theme";

// Grid and glyph definitions
export { NODE_KEYS, ALL_SEGS, DEFAULT_GRID } from "./grid";
export { CONS, BY_NUM, BY_NAME } from "./glyphs";
export {
  PHONETIC_CORES,
  SUBSETS,
  VARIANTS,
  COGNITIVE_AXES,
  LATIN_TO_GLYPH,
} from "./phonetics";
export { GENOME_BITS, EDGE_TYPES } from "./genome";

// NEW: Advanced theme system with light/dark modes
export {
  LIGHT_COLORS,
  DARK_COLORS,
  NEUTRAL,
  OPACITY,
  applyOpacity,
  getContrastTextColor,
} from "./colors";

// NEW: Typography system
export {
  FONTS,
  FONT_WEIGHTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  LETTER_SPACING,
  TYPOGRAPHY,
  GOOGLE_FONTS_URL,
} from "./typography";

// NEW: Decoration grid system
export {
  DECORATION_GRID,
  DECORATION_ELEMENTS,
  DECORATION_PATTERNS,
  POSITION_STRATEGIES,
  GLYPH_DECORATION_MAPS,
} from "./decorations";

// NEW: Enhanced theme system with light/dark support
export {
  LIGHT_THEME,
  DARK_THEME,
  getSystemTheme,
  setTheme,
  getTheme,
} from "./themeSystem";
