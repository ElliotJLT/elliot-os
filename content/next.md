## building

- **The hosted fit engine.** Today the fit console composes a critical
  briefing and hands it to an agent you already trust. The hosted version
  runs the inference itself and answers in place, which needs a backend
  and a token budget that ticks in public, on the same ledger as
  everything else here. Building it deliberately: the client-side path
  already works, and spends nothing.

## exploring

- **A real domain.** The GitHub Pages URL does the job while the content
  earns something better.

## shipped

- **The improvement loop** — 22 July 2026. The site's outer loop: a
  scheduled agent reads real GitHub activity, Medium writing, and the
  site's current state, then proposes one employer-facing improvement as
  a pull request for review. Inner loop runs the work; human stays on the
  outer rail. Control panel on [/loops](/loops); ships dormant until a key
  is set and the schedule enabled.
- **An MCP server for this site** — 22 July 2026. `get_profile`,
  `get_projects`, `get_now`, `get_roadmap`, `get_spend`, and
  `get_fit(job_spec)`, so your agent can interrogate my work directly
  instead of scraping HTML. Zero dependencies, reads the same sources the
  site does. Code in [`mcp/`](https://github.com/ElliotJLT/elliot-os/tree/main/mcp).
- **The fit engine console** — 22 July 2026. The homepage prompt block
  became an interactive shell: paste a job spec for a briefing, or query
  the site's live data with slash-commands.
- **Agent-owned /now, metered** — 22 July 2026. A scheduled workflow
  derives the shipping log from the GitHub events API, commits as
  "elliot-os agent", and meters every token it spends into
  `data/spend.json`. The counter reads zero today because the loop runs
  deterministically until a key is set: the instrument is real, it just
  has not been asked to spend anything yet.
- **v1 of this site** — 22 July 2026. Three sections, live repo list,
  changelog from git history, llms.txt for the machines.
