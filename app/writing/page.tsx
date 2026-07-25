import { getPosts, noteFor, getMedia } from "@/lib/writing";

export const metadata = { title: "Writing · Elliot Little" };

const basePath = process.env.BASE_PATH || "";

export default async function Writing() {
  const posts = await getPosts(20);
  const media = getMedia();
  const annotated = posts.filter((p) => noteFor(p.title));
  const rest = posts.filter((p) => !noteFor(p.title));

  return (
    <main>
      <div className="wrap">
        <h1>Writing</h1>
        <p className="lede">
          Essays about shipping AI to people who can&apos;t absorb a wrong
          answer, and about the judgment calls that survive after the demo
          works.
        </p>
        <p className="muted">
          Read from the{" "}
          <a href="https://medium.com/@elliotJL">Medium feed</a> at build time,
          newest first, and the site rebuilds daily. If I publish something it
          arrives here on its own, usually within a day.
        </p>

        <h2>on AI, product and trust</h2>
        <ul className="postlist">
          {annotated.map((p) => {
            const img = media.posts[p.link];
            return (
              <li key={p.link}>
                {img && (
                  <a href={p.link} className="thumb" aria-hidden="true" tabIndex={-1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${basePath}/${img}`} alt="" loading="lazy" />
                  </a>
                )}
                <div className="postbody">
                  <div className="rhead">
                    <span className="rorg">
                      <a href={p.link}>{p.title}</a>
                    </span>
                    <span className="rmeta">{p.date}</span>
                  </div>
                  <p className="rout">{noteFor(p.title)}</p>
                </div>
              </li>
            );
          })}
        </ul>

        {media.podcast && (
          <>
            <h2>podcast</h2>
            <div className="podcard">
              {media.podcast.image && (
                <a href={media.podcast.url} className="podart" aria-hidden="true" tabIndex={-1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${basePath}/${media.podcast.image}`} alt="" loading="lazy" />
                </a>
              )}
              <div>
                <h3>
                  <a href={media.podcast.url}>{media.podcast.title}</a>
                </h3>
                <p className="muted">
                  I went on <i>Just Now Possible</i>, hosted by Teresa Torres,
                  to talk about building AI that closes the gap between knowing
                  what to do and actually doing it, for students without the
                  network that usually supplies the answer.
                </p>
              </div>
            </div>
          </>
        )}

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
          I studied AI governance and alignment with{" "}
          <a href="https://www.bluedot.org/">BlueDot Impact</a>.
        </p>
      </div>
    </main>
  );
}
