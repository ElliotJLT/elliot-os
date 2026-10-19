/**
 * How the loop runs, as the day it runs on: a 24-hour dial with midnight at
 * the bottom, so the working day sits across the top and the night pools
 * below. Only what runs at a set time gets a mark on the face, since a mark
 * there reads as a time; Read is the hourly ticks, and Capture and the list
 * sit in the key. The week is a row of seven dots underneath, with the Sunday
 * read on Sunday. Built in code so the times are exact and it follows the
 * theme. The steps match STEPS on /loops.
 */
const CX = 260;
const CY = 250;
const R = 190;

// Hour h on the dial: 00 at the bottom, 06 left, 12 top, 18 right.
function at(h: number, r: number) {
  const a = (h / 24) * 2 * Math.PI;
  return { x: +(CX - r * Math.sin(a)).toFixed(1), y: +(CY + r * Math.cos(a)).toFixed(1) };
}

const CALL = 21;

const KEY = [
  { n: "1", name: "Capture", when: "any time", line: "a bot or /capture, kept word for word" },
  { n: "2", name: "Read", when: "every hour", line: "email, calendar, sessions: the ticks on the dial" },
  { n: "3", name: "One list", when: "every run", line: "built by plain code, no AI" },
  { n: "4", name: "The 9pm call", when: "21:00", line: "one call, waiting in tomorrow's sessions", accent: true },
  { n: "5", name: "The Sunday read", when: "Sundays", line: "its read on my week; I answer yes, no or in my words" },
  { n: "6", name: "A note at the top", when: "weekly", line: "how to work with me, at the start of every session" },
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
  const call = at(CALL, R);
  const hubEdge = (h: number) => at(h, 54);
  const nodeEdge = (h: number) => at(h, R - 16);

  return (
    <figure className="loop-dial rv-develop">
      <svg
        viewBox="0 0 520 580"
        role="img"
        aria-label="How it runs, drawn as a 24-hour dial with midnight at the bottom. One list sits at the centre, fed by captures and an hourly read of my email, calendar and sessions, shown as the hour ticks. It feeds the 9pm call. Once a week, on Sundays, the Sunday read."
      >
        <defs>
          <marker id="ld-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* The day, and Read's hourly ticks. */}
        <circle className="ld-ring" cx={CX} cy={CY} r={R} />
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

        {/* The list feeds the call. */}
        <line className="ld-spoke" x1={hubEdge(CALL).x} y1={hubEdge(CALL).y} x2={nodeEdge(CALL).x} y2={nodeEdge(CALL).y} markerEnd="url(#ld-arrow)" />

        <circle className="ld-hub" cx={CX} cy={CY} r={50} />
        <text className="ld-hub-name" x={CX} y={CY + 6} textAnchor="middle">One list</text>

        <Mark {...call} n="4" accent />

        {/* The week: seven days, the Sunday read on Sunday. */}
        <line className="ld-week" x1={110} y1={530} x2={410} y2={530} />
        {DAYS.map((d, i) => {
          const x = 110 + i * 50;
          return (
            <g key={d}>
              {d === "Su" ? <Mark x={x} y={530} n="5" solid /> : <circle className="ld-day" cx={x} cy={530} r={3.5} />}
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
