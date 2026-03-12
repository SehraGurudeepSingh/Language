/**
 * Glyph Evolution Utilities
 * Procedural glyph generation and evolution
 */

import { ALL_SEGS, NODE_KEYS, THEME } from "../constants";
import { isValidSegment } from "./glyphValidation";

/**
 * Check if segments form a connected shape
 * @param {Array} segs - Segment list
 * @param {Object} grid - Grid coordinates
 * @returns {boolean} True if all segments are connected
 */
export function isConnected(segs, grid) {
  if (!segs || segs.length === 0) return true;
  if (segs.length === 1) return true;

  const nodes = new Set();
  segs[0].forEach((n) => nodes.add(n));

  const stack = [segs[0][0]];
  const visited = new Set([segs[0][0]]);

  while (stack.length) {
    const node = stack.pop();
    segs.forEach(([a, b]) => {
      if (a === node && !visited.has(b)) {
        visited.add(b);
        stack.push(b);
      }
      if (b === node && !visited.has(a)) {
        visited.add(a);
        stack.push(a);
      }
    });
  }

  return visited.size === nodes.size;
}

/**
 * Generate a random glyph
 * @param {number} segmentCount - Number of segments
 * @param {Object} grid - Grid coordinates
 * @returns {Object} Random glyph
 */
export function generateRandomGlyph(segmentCount = null, grid) {
  const segs = [];
  const segLimit = segmentCount || Math.floor(Math.random() * 5) + 2;

  while (segs.length < segLimit) {
    const seg = ALL_SEGS[Math.floor(Math.random() * ALL_SEGS.length)];
    if (!segs.some((s) => s.sort().join("-") === seg.sort().join("-"))) {
      segs.push(seg);
    }
  }

  if (!isConnected(segs, grid)) {
    return generateRandomGlyph(segmentCount, grid);
  }

  const types = ["sibilant", "plosive", "resonant"];
  const type = types[Math.floor(Math.random() * types.length)];
  const colors = [
    THEME.accentSibilant,
    THEME.accentPlosive,
    THEME.accentResonant,
  ];
  const breaths = ["up", "hold", "down"];

  return {
    segs,
    type,
    color: colors[types.indexOf(type)],
    breath: breaths[types.indexOf(type)],
    bn: NODE_KEYS[Math.floor(Math.random() * NODE_KEYS.length)],
  };
}

/**
 * Evolve glyphs through random mutations
 * @param {number} count - Number of new glyphs to generate
 * @param {Array} existing - Existing glyphs to mutate from
 * @param {Object} grid - Grid coordinates
 * @returns {Array} New evolved glyphs
 */
export function evolveGlyphs(count, existing, grid) {
  const newGlyphs = [];
  for (let i = 0; i < count; i++) {
    if (existing.length > 0 && Math.random() > 0.5) {
      const base = existing[Math.floor(Math.random() * existing.length)];
      let newSegs = [...base.segs];
      const op = Math.random();

      if (op < 0.33 && newSegs.length < 12) {
        // Add segment
        const nodes = new Set();
        newSegs.forEach(([a, b]) => {
          nodes.add(a);
          nodes.add(b);
        });
        const candidates = ALL_SEGS.filter(([a, b]) => {
          if (
            newSegs.some((s) => s.sort().join("-") === [a, b].sort().join("-"))
          )
            return false;
          return nodes.has(a) || nodes.has(b);
        });
        if (candidates.length) {
          const add = candidates[Math.floor(Math.random() * candidates.length)];
          newSegs.push(add);
        }
      } else if (op < 0.66 && newSegs.length > 1) {
        // Remove segment
        const idx = Math.floor(Math.random() * newSegs.length);
        const candidate = newSegs.filter((_, i) => i !== idx);
        if (isConnected(candidate, grid)) newSegs = candidate;
      }

      newGlyphs.push({
        segs: newSegs,
        type: base.type,
        color: base.color,
        breath: base.breath,
        bn: base.bn,
      });
    } else {
      newGlyphs.push(generateRandomGlyph(null, grid));
    }
  }
  return newGlyphs;
}

export default { isConnected, generateRandomGlyph, evolveGlyphs };
