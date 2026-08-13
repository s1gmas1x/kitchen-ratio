import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const REQUIRED_FORMULA_HEADERS = ['Ingredient', 'Key', 'Group', "Baker's %", 'Example Weight']
const REQUIRED_SECTIONS = ['Goal', 'Recipe Glance', 'Formula', 'Process', 'Yield']
const RECIPE_STATUSES = new Set(['draft', 'approved'])
const PUBLIC_STATUSES = new Set(['draft', 'published'])
const PRODUCTION_STATUSES = new Set(['not-needed', 'needs-review', 'ready'])

export async function loadRecipes(sourceDirectory) {
  const fileNames = (await readdir(sourceDirectory))
    .filter((fileName) => fileName.endsWith('.md'))
    .sort()

  return Promise.all(fileNames.map((fileName) => parseRecipeFile(path.join(sourceDirectory, fileName))))
}

export async function parseRecipeFile(filePath) {
  return parseRecipe(await readFile(filePath, 'utf8'), filePath)
}

export function parseRecipe(markdown, filePath = 'recipe.md') {
  const { frontmatterText, body } = splitFrontmatter(markdown)
  const sections = extractSections(body)
  const formula = parseTable(sections.get('Formula') ?? '')
  const stageFormula = parseTable(sections.get('Stage Formula') ?? '')
  const productionSteps = parseTable(sections.get('Production Steps') ?? '')
  const yieldTable = parseTable(sections.get('Yield') ?? '')

  return {
    body,
    filePath,
    frontmatter: parseYaml(frontmatterText),
    formula,
    markdown,
    productionSteps,
    sections,
    stageFormula,
    yieldTable,
  }
}

export function validateRecipe(recipe) {
  const errors = []
  const warnings = []
  const { frontmatter: metadata } = recipe
  const formulaRows = recipe.formula?.rows ?? []

  requireValue(errors, metadata.schema_version, 'schema_version')
  if (metadata.schema_version !== 2) errors.push('schema_version must be 2.')

  for (const key of ['id', 'title', 'slug', 'category', 'tags', 'summary']) {
    requireValue(errors, metadata[key], key)
  }

  const filenameSlug = path.basename(recipe.filePath).replace(/\.md$/, '')
  if (metadata.slug && metadata.slug !== filenameSlug) {
    errors.push(`slug "${metadata.slug}" must match filename "${filenameSlug}".`)
  }
  if (metadata.id && metadata.slug && metadata.id !== metadata.slug) {
    errors.push(`id "${metadata.id}" must match slug "${metadata.slug}".`)
  }

  validateEnum(errors, metadata.recipe_status, RECIPE_STATUSES, 'recipe_status')
  validateEnum(errors, metadata.public_status, PUBLIC_STATUSES, 'public_status')
  validateEnum(errors, metadata.production_status, PRODUCTION_STATUSES, 'production_status')
  requireValue(errors, metadata.source?.type, 'source.type')
  requireValue(errors, metadata.source?.notes, 'source.notes')

  for (const section of REQUIRED_SECTIONS) {
    if (!recipe.sections.has(section)) errors.push(`Missing required ## ${section} section.`)
  }

  validatePublishing(metadata, errors)
  validateCalculator(metadata, errors)
  validateProduction(metadata, recipe, errors, warnings)
  validateFormula(recipe, errors)
  validateStageFormula(recipe, errors)
  validateYieldTable(recipe, errors)

  if (!Array.isArray(metadata.review_required)) {
    errors.push('review_required must be a list, even when empty.')
  } else {
    for (const item of metadata.review_required) {
      if (!item?.field || !item?.reason) {
        errors.push('Each review_required item needs field and reason.')
      }
    }
    if (metadata.review_required.length > 0) {
      warnings.push(`${metadata.review_required.length} review item(s) require manual review.`)
    }
  }

  if (formulaRows.length === 0) errors.push('Formula table has no ingredient rows.')

  return { errors, warnings }
}

