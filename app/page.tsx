const basePath = process.env.BASE_PATH || "";
import { getPosts, noteFor, isDemoted } from "@/lib/writing";
import { getMedia } from "@/lib/writing";
import { getRoles } from "@/lib/roles";
import Reveal, { Words, RiseWords } from "./components/Reveal";
import { Pill, Slot } from "./components/Frame";
import Values from "./components/Values";
import HeroBricks from "./components/HeroBricks";
import TrackingPortrait from "./components/TrackingPortrait";
import StackField from "./components/StackField";
import Career from "./components/Career";
import StackExplorer from "./components/StackExplorer";
import LogoRow from "./components/LogoRow";

/** One row shape for a piece of writing: image, date, title, CTA and note. */
function Row({
  image,
  label,
  name,
  href,
  cta,
  body,
}: {
  image: React.ReactNode;
  label: string;
  name: string;
  href: string;
  cta: string;
  body: string | null;
}) {
  return (
    <article className="mai-row">
      <div className="rv-develop">{image}</div>
      <div className="rv-settle">
        <span className="mai-rowlabel">{label}</span>
        <a className="mai-rowname" href={href} aria-label={name}>
          <RiseWords text={name} />
        </a>
        <Pill href={href}>{cta}</Pill>
      </div>
      <p className="mai-rowbody rv-settle">{body}</p>
    </article>
  );
}

export default async function Home() {
  const { roles, mentoring } = getRoles();
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
              <Words text="I build AI that has to be right." />
            </h1>
            <div className="band-profile">
              <TrackingPortrait className="band-face rv-develop" />
              <p className="band-sub rv-settle">
                At Zero Gravity I led the team that took an AI tutor from first
                commit to the App Store in under a month, got it marking real
                A-level past papers at over 99%, and won it a place in the{" "}
                <a href="https://www.gov.uk/government/news/edtech-and-ai-companies-invited-to-help-build-safe-ai-tutoring-tools-for-disadvantaged-pupils">
                  UK government&apos;s AI Tutoring Tools Pioneers Programme
                </a>{" "}
                alongside Pearson and ElevenLabs.
              </p>
              <div className="band-cta rv-settle">
                <Pill href="/built" tone="cream" arrow>
                  See what I&apos;ve built
                </Pill>
                <Pill
                  href="mailto:elliotjlittle@gmail.com"
                  tone="ghost"
                  icon="mail"
                  iconOnly
                >
                  Email me
                </Pill>
                <Pill
                  href="https://cal.com/elliotjl/30min"
                  tone="ghost"
                  icon="coffee"
                  iconOnly
                >
                  Book a coffee
                </Pill>
              </div>
              <LogoRow className="rv-settle" />
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
          { name: "Build", said: "At MealsForTheNHS, day one was a WhatsApp group and day ten was a marketplace serving 146 hospitals. At Zero Gravity I wrote 28% of the tutor build's commits while leading product." },
          { name: "Check", said: "At Farewill, agent errors fell 69% and case handling moved from two weeks to four days. At Zero Gravity, our internal tutor evals moved marking accuracy from a 67% baseline to over 99% against real past papers and official mark schemes." },
          { name: "Remember", said: "I write things down so they outlast me. At Zero Gravity that was the operating guide the whole team worked from. Now it's a system that tracks everything I've started, so nothing gets dropped." },
        ]}
      />

      <Reveal>
        <h2 className="mai-kick rv-settle">Career</h2>
      </Reveal>
      <Career roles={roles} />

      <Reveal>
        <h2 className="mai-kick rv-settle">Mentoring</h2>
        <p className="mentoring-home-intro muted rv-settle">
          I mentor alongside the products: students and early-career
          professionals at Zero Gravity, and product peers through Lenny&apos;s
          community.
        </p>
      </Reveal>
      <Career roles={mentoring} id="mentoring" />

      {/* Desktop gets the pinned fly-out field; phones and reduced motion get
          the original explorer. CSS picks one. */}
      <div className="stack-desktop">
        <StackField basePath={basePath} />
      </div>
      <div className="stack-mobile">
      <Reveal>
        <h2 className="mai-kick rv-settle">My stack</h2>
        <p className="stack-home-intro muted rv-settle">
          The small set of tools I reach for repeatedly. Pick one to see the
          job it does in the system; none earns a place here just for being
          fashionable.
        </p>
        <div className="stack-home rv-settle">
          <StackExplorer basePath={basePath} />
        </div>
      </Reveal>
      </div>

      <Reveal>
        <h2 className="mai-kick rv-settle">Writing</h2>
      </Reveal>
      {posts.map((p) => (
        <Reveal key={p.link}>
          <Row
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
        </Reveal>
      ))}
      <Reveal>
        <div className="home-more rv-settle">
          <Pill href="/writing" arrow>
            See all writing
          </Pill>
        </div>
      </Reveal>

      <Reveal>
        <figure className="build-photo build-photo-home rv-settle">
          <div className="build-photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/building-together.jpg`}
              alt="Elliot smiling with a group as they compare rough orange block prototypes around a table"
              width={1920}
              height={1280}
            />
          </div>
          <figcaption>
            I bring rough prototypes into the room while people can still
            change them.
          </figcaption>
        </figure>
      </Reveal>

    </div>
    </main>
  );
}
