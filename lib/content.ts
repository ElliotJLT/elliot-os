import { readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";

export function renderMarkdown(name: string): string {
  const raw = readFileSync(join(process.cwd(), "content", name), "utf-8");
  return marked.parse(raw, { async: false });
}
