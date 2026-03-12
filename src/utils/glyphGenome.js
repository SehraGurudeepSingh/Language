/**
 * Glyph Genome Utilities
 * Encoding and decoding for compact 32-bit glyph representation
 */

import { GENOME_BITS, NODE_KEYS, ALL_SEGS, THEME } from "../constants";

/**
 * Encode glyph properties into a 32-bit genome integer
 * @param {Object} glyph - Glyph to encode
 * @returns {number} 32-bit genome value
 */
export function encodeGenome(glyph) {
  let genome = 0;
  const coreMap = { sibilant: 1, plosive: 2, resonant: 3 };
  const core = coreMap[glyph.type] || 0;
  genome |= core << GENOME_BITS.coreClass.shift;

  // subset and variant – for now use dummy values
  const subset = 1;
  const variant = 1;
  genome |= subset << GENOME_BITS.subsetFamily.shift;
  genome |= variant << GENOME_BITS.variantIndex.shift;

  // node mask – build from segs
  let nodeMask = 0;
  const nodes = new Set();
  glyph.segs.forEach(([a, b]) => {
    nodes.add(a);
    nodes.add(b);
  });
  NODE_KEYS.forEach((key, idx) => {
    if (nodes.has(key)) nodeMask |= 1 << idx;
  });
  genome |= nodeMask << GENOME_BITS.nodeMask.shift;

  // edge mask – simple: all edges used are set
  let edgeMask = 0;
  glyph.segs.forEach(([a, b]) => {
    const edgeIndex =
      Math.abs(NODE_KEYS.indexOf(a) - NODE_KEYS.indexOf(b)) %
      GENOME_BITS.edgeMask.bits;
    edgeMask |= 1 << edgeIndex;
  });
  genome |= edgeMask << GENOME_BITS.edgeMask.shift;

  // symmetry and curvature – default
  genome |= 0 << GENOME_BITS.symmetry.shift;
  genome |= 0 << GENOME_BITS.curvature.shift;
  return genome;
}

/**
 * Decode a 32-bit genome into glyph properties
 * @param {number} genome - 32-bit genome value
 * @param {Object} grid - Grid coordinates
 * @returns {Object} Reconstructed glyph
 */
export function decodeGenome(genome, grid) {
  const core =
    (genome >> GENOME_BITS.coreClass.shift) &
    ((1 << GENOME_BITS.coreClass.bits) - 1);
  const nodeMask =
    (genome >> GENOME_BITS.nodeMask.shift) &
    ((1 << GENOME_BITS.nodeMask.bits) - 1);

  const activeNodes = NODE_KEYS.filter((_, i) => nodeMask & (1 << i));

  return {
    segs: ALL_SEGS.filter(
      ([a, b]) => activeNodes.includes(a) && activeNodes.includes(b),
    ),
    type: core === 1 ? "sibilant" : core === 2 ? "plosive" : "resonant",
    color:
      core === 1
        ? THEME.accentSibilant
        : core === 2
          ? THEME.accentPlosive
          : THEME.accentResonant,
    breath: core === 1 ? "up" : core === 2 ? "hold" : "down",
    bn: activeNodes[0] || "MC",
  };
}

export default { encodeGenome, decodeGenome };
