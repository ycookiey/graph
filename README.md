# Graph

A small web app for recording one number a day and viewing it as a line chart. You deploy your own copy to Cloudflare Pages. Sign-in is handled by [Clerk](https://clerk.com/), and entries are stored in a [Turso](https://turso.tech/) database.

## Features

- Record today's value, from 0 to 100, with a slider. Sending again on the same day replaces that day's value
- Line chart of the last 7, 30, or 365 days. The zoom buttons switch between the periods
- Each account sees only its own entries. Entries are stored on the server in Turso, keyed by the Clerk user ID
- The chart page picks a random color theme each time it loads

## Requirements

- Node.js 22 or later
- A Clerk application
- A Turso database
- A Cloudflare account, for deploying to Pages

## Setup

1. Create the `entries` table by running `db/schema.sql` on your Turso database, for example with `turso db shell <database> < db/schema.sql`
2. Install the dependencies with `npm ci`

The app reads these variables (also listed in `.env.example`):

| Variable | Value |
|---|---|
| `SITE` | Your production origin. Read at build time for canonical URLs and the sitemap |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in`, the app's sign-in page |
| `TURSO_DATABASE_URL` | Database URL, `libsql://...` |
| `TURSO_AUTH_TOKEN` | Database auth token |

## Build and run locally

Put the variables in a `.dev.vars` file in the project root, one `NAME=value` per line, then build and serve the output with Wrangler:

```bash
npm run build
npx wrangler pages dev dist
```

Open the URL that Wrangler prints.

## Deploy to Cloudflare Pages

Create a Pages project from your fork with the build command `npm run build` and the build output directory `dist`. Set the variables above in the project settings before the first build, since `SITE` is read during the build. `wrangler.toml` already enables the `nodejs_compat` compatibility flag.

## Known limitations

- Only today's value can be entered. Past days cannot be added or edited, and the app has no way to delete or export entries
- "Today" is the server's UTC date. In time zones ahead of UTC, a value entered between local midnight and UTC midnight is saved to the previous day; for example, from 00:00 to 09:00 in UTC+9
- With Clerk's default settings, anyone who opens the site can sign up, and their entries are stored in your Turso database. To keep the deployment to yourself, restrict sign-ups in the Clerk dashboard
- `npm run dev` and `npm run preview` do not work with this setup. Use `wrangler pages dev` as shown above

## License

[MIT](LICENSE)
