// The positioning review.
//
// Given what Elliot actually shipped and wrote, and what employers hiring
// hands-on AI product leaders care about, what is the single most useful change
// to this site? It never invents activity — it reads real sources and proposes
// ONE improvement as a recommendation for a human to implement, edit or reject.
//
// Sources (all public, $0):
//   - GitHub repos + recent events   (what he built)
//   - Medium feed                    (what he wrote)
//   - the site's own current state   (what's already surfaced)
//
// It is a loop rather than a cron job because the outcome of the last cycle is
// an input to the next one: recordProposal writes Elliot's decision back to
// data/loops.json, and renderHistory feeds those decisions into the prompt, so
// a line of reasoning he rejected is not offered again unchanged.
//
// Its decision logic lives in scripts/lib/positioning.mjs, which is also what
// scripts/eval-agents.mjs runs the golden set against. One copy, so the
// published pass rate is evidence about this agent rather than about a
// reimplementation of it.
//
// Without ANTHROPIC_API_KEY it still runs: it does the deterministic scan and
// proposes the top gap it finds, at $0. With the key, Claude reasons over the
// same material for the sharpest positioning change and records the real token
// cost. Either way the output is a proposal record in data/loops.json and a
// brief the workflow turns into a PR. It does not touch site content directly.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  scan,
  buildCandidate,
  gate,
  EVAL_THRESHOLD,
  IMPL_VERSION,
} from "./lib/positioning.mjs";
import { POSITIONING, JUDGE, renderHistory } from "./lib/prompts.mjs";
import { costOf } from "./lib/pricing.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const USER = "ElliotJLT";
const MEDIUM = "https://medium.com/@elliotJL/feed";
const LOOP_ID = "self-improve";
const MODEL = "claude-haiku-4-5";

