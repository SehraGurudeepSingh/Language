import { useEffect, useState } from "react";

/**
 * useOpenType Hook
 * Loads OpenType.js library from CDN
 *
 * Returns: object
 * {
 *   loaded: boolean,
 *   error: string | null
 * }
 */
export function useOpenType() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.opentype) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/opentype.js/1.3.4/opentype.min.js";
    script.async = true;
    script.onload = () => {
      console.log("✓ opentype.js loaded successfully");
      setLoaded(true);
    };
    script.onerror = () => {
      const err = "Failed to load opentype.js";
      console.error("✗ " + err);
      setError(err);
    };
    document.body.appendChild(script);

    return () => {
      // Optional: cleanup if needed
    };
  }, []);

  return { loaded, error };
}

export default useOpenType;
