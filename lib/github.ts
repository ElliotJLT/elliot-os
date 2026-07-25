export type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

// Curated on /built with hand-written blurbs; everything else lists below them.
export const FEATURED = [
  "boulot-os",
  "Claude-Skill-Potions",
  "vox",
  "dabble",
  "ward",
  "homebuyer-mcp",
  "hooksmith",
];

// crux gets its own section on /built (it is research, not tooling), so it is
// neither a FEATURED tool card nor part of the "everything else" tail.
export const RESEARCH = ["crux"];

const EXCLUDE = ["ElliotJLT", "zg-product-engineer-task", ...RESEARCH];

export async function getRepos(): Promise<Repo[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  // Freshness note: `output: "export"` fetches everything at build time, and
  // Next persists fetch results in .next/cache. CI checks out clean and never
  // restores that directory, so every deploy really does re-fetch. Locally,
  // `rm -rf .next` before building or you can render repos that no longer
  // exist (a deleted repo kept rendering here with a 404 link until 2026-07-25).
  // `cache: "no-store"` is not an option: it forces dynamic rendering, which a
  // static export rejects.
  const res = await fetch(
    "https://api.github.com/users/ElliotJLT/repos?per_page=100&sort=pushed",
    { headers },
  );
  if (!res.ok) return [];
  const repos: Repo[] = await res.json();
  const shown = await getReadmeRepos(headers);
  return repos.filter(
    (r) =>
      !r.fork &&
      !EXCLUDE.includes(r.name) &&
      // The profile README is the allowlist. Anything not on it is a scratch
      // repo or work in progress, and listing it here padded the page with
      // things Elliot had not chosen to show. If the set is unreachable, fall
      // back to showing everything rather than rendering an empty page.
      (shown.size === 0 || shown.has(r.name.toLowerCase())),
  );
}

/**
 * Repo names linked from github.com/ElliotJLT's profile README, read at build
 * time so adding a repo there is the only step needed to surface it here.
 */
async function getReadmeRepos(
  headers: Record<string, string>,
): Promise<Set<string>> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/ElliotJLT/ElliotJLT/main/README.md",
      { headers: { Accept: "text/plain", ...headers } },
    );
    if (!res.ok) return new Set();
    const md = await res.text();
    const names = [...md.matchAll(/github\.com\/ElliotJLT\/([A-Za-z0-9._-]+)/g)]
      .map((m) => m[1].toLowerCase())
      .filter((n) => n !== "elliotjlt");
    // elliot-os is this site; it belongs in the list whether or not the README
    // happens to link it.
    return new Set([...names, "elliot-os"]);
  } catch {
    return new Set();
  }
}
