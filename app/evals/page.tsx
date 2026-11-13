import { pageMeta } from "@/lib/meta";
import { getLedger, type LedgerWeek } from "@/lib/ledger";
import { THEMES } from "@/lib/themes";
import Reveal from "../components/Reveal";
import HabitIcon from "../components/HabitIcon";
import PaintReveal from "../components/PaintReveal";
import WrapTidy from "../components/WrapTidy";
import { PAINT_SHAPES } from "@/lib/paintShapes";

export const metadata = pageMeta({
  title: "How I check · Elliot Little",
  description:
    "How I know the AI I ship works: the exam boards' own mark schemes, red-teaming before students do, and a named person on every call.",
  path: "/evals/",
});

// One question: how do I know the AI I ship works? The checks on the model
// and on the person reviewing it lead; a short closing section applies the
// same checks to the agents I run and to me. /loops and /now redirect to
// #agents, and #me still lands on that section.
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
    why: "A tutor that gets the answer right and hands it over has still failed. So the whole conversation gets marked, and the model doing the marking has to agree with teacher-marked sessions before it runs on its own.",
    where: "Tutor: a judge on every session, against the Socratic spec.",
  },
  {
    icon: "transcript",
    call: "Read the transcripts yourself",
    why: "Evals catch what you thought to test. Reading real sessions catches the rest, and the failures that mattered were rarely on anyone's list.",
    where: "Tutor: production sessions sorted into failure modes, and every mark a teacher flagged turned into a test.",
  },
  {
    icon: "flag",
    call: "Attack it before a student does",
    why: "The failure that hurts is rarely a wrong fact. In a tutor it's a student talking the model into the answer. In safeguarding it's a disclosure worded to slip past the filter. So I red-team for those first, with cases written to break the rubric.",
    where: "Tutor: red-teamed against the Socratic spec. ward: a held-out red-team set, all 16 disguised disclosures caught, against one for keywords.",
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

// Rule 02 carries its own evidence: the running count of facts the checks
// threw out, read from the ledger at build time so it stays current.
const rules = (thrown: number, found: number) => [
  "Nothing sends anything as me. The worst it can do is draft something and hand it to me.",
  found > 0
    ? `Every quote and number is checked against its source before it's written. If the source doesn't back it, it's thrown out: ${thrown.toLocaleString("en-GB")} of ${found.toLocaleString("en-GB")} so far.`
    : "Every quote and number is checked against its source before it's written. If the source doesn't back it, it's thrown out and counted.",
  "A model that reads text from strangers gets no tool that writes, sends or fetches.",
  "My corrections are stored as tests and replayed against the current model every week.",
  "Each job has a pinned model and a daily spend cap. Haiku gates, Sonnet extracts, Opus synthesises.",
];

const SECTIONS = [
  { id: "model", n: "01", label: "The model" },
  { id: "reviewer", n: "02", label: "The reviewer" },
  { id: "agents", n: "03", label: "My own agents" },
];

// The fact checks started on 5 Oct 2026; earlier weeks didn't count them.
const COUNTED_FROM = "2026-10-05";

const basePath = process.env.BASE_PATH || "";

// Painted vignettes in the brand palette, one per section, which paint
// themselves in as you scroll (components/PaintReveal). Sizes are the
// exported webp dimensions.
const PAINTINGS = {
  watch: { w: 997, h: 714, seed: 11 },
  marking: { w: 916, h: 812, seed: 23 },
  lifeguard: { w: 1061, h: 767, seed: 37 },
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
  const weeks = getLedger().weeks.filter(
    (w) => w.week_of >= COUNTED_FROM && w.ticks !== undefined,
  );
  const sum = (k: keyof LedgerWeek) =>
    weeks.reduce((n, w) => n + (Number(w[k]) || 0), 0);
  const kept = sum("facts_kept");
  const thrown = sum("facts_thrown");

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
              How I know the AI I ship works.
            </h1>
            <p className="mai-sub rv-settle" style={{ marginInline: 0 }}>
              Marked against the exam boards&apos; own standards, attacked before
              a student can, and a named person on every call that matters.
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
          <div id="me" className="anchor-target" />
          <h2 id="agents" className="mai-kick rv-settle">
            03 · {AGENTS.short}
          </h2>
          <p className="sec-title rv-settle">
            The same checks, on my own agents and on me.
          </p>
        </Reveal>
        <Reveal>
          <div className="ev-wrap">
            <Painting
              name="pond"
              side="left"
              alt="A painted figure crouched at the edge of a still pond, looking at their own reflection."
            />
            <p className="ev-flow-lede rv-settle">
              I run four agents, called Cervo, that keep track of my work. They
              read my mail and sessions, so they get the strictest rules.
            </p>
            <h3 className="loop-clock rv-settle">the rules they run under, in code</h3>
            <ol className="ev-flow ev-rules rv-settle">
              {rules(thrown, kept + thrown).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
        </Reveal>
        <Reveal>
          <h3 className="loop-clock rv-settle">and the checks on me</h3>
          <div>
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
      <WrapTidy />
    </main>
  );
}
