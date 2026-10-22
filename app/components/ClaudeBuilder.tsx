// A small pixel builder for the footer credit ("built with Claude"): an orange critter in a hard
// hat with a wrench and a screwdriver. Drawn here as an SVG grid (not the
// stock image it was modelled on), one rect per pixel run, so it stays crisp
// at any size. CSS gives it a two-step bob, alternating tool taps and an
// occasional blink.

const ROWS = [
  "......YYYYY.......",
  "....YYYYYYYYY.....",
  "...YYYYyYYYYYY....",
  "..yyyyyyyyyyyyy...",
  "M.M.OOOOOOOOO..S..",
  "MMM.OOKOOOKOO..S..",
  ".M..OOOOOOOOO..S..",
  ".M.OOOOWWWOOOOHHH.",
  ".MOOOOOOOOOOOO.H..",
  ".M..OOOOOOOOO..H..",
  "....O.O...O.O.....",
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

// Which animated layer each colour belongs to.
const LAYER = (c: string) =>
  c === "M" ? "cb-wrench" : c === "S" || c === "H" ? "cb-driver" : c === "K" ? "cb-eyes" : "cb-body";

function runs() {
  const out: { layer: string; x: number; y: number; w: number; fill: string }[] = [];
  ROWS.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === c) w++;
      out.push({ layer: LAYER(c), x, y, w, fill: FILL[c] });
      x += w;
    }
  });
  return out;
}

export default function ClaudeBuilder() {
  const r = runs();
  const layer = (name: string) =>
    r
      .filter((p) => p.layer === name)
      .map((p) => <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={p.w} height={1} fill={p.fill} />);
  return (
    <svg
      className="claude-builder"
      viewBox="0 -1 18 12"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <g className="cb-all">
        <g className="cb-body">{layer("cb-body")}</g>
        <g className="cb-eyes">{layer("cb-eyes")}</g>
        <g className="cb-wrench">{layer("cb-wrench")}</g>
        <g className="cb-driver">{layer("cb-driver")}</g>
      </g>
    </svg>
  );
}
