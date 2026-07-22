"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const SITE = "https://elliotjlt.github.io/elliot-os";

export type ConsoleData = {
  spend: {
    runs: number;
    input_tokens: number;
    output_tokens: number;
    cost_usd: number;
  };
  week: { commits: number; repos: number };
  repos: { name: string; stars: number }[];
  log: { hash: string; subject: string; agent: boolean }[];
  roadmap: Record<string, string[]>;
  firstCommit: { hash: string; iso: string };
};

const OVERVIEW_ASK = "no spec — give me the critical overview";

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

function uptimeString(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${d}d ${h}h ${m}m`;
}

/* ------------------------------------------------------------- commands */

function runCommand(cmd: string, data: ConsoleData): string {
  switch (cmd) {
    case "/help":
      return [
        "commands, all $0.0000 marginal cost:",
        "  /whoami   who is elliot",
        "  /spend    the agent's inference ledger",
        "  /now      this week's shipping activity",
        "  /built    featured repos, live star counts",
        "  /next     the public roadmap",
        "  /uptime   time since first commit",
        "",
        "or paste a job spec and I'll brief your agent.",
      ].join("\n");
    case "/whoami":
      return [
        "elliot little — builder-operator, london. 4x founding hire.",
        "most recently: shipped a production multi-agent AI tutor",
        "(marking accuracy 67% baseline → 99%+; won a DSIT tender",
        "ahead of major US labs). currently: interviewing.",
        "",
        "the difference between him and this bio: every line above",
        "has a receipt somewhere on this site.",
      ].join("\n");
    case "/spend": {
      const s = data.spend;
      return [
        "agent inference ledger, all time:",
        `  runs            ${s.runs}`,
        `  input tokens    ${s.input_tokens}`,
        `  output tokens   ${s.output_tokens}`,
        `  cost            $${s.cost_usd.toFixed(4)}`,
        "",
        "measured at the API, committed to data/spend.json,",
        "auditable in the changelog. no estimates.",
      ].join("\n");
    }
    case "/now": {
      const lines = data.log
        .slice(0, 4)
        .map((l) => `  ${l.hash}  ${l.agent ? "[agent]" : "[human]"} ${l.subject}`);
      return [
        `last 7 days: ${data.week.commits} commits across ${data.week.repos} repos.`,
        "recent commits to this site:",
        ...lines,
        "",
        "full log: /now page · every hash links to github.",
      ].join("\n");
    }
    case "/built": {
      const lines = data.repos
        .slice(0, 8)
        .map((r) => `  ${r.name}${r.stars > 0 ? `  ★${r.stars}` : ""}`);
      return [
        "featured repos (star counts fetched at build):",
        ...lines,
        "",
        "plus a production AI tutor — details on /built.",
      ].join("\n");
    }
    case "/next": {
      const out: string[] = ["the public roadmap (intent stays human-written):"];
      for (const [section, items] of Object.entries(data.roadmap)) {
        if (!items.length) continue;
        out.push(`  ${section}:`);
        for (const i of items) out.push(`    · ${i}`);
      }
      out.push("", "missed promises stay visible. that's the deal.");
      return out.join("\n");
    }
    case "/uptime":
      return [
        `up ${uptimeString(data.firstCommit.iso)} since first commit ${data.firstCommit.hash}.`,
        "no downtime to report: it's a static site. the interesting",
        "uptime metric is whether the roadmap keeps its promises — /next.",
      ].join("\n");
    default:
      return "";
  }
}

const COMMANDS = ["/help", "/whoami", "/spend", "/now", "/built", "/next", "/uptime"];

const QUESTION_RE = /^(who|what|how|why|when|where|does|do |can |is |are |show|tell|list)\b|\?$/;

/** Route input. Free text defaults to a job-spec briefing (the primary
 *  action); /commands and short natural-language questions divert to the
 *  shell; short non-spec text gets nudged toward the two real paths. */
function route(
  text: string,
): { kind: "cmd"; cmd: string } | { kind: "spec" } | { kind: "nudge" } {
  const t = text.trim().toLowerCase();
  if (t.startsWith("/")) {
    const cmd = t.split(/\s/)[0];
    return { kind: "cmd", cmd: COMMANDS.includes(cmd) ? cmd : "/unknown" };
  }
  if (text === OVERVIEW_ASK) return { kind: "spec" };
  const multiline = text.includes("\n");
  // A short, question-shaped line is a natural-language command.
  if (!multiline && t.length < 120 && QUESTION_RE.test(t)) {
    const matches: [RegExp, string][] = [
      [/spend|cost|token|money|price|ledger|charge/, "/spend"],
      [/roadmap|next|plan|future|shipping soon/, "/next"],
      [/built|project|repo|portfolio|tutor|ship/, "/built"],
      [/\bnow\b|this week|recent|lately|commit/, "/now"],
      [/uptime|alive|running|how long/, "/uptime"],
      [/who|about|elliot|experience|background|you/, "/whoami"],
    ];
    for (const [re, cmd] of matches) if (re.test(t)) return { kind: "cmd", cmd };
    return { kind: "cmd", cmd: "/help" };
  }
  // A real job spec has heft; short fragments get nudged, not briefed on.
  if (multiline || text.trim().length >= 60) return { kind: "spec" };
  return { kind: "nudge" };
}

const NUDGE =
  "honest answer: I'm a shell, not a model. running real inference on " +
  "every visitor would blow the ledger this site exists to publish — so I " +
  "run commands instead, at $0.0000 a query. try /help, or paste a job " +
  "spec: that's the one thing I compose properly.";

const UNKNOWN =
  "command not found. I keep a short PATH on purpose — /help lists it.";

/* ------------------------------------------------------------ rendering */

const BOOT_LINES = [
  "elliot-os v2 · fit-engine tty",
  "mounting /built /now /next /changelog … ok",
  "telemetry linked · spend ledger open · $0.0000/query",
  "type /help, or paste a job spec",
];

type Msg =
  | { role: "user"; text: string }
  | { role: "agent"; kind: "intro" }
  | { role: "agent"; kind: "text"; body: string }
  | { role: "agent"; kind: "briefing"; briefing: string };

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

export default function FitConsole({ data }: { data: ConsoleData }) {
  const [bootCount, setBootCount] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Boot sequence: typed once per tab session, instant after that.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let booted = false;
    try {
      booted = sessionStorage.getItem("os-booted") === "1";
    } catch {}
    if (booted || reduced) {
      setBootCount(BOOT_LINES.length);
      setMessages([{ role: "agent", kind: "intro" }]);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setBootCount(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(iv);
        try {
          sessionStorage.setItem("os-booted", "1");
        } catch {}
        setTimeout(() => setMessages([{ role: "agent", kind: "intro" }]), 250);
      }
    }, 160);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking, bootCount]);

  function reply(msg: Msg, delay: number) {
    setThinking(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(
      () => {
        setThinking(false);
        setMessages((m) => [...m, msg]);
      },
      reduced ? 0 : delay,
    );
  }

  function send(text: string) {
    const input = text.trim();
    if (!input || thinking) return;
    setDraft("");
    setMessages((m) => [...m, { role: "user", text: input }]);
    const r = route(input);
    if (r.kind === "spec")
      reply({ role: "agent", kind: "briefing", briefing: buildBriefing(input) }, 650);
    else if (r.kind === "cmd" && r.cmd === "/unknown")
      reply({ role: "agent", kind: "text", body: UNKNOWN }, 250);
    else if (r.kind === "cmd")
      reply({ role: "agent", kind: "text", body: runCommand(r.cmd, data) }, 350);
    else reply({ role: "agent", kind: "text", body: NUDGE }, 450);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const plain = !e.shiftKey && !e.metaKey && !e.ctrlKey;
    // Enter sends short/command input; Shift+Enter always newlines. Multi-line
    // pastes (job specs) keep Enter-as-newline, Cmd/Ctrl+Enter sends.
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      send(draft);
    } else if (e.key === "Enter" && plain && !draft.includes("\n") && draft.length < 120) {
      e.preventDefault();
      send(draft);
    }
  }

  const booting = bootCount < BOOT_LINES.length;

  return (
    <div className="console">
      <div className="console-bar">
        <span className="left">
          <span className="dot" aria-hidden="true" />
          fit-engine tty
        </span>
        <span className="right">runs in your browser</span>
      </div>

      <div className="thread" ref={threadRef}>
        <div className="boot" aria-hidden={booting}>
          {BOOT_LINES.slice(0, bootCount).map((l, i) => (
            <div key={i}>
              <span className="prompt">▸</span> {l}
              {booting && i === bootCount - 1 && <span className="caret">▌</span>}
            </div>
          ))}
        </div>

        {messages.map((m, i) => {
          if (m.role === "user")
            return (
              <div className="msg user" key={i}>
                <span className="who">you</span>
                <div className="bubble clamp">{m.text}</div>
              </div>
            );
          if (m.kind === "intro")
            return (
              <div className="msg agent" key={i}>
                <span className="who">elliot-os agent</span>
                <div className="bubble">
                  <p>
                    Evaluating Elliot for a role? Don&apos;t take my word for it
                    — I&apos;m his agent. Paste the job spec and I&apos;ll
                    compose a critical briefing for an agent you already trust.
                    Or interrogate the site directly: it&apos;s all mounted.
                  </p>
                </div>
              </div>
            );
          if (m.kind === "text")
            return (
              <div className="msg agent" key={i}>
                <span className="who">elliot-os agent</span>
                <div className="bubble">
                  <pre className="shellout">{m.body}</pre>
                </div>
              </div>
            );
          return (
            <div className="msg agent" key={i}>
              <span className="who">elliot-os agent</span>
              <div className="bubble">
                <p>
                  Briefing composed. It routes through{" "}
                  <a href={`${SITE}/llms.txt`}>llms.txt</a> and the raw sources
                  behind every claim on this site — commits, repos, spend. Hand
                  it to your agent:
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

      {!booting && (
        <div className="chips">
          {["/whoami", "/spend", "/built", "/next"].map((c) => (
            <button key={c} onClick={() => send(c)}>
              {c}
            </button>
          ))}
          <button onClick={() => send(OVERVIEW_ASK)}>
            no spec? critical overview →
          </button>
        </div>
      )}

      <div className="composer">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="Paste a job spec, or type /help…"
          aria-label="Job spec or command"
          disabled={booting}
        />
        <button onClick={() => send(draft)} disabled={!draft.trim() || thinking || booting}>
          send
        </button>
      </div>

      <div className="console-foot">
        static site, zero backend: nothing you type leaves your browser. the
        composed briefing only travels to the agent you choose. hosted
        inference is on the <Link href="/next">roadmap</Link>.
      </div>
    </div>
  );
}
