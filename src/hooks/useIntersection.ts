"use client";

import { useEffect, useRef } from "react";

interface UseIntersectionOptions {
  threshold?: number;
  // Once visible, stop observing — sections only need to fade in once
  unobserveOnVisible?: boolean;
}

// Adds .visible to the referenced element when it enters the viewport,
// triggering the .fade-in CSS transition defined in globals.css
export function useIntersection<T extends HTMLElement>(
  options: UseIntersectionOptions = {}
) {
  const { threshold = 0.1, unobserveOnVisible = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (unobserveOnVisible) obs.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, unobserveOnVisible]);

  return ref;
}
