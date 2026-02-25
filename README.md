# njueeray.github.io

> Personal resume & portfolio — built with Astro + TypeScript, deployed on GitHub Pages.

**Live site：** https://njueeray.github.io

---

## Tech Stack

- **Framework:** [Astro](https://astro.build) (static output, zero JS by default)
- **Language:** TypeScript
- **Styling:** Vanilla CSS with CSS variables (no framework)
- **Deployment:** GitHub Pages via GitHub Actions
- **Theme:** Dark terminal aesthetic (`#0d1117` base · `#00b4d8` accent)

## Local Development

```bash
npm install
npm run dev       # → http://localhost:4321
npm run build     # → ./dist/
npm run preview   # preview production build
```

## Deployment

Push to `main` → GitHub Actions builds → deploys to `gh-pages` branch → live at `njueeray.github.io`

> Workflow file: `.github/workflows/deploy.yml` (auto-generated on first deploy)

## Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro    # Dark theme base, CSS variables
├── pages/
│   └── index.astro         # Single page resume
└── components/
    ├── Hero.astro           # Terminal-style intro
    ├── About.astro          # About section
    ├── TechStack.astro      # Skill grid
    ├── Projects.astro       # Featured projects
    └── Contact.astro        # Contact & footer
```

## License

MIT © 2026 Ray Huang
