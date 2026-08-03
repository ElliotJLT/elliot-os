import type { Contributions } from "@/lib/contributions";

const CELL = 10;
const GAP = 3;
const PITCH = CELL + GAP;
const LABEL_H = 15;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * A year of commits, drawn. Deliberately not GitHub green: it uses the site's
 * own chart token so it reads as part of the page rather than as a screenshot
 * pasted into it, and the levels are opacity steps of one ink so dark mode
 * needs no second palette.
 */
export default function Calendar({ data }: { data: Contributions }) {
  const w = data.weeks * PITCH - GAP;
  const h = 7 * PITCH - GAP;

  // One label per month, on the first week of that month. The calendar starts
  // mid-month, so the opening label sits a week from the next one and the two
  // overlap ("JuAug"). When labels land closer than their own width, the later
  // one wins: a full month is worth more than the stub the year opened on.
  const MIN_GAP = 30;
  const labels: { x: number; text: string }[] = [];
  let lastMonth = -1;
  data.grid.forEach((week, i) => {
    const first = week.find(Boolean);
    if (!first) return;
    const m = Number(first.date.slice(5, 7)) - 1;
    if (m === lastMonth) return;
    lastMonth = m;
    const label = { x: i * PITCH, text: MONTHS[m] };
    const prev = labels[labels.length - 1];
    if (prev && label.x - prev.x < MIN_GAP) labels[labels.length - 1] = label;
    else labels.push(label);
  });

  return (
    <svg
      className="cal rv-develop"
      viewBox={`0 0 ${w} ${h + LABEL_H}`}
      role="img"
      aria-label={`${data.total.toLocaleString()} contributions between ${data.from} and ${data.to}`}
    >
      {labels.map((l) => (
        <text key={l.text + l.x} x={l.x} y={10} className="calmonth">
          {l.text}
        </text>
      ))}
      {data.grid.map((week, wi) =>
        week.map((day, di) =>
          day ? (
            <rect
              key={day.date}
              x={wi * PITCH}
              y={LABEL_H + di * PITCH}
              width={CELL}
              height={CELL}
              rx={2}
              className={`lv${day.level}`}
            >
              {day.count > 0 && (
                <title>{`${day.count} on ${day.date}`}</title>
              )}
            </rect>
          ) : null,
        ),
      )}
    </svg>
  );
}
