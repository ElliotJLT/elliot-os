/**
 * Pen marks for the principles, built from measured boxes so each one fits
 * the word it belongs to at any size: a loop that runs from a word to its
 * statement, a swoosh underline, a tick, and a loose circle. Every mark is a
 * single path, so one stroke-dashoffset draws it in.
 */

export type Box = { left: number; top: number; right: number; bottom: number };
type Pt = [number, number];

/** A smooth line through the points (Catmull-Rom, as cubic Béziers). */
function through(pts: Pt[]): string {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/**
 * From the end of the word, up and over, one loop, then across to where the
 * statement starts. `to` is the point just left of the statement's first
 * line. The loop is sized from the gap, capped so it never grows past the
 * word's own height.
 */
export function loopTo(word: Box, to: Pt): string {
  const h = word.bottom - word.top;
  const a: Pt = [word.right + 6, word.top + h * 0.56];
  const dx = to[0] - a[0];
  const L = Math.min(h * 0.9, dx * 0.16);
  const at = (u: number, v: number): Pt => [a[0] + u * dx, a[1] + (to[1] - a[1]) * u + v * L];
  return through([
    a,
    at(0.14, -0.55),
    at(0.36, -0.7),
    at(0.5, -0.05),
    at(0.44, 0.62),
    at(0.3, 0.5),
    at(0.33, 0.02),
    at(0.52, -0.02),
    at(0.74, -0.2),
    [to[0] - 6, to[1]],
  ]);
}

/** Two quick strokes under the word: out past its end, and a shorter hook back. */
export function underline(word: Box): string {
  const w = word.right - word.left;
  const h = word.bottom - word.top;
  const y = word.bottom - h * 0.06;
  const x = word.left;
  return through([
    [x - 4, y + 3],
    [x + w * 0.35, y - 3],
    [x + w * 0.75, y - 1],
    [x + w + 10, y - 5],
    [x + w * 0.62, y + 5],
    [x + w * 0.25, y + 9],
    [x + w * 0.02, y + 8],
  ]);
}

/** A tick just after the word, sat on its baseline. */
export function tick(word: Box): string {
  const h = word.bottom - word.top;
  const x = word.right + h * 0.28;
  const base = word.bottom - h * 0.18;
  const s = h * 0.62;
  return through([
    [x, base - s * 0.42],
    [x + s * 0.16, base - s * 0.22],
    [x + s * 0.3, base],
    [x + s * 0.55, base - s * 0.5],
    [x + s * 0.95, base - s * 1.05],
  ]);
}

/**
 * A loose circle round the word: an ellipse a little wider than the word,
 * kept inside its own line so it only grazes the lines above and below, and
 * carried on past where it started so the pen overshoots.
 */
export function circle(word: Box): string {
  const w = word.right - word.left;
  const h = word.bottom - word.top;
  const cx = word.left + w / 2;
  const cy = word.top + h * 0.54;
  const rx = w / 2 + Math.max(14, h * 0.3);
  const ry = h * 0.5;
  const pts: Pt[] = [];
  // From the top right, anticlockwise round, and on for another 50°.
  const start = -0.35 * Math.PI;
  const sweep = -2.28 * Math.PI;
  const n = 26;
  for (let k = 0; k <= n; k++) {
    const t = start + (sweep * k) / n;
    // A little wobble, and the second pass sits slightly inside the first.
    const r = 1 + 0.035 * Math.sin(3 * t + 0.6) - (k / n) * 0.06;
    pts.push([cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r - (k / n) * 2]);
  }
  return through(pts);
}
