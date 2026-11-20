import { copy as slovak } from '../liqoil/copy.js';

export const brand = {
  "name": "SAVON",
  "legalName": "SAVON",
  "logo": "./media/logo.webp",
  "shop": "https://www.savon.sk/",
  "category": "https://www.savon.sk/pletove-sera/",
  "contact": "https://www.savon.sk/",
  "shopLabel": "Starostlivosť o pleť v e-shope",
  "hero": "./media/hyal.webp",
  "heroAlt": "HYDRABIOTIN",
  "heroSecondary": "./media/renew.webp",
  "title": "Sérum alebo krém?",
  "intro": "Vyberte si hydratáciu, peptidovú starostlivosť alebo olejový krok podľa textúry, ktorú máte radi.",
  "checkedAt": "20. 11. 2026",
  "language": "sk-SK",
  "currency": "EUR",
  "availableLabel": "Skladom",
  "budgets": [
    22,
    22.9,
    28
  ],
  "chatSuggestions": [
    "Ako použiť HYDRABIOTIN?",
    "Porovnaj HYDRABIOTIN a REVITALUXE",
    "Aké je poradie rutiny?"
  ],
  "routineOrder": "Vybraný produkt zaraďte na čistú pleť podľa návodu výrobcu.",
  "steps": [
    {
      "id": "care-1",
      "name": "Ľahšie séra",
      "description": "Hyalurón alebo peptidy",
      "photo": "hyal",
      "title": "Čo od séra očakávate?",
      "choices": [
        {
          "title": "Hydratácia ľahkým sérom",
          "hint": "Tri formy kyseliny hyalurónovej a biotín",
          "ids": [
            "hyal"
          ],
          "why": "HYDRABIOTIN · Sérum s pipetou. Tri formy kyseliny hyalurónovej a biotín."
        },
        {
          "title": "Kozmetická starostlivosť o pružný vzhľad pleti",
          "hint": "Matrixyl 3000 a kyselina hyalurónová",
          "ids": [
            "peptide"
          ],
          "why": "REVITALUXE · Sérum s pipetou. Matrixyl 3000 a kyselina hyalurónová."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "HYDRABIOTIN a REVITALUXE",
          "ids": [
            "hyal",
            "peptide"
          ],
          "why": "HYDRABIOTIN · Sérum s pipetou. Tri formy kyseliny hyalurónovej a biotín."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Výživnejšia starostlivosť",
      "description": "Olejové sérum alebo krém",
      "photo": "renew",
      "title": "Ktorú textúru uprednostníte?",
      "choices": [
        {
          "title": "Výživa a starostlivosť o vzhľad jemných liniek",
          "hint": "Bakuchiol, astaxantín a opunciový olej",
          "ids": [
            "renew"
          ],
          "why": "RENEW · Olejové sérum s pipetou. Bakuchiol, astaxantín a opunciový olej."
        },
        {
          "title": "Hydratačný krém s Q10",
          "hint": "Ružová voda, opuncia a koenzým Q10",
          "ids": [
            "cream"
          ],
          "why": "LAVITA · Krém v airless balení. Ružová voda, opuncia a koenzým Q10."
        },
        {
          "title": "Porovnať obe možnosti",
          "hint": "RENEW a LAVITA",
          "ids": [
            "renew",
            "cream"
          ],
          "why": "RENEW · Olejové sérum s pipetou. Bakuchiol, astaxantín a opunciový olej."
        }
      ]
    }
  ],
  "routine": {},
  "copy": { ...slovak, "Najít péči": "Vybrať starostlivosť" }
};
