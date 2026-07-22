import { renderMarkdown } from "@/lib/content";

export const metadata = { title: "Now · Elliot Little" };

export default function Now() {
  const html = renderMarkdown("now.md");
  return (
    <main>
      <div className="wrap">
        <h1>Now</h1>
        <p className="mono dim">
          Written by Elliot, by hand. An agent inherits this page soon: when it
          does, this byline changes and the commits will prove it.
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