const ghHeaders = () => {
  const h = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
};

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function safeSync(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

// ---- sources -------------------------------------------------------------

async function getRepos() {
  return safe(async () => {
    const res = await fetch(
      `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
      { headers: ghHeaders() },
    );
    if (!res.ok) throw new Error(String(res.status));
    const repos = await res.json();
    // fork/archived are passed through rather than filtered here: scan() owns
    // that rule now, so the eval suite can hold it to account.
    return repos.map((r) => ({
      name: r.name,
      stars: r.stargazers_count,
      fork: r.fork,
      archived: r.archived,
      pushed_at: r.pushed_at,
      description: r.description,
    }));
  }, []);
}

async function getPosts() {
  return safe(async () => {
    const res = await fetch(MEDIUM);
    if (!res.ok) throw new Error(String(res.status));
    const xml = await res.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8);
    const pick = (block, tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      if (!m) return "";
      return m[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
    };
    return items.map((m) => ({
      title: pick(m[1], "title"),
      link: (pick(m[1], "link") || "").split("?")[0],
      date: pick(m[1], "pubDate").slice(0, 16),
    }));
  }, []);
}

// What the site already surfaces, read straight from source.
//
// lib/writing.ts and app/writing/ are in here because /writing renders the
// Medium feed at build time. Leaving them out was a real defect: the scanner
// could not see the page that surfaces every post, so its one working rule
// would have proposed "link this post" for posts already on the site, forever.
function siteState() {
  const built = safeSync(() => readFileSync(join(ROOT, "app/built/page.tsx"), "utf-8"), "");
  const featured = [...built.matchAll(/"([\w-]+)":\s*{/g)].map((m) => m[1]);
  const writing = safeSync(() => readFileSync(join(ROOT, "lib/writing.ts"), "utf-8"), "");
  // Posts with a curated note, as opposed to ones the live feed merely lists.
  const annotated = [...writing.matchAll(/https:\/\/medium\.com\/[^\s"']+/g)].map((m) =>
    m[0].split("?")[0],
  );
  const corpus = [
    "app/built/page.tsx",
    "app/writing/page.tsx",
    "lib/writing.ts",
    "content/now.md",
    "public/llms.txt",
  ]
    .map((p) => safeSync(() => readFileSync(join(ROOT, p), "utf-8"), ""))
    .join("\n");
  return { featured, annotated, corpus };
}

/** Past decisions, newest first — the loop's memory. */
function pastDecisions() {
  return safeSync(() => {
    const data = JSON.parse(readFileSync(join(ROOT, "data", "loops.json"), "utf-8"));
    return data.decisions || [];
  }, []);
}

// ---- optional LLM positioning pass ---------------------------------------

async function positioning(findings, state, history) {
  if (!process.env.ANTHROPIC_API_KEY) return { proposal: null, usage: null };
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const context =
    `Deterministic scan findings (real, current):\n` +
    (findings.length
      ? findings.slice(0, 6).map((f) => `- [${f.source}] ${f.title}: ${f.detail}`).join("\n")
      : "- none: no new repos or posts to surface this cycle.") +
    `\n\nWhat happened to your previous proposals:\n${renderHistory(history)}` +
    `\n\nThe site's current positioning (llms.txt + pages), truncated:\n` +
    state.corpus.slice(0, 4000);

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: POSITIONING.system,
    messages: [{ role: "user", content: context }],
  });
  const text = msg.content.find((b) => b.type === "text")?.text?.trim() || "";
  let proposal = null;
  try {
    proposal = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
  } catch {
    proposal = { worth_doing: true, title: "Positioning note", rationale: text, files: [], change: text };
  }
  return { proposal, usage: msg.usage };
}

// ---- eval gate -----------------------------------------------------------
//
// A proposal is not trusted just because a model wrote it. Before it ships it
// clears the rubric in scripts/lib/positioning.mjs: grounded in a real source,
// not merely cosmetic, and a rationale a human can decide against. Every check
// is required. With a key an LLM judge scores it as a second opinion, and
// either the judge or the deterministic gate can reject. Below the bar the loop
// holds — a deliberate non-proposal is a valid, and often correct, outcome.

async function judge(candidate, context) {
  if (!process.env.ANTHROPIC_API_KEY) return { llm: null, usage: null };
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: JUDGE.system,
    messages: [
      {
        role: "user",
        content: `Proposal:\n${JSON.stringify(candidate, null, 2)}\n\nReal material it should be grounded in:\n${context.slice(0, 2000)}`,
      },
    ],
  });
  const text = msg.content.find((b) => b.type === "text")?.text?.trim() || "";
  let llm = null;
  try {
    const j = JSON.parse(text.replace(/^```json\s*|\s*```$/g, ""));
    const score = (j.grounded + j.leverage + j.specificity) / 3;
    llm = { ...j, score: +score.toFixed(2) };
  } catch {
    llm = null;
  }
  return { llm, usage: msg.usage };
}

// ---- record --------------------------------------------------------------

function recordSpend(usage, today) {
  if (!usage) return 0;
  const path = join(ROOT, "data", "spend.json");
  const spend = JSON.parse(readFileSync(path, "utf-8"));
  const cost = costOf(MODEL, usage);
  spend.runs.push({
    date: today,
    model: MODEL,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    cost_usd: cost,
  });
  spend.totals = {
    runs: spend.runs.length,
    input_tokens: spend.runs.reduce((s, r) => s + r.input_tokens, 0),
    output_tokens: spend.runs.reduce((s, r) => s + r.output_tokens, 0),
    cost_usd: +spend.runs.reduce((s, r) => s + r.cost_usd, 0).toFixed(6),
  };
  writeFileSync(path, JSON.stringify(spend, null, 2) + "\n");
  return cost;
}

