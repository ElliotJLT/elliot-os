import { getRepos, FEATURED } from "@/lib/github";
import Reveal from "../components/Reveal";
import ProductPortfolio from "../components/ProductPortfolio";
import Bench from "../components/Bench";
import Prototypes from "../components/Prototypes";
import FoldHero from "../components/FoldHero";
import { getEvals } from "@/lib/evals";

export const metadata = { title: "Built · Elliot Little" };

const basePath = process.env.BASE_PATH || "";

const BLURBS: Record<string, { title: string; short?: string; blurb: string }> = {
  "boulot-os": {
    short: "a local career system that learns which claims earn a reply",
    title: "boulot",
    blurb:
      "A free, local career system that keeps your experience, applications and outcomes on your own machine. It learns which claims earn a reply and carries that evidence into the next application.",
  },
  "Claude-Skill-Potions": {
    short: "curated Claude Code skills that actually hold up",
    title: "claude-skill-potions",
    blurb:
      "Curated Claude Code skills for ops and product workflows. The skills directory is 40k+ deep; these are the ones that actually work.",
  },
  "dog-years": {
    short: "why agents plan in human weeks, and a skill that stops it",
    title: "dog-years",
    blurb:
      "Agents estimate in human weeks: ask for a plan and you get \"Phase 1: Weeks 1–2\" from something that can start now. The experiments that found the reflex, and a Claude Code skill that separates agent work from human waiting.",
  },
  vox: {
    short: "voice-of-customer research agent",
    title: "vox",
    blurb:
      "Voice of Customer research agent. Eight days of PM research in eight minutes: JTBD, personas, opportunity mapping from Gong, Granola and Jiminy data.",
  },
  dabble: {
    short: "visual editor for Hotwire apps",
    title: "dabble",
    blurb:
      "Visual editor for server-rendered (Hotwire) apps. Edit the running app in place, write real ERB. Kills the design-to-code handoff for the stacks React-first tools ignore.",
  },
  "homebuyer-mcp": {
    short: "UK home-buying MCP server, eleven tools",
    title: "homebuyer-mcp",
    blurb:
      "UK home-buying MCP server. Conveyancers and mortgage brokers from live SRA, FCA and Companies House registers, plus stamp duty, lease checks, survey explainers and title register analysis. Eleven tools.",
  },
  crux: {
    title: "crux",
    blurb:
      "AI writes the code; humans make the calls. Crux records which calls were made and why, during AI-assisted development, so you can audit and learn from them.",
  },
  hooksmith: {
    title: "hooksmith",
    blurb:
      "Browse and install pre-built Claude Code hooks with one command. Twelve hooks, zero config. The missing package manager for hooks.",
  },
};

const SECTIONS = [
  { id: "production", n: "01", label: "What I shipped" },
  { id: "prototypes", n: "02", label: "Prototypes" },
  { id: "systems", n: "03", label: "How the work runs" },
  { id: "research", n: "04", label: "In the open" },
];

