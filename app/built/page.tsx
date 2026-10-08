import { getRepos } from "@/lib/github";
import Reveal from "../components/Reveal";
import ProductPortfolio from "../components/ProductPortfolio";
import Bench from "../components/Bench";
import Prototypes from "../components/Prototypes";
import FoldHero from "../components/FoldHero";

export const metadata = { title: "Built · Elliot Little" };

const basePath = process.env.BASE_PATH || "";


const SECTIONS = [
  { id: "production", n: "01", label: "What I shipped" },
  { id: "prototypes", n: "02", label: "Prototypes" },
  { id: "systems", n: "03", label: "How the work runs" },
];

export default async function Built() {
  const repos = await getRepos();
  const byName = new Map(repos.map((r) => [r.name, r]));
  const potions = byName.get("Claude-Skill-Potions");

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

        <div id="independent-work" className="anchor-target" />
        <div id="research" className="anchor-target" />
        <Reveal>
          <h2 id="systems" className="mai-kick rv-settle">
            03 · how the work runs
          </h2>
          <p className="sec-title rv-settle">
            The checks, the agents, and the code you can read.
          </p>
          <p className="muted rv-settle section-line">
            Open a system to see it run.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <Bench>
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

              <a className="bento-card span-2 open-snake" href="https://github.com/ElliotJLT">
                <span className="bento-visual" aria-hidden="true">
                  <span className="snake-crop">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="github-snake-image github-snake-light" src={`${basePath}/github-snake.svg`} alt="" width={880} height={192} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="github-snake-image github-snake-dark" src={`${basePath}/github-snake-dark.svg`} alt="" width={880} height={192} />
                  </span>
                </span>
                <span className="bento-title">GitHub · updated daily</span>
                <span className="bento-blurb">Six months of commits behind all of it. The snake eats them.</span>
                <span className="bento-open" aria-hidden="true">github.com/ElliotJLT ↗</span>
              </a>

              <a id="agent-tools" className="bento-card" href={potions?.html_url || "https://github.com/ElliotJLT/Claude-Skill-Potions"}>
                <span className="bento-visual" aria-hidden="true">
                  <span className="v-stat">
                    <b>
                      {potions?.stargazers_count ?? ""}
                      <span className="v-star">★</span>
                    </b>
                    <em>stars on GitHub</em>
                  </span>
                </span>
                <span className="bento-title">claude-skill-potions</span>
                <span className="bento-blurb">Claude Code skills for product and ops work. Out of a directory 40k deep, the ones that hold up.</span>
                <span className="bento-open" aria-hidden="true">The skills ↗</span>
              </a>
            </Bench>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
