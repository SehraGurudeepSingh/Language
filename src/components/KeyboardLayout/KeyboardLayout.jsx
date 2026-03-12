import React, { useContext } from "react";
import { CONS } from "../../constants";
import { GridContext } from "../../context";
import { GlyphSVG } from "../GlyphSVG";

/**
 * KeyboardLayout Component
 * Visual keyboard display showing glyphs mapped to keys
 *
 * Props:
 * - glyphMap: object mapping keyboard characters to glyph names
 */
export function KeyboardLayout({ glyphMap }) {
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
}

export default KeyboardLayout;
