import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";

// ============================================================================
//  CONTEXT FOR MASTER GRID AND ACTIVE SEGMENTS
// ============================================================================
const GridContext = createContext();

// ============================================================================
//  CONSTANTS & THEME (grid coordinates now in state, not here)
// ============================================================================
const THEME = {
  bg: "#090B15",
  cardBg: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.07)",
  textPrimary: "#E0E0E0",
  textSecondary: "rgba(255,255,255,0.6)",
  textMuted: "rgba(255,255,255,0.25)",
  accentSibilant: "#4FC3F7",
  accentPlosive: "#81C784",
  accentResonant: "#FFB74D",
  accentVowel: "#BA68C8",
  accentVoid: "#F06292",
};

const NODE_KEYS = ["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"];

// All possible undirected segments (as list of node pairs)
const ALL_SEGS = [
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

// Quick helper to normalize segment ordering (before CONS definition)
function normalizeSegment([a, b]) {
  return a < b ? [a, b] : [b, a];
}

// ============================================================================
//  BASE GLYPH DATA (24 consonants – independent of grid)
// ============================================================================
const CONS = [
  {
    num: 1,
    name: "S",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["TL", "TC"],
      ["TL", "ML"],
    ],
    breath: "up",
    bn: "TL",
    ipa: "/s/",
    desc: "Sharp Hiss",
  },
  {
    num: 2,
    name: "F",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["TL", "TC"],
      ["TC", "TR"],
    ],
    breath: "up",
    bn: "TC",
    ipa: "/f/",
    desc: "Friction Breath",
  },
  {
    num: 3,
    name: "SH",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["TC", "TR"],
      ["TR", "MR"],
    ],
    breath: "up",
    bn: "TR",
    ipa: "/ʃ/",
    desc: "Soft Sibilant",
  },
  {
    num: 4,
    name: "Z",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["TL", "ML"],
      ["ML", "MC"],
    ],
    breath: "up",
    bn: "ML",
    ipa: "/z/",
    desc: "Voiced Hiss",
  },
  {
    num: 5,
    name: "ZH",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["TC", "MC"],
      ["MC", "MR"],
    ],
    breath: "up",
    bn: "MC",
    ipa: "/ʒ/",
    desc: "Voiced Sibilant",
  },
  {
    num: 6,
    name: "TH",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["TR", "MR"],
      ["MR", "BR"],
    ],
    breath: "up",
    bn: "MR",
    ipa: "/θ/",
    desc: "Dental Fricative",
  },
  {
    num: 7,
    name: "DH",
    type: "sibilant",
    color: THEME.accentSibilant,
    segs: [
      ["ML", "MC"],
      ["MC", "BC"],
    ],
    breath: "up",
    bn: "MC",
    ipa: "/ð/",
    desc: "Voiced Dental",
  },
  {
    num: 8,
    name: "K",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["TL", "ML"],
      ["ML", "BL"],
    ],
    breath: "hold",
    bn: "ML",
    ipa: "/k/",
    desc: "Velar Stop",
  },
  {
    num: 9,
    name: "T",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["ML", "MC"],
      ["MC", "MR"],
      ["TC", "MC"],
      ["MC", "BC"],
    ],
    breath: "hold",
    bn: "MC",
    ipa: "/t/",
    desc: "Alveolar Stop",
  },
  {
    num: 10,
    name: "P",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["TR", "MR"],
      ["MR", "BR"],
    ],
    breath: "hold",
    bn: "MR",
    ipa: "/p/",
    desc: "Bilabial Stop",
  },
  {
    num: 11,
    name: "B",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["ML", "MC"],
      ["MC", "BC"],
    ],
    breath: "hold",
    bn: "MC",
    ipa: "/b/",
    desc: "Voiced Bilabial",
  },
  {
    num: 12,
    name: "D",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["TC", "MC"],
      ["MC", "BC"],
    ],
    breath: "hold",
    bn: "MC",
    ipa: "/d/",
    desc: "Voiced Alveolar",
  },
  {
    num: 13,
    name: "G",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["ML", "MC"],
      ["MC", "MR"],
    ],
    breath: "hold",
    bn: "MC",
    ipa: "/g/",
    desc: "Voiced Velar",
  },
  {
    num: 14,
    name: "K'",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["TL", "ML"],
      ["ML", "BL"],
      ["BL", "BC"],
    ],
    breath: "hold",
    bn: "BL",
    ipa: "/kʼ/",
    desc: "Ejective Velar",
  },
  {
    num: 15,
    name: "T'",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["ML", "MC"],
      ["MC", "MR"],
      ["TC", "MC"],
    ],
    breath: "hold",
    bn: "MC",
    ipa: "/tʼ/",
    desc: "Ejective Alveolar",
  },
  {
    num: 16,
    name: "P'",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [
      ["TR", "MR"],
      ["MR", "BR"],
      ["BR", "BC"],
    ],
    breath: "hold",
    bn: "BR",
    ipa: "/pʼ/",
    desc: "Ejective Bilabial",
  },
  {
    num: 17,
    name: "ʔ",
    type: "plosive",
    color: THEME.accentPlosive,
    segs: [["MC", "BC"]],
    breath: "hold",
    bn: "BC",
    ipa: "/ʔ/",
    desc: "Glottal Stop",
  },
  {
    num: 18,
    name: "NG",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["ML", "BL"],
      ["BL", "BC"],
    ],
    breath: "down",
    bn: "BL",
    ipa: "/ŋ/",
    desc: "Velar Nasal",
  },
  {
    num: 19,
    name: "M",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["BL", "BC"],
      ["BC", "BR"],
    ],
    breath: "down",
    bn: "BC",
    ipa: "/m/",
    desc: "Bilabial Nasal",
  },
  {
    num: 20,
    name: "L",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["BC", "BR"],
      ["MR", "BR"],
    ],
    breath: "down",
    bn: "BR",
    ipa: "/l/",
    desc: "Lateral Approximant",
  },
  {
    num: 21,
    name: "N",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["BL", "BC"],
      ["MC", "BC"],
    ],
    breath: "down",
    bn: "BC",
    ipa: "/n/",
    desc: "Alveolar Nasal",
  },
  {
    num: 22,
    name: "R",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["BC", "BR"],
      ["MC", "BC"],
    ],
    breath: "down",
    bn: "BC",
    ipa: "/r/",
    desc: "Alveolar Trill",
  },
  {
    num: 23,
    name: "W",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["MR", "BR"],
      ["MC", "BC"],
    ],
    breath: "down",
    bn: "BC",
    ipa: "/w/",
    desc: "Labiovelar Approximant",
  },
  {
    num: 24,
    name: "Y",
    type: "resonant",
    color: THEME.accentResonant,
    segs: [
      ["ML", "BL"],
      ["MR", "BR"],
    ],
    breath: "down",
    bn: "BL",
    ipa: "/j/",
    desc: "Palatal Approximant",
  },
];

const BY_NUM = Object.fromEntries(CONS.map((c) => [c.num, c]));
const BY_NAME = Object.fromEntries(CONS.map((c) => [c.name, c]));

