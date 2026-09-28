import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * A figure slot. Drop `public/loops/<name>.png` (or .jpg/.webp) in and it renders.
 * Until then: in `npm run dev` it shows a dashed placeholder with its brief; in a
 * production build it renders nothing, so the live site never shows an empty box.
 * Briefs for each slot live in docs/loops-figures.md.
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
  if (process.env.NODE_ENV === "production") return null;
  return (
    <figure className="loop-fig loop-fig-slot rv-settle">
      <span>figure slot · public/loops/{name}.png</span>
      <p>{alt}</p>
      <em>brief: docs/loops-figures.md#{name}</em>
    </figure>
  );
}
