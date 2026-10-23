"use client";

import { useEffect, useRef, useState } from "react";

// A small pixel character in the footer that changes outfit when you click
// it: builder, chef, wizard, graduate, painter, round again. Each change is
// a quick costume swap: a pixel cloud puffs up, the character spins, the
// old outfit is gone and the new hat drops onto its head. Drawn as an SVG
// grid (one rect per run of pixels) so it stays crisp at any size.
//
// The grid is 18 wide and 14 tall: hats live in rows 0-6, the body in rows
// 7-13, and the things it holds in columns 0-2 (left) and 14-17 (right).

const BODY = [
  "....OOOOOOOOO.....",
  "....OOKOOOKOO.....",
  "....OOOOOOOOO.....",
  "...OOOOWWWOOOO....",
  "..OOOOOOOOOOOO....",
  "....OOOOOOOOO.....",
  "....O.O...O.O.....",
];

type Outfit = {
  name: string;
  /** Rows 0-6, 18 wide. */
  hat: string[];
  /** Rows 7-12, columns 0-2. */
  left: string[];
  /** Rows 7-12, columns 14-17. */
  right: string[];
};

const OUTFITS: Outfit[] = [
  {
    name: "builder",
    hat: [
      "..................",
      "..................",
      "..................",
      "......YYYYY.......",
      "....YYYYYYYYY.....",
      "...YYYYyYYYYYY....",
      "..yyyyyyyyyyyyy...",
    ],
    left: ["M.M", "MMM", ".M.", ".M.", ".M.", ".M."],
    right: [".S..", ".S..", ".S..", "HHH.", ".H..", ".H.."],
  },
  {
    name: "chef",
    hat: [
      ".....WW.WW.WW.....",
      "....WWWWWWWWWW....",
      "....WWWWWWWWWW....",
      ".....WWWWWWWW.....",
      ".....WWWWWWWW.....",
      ".....WWWWWWWW.....",
      "....MMMMMMMMMM....",
    ],
    left: ["MMM", "M.M", "MMM", ".M.", ".y.", ".y."],
    right: ["MMM.", "MMM.", ".y..", "yy..", ".y..", ".y.."],
  },
  {
    name: "wizard",
    hat: [
      "........HH........",
      ".......HHH........",
      "......HHHHY.......",
      "......HHHHH.......",
      ".....HHYHHHH......",
      "....HHHHHHHHH.....",
      "..HHHHHHHHHHHHH...",
    ],
    left: ["...", "...", "...", "...", "...", "..."],
    right: [".YWY", "..Y.", ".y..", "yy..", "....", "...."],
  },
  {
    name: "graduate",
    hat: [
      "..................",
      "..................",
      "..................",
      "..MMMMMMMMMMMMM...",
      "....MMMMMMMMM.Y...",
      ".....MMMMMMM..Y...",
      ".....MMMMMMM..Y...",
    ],
    left: ["...", "...", "...", "...", "...", "..."],
    right: ["....", "....", "WWW.", "WHW.", "WWW.", "...."],
  },
  {
    name: "painter",
    hat: [
      "..................",
      "..................",
      "..................",
      ".........H........",
      "......HHHHHH......",
      "....HHHHHHHHHH....",
      "....HHHHHHHHHHH...",
    ],
    left: ["...", "...", "...", "Hy.", "yY.", "yy."],
    right: [".H..", ".W..", ".y..", "yy..", ".y..", "...."],
  },
];

// The puff: a pixel cloud in two sizes.
const CLOUD_SMALL = [
  "..................",
  "..................",
  "..................",
  "..................",
  "......WW..WW......",
  ".....WWWWWWWW.....",
  "....WWWWWWWWWW....",
  "...WWWWWWWWWWWW...",
  "....WWWWWWWWWW....",
  ".....WWW..WWW.....",
];
const CLOUD_BIG = [
  "..................",
  "......WW...WW.....",
  "....WWWWW.WWWWW...",
  "...WWWWWWWWWWWWW..",
  "..WWWWWWWWWWWWWWW.",
  ".WWWWWWWWWWWWWWWW.",
  "..WWWWWWWWWWWWWWW.",
  ".WWWWWWWWWWWWWWWW.",
  "..WWWWWWWWWWWWWW..",
  "...WWWWWWWWWWWWW..",
  "....WWWW..WWWWW...",
  "......WW...WW.....",
];

const FILL: Record<string, string> = {
  Y: "#f3df98",
  y: "#d4b46c",
  O: "#d97757",
  K: "#1d2420",
  W: "#f3eee2",
  M: "#b6c2d6",
  S: "#b6c2d6",
  H: "#c0587a",
};

function rects(rows: string[], dx = 0, dy = 0, only?: (c: string) => boolean) {
  const out: React.ReactElement[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === "." || (only && !only(c))) {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === c) w++;
      out.push(
        <rect key={`${x}-${y}`} x={x + dx} y={y + dy} width={w} height={1} fill={FILL[c]} />,
      );
      x += w;
    }
  });
  return out;
}

const OUT_MS = 170;
const IN_MS = 260;

export default function ClaudeBuilder() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function change() {
    if (phase !== "idle") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setI((n) => (n + 1) % OUTFITS.length);
      return;
    }
    setPhase("out");
    timers.current.push(
      window.setTimeout(() => {
        setI((n) => (n + 1) % OUTFITS.length);
        setPhase("in");
      }, OUT_MS),
      window.setTimeout(() => setPhase("idle"), OUT_MS + IN_MS),
    );
  }

  const o = OUTFITS[i];
  const next = OUTFITS[(i + 1) % OUTFITS.length];

  return (
    <button
      type="button"
      className="cb"
      data-phase={phase}
      onClick={change}
      aria-label={`Change outfit (now: ${o.name}, next: ${next.name})`}
      title={`${o.name} · click for ${next.name}`}
      data-i18n-skip=""
    >
      <svg viewBox="0 0 18 14" shapeRendering="crispEdges" aria-hidden="true">
        <g className="cb-all">
          <g className="cb-body">{rects(BODY, 0, 7, (c) => c !== "K")}</g>
          <g className="cb-eyes">{rects(BODY, 0, 7, (c) => c === "K")}</g>
          <g className="cb-outfit" key={o.name}>
            <g className="cb-hat">{rects(o.hat)}</g>
            <g className="cb-left">{rects(o.left, 0, 7)}</g>
            <g className="cb-right">{rects(o.right, 14, 7)}</g>
          </g>
        </g>
        <g className="cb-cloud cb-cloud-s">{rects(CLOUD_SMALL, 0, 2)}</g>
        <g className="cb-cloud cb-cloud-b">{rects(CLOUD_BIG, 0, 1)}</g>
      </svg>
    </button>
  );
}
