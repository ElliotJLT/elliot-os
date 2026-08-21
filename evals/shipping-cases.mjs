// Golden set for the shipping digest.
//
// These cases exist because the digest spent a month unable to see the most
// credible work in the feed, and because the obvious fix would have introduced
// something worse: attributing other contributors' commits to Elliot. Each
// case names the defect it pins.
//
// Shaped as assertions rather than fixture-and-expect, because the units under
// test are small and the interesting part is the reason, not the plumbing.

import {
  isNoise,
  commitsUrl,
  classify,
  shape,
  renderLog,
} from "../scripts/lib/shipping.mjs";

export const NOW = Date.parse("2026-08-18T00:00:00Z");
const CUTOFF = NOW - 7 * 86400000;
const at = (n) => new Date(NOW - n * 86400000).toISOString();

const push = (repo, n = 1) => ({ type: "PushEvent", created_at: at(n), repo: { name: repo } });
const pr = (repo, number, action, n = 1) => ({
  type: "PullRequestEvent",
  created_at: at(n),
  repo: { name: repo },
  payload: { action, number, pull_request: { url: `https://api.github.com/repos/${repo}/pulls/${number}` } },
});

const ok = (pass, note = "") => ({ pass, note });

export const DIGEST_CASES = [
  {
    id: "commits-url-keeps-external-owner",
    kind: "digest",
    why:
      "The original built every URL as /repos/ElliotJLT/{name} after stripping the owner, " +
      "so anthropics/claude-code-action became a malformed path that 404ed and was dropped " +
      "by a silent continue. That single line is why five months of contributions to other " +
      "people's projects were invisible.",
    assert() {
      const url = commitsUrl("anthropics/claude-code-action", "ElliotJLT", "2026-08-11T00:00:00Z");
      return ok(
        url.includes("/repos/anthropics/claude-code-action/commits"),
        `built: ${url}`,
      );
    },
  },
  {
    id: "commits-url-pins-the-author",
    kind: "digest",
    why:
      "Fetching an external repo's commits without an author filter returns every " +
      "contributor's work. Verified against modelcontextprotocol/servers: the unfiltered " +
      "call returns other maintainers' commits. Publishing those as Elliot's would be " +
      "fabrication, which is a worse failure than the blindness it replaced.",
    assert() {
      const url = commitsUrl("modelcontextprotocol/servers", "ElliotJLT", "2026-08-11T00:00:00Z");
      return ok(url.includes("author=ElliotJLT"), `built: ${url}`);
    },
  },
  {
    id: "commits-url-refuses-a-bare-repo-name",
    kind: "digest",
    why:
      "The bug was a bare name silently producing a wrong URL. A bare name should now be " +
      "impossible to pass without an error rather than quietly wrong.",
    assert() {
      try {
        commitsUrl("elliot-os", "ElliotJLT", "2026-08-11T00:00:00Z");
        return ok(false, "accepted a bare repo name instead of throwing");
      } catch {
        return ok(true);
      }
    },
  },
  {
    id: "merge-commits-are-not-shipping",
    kind: "digest",
    why:
      "Merge commits were never filtered, so on a genuinely busy week the digest's headline " +
      "read 'Merge pull request #24 from ElliotJLT/ElliotJLT/enlarge-nav-add-dropdowns'. " +
      "That is bookkeeping presented as work.",
    assert() {
      const noisy = [
        "Merge pull request #24 from ElliotJLT/enlarge-nav",
        "Merge branch 'main' into feature",
        "Merge remote-tracking branch 'origin/main'",
      ];
      const bad = noisy.filter((m) => !isNoise(m));
      return ok(bad.length === 0, bad.length ? `not filtered: ${bad.join(" | ")}` : "");
    },
  },
  {
    id: "agent-commits-are-not-shipping",
    kind: "digest",
    why: "The digest must not report on itself, or the loop becomes its own evidence.",
    assert() {
      return ok(isNoise("agent: refresh /now shipping log + spend telemetry"));
    },
  },
  {
    id: "real-commits-survive-the-filter",
    kind: "digest",
    why: "A noise filter that eats real work is worse than no filter.",
    assert() {
      return ok(
        !isNoise("Reframe homepage workshop photo") &&
          !isNoise("fix(git): add missing argument injection guards"),
      );
    },
  },
  {
    id: "pull-requests-are-seen-at-all",
    kind: "digest",
    why:
      "PullRequestEvent was ignored by the original switch, which handled only pushes, " +
      "repo creation, releases and going public. Opening or landing a PR on someone else's " +
      "project produced no event the digest could read.",
    assert() {
      const { prs } = classify([pr("anthropics/claude-code-action", 1127, "opened")], "ElliotJLT", CUTOFF);
      return ok(prs.length === 1, `saw ${prs.length} pull requests`);
    },
  },
  {
    id: "external-work-is-told-apart-from-my-own",
    kind: "digest",
    why:
      "A contribution to another project and a commit to my own site are not the same claim, " +
      "and the rarer one should not be filed under the same heading as the routine one.",
    assert() {
      const { repos, prs } = classify(
        [pr("modelcontextprotocol/servers", 3545, "merged"), pr("ElliotJLT/elliot-os", 27, "merged")],
        "ElliotJLT",
        CUTOFF,
      );
      const s = shape({ repos, prs });
      return ok(
        s.externalPrs.length === 1 && s.externalPrs[0].repo === "modelcontextprotocol/servers",
        `external PRs: ${s.externalPrs.map((p) => p.repo).join(", ") || "none"}`,
      );
    },
  },
  {
    id: "a-merged-pull-request-says-merged",
    kind: "digest",
    why:
      "Opened and merged are different facts. The feed reports them as separate events on " +
      "the same pull request, so the digest must collapse them to the later state rather " +
      "than printing the same PR twice.",
    assert() {
      const { repos, prs } = classify(
        [
          pr("modelcontextprotocol/servers", 3545, "merged", 1),
          pr("modelcontextprotocol/servers", 3545, "opened", 3),
        ],
        "ElliotJLT",
        CUTOFF,
      );
      const s = shape({ repos, prs });
      return ok(
        s.externalPrs.length === 1 && s.externalPrs[0].merged === true,
        `${s.externalPrs.length} entries, merged=${s.externalPrs[0]?.merged}`,
      );
    },
  },
  {
    id: "other-peoples-projects-lead-the-log",
    kind: "digest",
    why:
      "Contributions to projects Elliot does not own are the hardest thing in the feed to " +
      "fake. Burying them under a list of commits to his own site wastes the only line an " +
      "employer would stop on.",
    assert() {
      const { repos, prs } = classify(
        [pr("modelcontextprotocol/servers", 3545, "merged"), push("ElliotJLT/elliot-os")],
        "ElliotJLT",
        CUTOFF,
      );
      repos.get("ElliotJLT/elliot-os").commits = [{ sha: "abc1234", message: "Real work" }];
      const log = renderLog(shape({ repos, prs }), "2026-08-18", 7, "ElliotJLT");
      const ext = log.indexOf("Other people's projects");
      const mine = log.indexOf("My own");
      return ok(ext !== -1 && mine !== -1 && ext < mine, log.slice(0, 160));
    },
  },
  {
    id: "events-outside-the-window-are-ignored",
    kind: "digest",
    why: "A seven-day log that quietly includes older events is not a seven-day log.",
    assert() {
      const { prs } = classify([pr("anthropics/claude-quickstarts", 384, "opened", 40)], "ElliotJLT", CUTOFF);
      return ok(prs.length === 0, `included ${prs.length} stale events`);
    },
  },
  {
    id: "a-quiet-week-says-so",
    kind: "digest",
    why:
      "The honest output for a week with nothing in it. Worth pinning because the digest " +
      "published exactly this on 16 and 17 August and still opened a commit announcing a refresh.",
    assert() {
      const log = renderLog(shape(classify([], "ElliotJLT", CUTOFF)), "2026-08-18", 7, "ElliotJLT");
      return ok(log.includes("Quiet week on public GitHub"), log.slice(0, 120));
    },
  },
];
