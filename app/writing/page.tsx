import {
  getPosts,
  noteFor,
  getMedia,
  groupPosts,
  FEATURED,
} from "@/lib/writing";
import { getQuotes } from "@/lib/quotes";
import Reveal from "../components/Reveal";
import HoverLabel from "../components/HoverLabel";
import ReaderQuotes from "../components/ReaderQuotes";

export const metadata = { title: "Writing · Elliot Little" };

const basePath = process.env.BASE_PATH || "";

export default async function Writing() {
  const groups = groupPosts(await getPosts(20));
  const media = getMedia();
  const { readers } = getQuotes();

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">Writing</span>
              <h1 className="wr-title rv-settle">
                The bit between the strategy deck and the pull request.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              I write about shipping AI to people the model can hurt if it&apos;s
              wrong, and about leading the team while doing the building.
              Newest first inside each section, from Medium.
            </p>
          </header>
        </Reveal>

        {readers?.length > 0 && (
          <Reveal>
            <div className="rv-settle">
              <ReaderQuotes readers={readers} basePath={basePath} />
            </div>
          </Reveal>
        )}

        {media.podcast && (
          <Reveal>
            <div id="podcast" className="anchor-target" />
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

        <div id="essays" className="anchor-target" />

        {FEATURED && (
          <Reveal>
            <div className="wr-grid">
              <HoverLabel label="Read it →">
                <a className="wr-card rv-settle" href={FEATURED.link}>
                  <div className="wr-meta">
                    <span className="wr-date">Featured</span>
                    <h2 className="wr-h">{FEATURED.title}</h2>
                    <p className="wr-note">{FEATURED.note}</p>
                    <span className="wr-go">
                      Read it <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              </HoverLabel>
            </div>
          </Reveal>
        )}

        {groups.map(
          (g) =>
            g.posts.length > 0 && (
              <Reveal key={g.id}>
                <div id={g.id} className="anchor-target" />
                <h2 className="mai-kick rv-settle">{g.heading}</h2>
                <p
                  className="muted rv-settle"
                  style={{ maxWidth: 680, margin: "0 0 22px" }}
                >
                  {g.standfirst}
                </p>
                <div className="wr-grid">
                  {g.posts.map((p, idx) => (
                    <HoverLabel label="Read it →" key={p.link}>
                      <a
                        className="wr-card rv-settle"
                        href={p.link}
                        style={
                          { "--rv-delay": `${idx * 90}ms` } as React.CSSProperties
                        }
                      >
                        <div className="wr-shot rv-develop">
                          {media.posts[p.link] ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={`${basePath}/${media.posts[p.link]}`}
                              alt=""
                            />
                          ) : (
                            <span className="wr-noshot">No image</span>
                          )}
                        </div>
                        <div className="wr-meta">
                          <span className="wr-date">{p.date}</span>
                          <h3 className="wr-h">{p.title}</h3>
                          {noteFor(p.title) && (
                            <p className="wr-note">{noteFor(p.title)}</p>
                          )}
                          <span className="wr-go">
                            Read it <span aria-hidden="true">→</span>
                          </span>
                        </div>
                      </a>
                    </HoverLabel>
                  ))}
                </div>
              </Reveal>
            ),
        )}

      </div>
    </main>
  );
}
