/* doubleshot – ověřený katalog nové dávky (447 € + 10 €/měs., bez trialu). Zdroj: https://www.doubleshot.cz/cs/taxons/kavy a stránky
   produktů (jednorázové ceny balení data-variant-priceCents), staženo 2026-10-23. Chuťové skupiny jsou vlastní řady pražírny
   (Sladké a krémové / Ovocné a elegantní / Šťavnaté a exotické). Prodává se zrnková káva; recepty jsou postupy pražírny. */
(function (g) {
  'use strict';
  const DATA = {
 "slug": "doubleshot",
 "lang": "cs",
 "checkedAt": "2026-10-23",
 "beansOnly": true,
 "demo": {
  "heroProductId": "era-espresso"
 },
 "brand": {
  "name": "doubleshot",
  "legal": "doubleshot",
  "place": "doubleshot · pražírna výběrové kávy",
  "shopUrl": "https://www.doubleshot.cz/cs/taxons/kavy",
  "web": "https://www.doubleshot.cz/cs",
  "logo": "/assets/doubleshot/logo.png",
  "logoLight": "/assets/doubleshot/logo-light.png",
  "hero": "/assets/doubleshot/era-espresso.jpg",
  "contact": "info@doubleshot.cz",
  "contactSource": "https://www.doubleshot.cz/cs/contact/ (zo zadania)",
  "theme": {
   "ink": "#1e272f",
   "brand": "#1e272f",
   "accent": "#f2c230",
   "soft": "#f6f3ea",
   "paper": "#ffffff"
  }
 },
 "tasteLabels": {
  "choco": [
   "Sladké a krémové",
   "Chuťová řada pražírny"
  ],
  "fruitFull": [
   "Ovocné a elegantní",
   "Chuťová řada pražírny"
  ],
  "fresh": [
   "Šťavnaté a exotické",
   "Chuťová řada pražírny"
  ],
  "decaf": [
   "Bez kofeinu",
   "Káva i na večer"
  ]
 },
 "scope": "Kávy z kategorie Kávy (espressa a filtry) a sáčková káva Flirt; kapsle, dárkové poukazy, předplatné, kurzy a merch nejsou ve výběru.",
 "excluded": [
  "Farm • Bule Hora: na stránce rozpor gramáže (variant 300 g má v datech 350 g) – vyřazeno, dokud se neověří.",
  "kapsle (4)",
  "dárkový poukaz",
  "předplatné (jen jednorázové ceny)"
 ],
 "shop": {
  "freeShipping": "2 a více balíčků kávy = doprava zdarma na výdejní místa (podle e-shopu).",
  "freeShippingSource": "https://www.doubleshot.cz/cs"
 },
 "products": [
  {
   "id": "start-espresso",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/start-espresso",
   "photo": "/assets/doubleshot/start-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 335.0,
   "priceTo": 1095.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 335.0,
     "url": "https://www.doubleshot.cz/cs/products/start-espresso",
     "sku": "25011001_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1095.0,
     "url": "https://www.doubleshot.cz/cs/products/start-espresso",
     "sku": "25011001_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Start",
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "pražené oříšky",
    "čokoláda",
    "karamel"
   ],
   "origin": "Brazílie (Bobolink, Caconde) – směs",
   "region": "blend",
   "process": "suché a promyté zpracování",
   "summary": "Sladké a krémové espresso na doma; základní směs pražírny pro automatické a domácí kávovary, tmavší pražení než Era.",
   "recipe": "18–19 g kávy, 94 °C, 45–50 g nápoje, extrakce 28–35 s (postup pražírny).",
   "taste": "choco"
  },
  {
   "id": "era-espresso",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/era-espresso",
   "photo": "/assets/doubleshot/era-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 365.0,
   "priceTo": 1190.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 365.0,
     "url": "https://www.doubleshot.cz/cs/products/era-espresso",
     "sku": "15011001_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1190.0,
     "url": "https://www.doubleshot.cz/cs/products/era-espresso",
     "sku": "15011001_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Era",
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "žluté ovoce",
    "med",
    "karamel",
    "květinová aromatika"
   ],
   "origin": "Etiopie · farma Sheka, Kawo",
   "region": "africa",
   "process": "honey",
   "summary": "Ovocné a elegantní vlajkové espresso pražírny, které znáte z kaváren; moderní espresso pro kvalitní kávovary.",
   "recipe": "18–19 g kávy, 94 °C, 45–50 g nápoje, extrakce 28–35 s (postup pražírny).",
   "taste": "fruitFull"
  },
  {
   "id": "extra-espresso",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/extra-espresso",
   "photo": "/assets/doubleshot/extra-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 415.0,
   "priceTo": 1355.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 415.0,
     "url": "https://www.doubleshot.cz/cs/products/extra-espresso",
     "sku": "extra_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1355.0,
     "url": "https://www.doubleshot.cz/cs/products/extra-espresso",
     "sku": "extra_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Extra",
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "višňové pralinky",
    "tropické ovoce",
    "kakao",
    "cukrová vata"
   ],
   "origin": "Panama · rodina Hartmann, Santa Clara",
   "region": "americas",
   "process": "suché zpracování (natural)",
   "summary": "Šťavnaté a exotické jednodruhové espresso; sezónní a výrazné, podle pražírny pro náročné.",
   "recipe": "18–19 g kávy, 94 °C, 45–50 g nápoje, extrakce 28–35 s (postup pražírny).",
   "taste": "fresh"
  },
  {
   "id": "decaf-espresso",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/decaf-espresso",
   "photo": "/assets/doubleshot/decaf-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": true,
   "priceFrom": 365.0,
   "priceTo": 1190.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 365.0,
     "url": "https://www.doubleshot.cz/cs/products/decaf-espresso",
     "sku": "02461202_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1190.0,
     "url": "https://www.doubleshot.cz/cs/products/decaf-espresso",
     "sku": "02461202_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Decaf Espresso",
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "decafNote": "Kofein se odstraňuje metodou etylacetát.",
   "notes": [
    "karamel",
    "sušená jablka",
    "jemná acidita"
   ],
   "origin": "Kostarika · Tarrazu, farma Don Oscar",
   "region": "americas",
   "process": "white honey, bez kofeinu",
   "summary": "Espresso bez kofeinu, ovocné a elegantní; klidně odpoledne i večer.",
   "recipe": "18–19 g kávy, 94 °C, 45–50 g nápoje, extrakce 28–35 s (postup pražírny).",
   "taste": "fruitFull"
  },
  {
   "id": "flirt",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/flirt",
   "photo": "/assets/doubleshot/flirt.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 335.0,
   "priceTo": 1095.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 335.0,
     "url": "https://www.doubleshot.cz/cs/products/flirt",
     "sku": "flirt_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1095.0,
     "url": "https://www.doubleshot.cz/cs/products/flirt",
     "sku": "flirt_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Flirt",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "med",
    "čokoláda",
    "sušené meruňky"
   ],
   "origin": "Etiopie (Limu) a Kostarika – směs",
   "region": "blend",
   "process": "promyté a honey zpracování",
   "summary": "Sladká a krémová filtrovaná káva pro běžné pití, s nízkou aciditou a snadnou přípravou.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "choco"
  },
  {
   "id": "kena-gachami",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/kena-gachami",
   "photo": "/assets/doubleshot/kena-gachami.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 420.0,
   "priceTo": 1375.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 420.0,
     "url": "https://www.doubleshot.cz/cs/products/kena-gachami",
     "sku": "05752201_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1375.0,
     "url": "https://www.doubleshot.cz/cs/products/kena-gachami",
     "sku": "05752201_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Farm • Gachami",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "ovocná marmeláda",
    "karamel",
    "zralé švestky",
    "černý rybíz"
   ],
   "origin": "Keňa · Kirinyaga, stanice Gachami",
   "region": "africa",
   "process": "washed",
   "summary": "Šťavnatá a exotická filtrovaná káva z úpatí Mount Kenya s marmeládovou sladkostí a plným tělem.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "fresh"
  },
  {
   "id": "kolumbie-imbachi",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/kolumbie-imbachi",
   "photo": "/assets/doubleshot/kolumbie-imbachi.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 375.0,
   "priceTo": 1225.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 375.0,
     "url": "https://www.doubleshot.cz/cs/products/kolumbie-imbachi",
     "sku": "021041202_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1225.0,
     "url": "https://www.doubleshot.cz/cs/products/kolumbie-imbachi",
     "sku": "021041202_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Farm • Imbachi",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "rozinky v čokoládě",
    "švestky",
    "citronová tráva"
   ],
   "origin": "Kolumbie · Huila, farma Buenavista",
   "region": "americas",
   "process": "washed",
   "summary": "Ovocná a elegantní filtrovaná káva rodiny Imbachi s výraznou sladkostí a hutným tělem.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "fruitFull"
  },
  {
   "id": "kostarika-don-oscar-bourbon-sidra-honey",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/kostarika-don-oscar-bourbon-sidra-honey",
   "photo": "/assets/doubleshot/kostarika-don-oscar-bourbon-sidra-honey.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 380.0,
   "priceTo": 1245.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 380.0,
     "url": "https://www.doubleshot.cz/cs/products/kostarika-don-oscar-bourbon-sidra-honey",
     "sku": "101721802_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1245.0,
     "url": "https://www.doubleshot.cz/cs/products/kostarika-don-oscar-bourbon-sidra-honey",
     "sku": "101721802_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Farm • Don Oscar",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "bonbóny Bon Pari",
    "med",
    "broskve"
   ],
   "origin": "Kostarika · Tarrazu, farma Don Oscar",
   "region": "americas",
   "process": "honey",
   "summary": "Ovocná a elegantní filtrovaná káva odrůdy bourbon sidra se svěží aciditou.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "fruitFull"
  },
  {
   "id": "nikaragua-finca-massif",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/nikaragua-finca-massif",
   "photo": "/assets/doubleshot/nikaragua-finca-massif.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 375.0,
   "priceTo": 1220.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 375.0,
     "url": "https://www.doubleshot.cz/cs/products/nikaragua-finca-massif",
     "sku": "08461201_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1220.0,
     "url": "https://www.doubleshot.cz/cs/products/nikaragua-finca-massif",
     "sku": "08461201_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Farm • Finca Massif",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "hořká čokoláda",
    "lesní ovoce",
    "červené víno"
   ],
   "origin": "Nikaragua · Dipilto-Jalapa, farma Massif",
   "region": "americas",
   "process": "kombinace suché a vodní fermentace",
   "summary": "Sladká a krémová filtrovaná káva z první sklizně nové farmy Luise Mirandy.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "choco"
  },
  {
   "id": "panama-finca-momoto-geisha-natural",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/panama-finca-momoto-geisha-natural",
   "photo": "/assets/doubleshot/panama-finca-momoto-geisha-natural.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "priceFrom": 485.0,
   "priceTo": 485.0,
   "weights": [
    150
   ],
   "variants": [
    {
     "grams": 150,
     "grind": "zrnková",
     "price": 485.0,
     "url": "https://www.doubleshot.cz/cs/products/panama-finca-momoto-geisha-natural",
     "sku": "031856302_150",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Fun • Momoto",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "choco",
    "fruitFull",
    "fresh"
   ],
   "notes": [
    "meruňkový džem",
    "jahody",
    "cukrová vata"
   ],
   "origin": "Panama · Santa Clara, Finca Momoto",
   "region": "americas",
   "process": "natural (geisha)",
   "summary": "Vrchol nabídky pražírny: mikrolot odrůdy geisha zpracovaný suchou metodou.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "choco"
  },
  {
   "id": "decaf-filtr",
   "kind": "coffee",
   "url": "https://www.doubleshot.cz/cs/products/decaf-filtr",
   "photo": "/assets/doubleshot/decaf-filtr.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": true,
   "priceFrom": 365.0,
   "priceTo": 1190.0,
   "weights": [
    300,
    1000
   ],
   "variants": [
    {
     "grams": 300,
     "grind": "zrnková",
     "price": 365.0,
     "url": "https://www.doubleshot.cz/cs/products/decaf-filtr",
     "sku": "02461201_300",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1190.0,
     "url": "https://www.doubleshot.cz/cs/products/decaf-filtr",
     "sku": "02461201_1000",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "jednorázová cena balení ze stránky produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "name": "Decaf Filtr",
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "decafNote": "Kofein se odstraňuje metodou etylacetát.",
   "notes": [
    "karamel",
    "sušená jablka",
    "jemná acidita"
   ],
   "origin": "Kostarika · Tarrazu, farma Don Oscar",
   "region": "americas",
   "process": "white honey, bez kofeinu",
   "summary": "Filtrovaná káva bez kofeinu, ovocná a elegantní; klidně odpoledne i večer.",
   "recipe": "20 g kávy, 94 °C, 330 g vody, extrakce cca 4 min (postup pražírny).",
   "taste": "fruitFull"
  }
 ],
 "drip": {
  "id": "flirt-sackova-kava",
  "kind": "drip",
  "name": "Flirt • sáčková káva",
  "url": "https://www.doubleshot.cz/cs/products/flirt-sackova-kava",
  "photo": "/assets/doubleshot/flirt-sackova-kava.jpg",
  "currency": "CZK",
  "price": 210.0,
  "pack": "sáčky po 13 g",
  "question": "Kolik sáčků chcete?",
  "priceVerified": true,
  "available": true,
  "checkedAt": "2026-10-23",
  "summary": "Filtrovaná káva Flirt v individuálně balených sáčcích po 13 g – stačí zalít horkou vodou.",
  "options": [
   {
    "id": "steeped_coffee5",
    "title": "5 sáčků",
    "detail": "210 Kč",
    "price": 210.0,
    "pack": "5 sáčků × 13 g"
   },
   {
    "id": "steeped_coffee10",
    "title": "10 sáčků",
    "detail": "390 Kč",
    "price": 390.0,
    "pack": "10 sáčků × 13 g"
   }
  ],
  "brew": [
   "Sáček vložte do šálku a zalijte 200 ml vroucí vody.",
   "Nechte 5 minut louhovat, pak sáček vyjměte (postup pražírny)."
  ]
 }
};
  (g.N447_DATA = g.N447_DATA || {}).doubleshot = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : window);
