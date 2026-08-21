// The golden set for both agents.
//
//   node scripts/eval-agents.mjs           print the results
//   node scripts/eval-agents.mjs --record  print, then append to data/evals.json
//   node scripts/eval-agents.mjs --check   exit 1 if this run is worse than
//                                          the best already recorded
//
// It imports the same scan / buildCandidate / gate the positioning review uses
// and the same classify / shape / renderLog the shipping digest uses, so a pass
// here is evidence about the running systems rather than about copies of them.
// $0: no model is called. The LLM judge is a second opinion in production, but
// the suite has to be runnable on every commit, which means deterministic.

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { scan, buildCandidate, gate, IMPL_VERSION } from "./lib/positioning.mjs";
import { IMPL_VERSION as SHIPPING_VERSION } from "./lib/shipping.mjs";
import { POSITIONING } from "./lib/prompts.mjs";
import { SCAN_CASES, GATE_CASES, NOW } from "../evals/cases.mjs";
import { DIGEST_CASES } from "../evals/shipping-cases.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function runScanCase(c) {
  const findings = scan({ repos: c.repos, posts: c.posts, state: c.state }, NOW);
  const want = c.expect;

  if (findings.length !== want.findings)
    return { pass: false, note: `expected ${want.findings} finding(s), got ${findings.length}` };
  if (want.source && findings[0]?.source !== want.source)
    return { pass: false, note: `expected source "${want.source}", got "${findings[0]?.source}"` };
  if (want.mentions && !JSON.stringify(findings[0]).includes(want.mentions))
    return { pass: false, note: `finding does not mention "${want.mentions}"` };
  return { pass: true, note: "" };
}

function runGateCase(c) {
  const candidate = buildCandidate([], {
    worth_doing: true,
    title: c.candidate.title,
    rationale: c.candidate.rationale,
    change: c.candidate.change,
    files: [],
  });
  const result = gate(candidate, { repos: c.repos, posts: c.posts });

  if (result.verdict !== c.expect.verdict) {
    const failed = result.checks.filter((k) => !k.pass).map((k) => k.name);
    return {
      pass: false,
      note:
        `gate said "${result.verdict}" (score ${result.score.toFixed(2)}), expected "${c.expect.verdict}"` +
        (failed.length ? ` — failing checks: ${failed.join(", ")}` : " — every check passed"),
    };
  }
  return { pass: true, note: "" };
}

function runAssertionCase(c) {
  try {
    return c.assert();
  } catch (err) {
    return { pass: false, note: `threw: ${err.message}` };
  }
}

const results = [
  ...SCAN_CASES.map((c) => ({ id: c.id, kind: c.kind, ...runScanCase(c) })),
  ...GATE_CASES.map((c) => ({ id: c.id, kind: c.kind, ...runGateCase(c) })),
  ...DIGEST_CASES.map((c) => ({ id: c.id, kind: c.kind, ...runAssertionCase(c) })),
];

const passed = results.filter((r) => r.pass).length;
const total = results.length;

const width = Math.max(...results.map((r) => r.id.length));
console.log(`\nagent behaviour — golden set`);
console.log(
  `positioning impl v${IMPL_VERSION} · prompt v${POSITIONING.version} · digest impl v${SHIPPING_VERSION}\n`,
);
let lastKind = null;
for (const r of results) {
  if (r.kind !== lastKind) {
    console.log(`  ${r.kind}`);
    lastKind = r.kind;
  }
  console.log(`    ${r.pass ? "pass" : "FAIL"}  ${r.id.padEnd(width)}  ${r.note}`);
}
console.log(`\n  ${passed}/${total} (${Math.round((passed / total) * 100)}%)\n`);

const path = join(ROOT, "data", "evals.json");
const history = JSON.parse(readFileSync(path, "utf-8"));

if (process.argv.includes("--check")) {
  // Compared against the best run at the same suite size. Adding cases makes
  // the total go up, and a larger suite finding new failures is the suite
  // working, not a regression to block on.
  const comparable = history.runs.filter((r) => r.total === total);
  const best = comparable.reduce((m, r) => Math.max(m, r.passed), 0);
  if (passed < best) {
    console.error(`Regression: ${passed}/${total} is below the best recorded ${best}/${total}.`);
    process.exit(1);
  }
}

if (process.argv.includes("--record")) {
  history.runs.unshift({
    date: new Date().toISOString().slice(0, 10),
    impl_version: IMPL_VERSION,
    prompt_version: POSITIONING.version,
    digest_version: SHIPPING_VERSION,
    passed,
    total,
    failing: results.filter((r) => !r.pass).map((r) => r.id),
  });
  history.updated = new Date().toISOString().slice(0, 10);
  writeFileSync(path, JSON.stringify(history, null, 2) + "\n");
  console.log(`Recorded to data/evals.json\n`);
}
