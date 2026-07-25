"use client";

import { useEffect, useState } from "react";
import type { Reader } from "@/lib/quotes";

/**
 * Rotates reader responses to the writing. All of them render into the markup
 * so the page is complete without JS and to a crawler; the client only changes
 * which one is visible.
 */
export default function Readers({ items }: { items: Reader[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  return (
    <div
      className="readers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="readerstack">
        {items.map((r, n) => (
          <figure key={r.who} className="reader" data-on={n === i || undefined}>
            <blockquote>{r.quote}</blockquote>
            <figcaption>{r.who}</figcaption>
          </figure>
        ))}
      </div>
      <div className="readerdots">
        {items.map((r, n) => (
          <button
            key={r.who}
            type="button"
            aria-label={`Response from ${r.who}`}
            aria-current={n === i || undefined}
            data-on={n === i || undefined}
            onClick={() => setI(n)}
          />
        ))}
      </div>
    </div>
  );
}
