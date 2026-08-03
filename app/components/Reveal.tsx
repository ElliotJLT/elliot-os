"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Marks a block as revealed once it scrolls into view, and lets the elements
 * inside choose how they arrive.
 *
 * One observer per section rather than one per element: the container carries
 * `is-revealed`, and descendants opt into a variant (`rv-settle`, `rv-rule`,
 * `rv-develop`, `rv-word`) with an optional `--rv-delay` for stagger. Nothing
 * animates without JS, and the reduced-motion query in CSS pins everything to
 * its finished state.
 */
export default function Reveal({
  children,
  delay = 0,
  immediate = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  /** For blocks above the fold: play on mount instead of waiting to be
   *  scrolled to, which they never are. */
  immediate?: boolean;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (immediate) {
      const r = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(r);
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Failsafe: never leave content hidden if the observer never fires.
    const t = setTimeout(() => setShown(true), 1600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      className={"rv" + (shown ? " is-revealed" : "")}
      style={
        delay
          ? ({ "--rv-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

/**
 * Splits a line into words so they can arrive one after another. Index is
 * handed to CSS as `--i`, which multiplies a per-word delay, so the stagger
 * is described once in the stylesheet rather than computed per element here.
 */
export function Words({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="rv-word"
          style={{ "--i": i } as React.CSSProperties}
        >
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
