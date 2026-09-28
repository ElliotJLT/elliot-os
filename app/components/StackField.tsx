"use client";

import { useEffect, useRef, useState } from "react";
import { Pill } from "./Frame";

type Tool = {
  id: string;
  name: string;
  role: string;
  href: string;
  use: string;
  logo: string;
};

const TOOLS: Tool[] = [
  {
    id: "claude",
    name: "Claude Code",
    role: "primary builder",
    href: "https://www.anthropic.com/claude-code",
    logo: "claude.svg",
    use: "My primary builder for long, repo-spanning implementation. I give it intent, constraints and checks, then review the decisions and the diff rather than steering every keystroke.",
  },
  {
    id: "codex",
    name: "Codex",
    role: "parallel builder",
    href: "https://openai.com/codex/",
    logo: "codex.svg",
    use: "A second pair of hands and an independent pair of eyes. I use it for bounded builds, visual checks and reviews where a different model is more useful than another pass from the first one.",
  },
  {
    id: "linear",
    name: "Linear",
    role: "product spine",
    href: "https://linear.app/",
    logo: "linear.svg",
    use: "The shared product spine: problems, decisions and slices of work live here so people and agents pull from the same priority order, with enough context to know why the work exists.",
  },
  {
    id: "granola",
    name: "Granola",
    role: "meeting memory",
    href: "https://www.granola.ai/",
    logo: "granola.svg",
    use: "It captures customer and team conversations while I stay in the room. I turn the useful parts into evidence, decisions and follow-ups instead of treating a transcript as the finished artefact.",
  },
  {
    id: "conductor",
    name: "Conductor",
    role: "agent orchestration",
    href: "https://conductor.build/",
    logo: "conductor.png",
    use: "My control room for parallel coding agents in isolated workspaces. I use it to split independent changes, compare approaches and keep each branch small enough to inspect properly.",
  },
  {
    id: "wispr",
    name: "Wispr Flow",
    role: "voice input",
    href: "https://wisprflow.ai/",
    logo: "wispr-flow.png",
    use: "I dictate prompts, specs and rough thinking at speaking speed, then edit for precision. It is particularly good for giving an agent rich context without compressing the brief just to save typing.",
  },
  {
    id: "mobbin",
    name: "Mobbin",
    role: "pattern library",
    href: "https://mobbin.com/",
    logo: "mobbin.png",
    use: "My reference library before I invent interface behaviour. I compare how strong products solve the same interaction, then translate the useful principle into the product’s own visual language.",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    role: "voice layer",
    href: "https://elevenlabs.io/",
    logo: "elevenlabs.svg",
    use: "The voice layer for prototypes and product experiments. It lets me test whether an audio interaction feels genuinely useful before committing to the full production system around it.",
  },
  {
    id: "n8n",
    name: "n8n",
    role: "workflow glue",
    href: "https://n8n.io/",
    logo: "n8n.svg",
    use: "The connective tissue for repeatable operations: moving information between tools, triggering agents and removing the glue work that should never need a person to do it twice.",
  },
  {
    id: "vercel",
    name: "Vercel",
    role: "preview + ship",
    href: "https://vercel.com/",
    logo: "vercel.svg",
    use: "Preview, ship, inspect. Every branch can become a shareable environment and production stays close to Git, keeping the path from a reviewed change to a live product deliberately short.",
  },
];

// Each tile launches from just off-centre and flies out past the left or
// right edge of the page. `delay` is when in the pinned scroll it sets off
// (0..1); `end` is where it leaves, in viewport units; `lift` bends the
// path up or down. Sides alternate so the field stays balanced.
// The sequence, after microsoft.ai: two tiles already drifting in an empty
// field, then the copy fades in, then the rest launch from behind it.
// `delay` is when in the pinned scroll a tile sets off (0..1).
const FLIGHTS = [
  { side: -1, delay: -0.2, end: [-62, -40], s: 176 },
  { side: 1, delay: -0.15, end: [64, 34], s: 156 },
  { side: -1, delay: 0.08, end: [-70, 32], s: 148 },
  { side: 1, delay: 0.13, end: [60, -42], s: 184 },
  { side: -1, delay: 0.18, end: [-58, 8], s: 140 },
  { side: 1, delay: 0.23, end: [72, -6], s: 168 },
  { side: -1, delay: 0.28, end: [-66, -24], s: 160 },
  { side: 1, delay: 0.33, end: [62, 40], s: 144 },
  { side: -1, delay: 0.38, end: [-60, 40], s: 180 },
  { side: 1, delay: 0.43, end: [66, -30], s: 152 },
];
// Every flight lands (t = 1) by p = 0.95, so nothing is still in the air
// when the section lets go.
const TRIP = 0.52; // share of the scroll one flight takes; flights overlap
const COPY_IN = [0.1, 0.22]; // the copy fades and sharpens in over this span

/**
 * The stack as a pinned field, after the "Join us" section on microsoft.ai:
 * tiles emerge from behind the centred copy, come into focus mid-flight and
 * blur out as they leave the page. Picking one swaps the centre copy for
 * the job it does. Desktop only: phones and reduced motion get the explorer.
 */
