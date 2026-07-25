import Link from "next/link";
import { getRepos, FEATURED } from "@/lib/github";
import { getPosts } from "@/lib/writing";
import { getRoles } from "@/lib/roles";

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
  const [repos, posts] = [await getRepos(), await getPosts()];
  const record = getRoles();
  const byName = new Map(repos.map((r) => [r.name, r]));
  const rest = repos.filter((r) => !FEATURED.includes(r.name));

  return (
    <main>
      <div className="wrap">
        <h1>Built</h1>
        <p className="lede">
          Understanding is a shipping requirement, not a casualty. I build the
          part that decides whether output is good enough to ship, and I have
          mostly built it where being wrong has a cost.
        </p>

        <h2>the through-line</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Producing plausible output is no longer the hard part. Knowing
          whether to ship it still is, and that gap is where most of my work
          has gone. The same question keeps surfacing at different points in a
          system: what got checked, what got rejected, and who decided. Before
          a student sees a mark. Before a child&apos;s disclosure gets missed.
          Before an application goes out. Before an agent changes this page.
        </p>
        <p className="muted">
          It applies to the model and to the person equally. You read what the
          loop made, and you can defend what carries your name. That standard
          is the spine of the{" "}
          <a href="https://htmlpreview.github.io/?https://gist.githubusercontent.com/ElliotJLT/2737dd5f02e68f405b151c002e7b9db0/raw/product-engineering-os.html">
            operating document
          </a>{" "}
          I wrote for the engineering team I worked in, and{" "}
          <a href="https://elliotjlt.github.io/crux/research.html">crux</a> is
          the instrument I built to find out whether it actually holds.
        </p>
        <ul className="record">
          <li>
            <div className="rhead">
              <span className="rorg">Zero Gravity AI STEM tutor</span>
              <span className="rmeta">in production</span>
            </div>
            <p className="rout">
              An always-on evaluator grades every coaching session against the
              Socratic spec, and marking is tested against official mark
              schemes before a student sees a grade. That eval infrastructure
              took marking accuracy from a ~67% bare-model baseline to over
              99%. Live across four STEM subjects on every major UK exam board,
              first commit to App Store in 45 days, and it won a DSIT
              government tender ahead of major US labs and the largest UK
              content incumbent.
            </p>
          </li>
          <li>
            <div className="rhead">
              <span className="rorg">ward</span>
              <span className="rmeta">safeguarding, for under-18s</span>
            </div>
            <p className="rout">
              Decides which messages from a child are genuine safeguarding
              disclosures and routes those to a named human on a clock,
              grounded in KCSIE rather than keyword matching. Built around
              precision, because a Designated Safeguarding Lead who gets paged
              on every false alarm learns to ignore the alerts, which is worse
              than having none. On its published synthetic sets the Claude
              judge reaches 90% recall at 100% precision, against 50/83 for a
              keyword baseline.
            </p>
          </li>
          <li>
            <div className="rhead">
              <span className="rorg">boulot</span>
              <span className="rmeta">adversarial review</span>
            </div>
            <p className="rout">
              Three agents with opposing briefs, a hiring manager, a reviewer
              and a strategist, argue over a CV before it is allowed out. I ran
              my own search through it. My partner and my sister use it too,
              which is more validation than most of my ideas earn.
            </p>
          </li>
          <li>
            <div className="rhead">
              <span className="rorg">crux</span>
              <span className="rmeta">the human half</span>
            </div>
            <p className="rout">
              The judgement no commit log records: what a person rejected,
              redirected, or killed while the model did the typing. Ongoing
              research, with the method, the results run on myself, the honest
              objections and the limitations all published.
            </p>
          </li>
          <li>
            <div className="rhead">
              <span className="rorg">this site</span>
              <span className="rmeta">the agent&apos;s own work</span>
            </div>
            <p className="rout">
              An agent proposes one change, a rubric scores it against explicit
              criteria, and a human merges it or does not. Every cadence, gate
              and stopping rule is published on <Link href="/loops">/loops</Link>
              , and the spend is metered.
            </p>
          </li>
        </ul>

        <h2>track record</h2>
        <p className="muted" style={{ marginTop: 0, fontSize: 15 }}>
          Roles and the outcome that mattered in each. Full history, titles,
          and references on <a href={record.linkedin}>LinkedIn</a>.
        </p>
        <ul className="record">
          {record.roles.map((r) => (
            <li key={r.org}>
              <div className="rhead">
                <span className="rorg">
                  {r.url ? <a href={r.url}>{r.org}</a> : r.org}
                </span>
                {(r.role || r.dates) && (
                  <span className="rmeta">
                    {[r.role, r.dates].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
              <p className="rout">{r.outcome}</p>
            </li>
          ))}
        </ul>

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

        <h2>research and position</h2>
        <div className="card">
          <h3>
            <a href="https://elliotjlt.github.io/crux/research.html">crux</a>
          </h3>
          <p>
            You are shipping faster than ever. Are you getting sharper, or
            just getting carried? Nothing currently measures that. Output has
            never been higher and no instrument tells you whether the person
            behind it is improving, plateauing or quietly atrophying. Fluency
            frameworks answer the baseline and everyone will pass them; the
            layer above is where the difference sits, in trust calibration,
            resistance to output that looks polished, and knowing what to
            kill.
          </p>
          <p>
            crux measures it. A Claude Code hook reads each session and
            extracts what the human actually decided: what got rejected,
            redirected or killed while the model did the typing. Ongoing
            research rather than a product, published with the method, the
            results run on myself, the honest objections, the limitations, and
            a memo to the platform layer about the half that nothing measures.
          </p>
          <div className="meta">
            <a href="https://elliotjlt.github.io/crux/research.html">
              read the research
            </a>{" "}
            · <a href="https://github.com/ElliotJLT/crux">repo</a>
          </div>
        </div>

        <div className="card">
          <h3>
            <a href="https://htmlpreview.github.io/?https://gist.githubusercontent.com/ElliotJLT/2737dd5f02e68f405b151c002e7b9db0/raw/product-engineering-os.html">
              The Product Engineering OS
            </a>
          </h3>
          <p>
            The operating document I wrote for the team that took an AI tutor
            from zero to schools in 82 days: how the work is owned, what a
            product engineer is accountable for once agents write most of the
            code, and the failure modes with their counters. Every claim is
            cited, including against our own GitHub and Linear numbers rather
            than a story about them. It names the risks honestly, among them
            the METR trial where experienced developers were 19% slower while
            believing they were 20% faster, the review queue that agent fleets
            move rather than remove, and learning erosion. It was written as a
            proposal to be argued with, not a rulebook.
          </p>
          <div className="meta">
            written July 2026 at Zero Gravity
          </div>
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

        <h2>writing</h2>
        <p className="muted" style={{ fontSize: 15, marginTop: 0 }}>
          Latest posts, pulled live from the Medium feed at build. Surfaced
          here by the site&apos;s own improvement loop, not by hand:{" "}
          <Link href="/loops">/loops</Link>. The full set, with notes on why
          each one exists, is on <Link href="/writing">/writing</Link>.
        </p>
        <ul className="repolist">
          {posts.slice(0, 3).map((p) => (
            <li key={p.link}>
              <a href={p.link}>{p.title}</a>
              {p.date && <span className="mono dim"> · {p.date}</span>}
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