// Freeze CONS array to prevent accidental mutations
Object.freeze(CONS);
Object.freeze(BY_NUM);
Object.freeze(BY_NAME);

// Precompute normalized segments for fast lookup
const ALL_SEGS_NORMALIZED = ALL_SEGS.map((seg) => normalizeSegment(seg));
const SEGMENT_LOOKUP = new Set(
  ALL_SEGS_NORMALIZED.map((seg) => seg.join("-"))
);

// Simple latin to glyph name mapping
const LATIN_TO_GLYPH = {
  s: "S",
  f: "F",
  z: "Z",
  S: "S",
  F: "F",
  Z: "Z",
  k: "K",
  t: "T",
  p: "P",
  b: "B",
  d: "D",
  g: "G",
  m: "M",
  n: "N",
  l: "L",
  r: "R",
  w: "W",
  y: "Y",
  // Extended mappings for advanced glyphs
  x: "SH",
  sh: "SH",
  SH: "SH",
  v: "ZH",
  zh: "ZH",
  ZH: "ZH",
  th: "TH",
  TH: "TH",
  dh: "DH",
  DH: "DH",
  ng: "NG",
  NG: "NG",
};

// ============================================================================
//  PHONETIC HIERARCHY (3 cores × 7 subsets × 9 variants)
// ============================================================================
const PHONETIC_CORES = {
  sibilant: {
    name: "Sibilant",
    breath: "up",
    row: "top",
    color: THEME.accentSibilant,
  },
  plosive: {
    name: "Plosive",
    breath: "hold",
    row: "mid",
    color: THEME.accentPlosive,
  },
  resonant: {
    name: "Resonant",
    breath: "down",
    row: "bot",
    color: THEME.accentResonant,
  },
};

const SUBSETS = {
  sibilant: [
    "alveolar",
    "postalveolar",
    "dental",
    "labiodental",
    "palatal",
    "lateral",
    "affricate",
  ],
  plosive: [
    "bilabial",
    "dental",
    "alveolar",
    "retroflex",
    "velar",
    "uvular",
    "glottal",
  ],
  resonant: [
    "bilabial nasal",
    "alveolar nasal",
    "velar nasal",
    "liquids",
    "glides",
    "lateral",
    "rhotic",
  ],
};

const VARIANTS = [
  "voiceless",
  "voiced",
  "aspirated",
  "nasalized",
  "long",
  "tense",
  "lax",
  "breathy",
  "glottalized",
];

// ============================================================================
//  VALIDATION & DATA INTEGRITY FUNCTIONS
// ============================================================================

// Validate that a segment exists in ALL_SEGS
function isValidSegment(seg, allSegs = ALL_SEGS) {
  const norm = normalizeSegment(seg);
  return allSegs.some(
    ([x, y]) => normalizeSegment([x, y]).join("-") === norm.join("-")
  );
}

// Validate entire glyph structure
function validateGlyph(g, allSegs = ALL_SEGS) {
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

// Create unique key for glyph (for duplicate detection)
function glyphKey(segs) {
  if (!segs || segs.length === 0) return "";
  return segs
    .map((seg) => normalizeSegment(seg).join("-"))
    .sort()
    .join("|");
}

// Find duplicate glyphs
function findDuplicateGlyphs(glyphList) {
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

// Comprehensive startup validation
function validateAllGlyphs() {
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
      duplicates
    );
  }
  
  const validCount = validationResults.filter((r) => r.valid).length;
  console.log(
    `✓ Validation complete: ${validCount}/${CONS.length} glyphs valid, ${totalErrors} errors`
  );
  console.groupEnd();
  
  // Expose for inspection
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

// ============================================================================
//  GLYPH GENOME (32-bit) – bit field definitions
// ============================================================================
const GENOME_BITS = {
  coreClass: { bits: 3, shift: 29 }, // 0-7 (0=invalid,1=sibilant,2=plosive,3=resonant)
  subsetFamily: { bits: 3, shift: 26 }, // 0-7
  variantIndex: { bits: 4, shift: 22 }, // 0-15 (only 0-8 used)
  nodeMask: { bits: 9, shift: 13 }, // bits 0-8 correspond to nodes 1-9
  edgeMask: { bits: 8, shift: 5 }, // bits 0-7 correspond to edge types
  symmetry: { bits: 3, shift: 2 }, // 0=none,1=mirrorX,2=mirrorY,3=rot90,4=rot180,5=rot270
  curvature: { bits: 2, shift: 0 }, // 0=block,1=curved,2=hybrid,3=calligraphic
};

// Edge type mapping (for edgeMask)
const EDGE_TYPES = [
  "horizontal",
  "vertical",
  "diagonal",
  "centerArc",
  "outerArc",
  "loop",
  "cross",
  "extendedTail",
];

// ============================================================================
//  COGNITIVE MAP – semantic coordinates
// ============================================================================
const COGNITIVE_AXES = {
  1: "Potential",
  2: "Expansion",
  3: "Emergence",
  4: "Initiation",
  5: "Stabilization",
  6: "Dissolution",
  7: "Contraction",
  8: "Completion",
  9: "Void",
};

// Map semantic coordinates to glyph sequence (simplified example)
function semanticToGlyphs(coord) {
  // coord is array [core, subset, variant] e.g., [1,3,5]
  const [core, subset, variant] = coord;
  // Find a consonant that matches these (simplified: just use first consonant)
  const match = CONS.find((c) => c.num === core * 10 + subset); // dummy mapping
  return match ? [match] : [CONS[0]];
}
// ============================================================================
//  UTILITIES (now take grid as argument)
// ============================================================================

function isConnected(segs, grid) {
  if (segs.length === 0) return false;
  const nodes = new Set();
  segs.forEach(([a, b]) => {
    nodes.add(a);
    nodes.add(b);
  });
  const adj = {};
  nodes.forEach((n) => (adj[n] = []));
  segs.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  const visited = new Set();
  const stack = [Array.from(nodes)[0]];
  while (stack.length) {
    const n = stack.pop();
    if (visited.has(n)) continue;
    visited.add(n);
    adj[n].forEach((nei) => {
      if (!visited.has(nei)) stack.push(nei);
    });
  }
  return visited.size === nodes.size;
}

function generateRandomGlyph(segmentCount = null, grid) {
  if (segmentCount === null) segmentCount = Math.floor(Math.random() * 12) + 1;
  const startSeg = ALL_SEGS[Math.floor(Math.random() * ALL_SEGS.length)];
  const segs = [startSeg];
  const nodes = new Set([startSeg[0], startSeg[1]]);

  while (segs.length < segmentCount) {
    const candidates = [];
    ALL_SEGS.forEach(([a, b]) => {
      const key = [a, b].sort().join("-");
      if (segs.some((s) => s.sort().join("-") === key)) return;
      if (nodes.has(a) || nodes.has(b)) candidates.push([a, b]);
    });
    if (candidates.length === 0) break;
    const newSeg = candidates[Math.floor(Math.random() * candidates.length)];
    segs.push(newSeg);
    nodes.add(newSeg[0]);
    nodes.add(newSeg[1]);
  }

  const types = ["sibilant", "plosive", "resonant"];
  const type = types[Math.floor(Math.random() * types.length)];
  const breaths = { sibilant: "up", plosive: "hold", resonant: "down" };
  const breath = breaths[type];
  const bn = Array.from(nodes)[Math.floor(Math.random() * nodes.size)];
  const color =
    type === "sibilant"
      ? THEME.accentSibilant
      : type === "plosive"
        ? THEME.accentPlosive
        : THEME.accentResonant;

  return { segs, type, breath, bn, color, name: "?" };
}

function evolveGlyphs(count, existing, grid) {
  const newGlyphs = [];
  for (let i = 0; i < count; i++) {
    if (existing.length > 0 && Math.random() > 0.5) {
      const base = existing[Math.floor(Math.random() * existing.length)];
      let newSegs = [...base.segs];
      const op = Math.random();
      if (op < 0.33 && newSegs.length < 12) {
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
        const idx = Math.floor(Math.random() * newSegs.length);
        const candidate = newSegs.filter((_, i) => i !== idx);
        if (isConnected(candidate, grid)) newSegs = candidate;
      }
      if (isConnected(newSegs, grid)) {
        const glyph = { ...base, segs: newSegs };
        const genome = encodeGenome(glyph);
        newGlyphs.push({ ...glyph, genome });
      } else {
        const glyph = base;
        const genome = encodeGenome(glyph);
        newGlyphs.push({ ...glyph, genome });
      }
    } else {
      const glyph = generateRandomGlyph(null, grid);
      const genome = encodeGenome(glyph);
      newGlyphs.push({ ...glyph, genome });
    }
  }
  return newGlyphs;
}

// ============================================================================
//  GLYPH GENOME UTILITIES
// ============================================================================
function encodeGenome(glyph) {
  // Map glyph properties to bit fields (simplified)
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
    // find edge type – simplistic
    edgeMask |= 1; // just set bit0
  });
  genome |= edgeMask << GENOME_BITS.edgeMask.shift;

  // symmetry and curvature – default
  genome |= 0 << GENOME_BITS.symmetry.shift;
  genome |= 0 << GENOME_BITS.curvature.shift;
  return genome;
}

