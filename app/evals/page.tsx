import { getLedger, type LedgerWeek } from "@/lib/ledger";
import { THEMES } from "@/lib/themes";
import Reveal from "../components/Reveal";
import HabitIcon from "../components/HabitIcon";

export const metadata = { title: "How I check · Elliot Little" };

// /evals and /loops were one idea on two pages, so they became one page on
// 2026-10-20: the checks on the model, on the person reviewing it, on the
// agents I run, and on me. /loops redirects to #agents.
//
// Kept high level on purpose. The numbers live on /built, where each one has
// its context; this page says how the work is done and who decides.
const [WRONG, , AGENTS] = THEMES;

type Check = {
  icon: "bar" | "balance" | "conversation" | "transcript" | "flag" | "failing";
  call: string;
  why: string;
  where: string;
  /** Who makes the call this check feeds. Shown as a stamp on the card. */
  decides: string;
};

const MODEL: Check[] = [
  {
    icon: "bar",
    call: "Borrow the bar from whoever would know",
    why: "If the team writes the rubric, the model gets marked on our opinions. Examiners and regulators have spent years arguing about what good looks like, so I start from theirs.",
    where: "Tutor: the exam boards' mark schemes. ward: KCSIE. Farewill: the regulator's rules.",
    decides: "the standard",
  },
  {
    icon: "conversation",
    call: "Mark the conversation, not just the answer",
    why: "A tutor that gets the answer right and hands it over has still failed. So the whole conversation gets marked, and the model doing the marking has to agree with a teacher before I trust it.",
    where: "Tutor: a judge on every session, against the Socratic spec.",
    decides: "a teacher, first",
  },
  {
    icon: "transcript",
    call: "Read the transcripts yourself",
    why: "Evals catch what you thought to test. Reading real sessions catches the rest, and the failures that mattered were rarely on anyone's list.",
    where: "Tutor: production sessions sorted into failure modes, and every mark a teacher flagged turned into a test.",
    decides: "me",
  },
  {
    icon: "failing",
    call: "Keep one suite you're failing",
    why: "A regression suite should stay green. A second one you mostly fail shows where to go next. If everything passes, you've stopped learning.",
    where: "This site: its agent's suite failed half its cases on the first run, and CI now blocks any change that breaks it.",
    decides: "CI",
  },
];

const REVIEWER: Check[] = [
  {
    icon: "balance",
    call: "Decide which way it's allowed to fail",
    why: "Every model gets something wrong, so the product call is which kind of wrong you design for. In safeguarding that meant catching everything first, then cutting the noise.",
    where: "Tutor and ward: recall first, then precision.",
    decides: "safeguarding lead",
  },
  {
    icon: "flag",
    call: "Budget the reviewer's attention",
    why: "The right to overrule a model is worth little to someone paged all day. So the false-alarm rate is a product number, and someone owns it.",
    where: "Tutor: conduct flags split from disclosures, so the designated lead is paged for the ones that need them.",
    decides: "a named owner",
  },
  {
    icon: "conversation",
    call: "Put a name on every call",
    why: "Code can check a rule, but it can't own the outcome. Every decision that reaches a person carries their name and a reason.",
    where: "Nursing prototype: a named clinician records each change. Lease prototype: the lawyer decides whether the wording holds.",
    decides: "a named person",
  },
];

const RULES = [
  "Nothing sends anything as me. The worst it can do is draft something and hand it to me.",
  "Every fact carries the sentence it came from. If the source doesn't back it, it's thrown out and counted.",
  "Code does the counting. The model is never asked for a number.",
  "No part of it gets all three of: my private data, text written by strangers, and a way to send things out.",
  "What I say outranks anything the AI inferred. My corrections are kept and checked again every week.",
];

const SECTIONS = [
  { id: "model", n: "01", label: "The model" },
  { id: "reviewer", n: "02", label: "The reviewer" },
  { id: "agents", n: "03", label: "The agents" },
  { id: "me", n: "04", label: "Me" },
];

// The fact checks started on 5 Oct 2026; earlier weeks didn't count them.
const COUNTED_FROM = "2026-10-05";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

// A week still in progress reads as zeros, so it's labelled "so far".
function finished(w: LedgerWeek) {
  return Date.parse(`${w.week_of}T00:00:00Z`) + 7 * 86_400_000 <= Date.now();
}

const basePath = process.env.BASE_PATH || "";

