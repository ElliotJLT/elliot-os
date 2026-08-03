"use client";

import { useRef, useState } from "react";

/**
 * A dark pill that follows the cursor while it's over the wrapped element,
 * after MAI's own nav — hovering a link there floats a small label near the
 * pointer rather than only recolouring the text. Position is tracked
 * relative to the wrapper, not the viewport, so it stays correct inside
 * scrolling grids and doesn't need a resize listener.
 */
export default function HoverLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      ref={ref}
      className="hoverlabel-wrap"
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos && (
        <span
          className="hoverlabel"
          style={{ left: pos.x, top: pos.y }}
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </div>
  );
}
