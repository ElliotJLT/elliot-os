"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * A painting that paints itself in as you scroll.
 *
 * The image sits under an SVG mask made of broad brush strokes. Each stroke
 * draws along its own length (stroke-dashoffset), a few at a time, so the
 * picture is blocked in the way a painter would: sweep after sweep, roughly
 * top to bottom, alternating direction. A turbulence filter tears the
 * strokes' edges so they read as paint rather than lines. The last few
 * percent fade a full rect in, so the finished state is the whole image.
 *
 * Progress follows scroll and never goes backwards. The first painting on
 * the page (`immediate`) lays a first wash on load, then follows the scroll. With reduced motion, or before the
 * script runs on a phone that blocks it, the image is simply shown.
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

const STROKES = 16;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function strokes(w: number, h: number, seed: number) {
  const r = rng(seed);
  const out: { d: string; width: number; start: number }[] = [];
  for (let i = 0; i < STROKES; i++) {
    // Rows from top to bottom with some jitter; alternate direction.
    const y = ((i + 0.5) / STROKES) * h + (r() - 0.5) * h * 0.08;
    const ltr = i % 2 === 0;
    const x0 = ltr ? -w * 0.05 : w * 1.05;
    const x1 = ltr ? w * 1.05 : -w * 0.05;
    const tilt = (r() - 0.5) * h * 0.22;
    const c1x = x0 + (x1 - x0) * 0.33;
    const c2x = x0 + (x1 - x0) * 0.66;
    const c1y = y - tilt + (r() - 0.5) * h * 0.12;
    const c2y = y + tilt + (r() - 0.5) * h * 0.12;
    out.push({
      d: `M${x0.toFixed(1)} ${(y - tilt / 2).toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x1.toFixed(1)} ${(y + tilt / 2).toFixed(1)}`,
      width: h * (0.13 + r() * 0.07),
      // Staggered starts, slightly shuffled so rows overlap in time.
      start: Math.max(0, Math.min(0.78, (i / STROKES) * 0.78 + (r() - 0.5) * 0.06)),
    });
  }
  return out;
}

const DUR = 0.22;

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
      target = Math.max(target, Math.min(1, Math.max(0, p)));
    };

    // Follow the scroll closely, with a short ease so strokes glide rather
    // than jump between scroll events.
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      shown += (target - shown) * Math.min(1, dt * 7);
      if (target - shown < 0.001) shown = target;
      paint(shown);
      if (shown < target) frame = requestAnimationFrame(tick);
      else last = 0;
    };

    const onScroll = () => {
      measure();
      if (!frame && shown < target) frame = requestAnimationFrame(tick);
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
        <filter id={`${id}-rough`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves={3} seed={seed} />
          <feDisplacementMap in="SourceGraphic" scale={w * 0.05} />
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
