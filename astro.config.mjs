import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://njueeray.github.io',
  integrations: [
    expressiveCode({
      // Match the site's dark terminal aesthetic
      themes: ['github-dark-dimmed'],
      styleOverrides: {
        borderRadius: '6px',
        borderWidth: '1px',
        // copy-button accent matches --color-accent
        frames: {
          editorActiveTabForeground: '#58a6ff',
          editorTabBarBorderBottomColor: '#30363d',
        },
      },
    }),
    mdx(),
    sitemap(),
  ],
  // output: 'static' is the default — deploys to GitHub Pages
});
