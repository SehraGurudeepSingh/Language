import React, { useContext } from "react";
import { CONS, LATIN_TO_GLYPH } from "../../constants";
import { GridContext } from "../../context";
import { spiralPositions } from "../../utils";
import { GlyphSVG } from "../GlyphSVG";

/**
 * Renders a word at a specific position
 * Used by WordDisplay component
 */
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

/**
 * WordDisplay Component
 * Renders words in various layouts (vertical, spiral)
 *
 * Features:
 * - Vertical word layout
 * - Spiral word layout with connector path
 * - Automatic glyph lookup from Latin characters
 * - Cursive and handwriting modes
 *
 * Props:
 * - word: string, word to display (Latin characters)
 * - cursive: boolean, apply cursive styling
 * - handwriting: boolean, apply handwriting style
 * - layout: string, 'vertical' or 'spiral' (default 'vertical')
 * - spiralSteps: number, steps for spiral layout (default 9)
 */
export function WordDisplay({
  word,
  cursive,
  handwriting,
  layout = "vertical",
  spiralSteps = 9,
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

  const baseSpacing = 70;
  const wordWidth = 120;
  const wordHeight = glyphs.length * baseSpacing + 40;

  if (layout === "vertical") {
    return (
      <svg
        width={wordWidth}
        height={wordHeight}
        viewBox={`0 0 ${wordWidth} ${wordHeight}`}
      >
        {renderWordAt(0, 0, glyphs, cursive, handwriting, grid)}
      </svg>
    );
  }

  if (layout === "spiral") {
    const positions = spiralPositions(spiralSteps);
    const margin = 50;
    const xs = positions.map((p) => p.x * wordWidth);
    const ys = positions.map((p) => p.y * wordHeight);
    const minX = Math.min(...xs) - margin;
    const maxX = Math.max(...xs) + wordWidth + margin;
    const minY = Math.min(...ys) - margin;
    const maxY = Math.max(...ys) + wordHeight + margin;

    let connectorPath = "";
    if (positions.length > 1) {
      const startX = positions[0].x * wordWidth + wordWidth / 2;
      const startY = positions[0].y * wordHeight + wordHeight / 2;
      connectorPath = `M${startX} ${startY}`;
      for (let i = 1; i < positions.length; i++) {
        const px = positions[i].x * wordWidth + wordWidth / 2;
        const py = positions[i].y * wordHeight + wordHeight / 2;
        connectorPath += ` L${px} ${py}`;
      }
    }

    return (
      <svg
        width={maxX - minX}
        height={maxY - minY}
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      >
        {connectorPath && (
          <path
            d={connectorPath}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="6 3"
          />
        )}
        {positions.map((pos, idx) => (
          <g
            key={idx}
            transform={`translate(${pos.x * wordWidth}, ${pos.y * wordHeight})`}
          >
            {renderWordAt(0, 0, glyphs, cursive, handwriting, grid)}
          </g>
        ))}
      </svg>
    );
  }
  return null;
}

export default WordDisplay;
