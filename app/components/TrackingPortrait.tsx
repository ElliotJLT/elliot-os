"use client";

import { useEffect, useRef } from "react";

const basePath = process.env.BASE_PATH || "";

// One sprite, eleven frames left to right: the 3x3 gaze grid read row by
// row (up-left through down-right), then the click reactions: a flinch and
// a "what was that for?". Frame 4 looks at the reader.
const FRAMES = 11;
const CENTRE = 4;
const REACTIONS = [9, 10];
const REACT_MS = 650;

// Screen angles in 45° steps from pointing right, clockwise (y runs down).
const SECTOR_TO_FRAME = [5, 8, 7, 6, 3, 0, 1, 2];

/** The hero portrait: follows the pointer with its eyes, reacts to a click. */
export default function TrackingPortrait({ className }: { className: string }) {
  const faceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const canTrack = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    let gaze = CENTRE;
    let shown = CENTRE;
    let reaction = -1;
    let reactTimer = 0;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const show = (index: number) => {
      if (index === shown) return;
      shown = index;
      face.style.backgroundPositionX = `${(index * 100) / (FRAMES - 1)}%`;
    };

    const updateGaze = () => {
      frame = 0;
      if (!pointer) return;
      const rect = face.getBoundingClientRect();
      const dx = pointer.x - (rect.left + rect.width / 2);
      const dy = pointer.y - (rect.top + rect.height / 2);
      // Inside the face itself he looks back at you rather than at his nose.
      if (Math.hypot(dx, dy) < rect.width * 0.55) {
        gaze = CENTRE;
      } else {
        const sector = Math.round(Math.atan2(dy, dx) / (Math.PI / 4));
        gaze = SECTOR_TO_FRAME[(sector + 8) % 8];
      }
      if (!reactTimer) show(gaze);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(updateGaze);
    };

    // Never the same reaction twice running; with two, clicks alternate.
    const onPointerDown = () => {
      window.clearTimeout(reactTimer);
      let next = reaction;
      while (next === reaction) {
        next = Math.floor(Math.random() * REACTIONS.length);
      }
      reaction = next;
      show(REACTIONS[reaction]);
      reactTimer = window.setTimeout(() => {
        reactTimer = 0;
        show(gaze);
      }, REACT_MS);
    };

    if (canTrack) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
    } else {
      // Touch has no hover to follow, so tapping the face is the whole game.
      face.addEventListener("pointerdown", onPointerDown, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reactTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      face.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <span
      ref={faceRef}
      className={className}
      role="img"
      aria-label="Elliot Little"
      style={{ backgroundImage: `url(${basePath}/portrait-sprite.png)` }}
    />
  );
}
