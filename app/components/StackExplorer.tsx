"use client";

import { useState } from "react";

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

function StackMark({ tool, basePath }: { tool: Tool; basePath: string }) {
  return (
    // The adjacent tool name is the accessible label.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`${basePath}/stack/${tool.logo}`} alt="" width={28} height={28} />
  );
}

export default function StackExplorer({ basePath = "" }: { basePath?: string }) {
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
              <span className="stack-mark">
                <StackMark tool={tool} basePath={basePath} />
              </span>
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
            <span className="stack-mark stack-mark-large">
              <StackMark tool={selected} basePath={basePath} />
            </span>
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
