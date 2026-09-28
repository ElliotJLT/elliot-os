import { getEvals } from "@/lib/evals";
import Reveal from "../components/Reveal";

export const metadata = { title: "Evals · Elliot Little" };

type Row = { label: string; body: React.ReactNode };
type EvalCard = { id: string; kicker: string; name: string; rows: Row[]; links?: { href: string; label: string }[] };

export default function Evals() {
  const runs = getEvals().runs;
  const latest = runs[0];
  const first = runs[runs.length - 1];

  const CARDS: EvalCard[] = [
    {
      id: "tutor",
      kicker: "Zero Gravity AI STEM tutor",
      name: "Marking a tutor against the mark scheme",
      rows: [
        { label: "the failure it catches", body: "A tutor that confidently teaches something the mark scheme will penalise. The student can't tell, and finds out in the exam hall." },
        { label: "how it's checked", body: "Marking is tested against real past papers and official mark schemes. An always-on evaluator grades every session against the Socratic spec, and every mark a teacher flags becomes a new case." },
        { label: "result", body: "~67% → 99%+ on marking evals · hallucinated marks 4.6% of sessions → 0" },
        { label: "what it doesn't prove", body: "Internal evals, run against official mark schemes but not independently audited." },
      ],
      links: [{ href: "https://www.zerogravity.co.uk/tutor", label: "the tutor ↗" }],
    },
    {
      id: "ward",
      kicker: "ward",
      name: "The precision problem in safeguarding",
      rows: [
        { label: "the failure it catches", body: "A safeguarding lead paged on every false alarm stops trusting the alerts, and an ignored alert system is worse than none." },
        { label: "how it's checked", body: "Genuine disclosures are separated from ordinary bad conduct, grounded in KCSIE rather than keywords, and scored against a keyword baseline." },
        { label: "result", body: "90% recall · 100% precision · 0% false positives, against 50% · 83% · 8.6% for keywords" },
        { label: "what it doesn't prove", body: "The eval sets are synthetic, because real disclosures from children aren't a dataset anyone should assemble. The methodology says what that does and doesn't cover." },
      ],
      links: [
        { href: "https://github.com/ElliotJLT/ward/blob/main/METHODOLOGY.md", label: "methodology ↗" },
        { href: "https://github.com/ElliotJLT/ward", label: "code and eval sets ↗" },
      ],
    },
    {
      id: "farewill",
      kicker: "Farewill probate operations",
      name: "The same discipline before LLMs",
      rows: [
        { label: "the failure it catches", body: "In SRA- and FCA-regulated probate, an agent error is a grieving family's estate handled wrongly." },
        { label: "how it's checked", body: "Guided intake, workflow automation, audit logs and case tracking, with error categories defined and counted rather than remembered." },
        { label: "result", body: "Agent errors down 69% · case handling from two weeks to four days" },
        { label: "what it doesn't prove", body: "An operational audit, not a model eval. It's here because it's where the habit started." },
      ],
      links: [{ href: "https://farewill.com/apply-for-probate", label: "the service ↗" }],
    },
    {
      id: "site",
      kicker: "the agent that keeps this site current",
      name: "Testing the agent against what it should do",
      rows: [
        { label: "the failure it catches", body: "A daily digest that misreports my work, or a review gate that approves anything." },
        { label: "how it's checked", body: `${latest?.total ?? 28} held-out cases, run against the production functions with no model in the loop, so the suite is free, deterministic and gates every commit.` },
        {
          label: "result",
          body: `${first?.passed}/${first?.total} on first run → ${latest?.passed}/${latest?.total}. The first run showed the review gate could not reject anything: a proposal citing a repository that doesn't exist passed as grounded.`,
        },
        { label: "what it doesn't prove", body: "I wrote the cases, so a green run means no known regression, not a correct agent." },
      ],
      links: [
        { href: "https://github.com/ElliotJLT/elliot-os/tree/main/evals", label: "the cases ↗" },
        { href: "https://github.com/ElliotJLT/elliot-os/actions", label: "runs ↗" },
      ],
    },
    {
      id: "crux",
      kicker: "crux",
      name: "Evaluating the human in the loop",
      rows: [
        { label: "the failure it catches", body: "When AI does the typing, output stops being evidence of skill. The judgement is in what got rejected, redirected or killed, and nothing records it." },
        { label: "how it's checked", body: "A Claude Code hook reads each session and extracts the calls the person made." },
        { label: "result", body: "Published as research: the method, the objections and the limits." },
        { label: "what it doesn't prove", body: "A measure of one person's sessions, not a benchmark." },
      ],
      links: [
        { href: "https://elliotjlt.github.io/crux/research.html", label: "the research ↗" },
        { href: "https://github.com/ElliotJLT/crux", label: "repo ↗" },
      ],
    },
  ];

  return (
    <main>
      <div className="mai">
        <Reveal immediate>
          <header className="wr-head">
            <span className="mai-kick rv-settle">Evals · wrong answers cost</span>
            <h1 className="wr-title rv-settle">
              What got checked, what got rejected, and who decided?
            </h1>
            <p className="mai-sub rv-settle">
              Five systems, one question. Each card gives the failure the eval
              exists to catch, how it&rsquo;s checked, the numbers, and what
              they don&rsquo;t prove.
            </p>
          </header>
        </Reveal>

        <Reveal>
          <div className="evc-list rv-settle">
            {CARDS.map((c) => (
              <article key={c.id} id={c.id} className="evc">
                <span className="evc-kicker">{c.kicker}</span>
                <h2>{c.name}</h2>
                <dl>
                  {c.rows.map((r) => (
                    <div key={r.label} className={r.label === "result" ? "evc-row evc-row-result" : "evc-row"}>
                      <dt>{r.label}</dt>
                      <dd>{r.body}</dd>
                    </div>
                  ))}
                </dl>
                {c.links && (
                  <p className="evc-links">
                    {c.links.map((l) => (
                      <a key={l.href} href={l.href}>
                        {l.label}
                      </a>
                    ))}
                  </p>
                )}
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <p className="muted rv-settle section-line">
            I publish the limits with the numbers, because a metric that hides
            its weaknesses is the failure these systems exist to catch. To poke
            at any of it:{" "}
            <a href="mailto:elliotjlittle@gmail.com">elliotjlittle@gmail.com</a>.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
