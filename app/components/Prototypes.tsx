"use client";

import { useEffect, useRef, useState } from "react";

/** A recording of the prototype in use, with the moments worth jumping to. */
type Clip = {
  src: string;
  poster: string;
  label: string;
  chapters: { label: string; t: number }[];
};

type Prototype = {
  /** Domain, that it's a prototype, and when. */
  eyebrow: string;
  title: string;
  /** What was wrong, specifically enough to picture. */
  problem: string;
  /** What I built in answer to it. */
  built: string;
  checked: string;
  rejected: string;
  decides: string;
  clip: Clip;
  links: { label: string; href: string }[];
};

const PROTOTYPES: Prototype[] = [
  {
    eyebrow: "Prototype · Aug 2026",
    title: "Citations a lawyer can check in one click",
    problem:
      "A document Q&A app for property lawyers showed \"3 sources cited\" under an answer about asbestos, in a lease that never mentions asbestos. The count was a regex over the model's own reply, checked against nothing.",
    built:
      "Every claim carries an inline marker naming its quote, and code locates that quote word for word in the lease. A match jumps to the highlighted passage in one click. A quote it can't find is drawn dashed, against the claim it weakens.",
    checked: "Every quoted passage, located word for word in the document before it renders as evidence.",
    rejected: "Confidence scores and \"stated vs inferred\" labels. Both are the model grading itself.",
    decides: "The lawyer, on whether the wording supports the point.",
    clip: {
      src: "work/video/lease.mp4",
      poster: "work/video/lease.jpg",
      label: "A lawyer asks about rent review. The answer streams in with a marker after each claim; opening one jumps the lease to the highlighted clause, the inspector steps through every source, and one marked not located says its quote could not be found.",
      chapters: [
        { label: "Ask", t: 0 },
        { label: "Answer", t: 5.5 },
        { label: "Open a source", t: 18.3 },
        { label: "Not located", t: 28.7 },
      ],
    },
    links: [
      { label: "Code and decisions", href: "https://github.com/ElliotJLT/lease-citations/blob/main/DECISIONS.md" },
      { label: "The audit", href: "https://github.com/ElliotJLT/lease-citations/blob/main/docs/audit.md" },
    ],
  },
  {
    eyebrow: "Prototype · Jul 2026",
    title: "Persona interviews you can audit",
    problem:
      "Teams survey a population of AI personas, then interview one to find out why they answered as they did. A plain chat renders fluent invention and grounded fact identically, so nobody can tell which replies to trust.",
    built:
      "An interview screen where each claim is marked solid if it traces to the respondent's survey answer or profile, and dashed if the model is reasoning past them. Asked to speak for people who weren't surveyed, the persona says it would be guessing.",
    checked: "Every claim, traced to the respondent's own answer or profile, or marked as reasoning past them.",
    rejected: "A blanket \"all views are fictional\" notice. It concedes the problem and manages none of it.",
    decides: "The researcher, who sees how much of a conversation rested on data before quoting it in a deck.",
    clip: {
      src: "work/video/persona.mp4",
      poster: "work/video/persona.jpg",
      label: "A researcher browses a population of simulated respondents, opens one record and interviews her. Her answer carries numbered markers back to her survey response; asked to speak for her whole team, she says it would be a guess.",
      chapters: [
        { label: "Population", t: 0 },
        { label: "Record", t: 8.6 },
        { label: "Interview", t: 12 },
        { label: "Refusal", t: 21 },
      ],
    },
    links: [
      { label: "Code and reasoning", href: "https://github.com/ElliotJLT/persona-interviews" },
      { label: "Decisions", href: "https://github.com/ElliotJLT/persona-interviews/blob/main/docs/decisions.md" },
    ],
  },
  {
    eyebrow: "Prototype · Sep 2026",
    title: "When a district nurse's afternoon stops fitting",
    problem:
      "A home visit runs 40 minutes over, and the rest of a district nurse's list no longer fits her shift. Someone has to decide who is seen, who waits, and who owns the ones who wait.",
    built:
      "A service blueprint and a working walkthrough. The assistant shows the shortfall and checks each proposed move, a named nurse records the decision with a reason, and any visit that waits lands on tomorrow's list with an owner and a deadline.",
    checked: "Competency, care windows and shift time, in code, before a move reaches a nurse's screen.",
    rejected: "Letting the assistant propose that a patient waits. It flags what it can't place instead.",
    decides: "A named clinician, who records every clinical change with a reason.",
    clip: {
      src: "work/video/nursing.mp4",
      poster: "work/video/nursing.jpg",
      label: "A walkthrough of one afternoon: a nurse's visit overruns and the assistant shows the shortfall, the senior nurse records a conditional decision, and the next morning the deferred visit sits on the register with an owner and a deadline.",
      chapters: [
        { label: "The signal", t: 0 },
        { label: "The decision", t: 14.1 },
        { label: "The follow-up", t: 26.8 },
      ],
    },
    links: [],
  },
];

