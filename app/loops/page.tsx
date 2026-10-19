import { getLedger, type LedgerWeek } from "@/lib/ledger";
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

// Two clocks: the day (capture, read, the list, the 9pm call) and the week
// (the Sunday read and the note). The clocks are the grouping on the page.
const STEPS = [
  { n: "01", clock: "day", name: "Capture", when: "any time", body: "When something comes to me, I text it to a bot or type /capture in whichever Claude Code session I have open, so I don't have to hold it in my head. It's kept word for word." },
  { n: "02", clock: "day", name: "Read", when: "every hour", body: "It reads my email, my calendar and what I type in my working sessions, so I don't have to remember who said what. It only keeps a fact if it can show the exact sentence the fact came from. It can look, but it can't send, delete or change anything." },
  { n: "03", clock: "day", name: "One list", when: "every run", body: "My open loops, my job applications and our household list end up on one list. Plain code builds it, with no AI involved, and anything my email says is already over drops off by itself." },
  { n: "04", name: "The 9pm call", when: "21:00", clock: "day", body: "It reads the day's work and makes one call: what happened, the one thing for tomorrow, and what can wait. The call is waiting at the top of every work session the next morning, and every quote in it is checked against what I actually said." },
  { n: "05", clock: "week", name: "The Sunday read", when: "Sundays", body: "It tells me what I worked across that week and what it thinks about how I'm working, with each point backed by my own words. I answer each one with yes, no, or a sentence of my own. A no is kept as a test the system is checked against every week, so it can't make the same mistake twice. It never asks for my opinion; it gives its read and I correct it." },
  { n: "06", clock: "week", name: "A note at the top", when: "weekly", body: "Once a week it writes five to seven lines on how to work with me, drawn from how my sessions with AI have actually gone. Every new Claude Code session starts with that note, so the AI I'm working with already knows how I work. If a line is wrong, I say so and it's corrected." },
];

const RULES = [
  "Nothing sends anything as me. The worst it can do is draft something and hand it to me.",
  "Every fact carries the sentence it came from. If the source doesn't back it, it's thrown out and counted.",
  "No part of it gets all three of: my private data, text written by strangers, and a way to send things out. That's the combination that turns one cleverly worded email into a leak.",
  "What I say outranks anything the AI inferred. My corrections are kept and checked again every week.",
];

// The morning message was switched off on 16 Oct 2026. Weeks that start after
// that say "off" rather than a zero, which would read as a dead system.
const MORNING_OFF = "2026-10-16";

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
    `In the week of ${formatDate(w.week_of)} it woke up ${plural(ticks!, "time")}` +
    (quiet! > 0 ? ` and found nothing to do on ${quiet}; ` : "; ") +
    `it kept ${plural(facts_kept!, "fact")} and threw out ${facts_thrown} it couldn't back up; ` +
    `it made ${closes === 0 ? "no nightly calls" : plural(closes!, "nightly call")}.`
  );
}

// A week still in progress reads as zeros, so the sentence describes the last
// week that has finished.
function finished(w: LedgerWeek) {
  return Date.parse(`${w.week_of}T00:00:00Z`) + 7 * 86_400_000 <= Date.now();
}

export default function Loops() {
  const ledger = getLedger();
  const lastWeek = weekInWords(ledger.weeks.filter(finished).at(-1));

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
            alt="The loop at a glance: capture, read, one list, the 9pm call, the Sunday read and the note at the top of every session, arranged as a cycle around a person."
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
            Six steps on two clocks: the day and the week.
          </p>
        </Reveal>
        {(
          [
            ["day", "every day"],
            ["week", "every week"],
          ] as const
        ).map(([clock, label]) => (
          <Reveal key={clock}>
            <h3 className="loop-clock rv-settle">{label}</h3>
            <ol className="loop-steps loop-steps-2 rv-settle">
              {STEPS.filter((s) => s.clock === clock).map((s) => (
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
        ))}
        <Reveal>
          <p id="cut" className="muted rv-settle section-line">
            I switched off the 07:30 morning message on Telegram (a messaging
            app) on 16 October. After a clean-up it sent 8 messages and got 0
            replies, and its one useful part, the call for the day, already
            reached me at the top of every session. The overnight pass and the
            Friday review now live in the Sunday read.
          </p>
        </Reveal>

        {/* -------------------------------------------------------- four rules */}
        <Reveal>
          <h2 id="rules" className="mai-kick rv-settle">
            four rules
          </h2>
          <p className="sec-title rv-settle">
            Each one is enforced in code, whatever the AI says.
          </p>
        </Reveal>
        <Reveal>
          <ol className="loop-rules rv-settle">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
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
                    <th scope="row">{formatDate(w.week_of)}{!finished(w) && <span className="loop-note">so far</span>}</th>
                    <td>{w.closed}</td>
                    <td>{w.captured}</td>
                    <td>
                      {w.week_of > MORNING_OFF ? (
                        <span className="loop-not-yet">off</span>
                      ) : (
                        <>
                          {w.briefs}
                          {w.fallbacks > 0 && <span className="loop-note">{w.fallbacks} fell back to plain text</span>}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="loop-ledger-line">
              The morning message was switched off on 16 Oct; see{" "}
              <a href="#cut">above</a>.
            </p>
            {ledger.weeks.some((w) => w.week_of >= REFUSALS_FROM && w.ticks !== undefined) && (
              <>
                <p className="loop-ledger-test">
                  It wakes up through the day, and most of the time it should
                  find nothing to do. When it learns something from my email or
                  my sessions, it has to show the sentence it came from. If it
                  can&rsquo;t, the fact is thrown out, and a thrown-out fact
                  means the check worked. A nightly call that
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
                        <th scope="row">{formatDate(w.week_of)}{!finished(w) && <span className="loop-note">so far</span>}</th>
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
              stay flat. That would be a tidier way of not doing things, and if
              the numbers show it, I cut the system back.
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
