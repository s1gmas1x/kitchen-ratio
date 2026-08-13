const AMAZON_ASSOCIATE_TAG = 'kitchenrati05-20'

function buildAmazonProductUrl(asin) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`
}

const productDefinitions = {
  'active-dry-yeast': {
    asin: 'B078T4WKB8',
    label: "Bob's Red Mill Active Dry Yeast",
  },
  'artisan-bread-five-minutes': {
    asin: '1250018285',
    label: 'Artisan Bread in Five Minutes a Day',
  },
  'bread-lame': {
    asin: 'B01LY7NDQ9',
    label: 'Bread Lame',
  },
  'glass-prep-bowls': {
    asin: 'B0CP28D2CJ',
    label: 'Glass Prep Bowls',
  },
  'half-sheet-pan-rack': {
    asin: 'B0F1F6CB99',
    label: 'Half Sheet Pan and Cooling Rack',
  },
  'instant-dry-yeast': {
    asin: 'B08NTY72KJ',
    label: 'Scratch Gold Instant Dry Yeast',
  },
  'king-arthur-bread-flour': {
    asin: 'B000QSFW4A',
    label: 'King Arthur Bread Flour',
  },
  'kitchenaid-digital-scale': {
    asin: 'B07YP9DCCM',
    label: 'KitchenAid Digital Scale',
  },
  'kitchenaid-pasta-extruder': {
    asin: 'B01ENK4UV2',
    label: 'KitchenAid Pasta Extruder',
  },
  'kitchenaid-pasta-roller-set': {
    asin: 'B01ENK4TT0',
    label: 'KitchenAid Pasta Roller Set',
  },
  'kitchenaid-stand-mixer': {
    asin: 'B003OXNBYC',
    label: 'KitchenAid Classic Stand Mixer',
  },
  'lodge-cast-iron-pizza-pan': {
    asin: 'B0971MC534',
    label: 'Lodge Cast Iron Pizza Pan',
  },
  'lodge-combo-cooker': {
    asin: 'B0009JKG9M',
    label: 'Lodge Cast Iron Combo Cooker',
  },
  'silicone-dough-scraper': {
    asin: 'B07TJJTHXX',
    label: 'KitchenAid Silicone Dough Scraper',
  },
  'silicone-pastry-mat': {
    asin: 'B0D2L6LZ1M',
    label: 'Silicone Pastry Mat',
  },
  'stainless-steel-mixing-bowls': {
    asin: 'B0DQ1KX8ZC',
    label: "Baker's Signature Stainless Steel Mixing Bowls",
  },
  'the-perfect-loaf': {
    asin: '0593138414',
    label: 'The Perfect Loaf',
  },
  'thermapen-one': {
    asin: 'B0DC8FWCDT',
    label: 'ThermoWorks Thermapen ONE',
  },
  'thermomaven-instant-read-thermometer': {
    asin: 'B0DNMTK56N',
    label: 'ThermoMaven Instant-Read Thermometer',
  },
  'tramontina-bestow-braiser': {
    asin: 'B0DRRN9DGG',
    label: 'Tramontina Bestow Enameled Cast Iron Braiser Pan with Lid, 4-Quart',
  },
}

export const affiliateProducts = Object.freeze(
  Object.fromEntries(
    Object.entries(productDefinitions).map(([productKey, product]) => [
      productKey,
      Object.freeze({
        ...product,
        url: buildAmazonProductUrl(product.asin),
      }),
    ]),
  ),
)

export function getAffiliateProduct(productKey) {
  const product = affiliateProducts[productKey]

  if (!product) {
    throw new Error(`Unknown affiliate product key: ${productKey}`)
  }

  return product
}
