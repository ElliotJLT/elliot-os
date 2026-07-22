"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SITE = "https://elliotjlt.github.io/elliot-os";

const OVERVIEW_ASK = "No spec — give me the critical overview.";

function buildBriefing(spec: string): string {
  if (spec === OVERVIEW_ASK) {
    return (
      `Read ${SITE}/llms.txt and the raw sources it links. Give me a critical ` +
      `overview of Elliot Little as a senior product / AI hire: strengths, gaps, ` +
      `and the roles he is and is not suited for. Cite specific shipped work for ` +
      `every claim.`
    );
  }
  return (
    `Read ${SITE}/llms.txt and the raw sources it links. Then assess Elliot ` +
    `Little against this job spec:\n\n${spec}\n\nBe critical. If he is not a ` +
    `strong fit, say so and say why. Cite specific shipped work for every claim.`
  );
}

type Msg =
  | { role: "agent-intro" }
  | { role: "user"; text: string }
  | { role: "agent"; briefing: string };

function Handoff({ briefing }: { briefing: string }) {
  const [copied, setCopied] = useState(false);
  const q = encodeURIComponent(briefing);

  async function copy() {
    try {
      await navigator.clipboard.writeText(briefing);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <>
      <div className="handoff">
        <a
          className="primary"
          href={`https://claude.ai/new?q=${q}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          open in Claude ↗
        </a>
        <a
          href={`https://chatgpt.com/?q=${q}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          open in ChatGPT ↗
        </a>
        <button onClick={copy}>{copied ? "copied ✓" : "copy briefing"}</button>
      </div>
      <details className="briefing">
        <summary>inspect the briefing before you send it</summary>
        <pre>{briefing}</pre>
      </details>
    </>
  );
}

export default function FitConsole() {
  const [messages, setMessages] = useState<Msg[]>([{ role: "agent-intro" }]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  function send(text: string) {
    const spec = text.trim();
    if (!spec || thinking) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: spec }]);
    setThinking(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(
      () => {
        setThinking(false);
        setMessages((m) => [...m, { role: "agent", briefing: buildBriefing(spec) }]);
      },
      reduced ? 0 : 650,
    );
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send(draft);
    }
  }

  const asked = messages.some((m) => m.role === "user");

  return (
    <div className="console">
      <div className="console-bar">
        <span className="left">
          <span className="dot" aria-hidden="true" />
          fit-engine v0
        </span>
        <span className="right">runs in your browser</span>
      </div>

      <div className="thread" ref={threadRef}>
        {messages.map((m, i) => {
          if (m.role === "agent-intro")
            return (
              <div className="msg agent" key={i}>
                <span className="who">elliot-os agent</span>
                <div className="bubble">
                  <p>
                    Evaluating Elliot for a role? Don&apos;t take my word for it
                    — I&apos;m his agent. Paste the job spec and I&apos;ll
                    compose a briefing for an agent you already trust, wired to
                    the structured version of this site.
                  </p>
                  <p>
                    It&apos;s instructed to be critical: if he&apos;s not a
                    strong fit, it will say so.
                  </p>
                </div>
              </div>
            );
          if (m.role === "user")
            return (
              <div className="msg user" key={i}>
                <span className="who">you</span>
                <div className="bubble clamp">{m.text}</div>
              </div>
            );
          return (
            <div className="msg agent" key={i}>
              <span className="who">elliot-os agent</span>
              <div className="bubble">
                <p>
                  Briefing composed. It routes through{" "}
                  <a href={`${SITE}/llms.txt`}>llms.txt</a> and the raw sources
                  behind every claim on this site — commits, repos, spend.
                  Hand it to your agent:
                </p>
                <Handoff briefing={m.briefing} />
              </div>
            </div>
          );
        })}
        {thinking && (
          <div className="msg agent">
            <span className="who">elliot-os agent</span>
            <span className="thinking" aria-label="composing">
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>

      {!asked && (
        <div className="chips">
          <button onClick={() => send(OVERVIEW_ASK)}>
            no spec handy? get the critical overview →
          </button>
        </div>
      )}

      <div className="composer">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Paste the job spec here…"
          aria-label="Job spec"
        />
        <button onClick={() => send(draft)} disabled={!draft.trim() || thinking}>
          brief my agent
        </button>
      </div>

      <div className="console-foot">
        static site, zero backend: the spec never leaves your browser. the
        composed briefing only travels to the agent you choose. hosted version
        is on the <Link href="/next">roadmap</Link>.
      </div>
    </div>
  );
}
