# elliot-os

My site, run like a product. Live at
**[elliotjlt.github.io/elliot-os](https://elliotjlt.github.io/elliot-os/)**.

A personal site instrumented like a product. The numbers are computed
from real activity: the project list is fetched from GitHub at build
time, the changelog is this repo's git history, `/now` is maintained by a
scheduled agent whose commits you can inspect, `/loops` is the control
panel for the agents that maintain the site, and the roadmap on `/next`
keeps missed promises visible. Agents get a structured route in via
`llms.txt` and an MCP server.

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

- `content/now.md` — what I am doing this week
- `content/next.md` — the roadmap: exploring / building / shipped
- `data/spend.json` — the agent's inference ledger; the footer counter
  and `/loops` render it
- `app/built/page.tsx` — curated blurbs; the rest of the list is live
  from the GitHub API

## MCP server

`node mcp/server.mjs` starts a zero-dependency MCP server over stdio
exposing `get_profile`, `get_projects`, `get_now`, `get_roadmap`,
`get_spend`, and `get_fit(job_spec)`. See `mcp/README.md`.
