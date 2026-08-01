/**
 * GitHub contribution calendar, read at build time.
 *
 * The contribution graph is not exposed by the REST API and the GraphQL
 * endpoint needs a token, so this reads the public HTML fragment GitHub
 * serves for the profile calendar. No auth, no third-party service, and the
 * result is inlined into the static export, which keeps the site's promise
 * that a visitor's browser makes no request off this origin.
 *
 * Day cells come back as `contribution-day-component-{dayOfWeek}-{week}` with
 * a `data-level` of 0..4, and the exact count lives in the matching tool-tip
 * ("12 contributions on July 3rd." / "No contributions on ...").
 */

const USER = "ElliotJLT";
const SRC = `https://github.com/users/${USER}/contributions`;

export type Day = { date: string; count: number; level: number };

export type Contributions = {
  total: number;
  days: Day[];
  /** [week][dayOfWeek] — null where the calendar has no cell. */
  grid: (Day | null)[][];
  weeks: number;
  activeDays: number;
  totalDays: number;
  last90: number;
  last90Active: number;
  longestStreak: number;
  from: string;
  to: string;
};

export async function getContributions(): Promise<Contributions | null> {
  let html: string;
  try {
    const res = await fetch(SRC, {
      headers: {
        // GitHub serves the fragment to a plain client, but a browser-ish
        // agent avoids the occasional bot challenge on this path.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    html = await res.text();
  } catch {
    // A build must not fail because GitHub is having a moment. The section
    // simply does not render.
    return null;
  }

  const cellRe =
    /data-date="(\d{4}-\d{2}-\d{2})"\s+id="(contribution-day-component-(\d+)-(\d+))"\s+data-level="(\d)"/g;
  const tipRe =
    /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g;

  const tips = new Map<string, string>();
  for (const m of html.matchAll(tipRe)) tips.set(m[1], m[2]);

  const days: Day[] = [];
  const cells: { dow: number; week: number; day: Day }[] = [];

  for (const m of html.matchAll(cellRe)) {
    const [, date, id, dowStr, weekStr, levelStr] = m;
    const tip = tips.get(id) ?? "";
    const n = /^(\d+)\s+contribution/.exec(tip);
    const day: Day = {
      date,
      count: n ? Number(n[1]) : 0,
      level: Number(levelStr),
    };
    days.push(day);
    cells.push({ dow: Number(dowStr), week: Number(weekStr), day });
  }

  if (days.length === 0) return null;

  const weeks = Math.max(...cells.map((c) => c.week)) + 1;
  const grid: (Day | null)[][] = Array.from({ length: weeks }, () =>
    Array<Day | null>(7).fill(null),
  );
  for (const c of cells) grid[c.week][c.dow] = c.day;

  const chrono = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const total = chrono.reduce((s, d) => s + d.count, 0);
  const activeDays = chrono.filter((d) => d.count > 0).length;

  const tail = chrono.slice(-90);
  const last90 = tail.reduce((s, d) => s + d.count, 0);
  const last90Active = tail.filter((d) => d.count > 0).length;

  let streak = 0;
  let longestStreak = 0;
  for (const d of chrono) {
    streak = d.count > 0 ? streak + 1 : 0;
    if (streak > longestStreak) longestStreak = streak;
  }

  return {
    total,
    days: chrono,
    grid,
    weeks,
    activeDays,
    totalDays: chrono.length,
    last90,
    last90Active,
    longestStreak,
    from: chrono[0].date,
    to: chrono[chrono.length - 1].date,
  };
}
