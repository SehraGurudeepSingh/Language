/**
 * Path Building Utilities
 * Convert segment data to SVG paths with optional cursive and handwriting effects
 */

import { THEME } from "../constants";

/**
 * Build SVG path from glyph segments with styling
 * @param {Array} segs - Segment pairs
 * @param {string} type - Glyph type (sibilant, plosive, resonant)
 * @param {boolean} cursive - Apply cursive styling
 * @param {boolean} handwriting - Add handwriting noise
 * @param {Object} grid - Grid coordinates
 * @returns {string} SVG path d attribute
 */
export function buildPath(segs, type, cursive, handwriting, grid) {
  return segs
    .map(([a, b]) => {
      const [x1, y1] = grid[a];
      const [x2, y2] = grid[b];

      if (!cursive) return `M${x1} ${y1}L${x2} ${y2}`;

      const mx = (x1 + x2) / 2,
        my = (y1 + y2) / 2;
      const dx = x2 - x1,
        dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len,
        ny = dx / len;

      let amp = type === "sibilant" ? -12 : type === "resonant" ? 12 : 7;
      if (handwriting) {
        amp += (Math.random() * 2 - 1) * 2;
      }

      const cx = mx + nx * amp;
      const cy = my + ny * amp;
      return `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`;
    })
    .join(" ");
}

/**
 * Get stroke order for animated drawing
 * @param {Array} segs - Segments
 * @param {Object} grid - Grid coordinates
 * @returns {Array} Ordered segments
 */
export function getStrokeOrder(segs, grid) {
  return [...segs].sort((a, b) => {
    const [ax, ay] = grid[a[0]];
    const bx = grid[b[0]][0],
      by = grid[b[0]][1];
    return ax + ay - (bx + by);
  });
}

export default { buildPath, getStrokeOrder };
