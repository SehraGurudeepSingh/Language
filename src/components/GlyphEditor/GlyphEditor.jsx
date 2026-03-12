import React, { useState, useContext, useEffect } from "react";
import { THEME, NODE_KEYS, ALL_SEGS } from "../../constants";
import { GridContext } from "../../context";
import { isConnected } from "../../utils";

/**
 * GlyphEditor Component
 * Interactive glyph designer with segment and metadata controls
 *
 * Features:
 * - Interactive node selection and segment toggling
 * - Type selector (sibilant, plosive, resonant)
 * - Breath control (up, hold, down)
 * - Base node selection
 * - Live preview with validation
 *
 * Props:
 * - onGlyphChange: callback function (glyph) called when glyph changes
 */
export function GlyphEditor({ onGlyphChange }) {
  const { grid } = useContext(GridContext);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeSegs, setActiveSegs] = useState([]);
  const [type, setType] = useState("plosive");
  const [breath, setBreath] = useState("hold");
  const [bn, setBn] = useState("MC");

  const handleNodeClick = (node) => {
    if (selectedNode === null) {
      setSelectedNode(node);
    } else if (selectedNode === node) {
      setSelectedNode(null);
    } else {
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
      if (!isConnected(newSegs, grid) && newSegs.length > 0) {
        console.warn("Glyph is disconnected!");
      }
      onGlyphChange({ segs: newSegs, type, breath, bn });
    }
  };

  useEffect(() => {
    onGlyphChange({ segs: activeSegs, type, breath, bn });
  }, [type, breath, bn, activeSegs, onGlyphChange]);

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
        ✎ GLYPH EDITOR
      </h3>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <svg width="200" height="200" viewBox="-10 -10 80 80">
          {ALL_SEGS.map(([a, b], i) => {
            const active = activeSegs.some(
              ([x, y]) => (x === a && y === b) || (x === b && y === a),
            );
            return (
              <line
                key={i}
                x1={grid[a][0]}
                y1={grid[a][1]}
                x2={grid[b][0]}
                y2={grid[b][1]}
                stroke={active ? "#fff" : "rgba(255,255,255,0.15)"}
                strokeWidth={active ? 2.5 : 1}
                strokeLinecap="round"
              />
            );
          })}
          {NODE_KEYS.map((k) => {
            const isSelected = selectedNode === k;
            return (
              <circle
                key={k}
                cx={grid[k][0]}
                cy={grid[k][1]}
                r={4}
                fill={isSelected ? "#fff" : "rgba(255,255,255,0.3)"}
                stroke="#fff"
                strokeWidth={1}
                style={{ cursor: "pointer" }}
                onClick={() => handleNodeClick(k)}
              />
            );
          })}
        </svg>

        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{ color: THEME.textMuted, display: "block", fontSize: 10 }}
            >
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              <option value="sibilant">Sibilant</option>
              <option value="plosive">Plosive</option>
              <option value="resonant">Resonant</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{ color: THEME.textMuted, display: "block", fontSize: 10 }}
            >
              Breath
            </label>
            <select
              value={breath}
              onChange={(e) => setBreath(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              <option value="up">Inhale (↑)</option>
              <option value="hold">Hold (◈)</option>
              <option value="down">Exhale (↓)</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label
              style={{ color: THEME.textMuted, display: "block", fontSize: 10 }}
            >
              Base Node
            </label>
            <select
              value={bn}
              onChange={(e) => setBn(e.target.value)}
              style={{
                background: "#000",
                color: "#fff",
                border: THEME.border,
                padding: 4,
              }}
            >
              {NODE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setActiveSegs([]);
              setSelectedNode(null);
            }}
            style={{
              background: "transparent",
              border: THEME.border,
              color: "#fff",
              padding: "4px 12px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlyphEditor;
