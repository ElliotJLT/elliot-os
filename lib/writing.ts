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
