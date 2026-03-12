/**
 * Utilities Barrel Export
 * Centralized exports of all utility functions
 */

export {
  normalizeSegment,
  isValidSegment,
  validateGlyph,
  glyphKey,
  findDuplicateGlyphs,
  validateAllGlyphs,
} from "./glyphValidation";

export { encodeGenome, decodeGenome } from "./glyphGenome";

export { buildPath, getStrokeOrder } from "./pathBuilding";

export {
  isConnected,
  generateRandomGlyph,
  evolveGlyphs,
} from "./glyphEvolution";

export { spiralPositions, semanticToGlyphs } from "./helpers";

export {
  normalizeSegment as normalizeSegmentFast,
  ALL_SEGS_NORMALIZED,
  SEGMENT_LOOKUP,
  isSegmentDefined,
} from "./segments";
