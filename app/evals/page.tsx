import Reveal from "../components/Reveal";
import EvalLoop from "../components/EvalLoop";
import { getCases, getEvals } from "@/lib/evals";

const basePath = process.env.BASE_PATH || "";

export const metadata = { title: "Evals · Elliot Little" };

// The six boxes in the loop diagram, in order. Each says what the step is in
// plain English, then where I actually did it.
const STEPS = [
  {
    name: "Real use",
    what: "Start from what people actually do with it. The spec was a guess.",
    where: "Tutor: real past papers, marked against the official mark schemes.",
  },
  {
    name: "Read the failures",
    what: "Sit and read the conversations. The failures that matter are rarely the ones you'd have guessed.",
    where: "Tutor: the dangerous one was confident marking the mark scheme doesn't back up.",
  },
  {
    name: "Name them",
    what: "Group what you find into a handful of named failure types and count them. Now it's a list you can fix instead of a feeling.",
    where: "Farewill: named error types, counted rather than remembered. Agent errors fell 69%.",
  },
  {
    name: "Write the test",
    what: "One pass or fail check per failure. Plain code where the answer can be checked, a model where it can't. No scores out of ten.",
    where: "Tutor: hallucinated marking points went from 4.6% of sessions to zero.",
  },
  {
    name: "Check the marker",
    what: "A model marking a model has to pass its own exam first: it has to agree with a human expert before anyone trusts the number.",
    where: "ward: the eval sets and method are published, so anyone can check the marker.",
  },
  {
    name: "Gate every change",
    what: "The checks run before anything ships. If the score drops, it doesn't go out. Then back to real use, because new failures turn up.",
    where: "Tutor: every mark a teacher flagged became a new test case.",
  },
];

const THEATRE = [
  [
    "A helpfulness score out of ten on a dashboard nobody opens",
    "A pass or fail check for a failure someone has actually seen",
  ],
  [
    "A rubric written in a meeting before launch",
    "A rubric written after reading the real conversations",
  ],
  [
    "A vendor's off-the-shelf hallucination score",
    "Your own cases, from your own users",
  ],
  [
    "A model marking a model, and nobody checking it",
    "A marker that agrees with a human expert before anyone trusts it",
  ],
  [
    "A suite that has never once failed",
    "A suite with a record of catching things before they shipped",
  ],
];

