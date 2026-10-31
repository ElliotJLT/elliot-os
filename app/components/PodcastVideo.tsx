"use client";

import { useState } from "react";

/** Moments worth jumping to, timed against the YouTube upload. A `said` line
 * is from the episode's captions, trimmed of stutters but not reworded. */
const CLIPS = [
  {
    at: 1856,
    topic: "First prototype",
    said: true,
    line: "We probably hid the LLM magic a little bit too much by trying to make it smart.",
  },
  {
    at: 2060,
    topic: "Guardrails",
    said: true,
    line: "You're asking for trouble giving a school student an empty text box.",
  },
  {
    at: 3374,
    topic: "Safeguarding",
    said: true,
    line: "AI can never make those safeguarding decisions, but it can help us surface certain things.",
  },
  {
    at: 3628,
    topic: "Evals",
    said: false,
    line: "The model told a student applying to a construction firm that their Figma skill made them a perfect fit.",
  },
];

function stamp(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * The episode as a still until someone presses play. Nothing loads from
 * YouTube before that click, so the page keeps its no-third-party promise;
 * after it, the player comes from youtube-nocookie.com. A clip swaps the
 * player to its timestamp.
 */
export default function PodcastVideo({
  id,
  still,
  title,
  children,
}: {
  id: string;
  still: string;
  title: string;
  /** The kicker, headline and standfirst, set beside the player. */
  children: React.ReactNode;
}) {
  const [start, setStart] = useState<number | null>(null);

  return (
    <div className="pod pod-v">
      <div className="pod-v-screen">
        {start === null ? (
          <button
            type="button"
            className="pod-v-play"
            onClick={() => setStart(0)}
            aria-label={`Play: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={still} alt="" />
            <span className="pod-v-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
              <span className="pod-v-len">Watch · 70 min</span>
            </span>
          </button>
        ) : (
          <iframe
            key={start}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${start}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
      </div>

      <div className="pod-v-side">{children}</div>

      <div className="pod-v-clips">
        <span className="pod-v-label">Jump to</span>
        <ol>
          {CLIPS.map((c) => (
            <li key={c.at}>
              <button
                type="button"
                onClick={() => setStart(c.at)}
                aria-current={start === c.at ? "true" : undefined}
              >
                <span className="pod-v-at">{stamp(c.at)}</span>
                <span className="pod-v-topic">{c.topic}</span>
                <span className="pod-v-line">
                  {c.said ? `“${c.line}”` : c.line}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
