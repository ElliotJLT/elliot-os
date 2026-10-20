"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * A painting that paints itself in as you scroll.
 *
 * The image sits under an SVG mask made of brush strokes. Each stroke draws
 * along its own length (stroke-dashoffset), a few at a time, so the picture
 * is blocked in the way a painter would: row by row, top to bottom. A
 * filter makes each stroke dry-brush: streaky noise along the stroke cuts
 * bristle gaps into it, and a little displacement roughs the edges and
 * ends. The last few percent fade a full rect in, so the finished state is
 * the whole image.
 *
 * Progress follows the scroll both ways: scroll back up and it unpaints.
 * The first painting on the page (`immediate`) lays a first wash on load,
 * then follows the scroll. With reduced motion, or if the script never
 * runs, the image is simply shown.
 */

type Props = {
  src: string;
  alt: string;
  /** Intrinsic size of the image, for the viewBox. */
  w: number;
  h: number;
  /** Seeds the stroke layout so each painting is blocked in differently. */
  seed: number;
  immediate?: boolean;
};

const ROWS = 14;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * The strokes a painter would block the picture in with: rows worked top to
 * bottom, each row two to four overlapping strokes of 35-65% of the width,
 * nearly level with a slight tilt and sag, alternating direction. Narrow
 * enough to read as single loaded-brush passes, not blobs.
 */
function strokes(w: number, h: number, seed: number) {
  const r = rng(seed);
  const out: { d: string; width: number; start: number }[] = [];
  const rowH = h / ROWS;
  let n = 0;
  for (let row = 0; row < ROWS; row++) {
    const per = 2 + Math.floor(r() * 3);
    for (let k = 0; k < per; k++) {
      const len = w * (0.35 + r() * 0.3);
      const ltr = (row + k) % 2 === 0;
      const xa = -w * 0.08 + r() * (w * 1.16 - len);
      const x0 = ltr ? xa : xa + len;
      const x1 = ltr ? xa + len : xa;
      const y = (row + 0.5) * rowH + (r() - 0.5) * rowH * 0.9;
      const tilt = (r() - 0.5) * rowH * 3.2;
      const sag = (r() - 0.5) * rowH * 1.2;
      const y0 = y - tilt / 2;
      const y1 = y + tilt / 2;
      out.push({
        d: `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${((x0 + x1) / 2).toFixed(1)} ${(y + sag).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`,
        width: rowH * (1.1 + r() * 0.7),
        start: 0,
      });
      n++;
    }
  }
  // Spread the starts over the first 85% of progress, in order, with a
  // little shuffle so neighbouring strokes overlap in time.
  out.forEach((s, i) => {
    s.start = Math.max(0, Math.min(0.85, (i / n) * 0.85 + (r() - 0.5) * 0.04));
  });
  return out;
}

const DUR = 0.12;

export default function PaintReveal({ src, alt, w, h, seed, immediate }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layout = useMemo(() => strokes(w, h, seed), [w, h, seed]);
  const id = `paint-${seed}`;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-stroke]"));
    const fill = svg.querySelector<SVGRectElement>("[data-fill]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let shown = 0;
    let target = 0;
    let frame = 0;
    let last = 0;

    const paint = (p: number) => {
      paths.forEach((el, i) => {
        const local = Math.min(1, Math.max(0, (p - layout[i].start) / DUR));
        el.style.strokeDashoffset = String(1 - local);
      });
      if (fill) fill.style.opacity = String(Math.min(1, Math.max(0, (p - 0.86) / 0.14)));
    };

    if (reduce) {
      paint(1);
      svg.dataset.ready = "";
      return;
    }

    const measure = () => {
      const r = svg.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (immediate) {
        // Already on screen at load: a first wash paints in straight away,
        // and the rest follows the scroll.
        p = 0.5 + window.scrollY / (vh * 0.8);
      } else {
        // Starts as the painting's top comes up past the bottom of the
        // screen, and finishes only when its bottom edge has climbed to just
        // under halfway: about a screen of scrolling, one stroke at a time.
        p = (vh * 0.94 - r.top) / (vh * 0.49 + r.height);
      }
      target = Math.min(1, Math.max(0, p));
    };

    // Follow the scroll closely, with a short ease so strokes glide rather
    // than jump between scroll events.
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      shown += (target - shown) * Math.min(1, dt * 7);
      if (Math.abs(target - shown) < 0.001) shown = target;
      paint(shown);
      if (shown !== target) frame = requestAnimationFrame(tick);
      else last = 0;
    };

    const onScroll = () => {
      measure();
      if (!frame && shown !== target) frame = requestAnimationFrame(tick);
    };

    paint(0);
    svg.dataset.ready = "";
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [layout, immediate]);

  return (
    <svg
      ref={svgRef}
      className="paint-reveal"
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={alt}
    >
      <defs>
        <filter id={`${id}-rough`} x="-5%" y="-5%" width="110%" height="110%">
          {/* Streaks running along the (near level) strokes: the bristles. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.16" numOctaves={1} seed={seed} result="streak" />
          <feColorMatrix
            in="streak"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 14 -4.5"
            result="bristles"
          />
          <feComposite in="SourceGraphic" in2="bristles" operator="in" result="dry" />
          {/* Rough edges and ragged ends. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves={2} seed={seed + 7} result="edge" />
          <feDisplacementMap in="dry" in2="edge" scale={w * 0.009} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <g filter={`url(#${id}-rough)`}>
            {layout.map((s, i) => (
              <path
                key={i}
                data-stroke=""
                d={s.d}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={s.width}
                strokeLinecap="round"
                strokeDasharray="1 1"
              />
            ))}
          </g>
          <rect data-fill="" width={w} height={h} fill="#fff" />
        </mask>
      </defs>
      <image href={src} width={w} height={h} mask={`url(#${id}-mask)`} />
    </svg>
  );
}
