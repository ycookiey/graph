# Graph

SEO-first public landing page (Astro/SSG) + a protected `/app` for tracking a daily value and visualizing it as a line chart.

## Features

- Public landing page at `/` (prerendered)
- Clerk authentication (`/sign-in`)
- Protected app at `/app` and `/app/input` (noindex)
- Turso (libSQL/SQLite) backend for entries
- API endpoints:
  - `GET /api/entries?days=7|30|365`
  - `POST /api/entries` body: `{ "value": number }`
  - `GET /api/entries/today`

## Local dev

1) Create a `.env.local` from `.env.example`.

2) Run dev server:

```bash
npm run dev
```

Open `http://localhost:4321`.

## Database

Create the Turso schema from `db/schema.sql`.

## Deploy (Cloudflare Pages)

- Set environment variables from `.env.example`
- Ensure `SITE` is set to your production origin (for canonical URLs + sitemap)

### Notes

- This project explicitly disables Astro sessions (`session.driver = "null"`), so a `SESSION` KV binding is **not** required.
- Clerk currently relies on `AsyncLocalStorage` and may require **Node.js compatibility** on Cloudflare Pages.
  If auth fails at runtime, enable the Pages Functions compatibility flag `nodejs_compat`.
