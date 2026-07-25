import { readFileSync } from "node:fs";
import { join } from "node:path";

// Recent writing, derived from the Medium feed at build time. Falls back to a
// curated list if the feed is unreachable, so a build never breaks on it.

export type Post = { title: string; link: string; date: string };

const FALLBACK: Post[] = [
  {
    title: "The Loop Was Never the Hard Part",
    link: "https://medium.com/@elliotJL/the-loop-was-never-the-hard-part-5bdd4352acab",
    date: "2026-07-13",
  },
];

// Why a given piece is worth someone's time. Keyed by a distinctive substring
// of the title so a renamed post degrades to "no note" rather than a wrong one.
const NOTES: [string, string][] = [
  [
    "Loop Was Never",
    "The agent loop is the easy part; knowing when to stop it is the work. The thinking underneath this site's /loops page.",
  ],
  [
    "Same Mistakes",
    "Models have infinite knowledge and no habits. On writing the fixes down so a correction survives the session.",
  ],
  [
    "Bad Advice",
    "Shipping AI to A-Level students and first-time buyers: what changes when your users can't absorb a wrong answer.",
  ],
  [
    "Trust Gap",
    "Capability is not adoption. What has to be true before someone lets a model act on their behalf.",
  ],
  [
    "Amsterdam",
    "A city did everything the responsible-AI playbook asks for and the system still failed. Where governance-by-checklist breaks.",
  ],
  [
    "100+ AI Leaders",
    "Field notes from a week with the people actually deploying this, and the gap between the conference talk and the rollout.",
  ],
];

export function noteFor(title: string): string | null {
  const hit = NOTES.find(([k]) => title.includes(k));
  return hit ? hit[1] : null;
}

export async function getPosts(limit = 4): Promise<Post[]> {
  try {
    const res = await fetch("https://medium.com/@elliotJL/feed");
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, limit);
    const pick = (block: string, tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return m ? m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
    };
    const posts = items
      .map((m) => ({
        title: pick(m[1], "title"),
        link: (pick(m[1], "link") || "").split("?")[0],
        date: (() => {
          const d = new Date(pick(m[1], "pubDate"));
          return isNaN(+d) ? "" : d.toISOString().slice(0, 10);
        })(),
      }))
      .filter((p) => p.title && p.link);
    return posts.length ? posts : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

export type Media = {
  posts: Record<string, string>;
  podcast: { title: string; url: string; image: string | null } | null;
};

/**
 * Images downloaded by scripts/fetch-media.mjs (npm prebuild) and served from
 * public/media. Absent until that has run, so callers must tolerate nulls.
 */
export function getMedia(): Media {
  try {
    const raw = readFileSync(join(process.cwd(), "data", "media.json"), "utf-8");
    return JSON.parse(raw) as Media;
  } catch {
    return { posts: {}, podcast: null };
  }
}
