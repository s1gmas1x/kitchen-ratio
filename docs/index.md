---
title: KitchenRatio
description: Recipes, guides, and bakers percentages. Bake smarter with KitchenRatio.

head:
  - - meta
    - name: description
      content: Recipes, guides, and bakers percentages. Bake smarter with KitchenRatio.
  - - meta
    - property: og:title
      content: KitchenRatio
  - - meta
    - property: og:description
      content: Recipes, guides, and bakers percentages. Bake smarter with KitchenRatio.
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://kitchenratio.com
  - - meta
    - property: og:image
      content: https://kitchenratio.com/images/android-chrome-512x512.png

  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: KitchenRatio
  - - meta
    - name: twitter:description
      content: Recipes, guides, and bakers percentages. Bake smarter with KitchenRatio.
  - - meta
    - name: twitter:image
      content: https://kitchenratio.com/images/android-chrome-512x512.png

  - - link
    - rel: canonical
      href: https://kitchenratio.com

  - - script
    - type: application/ld+json
      children: |
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://kitchenratio.com",
          "name": "KitchenRatio",
          "description": "Recipes, guides, and bakers percentages. Bake smarter with KitchenRatio.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://kitchenratio.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }

layout: home
footer: false
hero:
  name: <span class="hero-logo">
      <img src="/logolighttrans.svg" class="logo-dark" alt="KitchenRatio" />
      <img src="/logodarktrans.svg" class="logo-light" alt="KitchenRatio" />
    </span>
  text: "Bake with Ratios, Not Recipes"
  tagline: "Master baker’s percentages, explore recipes, and improve your baking skills."
  actions:
    - theme: brand
      text: "Try the Calculator"
      link: "https://calculator.kitchenratio.com"
      target: "_blank"
    - theme: alt
      text: "Browse Guides"
      link: /guides/
    - theme: alt
      text: "Browse Recipes"
      link: /recipes/

features:
  - title: "Baker's Percentages Made Simple"
    details: "Understand hydration and ingredient ratios for consistent results. Quick reference for recipes instead of reading long recipe blogs, or watching long videos."
  - title: "Step-by-Step Guides"
    details: "Follow our recipes and tutorials for breads, pizza, flatbreads, and more."
  - title: "Quick Access Calculator"
    details: "Calculate dough hydration and ratios in seconds. Explore and easily adjust recipes."

---
