---
title: Fermentation & Proofing Planner
description: How KitchenRatio estimates bulk fermentation and proofing time using yeast percentage and temperature.

head:
  - - meta
    - name: description
      content: How KitchenRatio estimates bulk fermentation and proofing time using yeast percentage and temperature.
  - - meta
    - property: og:title
      content: Fermentation & Proofing Planner
  - - meta
    - property: og:description
      content: How KitchenRatio estimates bulk fermentation and proofing time using yeast percentage and temperature.
  - - meta
    - property: og:type
      content: article
  - - meta
    - property: og:url
      content: https://kitchenratio.com/guides/fermentation-and-proofing-planner.html

  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: Fermentation & Proofing Planner
  - - meta
    - name: twitter:description
      content: How KitchenRatio estimates bulk fermentation and proofing time using yeast percentage and temperature.

  - - link
    - rel: canonical
      href: https://kitchenratio.com/guides/fermentation-and-proofing-planner.html
---

# Fermentation & Proofing Planner

The calculator includes two timing helpers:
- **Bulk Fermentation**
- **Proofing**

These are yeast-aware, temperature-aware planning estimates. They are meant to speed up dialing in a process, not replace dough feel.

<div class="guide-glance">
  <div class="guide-glance-card">
    <strong>Best For</strong>
    <span>Using the calculator's timing helpers as a practical starting range.</span>
  </div>
  <div class="guide-glance-card">
    <strong>Focus</strong>
    <span>Yeast-aware estimates, temperature inputs, and the limits of the model.</span>
  </div>
  <div class="guide-glance-card">
    <strong>Read This Next</strong>
    <span>Fermentation and proofing guides if you want to pair the estimate with dough cues.</span>
  </div>
</div>

## Where It Shows Up

The planner cards appear when:
- Yeast is enabled
- Yeast percentage is greater than 0

If yeast is disabled or set to 0%, the cards are hidden.

## What You Can Control

Each stage (bulk and proofing) has the same controls:
- **Mode**: `Room` or `Cold`
- **Use actual room or refrigerator temp** toggle
- Optional stage temperature input in °F
- Celsius is shown below the Fahrenheit value for quick reference

If "Use actual" is off, the calculator uses stored defaults:
- Room: **72°F**
- Cold: **38°F**

Those defaults are also readable as:
- Room: **22°C**
- Cold: **3°C**

When "Use actual" is on, allowed ranges are:
- Room temp: **32-110°F**
- Cold temp: **32-60°F**

## How the Estimate Is Calculated

The estimate uses:
- Active yeast percentage
- Selected stage temperature
- Stage type (`bulk` or `proofing`)

Reference point:
- **1% yeast at 72°F**

Stage base times:
- **Bulk base**: 3.5 hours
- **Proof base**: 1.8 hours

Temperature and yeast scale the base time, then the result is clamped:
- Bulk clamp: **0.8 to 96 hours**
- Proof clamp: **0.4 to 72 hours**

Displayed output is a range:
- **Low** = estimate × 0.75
- **High** = estimate × 1.25

## Important Scope Notes

The timing model currently responds directly to:
- Yeast %
- Temperature

It does **not** directly model:
- Hydration %
- Flour strength/type
- Salt %
- Mixing intensity
- Dough development or handling

That is why the UI labels these as rough estimates.

## Presets and Defaults

Presets can preload bulk/proofing mode (room or cold).  
Applying a preset resets stage panels to closed and disables "Use actual temp" until you opt in.

Reset behavior returns fermentation planning to:
- Bulk mode: `room`
- Proof mode: `room`
- Use actual temp: `off`

## Practical Workflow

1. Pick a preset or set your formula manually.
2. Set yeast % to match your schedule.
3. Choose room/cold mode for bulk and proof.
4. Turn on actual temp if your kitchen or fridge runs warmer/cooler than typical.
5. Use the estimated range as a starting target, then confirm by dough behavior.

## Related Guides
<div class="content-section">

- [KitchenRatio Calculator](/guides/kitchenratio-calculator)
- [Fermentation](/guides/fermentation)
- [No-Knead vs Kneading](/guides/no-knead-vs-kneading)
- [Hydration](/guides/hydration)

</div>

## Get the Gear
<div class="content-section">

- [Baking Gear & Ingredients](/guides/baking-gear-and-ingredients)

</div>