export function buildPreset(recipe) {
  const { calculator, publishing, title, summary } = recipe.frontmatter
  const formula = normalizedFormula(recipe)
  const byKey = new Map(formula.map((row) => [row.key, row]))
  const flourRows = formula.filter((row) => row.group === 'flours')
  const extras = formula
    .filter((row) => !['flours', 'main'].includes(row.group))
    .map(({ group, key, percent }) => ({ group, key, percent }))
  const main = calculator.main
  const baseFlourKey = main.baseFlourKey
  const scaldRows = normalizedStageFormula(recipe).filter((row) => row.type === 'scald')
  const scaldFlour = scaldRows.find((row) => row.group === 'flours')
  const scaldWater = scaldRows.find((row) => row.key === 'water')

  const preset = {
    key: calculator.preset_key,
    group: calculator.group,
    name: title,
    description: summary,
    recipeUrl: publishing.canonical_url,
    main: {
      enabled: {
        water: byKey.has('water'),
        salt: byKey.has('salt'),
        yeast: byKey.has('yeast'),
      },
      flour: main.flour,
      baseFlourKey,
      ...(flourRows.filter((row) => row.key !== baseFlourKey).length > 0
        ? { flourBlend: Object.fromEntries(flourRows.filter((row) => row.key !== baseFlourKey).map((row) => [row.key, row.percent])) }
        : {}),
      ...(byKey.has('water') ? { water: byKey.get('water').percent } : {}),
      ...(byKey.has('salt') ? { salt: byKey.get('salt').percent } : {}),
      ...(byKey.has('yeast') ? { yeast: byKey.get('yeast').percent } : {}),
      yeastType: main.yeastType,
      bulkFermentationMode: main.bulkFermentationMode,
      proofingMode: main.proofingMode,
      mainWaterTempF: main.mainWaterTempF,
      showWaterTemps: main.showWaterTemps,
    },
    extras,
    scalds: scaldFlour && scaldWater ? {
      scandinavianScald: {
        enabled: true,
        flourPercent: scaldFlour.percent,
        waterRatio: rounded(scaldWater.percent / scaldFlour.percent),
        flourSource: scaldFlour.key,
      },
    } : {},
  }

  return preset
}

