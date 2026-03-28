import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.NEXT_PUBLIC_SITE_URL || 'https://iceferryling.github.io',
  integrations: [sitemap()],
  output: 'static'
});
