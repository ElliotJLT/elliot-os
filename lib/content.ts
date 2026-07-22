import { readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";

export function renderMarkdown(name: string): string {
  const raw = readFileSync(join(process.cwd(), "content", name), "utf-8");
  return marked.parse(raw, { async: false });
}

/** Bold item titles per `## section` of content/next.md, for the console. */
export function getRoadmap(): Record<string, string[]> {
  const raw = readFileSync(join(process.cwd(), "content", "next.md"), "utf-8");
  const sections: Record<string, string[]> = {};
  let current = "";
  for (const line of raw.split("\n")) {
    const h = line.match(/^##\s+(.+)/);
    if (h) {
      current = h[1].trim().toLowerCase();
      sections[current] = [];
      continue;
    }
    const item = line.match(/^-\s+\*\*(.+?)\*\*/);
    if (item && current) sections[current].push(item[1].replace(/\.$/, ""));
  }
  return sections;
}
