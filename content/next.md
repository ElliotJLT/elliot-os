## building

- **The hosted fit engine.** Today the fit console composes a critical
  briefing and hands it to an agent you already trust. The hosted version
  runs the inference itself and answers in place — which needs a backend
  and an API budget that ticks in public, on the ledger this site exists
  to publish. Building it deliberately: the client-side path works now, at
  $0.0000 a query.

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
- **The job-search funnel** — 22 July 2026. Applications, response rate,
  and interview conversion as a live dashboard on [/funnel](/funnel).
  Rates and counts only, no company names while conversations are open.
  It renders from a versioned data file and stays dark until there's a
  cohort worth publishing.
- **The fit engine console** — 22 July 2026. The homepage prompt block
  became an interactive shell: paste a job spec for a briefing, or query
  the site's live data with slash-commands.
- **Agent-owned /now with a real cost counter** — 22 July 2026. A
  scheduled workflow derives the shipping log from the GitHub events API,
  commits as "elliot-os agent", and logs every inference token it spends
  to `data/spend.json`. The footer number is measured, not estimated.
- **v1 of this site** — 22 July 2026. Three sections, live repo list,
  changelog from git history, llms.txt for the machines.
