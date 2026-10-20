import { getLedger, type LedgerWeek } from "@/lib/ledger";
import { THEMES } from "@/lib/themes";
import Reveal from "../components/Reveal";
import HabitIcon from "../components/HabitIcon";
import PaintReveal from "../components/PaintReveal";
import { PAINT_SHAPES } from "@/lib/paintShapes";

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
};

const MODEL: Check[] = [
  {
    icon: "bar",
    call: "Borrow the bar from whoever would know",
    why: "If the team writes the rubric, the model gets marked on our opinions. Examiners and regulators have spent years arguing about what good looks like, so I start from theirs.",
    where: "Tutor: the exam boards' mark schemes. ward: KCSIE. Farewill: the regulator's rules.",
  },
  {
    icon: "conversation",
    call: "Mark the conversation, not just the answer",
    why: "A tutor that gets the answer right and hands it over has still failed. So the whole conversation gets marked, and the model doing the marking has to agree with a teacher before I trust it.",
    where: "Tutor: a judge on every session, against the Socratic spec.",
  },
  {
    icon: "transcript",
    call: "Read the transcripts yourself",
    why: "Evals catch what you thought to test. Reading real sessions catches the rest, and the failures that mattered were rarely on anyone's list.",
    where: "Tutor: production sessions sorted into failure modes, and every mark a teacher flagged turned into a test.",
  },
  {
    icon: "failing",
    call: "Keep one suite you're failing",
    why: "A regression suite should stay green. A second one you mostly fail shows where to go next. If everything passes, you've stopped learning.",
    where: "This site: its agent's suite failed half its cases on the first run, and CI now blocks any change that breaks it.",
  },
];

const REVIEWER: Check[] = [
  {
    icon: "balance",
    call: "Decide which way it's allowed to fail",
    why: "Every model gets something wrong, so the product call is which kind of wrong you design for. In safeguarding that meant catching everything first, then cutting the noise.",
    where: "Tutor and ward: recall first, then precision.",
  },
  {
    icon: "flag",
    call: "Budget the reviewer's attention",
    why: "The right to overrule a model is worth little to someone paged all day. So the false-alarm rate is a product number, and someone owns it.",
    where: "Tutor: conduct flags split from disclosures, so the designated lead is paged for the ones that need them.",
  },
  {
    icon: "conversation",
    call: "Put a name on every call",
    why: "Code can check a rule, but it can't own the outcome. Every decision that reaches a person carries their name and a reason.",
    where: "Nursing prototype: a named clinician records each change. Lease prototype: the lawyer decides whether the wording holds.",
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

// Painted vignettes in the brand palette, one per section, which paint
// themselves in as you scroll (components/PaintReveal). Sizes are the
// exported webp dimensions.
const PAINTINGS = {
  watch: { w: 997, h: 714, seed: 11 },
  marking: { w: 916, h: 812, seed: 23 },
  lifeguard: { w: 1061, h: 767, seed: 37 },
  hives: { w: 1051, h: 743, seed: 41 },
  pond: { w: 983, h: 768, seed: 53 },
};

// Each painting floats beside its section and the words wrap around the
// painted shape itself, so text and paint share the page instead of taking
// turns. The outline is a traced polygon (lib/paintShapes.ts), which scales
// with the painting.
function Painting({
  name,
  side,
  alt,
  first,
}: {
  name: keyof typeof PAINTINGS;
  side: "left" | "right";
  alt: string;
  first?: boolean;
}) {
  const p = PAINTINGS[name];
  const src = `${basePath}/evals/${name}.webp`;
  return (
    <figure
      className={`ev-paint ev-paint-${side}`}
      style={{ shapeOutside: PAINT_SHAPES[name][side] }}
    >
      <PaintReveal src={src} alt={alt} w={p.w} h={p.h} seed={p.seed} immediate={first} />
    </figure>
  );
}

function Checks({ items }: { items: Check[] }) {
  return (
    <ol className="ev-flow rv-settle">
      {items.map((c) => (
        <li key={c.call}>
          <h3>
            <span className="ev-flow-icon">
              <HabitIcon name={c.icon} />
            </span>
            {c.call}
          </h3>
          <p>{c.why}</p>
          <p className="ev-flow-where">{c.where}</p>
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
      <div className="mai evals-page loops-on-evals">
        <Reveal immediate>
          <header className="wr-head ev-wrap">
            <Painting
              name="watch"
              side="right"
              first
              alt="A painted fire lookout tower above a pine forest, one person at the rail looking out through binoculars."
            />
            <span className="mai-kick rv-settle">How I check</span>
            <h1 className="wr-title rv-settle">
              What gets checked, and who decides.
            </h1>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Evals for the models I ship, limits for the agents I run, and a
              record of my own calls.
            </p>
            <nav className="built-index ev-index" aria-label="On this page">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}>
                  <span>{s.n}</span> {s.label}
                </a>
              ))}
            </nav>
          </header>
        </Reveal>

        <Reveal>
          <h2 id="model" className="mai-kick rv-settle">
            01 · {WRONG.short}
          </h2>
          <p className="sec-title rv-settle">Checking the model.</p>
        </Reveal>
        <Reveal>
          <div className="ev-wrap">
            <Painting
              name="marking"
              side="right"
              alt="A painted teacher at a wooden table under a tree, marking a tall stack of exam papers by hand."
            />
            <Checks items={MODEL} />
          </div>
        </Reveal>

        <Reveal>
          <h2 id="reviewer" className="mai-kick rv-settle">
            02 · {WRONG.short}
          </h2>
          <p className="sec-title rv-settle">
            Checking the person who checks it.
          </p>
        </Reveal>
        <Reveal>
          <div className="ev-wrap">
            <Painting
              name="lifeguard"
              side="left"
              alt="A painted lifeguard on a tall white chair at the edge of a lake, watching a few swimmers."
            />
            <Checks items={REVIEWER} />
          </div>
        </Reveal>

        <Reveal>
          <h2 id="agents" className="mai-kick rv-settle">
            03 · {AGENTS.short}
          </h2>
          <p className="sec-title rv-settle">Checking the agents I run.</p>
        </Reveal>
        <Reveal>
          <div className="ev-wrap">
            <Painting
              name="hives"
              side="right"
              alt="A painted beekeeper lifting a frame from one hive in a fenced row of hives."
            />
            <p className="ev-flow-lede rv-settle">
              Agents keep this site current and run my own work. These rules
              hold whatever the model says, and code enforces them.
            </p>
            <ol className="ev-flow ev-rules rv-settle">
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
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
        </Reveal>
        <Reveal>
          <div className="ev-wrap">
            <Painting
              name="pond"
              side="left"
              alt="A painted figure crouched at the edge of a still pond, looking at their own reflection."
            />
            <ol className="ev-flow rv-settle">
              <li>
                <h3>
                  <a href="https://elliotjlt.github.io/crux/research.html">crux</a>
                </h3>
                <p>
                  I built crux to record the calls I make while a model types:
                  what I pushed back on, what I redirected, what I let through.
                  Run on my own sessions, the record came out thinner than
                  I&apos;d assumed, and thinnest on the moves that are hard to
                  undo.
                </p>
              </li>
              <li>
                <h3>The weekly note</h3>
                <p>
                  Once a week my system writes a short note on how I&apos;ve
                  actually been working with AI, drawn from my sessions, and
                  every new session starts with it. When a line&apos;s wrong I
                  correct it, and the correction is kept.
                </p>
              </li>
            </ol>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
