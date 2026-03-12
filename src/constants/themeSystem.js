/**
 * Enhanced Theme System
 * Comprehensive light/dark mode with colors, typography, and decorations
 */

import { LIGHT_COLORS, DARK_COLORS, OPACITY, applyOpacity } from "./colors.js";
import { TYPOGRAPHY, FONTS, FONT_WEIGHTS } from "./typography.js";
import { DECORATION_PATTERNS } from "./decorations.js";

// ============================================================================
// LIGHT THEME (DEFAULT)
// ============================================================================

export const LIGHT_THEME = {
  name: "light",
  mode: "light",

  // Core colors
  colors: {
    ...LIGHT_COLORS,

    // Surface layers
    surface: {
      primary: LIGHT_COLORS.grey_primary,
      secondary: LIGHT_COLORS.grey_primary_2,
      tertiary: LIGHT_COLORS.grey_secondary,
      hover: applyOpacity(LIGHT_COLORS.grey_secondary, 0.1),
      active: applyOpacity(LIGHT_COLORS.grey_secondary, 0.2),
    },

    // Interactive elements
    interactive: {
      default: LIGHT_COLORS.blue_secondary,
      hover: LIGHT_COLORS.blue_accent,
      active: LIGHT_COLORS.blue_primary,
      disabled: applyOpacity(LIGHT_COLORS.grey_secondary, 0.5),
    },

    // Text hierarchy
    text: {
      primary: LIGHT_COLORS.grey_accent_2, // Dark grey for main text
      secondary: LIGHT_COLORS.grey_accent, // Medium grey for supporting
      muted: applyOpacity(LIGHT_COLORS.grey_accent, 0.6), // Light grey for hints
      disabled: applyOpacity(LIGHT_COLORS.grey_secondary, 0.5),
      inverse: "#FFFFFF", // On dark backgrounds
    },

    // Borders and dividers
    border: {
      primary: LIGHT_COLORS.grey_secondary,
      secondary: applyOpacity(LIGHT_COLORS.grey_secondary, 0.5),
      light: applyOpacity(LIGHT_COLORS.grey_secondary, 0.2),
    },

    // Semantic accents (semantic colors)
    semantic: {
      sibilant: LIGHT_COLORS.accent_sibilant, // Blue
      plosive: LIGHT_COLORS.accent_plosive, // Green
      resonant: LIGHT_COLORS.accent_resonant, // Orange
      vowel: LIGHT_COLORS.accent_vowel, // Purple
      void: LIGHT_COLORS.accent_void, // Rose
    },

    // State colors
    state: {
      success: "#4ADE80", // Green
      warning: "#FBBF24", // Orange
      error: "#FB7185", // Red
      info: LIGHT_COLORS.blue_secondary, // Blue
    },
  },

  // Typography
  typography: TYPOGRAPHY,

  // Spacing scale (based on 8px unit)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    xxl: "4rem", // 64px
  },

  // Shadow system (for depth and elevation)
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px rgba(0, 0, 0, 0.15)",
  },

  // Border radius scale
  radius: {
    none: "0px",
    sm: "0.25rem", // 4px
    base: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    full: "9999px", // Fully rounded
  },

  // Transitions and animations
  transitions: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },

  // Opacity scale
  opacity: OPACITY,

  // Decoration patterns
  decorations: DECORATION_PATTERNS.elegant,
};

// ============================================================================
// DARK THEME
// ============================================================================

export const DARK_THEME = {
  name: "dark",
  mode: "dark",

  // Core colors
  colors: {
    ...DARK_COLORS,

    // Surface layers
    surface: {
      primary: DARK_COLORS.grey_primary,
      secondary: DARK_COLORS.grey_primary_2,
      tertiary: DARK_COLORS.grey_secondary,
      hover: applyOpacity(DARK_COLORS.grey_secondary_2, 0.15),
      active: applyOpacity(DARK_COLORS.grey_secondary_2, 0.25),
    },

    // Interactive elements
    interactive: {
      default: DARK_COLORS.blue_secondary,
      hover: DARK_COLORS.blue_accent,
      active: DARK_COLORS.blue_primary,
      disabled: applyOpacity(DARK_COLORS.grey_secondary, 0.4),
    },

    // Text hierarchy
    text: {
      primary: DARK_COLORS.grey_accent_2, // Light grey for main text
      secondary: DARK_COLORS.grey_accent, // Medium grey for supporting
      muted: applyOpacity(DARK_COLORS.grey_accent, 0.6), // Darker grey for hints
      disabled: applyOpacity(DARK_COLORS.grey_secondary, 0.4),
      inverse: "#000000", // On light backgrounds
    },

    // Borders and dividers
    border: {
      primary: DARK_COLORS.grey_secondary,
      secondary: applyOpacity(DARK_COLORS.grey_secondary, 0.6),
      light: applyOpacity(DARK_COLORS.grey_secondary, 0.3),
    },

    // Semantic accents
    semantic: {
      sibilant: DARK_COLORS.accent_sibilant, // Blue
      plosive: DARK_COLORS.accent_plosive, // Green
      resonant: DARK_COLORS.accent_resonant, // Orange
      vowel: DARK_COLORS.accent_vowel, // Purple
      void: DARK_COLORS.accent_void, // Rose
    },

    // State colors
    state: {
      success: "#4ADE80", // Green
      warning: "#FBBF24", // Orange
      error: "#FB7185", // Red
      info: DARK_COLORS.blue_secondary, // Blue
    },
  },

  // Typography (same as light)
  typography: TYPOGRAPHY,

  // Spacing scale (same as light)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    xxl: "4rem", // 64px
  },

  // Shadow system (darker/more prominent for dark mode)
  shadows: {
    none: "none",
    sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
    base: "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(0, 0, 0, 0.3)",
    "2xl": "0 25px 50px rgba(0, 0, 0, 0.6)",
  },

  // Border radius scale (same as light)
  radius: {
    none: "0px",
    sm: "0.25rem",
    base: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },

  // Transitions and animations (same as light)
  transitions: {
    fast: "150ms ease-in-out",
    normal: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },

  // Opacity scale (same as light)
  opacity: OPACITY,

  // Decoration patterns (slightly more opaque in dark mode)
  decorations: DECORATION_PATTERNS.elegant,
};

// ============================================================================
// THEME PROVIDER LOGIC (utilities)
// ============================================================================

/**
 * Get current theme based on system preference or local storage
 */
export function getSystemTheme() {
  if (typeof window === "undefined") return "light";

  // Check localStorage first
  const stored = localStorage.getItem("app-theme");
  if (stored) return stored;

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

/**
 * Switch theme and persist to localStorage
 */
export function setTheme(themeName) {
  if (typeof window === "undefined") return;
  localStorage.setItem("app-theme", themeName);

  // Dispatch custom event for components to listen to
  window.dispatchEvent(
    new CustomEvent("themechange", { detail: { theme: themeName } }),
  );
}

/**
 * Get theme object by name
 */
export function getTheme(themeName) {
  return themeName === "dark" ? DARK_THEME : LIGHT_THEME;
}

export default {
  LIGHT_THEME,
  DARK_THEME,
  getSystemTheme,
  setTheme,
  getTheme,
};
