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
  { x: 150, y: 40, w: 190, h: 120, title: "Capture", when: "any time", lines: ["a bot, or /capture", "kept word for word"] },
  { x: 150, y: 190, w: 190, h: 172, title: "Read", when: "every hour", lines: ["looks, never sends"] },
  { x: 390, y: 40, w: 230, h: 192, title: "One board", when: "every run", lines: ["plain Python, no model", "checked against the mail"], key: true },
  { x: 670, y: 40, w: 250, h: 120, title: "Morning", when: "07:30", lines: ["one Telegram message:", "one move, due, meetings"] },
  { x: 390, y: 272, w: 230, h: 130, title: "Nine o'clock call", when: "21:00", lines: ["one thing for tomorrow,", "and what can wait"] },
  { x: 390, y: 460, w: 230, h: 120, title: "Night pass", when: "before 07:30", lines: ["my words, my positions", "one link, or nothing"] },
];

// What Read reads, and the board's three sources, each read where it lives.
const CHIPS = [
  { x: 168, y: 286, w: 56, label: "mail" },
  { x: 232, y: 286, w: 88, label: "calendar" },
  { x: 168, y: 318, w: 88, label: "sessions" },
  { x: 406, y: 158, w: 84, label: "my loops" },
  { x: 498, y: 158, w: 98, label: "job tracker" },
  { x: 406, y: 190, w: 124, label: "household list" },
];

const ARROWS = [
  "M340 100 H382", // capture → board
  "M340 214 H382", // read → board
  "M620 100 H662", // board → morning
  "M505 232 V264", // board → nine o'clock call
  "M340 340 H382", // read → nine o'clock call
  "M340 520 H382", // news → night pass
  "M620 520 H890 V168", // night pass → morning
];

export default function LoopFlow() {
  return (
    <figure className="loop-flow rv-develop">
      <svg
        viewBox="0 0 1060 710"
        role="img"
        aria-label="How it runs. Day: capture, and an hourly read of my mail, calendar and working sessions, feed one board built from my loops, the job tracker and the household list. The board feeds the 07:30 morning message and, with the read, the nine o'clock call at 21:00, which waits at the top of the next morning's sessions. Overnight: the night pass reads three days of news and passes at most one link to the morning message. Weekly: the Friday review loops back to capture."
      >
        <defs>
          <marker id="lf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        <text className="lf-lane" x={0} y={107}>Day</text>
        <text className="lf-lane" x={0} y={527}>Overnight</text>
        <text className="lf-lane" x={0} y={657}>Weekly</text>

        {ARROWS.map((d) => (
          <path key={d} className="lf-line" d={d} markerEnd="url(#lf-arrow)" />
        ))}

        {/* The call is advice for tomorrow: it waits at the top of the next morning's sessions. */}
        <path className="lf-line lf-return" d="M620 337 H662" markerEnd="url(#lf-arrow)" />
        <rect className="lf-chip lf-news" x={670} y={324} width={176} height={26} rx={13} />
        <text className="lf-chip-text" x={758} y={342} textAnchor="middle">tomorrow&apos;s sessions</text>

        {/* The Friday review closes the loop: morning, round the bottom, back to capture. */}
        <path className="lf-line lf-return" d="M920 100 H1046 V650 H126 V100 H142" markerEnd="url(#lf-arrow)" />
        <circle className="lf-node" cx={600} cy={650} r={7} />
        <text className="lf-title" x={620} y={683}>Review · Fridays 16:00</text>
        <text className="lf-body" x={620} y={706}>what closed, what&apos;s stuck, what to drop</text>

        {/* Three days of news, the one input from outside my own words. */}
        <rect className="lf-chip lf-news" x={150} y={495} width={190} height={50} rx={10} />
        <text className="lf-body" x={245} y={526} textAnchor="middle">three days of news</text>

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
