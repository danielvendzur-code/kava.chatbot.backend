export const brand = {
  "name": "Mýdlárna ERDÉ",
  "legalName": "Mýdlárna ERDÉ",
  "logo": "./media/logo.webp",
  "shop": "https://www.mydlarnaerde.cz/",
  "category": "https://www.mydlarnaerde.cz/kosmetika-na-plet-a-telo/",
  "contact": "https://www.mydlarnaerde.cz/",
  "shopLabel": "Péče o pleť v e-shopu",
  "hero": "./media/cream.webp",
  "heroAlt": "Rakytník & Makadamia",
  "heroSecondary": "./media/tonic.webp",
  "title": "Jednoduchá péče o pleť",
  "intro": "Vyberte odličovací mléko, lehký krém nebo jedno ze dvou dvoufázových tonik.",
  "checkedAt": "20. 11. 2026",
  "language": "cs-CZ",
  "currency": "CZK",
  "availableLabel": "Skladem",
  "budgets": [
    289,
    330,
    335
  ],
  "chatSuggestions": [
    "Jak použít Rakytník & Makadamia?",
    "Porovnej Šípkové odličovací mléko a Rakytník & Makadamia",
    "Jaké je pořadí rutiny?"
  ],
  "routineOrder": "Nejprve pleť odličte, pak použijte tonikum a podle potřeby přidejte krém.",
  "steps": [
    {
      "id": "care-1",
      "name": "Odličování a krém",
      "description": "První nebo závěrečný krok",
      "photo": "cleansing",
      "title": "Který krok si chcete vybrat?",
      "choices": [
        {
          "title": "Jemné večerní odlíčení",
          "hint": "Šípková receptura",
          "ids": [
            "cleansing"
          ],
          "why": "Šípkové odličovací mléko · Mléčná emulze. Šípková receptura."
        },
        {
          "title": "Zvláčnění pleti",
          "hint": "Rakytníkový a makadamiový olej, panthenol",
          "ids": [
            "cream"
          ],
          "why": "Rakytník & Makadamia · Krém v airless balení. Rakytníkový a makadamiový olej, panthenol."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Šípkové odličovací mléko a Rakytník & Makadamia",
          "ids": [
            "cleansing",
            "cream"
          ],
          "why": "Šípkové odličovací mléko · Mléčná emulze. Šípková receptura."
        }
      ]
    },
    {
      "id": "care-2",
      "name": "Dvoufázová tonika",
      "description": "Levandule nebo kopřiva se slézem",
      "photo": "tonic",
      "title": "Kterou dvojici složek upřednostníte?",
      "choices": [
        {
          "title": "Tonizace s olejovou složkou",
          "hint": "Levandule a švestkový olej",
          "ids": [
            "tonic"
          ],
          "why": "Levandule a švestkový olej · Dvoufázová tekutina. Levandule a švestkový olej."
        },
        {
          "title": "Bylinná tonizace",
          "hint": "Kopřiva, sléz a olej z hroznových jader",
          "ids": [
            "nettle"
          ],
          "why": "Kopřiva a sléz · Dvoufázová tekutina. Kopřiva, sléz a olej z hroznových jader."
        },
        {
          "title": "Porovnat obě možnosti",
          "hint": "Levandule a švestkový olej a Kopřiva a sléz",
          "ids": [
            "tonic",
            "nettle"
          ],
          "why": "Levandule a švestkový olej · Dvoufázová tekutina. Levandule a švestkový olej."
        }
      ]
    }
  ],
  "routine": {
    "cleansing": [
      "cleansing",
      "tonic",
      "cream"
    ],
    "tonic": [
      "cleansing",
      "tonic",
      "cream"
    ],
    "nettle": [
      "cleansing",
      "nettle",
      "cream"
    ],
    "cream": [
      "cleansing",
      "tonic",
      "cream"
    ]
  },
  "routineNote": "Nejprve pleť odličte, pak použijte tonikum a podle potřeby přidejte krém."
};
