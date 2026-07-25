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
  "homebuyer-mcp",
  "claude-eval-toolkit",
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

  const res = await fetch(
    "https://api.github.com/users/ElliotJLT/repos?per_page=100&sort=pushed",
    { headers },
  );
  if (!res.ok) return [];
  const repos: Repo[] = await res.json();
  return repos.filter((r) => !r.fork && !EXCLUDE.includes(r.name));
}
