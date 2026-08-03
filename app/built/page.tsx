import Link from "next/link";
import { getRepos, FEATURED } from "@/lib/github";
import { getRoles } from "@/lib/roles";
import ArgusFlow from "../components/ArgusFlow";
import Reveal from "../components/Reveal";
import { CareerCards } from "../components/Career";
import { Pill } from "../components/Frame";
import HoverLabel from "../components/HoverLabel";

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
  const repos = await getRepos();
  const record = getRoles();
  const byName = new Map(repos.map((r) => [r.name, r]));

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">Built</span>
              <h1 className="wr-title rv-settle">
                I build the part that decides whether output is good enough
                to ship.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Usually somewhere a wrong answer costs a student a grade, or
              misses what a child was trying to tell someone.
            </p>
          </header>
        </Reveal>

        {/* The tutor is four years of work in production on the App Store,
            so it gets a card of its own rather than levelling with a
            research repo and this website. */}
        <Reveal>
          <h2 className="mai-kick rv-settle">in production</h2>
        </Reveal>
        <Reveal>
          <section className="flagship rv-settle">
            <h3>Zero Gravity AI STEM tutor</h3>
            <p className="fclaim">
              A private tutor at the shoulder of students whose families could
              never pay for one.
            </p>
            {/* Set as a case study rather than a description. A list of
                features says what exists; the beats below say what was
                decided and what it cost, which is the thing a reader is
                actually trying to work out. */}
            <dl className="case">
              <dt>the problem</dt>
              <dd>
                A-Level students whose families cannot buy an hour of a
                tutor&apos;s time. The obvious build is a chatbot that answers
                homework, which raises a grade once and teaches nothing. The
                useful build refuses.
              </dd>

              <dt>the call</dt>
              <dd>
                Socratic from the prompt up, and hold it under pressure:
                students get inventive about extracting the answer, so
                refusing had to survive adversarial asking rather than a
                polite first no. Coaching, practice, marking and assignments
                run as separate agents with their own pedagogy and evaluator,
                because one prompt doing four jobs degrades all four.
              </dd>

              <dt>where the work actually went</dt>
              <dd>
                Not the model. Correctness evaluation: marking tested against
                real past papers and official mark schemes, an always-on
                evaluator grading every coaching session against the Socratic
                spec, and safety telemetry on every interaction. Shipping
                daily while the safeguards only got tighter was the
                discipline problem, and it was harder than the AI.
              </dd>

              <dt>what happened</dt>
              <dd>
                Marking accuracy from a ~67% bare-model baseline to over 99%.
                Live across four STEM subjects on every major UK exam board,
                direct to students and through a school hub for teachers.
                First commit to the App Store in 45 days. Selected as one of
                eight companies nationally for the DfE and DSIT AI Tutoring
                Tools Pioneers Programme, held to the government&apos;s
                Generative AI Product Safety Standards.
              </dd>
            </dl>
            <div className="flinks">
              <Pill href="https://www.zerogravity.co.uk/tutor">
                the product
              </Pill>
              <Pill href="https://apps.apple.com/gb/app/zero-gravity-tutor/id6760364095">
                App Store
              </Pill>
              <Pill href="https://open.spotify.com/episode/3D8quBCXrMNgIF87czhux3">
                the podcast episode
              </Pill>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">the through-line</h2>
        </Reveal>
        <Reveal>
          <div className="through-line rv-settle">
            <p className="muted" style={{ marginTop: 0 }}>
              Producing plausible output is no longer the hard part. Knowing
              whether to ship it still is, and that gap is where most of my
              work has gone. The same question keeps surfacing at different
              points in a system: what got checked, what got rejected, and
              who decided. Before a student sees a mark. Before a
              child&apos;s disclosure gets missed. Before an application
              goes out. Before an agent changes this page.
            </p>
            <p className="muted">
              It applies to the model and to the person equally. You read
              what the loop made, and you can defend what carries your name.{" "}
              <a href="https://elliotjlt.github.io/crux/research.html">
                crux
              </a>{" "}
              is the instrument I built to find out whether that actually
              holds.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="record-grid rv-settle">
            <div className="record-card">
              <div className="rhead">
                <span className="rorg">ward</span>
                <span className="rmeta">safeguarding, for under-18s</span>
              </div>
              <p className="rout">
                Decides which messages from a child are genuine safeguarding
                disclosures and routes those to a named human on a clock,
                grounded in KCSIE rather than keyword matching. Built around
                precision, because a Designated Safeguarding Lead who gets
                paged on every false alarm learns to ignore the alerts, which
                is worse than having none. On its published synthetic sets
                the Claude judge reaches 90% recall at 100% precision,
                against 50/83 for a keyword baseline.
              </p>
            </div>
            <div className="record-card">
              <div className="rhead">
                <span className="rorg">boulot</span>
                <span className="rmeta">adversarial review</span>
              </div>
              <p className="rout">
                Three agents with opposing briefs, a hiring manager, a
                reviewer and a strategist, argue over a CV before it is
                allowed out. I ran my own search through it, then
                open-sourced it. My partner and my sister use it too.
              </p>
            </div>
            <div className="record-card">
              <div className="rhead">
                <span className="rorg">crux</span>
                <span className="rmeta">the human half</span>
              </div>
              <p className="rout">
                The judgement no commit log records: what a person rejected,
                redirected, or killed while the model did the typing. Ongoing
                research, with the method, the results run on myself, the
                honest objections and the limitations all published.
              </p>
            </div>
            <div className="record-card">
              <div className="rhead">
                <span className="rorg">this site</span>
                <span className="rmeta">the agent&apos;s own work</span>
              </div>
              <p className="rout">
                An agent proposes one change, a rubric scores it against
                explicit criteria, and a human merges it or does not. Every
                cadence, gate and stopping rule is published on{" "}
                <Link href="/loops">/loops</Link>, and the spend is metered.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">track record</h2>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle" style={{ marginTop: 0, fontSize: 15 }}>
            Roles and the outcome that mattered in each. Full history,
            titles, and references on <a href={record.linkedin}>LinkedIn</a>.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <CareerCards roles={record.roles} />
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">argus</h2>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle" style={{ marginTop: 0 }}>
            A private fleet that reads a few hundred sources a day and
            briefs me before I sit down. Named for the watchman with a
            hundred eyes. It has not missed a morning. The corpus stays
            private; the shape does not need to.
          </p>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle">
            Most agent systems summarise and forget. This one has one rule
            that decides everything else: ingest is immutable and the corpus
            only ever appends, so a note gets thicker rather than getting
            replaced by whatever the model read most recently.
          </p>
        </Reveal>
        <Reveal>
          <div className="rv-settle">
            <ArgusFlow />
          </div>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">research</h2>
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
              just getting carried? Nothing currently measures that. I
              noticed it in myself at Zero Gravity: shipping faster than I
              ever had, and slower to say what I would have done differently.
              Output has never been higher and no instrument tells you
              whether the person behind it is improving, plateauing or
              quietly atrophying. Fluency frameworks answer the baseline and
              everyone will pass them; the layer above is where the
              difference sits, in trust calibration, resistance to output
              that looks polished, and knowing what to kill.
            </p>
            <p>
              crux measures it. A Claude Code hook reads each session and
              extracts what the human actually decided: what got rejected,
              redirected or killed while the model did the typing. Ongoing
              research rather than a product, published with the method, the
              results run on myself, the honest objections, the limitations,
              and a memo to the platform layer about the half that nothing
              measures.
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
          <h2 className="mai-kick rv-settle">agent tools</h2>
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
        </Reveal>
        <Reveal>
          <p className="muted rv-settle">
            Two systems here are real but private: argus, an agent fleet that
            reads the AI news every morning and writes me a brief, and
            LifeOS, the front door that routes my whole setup. Ask me about
            either:{" "}
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
