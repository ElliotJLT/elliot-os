// The design system as a check, so a new page or component can't quietly
// add its own type sizes or colours. Run by CI on every change to the CSS
// and by `npm run design:check`. Zero dependencies, no network.
//
// It fails on any declaration outside the system:
//   font-size       a role token (var(--fs-*)), a size on the scale, or a
//                   relative unit (em, cqi) set against one of them
//   line-height     1, 1.05, 1.12, 1.25, 1.4, 1.55
//   letter-spacing  0, 0.04em, 0.12em, -0.01em, -0.015em, -0.02em
//   font-weight     400, 500, 600, 700
//   colour          a hex outside :root that isn't a palette token
//
// A real exception carries `/* design-ok: why */` on the same line, so the
// reason sits next to the value and shows up in review.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SIZES = [11, 12, 13, 14, 15, 16, 17, 20, 24, 32, 40];
const LINE_HEIGHTS = ["1", "1.05", "1.12", "1.25", "1.4", "1.55"];
const TRACKING = ["0", "normal", "0.04em", "0.12em", "-0.01em", "-0.015em", "-0.02em"];
const WEIGHTS = ["400", "500", "600", "700", "normal", "inherit"];
const KEYWORDS = ["inherit", "initial", "unset", "normal"];

// Colours already outside the palette when this check landed. Don't add to
// this list: use a token from :root, or mark the line design-ok with a reason.
const LEGACY_HEX = new Set([
  "#fff6ed", "#faf3e8", "#fff", "#000", "#2a2622", "#ad5035", "#ffe9dc",
  "#f4d9c9", "#526a72", "#f3e3b6", "#3b3226", "#dfe8d4", "#f4f4f2",
  "#9da1a4", "#e6e7e8", "#868a8d", "#d2d4d5",
]);

function cssFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return cssFiles(p);
    return p.endsWith(".css") ? [p] : [];
  });
}

const sizeOk = (v) => {
  if (v.startsWith("var(--fs-")) return true;
  if (/^-?[\d.]+(em|cqi)$/.test(v)) return true;
  const px = v.match(/^([\d.]+)px$/);
  return px ? SIZES.includes(Number(px[1])) : KEYWORDS.includes(v);
};

const problems = [];

for (const file of cssFiles("app")) {
  const text = readFileSync(file, "utf8");
  const lines = text.split("\n");

  // The palette lives in :root blocks; hex there defines a token.
  const palette = new Set();
  for (const block of text.matchAll(/:root[^{]*\{[^}]*\}/g)) {
    for (const hex of block[0].matchAll(/#[0-9a-f]{3,8}\b/gi)) palette.add(hex[0].toLowerCase());
  }
  let inRoot = false;

  lines.forEach((raw, i) => {
    if (/^\s*:root/.test(raw)) inRoot = true;
    if (inRoot) {
      if (raw.includes("}")) inRoot = false;
      return;
    }
    if (raw.includes("design-ok")) return;
    const line = raw.replace(/\/\*.*?\*\//g, "");
    const at = `${file}:${i + 1}`;
    const decl = line.match(/^\s*(font-size|line-height|letter-spacing|font-weight)\s*:\s*([^;]+);/);
    if (decl) {
      const [, prop, rawValue] = decl;
      const v = rawValue.replace(/\s*!important\s*$/, "").trim();
      const ok =
        prop === "font-size" ? sizeOk(v)
        : prop === "line-height" ? LINE_HEIGHTS.includes(v) || KEYWORDS.includes(v)
        : prop === "letter-spacing" ? TRACKING.includes(v) || KEYWORDS.includes(v)
        : WEIGHTS.includes(v);
      if (!ok) problems.push(`${at}  ${prop}: ${v}  is off the scale`);
    }
    for (const hex of line.matchAll(/#[0-9a-f]{3,8}\b/gi)) {
      const h = hex[0].toLowerCase();
      if (!palette.has(h) && !LEGACY_HEX.has(h)) problems.push(`${at}  ${h}  is not a palette colour`);
    }
  });
}

if (problems.length) {
  console.error(`Design check: ${problems.length} value(s) outside the system.\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    "\nPick from the scale in CLAUDE.md (Design system), or mark a genuine exception\n" +
      "with /* design-ok: why */ on the same line.",
  );
  process.exit(1);
}
console.log("Design check: every size, line height, tracking, weight and colour is on the system.");
