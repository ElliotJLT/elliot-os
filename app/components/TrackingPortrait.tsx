"use client";

import { useEffect, useRef } from "react";

const basePath = process.env.BASE_PATH || "";

// One sprite, ten frames left to right: the 3x3 gaze grid read row by row
// (up-left through down-right), then the wink. Frame 4 looks at the reader.
const FRAMES = 10;
const CENTRE = 4;
const WINK = 9;
const WINK_MS = 220;

// Screen angles in 45° steps from pointing right, clockwise (y runs down).
const SECTOR_TO_FRAME = [5, 8, 7, 6, 3, 0, 1, 2];

/** The hero portrait: follows the pointer with its eyes, winks on a click. */
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
    let winkTimer = 0;
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
      if (!winkTimer) show(gaze);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(updateGaze);
    };

    const onPointerDown = () => {
      window.clearTimeout(winkTimer);
      show(WINK);
      winkTimer = window.setTimeout(() => {
        winkTimer = 0;
        show(gaze);
      }, WINK_MS);
    };

    if (canTrack) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerdown", onPointerDown, { passive: true });
    } else {
      // Touch has no hover to follow, so a tap on the face is the whole game.
      face.addEventListener("pointerdown", onPointerDown, { passive: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(winkTimer);
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
