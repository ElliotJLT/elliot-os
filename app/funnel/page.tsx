import { getFunnel } from "@/lib/telemetry";

export const metadata = { title: "Funnel · Elliot Little" };

export default function Funnel() {
  const funnel = getFunnel();
  const top = funnel.stages[0]?.count ?? 0;
  const live = funnel.published && top > 0;

  return (
    <main>
      <div className="wrap">
        <h1>Funnel</h1>
        <p className="lede">
          The job search, instrumented the same way everything else here is.
          Rates and counts only — no company names while conversations are
          open. Same honesty rule as the roadmap: if the numbers are
          unflattering, they stay up.
        </p>

        <h2>conversion</h2>
        {live ? (
          <>
            <div className="funnel">
              {funnel.stages.map((s, i) => {
                const pct = top > 0 ? Math.round((s.count / top) * 100) : 0;
                const prev = funnel.stages[i - 1]?.count ?? s.count;
                const step =
                  i === 0 || prev === 0
                    ? null
                    : Math.round((s.count / prev) * 100);
                return (
                  <div className="stage" key={s.name}>
                    <div className="bar">
                      <div
                        className="fill"
                        style={{ width: `${Math.max(pct, 6)}%` }}
                      />
                      <div className="row">
                        <span className="name">{s.name}</span>
                        <span className="num">{s.count}</span>
                      </div>
                    </div>
                    {step !== null && (
                      <span className="conv">
                        {step}% from previous stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="faint mono receipts">
              window: {funnel.window}
              {funnel.updated ? ` · updated ${funnel.updated}` : ""} · derived
              from data/funnel.json, versioned in the changelog.
            </p>
          </>
        ) : (
          <div className="emptyfunnel">
            <p style={{ margin: "0 0 10px" }}>
              ▸ dashboard instrumented · awaiting the first published cohort
            </p>
            <p style={{ margin: 0 }}>
              The page reads from{" "}
              <code style={{ fontSize: 12 }}>data/funnel.json</code> and renders
              conversion between stages the moment there are numbers worth
              publishing. It stays dark until then rather than showing
              placeholder figures — a fabricated funnel would defeat the point
              of the whole site. Applications, response rate, and interview
              conversion will appear here, counts and rates only.
            </p>
          </div>
        )}

        <h2>why this exists</h2>
        <p className="muted">
          A search is a pipeline, and pipelines have conversion rates. Tracking
          mine keeps me honest about what&apos;s actually working — which
          roles, which stages leak — and lets me fix the process instead of
          guessing. Publishing it is the same bet the rest of the site makes:
          show the real activity, not the claim about it.
        </p>
      </div>
    </main>
  );
}
