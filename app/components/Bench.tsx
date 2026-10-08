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
 * How the work runs, as one bento: the three systems with a number worth
 * opening, then whatever link cards the page passes in (research, the
 * commit graph, the tools people use). Open a system and it fills the
 * whole bubble with its flow, its rules and its run log. Every line in a
 * log is something that happened; nothing here is sample data.
 */
export default function Bench({ children }: { children?: React.ReactNode }) {
  const TRACKS: Track[] = [
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
        { k: "ok", t: "5.2 merged PRs per engineer per week · 1.8h to merge" },
        { k: "info", t: "LinearB 2026, 8.1M PRs: elite is above 2.0 a week, cycle time under 25h" },
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
        { k: "ok", t: "marking accuracy 67% → 99%+ against the schemes" },
        { k: "info", t: "every session graded against the Socratic spec" },
        { k: "warn", t: "confident marking the scheme didn't back up" },
        { k: "ok", t: "caught · now a case in the suite" },
        { k: "ok", t: "teacher flag → new case" },
        { k: "info", t: "safeguarding: detection first, then the noise cut" },
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


  return (
    <div className="bento" ref={bubbleRef}>
      <div className="bento-grid" hidden={!!track}>
        <div className="bento-intro">
          <p className="bento-kick">
            <strong>Run</strong> it, and keep it honest
          </p>
          <p>Checks that gate every change, agents that run before anyone is up, and the research anyone can read.</p>
        </div>
        {card(
          "evals",
          "",
          "Evals",
          "Marked against the exam board's own schemes. Every teacher flag becomes a test case.",
          <span className="v-stat">
            <b>99%+</b>
            <em>marking accuracy, up from 67%</em>
          </span>,
        )}
        {card(
          "ways-of-working",
          "",
          "Ways of working",
          "Six product engineers, no requirements layer, PRs merged in under two hours. The prototype is the spec.",
          <span className="v-stat">
            <b>5.2</b>
            <em>merged PRs per engineer, per week</em>
            <em className="v-bench">elite teams: 2.0 · LinearB, 8.1M PRs</em>
          </span>,
        )}
        {card(
          "agent-fleet",
          "",
          "Agent fleet",
          "Monitoring, triage and fix PRs done by 06:00. Agents route; a person ships or bins it.",
          <span className="v-log">
            <span>✓ error triage → fix PR</span>
            <span>✓ review agent verified it</span>
            <span>· pulse posted for Friday</span>
          </span>,
        )}
        {children}
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
