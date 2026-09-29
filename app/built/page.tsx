import { getRepos, FEATURED } from "@/lib/github";
import Reveal from "../components/Reveal";
import HoverLabel from "../components/HoverLabel";
import ProductPortfolio from "../components/ProductPortfolio";
import Bench from "../components/Bench";
import FoldHero from "../components/FoldHero";
import { getEvals } from "@/lib/evals";

export const metadata = { title: "Built · Elliot Little" };

const basePath = process.env.BASE_PATH || "";

const BLURBS: Record<string, { title: string; blurb: string }> = {
  "boulot-os": {
    title: "boulot",
    blurb:
      "A free, local career system that keeps your experience, applications and outcomes on your own machine. It learns which claims earn a reply and carries that evidence into the next application.",
  },
  "Claude-Skill-Potions": {
    title: "claude-skill-potions",
    blurb:
      "Curated Claude Code skills for ops and product workflows. The skills directory is 40k+ deep; these are the ones that actually work.",
  },
  "dog-years": {
    title: "dog-years",
    blurb:
      "Agents estimate in human weeks: ask for a plan and you get \"Phase 1: Weeks 1–2\" from something that can start now. The experiments that found the reflex, and a Claude Code skill that separates agent work from human waiting.",
  },
  vox: {
    title: "vox",
    blurb:
      "Voice of Customer research agent. Eight days of PM research in eight minutes: JTBD, personas, opportunity mapping from Gong, Granola and Jiminy data.",
  },
  dabble: {
    title: "dabble",
    blurb:
      "Visual editor for server-rendered (Hotwire) apps. Edit the running app in place, write real ERB. Kills the design-to-code handoff for the stacks React-first tools ignore.",
  },
  "homebuyer-mcp": {
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

/** Marks for the two research cards: a fork for the decision crux records,
 *  a shield for ward. Same shell as the company logos so the row reads as one. */
function ResearchIcon({ name }: { name: "crux" | "ward" }) {
  return (
    <span className="portfolio-logo-shell research-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {name === "crux" ? (
          <>
            <path d="M12 20V11" />
            <path d="M12 11L6 5" />
            <path d="M12 11l6-6" />
            <circle cx="6" cy="5" r="1.6" />
            <circle cx="18" cy="5" r="1.6" />
            <circle cx="12" cy="20" r="1.6" />
          </>
        ) : (
          <>
            <path d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3z" />
            <path d="M9 12l2 2 4-4" />
          </>
        )}
      </svg>
    </span>
  );
}

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
        title="I build the product and the way the team ships it."
        standfirst="Find the wider problem beneath the request, then stay close to the code and the team until users can depend on it."
      />
      <div className="mai built-body">

        <Reveal>
          <h2 id="production" className="mai-kick rv-settle">
            01 · what I shipped
          </h2>
          <p className="sec-title rv-settle">Seven things I&apos;ve built, newest first.</p>
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
          <h2 id="systems" className="mai-kick rv-settle">
            02 · how the work runs
          </h2>
          <p className="sec-title rv-settle">
            The harness around the agents, and the team around the harness.
          </p>
          <p className="muted rv-settle section-line">
            Shipping an agent is the easy part. These are the systems I set up
            to keep them reliable, governed and improving. Pick one to see it
            run.
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
            03 · in the open
          </h2>
          <p className="sec-title rv-settle">What I&apos;m building now, where you can check it.</p>
          <p className="muted rv-settle section-line">
            Two pieces of published research, the tools I use on my own agent
            work, and the commits behind them.
          </p>
        </Reveal>
        <Reveal>
          <div className="research-grid rv-settle">
            <div className="research-card">
              <div className="research-card-head">
                <ResearchIcon name="crux" />
                <h3>
                  <a href="https://elliotjlt.github.io/crux/research.html">
                    crux
                  </a>
                </h3>
              </div>
              <p>
                You are shipping faster than ever. Are you getting sharper, or
                just carried? Nothing measures that. I noticed it in myself at
                Zero Gravity: faster than I had ever shipped, and slower to say
                what I would have done differently.
              </p>
              <p>
                crux measures it. A Claude Code hook reads each session and
                extracts what the human decided: what got rejected, redirected
                or killed while the model typed. Published as research, with
                the method, results run on myself, objections and limitations.
              </p>
              <div className="meta">
                <a href="https://elliotjlt.github.io/crux/research.html">
                  read the research
                </a>{" "}
                · <a href="https://github.com/ElliotJLT/crux">repo</a>
              </div>
            </div>

            <div className="research-card">
              <div className="research-card-head">
                <ResearchIcon name="ward" />
                <h3>
                  <a href="https://github.com/ElliotJLT/ward">ward</a>
                </h3>
              </div>
              <p>
                When a child tells an app something serious, a named human has
                to see it on a clock. The tempting metric is recall: catch
                everything. But a safeguarding lead paged on every false alarm
                stops trusting the alerts, which is worse than none.
              </p>
              <p>
                ward is built around that asymmetry. It separates a genuine
                disclosure from ordinary bad conduct, grounded in KCSIE rather
                than keyword matching, and routes the real ones to a person.
                On its published synthetic sets the Claude judge reaches 90%
                recall at 100% precision, against 50% and 83% for keywords.
              </p>
              <div className="meta">
                <a href="https://github.com/ElliotJLT/ward">repo and evals</a>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h3 id="agent-tools" className="built-sub rv-settle">
            Agent tools: skills, hooks, MCP servers and a local career system
          </h3>
        </Reveal>
        <Reveal>
          <div className="toollist rv-settle">
            {FEATURED.map((name) => {
              const meta = BLURBS[name];
              const repo = byName.get(name);
              return (
                <HoverLabel label="View →" key={name}>
                  <a
                    className="toolrow"
                    href={repo?.html_url || `https://github.com/ElliotJLT/${name}`}
                  >
                    <span className="toolrow-no" aria-hidden="true" />
                    <div>
                      <h3>{meta.title}</h3>
                      <p>{meta.blurb}</p>
                      {repo && (
                        <div className="meta">
                          {repo.stargazers_count > 0 &&
                            `★ ${repo.stargazers_count} · `}
                          last pushed {repo.pushed_at.slice(0, 10)}
                        </div>
                      )}
                    </div>
                  </a>
                </HoverLabel>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <h3 className="built-sub rv-settle">The commits behind it</h3>
          <div className="rv-settle built-snake">
            <figure className="github-snake">
              <a
                className="github-snake-link"
                href="https://github.com/ElliotJLT"
                aria-label="See ElliotJLT's contribution history on GitHub"
              >
                <figcaption>
                  <span className="github-snake-label">GitHub activity</span>
                  <span className="github-snake-meta">updated daily</span>
                </figcaption>
                {/* Both assets are generated from the live contribution graph
                    during every deploy. Two images let the site's explicit
                    theme toggle choose the right palette. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="github-snake-image github-snake-light"
                  src={`${basePath}/github-snake.svg`}
                  alt="Animated GitHub contribution grid for ElliotJLT over the past year"
                  width={880}
                  height={192}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="github-snake-image github-snake-dark"
                  src={`${basePath}/github-snake-dark.svg`}
                  alt="Animated GitHub contribution grid for ElliotJLT over the past year"
                  width={880}
                  height={192}
                />
              </a>
            </figure>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
