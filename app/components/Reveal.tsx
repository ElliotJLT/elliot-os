"use client";

import { useEffect, useRef, useState } from "react";

/** Fades + lifts children into view once, when scrolled near. Falls back to
 *  visible immediately if IntersectionObserver is unavailable or motion is
 *  reduced (the CSS media query handles the reduced-motion visual). */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    io.observe(el);
    // Failsafe: never leave content hidden if the observer never fires.
    const t = setTimeout(() => setShown(true), 1600);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={"reveal" + (shown ? " in" : "")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
