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

export async function getWeekActivity(): Promise<{
  commits: number;
  repos: number;
}> {
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
    if (!res.ok) return { commits: 0, repos: 0 };
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
    for (const full of repos) {
      const r = await fetch(
        `https://api.github.com/repos/${full}/commits?since=${cutoff.toISOString()}&per_page=30`,
        { headers },
      );
      if (r.ok) commits += ((await r.json()) as unknown[]).length;
    }
    return { commits, repos: repos.size };
  } catch {
    return { commits: 0, repos: 0 };
  }
}
