// The improvement loop — the site's OUTER loop.
//
// Inner loops (like scripts/agent-now.mjs) keep one surface fresh. This one
// steps back and asks a different question every week: given what Elliot
// actually shipped and wrote, and what employers hiring hands-on AI product
// leaders care about right now, what is the single most useful change to this
// site? It never invents activity — it reads real sources and proposes ONE
// improvement as a pull request for a human to approve or reject.
//
// Sources (all public, $0):
//   - GitHub repos + recent events   (what he built)
//   - Medium feed                    (what he wrote)
//   - the site's own current state   (what's already surfaced)
//
// Without ANTHROPIC_API_KEY it still runs: it does the deterministic scan and
// proposes the top gap it finds (e.g. "new repo not featured", "new post not
// linked"), at $0. With the key, Claude reasons over the same material for the
// sharpest positioning change and records the real token cost. Either way the
// output is a proposal record in data/loops.json and a brief the workflow
// turns into a PR. It does not touch site content directly.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const USER = "ElliotJLT";
const MEDIUM = "https://medium.com/@elliotJL/feed";
const LOOP_ID = "self-improve";

const MODEL = "claude-haiku-4-5";
const PRICE_PER_MTOK = { input: 1.0, output: 5.0 };

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
    return repos
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        stars: r.stargazers_count,
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
function siteState() {
  const built = safeSync(() => readFileSync(join(ROOT, "app/built/page.tsx"), "utf-8"), "");
  const featured = [...built.matchAll(/"([\w-]+)":\s*{/g)].map((m) => m[1]);
  const corpus = [
    "app/built/page.tsx",
    "content/now.md",
    "public/llms.txt",
  ]
    .map((p) => safeSync(() => readFileSync(join(ROOT, p), "utf-8"), ""))
    .join("\n");
  return { featured, corpus };
}

// ---- deterministic scan --------------------------------------------------

const RECENT_DAYS = 30;

function scan({ repos, posts, state }) {
  const findings = [];
  const cutoff = Date.now() - RECENT_DAYS * 86400000;

  // Repos with real recent activity that aren't featured or even mentioned.
  for (const r of repos) {
    const active = new Date(r.pushed_at).getTime() > cutoff;
    const mentioned = state.corpus.includes(r.name);
    if (active && !state.featured.includes(r.name) && r.description) {
      findings.push({
        source: "github",
        weight: (r.stars || 0) + (mentioned ? 0 : 3),
        title: `Surface recent work: ${r.name}`,
        detail:
          `${r.name} was pushed in the last ${RECENT_DAYS} days` +
          `${r.stars ? ` (★${r.stars})` : ""} but ${mentioned ? "isn't featured" : "isn't on the site"}. ` +
          `"${r.description}" — worth a /built blurb if it's employer-relevant.`,
      });
    }
  }

  // Writing the site doesn't link yet.
  for (const p of posts) {
    if (p.link && !state.corpus.includes(p.link)) {
      findings.push({
        source: "medium",
        weight: 4,
        title: `Link new writing: ${p.title}`,
        detail: `Post "${p.title}" (${p.date}) isn't linked anywhere on the site. ${p.link}`,
      });
    }
  }

  findings.sort((a, b) => b.weight - a.weight);
  return findings;
}

// ---- optional LLM positioning pass ---------------------------------------

async function positioning(findings, state) {
  if (!process.env.ANTHROPIC_API_KEY) return { proposal: null, usage: null };
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const context =
    `Deterministic scan findings (real, current):\n` +
    (findings.length
      ? findings.slice(0, 6).map((f) => `- [${f.source}] ${f.title}: ${f.detail}`).join("\n")
      : "- none: no new repos or posts to surface this cycle.") +
    `\n\nThe site's current positioning (llms.txt + pages), truncated:\n` +
    state.corpus.slice(0, 4000);

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system:
      "You are the outer-loop agent for Elliot Little's personal site. Elliot is a " +
      "hands-on product leader interviewing for senior product / AI roles. Your job: propose " +
      "the SINGLE most useful change for an employer hiring someone who can own an unclear " +
      "problem, build close to the code, and improve how the team ships, grounded ONLY in " +
      "the real material provided. " +
      "Never invent activity or claims. Prefer surfacing real recent work and sharpening " +
      "framing over cosmetic changes. If nothing is worth doing this cycle, say so plainly. " +
      "British English, no marketing adjectives, no em-dashes. Reply as JSON: " +
      '{"worth_doing": bool, "title": string, "rationale": string, "files": string[], "change": string}.',
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
// A proposal is not trusted just because a model wrote it. Before it ships,
// it clears a rubric: grounded in a real source, a single change, not merely
// cosmetic, and employer-relevant. Deterministic checks always run; with a
// key an LLM judge scores it too. Below threshold, the loop holds — a
// deliberate non-proposal is a valid, and often correct, outcome.

const EVAL_THRESHOLD = 0.6;

function deterministicEval(candidate, { repos, posts }) {
  const hay = `${candidate.title} ${candidate.rationale} ${candidate.change || ""}`;
  const grounded =
    posts.some((p) => p.link && hay.includes(p.link)) ||
    repos.some((r) => hay.includes(r.name));
  const cosmetic = /\b(colour|color|font|spacing|margin|padding|css|pixel)\b/i.test(
    candidate.title,
  );
  const substantive = (candidate.rationale || "").length > 40;
  const checks = [
    { name: "grounded in a real source", pass: grounded },
    { name: "not cosmetic-only", pass: !cosmetic },
    { name: "has a substantive rationale", pass: substantive },
  ];
  const score = checks.filter((c) => c.pass).length / checks.length;
  return { checks, score, source: "deterministic" };
}

async function judge(candidate, context) {
  if (!process.env.ANTHROPIC_API_KEY) return { llm: null, usage: null };
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 300,
    system:
      "You are the evaluator in a generate-then-evaluate loop for Elliot Little's " +
      "hiring site. Score a proposed site change against this rubric, each 0-1: " +
      "grounded (uses only real material, invents nothing), leverage (moves the " +
      "needle for employers hiring a hands-on AI product leader), specificity (concrete, " +
      "actionable). Be strict; a personal site does not need busywork. Reply as JSON: " +
      '{"grounded":n,"leverage":n,"specificity":n,"verdict":"pass|revise|reject","critique":string}.',
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
  const cost = +(
    (usage.input_tokens / 1e6) * PRICE_PER_MTOK.input +
    (usage.output_tokens / 1e6) * PRICE_PER_MTOK.output
  ).toFixed(6);
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

function recordProposal(proposal, today, cost) {
  const path = join(ROOT, "data", "loops.json");
  const data = JSON.parse(readFileSync(path, "utf-8"));
  const loop = data.loops.find((l) => l.id === LOOP_ID);
  loop.last_run = today;
  loop.runs = (loop.runs || 0) + 1;
  loop.spend_usd = +((loop.spend_usd || 0) + cost).toFixed(6);
  loop.status = "running";
  loop.proposals = loop.proposals || [];
  if (proposal) {
    loop.proposals.unshift({ date: today, status: "proposed", ...proposal });
    loop.proposals = loop.proposals.slice(0, 12);
  }
  data.updated = today;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
}

// ---- run -----------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
const [repos, posts] = [await getRepos(), await getPosts()];
const state = siteState();
const findings = scan({ repos, posts, state });

const { proposal: llm, usage } = await positioning(findings, state);
let totalUsage = usage;

// Build a candidate from the strongest available signal.
let candidate = null;
if (llm && llm.worth_doing !== false) {
  candidate = {
    source: "positioning",
    title: llm.title,
    rationale: llm.rationale,
    files: llm.files || [],
    change: llm.change || "",
  };
} else if (!llm && findings.length) {
  const top = findings[0];
  candidate = {
    source: top.source,
    title: top.title,
    rationale: top.detail,
    files: [],
    change: "Review and, if employer-relevant, surface this on the site.",
  };
}

// The eval gate: score the candidate before it ships. Below threshold, hold.
let proposal = null;
let evalRecord = null;
if (candidate) {
  const det = deterministicEval(candidate, { repos, posts });
  const { llm: llmEval, usage: judgeUsage } = await judge(candidate, state.corpus);
  if (judgeUsage)
    totalUsage = {
      input_tokens: (totalUsage?.input_tokens || 0) + judgeUsage.input_tokens,
      output_tokens: (totalUsage?.output_tokens || 0) + judgeUsage.output_tokens,
    };
  const score = llmEval ? llmEval.score : det.score;
  const verdict = llmEval ? llmEval.verdict : det.score >= EVAL_THRESHOLD ? "pass" : "reject";
  evalRecord = {
    score,
    verdict,
    checks: det.checks,
    critique: llmEval?.critique || null,
    by: llmEval ? "llm-judge + deterministic" : "deterministic",
  };
  if (verdict !== "reject" && score >= EVAL_THRESHOLD) {
    proposal = { ...candidate, eval: evalRecord };
  }
}

const cost = recordSpend(totalUsage, today);
recordProposal(proposal, today, cost);

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
  if (candidate && evalRecord) {
    console.log(
      `Candidate held by the eval gate: "${candidate.title}" scored ` +
        `${evalRecord.score} (${evalRecord.verdict}). ${evalRecord.critique || ""} ` +
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
