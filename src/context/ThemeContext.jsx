/**
 * Theme Context Provider
 * Manages light/dark mode state and provides theme to all components
 */

import React, { createContext, useState, useEffect } from "react";
import {
  getSystemTheme,
  setTheme as saveTheme,
  getTheme,
} from "../constants/themeSystem.js";

// Create context
export const ThemeContext = createContext();

/**
 * ThemeProvider Component
 * Wraps application and provides theme state + toggle functions
 */
export function ThemeProvider({ children, defaultTheme = null }) {
  const [theme, setThemeState] = useState(defaultTheme || "light");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme on mount
  useEffect(() => {
    const savedTheme = getSystemTheme();
    setThemeState(savedTheme);
    applyThemeToDOM(savedTheme);
    setIsLoaded(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!isLoaded) return;
    applyThemeToDOM(theme);
    saveTheme(theme);
  }, [theme, isLoaded]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Set specific theme
  const switchTheme = (themeName) => {
    if (["light", "dark"].includes(themeName)) {
      setThemeState(themeName);
    }
  };

  const themeObject = getTheme(theme);
  const isDark = theme === "dark";

  const value = {
    theme,
    isDark,
    themeObject,
    toggleTheme,
    switchTheme,
    isLoaded,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Apply theme to DOM
 * Sets CSS variables and data attributes for styling
 */
function applyThemeToDOM(themeName) {
  const themeObject = getTheme(themeName);
  const root = document.documentElement;

  // Set data attribute for CSS selectors
  root.setAttribute("data-theme", themeName);
  root.setAttribute("data-color-scheme", themeName);

  // Set CSS custom properties (variables)
  const colors = themeObject.colors;
  const spacing = themeObject.spacing;
  const radius = themeObject.radius;
  const shadows = themeObject.shadows;
  const typography = themeObject.typography;

  // Colors
  root.style.setProperty("--color-surface-primary", colors.surface.primary);
  root.style.setProperty("--color-surface-secondary", colors.surface.secondary);
  root.style.setProperty("--color-surface-tertiary", colors.surface.tertiary);
  root.style.setProperty("--color-surface-hover", colors.surface.hover);
  root.style.setProperty("--color-surface-active", colors.surface.active);

  root.style.setProperty(
    "--color-interactive-default",
    colors.interactive.default,
  );
  root.style.setProperty("--color-interactive-hover", colors.interactive.hover);
  root.style.setProperty(
    "--color-interactive-active",
    colors.interactive.active,
  );
  root.style.setProperty(
    "--color-interactive-disabled",
    colors.interactive.disabled,
  );

  root.style.setProperty("--color-text-primary", colors.text.primary);
  root.style.setProperty("--color-text-secondary", colors.text.secondary);
  root.style.setProperty("--color-text-muted", colors.text.muted);
  root.style.setProperty("--color-text-disabled", colors.text.disabled);
  root.style.setProperty("--color-text-inverse", colors.text.inverse);

  root.style.setProperty("--color-border-primary", colors.border.primary);
  root.style.setProperty("--color-border-secondary", colors.border.secondary);
  root.style.setProperty("--color-border-light", colors.border.light);

  root.style.setProperty("--color-semantic-sibilant", colors.semantic.sibilant);
  root.style.setProperty("--color-semantic-plosive", colors.semantic.plosive);
  root.style.setProperty("--color-semantic-resonant", colors.semantic.resonant);
  root.style.setProperty("--color-semantic-vowel", colors.semantic.vowel);
  root.style.setProperty("--color-semantic-void", colors.semantic.void);

  root.style.setProperty("--color-state-success", colors.state.success);
  root.style.setProperty("--color-state-warning", colors.state.warning);
  root.style.setProperty("--color-state-error", colors.state.error);
  root.style.setProperty("--color-state-info", colors.state.info);

  // Spacing
  root.style.setProperty("--spacing-xs", spacing.xs);
  root.style.setProperty("--spacing-sm", spacing.sm);
  root.style.setProperty("--spacing-md", spacing.md);
  root.style.setProperty("--spacing-lg", spacing.lg);
  root.style.setProperty("--spacing-xl", spacing.xl);
  root.style.setProperty("--spacing-xxl", spacing.xxl);

  // Border radius
  root.style.setProperty("--radius-none", radius.none);
  root.style.setProperty("--radius-sm", radius.sm);
  root.style.setProperty("--radius-base", radius.base);
  root.style.setProperty("--radius-md", radius.md);
  root.style.setProperty("--radius-lg", radius.lg);
  root.style.setProperty("--radius-xl", radius.xl);
  root.style.setProperty("--radius-full", radius.full);

  // Shadows
  root.style.setProperty("--shadow-none", shadows.none);
  root.style.setProperty("--shadow-sm", shadows.sm);
  root.style.setProperty("--shadow-base", shadows.base);
  root.style.setProperty("--shadow-md", shadows.md);
  root.style.setProperty("--shadow-lg", shadows.lg);
  root.style.setProperty("--shadow-xl", shadows.xl);
  root.style.setProperty("--shadow-2xl", shadows["2xl"]);

  // Transitions
  root.style.setProperty("--transition-fast", themeObject.transitions.fast);
  root.style.setProperty("--transition-normal", themeObject.transitions.normal);
  root.style.setProperty("--transition-slow", themeObject.transitions.slow);

  // Fonts
  root.style.setProperty("--font-primary", typography.h1.fontFamily);
  root.style.setProperty("--font-serif", typography.body.fontFamily);
  root.style.setProperty("--font-mono", typography.code.fontFamily);

  // Add body background and text colors
  document.body.style.backgroundColor = colors.surface.primary;
  document.body.style.color = colors.text.primary;
  document.body.style.transition = `background-color ${themeObject.transitions.normal}, color ${themeObject.transitions.normal}`;
}

export default ThemeProvider;
