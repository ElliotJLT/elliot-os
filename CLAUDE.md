# elliot-os

Elliot's personal site, run like a product. Next.js static export to GitHub
Pages, plain CSS, no analytics. Live: https://elliotjlt.github.io/elliot-os/

## Commands

```bash
npm run dev            # local, served from /
npm run build          # static export to out/ (prebuild fetches Medium media)
npm run eval:check     # golden set over both agents; gates CI on scripts/ and evals/
npx tsc --noEmit       # typecheck
```

## Themes: the rule for all copy

Three themes run through the site, defined once in `lib/themes.ts`:

1. Shipping AI to people who can't afford it to be wrong
2. Product leadership while building
3. Working with agents

The question underneath all three: what got checked, what got rejected,
and who decided?

- Every nav row, section heading, /writing group, card blurb and home
  section ties to one theme, and its eyebrow names that theme.
- A label says what Elliot did, not which category it sits in. "Shipped AI
  to students and families", not "In production".
- Two readers must find their equivalent in under a minute: a
  founding-stage hirer, and a government fellowship reader looking for
  background, what was built and for whom, how it was validated, and the
  team. First person, plain, no hero lines.

## Rules that are easy to break

- `content/now.md` has two authors. The block between `agent:begin` and
  `agent:end` belongs to `scripts/agent-now.mjs`; never hand-edit it. The
  hand-written half below it is served by the MCP server's `get_now` and
  is not rendered on any page right now.
- `data/spend.json` and `data/loops.json` are written by the agents in CI.
  Edit `loops.json` prose by hand if needed, but leave `runs`, `last_run`
  and `spend_usd` to the scripts.
- The shipping digest and positioning review keep their decision logic in
  `scripts/lib/`. If you change behaviour there, bump `IMPL_VERSION` in the
  module and run `npm run eval:record` in the same commit, or CI fails.
- Public claims on the site (roles, outcomes, programme placements) are
  Elliot's. Do not soften, inflate, or reword numbers without asking.
- `lib/github.ts` and `mcp/server.mjs` each carry a featured-repo list.
  Keep them in sync, and check a repo exists before adding it.
- Main has no branch protection and the agent pushes to it daily. Rebase
  onto `origin/main` before merging anything that touches `content/now.md`
  or `data/*.json`.

## Layout

- `app/` routes: `/`, `/built`, `/writing`, `/evals`, `/loops`, `/changelog`
- `lib/` build-time readers (GitHub API, git log, content, loops, evals)
- `scripts/` the two agents plus `fetch-media.mjs`; `evals/` their cases
- `mcp/` zero-dependency MCP server over stdio exposing the site's data
- `public/llms.txt` the machine-readable profile agents read first
