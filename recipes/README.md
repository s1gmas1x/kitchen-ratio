# Recipe Schema V2 pipeline

This directory is the bounded Recipe Schema V2 milestone for issue #7.

## Execution boundary

- `recipes/source/` holds the canonical Recipe Schema V2 Markdown for this milestone. It currently contains only French Bread and Grandma's Swedish Rye, copied from the reviewed pilot migrations in Chad Brain.
- `scripts/recipes/` parses, validates, and generates review artifacts using Node's built-in modules only.
- `recipes/generated/` contains deterministic, committed review artifacts: validation reports, calculator preset exports, VitePress candidates, and production-sheet candidates.
- `docs/recipes/` and the separate `dough_calc` repository are not written by this pipeline. A person reviews generated artifacts and deliberately copies or integrates an approved output later.
- Invalid required data produces errors and blocks every generator. Warnings preserve output but remain in the report and generated production sheet for manual review.

This is intentionally not a publishing workflow: it does not promote lifecycle statuses or automatically publish a recipe.

## Commands

```bash
npm run recipes:validate
npm run recipes:generate
npm run recipes:check
npm run test:recipes
```

`recipes:check` regenerates into a temporary location and fails if the committed review artifacts are not deterministic.
