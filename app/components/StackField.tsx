"use client";

import { useEffect, useRef, useState } from "react";

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
const FLIGHTS = [
  { side: -1, delay: -0.3, end: [-62, -34], s: 176 },
  { side: 1, delay: -0.22, end: [64, 26], s: 156 },
  { side: -1, delay: -0.14, end: [-70, 30], s: 148 },
  { side: 1, delay: -0.06, end: [60, -38], s: 184 },
  { side: -1, delay: 0.02, end: [-58, 4], s: 140 },
  { side: 1, delay: 0.1, end: [72, 6], s: 168 },
  { side: -1, delay: 0.18, end: [-66, -14], s: 160 },
  { side: 1, delay: 0.26, end: [62, 40], s: 144 },
  { side: -1, delay: 0.34, end: [-60, 38], s: 180 },
  { side: 1, delay: 0.42, end: [66, -20], s: 152 },
];
const TRIP = 0.62; // share of the scroll one flight takes; flights overlap

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
      const half = copy ? copy.width / 2 : 260;
      const p = Math.min(1, Math.max(0, -r.top / travel));
      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;
        const f = FLIGHTS[i % FLIGHTS.length];
        const t = Math.min(1, Math.max(0, (p - f.delay) / TRIP));
        const e = t * t * (3 - 2 * t);
        // Start just outside the copy block and only move outward, so a tile
        // can never cross the text.
        const startX = f.side * (half + 36 + (f.s * 0.6) / 2);
        const endX = (f.end[0] / 100) * vw;
        const x = startX + (endX - startX) * e;
        const y = f.end[1] * e * 0.9;
        const blur = t < 0.42 ? ((0.42 - t) / 0.42) * 8 : ((t - 0.42) / 0.58) * 11;
        const fade = t <= 0 ? 0 : Math.min(1, t / 0.1) * (t >= 1 ? 0 : 1);
        tile.style.setProperty("--tx", `${x.toFixed(1)}px`);
        tile.style.setProperty("--ty", `${((y / 100) * vh).toFixed(1)}px`);
        tile.style.setProperty("--sc", (0.6 + 0.65 * e).toFixed(3));
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
      <div className="stack-pin">
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
              <a href={`${basePath}/built/`}>see what I&apos;ve built →</a>
              <button type="button" onClick={() => setSelectedId(null)}>
                all tools
              </button>
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
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
