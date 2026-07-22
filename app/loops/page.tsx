import { getLoops } from "@/lib/loops";

export const metadata = { title: "Loops · Elliot Little" };

const STATUS_LABEL: Record<string, string> = {
  running: "running",
  armed: "armed",
  paused: "paused",
};

export default function Loops() {
  const { loops } = getLoops();

  return (
    <main>
      <div className="wrap">
        <h1>Loops</h1>
        <p className="lede">
          The site runs on loops, not one-off scripts. An <b>inner</b> loop
          keeps a surface fresh; the <b>outer</b> loop steps back and proposes
          what to change next. The agent runs the inner work; a human stays on
          the outer rail, approving every change. This page is the control
          panel — cadence, cost, and the stopping rule for each one.
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

        <h2>how the outer loop works</h2>
        <p className="muted">
          Every cycle it reads real material — Elliot&apos;s public GitHub
          activity, his Medium writing, and the site&apos;s own current state —
          and proposes the single highest-leverage change to make the site more
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
