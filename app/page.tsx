import Link from "next/link";
import { getSpend, getWeekActivity } from "@/lib/telemetry";
import { getLog, getFirstCommit } from "@/lib/gitlog";
import { getRoadmap } from "@/lib/content";
import { getRepos, FEATURED } from "@/lib/github";
import FitConsole, { type ConsoleData } from "./components/FitConsole";
import Sparkline from "./components/Sparkline";
import Reveal from "./components/Reveal";

function uptime(iso: string): string {
  const d = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
  return `${d}d`;
}

export default async function Home() {
  const [week, spend, log, repos] = [
    await getWeekActivity(),
    getSpend(),
    getLog(6),
    await getRepos(),
  ];
  const built = new Date().toISOString().slice(0, 16).replace("T", " ");
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
      "A production AI tutor that beat major US labs to a government tender, plus agent tools and MCP servers. The repo list is pulled live from GitHub at every deploy.",
    ],
    [
      "/now",
      "now",
      "This week's shipping log, derived from real commits by a scheduled agent — plus one hand-written section for the things git can't see.",
    ],
    [
      "/next",
      "next",
      "The public roadmap. Bets marked exploring, building, or shipped. Items graduate in the open; missed promises stay visible.",
    ],
    [
      "/loops",
      "loops",
      "The agent loops that maintain this site: cadence, cost, the human approval gate, and the stopping rule on each.",
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
          <p className="lede">
            I&apos;m Elliot — a builder-operator in London and 4x founding
            hire. Most recently I shipped a production multi-agent AI tutor
            that took marking accuracy from a <strong>67% baseline to 99%+</strong>{" "}
            and won a UK government tender against major US labs. This page is
            instrumented like my products: the numbers are computed from real
            activity, an agent maintains parts of it under its own git
            identity, and every token it spends is on the record.
          </p>
          <div className="systemline">
            <span>
              uptime <b>{uptime(first.iso)}</b>
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
              agent tokens <b>{tokens.toLocaleString()}</b>
            </span>
          </div>
        </div>

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
                  ? "deterministic runs only — no model calls yet"
                  : `${spend.totals.runs} runs metered`}
              </span>
            </div>
          </div>
          <p className="faint mono receipts">
            computed at build time from the GitHub API, data/spend.json, and
            git history. rebuilt {built} UTC{log[0] ? ` @ ${log[0].hash}` : ""}.
            no analytics, no cookies, nothing hand-typed.
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