export default function Evals() {
  const cases = getCases();
  const runs = getEvals().runs;
  const latestRun = runs[0];
  const firstRun = runs[runs.length - 1];

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">Evals</span>
              <h1 className="wr-title rv-settle">
                Marking the AI&apos;s homework.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              An eval is a mark scheme for software that never gives the same
              answer twice. This is how I write them, and three places
              they&apos;ve had to hold up.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="how" className="mai-kick rv-settle">
            how an eval works
          </h2>
          <p className="muted rv-settle" style={{ margin: "0 0 22px" }}>
            Six steps, round and round. The middle is the bar: what good looks
            like, written down by someone who&apos;d know.
          </p>
        </Reveal>
        <Reveal>
          <figure className="ev-figure rv-develop">
            <EvalLoop steps={STEPS.map((s) => s.name)} />
          </figure>
        </Reveal>
        <Reveal>
          <ol className="ev-steps rv-settle">
            {STEPS.map((s, i) => (
              <li key={s.name} className="ev-step">
                <span className="ev-step-no">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{s.name}</h3>
                <p>{s.what}</p>
                <p className="ev-step-where">{s.where}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal>
          <h2 id="done" className="mai-kick rv-settle">
            where I&apos;ve done it
          </h2>
          <p className="muted rv-settle" style={{ margin: "0 0 22px" }}>
            Three places where getting it wrong had a cost someone else would
            pay.
          </p>
        </Reveal>
        <Reveal>
          <div className="research-card ev-card rv-settle">
            <h3>
              <a href="https://www.zerogravity.co.uk/tutor">
                Zero Gravity AI STEM tutor
              </a>
            </h3>
            <p>
              An AI tutor for GCSE and A-level STEM, used in UK schools. If it
              marks wrong, a student learns it wrong and finds out in the exam
              hall.
            </p>
            <dl>
              <dt>The bar</dt>
              <dd>The exam board&apos;s own mark scheme, on real past papers.</dd>
              <dt>Also checked</dt>
              <dd>
                Every session, against the Socratic spec: coach the student to
                the answer, never hand it over, however nicely they ask.
              </dd>
              <dt>Built on</dt>
              <dd>
                An eval pipeline I built on Langfuse. Teachers could flag any
                mark they disagreed with, and each flag went back in as a case.
              </dd>
              <dt>Result</dt>
              <dd>
                Marking accuracy from about 67% to over 99%. Hallucinated
                marking points from 4.6% of sessions to zero.
              </dd>
            </dl>
          </div>
        </Reveal>
        <Reveal>
          <div className="research-card ev-card rv-settle">
            <h3>
              <a href="https://github.com/ElliotJLT/ward">ward</a>
            </h3>
            <p>
              A safeguarding layer for apps children use. When a child
              discloses something serious, a named adult has to see it, and
              fast.
            </p>
            <dl>
              <dt>The bar</dt>
              <dd>KCSIE, the statutory guidance schools already work to.</dd>
              <dt>The metric</dt>
              <dd>
                Precision first. A safeguarding lead who gets paged for every
                false alarm stops reading the alerts, and then you&apos;ve got
                nothing.
              </dd>
              <dt>Result</dt>
              <dd>
                100% precision at 90% recall, no false positives. Keyword
                matching on the same sets: 83% precision, 50% recall, 8.6%
                false positives.
              </dd>
            </dl>
            <div className="meta">
              <a href="https://github.com/ElliotJLT/ward/blob/main/METHODOLOGY.md">
                method and eval sets
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="research-card ev-card rv-settle">
            <h3>
              <a href="https://farewill.com/apply-for-probate">
                Farewill probate
              </a>
            </h3>
            <p>
              The same habit, before LLMs. Probate is regulated by the SRA and
              FCA, and a mistake there is a grieving family&apos;s estate
              handled wrong.
            </p>
            <dl>
              <dt>The bar</dt>
              <dd>
                The regulation, turned into named error types we counted
                instead of remembered.
              </dd>
              <dt>Result</dt>
              <dd>
                Agent errors down 69%. Case handling from two weeks to four
                days.
              </dd>
            </dl>
          </div>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle ev-loops">
            The smallest one you can open yourself is this site&apos;s own
            agent. Its first eval run scored {firstRun?.passed}/
            {firstRun?.total} and caught a review gate that couldn&apos;t
            reject anything. It passes {latestRun?.passed}/{latestRun?.total}{" "}
            now, and CI fails any change that breaks it.{" "}
            <a href="https://github.com/ElliotJLT/elliot-os/tree/main/evals">
              The {cases.length} cases are on GitHub
            </a>
            .
          </p>
        </Reveal>

        <Reveal>
          <h2 id="theatre" className="mai-kick rv-settle">
            spotting eval theatre
          </h2>
          <p className="muted rv-settle" style={{ margin: "0 0 22px" }}>
            Evals are easy to fake. If you&apos;re hiring someone to do this,
            this is what to look for.
          </p>
        </Reveal>
        <Reveal>
          <table className="ev-vs rv-settle">
            <thead>
              <tr>
                <th scope="col">Theatre</th>
                <th scope="col">The real thing</th>
              </tr>
            </thead>
            <tbody>
              {THEATRE.map(([fake, real]) => (
                <tr key={fake}>
                  <td>{fake}</td>
                  <td>{real}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ev-credit rv-settle">
            Most of this I learned the hard way. The clearest version of it is{" "}
            <a href="https://www.lennysnewsletter.com/p/why-ai-evals-are-the-hottest-new-skill">
              Hamel Husain and Shreya Shankar on Lenny&apos;s Podcast
            </a>{" "}
            and{" "}
            <a href="https://www.lennysnewsletter.com/p/beyond-vibe-checks-a-pms-complete">
              Aman Khan&apos;s guide for PMs
            </a>
            . Start there.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">what these numbers aren&apos;t</h2>
        </Reveal>
        <Reveal>
          <div className="research-card rv-settle">
            <p style={{ marginTop: 0 }}>
              The tutor evals are internal. They ran against official mark
              schemes, but nobody independent has audited them. ward&apos;s
              eval sets are synthetic, because real disclosures from children
              aren&apos;t something anyone should be collecting for a
              benchmark. If you want to poke at any of it,{" "}
              <a href="mailto:elliotjlittle@gmail.com">
                elliotjlittle@gmail.com
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
