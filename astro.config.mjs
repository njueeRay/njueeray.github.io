import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://njueeray.github.io',
  integrations: [mdx()],
  // output: 'static' is the default — deploys to GitHub Pages
});
