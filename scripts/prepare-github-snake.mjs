import fs from "node:fs";

const paths = [
  "public/github-snake.svg",
  "public/github-snake-dark.svg",
];
const reducedMotion =
  "@media(prefers-reduced-motion:reduce){.c,.s{animation-play-state:paused!important}}";

for (const path of paths) {
  const svg = fs.readFileSync(path, "utf8");
  if (!svg.includes(reducedMotion)) {
    fs.writeFileSync(path, svg.replace("<style>", `<style>${reducedMotion}`));
  }
}
