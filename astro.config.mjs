// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE is the canonical origin; BASE_PATH is only set when the site is served
// from a sub-path (GitHub Pages project site). Both come from the deploy environment.
const site = process.env.SITE_URL || 'https://szkoleniebarber.pl';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
