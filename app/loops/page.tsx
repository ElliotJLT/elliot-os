import { getLedger } from "@/lib/ledger";
import Link from "next/link";
import Reveal from "../components/Reveal";
import LoopFigure from "../components/LoopFigure";

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
              A real prompt from the first day, the system behind it, and a
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

        {/* ------------------------------------------------------ one real case */}
        <Reveal>
          <section className="loop-case rv-settle" aria-labelledby="loop-case-title">
            <span className="loop-label">a real prompt · 28 September 2026</span>
            <h2 id="loop-case-title">The question reached me. The result is still open.</h2>
            <p>
              I had said &lsquo;a lot of the heavy lifting can be done by an LLM
              system&rsquo; and, in the same capture, that I wanted to retain
              taste and judgement. Overnight Cervo put those words beside a{" "}
              <a href="https://osf.io/preprints/psyarxiv/5y6m4_v1">
                study of people relying on deliberately unreliable AI advice
              </a>
              . It asked whether offloading the work could erode the edge I
              wanted to keep. The study cannot answer that question about my
              work. The prompt made the tension hard to ignore.
            </p>
            <div className="loop-case-status">
              <div><span className="loop-label">my call</span><p>Not recorded yet.</p></div>
              <div><span className="loop-label">result</span><p>Too early to know.</p></div>
              <div><span className="loop-label">next check</span><p>12 October. I will record whether the prompt changed an action, was noise, or should have stayed silent.</p></div>
            </div>
          </section>
        </Reveal>

        {/* ---------------------------------------------------------- the idea */}
        <Reveal>
          <h2 id="idea" className="mai-kick rv-settle">
            the idea
          </h2>
          <p className="muted rv-settle section-line">
            I&apos;ve spent years building systems that keep work moving after I
            step away. David Allen and Ben Thompson got me thinking about a
            more personal version: can an agent carry the continuity of my
            work and return when there is a decision worth making?
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
                Whether to take, change or ignore the suggested move. What to
                kill or ship. Anything that goes out with my name on it.
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
          <LoopFigure
            name="flow"
            alt="Diagram of the six steps: a thought is captured, sorted into a next action, rendered on one board with the job tracker and household list, checked overnight, sent as one morning move, and reviewed on Friday."
          />
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
            David Allen&rsquo;s flat batteries: your mind reminds you when you
            see the flat ones, not when you pass the right ones in a shop. This
            is a rebuild of Sleep On It, which I made with three others at the
            Claude Communities Impact Lab in July, and it only ever quotes me.
          </p>

        </Reveal>
        <Reveal>
          <LoopFigure
            name="night"
            alt="Three inputs flowing into one output: my captured words, stated versus revealed priorities, and three days of new writing on my threads, producing at most one collision or nothing."
          />
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
