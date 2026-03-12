import { useState } from "react";
import { evolveGlyphs as evolve } from "../utils";

/**
 * useGlyphEvolution
 * Simple hook that provides evolved glyphs and an `evolve` trigger
 *
 * Params:
 * - initial: initial glyph list
 * - grid: grid object (passed through when calling evolve)
 */
export function useGlyphEvolution(initial = []) {
  const [glyphs, setGlyphs] = useState(initial);

  const evolveGlyphs = (count, grid) => {
    const next = evolve(count, glyphs, grid);
    setGlyphs(next);
    return next;
  };

  return { glyphs, setGlyphs, evolveGlyphs };
}

export default useGlyphEvolution;
