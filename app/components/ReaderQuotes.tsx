"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Reader } from "@/lib/quotes";
import { underline } from "./inkMarks";

/** The quote with its marked phrase wrapped, so the pen can find it. */
function marked(quote: string, mark?: string) {
  const at = mark ? quote.indexOf(mark) : -1;
  if (!mark || at < 0) return quote;
  return (
    <>
      {quote.slice(0, at)}
      <span className="reader-mark">{mark}</span>
      {quote.slice(at + mark.length)}
    </>
  );
}

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
  // One pen underline per quote, built from where its phrase actually sets,
  // and drawn in when that quote is the one showing.
  const [marks, setMarks] = useState<Array<{ d: string; w: number; h: number } | null>>([]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const build = () =>
      setMarks(
        slideRefs.current.map((slide) => {
          const quote = slide?.querySelector("blockquote");
          const word = quote?.querySelector(".reader-mark");
          if (!quote || !word) return null;
          const o = quote.getBoundingClientRect();
          const r = word.getBoundingClientRect();
          return {
            d: underline({
              left: r.left - o.left,
              top: r.top - o.top,
              right: r.right - o.left,
              bottom: r.bottom - o.top,
            }),
            w: o.width,
            h: o.height,
          };
        }),
      );
    build();
    const resized = new ResizeObserver(build);
    resized.observe(viewport);
    return () => resized.disconnect();
  }, [readers]);

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
      data-paused={paused || undefined}
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
                <blockquote>
                  “{marked(reader.quote, reader.mark)}”
                  {marks[index] && (
                    <svg
                      className="reader-ink"
                      width={marks[index]!.w}
                      height={marks[index]!.h}
                      viewBox={`0 0 ${marks[index]!.w} ${marks[index]!.h}`}
                      aria-hidden="true"
                    >
                      <path d={marks[index]!.d} pathLength={1} />
                    </svg>
                  )}
                </blockquote>
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
              // Autoplay is the active tab's fill (6s in globals.css): when
              // it completes, the next quote comes in. Pausing the fill on
              // hover or focus pauses the carousel with it, and with reduced
              // motion there's no fill, so no autoplay.
              onAnimationEnd={() => {
                if (active === index && readers.length > 1) select(index + 1);
              }}
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
