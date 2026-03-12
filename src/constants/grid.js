/**
 * Grid Configuration
 * 3x3 node grid and segment definitions
 */

export const NODE_KEYS = ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"];

/**
 * All possible undirected segments (as list of node pairs)
 * Total: 12 segments (6 horizontal + 6 vertical)
 */
export const ALL_SEGS = [
  ["TL", "TC"],
  ["TC", "TR"],
  ["ML", "MC"],
  ["MC", "MR"],
  ["BL", "BC"],
  ["BC", "BR"],
  ["TL", "ML"],
  ["TC", "MC"],
  ["TR", "MR"],
  ["ML", "BL"],
  ["MC", "BC"],
  ["MR", "BR"],
];

/**
 * Default grid coordinates
 * Can be customized and changed by user in the editor
 */
export const DEFAULT_GRID = {
  TL: [10, 10],
  TC: [30, 10],
  TR: [50, 10],
  ML: [10, 30],
  MC: [30, 30],
  MR: [50, 30],
  BL: [10, 50],
  BC: [30, 50],
  BR: [50, 50],
};

export default { NODE_KEYS, ALL_SEGS, DEFAULT_GRID };
