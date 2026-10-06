import { getLedger, type LedgerWeek } from "@/lib/ledger";
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
  { n: "02", name: "Read", when: "every hour", body: "Reads my mail, my calendar and what I type in my working sessions, and turns them into facts. Every fact has to carry the exact sentence it came from, or it isn't kept. It can look; it can't send, delete or change anything." },
  { n: "03", name: "One board", when: "every run", body: "Plain Python, no model, renders one list from my loops, my job tracker and our household list, and checks it against what the mail says, so a rejected application drops off on its own." },
  { n: "04", name: "Night pass", when: "before 07:30", body: "Looks across what I've said, my written positions and three days of news for one connection worth waking me for. Most nights, nothing." },
  { n: "05", name: "Morning", when: "07:30", body: "One Telegram message: one move for the day, anything due, today's meetings with what it knows about each, and the night pass if it found something." },
  { n: "06", name: "Nine o'clock call", when: "21:00", body: "Reads everything I typed that day, everything that changed in my mail and calendar, and how I worked, then makes one call: what happened, the one thing for tomorrow, and what can wait. Quotes are checked against what I actually said. It's waiting at the top of every session the next morning, and it records whether I followed the last one." },
  { n: "07", name: "Review", when: "Fridays, 16:00", body: "Three questions: what closed, what's stuck, what to drop." },
];

const RULES = [
  "Nothing sends as me. The worst it can do is draft something and hand it to me.",
  "Every fact carries the sentence it came from. If the source doesn't back it, it's thrown out and counted.",
  "No agent gets all three of: my private data, text written by strangers, and a way to send things out. That's the combination that turns one cleverly worded email into a leak.",
];

// The refusal counts started on 5 Oct 2026. Earlier weeks say so rather than
// showing zeros, which would read as "it did nothing".
const REFUSALS_FROM = "2026-10-05";

function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

// One sentence from the latest week's counts, or nothing if any are missing.
function weekInWords(w: LedgerWeek | undefined) {
  if (!w || w.week_of < REFUSALS_FROM) return null;
  const { ticks, quiet, facts_kept, facts_thrown, closes } = w;
  if ([ticks, quiet, facts_kept, facts_thrown, closes].some((v) => typeof v !== "number")) return null;
  return (
    `In the week of ${formatDate(w.week_of)} it woke up ${plural(ticks!, "time")} and found nothing to do on ${quiet}; ` +
    `it kept ${plural(facts_kept!, "fact")} and threw out ${facts_thrown} it couldn't back up; ` +
    `it made ${closes === 0 ? "no nightly calls" : plural(closes!, "nightly call")}.`
  );
}

export default function Loops() {
  const ledger = getLedger();
  const lastWeek = weekInWords(ledger.weeks.at(-1));

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
            alt="The loop at a glance: capture, read, one board, the night pass, the morning message, the nine o'clock call and the weekly review, arranged as a cycle around a person."
          />
        </Reveal>

        {/* ---------------------------------------------------------- the idea */}
        <Reveal>
          <h2 id="idea" className="mai-kick rv-settle">
            the idea
          </h2>
          <p className="sec-title rv-settle">
            I start more than I finish, so the machine holds the list and I
            keep the calls.
          </p>
          <p className="muted rv-settle section-line">
            David Allen&rsquo;s point, picked up by Ben Thompson in{" "}
            <em>Write Things Down</em>: the mind is RAM.
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
          <p className="sec-title rv-settle">
            Seven steps on three clocks: day, overnight and weekly.
          </p>
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

        {/* ------------------------------------------------------- three rules */}
        <Reveal>
          <h2 id="rules" className="mai-kick rv-settle">
            three rules
          </h2>
          <p className="sec-title rv-settle">
            Each one is enforced in code, whatever the model says.
          </p>
        </Reveal>
        <Reveal>
          <ol className="loop-rules rv-settle">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </Reveal>

        {/* ---------------------------------------------------- the night pass */}
        <Reveal>
          <h2 id="night" className="mai-kick rv-settle">
            the night pass
          </h2>
          <p className="sec-title rv-settle">
            One link worth waking me for, or nothing.
          </p>
          <p className="muted rv-settle section-line">
            Overnight it looks for one link between something I&rsquo;ve said
            and something new worth reading, and quotes my own words back to
            me. Most nights it finds nothing, and says so. It&rsquo;s a
            rebuild of Sleep On It, which I made with three others at the
            Claude Communities Impact Lab in July.
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
          <p className="sec-title rv-settle">
            Counted by the system, including when it fails.
          </p>
          <p className="muted rv-settle section-line">
            {ledger.note} Running since {formatDate(ledger.started)}.
          </p>
        </Reveal>
        {/* The table, the test that would prove it wrong and the failure log
            sit in one panel, the way /evals holds its table. */}
        <Reveal>
          <div className="loop-ledger-panel rv-settle">
            <table className="loop-ledger">
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
            {ledger.weeks.some((w) => w.week_of >= REFUSALS_FROM && w.ticks !== undefined) && (
              <>
                <p className="loop-ledger-test">
                  Every ten minutes it wakes up, and most of the time it should
                  find nothing to do. When it learns something from my mail or
                  my sessions it has to show the sentence it came from; if it
                  can&rsquo;t, the fact is thrown out. A thrown-out fact is the
                  check working, not the system failing. A nightly call that
                  quotes something I never said, or uses a number I never gave
                  it, is held back.
                </p>
                {lastWeek && <p className="loop-ledger-line">{lastWeek}</p>}
                <table className="loop-ledger">
                  <thead>
                    <tr>
                      <th>week of</th>
                      <th>times it woke up</th>
                      <th>facts kept</th>
                      <th>facts thrown out</th>
                      <th>nightly calls made</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.weeks.map((w) => (
                      <tr key={w.week_of + "-refused"}>
                        <th scope="row">{formatDate(w.week_of)}</th>
                        {w.week_of < REFUSALS_FROM || w.ticks === undefined ? (
                          <td colSpan={4} className="loop-not-yet">not running yet</td>
                        ) : (
                          <>
                            <td>
                              {w.ticks}
                              {(w.quiet ?? 0) > 0 && <span className="loop-note">{w.quiet} with nothing to do</span>}
                            </td>
                            <td>{w.facts_kept}</td>
                            <td>{w.facts_thrown}</td>
                            <td>
                              {w.closes ?? 0}
                              {(w.closes_withheld ?? 0) > 0 && <span className="loop-note">{w.closes_withheld} held back</span>}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <p className="loop-ledger-test">
              What would make it wrong: captures climbing while closed loops
              stay flat. That would be a tidier way of not doing things. On 12
              October I check for exactly that, and cut the system back if I
              find it.
            </p>
            {ledger.broke.length > 0 && (
              <ol className="failure-log">
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
            )}
          </div>
        </Reveal>

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
