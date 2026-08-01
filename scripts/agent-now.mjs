// Rewrites the agent-owned section of content/now.md from real public GitHub
// activity, and logs its own inference spend to data/spend.json.
//
// Runs in CI on a schedule (see .github/workflows/agent.yml) and commits as
// "elliot-os agent" so the changelog distinguishes agent edits from human ones.
//
// Without ANTHROPIC_API_KEY the shipping log is still generated — purely
// derived from the GitHub events API, no inference, $0. With the key set, a
// Claude call adds a one-paragraph summary on top and the real token cost is
// recorded.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GITHUB_USER = "ElliotJLT";
const WINDOW_DAYS = 7;

// Model for the optional summary. Haiku: cheapest fit for a one-paragraph
// weekly rewrite. Pricing cached 2026-05 from Anthropic docs — verify if the
// numbers on the site start mattering.
const MODEL = "claude-haiku-4-5";
const PRICE_PER_MTOK = { input: 1.0, output: 5.0 };

const BEGIN = "<!-- agent:begin -->";
const END = "<!-- agent:end -->";

async function fetchEvents() {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`,
    { headers },
  );
  if (!res.ok) throw new Error(`GitHub events API: ${res.status}`);
  return res.json();
}

// The events API no longer includes commit details in PushEvent payloads
// (only head/before shas), so pushes tell us which repos moved and a
// follow-up /commits?since= call per repo fetches the actual commits.
async function digest(events) {
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 3600 * 1000);
  const recent = events.filter((e) => new Date(e.created_at) > cutoff);
  const byRepo = new Map();

  for (const e of recent) {
    const repo = e.repo.name.replace(`${GITHUB_USER}/`, "");
    const entry = byRepo.get(repo) || { pushed: false };
    if (e.type === "PushEvent") entry.pushed = true;
    if (e.type === "CreateEvent" && e.payload.ref_type === "repository")
      entry.created = true;
    if (e.type === "ReleaseEvent") entry.release = e.payload.release?.tag_name;
    if (e.type === "PublicEvent") entry.madePublic = true;
    byRepo.set(repo, entry);
  }

  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  let commitCount = 0;
  for (const [repo, entry] of byRepo) {
    entry.commits = [];
    if (!entry.pushed) continue;
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?since=${cutoff.toISOString()}&per_page=30`,
      { headers },
    );
    if (!res.ok) continue;
    for (const c of await res.json()) {
      const message = c.commit.message.split("\n")[0];
      // Skip the agent's own commits so it doesn't report on itself
      if (message.startsWith("agent:")) continue;
      entry.commits.push({ sha: c.sha.slice(0, 7), message });
      commitCount++;
    }
  }
  return { byRepo, commitCount };
}

function renderLog({ byRepo, commitCount }, today) {
  const sorted = [...byRepo.entries()]
    .filter(([, info]) => info.commits.length > 0 || info.created || info.release)
    .sort((a, b) => b[1].commits.length - a[1].commits.length);
  const lines = [];
  lines.push(
    `*Shipping log for the ${WINDOW_DAYS} days to ${today}, derived from the ` +
      `[public GitHub events API](https://api.github.com/users/${GITHUB_USER}/events/public). ` +
      `${commitCount} commits across ${sorted.length} repos.*`,
  );
  lines.push("");
  for (const [repo, info] of sorted) {
    const bits = [];
    if (info.created) bits.push("new repo");
    if (info.madePublic) bits.push("made public");
    if (info.release) bits.push(`release ${info.release}`);
    const shown = info.commits.slice(0, 3);
    const cite = shown.map((c) => `"${c.message}" (${c.sha})`).join(", ");
    const extra =
      info.commits.length > 3 ? ` and ${info.commits.length - 3} more` : "";
    const detail = [bits.join(", "), cite].filter(Boolean).join(". ");
    const n = info.commits.length;
    lines.push(
      `- **[${repo}](https://github.com/${GITHUB_USER}/${repo})**: ${n} commit${n === 1 ? "" : "s"}. ${detail}${extra}`,
    );
  }
  if (sorted.length === 0) {
    lines.push("- Quiet week on public GitHub. The private repos tell a different story.");
  }
  return lines.join("\n");
}

