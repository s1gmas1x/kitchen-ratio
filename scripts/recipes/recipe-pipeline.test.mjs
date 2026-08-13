import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  buildPreset,
  loadRecipes,
  parseRecipe,
  renderProductionSheet,
  renderVitePress,
  validateRecipe,
} from './recipe-pipeline.mjs'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const recipes = await loadRecipes(path.join(repositoryRoot, 'recipes/source'))
const bySlug = new Map(recipes.map((recipe) => [recipe.frontmatter.slug, recipe]))

test('French Bread validates with review warnings and generates its canonical preset', () => {
  const recipe = bySlug.get('french-bread')
  const result = validateRecipe(recipe)
  const preset = buildPreset(recipe)
  assert.deepEqual(result.errors, [])
  assert.equal(result.warnings.length, 2)
  assert.equal(preset.main.water, 70)
  assert.equal(preset.main.salt, 2)
  assert.equal(preset.main.yeast, 1)
  assert.deepEqual(preset.extras, [])
})

test('Swedish Rye preserves staged scald data in its preset and production sheet', () => {
  const recipe = bySlug.get('grandmas-swedish-rye')
  const result = validateRecipe(recipe)
  const preset = buildPreset(recipe)
  const sheet = renderProductionSheet(recipe)
  assert.deepEqual(result.errors, [])
  assert.equal(preset.main.flourBlend.ryeFlour, 35)
  assert.deepEqual(preset.scalds.scandinavianScald, {
    enabled: true,
    flourPercent: 35,
    waterRatio: 1,
    flourSource: 'ryeFlour',
  })
  assert.match(sheet, /## Stage allocation/)
  assert.match(sheet, /Rye scald/)
})

test('invalid required data blocks validation and generated output stays reviewable', () => {
  const invalid = parseRecipe(`---\nschema_version: 2\nid: bad\ntitle: Bad\nslug: wrong\ncategory: bread\ntags: [test]\nrecipe_status: approved\npublic_status: published\nproduction_status: needs-review\nsummary: Bad input\nsource:\n  type: test\n  notes: test\nreview_required: []\npublishing:\n  vitepress: true\ncalculator:\n  preset: true\nproduction:\n  yield:\n    default_flour_grams: 100\n    yield_label: test\n  equipment: [bowl]\n  bake:\n    bake_temp_f: 400\n  quality_checks: [test]\n---\n\n## Goal\n\nTest\n\n## Recipe Glance\n\n| Field | Value |\n| --- | --- |\n| Style | Test |\n\n## Formula\n\n| Ingredient | Key | Group | Baker's % | Example Weight |\n| --- | --- | --- | ---: | ---: |\n| Flour | flour | flours | 90 | 90g |\n\n## Process\n\nTest\n\n## Yield\n\n| Batch Target | Value |\n| --- | --- |\n| Default flour | 100g |\n`, 'bad.md')
  const result = validateRecipe(invalid)
  assert.ok(result.errors.some((error) => error.includes('slug')))
  assert.ok(result.errors.some((error) => error.includes('publishing.description')))
  assert.ok(result.errors.some((error) => error.includes('Flour percentages')))

  const rendered = renderVitePress(bySlug.get('french-bread'))
  assert.match(rendered, /## Manual Review Needed/)
  assert.match(rendered, /source.type/)
})

test('malformed numeric formula values block generation instead of being coerced', () => {
  const malformed = parseRecipe(`---\nschema_version: 2\nid: malformed\ntitle: Malformed\nslug: malformed\ncategory: bread\ntags: [test]\nrecipe_status: approved\npublic_status: draft\nproduction_status: needs-review\nsummary: Malformed input\nsource:\n  type: test\n  notes: test\nreview_required: []\npublishing:\n  vitepress: false\ncalculator:\n  preset: false\nproduction:\n  yield:\n    default_flour_grams: 100\n    yield_label: test\n  equipment: [bowl]\n  bake:\n    bake_temp_f: 400\n  quality_checks: [test]\n---\n\n## Goal\n\nTest\n\n## Recipe Glance\n\n| Field | Value |\n| --- | --- |\n| Style | Test |\n\n## Formula\n\n| Ingredient | Key | Group | Baker's % | Example Weight |\n| --- | --- | --- | ---: | ---: |\n| Flour | flour | flours | 100oops | 100g |\n\n## Process\n\nTest\n\n## Yield\n\n| Batch Target | Value |\n| --- | --- |\n| Default flour | 100g |\n| Expected total dough | 100g |\n`, 'malformed.md')
  const result = validateRecipe(malformed)
  assert.ok(result.errors.some((error) => error.includes('numeric Baker')))
})
