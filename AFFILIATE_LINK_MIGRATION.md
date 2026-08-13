# Amazon Affiliate Link Migration

Issue #12 migrates KitchenRatio's Amazon links from `kitchenratio-20` to `kitchenrati05-20`. The site now builds every outbound URL from a stable product key in `docs/.vitepress/data/affiliate-products.mjs`; this file is the one-time audit trail and is intentionally not published with the site.

## Product mapping

Each legacy short link was resolved on August 12, 2026. The ASIN and resolved item below were then used to construct the direct replacement URL. All 20 replacement URLs returned HTTP 200 and retained the intended ASIN and `kitchenrati05-20` tag in a follow-up request.

| Product key | Legacy short URL | Resolved item | ASIN | Direct replacement URL |
| --- | --- | --- | --- | --- |
| `active-dry-yeast` | https://amzn.to/48vDCqw | Bob's Red Mill active dry yeast | `B078T4WKB8` | https://www.amazon.com/dp/B078T4WKB8?tag=kitchenrati05-20 |
| `artisan-bread-five-minutes` | https://amzn.to/4oBiDsn | Artisan Bread in Five Minutes a Day | `1250018285` | https://www.amazon.com/dp/1250018285?tag=kitchenrati05-20 |
| `bread-lame` | https://amzn.to/44Rh5TZ | Bread lame | `B01LY7NDQ9` | https://www.amazon.com/dp/B01LY7NDQ9?tag=kitchenrati05-20 |
| `glass-prep-bowls` | https://amzn.to/3KDrI5U | HillSpring glass prep bowls | `B0CP28D2CJ` | https://www.amazon.com/dp/B0CP28D2CJ?tag=kitchenrati05-20 |
| `half-sheet-pan-rack` | https://amzn.to/3Y8vcAB | Half sheet pan and cooling rack | `B0F1F6CB99` | https://www.amazon.com/dp/B0F1F6CB99?tag=kitchenrati05-20 |
| `instant-dry-yeast` | https://amzn.to/4iE5w8t | Scratch Gold instant rapid-rise yeast, 8 oz | `B08NTY72KJ` | https://www.amazon.com/dp/B08NTY72KJ?tag=kitchenrati05-20 |
| `king-arthur-bread-flour` | https://amzn.to/44NeXfW | King Arthur bread flour | `B000QSFW4A` | https://www.amazon.com/dp/B000QSFW4A?tag=kitchenrati05-20 |
| `kitchenaid-digital-scale` | https://amzn.to/48F9DfT | KitchenAid KQ908 digital scale | `B07YP9DCCM` | https://www.amazon.com/dp/B07YP9DCCM?tag=kitchenrati05-20 |
| `kitchenaid-pasta-extruder` | https://amzn.to/4pNxZuN | KitchenAid pasta extruder | `B01ENK4UV2` | https://www.amazon.com/dp/B01ENK4UV2?tag=kitchenrati05-20 |
| `kitchenaid-pasta-roller-set` | https://amzn.to/3XxXyEj | KitchenAid pasta roller set | `B01ENK4TT0` | https://www.amazon.com/dp/B01ENK4TT0?tag=kitchenrati05-20 |
| `kitchenaid-stand-mixer` | https://amzn.to/44EYHO4 | KitchenAid Classic 4.5-quart stand mixer | `B003OXNBYC` | https://www.amazon.com/dp/B003OXNBYC?tag=kitchenrati05-20 |
| `lodge-cast-iron-pizza-pan` | https://amzn.to/48SYI3m | Lodge cast iron pizza pan | `B0971MC534` | https://www.amazon.com/dp/B0971MC534?tag=kitchenrati05-20 |
| `lodge-combo-cooker` | https://amzn.to/4oLycOs | Lodge cast iron combo cooker | `B0009JKG9M` | https://www.amazon.com/dp/B0009JKG9M?tag=kitchenrati05-20 |
| `silicone-dough-scraper` | https://amzn.to/48zq4tZ | KitchenAid silicone bowl/dough scraper | `B07TJJTHXX` | https://www.amazon.com/dp/B07TJJTHXX?tag=kitchenrati05-20 |
| `silicone-pastry-mat` | https://amzn.to/44bphhL | Silicone pastry mat | `B0D2L6LZ1M` | https://www.amazon.com/dp/B0D2L6LZ1M?tag=kitchenrati05-20 |
| `stainless-steel-mixing-bowls` | https://amzn.to/4pnsmDZ | Baker's Signature stainless steel mixing bowls | `B0DQ1KX8ZC` | https://www.amazon.com/dp/B0DQ1KX8ZC?tag=kitchenrati05-20 |
| `the-perfect-loaf` | https://amzn.to/4pTk5aB | The Perfect Loaf | `0593138414` | https://www.amazon.com/dp/0593138414?tag=kitchenrati05-20 |
| `thermapen-one` | https://amzn.to/4oANnKc | ThermoWorks Thermapen ONE | `B0DC8FWCDT` | https://www.amazon.com/dp/B0DC8FWCDT?tag=kitchenrati05-20 |
| `thermomaven-instant-read-thermometer` | https://amzn.to/48moT2t | ThermoMaven instant-read thermometer | `B0DNMTK56N` | https://www.amazon.com/dp/B0DNMTK56N?tag=kitchenrati05-20 |
| `tramontina-bestow-braiser` | https://amzn.to/3MCdJOS | Tramontina Bestow enameled cast iron braiser, 4 quart | `B0DRRN9DGG` | https://www.amazon.com/dp/B0DRRN9DGG?tag=kitchenrati05-20 |

