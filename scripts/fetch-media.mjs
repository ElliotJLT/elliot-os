// Downloads the images the site shows (Medium article headers, the podcast
// cover) into public/media/ at build time, and writes data/media.json mapping
// each source URL to its local path.
//
// Why download rather than hotlink: the site tells visitors "cookies 0,
// analytics 0" and self-hosts its fonts for the same reason. Embedding
// Medium or Spotify CDN URLs would make every visitor's browser talk to
// Medium and Spotify, leaking their IP and making that claim false. Fetching
// at build keeps the promise and keeps the pages working if either host is
// down later.
//
// Runs as npm prebuild. Never fails the build: on any error it writes what it
// has, and the pages render without an image.

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "media");
const MAP_PATH = join(ROOT, "data", "media.json");

const PODCAST_EPISODE = "3D8quBCXrMNgIF87czhux3";

/** Fetch with a browser UA; Medium's CDN rejects some default agents. */
async function get(url, asBuffer = false) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return asBuffer ? Buffer.from(await res.arrayBuffer()) : res.text();
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

async function save(url, name) {
  const ext = (url.match(/\.(png|jpe?g|webp|gif)(?:\?|$)/i)?.[1] || "jpg")
    .toLowerCase()
    .replace("jpeg", "jpg");
  const file = `${name}.${ext}`;
  const dest = join(OUT_DIR, file);
  if (existsSync(dest)) return `media/${file}`;
  writeFileSync(dest, await get(url, true));
  return `media/${file}`;
}

const media = { posts: {}, podcast: null };
mkdirSync(OUT_DIR, { recursive: true });

// ---- Medium article headers ------------------------------------------------
try {
  const xml = await get("https://medium.com/@elliotJL/feed");
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 20);
  for (const [, block] of items) {
    const link = (
      block.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1] || ""
    ).trim().split("?")[0];
    const title = (
      block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || ""
    ).replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    // /max/ skips the 150x150 author avatar that also appears in the feed.
    const full = block.match(
      /https:\/\/cdn-images-\d+\.medium\.com\/max\/[^"<)\s]+/,
    )?.[0];
    if (!link || !full) continue;
    // Ask the CDN for a uniform 16:9 crop rather than the full-width header:
    // consistent shape for the list, and roughly a seventh of the bytes
    // (~130KB instead of ~900KB) on a site that should stay light.
    const img = full.replace(/\/max\/\d+\//, "/fit/c/320/180/");
    try {
      media.posts[link] = await save(img, slug(title) || "post");
    } catch (e) {
      console.warn(`  skipped image for "${title}": ${e.message}`);
    }
  }
  console.log(`media: ${Object.keys(media.posts).length} article images`);
} catch (e) {
  console.warn(`media: Medium feed unavailable (${e.message})`);
}

// ---- Podcast cover + real episode title ------------------------------------
try {
  const meta = JSON.parse(
    await get(
      `https://open.spotify.com/oembed?url=https://open.spotify.com/episode/${PODCAST_EPISODE}`,
    ),
  );
  media.podcast = {
    title: meta.title,
    url: `https://open.spotify.com/episode/${PODCAST_EPISODE}`,
    image: meta.thumbnail_url ? await save(meta.thumbnail_url, "podcast") : null,
  };
  console.log(`media: podcast cover + title ("${meta.title.slice(0, 40)}…")`);
} catch (e) {
  console.warn(`media: podcast metadata unavailable (${e.message})`);
}

writeFileSync(MAP_PATH, JSON.stringify(media, null, 2) + "\n");