function decodeGenome(genome, grid) {
  // Extract fields
  const core =
    (genome >> GENOME_BITS.coreClass.shift) &
    ((1 << GENOME_BITS.coreClass.bits) - 1);
  const subset =
    (genome >> GENOME_BITS.subsetFamily.shift) &
    ((1 << GENOME_BITS.subsetFamily.bits) - 1);
  const variant =
    (genome >> GENOME_BITS.variantIndex.shift) &
    ((1 << GENOME_BITS.variantIndex.bits) - 1);
  const nodeMask =
    (genome >> GENOME_BITS.nodeMask.shift) &
    ((1 << GENOME_BITS.nodeMask.bits) - 1);
  const edgeMask =
    (genome >> GENOME_BITS.edgeMask.shift) &
    ((1 << GENOME_BITS.edgeMask.bits) - 1);
  const symmetry =
    (genome >> GENOME_BITS.symmetry.shift) &
    ((1 << GENOME_BITS.symmetry.bits) - 1);
  const curvature =
    (genome >> GENOME_BITS.curvature.shift) &
    ((1 << GENOME_BITS.curvature.bits) - 1);

  // Reconstruct glyph from nodeMask and edgeMask (simplified)
  const activeNodes = NODE_KEYS.filter((_, i) => nodeMask & (1 << i));
  // For simplicity, just return a placeholder
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

function buildPath(segs, type, cursive, handwriting, grid) {
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
      return `M${x1} ${y1}Q${+cx.toFixed(1)} ${+cy.toFixed(1)} ${x2} ${y2}`;
    })
    .join(" ");
}

function getStrokeOrder(segs, grid) {
  return [...segs].sort((a, b) => {
    const [x1, y1] = grid[a[0]];
    const [x2, y2] = grid[a[1]];
    const [x3, y3] = grid[b[0]];
    const [x4, y4] = grid[b[1]];
    const cyA = (y1 + y2) / 2;
    const cyB = (y3 + y4) / 2;
    if (cyA !== cyB) return cyA - cyB;
    const cxA = (x1 + x2) / 2;
    const cxB = (x3 + x4) / 2;
    return cxA - cxB;
  });
}

function spiralPositions(steps) {
  const positions = [{ x: 0, y: 0 }];
  if (steps === 0) return positions;

  let x = 0,
    y = 0;
  let dir = 0;
  let stepSize = 1;
  let stepCount = 0;
  let turnCount = 0;

  for (let i = 1; i < steps; i++) {
    switch (dir) {
      case 0:
        y += 1;
        break;
      case 1:
        x += 1;
        break;
      case 2:
        y -= 1;
        break;
      case 3:
        x -= 1;
        break;
    }
    positions.push({ x, y });

    stepCount++;
    if (stepCount === stepSize) {
      dir = (dir + 1) % 4;
      stepCount = 0;
      turnCount++;
      if (turnCount % 2 === 0) stepSize++;
    }
  }
  return positions;
}

