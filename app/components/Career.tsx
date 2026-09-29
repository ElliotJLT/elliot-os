"use client";

import { useEffect, useRef, useState } from "react";
import type { Role } from "@/lib/roles";
import Reveal from "./Reveal";

const basePath = process.env.BASE_PATH || "";

// Longer roles show their first four bullets; the rest open on request.
const SHOWN = 4;

/** The year a role started, from "Feb 2022 – Aug 2026". */
const startYear = (dates?: string) => dates?.match(/\d{4}/)?.[0];

// The rail's x inside the list, and how far the line stands off a logo as it
// goes round it.
const X = 22;
// 33: wide enough that the face riding the tip clears the logo it circles.
const LOGO_R = 33;
// Half the gap between roles, where each year stop sits over the line.
const GAP = 16;

/**
 * The rail as one path: straight down the list, bending round the right of
 * each logo in a half circle, so the line and the dot riding its tip trace
 * the logo's outline. Year stops sit over the line, which runs behind them;
 * the path ends at the last one.
 */
function railPath(list: HTMLElement) {
  let d = `M${X} 0`;
  let y = 0;
  list.querySelectorAll<HTMLElement>(".cr-item").forEach((it) => {
    if (it.querySelector(".cr-logo")) {
      const c = it.offsetTop + 40;
      d += ` L${X} ${c - LOGO_R} A${LOGO_R} ${LOGO_R} 0 0 1 ${X} ${c + LOGO_R}`;
      y = c + LOGO_R;
    }
    if (it.querySelector(".cr-year")) y = it.offsetTop + it.offsetHeight + GAP;
  });
  d += ` L${X} ${y}`;
  return { d, end: y };
}

/**
 * Career as a timeline of panels, Zero Gravity first and Flash Pack last.
 * The rail draws down as the section is read, bending round each logo and
 * year stop, with a dot on its tip. Each logo lights as the line
 * reaches it and its card slides in from the rail side, once. The words
 * lead; a team photo runs full width under them. Each bullet
 * lights the same way, as the line draws level with it. A reference sits
 * under its role as a quote panel. Reduced motion shows the rail drawn and
 * everything in place.
 */
