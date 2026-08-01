import Link from "next/link";
import { getLog, getFirstCommit } from "@/lib/gitlog";
import { getByHand } from "@/lib/content";
import { getContributions } from "@/lib/contributions";
import Calendar from "./components/Calendar";
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

/**
 * The work itself, on the front page. It used to live behind a link that said
 * "go and look at /built", so anyone scanning the homepage learned a headline,
 * a paragraph and four nav items. Specifics scan; a promise of specifics does
 * not. Ordered by what carries the most weight, not by recency.
 */
const WORK: {
  name: string;
  href: string;
  meta: string;
  claim: string;
}[] = [
  {
    name: "Zero Gravity AI STEM tutor",
    href: "https://www.zerogravity.co.uk/tutor",
    meta: "in production · App Store",
    claim:
      "Coaches a student to the answer and refuses to hand it over. Marking tested against official mark schemes took accuracy from a ~67% bare-model baseline to over 99%. Four STEM subjects, every major UK exam board, first commit to store in 45 days.",
  },
  {
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    meta: "published evals",
    claim:
      "Separates a real safeguarding disclosure from a child having a bad day, grounded in KCSIE rather than keyword matching. 90% recall at 100% precision, against 50/83 for a keyword baseline.",
  },
  {
    name: "argus",
    href: "/built",
    meta: "private fleet · daily",
    claim:
      "Five agents that read a few hundred sources a day and brief me before I sit down. Ingest is immutable and the corpus only appends, so notes thicken instead of being overwritten. When I disagree with one, my correction is written back as the position.",
  },
  {
    name: "crux",
    href: "https://elliotjlt.github.io/crux/research.html",
    meta: "ongoing research",
    claim:
      "Logs what a human rejected, redirected or killed while the model did the typing. Method, results run on myself, objections and limitations all published.",
  },
  {
    name: "boulot",
    href: "https://github.com/ElliotJLT/boulot-os",
    meta: "open source",
    claim:
      "Three agents with opposing briefs argue over a CV before it is allowed out. I ran my own search through it, then open-sourced it.",
  },
  {
    name: "homebuyer-mcp",
    href: "https://github.com/ElliotJLT/homebuyer-mcp",
    meta: "MCP server · 11 tools",
    claim:
      "Conveyancers and mortgage brokers vetted against live SRA, FCA and Companies House registers, plus stamp duty, lease checks and title register analysis.",
  },
];

export default async function Home() {
  const contrib = await getContributions();
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
            {/* The site's mark, traced. It was stranded on /loops; the page
                is about a loop, so the loop opens it. pathLength normalises
                the dash to the path so the animation does not depend on the
                curve's measured length. */}
            <svg
              className="railmark"
              viewBox="0 0 84 48"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M42 24 C42 9 58 5 68 11 C78 17 78 31 68 37 C58 43 42 39 42 24 C42 9 26 5 16 11 C6 17 6 31 16 37 C26 43 42 39 42 24 Z"
                pathLength={100}
              />
            </svg>
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
          <p className="statement">
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
        </Reveal>

        <Reveal>
          <h2>the work</h2>
          <ul className="work">
            {WORK.map((w) => (
              <li key={w.name}>
                <div className="wtop">
                  <a className="wname" href={w.href}>
                    {w.name}
                  </a>
                  <span className="wmeta">{w.meta}</span>
                </div>
                <p className="wclaim">{w.claim}</p>
              </li>
            ))}
          </ul>
          <p className="muted wmore">
            <Link href="/built">
              All of it, with what each piece decides and refuses to do
            </Link>
            .
          </p>
        </Reveal>

        <Reveal>
          <h2>what I am doing now</h2>
          <div
            className="prose byhand"
            dangerouslySetInnerHTML={{ __html: byHand }}
          />
        </Reveal>

        {contrib && (
          <Reveal>
            <h2>the year</h2>
            <Calendar data={contrib} />
            <p className="muted calnote">
              {contrib.total.toLocaleString()} contributions in the twelve
              months to {contrib.to}, and{" "}
              <b>
                {Math.round((contrib.last90 / contrib.total) * 100)}% of them
                fall in the last ninety days
              </b>
              . That is the stretch since I left Zero Gravity: ward, crux,
              boulot and this site were all built inside it. The longest
              unbroken run is {contrib.longestStreak} days. Pulled from the
              public GitHub calendar at build, so you can check it.
            </p>
          </Reveal>
        )}

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

        {/* The seven-day figure used to come from a second, unauthenticated
            call to the events API. That endpoint rate-limits at 60 requests
            an hour, and when it did the page rendered a confident "0 commits
            in the last seven days" directly under a graph showing the
            opposite. It is now derived from the calendar already fetched
            above: one source, no second failure mode, and the two numbers
            cannot disagree. */}
        <p className="receipts faint mono">
          Live since {since}.
          {contrib
            ? ` ${contrib.days
                .slice(-7)
                .reduce((s, d) => s + d.count, 0)
                .toLocaleString()} contributions in the last seven days.`
            : ""}{" "}
          Rebuilt {rebuilt} UTC{log[0] ? ` at ${log[0].hash}` : ""}.
        </p>
      </div>
    </main>
  );
}
