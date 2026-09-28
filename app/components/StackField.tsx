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

// Where each tile sits around the centred copy (percent of the field),
// its size, how far it drifts on scroll (depth, -1..1), and when in the
// scroll it comes into focus (0..1). Neighbours are staggered on purpose so
// focus moves around the field instead of sweeping one side.
const SLOTS = [
  { x: 6, y: 6, s: 132, depth: -0.8, focus: 0.3 },
  { x: 21, y: 30, s: 104, depth: 0.5, focus: 0.62 },
  { x: 3, y: 56, s: 92, depth: -0.3, focus: 0.45 },
  { x: 17, y: 76, s: 124, depth: 0.9, focus: 0.74 },
  { x: 44, y: 1, s: 84, depth: 0.4, focus: 0.52 },
  { x: 79, y: 4, s: 116, depth: 0.7, focus: 0.36 },
  { x: 71, y: 30, s: 136, depth: -0.6, focus: 0.68 },
  { x: 88, y: 50, s: 88, depth: 0.2, focus: 0.26 },
  { x: 74, y: 72, s: 108, depth: -0.9, focus: 0.58 },
  { x: 49, y: 88, s: 80, depth: 0.6, focus: 0.8 },
];

/**
 * The stack as a field of tiles round a centred block, after the "Join us"
 * section on microsoft.ai: tiles drift in and out of focus as the page
 * scrolls. Picking one swaps the centre copy for the job it does. Reduced
 * motion keeps every tile sharp and still.
 */
export default function StackField({ basePath = "" }: { basePath?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = TOOLS.find((t) => t.id === selectedId);
  const fieldRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = field.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      tileRefs.current.forEach((tile, i) => {
        if (!tile) return;
        const slot = SLOTS[i % SLOTS.length];
        const off = Math.abs(p - slot.focus);
        tile.style.setProperty("--blur", `${Math.min(9, Math.max(0, (off - 0.05) * 38)).toFixed(2)}px`);
        tile.style.setProperty("--fade", Math.max(0.5, 1 - off * 1.3).toFixed(3));
        tile.style.setProperty("--drift", `${(slot.depth * (0.5 - p) * 110).toFixed(1)}px`);
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
      <div className="stack-tiles" role="group" aria-label="Tools I use">
        {TOOLS.map((tool, i) => {
          const slot = SLOTS[i % SLOTS.length];
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
              aria-controls="stack-centre"
              style={
                {
                  "--x": `${slot.x}%`,
                  "--y": `${slot.y}%`,
                  "--s": `${slot.s}px`,
                } as React.CSSProperties
              }
              onClick={() => setSelectedId(on ? null : tool.id)}
            >
              <span className="stack-tile-face">
                {/* The name under the tile is the accessible label. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${basePath}/stack/${tool.logo}`} alt="" />
              </span>
              <span className="stack-tile-name">{tool.name}</span>
            </button>
          );
        })}
      </div>

      <div className="stack-centre" id="stack-centre" aria-live="polite">
        {selected ? (
          <div key={selected.id} className="stack-centre-in">
            <span className="mai-kick">{selected.role}</span>
            <p className="sec-title">{selected.name}</p>
            <p className="stack-centre-body">{selected.use}</p>
            <div className="stack-centre-links">
              <a href={selected.href}>visit {selected.name} ↗</a>
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
  );
}
