/**
 * Typography System
 * Font Stack with Elegant Humanist Geometric Logo Font
 *
 * Logo Font: Jost (humanist geometric - elegant, futuristic, clean)
 * Primary Font: DM Sans (modern sans-serif for UI)
 * Body Font: DM Sans (clean, readable)
 * Monospace: JetBrains Mono (for code/technical)
 */

// ============================================================================
// FONT FAMILIES
// ============================================================================

export const FONTS = {
  // Logo and brand text (Jost - humanist geometric, elegant)
  logo: "'Jost', 'Inter', sans-serif",

  // Main body and UI text (DM Sans - modern, clean)
  primary: "'DM Sans', 'Segoe UI', 'Helvetica Neue', sans-serif",

  // Body copy and long-form content
  body: "'DM Sans', 'Georgia', serif",

  // Fallback for code and technical text
  mono: "'JetBrains Mono', 'Fira Code', monospace",

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
// FONT SIZES (based on 16px base, using 1.25 scale for dramatic progression)
// ============================================================================

export const FONT_SIZES = {
  // Headings (using geometric progression: 1.25 ratio)
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px (hero text)
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
  // Logo typography (Jost - elegant, futuristic)
  logo: {
    fontFamily: FONTS.logo,
    fontSize: FONT_SIZES["5xl"],
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACING.wide,
  },

  // Hero text (Jost - largest display)
  hero: {
    fontFamily: FONTS.logo,
    fontSize: FONT_SIZES["7xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 1.1,
    letterSpacing: LETTER_SPACING.tight,
  },

  // Heading 1 (DM Sans)
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

  // Body text (DM Sans for consistency)
  body: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACING.normal,
  },

  // Small body text
  bodySmall: {
    fontFamily: FONTS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACING.normal,
  },

  // UI text (buttons, labels, form inputs - DM Sans)
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
    fontWeight: FONT_WEIGHTS.regular,
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
// Jost (logo), DM Sans (UI), JetBrains Mono (code)
// ============================================================================

export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&family=Jost:opsz,wght@14..96,100..900&family=JetBrains+Mono:wght@100..800&display=swap";

export default TYPOGRAPHY;
