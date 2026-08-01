/**
 * argus, drawn.
 *
 * Built as markup rather than an SVG diagram so it reflows on a phone, reads
 * in order to a screen reader, and inherits the page's type and colour instead
 * of carrying its own. The only SVG is the return edge, because a curve is the
 * one thing CSS cannot draw honestly.
 *
 * The shape is the argument: ingest is immutable, the corpus only ever grows,
 * and the human's disagreement is an input to it rather than a reaction to it.
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
    name: "sources",
    meta: "a few hundred a day",
    by: null,
    note: "Newsletters, papers, podcasts, long interviews nobody has transcribed yet.",
  },
  {
    id: "raw",
    name: "raw/",
    meta: "immutable",
    by: "Scout · Librarian",
    note: "Scout pulls the daily ingest; Librarian takes books and PDFs when they land. Nothing here is ever rewritten, so a claim can always be traced back to what was actually said.",
  },
  {
    id: "canon",
    name: "canon/",
    meta: "living artefacts",
    by: "Synthesist",
    note: "The core engine. It weaves new ingest into standing notes additively: only a one-paragraph current state may be rewritten, everything else appends. The corpus compounds instead of churning.",
  },
  {
    id: "brief",
    name: "the brief",
    meta: "06:00, daily",
    by: "Brief",
    note: "A debrief on what moved overnight, footed with what got woven into the corpus and what did not. Delivered to Telegram, with a generated audio version for the commute.",
  },
];

/* No file counts in the diagram. argus is a separate private repo, so its
   volumes are not readable at build time here, and a hardcoded number would
   go stale silently the way the roadmap did. */
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
            <span className="fname">you</span>
            <span className="fmeta">the only human in it</span>
          </div>
          <p className="fnote">
            Read the brief. Reach for an artefact when you need the framework.
            And when you disagree with an artefact&apos;s current state, correct
            it. That correction does not get filed as feedback: it is written
            back into the artefact as your position, so the corpus carries what
            you actually think rather than what it read.
          </p>
        </li>
      </ol>

      {/* The return edge. Everything above it is the machine; this is the only
          line that runs the other way, so it is the only line in colour. */}
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
      <span className="freturn-label">your correction becomes the position</span>

      <p className="fconductor">
        <span>Conductor</span> runs weekly across the whole corpus and asks one
        question: are these artefacts still compounding, or have they started to
        sprawl. It is the only agent whose job is to be unimpressed.
      </p>
    </div>
  );
}
