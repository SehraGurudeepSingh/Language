import React, { useContext } from "react";
import { THEME, NODE_KEYS, ALL_SEGS } from "../../constants";
import { GridContext } from "../../context";
import { buildPath, getStrokeOrder } from "../../utils";

/**
 * GlyphSVG Component
 * Core glyph renderer using grid from context
 *
 * Features:
 * - Renders glyph segments from grid context
 * - Supports animation with stroke order
 * - Vowel modifiers (i, a, u)
 * - Breath markers (up, down, hold)
 * - Multiple styling modes (cursive, handwriting)
 *
 * Props:
 * - segs: array of [nodeA, nodeB] segment pairs
 * - type: glyph type (sibilant, plosive, resonant, vowel)
 * - color: stroke color
 * - breath: breath type ('up', 'down', 'hold')
 * - bn: breath node
 * - vowel: vowel modifier (null, 'i', 'a', 'u')
 * - sz: size in pixels (default 64)
 * - cursive: boolean, apply cursive styling
 * - showNodes: boolean, show node points (default true)
 * - animate: boolean, animate stroke drawing
 * - progress: animation progress 0-1 (default 1)
 * - handwriting: boolean, apply handwriting style
 */
export function GlyphSVG({
  segs,
  type,
  color,
  breath,
  bn,
  vowel = null,
  sz = 64,
  cursive = false,
  showNodes = true,
  animate = false,
  progress = 1,
  handwriting = false,
}) {
  const { grid, activeSegs } = useContext(GridContext);
  const strokeWidth = 2.8;
  const nodeR = 2.8;

  // Filter segments to only show those that are active in the master glyph
  const filteredSegs = segs.filter(([a, b]) =>
    activeSegs.some(([x, y]) => (x === a && y === b) || (x === b && y === a)),
  );

  const ordered = animate ? getStrokeOrder(filteredSegs, grid) : filteredSegs;
  const visibleSegs = animate
    ? ordered.slice(0, Math.floor(ordered.length * progress))
    : filteredSegs;

  return (
    <svg width={sz} height={sz} viewBox="-10 -10 80 80" overflow="visible">
      {/* Ghost grid */}
      {ALL_SEGS.map(([a, b], i) => (
        <line
          key={`ghost-${i}`}
          x1={grid[a][0]}
          y1={grid[a][1]}
          x2={grid[b][0]}
          y2={grid[b][1]}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="0.8"
        />
      ))}
      {NODE_KEYS.map((k, i) => (
        <circle
          key={`ghost-node-${i}`}
          cx={grid[k][0]}
          cy={grid[k][1]}
          r={1.4}
          fill="rgba(255,255,255,0.1)"
        />
      ))}

      {/* Active segments */}
      {visibleSegs.map(([a, b], i) => {
        const path = buildPath([[a, b]], type, cursive, handwriting, grid);
        return (
          <path
            key={i}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 3px ${color})` }}
          />
        );
      })}

      {/* Nodes */}
      {showNodes &&
        (() => {
          const nodes = new Set();
          segs.forEach(([a, b]) => {
            nodes.add(a);
            nodes.add(b);
          });
          return [...nodes].map((k) => (
            <circle
              key={k}
              cx={grid[k][0]}
              cy={grid[k][1]}
              r={nodeR}
              fill={color}
            />
          ));
        })()}

      {/* Vowel modifier (if any) */}
      {vowel &&
        (() => {
          // Simple vowel markers: dot, loop, or curve
          const vowelColor = THEME.accentVowel;
          if (vowel === "i") {
            return (
              <circle
                cx={grid.BC[0]}
                cy={grid.BC[1] - 8}
                r={3}
                fill={vowelColor}
              />
            );
          } else if (vowel === "a") {
            return (
              <circle
                cx={grid.MC[0]}
                cy={grid.MC[1]}
                r={4}
                fill={vowelColor}
                fillOpacity={0.5}
              />
            );
          } else if (vowel === "u") {
            return (
              <path
                d={`M${grid.TC[0] - 5} ${grid.TC[1] - 5} Q${grid.TC[0]} ${grid.TC[1] - 10} ${grid.TC[0] + 5} ${grid.TC[1] - 5}`}
                stroke={vowelColor}
                fill="none"
                strokeWidth={2}
              />
            );
          }
          return null;
        })()}

      {/* Breath marker */}
      {breath === "up" &&
        bn &&
        (() => {
          const [bx, by] = grid[bn];
          return (
            <g
              stroke={color}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${color})` }}
            >
              <line x1={bx} y1={by - 1} x2={bx} y2={by - 15} strokeWidth={2} />
              <line
                x1={bx - 4}
                y1={by - 10}
                x2={bx}
                y2={by - 15}
                strokeWidth={1.5}
              />
              <line
                x1={bx + 4}
                y1={by - 10}
                x2={bx}
                y2={by - 15}
                strokeWidth={1.5}
              />
            </g>
          );
        })()}
      {breath === "down" &&
        bn &&
        (() => {
          const [bx, by] = grid[bn];
          return (
            <path
              d={`M${bx} ${by + 1}Q${bx + 8} ${by + 10} ${bx} ${by + 18}`}
              fill="none"
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${color})` }}
            />
          );
        })()}
      {breath === "hold" &&
        bn &&
        (() => {
          const [bx, by] = grid[bn];
          return (
            <rect
              x={bx - 5.5}
              y={by - 5.5}
              width={11}
              height={11}
              fill="none"
              stroke={color}
              strokeWidth={1.8}
            />
          );
        })()}
    </svg>
  );
}

export default GlyphSVG;
