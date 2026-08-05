import { getLoops } from "@/lib/loops";
import { getAgentLog } from "@/lib/content";
import Reveal from "../components/Reveal";

export const metadata = { title: "Loops · Elliot Little" };

const AUTHORITY = [
  {
    system: "Shipping digest",
    reads: "Public GitHub events and commit metadata",
    changes: "/now, spend ledger and its own run record",
    evaluation: "Deterministic extraction; optional grounded summary",
    human: "Publishes without per-run approval; I own and can disable the workflow",
    health: "healthy",
    tone: "healthy",
  },
  {
    system: "Positioning review",
    reads: "Public GitHub, Medium and selected site source",
    changes: "A recommendation record and a PR containing that record",
    evaluation: "Three weak presence checks; optional model judge; no retry",
    human: "I implement, edit or reject the recommendation; the agent cannot alter the site",
    health: "dormant",
    tone: "dormant",
  },
];

const ANATOMY = [
  {
    name: "collect",
    owner: "code",
    copy: "Read public repositories, the latest Medium posts and selected site files.",
  },
  {
    name: "propose",
    owner: "code / model",
    copy: "Choose one gap. With no API key this is deterministic; with one, a model can frame it.",
  },
  {
    name: "check",
    owner: "weak gate",
    copy: "Test for a named source, non-cosmetic title and a rationale over forty characters.",
  },
  {
    name: "decide",
    owner: "me",
    copy: "I decide whether the recommendation deserves implementation, editing or rejection.",
  },
  {
    name: "record",
    owner: "manual today",
    copy: "Write the human outcome to the ledger. PR closure is not yet synchronised automatically.",
  },
];

function formatDate(value: string | null) {
  if (!value) return "never";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function daysSince(value: string | null) {
  if (!value) return null;
  const elapsed = Date.now() - new Date(`${value}T00:00:00Z`).getTime();
  return Math.max(0, Math.floor(elapsed / 86_400_000));
}

export default function Loops() {
  const data = getLoops();
  const agentLog = getAgentLog();
  const shipping = data.loops.find((system) => system.id === "now-refresh");
  const review = data.loops.find((system) => system.id === "self-improve");
  const lastDecision = data.decisions[0]?.date ?? null;
  const decisionAge = daysSince(lastDecision);

  return (
    <main>
      <div className="mai loops-page">
        <Reveal immediate>
          <header className="loops-hero">
            <div>
              <span className="loops-wordmark rv-settle" aria-label="Loops">
                L
                <span className="lemni" aria-hidden="true">
                  <svg viewBox="0 0 84 48" focusable="false">
                    <path
                      className="lemni-trace"
                      d="M42 24 C42 9 58 5 68 11 C78 17 78 31 68 37 C58 43 42 39 42 24 C42 9 26 5 16 11 C6 17 6 31 16 37 C26 43 42 39 42 24 Z"
                      pathLength={100}
                    />
                  </svg>
                </span>
                ps
              </span>
              <h1 className="wr-title rv-settle">
                Where agents act and where they stop.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Two narrow systems sit behind this site. One publishes facts
              from GitHub. The other recommends changes but cannot touch the
              site. Their sources, checks, failures and human boundaries are
              visible below.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="authority" className="mai-kick rv-settle">
            authority map
          </h2>
        </Reveal>
        <Reveal>
          <div className="authority-wrap rv-settle">
            <table className="authority-table">
              <thead>
                <tr>
                  <th>system</th>
                  <th>reads</th>
                  <th>may change</th>
                  <th>evaluation</th>
                  <th>human boundary</th>
                  <th>health</th>
                </tr>
              </thead>
              <tbody>
                {AUTHORITY.map((row) => (
                  <tr key={row.system}>
                    <th scope="row" data-label="system">{row.system}</th>
                    <td data-label="reads">{row.reads}</td>
                    <td data-label="may change">{row.changes}</td>
                    <td data-label="evaluation">{row.evaluation}</td>
                    <td data-label="human boundary">{row.human}</td>
                    <td data-label="health">
                      <span className={`system-health ${row.tone}`}>{row.health}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal>
          <h2 id="decisions" className="mai-kick rv-settle">
            decision record
          </h2>
        </Reveal>
        <Reveal>
          <div className="decision-record rv-settle">
            <div className="decision-denominator">
              <span>{data.decisions.length} recorded decision</span>
              <span>0 rejected</span>
              <span>0 edited</span>
              <span>0 no-op reviews</span>
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
              <span>What this does not prove yet</span> One accepted suggestion
              is not evidence of a mature system. Signal counts, edited and
              rejected recommendations, disagreement reasons, time saved and
              cost per accepted outcome are not recorded yet.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <h2 id="anatomy" className="mai-kick rv-settle">
            anatomy of the positioning review
          </h2>
        </Reveal>
        <Reveal>
          <div className="anatomy-viewport rv-settle" tabIndex={0}>
            <ol className="agent-anatomy" aria-label="Positioning review stages">
              {ANATOMY.map((stage, index) => (
                <li key={stage.name}>
                  <span className="anatomy-no">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{stage.name}</h3>
                  <span className="anatomy-owner">[{stage.owner}]</span>
                  <p>{stage.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

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
                  <span className={`failure-status ${failure.status}`}>{failure.status}</span>
                </div>
                <div>
                  <h3>{failure.title}</h3>
                  <p>{failure.effect}</p>
                  <p className="failure-change"><span>change</span> {failure.change}</p>
                  {failure.evidence_url && <a href={failure.evidence_url}>evidence ↗</a>}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal>
          <h2 id="history" className="mai-kick rv-settle">
            compact history
          </h2>
        </Reveal>
        <Reveal>
          <div className="system-history rv-settle">
            {shipping && (
              <article>
                <div className="system-history-head">
                  <h3>{shipping.name}</h3>
                  <span className="system-health healthy">healthy</span>
                </div>
                <dl>
                  <div><dt>successful runs</dt><dd>{shipping.runs}</dd></div>
                  <div><dt>last run</dt><dd>{formatDate(shipping.last_run)}</dd></div>
                  <div><dt>model spend</dt><dd>${shipping.spend_usd.toFixed(4)}</dd></div>
                </dl>
                <p>{shipping.note}</p>
              </article>
            )}
            {review && (
              <article>
                <div className="system-history-head">
                  <h3>{review.name}</h3>
                  <span className="system-health dormant">dormant</span>
                </div>
                <dl>
                  <div><dt>manual runs</dt><dd>{review.runs}</dd></div>
                  <div><dt>last decision</dt><dd>{formatDate(lastDecision)}</dd></div>
                  <div><dt>days since outcome</dt><dd>{decisionAge ?? "—"}</dd></div>
                </dl>
                <p>{review.note}</p>
              </article>
            )}
          </div>
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
            <a href="https://github.com/ElliotJLT/elliot-os/blob/main/scripts/agent-now.mjs">shipping digest source ↗</a>
            <a href="https://github.com/ElliotJLT/elliot-os/blob/main/scripts/agent-improve.mjs">positioning review source ↗</a>
            <a href="https://github.com/ElliotJLT/elliot-os/actions">workflow runs ↗</a>
          </nav>
        </Reveal>
      </div>
    </main>
  );
}
