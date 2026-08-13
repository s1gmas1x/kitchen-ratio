import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  loadRecipes,
  renderPresetModule,
  renderProductionSheet,
  renderValidationReport,
  renderVitePress,
  validateRecipe,
} from './recipe-pipeline.mjs'

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const sourceDirectory = path.join(repositoryRoot, 'recipes/source')
const generatedDirectory = path.join(repositoryRoot, 'recipes/generated')

export async function buildArtifacts() {
  const recipes = await loadRecipes(sourceDirectory)
  const validations = recipes.map((recipe) => ({ recipe, result: validateRecipe(recipe) }))
  const errors = validations.flatMap(({ recipe, result }) => result.errors.map((error) => `${recipe.frontmatter.slug}: ${error}`))
  if (errors.length > 0) throw new Error(`Generation blocked by validation errors:\n${errors.map((error) => `- ${error}`).join('\n')}`)

  const artifacts = new Map()
  artifacts.set('presets/recipe-presets.generated.mjs', renderPresetModule(recipes))
  for (const { recipe, result } of validations) {
    artifacts.set(`reports/${recipe.frontmatter.slug}.validation.md`, renderValidationReport(recipe, result))
    artifacts.set(`vitepress/${recipe.frontmatter.slug}.md`, renderVitePress(recipe))
    artifacts.set(`production-sheets/${recipe.frontmatter.slug}.production-sheet.md`, renderProductionSheet(recipe))
  }
  return { artifacts, validations }
}

export async function writeArtifacts(directory = generatedDirectory) {
  const { artifacts, validations } = await buildArtifacts()
  for (const [relativePath, content] of artifacts) {
    const target = path.join(directory, relativePath)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, content, 'utf8')
  }
  return { artifacts, validations }
}

async function checkArtifacts() {
  const { artifacts } = await buildArtifacts()
  const differences = []
  for (const [relativePath, expected] of artifacts) {
    const target = path.join(generatedDirectory, relativePath)
    let actual = null
    try { actual = await readFile(target, 'utf8') } catch { differences.push(`${relativePath} is missing`); continue }
    if (actual !== expected) differences.push(`${relativePath} is not deterministic; run npm run recipes:generate`)
  }
  if (differences.length > 0) throw new Error(differences.join('\n'))
  console.log(`Recipe artifact check passed for ${artifacts.size} files.`)
}

async function main() {
  if (process.argv.includes('--check')) return checkArtifacts()
  const { artifacts, validations } = await writeArtifacts()
  const warningCount = validations.reduce((sum, { result }) => sum + result.warnings.length, 0)
  console.log(`Generated ${artifacts.size} review artifacts with ${warningCount} warning(s).`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
