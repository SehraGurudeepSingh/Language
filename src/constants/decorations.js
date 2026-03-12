/**
 * Decoration Grid System
 * Free-form grid for visual elements, ligatures, ornaments, and decorative glyphs
 * Overlays the main 3x3 grid for aesthetic enhancement
 *
 * Features:
 * - Supports ligatures and combined forms
 * - Ornamental corners and dividers
 * - Geometric patterns
 * - SVG-based decorative elements
 */

// ============================================================================
// DECORATION GRID CONFIGURATION
// ============================================================================

/**
 * Free-form grid overlay dimensions and spacing
 * Applied on top of the main 3x3 grid
 */
export const DECORATION_GRID = {
  // Subdivision of main grid cells (creates finer grid)
  subdivisions: 4, // Each cell divided into 4x4 = 16 sub-cells

  // Spacing and alignment
  spacing: 8, // Pixels between sub-grid points
  offset: 4, // Offset from cell origin
  opacity: 0.15, // Base opacity for decorations (light mode)
  opacity_dark: 0.25, // Opacity in dark mode

  // Decoration size ranges (pixels)
  minSize: 6,
  maxSize: 24,

  // Complexity levels
  complexity: {
    minimal: 1, // Few decorations
    moderate: 2, // Balanced
    complex: 3, // Dense decorations
  },
};

// ============================================================================
// DECORATIVE ELEMENT TYPES
// ============================================================================

/**
 * SVG-based decorative elements that can be placed on the grid
 * Each element includes path, size, and rotation
 */
export const DECORATION_ELEMENTS = {
  // Corner ornaments
  corners: {
    bracket_tl: {
      name: "Top-Left Bracket",
      svg: `<path d="M 0 8 L 0 0 L 8 0" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"/>`,
      size: 8,
      anchor: "top-left",
    },
    bracket_tr: {
      name: "Top-Right Bracket",
      svg: `<path d="M 0 0 L 8 0 L 8 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"/>`,
      size: 8,
      anchor: "top-right",
    },
    bracket_bl: {
      name: "Bottom-Left Bracket",
      svg: `<path d="M 8 0 L 0 0 L 0 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"/>`,
      size: 8,
      anchor: "bottom-left",
    },
    bracket_br: {
      name: "Bottom-Right Bracket",
      svg: `<path d="M 0 0 L 8 0 L 8 8" stroke="currentColor" fill="none" stroke-width="1.5" stroke-linecap="round"/>`,
      size: 8,
      anchor: "bottom-right",
    },
    circle_corner: {
      name: "Circle Corner",
      svg: `<circle cx="4" cy="4" r="4" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 8,
      anchor: "center",
    },
  },

  // Dividers and lines
  dividers: {
    line_h: {
      name: "Horizontal Line",
      svg: `<line x1="0" y1="0" x2="16" y2="0" stroke="currentColor" stroke-width="1"/>`,
      size: 16,
      anchor: "center",
      rotation: 0,
    },
    line_v: {
      name: "Vertical Line",
      svg: `<line x1="0" y1="0" x2="0" y2="16" stroke="currentColor" stroke-width="1"/>`,
      size: 16,
      anchor: "center",
      rotation: 90,
    },
    line_dash_h: {
      name: "Dashed Horizontal",
      svg: `<line x1="0" y1="0" x2="16" y2="0" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>`,
      size: 16,
      anchor: "center",
    },
    line_dash_v: {
      name: "Dashed Vertical",
      svg: `<line x1="0" y1="0" x2="0" y2="16" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2"/>`,
      size: 16,
      anchor: "center",
      rotation: 90,
    },
    dots: {
      name: "Dot Trail",
      svg: `<circle cx="2" cy="0" r="1" fill="currentColor"/><circle cx="6" cy="0" r="1" fill="currentColor"/><circle cx="10" cy="0" r="1" fill="currentColor"/><circle cx="14" cy="0" r="1" fill="currentColor"/>`,
      size: 16,
      anchor: "center",
    },
  },

  // Geometric shapes
  shapes: {
    circle: {
      name: "Circle",
      svg: `<circle cx="4" cy="4" r="3" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 8,
      anchor: "center",
    },
    circle_filled: {
      name: "Filled Circle",
      svg: `<circle cx="4" cy="4" r="3" fill="currentColor"/>`,
      size: 8,
      anchor: "center",
    },
    square: {
      name: "Square",
      svg: `<rect x="1" y="1" width="6" height="6" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 8,
      anchor: "center",
    },
    square_filled: {
      name: "Filled Square",
      svg: `<rect x="1" y="1" width="6" height="6" fill="currentColor"/>`,
      size: 8,
      anchor: "center",
    },
    diamond: {
      name: "Diamond",
      svg: `<path d="M 4 0 L 8 4 L 4 8 L 0 4 Z" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 8,
      anchor: "center",
    },
    triangle: {
      name: "Triangle",
      svg: `<path d="M 4 0 L 8 6 L 0 6 Z" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 8,
      anchor: "center",
    },
    star: {
      name: "Star",
      svg: `<path d="M 4 0 L 6 3 L 9 3 L 6.5 5 L 7.5 8 L 4 6 L 0.5 8 L 1.5 5 L -1 3 L 2 3 Z" stroke="currentColor" fill="none" stroke-width="0.8"/>`,
      size: 9,
      anchor: "center",
    },
    hexagon: {
      name: "Hexagon",
      svg: `<path d="M 4 0 L 6 2 L 6 6 L 4 8 L 2 6 L 2 2 Z" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 8,
      anchor: "center",
    },
  },

  // Ligatures and combined forms
  ligatures: {
    curve_soft: {
      name: "Soft Curve",
      svg: `<path d="M 0 4 Q 4 0 8 4" stroke="currentColor" fill="none" stroke-width="1" stroke-linecap="round"/>`,
      size: 8,
      anchor: "center",
    },
    curve_wave: {
      name: "Wave",
      svg: `<path d="M 0 4 Q 2 2 4 4 T 8 4" stroke="currentColor" fill="none" stroke-width="1" stroke-linecap="round"/>`,
      size: 8,
      anchor: "center",
    },
    curve_sharp: {
      name: "Sharp Curve",
      svg: `<path d="M 0 8 Q 4 0 8 8" stroke="currentColor" fill="none" stroke-width="1" stroke-linecap="round"/>`,
      size: 8,
      anchor: "center",
    },
    swirl: {
      name: "Swirl",
      svg: `<path d="M 0 4 Q 2 2 4 4 Q 6 6 8 4" stroke="currentColor" fill="none" stroke-width="1" stroke-linecap="round"/>`,
      size: 8,
      anchor: "center",
    },
  },

  // Ornamental patterns
  ornaments: {
    flourish_h: {
      name: "Horizontal Flourish",
      svg: `<path d="M 0 4 Q 4 0 8 4 T 16 4" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 16,
      anchor: "center",
    },
    flourish_v: {
      name: "Vertical Flourish",
      svg: `<path d="M 4 0 Q 0 4 4 8 T 4 16" stroke="currentColor" fill="none" stroke-width="1"/>`,
      size: 16,
      anchor: "center",
    },
    crosshatch: {
      name: "Crosshatch",
      svg: `<line x1="0" y1="0" x2="8" y2="8" stroke="currentColor" stroke-width="0.5"/><line x1="8" y1="0" x2="0" y2="8" stroke="currentColor" stroke-width="0.5"/>`,
      size: 8,
      anchor: "center",
    },
    grid_dots: {
      name: "Grid Dots",
      svg: `<circle cx="0" cy="0" r="0.8" fill="currentColor"/><circle cx="4" cy="0" r="0.8" fill="currentColor"/><circle cx="8" cy="0" r="0.8" fill="currentColor"/><circle cx="0" cy="4" r="0.8" fill="currentColor"/><circle cx="4" cy="4" r="0.8" fill="currentColor"/><circle cx="8" cy="4" r="0.8" fill="currentColor"/><circle cx="0" cy="8" r="0.8" fill="currentColor"/><circle cx="4" cy="8" r="0.8" fill="currentColor"/><circle cx="8" cy="8" r="0.8" fill="currentColor"/>`,
      size: 8,
      anchor: "center",
    },
  },
};

