import Link from "next/link";
import { getWeekActivity } from "@/lib/telemetry";
import { getLog, getFirstCommit } from "@/lib/gitlog";
import { getByHand } from "@/lib/content";
import Reveal from "./components/Reveal";

const basePath = process.env.BASE_PATH || "";

// Four sections, one voice. The numbers live in a sentence at the bottom
// rather than in tiles at the top: they are evidence for the claim, not the
// claim itself.
const INDEX: [string, string, string][] = [
  [
    "/built",
    "built",
    "A production AI tutor, a safeguarding layer for apps serving under-18s, and the agent tooling underneath both. What each piece decides, and what it refuses to do.",
  ],
  [
    "/writing",
    "writing",
    "Essays on shipping AI to people who cannot absorb a wrong answer, on trust and adoption, and on where responsible-AI-by-checklist breaks.",
  ],
  [
    "/loops",
    "loops",
    "The agents that maintain this site: their cadence, their cost, the human gate on each, and the rule that stops them.",
  ],
  [
    "/changelog",
    "changelog",
    "Every change is a commit, badged by whether a human or an agent made it. The receipt trail for anything claimed above.",
  ],
];

export default async function Home() {
  const week = await getWeekActivity();
  const log = getLog(1);
  const byHand = getByHand();
  const first = getFirstCommit();

  const rebuilt = new Date().toISOString().slice(0, 16).replace("T", " ");
  const since = new Date(first.iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <main>
      {/* Two tracks on a wide screen: a rail carrying section marks and
          margin notes, and the reading measure. The headline breaks across
          both; the body indents off it. Below 1020px it is one column and
          the rail's contents fall back inline. */}
      <div className="railpage">
        <h1 className="rise">
          <span className="lead">Shipping got easy.</span>
          Judgement didn&apos;t.
        </h1>

        <div className="herorow rise rise-2">
          {/* The status the pill used to carry, demoted to marginalia:
              the information was useful, the badge was the problem. */}
          <aside className="railnote">
            <span>London</span>
            <span>Available now</span>
          </aside>
          <p className="lede">
            I&apos;m Elliot. Builder-operator in London, four times a founding
            hire. I spent four years on an AI tutor that coaches a student to
            the answer and refuses to hand it over, and most of my work since
            has been the same problem in different clothes: deciding whether
            what a model produced is good enough to put in front of someone who
            cannot absorb a wrong answer.
          </p>
          {/* Sits in the whitespace the lede's 52ch measure already leaves,
              so it costs the text no width. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="portrait"
            src={`${basePath}/icon-512.png`}
            alt="Elliot Little"
            width={128}
            height={128}
          />
        </div>

        {/* The thread: one continuous line down the gutter with the section
            numbers sitting on it. The page is called the through-line, so it
            has one. */}
        <div className="thread">
        <Reveal>
          <h2>the through-line</h2>
          <p className="muted">
            Models write plausible things now. Checking them didn&apos;t get
            easier, and that is where most of my work has gone. At Zero Gravity
            I built a tutor that coaches a student to the answer and will not
            hand it over, with an evaluator grading every session before a
            student saw the mark.{" "}
            <a href="https://github.com/ElliotJLT/ward">ward</a> separates a
            real safeguarding disclosure from a child having a bad day, which
            is the distinction keyword filters get wrong.{" "}
            <a href="https://elliotjlt.github.io/crux/research.html">crux</a>{" "}
            turns the same question on me: it logs what I rejected in my own
            sessions, so I can tell whether I am still thinking or just
            approving.
          </p>
          <p className="muted">
            <Link href="/built">The work, and what each piece decides</Link>.
          </p>
        </Reveal>

        <Reveal>
          <h2>what I am doing now</h2>
          <div
            className="prose byhand"
            dangerouslySetInnerHTML={{ __html: byHand }}
          />
        </Reveal>

        <Reveal>
          <h2>where to look</h2>
          <ul className="index">
            {INDEX.map(([href, label, body]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
                <p>{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        </div>

        <p className="receipts faint mono">
          Live since {since}. <b>{week.commits}</b> commits across{" "}
          <b>{week.repos}</b> public repos in the last seven days, read from the
          GitHub API at build. Rebuilt {rebuilt} UTC
          {log[0] ? ` at ${log[0].hash}` : ""}.
        </p>
      </div>
    </main>
  );
}
