import { getLoops } from "@/lib/loops";
import { getAgentLog } from "@/lib/content";
import Reveal from "../components/Reveal";

export const metadata = { title: "Loops · Elliot Little" };

const STATUS_LABEL: Record<string, string> = {
  running: "running",
  armed: "armed",
  paused: "paused",
};

/**
 * The ladder from "The Loop Was Never the Hard Part", marked against the site
 * that publishes it. Each rung hands the machine one more piece of the job:
 * the check, the stop condition, the trigger, the prompt. Two of these are not
 * where the article's argument would predict, which is the point of showing it.
 */
const LADDER: {
  name: string;
  needs: string;
  reality: string;
  verdict: string;
  state: "yes" | "partial" | "no";
}[] = [
  {
    name: "the check",
    needs: "What correct looks like is written down, so the loop can verify its own work instead of you eyeballing it.",
    reality:
      "Half. The improvement loop scores its proposal before raising it, but the three checks are booleans and not one of them has ever failed.",
    verdict: "partial",
    state: "partial",
  },
  {
    name: "the stop condition",
    needs: "Done is defined, and a second model judges every attempt against it until it passes or runs out of tries.",
    reality:
      "Missing. Nothing judges an attempt or retries one. Both agents run once and hand in whatever came out.",
    verdict: "not reached",
    state: "no",
  },
  {
    name: "the trigger",
    needs: "It runs on a schedule or watches for events, laptop open or not.",
    reality:
      "Yes. The shipping-log agent has fired on its cron every morning, commits under its own identity, and posts \"quiet day\" rather than inventing activity when there is none.",
    verdict: "running",
    state: "yes",
  },
  {
    name: "the prompt",
    needs: "The loop watches your work, decides what needs doing, does it, and something reviews it before you see it. Your job is the merge.",
    reality:
      "Built, switched off. The improvement loop reads real activity and raises one change as a pull request, which is this rung by design. It has run once, by hand, and has never been put on its schedule.",
    verdict: "dormant",
    state: "partial",
  },
];

export default function Loops() {
  const { loops } = getLoops();
  const agentLog = getAgentLog();

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            {/* The "oo" is drawn as a lemniscate on the same baseline as the
                serif, traced continuously so the title performs what the page
                describes. Falls back to plain "Loops" without CSS or motion. */}
            <h1 className="wr-title rv-settle">
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
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Two agents keep this site current. One runs on a schedule and
              rewrites the shipping log. The other reads what I have actually
              been doing and proposes a single change as a pull request I can
              close. What each one costs and what stops it is below. So are
              the rungs neither of them has reached.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">where these actually sit</h2>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle" style={{ marginTop: 0 }}>
            A loop is an agent repeating cycles of work until a stop condition
            is met. The ladder is what you hand over at each rung: the check,
            the stop condition, the trigger, the prompt. I set that out in{" "}
            <a href="https://medium.com/@elliotJL/the-loop-was-never-the-hard-part-5bdd4352acab">
              The Loop Was Never the Hard Part
            </a>
            . So here is where this site actually sits.
          </p>
        </Reveal>
        <Reveal>
          <ol className="ladder rv-settle">
            {LADDER.map((l) => (
              <li key={l.name} data-state={l.state}>
                <div className="rung-head">
                  <span className="rung-no" />
                  <span className="rung-name">{l.name}</span>
                  <span className="rung-verdict">{l.verdict}</span>
                </div>
                <p className="rung-needs">{l.needs}</p>
                <p className="rout">{l.reality}</p>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle">
            The gap is rung two. The trigger runs daily and the top rung is
            built, and there is nothing judging attempts in between. That is
            the setup I called an outage with a subscription. This one is
            not, only because it costs nothing and cannot break anything.
          </p>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle">
            Rung one has a worse version of the same problem. In{" "}
            <a href="https://medium.com/@elliotJL/the-product-engineer-and-the-end-of-the-handoff-93181f170779">
              The Product Engineer and the End of the Handoff
            </a>{" "}
            I argued that you uncover a rubric by reading real failures rather
            than inventing one up front. I invented these up front. That is
            why they pass every time. Writing a stop condition that can
            actually reject something is the next job, and I probably cannot
            write a good one until this thing has failed a few times where
            people can see it.
          </p>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">running loops</h2>
        </Reveal>
        <Reveal>
        <div className="looplist rv-settle">
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
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">how the outer loop works</h2>
        </Reveal>
        <Reveal>
          <p className="muted rv-settle">
            Every cycle it reads real material (Elliot&apos;s public GitHub
            activity, his Medium writing, and the site&apos;s own current
            state) and proposes the single most useful change to make the
            site more compelling to employers hiring AI product engineers. It
            never invents activity; it surfaces what he actually did and how
            to frame it. The proposal arrives as a pull request. Merging it is
            the accept; closing it is the reject. Both are visible in the{" "}
            <a href="/changelog">changelog</a>.
          </p>
        </Reveal>
        <Reveal>
          <p className="faint mono rv-settle">
            runs dormant by default: no schedule, no spend, until an API key
            is set and the workflow enabled. code:{" "}
            <a href="https://github.com/ElliotJLT/elliot-os/blob/main/scripts/agent-improve.mjs">
              scripts/agent-improve.mjs
            </a>
            .
          </p>
        </Reveal>
      </div>
    </main>
  );
}
