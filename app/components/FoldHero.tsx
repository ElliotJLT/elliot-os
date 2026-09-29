"use client";

import { useEffect, useRef } from "react";

/**
 * A page that opens on a photograph. It starts full-bleed with the title on
 * it; as the page scrolls the photo folds in to the content width with
 * rounded corners, and the page below slides up to meet it. Phones and
 * reduced motion get the folded state from the start.
 */
export default function FoldHero({
  src,
  alt,
  caption,
  kicker,
  title,
  standfirst,
}: {
  src: string;
  alt: string;
  caption: string;
  kicker: string;
  title: string;
  standfirst: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 899px)").matches;
    if (still) {
      el.style.setProperty("--fold", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      const e = p * p * (3 - 2 * p);
      el.style.setProperty("--fold", e.toFixed(4));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);

  return (
    <section className="fold" ref={ref}>
      <div className="fold-pin">
        <figure className="fold-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} />
          <figcaption>{caption}</figcaption>
        </figure>
        <div className="fold-copy">
          <span className="fold-kick">{kicker}</span>
          <h1 className="fold-title">{title}</h1>
          <p className="fold-sub">{standfirst}</p>
        </div>
      </div>
    </section>
  );
}
