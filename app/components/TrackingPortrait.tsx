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

// Six quick clicks and he goes up in smoke, and the circle stays empty
// paper until the page is reloaded. "Quick" is each click within this
// long of the last.
const VANISH_CLICKS = 6;
const VANISH_GAP_MS = 450;

/** The hero portrait: follows the pointer with its eyes, reacts to a click,
 *  and vanishes in smoke if you keep at it. */
export default function TrackingPortrait({ className }: { className: string }) {
  const faceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let gaze = CENTRE;
    let shown = CENTRE;
    let clicks = 0;
    let lastClick = 0;
    let gone = false;
    const countClick = () => {
      if (gone) return true;
      const now = performance.now();
      clicks = now - lastClick < VANISH_GAP_MS ? clicks + 1 : 1;
      lastClick = now;
      if (clicks < VANISH_CLICKS) return false;
      gone = true;
      vanish(face, shown, reduceMotion);
      return true;
    };

    if (reduceMotion) {
      const onTap = () => countClick();
      face.addEventListener("pointerdown", onTap, { passive: true });
      return () => face.removeEventListener("pointerdown", onTap);
    }
    const canTrack = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

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
      if (countClick()) {
        window.clearTimeout(reactTimer);
        window.removeEventListener("pointermove", onPointerMove);
        return;
      }
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

    // The eyes follow the pointer anywhere; the face only reacts when it is
    // the thing being clicked.
    if (canTrack) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    face.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reactTimer);
      window.removeEventListener("pointermove", onPointerMove);
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

// ---------------------------------------------------------------- vanish
// The portrait is a stippled ink engraving, so the smoke is made of the same
// stipple: the face is read back as its own ink dots, which lift off, sway
// and thin out, while puffs of finer dots billow up from it and fade. The
// circle is left as bare paper, the colour of the engraving's ground.

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  delay: number;
  life: number;
  phase: number;
  puff: boolean;
};

const SMOKE_MS = 2200;
// The engraving itself fades into its dots over this long, so there's no
// jump from the fine drawing to the coarser stipple.
const HANDOVER_MS = 220;

function vanish(face: HTMLElement, frame: number, still: boolean) {
  const src = getComputedStyle(face).backgroundImage.slice(5, -2);
  const img = new Image();
  img.onload = () => {
    const rect = face.getBoundingClientRect();
    // The sprite fills the circle inside its ring, so read and redraw it
    // there, or the first frame would paint over the ring.
    const ring = parseFloat(getComputedStyle(face).borderTopWidth) || 0;
    const size = Math.round(rect.width - ring * 2);
    // Read the frame he was showing at the face's own size.
    const read = document.createElement("canvas");
    read.width = read.height = size;
    const rc = read.getContext("2d", { willReadFrequently: true });
    if (!rc) return;
    const fw = img.width / FRAMES;
    rc.drawImage(img, frame * fw, 0, fw, img.height, 0, 0, size, size);
    const px = rc.getImageData(0, 0, size, size).data;
    const paper = `rgb(${px[0]}, ${px[1]}, ${px[2]})`;

    // The circle empties at once; the canvas takes over the drawing.
    face.style.backgroundImage = "none";
    face.style.backgroundColor = paper;
    face.style.cursor = "default";
    if (still) return;

    const ink = getComputedStyle(face).getPropertyValue("--band-portrait").trim() || "#1d2420";
    const faceInk = "#1d2420";
    const pad = size * 1.4;
    const W = size + pad * 2;
    const H = size + pad * 2.6;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement("canvas");
    cv.width = W * dpr;
    cv.height = H * dpr;
    Object.assign(cv.style, {
      position: "absolute",
      left: `${rect.left + window.scrollX - pad}px`,
      top: `${rect.top + window.scrollY - pad * 1.6}px`,
      width: `${W}px`,
      height: `${H}px`,
      pointerEvents: "none",
      zIndex: "5",
    });
    document.body.appendChild(cv);
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // The face's own ink, sampled on a loose grid so it reads as stipple.
    const dots: Dot[] = [];
    const ox = pad + ring;
    const oy = pad * 1.6 + ring;
    const R = size / 2;
    const step = Math.max(2, Math.round(size / 70));
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const dx = x - R;
        const dy = y - R;
        if (dx * dx + dy * dy > R * R) continue;
        const i = (y * size + x) * 4;
        const lum = (px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11) / 255;
        if (lum > 0.72 || Math.random() > (1 - lum) * 1.6) continue;
        dots.push({
          x: ox + x + (Math.random() - 0.5) * step,
          y: oy + y + (Math.random() - 0.5) * step,
          vx: (Math.random() - 0.5) * 18,
          vy: -(20 + Math.random() * 40),
          r: 0.5 + (1 - lum) * 1.1,
          a: 0.55 + (1 - lum) * 0.45,
          // The top lifts first, so he goes from the head down.
          delay: (y / size) * 520 + Math.random() * 260,
          life: 900 + Math.random() * 900,
          phase: Math.random() * Math.PI * 2,
          puff: false,
        });
      }
    }
    // Puffs: clusters of fine dots that drift up and spread as they go.
    for (let k = 0; k < 26; k++) {
      const t = Math.random() * Math.PI * 2;
      const d = Math.sqrt(Math.random()) * R * 0.9;
      const cx = ox + R + Math.cos(t) * d;
      const cy = oy + R + Math.sin(t) * d;
      const delay = 120 + Math.random() * 700;
      const n = 30 + Math.floor(Math.random() * 30);
      for (let j = 0; j < n; j++) {
        const g = Math.sqrt(-2 * Math.log(Math.random() + 1e-6)) * 5;
        const h = Math.random() * Math.PI * 2;
        dots.push({
          x: cx + Math.cos(h) * g,
          y: cy + Math.sin(h) * g,
          vx: Math.cos(h) * (6 + Math.random() * 14),
          vy: -(35 + Math.random() * 45) + Math.sin(h) * 8,
          r: 0.4 + Math.random() * 0.7,
          a: 0.25 + Math.random() * 0.35,
          delay,
          life: 1100 + Math.random() * 800,
          phase: Math.random() * Math.PI * 2,
          puff: true,
        });
      }
    }

    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, W, H);
      if (t < HANDOVER_MS) {
        ctx.save();
        ctx.globalAlpha = 1 - t / HANDOVER_MS;
        ctx.beginPath();
        ctx.arc(ox + R, oy + R, R, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(read, ox, oy);
        ctx.restore();
      }
      for (const d of dots) {
        const age = t - d.delay;
        // Before it lifts, a face dot sits where it was drawn; a puff waits.
        if (age < 0) {
          if (d.puff) continue;
          ctx.globalAlpha = d.a;
          ctx.fillStyle = faceInk;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }
        const k = age / d.life;
        if (k >= 1) continue;
        const s = age / 1000;
        // Rises faster as it goes, sways on its own phase, and thins out.
        const x = d.x + d.vx * s + Math.sin(d.phase + s * 3) * 6 * k;
        const y = d.y + d.vy * s - 26 * s * s;
        ctx.globalAlpha = d.a * (1 - k) * (1 - k);
        // Ink while it is still on the paper, the band's portrait colour
        // once it is smoke, so it shows on either band.
        ctx.fillStyle = k < 0.15 && !d.puff ? faceInk : ink;
        ctx.beginPath();
        ctx.arc(x, y, d.r * (1 + k * (d.puff ? 2.2 : 0.8)), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (t < SMOKE_MS) requestAnimationFrame(tick);
      else cv.remove();
    };
    requestAnimationFrame(tick);
  };
  img.src = src;
}
