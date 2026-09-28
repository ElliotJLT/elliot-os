import Reveal from "../components/Reveal";
import HabitIcon from "../components/HabitIcon";

export const metadata = { title: "Evals · Elliot Little" };

// VERIFY (Elliot, 2026-09-28): written to lean on how and why over numbers,
// and a few lines go further than the record I had to hand. Check before
// leaning on them in an interview:
// - "I read sessions every week" (the reading habit is real; the cadence is a guess)
// - "Nobody had guessed it" about the tutor's marking failure
// - "owned the bar" at Zero Gravity
// - the Socratic evaluator being "checked against teachers' judgement first"
// Headline numbers are deliberately off this page: without the denominators
// (how many cases, held out or not, who marked them) an eval person picks
// them apart. They belong in the conversation, not the page.
const HOW = [
  {
    icon: "bar" as const,
    call: "Borrow the bar from whoever would know",
    why: "If the team writes the rubric, the model gets marked on our opinions. Examiners and regulators have spent years arguing about what good looks like, so I take theirs. A good case is one two experts would mark the same way without talking to each other.",
    where: "Tutor: the exam boards' mark schemes. ward: KCSIE. Farewill: the regulator's rules, turned into error types.",
  },
  {
    icon: "balance" as const,
    call: "Decide which mistake you can live with",
    why: "Everything gets something wrong. The product call is which way it fails. In safeguarding I'd rather miss an edge case than page a safeguarding lead with false alarms until they stop reading the alerts.",
    where: "ward: built precision first, on purpose, and says so in the method.",
  },
  {
    icon: "conversation" as const,
    call: "Mark the conversation, not just the answer",
    why: "A tutor can get every answer right and still be useless if it hands them over. What made it a tutor was refusing to, however nicely a student asked, so the conversation itself got marked. That takes a model as the marker, and a model marker has to agree with a teacher before I trust a word it says.",
    where: "Tutor: an evaluator grading every session against the Socratic spec, checked against teachers' judgement first.",
  },
  {
    icon: "transcript" as const,
    call: "Read the transcripts yourself",
    why: "Evals catch it before launch, monitoring catches it in production, and reading transcripts catches what both of them missed. No layer's enough on its own. I read sessions every week, and the failures that mattered were never on anyone's list.",
    where: "Tutor: the worst failure was confident marking the mark scheme didn't back up. Nobody had guessed it.",
  },
  {
    icon: "flag" as const,
    call: "Turn every complaint into a case",
    why: "A teacher spots a wrong mark in seconds; I'd take hours. So every mark a teacher flagged became a test, and the suite grew from classrooms instead of from our imagination.",
    where: "Tutor: teacher flags fed straight back into the eval set.",
  },
  {
    icon: "failing" as const,
    call: "Keep one suite you're failing",
    why: "The eval is the spec, so part of it should describe what you can't do yet. A regression suite stops you going backwards and should stay green. A capability suite you're mostly failing shows you where to go next. If everything's green, you've stopped learning.",
    where: "This site: the agent's suite failed half its cases on the first run. Fixing that was the work, and now it's the regression suite that keeps it fixed.",
  },
];

const PLACES = [
  {
    name: "Zero Gravity AI STEM tutor",
    href: "https://www.zerogravity.co.uk/tutor",
    line: "An AI tutor for GCSE and A-level STEM, used in UK schools. I built the eval pipeline and owned the bar.",
  },
  {
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    line: "Safeguarding for apps children use. Open source, with the eval sets and the method published.",
  },
  {
    name: "Farewill probate",
    href: "https://farewill.com/apply-for-probate",
    line: "Regulated probate operations, before LLMs. The same habit, with spreadsheets instead of judges.",
  },
  {
    name: "This site",
    href: "https://github.com/ElliotJLT/elliot-os/tree/main/evals",
    line: "Its own agent has an eval suite in the repo, and CI fails any change that breaks it. The first run failed half of it, which is the point.",
  },
];

export default function Evals() {
  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">Evals</span>
              <h1 className="wr-title rv-settle">
                Deciding what good looks like.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Everyone runs evals now. The hard bit is the calls around them:
              whose bar, which mistake you can live with, and when a green
              dashboard is lying to you. This is how I make them.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="how" className="mai-kick rv-settle">
            how I do evals
          </h2>
          <p className="muted rv-settle" style={{ margin: "0 0 22px" }}>
            Six habits, each with the place it came from.
          </p>
        </Reveal>
        <Reveal>
          <ol className="ev-steps ev-calls rv-settle">
            {HOW.map((c, i) => (
              <li key={c.call} className="ev-step">
                <div className="ev-step-head">
                  <span className="ev-step-icon">
                    <HabitIcon name={c.icon} />
                  </span>
                  <span className="ev-step-no">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3>{c.call}</h3>
                <p>{c.why}</p>
                <p className="ev-step-where">{c.where}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal>
          <h2 id="where" className="mai-kick rv-settle">
            where I&apos;ve done it
          </h2>
          <p className="muted rv-settle" style={{ margin: "0 0 22px" }}>
            Places where getting it wrong had a cost someone else would pay.
          </p>
        </Reveal>
        <Reveal>
          <ul className="ev-places rv-settle">
            {PLACES.map((p) => (
              <li key={p.name}>
                <a href={p.href}>{p.name}</a>
                <p>{p.line}</p>
              </li>
            ))}
          </ul>
        </Reveal>

      </div>
    </main>
  );
}
