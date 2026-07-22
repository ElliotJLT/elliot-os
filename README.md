# elliot-os

My site, run like a product. Live at
**[elliotjlt.github.io/elliot-os](https://elliotjlt.github.io/elliot-os/)**.

The premise: every PM says they are data-driven, so this site publishes
its own telemetry. The project list is fetched from GitHub at build time,
the changelog is the git history of this repo, and the `/now` page is
being handed over to a scheduled agent whose commits you will be able to
inspect. The roadmap is public on `/next`, so missed promises are visible
too.

## Stack

- Next.js (static export), plain CSS, no analytics, no cookies
- Deployed to GitHub Pages by Actions on every push to `main`
- `public/llms.txt` gives agents a structured route in; humans get HTML

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
- `app/built/page.tsx` — curated blurbs; the rest of the list is live
  from the GitHub API
