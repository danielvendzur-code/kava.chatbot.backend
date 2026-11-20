export const brand = {
  "name": "Havlíkova apotéka",
  "legalName": "Havlíkova apotéka",
  "logo": "./media/logo.svg",
  "shop": "https://www.havlikovaapoteka.cz/",
  "category": "https://www.havlikovaapoteka.cz/sera/",
  "contact": "https://www.havlikovaapoteka.cz/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/hyal.webp",
  "heroAlt": "Hyaluronové sérum Alabaster",
  "heroSecondary": "./media/oil.webp",
  "title": "Jemnější péče o pleť",
  "intro": "Porovnejte lehké sérum, makový olej a cílenou péči. Objevte i dvojici Alabaster a Opium.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "CZK",
  "availableLabel": "Skladem",
  "budgets": [
    768,
    984,
    1152,
    1632
  ],
  "chatSuggestions": [
    "Jak použít Hyaluronové sérum Alabaster?",
    "Porovnej Hyaluronové sérum Alabaster a Pleťový olej Opium",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Výrobce doporučuje Alabaster a Opium smíchat v dlani a nanést na vlhkou pleť.",
  "steps": [
    {
      "id": "care-1",
      "name": "Alabaster a Opium",
      "description": "Hydratace nebo makový olej",
      "photo": "hyal",
      "title": "Který krok chcete přidat?",
      "choices": [
        {
          "title": "Hydratace a lehký první krok",
          "hint": "Dvě velikosti kyseliny hyaluronové a lipový hydrolát",
          "ids": [
            "hyal"
          ],
          "why": "Hyaluronové sérum Alabaster · Dvoufázové sérum. Dvě velikosti kyseliny hyaluronové a lipový hydrolát."
        },
        {
          "title": "Olejová péče o pružný vzhled",
          "hint": "Makový olej a extrakt z máku",
          "ids": [
            "oil"
          ],
          "why": "Pleťový olej Opium · Olejové kapky. Makový olej a extrakt z máku."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Hyaluronové sérum Alabaster a Pleťový olej Opium",
          "ids": [
            "hyal",
            "oil"
          ],
          "why": "Hyaluronové sérum Alabaster · Dvoufázové sérum. Dvě velikosti kyseliny hyaluronové a lipový hydrolát."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Cílené sérum",
      "description": "Rozjasnění nebo zjemnění",
      "photo": "bright",
      "title": "Na jaký výsledek se zaměřujete?",
      "choices": [
        {
          "title": "Jas a sjednocení tónu",
          "hint": "Niacinamid a makadamiový olej",
          "ids": [
            "bright"
          ],
          "why": "Sérum Krásná zahradnice · Sérum pod krém. Niacinamid a makadamiový olej."
        },
        {
          "title": "Zjemnění suché a unavené pleti",
          "hint": "Avokádový olej a saccharide isomerate",
          "ids": [
            "smooth"
          ],
          "why": "Hraběnčino sérum · Emulzní sérum. Avokádový olej a saccharide isomerate."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Sérum Krásná zahradnice a Hraběnčino sérum",
          "ids": [
            "bright",
            "smooth"
          ],
          "why": "Sérum Krásná zahradnice · Sérum pod krém. Niacinamid a makadamiový olej."
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
  },
  "routineNote": "Výrobce doporučuje Alabaster a Opium smíchat v dlani a nanést na vlhkou pleť."
};
