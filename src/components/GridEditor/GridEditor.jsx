import React, { useState, useContext } from "react";
import { THEME, NODE_KEYS, ALL_SEGS } from "../../constants";
import { GridContext } from "../../context";

/**
 * GridEditor Component
 * Master grid editor with segment toggling and coordinate control
 *
 * Features:
 * - Interactive node selection and segment toggling
 * - Visual segment feedback (active/inactive)
 * - Numeric inputs for precise coordinate control
 * - Show All / Clear All buttons
 *
 * Props: None (reads from GridContext)
 */
export function GridEditor() {
  const { grid, setGrid, activeSegs, setActiveSegs } = useContext(GridContext);
  const [selectedNode, setSelectedNode] = useState(null);

  // Handle node selection for segment toggling
  const handleNodeClick = (node) => {
    if (selectedNode === null) {
      setSelectedNode(node);
    } else if (selectedNode === node) {
      setSelectedNode(null);
    } else {
      // Toggle segment between these two nodes
      const segExists = activeSegs.some(
        ([a, b]) =>
          (a === selectedNode && b === node) ||
          (a === node && b === selectedNode),
      );
      let newSegs;
      if (segExists) {
        newSegs = activeSegs.filter(
          ([a, b]) =>
            !(
              (a === selectedNode && b === node) ||
              (a === node && b === selectedNode)
            ),
        );
      } else {
        newSegs = [...activeSegs, [selectedNode, node]];
      }
      setActiveSegs(newSegs);
      setSelectedNode(null);
    }
  };

  return (
    <div
      style={{
        background: THEME.cardBg,
        border: THEME.border,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <h3 style={{ color: THEME.textSecondary, marginTop: 0 }}>
        ✎ MASTER GLYPH EDITOR
      </h3>
      <p style={{ fontSize: 10, color: THEME.textMuted }}>
        Click nodes to toggle segments. Use numeric inputs to adjust positions.
        All glyphs update instantly.
      </p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <svg
          width="300"
          height="300"
          viewBox="-10 -10 80 80"
          style={{ background: "#111", borderRadius: 4, cursor: "crosshair" }}
        >
          {/* Grid lines - only active segments */}
          {activeSegs.map(([a, b], i) => (
            <line
              key={i}
              x1={grid[a][0]}
              y1={grid[a][1]}
              x2={grid[b][0]}
              y2={grid[b][1]}
              stroke="#fff"
              strokeWidth="1.5"
            />
          ))}
          {/* Ghost of all possible segments */}
          {ALL_SEGS.map(([a, b], i) => {
            const isActive = activeSegs.some(
              ([x, y]) => (x === a && y === b) || (x === b && y === a),
            );
            return (
              <line
                key={`ghost-${i}`}
                x1={grid[a][0]}
                y1={grid[a][1]}
                x2={grid[b][0]}
                y2={grid[b][1]}
                stroke={isActive ? "transparent" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? "0" : "0.5"}
              />
            );
          })}
          {/* Nodes */}
          {NODE_KEYS.map((k) => (
            <circle
              key={k}
              cx={grid[k][0]}
              cy={grid[k][1]}
              r="4"
              fill={selectedNode === k ? "#fff" : "rgba(255,255,255,0.4)"}
              stroke="#fff"
              strokeWidth="1"
              style={{ cursor: "pointer" }}
              onClick={() => handleNodeClick(k)}
            />
          ))}
        </svg>

        {/* Controls */}
        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setActiveSegs(ALL_SEGS.map(([a, b]) => [a, b]))}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Show All
            </button>
          </div>
          <div style={{ marginBottom: 12 }}>
            <button
              onClick={() => setActiveSegs([])}
              style={{
                background: "transparent",
                border: THEME.border,
                color: "#fff",
                padding: "4px 12px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Clear All
            </button>
          </div>
          <div
            style={{
              marginBottom: 12,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: 12,
            }}
          >
            <label
              style={{
                fontSize: 9,
                color: THEME.textMuted,
                display: "block",
                marginBottom: 4,
              }}
            >
              Active Segments: {activeSegs.length}/{ALL_SEGS.length}
            </label>
          </div>
        </div>
      </div>

      {/* Numeric inputs for precise grid control */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          marginTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingTop: 12,
        }}
      >
        {NODE_KEYS.map((k) => (
          <div key={k}>
            <label style={{ fontSize: 9, color: THEME.textMuted }}>{k}:</label>
            <input
              type="number"
              value={Math.round(grid[k][0])}
              onChange={(e) =>
                setGrid((prev) => ({
                  ...prev,
                  [k]: [parseFloat(e.target.value) || 0, grid[k][1]],
                }))
              }
              style={{
                width: 50,
                background: "#222",
                color: "#fff",
                border: "none",
                marginRight: 4,
                fontSize: 9,
              }}
            />
            <input
              type="number"
              value={Math.round(grid[k][1])}
              onChange={(e) =>
                setGrid((prev) => ({
                  ...prev,
                  [k]: [grid[k][0], parseFloat(e.target.value) || 0],
                }))
              }
              style={{
                width: 50,
                background: "#222",
                color: "#fff",
                border: "none",
                fontSize: 9,
                marginLeft: 4,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridEditor;
