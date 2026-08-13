---
schema_version: 2
id: grandmas-swedish-rye
title: Grandma's Swedish Rye
slug: grandmas-swedish-rye
category: bread
tags: [rye, scald, enriched-dough, pan-loaf, family-recipe]
recipe_status: approved
public_status: published
production_status: needs-review
summary: A practical reconstruction of a family Swedish rye bread, built around a hot rye scald and sized for modern home baking.
testing_note: Reconstructed from a handwritten family note with minimal instructions. Treat as a respectful modern starting point, not an exact historical formula.
source:
  type: family-reconstruction
  notes: Based on a handwritten ingredient list. Exact original provenance is unknown.
review_required:
  - field: source.provenance
    reason: The family origin is known generally, but the exact original author is unknown.
  - field: stages.rye-scald
    reason: The original note appears to scald all rye flour with all boiling water, while this reconstruction uses a 1:1 partial rye scald.
  - field: production.yield.portions.grams_each
    reason: Four small pan loaves are stated, but a production standard loaf weight should be confirmed.
  - field: production.yield.pan.size
    reason: The source recommends small pans without exact dimensions.
  - field: production.storage
    reason: Commercial cooling, wrapping, shelf-life, and labeling rules are not specified.
publishing:
  vitepress: true
  description: A practical reconstruction of a family Swedish rye bread, built around a hot rye scald and sized for modern home baking.
  canonical_url: https://kitchenratio.com/recipes/grandmas-swedish-rye.html
  related_guides:
    - /guides/scalds
    - /guides/hydration
    - /guides/bakers-percentage
  affiliate_disclaimer: true
calculator:
  preset: true
  preset_key: bread_grandmas_swedish_rye
  group: Breads
  main:
    flour: 1200
    baseFlourKey: breadFlour
    yeastType: instant
    bulkFermentationMode: room
    proofingMode: room
    mainWaterTempF: 75
    showWaterTemps: true
  featured_card:
    enabled: true
    blurb: Pan-loaf rye with a boiling-water scald, molasses, and butter.
production:
  yield:
    default_flour_grams: 1200
    yield_label: about 4 small pan loaves
  equipment:
    - large heat-safe mixing bowl
    - cover
    - separate container for molasses water
    - stand mixer or mixing bowl
    - lightly greased bowl or tub
    - bench scraper
    - 4 small loaf pans
    - cooling rack
  bake:
    bake_temp_f: 375
    bake_minutes: 35-45
    endpoint: well browned and done through
    internal_temp_f: 200-205
  quality_checks:
    - Scald is thick and uniform with no dry rye.
    - Scald cools to warm before yeast is added.
    - Dough is smooth, sticky, and organized after folds.
    - Proofed loaves crown the pans and look aerated.
    - Baked loaves are well browned and reach about 200-205F internally.
  allergens: [wheat, milk]
---

## Goal

