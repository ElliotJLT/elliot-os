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
    note: "Newsletters, papers, podcasts nobody has transcribed.",
  },
  {
    id: "raw",
    name: "raw/",
    meta: "immutable",
    by: "Scout",
    note: "Nothing is ever rewritten, so any claim traces back to what was said.",
  },
  {
    id: "canon",
    name: "canon/",
    meta: "living artefacts",
    by: "Synthesist",
    note: "Append-only. Only a one-paragraph current state may be rewritten.",
  },
  {
    id: "brief",
    name: "the brief",
    meta: "06:00, daily",
    by: "Brief",
    note: "What moved overnight, and what got woven in.",
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
            <span className="fmeta">the only human</span>
          </div>
          <span className="fby">Strategist</span>
          <p className="fnote">
            Your correction is written back as the artefact&apos;s position.
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
