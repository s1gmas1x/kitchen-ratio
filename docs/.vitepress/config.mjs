import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KitchenRatio',
  description: 'Recipes, guides, and baker’s percentages — bake smarter with KitchenRatio.',

  themeConfig: {
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
          { text: 'French Baguette', link: '/recipes/french-baguette' },
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
    ]
  }
})