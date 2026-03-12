/**
 * Glyph Validation Utilities
 * Comprehensive validation and integrity checking for glyphs
 */

import { NODE_KEYS, ALL_SEGS, CONS, BY_NUM, BY_NAME } from "../constants";

/**
 * Normalize segment pair to ensure consistent ordering
 * @param {[string, string]} seg - Segment pair [nodeA, nodeB]
 * @returns {[string, string]} Normalized segment with nodes in alphabetical order
 */
export function normalizeSegment([a, b]) {
  return a < b ? [a, b] : [b, a];
}

/**
 * Check if a segment exists in the glyph system
 * @param {[string, string]} seg - Segment to validate
 * @param {Array} allSegs - Reference segment list
 * @returns {boolean} True if segment is valid
 */
export function isValidSegment(seg, allSegs = ALL_SEGS) {
  const norm = normalizeSegment(seg);
  return allSegs.some(
    ([x, y]) => normalizeSegment([x, y]).join("-") === norm.join("-"),
  );
}

/**
 * Validate entire glyph structure
 * Checks: required fields, valid types, valid segments, connected breath node
 * @param {Object} g - Glyph to validate
 * @param {Array} allSegs - Reference segment list
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validateGlyph(g, allSegs = ALL_SEGS) {
  const errors = [];

  // Check required fields
  if (!g.name) errors.push("Missing name");
  if (!g.type) errors.push("Missing type");
  if (!g.segs || !Array.isArray(g.segs)) errors.push("Missing or invalid segs");
  if (!g.bn) errors.push("Missing breath node (bn)");
  if (!g.ipa) errors.push("Missing IPA");

  // Check type is valid
  if (g.type && !["sibilant", "plosive", "resonant"].includes(g.type)) {
    errors.push(`Invalid type: ${g.type}`);
  }

  // Check breath is valid
  if (g.breath && !["up", "hold", "down"].includes(g.breath)) {
    errors.push(`Invalid breath: ${g.breath}`);
  }

  // Check all segments are valid
  if (g.segs && Array.isArray(g.segs)) {
    g.segs.forEach((seg, i) => {
      if (!isValidSegment(seg, allSegs)) {
        errors.push(`Invalid segment at index ${i}: ${seg}`);
      }
    });
  }

  // Check breath node is valid
  if (g.bn && !NODE_KEYS.includes(g.bn)) {
    errors.push(`Invalid breath node: ${g.bn}`);
  }

  // Check breath node connects to at least one segment
  if (g.segs && g.bn) {
    const nodeExists = g.segs.some(([a, b]) => a === g.bn || b === g.bn);
    if (!nodeExists) {
      errors.push(`Breath node ${g.bn} not connected to any segment`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create unique key for glyph geometry (for duplicate detection)
 * @param {Array} segs - Segment list
 * @returns {string} Unique geometry signature
 */
export function glyphKey(segs) {
  if (!segs || segs.length === 0) return "";
  return segs
    .map((seg) => normalizeSegment(seg).join("-"))
    .sort()
    .join("|");
}

/**
 * Find duplicate glyphs in a list
 * @param {Array} glyphList - List of glyphs to check
 * @returns {Array} Duplicates array with {original: index, duplicate: index}
 */
export function findDuplicateGlyphs(glyphList) {
  const seen = new Map();
  const duplicates = [];
  glyphList.forEach((g, i) => {
    const key = glyphKey(g.segs);
    if (key && seen.has(key)) {
      duplicates.push({ original: seen.get(key), duplicate: i });
    } else if (key) {
      seen.set(key, i);
    }
  });
  return duplicates;
}

/**
 * Comprehensive startup validation
 * Validates all glyphs, checks for duplicates, exposes debug interface
 * @returns {Array} Validation results for each glyph
 */
export function validateAllGlyphs() {
  console.group("🔍 GLYPH VALIDATION REPORT");
  let totalErrors = 0;
  const validationResults = CONS.map((g, i) => {
    const result = validateGlyph(g);
    if (!result.valid) {
      console.error(`  Glyph #${g.num} (${g.name}):`, result.errors);
      totalErrors += result.errors.length;
    }
    return result;
  });

  const duplicates = findDuplicateGlyphs(CONS);
  if (duplicates.length > 0) {
    console.warn(
      `  ⚠ Found ${duplicates.length} duplicate glyph geometries:`,
      duplicates,
    );
  }

  const validCount = validationResults.filter((r) => r.valid).length;
  console.log(
    `✓ Validation complete: ${validCount}/${CONS.length} glyphs valid, ${totalErrors} errors`,
  );
  console.groupEnd();

  // Expose for inspection in browser console
  window._GLYPH_DEBUG = {
    CONS,
    BY_NAME,
    BY_NUM,
    validateGlyph,
    findDuplicateGlyphs,
    allValidationResults: validationResults,
    duplicates,
  };

  return validationResults;
}

export default {
  normalizeSegment,
  isValidSegment,
  validateGlyph,
  glyphKey,
  findDuplicateGlyphs,
  validateAllGlyphs,
};
