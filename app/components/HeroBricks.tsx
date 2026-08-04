"use client";

import { useEffect, useRef } from "react";

type GlowPoint = {
  x: number;
  y: number;
  born: number;
};

const BRICK_WIDTH = 76;
const BRICK_HEIGHT = 36;
const MORTAR = 4;
const GLOW_RADIUS = 132;
const GLOW_LIFE = 720;
const MAX_GLOWS = 32;

/** A fixed brick wall whose existing blocks illuminate under the pointer. */
export default function HeroBricks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const band = canvas?.parentElement;
    const scope = band?.parentElement;
    if (!band || !scope) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    let frame = 0;

    const updateTone = () => {
      frame = 0;
      const values = band.nextElementSibling?.querySelector<HTMLElement>(".vals");
      if (!values) return;

      const valuesTop = values.getBoundingClientRect().top;
      const startLine = window.innerHeight * 0.93;
      const finishLine = window.innerHeight * 0.68;
      const raw = Math.min(
        1,
        Math.max(0, (startLine - valuesTop) / (startLine - finishLine)),
      );
      const eased = raw * raw * (3 - 2 * raw);
      const copyRaw = Math.min(1, Math.max(0, (eased - 0.1) / 0.55));
      const copyEased = copyRaw * copyRaw * (3 - 2 * copyRaw);
      scope.style.setProperty("--band-exit-opacity", eased.toFixed(4));
      scope.style.setProperty(
        "--band-copy-percent",
        `${(copyEased * 100).toFixed(2)}%`,
      );
    };

    const queueTone = () => {
      if (!frame) frame = requestAnimationFrame(updateTone);
    };

    updateTone();
    window.addEventListener("scroll", queueTone, { passive: true });
    window.addEventListener("resize", queueTone, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueTone);
      window.removeEventListener("resize", queueTone);
      scope.style.removeProperty("--band-exit-opacity");
      scope.style.removeProperty("--band-copy-percent");
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const band = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !band || !context) return;

    const canDraw = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!canDraw || reduceMotion) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let glows: GlowPoint[] = [];
    let last: { x: number; y: number } | null = null;

    const influenceAt = (x: number, y: number, now: number) => {
      let influence = 0;
      for (const glow of glows) {
        const age = now - glow.born;
        if (age < 0 || age >= GLOW_LIFE) continue;
        const distance = Math.hypot(x - glow.x, y - glow.y);
        if (distance >= GLOW_RADIUS) continue;
        const spatial = 1 - distance / GLOW_RADIUS;
        const fade = 1 - age / GLOW_LIFE;
        influence = Math.max(influence, spatial ** 1.45 * fade ** 1.2);
      }
      return influence;
    };

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      glows = glows.filter((glow) => now - glow.born < GLOW_LIFE);

      for (const glow of glows) {
        const age = now - glow.born;
        const fade = Math.max(0, 1 - age / GLOW_LIFE);
        const gradient = context.createRadialGradient(
          glow.x,
          glow.y,
          0,
          glow.x,
          glow.y,
          GLOW_RADIUS,
        );
        gradient.addColorStop(0, `rgba(255, 208, 145, ${0.035 * fade})`);
        gradient.addColorStop(1, "rgba(255, 208, 145, 0)");
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(glow.x, glow.y, GLOW_RADIUS, 0, Math.PI * 2);
        context.fill();
      }

      const rowCount = Math.ceil(height / BRICK_HEIGHT) + 2;
      const columnCount = Math.ceil(width / BRICK_WIDTH) + 2;
      for (let row = -1; row < rowCount; row += 1) {
        const offset = row % 2 === 0 ? 0 : -BRICK_WIDTH / 2;
        const y = row * BRICK_HEIGHT;

        for (let column = -1; column < columnCount; column += 1) {
          const x = column * BRICK_WIDTH + offset;
          const centerX = x + BRICK_WIDTH / 2;
          const centerY = y + BRICK_HEIGHT / 2;
          const influence = influenceAt(centerX, centerY, now);
          const variation = (row + column + 6) % 3;
          const warmth = variation === 0 ? "255, 224, 178" : "248, 190, 137";
          const brickX = x + MORTAR / 2;
          const brickY = y + MORTAR / 2;
          const brickWidth = BRICK_WIDTH - MORTAR;
          const brickHeight = BRICK_HEIGHT - MORTAR;

          context.fillStyle = `rgba(${warmth}, ${influence * 0.115})`;
          context.strokeStyle = `rgba(${warmth}, ${0.004 + influence * 0.34})`;
          context.lineWidth = 1;
          context.beginPath();
          context.roundRect(
            brickX,
            brickY,
            brickWidth,
            brickHeight,
            2,
          );
          context.fill();
          context.stroke();
        }
      }

      if (glows.length > 0) {
        frame = requestAnimationFrame(draw);
      } else {
        frame = 0;
      }
    };

    const queueFrame = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = band.getBoundingClientRect();
      const next = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      const now = performance.now();

      if (last) {
        const distance = Math.hypot(next.x - last.x, next.y - last.y);
        const points = Math.max(1, Math.ceil(distance / 28));
        for (let index = 1; index <= points; index += 1) {
          const progress = index / points;
          glows.push({
            x: last.x + (next.x - last.x) * progress,
            y: last.y + (next.y - last.y) * progress,
            born: now,
          });
        }
      } else {
        glows.push({ ...next, born: now });
      }

      last = next;
      if (glows.length > MAX_GLOWS) {
        glows.splice(0, glows.length - MAX_GLOWS);
      }
      queueFrame();
    };

    const onPointerLeave = () => {
      last = null;
    };

    const resize = () => {
      const rect = band.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      context.setTransform(density, 0, 0, density, 0, 0);
      glows = [];
      last = null;
      draw(performance.now());
    };

    resize();
    band.addEventListener("pointermove", onPointerMove, { passive: true });
    band.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      band.removeEventListener("pointermove", onPointerMove);
      band.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <span className="band-wash" aria-hidden="true" />
      <canvas ref={canvasRef} className="band-bricks" aria-hidden="true" />
    </>
  );
}
