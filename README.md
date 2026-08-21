# elliot-os

My site, run like a product. Live at
**[elliotjlt.github.io/elliot-os](https://elliotjlt.github.io/elliot-os/)**.

A personal site instrumented like a product. The numbers are computed
from real activity: the project list is fetched from GitHub at build
time, the contribution animation is regenerated from GitHub on every
deploy, the changelog is this repo's git history, and `/loops` is the
control panel for the agents that maintain the site — what they scored
against a held-out eval set, a full trace of the last run including the
gate's verdict, the authority each one holds, and where I stopped them.
Agents get a structured route in via `llms.txt` and an MCP server.

Four routes: `/built`, `/writing`, `/loops`, `/changelog`. `/now` and
`/next` were folded into `/loops` on 2026-07-25 and redirect there; their
markdown sources are unchanged, since the agent scripts and the MCP
server read the files rather than the pages.

## Stack

- Next.js (static export), plain CSS, no analytics, no cookies
- Deployed to GitHub Pages by Actions on every push to `main`
- `public/llms.txt` gives agents a structured route in; humans get HTML
- `mcp/` is a zero-dependency MCP server exposing the site's data as tools

## Run it

```bash
npm install
npm run dev
```

`BASE_PATH=/elliot-os` is set only in CI, for the GitHub Pages project
path. Local dev serves from `/`.

## Content

- `content/now.md` — two authors: the agent's shipping log between the
  `agent:begin/end` markers (rendered under its loop on `/loops`), and the
  hand-written half below it (rendered on the home page)
- `content/next.md` — open commitments; the `building` and `exploring`
  sections render on `/loops`
- `data/spend.json` — the agent's inference ledger; the footer counter
  and `/loops` render it. Only runs that actually called a model are
  recorded, so the count is model calls rather than cron firings
- `data/evals.json` — pass rate of the positioning review per
  implementation and prompt version; `/loops` renders the history
- `data/pricing.json` — one dated rate table. Tokens are the ground
  truth in the ledger; dollars are derived from here at render time and
  the site prints the date the rates were last checked
- `app/built/page.tsx` — curated blurbs; the rest of the list is live
  from the GitHub API

## Evals

Both agents keep their decision logic in a module the eval suite imports
directly, so the suite tests the running system rather than a
reimplementation of it: `scripts/lib/positioning.mjs` with
`evals/cases.mjs`, and `scripts/lib/shipping.mjs` with
`evals/shipping-cases.mjs`.

```bash
npm run eval          # print the results
npm run eval:check    # exit 1 if worse than the best recorded run
npm run eval:record   # append this run to data/evals.json
```

Deterministic and $0: no model is called, so `eval:check` gates every
push that touches `scripts/` or `evals/` (see
`.github/workflows/evals.yml`). Bump `IMPL_VERSION` in whichever module
changed, or the `version` on a prompt in `scripts/lib/prompts.mjs`, in
the same commit as the change — the recorded history attributes each
pass rate to a version, which is the only thing that makes it possible
to tell whether an edit helped.

The history starts at 14/28. Every entry was measured by running the
suite against that version of the code, including the baselines: the
cases were written against the behaviour these systems should have
rather than the behaviour they had, so the early failures are real
defects. The review's gate averaged three checks against a 0.6
threshold and could therefore never reject anything. The digest built
every commit URL as `/repos/ElliotJLT/{name}`, so contributions to other
people's projects 404ed and were dropped by a silent `continue`, and it
ignored `PullRequestEvent` entirely.

## MCP server

`node mcp/server.mjs` starts a zero-dependency MCP server over stdio
exposing `get_profile`, `get_projects`, `get_now`, `get_roadmap`,
`get_spend`, and `get_fit(job_spec)`. See `mcp/README.md`.
