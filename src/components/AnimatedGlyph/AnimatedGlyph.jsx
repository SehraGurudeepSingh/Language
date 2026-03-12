import React, { useState, useEffect, useRef, useContext } from "react";
import { THEME } from "../../constants";
import { GridContext } from "../../context";
import { getStrokeOrder } from "../../utils";
import { GlyphSVG } from "../GlyphSVG";

/**
 * AnimatedGlyph Component
 * Displays a glyph with breath-synchronized stroke animation
 *
 * Features:
 * - Animated stroke drawing with breath phases
 * - Three phases: Inhale (↑), Hold (◈), Exhale (↓)
 * - Speed varies by breath type
 * - Shows node points during animation
 *
 * Props:
 * - glyph: object with segs, type, color, breath, bn properties
 * - cursive: boolean, apply cursive styling
 * - handwriting: boolean, apply handwriting style
 */
export function AnimatedGlyph({ glyph, cursive, handwriting }) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef();
  const { grid } = useContext(GridContext);

  const ordered = getStrokeOrder(glyph.segs, grid);
  const totalSegs = ordered.length;

  const speeds = { up: 0.02, hold: 0.01, down: 0.015 };
  const speed = speeds[glyph.breath] || 0.015;

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        let next = p + speed;
        if (next >= 1) {
          setPhase((phase + 1) % 3);
          return 0;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(intervalRef.current);
  }, [phase, speed]);

  const visibleCount = Math.floor(progress * totalSegs);
  const visibleSegs = ordered.slice(0, visibleCount);

  return (
    <div style={{ textAlign: "center" }}>
      <GlyphSVG
        segs={visibleSegs}
        type={glyph.type}
        color={glyph.color}
        breath={glyph.breath}
        bn={glyph.bn}
        sz={80}
        cursive={cursive}
        showNodes
        handwriting={handwriting}
      />
      <div style={{ fontSize: 10, color: THEME.textMuted }}>
        {["↑ INHALE", "◈ HOLD", "↓ EXHALE"][phase]}
      </div>
    </div>
  );
}

export default AnimatedGlyph;
