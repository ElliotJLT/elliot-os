"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { circle, loopTo, tick, underline, type Box } from "./inkMarks";

// One pen mark per principle, in order: a loop from the word to what it
// means, an underline, a tick, a circle.
const MARKS = ["loop", "underline", "tick", "circle"] as const;

/**
 * The principles stack, pinned while you read it.
 *
 * The section is a tall scroll track with the actual content sticky inside
 * it: scrolling through that track lights each item in turn and swaps the
 * statement beside it, and the page only resumes scrolling once the last
 * one has had its moment. The previous version measured progress across the
 * section's full entry-and-exit transit, which meant the last item only lit
 * up once the section — and its statement — had mostly scrolled off the top
 * of the screen. Pinning removes that failure mode entirely: the statement
 * can't scroll out of view while its item is what's driving the scroll.
 *
 * Only the active statement is mounted. Screen readers, copied text and
 * agents should not get four overlapping paragraphs as one block.
 */
export default function Values({
  items,
}: {
  items: { name: string; said: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const valsRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [mark, setMark] = useState<{ d: string; w: number; h: number } | null>(null);

  // Measure the lit word and the statement, relative to the block they share,
  // and build that principle's mark to fit them. Rebuilt on resize, so the
  // mark always sits on the word as it's actually set.
  useLayoutEffect(() => {
    const vals = valsRef.current;
    if (!vals) return;
    const build = () => {
      const word = vals.querySelectorAll<HTMLElement>(".vals-word")[i];
      const said = vals.querySelector<HTMLElement>(".vals-said");
      if (!word || !said) return;
      const o = vals.getBoundingClientRect();
      const r = word.getBoundingClientRect();
      const box: Box = { left: r.left - o.left, top: r.top - o.top, right: r.right - o.left, bottom: r.bottom - o.top };
      const s = said.getBoundingClientRect();
      const lead = parseFloat(getComputedStyle(said.querySelector("p") ?? said).fontSize) || 22;
      // The loop needs the statement beside the word; stacked on a phone it
      // becomes an underline instead.
      const beside = s.left - o.left > box.right + 60;
      const kind = MARKS[i % MARKS.length];
      const d =
        kind === "loop"
          ? beside
            ? loopTo(box, [s.left - o.left, s.top - o.top + lead * 0.72])
            : underline(box)
          : kind === "underline"
            ? underline(box)
            : kind === "tick"
              ? tick(box)
              : circle(box);
      setMark({ d, w: o.width, h: o.height });
    };
    build();
    const resized = new ResizeObserver(build);
    resized.observe(vals);
    return () => resized.disconnect();
  }, [i]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        // Progress through the pinned track: 0 as it reaches the top of the
        // viewport, 1 once it has scrolled by its own scrollable distance
        // (its height minus one viewport, since the last viewport-height of
        // it is what stays pinned on screen at the end).
        const scrollable = r.height - window.innerHeight;
        const prog =
          scrollable > 0
            ? Math.min(Math.max(-r.top / scrollable, 0), 1)
            : 0;
        setI(Math.min(items.length - 1, Math.floor(prog * items.length * 0.999)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items.length]);

  return (
    <div
      className="vals-wrap"
      id="principles"
      ref={ref}
      style={{ "--vals-n": items.length } as React.CSSProperties}
    >
      <div className="vals-pin">
        <div className="vals" ref={valsRef}>
          <ul className="vals-list">
            {items.map((v, n) => (
              <li key={v.name} data-on={n === i || undefined}>
                <span className="vals-word">{v.name}</span>
              </li>
            ))}
          </ul>
          {mark && (
            <svg
              className="vals-ink"
              width={mark.w}
              height={mark.h}
              viewBox={`0 0 ${mark.w} ${mark.h}`}
              aria-hidden="true"
            >
              {/* Keyed on the principle, so each one draws in fresh. */}
              <path key={i} data-k={i % 4} d={mark.d} pathLength={1} />
            </svg>
          )}

          <div className="vals-said" aria-live="polite">
            <p key={items[i].name} data-on>
              {items[i].said}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
