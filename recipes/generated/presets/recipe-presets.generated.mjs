// Generated from recipes/source. Do not hand-edit.
export const recipePresets = [
  {
    "key": "bread_french",
    "group": "Breads",
    "name": "French Bread",
    "description": "A simple no-knead French bread at 70% hydration with a crisp crust, tender interior, and straightforward handling.",
    "recipeUrl": "https://kitchenratio.com/recipes/french-bread.html",
    "main": {
      "enabled": {
        "water": true,
        "salt": true,
        "yeast": true
      },
      "flour": 350,
      "baseFlourKey": "breadFlour",
      "water": 70,
      "salt": 2,
      "yeast": 1,
      "yeastType": "instant",
      "bulkFermentationMode": "cold",
      "proofingMode": "room",
      "mainWaterTempF": 75,
      "showWaterTemps": true
    },
    "extras": [],
    "scalds": {}
  },
  {
    "key": "bread_grandmas_swedish_rye",
    "group": "Breads",
    "name": "Grandma's Swedish Rye",
    "description": "A practical reconstruction of a family Swedish rye bread, built around a hot rye scald and sized for modern home baking.",
    "recipeUrl": "https://kitchenratio.com/recipes/grandmas-swedish-rye.html",
    "main": {
      "enabled": {
        "water": true,
        "salt": true,
        "yeast": true
      },
      "flour": 1200,
      "baseFlourKey": "breadFlour",
      "flourBlend": {
        "ryeFlour": 35
      },
      "water": 75,
      "salt": 2,
      "yeast": 0.7,
      "yeastType": "instant",
      "bulkFermentationMode": "room",
      "proofingMode": "room",
      "mainWaterTempF": 75,
      "showWaterTemps": true
    },
    "extras": [
      {
        "group": "dairy",
        "key": "wholeMilk",
        "percent": 15
      },
      {
        "group": "sugars",
        "key": "molasses",
        "percent": 4
      },
      {
        "group": "fats",
        "key": "butter",
        "percent": 6
      }
    ],
    "scalds": {
      "scandinavianScald": {
        "enabled": true,
        "flourPercent": 35,
        "waterRatio": 1,
        "flourSource": "ryeFlour"
      }
    }
  }
]

export const featuredRecipePresets = [
  {
    "key": "bread_french",
    "title": "French Bread",
    "hydrationLabel": "70% hydration",
    "processTag": "Mixing",
    "blurb": "Everyday loaf preset for crusty bread workflow.",
    "cta": "Use French Bread"
  },
  {
    "key": "bread_grandmas_swedish_rye",
    "title": "Grandma's Swedish Rye",
    "hydrationLabel": "75% water + 15% whole milk",
    "processTag": "Make the rye scald",
    "blurb": "Pan-loaf rye with a boiling-water scald, molasses, and butter.",
    "cta": "Use Grandma's Swedish Rye"
  }
]
