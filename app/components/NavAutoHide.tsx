"use client";

import { useEffect } from "react";

/**
 * Slides the masthead away on scroll down and brings it back on any scroll
 * up. It never hides near the top of the page, while a menu is open, or
 * while something in it has keyboard focus.
 */
export default function NavAutoHide() {
  useEffect(() => {
    const root = document.documentElement;
    const nav = document.querySelector<HTMLElement>(".mai-nav");
    if (!nav) return;

    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      const busy =
        nav.matches(":focus-within") ||
        nav.querySelector('[aria-expanded="true"]') !== null;
      if (y < 120 || busy || delta < -4) root.classList.remove("nav-hidden");
      else if (delta > 4) root.classList.add("nav-hidden");
      if (Math.abs(delta) > 4) lastY = y;
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", queue, { passive: true });
    nav.addEventListener("focusin", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      nav.removeEventListener("focusin", queue);
      root.classList.remove("nav-hidden");
    };
  }, []);

  return null;
}
