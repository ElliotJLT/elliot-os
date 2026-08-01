import { readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";

export function renderMarkdown(name: string): string {
  const raw = readFileSync(join(process.cwd(), "content", name), "utf-8");
  return marked.parse(raw, { async: false });
}

const BEGIN = "<!-- agent:begin -->";
const END = "<!-- agent:end -->";

/**
 * content/now.md has two authors. The agent owns the block between the
 * markers (rewritten weekly by scripts/agent-now.mjs); everything after it is
 * hand-written. The two render in different places — the agent's output under
 * its loop on /loops, the hand-written part on the home page — so they are
 * split here rather than duplicating the file.
 */
export function getAgentLog(): string {
  const raw = readFileSync(join(process.cwd(), "content", "now.md"), "utf-8");
  const start = raw.indexOf(BEGIN);
  const end = raw.indexOf(END);
  if (start === -1 || end === -1) return "";
  return marked.parse(raw.slice(start + BEGIN.length, end).trim(), {
    async: false,
  });
}

/** The hand-written half of content/now.md, below the agent's block. */
export function getByHand(): string {
  const raw = readFileSync(join(process.cwd(), "content", "now.md"), "utf-8");
  const end = raw.indexOf(END);
  const tail = end === -1 ? raw : raw.slice(end + END.length);
  // Drop the "## by hand" heading and its italic aside: both explain a split
  // that only made sense when the two halves shared a page.
  const body = tail
    .replace(/^\s*##\s+by hand\s*$/m, "")
    .replace(/^\s*\*The section above.*$/m, "")
    .trim();
  return marked.parse(body, { async: false });
}