async function summarise(logMarkdown) {
  if (!process.env.ANTHROPIC_API_KEY) return { text: null, usage: null };
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system:
      "You write a one-paragraph weekly summary for the /now page of Elliot Little's personal site, " +
      "from a factual shipping log. Rules: British English. Plain sentences, no em-dashes, " +
      "no marketing adjectives, no 'delve/leverage/seamless/journey', no 'It's not X, it's Y' constructions. " +
      "State only facts present in the log. Never invent activity. 3 sentences maximum. " +
      "Write in first person as Elliot's agent, e.g. 'This week he shipped...'.",
    messages: [{ role: "user", content: logMarkdown }],
  });
  const text = msg.content.find((b) => b.type === "text")?.text?.trim() || null;
  return { text, usage: msg.usage };
}

function recordSpend(usage, today) {
  const path = join(ROOT, "data", "spend.json");
  const spend = JSON.parse(readFileSync(path, "utf-8"));
  const run = {
    date: today,
    model: usage ? MODEL : null,
    input_tokens: usage?.input_tokens ?? 0,
    output_tokens: usage?.output_tokens ?? 0,
    cost_usd: usage
      ? +(
          (usage.input_tokens / 1e6) * PRICE_PER_MTOK.input +
          (usage.output_tokens / 1e6) * PRICE_PER_MTOK.output
        ).toFixed(6)
      : 0,
  };
  spend.runs.push(run);
  spend.totals = {
    runs: spend.runs.length,
    input_tokens: spend.runs.reduce((s, r) => s + r.input_tokens, 0),
    output_tokens: spend.runs.reduce((s, r) => s + r.output_tokens, 0),
    cost_usd: +spend.runs.reduce((s, r) => s + r.cost_usd, 0).toFixed(6),
  };
  writeFileSync(path, JSON.stringify(spend, null, 2) + "\n");
  return run;
}

// The inner loop was logging its spend but never its own run, so /loops —
// the page whose whole claim is "measured, not estimated" — reported one run
// and a stale last_run while spend.json recorded three. The control panel has
// to be right about the thing it controls.
function recordLoopRun(id, today, run) {
  const path = join(ROOT, "data", "loops.json");
  const loops = JSON.parse(readFileSync(path, "utf-8"));
  const loop = loops.loops.find((l) => l.id === id);
  if (!loop) throw new Error(`loop "${id}" missing from loops.json`);

  // Re-running on a day already counted is a retry, not a second run.
  if (loop.last_run !== today) loop.runs += 1;
  loop.last_run = today;
  loop.spend_usd = +(loop.spend_usd + run.cost_usd).toFixed(6);
  loops.updated = today;

  writeFileSync(path, JSON.stringify(loops, null, 2) + "\n");
}

const today = new Date().toISOString().slice(0, 10);
const events = await fetchEvents();
const d = await digest(events);
const log = renderLog(d, today);
const { text: summary, usage } = await summarise(log);

const nowPath = join(ROOT, "content", "now.md");
const now = readFileSync(nowPath, "utf-8");
const start = now.indexOf(BEGIN);
const end = now.indexOf(END);
if (start === -1 || end === -1) throw new Error("agent markers missing in now.md");

const section = [
  BEGIN,
  summary ? summary + "\n" : "",
  log,
  END,
].filter(Boolean).join("\n");

writeFileSync(nowPath, now.slice(0, start) + section + now.slice(end + END.length));
const run = recordSpend(usage, today);
recordLoopRun("now-refresh", today, run);
console.log(
  `now.md rewritten. ${d.commitCount} commits digested. ` +
    (usage
      ? `LLM summary: ${run.input_tokens} in / ${run.output_tokens} out tokens, $${run.cost_usd}`
      : "No ANTHROPIC_API_KEY: deterministic log only, $0."),
);
