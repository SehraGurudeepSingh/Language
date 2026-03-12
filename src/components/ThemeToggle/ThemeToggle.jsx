/**
 * ThemeToggle Component
 * Simple button to switch between light and dark modes
 */

import React from "react";
import { useTheme } from "../../hooks/useTheme.js";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Current: ${theme} mode`}
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
        width: "2.5rem",
        height: "2.5rem",
        borderRadius: "var(--radius-full)",
        border: "2px solid var(--color-border-primary)",
        background: "var(--color-surface-secondary)",
        color: "var(--color-text-primary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.25rem",
        transition: "all var(--transition-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-surface-tertiary)";
        e.currentTarget.style.borderColor = "var(--color-interactive-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--color-surface-secondary)";
        e.currentTarget.style.borderColor = "var(--color-border-primary)";
      }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
