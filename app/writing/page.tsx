import { getPosts, noteFor, isDemoted, getMedia } from "@/lib/writing";
import { getQuotes } from "@/lib/quotes";
import Reveal from "../components/Reveal";

export const metadata = { title: "Writing · Elliot Little" };

const basePath = process.env.BASE_PATH || "";

export default async function Writing() {
  const all = await getPosts(20);
  const posts = all.filter((p) => !isDemoted(p.title));
  const media = getMedia();
  const { readers } = getQuotes();

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <span className="mai-kick rv-settle">Writing</span>
            <h1 className="wr-title rv-settle">
              Shipping AI to people who cannot absorb a wrong answer.
            </h1>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              On trust and adoption, on where responsible-AI-by-checklist
              breaks, and on what the loop talk leaves out. Newest first, from
              Medium.
            </p>
          </header>
        </Reveal>

        {readers?.length > 0 && (
          <Reveal>
            <ul className="said-grid rv-settle">
              {readers.map((r) => (
                <li key={r.who}>
                  <p>{r.quote}</p>
                  <span>{r.who}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {media.podcast && (
          <Reveal>
            <a className="pod rv-settle" href={media.podcast.url}>
              {media.podcast.image && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={`${basePath}/${media.podcast.image}`} alt="" />
              )}
              <div>
                <span className="wr-date">Podcast · Just Now Possible</span>
                <h2 className="wr-h">{media.podcast.title}</h2>
                <p className="wr-note">
                  With Teresa Torres, on building AI that closes the gap
                  between knowing what to do and actually doing it, for
                  students without the network that usually supplies the
                  answer.
                </p>
                <span className="wr-go">
                  Listen <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          </Reveal>
        )}

        <Reveal>
          <div className="wr-grid">
            {posts.map((p) => (
              <a className="wr-card rv-settle" href={p.link} key={p.link}>
                <div className="wr-shot">
                  {media.posts[p.link] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={`${basePath}/${media.posts[p.link]}`} alt="" />
                  ) : (
                    <span className="wr-noshot">No image</span>
                  )}
                </div>
                <div className="wr-meta">
                  <span className="wr-date">{p.date}</span>
                  <h2 className="wr-h">{p.title}</h2>
                  {noteFor(p.title) && (
                    <p className="wr-note">{noteFor(p.title)}</p>
                  )}
                  <span className="wr-go">
                    Read it <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Reveal>


      </div>
    </main>
  );
}
