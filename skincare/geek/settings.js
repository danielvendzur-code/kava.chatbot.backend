export const brand = {
  "name": "Geek & Gorgeous",
  "legalName": "Geek & Gorgeous",
  "logo": "./media/logo.webp",
  "shop": "https://geekandgorgeous.com/",
  "category": "https://geekandgorgeous.com/collections/101-serums",
  "contact": "https://geekandgorgeous.com/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/stress.webp",
  "heroAlt": "Stress Less",
  "heroSecondary": "./media/vitc.webp",
  "title": "Lehké vrstvy v péči o pleť",
  "intro": "Vyberte si hydratační sprej, gelové sérum nebo cílenou péči s vitaminem C či peptidy.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "EUR",
  "availableLabel": "Skladem",
  "budgets": [
    8.5,
    12,
    12.5,
    15.8
  ],
  "chatSuggestions": [
    "Jak použít Stress Less?",
    "Porovnej Liquid Hydration a Stress Less",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Po čištění použijte tonikum, poté vybrané sérum a nakonec krém.",
  "steps": [
    {
      "id": "care-1",
      "name": "Hydratace a komfort",
      "description": "Tonikum nebo gel",
      "photo": "liquid",
      "title": "Jakou texturu hledáte?",
      "choices": [
        {
          "title": "Hydratace ve spreji",
          "hint": "5 % panthenolu a přirozené hydratační faktory",
          "ids": [
            "liquid"
          ],
          "why": "Liquid Hydration · Hedvábné tonikum. 5 % panthenolu a přirozené hydratační faktory."
        },
        {
          "title": "Lehká zklidňující péče",
          "hint": "Ovesný beta-glukan a madecassoside",
          "ids": [
            "stress"
          ],
          "why": "Stress Less · Lehký gel. Ovesný beta-glukan a madecassoside."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Liquid Hydration a Stress Less",
          "ids": [
            "liquid",
            "stress"
          ],
          "why": "Liquid Hydration · Hedvábné tonikum. 5 % panthenolu a přirozené hydratační faktory."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Cílená péče",
      "description": "Vitamin C nebo peptidy",
      "photo": "vitc",
      "title": "Kterému kroku dáte přednost?",
      "choices": [
        {
          "title": "Rozjasnění s kyselinou askorbovou",
          "hint": "15 % kyseliny askorbové, kyselina ferulová a vitamin E",
          "ids": [
            "vitc"
          ],
          "why": "C-Glow · Vodové sérum. 15 % kyseliny askorbové, kyselina ferulová a vitamin E."
        },
        {
          "title": "Kosmetická péče o pružný vzhled",
          "hint": "Čtyři peptidové technologie dle výrobce",
          "ids": [
            "peptide"
          ],
          "why": "Power Peptides · Mléčné sérum. Čtyři peptidové technologie dle výrobce."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "C-Glow a Power Peptides",
          "ids": [
            "vitc",
            "peptide"
          ],
          "why": "C-Glow · Vodové sérum. 15 % kyseliny askorbové, kyselina ferulová a vitamin E."
        }
      ]
    }
  ],
  "routine": {
    "liquid": [
      "liquid",
      "stress"
    ],
    "stress": [
      "liquid",
      "stress"
    ],
    "peptide": [
      "liquid",
      "peptide"
    ]
  },
  "routineNote": "Po čištění použijte tonikum, poté vybrané sérum a nakonec krém.",
  "copy": {
    "Kč": "€",
    "Nejvyšší celková cena v Kč": "Nejvyšší celková cena v €"
  }
};
