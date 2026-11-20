export const brand = {
  "name": "OMORFIA",
  "legalName": "OMORFIA",
  "logo": "./media/logo.webp",
  "shop": "https://www.omorfia.care/",
  "category": "https://www.omorfia.care/pece-o-plet",
  "contact": "https://www.omorfia.care/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/cream.webp",
  "heroAlt": "PHOENIX hydratační krém",
  "heroSecondary": "./media/bright.webp",
  "title": "Od čištění po závěrečnou vrstvu",
  "intro": "Vyberte odličovací balzám, hydratační krém nebo jeden ze dvou pleťových olejů.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "CZK",
  "availableLabel": "Skladem",
  "budgets": [
    370,
    1370,
    1470,
    1870
  ],
  "chatSuggestions": [
    "Jak použít PHOENIX hydratační krém?",
    "Porovnej ZEN PURE odličovací balzám a PHOENIX hydratační krém",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Začněte odlíčením a čištěním. Na čistou pleť naneste krém podle pokynů výrobce.",
  "steps": [
    {
      "id": "care-1",
      "name": "Čištění a krém",
      "description": "Odličovací balzám nebo lehký krém",
      "photo": "clean",
      "title": "Který krok rutiny hledáte?",
      "choices": [
        {
          "title": "První krok a odlíčení",
          "hint": "Olejová čisticí receptura",
          "ids": [
            "clean"
          ],
          "why": "ZEN PURE odličovací balzám · Balzám pro večerní čištění. Olejová čisticí receptura."
        },
        {
          "title": "Lehká hydratační vrstva",
          "hint": "Kyselina hyaluronová a LIFTONIN®-XPRESS",
          "ids": [
            "cream"
          ],
          "why": "PHOENIX hydratační krém · Lehký krém. Kyselina hyaluronová a LIFTONIN®-XPRESS."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "ZEN PURE odličovací balzám a PHOENIX hydratační krém",
          "ids": [
            "clean",
            "cream"
          ],
          "why": "ZEN PURE odličovací balzám · Balzám pro večerní čištění. Olejová čisticí receptura."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Pleťové oleje",
      "description": "Rozjasnění nebo výživa",
      "photo": "bright",
      "title": "Jaké zaměření má mít olej?",
      "choices": [
        {
          "title": "Rozjasnění mdlé pleti",
          "hint": "Moringový a šípkový olej",
          "ids": [
            "bright"
          ],
          "why": "BRIGHT STAR pleťový olej · Olejové kapky. Moringový a šípkový olej."
        },
        {
          "title": "Olejová péče pro suchou pleť",
          "hint": "Směs rostlinných olejů",
          "ids": [
            "oil"
          ],
          "why": "SKIN SUPERFOOD · Výživný pleťový olej. Směs rostlinných olejů."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "BRIGHT STAR pleťový olej a SKIN SUPERFOOD",
          "ids": [
            "bright",
            "oil"
          ],
          "why": "BRIGHT STAR pleťový olej · Olejové kapky. Moringový a šípkový olej."
        }
      ]
    }
  ],
  "routine": {
    "clean": [
      "clean",
      "cream"
    ],
    "cream": [
      "clean",
      "cream"
    ]
  },
  "routineNote": "Začněte odlíčením a čištěním. Na čistou pleť naneste krém podle pokynů výrobce."
};
