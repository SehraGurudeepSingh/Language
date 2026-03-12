/**
 * Typography System
 * Font Stack with Geometric Logo Font and Serif/Sans-Serif Balance
 *
 * Primary Font: Montserrat (geometric sans-serif)
 * Logo Font: Space Mono (geometric monospace)
 * Serif Font: Merriweather or Lora (for body copy with character)
 * Icon Font: Feather Icons (via CSS)
 */

// ============================================================================
// FONT FAMILIES
// ============================================================================

export const FONTS = {
  // Main body and UI text (geometric sans-serif)
  // Montserrat: Clean, modern, geometric - ideal for UI and headers
  primary: "'Montserrat', 'Segoe UI', 'Helvetica Neue', sans-serif",

  // Logo and decorative text (geometric monospace)
  // Space Mono: Geometric, tech-forward monospace - perfect for logo/brand
  logo: "'Space Mono', 'IBM Plex Mono', monospace",

  // Body copy and long-form content (humanist serif)
  // Merriweather: Warm, readable serif with character - great for description text
  serif: "'Merriweather', 'Georgia', serif",

  // Fallback for code and technical text
  mono: "'Courier New', 'Courier', monospace",

  // System font stack (fastest loading, no web font needed)
  system:
    "-apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
};

// ============================================================================
// FONT WEIGHTS (Montserrat provides: 100, 300, 400, 500, 600, 700, 900)
// ============================================================================

export const FONT_WEIGHTS = {
  thin: 100,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
};

// ============================================================================
// FONT SIZES (based on 16px base, using 1.125 scale for harmonious progression)
// ============================================================================

export const FONT_SIZES = {
  // Headings (using geometric progression: 1.125 ratio = golden ratio approximation)
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px (1.125 ^ 2 ≈ 1.27, adjusted)
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "2.813rem", // 45px
  "6xl": "3.375rem", // 54px
  "7xl": "4.219rem", // 67px (using golden ratio: 1.618 step)
};

// ============================================================================
// LINE HEIGHTS (for readability)
// ============================================================================

export const LINE_HEIGHTS = {
  tight: 1.2, // Headers
  normal: 1.5, // UI elements
  relaxed: 1.75, // Body copy
  spacious: 2, // Long-form content
};

// ============================================================================
// LETTER SPACING (tracking)
// ============================================================================

export const LETTER_SPACING = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0em",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

// ============================================================================
// TYPOGRAPHIC SCALES (predefined combinations)
// ============================================================================

export const TYPOGRAPHY = {
  // Logo typography (Space Mono, largest)
  logo: {
    fontFamily: FONTS.logo,
    fontSize: FONT_SIZES["5xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  // Heading 1 (Montserrat)
  h1: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES["4xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  // Heading 2
  h2: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.tight,
  },

  // Heading 3
  h3: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Heading 4 (Subtitle)
  h4: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Body text (Merriweather for warmth and readability)
  body: {
    fontFamily: FONTS.serif,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Small body text
  bodySmall: {
    fontFamily: FONTS.serif,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // UI text (buttons, labels, form inputs - Montserrat)
  ui: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // UI text small
  uiSmall: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  // Caption/Helper text
  caption: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.light,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  // Code/Monospace text
  code: {
    fontFamily: FONTS.mono,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },
};

// ============================================================================
// WEB FONT IMPORT (Google Fonts)
// Add this to your HTML <head>:
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;900&family=Space+Mono:wght@400;700&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet">
// ============================================================================

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700;900&family=Space+Mono:wght@400;700&family=Merriweather:wght@300;400;700&display=swap";

export default TYPOGRAPHY;