This is a reconstructed family recipe, not a claimed exact historical formula. It uses a hot rye scald adapted as a partial rye scald before the final dough is mixed.
Use the [KitchenRatio Calculator](https://kitchenratio.com/calculator/bread) to scale the batch while keeping percentages visible.

## Recipe Glance

| Field | Value |
| --- | --- |
| Style | Soft pan rye with a hot flour scald, mild sweetness, and everyday sandwich use in mind. |
| Yield | Example batch makes about 4 small pan loaves. |
| Best For | Home bakers who want a practical family-style Scandinavian rye starting point. |

## Why This Recipe Works

- The rye flour is scalded first, which softens the grain and improves water absorption.
- Bread flour provides enough structure for loaf pans.
- Milk, molasses, and butter round out the crumb.

## Formula

| Ingredient | Key | Group | Baker's % | Example Weight | Role | Notes |
| --- | --- | --- | ---: | ---: | --- | --- |
| Rye flour | ryeFlour | flours | 35 | 420g | scalded flour | Scalded at 1:1 water. |
| Bread flour | breadFlour | flours | 65 | 780g | structure flour | Added after the scald is loosened. |
| Water | water | main | 75 | 900g | hydration and scald water | 420g scald plus 480g final dough. |
| Whole milk | wholeMilk | dairy | 15 | 180g | enrichment/liquid |  |
| Salt | salt | main | 2 | 24g | seasoning/structure |  |
| Molasses | molasses | sugars | 4 | 48g | sweetness/color |  |
| Butter or margarine | butter | fats | 6 | 72g | tenderness/richness |  |
| Instant yeast | yeast | main | 0.7 | 8.4g | fermentation | Instant yeast reconstruction. |

## Stage Formula

| Stage | Type | Ingredient | Key | Baker's % | Example Weight | Notes |
| --- | --- | --- | --- | ---: | ---: | --- |
| Rye scald | scald | Rye flour | ryeFlour | 35 | 420g | All rye flour is allocated to the scald. |
| Rye scald | scald | Water | water | 35 | 420g | 1:1 water to rye flour. |
| Final dough | final | Water | water | 40 | 480g | Dissolve molasses here before mixing. |
| Final dough | final | Bread flour | breadFlour | 65 | 780g | Added after the scald is loosened. |
| Final dough | final | Whole milk | wholeMilk | 15 | 180g | Added to cooled scald. |
| Final dough | final | Salt | salt | 2 | 24g | Added to cooled scald. |
| Final dough | final | Molasses | molasses | 4 | 48g | Dissolved in remaining water. |
| Final dough | final | Butter or margarine | butter | 6 | 72g | Melted before mixing. |
| Final dough | final | Instant yeast | yeast | 0.7 | 8.4g | Added only after scald cools. |

## Process

### 1. Make the rye scald

- Pour 420g boiling water over rye flour and stir until thick and uniform.
- Reserve 480g water for the final dough.

### 2. Cool the scald

- Cover and cool until warm, not hot enough to damage yeast.

### 3. Mix the final dough

- Dissolve molasses in the remaining water, then combine it with the cooled scald, milk, melted butter, salt, and yeast.
- Add bread flour until no dry flour remains. The dough will be smooth and sticky.

### 4. Rest and fold

- Rest 30 minutes, fold, and repeat for three folds at 30-minute intervals.

### 5. Bulk ferment

- Let rise until puffy, usually 60-90 minutes after the final fold.

### 6. Divide and pan

- Divide into 4 pieces of about 608g each, shape gently, and place in greased loaf pans.

### 7. Proof

- Proof until the dough crowns the pans and looks aerated, usually 45-75 minutes.

### 8. Bake

- Bake at 375°F for 35-45 minutes until well browned and about 200-205°F internally.

### 9. Cool

- Turn out after a short rest and cool completely before slicing.

## Production Steps

| Step | Duration | Temperature | Endpoint | Equipment | Notes |
| --- | --- | --- | --- | --- | --- |
| Make scald | 5-10 minutes | Boiling water | Thick, uniform scald with no dry rye | Heat-safe bowl | 420g rye flour plus 420g water. |
| Cool scald | Until warm | Warm, not hot | Safe for yeast | Covered bowl | Exact target temperature needs review. |
| Mix final dough | 10-15 minutes | Room temperature | No dry flour; smooth and sticky | Mixer or bowl | Add bread flour in stages. |
| Rest and fold | 90 minutes | Room temperature | Dough tightens slightly | Covered bowl | Three folds at 30-minute intervals. |
| Bulk ferment | 60-90 minutes | Room temperature | Puffy and easier to move | Greased bowl or tub | Begins after final fold. |
| Divide and pan | 10-15 minutes | Room temperature | 4 shaped pan loaves | Bench scraper, loaf pans | About 608g each. |
| Proof | 45-75 minutes | Room temperature | Dough crowns pans | Loaf pans | Time varies by room temperature. |
| Bake | 35-45 minutes | 375°F | Well browned; 200-205°F internal | Oven, loaf pans | Pan size affects time. |

## Yield

| Batch Target | Value |
| --- | --- |
| Default flour | 1200g |
| Expected total dough | 2432.4g |
| Portions | 4 small pan loaves |
| Grams each | 608.1g |
| Pan or size | Small loaf pans; exact size needs review |

## Storage

Cool completely, then keep wrapped or bagged at room temperature for several days. It often slices best the next day.

## Related Guides

- [Scalds](/guides/scalds)
- [Hydration](/guides/hydration)
- [Baker's Percentage](/guides/bakers-percentage)

## Get the Gear

- [Baking Gear & Ingredients](/guides/baking-gear-and-ingredients)

> **Affiliate Disclaimer**
> This post contains affiliate links. As an Amazon Associate, I earn from qualifying purchases.
