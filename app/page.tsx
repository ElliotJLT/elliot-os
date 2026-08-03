import Link from "next/link";
import { getContributions } from "@/lib/contributions";

const basePath = process.env.BASE_PATH || "";
import { getPosts, noteFor, isDemoted } from "@/lib/writing";
import { getQuotes } from "@/lib/quotes";
import { getMedia } from "@/lib/writing";
import Reveal, { Words } from "./components/Reveal";
import { Slot, Pill } from "./components/Frame";
import Values from "./components/Values";

/** Each build gets a row: an image, a name, and what it does. */
const WORK = [
  {
    name: "Zero Gravity AI STEM tutor",
    href: "https://www.zerogravity.co.uk/tutor",
    label: "In production",
    slot: "Tutor screenshot",
    body: "An A-Level tutor that coaches a student to the answer and refuses to hand it over. Marking tested against official mark schemes took accuracy from a ~67% bare-model baseline to over 99%. Four subjects, every major UK exam board.",
  },
  {
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    label: "Published evals",
    slot: "Eval results",
    body: "Separates a real safeguarding disclosure from a child having a bad day, grounded in KCSIE rather than keyword matching. 90% recall at 100% precision, against 50/83 for a keyword baseline.",
  },
  {
    name: "argus",
    href: "/built",
    label: "Private fleet, daily",
    slot: "Brief screenshot",
    body: "Five agents that read a few hundred sources a day and brief me before I sit down. Ingest is immutable and the corpus only appends. When I disagree with an artefact, my correction is written back as the position.",
  },
  {
    name: "crux",
    href: "https://elliotjlt.github.io/crux/research.html",
    label: "Ongoing research",
    slot: "Research chart",
    body: "Logs what a human rejected, redirected or killed while the model did the typing. Method, results run on myself, objections and limitations all published.",
  },
];

/** The principles, one lit and the rest waiting, as MAI stacks them. */
const VALS = [
  ["Refusal", "The useful build says no. A tutor that answers homework raises a grade once and teaches nothing."],
];

const CAPS = [
  { h: "Build", items: ["Multi-agent systems", "Evals and judges", "MCP servers", "0-to-1 product"] },
  { h: "Decide", items: ["Verification specs", "Safeguarding layers", "Adversarial review", "Error analysis"] },
  { h: "Operate", items: ["Agent fleets", "Scheduled loops", "Cost metering", "Shipping cadence"] },
];

export default async function Home() {
  const contrib = await getContributions();
  const { reference: ref } = getQuotes();
  const media = getMedia();
  const posts = (await getPosts(20)).filter((x) => !isDemoted(x.title)).slice(0, 3);

  return (
    <main>
      {/* Full-bleed band, not a light mode. MAI's own coral measures 2.53:1
          against cream, which fails even at display size; this is deepened to
          a rust that clears 5.42 so the subline is readable too. */}
      <section className="band">
        <Reveal immediate>
          <div className="band-in">
            <span className="band-kick rv-settle">Hi, I&apos;m Elliot</span>
            <h1 className="band-h">
              <Words text="I build AI that knows when to say no." />
            </h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="band-face rv-develop"
              src={`${basePath}/portrait.jpg`}
              alt="Elliot Little"
              width={132}
              height={132}
            />
            <p className="band-sub rv-settle">
              The tutor I built coaches a student to the answer and refuses to
              hand it over. The safeguarding layer pages a human only when it
              is genuinely a child asking for help. Four times a founding hire,
              in London, and my last build was one of eight picked nationally
              for safe AI tutoring.
            </p>
            <div className="band-cta rv-settle">
              <Pill href="/built" tone="cream" arrow>
                Read the work
              </Pill>
              <Pill href="mailto:elliotjlittle@gmail.com" tone="ghost">
                Get in touch
              </Pill>
            </div>
          </div>
        </Reveal>
      </section>

    <div className="mai">
      <Values
        items={[
          { name: "Refusal", said: "The useful build says no. A tutor that answers the homework raises a grade once and teaches nothing." },
          { name: "Verification", said: "Producing plausible output stopped being the hard part. Knowing whether to ship it did not." },
          { name: "Judgement", said: "The call a human made, and why, vanishes from the diff the moment an agent writes the code." },
          { name: "Receipts", said: "Every number on this site is computed from something you can go and check yourself." },
        ]}
      />

      <Reveal>
        <h2 className="mai-kick rv-settle" style={{ marginBottom: 0 }}>
          Selected work
        </h2>
      </Reveal>
      {WORK.map((w) => (
        <Reveal key={w.name}>
          <article className="mai-row">
            <div className="rv-develop">
              <Slot label={w.slot} ratio="4 / 3" painted />
            </div>
            <div className="rv-settle">
              <span className="mai-rowlabel">{w.label}</span>
              <a className="mai-rowname" href={w.href}>
                {w.name}
              </a>
              <Pill href={w.href}>Learn more</Pill>
            </div>
            <p className="mai-rowbody rv-settle">{w.body}</p>
          </article>
        </Reveal>
      ))}

      <Reveal>
        <section className="mai-row" style={{ gridTemplateColumns: "1fr" }}>
          <figure className="vouch rv-settle" style={{ margin: 0 }}>
            <blockquote>{ref.pull}</blockquote>
            <figcaption>
              <span className="vname">{ref.name}</span>
              <span className="vrole">{ref.role}</span>
            </figcaption>
          </figure>
        </section>
      </Reveal>

      <Reveal>
        <h2 className="mai-kick rv-settle">Things I help you build</h2>
        <div className="mai-caps">
          {CAPS.map((c) => (
            <div className="mai-cap rv-settle" key={c.h}>
              <h3>{c.h}</h3>
              <ul>
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <h2 className="mai-kick rv-settle">Writing</h2>
        {posts.map((p) => (
          <article className="mai-row" key={p.link}>
            <div className="rv-develop">
              {media.posts[p.link] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="painted artimg"
                  src={`${basePath}/${media.posts[p.link]}`}
                  alt=""
                />
              ) : (
                <Slot label="Article image" ratio="4 / 3" painted />
              )}
            </div>
            <div className="rv-settle">
              <span className="mai-rowlabel">{p.date}</span>
              <a className="mai-rowname" href={p.link}>
                {p.title}
              </a>
              <Pill href={p.link}>Read it</Pill>
            </div>
            <p className="mai-rowbody rv-settle">{noteFor(p.title)}</p>
          </article>
        ))}
      </Reveal>

    </div>
    </main>
  );
}
