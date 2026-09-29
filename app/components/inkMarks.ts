/**
 * Pen marks for the principles, built from measured boxes so each one fits
 * the word it belongs to at any size: a loop that runs from a word to its
 * statement, a swoosh underline, a tick, and a loose circle. Every mark is a
 * single path, so one stroke-dashoffset draws it in.
 */

export type Box = { left: number; top: number; right: number; bottom: number };
type Pt = [number, number];

/**
 * A smooth line through the points: centripetal Catmull-Rom, as cubic
 * Béziers. Centripetal spacing keeps tight turns round instead of letting
 * them kink or overshoot, which is what made the first pass look scrawled.
 */
function through(pts: Pt[]): string {
  const f = (n: number) => n.toFixed(1);
  const dist = (p: Pt, q: Pt) => Math.max(1e-3, Math.sqrt(Math.hypot(q[0] - p[0], q[1] - p[1])));
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const d1 = dist(p0, p1);
    const d2 = dist(p1, p2);
    const d3 = dist(p2, p3);
    // Tangents at p1 and p2, weighted by the spacing either side.
    const t1: Pt = [
      (p2[0] - p1[0]) / d2 - (p2[0] - p0[0]) / (d1 + d2) + (p1[0] - p0[0]) / d1,
      (p2[1] - p1[1]) / d2 - (p2[1] - p0[1]) / (d1 + d2) + (p1[1] - p0[1]) / d1,
    ];
    const t2: Pt = [
      (p3[0] - p2[0]) / d3 - (p3[0] - p1[0]) / (d2 + d3) + (p2[0] - p1[0]) / d2,
      (p3[1] - p2[1]) / d3 - (p3[1] - p1[1]) / (d2 + d3) + (p2[1] - p1[1]) / d2,
    ];
    const c1: Pt = [p1[0] + (t1[0] * d2) / 3, p1[1] + (t1[1] * d2) / 3];
    const c2: Pt = [p2[0] - (t2[0] * d2) / 3, p2[1] - (t2[1] * d2) / 3];
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
  const L = Math.min(h * 0.85, dx * 0.14);
  const at = (u: number, v: number): Pt => [a[0] + u * dx, a[1] + (to[1] - a[1]) * u + v * L];
  // A level run out of the word, one clean loop, then an S up to the text.
  return through([
    a,
    at(0.2, 0.06),
    at(0.36, -0.1),
    at(0.44, -0.62),
    at(0.36, -1.0),
    at(0.27, -0.62),
    at(0.36, -0.1),
    at(0.55, 0.12),
    at(0.78, -0.2),
    [to[0] - 6, to[1]],
  ]);
}

/** Two quick strokes under the word: out past its end, and a shorter hook back. */
export function underline(word: Box): string {
  const w = word.right - word.left;
  const h = word.bottom - word.top;
  const y = word.bottom - h * 0.05;
  const x = word.left;
  return through([
    [x - 2, y + 2],
    [x + w * 0.5, y - 1],
    [x + w + 8, y - 4],
    [x + w * 0.6, y + 4],
    [x + w * 0.15, y + 6],
  ]);
}

/** A tick just after the word, sat on its baseline. */
export function tick(word: Box): string {
  const h = word.bottom - word.top;
  const x = word.right + h * 0.28;
  const base = word.bottom - h * 0.18;
  const s = h * 0.6;
  const f = (n: number) => n.toFixed(1);
  // A short stroke down into the corner, then one long stroke up and out.
  return (
    `M${f(x)} ${f(base - s * 0.4)}` +
    ` Q${f(x + s * 0.16)} ${f(base - s * 0.14)} ${f(x + s * 0.3)} ${f(base)}` +
    ` Q${f(x + s * 0.5)} ${f(base - s * 0.62)} ${f(x + s * 1.0)} ${f(base - s * 1.08)}`
  );
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
  const n = 40;
  for (let k = 0; k <= n; k++) {
    const t = start + (sweep * k) / n;
    // A little wobble, and the second pass sits slightly inside the first.
    const r = 1 + 0.012 * Math.sin(2 * t + 0.6) - (k / n) * 0.05;
    pts.push([cx + Math.cos(t) * rx * r, cy + Math.sin(t) * ry * r - (k / n) * 2]);
  }
  return through(pts);
}
