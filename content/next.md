## building

- **The hosted fit engine.** Paste a job spec on the homepage, get an
  honest read on whether I fit, cited against real shipped work. It will
  say no when the answer is no; that is the point of it. Needs a move off
  GitHub Pages for the API route. Until then the homepage routes your own
  agent through llms.txt, which works today.
- **An MCP server for this site.** So your agent can interrogate my work
  directly instead of scraping HTML: `get_projects`, `get_now`,
  `get_fit(job_spec)`.

## exploring

- **A real domain.** The GitHub Pages URL does the job while the content
  earns something better.
- **Publishing the job-search funnel.** Applications, response rate,
  interview conversion, as a live dashboard. Rates and counts only, no
  company names while conversations are open.

## shipped

- **Agent-owned /now with a real cost counter** — 22 July 2026. A
  scheduled workflow derives the shipping log from the GitHub events API,
  commits as "elliot-os agent", and logs every inference token it spends
  to `data/spend.json`. The footer number is measured, not estimated.
- **v1 of this site** — 22 July 2026. Three sections, live repo list,
  changelog from git history, llms.txt for the machines.
