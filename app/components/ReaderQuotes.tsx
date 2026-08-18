"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Reader } from "@/lib/quotes";

const AUTOPLAY_DELAY = 6000;

export default function ReaderQuotes({
  readers,
  basePath = "",
}: {
  readers: Reader[];
  basePath?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const scrollTimerRef = useRef<number | null>(null);

  const scrollToSlide = useCallback((index: number, behavior: ScrollBehavior) => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return;

    viewport.scrollTo({ left: slide.offsetLeft, behavior });
  }, []);

  const select = useCallback(
    (index: number) => {
      if (!readers.length) return;
      const next = (index + readers.length) % readers.length;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      setActive(next);
      scrollToSlide(next, reduceMotion ? "auto" : "smooth");
    },
    [readers.length, scrollToSlide],
  );

  useEffect(() => {
    if (paused || readers.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => select(active + 1), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [active, paused, readers.length, select]);

  useEffect(
    () => () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    },
    [],
  );

  function handleScroll() {
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
    }

    scrollTimerRef.current = window.setTimeout(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const nextDistance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
        if (nextDistance < distance) {
          nearest = index;
          distance = nextDistance;
        }
      });
      setActive(nearest);
    }, 90);
  }

  if (!readers.length) return null;

  return (
    <section
      className="reader-carousel"
      aria-label="What readers have said"
      aria-roledescription="carousel"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div
        className="reader-slide-window"
        ref={viewportRef}
        onScroll={handleScroll}
      >
        <div className="reader-slide-track">
          {readers.map((reader, index) => (
            <figure
              className="reader-slide"
              data-active={active === index}
              key={reader.who}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              role="group"
              aria-label={`${index + 1} of ${readers.length}`}
              aria-roledescription="slide"
            >
              <div
                className="reader-slide-logo"
                data-tone={reader.logoTone || "light"}
              >
                {/* The attribution beside the image names the source. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/${reader.logo}`}
                  alt=""
                  draggable="false"
                />
              </div>
              <div className="reader-slide-copy">
                <blockquote>“{reader.quote}”</blockquote>
                <figcaption>{reader.who}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

      <div className="reader-carousel-controls">
        <button
          className="reader-carousel-arrow"
          type="button"
          aria-label="Previous quote"
          onClick={() => select(active - 1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="reader-carousel-tabs" aria-label="Choose a quote">
          {readers.map((reader, index) => (
            <button
              className="reader-carousel-tab"
              data-active={active === index}
              key={reader.who}
              type="button"
              aria-label={`Show quote from ${reader.who}`}
              aria-pressed={active === index}
              onClick={() => select(index)}
            />
          ))}
        </div>
        <button
          className="reader-carousel-arrow"
          type="button"
          aria-label="Next quote"
          onClick={() => select(active + 1)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
