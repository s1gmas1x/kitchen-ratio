import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KitchenRatio',
  description: 'Recipes, guides, and baker’s percentages - bake smarter with KitchenRatio.',

   head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    
    // Fonts are self-hosted; see scripts/download-fonts.sh
  ],


  sitemap: {
    hostname: 'https://kitchenratio.com',
    transformItems: (items) => {
      const calculatorPath = '/calculator'
      const hasCalculator = items.some((item) => {
        try {
          return new URL(item.url, 'https://kitchenratio.com').pathname === calculatorPath
        } catch {
          return false
        }
      })

      if (!hasCalculator) {
        items.push({ url: calculatorPath })
      }

      return items
    }
  },

  themeConfig: {
    externalLinkIcon: false,
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
      items: [{ text: 'Tortillas', link: '/recipes/tortillas' }]
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
