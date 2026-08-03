import Link from "next/link";
import { getLog, getFirstCommit } from "@/lib/gitlog";
import { getContributions } from "@/lib/contributions";
import { getPosts, noteFor, isDemoted } from "@/lib/writing";
import Calendar from "./components/Calendar";
import Reveal, { Words } from "./components/Reveal";

const basePath = process.env.BASE_PATH || "";

/**
 * The work itself, on the front page. It used to live behind a link that said
 * "go and look at /built", so anyone scanning the homepage learned a headline,
 * a paragraph and four nav items. Specifics scan; a promise of specifics does
 * not. Ordered by what carries the most weight, not by recency.
 */
const WORK: {
  name: string;
  href: string;
  meta: string;
  claim: string;
}[] = [
  {
    name: "Zero Gravity AI STEM tutor",
    href: "https://www.zerogravity.co.uk/tutor",
    meta: "in production · App Store",
    claim:
      "Coaches a student to the answer and refuses to hand it over. Marking tested against official mark schemes took accuracy from a ~67% bare-model baseline to over 99%. Four STEM subjects, every major UK exam board, first commit to store in 45 days.",
  },
  {
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    meta: "published evals",
    claim:
      "Separates a real safeguarding disclosure from a child having a bad day, grounded in KCSIE rather than keyword matching. 90% recall at 100% precision, against 50/83 for a keyword baseline.",
  },
  {
    name: "argus",
    href: "/built",
    meta: "private fleet · daily",
    claim:
      "Five agents that read a few hundred sources a day and brief me before I sit down. Ingest is immutable and the corpus only appends, so notes thicken instead of being overwritten. When I disagree with one, my correction is written back as the position.",
  },
  {
    name: "crux",
    href: "https://elliotjlt.github.io/crux/research.html",
    meta: "ongoing research",
    claim:
      "Logs what a human rejected, redirected or killed while the model did the typing. Method, results run on myself, objections and limitations all published.",
  },
  {
    name: "boulot",
    href: "https://github.com/ElliotJLT/boulot-os",
    meta: "open source",
    claim:
      "Three agents with opposing briefs argue over a CV before it is allowed out. I ran my own search through it, then open-sourced it.",
  },
  {
    name: "homebuyer-mcp",
    href: "https://github.com/ElliotJLT/homebuyer-mcp",
    meta: "MCP server · 11 tools",
    claim:
      "Conveyancers and mortgage brokers vetted against live SRA, FCA and Companies House registers, plus stamp duty, lease checks and title register analysis.",
  },
];

/**
 * The builds that predate the models. Without these the page reads as though
 * a career began when the API did, and four of these were founding-team jobs
 * with outcomes that have nothing to do with AI.
 */
const PRIOR: { name: string; meta: string; claim: string }[] = [
  {
    name: "MealsForTheNHS",
    meta: "co-founder · 2020",
    claim:
      "A marketplace built in ten days to get restaurant meals to NHS staff through the first lockdown. £1.8m raised, 303,000 meals delivered, 146 hospitals.",
  },
  {
    name: "Farewill",
    meta: "wills and probate",
    claim:
      "Product in an SRA and FCA regulated environment, where a bad flow is a legal problem rather than a support ticket. Turned probate into steps a grieving family could follow without paying a solicitor.",
  },
  {
    name: "Flash Pack",
    meta: "founding team",
    claim:
      "Founding-team product work through the stretch that took the company from pre-seed to Series A.",
  },
];

