// The golden set for the positioning review.
//
// Every case is a frozen fixture and an expectation. They are deliberately
// written against the behaviour the system *should* have, not the behaviour it
// has, so a case that fails is a real defect rather than a broken test. The
// first recorded run fails several of these on purpose: publishing a pass rate
// that started at 100% would prove only that the suite was written to agree
// with the code.
//
// Time is frozen. A suite whose expectations drift with the clock stops being
// a regression test after a month.

export const NOW = Date.parse("2026-08-18T00:00:00Z");

const days = (n) =>
  new Date(NOW - n * 86400000).toISOString();

/** A site state that surfaces nothing, for cases about discovery. */
const emptySite = { featured: [], corpus: "" };

export const SCAN_CASES = [
  {
    id: "repo-active-unfeatured",
    kind: "scan",
    why: "Recent public work the site has never mentioned is the loop's core signal.",
    repos: [
      { name: "argus", stars: 3, pushed_at: days(2), description: "Agent fleet for a daily AI brief." },
    ],
    posts: [],
    state: emptySite,
    expect: { findings: 1, source: "github", mentions: "argus" },
  },
  {
    id: "repo-already-featured",
    kind: "scan",
    why: "Proposing work that is already on /built is noise.",
    repos: [
      { name: "argus", stars: 3, pushed_at: days(2), description: "Agent fleet for a daily AI brief." },
    ],
    posts: [],
    state: { featured: ["argus"], corpus: "argus" },
    expect: { findings: 0 },
  },
  {
    id: "repo-stale",
    kind: "scan",
    why: "A repo untouched for half a year is not 'recent work'.",
    repos: [
      { name: "old-thing", stars: 0, pushed_at: days(200), description: "An old experiment." },
    ],
    posts: [],
    state: emptySite,
    expect: { findings: 0 },
  },
  {
    id: "repo-no-description",
    kind: "scan",
    why: "Without a description there is nothing to write a blurb from.",
    repos: [{ name: "scratch", stars: 0, pushed_at: days(1), description: null }],
    posts: [],
    state: emptySite,
    expect: { findings: 0 },
  },
  {
    id: "repo-is-fork",
    kind: "scan",
    why:
      "A fork is how contributing to someone else's project looks on the API. " +
      "Proposing 'feature your fork of anthropics/claude-code-action on /built' " +
      "is wrong: the contribution is the PR, not the fork.",
    repos: [
      {
        name: "claude-code-action",
        stars: 0,
        fork: true,
        pushed_at: days(3),
        description: "Fork of anthropics/claude-code-action.",
      },
    ],
    posts: [],
    state: emptySite,
    expect: { findings: 0 },
  },
  {
    id: "repo-archived",
    kind: "scan",
    why: "Archived work should not be pitched to an employer as current.",
    repos: [
      {
        name: "retired-tool",
        stars: 12,
        archived: true,
        pushed_at: days(4),
        description: "No longer maintained.",
      },
    ],
    posts: [],
    state: emptySite,
    expect: { findings: 0 },
  },
  {
    id: "post-unlinked",
    kind: "scan",
    why: "A new post nothing links to is the signal that produced the first real proposal.",
    repos: [],
    posts: [
      { title: "The Loop Was Never the Hard Part", link: "https://medium.com/@elliotJL/the-loop-x", date: "Mon, 13 Jul 2026" },
    ],
    state: emptySite,
    expect: { findings: 1, source: "medium" },
  },
  {
    id: "post-linked-in-corpus",
    kind: "scan",
    why: "A post already hard-linked in site source is surfaced; proposing it again is a false positive.",
    repos: [],
    posts: [
      { title: "Already linked", link: "https://medium.com/@elliotJL/already", date: "Mon, 13 Jul 2026" },
    ],
    state: { featured: [], corpus: "see https://medium.com/@elliotJL/already for more" },
    expect: { findings: 0 },
  },
  {
    id: "post-annotated-on-writing",
    kind: "scan",
    why:
      "/writing fetches the Medium feed at build time and lib/writing.ts carries a " +
      "curated note per post. A post that is both in the feed and annotated is fully " +
      "handled, but the scanner only reads built/page.tsx, now.md and llms.txt, so it " +
      "cannot see either. Without this case the loop proposes 'link this post' forever.",
    repos: [],
    posts: [
      { title: "Fully handled", link: "https://medium.com/@elliotJL/annotated-post", date: "Fri, 15 Aug 2026" },
    ],
    state: {
      featured: [],
      corpus: "",
      annotated: ["https://medium.com/@elliotJL/annotated-post"],
    },
    expect: { findings: 0 },
  },
  {
    id: "post-in-feed-not-annotated",
    kind: "scan",
    why:
      "The real remaining gap once /writing renders the feed automatically: a post is " +
      "listed but has no curated note explaining why it is worth reading. That is a " +
      "renewing supply of genuine work, unlike 'is it linked'.",
    repos: [],
    posts: [
      { title: "Listed but unexplained", link: "https://medium.com/@elliotJL/bare-post", date: "Sat, 16 Aug 2026" },
    ],
    state: { featured: [], corpus: "", annotated: [] },
    expect: { findings: 1, source: "medium" },
  },
  {
    id: "no-sources",
    kind: "scan",
    why: "A clean pass is a valid outcome and must not be turned into busywork.",
    repos: [],
    posts: [],
    state: emptySite,
    expect: { findings: 0 },
  },
];

