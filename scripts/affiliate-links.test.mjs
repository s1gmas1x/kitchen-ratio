import assert from 'node:assert/strict'
import test from 'node:test'

import {
  affiliateProducts,
  getAffiliateProduct,
} from '../docs/.vitepress/data/affiliate-products.mjs'
import { emitAffiliateClick } from '../docs/.vitepress/theme/affiliate-analytics.mjs'
import {
  validateAffiliateSource,
  validateCatalog,
  validateComponentContract,
} from './validate-affiliate-links.mjs'

const productKeys = new Set(Object.keys(affiliateProducts))

test('catalog uses the new tracking ID and valid stable keys', () => {
  assert.deepEqual(validateCatalog(affiliateProducts), [])
  assert.match(
    getAffiliateProduct('kitchenaid-digital-scale').url,
    /\?tag=kitchenrati05-20$/,
  )
  assert.throws(() => getAffiliateProduct('missing-product'), /Unknown affiliate product key/)
})

test('source validation rejects legacy, raw, missing, and unknown affiliate links', () => {
  assert.deepEqual(
    validateAffiliateSource(
      'docs/example.md',
      '[Old](https://amzn.to/example)',
      productKeys,
    ),
    ['docs/example.md: legacy amzn.to URL found'],
  )

  assert.deepEqual(
    validateAffiliateSource(
      'docs/example.md',
      '<a href="https://www.amazon.com/dp/B07YP9DCCM">Raw</a>',
      productKeys,
    ),
    ['docs/example.md: raw Amazon URL found outside the affiliate catalog'],
  )

  assert.deepEqual(
    validateAffiliateSource('docs/example.md', '<AffiliateLink>Missing</AffiliateLink>', productKeys),
    ['docs/example.md: AffiliateLink must use a literal product-key'],
  )

  assert.deepEqual(
    validateAffiliateSource(
      'docs/example.md',
      '<AffiliateLink product-key="missing-product">Unknown</AffiliateLink>',
      productKeys,
    ),
    ['docs/example.md: unknown affiliate product key "missing-product"'],
  )
})

test('affiliate component contract includes disclosure and analytics attributes', () => {
  assert.deepEqual(
    validateComponentContract(`
      <a
        rel="sponsored noopener noreferrer"
        :data-affiliate-product-key="productKey"
      ></a>
    `),
    [],
  )
})

test('consented affiliate clicks emit only the stable key and page path', () => {
  const calls = []
  const anchor = {
    dataset: { affiliateProductKey: 'kitchenaid-digital-scale' },
  }
  const eventTarget = {
    closest: (selector) => selector === 'a[data-affiliate-product-key]' ? anchor : null,
  }

  const emitted = emitAffiliateClick({
    eventTarget,
    hasAnalyticsConsent: true,
    pagePath: '/recipes/french-bread.html',
    gtag: (...args) => calls.push(args),
  })

  assert.equal(emitted, true)
  assert.deepEqual(calls, [[
    'event',
    'affiliate_click',
    {
      product_key: 'kitchenaid-digital-scale',
      page_path: '/recipes/french-bread.html',
    },
  ]])
})

test('affiliate analytics are inert without consent, gtag, or a product key', () => {
  const anchorTarget = {
    closest: () => ({ dataset: { affiliateProductKey: 'bread-lame' } }),
  }
  const calls = []

  assert.equal(emitAffiliateClick({
    eventTarget: anchorTarget,
    hasAnalyticsConsent: false,
    pagePath: '/recipes/french-bread.html',
    gtag: (...args) => calls.push(args),
  }), false)

  assert.equal(emitAffiliateClick({
    eventTarget: anchorTarget,
    hasAnalyticsConsent: true,
    pagePath: '/recipes/french-bread.html',
    gtag: undefined,
  }), false)

  assert.equal(emitAffiliateClick({
    eventTarget: { closest: () => null },
    hasAnalyticsConsent: true,
    pagePath: '/recipes/french-bread.html',
    gtag: (...args) => calls.push(args),
  }), false)

  assert.deepEqual(calls, [])
})
