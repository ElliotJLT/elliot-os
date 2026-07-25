import { getPosts, noteFor } from "@/lib/writing";

export const metadata = { title: "Writing · Elliot Little" };

export default async function Writing() {
  const posts = await getPosts(20);
  const annotated = posts.filter((p) => noteFor(p.title));
  const rest = posts.filter((p) => !noteFor(p.title));

  return (
    <main>
      <div className="wrap">
        <h1>Writing</h1>
        <p className="lede">
          Essays about shipping AI to people who can&apos;t absorb a wrong
          answer, and about the judgement calls that survive after the demo
          works.
        </p>
        <p className="muted">
          Pulled live from the{" "}
          <a href="https://medium.com/@elliotJL">Medium feed</a> when this site
          builds, newest first. If I publish something, it appears here without
          me touching this page.
        </p>

        <h2>on AI, product and trust</h2>
        <ul className="record">
          {annotated.map((p) => (
            <li key={p.link}>
              <div className="rhead">
                <span className="rorg">
                  <a href={p.link}>{p.title}</a>
                </span>
                <span className="rmeta">{p.date}</span>
              </div>
              <p className="rout">{noteFor(p.title)}</p>
            </li>
          ))}
        </ul>

        {rest.length > 0 && (
          <>
            <h2>earlier</h2>
            <ul className="repolist">
              {rest.map((p) => (
                <li key={p.link}>
                  <a href={p.link}>{p.title}</a>
                  <span className="mono dim"> · {p.date}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2>elsewhere</h2>
        <p className="muted">
          I talked about building AI products that augment human relationships
          rather than replace them on{" "}
          <a href="https://open.spotify.com/episode/3D8quBCXrMNgIF87czhux3">
            Just Now Possible with Teresa Torres
          </a>
          . I studied AI governance and alignment with{" "}
          <a href="https://www.bluedot.org/">BlueDot Impact</a>.
        </p>
      </div>
    </main>
  );
}
