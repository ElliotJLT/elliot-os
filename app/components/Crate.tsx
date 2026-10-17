"use client";

import { useRef, useState } from "react";
import type { Record } from "@/lib/listening";

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/**
 * A crate of the records played front to back. Covers stand in a row; the
 * picked one rises with its disc half out of the sleeve, and the card under
 * the crate reads it back. Arrow keys move along the crate.
 */
export default function Crate({
  records,
  basePath,
}: {
  records: Record[];
  basePath: string;
}) {
  const [i, setI] = useState(0);
  const row = useRef<HTMLDivElement>(null);
  const r = records[i];

  const go = (n: number) => {
    const next = (n + records.length) % records.length;
    setI(next);
    row.current
      ?.querySelectorAll<HTMLButtonElement>(".ls-rec")
      [next]?.focus({ preventScroll: false });
  };

  return (
    <div className="ls-crate rv-settle">
      <div
        className="ls-row"
        ref={row}
        role="tablist"
        aria-label="Records played front to back"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") (e.preventDefault(), go(i + 1));
          if (e.key === "ArrowLeft") (e.preventDefault(), go(i - 1));
        }}
      >
        {records.map((rec, n) => (
          <button
            key={rec.slug}
            role="tab"
            aria-selected={n === i}
            aria-controls="ls-card"
            tabIndex={n === i ? 0 : -1}
            className={"ls-rec" + (n === i ? " is-on" : "")}
            onClick={() => setI(n)}
            style={{ zIndex: n === i ? records.length + 1 : records.length - Math.abs(n - i) }}
          >
            <span className="ls-disc" aria-hidden="true" />
            {rec.cover ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={`${basePath}/${rec.cover}`} alt="" loading="lazy" />
            ) : (
              <span className="ls-nocover">{rec.title}</span>
            )}
            <span className="ls-sr">
              {rec.title} by {rec.artist}
            </span>
          </button>
        ))}
      </div>

      <div className="ls-card" id="ls-card" role="tabpanel" aria-live="polite">
        <div className="ls-card-cover">
          {r.cover && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={`${basePath}/${r.cover}`} alt={`${r.title} cover`} />
          )}
        </div>
        <div className="ls-card-body">
          <span className="ls-card-kick">
            {String(i + 1).padStart(2, "0")} of {records.length}
          </span>
          <h3 className="ls-card-title">{r.title}</h3>
          <p className="ls-card-artist">{r.artist}</p>
          <dl className="ls-facts">
            <div>
              <dt>Front to back</dt>
              <dd>{r.throughs} times</dd>
            </div>
            <div>
              <dt>First played</dt>
              <dd>{fmt(r.first)}</dd>
            </div>
            <div>
              <dt>Hours with it</dt>
              <dd>{r.hours}</dd>
            </div>
            <div>
              <dt>Wore out</dt>
              <dd>
                {r.track}, {r.trackPlays} plays
              </dd>
            </div>
          </dl>
          <div className="ls-card-nav">
            <button type="button" onClick={() => go(i - 1)}>
              <span aria-hidden="true">←</span> {records[(i - 1 + records.length) % records.length].artist}
            </button>
            <a href={`https://open.spotify.com/track/${r.trackId}`}>
              Play {r.track} <span aria-hidden="true">↗</span>
            </a>
            <button type="button" onClick={() => go(i + 1)}>
              {records[(i + 1) % records.length].artist} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
