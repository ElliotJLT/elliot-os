"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The principles stack. Scrolling through the section lights each one in turn
 * and swaps the statement beside it, with a drawn line connecting the two.
 *
 * Driven by the section's own scroll progress rather than by a timer, so the
 * reader controls the pace: stop scrolling and it stops. Falls back to the
 * first item lit and all copy present without JS.
 */
export default function Values({
  items,
}: {
  items: { name: string; said: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        // How far the section has travelled through the viewport, 0 to 1.
        const span = r.height + window.innerHeight;
        const p = Math.min(Math.max((window.innerHeight - r.top) / span, 0), 1);
        // Bias to the middle so the first and last do not flash past.
        const prog = Math.min(Math.max((p - 0.08) / 0.84, 0), 1);
        setP(prog);
        setI(Math.min(items.length - 1, Math.floor(prog * items.length * 0.999)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  return (
    <div className="vals" ref={ref}>
      <ul className="vals-list">
        {items.map((v, n) => (
          <li key={v.name} data-on={n === i || undefined}>
            {v.name}
          </li>
        ))}
      </ul>

      {/* The site's own mark, drawn in proportion to how far the section has
          been scrolled. One continuous line rather than four presets snapping
          between each other: it advances as you read and stops when you do.
          pathLength normalises the dash so the draw is even along the curve. */}
      <svg
        className="vals-loop"
        viewBox="0 0 200 150"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M14 75 C14 34 52 16 90 34 C126 51 118 104 82 118 C46 132 20 108 30 78 C42 42 96 20 136 32 C176 44 192 92 168 116"
          pathLength={100}
          style={{ strokeDashoffset: 100 - p * 100 }}
        />
      </svg>

      <div className="vals-said">
        {items.map((v, n) => (
          <p key={v.name} data-on={n === i || undefined}>
            {v.said}
          </p>
        ))}
      </div>
    </div>
  );
}