// ============================================================================
// PRESET DECORATION PATTERNS
// ============================================================================

/**
 * Pre-configured decoration patterns for different themes/moods
 */
export const DECORATION_PATTERNS = {
  // Minimal - sparse decorative elements
  minimal: {
    density: 0.1,
    elements: ["circle", "line_h", "line_v"],
    corners: ["bracket_tl", "bracket_br"],
    complexity: DECORATION_GRID.complexity.minimal,
  },

  // Elegant - balanced decorations with geometric elements
  elegant: {
    density: 0.3,
    elements: ["circle", "diamond", "line_dash_h", "curve_soft"],
    corners: ["circle_corner"],
    complexity: DECORATION_GRID.complexity.moderate,
  },

  // Modern - clean lines and geometric patterns
  modern: {
    density: 0.25,
    elements: ["square", "line_h", "line_v", "hexagon"],
    corners: [],
    complexity: DECORATION_GRID.complexity.moderate,
  },

  // Ornate - rich decorative elements with flourishes
  ornate: {
    density: 0.5,
    elements: ["flourish_h", "star", "hexagon", "swirl", "grid_dots"],
    corners: ["bracket_tl", "bracket_tr", "bracket_bl", "bracket_br"],
    complexity: DECORATION_GRID.complexity.complex,
  },

  // Technical - lines and crosshatches
  technical: {
    density: 0.4,
    elements: ["line_h", "line_v", "crosshatch", "dots"],
    corners: [],
    complexity: DECORATION_GRID.complexity.moderate,
  },
};

// ============================================================================
// POSITION STRATEGIES
// ============================================================================

/**
 * Strategies for positioning decorations on the grid
 */
export const POSITION_STRATEGIES = {
  // Corners only
  corners: "corners",

  // Edges (top, right, bottom, left)
  edges: "edges",

  // Scattered random placement
  scattered: "scattered",

  // Regular grid pattern
  grid: "grid",

  // Concentrate at center
  center: "center",

  // Diagonal from corners
  diagonal: "diagonal",
};

// ============================================================================
// GLYPH COMPATIBILITY LAYER
// ============================================================================

/**
 * Integration between decoration grid and main glyph system
 * Allows glyphs to reference decorative elements
 */
export const GLYPH_DECORATION_MAPS = {
  // Segment endings can use decorative dots/circles
  segment_end_styles: {
    plain: "line",
    dot: "circle",
    square: "square_filled",
    diamond: "diamond",
  },

  // Glyph corner treatments
  corner_styles: {
    sharp: "none",
    rounded: "circle_corner",
    bracketed: "bracket_tl",
    decorated: "star",
  },

  // Ligature styles for combined glyphs
  ligature_styles: {
    smooth: "curve_soft",
    wave: "curve_wave",
    sharp: "curve_sharp",
    ornamental: "swirl",
  },
};

export default {
  DECORATION_GRID,
  DECORATION_ELEMENTS,
  DECORATION_PATTERNS,
  POSITION_STRATEGIES,
  GLYPH_DECORATION_MAPS,
};
