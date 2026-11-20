import { copy as slovak } from '../liqoil/copy.js';

export const brand = {
  "name": "YEMNA",
  "legalName": "YEMNA",
  "logo": "./media/logo.webp",
  "shop": "https://www.yemna.sk/",
  "category": "https://www.yemna.sk/pletove-kremy-oleje/",
  "contact": "https://www.yemna.sk/",
  "shopLabel": "Starostlivosť o pleť v e-shope",
  "hero": "./media/oil.webp",
  "heroAlt": "Pleťový olej s Q10 a bakuchiolom",
  "heroSecondary": "./media/cica.webp",
  "title": "Čo potrebuje vaša pleť?",
  "intro": "Vyberte si medzi rozjasňujúcim sérom, ľahkou emulziou a výživnejšou pleťovou starostlivosťou.",
  "checkedAt": "20. 11. 2026",
  "language": "sk-SK",
  "currency": "EUR",
  "availableLabel": "Skladom",
  "budgets": [
    25.5,
    29.9,
    31.9
  ],
  "chatSuggestions": [
    "Ako použiť Pleťový olej s Q10 a bakuchiolom?",
    "Porovnaj Acerola multivitamínové sérum a INTENSE CLARIFYING",
    "Aké je poradie rutiny?"
  ],
  "routineOrder": "Vybraný produkt zaraďte na čistú pleť podľa návodu výrobcu.",
  "steps": [
    {
      "id": "care-1",
      "name": "Rozjasňujúca starostlivosť",
      "description": "Vitamínové sérum alebo emulzia",
      "photo": "acerola",
      "title": "Aké rozjasnenie hľadáte?",
      "choices": [
        {
          "title": "Hydratácia a rozjasnenie",
          "hint": "Acerola a lipová voda",
          "ids": [
            "acerola"
          ],
          "why": "Acerola multivitamínové sérum · Sérum s dávkovačom. Acerola a lipová voda."
        },
        {
          "title": "Starostlivosť o nerovnomerný tón",
          "hint": "Kyselina tranexámová a vitamín C",
          "ids": [
            "bright"
          ],
          "why": "INTENSE CLARIFYING · Ľahká emulzia. Kyselina tranexámová a vitamín C."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "Acerola multivitamínové sérum a INTENSE CLARIFYING",
          "ids": [
            "acerola",
            "bright"
          ],
          "why": "Acerola multivitamínové sérum · Sérum s dávkovačom. Acerola a lipová voda."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Výživná starostlivosť",
      "description": "Krém alebo olej",
      "photo": "cica",
      "title": "Čo uprednostníte na tvár a krk?",
      "choices": [
        {
          "title": "Výživná krémová starostlivosť",
          "hint": "Centella asiatica, hroznový olej a kakaové maslo",
          "ids": [
            "cica"
          ],
          "why": "CICA Micro repair cream · Výživný krém. Centella asiatica, hroznový olej a kakaové maslo."
        },
        {
          "title": "Olejová výživa",
          "hint": "Koenzým Q10, bakuchiol a šípkový olej",
          "ids": [
            "oil"
          ],
          "why": "Pleťový olej s Q10 a bakuchiolom · Olej v skle s pipetou. Koenzým Q10, bakuchiol a šípkový olej."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "CICA Micro repair cream a Pleťový olej s Q10 a bakuchiolom",
          "ids": [
            "cica",
            "oil"
          ],
          "why": "CICA Micro repair cream · Výživný krém. Centella asiatica, hroznový olej a kakaové maslo."
        }
      ]
    }
  ],
  "routine": {},
  "copy": { ...slovak, "Najít péči": "Vybrať starostlivosť" }
};
