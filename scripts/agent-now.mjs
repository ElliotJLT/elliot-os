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
import { costOf } from "./lib/pricing.mjs";
import { classify, commitsUrl, isNoise, shape, renderLog } from "./lib/shipping.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GITHUB_USER = "ElliotJLT";
const WINDOW_DAYS = 7;

// Model for the optional summary. Haiku: cheapest fit for a one-paragraph
// weekly rewrite. Rates live in data/pricing.json with the date they were
// checked, rather than as a constant here that goes stale silently.
const MODEL = "claude-haiku-4-5";

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
// follow-up /commits call per repo fetches the actual commits. That call is
// always scoped to one author: on a repo Elliot does not own it otherwise
// returns every contributor's work, and publishing a stranger's commits as
// his would be worse than the blindness this replaced.
async function digest(events) {
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 3600 * 1000);
  const { repos, prs } = classify(events, GITHUB_USER, cutoff.getTime());

  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  for (const entry of repos.values()) {
    if (!entry.pushed) continue;
    const res = await fetch(
      commitsUrl(entry.fullName, GITHUB_USER, cutoff.toISOString()),
      { headers },
    );
    if (!res.ok) continue;
    for (const c of await res.json()) {
      const message = c.commit.message.split("\n")[0];
      if (isNoise(message)) continue;
      entry.commits.push({ sha: c.sha.slice(0, 7), message });
    }
  }

  // The public feed's pull_request payload carries a number and an API url but
  // no title, so a readable line needs one extra call per pull request.
  for (const p of prs) {
    if (!p.url) continue;
    const res = await fetch(p.url, { headers });
    if (!res.ok) continue;
    const full = await res.json();
    p.title = full.title;
    if (full.merged === true) p.merged = true;
  }

  return shape({ repos, prs });
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

// Only inference goes on the inference ledger. Appending a zero row on every
// deterministic run gave the ledger 26 identical entries of nothing and made
// the footer's run counter a count of cron firings rather than of model calls.
function recordSpend(usage, today) {
  const path = join(ROOT, "data", "spend.json");
  const spend = JSON.parse(readFileSync(path, "utf-8"));
  if (!usage) return { date: today, model: null, input_tokens: 0, output_tokens: 0, cost_usd: 0 };
  const run = {
    date: today,
    model: MODEL,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    cost_usd: costOf(MODEL, usage),
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
//
// This is only reached when the digest actually changed, so `runs` counts runs
// that had something new to say. The schedule fires daily either way; a run
// that finds nothing exits before here and leaves no trace, which is the
// honest record of a quiet day.
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

// An empty week used to overwrite the log with "0 commits across 0 repos"
// and an excuse: the freshest line on a site whose whole claim is "I ship".
// A dated log of the last real week is honest; a fresh-stamped zero is
// anti-evidence. So on a quiet week the previous log stands and the run
// leaves no trace, which is the same exit the substance check below takes.
// renderLog still knows how to say "quiet week" (evals pin that); this is
// the one caller, and it chooses not to publish it over real work.
const hasActivity =
  d.own.length > 0 || d.external.length > 0 || d.externalPrs.length > 0;
if (!hasActivity) {
  console.log("No public activity this window; previous shipping log kept. Nothing committed.");
  process.exit(0);
}

const log = renderLog(d, today, WINDOW_DAYS, GITHUB_USER);
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

// The header line carries today's date, so the section differs every single
// day even when nothing shipped. That is why this loop committed 26 days
// running, twice publishing "0 commits across 0 repos" and still opening a
// commit called "refresh shipping log". Compare everything below the header:
// if the substance is identical, write nothing and let the workflow's
// `git diff --quiet` end the run without a commit.
const substance = (text) => text.split("\n").slice(2).join("\n").trim();
const current = now.slice(start, end + END.length);
if (substance(section) === substance(current)) {
  console.log(
    `No change: ${d.commitCount} commits digested, same as the last published log. ` +
      `Nothing committed.`,
  );
  process.exit(0);
}

writeFileSync(nowPath, now.slice(0, start) + section + now.slice(end + END.length));
const run = recordSpend(usage, today);
recordLoopRun("now-refresh", today, run);
console.log(
  `now.md rewritten. ${d.commitCount} commits digested. ` +
    (usage
      ? `LLM summary: ${run.input_tokens} in / ${run.output_tokens} out tokens, $${run.cost_usd}`
      : "No ANTHROPIC_API_KEY: deterministic log only, $0."),
);
