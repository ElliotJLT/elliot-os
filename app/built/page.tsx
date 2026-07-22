import { getRepos, FEATURED } from "@/lib/github";

export const metadata = { title: "Built · Elliot Little" };

const BLURBS: Record<string, { title: string; blurb: string }> = {
  "boulot-os": {
    title: "boulot",
    blurb:
      "Open-source career-ops system that runs on your own laptop through Claude Code. Tailors your CV per role, then three adversarial agents (hiring manager, reviewer, strategist) fight over the draft. Built for my own search in a brutal market; it worked, so I open-sourced it.",
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
  "claude-eval-toolkit": {
    title: "claude-eval-toolkit",
    blurb:
      "Evaluation framework for Claude-powered apps. 69 test cases, LLM-as-judge grading, UK education safeguarding baked in. Test your AI before it reaches users.",
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
  const rest = repos.filter((r) => !FEATURED.includes(r.name));

  return (
    <main>
      <div className="wrap">
        <h1>Built</h1>
        <p className="muted">
          The repo list below is fetched from GitHub when this site builds. If
          I ship something, it shows up here without me touching this page.
        </p>

        <h2>in production</h2>
        <div className="card">
          <h3>
            <a href="https://www.zerogravity.co.uk/tutor">
              Zero Gravity AI STEM tutor
            </a>
          </h3>
          <p>
            AI tutor for A-Level students, in production across four STEM
            subjects on every major UK exam board. First commit to live on the
            App Store in 45 days. Multi-agent architecture: coaching,
            practice, marking and assignments each run as their own agent with
            their own pedagogy and evaluator, graded against the Socratic spec
            by an always-on evaluator. The eval infrastructure tested against
            real past papers and official mark schemes, taking marking
            accuracy from a ~67% bare-model baseline to over 99%. It won a
            DSIT tender to bring AI tutoring into disadvantaged state schools,
            scoring ahead of major US labs and the largest UK content
            incumbent. I built and deployed it at Zero Gravity.
          </p>
        </div>

        <h2>agent tools</h2>
        {FEATURED.map((name) => {
          const meta = BLURBS[name];
          const repo = byName.get(name);
          return (
            <div className="card" key={name}>
              <h3>
                <a href={repo?.html_url || `https://github.com/ElliotJLT/${name}`}>
                  {meta.title}
                </a>
              </h3>
              <p>{meta.blurb}</p>
              {repo && (
                <div className="meta">
                  {repo.stargazers_count > 0 && `★ ${repo.stargazers_count} · `}
                  last pushed {repo.pushed_at.slice(0, 10)}
                </div>
              )}
            </div>
          );
        })}

        <h2>everything else</h2>
        <ul className="repolist">
          {rest.map((r) => (
            <li key={r.name}>
              <a href={r.html_url}>{r.name}</a>
              {r.stargazers_count > 0 && (
                <span className="mono dim"> ★{r.stargazers_count}</span>
              )}
              <div className="desc">{r.description}</div>
            </li>
          ))}
        </ul>

        <h2>ideas or feedback?</h2>
        <p className="muted">
          Two systems here are real but private: argus, an agent fleet that
          reads the AI news every morning and writes me a brief, and LifeOS,
          the front door that routes my whole setup. Ask me about either:{" "}
          <a href="mailto:elliotjlittle@gmail.com">elliotjlittle@gmail.com</a>.
        </p>
      </div>
    </main>
  );
}
