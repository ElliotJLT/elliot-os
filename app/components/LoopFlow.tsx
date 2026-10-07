/**
 * How the loop runs, as the day it runs on: a 24-hour dial with midnight at
 * the bottom, so the working day sits across the top and the night pools
 * below. Only what runs at a set time gets a mark on the face, since a mark
 * there reads as a time; Read is the hourly ticks, and Capture and the board
 * sit in the key. The week is a row of seven dots underneath. Built in code so the times are exact and it
 * follows the theme.
 */
const CX = 260;
const CY = 250;
const R = 190;

// Hour h on the dial: 00 at the bottom, 06 left, 12 top, 18 right.
function at(h: number, r: number) {
  const a = (h / 24) * 2 * Math.PI;
  return { x: +(CX - r * Math.sin(a)).toFixed(1), y: +(CY + r * Math.cos(a)).toFixed(1) };
}

// An arc along the dial from hour h1 to hour h2, running forward in time.
function arc(h1: number, h2: number, r: number) {
  const s = at(h1, r);
  const e = at(h2, r);
  const span = (((h2 - h1) % 24) + 24) % 24;
  return `M${s.x} ${s.y} A${r} ${r} 0 ${span > 12 ? 1 : 0} 1 ${e.x} ${e.y}`;
}

const MORNING = 7.5;
const CALL = 21;

const KEY = [
  { n: "1", name: "Capture", when: "any time", line: "a bot or /capture, kept word for word" },
  { n: "2", name: "Read", when: "every hour", line: "mail, calendar, sessions: the ticks on the dial" },
  { n: "3", name: "One board", when: "every run", line: "one list, plain Python, no model" },
  { n: "4", name: "Night pass", when: "overnight", line: "three days of news against what I've said" },
  { n: "5", name: "Morning", when: "07:30", line: "one Telegram message, one move" },
  { n: "6", name: "Nine o'clock call", when: "21:00", line: "one call, waiting in tomorrow's sessions", accent: true },
  { n: "7", name: "Review", when: "Fridays 16:00", line: "what closed, what's stuck, what to drop" },
];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function Mark({ x, y, n, solid, accent }: { x: number; y: number; n: string; solid?: boolean; accent?: boolean }) {
  const cls = accent ? "ld-mark ld-accent" : solid ? "ld-mark ld-solid" : "ld-mark";
  return (
    <g className={cls}>
      <circle cx={x} cy={y} r={14} />
      <text x={x} y={y + 5} textAnchor="middle">{n}</text>
    </g>
  );
}

export default function LoopFlow() {
  const morning = at(MORNING, R);
  const call = at(CALL, R);
  const hubEdge = (h: number) => at(h, 54);
  const nodeEdge = (h: number) => at(h, R - 16);

  return (
    <figure className="loop-dial rv-develop">
      <svg
        viewBox="0 0 520 580"
        role="img"
        aria-label="How it runs, drawn as a 24-hour dial with midnight at the bottom. One board sits at the centre, fed by captures and an hourly read of my mail, calendar and sessions, shown as the hour ticks. It feeds the morning message at 07:30 and the nine o'clock call at 21:00. The night pass runs overnight and ends at 07:30. Once a week, on Fridays at 16:00, the review."
      >
        <defs>
          <marker id="ld-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* The day, the night as a flat band from midnight to 07:30, and
            Read's hourly ticks. */}
        <circle className="ld-ring" cx={CX} cy={CY} r={R} />
        <path className="ld-night" d={arc(0, MORNING, R - 20)} />
        {Array.from({ length: 24 }, (_, h) => {
          const a = at(h, R);
          const b = at(h, R - (h % 6 === 0 ? 12 : 7));
          return <line key={h} className="ld-tick" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        {[0, 6, 12, 18].map((h) => {
          const p = at(h, R + 26);
          return (
            <text key={h} className="ld-hour" x={p.x} y={p.y + 4} textAnchor="middle">
              {String(h).padStart(2, "0")}
            </text>
          );
        })}

        {/* The board feeds the morning and the call. */}
        <line className="ld-spoke" x1={hubEdge(MORNING).x} y1={hubEdge(MORNING).y} x2={nodeEdge(MORNING).x} y2={nodeEdge(MORNING).y} markerEnd="url(#ld-arrow)" />
        <line className="ld-spoke" x1={hubEdge(CALL).x} y1={hubEdge(CALL).y} x2={nodeEdge(CALL).x} y2={nodeEdge(CALL).y} markerEnd="url(#ld-arrow)" />

        <circle className="ld-hub" cx={CX} cy={CY} r={50} />
        <text className="ld-hub-name" x={CX} y={CY + 6} textAnchor="middle">One board</text>

        <Mark {...at(MORNING / 2, R - 20)} n="4" solid />
        <Mark {...morning} n="5" solid />
        <Mark {...call} n="6" accent />

        {/* The week: seven days, the review on Friday. */}
        <line className="ld-week" x1={110} y1={530} x2={410} y2={530} />
        {DAYS.map((d, i) => {
          const x = 110 + i * 50;
          return (
            <g key={d}>
              {d === "Fr" ? <Mark x={x} y={530} n="7" solid /> : <circle className="ld-day" cx={x} cy={530} r={3.5} />}
              <text className="ld-hour" x={x} y={564} textAnchor="middle">{d}</text>
            </g>
          );
        })}
      </svg>

      <ol className="ld-key">
        {KEY.map((k) => (
          <li key={k.n} className={k.accent ? "ld-key-accent" : undefined}>
            <span className="ld-key-n">{k.n}</span>
            <span className="ld-key-head">
              <span className="ld-key-name">{k.name}</span>
              <span className="ld-key-when">{k.when}</span>
            </span>
            <span className="ld-key-line">{k.line}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
