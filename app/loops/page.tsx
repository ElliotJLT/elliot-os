import { getLoops, type Loop, type Proposal } from "@/lib/loops";
import { getEvals, getCases } from "@/lib/evals";
import { getPricing } from "@/lib/pricing";
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
  const pricing = getPricing();
  const agentLog = getAgentLog();

  const review = data.loops.find((l) => l.id === "self-improve");
  const runs = evals.runs;
  const latestEval = runs[0];
  const firstEval = runs[runs.length - 1];
  const improved = latestEval && firstEval && latestEval.passed > firstEval.passed;

  // The most recent thing the review actually did, gate result and all.
  const trace: Proposal | undefined = review?.proposals?.[0];

  const allProposals = data.loops.flatMap((l) => l.proposals ?? []);
  const heldCount = allProposals.filter((p) => p.status === "held").length;
  const byOutcome = (o: string) => data.decisions.filter((d) => d.outcome === o).length;

  const caseFor = (id: string) => cases.find((c) => c.id === id);

  return (
    <main>
      <div className="mai loops-page">
        <Reveal immediate>
          <header className="loops-hero">
            <div>
              <span className="mai-kick rv-settle">Loops</span>
              <h1 className="wr-title rv-settle">
                The loops I actually run.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Agents that run on a schedule and change something real. Most of
              mine are private, so you have only my word for them. Two are not:
              they maintain this page, their source and their eval suite are
              open, and everything below the list is me showing my working on
              those.
            </p>
          </header>
        </Reveal>

        {/* ------------------------------------------------------- the fleet */}
        <Reveal>
          <h2 id="fleet" className="mai-kick rv-settle">
            the fleet
          </h2>
        </Reveal>
        <Reveal>
          <div className="authority-wrap rv-settle">
            <table className="authority-table">
              <thead>
                <tr>
                  <th>loop</th>
                  <th>reads</th>
                  <th>may change</th>
                  <th>human boundary</th>
                  <th>last run</th>
                  <th>can you check it</th>
                </tr>
              </thead>
              <tbody>
                {data.loops.map((loop: Loop) => (
                  <tr key={loop.id}>
                    <th scope="row" data-label="loop">
                      {loop.name}
                      <span className="authority-cadence">{loop.cadence}</span>
                    </th>
                    <td data-label="reads">{loop.reads}</td>
                    <td data-label="may change">{loop.may_change}</td>
                    <td data-label="human boundary">{loop.human_boundary}</td>
                    <td data-label="last run">
                      {formatDate(loop.last_run)}
                      <span className="authority-cadence">
                        <span className={`system-health ${loop.status}`}>
                          {loop.status}
                        </span>
                      </span>
                    </td>
                    <td data-label="can you check it">
                      {loop.evidence === "public" ? (
                        <span className="evidence-yes">
                          source + evals
                          {loop.audited && <em>audited below</em>}
                        </span>
                      ) : (
                        <span className="evidence-no">my word</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="authority-foot">
              The last column is the one that matters. A list of private agents
              is a list of claims, and claims are cheap — so the two you can
              open are the ones the rest of this page is about. Stopping rules,
              in each loop&rsquo;s own words:{" "}
              {data.loops.map((loop, i) => (
                <span key={loop.id}>
                  {i > 0 && " "}
                  <em>{loop.name}</em> — {loop.stop_rule}.
                </span>
              ))}
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ eval suite */}
        <Reveal>
          <h2 id="evals" className="mai-kick rv-settle">
            the two you can audit
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

        {/* ------------------------------------------------------- run trace */}
        {trace && (
          <>
            <Reveal>
              <h2 id="trace" className="mai-kick rv-settle">
                last run, end to end
              </h2>
            </Reveal>
            <Reveal>
              <div className="run-trace rv-settle">
                <div className="trace-meta">
                  <time dateTime={trace.date}>{formatDate(trace.date)}</time>
                  <span className={`decision-outcome ${trace.status === "held" ? "rejected" : "accepted"}`}>
                    {trace.status === "held" ? "held by the gate" : "cleared the gate"}
                  </span>
                  {trace.impl_version && (
                    <span className="trace-version">
                      impl v{trace.impl_version} · prompt v{trace.prompt_version}
                    </span>
                  )}
                </div>

                <ol className="trace-steps">
                  <li>
                    <span className="trace-step">read</span>
                    <p>
                      Public repositories, the Medium feed, and the site&rsquo;s
                      own source for what it already surfaces.
                    </p>
                  </li>
                  <li>
                    <span className="trace-step">propose</span>
                    <p>
                      <strong>{trace.title}</strong>
                    </p>
                    <p className="trace-rationale">{trace.rationale}</p>
                  </li>
                  <li>
                    <span className="trace-step">gate</span>
                    <ul className="trace-checks">
                      {trace.eval?.checks.map((check) => (
                        <li key={check.name} data-pass={check.pass}>
                          <span>{check.pass ? "pass" : "fail"}</span>
                          {check.name}
                        </li>
                      ))}
                    </ul>
                    {trace.eval?.critique && (
                      <p className="trace-rationale">{trace.eval.critique}</p>
                    )}
                    <p className="trace-by">
                      judged by {trace.eval?.by}. Every check is required.
                    </p>
                  </li>
                  <li>
                    <span className="trace-step">decide</span>
                    <p>
                      Mine. The agent opens a pull request containing the
                      recommendation, not the change.
                    </p>
                  </li>
                </ol>
              </div>
            </Reveal>
          </>
        )}

        {/* ------------------------------------------------- decision record */}
        <Reveal>
          <h2 id="decisions" className="mai-kick rv-settle">
            decision record
          </h2>
        </Reveal>
        <Reveal>
          <div className="decision-record rv-settle">
            <div className="decision-denominator">
              <span>
                {allProposals.length} proposal
                {allProposals.length === 1 ? "" : "s"}
              </span>
              <span>{heldCount} held by the gate</span>
              <span>{byOutcome("accepted")} accepted</span>
              <span>{byOutcome("edited")} edited</span>
              <span>{byOutcome("rejected")} rejected</span>
            </div>
            <ol className="decision-list">
              {data.decisions.map((decision) => (
                <li key={`${decision.date}-${decision.title}`}>
                  <time dateTime={decision.date}>{formatDate(decision.date)}</time>
                  <span className={`decision-outcome ${decision.outcome}`}>
                    {decision.outcome}
                  </span>
                  <div>
                    <h3>{decision.title}</h3>
                    <p>{decision.human_decision}</p>
                    {decision.evidence_url && (
                      <a href={decision.evidence_url}>view the implementing commit ↗</a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className="evidence-gap">
              <span>What this does not prove yet</span> The review has run twice
              and the outcome column is thin. Until there are rejections in it,
              the acceptance rate is a number with no denominator worth quoting.
              Time saved and cost per accepted outcome are not recorded at all.
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

        <Reveal>
          <p className="pricing-note rv-settle">
            Token counts in the ledger are measured. Any dollar figure derived
            from them uses the rates in <code>data/pricing.json</code>, last
            checked {formatDate(pricing.checked)} — model pricing changes
            without notice, so treat an old date as a reason to re-verify rather
            than a number to rely on.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
