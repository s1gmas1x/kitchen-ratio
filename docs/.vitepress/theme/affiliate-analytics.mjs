export function emitAffiliateClick({
  eventTarget,
  hasAnalyticsConsent,
  pagePath,
  gtag,
}) {
  if (!hasAnalyticsConsent || typeof gtag !== 'function') return false

  const anchor = eventTarget?.closest?.('a[data-affiliate-product-key]')
  const productKey = anchor?.dataset?.affiliateProductKey?.trim()
  if (!productKey) return false

  gtag('event', 'affiliate_click', {
    product_key: productKey,
    page_path: pagePath,
  })

  return true
}
