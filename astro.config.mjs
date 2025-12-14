import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import clerk from '@clerk/astro';

const site = process.env.SITE || 'https://example.com';

export default defineConfig({
  site,
  output: 'server',
  // We don't use Astro sessions in this app.
  // Override the Cloudflare adapter default (KV-backed sessions) to avoid requiring a `SESSION` binding.
  session: { driver: 'null' },
  adapter: cloudflare(),
  integrations: [
    react(),
    clerk(),
    sitemap({
      filter: (page) => {
        // `@astrojs/sitemap` passes a string (usually a pathname).
        const pathname = page.startsWith('http') ? new URL(page).pathname : page;

        // Keep auth + app routes out of the SEO surface.
        if (pathname === '/sign-in' || pathname === '/sign-in/') return false;
        if (pathname.startsWith('/app')) return false;
        return true;
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        async_hooks: 'node:async_hooks',
      },
    },
  },
});
