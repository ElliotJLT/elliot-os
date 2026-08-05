/**
 * Argus as a left-to-right system diagram.
 *
 * The wide canvas is intentional: on a phone it scrolls horizontally rather
 * than turning back into the vertical timeline this replaces. The ordered
 * list keeps the pipeline readable without the drawing, and the return edge
 * is decorative because the correction is repeated in text underneath.
 */

type Stage = {
  id: string;
  name: string;
  meta: string;
  by: string;
  note: string;
};

const STAGES: Stage[] = [
  {
    id: "signals",
    name: "signals",
    meta: "raw evidence",
    by: "input",
    note: "Transcripts, feeds, papers, drafts and my corrections.",
  },
  {
    id: "ingest",
    name: "ingest",
    meta: "fetch + clean",
    by: "code",
    note: "Fetch, reject junk, deduplicate and validate every path.",
  },
  {
    id: "triage",
    name: "triage",
    meta: "one decision",
    by: "LLM",
    note: "Keep, discard or hold; then name the view that should move.",
  },
  {
    id: "views",
    name: "views",
    meta: "current model",
    by: "code + me",
    note: "Evidence, implications and every before-and-after stay visible.",
  },
  {
    id: "answers",
    name: "answers",
    meta: "bounded retrieval",
    by: "ask",
    note: "A useful answer, cited back to the material that supports it.",
  },
  {
    id: "me",
    name: "me",
    meta: "human judgement",
    by: "decide",
    note: "Question the answer, correct the position or make the call.",
  },
];

export default function ArgusFlow() {
  return (
    <figure className="flow">
      <div className="flowbar" aria-hidden="true">
        <span>argus/pipeline</span>
        <span className="flowbar-state">● live view</span>
      </div>

      <div className="flow-viewport" tabIndex={0} aria-label="Argus pipeline diagram">
        <div className="flow-canvas">
          <ol className="flowlist">
            {STAGES.map((stage, index) => (
              <li key={stage.id} className={stage.id === "me" ? "fyou" : undefined}>
                <span className="findex" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="fhead">
                  <span className="fname">{stage.name}</span>
                  <span className="fby">[{stage.by}]</span>
                </div>
                <span className="fmeta">{stage.meta}</span>
                <p className="fnote">{stage.note}</p>
              </li>
            ))}
          </ol>

          <svg
            className="freturn"
            viewBox="0 0 1000 72"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M916 4 V29 C916 49 900 57 878 57 H626 C603 57 590 48 590 29 V17" />
            <path className="fhead-arrow" d="M582 24 L590 14 L598 24" />
          </svg>
          <span className="freturn-label">correction.patch → views</span>
        </div>
      </div>

      <figcaption className="fconductor">
        <span>The constraint</span> The model judges what is worth keeping and
        where it belongs. Code does the fetching, filing and validation. I
        question the output, and a correction changes the view—not its history.
      </figcaption>
    </figure>
  );
}
