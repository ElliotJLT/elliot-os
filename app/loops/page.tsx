import { getLoops } from "@/lib/loops";
import { getAgentLog } from "@/lib/content";

export const metadata = { title: "Loops · Elliot Little" };

const STATUS_LABEL: Record<string, string> = {
  running: "running",
  armed: "armed",
  paused: "paused",
};

/**
 * The four-level stack from LangChain's "The Art of Loop Engineering", with an
 * honest mark against each. Published because the alternative is letting the
 * word "loop" do work the code has not earned: two of these rungs are not
 * attempted here, and saying so is cheaper than being caught.
 */
const LADDER: {
  level: number;
  name: string;
  needs: string;
  reality: string;
  verdict: string;
  state: "yes" | "partial" | "no";
}[] = [
  {
    level: 1,
    name: "agent loop",
    needs: "A model calling tools until the task is done.",
    reality:
      "Not this. The daily job is a deterministic script that reads the GitHub events API and writes a file, with one optional summarisation call at the end. Nothing iterates and no tool gets chosen.",
    verdict: "not reached",
    state: "no",
  },
  {
    level: 2,
    name: "verification loop",
    needs: "Output scored against a rubric and retried with the feedback when it fails.",
    reality:
      "Half. The improvement loop does score its own proposal before raising it, but the three checks are booleans that have never once failed, and a failure would stop the run rather than feed back into it.",
    verdict: "partial",
    state: "partial",
  },
  {
    level: 3,
    name: "event-driven loop",
    needs: "A schedule or a webhook fires the agent without anyone asking.",
    reality:
      "Yes. The shipping-log agent has run on its cron every morning, commits under its own identity, and posts \"quiet day\" rather than inventing activity when there is none.",
    verdict: "running",
    state: "yes",
  },
  {
    level: 4,
    name: "hill-climbing loop",
    needs: "Traces from past runs feed an analysis that rewrites the harness.",
    reality:
      "Not built. Nothing here reads its own history, so neither agent has ever got better at its job. This is the rung that actually compounds and it is the one I have not started.",
    verdict: "not built",
    state: "no",
  },
];

export default function Loops() {
  const { loops } = getLoops();
  const agentLog = getAgentLog();

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
          Two agents keep this site current. One runs on a schedule and
          rewrites the shipping log. The other reads what I have actually been
          doing and proposes a single change as a pull request I can close.
          Below is what each costs, what stops it, and where they sit on the
          ladder, including the rungs neither has reached.
        </p>

        <h2>where these actually sit</h2>
        <p className="muted" style={{ marginTop: 0 }}>
          Stacking loops is a known ladder, set out in LangChain&apos;s{" "}
          <a href="https://blog.langchain.com/the-art-of-loop-engineering/">
            The Art of Loop Engineering
          </a>{" "}
          and in swyx&apos;s loopcraft before it. A cron job dressed up in the
          vocabulary of agents takes an afternoon and proves nothing, so here
          is which rungs this site is actually on.
        </p>
        <ol className="ladder">
          {LADDER.map((l) => (
            <li key={l.level} data-state={l.state}>
              <div className="rhead">
                <span className="rorg">{l.name}</span>
                <span className="rmeta">{l.verdict}</span>
              </div>
              <p className="rout">
                <b>{l.needs}</b> {l.reality}
              </p>
            </li>
          ))}
        </ol>
        <p className="muted">
          One rung solidly, half of another, and two I have not attempted.
          Nothing here takes a failed check and feeds it back into the next
          attempt, so the daily job is really a schedule. Fixing that is the
          next build, and it is a bigger job than this page makes it look.
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
