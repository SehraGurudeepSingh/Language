import React, { useState, useEffect } from "react";
import { ALL_SEGS, NODE_KEYS } from "./src/constants";
import { GridContextProvider, ThemeProvider } from "./src/context";
import { GridEditor, GlyphSVG, ThemeToggle, Dashboard } from "./src/components";
import { validateAllGlyphs } from "./src/utils";
import { useTheme } from "./src/hooks";

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
      <ThemeToggle />

      <div style={tabStyles.container}>
        {["editor", "dashboard"].map((tab) => (
          <button
            key={tab}
            onClick={() => setAppTab(tab)}
            style={{
              ...tabStyles.tab,
              color:
                appTab === tab
                  ? themeObject.colors.interactive.active
                  : themeObject.colors.text.secondary,
              borderBottomColor:
                appTab === tab
                  ? themeObject.colors.interactive.active
                  : "transparent",
            }}
          >
            {tab === "editor" ? "Editor" : "Dashboard"}
          </button>
        ))}
      </div>

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
                fontSize: 22,
                letterSpacing: "0.28em",
                background: `linear-gradient(120deg, ${themeObject.colors.semantic.sibilant}, ${themeObject.colors.semantic.plosive}, ${themeObject.colors.semantic.resonant})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-primary), sans-serif",
              }}
            >
              GLYPH STUDIO
            </h1>
            <p style={{ color: themeObject.colors.text.muted, fontSize: 12 }}>
              Refactored architecture with modular components & light/dark theme
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
                  style={{ fontSize: 10, color: themeObject.colors.text.muted }}
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
                  style={{ fontSize: 10, color: themeObject.colors.text.muted }}
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
