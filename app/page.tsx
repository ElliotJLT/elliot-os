const basePath = process.env.BASE_PATH || "";
import { getPosts, noteFor, isDemoted } from "@/lib/writing";
import { getQuotes } from "@/lib/quotes";
import { getMedia } from "@/lib/writing";
import { getRoles } from "@/lib/roles";
import Reveal, { Words } from "./components/Reveal";
import { WorkIcon, Pill, Slot } from "./components/Frame";
import Values from "./components/Values";
import HeroBricks from "./components/HeroBricks";

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
    name: "argus",
    href: "/built",
    label: "Private research system",
    icon: "argus",
    body: "Turns transcripts, feeds and my own notes into evidence-backed views on product work, careers and startup ideas. Fetching, deduplication, names and paths are code. I spend model calls on whether a source is worth keeping and which view it changes.",
  },
  {
    name: "crux",
    href: "https://elliotjlt.github.io/crux/research.html",
    label: "Ongoing research",
    icon: "crux",
    body: "Every team moving its code-writing to agents is about to ask what the humans still do. Crux measures it: what a human rejected, redirected or killed while the model did the typing. Method, results run on myself, objections and limitations all published.",
  },
  {
    name: "ward",
    href: "https://github.com/ElliotJLT/ward",
    label: "Published evals",
    icon: "ward",
    body: "Separates a safeguarding disclosure from ordinary bad conduct, grounded in KCSIE rather than keyword matching. On its published synthetic core set: 90% recall at 100% precision, against 50/83 for a keyword baseline.",
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
        <HeroBricks />
        <Reveal immediate>
          <div className="band-in">
            <span className="band-kick rv-settle">
              Hands-on AI product leader
            </span>
            <h1 className="band-h">
              <Words text="I build AI products and lead the teams shipping them." />
            </h1>
            <div className="band-profile">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="band-face rv-develop"
                src={`${basePath}/portrait.jpg`}
                alt="Elliot Little"
                width={176}
                height={176}
              />
              <p className="band-sub rv-settle">
                Four times a founding hire across eight years in startups.
                Most recently I led six engineers and a designer to build an
                AI tutor from first commit to the App Store in 45 days. Zero
                Gravity was one of eight companies selected nationwide for
                the{" "}
                <a href="https://www.gov.uk/government/news/edtech-and-ai-companies-invited-to-help-build-safe-ai-tutoring-tools-for-disadvantaged-pupils">
                  UK&nbsp;government&apos;s AI Tutoring Tools Pioneers Programme
                </a>
                , which could support up to 450,000 disadvantaged pupils a
                year.
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
          { name: "Own", said: "I am drawn to dauntingly large missions: make death less bureaucratic for families, feed NHS staff through a pandemic, give a student the tutor their family cannot buy. I find the practical problem inside that scale, then turn it into something a team can ship." },
          { name: "Build", said: "At MealsForTheNHS, day one was a WhatsApp group and day ten was a marketplace serving 146 hospitals. At Zero Gravity I wrote 28% of the merged commits while leading product." },
          { name: "Check", said: "At Farewill, agent errors fell 69% and case handling moved from two weeks to four days. At Zero Gravity, tutor marking moved from a 67% baseline to over 99% against real past papers and official mark schemes." },
          { name: "Remember", said: "At Zero Gravity the team adopted the operating guide I wrote. Now Crux records the calls a commit misses, and Argus carries my corrections into the next answer." },
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
                {r.logo && (
                  // The adjacent heading already names the company.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="career-timeline-logo"
                    src={`${basePath}/${r.logo}`}
                    alt=""
                    width={44}
                    height={44}
                  />
                )}
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
          <div className="vouch-col">
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
            <figure className="github-snake">
              <a
                className="github-snake-link"
                href="https://github.com/ElliotJLT"
                aria-label="See ElliotJLT's contribution history on GitHub"
              >
                <figcaption>
                  <span className="github-snake-label">GitHub activity</span>
                  <span className="github-snake-meta">updated daily</span>
                </figcaption>
                {/* Both assets are generated from the live contribution graph
                    during every deploy. Two images let the site's explicit
                    theme toggle choose the right palette. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="github-snake-image github-snake-light"
                  src={`${basePath}/github-snake.svg`}
                  alt="Animated GitHub contribution grid for ElliotJLT over the past year"
                  width={880}
                  height={192}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="github-snake-image github-snake-dark"
                  src={`${basePath}/github-snake-dark.svg`}
                  alt="Animated GitHub contribution grid for ElliotJLT over the past year"
                  width={880}
                  height={192}
                />
              </a>
            </figure>
            <div className="stack-row">
              {STACK.map((s) => (
                <span className="stack-chip" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
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
