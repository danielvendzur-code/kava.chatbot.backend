import { copy as slovak } from '../liqoil/copy.js';

export const brand = {
  "name": "Emerosa",
  "legalName": "Emerosa",
  "logo": "./media/logo.svg",
  "shop": "https://www.emerosa.sk/",
  "category": "https://www.emerosa.sk/pletove-sera",
  "contact": "https://www.emerosa.sk/",
  "shopLabel": "Starostlivosť o pleť v e-shope",
  "hero": "./media/intense.webp",
  "heroAlt": "Lumene Nordic Hydra Intenzívne sérum",
  "heroSecondary": "./media/oil.webp",
  "title": "Vyberte si sérum Lumene",
  "intro": "Porovnajte dve hydratačné séra a dve rozjasňujúce textúry z ponuky Emerosa.",
  "checkedAt": "20. 11. 2026",
  "language": "sk-SK",
  "currency": "EUR",
  "availableLabel": "Skladom",
  "budgets": [
    11.59,
    19.41,
    21.67
  ],
  "chatSuggestions": [
    "Ako použiť Lumene Nordic Hydra Intenzívne sérum?",
    "Porovnaj Lumene Hĺbkovo hydratačné sérum a Lumene Nordic Hydra Intenzívne sérum",
    "Aké je poradie rutiny?"
  ],
  "routineOrder": "Vybraný produkt zaraďte na čistú pleť podľa návodu výrobcu.",
  "steps": [
    {
      "id": "care-1",
      "name": "Hydratácia",
      "description": "Ľahké sérum alebo gél",
      "photo": "hydro",
      "title": "Ktorá hydratačná textúra vám vyhovuje?",
      "choices": [
        {
          "title": "Každodenná ľahká hydratácia",
          "hint": "Kyselina hyalurónová, betaín a extrakt z pápernice",
          "ids": [
            "hydro"
          ],
          "why": "Lumene Hĺbkovo hydratačné sérum · Ľahké sérum. Kyselina hyalurónová, betaín a extrakt z pápernice."
        },
        {
          "title": "Hydratácia v gélovej textúre",
          "hint": "Tri molekulové hmotnosti kyseliny hyalurónovej a brezová zložka",
          "ids": [
            "intense"
          ],
          "why": "Lumene Nordic Hydra Intenzívne sérum · Ľahký gél. Tri molekulové hmotnosti kyseliny hyalurónovej a brezová zložka."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "Lumene Hĺbkovo hydratačné sérum a Lumene Nordic Hydra Intenzívne sérum",
          "ids": [
            "hydro",
            "intense"
          ],
          "why": "Lumene Hĺbkovo hydratačné sérum · Ľahké sérum. Kyselina hyalurónová, betaín a extrakt z pápernice."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Rozjasnenie",
      "description": "Esencia alebo dvojfázový olej",
      "photo": "bright",
      "title": "Aké rozjasnenie hľadáte?",
      "choices": [
        {
          "title": "Rozjasnenie v ľahkej textúre",
          "hint": "Arktická moruška, vitamín C a kyselina hyalurónová",
          "ids": [
            "bright"
          ],
          "why": "Lumene Nordic-C Esencia · Ľahká esencia. Arktická moruška, vitamín C a kyselina hyalurónová."
        },
        {
          "title": "Rozjasnenie v olejovej textúre",
          "hint": "Arktická moruška, severské bobule a vitamínový komplex",
          "ids": [
            "oil"
          ],
          "why": "Lumene Nordic-C Olejový koktail · Dvojfázový olejový koktail. Arktická moruška, severské bobule a vitamínový komplex."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "Lumene Nordic-C Esencia a Lumene Nordic-C Olejový koktail",
          "ids": [
            "bright",
            "oil"
          ],
          "why": "Lumene Nordic-C Esencia · Ľahká esencia. Arktická moruška, vitamín C a kyselina hyalurónová."
        }
      ]
    }
  ],
  "routine": {},
  "copy": { ...slovak, "Najít péči": "Nájsť starostlivosť" }
};
