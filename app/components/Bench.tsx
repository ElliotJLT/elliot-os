"use client";

import { useEffect, useRef, useState } from "react";

type Line = { k: "cmd" | "info" | "ok" | "warn"; t: string };
type Track = {
  id: string;
  name: string;
  meta: string;
  where: string;
  steps: { name: string; note: string }[];
  notes: [string, string];
  tags: string[];
  log: Line[];
};

/**
 * The systems behind the products, as a bento: every system on one screen
 * as a card with a small drawn visual. Open one and it fills the whole
 * bubble with its flow, its rules and its run log. Every line in a log is
 * something that happened; nothing here is sample data.
 */
export default function Bench({
  firstRun,
  latestRun,
}: {
  firstRun: { passed: number; total: number };
  latestRun: { passed: number; total: number };
}) {
  const TRACKS: Track[] = [
    {
      id: "harness",
      name: "The harness",
      meta: "Zero Gravity · this site",
      where: "their pattern → mine",
      steps: [
        { name: "Progress file", note: "Linear umbrellas and a daily ledger" },
        { name: "Feature list", note: "eval cases, each pass or fail" },
        { name: "Clean state", note: "small PRs, merged the same day" },
        { name: "Init script", note: "a guide every agent reads first" },
        { name: "Worktrees", note: "one isolated checkout per task" },
        { name: "Checker", note: "a separate agent reviews the work" },
      ],
      notes: [
        "The agent forgets. The board doesn't.",
        "Verification stays human.",
      ],
      tags: ["Claude Code", "MCP", "Conductor", "Linear"],
      log: [
        { k: "cmd", t: "open harness" },
        { k: "info", t: "contributing guide v3.6: read by every engineer and agent" },
        { k: "info", t: "connectors: Linear, Metabase, GitHub, Slack over MCP" },
        { k: "info", t: "every review finding lands in .claude/rules" },
        { k: "ok", t: "error triage spawns a fix PR · a review agent checks it" },
        { k: "warn", t: "“the loop runs itself” must never mean nobody has an opinion" },
        { k: "ok", t: "designed once, inherited by the whole team" },
      ],
    },
    {
      id: "operating-model",
      name: "Operating model",
      meta: "Zero Gravity · tutor",
      where: "people · process · cost",
      steps: [
        { name: "Platform", note: "a tech lead owns the loops" },
        { name: "Domain", note: "engineers own a metric and named users" },
        { name: "Experts", note: "teachers flag marks; flags become cases" },
        { name: "Eval loop", note: "from trace to fix in days" },
        { name: "Governance", note: "DfE safety standards, ISO 27001" },
        { name: "Cost", note: "routing and caching, per mode" },
      ],
      notes: [
        "Engineers alone can't say what a good mark is. Teachers can.",
        "Cost is a product call: the cheap model couldn't hold its tool calls.",
      ],
      tags: ["Langfuse", "Claude", "Linear"],
      log: [
        { k: "cmd", t: "open operating-model" },
        { k: "info", t: "three rings: platform, domain, subject experts" },
        { k: "ok", t: "every flagged mark became an eval case" },
        { k: "warn", t: "production came in 4.6x over the cost plan" },
        { k: "info", t: "a model 14x cheaper couldn't hold its tool calls" },
        { k: "ok", t: "caching + routing by mode · $0.09 a session, 80%+ margin" },
        { k: "ok", t: "ISO 27001 and 9001 solo as DPO · built to DfE standards" },
      ],
    },
    {
      id: "ways-of-working",
      name: "Ways of working",
      meta: "Zero Gravity · 6 engineers",
      where: "zero gravity",
      steps: [
        { name: "Problem", note: "one owner, a metric, named users" },
        { name: "Prototype", note: "the prototype is the spec" },
        { name: "Small PR", note: "about 120 lines, merged same day" },
        { name: "Review", note: "people plan and review" },
        { name: "Ship", note: "adoption is the score" },
        { name: "Compound", note: "findings go into the rules" },
      ],
      notes: [
        "Plans and reviews are the human work. Agents do the typing.",
        "Shipped but unused counts as zero.",
      ],
      tags: ["Linear", "GitHub", "Claude Code"],
      log: [
        { k: "cmd", t: "open ways-of-working" },
        { k: "info", t: "product engineers, no requirements layer" },
        { k: "info", t: "82 days to launch · 240 PRs before it" },
        { k: "ok", t: "median PR 120 lines · 1.8h to merge" },
        { k: "ok", t: "5.2 merged PRs per engineer per week" },
        { k: "info", t: "every review finding lands in .claude/rules" },
      ],
    },
    {
      id: "design",
      name: "Design at both ends",
      meta: "Zero Gravity · tutor",
      where: "vision · build · polish",
      steps: [
        { name: "Vision", note: "the designer sets the direction" },
        { name: "Prototype", note: "anyone builds rough, to learn" },
        { name: "System", note: "one design system from day one" },
        { name: "Build", note: "the founder, engineers and me, on the system" },
        { name: "Polish", note: "design craft on what users see" },
        { name: "Ship", note: "every screen on the same foundations" },
      ],
      notes: [
        "The designer owns the vision up front and the polish at the end.",
        "The system is how a designer's taste reaches the screens they never touch.",
      ],
      tags: ["Claude Code", "GitHub"],
      log: [
        { k: "cmd", t: "open design" },
        { k: "warn", t: "design happened after the fact: polishing decisions already made" },
        { k: "info", t: "split prototyping from polish" },
        { k: "warn", t: "everyone building in their own style" },
        { k: "warn", t: "design PRs waited 5.6 days · gave design a cadence" },
        { k: "ok", t: "one design system from day one, shared by the founder, engineers and me" },
      ],
    },
    {
      id: "agent-fleet",
      name: "Agent fleet",
      meta: "Zero Gravity · daily 06:00",
      where: "zero gravity",
      steps: [
        { name: "06:00 run", note: "monitoring, triage, audits" },
        { name: "Route", note: "each agent posts to its owner" },
        { name: "Fix PR", note: "error triage opens a fix" },
        { name: "Verify", note: "a review agent checks it" },
        { name: "Decide", note: "a person ships or bins it" },
        { name: "Pulse", note: "synthesis preps Friday" },
      ],
      notes: [
        "Agents detect and route. People decide and ship.",
        "The writer never grades its own homework.",
      ],
      tags: ["Claude Code", "MCP", "Linear"],
      log: [
        { k: "cmd", t: "open agent-fleet" },
        { k: "info", t: "06:00 · done before anyone opens a laptop" },
        { k: "info", t: "synthesis · machine audit · error triage · security" },
        { k: "info", t: "coaching quality → evals · product health" },
        { k: "ok", t: "error triage → fix PR opened" },
        { k: "ok", t: "review agent verified it, adversarially" },
        { k: "info", t: "state lives in Linear, not in the chat" },
      ],
    },
    {
      id: "evals",
      name: "Evals",
      meta: "AI STEM tutor",
      where: "zero gravity",
      steps: [
        { name: "Past paper", note: "a real exam question" },
        { name: "Tutor marks", note: "the model's answer" },
        { name: "Mark scheme", note: "the exam board's bar" },
        { name: "Compare", note: "pass or fail, per point" },
        { name: "Teacher flag", note: "becomes a new case" },
        { name: "Gate", note: "no regressions ship" },
      ],
      notes: [
        "Borrow the bar from whoever would know.",
        "A model marker has to agree with a teacher first.",
      ],
      tags: ["Langfuse", "Claude"],
      log: [
        { k: "cmd", t: "open evals" },
        { k: "info", t: "real past papers · official mark schemes" },
        { k: "info", t: "every session graded against the Socratic spec" },
        { k: "warn", t: "confident marking the scheme didn't back up" },
        { k: "ok", t: "caught · now a case in the suite" },
        { k: "ok", t: "teacher flag → new case" },
        { k: "info", t: "safeguarding: detection first, then the noise cut" },
      ],
    },
    {
      id: "this-site",
      name: "This site",
      meta: "elliot-os · daily",
      where: "this site",
      steps: [
        { name: "Read", note: "public GitHub events" },
        { name: "Draft", note: "the shipping digest" },
        { name: "Review gate", note: "is every claim grounded?" },
        { name: "Evals", note: `${latestRun.total} held-out cases` },
        { name: "Publish", note: "only if CI is green" },
      ],
      notes: [
        "No model in the eval loop: free, and the same every run.",
        "A gate that can't reject anything is decoration.",
      ],
      tags: ["GitHub Actions", "Claude"],
      log: [
        { k: "cmd", t: "open this-site" },
        { k: "info", t: "reading public GitHub events" },
        { k: "info", t: "drafting the shipping digest" },
        { k: "warn", t: `first eval run: ${firstRun.passed}/${firstRun.total}` },
        { k: "warn", t: "review gate passed a repo that doesn't exist" },
        {
          k: "ok",
          t: `gate fixed · ${latestRun.passed}/${latestRun.total} · CI blocks regressions`,
        },
      ],
    },
  ];

  const byId = Object.fromEntries(TRACKS.map((t) => [t.id, t]));
  const [openId, setOpenId] = useState<string | null>(null);
  const [shown, setShown] = useState(0);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastCard = useRef<HTMLButtonElement | null>(null);
  const track = openId ? byId[openId] : null;

  // The log prints its run line by line when a system opens. Keyed on the
  // id, not the track object: TRACKS is rebuilt every render, so depending
  // on the object restarted the log on every tick and it never printed.
  const logLength = track?.log.length ?? 0;
  useEffect(() => {
    if (!openId) return;
    const total = logLength;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(total);
      return;
    }
    setShown(0);
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= total) window.clearInterval(timer);
    }, 200);
    return () => window.clearInterval(timer);
  }, [openId, logLength]);

  // Opening moves focus to Close and keeps the bubble in view; closing
  // hands focus back to the card that opened it. Escape closes.
  useEffect(() => {
    if (!openId) return;
    closeRef.current?.focus({ preventScroll: true });
    const r = bubbleRef.current?.getBoundingClientRect();
    if (r && r.top < 104) bubbleRef.current?.scrollIntoView({ block: "start" });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openId]);

  const open = (id: string, el: HTMLButtonElement) => {
    lastCard.current = el;
    setOpenId(id);
  };
  const close = () => {
    setOpenId(null);
    requestAnimationFrame(() => lastCard.current?.focus({ preventScroll: true }));
  };

  const card = (id: string, span: string, title: string, blurb: string, visual: React.ReactNode) => (
    <button
      type="button"
      className={`bento-card ${span}`}
      onClick={(e) => open(id, e.currentTarget)}
      aria-haspopup="dialog"
    >
      <span className="bento-visual" aria-hidden="true">
        {visual}
      </span>
      <span className="bento-title">{title}</span>
      <span className="bento-blurb">{blurb}</span>
      <span className="bento-open" aria-hidden="true">
        Open →
      </span>
    </button>
  );

  const harness = byId["harness"];
  const site = byId["this-site"];

  return (
    <div className="bento" ref={bubbleRef}>
      <div className="bento-grid" hidden={!!track}>
        <div className="bento-intro">
          <p className="bento-kick">
            <strong>Build</strong> the harness
          </p>
          <p>Rules, state and checks the agents work inside, written once and inherited by the team.</p>
        </div>
        {card(
          "harness",
          "",
          "The harness",
          "Anthropic's long-running agent patterns, and where each one already ran at Zero Gravity.",
          <span className="v-map">
            {harness.steps.slice(0, 3).map((s) => (
              <span key={s.name}>
                <em>{s.name}</em>
                <i>→</i>
                <b>{s.note}</b>
              </span>
            ))}
          </span>,
        )}
        {card(
          "design",
          "",
          "Design at both ends",
          "The designer owns the vision and the polish; everyone builds the middle on one design system.",
          <span className="v-log">
            <span>◆ vision · designer</span>
            <span>· build · everyone, on the system</span>
            <span>◆ polish · designer</span>
          </span>,
        )}
        {card(
          "ways-of-working",
          "",
          "Ways of working",
          "Product engineers, no requirements layer. The prototype is the spec.",
          <span className="v-stat">
            <b>120</b>
            <em>lines in the median PR</em>
            <em>1.8h to merge</em>
          </span>,
        )}
        {card(
          "agent-fleet",
          "",
          "Agent fleet",
          "Monitoring, triage and fixes done by 06:00. Agents route; people decide.",
          <span className="v-log">
            <span>✓ error triage → fix PR</span>
            <span>✓ review agent verified it</span>
            <span>· pulse posted for Friday</span>
          </span>,
        )}
        {card(
          "operating-model",
          "",
          "Operating model",
          "Platform, domain and subject-expert rings, with governance and cost built in.",
          <span className="v-rings">
            <i>experts</i>
            <i>domain</i>
            <i>platform</i>
          </span>,
        )}

        <div className="bento-intro bento-intro-run">
          <p className="bento-kick">
            <strong>Run</strong> it, and keep it honest
          </p>
          <p>Checks that gate every change, and a record of what they caught.</p>
        </div>
        {card(
          "evals",
          "",
          "Evals",
          "Marked against the exam board's own mark schemes. Teacher flags become cases.",
          <span className="v-checks">
            <span><b>✓</b> mark scheme</span>
            <span><b>✓</b> Socratic spec</span>
            <span><b>!</b> teacher flag → new case</span>
          </span>,
        )}
        {card(
          "this-site",
          "",
          "This site",
          "The agent that keeps this site current, gated by its own eval suite in CI.",
          <span className="v-bars">
            <span>
              <em>first run</em>
              <i style={{ "--w": `${(firstRun.passed / firstRun.total) * 100}%` } as React.CSSProperties} />
              <b>{firstRun.passed}/{firstRun.total}</b>
            </span>
            <span>
              <em>now</em>
              <i style={{ "--w": `${(latestRun.passed / latestRun.total) * 100}%` } as React.CSSProperties} />
              <b>{latestRun.passed}/{latestRun.total}</b>
            </span>
          </span>,
        )}
      </div>

      {track && (
        <div className="bento-full" role="dialog" aria-label={track.name}>
          <div className="bento-full-head">
            <div>
              <span className="bento-kick-sm">{track.meta}</span>
              <p className="bento-full-title">{track.name}</p>
            </div>
            <button type="button" className="bento-close" ref={closeRef} onClick={close}>
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="bench-canvas">
            <div className="bench-canvas-head">
              <span>{track.name}</span>
              <span>{track.where}</span>
            </div>
            <ol
              className="bench-flow"
              style={{ "--n": track.steps.length } as React.CSSProperties}
            >
              {track.steps.map((s, i) => (
                <li key={s.name} style={{ "--i": i } as React.CSSProperties}>
                  <span className="bench-step-name">{s.name}</span>
                  <span className="bench-step-note">{s.note}</span>
                </li>
              ))}
            </ol>
            <div className="bench-notes">
              <p className="bench-note">{track.notes[0]}</p>
              <p className="bench-note bench-note-2">{track.notes[1]}</p>
            </div>
            <div className="bench-tags">
              {track.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="bench-log" aria-live="polite">
            {track.log.slice(0, shown).map((l, i) => (
              <div key={`${track.id}-${i}`} className={`bench-line bench-${l.k}`}>
                <span aria-hidden="true">
                  {l.k === "cmd" ? "›" : l.k === "ok" ? "✓" : l.k === "warn" ? "!" : "·"}
                </span>
                {l.t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
