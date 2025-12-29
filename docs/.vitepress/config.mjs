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
    
    // Google Fonts
    [
      'link',
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' }
    ],
    [
      'link',
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap' }
    ]
  ],


  sitemap: {
    hostname: 'https://kitchenratio.com'
  },

  themeConfig: {
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
        link: 'https://calculator.kitchenratio.com',
        target: '_blank',
        rel: 'noopener noreferrer'
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
        { text: 'Convert Recipes with the Calculator', link: '/guides/calculator-for-recipes' },
        { text: "Baker's Percentage", link: '/guides/bakers-percentage' },
        { text: 'Hydration', link: '/guides/hydration' },
        { text: 'Enrichment', link: '/guides/enrichment' }
      ]
    },
    {
      text: 'Techniques',
      collapsed: false,
      items: [
        { text: 'Folding', link: '/guides/folding' },
        { text: 'Cold Fermentation', link: '/guides/cold-fermentation' }
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
        { text: 'Lightly Enriched Hoagie', link: '/recipes/lightly-enriched-hoagie' }
      ]
    },
    {
      text: 'Pizza',
      collapsed: false,
      items: [{ text: 'Colorado-Style Pizza Dough', link: '/recipes/colorado-pizza-dough' }]
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