export function buildFeaturedCard(recipe, preset) {
  const water = normalizedFormula(recipe).find((row) => row.key === 'water')
  const dairy = normalizedFormula(recipe).find((row) => row.group === 'dairy')
  const firstProcessHeading = [...recipe.sections.get('Process').matchAll(/^###\s+\d+\.\s+(.+)$/gm)][0]?.[1]

  return {
    key: preset.key,
    title: recipe.frontmatter.title,
    hydrationLabel: dairy ? `${water.percent}% water + ${dairy.percent}% ${dairy.ingredient.toLowerCase()}` : `${water.percent}% hydration`,
    processTag: firstProcessHeading ?? recipe.frontmatter.category,
    blurb: recipe.frontmatter.calculator.featured_card.blurb,
    cta: `Use ${recipe.frontmatter.title}`,
  }
}

export function renderValidationReport(recipe, result) {
  const status = result.errors.length > 0 ? 'blocked' : result.warnings.length > 0 ? 'review required' : 'passed'
  const lines = [
    `# ${recipe.frontmatter.title} validation report`,
    '',
    `- Source: \`${path.basename(recipe.filePath)}\``,
    `- Status: **${status}**`,
    `- Errors: ${result.errors.length}`,
    `- Warnings: ${result.warnings.length}`,
    '',
    '## Errors',
    '',
    ...(result.errors.length ? result.errors.map((error) => `- ${error}`) : ['- None.']),
    '',
    '## Warnings',
    '',
    ...(result.warnings.length ? result.warnings.map((warning) => `- ${warning}`) : ['- None.']),
    '',
    '## Review items',
    '',
    ...(recipe.frontmatter.review_required ?? []).map((item) => `- \`${item.field}\`: ${item.reason}`),
    '',
  ]

  return lines.join('\n')
}

export function renderPresetModule(recipes) {
  const presets = recipes.map(buildPreset)
  const featuredCards = recipes
    .filter((recipe) => recipe.frontmatter.calculator.featured_card?.enabled)
    .map((recipe) => buildFeaturedCard(recipe, buildPreset(recipe)))

  return `// Generated from recipes/source. Do not hand-edit.\nexport const recipePresets = ${toJs(presets)}\n\nexport const featuredRecipePresets = ${toJs(featuredCards)}\n`
}

export function renderVitePress(recipe) {
  const metadata = recipe.frontmatter
  const narrativeSections = ['Goal', 'Recipe Glance', 'Why This Recipe Works', 'Formula', 'Ingredients (Example Batch)', 'Scald Note', 'Process', 'Dough Feel And Handling', 'Pan Loaf Recommendation', 'Storage', 'Related Guides', 'Get the Gear']
  const chunks = [
    '---',
    `title: ${metadata.title}`,
    `description: ${metadata.publishing.description}`,
    `canonical: ${metadata.publishing.canonical_url}`,
    'generated_from: recipes/source',
    '---',
    '',
    `# ${metadata.title}`,
    '',
  ]

  for (const title of narrativeSections) {
    const content = recipe.sections.get(title)
    if (!content) continue
    chunks.push(`## ${title}`, '', content, '')
  }

  chunks.push('## Manual Review Needed', '')
  for (const item of metadata.review_required) chunks.push(`- **${item.field}**: ${item.reason}`)
  chunks.push('')
  return chunks.join('\n')
}

export function renderProductionSheet(recipe) {
  const formula = normalizedFormula(recipe)
  const flourGrams = recipe.frontmatter.production.yield.default_flour_grams
  const totalPercent = formula.reduce((sum, row) => sum + row.percent, 0)
  const totalGrams = formula.reduce((sum, row) => sum + weightFor(row.percent, flourGrams), 0)
  const lines = [
    `# ${recipe.frontmatter.title} production sheet`,
    '',
    '> Generated review artifact. Do not treat this sheet as production-ready while review items remain.',
    '',
    '## Batch header',
    '',
    '| Field | Value |',
    '| --- | --- |',
    `| Formula ID | ${recipe.frontmatter.id} |`,
    `| Default flour | ${formatGrams(flourGrams)} |`,
    `| Target yield | ${recipe.frontmatter.production.yield.yield_label} |`,
    `| Expected total dough | ${formatGrams(totalGrams)} |`,
    '',
    '## Formula',
    '',
    '| Ingredient | Baker\'s % | 1x batch | 2x batch |',
    '| --- | ---: | ---: | ---: |',
    ...formula.map((row) => `| ${row.ingredient} | ${formatPercent(row.percent)} | ${formatGrams(weightFor(row.percent, flourGrams))} | ${formatGrams(weightFor(row.percent, flourGrams * 2))} |`),
    `| **Total dough** | **${formatPercent(totalPercent)}** | **${formatGrams(totalGrams)}** | **${formatGrams(totalGrams * 2)}** |`,
    '',
  ]

  const stageFormula = normalizedStageFormula(recipe)
  if (stageFormula.length > 0) {
    lines.push('## Stage allocation', '', '| Stage | Ingredient | 1x batch | Notes |', '| --- | --- | ---: | --- |')
    for (const row of stageFormula) lines.push(`| ${row.stage} | ${row.ingredient} | ${formatGrams(weightFor(row.percent, flourGrams))} | ${row.notes || ''} |`)
    lines.push('')
  }

  lines.push('## Equipment', '', ...recipe.frontmatter.production.equipment.map((item) => `- ${item}`), '')
  lines.push('## Production timeline', '', '| Step | Duration | Temperature | Endpoint |', '| --- | --- | --- | --- |')
  for (const row of recipe.productionSteps?.rows ?? []) {
    lines.push(`| ${row.Step} | ${row.Duration} | ${row.Temperature} | ${row.Endpoint} |`)
  }
  lines.push('', '## Quality checks', '', ...recipe.frontmatter.production.quality_checks.map((item) => `- ${item}`), '')
  lines.push('## Manual review needed', '', ...recipe.frontmatter.review_required.map((item) => `- **${item.field}**: ${item.reason}`), '')
  return lines.join('\n')
}

export function normalizedFormula(recipe) {
  return (recipe.formula?.rows ?? []).map((row) => ({
    ingredient: row.Ingredient,
    key: row.Key,
    group: row.Group,
    percent: parseNumber(row["Baker's %"]),
    exampleWeight: parseGrams(row['Example Weight']),
    notes: row.Notes,
  }))
}

export function normalizedStageFormula(recipe) {
  return (recipe.stageFormula?.rows ?? []).map((row) => ({
    stage: row.Stage,
    type: row.Type,
    ingredient: row.Ingredient,
    key: row.Key,
    group: normalizedFormula(recipe).find((formulaRow) => formulaRow.key === row.Key)?.group,
    percent: parseNumber(row["Baker's %"]),
    notes: row.Notes,
  }))
}

function validatePublishing(metadata, errors) {
  const publishing = metadata.publishing
  if (!publishing) return errors.push('publishing is required.')
  if (typeof publishing.vitepress !== 'boolean') errors.push('publishing.vitepress must be true or false.')
  if (metadata.public_status === 'published') {
    if (publishing.vitepress !== true) errors.push('Published recipes must set publishing.vitepress to true.')
    requireValue(errors, publishing.description, 'publishing.description')
    requireValue(errors, publishing.canonical_url, 'publishing.canonical_url')
  }
}

function validateCalculator(metadata, errors) {
  const calculator = metadata.calculator
  if (!calculator) return errors.push('calculator is required.')
  if (calculator.preset !== true) return
  for (const key of ['preset_key', 'group']) requireValue(errors, calculator[key], `calculator.${key}`)
  for (const key of ['flour', 'baseFlourKey', 'yeastType', 'bulkFermentationMode', 'proofingMode']) {
    requireValue(errors, calculator.main?.[key], `calculator.main.${key}`)
  }
}

function validateProduction(metadata, recipe, errors, warnings) {
  const production = metadata.production
  if (!production) return errors.push('production is required.')
  requireValue(errors, production.yield?.default_flour_grams, 'production.yield.default_flour_grams')
  requireValue(errors, production.yield?.yield_label, 'production.yield.yield_label')
  if (!Array.isArray(production.equipment) || production.equipment.length === 0) errors.push('production.equipment must contain at least one item.')
  if (!production.bake) errors.push('production.bake is required.')
  if (!Array.isArray(production.quality_checks) || production.quality_checks.length === 0) errors.push('production.quality_checks must contain at least one item.')
  if (!recipe.productionSteps && !recipe.sections.has('Process')) errors.push('Production needs ## Production Steps or ## Process.')
  if (metadata.production_status === 'ready' && metadata.review_required.length > 0) {
    errors.push('production_status ready cannot have unresolved review_required items.')
  }
  if (metadata.production_status === 'needs-review') warnings.push('Production output is a review artifact, not a ready production specification.')
}

function validateFormula(recipe, errors) {
  const table = recipe.formula
  if (!table) return errors.push('Missing Formula table.')
  for (const header of REQUIRED_FORMULA_HEADERS) if (!table.headers.includes(header)) errors.push(`Formula table is missing "${header}".`)
  const rows = normalizedFormula(recipe)
  const flourRows = rows.filter((row) => row.group === 'flours')
  if (flourRows.length === 0) errors.push('Formula must include at least one flours row.')
  const flourTotal = flourRows.reduce((sum, row) => sum + row.percent, 0)
  if (Math.abs(flourTotal - 100) > 0.001) errors.push(`Flour percentages must total 100; found ${flourTotal}.`)
  const flourGrams = recipe.frontmatter.production?.yield?.default_flour_grams
  for (const row of rows) {
    if (!row.ingredient || !row.key || !row.group || !Number.isFinite(row.percent) || !Number.isFinite(row.exampleWeight)) {
      errors.push('Every formula row needs ingredient, key, group, numeric Baker\'s %, and numeric Example Weight.')
      continue
    }
    if (Number.isFinite(flourGrams) && Math.abs(weightFor(row.percent, flourGrams) - row.exampleWeight) > 0.11) {
      errors.push(`${row.ingredient} Example Weight does not match the canonical formula table.`)
    }
  }
}

function validateStageFormula(recipe, errors) {
  if (!recipe.stageFormula) return
  const mainTotals = new Map(normalizedFormula(recipe).map((row) => [row.key, row.percent]))
  const stageTotals = new Map()
  for (const row of normalizedStageFormula(recipe)) {
    if (!row.stage || !row.type || !row.key || !Number.isFinite(row.percent)) {
      errors.push('Every Stage Formula row needs stage, type, key, and numeric Baker\'s %.')
      continue
    }
    stageTotals.set(row.key, (stageTotals.get(row.key) ?? 0) + row.percent)
  }
  for (const [key, percent] of mainTotals) {
    if (stageTotals.has(key) && Math.abs(stageTotals.get(key) - percent) > 0.001) {
      errors.push(`Stage Formula percentage for ${key} must total ${percent}; found ${stageTotals.get(key)}.`)
    }
  }
}

function validateYieldTable(recipe, errors) {
  const table = recipe.yieldTable
  if (!table) return errors.push('Missing Yield table.')
  if (!table.headers.includes('Batch Target') || !table.headers.includes('Value')) {
    return errors.push('Yield table must include Batch Target and Value columns.')
  }
  const values = Object.fromEntries(table.rows.map((row) => [row['Batch Target'], row.Value]))
  const flour = parseGrams(values['Default flour'])
  const expectedFlour = recipe.frontmatter.production?.yield?.default_flour_grams
  if (!Number.isFinite(flour)) errors.push('Yield table Default flour must be numeric grams.')
  if (Number.isFinite(flour) && Number.isFinite(expectedFlour) && Math.abs(flour - expectedFlour) > 0.01) {
    errors.push('Yield table Default flour must match production.yield.default_flour_grams.')
  }
  const total = parseGrams(values['Expected total dough'])
  const calculatedTotal = normalizedFormula(recipe).reduce((sum, row) => sum + weightFor(row.percent, expectedFlour), 0)
  if (!Number.isFinite(total)) errors.push('Yield table Expected total dough must be numeric grams.')
  if (Number.isFinite(total) && Math.abs(total - calculatedTotal) > 0.11) {
    errors.push('Yield table Expected total dough must match the canonical formula table.')
  }
}

function splitFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) throw new Error('Frontmatter must begin with ---.')
  const end = markdown.indexOf('\n---\n', 4)
  if (end === -1) throw new Error('Frontmatter closing delimiter not found.')
  return { frontmatterText: markdown.slice(4, end), body: markdown.slice(end + 5).trimStart() }
}

