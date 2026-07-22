import Link from "next/link";
import { getSpend, getWeekActivity } from "@/lib/telemetry";
import { getLog } from "@/lib/gitlog";
import FitConsole from "./components/FitConsole";
import Sparkline from "./components/Sparkline";

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
        <p className="lede">
          I&apos;m Elliot: builder-operator in London, 4x founding hire, most
          recently shipped a production multi-agent AI tutor. The AI discourse
          is full of productivity claims with no denominator. This site is the
          opposite bet: everything on it is derived from real activity, an
          agent maintains parts of it under its own git identity, and its
          inference costs are published in the footer.
        </p>

        <h2>telemetry</h2>
        <div className="statgrid">
          <div className="stat">
            <span className="label">commits · 7d</span>
            <span className="value">{week.commits}</span>
            <Sparkline days={week.days} />
          </div>
          <div className="stat">
            <span className="label">repos touched · 7d</span>
            <span className="value">{week.repos}</span>
          </div>
          <div className="stat">
            <span className="label">agent runs · all time</span>
            <span className="value">{spend.totals.runs}</span>
          </div>
          <div className="stat">
            <span className="label">agent spend · all time</span>
            <span className="value">
              <small>$</small>
              {spend.totals.cost_usd.toFixed(4)}
            </span>
          </div>
        </div>
        <p className="faint mono receipts">
          computed at build time from the GitHub API, data/spend.json, and git
          history. rebuilt {built} UTC{log[0] ? ` @ ${log[0].hash}` : ""}. no
          analytics, no cookies, nothing hand-typed.
        </p>

        <h2>fit engine</h2>
        <FitConsole />

        <h2>the report</h2>
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
