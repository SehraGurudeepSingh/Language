/**
 * Helper Utilities
 * Spiral generation, semantic mapping, and other utilities
 */

import { CONS } from "../constants";

/**
 * Generate spiral positions for word layout
 * @param {number} steps - Number of steps in the spiral
 * @returns {Array} Array of {x, y} positions
 */
export function spiralPositions(steps) {
  const positions = [{ x: 0, y: 0 }];
  if (steps === 0) return positions;

  let x = 0,
    y = 0;
  let dir = 0;
  let stepSize = 1;
  let stepCount = 0;
  let turnCount = 0;

  for (let i = 1; i < steps; i++) {
    // Move in current direction
    switch (dir) {
      case 0:
        x += 1; // right
        break;
      case 1:
        y += 1; // down
        break;
      case 2:
        x -= 1; // left
        break;
      case 3:
        y -= 1; // up
        break;
    }
    stepCount++;

    // Turn?
    if (stepCount === stepSize) {
      stepCount = 0;
      dir = (dir + 1) % 4;
      turnCount++;

      // Increase step size after every 2 turns
      if (turnCount % 2 === 0) {
        stepSize++;
      }
    }

    positions.push({ x, y });
  }
  return positions;
}

/**
 * Map semantic coordinates to glyph sequence
 * Placeholder implementation - can be enhanced with phonetic rules
 * @param {Array} coord - [core, subset, variant]
 * @returns {Array} Array of glyph objects
 */
export function semanticToGlyphs(coord) {
  const [core, subset, variant] = coord;
  // Simplified: map to glyphs by type
  const types = ["sibilant", "plosive", "resonant"];
  const typeStr = types[(core - 1) % types.length];
  const glyphs = CONS.filter((g) => g.type === typeStr).slice(0, 3);
  return glyphs.length > 0 ? glyphs : [CONS[0]];
}

export default { spiralPositions, semanticToGlyphs };
