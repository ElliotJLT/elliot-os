const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** 7-day commit sparkline. Server-rendered inline SVG, one hue, native
 *  per-bar tooltips via <title>. days is oldest-first, ending today. */
export default function Sparkline({ days }: { days: number[] }) {
  const w = 116;
  const h = 30;
  const gap = 3;
  const bw = (w - gap * (days.length - 1)) / days.length;
  const max = Math.max(...days, 1);
  const today = new Date();

  return (
    <svg
      className="spark"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={`Commits per day, last 7 days: ${days.join(", ")}`}
    >
      {days.map((n, i) => {
        const bh = n === 0 ? 2 : Math.max(3, (n / max) * (h - 2));
        const d = new Date(today.getTime() - (days.length - 1 - i) * 86400000);
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={h - bh}
            width={bw}
            height={bh}
            rx={1.5}
            opacity={n === 0 ? 0.25 : 1}
          >
            <title>{`${DAY_NAMES[d.getUTCDay()]}: ${n} commit${n === 1 ? "" : "s"}`}</title>
          </rect>
        );
      })}
    </svg>
  );
}
