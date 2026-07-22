import { renderMarkdown } from "@/lib/content";

export const metadata = { title: "Next · Elliot Little" };

export default function NextPage() {
  const html = renderMarkdown("next.md");
  return (
    <main>
      <div className="wrap">
        <h1>Next</h1>
        <p className="mono dim">
          The public roadmap. Items move from exploring to building to
          shipped, in the open. This is the one page agents never write:
          intent stays human.
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
