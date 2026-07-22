import { readFileSync } from "fs";
import { join } from "path";

export type Spend = {
  runs: {
    date: string;
    model: string | null;
    input_tokens: number;
    output_tokens: number;
    cost_usd: number;
  }[];
  totals: {
    runs: number;
    input_tokens: number;
    output_tokens: number;
    cost_usd: number;
  };
};

export function getSpend(): Spend {
  return JSON.parse(
    readFileSync(join(process.cwd(), "data", "spend.json"), "utf-8"),
  );
}

export type WeekActivity = {
  commits: number;
  repos: number;
  /** commits per day, oldest first, 7 entries ending today (UTC) */
  days: number[];
};

const EMPTY_WEEK: WeekActivity = { commits: 0, repos: 0, days: Array(7).fill(0) };

export async function getWeekActivity(): Promise<WeekActivity> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(
      "https://api.github.com/users/ElliotJLT/events/public?per_page=100",
      { headers },
    );
    if (!res.ok) return EMPTY_WEEK;
    const events: {
      type: string;
      created_at: string;
      repo: { name: string };
    }[] = await res.json();
    const cutoff = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const repos = new Set<string>();
    for (const e of events) {
      if (e.type !== "PushEvent") continue;
      if (new Date(e.created_at) < cutoff) continue;
      repos.add(e.repo.name);
    }
    // PushEvent payloads no longer include commit lists; count per repo
    let commits = 0;
    const days = Array(7).fill(0);
    const dayMs = 24 * 3600 * 1000;
    for (const full of repos) {
      const r = await fetch(
        `https://api.github.com/repos/${full}/commits?since=${cutoff.toISOString()}&per_page=30`,
        { headers },
      );
      if (!r.ok) continue;
      const list = (await r.json()) as {
        commit: { author: { date: string } };
      }[];
      commits += list.length;
      for (const c of list) {
        const t = new Date(c.commit.author.date).getTime();
        const idx = 6 - Math.floor((Date.now() - t) / dayMs);
        if (idx >= 0 && idx <= 6) days[idx]++;
      }
    }
    return { commits, repos: repos.size, days };
  } catch {
    return EMPTY_WEEK;
  }
}
