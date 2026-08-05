"use client";

import { useState } from "react";

type Tool = {
  id: string;
  name: string;
  role: string;
  href: string;
  use: string;
};

const TOOLS: Tool[] = [
  {
    id: "claude",
    name: "Claude Code",
    role: "primary builder",
    href: "https://www.anthropic.com/claude-code",
    use: "My primary builder for long, repo-spanning implementation. I give it intent, constraints and checks, then review the decisions and the diff rather than steering every keystroke.",
  },
  {
    id: "codex",
    name: "Codex",
    role: "parallel builder",
    href: "https://openai.com/codex/",
    use: "A second pair of hands and an independent pair of eyes. I use it for bounded builds, visual checks and reviews where a different model is more useful than another pass from the first one.",
  },
  {
    id: "linear",
    name: "Linear",
    role: "product spine",
    href: "https://linear.app/",
    use: "The shared product spine: problems, decisions and slices of work live here so people and agents pull from the same priority order, with enough context to know why the work exists.",
  },
  {
    id: "granola",
    name: "Granola",
    role: "meeting memory",
    href: "https://www.granola.ai/",
    use: "It captures customer and team conversations while I stay in the room. I turn the useful parts into evidence, decisions and follow-ups instead of treating a transcript as the finished artefact.",
  },
  {
    id: "conductor",
    name: "Conductor",
    role: "agent orchestration",
    href: "https://conductor.build/",
    use: "My control room for parallel coding agents in isolated workspaces. I use it to split independent changes, compare approaches and keep each branch small enough to inspect properly.",
  },
  {
    id: "wispr",
    name: "Wispr Flow",
    role: "voice input",
    href: "https://wisprflow.ai/",
    use: "I dictate prompts, specs and rough thinking at speaking speed, then edit for precision. It is particularly good for giving an agent rich context without compressing the brief just to save typing.",
  },
  {
    id: "mobbin",
    name: "Mobbin",
    role: "pattern library",
    href: "https://mobbin.com/",
    use: "My reference library before I invent interface behaviour. I compare how strong products solve the same interaction, then translate the useful principle into the product’s own visual language.",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    role: "voice layer",
    href: "https://elevenlabs.io/",
    use: "The voice layer for prototypes and product experiments. It lets me test whether an audio interaction feels genuinely useful before committing to the full production system around it.",
  },
  {
    id: "n8n",
    name: "n8n",
    role: "workflow glue",
    href: "https://n8n.io/",
    use: "The connective tissue for repeatable operations: moving information between tools, triggering agents and removing the glue work that should never need a person to do it twice.",
  },
  {
    id: "vercel",
    name: "Vercel",
    role: "preview + ship",
    href: "https://vercel.com/",
    use: "Preview, ship, inspect. Every branch can become a shareable environment and production stays close to Git, keeping the path from a reviewed change to a live product deliberately short.",
  },
];

function StackMark({ name }: { name: string }) {
  switch (name) {
    case "claude":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.5v19M2.5 12h19M5.3 5.3l13.4 13.4M18.7 5.3 5.3 18.7M8.2 3.3l7.6 17.4M20.7 8.2 3.3 15.8M20.7 15.8 3.3 8.2M15.8 3.3 8.2 20.7" />
        </svg>
      );
    case "codex":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3.2a4.4 4.4 0 0 1 7.6 3.1 4.4 4.4 0 0 1 0 8.8 4.4 4.4 0 0 1-7.6 4.4 4.4 4.4 0 0 1-7.6-3.1 4.4 4.4 0 0 1 0-8.8A4.4 4.4 0 0 1 12 3.2Z" />
          <path d="m8.2 9.8 3.8-2.2 3.8 2.2v4.4L12 16.4l-3.8-2.2Z" />
        </svg>
      );
    case "linear":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.1 13.8a8.2 8.2 0 0 0 6.1 6.1M4 9.8 14.2 20M5.7 6.6l11.7 11.7M9.8 4l10.2 10.2M13.8 4.1a8.2 8.2 0 0 1 6.1 6.1" />
        </svg>
      );
    case "granola":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.8 8.2c0 3.2-2.8 5.8-6.3 5.8S6.2 11.4 6.2 8.2 9 3.5 12.5 3.5s6.3 1.5 6.3 4.7Z" />
          <path d="M8.2 13.2c-1.7 1-2.6 2.2-2.6 3.5 0 2.1 2.9 3.8 6.4 3.8s6.4-1.7 6.4-3.8c0-1.3-.9-2.5-2.6-3.5" />
        </svg>
      );
    case "conductor":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="4" width="7" height="7" rx="1" />
          <rect x="14" y="4" width="7" height="7" rx="1" />
          <rect x="8.5" y="15" width="7" height="6" rx="1" />
          <path d="M6.5 11v2h11v-2M12 13v2" />
        </svg>
      );
    case "wispr":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 14.5v-5M8 18V6m4 15V3m4 15V6m4 8.5v-5" />
        </svg>
      );
    case "mobbin":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="10" height="14" rx="2" />
          <path d="M13.5 8H18a2.5 2.5 0 0 1 2.5 2.5v6A2.5 2.5 0 0 1 18 19h-4.5" />
        </svg>
      );
    case "elevenlabs":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 4v16M11 4v16M16 7v10M20 4v16" />
        </svg>
      );
    case "n8n":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="4.5" cy="12" r="2" />
          <circle cx="12" cy="6" r="2" />
          <circle cx="19.5" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
          <path d="m6.2 10.8 4.1-3.4m3.4 0 4.1 3.4m0 2.4-4.1 3.4m-3.4 0-4.1-3.4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 3 9 17H3Z" />
        </svg>
      );
  }
}

export default function StackExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = TOOLS.find((tool) => tool.id === selectedId);

  return (
    <div className="stack-explorer">
      <div className="stack-tabs" role="group" aria-label="Tools I use">
        {TOOLS.map((tool) => {
          const isSelected = tool.id === selectedId;
          return (
            <button
              key={tool.id}
              type="button"
              id={`stack-tab-${tool.id}`}
              aria-expanded={isSelected}
              aria-controls={isSelected ? "stack-panel" : undefined}
              data-selected={isSelected || undefined}
              className="stack-tab"
              onClick={() => setSelectedId(isSelected ? null : tool.id)}
            >
              <span className="stack-mark"><StackMark name={tool.id} /></span>
              <span>{tool.name}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          key={selected.id}
          className="stack-panel"
          id="stack-panel"
          role="region"
          aria-live="polite"
          aria-labelledby={`stack-tab-${selected.id}`}
        >
          <div className="stack-panel-heading">
            <span className="stack-mark stack-mark-large"><StackMark name={selected.id} /></span>
            <div>
              <span className="stack-role">{selected.role}</span>
              <h3>{selected.name}</h3>
            </div>
          </div>
          <p>{selected.use}</p>
          <a href={selected.href}>visit {selected.name} ↗</a>
        </div>
      )}
    </div>
  );
}
