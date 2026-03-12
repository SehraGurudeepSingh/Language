/**
 * useTheme Hook
 * Provides easy access to theme context in components
 */

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

/**
 * Hook to access theme in components
 * @returns {Object} - Theme context object with theme, isDark, themeObject, toggleTheme, switchTheme
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export default useTheme;