// Held candidates are recorded too. A gate whose rejections are invisible is
// indistinguishable from a gate that never fires, which is what the old one
// was: the rejected count on /loops is the number that makes the accepted one
// worth anything.
function recordProposal(proposal, held, today, cost) {
  const path = join(ROOT, "data", "loops.json");
  const data = JSON.parse(readFileSync(path, "utf-8"));
  const loop = data.loops.find((l) => l.id === LOOP_ID);
  // Re-running on a day already counted is a retry, not a second cycle — the
  // same guard the digest has. Without it a manual re-run inflated the run
  // count and pushed a duplicate of the same proposal onto the record.
  const sameDay = loop.last_run === today;
  loop.last_run = today;
  if (!sameDay) loop.runs = (loop.runs || 0) + 1;
  loop.spend_usd = +((loop.spend_usd || 0) + cost).toFixed(6);
  // A manual run does not make an unscheduled system "running". It returns
  // to dormant after recording the result.
  loop.status = "dormant";
  loop.proposals = loop.proposals || [];
  const stamp = { impl_version: IMPL_VERSION, prompt_version: POSITIONING.version };
  const record = proposal
    ? { date: today, status: "proposed", ...stamp, ...proposal }
    : held
      ? { date: today, status: "held", ...stamp, ...held }
      : null;
  if (record) {
    // A retry replaces the day's record rather than stacking a second copy.
    if (sameDay && loop.proposals[0]?.date === today) loop.proposals.shift();
    loop.proposals.unshift(record);
  }
  loop.proposals = loop.proposals.slice(0, 12);
  data.updated = today;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

// ---- run -----------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
const [repos, posts] = [await getRepos(), await getPosts()];
const state = siteState();
const history = pastDecisions();
const findings = scan({ repos, posts, state });

const { proposal: llm, usage } = await positioning(findings, state, history);
let totalUsage = usage;

const candidate = buildCandidate(findings, llm);

// The gate: score the candidate before it ships. Below the bar, hold.
let proposal = null;
let held = null;
let evalRecord = null;
if (candidate) {
  const det = gate(candidate, { repos, posts });
  const { llm: llmEval, usage: judgeUsage } = await judge(candidate, state.corpus);
  if (judgeUsage)
    totalUsage = {
      input_tokens: (totalUsage?.input_tokens || 0) + judgeUsage.input_tokens,
      output_tokens: (totalUsage?.output_tokens || 0) + judgeUsage.output_tokens,
    };
  // Either reviewer can reject. The judge cannot rescue a candidate the
  // deterministic gate refused, and vice versa.
  const verdict =
    det.verdict === "reject" || llmEval?.verdict === "reject" || (llmEval && llmEval.score < EVAL_THRESHOLD)
      ? "reject"
      : "pass";
  evalRecord = {
    score: llmEval ? llmEval.score : det.score,
    verdict,
    checks: det.checks,
    critique: llmEval?.critique || null,
    by: llmEval ? "llm-judge + deterministic" : "deterministic",
  };
  if (verdict === "pass") proposal = { ...candidate, eval: evalRecord };
  else held = { ...candidate, eval: evalRecord };
}

const cost = recordSpend(totalUsage, today);
recordProposal(proposal, held, today, cost);

if (proposal) {
  const slug = proposal.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48);
  console.log(`PROPOSAL_SLUG=${slug}`);
  console.log(`PROPOSAL_TITLE=${proposal.title}`);
  console.log("\n--- proposal ---\n");
  console.log(`# ${proposal.title}\n`);
  console.log(`_source: ${proposal.source} · ${today}${cost ? ` · $${cost}` : " · $0"}_\n`);
  console.log(proposal.rationale);
  if (proposal.change) console.log(`\n**Suggested change:** ${proposal.change}`);
  if (proposal.files?.length) console.log(`\n**Files:** ${proposal.files.join(", ")}`);
} else {
  console.log("NO_PROPOSAL");
  if (held) {
    const failed = held.eval.checks.filter((c) => !c.pass).map((c) => c.name);
    console.log(
      `Candidate held by the gate: "${held.title}" — ${failed.length ? `failed: ${failed.join(", ")}` : held.eval.critique || "judge rejected"}. ` +
        `A held proposal is the gate working, not a failure.`,
    );
  } else {
    console.log(
      `Nothing worth proposing this cycle: ${findings.length} scan findings, ` +
        `positioning pass ${usage ? "ran" : "skipped (no key)"}. ` +
        `A clean pass is a valid outcome — the loop's stopping rule at work.`,
    );
  }
}
