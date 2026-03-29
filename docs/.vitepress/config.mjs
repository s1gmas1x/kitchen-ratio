import { defineConfig } from 'vitepress'

const calculatorSitemapPaths = [
  '/calculator',
  '/calculator/pizza',
  '/calculator/bread',
  '/calculator/flatbread',
  '/calculator/pizza/new-york',
  '/calculator/pizza/detroit',
  '/calculator/pizza/midwest-thin',
  '/calculator/bread/french-bread',
  '/calculator/flatbread/tortillas',
]

export default defineConfig({
  title: 'KitchenRatio',
  description: 'Recipes, guides, and baker’s percentages - bake smarter with KitchenRatio.',

   head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/kitchenratio-icon-64.png', sizes: '64x64' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/kitchenratio-icon-180.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    
    // Fonts are self-hosted; see scripts/download-fonts.sh
  ],


  sitemap: {
    hostname: 'https://kitchenratio.com',
    transformItems: (items) => {
      const existingPaths = new Set(
        items.flatMap((item) => {
          try {
            return [new URL(item.url, 'https://kitchenratio.com').pathname]
          } catch {
            return []
          }
        }),
      )

      for (const path of calculatorSitemapPaths) {
        if (!existingPaths.has(path)) {
          items.push({ url: path })
        }
      }

      return items
    }
  },

  themeConfig: {
    externalLinkIcon: false,
    notFound: {
      title: 'PAGE NOT FOUND',
      quote: "This page must have over-proofed. Let's get you back before it collapses.",
      linkLabel: 'go to home',
      linkText: 'Take me home',
    },
    logo: {
      light: '/logo2darktrans.svg', // shown in light mode
      dark: '/logo2lighttrans.svg',   // shown in dark mode
      alt: 'KitchenRatio'
    },
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'Recipes', link: '/recipes/' },
      { text: 'Ingredients', link: '/ingredients/' },
      {
        text: 'Calculator',
        link: 'https://kitchenratio.com/calculator'
      }
    ],

    sidebar: {
  // Guides section
  '/guides/': [
    {
      text: 'Guides',
      collapsed: false,
      items: [{ text: 'Browse Guides', link: '/guides/' }]
    },
    {
      text: 'Getting Started',
      collapsed: false,
      items: [{ text: 'Getting Started With KitchenRatio', link: '/guides/getting-started' }]
    },
    {
      text: 'Core Concepts',
      collapsed: false,
      items: [
        { text: 'KitchenRatio Calculator', link: '/guides/kitchenratio-calculator' },
        { text: 'Fermentation & Proofing Planner', link: '/guides/fermentation-and-proofing-planner' },
        { text: 'Convert Recipes with the Calculator', link: '/guides/calculator-for-recipes' },
        { text: 'Yield Planner', link: '/guides/yield-planner' },
        { text: "Baker's Percentage", link: '/guides/bakers-percentage' },
        { text: 'Hydration', link: '/guides/hydration' },
        { text: 'Enrichment', link: '/guides/enrichment' }
      ]
    },
    {
      text: 'Techniques',
      collapsed: false,
      items: [
        { text: 'Fermentation', link: '/guides/fermentation' },
        { text: 'Proofing', link: '/guides/proofing' },
        { text: 'Preferments', link: '/guides/preferments' },
        { text: 'Scalds', link: '/guides/scalds' },
        { text: 'No-Knead vs Kneading', link: '/guides/no-knead-vs-kneading' },
        { text: 'Folding', link: '/guides/folding' }
      ]
    },
    {
      text: 'Gear',
      collapsed: false,
      items: [{ text: 'Baking Gear & Ingredients', link: '/guides/baking-gear-and-ingredients' }]
    }
  ],

  // Recipes section
  '/recipes/': [
    {
      text: 'Recipes',
      collapsed: false,
      items: [{ text: 'Browse Recipes', link: '/recipes/' }]
    },
    {
      text: 'Breads',
      collapsed: false,
      items: [
        { text: 'French Bread', link: '/recipes/french-bread' },
        { text: 'Lightly Enriched Hoagie', link: '/recipes/lightly-enriched-hoagie' },
        { text: 'Brioche (Early Butter, Cold Ferment)', link: '/recipes/brioche-early-butter-cold-ferment' }
      ]
    },
    {
      text: 'Pizza',
      collapsed: false,
      items: [
        { text: 'Colorado-Style Pizza Dough', link: '/recipes/colorado-pizza-dough' },
        { text: "Margot's Midwest Thin (Deck)", link: '/recipes/margots-midwest-thin-deck-pizza' },
        { text: 'Cold Iron Cloud Pan Pizza', link: '/recipes/cold-iron-cloud-pan-pizza' },
        { text: 'New York Style Pizza (Home-Oven Optimized)', link: '/recipes/new-york-style-pizza' },
        { text: 'Detroit Style Pan Pizza', link: '/recipes/detroit-style-pan-pizza' },
        { text: 'Sicilian Pan Pizza', link: '/recipes/sicilian-pan-pizza' },
        { text: 'Roman Pizza al Taglio (High Hydration)', link: '/recipes/roman-al-taglio-pizza' }
      ]
    },
    {
      text: 'Flatbreads',
      collapsed: false,
      items: [
        { text: 'Tortillas', link: '/recipes/tortillas' },
        { text: 'Pita Bread', link: '/recipes/pita' },
        { text: 'Yogurt Naan', link: '/recipes/naan' }
      ]
    }
  ],

  // Ingredients section
  '/ingredients/': [
    {
      text: 'Ingredients',
      collapsed: false,
      items: [
        { text: 'Flour', link: '/ingredients/flour' },
        { text: 'Water', link: '/ingredients/water' },
        { text: 'Salt', link: '/ingredients/salt' },
        { text: 'Yeast', link: '/ingredients/yeast' }
      ]
    }
  ]
},

    socialLinks: [
      // Add when ready: { icon: 'github', link: 'https://github.com/yourusername/kitchenratio' }
    ],
     
  }
})
