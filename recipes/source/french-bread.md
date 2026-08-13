---
schema_version: 2
id: french-bread
title: French Bread
slug: french-bread
category: bread
tags: [no-knead, cold-ferment, lean-dough, dutch-oven]
recipe_status: approved
public_status: published
production_status: needs-review
summary: A simple no-knead French bread at 70% hydration with a crisp crust, tender interior, and straightforward handling.
testing_note:
source:
  type: unknown
  notes: Original copied recipe does not state provenance.
review_required:
  - field: source.type
    reason: Source/provenance is not stated in the original recipe.
  - field: production.yield.portions
    reason: Yield says one medium loaf or two smaller loaves, but exact portion weights are not defined.
  - field: production.steps.proof
    reason: Proofing is described by feel, not a time range.
  - field: production.bake.internal_temp_f
    reason: Bake endpoint is color-based; no internal temperature is specified.
publishing:
  vitepress: true
  description: A simple no-knead French bread with 70% hydration. Perfectly crispy on the outside and tender inside.
  canonical_url: https://kitchenratio.com/recipes/french-bread.html
  image:
    src: /images/recipes/french-bread.jpg
    alt: French bread fresh from the oven
  related_guides:
    - /guides/no-knead-vs-kneading
    - /guides/folding
    - /guides/hydration
  affiliate_disclaimer: true
calculator:
  preset: true
  preset_key: bread_french
  group: Breads
  main:
    flour: 350
    baseFlourKey: breadFlour
    yeastType: instant
    bulkFermentationMode: cold
    proofingMode: room
    mainWaterTempF: 75
    showWaterTemps: true
  featured_card:
    enabled: true
    blurb: Everyday loaf preset for crusty bread workflow.
production:
  yield:
    default_flour_grams: 350
    yield_label: one medium loaf or a pair of smaller loaves
  equipment:
    - mixing bowl
    - cover or lidded container
    - parchment
    - couche or towel-lined bowl
    - bread lame
    - spray bottle
    - Dutch oven, baking stone, or baking steel
  bake:
    preheat_temp_f: 480
    bake_temp_f: 440
    covered_minutes: 25
    uncovered_minutes: 20-25
    endpoint: golden crust
  quality_checks:
    - Dough is fully hydrated after mixing.
    - Dough gains strength during folds without becoming tight.
    - Final proof looks slightly puffy and relaxed.
    - Crust is golden after uncovered bake.
  allergens: [wheat]
---

## Goal

A simple no-knead French bread at 70% hydration: crisp crust, tender interior, and straightforward handling.
Use the [KitchenRatio Calculator](https://kitchenratio.com/calculator/bread/french-bread) to scale it without changing the ratio.

## Recipe Glance

| Field | Value |
| --- | --- |
| Style | Lean no-knead bread with a crisp crust and tender interior. |
| Yield | Example batch makes one medium loaf or a pair of smaller loaves. |
| Best For | Cold overnight fermentation, Dutch ovens, and straightforward everyday bread. |

## Formula

| Ingredient | Key | Group | Baker's % | Example Weight | Role | Notes |
| --- | --- | --- | ---: | ---: | --- | --- |
| Bread flour | breadFlour | flours | 100 | 350g | base flour | Original recipe says flour; preset uses breadFlour. |
| Water | water | main | 70 | 245g | hydration | Main dough water. |
| Salt | salt | main | 2 | 7g | seasoning/structure |  |
| Instant yeast | yeast | main | 1 | 3.5g | fermentation | Original recipe says yeast; preset uses instant yeast. |

## Ingredients (Example Batch)

- **Flour** - 350g
- **Water** - 245g (70% hydration)
- **Salt** - 7g (2%)
- **Instant dry yeast** - 3.5g (1%)

Need a scale? <AffiliateLink product-key="kitchenaid-digital-scale">KitchenAid Digital Scale</AffiliateLink>.

## Process

### 1. Mixing

- Combine flour, water, salt, and yeast until a rough dough forms.
- No kneading needed; hydrate thoroughly.

### 2. Bulk Fermentation (Cold)

- Cover and refrigerate for **12-18 hours**.
- Perform 2-3 folds every 30 minutes during the first 1-1.5 hours.
- Fold once more 8-12 hours before baking.

### 3. Pre-Shape

- Turn dough onto a lightly floured surface, divide if needed, and rest 20-30 minutes.

### 4. Final Shape

- Shape into a rough boule and use a couche or towel-lined bowl for support if needed.

### 5. Proofing

- Proof until slightly puffy and relaxed.

### 6. Scoring & Spritzing

- Score with a sharp blade at a shallow angle and lightly mist with water.

### 7. Baking

- Preheat to **480°F (249°C)**, then reduce to **440°F (227°C)** after loading.
- Bake covered for 25 minutes, then uncovered for 20-25 minutes until golden.

### 8. Cooling

- Cool completely before slicing.

## Production Steps

| Step | Duration | Temperature | Endpoint | Equipment | Notes |
| --- | --- | --- | --- | --- | --- |
| Mix | 5-10 minutes | 75°F target water | Rough dough with no dry flour | Mixing bowl | No kneading needed. |
| Cold bulk | 12-18 hours | Refrigerated | Dough fermented and easier to handle | Covered bowl | Fold during first 1-1.5 hours. |
| Pre-shape | 20-30 minutes | Room temperature | Dough relaxed after tightening | Bench surface | Divide if needed. |
| Proof | Manual review | Room temperature | Slightly puffy and relaxed | Couche or towel-lined bowl | Time range needs review. |
| Bake | 45-50 minutes | 440°F after 480°F preheat | Golden crust | Dutch oven, stone, or steel | Internal temperature needs review. |

## Yield

| Batch Target | Value |
| --- | --- |
| Default flour | 350g |
| Expected total dough | 605.5g |
| Portions | Manual review |
| Grams each | Manual review |
| Finished size | One medium loaf or two smaller loaves |

## Related Guides

- [No-Knead vs Kneading](/guides/no-knead-vs-kneading)
- [Folding](/guides/folding)
- [Hydration](/guides/hydration)

## Get the Gear

- [Baking Gear & Ingredients](/guides/baking-gear-and-ingredients)

> **Affiliate Disclaimer**
> This post contains affiliate links. As an Amazon Associate, I earn from qualifying purchases.
