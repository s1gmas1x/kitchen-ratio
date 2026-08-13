import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadRecipes, renderValidationReport, validateRecipe } from './recipe-pipeline.mjs'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const recipes = await loadRecipes(path.join(repositoryRoot, 'recipes/source'))
let errors = 0
let warnings = 0

for (const recipe of recipes) {
  const result = validateRecipe(recipe)
  errors += result.errors.length
  warnings += result.warnings.length
  console.log(`${recipe.frontmatter.slug}: ${result.errors.length} error(s), ${result.warnings.length} warning(s)`)
  for (const error of result.errors) console.log(`  error: ${error}`)
  for (const warning of result.warnings) console.log(`  warning: ${warning}`)
}

console.log(`Validated ${recipes.length} recipes: ${errors} error(s), ${warnings} warning(s).`)
if (errors > 0) process.exitCode = 1
