import { getLoops } from "@/lib/loops";
import { getEvals, getCases } from "@/lib/evals";
import { getLedger } from "@/lib/ledger";
import { getAgentLog } from "@/lib/content";
import Reveal from "../components/Reveal";

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

export default function Loops() {
  const data = getLoops();
  const evals = getEvals();
  const cases = getCases();
  const ledger = getLedger();
  const agentLog = getAgentLog();

  const runs = evals.runs;
  const latestEval = runs[0];
  const firstEval = runs[runs.length - 1];
  const improved = latestEval && firstEval && latestEval.passed > firstEval.passed;
  const caseFor = (id: string) => cases.find((c) => c.id === id);

  return (
    <main>
      <div className="mai loops-page">
        <Reveal immediate>
          <header className="loops-hero">
            <div>
              <span className="mai-kick rv-settle">Loops</span>
              <h1 className="wr-title rv-settle">
                What I hand to machines, and what I keep.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              One system I run my own work on, measured by a ledger that can
              show it failing. One that keeps this site current, with its evals
              open below.
            </p>
          </header>
        </Reveal>

        {/* -------------------------------------------------- the one I live in */}
        <Reveal>
          <h2 id="live" className="mai-kick rv-settle">
            the one I live in
          </h2>
          <p className="muted rv-settle section-line">
            Ben Thompson&rsquo;s point in <em>Write Things Down</em> is David
            Allen&rsquo;s: the mind is RAM, and an assistant that writes
            everything down lets you empty it. Mine is Claude Code and a few
            scripts. I text a thought to a bot and it lands in an inbox. A sweep
            turns it into next actions. At 07:30 I get one move for the day. Job
            applications and household tasks stay in the tools that own them;
            the system reads them and never copies them.
          </p>
        </Reveal>
        <Reveal>
          <div className="authority-wrap rv-settle">
            <table className="authority-table">
              <thead>
                <tr>
                  <th>the machine holds</th>
                  <th>I keep</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>capture, the tickler, what&rsquo;s overdue, who to chase, what I said three weeks ago</td>
                  <td>which move matters today, what to kill, what to ship, anything with my name on it</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal>
          <div className="authority-wrap rv-settle">
            <table className="authority-table">
              <thead>
                <tr>
                  <th>week of</th>
                  <th>loops closed</th>
                  <th>thoughts captured</th>
                  <th>morning briefs</th>
                </tr>
              </thead>
              <tbody>
                {ledger.weeks.map((w) => (
                  <tr key={w.week_of}>
                    <th scope="row" data-label="week of">{formatDate(w.week_of)}</th>
                    <td data-label="loops closed">{w.closed}</td>
                    <td data-label="thoughts captured">{w.captured}</td>
                    <td data-label="morning briefs">
                      {w.briefs}
                      {w.fallbacks > 0 && (
                        <span className="authority-cadence">{w.fallbacks} fell back to plain text</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="authority-foot">
              {ledger.note} Running since {formatDate(ledger.started)}. What
              would make it wrong: captures climbing while closed loops stay
              flat. That would be a tidier way of not doing things, and on 12
              October I check for it and cut the system back if so.
            </p>
          </div>
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

        {/* --------------------------------------------------- the site's own */}
        <Reveal>
          <h2 id="site" className="mai-kick rv-settle">
            the one that keeps this site current
          </h2>
          <p className="muted rv-settle section-line">
            A daily agent turns my public GitHub activity into the shipping
            digest below. It never fabricates a busy week: a quiet day posts
            &ldquo;quiet day&rdquo;. Its evals are the part worth reading.
          </p>
        </Reveal>

        {/* ------------------------------------------------------ eval suite */}
        <Reveal>
          <h2 id="evals" className="mai-kick rv-settle">
            its evals
          </h2>
        </Reveal>
        <Reveal>
          <div className="eval-panel rv-settle">
            <div className="eval-head">
              <div className="eval-rate">
                <strong>
                  {latestEval.passed}<span>/{latestEval.total}</span>
                </strong>
                <span className="eval-rate-label">
                  review v{latestEval.impl_version} · prompt v
                  {latestEval.prompt_version}
                  {latestEval.digest_version &&
                    ` · digest v${latestEval.digest_version}`}
                </span>
              </div>
              <p>
                {cases.length} held-out cases covering both systems, run against
                the same functions they call in production rather than a copy of
                them. No model runs in the suite, so it is deterministic, free,
                and able to gate every commit.
              </p>
            </div>

            <ol className="eval-history">
              {runs.map((run) => (
                <li key={`${run.impl_version}-${run.prompt_version}-${run.date}`}>
                  <div className="eval-run-head">
                    <span className="eval-version">
                      review v{run.impl_version} · prompt v{run.prompt_version}
                      {run.digest_version && ` · digest v${run.digest_version}`}
                    </span>
                    <span className="eval-score">
                      {run.passed}/{run.total}
                    </span>
                  </div>
                  <div
                    className="eval-bar"
                    role="img"
                    aria-label={`${run.passed} of ${run.total} cases passing`}
                  >
                    <span style={{ width: `${(run.passed / run.total) * 100}%` }} />
                  </div>
                  {run.failing.length > 0 && (
                    <ul className="eval-failing">
                      {run.failing.map((id) => (
                        <li key={id}>
                          <code>{id}</code>
                          {caseFor(id) && <span>{caseFor(id)!.why}</span>}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>

            {improved && (
              <p className="eval-note">
                <span>What the three runs are</span> The cases were written
                against the behaviour these systems should have, then run
                against the behaviour they had, so the first number is what was
                actually deployed rather than a starting point chosen to
                flatter. The review&rsquo;s gate averaged three checks against a
                0.6 threshold, making its worst possible score 0.67 — it could
                not reject anything, and a proposal citing a repository that
                does not exist passed as grounded. The digest built every commit
                URL as <code>/repos/ElliotJLT/&#123;name&#125;</code>, so work on
                anyone else&rsquo;s project 404ed and vanished, and it ignored
                pull requests entirely. Both now hold, and the suite fails the
                build if either slips back.
              </p>
            )}
            <p className="eval-caveat">
              <span>What this does not prove</span> I wrote the cases, so the
              suite tests my idea of correct. {cases.length} cases is a small
              set, and a green run means no known regression rather than a
              correct agent. Its value is the next change, not this number: the
              pass rate is recorded per version, so an edit that makes the
              output feel better while scoring worse is visible instead of
              arguable.
            </p>
          </div>
        </Reveal>


        {/* ------------------------------------------------------ failure log */}
        <Reveal>
          <h2 id="failures" className="mai-kick rv-settle">
            failure log
          </h2>
        </Reveal>
        <Reveal>
          <ol className="failure-log rv-settle">
            {data.failures.map((failure) => (
              <li key={`${failure.date}-${failure.title}`}>
                <div className="failure-meta">
                  <time dateTime={failure.date}>{formatDate(failure.date)}</time>
                  <span className={`failure-status ${failure.status}`}>
                    {failure.status}
                  </span>
                </div>
                <div>
                  <h3>{failure.title}</h3>
                  <p>{failure.effect}</p>
                  <p className="failure-change">
                    <span>change</span> {failure.change}
                  </p>
                  {failure.evidence_url && <a href={failure.evidence_url}>evidence ↗</a>}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        {agentLog && (
          <Reveal>
            <details className="latest-digest rv-settle">
              <summary>Latest automatically published shipping digest</summary>
              <div
                className="prose agentlog"
                dangerouslySetInnerHTML={{ __html: agentLog }}
              />
            </details>
          </Reveal>
        )}

        <Reveal>
          <nav className="machinery-links rv-settle" aria-label="Agent system source code">
            <span>the machinery</span>
            <a href="https://github.com/ElliotJLT/elliot-os/tree/main/evals">
              the golden set ↗
            </a>
            <a href="https://github.com/ElliotJLT/elliot-os/blob/main/scripts/lib/positioning.mjs">
              review logic ↗
            </a>
            <a href="https://github.com/ElliotJLT/elliot-os/blob/main/scripts/lib/shipping.mjs">
              digest logic ↗
            </a>
            <a href="https://github.com/ElliotJLT/elliot-os/actions">workflow runs ↗</a>
          </nav>
        </Reveal>
      </div>
    </main>
  );
}