export default function Career({ roles, id = "career" }: { roles: Role[]; id?: string }) {
  const listRef = useRef<HTMLOListElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const drawnRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<HTMLImageElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const list = listRef.current;
    const svg = svgRef.current;
    const track = trackRef.current;
    const drawn = drawnRef.current;
    const dot = tipRef.current;
    if (!list || !svg || !track || !drawn || !dot) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Length along the path against depth, sampled once per layout, so the
    // tip's depth on screen maps to how much of the path to draw.
    let total = 0;
    let end = 0;
    let samples: { len: number; y: number }[] = [];
    const layout = () => {
      const path = railPath(list);
      end = path.end;
      track.setAttribute("d", path.d);
      drawn.setAttribute("d", path.d);
      svg.setAttribute("height", String(Math.ceil(end + 4)));
      total = track.getTotalLength();
      samples = [];
      for (let len = 0; len <= total; len += 3) samples.push({ len, y: track.getPointAtLength(len).y });
      samples.push({ len: total, y: end });
    };
    const lengthAt = (y: number) => {
      let lo = 0;
      let hi = samples.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid + 1;
        else hi = mid;
      }
      return samples[lo]?.len ?? 0;
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const items = [...list.querySelectorAll<HTMLElement>(".cr-item")];
      const points = [...list.querySelectorAll<HTMLElement>(".cr-points li")];
      const r = list.getBoundingClientRect();
      // The tip sits two thirds down the screen: where the eye is.
      const tip = still ? end : Math.min(end, Math.max(0, window.innerHeight * 0.66 - r.top));
      const len = still ? total : lengthAt(tip);
      drawn.style.strokeDasharray = `${len} ${total}`;
      const at = track.getPointAtLength(len);
      // A slow sway as he falls, driven by how far down the line he is.
      const sway = Math.sin(len / 90) * 14;
      dot.style.transform = `translate(${at.x}px, ${at.y}px) translate(-50%, -50%) rotate(${sway.toFixed(1)}deg)`;
      list.toggleAttribute("data-drawing", !still && len > 0 && len < total);
      // Logos light as the line starts round them; a year types itself in
      // as the tip reaches it; bullets light as the tip draws level. Each
      // stays lit.
      items.forEach((it) => {
        if (it.offsetTop + 18 <= tip) it.setAttribute("data-reached", "");
        if (it.offsetTop + it.offsetHeight + GAP <= tip) it.setAttribute("data-passed", "");
      });
      points.forEach((pt) => {
        if (pt.getBoundingClientRect().top - r.top + 10 <= tip) pt.setAttribute("data-reached", "");
      });
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Heights move as images load and roles open, so the path is redrawn
    // whenever the list changes size.
    const resized = new ResizeObserver(() => {
      layout();
      queue();
    });
    resized.observe(list);
    layout();
    update();
    window.addEventListener("scroll", queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      resized.disconnect();
      window.removeEventListener("scroll", queue);
    };
  }, []);

  return (
    <div className="cr">
      <ol className="cr-line" ref={listRef}>
        <li className="cr-rail" aria-hidden="true">
          <svg ref={svgRef} width="80">
            <path className="cr-rail-track" ref={trackRef} />
            <path className="cr-rail-drawn" ref={drawnRef} />
          </svg>
          {/* The tip is Elliot, cut out in black and white with a rust
              outline, falling down his own career. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cr-tip"
            ref={tipRef}
            src={`${basePath}/career/falling.png`}
            alt=""
            width={56}
            height={44}
          />
        </li>
        {roles.map((r) => (
          <li key={r.org} className="cr-item">
            {startYear(r.dates) && (
              <span className="cr-year" aria-hidden="true">
                {startYear(r.dates)}
              </span>
            )}
            {r.logo && (
              // The card's heading names the company.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="cr-logo"
                src={`${basePath}/${r.logo}`}
                alt=""
                width={44}
                height={44}
              />
            )}
            <Reveal>
              <article className="cr-card cr-slide">
                <div className="cr-body">
                  <h3>{r.url ? <a href={r.url}>{r.org}</a> : r.org}</h3>
                  {(r.role || r.dates) && (
                    <span className="career-meta">
                      {[r.role, r.dates].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  <ul className="cr-points" id={`${id}-${r.org}`}>
                    {r.bullets.map((b, i) =>
                      i < SHOWN || expanded[r.org] ? (
                        // Bullets opened by the reader are lit straight away.
                        <li key={b.t} className={i >= SHOWN ? "cr-extra" : undefined}>
                          {b.k && <span className="cr-skill">{b.k}</span>}
                          <span className="cr-proof">{b.t}</span>
                        </li>
                      ) : null,
                    )}
                  </ul>
                  {r.bullets.length > SHOWN && (
                    <button
                      type="button"
                      className="cr-more"
                      aria-expanded={!!expanded[r.org]}
                      aria-controls={`${id}-${r.org}`}
                      onClick={() => setExpanded((e) => ({ ...e, [r.org]: !e[r.org] }))}
                    >
                      {expanded[r.org]
                        ? "Show less ↑"
                        : `${r.bullets.length - SHOWN} more from ${r.org} ↓`}
                    </button>
                  )}
                </div>
                {r.photo && (
                  <figure className="cr-photo rv-develop">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${basePath}/${r.photo}`}
                      alt={r.photoAlt || ""}
                      loading="lazy"
                      style={r.photoPosition ? { objectPosition: r.photoPosition } : undefined}
                    />
                  </figure>
                )}
                {r.quote && (
                  <figure className="cr-quote">
                    <span className="cr-quote-mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    <blockquote>
                      {r.quote.paras.map((q) => (
                        <p key={q}>{q}</p>
                      ))}
                    </blockquote>
                    <figcaption>
                      <strong>{r.quote.name}</strong> · {r.quote.role}
                    </figcaption>
                  </figure>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
