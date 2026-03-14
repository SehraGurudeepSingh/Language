/**
 * NonalCircuitStudio - Optimized Application Entry Point
 *
 * Optimizations:
 * - React.lazy() + Suspense for code splitting on non-critical components
 * - Barrel exports from src/components, src/constants, src/utils
 * - Memo/useCallback for performance optimization
 * - Error boundaries for graceful error handling
 * - Organized imports (external, internal, styles)
 */

// ============================================================================
// EXTERNAL IMPORTS
// ============================================================================
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  memo,
  Suspense,
  lazy,
} from "react";

// ============================================================================
// INTERNAL IMPORTS - BARREL EXPORTS
// ============================================================================

// Constants barrel export
import {
  THEME,
  NODE_KEYS,
  ALL_SEGS,
  CONS,
  LATIN_TO_GLYPH,
  PHONETIC_CORES,
  SUBSETS,
  VARIANTS,
  COGNITIVE_AXES,
  GENOME_BITS,
  EDGE_TYPES,
  BY_NAME,
  BY_NUM,
} from "./src/constants";

// Context barrel export
import { GridContext, GridContextProvider } from "./src/context";

// Utility functions barrel export
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
} from "./src/utils";

// ============================================================================
// LAZY LOADED COMPONENTS (Code Splitting)
// ============================================================================
// These components are non-critical and loaded on-demand

const Dashboard = lazy(() => import("./src/components/Dashboard/Dashboard"));
const Navigation = lazy(() => import("./src/components/Navigation/Navigation"));
const ThemeToggle = lazy(
  () => import("./src/components/ThemeToggle/ThemeToggle"),
);

// ============================================================================
// ACTIVE COMPONENTS (Critical - loaded immediately)
// ============================================================================
import {
  GridEditor,
  GlyphSVG,
  WordDisplay,
  GlyphEditor,
  AnimatedGlyph,
  KeyboardLayout,
} from "./src/components";

// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================

