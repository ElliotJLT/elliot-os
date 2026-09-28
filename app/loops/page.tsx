import { getLedger } from "@/lib/ledger";
import Link from "next/link";
import Reveal from "../components/Reveal";
import LoopFigure from "../components/LoopFigure";
import LoopFlow from "../components/LoopFlow";

export const metadata = { title: "Loops · Elliot Little" };

function formatDate(value: string | null) {
  if (!value) return "never";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

const STEPS = [
  { n: "01", name: "Capture", when: "any time", body: "I text a bot, or type /capture in any Claude Code session. It's kept word for word." },
  { n: "02", name: "Sort", when: "when I run a sweep", body: "Claude turns each line into a next action, a project, someone to chase, or nothing." },
  { n: "03", name: "One board", when: "every run", body: "Plain Python, no model, renders one list from my loops, my job tracker and our household list, reading each where it lives." },
  { n: "04", name: "Night pass", when: "before 07:30", body: "Looks across what I've said, my written positions and three days of news for one connection worth waking me for. Most nights, nothing." },
  { n: "05", name: "Morning", when: "07:30", body: "One Telegram message: one move for the day, anything due, and the night pass if it found something." },
  { n: "06", name: "Review", when: "Fridays, 16:00", body: "Three questions: what closed, what's stuck, what to drop." },
];

export default function Loops() {
  const ledger = getLedger();

  return (
    <main>
      <div className="mai loops-page">
        <Reveal immediate>
          <header className="wr-head">
            <span className="mai-kick rv-settle">Loops · working with agents</span>
            <h1 className="wr-title rv-settle">
              What I hand to machines, and what I keep.
            </h1>
            <p className="mai-sub rv-settle">
              The system I run my own work on, how each part works, and a
              public ledger that would show it failing.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <LoopFigure
            name="hero"
            alt="The loop at a glance: capture, sort, one board, the night pass, the morning message and the weekly review, arranged as a cycle around a person."
          />
        </Reveal>

        {/* ---------------------------------------------------------- the idea */}
        <Reveal>
          <h2 id="idea" className="mai-kick rv-settle">
            the idea
          </h2>
          <p className="muted rv-settle section-line">
            David Allen&rsquo;s point, picked up by Ben Thompson in{" "}
            <em>Write Things Down</em>: the mind is RAM. I start more than I
            finish, so I built the assistant that holds the list, and kept the
            calls.
          </p>
        </Reveal>

        <Reveal>
          <div className="loop-split rv-settle">
            <div>
              <span className="loop-label">the machine holds</span>
              <p>
                Capture. The list. Dates, reminders and who to chase. What I
                said three weeks ago and what&rsquo;s changed since.
              </p>
            </div>
            <div>
              <span className="loop-label">I keep</span>
              <p>
                Which move matters today. What to kill. What to ship. Anything
                that goes out with my name on it.
              </p>
            </div>
          </div>
        </Reveal>

        {/* -------------------------------------------------------- how it runs */}
        <Reveal>
          <h2 id="how" className="mai-kick rv-settle">
            how it runs
          </h2>
        </Reveal>
        <Reveal>
          <LoopFlow />
        </Reveal>
        <Reveal>
          <ol className="loop-steps rv-settle">
            {STEPS.map((s) => (
              <li key={s.n}>
                <div className="loop-step-head">
                  <span className="loop-step-n">{s.n}</span>
                  <h3>{s.name}</h3>
                  <span className="loop-step-when">{s.when}</span>
                </div>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ---------------------------------------------------- the night pass */}
        <Reveal>
          <h2 id="night" className="mai-kick rv-settle">
            the night pass
          </h2>
          <p className="muted rv-settle section-line">
            Overnight it looks for one link between something I&rsquo;ve said
            and something new worth reading, and quotes my own words back to
            me. Most nights it finds nothing, and says so.
          </p>

        </Reveal>
        <Reveal>
          <LoopFigure
            name="night"
            alt="Three inputs flowing into one output: my captured words, stated versus revealed priorities, and three days of new writing on my threads, producing at most one collision or nothing."
          />
        </Reveal>
        <Reveal>
          <blockquote className="loop-example rv-settle">
            <span className="loop-label">what it sent me, 28 September 2026</span>
            <p>
              On 28 Sep you said &lsquo;a lot of the heavy lifting can be done
              by an LLM system&rsquo; and named &lsquo;retaining taste and
              judgment&rsquo; as the deeper thread in the same breath. This
              week&rsquo;s research is about exactly that mechanism.
            </p>
            <span className="loop-label">the piece it paired it with</span>
            <p className="loop-example-link">
              Less Accurate, More Confident: The More We Rely On AI, The Less
              We Question What We Think We Know
            </p>
            <span className="loop-label">the question it left me</span>
            <p>
              Is offloading the heavy lifting the hack, or is it the thing that
              erodes the edge you&rsquo;re trying to protect?
            </p>
          </blockquote>
          <p className="muted rv-settle loop-origin">
            It&rsquo;s a rebuild of Sleep On It, which I made with three others
            at the Claude Communities Impact Lab in July.
          </p>
        </Reveal>

        {/* ------------------------------------------------------------ ledger */}
        <Reveal>
          <h2 id="ledger" className="mai-kick rv-settle">
            the ledger
          </h2>
          <p className="muted rv-settle section-line">
            {ledger.note} Running since {formatDate(ledger.started)}.
          </p>
        </Reveal>
        <Reveal>
          <table className="loop-ledger rv-settle">
            <thead>
              <tr>
                <th>week of</th>
                <th>loops closed</th>
                <th>thoughts captured</th>
                <th>morning messages</th>
              </tr>
            </thead>
            <tbody>
              {ledger.weeks.map((w) => (
                <tr key={w.week_of}>
                  <th scope="row">{formatDate(w.week_of)}</th>
                  <td>{w.closed}</td>
                  <td>{w.captured}</td>
                  <td>
                    {w.briefs}
                    {w.fallbacks > 0 && <span className="loop-note">{w.fallbacks} fell back to plain text</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted rv-settle section-line">
            What would make it wrong: captures climbing while closed loops stay
            flat. That would be a tidier way of not doing things. On 12 October
            I check for exactly that, and cut the system back if I find it.
          </p>
        </Reveal>
        {ledger.broke.length > 0 && (
          <Reveal>
            <ol className="failure-log rv-settle">
              {ledger.broke.map((b) => (
                <li key={b.date + b.what}>
                  <div className="failure-meta">
                    <time dateTime={b.date}>{formatDate(b.date)}</time>
                    <span className="failure-status repaired">fixed</span>
                  </div>
                  <div>
                    <p>{b.what}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        <Reveal>
          <p className="muted rv-settle section-line">
            The agent that keeps this site current, and its eval suite, are on{" "}
            <Link href="/evals#site">/evals</Link>.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
