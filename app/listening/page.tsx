import { getListening, longDate } from "@/lib/listening";
import Reveal from "../components/Reveal";
import Crate from "../components/Crate";
import ListeningNow from "../components/ListeningNow";

export const metadata = { title: "Listening · Elliot Little" };

const basePath = process.env.BASE_PATH || "";

// Off-theme on purpose, like the off-the-clock block on /writing: this page
// is taste, not work. Every number on it is counted by scripts/listening.mjs
// from the Spotify export; nothing here is typed in by hand.
export default function Listening() {
  const d = getListening();
  const maxYear = Math.max(...d.years.map((y) => y.hours));
  const fromYear = d.from.slice(0, 4);
  const toYear = d.to.slice(0, 4);
  const night = d.hourly[1];

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <span className="mai-kick rv-settle">off the clock</span>
            <h1 className="wr-title rv-settle">
              {Number(toYear) - Number(fromYear)} years of what I actually play.
            </h1>
            <p className="mai-sub rv-settle">
              Every play in my Spotify history, {longDate(d.from)} to{" "}
              {longDate(d.to)}: {d.hours.toLocaleString("en-GB")} hours,
              counted by a script rather than remembered.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle">right now</h2>
          <ListeningNow hourly={d.hourly} />
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle ls-gap">front to back</h2>
          <p className="sec-title rv-settle">
            The records I play start to finish, not on shuffle.
          </p>
          <p className="muted rv-settle section-line">
            Ranked by how often I&apos;ve played three quarters of an album or
            more in one unbroken run.
          </p>
          <Crate records={d.shelf} basePath={basePath} />
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle ls-gap">year by year</h2>
          <p className="sec-title rv-settle">Who had each year.</p>
          <ol className="ls-years rv-settle">
            {d.years.map((y) => (
              <li key={y.year}>
                <span className="ls-y">{y.year}</span>
                <span className="ls-ybar">
                  <span style={{ width: `${(y.hours / maxYear) * 100}%` }} />
                </span>
                <span className="ls-yh">{y.hours.toLocaleString("en-GB")}h</span>
                <span className="ls-ya">{y.artist}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal>
          <h2 className="mai-kick rv-settle ls-gap">in the data</h2>
          <ul className="ev-places rv-settle">
            <li>
              <span className="ev-places-name">The first play</span>
              <p>
                {d.first.track} by {d.first.artist}, {longDate(d.first.date)}.
                {d.firstStillTop &&
                  ` ${d.first.artist} were in my top four again in ${d.firstStillTop}.`}
              </p>
            </li>
            <li>
              <span className="ev-places-name">The most played song</span>
              <p>
                {d.topTrack.track} by {d.topTrack.artist},{" "}
                {d.topTrack.plays} times.
              </p>
            </li>
            <li>
              <span className="ev-places-name">One in three</span>
              <p>
                {d.skipShare}% of tracks end on the skip button.
              </p>
            </li>
            {night.artist && (
              <li>
                <span className="ev-places-name">At 1am</span>
                <p>
                  The top artist is {night.artist}
                  {night.artist === "Jeremy Soule" &&
                    ", who wrote the Skyrim soundtrack"}
                  .
                </p>
              </li>
            )}
          </ul>
          <p className="muted ls-source">
            From Spotify&apos;s extended streaming history export. Plays under
            30 seconds don&apos;t count, and ambient focus noise is left out.
            The raw export stays on my laptop; this page is built from the
            totals.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
