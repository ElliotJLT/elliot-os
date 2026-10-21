"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Light and dark as a candle. Light mode: the candle is lit. Going dark,
 * the flame shrinks into the wick (150ms), then three thin wisps of smoke
 * draw upward (stroke-dashoffset, 400ms), drift and fade. Going light, the
 * flame pops back with a flicker (1.0 → 1.1 → 0.95 → 1.0). The animation
 * only plays on a click; on load it just shows the current state.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);
  const [anim, setAnim] = useState<"out" | "in" | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "light");
    return () => window.clearTimeout(timer.current);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
    setAnim(next === "dark" ? "out" : "in");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnim(null), 1400);
  }

  const dark = theme === "dark";

  return (
    <button
      className="theme-toggle candle"
      onClick={toggle}
      data-state={theme ?? "light"}
      data-anim={anim ?? undefined}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "light the candle" : "blow it out"}
    >
      {/* The box is the candle body; the flame and smoke spill out above it, so
          the body lines up with the nav text whether it is lit or not. */}
      <svg viewBox="0 14 20 14" aria-hidden="true">
        <g className="candle-smoke">
          <path d="M10 12 C8.4 10 11.6 8.4 10 6 C9 4.4 10.6 3 9.6 1.2" pathLength={1} />
          <path d="M10.3 12 C12.1 10.2 9.5 8 11.7 5.8 C12.7 4.7 11.7 3.4 12.6 2.2" pathLength={1} />
          <path d="M9.7 12 C8 10.4 9.8 8.6 8.1 6.8" pathLength={1} />
        </g>
        <path
          className="candle-flame"
          d="M10 3.2 C12.7 6.4 13.5 8.6 13.5 10 A3.5 3.5 0 0 1 6.5 10 C6.5 8.6 7.3 6.4 10 3.2 Z"
        />
        <line className="candle-wick" x1="10" y1="16" x2="10" y2="12.6" />
        <rect className="candle-body" x="5.5" y="16" width="9" height="11.5" rx="1.6" />
      </svg>
    </button>
  );
}
