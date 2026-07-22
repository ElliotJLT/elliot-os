import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="wrap">
        <p className="status">
          <span className="dot" />
          status: operational · currently: interviewing
        </p>
        <h1 style={{ marginTop: 18 }}>Elliot Little</h1>
        <p className="muted" style={{ fontSize: 18 }}>
          Builder-operator, London. 4x founding hire. I ship AI products and
          the systems around them, and this site is one of those systems:
          parts of it are maintained by agents, and the{" "}
          <Link href="/changelog">commit history</Link> shows which parts.
        </p>

        <div className="fit">
          <h3>Paste a job spec. Get an honest answer.</h3>
          <p className="muted" style={{ fontSize: 15 }}>
            The fit engine reads your spec against everything I have shipped
            and tells you, with receipts, whether I am your person. It will
            also tell you when I am not.
          </p>
          <textarea
            rows={3}
            disabled
            placeholder="Shipping soon. It's on the roadmap, which is public, so you can hold me to it. Until then: elliotjlittle@gmail.com"
          />
        </div>

        <div className="grid">
          <Link href="/built" className="card">
            <h3>built</h3>
            <p>
              Shipped work. A production AI tutor, agent tools, MCP servers,
              apps. Pulled live from GitHub at every deploy.
            </p>
          </Link>
          <Link href="/now" className="card">
            <h3>now</h3>
            <p>
              What I am doing this week. An agent takes ownership of this page
              soon; the byline will say so when it does.
            </p>
          </Link>
          <Link href="/next" className="card">
            <h3>next</h3>
            <p>
              The public roadmap. Bets marked exploring, building, or shipped.
              Items graduate; nothing quietly disappears.
            </p>
          </Link>
          <Link href="/changelog" className="card">
            <h3>changelog</h3>
            <p>
              Every change to this site is a commit, including the ones agents
              make. This is the receipt trail.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
