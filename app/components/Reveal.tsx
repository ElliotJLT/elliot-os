"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Routes whose reveals have already played this session. Coming back to a
 * page you have read should not re-hide everything below the fold and make
 * you scroll through the animation a second time; an entrance is for an
 * entrance. Module scope, so it survives remounts and resets on reload.
 */
const seen = new Set<string>();

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
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    // `immediate` plays this block on mount; it must not mark the page as
    // seen, or every other block on it would skip its entrance (it did).
    if (immediate || seen.has(pathname)) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // The observer's own first callback fires immediately with the current
    // intersection state, so a block already on screen (e.g. a client-side
    // remount) reveals on that first callback without a separate rect read.
    // The observer reports once straight away with the current state. If
    // that first report never arrives, the observer is broken and the
    // failsafe below shows the content; otherwise it waits to be scrolled
    // to. (The failsafe used to fire regardless, which revealed everything
    // below the fold 1.6s after load, before anyone could scroll to it.)
    let reported = false;
    const io = new IntersectionObserver(
      (entries) => {
        reported = true;
        if (entries[0].isIntersecting) {
          setShown(true);
          seen.add(pathname);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Failsafe: never leave content hidden if the observer never fires.
    const t = setTimeout(() => {
      if (!reported) setShown(true);
    }, 1600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [immediate, pathname]);

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

/**
 * A title whose words rise through a clip line, one after another, when
 * its block reveals. The link or heading around it carries the full text as
 * its label, so screen readers hear the title once.
 */
export function RiseWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span aria-hidden="true">
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="rise-clip">
            <span
              className="rise-w"
              style={{ "--i": i } as React.CSSProperties}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
