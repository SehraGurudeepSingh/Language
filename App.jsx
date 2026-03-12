import React, { useState, useEffect, useRef, useContext } from "react";

// ============================================================================
//  MODULAR IMPORTS - Constants
// ============================================================================
import {
  // Legacy theme
  THEME,
  // Grid and glyph definitions
  NODE_KEYS,
  ALL_SEGS,
  DEFAULT_GRID,
  CONS,
  BY_NUM,
  BY_NAME,
  // Phonetic hierarchy
  PHONETIC_CORES,
  SUBSETS,
  VARIANTS,
  COGNITIVE_AXES,
  LATIN_TO_GLYPH,
  // Genome system
  GENOME_BITS,
  EDGE_TYPES,
  // Advanced theme system
  LIGHT_COLORS,
  DARK_COLORS,
  NEUTRAL,
  OPACITY,
  applyOpacity,
  getContrastTextColor,
  // Typography system
  FONTS,
  FONT_WEIGHTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  LETTER_SPACING,
  TYPOGRAPHY,
  GOOGLE_FONTS_URL,
  // Decoration system
  DECORATION_GRID,
  DECORATION_ELEMENTS,
  DECORATION_PATTERNS,
  POSITION_STRATEGIES,
  GLYPH_DECORATION_MAPS,
  // Enhanced theme system
  LIGHT_THEME,
  DARK_THEME,
  getSystemTheme,
  setTheme,
  getTheme,
} from "./src/constants";

// ============================================================================
//  MODULAR IMPORTS - Context
// ============================================================================
import {
  GridContext,
  GridContextProvider,
  ThemeContext,
  ThemeProvider,
} from "./src/context";

// ============================================================================
//  MODULAR IMPORTS - Components
// ============================================================================
import {
  GridEditor,
  GlyphSVG,
  WordDisplay,
  GlyphEditor,
  AnimatedGlyph,
  KeyboardLayout,
  ThemeToggle,
  Dashboard,
  Navigation,
} from "./src/components";

// ============================================================================
//  MODULAR IMPORTS - Hooks
// ============================================================================
import {
  useGlyphValidation,
  useOpenType,
  useGlyphEvolution,
  useTheme,
} from "./src/hooks";

// ============================================================================
//  MODULAR IMPORTS - Utilities
// ============================================================================
import {
  normalizeSegment,
  isValidSegment,
  validateGlyph,
  glyphKey,
  findDuplicateGlyphs,
  validateAllGlyphs,
  encodeGenome,
  decodeGenome,
  buildPath,
  getStrokeOrder,
  isConnected,
  generateRandomGlyph,
  evolveGlyphs,
  spiralPositions,
  semanticToGlyphs,
  normalizeSegmentFast,
  ALL_SEGS_NORMALIZED,
  SEGMENT_LOOKUP,
  isSegmentDefined,
} from "./src/utils";

// ============================================================================
//  MAIN APP COMPONENT
// ============================================================================

function NonalCircuitStudio() {
  const [appTab, setAppTab] = useState("editor");
  const [grid, setGrid] = useState({
    TL: [10, 10],
    TC: [30, 10],
    TR: [50, 10],
    ML: [10, 30],
    MC: [30, 30],
    MR: [50, 30],
    BL: [10, 50],
    BC: [30, 50],
    BR: [50, 50],
  });
  const [activeSegs, setActiveSegs] = useState(
    ALL_SEGS.map(([a, b]) => [a, b]),
  );
  const [handwriting, setHandwriting] = useState(false);

  const { themeObject, isDark } = useTheme();

  useEffect(() => {
    validateAllGlyphs();
  }, []);

  const tabStyles = {
    container: {
      display: "flex",
      gap: "1rem",
      borderBottom: `2px solid ${themeObject.colors.border.primary}`,
      marginBottom: "2rem",
      padding: "0 2rem",
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
  };

  return (
    <GridContextProvider value={{ grid, setGrid, activeSegs, setActiveSegs }}>
      <Navigation activeTab={appTab} onTabChange={setAppTab} />

      <main style={{ paddingTop: "80px" }}>
        {appTab === "editor" && (
          <div
            style={{
              background: themeObject.colors.surface.primary,
              color: themeObject.colors.text.primary,
              fontFamily: "var(--font-primary), sans-serif",
              padding: 28,
              maxWidth: 1200,
              margin: "0 auto",
              transition: `background-color ${themeObject.transitions.normal}, color ${themeObject.transitions.normal}`,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1
                style={{
                  fontSize: 28,
                  letterSpacing: "0.15em",
                  background: `linear-gradient(135deg, ${themeObject.colors.semantic.sibilant} 0%, ${themeObject.colors.semantic.vowel} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Jost', 'Inter', sans-serif",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                GLYPH STUDIO
              </h1>
              <p
                style={{
                  color: themeObject.colors.text.secondary,
                  fontSize: 14,
                  fontFamily: "var(--font-primary)",
                }}
              >
                Interactive glyph design with modern grid-based editor
              </p>
            </div>

            <section style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontSize: 14,
                  color: themeObject.colors.text.secondary,
                  borderBottom: `1px solid ${themeObject.colors.border.light}`,
                  paddingBottom: 8,
                }}
              >
                0 · MASTER GRID
              </h2>
              <GridEditor />
            </section>

            <section style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontSize: 14,
                  color: themeObject.colors.text.secondary,
                  borderBottom: `1px solid ${themeObject.colors.border.light}`,
                  paddingBottom: 8,
                }}
              >
                Ⅰ · MASTER GLYPH (COMBINED)
              </h2>
              <div
                style={{
                  display: "flex",
                  gap: 40,
                  justifyContent: "center",
                  background: themeObject.colors.surface.secondary,
                  borderRadius: 10,
                  padding: 20,
                  border: `1px solid ${themeObject.colors.border.primary}`,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <GlyphSVG
                    segs={ALL_SEGS}
                    type="master"
                    color={themeObject.colors.semantic.sibilant}
                    sz={120}
                    cursive={false}
                    showNodes
                    breath={null}
                    handwriting={handwriting}
                  />
                  <div
                    style={{
                      fontSize: 10,
                      color: themeObject.colors.text.muted,
                    }}
                  >
                    Scientific · Blocky
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <GlyphSVG
                    segs={ALL_SEGS}
                    type="master"
                    color={themeObject.colors.semantic.sibilant}
                    sz={120}
                    cursive={true}
                    showNodes
                    breath={null}
                    handwriting={handwriting}
                  />
                  <div
                    style={{
                      fontSize: 10,
                      color: themeObject.colors.text.muted,
                    }}
                  >
                    Poetic · Cursive
                  </div>
                </div>
              </div>
            </section>

            <div
              style={{
                textAlign: "center",
                marginTop: 60,
                padding: 20,
                fontSize: 10,
                color: themeObject.colors.text.muted,
                borderTop: `1px solid ${themeObject.colors.border.light}`,
              }}
            >
              <p>Modular architecture with light/dark theme support</p>
              <p>Current theme: {isDark ? "Dark" : "Light"}</p>
            </div>
          </div>
        )}

        {appTab === "dashboard" && <Dashboard />}
      </main>
    </GridContextProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NonalCircuitStudio />
    </ThemeProvider>
  );
}
