"use client";

import { useEffect, useRef, useState } from "react";

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
  const [i, setI] = useState(0);

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
        <div className="vals">
          <ul className="vals-list">
            {items.map((v, n) => (
              <li key={v.name} data-on={n === i || undefined}>
                {v.name}
              </li>
            ))}
          </ul>

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
