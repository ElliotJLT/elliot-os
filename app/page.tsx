import Link from "next/link";
import { getSpend, getWeekActivity } from "@/lib/telemetry";
import { getLog } from "@/lib/gitlog";

export default async function Home() {
  const [week, spend, log] = [await getWeekActivity(), getSpend(), getLog(1)];
  const built = new Date().toISOString().slice(0, 16).replace("T", " ");

  return (
    <main>
      <div className="wrap">
        <p>
          <span className="status">
            <span className="dot" />
            operational · interviewing
          </span>
        </p>
        <h1 style={{ marginTop: 16 }}>
          Every PM says they&apos;re data-driven. This site has a P&amp;L.
        </h1>
        <p className="muted" style={{ fontSize: 17 }}>
          I&apos;m Elliot: builder-operator in London, 4x founding hire, most
          recently shipped a production multi-agent AI tutor. The AI discourse
          is full of productivity claims with no denominator. This site is the
          opposite bet: everything on it is derived from real activity, an
          agent maintains parts of it under its own git identity, and its
          inference costs are published in the footer.
        </p>

        <h2>telemetry</h2>
        <table className="telemetry">
          <tbody>
            <tr>
              <td>commits pushed, last 7 days (public repos)</td>
              <td>{week.commits}</td>
            </tr>
            <tr>
              <td>repos touched, last 7 days</td>
              <td>{week.repos}</td>
            </tr>
            <tr>
              <td>agent runs on this site, all time</td>
              <td>{spend.totals.runs}</td>
            </tr>
            <tr>
              <td>agent inference spend, all time</td>
              <td>${spend.totals.cost_usd.toFixed(4)}</td>
            </tr>
            <tr>
              <td>this page rebuilt</td>
              <td>
                {built} UTC{log[0] ? ` @ ${log[0].hash}` : ""}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="faint mono" style={{ marginTop: 8 }}>
          computed at build time from the GitHub API, data/spend.json, and git
          history. no analytics, no cookies, nothing hand-typed.
        </p>

        <div className="fit">
          <h3>Evaluating me for a role? Ask your agent, not me.</h3>
          <p className="muted" style={{ fontSize: 15 }}>
            Paste this into Claude, ChatGPT, or any agent with web access. It
            reads the structured version of this site and gives you an honest
            take, including when I&apos;m the wrong fit.
          </p>
          <pre>
            {`Read https://elliotjlt.github.io/elliot-os/llms.txt and the raw sources it links. Then assess Elliot Little against this job spec: [paste your spec]. Be critical. If he is not a strong fit, say so and say why.`}
          </pre>
          <p className="faint mono">
            a hosted fit engine is on the <Link href="/next">roadmap</Link>.
            until then your agent does the job, and unlike mine, you already
            trust it.
          </p>
        </div>

        <div className="grid">
          <Link href="/built" className="card">
            <h3>built</h3>
            <p>
              A production AI tutor that beat major US labs to a government
              tender, plus agent tools and MCP servers. Repo list pulled live
              from GitHub at every deploy.
            </p>
          </Link>
          <Link href="/now" className="card">
            <h3>now</h3>
            <p>
              This week&apos;s shipping log, derived from real commits by a
              scheduled agent. One hand-written section for the things git
              can&apos;t see.
            </p>
          </Link>
          <Link href="/next" className="card">
            <h3>next</h3>
            <p>
              The public roadmap. Bets marked exploring, building, or shipped.
              Items graduate in the open; missed promises stay visible.
            </p>
          </Link>
          <Link href="/changelog" className="card">
            <h3>changelog</h3>
            <p>
              Every change is a commit, badged by who made it: me or the
              agent. The receipt trail for every claim above.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
