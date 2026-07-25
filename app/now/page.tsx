import { renderMarkdown } from "@/lib/content";

export const metadata = { title: "Now · Elliot Little" };

export default function Now() {
  const html = renderMarkdown("now.md");
  return (
    <main>
      <div className="wrap">
        <h1>Now</h1>
        <p className="mono faint">
          Two authors on this page. The shipping log is written by a scheduled
          agent from the public GitHub events API and committed under its own
          name. The section below it is written by me, for the things git
          can&apos;t see. The log is a snapshot from the agent&apos;s last run,
          so its commit count trails the live figure on the home page.
        </p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  );
}
