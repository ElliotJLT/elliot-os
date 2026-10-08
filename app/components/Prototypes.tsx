"use client";

import { useState } from "react";

type Shot = { label: string; src: string; alt: string };

type Prototype = {
  /** Who set it, what kind of task, and when. */
  eyebrow: string;
  title: string;
  /** The problem and what I built, in one or two plain sentences. */
  blurb: string;
  checked: string;
  rejected: string;
  decides: string;
  shots: Shot[];
  links: { label: string; href: string }[];
};

const PROTOTYPES: Prototype[] = [
  {
    eyebrow: "Legal AI · prototype · Aug 2026",
    title: "Citations a lawyer can check in one click",
    blurb:
      "I took a document Q&A app for property lawyers whose \"sources cited\" badge was a regex over the model's own reply, and replaced it with citations the server has to find in the lease before they show.",
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
    eyebrow: "Community nursing · prototype · Sep 2026",
    title: "When a district nurse's afternoon stops fitting",
    blurb:
      "A service blueprint and a working walkthrough for a district nursing team: a visit overruns, the assistant shows the shortfall, and a named nurse decides who waits.",
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

/**
 * Prototypes in domains where a wrong answer costs someone. Each card leads
 * with the screen, then the site's own question: what the code checks, what
 * was ruled out, and who decides.
 */
export default function Prototypes({ basePath = "" }: { basePath?: string }) {
  return (
    <div className="bento protos">
      <div className="protos-grid">
        {PROTOTYPES.map((proto) => (
          <ProtoCard key={proto.title} proto={proto} basePath={basePath} />
        ))}
      </div>
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
      <p className="proto-eyebrow">{proto.eyebrow}</p>
      <h3 className="proto-title">{proto.title}</h3>
      <p className="proto-blurb">{proto.blurb}</p>
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
      {proto.links.length > 0 && (
        <p className="proto-links">
          {proto.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label} ↗
            </a>
          ))}
        </p>
      )}
    </article>
  );
}
