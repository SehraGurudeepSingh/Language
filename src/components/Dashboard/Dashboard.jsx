/**
 * Dashboard Component
 * Showcases the application's capabilities with theme-aware layout
 * Features: Grid editor, glyph visualization, theme showcase
 */

import React, { useState } from "react";
import { useTheme } from "../../hooks/useTheme.js";
import { TYPOGRAPHY, LIGHT_THEME, DARK_THEME } from "../../constants";

export default function Dashboard() {
  const { themeObject, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("editor");

  const styles = {
    container: {
      padding: "2rem",
      maxWidth: "1400px",
      margin: "0 auto",
      fontFamily: themeObject.typography.body.fontFamily,
    },
    header: {
      marginBottom: "3rem",
      textAlign: "center",
    },
    title: {
      fontSize: "2.25rem",
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      color: themeObject.colors.text.primary,
      marginBottom: "0.5rem",
      letterSpacing: "0.28em",
    },
    subtitle: {
      fontSize: "1rem",
      color: themeObject.colors.text.secondary,
      fontFamily: themeObject.typography.body.fontFamily,
    },
    tabsContainer: {
      display: "flex",
      gap: "1rem",
      borderBottom: `2px solid ${themeObject.colors.border.primary}`,
      marginBottom: "2rem",
      overflowX: "auto",
    },
    tab: {
      padding: "1rem 1.5rem",
      background: "transparent",
      border: "none",
      borderBottom: "2px solid transparent",
      color: themeObject.colors.text.secondary,
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: 500,
      transition: `all ${themeObject.transitions.normal}`,
    },
    tabActive: {
      color: themeObject.colors.interactive.active,
      borderBottomColor: themeObject.colors.interactive.active,
    },
    contentSection: {
      marginBottom: "3rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: themeObject.colors.text.primary,
      marginBottom: "1.5rem",
      paddingBottom: "1rem",
      borderBottom: `1px solid ${themeObject.colors.border.light}`,
    },
    card: {
      background: themeObject.colors.surface.secondary,
      border: `1px solid ${themeObject.colors.border.primary}`,
      borderRadius: themeObject.radius.lg,
      padding: "1.5rem",
      marginBottom: "1.5rem",
      boxShadow: themeObject.shadows.md,
    },
    colorGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    colorBox: {
      padding: "1.5rem",
      borderRadius: themeObject.radius.md,
      textAlign: "center",
      color: themeObject.colors.text.inverse,
      fontSize: "0.875rem",
      fontWeight: 600,
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
    },
    infoItem: {
      background: themeObject.colors.surface.primary,
      padding: "1rem",
      borderRadius: themeObject.radius.md,
      border: `1px solid ${themeObject.colors.border.light}`,
    },
    label: {
      fontSize: "0.875rem",
      color: themeObject.colors.text.muted,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "0.5rem",
    },
    value: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: themeObject.colors.text.primary,
      fontFamily: "'Space Mono', monospace",
    },
  };

  const colors = isDark ? DARK_THEME.colors : LIGHT_THEME.colors;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.subtitle}>
          Glyph Studio v1.0 - Modular Architecture with Advanced Theming
        </p>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {["editor", "colors", "typography", "decorations", "info"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {}),
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.target.style.color = themeObject.colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.target.style.color = themeObject.colors.text.secondary;
                }
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Tab: Editor */}
      {activeTab === "editor" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Master Grid Editor</h2>
          <div style={styles.card}>
            <p
              style={{
                color: themeObject.colors.text.secondary,
                marginBottom: "1rem",
              }}
            >
              Grid editor and glyph visualization coming soon. Use the main
              interface above to edit glyphs.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Colors */}
      {activeTab === "colors" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Color Palette</h2>

          <div style={styles.card}>
            <h3 style={{ ...styles.label, marginBottom: "1.5rem" }}>
              Surface Colors
            </h3>
            <div style={styles.colorGrid}>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.surface.primary,
                  color: themeObject.colors.text.primary,
                }}
              >
                Primary
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.surface.secondary,
                  color: themeObject.colors.text.primary,
                }}
              >
                Secondary
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.surface.tertiary,
                  color: themeObject.colors.text.inverse,
                }}
              >
                Tertiary
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ ...styles.label, marginBottom: "1.5rem" }}>
              Semantic Colors
            </h3>
            <div style={styles.colorGrid}>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.semantic.sibilant,
                }}
              >
                Sibilant (Blue)
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.semantic.plosive,
                }}
              >
                Plosive (Green)
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.semantic.resonant,
                }}
              >
                Resonant (Orange)
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.semantic.vowel,
                }}
              >
                Vowel (Purple)
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.semantic.void,
                }}
              >
                Void (Rose)
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ ...styles.label, marginBottom: "1.5rem" }}>
              State Colors
            </h3>
            <div style={styles.colorGrid}>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.state.success,
                }}
              >
                Success
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.state.warning,
                }}
              >
                Warning
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.state.error,
                }}
              >
                Error
              </div>
              <div
                style={{
                  ...styles.colorBox,
                  background: colors.state.info,
                }}
              >
                Info
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Typography */}
      {activeTab === "typography" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Typography System</h2>

          <div style={styles.card}>
            <h3
              style={{
                ...styles.sectionTitle,
                fontSize: "1.25rem",
                paddingBottom: "0.75rem",
              }}
            >
              Font Families
            </h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.label}>Primary</div>
                <div
                  style={{
                    ...styles.value,
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Montserrat
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: themeObject.colors.text.muted,
                    marginTop: "0.5rem",
                  }}
                >
                  UI, Buttons, Headers
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Logo</div>
                <div
                  style={{
                    ...styles.value,
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  Space Mono
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: themeObject.colors.text.muted,
                    marginTop: "0.5rem",
                  }}
                >
                  Headings, Branding
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Body</div>
                <div
                  style={{
                    ...styles.value,
                    fontFamily: "'Merriweather', serif",
                  }}
                >
                  Merriweather
                </div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: themeObject.colors.text.muted,
                    marginTop: "0.5rem",
                  }}
                >
                  Long-form Content
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3
              style={{
                ...styles.sectionTitle,
                fontSize: "1.25rem",
                paddingBottom: "0.75rem",
              }}
            >
              Font Sizes
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].map(
                (size) => (
                  <div
                    key={size}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem",
                      background: themeObject.colors.surface.primary,
                      borderRadius: themeObject.radius.md,
                    }}
                  >
                    <span
                      style={{
                        fontSize: `var(--font-size-${size})`,
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {size.toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: themeObject.colors.text.muted,
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {Object.values(TYPOGRAPHY.h1)[1]}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Decorations */}
      {activeTab === "decorations" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Decoration Grid System</h2>

          <div style={styles.card}>
            <p
              style={{
                color: themeObject.colors.text.secondary,
                marginBottom: "1rem",
              }}
            >
              The decoration grid system provides 50+ pre-built SVG decoration
              elements that overlay the main 3×3 glyph grid.
            </p>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.label}>Elements</div>
                <div style={styles.value}>50+</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Patterns</div>
                <div style={styles.value}>5</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Categories</div>
                <div style={styles.value}>5</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3
              style={{
                ...styles.sectionTitle,
                fontSize: "1.25rem",
                paddingBottom: "0.75rem",
              }}
            >
              Element Categories
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div style={styles.infoItem}>
                <div style={styles.label}>Corners</div>
                <div style={{ ...styles.value, fontSize: "1rem" }}>
                  Brackets, circles
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Dividers</div>
                <div style={{ ...styles.value, fontSize: "1rem" }}>
                  Lines, dashes, dots
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Shapes</div>
                <div style={{ ...styles.value, fontSize: "1rem" }}>
                  Circle, square, diamond
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Ligatures</div>
                <div style={{ ...styles.value, fontSize: "1rem" }}>
                  Curves, swirls
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Ornaments</div>
                <div style={{ ...styles.value, fontSize: "1rem" }}>
                  Flourish, patterns
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Info */}
      {activeTab === "info" && (
        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Application Info</h2>

          <div style={styles.card}>
            <h3
              style={{
                ...styles.sectionTitle,
                fontSize: "1.25rem",
                paddingBottom: "0.75rem",
              }}
            >
              Architecture
            </h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.label}>Framework</div>
                <div style={styles.value}>React 19</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Build Tool</div>
                <div style={styles.value}>Vite 7.3</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Components</div>
                <div style={styles.value}>7</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Custom Hooks</div>
                <div style={styles.value}>4</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Context Providers</div>
                <div style={styles.value}>2</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>CSS Variables</div>
                <div style={styles.value}>50+</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3
              style={{
                ...styles.sectionTitle,
                fontSize: "1.25rem",
                paddingBottom: "0.75rem",
              }}
            >
              Theme System
            </h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.label}>Current Theme</div>
                <div style={styles.value}>{isDark ? "Dark" : "Light"}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Color Mode</div>
                <div style={styles.value}>30-70-90</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Golden Ratio</div>
                <div style={styles.value}>φ ≈ 1.618</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.label}>Font Scale</div>
                <div style={styles.value}>1.125</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h3
              style={{
                ...styles.sectionTitle,
                fontSize: "1.25rem",
                paddingBottom: "0.75rem",
              }}
            >
              Documentation
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div
                style={{
                  paddingBottom: "1rem",
                  borderBottom: `1px solid ${themeObject.colors.border.light}`,
                }}
              >
                <div
                  style={{
                    ...styles.value,
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  README.md
                </div>
                <div style={{ color: themeObject.colors.text.secondary }}>
                  Quick start, architecture overview, and folder structure
                </div>
              </div>
              <div
                style={{
                  paddingBottom: "1rem",
                  borderBottom: `1px solid ${themeObject.colors.border.light}`,
                }}
              >
                <div
                  style={{
                    ...styles.value,
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  ARCHITECTURE.md
                </div>
                <div style={{ color: themeObject.colors.text.secondary }}>
                  Detailed design principles and component responsibilities
                </div>
              </div>
              <div
                style={{
                  paddingBottom: "1rem",
                  borderBottom: `1px solid ${themeObject.colors.border.light}`,
                }}
              >
                <div
                  style={{
                    ...styles.value,
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  THEME_SYSTEM.md
                </div>
                <div style={{ color: themeObject.colors.text.secondary }}>
                  Complete theme documentation with usage examples
                </div>
              </div>
              <div>
                <div
                  style={{
                    ...styles.value,
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  THEME_IMPLEMENTATION.md
                </div>
                <div style={{ color: themeObject.colors.text.secondary }}>
                  Implementation summary and integration details
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
