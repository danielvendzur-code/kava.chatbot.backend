import { copy as slovak } from '../liqoil/copy.js';

export const brand = {
  "name": "LucyLab",
  "legalName": "LucyLab",
  "logo": "./media/logo.svg",
  "shop": "https://lucylab.sk/",
  "category": "https://lucylab.sk/145-pletove-sera",
  "contact": "https://lucylab.sk/",
  "shopLabel": "Starostlivosť o pleť v e-shope",
  "hero": "./media/matcha.webp",
  "heroAlt": "Matcha Power",
  "heroSecondary": "./media/cream.webp",
  "title": "Poskladajte svoj krok starostlivosti",
  "intro": "Vyberte medzi krémovým, ľahkým a suchým olejovým sérom. K výsledku môžete pridať hydratačný krém.",
  "checkedAt": "20. 11. 2026",
  "language": "sk-SK",
  "currency": "EUR",
  "availableLabel": "Skladom",
  "budgets": [
    15,
    22.5,
    24,
    26.25
  ],
  "chatSuggestions": [
    "Ako použiť Matcha Power?",
    "Porovnaj Matcha Power a Vitamín C Power",
    "Aké je poradie rutiny?"
  ],
  "routineOrder": "Po čistení naneste vybrané sérum. Po vstrebaní pokračujte pleťovým krémom.",
  "steps": [
    {
      "id": "care-1",
      "name": "Rozjasnenie",
      "description": "Ranné sérum alebo suchý olej",
      "photo": "matcha",
      "title": "Ktorú textúru chcete pri rozjasnení?",
      "choices": [
        {
          "title": "Ranné rozjasnenie",
          "hint": "Japonská matcha, vitamín C a kofeín",
          "ids": [
            "matcha"
          ],
          "why": "Matcha Power · Rýchlo vstrebateľné sérum. Japonská matcha, vitamín C a kofeín."
        },
        {
          "title": "Rozjasnenie v suchej olejovej textúre",
          "hint": "5 % stabilnej formy vitamínu C a olivový skvalán",
          "ids": [
            "vitc"
          ],
          "why": "Vitamín C Power · Suché olejové sérum. 5 % stabilnej formy vitamínu C a olivový skvalán."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "Matcha Power a Vitamín C Power",
          "ids": [
            "matcha",
            "vitc"
          ],
          "why": "Matcha Power · Rýchlo vstrebateľné sérum. Japonská matcha, vitamín C a kofeín."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Hydratácia",
      "description": "Krémové sérum alebo krém",
      "photo": "collagen",
      "title": "Ktorý hydratačný krok vám vyhovuje?",
      "choices": [
        {
          "title": "Hydratácia a hutnejší pocit",
          "hint": "Kolagén, kyselina hyalurónová a peptidy",
          "ids": [
            "collagen"
          ],
          "why": "Hydratačné sérum s kolagénom · Krémové sérum v airless balení. Kolagén, kyselina hyalurónová a peptidy."
        },
        {
          "title": "Hydratácia a doplnenie lipidov",
          "hint": "Ceramidy, olivový skvalán a ružová voda",
          "ids": [
            "cream"
          ],
          "why": "Hydratačný krém s ceramidmi · Ľahký pleťový krém. Ceramidy, olivový skvalán a ružová voda."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "Hydratačné sérum s kolagénom a Hydratačný krém s ceramidmi",
          "ids": [
            "collagen",
            "cream"
          ],
          "why": "Hydratačné sérum s kolagénom · Krémové sérum v airless balení. Kolagén, kyselina hyalurónová a peptidy."
        }
      ]
    }
  ],
  "routine": {
    "collagen": [
      "collagen",
      "cream"
    ],
    "vitc": [
      "vitc",
      "cream"
    ],
    "matcha": [
      "matcha",
      "cream"
    ],
    "cream": [
      "collagen",
      "cream"
    ]
  },
  "copy": { ...slovak, "Najít péči": "Vybrať starostlivosť" }
};
