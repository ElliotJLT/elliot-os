import { readFileSync } from "node:fs";
import { join } from "node:path";
import { THEMES } from "./themes";

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

/**
 * Pieces deliberately pushed below the fold, keyed by a distinctive substring
 * of the title.
 *
 * This used to be decided the other way round: anything without a hand-written
 * note fell into "earlier". That made burying a piece the default and
 * promoting it the manual step, so every new article landed at the bottom of
 * the page until somebody noticed. "The Product Engineer and the End of the
 * Handoff" sat under six older pieces for two days because of it.
 *
 * Now new writing surfaces on its own and demotion is the deliberate act.
 */
const DEMOTED = ["Finding Nemo"];

export function isDemoted(title: string): boolean {
  return DEMOTED.some((k) => title.includes(k));
}

// Why a given piece is worth someone's time. Keyed by a distinctive substring
// of the title so a renamed post degrades to "no note" rather than a wrong one.
const NOTES: [string, string][] = [
  [
    "Product Engineer",
    "When building gets cheap, the handoff becomes the expensive part. On the job that appears when one person carries a problem from prototype to production, and why a rubric has to be uncovered from real failures instead of written up front.",
  ],
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
    "Deploying to first-generation university applicants, people lost in visa paperwork, job seekers in a brutal market. What changes when a hallucination closes a door permanently, read against the EU AI Code of Practice and a run of real failures.",
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
  [
    "Learning Anxiety",
    "On the creeping pressure to keep pace when every device seems to learn faster than we do, and why not learning can suddenly feel existential.",
  ],
  [
    "Walled Garden",
    "How Facebook's attempt to connect the next billion people became a lesson in who gets to shape the internet, and who gets left outside it.",
  ],
];

export function noteFor(title: string): string | null {
  const hit = NOTES.find(([k]) => title.includes(k));
  return hit ? hit[1] : null;
}

/**
 * /writing is read by subject, not as one feed. Each group is a site theme
 * (lib/themes.ts) with a one-line standfirst and the title substrings that
 * belong under it. A post matches the first group that names it; anything
 * unmatched and not demoted lands under "Earlier". Newest first within each.
 */
export const GROUPS: [heading: string, standfirst: string, keys: string[]][] = [
  [THEMES[0].label, THEMES[0].line, ["Bad Advice", "Amsterdam", "Trust Gap"]],
  [THEMES[1].label, THEMES[1].line, ["Product Engineer", "100+ AI Leaders"]],
  [THEMES[2].label, THEMES[2].line, ["Loop Was Never", "Same Mistakes"]],
];

const EARLIER: [string, string] = [
  "Earlier",
  "Pieces from before the AI work took over the writing.",
];

export type PostGroup = {
  id: string;
  heading: string;
  standfirst: string;
  posts: Post[];
};

export function groupPosts(posts: Post[]): PostGroup[] {
  const live = posts.filter((p) => !isDemoted(p.title));
  const taken = new Set<string>();
  const groups: PostGroup[] = GROUPS.map(([heading, standfirst, keys], i) => {
    const hits = live.filter(
      (p) => !taken.has(p.link) && keys.some((k) => p.title.includes(k)),
    );
    for (const p of hits) taken.add(p.link);
    return { id: THEMES[i]?.id ?? `group-${i + 1}`, heading, standfirst, posts: hits };
  });
  groups.push({
    id: "earlier",
    heading: EARLIER[0],
    standfirst: EARLIER[1],
    posts: live.filter((p) => !taken.has(p.link)),
  });
  return groups;
}

/**
 * One piece pinned above the groups, at wr-card size. Null renders nothing.
 * Fill it when the classroom write-up is live.
 */
export type Featured = { title: string; link: string; note: string };
export const FEATURED = null as Featured | null;

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
