import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://njueeray.github.io',
  integrations: [mdx(), sitemap()],
  // output: 'static' is the default — deploys to GitHub Pages
});
