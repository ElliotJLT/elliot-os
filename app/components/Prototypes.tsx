"use client";

import { useRef, useState } from "react";

type Shot = { label: string; src: string; alt: string };

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
  shots: Shot[];
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
    shots: [
      {
        label: "Wording matched",
        src: "work/lease-citations.jpg",
        alt: "An answer about rent review with numbered citation markers inline, and the lease open beside it with the cited Review Dates definition highlighted",
      },
      {
        label: "Not located",
        src: "work/lease-not-located.jpg",
        alt: "An answer about contamination where one citation is drawn as a dashed marker, and the inspector says its quoted wording could not be matched in the document",
      },
    ],
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
    shots: [
      {
        label: "Interview",
        src: "work/persona-interview.jpg",
        alt: "An interview with a simulated respondent: claims in the reply carry solid numbered markers, one carries a dashed marker, and a later reply says the question is a guess rather than data",
      },
      {
        label: "Population",
        src: "work/persona-society.jpg",
        alt: "A simulated survey result beside a graph of 251 respondents, coloured by the season they chose and clustered with others who answered alike",
      },
    ],
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
    shots: [
      {
        label: "Walkthrough",
        src: "work/nursing-walkthrough.jpg",
        alt: "Step one of the walkthrough: a nurse's phone shows a visit that took 65 minutes against 25 planned, and the assistant saying her remaining visits need more time than her shift has left",
      },
    ],
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
          <ProtoCard proto={proto} basePath={basePath} />
        </div>
      ))}
    </div>
  );
}

function ProtoCard({ proto, basePath }: { proto: Prototype; basePath: string }) {
  const [shown, setShown] = useState(0);
  const shot = proto.shots[shown];

  return (
    <article className="proto">
      <figure className="proto-shot">
        <a href={`${basePath}/${shot.src}`} aria-label={`${shot.label}, full size`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${basePath}/${shot.src}`} alt={shot.alt} width={1600} height={1000} loading="lazy" />
        </a>
        {proto.shots.length > 1 && (
          <div className="proto-tabs" role="group" aria-label="Screens">
            {proto.shots.map((s, i) => (
              <button
                key={s.label}
                type="button"
                aria-pressed={i === shown}
                onClick={() => setShown(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </figure>
      <div className="proto-text">
        <p className="proto-eyebrow">{proto.eyebrow}</p>
        <p className="proto-label">Problem</p>
        <p className="proto-body">{proto.problem}</p>
        <p className="proto-label">What I built</p>
        <p className="proto-body">{proto.built}</p>
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
