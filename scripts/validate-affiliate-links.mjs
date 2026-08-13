import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { affiliateProducts } from '../docs/.vitepress/data/affiliate-products.mjs'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DOCS_ROOT = path.join(REPO_ROOT, 'docs')
const CATALOG_PATH = 'docs/.vitepress/data/affiliate-products.mjs'
const COMPONENT_PATH = 'docs/.vitepress/theme/components/AffiliateLink.vue'
const EXPECTED_ASSOCIATE_TAG = 'kitchenrati05-20'
const SOURCE_EXTENSIONS = new Set(['.html', '.js', '.md', '.mjs', '.vue'])
const SKIPPED_DIRECTORIES = new Set(['.cache', 'dist'])

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) {
        files.push(...await collectSourceFiles(path.join(directory, entry.name)))
      }
      continue
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(path.join(directory, entry.name))
    }
  }

  return files
}

export function validateAffiliateSource(relativePath, source, validProductKeys) {
  const errors = []

  if (relativePath !== CATALOG_PATH) {
    if (/https?:\/\/(?:www\.)?amzn\.to\//i.test(source)) {
      errors.push(`${relativePath}: legacy amzn.to URL found`)
    }

    if (/https?:\/\/(?:www\.)?amazon\.[a-z.]+\//i.test(source)) {
      errors.push(`${relativePath}: raw Amazon URL found outside the affiliate catalog`)
    }
  }

  const affiliateTagPattern = /<AffiliateLink\b[^>]*>/g
  for (const match of source.matchAll(affiliateTagPattern)) {
    const productKeyMatch = match[0].match(/\bproduct-key\s*=\s*["']([^"']+)["']/)

    if (!productKeyMatch) {
      errors.push(`${relativePath}: AffiliateLink must use a literal product-key`)
      continue
    }

    if (!validProductKeys.has(productKeyMatch[1])) {
      errors.push(`${relativePath}: unknown affiliate product key "${productKeyMatch[1]}"`)
    }
  }

  return errors
}

export function validateCatalog(products) {
  const errors = []
  const seenAsins = new Set()

  for (const [productKey, product] of Object.entries(products)) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productKey)) {
      errors.push(`catalog: invalid product key "${productKey}"`)
    }

    if (!/^[A-Z0-9]{10}$/.test(product.asin)) {
      errors.push(`catalog: invalid ASIN for "${productKey}"`)
    }

    if (seenAsins.has(product.asin)) {
      errors.push(`catalog: duplicate ASIN "${product.asin}"`)
    }
    seenAsins.add(product.asin)

    const expectedUrl = `https://www.amazon.com/dp/${product.asin}?tag=${EXPECTED_ASSOCIATE_TAG}`
    if (product.url !== expectedUrl) {
      errors.push(`catalog: unexpected URL for "${productKey}"`)
    }

    if (!product.label?.trim()) {
      errors.push(`catalog: missing label for "${productKey}"`)
    }
  }

  return errors
}

export function validateComponentContract(source) {
  const errors = []

  if (!source.includes('rel="sponsored noopener noreferrer"')) {
    errors.push(`${COMPONENT_PATH}: required affiliate rel attributes are missing`)
  }

  if (!source.includes(':data-affiliate-product-key="productKey"')) {
    errors.push(`${COMPONENT_PATH}: stable analytics product key is missing`)
  }

  return errors
}

async function main() {
  const validProductKeys = new Set(Object.keys(affiliateProducts))
  const referencedProductKeys = new Set()
  const sourceFiles = await collectSourceFiles(DOCS_ROOT)
  const errors = validateCatalog(affiliateProducts)
  let linkCount = 0

  for (const filePath of sourceFiles) {
    const relativePath = path.relative(REPO_ROOT, filePath).split(path.sep).join('/')
    const source = await readFile(filePath, 'utf8')
    errors.push(...validateAffiliateSource(relativePath, source, validProductKeys))

    for (const match of source.matchAll(/<AffiliateLink\b[^>]*\bproduct-key\s*=\s*["']([^"']+)["'][^>]*>/g)) {
      referencedProductKeys.add(match[1])
      linkCount += 1
    }

    if (relativePath === COMPONENT_PATH) {
      errors.push(...validateComponentContract(source))
    }
  }

  for (const productKey of validProductKeys) {
    if (!referencedProductKeys.has(productKey)) {
      errors.push(`catalog: product key "${productKey}" is not used by site content`)
    }
  }

  if (errors.length > 0) {
    console.error('Affiliate link validation failed:')
    for (const error of errors) console.error(`- ${error}`)
    process.exitCode = 1
    return
  }

  console.log(`Validated ${linkCount} affiliate links across ${validProductKeys.size} catalog products.`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main()
}
