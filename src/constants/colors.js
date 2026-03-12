/**
 * Advanced Color System with Golden Ratio
 * Uses 30-70-90 formula with golden ratio (1.618) for harmonious color progression
 *
 * Color philosophy:
 * - 30% Primary (dominant color - light grey, dark grey, or blue)
 * - 70% Secondary (complementary - provides balance)
 * - 90% Accent (highlights - draws attention)
 *
 * Golden Ratio Applied:
 * - Base hue: anchor point
 * - Secondary: Base * 1.618 (golden ratio step)
 * - Accent: Secondary * 1.618 (extended golden step)
 */

// ============================================================================
// LIGHT MODE - Grey & Blue Palette with Golden Ratio
// ============================================================================

export const LIGHT_COLORS = {
  // Primary: Light Grey (30%)
  grey_primary: "#F5F5F5", // 95% lightness
  grey_primary_2: "#EBEBEB", // 92% lightness (slightly darker)

  // Secondary: Medium Grey (70%)
  grey_secondary: "#D1D1D1", // 82% lightness (1.618x darker than primary)
  grey_secondary_2: "#C4C4C4", // 77% lightness

  // Accent: Dark Grey (90% - highlights)
  grey_accent: "#8A8A8A", // 54% lightness (1.618x darker than secondary)
  grey_accent_2: "#5E5E5E", // 37% lightness

  // Blue Accents (for interactive elements)
  blue_primary: "#2E5266", // Deep blue (dark)
  blue_secondary: "#4A7BA7", // Medium blue (golden ratio adjustment)
  blue_accent: "#7DA3C1", // Light blue (golden ratio highlight)
  blue_bright: "#0066CC", // Bright blue for CTAs

  // Semantic colors for accents
  accent_sibilant: "#4A7BA7", // Blue (consonant group)
  accent_plosive: "#5AAE61", // Green
  accent_resonant: "#F5A623", // Orange
  accent_vowel: "#9B59B6", // Purple
  accent_void: "#E85D75", // Rose
};

// ============================================================================
// DARK MODE - Grey & Blue Palette with Golden Ratio
// ============================================================================

export const DARK_COLORS = {
  // Primary: Very Dark Grey/Near Black (30%)
  grey_primary: "#0D0E14", // 5% lightness
  grey_primary_2: "#1A1C26", // 10% lightness (slightly lighter)

  // Secondary: Dark Grey (70%)
  grey_secondary: "#2A2D3A", // 16% lightness (1.618x lighter than primary)
  grey_secondary_2: "#3D4150", // 25% lightness

  // Accent: Medium Grey (90% - highlights)
  grey_accent: "#6B7280", // 44% lightness (1.618x lighter than secondary)
  grey_accent_2: "#9CA3AF", // 63% lightness

  // Blue Accents (for interactive elements)
  blue_primary: "#60A5FA", // Bright blue (light)
  blue_secondary: "#93C5FD", // Medium blue (golden ratio adjustment)
  blue_accent: "#BFDBFE", // Light blue (golden ratio highlight)
  blue_bright: "#3B82F6", // Bright blue for CTAs

  // Semantic colors for accents
  accent_sibilant: "#60A5FA", // Blue (consonant group)
  accent_plosive: "#4ADE80", // Green
  accent_resonant: "#FBBF24", // Orange
  accent_vowel: "#D8B4FE", // Purple
  accent_void: "#FB7185", // Rose
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