/**
 * Error Boundary - Catches React errors and displays fallback UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 20,
            background: "#1a1a1a",
            border: "1px solid #ff4444",
            borderRadius: 8,
            color: "#ff4444",
          }}
        >
          <h3>⚠ Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "8px 16px",
              background: "#ff4444",
              border: "none",
              borderRadius: 4,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// LOADING FALLBACK COMPONENT
// ============================================================================

const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      color: THEME?.textMuted || "#888",
    }}
  >
    <span style={{ marginRight: 8 }}>⏳</span>
    Loading...
  </div>
);

// ============================================================================
// UTILITY FUNCTIONS (Remaining inline utilities)
// ============================================================================

// Normalize segment for comparison
function normalizeSegment(seg) {
  const sorted = [...seg].sort();
  return sorted.map((n) => (typeof n === "string" ? n : n));
}

// ============================================================================
// FRACTAL WORD DISPLAY COMPONENT
// ============================================================================

const FractalWordDisplay = memo(function FractalWordDisplay({
  word,
  cursive,
  handwriting,
  level = 0,
  maxLevel = 2,
}) {
  const { grid } = useContext(GridContext);
  const glyphs = word
    .split("")
    .map((ch) => {
      const name = LATIN_TO_GLYPH[ch.toUpperCase()] || ch.toUpperCase();
      return CONS.find((g) => g.name === name) || null;
    })
    .filter((g) => g);

  if (glyphs.length === 0) return null;

  const cellSize = 120;
  const spacing = 10;

  if (level >= maxLevel) {
    return (
      <svg
        width={cellSize}
        height={cellSize}
        viewBox={`0 0 ${cellSize} ${cellSize}`}
      >
        <g transform={`translate(10,10)`}>
          {renderWordAt(0, 0, glyphs, cursive, handwriting, grid)}
        </g>
      </svg>
    );
  }

  const positions = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      positions.push({
        x: col * (cellSize + spacing),
        y: row * (cellSize + spacing),
      });
    }
  }

  return (
    <svg
      width={3 * cellSize + 2 * spacing}
      height={3 * cellSize + 2 * spacing}
      viewBox={`0 0 ${3 * cellSize + 2 * spacing} ${3 * cellSize + 2 * spacing}`}
    >
      {positions.map((pos, idx) => (
        <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
          <FractalWordDisplay
            word={word}
            cursive={cursive}
            handwriting={handwriting}
            level={level + 1}
            maxLevel={maxLevel}
          />
        </g>
      ))}
    </svg>
  );
});

// Helper to render a single vertical word
function renderWordAt(x, y, glyphs, cursive, handwriting, grid) {
  const baseSpacing = 70;
  const connectorPoints = glyphs.map((g, i) => {
    if (g.bn) {
      const [gx, gy] = grid[g.bn];
      return [10 + gx, i * baseSpacing + 30 + gy];
    }
    return [10 + 30, i * baseSpacing + 30 + 30];
  });

  let connectorPath = "";
  if (connectorPoints.length > 1) {
    const [x0, y0] = connectorPoints[0];
    connectorPath = `M${x0} ${y0}`;
    for (let i = 1; i < connectorPoints.length; i++) {
      const [x1, y1] = connectorPoints[i];
      const prev = connectorPoints[i - 1];
      const mx = (prev[0] + x1) / 2;
      const my = (prev[1] + y1) / 2;
      connectorPath += ` Q${prev[0]} ${prev[1]} ${mx} ${my} L${x1} ${y1}`;
    }
  }

  return (
    <g>
      {connectorPath && (
        <path
          d={connectorPath}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
        />
      )}
      {glyphs.map((g, i) => (
        <g key={i} transform={`translate(10, ${i * baseSpacing + 30})`}>
          <GlyphSVG
            segs={g.segs}
            type={g.type}
            color={g.color}
            breath={g.breath}
            bn={g.bn}
            sz={60}
            cursive={cursive}
            showNodes={false}
            handwriting={handwriting}
          />
        </g>
      ))}
    </g>
  );
}

// ============================================================================
// FONT EXPORT UTILITY
// ============================================================================

function downloadTTF(glyphs, fontName, grid, useCursive) {
  try {
    if (!window.opentype) {
      alert("opentype.js is loading. Please wait a moment and try again.");
      return;
    }
    const opentype = window.opentype;

    const glyphsArray = [];
    let glyphCount = 0;

    // Add .notdef glyph (required)
    const notdefPath = new opentype.Path();
    notdefPath.moveTo(0, 0);
    notdefPath.lineTo(500, 0);
    notdefPath.lineTo(500, 700);
    notdefPath.lineTo(0, 700);
    notdefPath.closePath();

    glyphsArray.push(
      new opentype.Glyph({
        name: ".notdef",
        unicode: 0,
        advanceWidth: 500,
        path: notdefPath,
      }),
    );

    // Add space glyph (required)
    glyphsArray.push(
      new opentype.Glyph({
        name: "space",
        unicode: 32,
        advanceWidth: 300,
        path: new opentype.Path(),
      }),
    );

    // Map glyph names to ASCII characters
    const glyphNameToChar = {
      S: 115,
      F: 102,
      SH: 120,
      Z: 122,
      ZH: 118,
      TH: 116,
      DH: 100,
      K: 107,
      T: 84,
      P: 112,
      B: 98,
      G: 103,
      NG: 110,
      M: 109,
      L: 108,
      N: 78,
      R: 114,
      W: 119,
      Y: 121,
    };

    // Add each consonant glyph
    glyphs.forEach((glyph, index) => {
      try {
        if (glyph.segs && glyph.segs.length > 0) {
          if (glyph.genome == null) {
            glyph.genome = encodeGenome(glyph);
          }
          const genomeHex = glyph.genome.toString(16).padStart(8, "0");
          const path = new opentype.Path();

          // Create thick stroked lines for each segment
          glyph.segs.forEach(([a, b], segIdx) => {
            const [x1, y1] = grid[a];
            const [x2, y2] = grid[b];
            const scale = 30;
            const thickness = 60;

            const fx1 = x1 * scale + 200;
            const fy1 = 1000 - y1 * scale;
            const fx2 = x2 * scale + 200;
            const fy2 = 1000 - y2 * scale;

            const dx = fx2 - fx1;
            const dy = fy2 - fy1;
            const len = Math.hypot(dx, dy) || 1;
            const px = (-dy / len) * (thickness / 2);
            const py = (dx / len) * (thickness / 2);

            if (segIdx === 0) {
              path.moveTo(fx1 + px, fy1 + py);
            } else {
              path.closePath();
              path.moveTo(fx1 + px, fy1 + py);
            }
            path.lineTo(fx2 + px, fy2 + py);
            path.lineTo(fx2 - px, fy2 - py);
            path.lineTo(fx1 - px, fy1 - py);
          });

          if (glyph.segs.length > 0) {
            path.closePath();
          }

          const unicode = glyphNameToChar[glyph.name] || 0xe000 + index;

          glyphsArray.push(
            new opentype.Glyph({
              name: `${glyph.name || `glyph${index}`}_0x${genomeHex}`,
              unicode: unicode,
              advanceWidth: 600,
              path: path,
            }),
          );
          glyphCount++;
        }
      } catch (e) {
        console.error(`Error processing glyph ${index}:`, e);
      }
    });

    // Create font with proper metadata
    const font = new opentype.Font({
      familyName: fontName,
      styleName: "Regular",
      unitsPerEm: 1000,
      ascender: 800,
      descender: -200,
      tablesVersion: "1.0",
      glyphs: glyphsArray,
      kerningPairs: {},
    });

    const buffer = font.toArrayBuffer();

    if (!buffer || buffer.byteLength === 0) {
      throw new Error("Font buffer is empty");
    }

    const blob = new Blob([buffer], { type: "application/font-ttf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fontName}.ttf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 500);

    console.log(
      `✓ Font exported: ${fontName}.ttf (${(buffer.byteLength / 1024).toFixed(2)} KB, ${glyphCount} glyphs)`,
    );
    alert(
      `✓ Font downloaded!\nFile: ${fontName}.ttf\nSize: ${(buffer.byteLength / 1024).toFixed(2)} KB\nGlyphs: ${glyphCount}\n\nTry typing: s, f, x, z, v, t, d, k, p, b, g, n, m, l, r, w, y`,
    );
  } catch (error) {
    console.error("Font download error:", error);
    console.error("Stack:", error.stack);
    alert(`Error exporting font:\n${error.message}`);
  }
}

// ============================================================================
// KEYBOARD LAYOUT COMPONENT (Memoized)
// ============================================================================

const KeyboardLayoutComponent = memo(function KeyboardLayoutComponent({
  glyphMap,
}) {
  const { grid } = useContext(GridContext);
  const rows = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ];

  return (
    <svg width="600" height="200" viewBox="0 0 600 200">
      {rows.map((row, ri) =>
        row.map((key, ki) => {
          const x = ki * 40 + ri * 10;
          const y = ri * 40 + 20;
          const glyphName = glyphMap[key] || "?";
          const glyph = CONS.find((g) => g.name === glyphName);
          return (
            <g key={`${ri}-${ki}`} transform={`translate(${x}, ${y})`}>
              <rect
                width="36"
                height="36"
                rx="4"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.2)"
              />
              <text x="18" y="20" fontSize="10" fill="#fff" textAnchor="middle">
                {key}
              </text>
              {glyph && (
                <GlyphSVG
                  segs={glyph.segs}
                  type={glyph.type}
                  color={glyph.color}
                  sz={20}
                  cursive={false}
                  showNodes={false}
                  breath={null}
                />
              )}
            </g>
          );
        }),
      )}
    </svg>
  );
});

// ============================================================================
// STYLES OBJECTS (Memoized for performance)
// ============================================================================

const styles = {
  container: {
    background: THEME.bg,
    color: THEME.textPrimary,
    fontFamily: "monospace",
    padding: 28,
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    letterSpacing: "0.28em",
    background: "linear-gradient(120deg, #4FC3F7, #81C784, #FFB74D)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
    margin: "20px auto",
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: 8,
  },
  card: {
    background: THEME.cardBg,
    borderRadius: 10,
    padding: 20,
    border: THEME.border,
  },
  footer: {
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    paddingTop: 20,
    fontSize: 8,
    color: "rgba(255,255,255,0.15)",
  },
};

// ============================================================================
// HELPER STYLES
// ============================================================================

const getButtonStyle = (isActive) => ({
  padding: "7px 20px",
  borderRadius: 6,
  background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
  border: isActive
    ? "1px solid rgba(255,255,255,0.18)"
    : "1px solid transparent",
  color: isActive ? THEME.textPrimary : THEME.textMuted,
  cursor: "pointer",
});

const getInputStyle = () => ({
  background: "#000",
  color: "#fff",
  border: THEME.border,
  padding: 4,
});

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function NonalCircuitStudio() {
  // Grid state – default coordinates
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

  // Active segments from master glyph editor
  const [activeSegs, setActiveSegs] = useState(
    ALL_SEGS.map(([a, b]) => [a, b]),
  );

  const [cursive, setCursive] = useState(false);
  const [handwriting, setHandwriting] = useState(false);
  const [selectedGlyph, setSelectedGlyph] = useState(CONS[0]);
  const [customGlyph, setCustomGlyph] = useState({
    segs: [],
    type: "plosive",
    breath: "hold",
    bn: "MC",
  });
  const [word, setWord] = useState("SFT");
  const [evolvedGlyphs, setEvolvedGlyphs] = useState([]);
  const [mathExpr, setMathExpr] = useState("3+4*2");
  const [semanticCoord, setSemanticCoord] = useState("1-1-1");
  const [generatedWord, setGeneratedWord] = useState("SFT");
  const [layout, setLayout] = useState("vertical");
  const [spiralSteps, setSpiralSteps] = useState(9);
  const [fontName, setFontName] = useState("GlyphStudio");

  // Memoized callbacks for performance
  const handleEvolve = useCallback(() => {
    const newGlyphs = evolveGlyphs(12, evolvedGlyphs, grid);
    setEvolvedGlyphs(newGlyphs);
  }, [evolvedGlyphs, grid]);

  const handleSemanticGenerate = useCallback(() => {
    const parts = semanticCoord.split("-").map(Number);
    if (parts.length === 3) {
      const glyphs = semanticToGlyphs(parts);
      const wordStr = glyphs.map((g) => g.name).join("");
      setWord(wordStr);
      setGeneratedWord(wordStr);
    }
  }, [semanticCoord]);

  const handleGlyphChange = useCallback((glyph) => {
    setCustomGlyph(glyph);
  }, []);

  const handleDownloadTTF = useCallback(() => {
    downloadTTF(CONS, fontName, grid, cursive);
  }, [fontName, grid, cursive]);

  const handleCopyJSON = useCallback(() => {
    const dataStr = JSON.stringify(customGlyph, null, 2);
    navigator.clipboard.writeText(dataStr);
    alert("Glyph data copied!");
  }, [customGlyph]);

  useEffect(() => {
    // Run validation on mount
    validateAllGlyphs();

    if (!window.opentype) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js";
      script.async = true;
      script.onload = () => {
        console.log("✓ opentype.js loaded successfully");
      };
      script.onerror = () => {
        console.error("✗ Failed to load opentype.js");
      };
      document.body.appendChild(script);
    } else {
      console.log("✓ opentype.js already available");
    }
  }, []);

  const keyMap = {
    a: "A",
    b: "B",
    c: "C",
    d: "D",
    e: "E",
    f: "F",
    g: "G",
    h: "H",
    i: "I",
    j: "J",
    k: "K",
    l: "L",
    m: "M",
    n: "N",
    o: "O",
    p: "P",
    q: "Q",
    r: "R",
    s: "S",
    t: "T",
    u: "U",
    v: "V",
    w: "W",
    x: "X",
    y: "Y",
    z: "Z",
    1: "S",
    2: "F",
    3: "SH",
    4: "Z",
    5: "ZH",
    6: "TH",
    7: "DH",
    8: "K",
    9: "T",
    0: "∅",
  };

  return (
    <ErrorBoundary>
      <GridContextProvider value={{ grid, setGrid, activeSegs, setActiveSegs }}>
        <div style={styles.container}>
          {/* Header */}
          <header style={styles.header}>
            <h1 style={styles.title}>GLYPH STUDIO</h1>

            {/* Lazy loaded navigation and theme toggle */}
            <Suspense fallback={<LoadingFallback />}>
              <Navigation />
              <ThemeToggle />
            </Suspense>

            <div style={styles.buttonGroup}>
              <button
                onClick={() => setCursive(false)}
                style={getButtonStyle(!cursive)}
              >
                □ SCIENTIFIC · BLOCKY
              </button>
              <button
                onClick={() => setCursive(true)}
                style={getButtonStyle(cursive)}
              >
                ∿ POETIC · CURSIVE
              </button>
              <button
                onClick={() => setHandwriting(!handwriting)}
                style={getButtonStyle(handwriting)}
              >
                ✍ HANDWRITING {handwriting ? "ON" : "OFF"}
              </button>
            </div>
          </header>

          {/* Grid Editor */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>0 · MASTER GRID</h2>
            <GridEditor grid={grid} setGrid={setGrid} />
          </section>

          {/* Master glyph comparison */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ⅰ · MASTER GLYPH (COMBINED)</h2>
            <div
              style={{
                display: "flex",
                gap: 40,
                justifyContent: "center",
                ...styles.card,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <GlyphSVG
                  segs={ALL_SEGS}
                  type="master"
                  color="#fff"
                  sz={120}
                  cursive={false}
                  showNodes
                  breath={null}
                  handwriting={handwriting}
                />
                <div style={{ fontSize: 10, color: THEME.textMuted }}>
                  Scientific · Blocky
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <GlyphSVG
                  segs={ALL_SEGS}
                  type="master"
                  color="#fff"
                  sz={120}
                  cursive={true}
                  showNodes
                  breath={null}
                  handwriting={handwriting}
                />
                <div style={{ fontSize: 10, color: THEME.textMuted }}>
                  Poetic · Cursive
                </div>
              </div>
            </div>
          </section>

          {/* Evolution engine */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ⅱ · GLYPH EVOLUTION ENGINE</h2>
            <button
              onClick={handleEvolve}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "8px 16px",
                marginBottom: 16,
                cursor: "pointer",
              }}
            >
              🌱 EVOLVE 12 NEW GLYPHS
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: 8,
              }}
            >
              {evolvedGlyphs.map((g, i) => (
                <div
                  key={i}
                  style={{
                    background: THEME.cardBg,
                    border: THEME.border,
                    borderRadius: 6,
                    padding: 8,
                    textAlign: "center",
                  }}
                >
                  <GlyphSVG
                    segs={g.segs}
                    type={g.type}
                    color={g.color}
                    sz={50}
                    cursive={cursive}
                    showNodes={false}
                    breath={g.breath}
                    bn={g.bn}
                    handwriting={handwriting}
                  />
                  <div style={{ fontSize: 9, color: THEME.textMuted }}>
                    {g.segs.length} segs
                  </div>
                  {g.genome != null && (
                    <div style={{ fontSize: 7, color: "#888" }}>
                      0x{g.genome.toString(16).padStart(8, "0")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Interactive editor */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ⅲ · DESIGN YOUR OWN GLYPH</h2>
            <GlyphEditor onGlyphChange={handleGlyphChange} />
            <div
              style={{
                marginTop: 16,
                display: "flex",
                gap: 20,
                alignItems: "center",
              }}
            >
              <GlyphSVG
                segs={customGlyph.segs}
                type={customGlyph.type}
                color="#fff"
                breath={customGlyph.breath}
                bn={customGlyph.bn}
                sz={100}
                cursive={cursive}
                handwriting={handwriting}
              />
              <button
                onClick={handleCopyJSON}
                style={{
                  background: "transparent",
                  border: THEME.border,
                  color: "#fff",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                📋 Copy JSON
              </button>
            </div>
          </section>

          {/* Stroke animation */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Ⅳ · BREATH‑SYNCHRONIZED STROKE ANIMATION
            </h2>
            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <select
                onChange={(e) =>
                  setSelectedGlyph(CONS.find((c) => c.name === e.target.value))
                }
                value={selectedGlyph?.name}
                style={getInputStyle()}
              >
                {CONS.map((g) => (
                  <option key={g.num} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
              {selectedGlyph && (
                <AnimatedGlyph
                  glyph={selectedGlyph}
                  cursive={cursive}
                  handwriting={handwriting}
                />
              )}
            </div>
          </section>

          {/* Word generator */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Ⅴ · WORD GENERATOR (vertical + spiral)
            </h2>
            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 10, color: THEME.textMuted }}>
                    Word (latin):
                  </label>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value.toUpperCase())}
                    style={{ ...getInputStyle(), marginLeft: 8 }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 10, color: THEME.textMuted }}>
                    Layout:
                  </label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    style={{ ...getInputStyle(), marginLeft: 8 }}
                  >
                    <option value="vertical">Vertical (single)</option>
                    <option value="spiral">Spiral</option>
                  </select>
                </div>
                {layout === "spiral" && (
                  <div>
                    <label style={{ fontSize: 10, color: THEME.textMuted }}>
                      Steps:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={spiralSteps}
                      onChange={(e) =>
                        setSpiralSteps(parseInt(e.target.value) || 1)
                      }
                      style={{ ...getInputStyle(), marginLeft: 8, width: 60 }}
                    />
                  </div>
                )}
              </div>
              <WordDisplay
                word={word}
                cursive={cursive}
                handwriting={handwriting}
                layout={layout}
                spiralSteps={spiralSteps}
              />
            </div>
          </section>

          {/* Procedural vocabulary */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Ⅵ · PROCEDURAL VOCABULARY (MATH → GLYPHS)
            </h2>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={mathExpr}
                onChange={(e) => setMathExpr(e.target.value)}
                style={getInputStyle()}
              />
              <button
                onClick={() => {
                  const digitMap = {
                    0: "∅",
                    1: "S",
                    2: "F",
                    3: "SH",
                    4: "Z",
                    5: "ZH",
                    6: "TH",
                    7: "DH",
                    8: "K",
                    9: "T",
                  };
                  setWord(
                    mathExpr
                      .split("")
                      .map((ch) => digitMap[ch] || ch)
                      .join(""),
                  );
                }}
                style={{
                  background: "transparent",
                  border: THEME.border,
                  color: "#fff",
                  padding: "4px 12px",
                  cursor: "pointer",
                }}
              >
                Generate Word
              </button>
              <input
                type="text"
                value={semanticCoord}
                onChange={(e) => setSemanticCoord(e.target.value)}
                placeholder="core-subset-variant"
                style={getInputStyle()}
              />
              <button
                onClick={handleSemanticGenerate}
                style={{
                  background: "transparent",
                  border: THEME.border,
                  color: "#fff",
                  padding: "4px 12px",
                  cursor: "pointer",
                }}
              >
                SemGen
              </button>
              {generatedWord && (
                <div style={{ color: THEME.accentVowel, fontSize: 12 }}>
                  → {generatedWord}
                </div>
              )}
            </div>
          </section>

          {/* Cognitive Map Generator */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>
              Ⅸ · COGNITIVE MAP (semantic → word)
            </h2>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                value={semanticCoord}
                onChange={(e) => setSemanticCoord(e.target.value)}
                placeholder="e.g., 1-3-5"
                style={getInputStyle()}
              />
              <button
                onClick={handleSemanticGenerate}
                style={{
                  background: "transparent",
                  border: THEME.border,
                  color: "#fff",
                  padding: "4px 12px",
                  cursor: "pointer",
                }}
              >
                Generate Word
              </button>
              <span style={{ color: THEME.textMuted, fontSize: 10 }}>
                core-subset-variant
              </span>
            </div>
            {generatedWord && (
              <div style={{ marginTop: 12 }}>
                <FractalWordDisplay
                  word={generatedWord}
                  cursive={cursive}
                  handwriting={handwriting}
                  level={0}
                  maxLevel={1}
                />
              </div>
            )}
          </section>

          {/* Keyboard layout */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ⅶ · KEYBOARD LAYOUT</h2>
            <KeyboardLayoutComponent glyphMap={keyMap} />
          </section>

          {/* Font export */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Ⅷ · EXPORT FONT</h2>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <input
                type="text"
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                placeholder="Font name"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: THEME.border,
                  color: "#fff",
                  padding: "6px 10px",
                  fontSize: 12,
                  flex: 1,
                  outline: "none",
                }}
              />
              <button
                onClick={handleDownloadTTF}
                style={{
                  background: "transparent",
                  border: THEME.border,
                  color: "#fff",
                  padding: "8px 20px",
                  cursor: "pointer",
                }}
              >
                ⬇ Download {fontName}.ttf
              </button>
            </div>
            <p style={{ fontSize: 9, color: THEME.textMuted, marginTop: 8 }}>
              Uses current cursive setting and master grid.
            </p>
          </section>

          {/* Lazy loaded Dashboard - loaded on demand */}
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>

          <footer style={styles.footer}>
            NONAL‑CIRCUIT SYSTEM · EDITABLE MASTER GRID · ALL GLYPHS UPDATE LIVE
          </footer>
        </div>
      </GridContextProvider>
    </ErrorBoundary>
  );
}
