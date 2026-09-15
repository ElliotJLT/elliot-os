import { getRepos, FEATURED } from "@/lib/github";
import { getLoops } from "@/lib/loops";
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
  const repos = await getRepos();
  const byName = new Map(repos.map((r) => [r.name, r]));
  const argus = getLoops().loops.find((l) => l.id === "argus");

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
            Five products in production. Problem, bet and proof on each card;
            the tutor and the school hub teachers run it through lead.
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
            My private research system, paused since August after 61 morning
            briefs. Code fetches, deduplicates and files. One model call per
            source decides whether it is kept and which view it moves.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <ArgusFlow
              state={
                argus?.status === "paused"
                  ? `paused · last brief ${argus.last_run}`
                  : "live"
              }
            />
          </div>
        </Reveal>

        <Reveal>
          <h2 id="research" className="mai-kick rv-settle">
            research
          </h2>
          <p className="muted rv-settle section-line">
            Two pieces of published checking work: the human in the loop, and
            safeguarding for under-18s. Method, results and limitations open.
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
          <h2 id="agent-tools" className="mai-kick rv-settle">
            agent tools
          </h2>
          <p className="muted rv-settle section-line">
            Open source, built for my own agent work: skills, hooks, MCP
            servers and a local career system.
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
