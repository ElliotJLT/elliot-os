"use client";

import { useEffect, useState } from "react";

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
 * The systems behind the products, as a bench: pick a track on the left,
 * the canvas draws its flow and the log prints its run. Every line in a log
 * is something that happened; nothing here is sample data.
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
        { k: "warn", t: "design PRs waited 5.6 days · gave design a cadence" },
        { k: "info", t: "every review finding lands in .claude/rules" },
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

  const [id, setId] = useState(TRACKS[0].id);
  const [shown, setShown] = useState(TRACKS[0].log.length);
  const track = TRACKS.find((t) => t.id === id) ?? TRACKS[0];

  // The log prints its run line by line when a track opens.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(track.log.length);
      return;
    }
    setShown(0);
    let n = 0;
    const timer = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= track.log.length) window.clearInterval(timer);
    }, 220);
    return () => window.clearInterval(timer);
  }, [id, track.log.length]);

  return (
    <div className="bench">
      <div className="bench-bar">
        <span className="bench-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="bench-path">built / bench / {track.id}</span>
        <span className="bench-ready">ready</span>
      </div>

      <div className="bench-body">
        <nav className="bench-tracks" aria-label="Systems">
          <span className="bench-label">Systems</span>
          {TRACKS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="bench-track"
              aria-pressed={t.id === id}
              onClick={() => setId(t.id)}
            >
              <span className="bench-track-name">{t.name}</span>
              <span className="bench-track-meta">{t.meta}</span>
            </button>
          ))}
        </nav>

        <div className="bench-main">
          <div className="bench-canvas" key={track.id}>
            <div className="bench-canvas-head">
              <span>{track.name}</span>
              <span>{track.where}</span>
            </div>
            <ol
              className="bench-flow"
              style={{ "--n": track.steps.length } as React.CSSProperties}
            >
              {track.steps.map((s, i) => (
                <li
                  key={s.name}
                  style={{ "--i": i } as React.CSSProperties}
                >
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
      </div>

      <div className="bench-foot">
        <span>Six systems, one bench</span>
        <span>Pick one on the left: the canvas draws it, the log prints its run</span>
      </div>
    </div>
  );
}
