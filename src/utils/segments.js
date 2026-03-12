/**
 * Segment Normalization Utilities
 * Fast segment lookups and normalization
 */

import { ALL_SEGS } from "../constants";

/**
 * Precompute normalized segments for fast lookup
 */
export function normalizeSegment([a, b]) {
  return a < b ? [a, b] : [b, a];
}

export const ALL_SEGS_NORMALIZED = ALL_SEGS.map((seg) =>
  normalizeSegment(seg)
);

export const SEGMENT_LOOKUP = new Set(
  ALL_SEGS_NORMALIZED.map((seg) => seg.join("-"))
);

/**
 * Fast segment membership check
 * @param {[string, string]} seg - Segment to check
 * @returns {boolean} True if segment is in ALL_SEGS
 */
export function isSegmentDefined(seg) {
  const norm = normalizeSegment(seg);
  return SEGMENT_LOOKUP.has(norm.join("-"));
}

export default {
  normalizeSegment,
  ALL_SEGS_NORMALIZED,
  SEGMENT_LOOKUP,
  isSegmentDefined,
};
