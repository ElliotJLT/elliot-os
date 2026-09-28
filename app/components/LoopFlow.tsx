/**
 * How the loop runs, drawn in the site's own type and ink: three time lanes,
 * boxes joined by thin arrows, the Friday review as a dashed line back to the
 * start. Built in code rather than generated, so the labels are exact and it
 * follows the theme. Below 900px the numbered steps underneath carry it.
 */
type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  when: string;
  lines: string[];
  key?: boolean;
};

const BOXES: Box[] = [
  { x: 130, y: 65, w: 180, h: 120, title: "Capture", when: "any time", lines: ["a bot, or /capture", "kept word for word"] },
  { x: 350, y: 65, w: 200, h: 120, title: "Sort", when: "each sweep", lines: ["Claude files each line:", "act, project, chase, bin"] },
  { x: 590, y: 40, w: 210, h: 170, title: "One board", when: "every run", lines: ["plain Python, no model"], key: true },
  { x: 840, y: 65, w: 212, h: 120, title: "Morning", when: "07:30", lines: ["one Telegram message:", "one move, anything due"] },
  { x: 590, y: 260, w: 210, h: 120, title: "Night pass", when: "before 07:30", lines: ["my words, my positions", "one link, or nothing"] },
];

// The board's three sources, read where they live.
const CHIPS = [
  { x: 606, y: 138, w: 84, label: "my loops" },
  { x: 698, y: 138, w: 98, label: "job tracker" },
  { x: 606, y: 170, w: 124, label: "household list" },
];

const ARROWS = [
  "M310 125 H342", // capture → sort
  "M550 125 H582", // sort → board
  "M800 125 H832", // board → morning
  "M695 210 V252", // board → night pass
  "M550 320 H582", // news → night pass
  "M800 320 H946 V193", // night pass → morning
];

export default function LoopFlow() {
  return (
    <figure className="loop-flow rv-develop">
      <svg
        viewBox="0 0 1060 540"
        role="img"
        aria-label="How it runs. Day: capture, sort, one board built from my loops, the job tracker and the household list, then the 07:30 morning message. Overnight: the night pass reads the board and three days of news and passes at most one link to the morning message. Weekly: the Friday review loops back to capture."
      >
        <defs>
          <marker id="lf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        <text className="lf-lane" x={0} y={132}>Day</text>
        <text className="lf-lane" x={0} y={327}>Overnight</text>
        <text className="lf-lane" x={0} y={477}>Weekly</text>

        {ARROWS.map((d) => (
          <path key={d} className="lf-line" d={d} markerEnd="url(#lf-arrow)" />
        ))}

        {/* The Friday review closes the loop: morning, round the bottom, back to capture. */}
        <path className="lf-line lf-return" d="M1022 185 V470 H220 V193" markerEnd="url(#lf-arrow)" />
        <circle className="lf-node" cx={600} cy={470} r={7} />
        <text className="lf-title" x={620} y={503}>Review · Fridays 16:00</text>
        <text className="lf-body" x={620} y={526}>what closed, what&apos;s stuck, what to drop</text>

        {/* Three days of news, the one input from outside my own words. */}
        <rect className="lf-chip lf-news" x={370} y={295} width={180} height={50} rx={10} />
        <text className="lf-body" x={460} y={326} textAnchor="middle">three days of news</text>

        {BOXES.map((b) => (
          <g key={b.title}>
            <rect className={b.key ? "lf-box lf-key" : "lf-box"} x={b.x} y={b.y} width={b.w} height={b.h} rx={12} />
            <text className="lf-title" x={b.x + 18} y={b.y + 32}>{b.title}</text>
            <text className="lf-when" x={b.x + 18} y={b.y + 54}>{b.when}</text>
            {b.lines.map((l, i) => (
              <text key={l} className="lf-body" x={b.x + 18} y={b.y + 80 + i * 22}>{l}</text>
            ))}
          </g>
        ))}

        {CHIPS.map((c) => (
          <g key={c.label}>
            <rect className="lf-chip" x={c.x} y={c.y} width={c.w} height={26} rx={13} />
            <text className="lf-chip-text" x={c.x + c.w / 2} y={c.y + 18} textAnchor="middle">{c.label}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
