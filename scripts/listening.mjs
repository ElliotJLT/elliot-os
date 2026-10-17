// Reads Elliot's Spotify Extended Streaming History export and writes the
// aggregates /listening shows to data/listening.json, plus album covers to
// public/listening/.
//
// Run by hand when a new export arrives; it is not part of the build. The raw
// export carries IP addresses and connection countries on every row, so it
// never enters the repo: only the counts below do.
//
//   node scripts/listening.mjs "~/Downloads/Spotify Extended Streaming History"

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = (process.argv[2] || "~/Downloads/Spotify Extended Streaming History").replace(/^~/, homedir());
const COVERS = join(ROOT, "public", "listening");
const OUT = join(ROOT, "data", "listening.json");

const HOUR = 3_600_000;
// A play counts once it passes 30 seconds, Spotify's own threshold for a stream.
const PLAYED = 30_000;
const SHELF = 12;
// Ambient noise played to focus, not music anyone chose.
const NOT_MUSIC = new Set(["Crafting Audio"]);

const londonHour = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hourCycle: "h23", timeZone: "Europe/London" });

/** Deluxe, expanded and remastered editions are the same record. */
function albumKey(name) {
  return name
    .replace(/\s*[([][^)\]]*(deluxe|expanded|edition|remaster|anniversary|bonus)[^)\]]*[)\]]/gi, "")
    .replace(/\s+-\s+.*remaster.*$/i, "")
    .trim();
}

const rows = readdirSync(SRC)
  .filter((f) => f.startsWith("Streaming_History_Audio_") && f.endsWith(".json"))
  .flatMap((f) => JSON.parse(readFileSync(join(SRC, f), "utf8")))
  .filter((r) => r.master_metadata_album_artist_name && !NOT_MUSIC.has(r.master_metadata_album_artist_name))
  .sort((a, b) => (a.ts < b.ts ? -1 : 1));

const add = (map, key, n) => map.set(key, (map.get(key) || 0) + n);
const top = (map, n = 1) => [...map].sort((a, b) => b[1] - a[1]).slice(0, n);

const artistMs = new Map();
const yearMs = new Map();
const yearArtist = new Map();
const hourArtist = Array.from({ length: 24 }, () => new Map());
const hourMs = Array(24).fill(0);
const trackPlays = new Map();
const albumTracks = new Map(); // album -> Set of tracks ever played past 30s
const album = new Map(); // album -> { artist, ms, first, uri counts }
let skips = 0;

for (const r of rows) {
  const artist = r.master_metadata_album_artist_name;
  const year = r.ts.slice(0, 4);
  const hour = Number(londonHour.format(new Date(r.ts)));
  const key = `${artist}\u0000${albumKey(r.master_metadata_album_album_name)}`;

  add(artistMs, artist, r.ms_played);
  add(yearMs, year, r.ms_played);
  if (!yearArtist.has(year)) yearArtist.set(year, new Map());
  add(yearArtist.get(year), artist, r.ms_played);
  add(hourArtist[hour], artist, r.ms_played);
  hourMs[hour] += r.ms_played;
  if (r.reason_end === "fwdbtn") skips++;

  if (!album.has(key)) album.set(key, { artist, title: albumKey(r.master_metadata_album_album_name), ms: 0, first: null, tracks: new Map() });
  const a = album.get(key);
  a.ms += r.ms_played;
  if (r.ms_played >= PLAYED) {
    a.first ??= r.ts.slice(0, 10);
    add(a.tracks, `${r.master_metadata_track_name}\u0000${r.spotify_track_uri}`, 1);
    add(trackPlays, `${artist}\u0000${r.master_metadata_track_name}`, 1);
    if (!albumTracks.has(key)) albumTracks.set(key, new Set());
    albumTracks.get(key).add(r.master_metadata_track_name);
  }
}

// Front to back: an unbroken run of plays from one album that covers at least
// three quarters of every track ever played from it, and six tracks at least,
// so a single or an EP on repeat never counts.
const throughs = new Map();
let runKey = null;
let runTracks = new Set();
const closeRun = () => {
  if (!runKey) return;
  const size = albumTracks.get(runKey)?.size || 0;
  if (runTracks.size >= 6 && runTracks.size >= 0.75 * size) add(throughs, runKey, 1);
};
for (const r of rows) {
  const key = `${r.master_metadata_album_artist_name}\u0000${albumKey(r.master_metadata_album_album_name)}`;
  if (key !== runKey) {
    closeRun();
    runKey = key;
    runTracks = new Set();
  }
  if (r.ms_played >= PLAYED) runTracks.add(r.master_metadata_track_name);
}
closeRun();

async function cover(uri, slug) {
  const file = `${slug}.jpg`;
  if (existsSync(join(COVERS, file))) return `listening/${file}`;
  try {
    const id = uri.split(":").pop();
    const meta = await (await fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${id}`)).json();
    const img = await fetch(meta.thumbnail_url);
    if (!img.ok) throw new Error(String(img.status));
    writeFileSync(join(COVERS, file), Buffer.from(await img.arrayBuffer()));
    return `listening/${file}`;
  } catch (e) {
    console.warn(`no cover for ${slug}: ${e.message}`);
    return null;
  }
}

const slugify = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

mkdirSync(COVERS, { recursive: true });
const shelf = [];
for (const [key, times] of top(throughs, SHELF)) {
  const a = album.get(key);
  const [[trackKey, plays]] = top(a.tracks);
  const [track, uri] = trackKey.split("\u0000");
  const slug = slugify(`${a.artist}-${a.title}`);
  shelf.push({
    slug,
    artist: a.artist,
    title: a.title,
    throughs: times,
    hours: Math.round(a.ms / HOUR),
    first: a.first,
    track,
    trackId: uri.split(":").pop(),
    trackPlays: plays,
    cover: await cover(uri, slug),
  });
}

const years = [...yearMs.keys()].sort().map((year) => {
  const [[artist, ms]] = top(yearArtist.get(year));
  return { year, hours: Math.round(yearMs.get(year) / HOUR), artist, artistHours: Math.round(ms / HOUR) };
});

const hours = hourArtist.map((m, hour) => ({ hour, hours: Math.round(hourMs[hour] / HOUR), artist: top(m)[0]?.[0] || null }));

const [[topTrackKey, topTrackPlays]] = top(trackPlays);
const [topTrackArtist, topTrack] = topTrackKey.split("\u0000");
const firstRow = rows[0];
const lastYear = years.at(-1);
const lastYearTop = top(yearArtist.get(lastYear.year), 4).map(([a]) => a);

const totalMs = [...artistMs.values()].reduce((s, n) => s + n, 0);

const data = {
  from: rows[0].ts.slice(0, 10),
  to: rows.at(-1).ts.slice(0, 10),
  hours: Math.round(totalMs / HOUR),
  plays: rows.length,
  artists: artistMs.size,
  skipShare: Math.round((skips / rows.length) * 100),
  first: { artist: firstRow.master_metadata_album_artist_name, track: firstRow.master_metadata_track_name, date: firstRow.ts.slice(0, 10) },
  firstStillTop: lastYearTop.includes(firstRow.master_metadata_album_artist_name) ? lastYear.year : null,
  topTrack: { artist: topTrackArtist, track: topTrack, plays: topTrackPlays },
  topArtists: top(artistMs, 10).map(([artist, ms]) => ({ artist, hours: Math.round(ms / HOUR) })),
  shelf,
  years,
  hourly: hours,
};

writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
console.log(`wrote ${OUT}: ${shelf.length} records, ${years.length} years, ${data.hours} hours`);
