# Catalog site

Static catalog UI for the marketplace, hosted on GitHub Pages:
**https://neronasee.github.io/dev-digest-ai-marketplace/**

- React 19 + Vite + TypeScript, hash routing (no server-side rewrite needed on Pages).
- **Real data only**: `scripts/generate-index.mjs` scans `../plugins` (manifests, READMEs,
  CHANGELOGs, skill/agent frontmatter) into `src/data/catalog.json` at build time. The
  generated index is gitignored — there is no mock-data path; a fresh clone regenerates it.
- Dark-first theme with a persisted light toggle; design tokens ported from the catalog
  design reference (IBM Plex, kind-colored badges).
- All UI strings live in `src/i18n/en.ts` — components never hardcode copy.
- Keyword search (name > keywords > description) over plugins, skills, and agents with
  kind facets; per-plugin detail pages with composition, dependencies, and copyable
  install commands; a What's New feed built from plugin changelogs.

## Local development

```bash
cd site
npm install
npm run dev        # predev regenerates the index, then serves at http://localhost:5173
```

## Build

```bash
npm run build      # prebuild regenerates the index, then tsc + vite build -> dist/
npm run preview    # serve the production build locally
```

## Deployment

`.github/workflows/catalog-site.yml` (separate from `validate-marketplace`) builds the
site on every push to `main` and deploys `site/dist` to GitHub Pages. Pages must be
configured with **Source: GitHub Actions** (already enabled for this repository).
