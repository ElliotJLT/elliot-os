// The positioning review's decision logic, extracted so that the agent
// (scripts/agent-improve.mjs) and the eval harness (scripts/eval-agents.mjs)
// run the same code. An eval suite that tests a reimplementation of the system
// tests nothing, so there is exactly one copy of scan / buildCandidate / gate
// and both callers import it.
//
// IMPL_VERSION is bumped by hand whenever the behaviour of anything in this
// file changes. data/evals.json attributes each recorded pass rate to a
// version, which is what makes the history on /loops mean anything: a rate
// with no version attached is a number you cannot act on.

export const IMPL_VERSION = "2";

const RECENT_DAYS = 30;

/**
 * Read the real sources against what the site already surfaces, and return
 * candidate gaps, strongest first.
 *
 * @param repos  [{ name, stars, pushed_at, description }]
 * @param posts  [{ title, link, date }]
 * @param state  { featured: string[], corpus: string }
 */
export function scan({ repos, posts, state }, now = Date.now()) {
  const findings = [];
  const cutoff = now - RECENT_DAYS * 86400000;

  // Repos with real recent activity that aren't featured or even mentioned.
  for (const r of repos) {
    // A fork is what contributing to someone else's project looks like from
    // the repos API, and an archived repo is not current work. Pitching either
    // on /built misrepresents them: the contribution is the pull request.
    if (r.fork || r.archived) continue;
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

  // Writing the site lists but does not explain.
  //
  // "Is this post linked anywhere" stopped being a real question on
  // 2026-07-25, when /writing started rendering the Medium feed at build time:
  // every post is linked automatically now, so the old rule could only produce
  // false positives. The gap that remains is the curated note in
  // lib/writing.ts that says why a post is worth reading.
  for (const p of posts) {
    if (!p.link) continue;
    const annotated = (state.annotated || []).includes(p.link);
    if (!annotated && !state.corpus.includes(p.link)) {
      findings.push({
        source: "medium",
        weight: 4,
        title: `Annotate new writing: ${p.title}`,
        detail:
          `Post "${p.title}" (${p.date}) renders on /writing from the live feed but has ` +
          `no curated note saying why it is worth reading. ${p.link}`,
      });
    }
  }

  findings.sort((a, b) => b.weight - a.weight);
  return findings;
}

/** Build a candidate from the strongest available signal. */
export function buildCandidate(findings, llm) {
  if (llm && llm.worth_doing !== false) {
    return {
      source: "positioning",
      title: llm.title,
      rationale: llm.rationale,
      files: llm.files || [],
      change: llm.change || "",
    };
  }
  if (!llm && findings.length) {
    const top = findings[0];
    return {
      source: top.source,
      title: top.title,
      rationale: top.detail,
      files: [],
      change: "Review and, if employer-relevant, surface this on the site.",
    };
  }
  return null;
}

export const EVAL_THRESHOLD = 0.6;

/**
 * The deterministic half of the gate.
 *
 * Every check here is required, and the verdict is the AND of them rather than
 * a mean against a threshold. Averaging was the original design and it could
 * not reject anything: three checks give a minimum non-trivial score of 0.67,
 * which cleared the 0.6 threshold, so a proposal grounded in nothing at all
 * still passed. A gate that cannot say no is not a gate, and the page that
 * described it as one was wrong for a month. The score is kept because
 * data/loops.json records it historically, but it no longer decides anything.
 */
export function gate(candidate, { repos, posts }) {
  const hay = `${candidate.title} ${candidate.rationale} ${candidate.change || ""}`;
  // Word-boundary rather than substring: a repo with a short name should not
  // ground a proposal by coincidence.
  const named = (name) =>
    new RegExp(`(^|[^\\w-])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\w-]|$)`, "i").test(hay);
  const grounded =
    posts.some((p) => p.link && hay.includes(p.link)) || repos.some((r) => named(r.name));
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
  const verdict = checks.every((c) => c.pass) ? "pass" : "reject";
  return { checks, score, verdict, source: "deterministic" };
}
