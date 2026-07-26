import { getLoops } from "@/lib/loops";
import { getAgentLog, getRoadmap } from "@/lib/content";

export const metadata = { title: "Loops · Elliot Little" };

const STATUS_LABEL: Record<string, string> = {
  running: "running",
  armed: "armed",
  paused: "paused",
};

export default function Loops() {
  const { loops } = getLoops();
  const agentLog = getAgentLog();
  const roadmap = getRoadmap();
  const open = [
    ...(roadmap["building"] || []).map((t) => ["building", t] as const),
    ...(roadmap["exploring"] || []).map((t) => ["exploring", t] as const),
  ];

  return (
    <main>
      <div className="wrap">
        {/* The "oo" is drawn as a lemniscate on the same baseline as the
            serif, traced continuously so the title performs what the page
            describes. Falls back to plain "Loops" without CSS or motion. */}
        <h1 className="loopstitle">
          L
          <span className="lemni" role="img" aria-label="oo">
            <svg viewBox="0 0 84 48" aria-hidden="true" focusable="false">
              <path
                className="lemni-trace"
                d="M42 24 C42 9 58 5 68 11 C78 17 78 31 68 37 C58 43 42 39 42 24 C42 9 26 5 16 11 C6 17 6 31 16 37 C26 43 42 39 42 24 Z"
                pathLength={100}
              />
            </svg>
          </span>
          ps
        </h1>
        <p className="lede">
          The site runs on loops, not one-off scripts. An <b>inner</b> loop
          keeps a surface fresh; the <b>outer</b> loop steps back and proposes
          what to change next. The agent runs the inner work; a human stays on
          the outer rail, approving every change. This page is the control
          panel: cadence, cost, and the stopping rule for each one.
        </p>

        <h2>running loops</h2>
        <div className="looplist">
          {loops.map((l) => (
            <div className="loopcard" key={l.id}>
              <div className="loophead">
                <span className={"layer " + l.layer}>{l.layer} loop</span>
                <h3>{l.name}</h3>
                <span className={"lstatus " + l.status}>
                  <span className="dot" />
                  {STATUS_LABEL[l.status] || l.status}
                </span>
              </div>
              <p className="loopnote">{l.note}</p>
              <dl className="loopmeta">
                <div>
                  <dt>surface</dt>
                  <dd>{l.surface}</dd>
                </div>
                <div>
                  <dt>cadence</dt>
                  <dd>{l.cadence}</dd>
                </div>
                <div>
                  <dt>gate</dt>
                  <dd>{l.gate}</dd>
                </div>
                <div>
                  <dt>runs</dt>
                  <dd>{l.runs}</dd>
                </div>
                <div>
                  <dt>last run</dt>
                  <dd>{l.last_run || "—"}</dd>
                </div>
                <div>
                  <dt>spend</dt>
                  <dd>${l.spend_usd.toFixed(4)}</dd>
                </div>
              </dl>
              <p className="stoprule">
                <span>stopping rule</span> {l.stop_rule}
              </p>

              {l.id === "now-refresh" && agentLog && (
                <div className="proposals">
                  <div className="ptitle">latest output</div>
                  <div
                    className="prose agentlog"
                    dangerouslySetInnerHTML={{ __html: agentLog }}
                  />
                </div>
              )}

              {l.proposals.length > 0 && (
                <div className="proposals">
                  <div className="ptitle">proposals</div>
                  {l.proposals.map((p, i) => (
                    <div className="proposal" key={i}>
                      <div className="phead">
                        <span className={"psrc " + p.source}>{p.source}</span>
                        <span className="pdate">{p.date}</span>
                        <span className={"pstatus " + p.status}>{p.status}</span>
                      </div>
                      <div className="pname">
                        {p.pr_url ? <a href={p.pr_url}>{p.title}</a> : p.title}
                      </div>
                      <p className="prat">{p.rationale}</p>
                      {p.eval && (
                        <div className="peval">
                          <span className={"verdict " + p.eval.verdict}>
                            eval: {p.eval.verdict} · {p.eval.score.toFixed(2)}
                          </span>
                          {p.eval.checks.map((c) => (
                            <span
                              key={c.name}
                              className={"echeck " + (c.pass ? "ok" : "no")}
                            >
                              {c.pass ? "✓" : "✕"} {c.name}
                            </span>
                          ))}
                          <span className="eby">{p.eval.by}</span>
                        </div>
                      )}
                      {p.eval?.critique && (
                        <p className="ecrit">“{p.eval.critique}”</p>
                      )}
                      {p.shipped && (
                        <p className="pshipped">→ shipped: {p.shipped}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <h2>open commitments</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          What the loops have not done yet. Kept short on purpose: shipped work
          belongs in the <a href="/changelog">changelog</a>, where it comes with
          a commit rather than a promise.
        </p>
        <ul className="record">
          {open.map(([state, title]) => (
            <li key={title}>
              <div className="rhead">
                <span className="rorg">{title}</span>
                <span className="rmeta">{state}</span>
              </div>
            </li>
          ))}
        </ul>

        <h2>how the outer loop works</h2>
        <p className="muted">
          Every cycle it reads real material (Elliot&apos;s public GitHub
          activity, his Medium writing, and the site&apos;s own current state)
          and proposes the single most useful change to make the site more
          compelling to employers hiring AI product engineers. It never invents
          activity; it surfaces what he actually did and how to frame it. The
          proposal arrives as a pull request. Merging it is the accept; closing
          it is the reject. Both are visible in the{" "}
          <a href="/changelog">changelog</a>.
        </p>
        <p className="faint mono">
          runs dormant by default: no schedule, no spend, until an API key is
          set and the workflow enabled. code:{" "}
          <a href="https://github.com/ElliotJLT/elliot-os/blob/main/scripts/agent-improve.mjs">
            scripts/agent-improve.mjs
          </a>
          .
        </p>
      </div>
    </main>
  );
}
