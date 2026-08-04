/**
 * argus, drawn.
 *
 * Built as markup rather than a fixed SVG so it reflows on a phone and reads
 * in order to a screen reader. The return edge is the one exception.
 */

type Stage = {
  id: string;
  name: string;
  meta: string;
  by: string | null;
  note: string;
};

const STAGES: Stage[] = [
  {
    id: "sources",
    name: "signals",
    meta: "evidence, not conclusions",
    by: null,
    note: "Transcripts, feeds, papers, commissioned research, my drafts and the corrections I make when a view is wrong.",
  },
  {
    id: "ingest",
    name: "ingest",
    meta: "deterministic",
    by: "code",
    note: "Fetch captions, reject obvious junk, deduplicate, name the source and validate the path. None of that needs a model.",
  },
  {
    id: "triage",
    name: "triage",
    meta: "one small decision",
    by: "LLM",
    note: "A compact excerpt goes in. The model keeps, discards or holds it for review, then names any existing view the evidence should change.",
  },
  {
    id: "views",
    name: "views",
    meta: "the current model",
    by: "validated in code",
    note: "Positions carry their evidence, implications and visible before-and-after changes. New material has to deepen, qualify or contradict something useful.",
  },
  {
    id: "outputs",
    name: "answers",
    meta: "cited back to source",
    by: "ask",
    note: "Career hypotheses, startup ideas and article stress tests. Retrieval is bounded before the model sees it, and every answer points back to its evidence.",
  },
];

export default function ArgusFlow() {
  return (
    <div className="flow">
      <ol className="flowlist">
        {STAGES.map((s) => (
          <li key={s.id}>
            <div className="fhead">
              <span className="fname">{s.name}</span>
              <span className="fmeta">{s.meta}</span>
            </div>
            {s.by && <span className="fby">{s.by}</span>}
            <p className="fnote">{s.note}</p>
          </li>
        ))}

        <li className="fyou">
          <div className="fhead">
            <span className="fname">me</span>
            <span className="fmeta">question, correction, decision</span>
          </div>
          <p className="fnote">
            I ask a question or disagree with the answer. That correction goes
            back into the relevant view as my position, with the old state
            still visible.
          </p>
        </li>
      </ol>

      <svg
        className="freturn"
        viewBox="0 0 60 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M4 96 C46 96 56 88 56 60 C56 24 44 6 4 4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          className="fhead-arrow"
          d="M10 0.5 L2.5 4 L10 8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="freturn-label">a correction changes the view</span>

      <p className="fconductor">
        <span>The constraint</span> The model decides what is worth keeping and
        where it belongs. Code does the fetching, filing and validation. Argus
        should spend tokens on judgement, not admin.
      </p>
    </div>
  );
}
