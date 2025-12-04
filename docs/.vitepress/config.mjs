import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KitchenRatio',
  description: 'Recipes, guides, and baker’s percentages - bake smarter with KitchenRatio.',

   head: [
   

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
      { text: 'How-To Guides', link: '/guides/' },
      { text: 'Recipes', link: '/recipes/' },
      {
        text: 'Calculator',
        link: 'https://calculator.kitchenratio.com',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    ],

    sidebar: [
      {
        text: 'Guides',
        collapsed: false,
        items: [
          { text: 'Browse Guides', link: '/guides/' },
          { text: "Baker's Percentage", link: '/guides/bakers-percentage' },
          { text: 'Hydration', link: '/guides/hydration' },
          { text: 'Enrichment', link: '/guides/enrichment' },
          { text: 'Folding & Shaping', link: '/guides/folding-and-shaping' },
          { text: 'Cold Fermentation', link: '/guides/cold-fermentation' }
        ]
      },

      {
        text: 'Recipes',
        collapsed: false,
        items: [
          { text: 'Browse Recipes', link: '/recipes/' },
          { text: 'French Bread', link: '/recipes/french-bread' },
          { text: 'Lightly Enriched Hoagie', link: '/recipes/lightly-enriched-hoagie' },
          { text: 'Colorado Style Pizza', link: '/recipes/colorado-pizza-dough' },
          { text: 'No-Knead Tortillas', link: '/recipes/tortillas' }
        ]
      },

      {
        text: 'Ingredients',
        collapsed: true,
        items: [
          { text: 'Flour', link: '/ingredients/flour' },
          { text: 'Water', link: '/ingredients/water' },
          { text: 'Salt', link: '/ingredients/salt' },
          { text: 'Yeast', link: '/ingredients/yeast' }
        ]
      }
    ],

    socialLinks: [
      // Add when ready: { icon: 'github', link: 'https://github.com/yourusername/kitchenratio' }
    ],
        footer: {
      message: 'As an Amazon Associate I earn from qualifying purchases.',
      copyright: '© 2025 KitchenRatio'
    }
  }
})