/** Short tab labels, in the same order as PROTOTYPES. */
const TABS = ["Legal AI", "Synthetic research", "Community nursing"];

/**
 * Prototypes in domains where a wrong answer costs someone, as one panel
 * with a tab per prototype. Three tall cards in a row made this the heaviest
 * block on the page; the labels keep all three in view while only one is
 * read at a time, which is how they get read anyway. Each panel leads with
 * the screen, then the problem and what was built, then what the code
 * checks, what was ruled out, and who decides.
 */
export default function Prototypes({ basePath = "" }: { basePath?: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const next = (i + PROTOTYPES.length) % PROTOTYPES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="bento protos">
      <div className="proto-tablist" role="tablist" aria-label="Prototypes">
        {PROTOTYPES.map((proto, i) => (
          <button
            key={proto.title}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`proto-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`proto-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") select(i + 1);
              if (e.key === "ArrowLeft") select(i - 1);
            }}
          >
            <span className="proto-tab-kick">{TABS[i]}</span>
            <span className="proto-tab-title">{proto.title}</span>
          </button>
        ))}
      </div>
      {PROTOTYPES.map((proto, i) => (
        <div
          key={proto.title}
          role="tabpanel"
          id={`proto-panel-${i}`}
          aria-labelledby={`proto-tab-${i}`}
          hidden={i !== active}
        >
          <ProtoCard proto={proto} basePath={basePath} active={i === active} />
        </div>
      ))}
    </div>
  );
}

function ProtoCard({ proto, basePath, active }: { proto: Prototype; basePath: string; active: boolean }) {
  return (
    <article className="proto">
      <ProtoClip clip={proto.clip} basePath={basePath} active={active} />
      <div className="proto-text">
        <p className="proto-eyebrow">{proto.eyebrow}</p>
        <div>
          <p className="proto-label">Problem</p>
          <p className="proto-body">{proto.problem}</p>
        </div>
        <div>
          <p className="proto-label">What I built</p>
          <p className="proto-body">{proto.built}</p>
        </div>
        {proto.links.length > 0 && (
          <p className="proto-links">
            {proto.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label} ↗
              </a>
            ))}
          </p>
        )}
      </div>
      <dl className="proto-calls">
        <div>
          <dt>Checked</dt>
          <dd>{proto.checked}</dd>
        </div>
        <div>
          <dt>Rejected</dt>
          <dd>{proto.rejected}</dd>
        </div>
        <div>
          <dt>Decides</dt>
          <dd>{proto.decides}</dd>
        </div>
      </dl>
    </article>
  );
}

/**
 * The recording plays muted and on a loop while it is on screen, and stops
 * when it scrolls away or its tab is hidden. Chapters jump to the moments
 * worth seeing and light up as the video passes them. Reduced motion means
 * no autoplay: the poster shows and the play button starts it.
 */
function ProtoClip({ clip, basePath, active }: { clip: Clip; basePath: string; active: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  const [inView, setInView] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Plays only while its tab is the open one and it is on screen.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (!active || !inView) {
      v.pause();
      return;
    }
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
  }, [active, inView]);

  const onTime = () => {
    const t = video.current?.currentTime ?? 0;
    let i = 0;
    clip.chapters.forEach((c, k) => {
      if (t >= c.t) i = k;
    });
    setChapter(i);
  };

  const seek = (t: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = t;
    v.play().catch(() => {});
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className="proto-clip">
      <video
        ref={video}
        src={`${basePath}/${clip.src}`}
        poster={`${basePath}/${clip.poster}`}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={clip.label}
        onTimeUpdate={onTime}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        width={1440}
        height={900}
      />
      <figcaption className="proto-chapters">
        <button type="button" className="proto-play" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2v8H3zM7 2h2v8H7z" /></svg>
          ) : (
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9l7.5-4.5z" /></svg>
          )}
        </button>
        {clip.chapters.map((c, i) => (
          <button
            key={c.label}
            type="button"
            aria-pressed={i === chapter}
            onClick={() => seek(c.t)}
          >
            {c.label}
          </button>
        ))}
      </figcaption>
    </figure>
  );
}
