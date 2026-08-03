const basePath = process.env.BASE_PATH || "";
import { getPosts, noteFor, isDemoted } from "@/lib/writing";
import { getQuotes } from "@/lib/quotes";
import { getMedia } from "@/lib/writing";
import { getRoles } from "@/lib/roles";
import { CareerCards } from "./components/Career";
import Reveal, { Words } from "./components/Reveal";
import { WorkIcon, Pill, Slot } from "./components/Frame";
import Values from "./components/Values";

/** Each build gets a row: an icon, a name, and what it does. */
const WORK: {
  name: string;
  href: string;
  label: string;
  icon: "tutor" | "ward" | "argus" | "crux";
  body: string;
}[] = [
  {
    name: "Zero Gravity AI STEM tutor",
    href: "https://www.zerogravity.co.uk/tutor",
    label: "In production",
    icon: "tutor",
    body: "An A-Level tutor that coaches a student to the answer and refuses to hand it over. Marking tested against official mark schemes took accuracy from a ~67% bare-model baseline to over 99%. Four subjects, every major UK exam board.",
  },
  {
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    label: "Published evals",
    icon: "ward",
    body: "Separates a real safeguarding disclosure from a child having a bad day, grounded in KCSIE rather than keyword matching. 90% recall at 100% precision, against 50/83 for a keyword baseline.",
  },
  {
    name: "argus",
    href: "/built",
    label: "Private fleet, daily",
    icon: "argus",
    body: "Five agents that read a few hundred sources a day and brief me before I sit down. Ingest is immutable and the corpus only appends. When I disagree with an artefact, my correction is written back as the position.",
  },
  {
    name: "crux",
    href: "https://elliotjlt.github.io/crux/research.html",
    label: "Ongoing research",
    icon: "crux",
    body: "Logs what a human rejected, redirected or killed while the model did the typing. Method, results run on myself, objections and limitations all published.",
  },
];

/** One row shape for a project and a piece of writing alike: an image, a
 *  label, a name, a CTA, and a line of body copy. */
function Row({
  image,
  label,
  name,
  href,
  cta,
  body,
  card = false,
}: {
  image: React.ReactNode;
  label: string;
  name: string;
  href: string;
  cta: string;
  body: string | null;
  card?: boolean;
}) {
  return (
    <article className={"mai-row" + (card ? " work-row" : "")}>
      <div className="rv-develop">{image}</div>
      <div className="rv-settle">
        <span className="mai-rowlabel">{label}</span>
        <a className="mai-rowname" href={href}>
          {name}
        </a>
        <Pill href={href}>{cta}</Pill>
      </div>
      <p className="mai-rowbody rv-settle">{body}</p>
    </article>
  );
}

const CAPS = [
  { h: "Build", items: ["Multi-agent systems", "Evals and judges", "MCP servers", "0-to-1 product"] },
  { h: "Decide", items: ["Verification specs", "Safeguarding layers", "Adversarial review", "Error analysis"] },
  { h: "Operate", items: ["Agent fleets", "Scheduled loops", "Cost metering", "Shipping cadence"] },
];

export default async function Home() {
  const { reference: ref } = getQuotes();
  const { roles } = getRoles();
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
              <Words text="I build production AI. I lead the teams that ship it." />
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
          <Row
            card
            image={<WorkIcon name={w.icon} />}
            label={w.label}
            name={w.name}
            href={w.href}
            cta="Learn more"
            body={w.body}
          />
        </Reveal>
      ))}

      <Reveal>
        <h2 className="mai-kick rv-settle">Career</h2>
      </Reveal>
      <Reveal>
        <div className="rv-settle">
          <CareerCards roles={roles} />
        </div>
      </Reveal>

      <Reveal>
        <figure className="vouch rv-settle">
          <div className="vouch-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 8c-2.2 0-4 1.8-4 4v6h6v-6H7c0-1.1.9-2 2-2V8H8zm10 0c-2.2 0-4 1.8-4 4v6h6v-6h-3c0-1.1.9-2 2-2V8h-1z" />
            </svg>
          </div>
          <blockquote>{ref.pull}</blockquote>
          <figcaption>
            <span className="vname">{ref.name}</span>
            <span className="vrole">{ref.role}</span>
          </figcaption>
        </figure>
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
          <Row
            key={p.link}
            image={
              media.posts[p.link] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="painted artimg"
                  src={`${basePath}/${media.posts[p.link]}`}
                  alt=""
                />
              ) : (
                <Slot label="Article image" ratio="4 / 3" painted />
              )
            }
            label={p.date}
            name={p.title}
            href={p.link}
            cta="Read it"
            body={noteFor(p.title)}
          />
        ))}
      </Reveal>

    </div>
    </main>
  );
}
