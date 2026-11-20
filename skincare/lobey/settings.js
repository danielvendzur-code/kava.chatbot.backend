export const brand = {
  "name": "LOBEY",
  "legalName": "LOBEY",
  "logo": "./media/logo.svg",
  "shop": "https://www.lobey.cz/",
  "category": "https://www.lobey.cz/pletova-sera/",
  "contact": "https://www.lobey.cz/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/hyal.webp",
  "heroAlt": "Hyaluronové sérum Intense",
  "heroSecondary": "./media/oil.webp",
  "title": "Hydratace, nebo cílené sérum?",
  "intro": "Vyberte texturu a zaměření podle toho, co od séra čekáte. Od lehké hydratace po olejový krok.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "CZK",
  "availableLabel": "Skladem",
  "budgets": [
    819,
    919,
    1019,
    1499
  ],
  "chatSuggestions": [
    "Jak použít Hyaluronové sérum Intense?",
    "Porovnej Hyaluronové sérum Intense a Regenerační olejové sérum",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Výrobce doporučuje nejprve vodní sérum a olejové až na závěr.",
  "steps": [
    {
      "id": "care-1",
      "name": "Hydratace a výživa",
      "description": "Vodní, nebo olejová textura",
      "photo": "hyal",
      "title": "Jaký pocit na pleti hledáte?",
      "choices": [
        {
          "title": "Hydratace a pružnější vzhled",
          "hint": "Čtyři formy kyseliny hyaluronové",
          "ids": [
            "hyal"
          ],
          "why": "Hyaluronové sérum Intense · Vodní sérum. Čtyři formy kyseliny hyaluronové."
        },
        {
          "title": "Výživa suché pleti",
          "hint": "Melounový olej a extrakt z hnědé řasy",
          "ids": [
            "oil"
          ],
          "why": "Regenerační olejové sérum · Rostlinný olej. Melounový olej a extrakt z hnědé řasy."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Hyaluronové sérum Intense a Regenerační olejové sérum",
          "ids": [
            "hyal",
            "oil"
          ],
          "why": "Hyaluronové sérum Intense · Vodní sérum. Čtyři formy kyseliny hyaluronové."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Cílené sérum",
      "description": "Jas, nebo méně nápadné póry",
      "photo": "pore",
      "title": "Na co se chcete zaměřit?",
      "choices": [
        {
          "title": "Péče o vzhled pórů",
          "hint": "Zinek PCA a glycerin",
          "ids": [
            "pore"
          ],
          "why": "Sérum na rozšířené póry · Lehké sérum. Zinek PCA a glycerin."
        },
        {
          "title": "Rozjasnění a sjednocení tónu",
          "hint": "Stabilní derivát vitamínu C",
          "ids": [
            "bright"
          ],
          "why": "Rozjasňující sérum s vitamínem C · Lehké sérum. Stabilní derivát vitamínu C."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Sérum na rozšířené póry a Rozjasňující sérum s vitamínem C",
          "ids": [
            "pore",
            "bright"
          ],
          "why": "Sérum na rozšířené póry · Lehké sérum. Zinek PCA a glycerin."
        }
      ]
    }
  ],
  "routine": {
    "hyal": [
      "hyal",
      "oil"
    ],
    "oil": [
      "hyal",
      "oil"
    ]
  }
};