export default async function Built() {
  const evalRuns = getEvals().runs;
  const latestRun = evalRuns[0];
  const firstRun = evalRuns[evalRuns.length - 1];
  const repos = await getRepos();
  const byName = new Map(repos.map((r) => [r.name, r]));

  return (
    <main className="built-page">
      <FoldHero
        src={`${basePath}/building-with-the-team.jpg`}
        alt="Elliot leaning over a laptop while working with another person"
        caption="Working through the prototype with the person at the keyboard."
        kicker="Built"
        title="I build the product and the operation around it."
        standfirst="Find the wider problem beneath the request, then stay close to the code and the team until users can depend on it."
      />
      <div className="mai built-body">
        <nav className="built-index" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              <span>{s.n}</span> {s.label}
            </a>
          ))}
        </nav>

        <Reveal>
          <h2 id="production" className="mai-kick rv-settle">
            01 · what I shipped
          </h2>
          <p className="sec-title rv-settle">Eleven things I&apos;ve built, newest first.</p>
          <p className="muted rv-settle section-line">
            Open one for the problem, the bet and the proof.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <ProductPortfolio basePath={basePath} />
          </div>
        </Reveal>


        <Reveal>
          <h2 id="prototypes" className="mai-kick rv-settle">
            02 · prototypes
          </h2>
          <p className="sec-title rv-settle">Three prototypes for people who can&apos;t afford a wrong answer.</p>
          <p className="muted rv-settle section-line">
            A lawyer relying on a citation, a researcher quoting a synthetic respondent, a nurse whose afternoon has run over. Same rule in each: code checks, a named person decides.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <Prototypes basePath={basePath} />
          </div>
        </Reveal>

        <Reveal>
          <h2 id="systems" className="mai-kick rv-settle">
            03 · how the work runs
          </h2>
          <p className="sec-title rv-settle">
            The harness around the agents, and the team around the harness.
          </p>
          <p className="muted rv-settle section-line">
            Pick one to see it run.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <Bench firstRun={firstRun} latestRun={latestRun} />
          </div>
        </Reveal>

        <div id="independent-work" className="anchor-target" />
        <Reveal>
          <h2 id="research" className="mai-kick rv-settle">
            04 · in the open
          </h2>
          <p className="sec-title rv-settle">What I&apos;m building now, where you can check it.</p>
        </Reveal>
        <Reveal>
          <div className="bento open-bento rv-settle">
            <div className="bento-grid">
              <div className="bento-intro">
                <p className="bento-kick">
                  <strong>Open</strong> work
                </p>
                <p>Research with the method published, the tools I use every day, and the commits behind them.</p>
              </div>

              <a className="bento-card" href="https://elliotjlt.github.io/crux/research.html">
                <span className="bento-visual" aria-hidden="true">
                  <span className="v-checks">
                    <span><b>✗</b> what got rejected</span>
                    <span><b>↻</b> what got redirected</span>
                    <span><b>·</b> what got killed, and why</span>
                  </span>
                </span>
                <span className="bento-title">crux · research</span>
                <span className="bento-blurb">Measures the calls a person makes while the model types. Run on my own sessions, with the objections published.</span>
                <span className="bento-open" aria-hidden="true">Read the research ↗</span>
              </a>

              <a className="bento-card" href="https://github.com/ElliotJLT/ward">
                <span className="bento-visual" aria-hidden="true">
                  <span className="v-bars">
                    <span>
                      <em>judge</em>
                      <i style={{ "--w": "90%" } as React.CSSProperties} />
                      <b>90%</b>
                    </span>
                    <span>
                      <em>keywords</em>
                      <i style={{ "--w": "50%" } as React.CSSProperties} />
                      <b>50%</b>
                    </span>
                  </span>
                </span>
                <span className="bento-title">ward · research</span>
                <span className="bento-blurb">Safeguarding for apps children use. Recall on the published synthetic sets: 90% at 100% precision, against 50% at 83% for keyword matching.</span>
                <span className="bento-open" aria-hidden="true">Method and evals ↗</span>
              </a>

              <a className="bento-card span-2 open-snake" href="https://github.com/ElliotJLT">
                <span className="bento-visual" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="github-snake-image github-snake-light" src={`${basePath}/github-snake.svg`} alt="" width={880} height={192} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="github-snake-image github-snake-dark" src={`${basePath}/github-snake-dark.svg`} alt="" width={880} height={192} />
                </span>
                <span className="bento-title">GitHub activity · updated daily</span>
                <span className="bento-blurb">The commits behind all of it, over the last year.</span>
                <span className="bento-open" aria-hidden="true">github.com/ElliotJLT ↗</span>
              </a>

              <div id="agent-tools" className="bento-card open-tools">
                <span className="bento-title">Agent tools</span>
                <ul>
                  {FEATURED.map((name) => {
                    const meta = BLURBS[name];
                    const repo = byName.get(name);
                    return (
                      <li key={name}>
                        <a href={repo?.html_url || `https://github.com/ElliotJLT/${name}`}>{meta.title}</a>
                        <span>{meta.short}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
