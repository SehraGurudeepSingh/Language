/**
 * Phonetic System Configuration
 * Phonetic cores, subsets, and variants for the Nonal language system
 * Structure: 3 cores × 7 subsets × 9 variants = 189 potential slots
 */

import { THEME } from "./theme";

export const PHONETIC_CORES = {
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

export const SUBSETS = {
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

export const VARIANTS = [
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

/**
 * Cognitive axes for semantic coordinate system
 * Maps to phonetic cores and subsets
 */
export const COGNITIVE_AXES = {
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

/**
 * Latin-to-Glyph mapping for word parsing
 */
export const LATIN_TO_GLYPH = {
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

export default {
  PHONETIC_CORES,
  SUBSETS,
  VARIANTS,
  COGNITIVE_AXES,
  LATIN_TO_GLYPH,
};
