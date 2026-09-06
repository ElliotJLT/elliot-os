// The shipping digest's shaping logic, extracted so evals/shipping-cases.mjs
// can hold it to account. agent-now.mjs owns the network calls; everything
// that decides what counts as shipped lives here.
//
// The digest used to be structurally blind to the most credible work in the
// feed. Three separate reasons, all fixed here and pinned by cases:
//
//   1. Repo names were built as `ElliotJLT/${name}` after stripping the owner,
//      so a contribution to anthropics/claude-code-action produced a malformed
//      URL, 404ed, and was dropped by a silent `continue`.
//   2. Only PushEvent, CreateEvent, ReleaseEvent and PublicEvent were handled.
//      PullRequestEvent — opening or landing work on someone else's project —
//      was ignored entirely.
//   3. Merge commits were never filtered, so a busy week's headline read
//      "Merge pull request #24 from ElliotJLT/...".
//
// And one the fix would have introduced: /repos/{full}/commits without an
// author filter returns *every* contributor's commits. On an external repo
// that means reporting strangers' work as Elliot's, which is worse than
// reporting nothing. commitsUrl always pins the author.

export const IMPL_VERSION = "2";

/** Commits the log should never mention. */
export function isNoise(message) {
  if (!message) return true;
  // The agent's own commits: it does not report on itself.
  if (message.startsWith("agent:")) return true;
  // Merge commits are bookkeeping, not shipping, and they used to be the
  // loudest thing in the digest because they sort first.
  if (/^Merge (pull request|branch|remote-tracking branch)\b/.test(message)) return true;
  return false;
}

/**
 * Commit list URL for a repo, always scoped to one author.
 *
 * @param fullName  "owner/repo", never just the repo
 * @param user      the only author whose commits belong in this log
 */
export function commitsUrl(fullName, user, sinceIso) {
  const [owner, repo] = fullName.split("/");
  if (!owner || !repo) throw new Error(`commitsUrl needs "owner/repo", got "${fullName}"`);
  return (
    `https://api.github.com/repos/${owner}/${repo}/commits` +
    `?author=${encodeURIComponent(user)}&since=${encodeURIComponent(sinceIso)}&per_page=30`
  );
}

/**
 * Sort raw events into the repos that moved and the pull requests that opened
 * or landed, keeping owner information so external work can be told apart from
 * Elliot's own.
 */
export function classify(events, user, cutoffMs) {
  const repos = new Map();
  const prs = [];

  for (const e of events) {
    if (new Date(e.created_at).getTime() <= cutoffMs) continue;
    const fullName = e.repo?.name;
    if (!fullName || !fullName.includes("/")) continue;
    const own = fullName.split("/")[0].toLowerCase() === user.toLowerCase();

    const entry = repos.get(fullName) || { fullName, own, pushed: false, commits: [] };

    switch (e.type) {
      case "PushEvent":
        entry.pushed = true;
        break;
      case "CreateEvent":
        if (e.payload?.ref_type === "repository") entry.created = true;
        break;
      case "ReleaseEvent":
        entry.release = e.payload?.release?.tag_name;
        break;
      case "PublicEvent":
        entry.madePublic = true;
        break;
      case "PullRequestEvent": {
        const action = e.payload?.action;
        if (action !== "opened" && action !== "merged" && action !== "closed") break;
        // The public feed's pull_request payload is sparse: number and url are
        // present, title is not. agent-now.mjs hydrates the title from url.
        prs.push({
          repo: fullName,
          own,
          number: e.payload.number,
          url: e.payload.pull_request?.url,
          merged: action === "merged" || e.payload.pull_request?.merged === true,
        });
        break;
      }
      default:
        break;
    }
    repos.set(fullName, entry);
  }

  // One line per pull request, newest event wins.
  const seen = new Set();
  const uniquePrs = prs.filter((p) => {
    const key = `${p.repo}#${p.number}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { repos, prs: uniquePrs };
}

/** Everything worth printing, split by whose project it is. */
export function shape({ repos, prs }) {
  const list = [...repos.values()].filter(
    (r) => r.commits.length > 0 || r.created || r.release || r.madePublic,
  );
  const own = list.filter((r) => r.own).sort((a, b) => b.commits.length - a.commits.length);
  const external = list.filter((r) => !r.own).sort((a, b) => b.commits.length - a.commits.length);
  const externalPrs = prs.filter((p) => !p.own);
  const commitCount = list.reduce((n, r) => n + r.commits.length, 0);
  return { own, external, externalPrs, commitCount };
}

function repoLine(r) {
  const bits = [];
  if (r.created) bits.push("new repo");
  if (r.madePublic) bits.push("made public");
  if (r.release) bits.push(`release ${r.release}`);
  const shown = r.commits.slice(0, 3);
  const cite = shown.map((c) => `"${c.message}" (${c.sha})`).join(", ");
  const extra = r.commits.length > 3 ? ` and ${r.commits.length - 3} more` : "";
  const detail = [bits.join(", "), cite].filter(Boolean).join(". ");
  const n = r.commits.length;
  const label = r.own ? r.fullName.split("/")[1] : r.fullName;
  return (
    `- **[${label}](https://github.com/${r.fullName})**: ` +
    `${n} commit${n === 1 ? "" : "s"}. ${detail}${extra}`
  );
}

export function renderLog(shaped, today, windowDays, user) {
  const { own, external, externalPrs, commitCount } = shaped;
  const lines = [];
  const repoCount = own.length + external.length;

  lines.push(
    `*Shipping log for the ${windowDays} days to ${today}, derived from the ` +
      `[public GitHub events API](https://api.github.com/users/${user}/events/public). ` +
      `${commitCount} commits across ${repoCount} repos.*`,
  );
  lines.push("");

  // Contributions to other people's projects lead. They are the rarest thing
  // in the feed and the hardest to fake, and they used to be invisible.
  if (externalPrs.length || external.length) {
    lines.push("**Other people's projects**");
    lines.push("");
    for (const p of externalPrs) {
      lines.push(
        `- ${p.merged ? "Merged" : "Opened"} [${p.repo}#${p.number}](https://github.com/${p.repo}/pull/${p.number})` +
          (p.title ? `: ${p.title}` : ""),
      );
    }
    for (const r of external) lines.push(repoLine(r));
    if (own.length) {
      lines.push("");
      lines.push("**My own**");
      lines.push("");
    }
  }

  for (const r of own) lines.push(repoLine(r));

  if (repoCount === 0 && externalPrs.length === 0) {
    lines.push("- Quiet week on public GitHub. The private repos tell a different story.");
  }
  return lines.join("\n");
}
