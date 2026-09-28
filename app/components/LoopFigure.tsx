import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * A figure slot. Drop `public/loops/<name>.png` (or .jpg/.webp/.svg) in and it
 * renders; until then it renders nothing, in dev as well, because a placeholder
 * box reads as a broken page. Briefs for each slot live in docs/loops-figures.md.
 */
export default function LoopFigure({ name, alt, caption }: { name: string; alt: string; caption?: string }) {
  const ext = ["png", "jpg", "webp", "svg"].find((e) => existsSync(join(process.cwd(), "public", "loops", `${name}.${e}`)));
  if (ext) {
    return (
      <figure className="loop-fig rv-settle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${process.env.BASE_PATH ?? ""}/loops/${name}.${ext}`} alt={alt} />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    );
  }
  return null;
}