function extractSections(markdown) {
  const sections = new Map()
  const headings = [...markdown.matchAll(/^##\s+(.+)$/gm)]
  for (let index = 0; index < headings.length; index += 1) {
    const current = headings[index]
    const next = headings[index + 1]
    sections.set(current[1].trim(), markdown.slice(current.index + current[0].length, next?.index ?? markdown.length).trim())
  }
  return sections
}

function parseTable(section) {
  const lines = section.split(/\r?\n/).map((line) => line.trim())
  const start = lines.findIndex((line) => line.startsWith('|'))
  if (start === -1 || !lines[start + 1]?.includes('---')) return null
  const tableLines = lines.slice(start).filter((line) => line.startsWith('|'))
  const headers = splitTableRow(tableLines[0])
  return { headers, rows: tableLines.slice(2).map((line) => Object.fromEntries(headers.map((header, index) => [header, splitTableRow(line)[index] ?? '']))) }
}

function splitTableRow(line) {
  return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
}

function parseYaml(source) {
  const lines = source.split(/\r?\n/).map((raw) => ({ indent: raw.match(/^\s*/)[0].length, text: raw.trim() })).filter((line) => line.text)
  return parseYamlBlock(lines, 0, 0).value ?? {}
}

function parseYamlBlock(lines, start, indent) {
  if (lines[start]?.text.startsWith('- ')) return parseYamlArray(lines, start, indent)
  const value = {}
  let index = start
  while (index < lines.length && lines[index].indent === indent && !lines[index].text.startsWith('- ')) {
    const separator = lines[index].text.indexOf(':')
    if (separator < 0) { index += 1; continue }
    const key = lines[index].text.slice(0, separator).trim()
    const inline = lines[index].text.slice(separator + 1).trim()
    if (inline) { value[key] = parseScalar(inline); index += 1; continue }
    const child = lines[index + 1]
    if (!child || child.indent <= indent) { value[key] = null; index += 1; continue }
    const parsed = parseYamlBlock(lines, index + 1, child.indent)
    value[key] = parsed.value
    index = parsed.next
  }
  return { value, next: index }
}

function parseYamlArray(lines, start, indent) {
  const value = []
  let index = start
  while (index < lines.length && lines[index].indent === indent && lines[index].text.startsWith('- ')) {
    const entry = lines[index].text.slice(2).trim()
    const separator = entry.indexOf(':')
    if (separator <= 0) { value.push(parseScalar(entry)); index += 1; continue }
    const object = { [entry.slice(0, separator).trim()]: parseScalar(entry.slice(separator + 1).trim()) }
    index += 1
    while (index < lines.length && lines[index].indent > indent && !lines[index].text.startsWith('- ')) {
      const child = lines[index]
      const childSeparator = child.text.indexOf(':')
      if (childSeparator > 0) object[child.text.slice(0, childSeparator).trim()] = parseScalar(child.text.slice(childSeparator + 1).trim())
      index += 1
    }
    value.push(object)
  }
  return { value, next: index }
}

function parseScalar(value) {
  if (value === '') return null
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  if (value.startsWith('[') && value.endsWith(']')) return value.slice(1, -1).split(',').map((item) => parseScalar(item.trim())).filter(Boolean)
  return value.replace(/^['"]|['"]$/g, '')
}

function requireValue(errors, value, field) {
  if (value === undefined || value === null || value === '') errors.push(`${field} is required.`)
}

function validateEnum(errors, value, choices, field) {
  if (!choices.has(value)) errors.push(`${field} must be one of: ${[...choices].join(', ')}.`)
}

function parseNumber(value) {
  const normalized = String(value).trim()
  if (!/^-?\d+(?:\.\d+)?%?$/.test(normalized)) return Number.NaN
  return Number(normalized.replace('%', ''))
}

function parseGrams(value) {
  const normalized = String(value).trim()
  if (!/^-?\d+(?:\.\d+)?g$/i.test(normalized)) return Number.NaN
  return Number(normalized.slice(0, -1))
}

function weightFor(percent, flourGrams) { return rounded((percent / 100) * flourGrams) }
function rounded(value) { return Math.round(value * 1000) / 1000 }
function formatGrams(value) { return `${Number(value.toFixed(1)).toString()}g` }
function formatPercent(value) { return `${Number(value.toFixed(2)).toString()}%` }
function toJs(value) { return JSON.stringify(value, null, 2) }
