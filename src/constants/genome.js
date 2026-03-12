/**
 * Glyph Genome Configuration
 * 32-bit encoding for glyph properties and generation
 * Enables compact storage and procedural generation
 */

export const GENOME_BITS = {
  coreClass: { bits: 3, shift: 29 }, // 0-7 (0=invalid, 1=sibilant, 2=plosive, 3=resonant)
  subsetFamily: { bits: 3, shift: 26 }, // 0-7
  variantIndex: { bits: 4, shift: 22 }, // 0-15 (only 0-8 used)
  nodeMask: { bits: 9, shift: 13 }, // bits 0-8 correspond to nodes 1-9
  edgeMask: { bits: 8, shift: 5 }, // bits 0-7 correspond to edge types
  symmetry: { bits: 3, shift: 2 }, // 0=none, 1=mirrorX, 2=mirrorY, 3=rot90, 4=rot180, 5=rot270
  curvature: { bits: 2, shift: 0 }, // 0=block, 1=curved, 2=hybrid, 3=calligraphic
};

export const EDGE_TYPES = [
  "horizontal",
  "vertical",
  "diagonal",
  "centerArc",
  "outerArc",
  "loop",
  "cross",
  "extendedTail",
];

export default { GENOME_BITS, EDGE_TYPES };
