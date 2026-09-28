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
    call: "Decide which way it's allowed to fail",
    why: "Every model gets something wrong, so the product call is which kind of wrong you design for. In safeguarding, an alert nobody trusts is as dangerous as no alert: bury the safeguarding lead in false alarms and the real one gets skimmed past. So catch everything first, then earn their trust by cutting the noise.",
    where: "Tutor: detection shipped first, then we cut the false alarms without missing a single disclosure. ward: precision first, and the method says why.",
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
    why: "Teachers spot a wrong mark in seconds, so every mark a teacher flagged became a test. The suite grew from classrooms instead of from our imagination.",
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
    id: "tutor",
    name: "Zero Gravity AI STEM tutor",
    href: "https://www.zerogravity.co.uk/tutor",
    line: "An AI tutor for GCSE and A-level STEM, used in UK schools. I built the eval pipeline and owned the bar.",
  },
  {
    id: "ward",
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    line: "Safeguarding for apps children use. Open source, with the eval sets and the method published.",
  },
  {
    id: "farewill",
    name: "Farewill probate",
    href: "https://farewill.com/apply-for-probate",
    line: "Regulated probate operations, before LLMs. The same habit: errors named, counted and fixed by type, instead of remembered.",
  },
  {
    id: "site",
    name: "This site",
    href: "https://github.com/ElliotJLT/elliot-os/tree/main/evals",
    line: "The agent that keeps it current has an eval suite in the repo, and CI fails any change that breaks it. The first run showed its review gate couldn't reject anything: a proposal citing a repository that doesn't exist passed as grounded.",
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
              whose bar, which way it&apos;s allowed to fail, and when a green
              dashboard is lying to you. This is how I make them.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="how" className="mai-kick rv-settle">
            how I do evals
          </h2>
          <p className="sec-title rv-settle">
            Six habits, and where each one came from.
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
          <aside className="proof-band rv-settle">
            <span className="proof-band-kick">Zero Gravity · safeguarding</span>
            <p className="proof-band-line">
              Detection shipped first. Then we cut the false alarms without
              missing a single disclosure.
            </p>
          </aside>
        </Reveal>

        <Reveal>
          <h2 id="where" className="mai-kick rv-settle">
            where I&apos;ve done it
          </h2>
          <p className="sec-title rv-settle">
            Places where getting it wrong cost someone else.
          </p>
        </Reveal>
        <Reveal>
          <ul className="ev-places rv-settle">
            {PLACES.map((p) => (
              <li key={p.name} id={p.id}>
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