## Source coverage

| Product key | Occurrences | Source files |
| --- | ---: | --- |
| `active-dry-yeast` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `artisan-bread-five-minutes` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `bread-lame` | 3 | `docs/guides/baking-gear-and-ingredients.md`; `docs/recipes/french-bread.md` |
| `glass-prep-bowls` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `half-sheet-pan-rack` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `instant-dry-yeast` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `king-arthur-bread-flour` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `kitchenaid-digital-scale` | 15 | `docs/guides/baking-gear-and-ingredients.md`; `docs/guides/yield-planner.md`; `docs/recipes/brioche-early-butter-cold-ferment.md`; `docs/recipes/cold-iron-cloud-pan-pizza.md`; `docs/recipes/colorado-pizza-dough.md`; `docs/recipes/detroit-style-pan-pizza.md`; `docs/recipes/french-bread.md`; `docs/recipes/lightly-enriched-hoagie.md`; `docs/recipes/naan.md`; `docs/recipes/new-york-style-pizza.md`; `docs/recipes/pita.md`; `docs/recipes/roman-al-taglio-pizza.md`; `docs/recipes/sicilian-pan-pizza.md`; `docs/recipes/tortillas.md` |
| `kitchenaid-pasta-extruder` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `kitchenaid-pasta-roller-set` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `kitchenaid-stand-mixer` | 4 | `docs/guides/baking-gear-and-ingredients.md`; `docs/recipes/brioche-early-butter-cold-ferment.md`; `docs/recipes/grandmas-swedish-rye.md` |
| `lodge-cast-iron-pizza-pan` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `lodge-combo-cooker` | 3 | `docs/guides/baking-gear-and-ingredients.md`; `docs/recipes/french-bread.md` |
| `silicone-dough-scraper` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `silicone-pastry-mat` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `stainless-steel-mixing-bowls` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `the-perfect-loaf` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `thermapen-one` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `thermomaven-instant-read-thermometer` | 2 | `docs/guides/baking-gear-and-ingredients.md` |
| `tramontina-bestow-braiser` | 3 | `docs/guides/baking-gear-and-ingredients.md`; `docs/recipes/cold-iron-cloud-pan-pizza.md` |

Total: 20 products, 58 link occurrences, and 0 intentionally changed product destinations.

## Measurement boundaries

With analytics consent, KitchenRatio emits one `affiliate_click` event containing only the stable `product_key` and current `page_path`. It does not delay or block navigation, and it does not send the destination URL or visible link text. Without consent or an available analytics function, navigation continues and no event is emitted.

This site-side event measures outbound link clicks only. Amazon Associates reporting separately attributes ordered items and earnings to the tracking ID; it is not proof that a site click became an order, and KitchenRatio does not join the two data sets into a user profile.

## Validation completed

- Affiliate unit tests: 5 passed.
- Production build: passed.
- Rendered output: 58 tagged links, 58 stable product-key attributes, and 58 complete `sponsored noopener noreferrer` attribute sets; no legacy tag or short URL was rendered.
- Replacement reachability: all 20 direct product URLs returned HTTP 200 and retained their ASIN and new tag.
- Local link check: 1,436 internal targets across 40 rendered pages, with no broken targets.
- Playwright: the 20-card gear page passed at 1440x1000 and 390x844 with all product images loaded and no horizontal overflow. The browser check also confirmed one consented event per click, zero events when declined, and unblocked same-tab navigation.

## Amazon account checkpoint

Before merge/deployment, the Amazon Associates account owner must complete these signed-in checks because they cannot be established from repository access:

1. Confirm `kitchenrati05-20` is an active Tracking ID in Associates Central.
2. Run all 20 constructed direct URLs above through Amazon's Link Checker and confirm the intended Tracking ID is recognized.
3. Open each replacement and confirm its product matches the resolved item and the existing KitchenRatio label/image.
4. After deployment, make a test click and confirm the `kitchenrati05-20` Tracking ID appears in Amazon's reporting once reporting has updated.

The implementation validation covers URL construction, HTTP reachability, source coverage, link attributes, unknown keys, and legacy/raw-link regressions; it does not substitute for these account-side checks.
