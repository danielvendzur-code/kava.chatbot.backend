export const brand = {
  "name": "ANNA BRANDEJS",
  "legalName": "ANNA BRANDEJS",
  "logo": "./media/logo.svg",
  "shop": "https://www.annabrandejs.cz/",
  "category": "https://www.annabrandejs.cz/",
  "contact": "https://www.annabrandejs.cz/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/lift.webp",
  "heroAlt": "Lifting Serum",
  "heroSecondary": "./media/cream.webp",
  "title": "Vyberte si krok v péči",
  "intro": "Porovnejte dvě séra a zvolte mezi nočním krémem a péčí o oční okolí.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "CZK",
  "availableLabel": "Skladem",
  "budgets": [
    1490,
    1990,
    2370,
    2790
  ],
  "chatSuggestions": [
    "Jak použít Lifting Serum?",
    "Porovnej Lifting Serum a Peptides + Prebiotics",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Po vyčištění naneste peptidové sérum. Ve večerní rutině výrobce doporučuje po vstřebání doplnit noční krém Ultimate Age-Defying PDRN.",
  "steps": [
    {
      "id": "care-1",
      "name": "Pleťová séra",
      "description": "Lifting Serum nebo peptidy",
      "photo": "lift",
      "title": "Jaké sérum hledáte?",
      "choices": [
        {
          "title": "Kosmetické vyhlazení vzhledu pleti",
          "hint": "Levandulový extrakt a kyselina hyaluronová",
          "ids": [
            "lift"
          ],
          "why": "Lifting Serum · Sérum před krémem. Levandulový extrakt a kyselina hyaluronová."
        },
        {
          "title": "Peptidová péče o vzhled jemných linek",
          "hint": "Tři peptidy, prebiotikum ExpoZen® a Epi-On™",
          "ids": [
            "peptides"
          ],
          "why": "Peptides + Prebiotics · Pleťové sérum. Tři peptidy, prebiotikum ExpoZen® a Epi-On™."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Lifting Serum a Peptides + Prebiotics",
          "ids": [
            "lift",
            "peptides"
          ],
          "why": "Lifting Serum · Sérum před krémem. Levandulový extrakt a kyselina hyaluronová."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Krémová péče",
      "description": "Obličej nebo oční okolí",
      "photo": "cream",
      "title": "Pro kterou oblast vybíráte?",
      "choices": [
        {
          "title": "Večerní krém na obličej",
          "hint": "PDRN, propolis a kyselina hyaluronová",
          "ids": [
            "cream"
          ],
          "why": "Ultimate Age-Defying PDRN · Noční krém. PDRN, propolis a kyselina hyaluronová."
        },
        {
          "title": "Péče o vzhled očního okolí",
          "hint": "Kyselina hyaluronová 4D, skvalan a ceramidy",
          "ids": [
            "eye"
          ],
          "why": "Eye Contour Architect · Krém pro okolí očí. Kyselina hyaluronová 4D, skvalan a ceramidy."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Ultimate Age-Defying PDRN a Eye Contour Architect",
          "ids": [
            "cream",
            "eye"
          ],
          "why": "Ultimate Age-Defying PDRN · Noční krém. PDRN, propolis a kyselina hyaluronová."
        }
      ]
    }
  ],
  "routine": {
    "cream": [
      "peptides",
      "cream"
    ],
    "peptides": [
      "peptides",
      "cream"
    ]
  }
};
