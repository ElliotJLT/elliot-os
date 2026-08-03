const basePath = process.env.BASE_PATH || "";
import { getPosts, noteFor, isDemoted } from "@/lib/writing";
import { getQuotes } from "@/lib/quotes";
import { getMedia } from "@/lib/writing";
import { getRoles } from "@/lib/roles";
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

const STACK = [
  "Claude",
  "Claude Code",
  "Next.js",
  "Rails",
  "Hotwire Native",
  "pgvector",
  "RAG",
  "MCP",
  "Multi-agent systems",
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
        <a href="#principles" className="band-scroll" aria-label="Scroll to the next section">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </section>

    <div className="mai">
      <Values
        items={[
          { name: "Refusal", said: "My tutor coaches a student to the answer and refuses to hand it over. A build that just answers the homework raises a grade once and teaches nothing." },
          { name: "Verification", said: "ward's published eval sets score 90% recall at 100% precision against a keyword baseline of 50/83. Verification means a number anyone can rerun, not a claim." },
          { name: "Judgement", said: "A diff never records what I rejected, redirected or killed while the model did the typing. I built crux to capture that judgement instead of losing it." },
          { name: "Receipts", said: "Farewill's 69% drop in agent errors. Flash Pack's 400% growth. This site's own metered spend. Every number I put in front of you, you can go check." },
        ]}
      />

      <div className="work-list">
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
      </div>

      <Reveal>
        <h2 className="mai-kick rv-settle">Career</h2>
      </Reveal>
      <Reveal>
        <div className="career-split rv-settle">
          <ol className="career-timeline">
            {roles.map((r) => (
              <li key={r.org}>
                <h3>{r.url ? <a href={r.url}>{r.org}</a> : r.org}</h3>
                {(r.role || r.dates) && (
                  <span className="career-meta">
                    {[r.role, r.dates].filter(Boolean).join(" · ")}
                  </span>
                )}
                <p>{r.outcome}</p>
              </li>
            ))}
          </ol>
          <figure className="vouch">
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
        </div>
      </Reveal>

      <Reveal>
        <div className="stack-row rv-settle">
          {STACK.map((s) => (
            <span className="stack-chip" key={s}>
              {s}
            </span>
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
