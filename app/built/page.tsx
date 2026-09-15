import { getRepos, FEATURED } from "@/lib/github";
import ArgusFlow from "../components/ArgusFlow";
import Reveal from "../components/Reveal";
import HoverLabel from "../components/HoverLabel";
import ProductPortfolio from "../components/ProductPortfolio";

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
  ward: {
    title: "ward",
    blurb:
      "A safeguarding layer for LLM apps that serve under-18s. It screens each message for a genuine disclosure, separates that from ordinary bad conduct, and routes the real ones to a named human on a clock. Grounded in KCSIE rather than generic content moderation. Built around the precision problem: page a Designated Safeguarding Lead on every false alarm and they stop trusting the alerts, which is worse than having none. On its published synthetic eval sets, the Claude judge reaches 90% recall at 100% precision and a 0% false-positive rate, against a keyword baseline at 50/83/8.6.",
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

export default async function Built() {
  const repos = await getRepos();
  const byName = new Map(repos.map((r) => [r.name, r]));

  return (
    <main className="built-page">
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">Built</span>
              <h1 className="wr-title rv-settle">
                I build the product and the way the team ships it.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Find the wider problem beneath the request, then stay close to
              the code and the team until users can depend on it.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="production" className="mai-kick rv-settle">
            selected product work
          </h2>
          <p className="muted rv-settle section-line">
            Four products in production. The bet and the proof on each card;
            Problem or Bet opens the full story.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <ProductPortfolio basePath={basePath} />
          </div>
        </Reveal>

        <Reveal>
          <figure className="build-photo build-photo-built rv-settle">
            <div className="build-photo-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/building-with-the-team.jpg`}
                alt="Elliot leaning over a laptop while working with another person"
                width={1920}
                height={1280}
              />
            </div>
            <figcaption>
              I work through the prototype with the person at the keyboard.
            </figcaption>
          </figure>
        </Reveal>

        <div id="independent-work" className="anchor-target" />
        <Reveal>
          <h2 id="argus" className="mai-kick rv-settle">
            argus
          </h2>
          <p className="muted rv-settle section-line">
            My private research system. Code fetches, deduplicates and files;
            one model call decides whether a source is kept and which view it
            moves.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <ArgusFlow />
          </div>
        </Reveal>

        <Reveal>
          <h2 id="research" className="mai-kick rv-settle">
            research
          </h2>
          <p className="muted rv-settle section-line">
            What the human decided while the model typed, measured.
          </p>
        </Reveal>
        <Reveal>
          <div className="research-card rv-settle">
            <h3>
              <a href="https://elliotjlt.github.io/crux/research.html">
                crux
              </a>
            </h3>
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
        </Reveal>

        <Reveal>
          <h2 id="agent-tools" className="mai-kick rv-settle">
            agent tools
          </h2>
          <p className="muted rv-settle section-line">
            Open source, built for my own agent work: skills, hooks, MCP
            servers and a safeguarding layer with published evals.
          </p>
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
          <h2 className="mai-kick rv-settle">ideas or feedback?</h2>
          <p className="muted rv-settle section-line">
            argus and LifeOS are real but private. Ask me about either:{" "}
            <a href="mailto:elliotjlittle@gmail.com">
              elliotjlittle@gmail.com
            </a>
            .
          </p>
        </Reveal>
      </div>
    </main>
  );
}
