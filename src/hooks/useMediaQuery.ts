"use client";

import { useEffect, useState } from "react";

// Uses matchMedia change events rather than a resize listener — only fires
// when the query result changes, not on every pixel of window drag.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    // Default to false during SSR — component will correct on first client render
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
