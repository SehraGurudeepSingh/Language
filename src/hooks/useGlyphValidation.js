import { useEffect, useState } from "react";
import { validateAllGlyphs } from "../utils";

/**
 * useGlyphValidation Hook
 * Validates all glyphs on component mount
 *
 * Returns: object with validation results
 * {
 *   isValid: boolean,
 *   errorCount: number,
 *   duplicates: array,
 *   errors: array
 * }
 */
export function useGlyphValidation() {
  const [validation, setValidation] = useState({
    isValid: false,
    errorCount: 0,
    duplicates: [],
    errors: [],
  });

  useEffect(() => {
    const result = validateAllGlyphs();
    setValidation(result);
  }, []);

  return validation;
}

export default useGlyphValidation;