// Painted vignettes, one per section, generated in the style of two
// reference paintings Elliot picked. They sit behind the cards and the cards
// overlap their lower edge, so the page reads as one surface.
function Painting({
  name,
  side,
  alt,
}: {
  name: string;
  side: "left" | "right" | "hero" | "aside";
  alt: string;
}) {
  return (
    <figure className={`ev-paint ev-paint-${side} rv-develop`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${basePath}/evals/${name}.webp`} alt={alt} loading="lazy" />
    </figure>
  );
}

function Cards({ items }: { items: Check[] }) {
  // Three cards sit three across; two-across would leave one alone.
  const across = items.length === 3 ? "ev-three" : "ev-calls";
  return (
    <ol className={`ev-steps ${across} rv-settle`}>
      {items.map((c) => (
        <li key={c.call} className="ev-step">
          <div className="ev-step-head">
            <span className="ev-step-icon">
              <HabitIcon name={c.icon} />
            </span>
            <span className="ev-stamp">decides · {c.decides}</span>
          </div>
          <h3>{c.call}</h3>
          <p>{c.why}</p>
          <p className="ev-step-where">{c.where}</p>
        </li>
      ))}
    </ol>
  );
}

export default function Evals() {
  const ledger = getLedger();
  const weeks = ledger.weeks.filter(
    (w) => w.week_of >= COUNTED_FROM && w.ticks !== undefined,
  );

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <div className="wr-head-main">
              <span className="mai-kick rv-settle">How I check</span>
              <h1 className="wr-title rv-settle">
                What gets checked, and who decides.
              </h1>
            </div>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Evals for the models I ship, limits for the agents I run, and a
              record of my own calls.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <Painting
            name="watch"
            side="hero"
            alt="A painted fire lookout tower above a pine forest, one person at the rail looking out through binoculars."
          />
        </Reveal>

        <nav className="built-index" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              <span>{s.n}</span> {s.label}
            </a>
          ))}
        </nav>

        <Reveal>
          <h2 id="model" className="mai-kick rv-settle">
            01 · {WRONG.short}
          </h2>
          <p className="sec-title rv-settle">Checking the model.</p>
          <Painting
            name="marking"
            side="right"
            alt="A painted teacher at a wooden table under a tree, marking a tall stack of exam papers by hand."
          />
        </Reveal>
        <Reveal>
          <Cards items={MODEL} />
        </Reveal>

        <Reveal>
          <h2 id="reviewer" className="mai-kick rv-settle">
            02 · {WRONG.short}
          </h2>
          <p className="sec-title rv-settle">
            Checking the person who checks it.
          </p>
          <Painting
            name="lifeguard"
            side="left"
            alt="A painted lifeguard on a tall white chair at the edge of a lake, watching a few swimmers."
          />
        </Reveal>
        <Reveal>
          <Cards items={REVIEWER} />
        </Reveal>

        <Reveal>
          <h2 id="agents" className="mai-kick rv-settle">
            03 · {AGENTS.short}
          </h2>
          <p className="sec-title rv-settle">Checking the agents I run.</p>
          <p className="muted rv-settle section-line">
            Agents keep this site current and run my own work. These rules
            hold whatever the model says, and code enforces them.
          </p>
          <Painting
            name="hives"
            side="aside"
            alt="A painted beekeeper lifting a frame from one hive in a fenced row of hives."
          />
        </Reveal>
        <Reveal>
          <ol className="loop-rules rv-settle">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </Reveal>
        {weeks.length > 0 && (
          <Reveal>
            <h3 className="loop-clock rv-settle">
              the ledger, counted by the system each week
            </h3>
            <div className="loop-ledger-panel rv-settle">
              <table className="loop-ledger">
                <thead>
                  <tr>
                    <th>week of</th>
                    <th>times it woke up</th>
                    <th>facts kept</th>
                    <th>facts thrown out</th>
                    <th>nightly calls</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((w) => (
                    <tr key={w.week_of}>
                      <th scope="row">
                        {formatDate(w.week_of)}
                        {!finished(w) && <span className="loop-note">so far</span>}
                      </th>
                      <td>
                        {w.ticks}
                        {(w.quiet ?? 0) > 0 && (
                          <span className="loop-note">{w.quiet} with nothing to do</span>
                        )}
                      </td>
                      <td>{w.facts_kept}</td>
                      <td>{w.facts_thrown}</td>
                      <td>
                        {w.closes ?? 0}
                        {(w.closes_withheld ?? 0) > 0 && (
                          <span className="loop-note">{w.closes_withheld} held back</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="loop-ledger-test">
                What would make it wrong: captures climbing while closed loops
                stay flat. If the numbers show that, I cut it back. I switched
                off the morning message on 16 October after it sent 8 and got
                no replies.
              </p>
              {ledger.broke.length > 0 && (
                <ol className="failure-log">
                  {ledger.broke.map((b) => (
                    <li key={b.date + b.what}>
                      <div className="failure-meta">
                        <time dateTime={b.date}>{formatDate(b.date)}</time>
                        <span className="failure-status repaired">fixed</span>
                      </div>
                      <div>
                        <p>{b.what}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Reveal>
        )}

        <Reveal>
          <h2 id="me" className="mai-kick rv-settle">
            04 · {AGENTS.short}
          </h2>
          <p className="sec-title rv-settle">Checking myself.</p>
          <Painting
            name="pond"
            side="left"
            alt="A painted figure crouched at the edge of a still pond, looking at their own reflection."
          />
        </Reveal>
        <Reveal>
          <ul className="ev-places rv-settle">
            <li>
              <a href="https://elliotjlt.github.io/crux/research.html">crux</a>
              <p>
                I built crux to record the calls I make while a model types:
                what I pushed back on, what I redirected, what I let through.
                Run on my own sessions, the record came out thinner than
                I&apos;d assumed, and thinnest on the moves that are hard to
                undo.
              </p>
            </li>
            <li>
              <span className="ev-places-name">The weekly note</span>
              <p>
                Once a week my system writes a short note on how I&apos;ve
                actually been working with AI, drawn from my sessions, and
                every new session starts with it. When a line&apos;s wrong I
                correct it, and the correction is kept.
              </p>
            </li>
          </ul>
        </Reveal>
      </div>
    </main>
  );
}
