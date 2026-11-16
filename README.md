# Sara Oulmaki — Portfolio

Personal engineering & creative portfolio. React + Vite + TypeScript, React Three Fiber for the 3D hero, Motion for animations. Static site, GitHub Pages–ready.

## Run locally

```bash
npm install      # first time only
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Editing content (no component changes needed)

| What | File |
| --- | --- |
| Name, tagline, social URLs, nav, hero skills | `src/data/site.ts` |
| Engineering projects (cards + detail pages) | `src/data/projects.ts` |
| Creative playground (kit vs. original items) | `src/data/playground.ts` |
| About text & toolbox | `src/sections/About.tsx` |
| Colours, fonts, radii | `src/styles/tokens.css` |

**Project photos:** put them in `public/images/projects/<slug>/` named `01-short-description.jpg`, `02-…` (the first is the card cover), then list them in the project's `images` array in `src/data/projects.ts` with alt text and pixel size. JPEG, ~1600 px long edge, < 400 KB.

**Project videos:** set `video` on a project — a file in `public/videos/projects/<slug>/demo.mp4`, a YouTube/Vimeo embed URL, or `{ kind: 'coming-soon' }`.

**Case-study pages:** add `meta`, `status` and `caseStudy` to a project (see Bizzarophone) for the long-form layout: overview → photos → architecture → achievements → video → challenges → results.

**Project pages** live at `#/projects/<slug>` (hash routing → works on GitHub Pages without extra config). Add `sections: [{ heading, body }]` to fill one in.

## Structure

```
src/
  data/        content (edit these)
  sections/    page sections: Hero, Projects, Playground, About
  pages/       ProjectPage (detail view)
  components/  Navbar, Footer, cards, annotations, fallbacks, icons
  three/       3D hero: HeroScene (canvas + input), ModularCube, parts, materials
  hooks/       theme, hash router, active section, in-view
  styles/      tokens.css (design tokens), base.css (global primitives)
```

## Deployment (GitHub Pages)

Every push to `main` builds the site and publishes `dist/` via `.github/workflows/deploy.yml`.
In the repository settings, set **Pages → Source** to **GitHub Actions**. `vite.config.ts` uses `base: './'` and routes are hash-based, so the site works under `https://<user>.github.io/portfolio/` without extra config.
