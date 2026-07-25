import Link from "next/link";
import { getSpend, getWeekActivity } from "@/lib/telemetry";
import { getLog, getFirstCommit } from "@/lib/gitlog";
import { getRoadmap, getByHand } from "@/lib/content";
import { getRepos, FEATURED } from "@/lib/github";
import FitConsole, { type ConsoleData } from "./components/FitConsole";
import Sparkline from "./components/Sparkline";
import Reveal from "./components/Reveal";

const basePath = process.env.BASE_PATH || "";

// The repo's first commit, as a date rather than a day count: "0d" on launch
// day reads like a broken gauge, and the age of the site is not a boast.
function liveSince(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function daysOld(iso: string): number {
  return Math.max(
    1,
    Math.round((Date.now() - new Date(iso).getTime()) / 86400000),
  );
}

export default async function Home() {
  const [week, spend, log, repos] = [
    await getWeekActivity(),
    getSpend(),
    getLog(6),
    await getRepos(),
  ];
  const built = new Date().toISOString().slice(0, 16).replace("T", " ");
  const byHand = getByHand();
  const first = getFirstCommit();
  const tokens = spend.totals.input_tokens + spend.totals.output_tokens;

  const byName = new Map(repos.map((r) => [r.name, r]));
  const consoleData: ConsoleData = {
    spend: spend.totals,
    week: { commits: week.commits, repos: week.repos },
    repos: FEATURED.map((name) => ({
      name,
      stars: byName.get(name)?.stargazers_count ?? 0,
    })),
    log: log.map((e) => ({
      hash: e.hash,
      subject: e.subject,
      agent: e.author.includes("agent"),
    })),
    roadmap: getRoadmap(),
    firstCommit: first,
  };

  const cards: [string, string, string][] = [
    [
      "/built",
      "built",
      "A production AI tutor the UK government selected for its national programme on safe AI tutoring, plus agent tools and MCP servers. The repo list is pulled live from GitHub at every deploy.",
    ],
    [
      "/writing",
      "writing",
      "Essays on shipping AI to users who can't absorb a wrong answer, on trust and adoption, and on where responsible-AI-by-checklist breaks.",
    ],
    [
      "/loops",
      "loops",
      "The agents that maintain this site: cadence, cost, the human approval gate, the stopping rule on each, and the shipping log the inner loop last wrote.",
    ],
    [
      "/changelog",
      "changelog",
      "Every change is a commit, badged by who made it: me or the agent. The receipt trail for every number above.",
    ],
  ];

  return (
    <main>
      <div className="wrap">
        <div className="hero">
          <span className="status">
            <span className="dot" />
            operational · interviewing
          </span>
          <h1>
            I build AI products.
            <br />
            This site is one of them.
          </h1>
          <div className="herorow">
            <p className="lede">
              Builder-operator in London, 4x founding hire. I shipped a
              production AI tutor the UK government selected for its national
              programme on safe AI tutoring. Every number on this page is
              computed from real activity, not claimed.
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
          <div className="systemline">
            <span>
              live since <b>{liveSince(first.iso)}</b>
            </span>
            <span>
              agent identity <b>verified</b>
            </span>
            <span>
              cookies <b>0</b>
            </span>
            <span>
              analytics <b>0</b>
            </span>
            <span>
              source <b>public</b>
            </span>
          </div>
        </div>

        <Reveal>
          <h2>the through-line</h2>
          <p className="muted">
            <b>Understanding is a shipping requirement, not a casualty.</b>{" "}
            Producing plausible output is no longer the hard part; knowing
            whether to ship it still is. I build that layer for the model, in
            evaluators that grade an AI tutor before a student sees a mark and
            a classifier that decides which messages from a child are real
            safeguarding disclosures. I work on it for the person too:{" "}
            <a href="https://elliotjlt.github.io/crux/research.html">crux</a>{" "}
            measures whether judgment is sharpening or quietly eroding while
            the model does the typing.{" "}
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
          <h2>telemetry</h2>
          <div className="statgrid">
            <div className="stat">
              <span className="label">commits · 7d</span>
              <span className="value">{week.commits}</span>
              <Sparkline days={week.days} />
            </div>
            <div className="stat">
              <span className="label">repos touched · 7d</span>
              <span className="value">{week.repos}</span>
              <span className="foot">public repos</span>
            </div>
            <div className="stat">
              <span className="label">agent runs · all time</span>
              <span className="value">{spend.totals.runs}</span>
              <span className="foot">scheduled + on-demand</span>
            </div>
            <div className="stat">
              <span className="label">agent tokens · all time</span>
              <span className="value">{tokens.toLocaleString()}</span>
              <span className="foot">
                {tokens === 0
                  ? "deterministic runs only, no model calls yet"
                  : `${spend.totals.runs} runs metered`}
              </span>
            </div>
          </div>
          <p className="faint mono receipts">
            computed at build time from the GitHub API, data/spend.json, and
            git history. rebuilt {built} UTC{log[0] ? ` @ ${log[0].hash}` : ""}.
            no analytics, no cookies, nothing hand-typed. the shipping log on{" "}
            <Link href="/loops">/loops</Link> shows a lower count: that one is
            frozen at the agent&apos;s last daily run, this one recomputes on
            every deploy.
          </p>
          <p className="muted standing">
            {`Read the token count honestly: this site is ${daysOld(first.iso)} days old and the loops have run ${spend.totals.runs} ${spend.totals.runs === 1 ? "time" : "times"} between them${tokens === 0 ? ", spending nothing so far" : ""}. The metering is wired and the agent commits under its own name, but a daily loop on a site this new has a handful of cycles, not a history. The number moves on its own, and I would rather show it low than round it up.`}
          </p>
        </Reveal>

        <Reveal>
          <h2>fit engine</h2>
          <FitConsole data={consoleData} />
        </Reveal>

        <Reveal>
          <h2>the report</h2>
          <div className="grid">
            {cards.map(([href, title, body], i) => (
              <Link href={href} key={href} className="card">
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
