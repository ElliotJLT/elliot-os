"use client";

import { useEffect } from "react";

/**
 * Keeps each check in one piece beside a floated painting.
 *
 * The words wrap the painted outline, which is the point, but a check that
 * starts beside the painting and runs past its bottom edge used to finish
 * back at the left margin, mid-sentence. Any item that straddles the bottom
 * of its section's painting is marked so it lays out as its own column
 * (display: flow-root) instead. Items fully beside or fully below are left
 * alone. Re-run on resize, since the straddler changes with width.
 */
export default function WrapTidy() {
  useEffect(() => {
    const tidy = () => {
      document.querySelectorAll<HTMLElement>(".ev-wrap").forEach((wrap) => {
        const fig = wrap.querySelector<HTMLElement>(".ev-paint");
        const items = Array.from(wrap.querySelectorAll<HTMLElement>(".ev-flow > li"));
        items.forEach((li) => li.classList.remove("ev-straddle"));
        if (!fig || getComputedStyle(fig).float === "none") return;
        // One at a time, top to bottom: fixing one item moves the next.
        for (const li of items) {
          const bottom = fig.getBoundingClientRect().bottom;
          const r = li.getBoundingClientRect();
          if (r.top < bottom - 4 && r.bottom > bottom + 4) {
            li.classList.add("ev-straddle");
          }
        }
      });
    };
    tidy();
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(tidy, 120);
    };
    window.addEventListener("resize", onResize);
    // Fonts landing late change line breaks.
    document.fonts?.ready.then(tidy);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);
  return null;
}
