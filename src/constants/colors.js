/**
 * Advanced Color System - Redesigned
 * Modern palette with gradients and glassmorphism support
 *
 * Color philosophy:
 * - Primary gradient: Purple to violet (#667eea → #764ba2)
 * - Semantic colors: Modern, vibrant versions
 * - Optimized for accessibility (WCAG AA)
 */

// ============================================================================
// LIGHT MODE - Modern Palette with Gradient Support
// ============================================================================

export const LIGHT_COLORS = {
  // Primary: Light Surface
  grey_primary: "#F8F9FC", // Cool white
  grey_primary_2: "#F1F3F8", // Slightly darker

  // Secondary: Light Grey
  grey_secondary: "#E4E8EF", // Soft grey
  grey_secondary_2: "#D1D6E3", // Medium grey

  // Accent: Dark Grey for text
  grey_accent: "#4A4F63", // Medium dark
  grey_accent_2: "#1A1D29", // Dark (primary text)

  // Blue-Violet Gradient Colors
  blue_primary: "#4F5FCA", // Deep purple-blue
  blue_secondary: "#667EEA", // Primary indigo
  blue_accent: "#8B9EF5", // Light indigo
  blue_bright: "#536DFE", // Bright blue for CTAs

  // Violet accents
  violet_primary: "#764BA2", // Deep violet
  violet_secondary: "#8B5CF6", // Medium violet

  // Semantic colors for glyph groups (enhanced vibrancy)
  accent_sibilant: "#6366F1", // Indigo
  accent_plosive: "#10B981", // Emerald green
  accent_resonant: "#F59E0B", // Amber
  accent_vowel: "#8B5CF6", // Violet
  accent_void: "#EC4899", // Pink

  // Gradient definitions
  gradient_start: "#667EEA",
  gradient_end: "#764BA2",
};

// ============================================================================
// DARK MODE - Modern Palette with Gradient Support
// ============================================================================

export const DARK_COLORS = {
  // Primary: Very Dark Surface
  grey_primary: "#0F1018", // Deep dark
  grey_primary_2: "#181A26", // Slightly lighter

  // Secondary: Dark Grey
  grey_secondary: "#242736", // Dark grey
  grey_secondary_2: "#2D3142", // Medium dark grey

  // Accent: Light Grey for text
  grey_accent: "#B8BCC8", // Medium light
  grey_accent_2: "#E8EAF0", // Light (primary text)

  // Blue-Violet Gradient Colors (brighter for dark mode)
  blue_primary: "#6366F1", // Bright indigo
  blue_secondary: "#818CF8", // Lighter indigo
  blue_accent: "#A5B4FC", // Very light indigo
  blue_bright: "#818CF8", // Bright indigo for CTAs

  // Violet accents
  violet_primary: "#A78BFA", // Light violet
  violet_secondary: "#C4B5FD", // Very light violet

  // Semantic colors for glyph groups (lighter for dark mode)
  accent_sibilant: "#818CF8", // Indigo (light)
  accent_plosive: "#34D399", // Emerald (light)
  accent_resonant: "#FBBF24", // Amber (light)
  accent_vowel: "#A78BFA", // Violet (light)
  accent_void: "#F472B6", // Pink (light)

  // Gradient definitions
  gradient_start: "#818CF8",
  gradient_end: "#A78BFA",
};

// ============================================================================
// NEUTRAL PALETTE (works in both modes)
// ============================================================================

export const NEUTRAL = {
  white: "#FFFFFF",
  black: "#000000",
  transparent: "rgba(0,0,0,0)",
};

// ============================================================================
// OPACITY SCALES (for layering and hierarchy)
// ============================================================================

export const OPACITY = {
  full: 1,
  high: 0.87,
  medium: 0.6,
  low: 0.38,
  veryLow: 0.12,
  minimal: 0.05,
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Apply opacity to a color
 * @param {string} color - Hex or rgb color
 * @param {number} opacity - 0-1
 */
export function applyOpacity(color, opacity) {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

/**
 * Get contrasting text color based on background
 * @param {string} bgColor - Background hex color
 * @returns {string} - Light or dark text color
 */
export function getContrastTextColor(bgColor) {
  const hex = bgColor.slice(1);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export default {
  LIGHT_COLORS,
  DARK_COLORS,
  NEUTRAL,
  OPACITY,
  applyOpacity,
  getContrastTextColor,
};
