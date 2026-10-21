// Collects every piece of text the site renders, as the language switch will
// see it, into i18n/source.json. Run after `npm run build`:
//
//   npm run build && npm run i18n:collect
//
// It serves out/ locally, opens each page in Chrome (playwright-core, using
// the installed Google Chrome), scrolls through it, opens the nav menus, and
// asks the page itself for its keys via window.__i18n.collect, so the keys
// here are exactly the ones lib/i18n.ts will look up. Then run
// `npm run i18n:translate` to translate whatever is new.

import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const OUT = "out";
const PAGES = ["/", "/built/", "/writing/", "/evals/"];
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};

if (!existsSync(OUT)) {
  console.error("No out/ folder. Run `npm run build` first.");
  process.exit(1);
}

const server = createServer(async (req, res) => {
  let path = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = join(OUT, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const keys = new Set();
const browser = await chromium.launch({ channel: "chrome" });

async function sweep(page) {
  const grab = async () => {
    for (const k of await page.evaluate(() => window.__i18n?.collect() ?? [])) keys.add(k);
  };
  await grab();
  // Scroll in steps: some sections only render their content as you reach
  // them (the pinned principles on the home page swap one at a time).
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 260) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
    await grab();
  }
  // Open each nav dropdown.
  for (const trigger of await page.$$(".nav-menu-trigger")) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await trigger.hover().catch(() => {});
    await page.waitForTimeout(250);
    await grab();
  }
}

for (const [width, height] of [
  [1280, 900],
  [390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  for (const p of PAGES) {
    // "load", not "networkidle": /built has looping video.
    await page.goto(base + p, { waitUntil: "load" });
    await page.waitForTimeout(800);
    await sweep(page);
    if (width < 700) {
      await page.evaluate(() => window.scrollTo(0, 0));
      const burger = await page.$(".mob-menu button");
      if (burger) {
        await burger.click().catch(() => {});
        await page.waitForTimeout(200);
        for (const k of await page.evaluate(() => window.__i18n?.collect() ?? [])) keys.add(k);
      }
    }
    console.log(`${width}px ${p}: ${keys.size} keys so far`);
  }
  await page.close();
}

await browser.close();
server.close();

await mkdir("i18n", { recursive: true });
const sorted = [...keys].sort();
await writeFile("i18n/source.json", JSON.stringify(sorted, null, 2) + "\n");
console.log(`Wrote ${sorted.length} keys to i18n/source.json`);