export const GATE_CASES = [
  {
    id: "gate-good-proposal",
    kind: "gate",
    why: "The gate has to let real work through, or it is just an off switch.",
    candidate: {
      title: "Surface recent work: argus",
      rationale:
        "argus was pushed in the last 30 days but isn't on the site. An agent fleet that writes a daily AI brief is directly relevant to the roles being targeted.",
      change: "Add a /built blurb for argus.",
    },
    repos: [{ name: "argus" }],
    posts: [],
    expect: { verdict: "pass" },
  },
  {
    id: "gate-cosmetic",
    kind: "gate",
    why: "A personal site does not need the agent inventing paint jobs.",
    candidate: {
      title: "Change the accent colour on the homepage",
      rationale:
        "The coral accent could be warmer, which would make the hero feel more inviting to a visiting hiring manager.",
      change: "Adjust --accent.",
    },
    repos: [{ name: "argus" }],
    posts: [],
    expect: { verdict: "reject" },
  },
  {
    id: "gate-ungrounded",
    kind: "gate",
    why:
      "The headline claim on /loops is that proposals are grounded in real sources. " +
      "A proposal citing nothing real must not pass, even if it reads well.",
    candidate: {
      title: "Add a section about leadership philosophy",
      rationale:
        "Employers hiring senior product people want to understand how a candidate thinks about leading teams and setting direction over the long run.",
      change: "Write a new section.",
    },
    repos: [{ name: "argus" }],
    posts: [],
    expect: { verdict: "reject" },
  },
  {
    id: "gate-invented-source",
    kind: "gate",
    why: "Citing a repo that does not exist is the failure mode the whole gate exists to catch.",
    candidate: {
      title: "Surface recent work: neuralforge",
      rationale:
        "neuralforge was pushed recently and is not on the site. It would demonstrate depth in systems engineering to an employer reviewing the portfolio.",
      change: "Add a /built blurb for neuralforge.",
    },
    repos: [{ name: "argus" }, { name: "boulot" }],
    posts: [],
    expect: { verdict: "reject" },
  },
  {
    id: "gate-thin-rationale",
    kind: "gate",
    why: "A one-line rationale gives a human nothing to decide against.",
    candidate: {
      title: "Surface recent work: argus",
      rationale: "argus is not featured.",
      change: "Add it.",
    },
    repos: [{ name: "argus" }],
    posts: [],
    expect: { verdict: "reject" },
  },
];

export const ALL_CASES = [...SCAN_CASES, ...GATE_CASES];
