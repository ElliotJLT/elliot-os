import Reveal from "../components/Reveal";

export const metadata = { title: "Evals · Elliot Little" };

export default function Evals() {
  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">Evals</span>
              <h1 className="wr-title rv-settle">
                What got checked, what got rejected, and who decided?
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              The same question, asked of a tutor for teenagers, a
              safeguarding layer, a regulated probate operation and my own
              AI-assisted work. Each entry: what the eval measures, the
              numbers, and the failure it exists to catch.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="tutor" className="mai-kick rv-settle">
            01 · marking a tutor against the mark scheme
          </h2>
        </Reveal>
        <Reveal>
          <div className="research-card rv-settle">
            <h3>
              <a href="https://www.zerogravity.co.uk/tutor">
                Zero Gravity AI STEM tutor
              </a>
            </h3>
            <p>
              The failure that matters: a tutor that confidently teaches a
              student something the mark scheme will penalise. The student
              cannot tell, and finds out in the exam hall. So the eval
              pipeline tests marking against real past papers and official
              mark schemes, not against what a model finds plausible. The
              bare model started at roughly 67%; the shipped product marks at
              over 99%, and hallucinated marking points went from 4.6% of
              sessions to zero.
            </p>
            <p>
              Accuracy is only half the spec. The tutor is Socratic by
              design: it coaches a student to the answer and will not hand it
              over, however creatively they ask. An always-on evaluator
              grades every session against that spec, because a tutor that
              caves under prompt pressure is a homework machine with better
              manners. Teachers can flag a mark they disagree with, and each
              flag becomes a case in the suite, so the eval set grows from
              the classroom rather than from what we imagined. Safety
              signals are recorded on each interaction and routed into a
              safeguarding case-management flow.
            </p>
            <div className="meta">
              ~67% → 99%+ on marking evals · hallucinated marks 4.6% → 0 ·
              every session graded against the Socratic spec
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 id="ward" className="mai-kick rv-settle">
            02 · the precision problem in safeguarding
          </h2>
        </Reveal>
        <Reveal>
          <div className="research-card rv-settle">
            <h3>
              <a href="https://github.com/ElliotJLT/ward">ward</a>
            </h3>
            <p>
              When a child discloses something serious to an app, a named
              human has to see it on a clock. The tempting metric is recall:
              catch everything. But a Designated Safeguarding Lead who gets
              paged on every false alarm stops trusting the alerts, and an
              ignored alert system is worse than none. ward is built around
              that asymmetry: separate genuine disclosures from ordinary bad
              conduct, grounded in KCSIE rather than keyword matching.
            </p>
            <p>
              On the published synthetic eval sets, the Claude judge reaches
              90% recall at 100% precision and a 0% false-positive rate; the
              keyword baseline manages 50% recall at 83% precision with an
              8.6% false-positive rate. The method, the eval sets and the
              limitations are published alongside the code.
            </p>
            <div className="meta">
              90% recall · 100% precision · 0% false positives, vs 50/83/8.6
              for keywords ·{" "}
              <a href="https://github.com/ElliotJLT/ward/blob/main/METHODOLOGY.md">
                methodology
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 id="farewill" className="mai-kick rv-settle">
            03 · the same discipline before LLMs
          </h2>
        </Reveal>
        <Reveal>
          <div className="research-card rv-settle">
            <h3>
              <a href="https://farewill.com/apply-for-probate">
                Farewill probate operations
              </a>
            </h3>
            <p>
              Probate runs inside SRA and FCA regulation, where an agent
              error is not a bug ticket, it is a grieving family's estate
              handled wrongly. The checking layer there was operational
              rather than computational: guided intake, workflow automation,
              audit logs and case tracking, with error categories defined and
              counted rather than anecdotally remembered. Agent errors fell
              69% and case handling moved from two weeks to four days.
            </p>
            <p>
              This is the habit the AI work inherits. The instrument changed
              from a process audit to an eval pipeline; the question stayed
              the same.
            </p>
            <div className="meta">
              agent errors down 69% · case handling from two weeks to four
              days · SRA/FCA-regulated
            </div>
          </div>
        </Reveal>

        <Reveal>
          <h2 id="crux" className="mai-kick rv-settle">
            04 · evaluating the human in the loop
          </h2>
        </Reveal>
        <Reveal>
          <div className="research-card rv-settle">
            <h3>
              <a href="https://elliotjlt.github.io/crux/research.html">crux</a>
            </h3>
            <p>
              The uncomfortable eval is the one pointed at yourself. When AI
              does the typing, output stops being evidence of skill; the
              judgement is in what got rejected, redirected or killed, and
              nothing measures that. crux reads my own sessions and extracts
              those calls, published as ongoing research with the method, the
              results run on myself and the honest objections.
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
          <h2 className="mai-kick rv-settle">what these numbers are not</h2>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle">
            The tutor evals are internal, run against official mark schemes
            but not independently audited. ward's eval sets are synthetic,
            because real safeguarding disclosures from children are not a
            dataset anyone should be assembling for benchmarks; the
            methodology says what that does and does not prove. I publish the
            limitations with the numbers because a metric that hides its
            weaknesses is exactly the failure these systems exist to catch.
            If you want to poke at any of it:{" "}
            <a href="mailto:elliotjlittle@gmail.com">elliotjlittle@gmail.com</a>
            .
          </p>
        </Reveal>
      </div>
    </main>
  );
}