export default async function Home() {
  const contrib = await getContributions();
  const posts = (await getPosts(20))
    .filter((x) => !isDemoted(x.title))
    .slice(0, 4);
  const log = getLog(1);
  const first = getFirstCommit();

  const rebuilt = new Date().toISOString().slice(0, 16).replace("T", " ");
  const since = new Date(first.iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <main>
      {/* Two tracks on a wide screen: a rail carrying section marks and
          margin notes, and the reading measure. The headline breaks across
          both; the body indents off it. Below 1020px it is one column and
          the rail's contents fall back inline. */}
      <div className="railpage">
        <h1 className="vh">Elliot Little</h1>

        <Reveal immediate>
        <div className="herorow">
          {/* The refusal first, because it is the product decision nobody else
              made, then the two facts that prove it was not a prototype. */}
          <p className="lede opener">
            <Words
              text={
                "I'm Elliot, a product builder in London. Four times a founding hire. " +
                "My last build was an A-Level tutor that refuses to hand students the " +
                "answer, and one of eight picked nationally for safe AI tutoring."
              }
            />
          </p>
          {/* Sits in the whitespace the lede's 52ch measure already leaves,
              so it costs the text no width. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="portrait rv-develop"
            src={`${basePath}/icon-512.png`}
            alt="Elliot Little"
            width={128}
            height={128}
          />
        </div>

        {/* Standfirst: the thesis in two sentences, set apart on a rule so it
            reads as a second voice rather than a third paragraph. */}
        <p className="standfirst rv-settle">
          Producing plausible output stopped being the hard part. Knowing
          whether to ship it did not.
        </p>

        {/* The hero had no call to action at all. One solid, one outlined:
            read the work, or skip to writing to me. */}
        <div className="herocta rv-settle">
          <Link className="btn btn-solid" href="/built">
            Read the work <span aria-hidden="true">→</span>
          </Link>
          <a className="btn btn-line" href="mailto:elliotjlittle@gmail.com">
            Get in touch
          </a>
        </div>
        </Reveal>

        {/* The thread: one continuous line down the gutter with the section
            numbers sitting on it. The page is called the through-line, so it
            has one. */}
        <div className="thread">
        <Reveal>
          <h2>the through-line</h2>
          <p className="statement rv-settle">
            Models write plausible things now. Checking them didn&apos;t get
            easier, and that is where most of my work has gone. At Zero Gravity
            I built a tutor that coaches a student to the answer and will not
            hand it over, with an evaluator grading every session before a
            student saw the mark.{" "}
            <a href="https://github.com/ElliotJLT/ward">ward</a> separates a
            real safeguarding disclosure from a child having a bad day, which
            is the distinction keyword filters get wrong.{" "}
            <a href="https://elliotjlt.github.io/crux/research.html">crux</a>{" "}
            turns the same question on me: it logs what I rejected in my own
            sessions, so I can tell whether I am still thinking or just
            approving.
          </p>
        </Reveal>

        <Reveal>
          <h2>the work</h2>
          <ul className="work rv-settle">
            {WORK.map((w) => (
              <li key={w.name}>
                <div className="wtop">
                  <a className="wname" href={w.href}>
                    {w.name}
                  </a>
                  <span className="wmeta">{w.meta}</span>
                </div>
                <p className="wclaim">{w.claim}</p>
              </li>
            ))}
          </ul>
          <p className="muted wmore rv-settle">
            <Link href="/built">
              All of it, with what each piece decides and refuses to do
            </Link>
            .
          </p>
        </Reveal>

        {contrib && (
          <Reveal>
            <h2>the year</h2>
            <Calendar data={contrib} />
            <p className="muted calnote rv-settle">
              {contrib.total.toLocaleString()} contributions in the twelve
              months to {contrib.to}, and{" "}
              <b>
                {Math.round((contrib.last90 / contrib.total) * 100)}% of them
                fall in the last ninety days
              </b>
              . That is the stretch since I left Zero Gravity: ward, crux,
              boulot and this site were all built inside it. The longest
              unbroken run is {contrib.longestStreak} days. Pulled from the
              public GitHub calendar at build, so you can check it.
            </p>
          </Reveal>
        )}

        <Reveal>
          <h2>before the models</h2>
          <p className="muted rv-settle" style={{ marginTop: 0 }}>
            I did not start building when the API did.
          </p>
          <ul className="work rv-settle">
            {PRIOR.map((w) => (
              <li key={w.name}>
                <div className="wtop">
                  <span className="wname">{w.name}</span>
                  <span className="wmeta">{w.meta}</span>
                </div>
                <p className="wclaim">{w.claim}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal>
          <h2>what I write about</h2>
          <p className="muted rv-settle" style={{ marginTop: 0 }}>
            Shipping AI to people who cannot absorb a wrong answer, and what
            the loop talk leaves out.
          </p>
          <ul className="work rv-settle">
            {posts.map((w) => (
              <li key={w.link}>
                <div className="wtop">
                  <a className="wname" href={w.link}>
                    {w.title}
                  </a>
                  <span className="wmeta">{w.date}</span>
                </div>
                {noteFor(w.title) && (
                  <p className="wclaim">{noteFor(w.title)}</p>
                )}
              </li>
            ))}
          </ul>
          <p className="muted wmore rv-settle">
            <Link href="/writing">Everything, with why each piece exists</Link>.
          </p>
        </Reveal>
        </div>

        {/* The seven-day figure used to come from a second, unauthenticated
            call to the events API. That endpoint rate-limits at 60 requests
            an hour, and when it did the page rendered a confident "0 commits
            in the last seven days" directly under a graph showing the
            opposite. It is now derived from the calendar already fetched
            above: one source, no second failure mode, and the two numbers
            cannot disagree. */}
        <p className="receipts faint mono">
          Live since {since}.
          {contrib
            ? ` ${contrib.days
                .slice(-7)
                .reduce((s, d) => s + d.count, 0)
                .toLocaleString()} contributions in the last seven days.`
            : ""}{" "}
          Rebuilt {rebuilt} UTC{log[0] ? ` at ${log[0].hash}` : ""}.
        </p>
      </div>
    </main>
  );
}
