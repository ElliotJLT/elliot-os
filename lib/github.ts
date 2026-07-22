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
  "crux",
  "hooksmith",
];

const EXCLUDE = ["ElliotJLT", "zg-product-engineer-task"];

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
