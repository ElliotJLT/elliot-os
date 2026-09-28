import { getEvals } from "@/lib/evals";
import { getLedger } from "@/lib/ledger";
import { getAgentLog } from "@/lib/content";
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
  {
    n: "01",
    name: "Capture",
    when: "any time",
    body: "A thought goes to a Telegram bot, or to /capture from whichever Claude Code session I'm in. It lands in an inbox and in an append-only record of everything I've said. Nothing is sorted or judged at this point. Getting it out of my head is the whole job.",
  },
  {
    n: "02",
    name: "Sort",
    when: "when I run a sweep",
    body: "Claude turns each inbox line into a next action written as a physical verb, a project with its first step, something I'm waiting on with a date to chase, or nothing. It also flags when one of the tools it reads from has gone stale.",
  },
  {
    n: "03",
    name: "One board",
    when: "every run",
    body: "A 330-line Python script with no model in it renders one list from three places: my own loops file, the status files in my job tracker, and the household list I share with my partner. It reads them where they live and copies nothing, so there is never a second version to drift.",
  },
  {
    n: "04",
    name: "The night pass",
    when: "before 07:30",
    body: "The part that notices. It reads my own captured words, the gap between the roles I say I want and the ones that actually reach interview, and three days of new writing on the threads I care about. At most one collision comes out, quoting me word for word, with one open question. Most nights it should say nothing.",
  },
  {
    n: "05",
    name: "Morning",
    when: "07:30",
    body: "One Telegram message: the single move for the day, anything genuinely due, and the night pass if it found something. Every Claude Code session I open also starts with the same 200-word summary, so no agent has to be told what's going on.",
  },
  {
    n: "06",
    name: "Review",
    when: "Fridays, 16:00",
    body: "Three questions arrive: what closed, what's stuck, what to drop. I answer in my own words, and the review is written from the data rather than from a journal I'd never keep.",
  },
];

export default function Loops() {
  const evals = getEvals();
  const ledger = getLedger();
  const agentLog = getAgentLog();
  const latestEval = evals.runs[0];
  const firstEval = evals.runs[evals.runs.length - 1];

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
            Your mind reminds you about flat batteries when you see the flat
            ones, not when you pass the right ones in a shop. This part tries
            to get the timing right.
          </p>
          <ul className="loop-steps loop-steps-2 rv-settle">
            <li>
              <div className="loop-step-head">
                <h3>Where it came from</h3>
              </div>
              <p>
                <em>Sleep On It</em>, which I built with three others at the
                Claude Communities Impact Lab in London in July 2026: an app
                that goes back through weeks of half-ideas and finds the two
                thoughts that turn out to be the same thought.
              </p>
            </li>
            <li>
              <div className="loop-step-head">
                <h3>Two rules it kept</h3>
              </div>
              <p>
                It never writes my material: every quote is something I
                actually said. And it keeps what I say I want apart from what my
                behaviour shows, because where those diverge is the most useful
                thing it can tell me.
              </p>
            </li>
          </ul>
        </Reveal>
        <Reveal>
          <LoopFigure
            name="night"
            alt="Three inputs flowing into one output: my captured words, stated versus revealed priorities, and three days of new writing on my threads, producing at most one collision or nothing."
          />
        </Reveal>
        <Reveal>
          <blockquote className="loop-example rv-settle">
            <span className="loop-label">a real one, 28 September 2026</span>
            <p>
              On 28 Sep you said &lsquo;a lot of the heavy lifting can be done
              by an LLM system&rsquo; and named &lsquo;retaining taste and
              judgment&rsquo; as the deeper thread in the same breath. This
              week&rsquo;s research is about exactly that mechanism.
            </p>
            <p className="loop-example-link">
              Less Accurate, More Confident: The More We Rely On AI, The Less
              We Question What We Think We Know
            </p>
            <p>
              Is offloading the heavy lifting the hack, or is it the thing that
              erodes the edge you&rsquo;re trying to protect?
            </p>
          </blockquote>
          <p className="muted rv-settle section-line">
            It asked the question I&rsquo;d been avoiding. That question is
            also why{" "}
            <a href="https://elliotjlt.github.io/crux/research.html">crux</a>{" "}
            exists: it measures whether I&rsquo;m getting sharper or getting
            carried.
          </p>
        </Reveal>

        {/* ------------------------------------------------------ design rules */}
        <Reveal>
          <h2 id="rules" className="mai-kick rv-settle">
            the rules it&rsquo;s built on
          </h2>
          <ul className="loop-rules rv-settle">
            <li>
              <strong>Code where it has to be right, a model where judgement helps.</strong>{" "}
              Dates, reminders and counts are plain Python. Claude only sorts,
              picks the day&rsquo;s move and looks for collisions.
            </li>
            <li>
              <strong>Read, never copy.</strong> The job tracker and the
              household list stay the source of truth. The board reads them each
              time it renders.
            </li>
            <li>
              <strong>My words are append-only.</strong> Nothing I capture is
              edited or tidied, so the night pass can quote it exactly.
            </li>
            <li>
              <strong>One message a day.</strong> If the morning message becomes
              a list I skim, the system has failed.
            </li>
            <li>
              <strong>Small and local.</strong> Claude Code, Python&rsquo;s
              standard library, launchd, the Telegram Bot API, Exa for search,
              and git. No database, no server.
            </li>
          </ul>
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
          <LoopFigure
            name="ledger"
            alt="Weekly chart of loops closed against thoughts captured since the system started."
          />
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

        {/* ---------------------------------------------- the site's own loop */}
        <Reveal>
          <h2 id="site" className="mai-kick rv-settle">
            the loop that keeps this site current
          </h2>
          <p className="muted rv-settle section-line">
            A daily agent turns my public GitHub activity into the shipping
            digest below; a quiet day posts &ldquo;quiet day&rdquo;. Its eval
            suite went from {firstEval?.passed}/{firstEval?.total} to{" "}
            {latestEval?.passed}/{latestEval?.total}, and the first run caught
            a review gate that couldn&rsquo;t reject anything. Evals across my
            work are on <Link href="/evals">/evals</Link>.
          </p>
        </Reveal>
        {agentLog && (
          <Reveal>
            <details className="latest-digest rv-settle">
              <summary>Latest shipping digest</summary>
              <div className="prose agentlog" dangerouslySetInnerHTML={{ __html: agentLog }} />
            </details>
          </Reveal>
        )}
      </div>
    </main>
  );
}