// ============================================================================
//  MASTER GLYPH EDITOR COMPONENT (interactive like GlyphEditor)
// ============================================================================
function GridEditor({ grid, setGrid }) {
  const { activeSegs, setActiveSegs } = useContext(GridContext);
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle node selection for segment toggling (like GlyphEditor)
  const handleNodeClick = (node) => {
    if (selectedNode === null) {
      setSelectedNode(node);
    } else if (selectedNode === node) {
      setSelectedNode(null);
    } else {
      // Toggle segment between these two nodes
      const segExists = activeSegs.some(
        ([a, b]) =>
          (a === selectedNode && b === node) ||
          (a === node && b === selectedNode),
      );
      let newSegs;
      if (segExists) {
        newSegs = activeSegs.filter(
          ([a, b]) =>
            !(
              (a === selectedNode && b === node) ||
              (a === node && b === selectedNode)
            ),
        );
      } else {
        newSegs = [...activeSegs, [selectedNode, node]];
      }
      setActiveSegs(newSegs);
      setSelectedNode(null);
    }
  };

  return (
    <div
      style={{
        background: THEME.cardBg,
        border: THEME.border,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ color: THEME.textSecondary, marginTop: 0 }}>
        ✎ MASTER GLYPH EDITOR
      </h3>
      <p style={{ fontSize: 10, color: THEME.textMuted }}>
        Click nodes to toggle segments. Use numeric inputs to adjust positions.
        All glyphs update instantly.
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <svg
          width="300"
          height="300"
          viewBox="-10 -10 80 80"
          style={{ background: "#111", borderRadius: 4, cursor: "crosshair" }}
        >
          {/* Grid lines - only active segments */}
          {activeSegs.map(([a, b], i) => (
            <line
              key={i}
              x1={grid[a][0]}
              y1={grid[a][1]}
              x2={grid[b][0]}
              y2={grid[b][1]}
              stroke="#fff"
              strokeWidth="1.5"
            />
          ))}
          {/* Ghost of all possible segments */}
          {ALL_SEGS.map(([a, b], i) => {
            const isActive = activeSegs.some(
              ([x, y]) => (x === a && y === b) || (x === b && y === a),
            );
            return (
              <line
                key={`ghost-${i}`}
                x1={grid[a][0]}
                y1={grid[a][1]}
                x2={grid[b][0]}
                y2={grid[b][1]}
                stroke={isActive ? "transparent" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? "0" : "0.5"}
              />
            );
          })}
          {/* Nodes */}
          {NODE_KEYS.map((k) => (
            <circle
              key={k}
              cx={grid[k][0]}
              cy={grid[k][1]}
              r="4"
              fill={selectedNode === k ? "#fff" : "rgba(255,255,255,0.4)"}
              stroke="#fff"
              strokeWidth="1"
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick(k)}
            />
          ))}
        </svg>

        {/* Controls */}
        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setActiveSegs(ALL_SEGS.map(([a, b]) => [a, b]))}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Show All
            </button>
          </div>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setActiveSegs([])}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Clear All
            </button>
          </div>
          <div
            style={{
              marginBottom: 12,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 12,
            }}
          >
            <label
              style={{
                fontSize: 9,
                color: THEME.textMuted,
                display: "block",
                marginBottom: 4,
              }}
            >
              Active Segments: {activeSegs.length}/{ALL_SEGS.length}
            </label>
          </div>
        </div>
      </div>

      {/* Numeric inputs for precise grid control */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 12,
        }}
      >
        {NODE_KEYS.map((k) => (
          <div key={k}>
            <label style={{ fontSize: 9, color: THEME.textMuted }}>{k}:</label>
            <input
              type="number"
              value={Math.round(grid[k][0])}
              onChange={(e) =>
                setGrid((prev) => ({
                  ...prev,
                  [k]: [parseFloat(e.target.value) || 0, grid[k][1]],
                }))
              }
              style={{
                width: 50,
                background: "#222",
                color: "#fff",
                border: "none",
                marginRight: 4,
                fontSize: 9,
              }}
            />
            <input
              type="number"
              value={Math.round(grid[k][1])}
              onChange={(e) =>
                setGrid((prev) => ({
                  ...prev,
                  [k]: [grid[k][0], parseFloat(e.target.value) || 0],
                }))
              }
              style={{
                width: 50,
                background: "#222",
                color: "#fff",
                border: "none",
                fontSize: 9,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
//  SVG GLYPH RENDERER (now uses grid from context)
// ============================================================================
function GlyphSVG({
  segs,
  type,
  color,
  breath,
  bn,
  vowel = null,
  sz = 64,
  cursive = false,
  showNodes = true,
  animate = false,
  progress = 1,
  handwriting = false,
}) {
  const { grid, activeSegs } = useContext(GridContext);
  const strokeWidth = 2.8;
  const nodeR = 2.8;

  // Filter segments to only show those that are active in the master glyph
  const filteredSegs = segs.filter(([a, b]) =>
    activeSegs.some(([x, y]) => (x === a && y === b) || (x === b && y === a)),
  );

  const ordered = animate ? getStrokeOrder(filteredSegs, grid) : filteredSegs;
  const visibleSegs = animate
    ? ordered.slice(0, Math.floor(ordered.length * progress))
    : filteredSegs;

  return (
    <svg width={sz} height={sz} viewBox="-10 -10 80 80" overflow="visible">
      {/* Ghost grid */}
      {ALL_SEGS.map(([a, b], i) => (
        <line
          key={`ghost-${i}`}
          x1={grid[a][0]}
          y1={grid[a][1]}
          x2={grid[b][0]}
          y2={grid[b][1]}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
        />
      ))}
      {NODE_KEYS.map((k, i) => (
        <circle
          key={`ghost-node-${i}`}
          cx={grid[k][0]}
          cy={grid[k][1]}
          r={1.4}
          fill="rgba(255,255,255,0.1)"
        />
      ))}

      {/* Active segments */}
      {visibleSegs.map(([a, b], i) => {
        const path = buildPath([[a, b]], type, cursive, handwriting, grid);
        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${color})` }}
          />
        );
      })}

      {/* Nodes */}
      {showNodes &&
        (() => {
          const nodes = new Set();
          segs.forEach(([a, b]) => {
            nodes.add(a);
            nodes.add(b);
          });
          return [...nodes].map((k) => (
            <circle
              key={k}
              cx={grid[k][0]}
              cy={grid[k][1]}
              r={nodeR}
              fill={color}
            />
          ));
        })()}

      {/* Vowel modifier (if any) */}
      {vowel &&
        (() => {
          // Simple vowel markers: dot, loop, or curve
          const vowelColor = THEME.accentVowel;
          if (vowel === "i") {
            return (
              <circle
                cx={grid.BC[0]}
                cy={grid.BC[1] - 8}
                r={3}
                fill={vowelColor}
              />
            );
          } else if (vowel === "a") {
            return (
              <circle
                cx={grid.MC[0]}
                cy={grid.MC[1]}
                r={4}
                fill={vowelColor}
                fillOpacity={0.5}
              />
            );
          } else if (vowel === "u") {
            return (
              <path
                d={`M${grid.TC[0] - 5} ${grid.TC[1] - 5} Q${grid.TC[0]} ${grid.TC[1] - 10} ${grid.TC[0] + 5} ${grid.TC[1] - 5}`}
                stroke={vowelColor}
                fill="none"
                strokeWidth={2}
              />
            );
          }
          return null;
        })()}

      {/* Breath marker */}
      {breath === "up" &&
        bn &&
        (() => {
          const [bx, by] = grid[bn];
          return (
            <g
              stroke={color}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${color})` }}
            >
              <line x1={bx} y1={by - 1} x2={bx} y2={by - 15} strokeWidth={2} />
              <line
                x1={bx - 4}
                y1={by - 10}
                x2={bx}
                y2={by - 15}
                strokeWidth={1.5}
              />
              <line
                x1={bx + 4}
                y1={by - 10}
                x2={bx}
                y2={by - 15}
                strokeWidth={1.5}
              />
            </g>
          );
        })()}
      {breath === "down" &&
        bn &&
        (() => {
          const [bx, by] = grid[bn];
          return (
            <path
              d={`M${bx} ${by + 1}Q${bx + 8} ${by + 10} ${bx} ${by + 18}`}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${color})` }}
            />
          );
        })()}
      {breath === "hold" &&
        bn &&
        (() => {
          const [bx, by] = grid[bn];
          return (
            <rect
              x={bx - 5.5}
              y={by - 5.5}
              width={11}
              height={11}
              fill="none"
              stroke={color}
              strokeWidth={1.8}
            />
          );
        })()}
    </svg>
  );
}

// ============================================================================
//  WORD DISPLAY (uses grid from context)
// ============================================================================
function WordDisplay({
  word,
  cursive,
  handwriting,
  layout = "vertical",
  spiralSteps = 9,
}) {
  const { grid } = useContext(GridContext);
  const glyphs = word
    .split("")
    .map((ch) => {
      const name = LATIN_TO_GLYPH[ch.toUpperCase()] || ch.toUpperCase();
      return CONS.find((g) => g.name === name) || null;
    })
    .filter((g) => g);

  if (glyphs.length === 0) return null;

  const baseSpacing = 70;
  const wordWidth = 120;
  const wordHeight = glyphs.length * baseSpacing + 40;

  // renderWordAt helper is defined below (outside this component)

  if (layout === "vertical") {
    return (
      <svg
        width={wordWidth}
        height={wordHeight}
        viewBox={`0 0 ${wordWidth} ${wordHeight}`}
      >
        {renderWordAt(0, 0, glyphs, cursive, handwriting, grid)}
      </svg>
    );
  }

  if (layout === "spiral") {
    const positions = spiralPositions(spiralSteps);
    const margin = 50;
    const xs = positions.map((p) => p.x * wordWidth);
    const ys = positions.map((p) => p.y * wordHeight);
    const minX = Math.min(...xs) - margin;
    const maxX = Math.max(...xs) + wordWidth + margin;
    const minY = Math.min(...ys) - margin;
    const maxY = Math.max(...ys) + wordHeight + margin;

    let connectorPath = "";
    if (positions.length > 1) {
      const startX = positions[0].x * wordWidth + wordWidth / 2;
      const startY = positions[0].y * wordHeight + wordHeight / 2;
      connectorPath = `M${startX} ${startY}`;
      for (let i = 1; i < positions.length; i++) {
        const px = positions[i].x * wordWidth + wordWidth / 2;
        const py = positions[i].y * wordHeight + wordHeight / 2;
        connectorPath += ` L${px} ${py}`;
      }
    }

    return (
      <svg
        width={maxX - minX}
        height={maxY - minY}
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      >
        {connectorPath && (
          <path
            d={connectorPath}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 3"
          />
        )}
        {positions.map((pos, idx) => (
          <g
            key={idx}
            transform={`translate(${pos.x * wordWidth}, ${pos.y * wordHeight})`}
          >
            {renderWordAt(0, 0, glyphs, cursive, handwriting, grid)}
          </g>
        ))}
      </svg>
    );
  }
  return null;
}

// ============================================================================
//  FRACTAL WORD DISPLAY (grid expansion)
// ============================================================================
function FractalWordDisplay({
  word,
  cursive,
  handwriting,
  level = 0,
  maxLevel = 2,
}) {
  const { grid } = useContext(GridContext);
  const glyphs = word
    .split("")
    .map((ch) => {
      const name = LATIN_TO_GLYPH[ch.toUpperCase()] || ch.toUpperCase();
      return CONS.find((g) => g.name === name) || null;
    })
    .filter((g) => g);

  if (glyphs.length === 0) return null;

  const cellSize = 120; // size of one word cell
  const spacing = 10;

  // If at max level, just render the word
  if (level >= maxLevel) {
    return (
      <svg
        width={cellSize}
        height={cellSize}
        viewBox={`0 0 ${cellSize} ${cellSize}`}
      >
        <g transform={`translate(10,10)`}>
          {renderWordAt(0, 0, glyphs, cursive, handwriting, grid)}
        </g>
      </svg>
    );
  }

  // Otherwise, render a 3x3 grid of words (all the same word for demonstration)
  const positions = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      positions.push({
        x: col * (cellSize + spacing),
        y: row * (cellSize + spacing),
      });
    }
  }

  return (
    <svg
      width={3 * cellSize + 2 * spacing}
      height={3 * cellSize + 2 * spacing}
      viewBox={`0 0 ${3 * cellSize + 2 * spacing} ${3 * cellSize + 2 * spacing}`}
    >
      {positions.map((pos, idx) => (
        <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
          <FractalWordDisplay
            word={word}
            cursive={cursive}
            handwriting={handwriting}
            level={level + 1}
            maxLevel={maxLevel}
          />
        </g>
      ))}
    </svg>
  );
}

// Helper to render a single vertical word (same as before, but now takes grid)
function renderWordAt(x, y, glyphs, cursive, handwriting, grid) {
  const baseSpacing = 70;
  const connectorPoints = glyphs.map((g, i) => {
    if (g.bn) {
      const [gx, gy] = grid[g.bn];
      return [10 + gx, i * baseSpacing + 30 + gy];
    }
    return [10 + 30, i * baseSpacing + 30 + 30];
  });

  let connectorPath = "";
  if (connectorPoints.length > 1) {
    const [x0, y0] = connectorPoints[0];
    connectorPath = `M${x0} ${y0}`;
    for (let i = 1; i < connectorPoints.length; i++) {
      const [x1, y1] = connectorPoints[i];
      const prev = connectorPoints[i - 1];
      const mx = (prev[0] + x1) / 2;
      const my = (prev[1] + y1) / 2;
      connectorPath += ` Q${prev[0]} ${prev[1]} ${mx} ${my} L${x1} ${y1}`;
    }
  }

  return (
    <g>
      {connectorPath && (
        <path
          d={connectorPath}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
        />
      )}
      {glyphs.map((g, i) => (
        <g key={i} transform={`translate(10, ${i * baseSpacing + 30})`}>
          <GlyphSVG
            segs={g.segs}
            type={g.type}
            color={g.color}
            breath={g.breath}
            bn={g.bn}
            sz={60}
            cursive={cursive}
            showNodes={false}
            handwriting={handwriting}
          />
        </g>
      ))}
    </g>
  );
}

// ============================================================================
//  GLYPH EDITOR (interactive)
// ============================================================================
function GlyphEditor({ onGlyphChange }) {
  const { grid } = useContext(GridContext);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeSegs, setActiveSegs] = useState([]);
  const [type, setType] = useState("plosive");
  const [breath, setBreath] = useState("hold");
  const [bn, setBn] = useState("MC");

  const handleNodeClick = (node) => {
    if (selectedNode === null) {
      setSelectedNode(node);
    } else if (selectedNode === node) {
      setSelectedNode(null);
    } else {
      const segExists = activeSegs.some(
        ([a, b]) =>
          (a === selectedNode && b === node) ||
          (a === node && b === selectedNode),
      );
      let newSegs;
      if (segExists) {
        newSegs = activeSegs.filter(
          ([a, b]) =>
            !(
              (a === selectedNode && b === node) ||
              (a === node && b === selectedNode)
            ),
        );
      } else {
        newSegs = [...activeSegs, [selectedNode, node]];
      }
      setActiveSegs(newSegs);
      setSelectedNode(null);
      if (!isConnected(newSegs, grid) && newSegs.length > 0) {
        console.warn("Glyph is disconnected!");
      }
      onGlyphChange({ segs: newSegs, type, breath, bn });
    }
  };

  useEffect(() => {
    onGlyphChange({ segs: activeSegs, type, breath, bn });
  }, [type, breath, bn]);

  return (
    <div
      style={{
        background: THEME.cardBg,
        border: THEME.border,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ color: THEME.textSecondary, marginTop: 0 }}>
        ✎ GLYPH EDITOR
      </h3>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <svg width="200" height="200" viewBox="-10 -10 80 80">
          {ALL_SEGS.map(([a, b], i) => {
            const active = activeSegs.some(
              ([x, y]) => (x === a && y === b) || (x === b && y === a),
            );
            return (
              <line
                key={i}
                x1={grid[a][0]}
                y1={grid[a][1]}
                x2={grid[b][0]}
                y2={grid[b][1]}
                stroke={active ? "#fff" : "rgba(255,255,255,0.15)"}
                strokeWidth={active ? 2.5 : 1}
                strokeLinecap="round"
              />
            );
          })}
          {NODE_KEYS.map((k) => {
            const isSelected = selectedNode === k;
            return (
              <circle
                key={k}
                cx={grid[k][0]}
                cy={grid[k][1]}
                r={4}
                fill={isSelected ? "#fff" : "rgba(255,255,255,0.3)"}
                stroke="#fff"
                strokeWidth={1}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(k)}
              />
            );
          })}
        </svg>

        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{ color: THEME.textMuted, display: "block", fontSize: 10 }}
            >
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              <option value="sibilant">Sibilant</option>
              <option value="plosive">Plosive</option>
              <option value="resonant">Resonant</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{ color: THEME.textMuted, display: "block", fontSize: 10 }}
            >
              Breath
            </label>
            <select
              value={breath}
              onChange={(e) => setBreath(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              <option value="up">Inhale (↑)</option>
              <option value="hold">Hold (◈)</option>
              <option value="down">Exhale (↓)</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{ color: THEME.textMuted, display: "block", fontSize: 10 }}
            >
              Base Node
            </label>
            <select
              value={bn}
              onChange={(e) => setBn(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              {NODE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setActiveSegs([]);
              setSelectedNode(null);
            }}
            style={{
              background: "transparent",
              border: THEME.border,
              color: "#fff",
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//  ANIMATED GLYPH (breath-sync)
// ============================================================================
function AnimatedGlyph({ glyph, cursive, handwriting }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();
  const { grid } = useContext(GridContext);

  const ordered = getStrokeOrder(glyph.segs, grid);
  const totalSegs = ordered.length;

  const speeds = { up: 0.02, hold: 0.01, down: 0.015 };
  const speed = speeds[glyph.breath] || 0.015;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        let next = p + speed;
        if (next >= 1) {
          setPhase((phase + 1) % 3);
          return 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [phase, speed]);

  const visibleCount = Math.floor(progress * totalSegs);
  const visibleSegs = ordered.slice(0, visibleCount);

  return (
    <div style={{ textAlign: "center" }}>
      <GlyphSVG
        segs={visibleSegs}
        type={glyph.type}
        color={glyph.color}
        breath={glyph.breath}
        bn={glyph.bn}
        sz={80}
        cursive={cursive}
        showNodes
        handwriting={handwriting}
      />
      <div style={{ fontSize: 10, color: THEME.textMuted }}>
        {["↑ INHALE", "◈ HOLD", "↓ EXHALE"][phase]}
      </div>
    </div>
  );
}

// ============================================================================
//  FONT EXPORT (unchanged, but uses grid from context via closure? needs grid)
// ============================================================================
function downloadTTF(glyphs, fontName, grid, useCursive) {
  try {
    if (!window.opentype) {
      alert("opentype.js is loading. Please wait a moment and try again.");
      return;
    }
    const opentype = window.opentype;

    // Build glyphs array
    const glyphsArray = [];
    let glyphCount = 0;

    // Add .notdef glyph (required)
    const notdefPath = new opentype.Path();
    notdefPath.moveTo(0, 0);
    notdefPath.lineTo(500, 0);
    notdefPath.lineTo(500, 700);
    notdefPath.lineTo(0, 700);
    notdefPath.closePath();

    glyphsArray.push(
      new opentype.Glyph({
        name: ".notdef",
        unicode: 0,
        advanceWidth: 500,
        path: notdefPath,
      }),
    );

    // Add space glyph (required)
    glyphsArray.push(
      new opentype.Glyph({
        name: "space",
        unicode: 32,
        advanceWidth: 300,
        path: new opentype.Path(),
      }),
    );

    // Map glyph names to ASCII characters
    const glyphNameToChar = {
      S: 115, // s
      F: 102, // f
      SH: 120, // x (sh)
      Z: 122, // z
      ZH: 118, // v (zh)
      TH: 116, // t (th)
      DH: 100, // d (dh)
      K: 107, // k
      T: 84, // T (uppercase)
      P: 112, // p
      B: 98, // b
      G: 103, // g
      NG: 110, // n
      M: 109, // m
      L: 108, // l
      N: 78, // N (uppercase)
      R: 114, // r
      W: 119, // w
      Y: 121, // y
    };

    // Add each consonant glyph
    glyphs.forEach((glyph, index) => {
      try {
        if (glyph.segs && glyph.segs.length > 0) {
          if (glyph.genome == null) {
            glyph.genome = encodeGenome(glyph);
          }
          const genomeHex = glyph.genome.toString(16).padStart(8, "0");
          const path = new opentype.Path();

          // Create thick stroked lines (rectangles) for each segment
          glyph.segs.forEach(([a, b], segIdx) => {
            const [x1, y1] = grid[a];
            const [x2, y2] = grid[b];
            const scale = 30; // Scale to font space
            const thickness = 60; // Line thickness

            const fx1 = x1 * scale + 200;
            const fy1 = 1000 - y1 * scale;
            const fx2 = x2 * scale + 200;
            const fy2 = 1000 - y2 * scale;

            // Calculate perpendicular vector for stroke width
            const dx = fx2 - fx1;
            const dy = fy2 - fy1;
            const len = Math.hypot(dx, dy) || 1;
            const px = (-dy / len) * (thickness / 2);
            const py = (dx / len) * (thickness / 2);

            // Draw rectangle (thick line) for each segment
            if (segIdx === 0) {
              path.moveTo(fx1 + px, fy1 + py);
            } else {
              path.closePath();
              path.moveTo(fx1 + px, fy1 + py);
            }
            path.lineTo(fx2 + px, fy2 + py);
            path.lineTo(fx2 - px, fy2 - py);
            path.lineTo(fx1 - px, fy1 - py);
          });

          if (glyph.segs.length > 0) {
            path.closePath();
          }

          // Use mapped Unicode or fallback to private use area
          const unicode = glyphNameToChar[glyph.name] || 0xe000 + index;

          glyphsArray.push(
            new opentype.Glyph({
              name: `${glyph.name || `glyph${index}`}_0x${genomeHex}`,
              unicode: unicode,
              advanceWidth: 600,
              path: path,
            }),
          );
          glyphCount++;
        }
      } catch (e) {
        console.error(`Error processing glyph ${index}:`, e);
      }
    });

    // Create font with proper metadata
    const font = new opentype.Font({
      familyName: fontName,
      styleName: "Regular",
      unitsPerEm: 1000,
      ascender: 800,
      descender: -200,
      tablesVersion: "1.0",
      glyphs: glyphsArray,
      kerningPairs: {},
    });

    // Generate binary font
    const buffer = font.toArrayBuffer();

    if (!buffer || buffer.byteLength === 0) {
      throw new Error("Font buffer is empty");
    }

    // Download
    const blob = new Blob([buffer], { type: "application/font-ttf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fontName}.ttf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 500);

    console.log(
      `✓ Font exported: ${fontName}.ttf (${(buffer.byteLength / 1024).toFixed(2)} KB, ${glyphCount} glyphs)`,
    );
    alert(
      `✓ Font downloaded!\nFile: ${fontName}.ttf\nSize: ${(buffer.byteLength / 1024).toFixed(2)} KB\nGlyphs: ${glyphCount}\n\nTry typing: s, f, x, z, v, t, d, k, p, b, g, n, m, l, r, w, y`,
    );
  } catch (error) {
    console.error("Font download error:", error);
    console.error("Stack:", error.stack);
    alert(`Error exporting font:\n${error.message}`);
  }
}

// ============================================================================
//  KEYBOARD LAYOUT (uses grid from context)
// ============================================================================
function KeyboardLayout({ glyphMap }) {
  const { grid } = useContext(GridContext);
  const rows = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ];

  return (
    <svg width="600" height="200" viewBox="0 0 600 200">
      {rows.map((row, ri) =>
        row.map((key, ki) => {
          const x = ki * 40 + ri * 10;
          const y = ri * 40 + 20;
          const glyphName = glyphMap[key] || "?";
          const glyph = CONS.find((g) => g.name === glyphName);
          return (
            <g key={`${ri}-${ki}`} transform={`translate(${x}, ${y})`}>
              <rect
                width="36"
                height="36"
                rx="4"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.2)"
              />
              <text x="18" y="20" fontSize="10" fill="#fff" textAnchor="middle">
                {key}
              </text>
              {glyph && (
                <GlyphSVG
                  segs={glyph.segs}
                  type={glyph.type}
                  color={glyph.color}
                  sz={20}
                  cursive={false}
                  showNodes={false}
                  breath={null}
                />
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
}

// ============================================================================
//  MAIN COMPONENT
// ============================================================================
export default function NonalCircuitStudio() {
  // Grid state – default coordinates
  const [grid, setGrid] = useState({
    TL: [10, 10],
    TC: [30, 10],
    TR: [50, 10],
    ML: [10, 30],
    MC: [30, 30],
    MR: [50, 30],
    BL: [10, 50],
    BC: [30, 50],
    BR: [50, 50],
  });

  // Active segments from master glyph editor
  const [activeSegs, setActiveSegs] = useState(
    ALL_SEGS.map(([a, b]) => [a, b]), // Start with all segments visible
  );

  const [cursive, setCursive] = useState(false);
  const [handwriting, setHandwriting] = useState(false);
  const [selectedGlyph, setSelectedGlyph] = useState(CONS[0]);
  const [customGlyph, setCustomGlyph] = useState({
    segs: [],
    type: "plosive",
    breath: "hold",
    bn: "MC",
  });
  const [word, setWord] = useState("SFT");
  const [evolvedGlyphs, setEvolvedGlyphs] = useState([]);
  const [mathExpr, setMathExpr] = useState("3+4*2");
  // semantic coordinate generator state (core-subset-variant)
  const [semanticCoord, setSemanticCoord] = useState("1-1-1");
  const [generatedWord, setGeneratedWord] = useState("SFT");
  const [layout, setLayout] = useState("vertical");
  const [spiralSteps, setSpiralSteps] = useState(9);
  const [fontName, setFontName] = useState("GlyphStudio");

  useEffect(() => {
    // Run validation on mount
    validateAllGlyphs();
    
    if (!window.opentype) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js";
      script.async = true;
      script.onload = () => {
        console.log("✓ opentype.js loaded successfully");
      };
      script.onerror = () => {
        console.error("✗ Failed to load opentype.js");
      };
      document.body.appendChild(script);
    } else {
      console.log("✓ opentype.js already available");
    }
  }, []);

  const handleEvolve = () => {
    const newGlyphs = evolveGlyphs(12, evolvedGlyphs, grid);
    setEvolvedGlyphs(newGlyphs);
  };

  const handleSemanticGenerate = () => {
    const parts = semanticCoord.split("-").map(Number);
    if (parts.length === 3) {
      const glyphs = semanticToGlyphs(parts);
      const wordStr = glyphs.map((g) => g.name).join("");
      setWord(wordStr);
      setGeneratedWord(wordStr);
    }
  };

  const keyMap = {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
    e: "E",
    f: "F",
    g: "G",
    h: "H",
    i: "I",
    j: "J",
    k: "K",
    l: "L",
    m: "M",
    n: "N",
    o: "O",
    p: "P",
    q: "Q",
    r: "R",
    s: "S",
    t: "T",
    u: "U",
    v: "V",
    w: "W",
    x: "X",
    y: "Y",
    z: "Z",
    1: "S",
    2: "F",
    3: "SH",
    4: "Z",
    5: "ZH",
    6: "TH",
    7: "DH",
    8: "K",
    9: "T",
    0: "∅",
  };

  return (
    <GridContext.Provider value={{ grid, setGrid, activeSegs, setActiveSegs }}>
      <div
        style={{
          background: THEME.bg,
          color: THEME.textPrimary,
          fontFamily: "monospace",
          padding: 28,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 22,
              letterSpacing: "0.28em",
              background: "linear-gradient(120deg, #4FC3F7, #81C784, #FFB74D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            GLYPH STUDIO
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 10,
              flexWrap: "wrap",
              margin: "20px auto",
            }}
          >
            <button
              onClick={() => setCursive(false)}
              style={{
                padding: "7px 20px",
                borderRadius: 6,
                background: !cursive ? "rgba(255,255,255,0.1)" : "transparent",
                border: !cursive
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid transparent",
                color: !cursive ? THEME.textPrimary : THEME.textMuted,
                cursor: "pointer",
              }}
            >
              □ SCIENTIFIC · BLOCKY
            </button>
            <button
              onClick={() => setCursive(true)}
              style={{
                padding: "7px 20px",
                borderRadius: 6,
                background: cursive ? "rgba(255,255,255,0.1)" : "transparent",
                border: cursive
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid transparent",
                color: cursive ? THEME.textPrimary : THEME.textMuted,
                cursor: "pointer",
              }}
            >
              ∿ POETIC · CURSIVE
            </button>
            <button
              onClick={() => setHandwriting(!handwriting)}
              style={{
                padding: "7px 20px",
                borderRadius: 6,
                background: handwriting
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                border: handwriting
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid transparent",
                color: handwriting ? THEME.textPrimary : THEME.textMuted,
                cursor: "pointer",
              }}
            >
              ✍ HANDWRITING {handwriting ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* Grid Editor */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            0 · MASTER GRID
          </h2>
          <GridEditor grid={grid} setGrid={setGrid} />
        </section>

        {/* Master glyph comparison */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅰ · MASTER GLYPH (COMBINED)
          </h2>
          <div
            style={{
              display: "flex",
              gap: 40,
              justifyContent: "center",
              background: THEME.cardBg,
              borderRadius: 10,
              padding: 20,
              border: THEME.border,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <GlyphSVG
                segs={ALL_SEGS}
                type="master"
                color="#fff"
                sz={120}
                cursive={false}
                showNodes
                breath={null}
                handwriting={handwriting}
              />
              <div style={{ fontSize: 10, color: THEME.textMuted }}>
                Scientific · Blocky
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <GlyphSVG
                segs={ALL_SEGS}
                type="master"
                color="#fff"
                sz={120}
                cursive={true}
                showNodes
                breath={null}
                handwriting={handwriting}
              />
              <div style={{ fontSize: 10, color: THEME.textMuted }}>
                Poetic · Cursive
              </div>
            </div>
          </div>
        </section>

        {/* Evolution engine */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅱ · GLYPH EVOLUTION ENGINE
          </h2>
          <button
            onClick={handleEvolve}
            style={{
              background: "transparent",
              border: THEME.border,
              color: "#fff",
              padding: "8px 16px",
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            🌱 EVOLVE 12 NEW GLYPHS
          </button>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 8,
            }}
          >
            {evolvedGlyphs.map((g, i) => (
              <div
                key={i}
                style={{
                  background: THEME.cardBg,
                  border: THEME.border,
                  borderRadius: 6,
                  padding: 8,
                  textAlign: "center",
                }}
              >
                <GlyphSVG
                  segs={g.segs}
                  type={g.type}
                  color={g.color}
                  sz={50}
                  cursive={cursive}
                  showNodes={false}
                  breath={g.breath}
                  bn={g.bn}
                  handwriting={handwriting}
                />
                <div style={{ fontSize: 9, color: THEME.textMuted }}>
                  {g.segs.length} segs
                </div>
                {g.genome != null && (
                  <div style={{ fontSize: 7, color: "#888" }}>
                    0x{g.genome.toString(16).padStart(8, "0")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive editor */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅲ · DESIGN YOUR OWN GLYPH
          </h2>
          <GlyphEditor onGlyphChange={setCustomGlyph} />
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 20,
              alignItems: "center",
            }}
          >
            <GlyphSVG
              segs={customGlyph.segs}
              type={customGlyph.type}
              color="#fff"
              breath={customGlyph.breath}
              bn={customGlyph.bn}
              sz={100}
              cursive={cursive}
              handwriting={handwriting}
            />
            <button
              onClick={() => {
                const dataStr = JSON.stringify(customGlyph, null, 2);
                navigator.clipboard.writeText(dataStr);
                alert("Glyph data copied!");
              }}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              📋 Copy JSON
            </button>
          </div>
        </section>

        {/* Stroke animation */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅳ · BREATH‑SYNCHRONIZED STROKE ANIMATION
          </h2>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <select
              onChange={(e) =>
                setSelectedGlyph(CONS.find((c) => c.name === e.target.value))
              }
              value={selectedGlyph?.name}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              {CONS.map((g) => (
                <option key={g.num} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
            {selectedGlyph && (
              <AnimatedGlyph
                glyph={selectedGlyph}
                cursive={cursive}
                handwriting={handwriting}
              />
            )}
          </div>
        </section>

        {/* Word generator */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅴ · WORD GENERATOR (vertical + spiral)
          </h2>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 10, color: THEME.textMuted }}>
                  Word (latin):
                </label>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value.toUpperCase())}
                  style={{
                    background: "#000",
                    color: "#fff",
                    border: THEME.border,
                    marginLeft: 8,
                    padding: 4,
                  }}
                />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 10, color: THEME.textMuted }}>
                  Layout:
                </label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value)}
                  style={{
                    background: "#000",
                    color: "#fff",
                    border: THEME.border,
                    marginLeft: 8,
                    padding: 4,
                  }}
                >
                  <option value="vertical">Vertical (single)</option>
                  <option value="spiral">Spiral</option>
                </select>
              </div>
              {layout === "spiral" && (
                <div>
                  <label style={{ fontSize: 10, color: THEME.textMuted }}>
                    Steps:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={spiralSteps}
                    onChange={(e) =>
                      setSpiralSteps(parseInt(e.target.value) || 1)
                    }
                    style={{
                      background: "#000",
                      color: "#fff",
                      border: THEME.border,
                      marginLeft: 8,
                      padding: 4,
                      width: 60,
                    }}
                  />
                </div>
              )}
            </div>
            <WordDisplay
              word={word}
              cursive={cursive}
              handwriting={handwriting}
              layout={layout}
              spiralSteps={spiralSteps}
            />
          </div>
        </section>

        {/* Procedural vocabulary */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅵ · PROCEDURAL VOCABULARY (MATH → GLYPHS)
          </h2>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={mathExpr}
              onChange={(e) => setMathExpr(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            />
            <button
              onClick={() => {
                const digitMap = {
                  0: "∅",
                  1: "S",
                  2: "F",
                  3: "SH",
                  4: "Z",
                  5: "ZH",
                  6: "TH",
                  7: "DH",
                  8: "K",
                  9: "T",
                };
                setWord(
                  mathExpr
                    .split("")
                    .map((ch) => digitMap[ch] || ch)
                    .join(""),
                );
              }}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              Generate Word
            </button>
            {/* semantic coordinate generator */}
            <input
              type="text"
              value={semanticCoord}
              onChange={(e) => setSemanticCoord(e.target.value)}
              placeholder="core-subset-variant"
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            />
            <button
              onClick={handleSemanticGenerate}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              SemGen
            </button>
            {generatedWord && (
              <div style={{ color: THEME.accentVowel, fontSize: 12 }}>
                → {generatedWord}
              </div>
            )}
          </div>
        </section>

        {/* Cognitive Map Generator */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅸ · COGNITIVE MAP (semantic → word)
          </h2>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={semanticCoord}
              onChange={(e) => setSemanticCoord(e.target.value)}
              placeholder="e.g., 1-3-5"
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            />
            <button
              onClick={handleSemanticGenerate}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              Generate Word
            </button>
            <span style={{ color: THEME.textMuted, fontSize: 10 }}>
              core-subset-variant
            </span>
          </div>
          {generatedWord && (
            <div style={{ marginTop: 12 }}>
              <FractalWordDisplay
                word={generatedWord}
                cursive={cursive}
                handwriting={handwriting}
                level={0}
                maxLevel={1}
              />
            </div>
          )}
        </section>

        {/* Keyboard layout */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅶ · KEYBOARD LAYOUT
          </h2>
          <KeyboardLayout glyphMap={keyMap} />
        </section>

        {/* Font export */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 14,
              color: THEME.textSecondary,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 8,
            }}
          >
            Ⅷ · EXPORT FONT
          </h2>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <input
              type="text"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              placeholder="Font name"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: THEME.border,
                color: "#fff",
                padding: "6px 10px",
                fontSize: 12,
                flex: 1,
                outline: "none",
              }}
            />
            <button
              onClick={() => downloadTTF(CONS, fontName, grid, cursive)}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              ⬇ Download {fontName}.ttf
            </button>
          </div>
          <p style={{ fontSize: 9, color: THEME.textMuted, marginTop: 8 }}>
            Uses current cursive setting and master grid.
          </p>
        </section>

        <footer
          style={{
            textAlign: "center",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            paddingTop: 20,
            fontSize: 8,
            color: "rgba(255,255,255,0.15)",
          }}
        >
          NONAL‑CIRCUIT SYSTEM · EDITABLE MASTER GRID · ALL GLYPHS UPDATE LIVE
        </footer>
      </div>
    </GridContext.Provider>
  );
}
