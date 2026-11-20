export const brand = {
  "name": "Manufaktura",
  "legalName": "Manufaktura",
  "logo": "./media/logo.svg",
  "shop": "https://manufaktura.cz/",
  "category": "https://manufaktura.cz/pletova-sera-oleje-elixiry/",
  "contact": "https://manufaktura.cz/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/hyal.webp",
  "heroAlt": "HydraLift Sedmikráska",
  "heroSecondary": "./media/cream.webp",
  "title": "Dopřejte pleti správnou vrstvu",
  "intro": "Vyberte sérum, krém nebo olej podle textury a zaměření. Sestavte si jednoduchou rutinu Sedmikráska.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "CZK",
  "availableLabel": "Skladem",
  "budgets": [
    429,
    459,
    479,
    529
  ],
  "chatSuggestions": [
    "Jak použít HydraLift Sedmikráska?",
    "Porovnej HydraLift Sedmikráska a Happy Morning",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Na čistou pleť nejprve naneste sérum, poté krém. Pokud použijete olej, patří až na závěr.",
  "steps": [
    {
      "id": "care-1",
      "name": "Sérum pod krém",
      "description": "Hydratace nebo rozjasnění",
      "photo": "hyal",
      "title": "Co má být hlavním účelem séra?",
      "choices": [
        {
          "title": "Hydratace bez parfemace",
          "hint": "2 % kyseliny hyaluronové, niacinamid a sedmikráska",
          "ids": [
            "hyal"
          ],
          "why": "HydraLift Sedmikráska · Lehké sérum s kapátkem. 2 % kyseliny hyaluronové, niacinamid a sedmikráska."
        },
        {
          "title": "Jas a rovnoměrnější vzhled tónu",
          "hint": "Vitamín C, niacinamid a fermentovaný oves",
          "ids": [
            "morning"
          ],
          "why": "Happy Morning · Lehké sérum s kapátkem. Vitamín C, niacinamid a fermentovaný oves."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "HydraLift Sedmikráska a Happy Morning",
          "ids": [
            "hyal",
            "morning"
          ],
          "why": "HydraLift Sedmikráska · Lehké sérum s kapátkem. 2 % kyseliny hyaluronové, niacinamid a sedmikráska."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Závěrečná vrstva",
      "description": "Krém nebo olej",
      "photo": "cream",
      "title": "Která textura vám vyhovuje?",
      "choices": [
        {
          "title": "Hydratace ráno i večer",
          "hint": "Sedmikráskový extrakt",
          "ids": [
            "cream"
          ],
          "why": "Pleťový krém Sedmikráska · Lehký krém bez UV filtru. Sedmikráskový extrakt."
        },
        {
          "title": "Závěrečná olejová péče",
          "hint": "Centella a směs rostlinných olejů",
          "ids": [
            "oil"
          ],
          "why": "Pleťový olej Sedmikráska · Lehký olej s kapátkem. Centella a směs rostlinných olejů."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Pleťový krém Sedmikráska a Pleťový olej Sedmikráska",
          "ids": [
            "cream",
            "oil"
          ],
          "why": "Pleťový krém Sedmikráska · Lehký krém bez UV filtru. Sedmikráskový extrakt."
        }
      ]
    }
  ],
  "routine": {
    "hyal": [
      "hyal",
      "cream"
    ],
    "cream": [
      "hyal",
      "cream"
    ],
    "oil": [
      "hyal",
      "oil"
    ],
    "morning": [
      "morning",
      "cream"
    ]
  }
};
