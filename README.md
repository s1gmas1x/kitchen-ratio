# KitchenRatio Docs

KitchenRatio is a VitePress-powered documentation site for baking ratios, guides, ingredients, and recipes. This repository contains the content and configuration for the public site at https://kitchenratio.com. The KitchenRatio calculator is a separate application and is not part of this repository.

## What’s Inside
- `docs/` holds all site content and assets.  
- `docs/.vitepress/` contains the VitePress configuration, theme, and sidebar structure.  
- `docs/guides/` includes how-to articles and concepts like hydration and baker’s percentage.  
- `docs/recipes/` contains recipe pages that follow baker’s percentage conventions.  
- `docs/ingredients/` documents individual ingredient references.  
- `docs/public/` stores static assets served directly by the site.

## Content Guidelines
- Keep pages concise, practical, and ratio-focused.  
- Prefer short sections with descriptive headings.  
- Use consistent naming and placement (e.g., new guides go in `docs/guides/`).  
- When adding a new page, update the relevant index page and sidebar config in `docs/.vitepress/config.mjs`.

## Editing Checklist
- Add or update content in `docs/`.  
- Link new pages from the relevant index (e.g., `docs/guides/index.md`).  
- Update the sidebar in `docs/.vitepress/config.mjs` so pages are discoverable.  
- Keep titles and labels consistent across page front matter, indexes, and sidebar text.

## Scope
This repo is intentionally limited to the documentation site. Calculator functionality, feature requests, and bugs should be handled in the separate calculator app repository.