export default function StackField({ basePath = "" }: { basePath?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = TOOLS.find((t) => t.id === selectedId);
  const fieldRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const centreRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = field.getBoundingClientRect();
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const travel = Math.max(1, r.height - vh);
      const copy = centreRef.current?.getBoundingClientRect();
      const pin = pinRef.current?.getBoundingClientRect();
      // Nothing shows until the section has pinned and fills the screen;
      // the last 40px of the approach fades the field in.
      // In over the last 40px before the pin, out over the first 40px after
      // it releases, so no tile is ever left behind on the page.
      const onScreen =
        Math.min(1, Math.max(0, 1 - r.top / 40)) *
        Math.min(1, Math.max(0, (r.bottom - vh) / 40));
      const p = Math.min(1, Math.max(0, -r.top / travel));
      // Copy: invisible and blurred in the empty field, then resolves.
      const c = Math.min(1, Math.max(0, (p - COPY_IN[0]) / (COPY_IN[1] - COPY_IN[0])));
      const ce = c * c * (3 - 2 * c);
      const centre = centreRef.current;
      if (centre) {
        centre.style.opacity = ce.toFixed(3);
        centre.style.filter = ce >= 1 ? "" : `blur(${((1 - ce) * 10).toFixed(2)}px)`;
        centre.style.visibility = ce <= 0 ? "hidden" : "";
      }
      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;
        const f = FLIGHTS[i % FLIGHTS.length];
        const t = Math.min(1, Math.max(0, (p - f.delay) / TRIP));
        const e = t * t * (3 - 2 * t);
        // Launch from the centre, behind the copy.
        const startX = f.side * 0.04 * vw;
        const endX = (f.end[0] / 100) * vw;
        const x = startX + (endX - startX) * e;
        const y = (f.end[1] / 100) * vh * e;
        const sc = 0.6 + 0.65 * e;
        const blur = t < 0.42 ? ((0.42 - t) / 0.42) * 8 : ((t - 0.42) / 0.58) * 11;
        // Invisible while any part of it is behind the copy, then fading in
        // over the next 60px of clearance: it emerges, it never overlaps.
        let clear = 1;
        if (copy) {
          const half = (f.s * sc) / 2;
          // Measured from the pin's real centre, so the check holds while it
          // is still sliding in or out, not just once it's pinned.
          const cx = (pin ? pin.left + pin.width / 2 : vw / 2) + x;
          const cy = (pin ? pin.top + pin.height / 2 : vh / 2) + y;
          const gapX = Math.max(copy.left - (cx + half), cx - half - copy.right);
          const gapY = Math.max(copy.top - (cy + half), cy - half - copy.bottom);
          const gap = Math.max(gapX, gapY) - 12;
          clear = Math.min(1, Math.max(0, gap / 60));
        }
        // Only the opening pair may sit near the centre, and only before any
        // copy shows. Every other tile waits until it is clear of the copy,
        // so none appears, vanishes as the copy arrives, then reappears.
        const opening = f.delay < 0;
        const gate = opening && ce <= 0 ? 1 : clear;
        const fade = t <= 0 || t >= 1 ? 0 : gate * onScreen;
        tile.style.setProperty("--tx", `${x.toFixed(1)}px`);
        tile.style.setProperty("--ty", `${y.toFixed(1)}px`);
        tile.style.setProperty("--sc", sc.toFixed(3));
        tile.style.pointerEvents = fade < 0.2 ? "none" : "";
        tile.style.setProperty("--blur", `${blur.toFixed(2)}px`);
        tile.style.setProperty("--fade", fade.toFixed(3));
      });
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
    <div className="stack-field" ref={fieldRef}>
      <div className="stack-pin" ref={pinRef}>
      <div className="stack-tiles" role="group" aria-label="Tools I use">
        {TOOLS.map((tool, i) => {
          const f = FLIGHTS[i % FLIGHTS.length];
          const on = tool.id === selectedId;
          return (
            <button
              key={tool.id}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              type="button"
              className="stack-tile"
              data-on={on || undefined}
              aria-pressed={on}
              aria-label={tool.name}
              aria-controls="stack-centre"
              style={
                {
                  "--s": `${f.s}px`,
                } as React.CSSProperties
              }
              onClick={() => setSelectedId(on ? null : tool.id)}
            >
              <span className="stack-tile-face">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${basePath}/stack/${tool.logo}`} alt="" />
              </span>
              <span className="stack-tile-name" aria-hidden="true">
                {tool.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="stack-centre"
        id="stack-centre"
        aria-live="polite"
        ref={centreRef}
      >
        {selected ? (
          <div key={selected.id} className="stack-centre-in">
            <span className="mai-kick">{selected.role}</span>
            <p className="sec-title">{selected.name}</p>
            <p className="stack-centre-body">{selected.use}</p>
            <div className="stack-centre-links">
              <Pill href="/built" arrow>
                See what I&apos;ve built
              </Pill>
            </div>
          </div>
        ) : (
          <div className="stack-centre-in">
            <h2 className="mai-kick">My stack</h2>
            <p className="sec-title">
              The small set of tools I reach for repeatedly.
            </p>
            <p className="stack-centre-body">
              Pick one to see the job it does in the system; none earns a place
              here just for being fashionable.
            </p>
            <div className="stack-centre-links">
              <Pill href="/built" arrow>
                See what I&apos;ve built
              </Pill>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
