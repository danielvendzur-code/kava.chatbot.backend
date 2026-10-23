/* Father's Coffee Roastery – ověřený katalog nové dávky (447 € + 10 €/měs., bez trialu). Zdroj: https://fathers.cz/kava
   (data kategorie, ceny pro Česko s 12 % DPH zaokrouhlené jako na webu) a každá produktová stránka (zobrazená cena 250 g,
   dostupnost), staženo 2026-10-23. Chuťová skupina podle chuťového profilu, který uvádí pražírna. Prodává se zrnková káva. */
(function (g) {
  'use strict';
  const DATA = {
 "slug": "fathers",
 "lang": "cs",
 "checkedAt": "2026-10-23",
 "beansOnly": true,
 "demo": {
  "heroProductId": "kena-karatina-ab"
 },
 "brand": {
  "name": "Father's",
  "legal": "Father's Coffee Roastery",
  "place": "Father's · pražírna výběrové kávy",
  "shopUrl": "https://fathers.cz/kava/",
  "web": "https://fathers.cz/",
  "logo": "/assets/fathers/logo.png",
  "logoLight": "/assets/fathers/logo-light.png",
  "logoMark": "/assets/fathers/mark-light.png",
  "hero": "/assets/fathers/kena-karatina-ab.jpg",
  "contact": "info@fathers.cz",
  "contactSource": "https://fathers.cz/kontakt",
  "theme": {
   "ink": "#232323",
   "brand": "#332d2b",
   "accent": "#b38c7a",
   "soft": "#f3efeb",
   "paper": "#ffffff"
  }
 },
 "tasteLabels": {
  "choco": [
   "Čokoláda a ořechy",
   "Podle chuťového profilu pražírny"
  ],
  "fruitFull": [
   "Sladké ovoce",
   "Podle chuťového profilu pražírny"
  ],
  "fresh": [
   "Květiny, čaj a citrusy",
   "Podle chuťového profilu pražírny"
  ],
  "decaf": [
   "Bez kofeinu",
   "Káva i na večer"
  ]
 },
 "notes": {
  "v60Filters": "Papírové filtry Hario V60 prodává e-shop ve velikostech 01, 02 a 03 (105–170 Kč)."
 },
 "scope": "Kávy z kategorie Káva (espresso a filtr, každá varianta pražení je samostatný produkt). Sample box, předplatné, kapsle, kurzy, merch a příslušenství nejsou ve výběru.",
 "excluded": [
  "Sample box 5 × 50 g (degustační sada)",
  "kolumbie-el-diviso-ombligon: e-shop ukazuje balení „100g“ (v datech hmotnost 250 g) – použito 100 g podle webu",
  "kolumbie-el-diviso: e-shop ukazuje balení „100g“ (v datech hmotnost 250 g) – použito 100 g podle webu",
  "Uganda – Zebigi (espresso): v kategorii Espresso, ale popis uvádí přípravu filtrované kávy – vyřazeno, dokud se neověří.",
  "etiopie-edn-pineapple: e-shop ukazuje balení „100g“ (v datech hmotnost 250 g) – použito 100 g podle webu",
  "Kolumbie – Inzá (espresso): v kategorii Espresso, ale popis uvádí přípravu filtrované kávy – vyřazeno, dokud se neověří."
 ],
 "shop": {
  "freeShipping": "Na všechny objednávky kávy v ČR je poštovné zdarma.",
  "freeShippingSource": "https://fathers.cz/kava/"
 },
 "products": [
  {
   "id": "kena-karatina-ab",
   "kind": "coffee",
   "name": "Keňa – Karatina AB",
   "url": "https://fathers.cz/kava/filtr/kena-karatina-ab",
   "photo": "/assets/fathers/kena-karatina-ab.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "maliny",
    "bezový květ",
    "černý rybíz"
   ],
   "origin": "Keňa · město Karatina, Nyeri County; oblast Barichu v Mathira",
   "region": "africa",
   "process": "promyté (washed)",
   "variety": "SL28, SL34, Ruiru 11",
   "altitude": "1 650 m n. m.",
   "summary": "Jižní svahy Mount Kenya patří k místům, kde vznikají kávy s jasným a strukturovaným projevem a právě odtud pochází Karatina AB. Za touto kávou stojí přibližně 1 450 drobných farmářů z Barichu Farmers Cooperative Society.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Clever Dripper...).",
   "priceFrom": 425,
   "priceTo": 1478,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/filtr/kena-karatina-ab",
     "sku": "80b45210",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/filtr/kena-karatina-ab",
     "sku": "e4bae7d7",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "minas",
   "kind": "coffee",
   "name": "Brazílie – Minas",
   "url": "https://fathers.cz/kava/espresso/minas",
   "photo": "/assets/fathers/minas.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "mandle",
    "višně",
    "tmavá čokoláda",
    "sladký tabák"
   ],
   "origin": "Brazílie · Carmo De Cachoeira, Sul De Minas",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "mix odrůd",
   "altitude": "900 – 1100 m n.m.",
   "summary": "Spolehlivé espresso s nízkou aciditou, silným a krémovým tělem. Je to nejkonzervativnější káva z naší nabídky, vyvážená a ideální pro každodenní pití.",
   "prepText": "Tuto kávu pražíme na espresso. Je vhodná především do automatických kávovarů, ale skvěle funguje i v pákových espresso kávovarech a pro domácí přípravu.",
   "priceFrom": 300,
   "priceTo": 2086,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 300,
     "url": "https://fathers.cz/kava/espresso/minas",
     "sku": "25622f6a",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1043,
     "url": "https://fathers.cz/kava/espresso/minas",
     "sku": "c2ff1a7e",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2086,
     "url": "https://fathers.cz/kava/espresso/minas",
     "sku": "b2992439",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "kolumbie-el-diviso-ombligon",
   "kind": "coffee",
   "name": "Kolumbie – El Diviso – Ombligon",
   "url": "https://fathers.cz/kava/filtr/kolumbie-el-diviso-ombligon",
   "photo": "/assets/fathers/kolumbie-el-diviso-ombligon.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "heřmánkový čaj s medem",
    "sušený ananas"
   ],
   "origin": "Kolumbie · Acevedo, Huila",
   "region": "americas",
   "process": "promyté (washed)",
   "variety": "Ombligon",
   "altitude": "1 600-1 900 m n.m.",
   "summary": "Limitka od legendárního Nestora Lassa a Jhoana Vergary ze zpracovatelského centra Peñas Blancas v kolumbijské Huile. Jejich kávu už dobře znáte, tentokrát jde o odrůdu Ombligon, zpracovanou promytou metodou a praženou na filtr.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...).",
   "priceFrom": 343,
   "priceTo": 343,
   "weights": [
    100
   ],
   "variants": [
    {
     "grams": 100,
     "grind": "zrnková",
     "price": 343,
     "url": "https://fathers.cz/kava/filtr/kolumbie-el-diviso-ombligon",
     "sku": "6074c3ee",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "kolumbie-chapata-esp",
   "kind": "coffee",
   "name": "Kolumbie – Chapata",
   "url": "https://fathers.cz/kava/espresso/kolumbie-chapata-esp",
   "photo": "/assets/fathers/kolumbie-chapata-esp.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "kandovaný pomeranč",
    "badyán",
    "kakao"
   ],
   "origin": "Kolumbie · Anserma, Caldas",
   "region": "americas",
   "process": "suché (natural) s prodlouženou fermentací",
   "variety": "Castillo",
   "altitude": "1 800 m n. m.",
   "summary": "Káva Chapata si u nás v pražírně i u vás doma našla své místo velmi rychle. Je to ten typ kávy, kterou chcete pít každý den.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Kolumbie – Chapata",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/espresso/kolumbie-chapata-esp",
     "sku": "9577413b",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/espresso/kolumbie-chapata-esp",
     "sku": "31932717",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/espresso/kolumbie-chapata-esp",
     "sku": "cba64b77",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "kolumbie-chapata",
   "kind": "coffee",
   "name": "Kolumbie – Chapata",
   "url": "https://fathers.cz/kava/filtr/kolumbie-chapata",
   "photo": "/assets/fathers/kolumbie-chapata.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "kandovaný pomeranč",
    "badyán",
    "kakao"
   ],
   "origin": "Kolumbie · Anserma, Caldas",
   "region": "americas",
   "process": "suché (natural) s prodlouženou fermentací",
   "variety": "Castillo",
   "altitude": "1 800 m n. m.",
   "summary": "Káva Chapata si u nás v pražírně i u vás doma našla své místo velmi rychle. Je to ten typ kávy, kterou chcete pít každý den.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Clever Dripper...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Kolumbie – Chapata",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/filtr/kolumbie-chapata",
     "sku": "a8bb8bab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/filtr/kolumbie-chapata",
     "sku": "2e5c16ce",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/filtr/kolumbie-chapata",
     "sku": "a4ade0f8",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "etiopie-bensa-ayla-filter",
   "kind": "coffee",
   "name": "Etiopie – Bensa Ayla",
   "url": "https://fathers.cz/kava/filtr/etiopie-bensa-ayla-filter",
   "photo": "/assets/fathers/etiopie-bensa-ayla-filter.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "černý rybíz",
    "bílá čokoláda",
    "macešky"
   ],
   "origin": "Etiopie · Sidama, Bensa, Bombe",
   "region": "africa",
   "process": "suché (natural)",
   "variety": "74110, 74158",
   "altitude": "1 950–2 150 m n. m.",
   "summary": "Etiopské kávy máme rádi pro jejich osobitý charakter a Bensa Ayla je krásným příkladem toho, proč se k nim stále vracíme. Pochází z oblasti Bombe v okrese Bensa, kde třešně ke zpracování dodává přibližně 725 drobných farmářů.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Clever Dripper...). Chcete ji na espresso? Pražíme ji i v espresso verzi. Najdete ji zde: Etiopie - Bensa Ayla",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/filtr/etiopie-bensa-ayla-filter",
     "sku": "3a8a8375",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/filtr/etiopie-bensa-ayla-filter",
     "sku": "f5fc13d7",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/filtr/etiopie-bensa-ayla-filter",
     "sku": "8495b07a",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "etiopie-bensa-ayla",
   "kind": "coffee",
   "name": "Etiopie – Bensa Ayla",
   "url": "https://fathers.cz/kava/espresso/etiopie-bensa-ayla",
   "photo": "/assets/fathers/etiopie-bensa-ayla.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "černý rybíz",
    "bílá čokoláda",
    "macešky"
   ],
   "origin": "Etiopie · Sidama, Bensa, Bombe",
   "region": "africa",
   "process": "suché (natural)",
   "variety": "74110, 74158",
   "altitude": "1 950–2 150 m n. m.",
   "summary": "Etiopské kávy máme rádi pro jejich osobitý charakter a Bensa Ayla je krásným příkladem toho, proč se k nim stále vracíme. Pochází z oblasti Bombe v okrese Bensa, kde třešně ke zpracování dodává přibližně 725 drobných farmářů.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr: Etiopie - Bensa Ayla",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/espresso/etiopie-bensa-ayla",
     "sku": "82a959b2",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/espresso/etiopie-bensa-ayla",
     "sku": "50585132",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/espresso/etiopie-bensa-ayla",
     "sku": "4b1a9d6c",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "uganda-namugowa",
   "kind": "coffee",
   "name": "Uganda – Namugowa",
   "url": "https://fathers.cz/kava/filtr/uganda-namugowa",
   "photo": "/assets/fathers/uganda-namugowa.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "kakaové boby",
    "hořká čokoláda",
    "broskve"
   ],
   "origin": "Uganda · Mt Elgon, východní Uganda",
   "region": "africa",
   "process": "promyté (cherry fermentation) (washed)",
   "variety": "Nyasaland, SL14, SL28",
   "altitude": "1 800 – 2 200 m n. m.",
   "summary": "Namugowa není jen další výběrová káva. Je to část většího příběhu, do kterého jsme sami vložili kus sebe.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (Solo Dripper, V60, Chemex, Aeropress, French press…). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Uganda - Namugowa",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/filtr/uganda-namugowa",
     "sku": "ccf71801",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/filtr/uganda-namugowa",
     "sku": "a0046fbf",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/filtr/uganda-namugowa",
     "sku": "f56d91b9",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "espnamugowa",
   "kind": "coffee",
   "name": "Uganda – Namugowa",
   "url": "https://fathers.cz/kava/espresso/espnamugowa",
   "photo": "/assets/fathers/espnamugowa.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "kakaové boby",
    "hořká čokoláda",
    "broskve"
   ],
   "origin": "Uganda · Mt Elgon, východní Uganda",
   "region": "africa",
   "process": "promyté (cherry fermentation) (washed)",
   "variety": "Nyasaland, SL14, SL28",
   "altitude": "1 800 – 2 200 m n. m.",
   "summary": "Namugowa není jen další výběrová káva. Je to část většího příběhu, do kterého jsme sami vložili kus sebe.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Uganda - Namugowa",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/espresso/espnamugowa",
     "sku": "9c720b21",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/espresso/espnamugowa",
     "sku": "986dac29",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/espresso/espnamugowa",
     "sku": "40b677ad",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "nikaragua-los-papales",
   "kind": "coffee",
   "name": "Nikaragua – Los Papales",
   "url": "https://fathers.cz/kava/espresso/nikaragua-los-papales",
   "photo": "/assets/fathers/nikaragua-los-papales.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "tmavá čokoláda",
    "lískový oříšek",
    "blumy"
   ],
   "origin": "Nikaragua · Jinotega",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "Red Catuaí",
   "altitude": "1 300–1 500 m n. m.",
   "summary": "Los Papales je káva, kterou už od nás znáte. Pochází z Nikaraguy, z regionu Jinotega, a stojí za ní rodina López, jejíž práce je pro nás dlouhodobou inspirací.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu.",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/espresso/nikaragua-los-papales",
     "sku": "fc55edb1",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/espresso/nikaragua-los-papales",
     "sku": "214f872d",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/espresso/nikaragua-los-papales",
     "sku": "bf97ad3c",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "kolumbie-el-diviso",
   "kind": "coffee",
   "name": "Kolumbie – El Diviso – Geisha",
   "url": "https://fathers.cz/kava/filtr/kolumbie-el-diviso",
   "photo": "/assets/fathers/kolumbie-el-diviso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "Bon Pari",
    "mango",
    "sušené datle",
    "růže"
   ],
   "origin": "Kolumbie · Acevedo, Huila",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "Gesha",
   "altitude": "1 600–1 900 m n. m.",
   "summary": "Kolumbijská limitka Gesha od Nestora Lassa a Jhoana Vergary ze zpracovatelského centra Peñas Blancas je káva, na kterou jsme se těšili. Suché zpracování jí dává šťavnatý ovocný charakter: v chuti připomíná Bon Pari, mango, sušené datle, růže",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...).",
   "priceFrom": 343,
   "priceTo": 343,
   "weights": [
    100
   ],
   "variants": [
    {
     "grams": 100,
     "grind": "zrnková",
     "price": 343,
     "url": "https://fathers.cz/kava/filtr/kolumbie-el-diviso",
     "sku": "7abead93",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "etiopie-kabira",
   "kind": "coffee",
   "name": "Etiopie – Kabira",
   "url": "https://fathers.cz/kava/filtr/etiopie-kabira",
   "photo": "/assets/fathers/etiopie-kabira.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "ostružiny",
    "bergamot",
    "jasmín",
    "krémová chuť"
   ],
   "origin": "Etiopie · Jimma, západní Etiopie",
   "region": "africa",
   "process": "suché (natural)",
   "variety": "74112, 74110",
   "altitude": "2 000–2 250 m n. m.",
   "summary": "Kabiru možná znáte z naší nabídky už dříve. Tentokrát za ní stojí nejen Mustefa Abakeno, kterého u nás můžete znát například z káv Beshasha, ale i jeho bratr Abdo Abamecha.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Etiopie - Kabira",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/filtr/etiopie-kabira",
     "sku": "3343a12d",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/filtr/etiopie-kabira",
     "sku": "f898c18f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/filtr/etiopie-kabira",
     "sku": "4a1d78e8",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "kabira",
   "kind": "coffee",
   "name": "Etiopie – Kabira",
   "url": "https://fathers.cz/kava/espresso/kabira",
   "photo": "/assets/fathers/kabira.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "ostružiny",
    "bergamot",
    "jasmín",
    "krémová chuť"
   ],
   "origin": "Etiopie · Jimma, západní Etiopie",
   "region": "africa",
   "process": "suché (natural)",
   "variety": "74112, 74110",
   "altitude": "2 000–2 250 m n. m.",
   "summary": "Kabiru možná znáte z naší nabídky už dříve. Tentokrát za ní stojí nejen Mustefa Abakeno, kterého u nás můžete znát například z káv Beshasha, ale i jeho bratr Abdo Abamecha.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Etiopie - Kabira",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/espresso/kabira",
     "sku": "003b6468",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/espresso/kabira",
     "sku": "12e672b0",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/espresso/kabira",
     "sku": "6601c658",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "guatemala-granada",
   "kind": "coffee",
   "name": "Guatemala – Granada",
   "url": "https://fathers.cz/kava/filtr/guatemala-granada",
   "photo": "/assets/fathers/guatemala-granada.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "kešu",
    "švestky",
    "meduňkový čaj"
   ],
   "origin": "Guatemala · Huehuetenango",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "Caturra, Bourbon",
   "altitude": "1 300-1 600 m n. m.",
   "summary": "Granada pochází z guatemalské farmy Finca La Bolsa v oblasti Huehuetenango. Farmu založil v roce 1958 Jorge Vides a dnes ji vede další generace rodiny Vides.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Guatemala - Granada",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/filtr/guatemala-granada",
     "sku": "24a0e1d0",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/filtr/guatemala-granada",
     "sku": "a1e84945",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/filtr/guatemala-granada",
     "sku": "1642535d",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "granada",
   "kind": "coffee",
   "name": "Guatemala – Granada",
   "url": "https://fathers.cz/kava/espresso/granada",
   "photo": "/assets/fathers/granada.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "kešu",
    "švestky",
    "meduňkový čaj"
   ],
   "origin": "Guatemala · Huehuetenango",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "Caturra, Bourbon",
   "altitude": "1 300-1 600 m n. m.",
   "summary": "Granada pochází z guatemalské farmy Finca La Bolsa v oblasti Huehuetenango. Farmu založil v roce 1958 Jorge Vides a dnes ji vede další generace rodiny Vides.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Guatemala - Granada",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/espresso/granada",
     "sku": "d4289950",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/espresso/granada",
     "sku": "68ede147",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/espresso/granada",
     "sku": "9c7717ce",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "guatemala-el-buho",
   "kind": "coffee",
   "name": "Guatemala – El Buho",
   "url": "https://fathers.cz/kava/espresso/guatemala-el-buho",
   "photo": "/assets/fathers/guatemala-el-buho.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "limetka",
    "makadamový ořech",
    "mrkvový dort"
   ],
   "origin": "Guatemala · La Libertad, Huehuetenango",
   "region": "americas",
   "process": "promyté (washed)",
   "variety": "Caturra & Bourbon",
   "altitude": "1800 m n. m.",
   "summary": "El Buho nese jméno po sovách, které jsou v noci slyšet na okraji původního lesa v guatemalském Huehuetenangu. Je to káva s klidným, sladkým profilem a chutí limetky, makadamového ořechu a mrkvového dortu.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu.",
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/espresso/guatemala-el-buho",
     "sku": "b2b9ab08",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/espresso/guatemala-el-buho",
     "sku": "124cf7a1",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/espresso/guatemala-el-buho",
     "sku": "0249cf77",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "uganda-zebigi-filtr",
   "kind": "coffee",
   "name": "Uganda – Zebigi",
   "url": "https://fathers.cz/kava/filtr/uganda-zebigi",
   "photo": "/assets/fathers/uganda-zebigi-filtr.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "heřmánkový čaj",
    "máslové sušenky",
    "pomelo"
   ],
   "origin": "Uganda · Mt Elgon, East Uganda",
   "region": "africa",
   "process": "promytá / dry fermentation (washed)",
   "variety": "SL14, SL28, Nyasaland",
   "altitude": "1 800 – 2 200 m n. m.",
   "summary": "Zebigi není jen další výběrová káva. Je to část většího příběhu, do kterého jsme sami vložili kus sebe.",
   "prepText": "Tuto kávu pražíme na filtr. Vhodná pro všechny druhy přípravy filtrované kávy (Solo dripper, V60, Aeropress, Chemex, French press, Chytráček…) Tuhle kávu najdete také ve variantě pražené na espresso.",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/filtr/uganda-zebigi",
     "sku": "a8bb8bab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/filtr/uganda-zebigi",
     "sku": "2e5c16ce",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/filtr/uganda-zebigi",
     "sku": "a4ade0f8",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "brazilie-julia-campos",
   "kind": "coffee",
   "name": "Brazílie – Julia Campos",
   "url": "https://fathers.cz/kava/filtr/brazilie-julia-campos",
   "photo": "/assets/fathers/brazilie-julia-campos.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "Baileys",
    "citronová tráva",
    "datle"
   ],
   "origin": "Brazílie · South of Minas, město Três Pontas-MG",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "Acaua, Mundo Novo, Paraiso, Yellow Catuai a Icatu",
   "altitude": "1200 m n. m.",
   "summary": "Káva z jihoamerických svahů ze stanice Sítio da Jaja v Brazílii, kterou pražíme ve dvou variantách - jak na espresso, tak i na filtr. Směs odrůd Acaua, Mundo Novo, Paraiso, Yellow Catuai a Icatu zpracovaná suchou metodou s tóny Baileys, citronévé trávy a datlí.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Julia Campos - espresso",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/filtr/brazilie-julia-campos",
     "sku": "965cf983",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/filtr/brazilie-julia-campos",
     "sku": "143b70f2",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/filtr/brazilie-julia-campos",
     "sku": "5d55ba9a",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "brazilie-juliacampos-espresso",
   "kind": "coffee",
   "name": "Brazílie – Julia Campos",
   "url": "https://fathers.cz/kava/espresso/brazilie-juliacampos-espresso",
   "photo": "/assets/fathers/brazilie-juliacampos-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "Baileys",
    "citronová tráva",
    "datle"
   ],
   "origin": "Brazílie · South of Minas, město Três Pontas-MG",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "Acaua, Mundo Novo, Paraiso, Yellow Catuai a Icatu",
   "altitude": "1200 m n. m.",
   "summary": "Káva z jihoamerických svahů ze stanice Sítio da Jaja v Brazílii, kterou pražíme ve dvou variantách - jak na espresso, tak i na filtr. Směs odrůd Acaua, Mundo Novo, Paraiso, Yellow Catuai a Icatu zpracovaná suchou metodou s tóny Baileys, citronévé trávy a datlí.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Julia Campos - filtr",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/espresso/brazilie-juliacampos-espresso",
     "sku": "0d63f142",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/espresso/brazilie-juliacampos-espresso",
     "sku": "e7d238ea",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/espresso/brazilie-juliacampos-espresso",
     "sku": "5e0f7eab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "etiopie-chelbesa-espresso",
   "kind": "coffee",
   "name": "Etiopie – Chelbesa",
   "url": "https://fathers.cz/kava/espresso/etiopie-chelbesa",
   "photo": "/assets/fathers/etiopie-chelbesa-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "jasmín",
    "bergamot",
    "broskový čaj",
    "med"
   ],
   "origin": "Etiopie · Gedeb",
   "region": "africa",
   "process": "promyté (washed)",
   "variety": "74110, 74112",
   "altitude": "2150 – 2200 m n. m.",
   "summary": "Káva z etiopské stanice Chelbesa od producenta Ephtah patří mezi ty, ke kterým se ve Father’s rádi vracíme a nejen pro to, že je známe osobně. Lokální etiopské odrůdy zpracované promytou metodou jsme pro vás upražili jak ve verzi na filtr, tak i ve verzi na espresso.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Chelbesa - filtr",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/espresso/etiopie-chelbesa",
     "sku": "b3a7ab2f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/espresso/etiopie-chelbesa",
     "sku": "d90b90f5",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/espresso/etiopie-chelbesa",
     "sku": "4408b21f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "etiopie-chelbesa-filtr",
   "kind": "coffee",
   "name": "Etiopie – Chelbesa",
   "url": "https://fathers.cz/kava/filtr/etiopie-chelbesa",
   "photo": "/assets/fathers/etiopie-chelbesa-filtr.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "jasmín",
    "bergamot",
    "broskový čaj",
    "med"
   ],
   "origin": "Etiopie · Gedeb",
   "region": "africa",
   "process": "promyté (washed)",
   "variety": "74110, 74112",
   "altitude": "2150 – 2200 m n. m.",
   "summary": "Káva z etiopské stanice Chelbesa od producenta Ephtah patří mezi ty, ke kterým se ve Father’s rádi vracíme a nejen pro to, že je známe osobně. Lokální etiopské odrůdy zpracované promytou metodou jsme pro vás upražili jak ve verzi na filtr, tak i ve verzi na espresso.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Clever Dripper...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Chelbesa - espresso",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/filtr/etiopie-chelbesa",
     "sku": "b3a7ab2f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/filtr/etiopie-chelbesa",
     "sku": "d90b90f5",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/filtr/etiopie-chelbesa",
     "sku": "4408b21f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "etiopie-edn-pineapple",
   "kind": "coffee",
   "name": "Etiopie – Edn Pineapple",
   "url": "https://fathers.cz/kava/filtr/etiopie-edn-pineapple",
   "photo": "/assets/fathers/etiopie-edn-pineapple.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "pečený ananas",
    "borůvkový cheescake"
   ],
   "origin": "Etiopie · Banko Chelchele, Gedeb, Yirgacheffe",
   "region": "africa",
   "process": "speciální fermentace (anaerobní s ovocem a bylinami, následné suché sušení) (natural)",
   "variety": "74112, 74110",
   "altitude": "1900–2300 m n. m.",
   "summary": "Uprostřed divoké a nádherné přírody etiopského regionu Yirgacheffe, ve vesnici Banko Chelchele, roste káva, na kterou jsme se v pražírně nesmírně těšili, protože její zpracování slibuje nevšední chuťový zážitek. Tato výběrová zrnková káva pochází z Etiopie a je zpracovaná metodou speciální fermentace.",
   "prepText": "Vhodná pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...).",
   "priceFrom": 301,
   "priceTo": 301,
   "weights": [
    100
   ],
   "variants": [
    {
     "grams": 100,
     "grind": "zrnková",
     "price": 301,
     "url": "https://fathers.cz/kava/filtr/etiopie-edn-pineapple",
     "sku": "116c63fc",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "etiopie-beshasha",
   "kind": "coffee",
   "name": "Etiopie – Beshasha",
   "url": "https://fathers.cz/kava/filtr/etiopie-beshasha",
   "photo": "/assets/fathers/etiopie-beshasha.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "bezový květ",
    "černý čaj",
    "pomelo"
   ],
   "origin": "Etiopie · Agaro, Jimma, západní Etiopie",
   "region": "africa",
   "process": "promyté (washed)",
   "variety": "74110, 74112",
   "altitude": "2000–2100 m n. m.",
   "summary": "Kávu od Mustefy máme rádi my i vy a v pražírně se na ni každou sezónu znovu těšíme. Tato výběrová zrnková káva pochází z Etiopie, stanice Beshasha a je zpracovaná promytou metodou.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Chytráček...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Beshasha - espresso",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/filtr/etiopie-beshasha",
     "sku": "c15c90d0",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/filtr/etiopie-beshasha",
     "sku": "4b71e022",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/filtr/etiopie-beshasha",
     "sku": "e1542c1c",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "etiopie-beshasha-espresso",
   "kind": "coffee",
   "name": "Etiopie – Beshasha",
   "url": "https://fathers.cz/kava/espresso/etiopie-beshasha-espresso",
   "photo": "/assets/fathers/etiopie-beshasha-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fresh"
   ],
   "notes": [
    "bezový květ",
    "černý čaj",
    "pomelo"
   ],
   "origin": "Etiopie · Agaro, Jimma, západní Etiopie",
   "region": "africa",
   "process": "promyté (washed)",
   "variety": "74110, 74112",
   "altitude": "2000–2100 m n. m.",
   "summary": "Kávu od Mustefy máme rádi my i vy a v pražírně se na ni každou sezónu znovu těšíme. Tato výběrová zrnková káva pochází z Etiopie, stanice Beshasha a je zpracovaná promytou metodou.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Beshasha - filtr",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/espresso/etiopie-beshasha-espresso",
     "sku": "0bde39de",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/espresso/etiopie-beshasha-espresso",
     "sku": "114ea1f0",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/espresso/etiopie-beshasha-espresso",
     "sku": "811851d5",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fresh"
  },
  {
   "id": "brazilie-cafeina",
   "kind": "coffee",
   "name": "Brazílie – Cafeina",
   "url": "https://fathers.cz/kava/espresso/brazilie-cafeina",
   "photo": "/assets/fathers/brazilie-cafeina.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "lískooříškové máslo",
    "višně",
    "čokoláda",
    "sladký tabák"
   ],
   "origin": "Brazílie · Carmo De Cachoeira, Sul De Minas",
   "region": "americas",
   "process": "suché (natural)",
   "variety": "mix odrůd",
   "altitude": "900 – 1100 m n.m.",
   "summary": "Naše Cafeina je každodenní jistotou stabilního espressa s nízkou aciditou. Svou skladbou a pražením se snažíme, aby vždy chutnala s tóny: liskooříškového másla, višně, čokolády a sladkého tabáku.",
   "prepText": null,
   "priceFrom": 300,
   "priceTo": 2086,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 300,
     "url": "https://fathers.cz/kava/espresso/brazilie-cafeina",
     "sku": "a8bb8bab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1043,
     "url": "https://fathers.cz/kava/espresso/brazilie-cafeina",
     "sku": "2e5c16ce",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2086,
     "url": "https://fathers.cz/kava/espresso/brazilie-cafeina",
     "sku": "a4ade0f8",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "mothers-blend",
   "kind": "coffee",
   "name": "Mother’s Blend",
   "url": "https://fathers.cz/kava/espresso/mothers-blend",
   "photo": "/assets/fathers/mothers-blend.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "mléčná čokoláda",
    "květinové aroma",
    "plné krémové tělo"
   ],
   "origin": "Uganda · Upper Bukyabo",
   "region": "africa",
   "process": "promyté (washed)",
   "variety": "SL14, SL28, Nyasaland",
   "altitude": "1800-2200 m n.m.",
   "summary": "Plné krémové tělo, mléčná čokoláda a květinové aroma – to je Mother’s Blend, náš espresso blend, který si získal srdce baristů i domácích milovníků kávy. Není náhodou, že jde o naši druhou nejprodávanější kávu na espresso.",
   "prepText": "Vhodná pro přípravu espressa, do pákových i automatických kávovarů, i pro domácí přípravu.",
   "priceFrom": 325,
   "priceTo": 2260,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 325,
     "url": "https://fathers.cz/kava/espresso/mothers-blend",
     "sku": "a8bb8bab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1130,
     "url": "https://fathers.cz/kava/espresso/mothers-blend",
     "sku": "2e5c16ce",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2260,
     "url": "https://fathers.cz/kava/espresso/mothers-blend",
     "sku": "a4ade0f8",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "indonesie-ijen",
   "kind": "coffee",
   "name": "Indonésie – Ijen",
   "url": "https://fathers.cz/kava/espresso/indonesie-ijen",
   "photo": "/assets/fathers/indonesie-ijen.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "choco"
   ],
   "notes": [
    "pražené mandle",
    "tmavá čokoláda",
    "červené jablko"
   ],
   "origin": "Indonésie · Botolinggo Village, East Java Province (Mt. Ijen)",
   "region": "asia",
   "process": "promyté (washed)",
   "variety": "Komasti, Andungsari, Bourbon, Kartika",
   "altitude": "1100–1500 m n. m.",
   "summary": "Kevina a Kennyho jsme poznali osobně. V květnu 2025 jsme s nimi strávili několik dní přímo na Javě.",
   "prepText": "Tuto kávu pražíme na espresso. Vhodná pro přípravu espressa, do pákových i automatických kávovarů, i pro domácí přípravu.",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/espresso/indonesie-ijen",
     "sku": "a8bb8bab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/espresso/indonesie-ijen",
     "sku": "2e5c16ce",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/espresso/indonesie-ijen",
     "sku": "a4ade0f8",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "choco"
  },
  {
   "id": "decaf-atunkaa-kolumbie-espresso",
   "kind": "coffee",
   "name": "DECAF Atunkaa – Kolumbie",
   "url": "https://fathers.cz/kava/espresso/decaf-atunkaa-kolumbie",
   "photo": "/assets/fathers/decaf-atunkaa-kolumbie-espresso.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": true,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "pomerančový koláč",
    "třtinový cukr",
    "bílý čaj"
   ],
   "origin": "Kolumbie · Rio Sucio, Caldas",
   "region": "americas",
   "process": "promyté, sugar cane decaf (washed)",
   "variety": "Castillo, Colombia",
   "altitude": "1600-2000 m n.m.",
   "summary": "Káva bez kofeinu z Kolumbie, zbavená kofeinu přírodní metodou sugar cane; název Atunkaa znamená „spánek a ospalé sny“.",
   "prepText": null,
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/espresso/decaf-atunkaa-kolumbie",
     "sku": "b3a7ab2f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/espresso/decaf-atunkaa-kolumbie",
     "sku": "d90b90f5",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/espresso/decaf-atunkaa-kolumbie",
     "sku": "4408b21f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "decafNote": "Kofein odstraněn přírodní metodou sugar cane (výtažek z cukrové třtiny).",
   "taste": "fruitFull"
  },
  {
   "id": "decaf-atunkaa-kolumbie-filtr",
   "kind": "coffee",
   "name": "DECAF Atunkaa – Kolumbie",
   "url": "https://fathers.cz/kava/filtr/decaf-atunkaa-kolumbie",
   "photo": "/assets/fathers/decaf-atunkaa-kolumbie-filtr.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": true,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "pomerančový koláč",
    "třtinový cukr",
    "bílý čaj"
   ],
   "origin": "Kolumbie · Rio Sucio, Caldas",
   "region": "americas",
   "process": "promyté, sugar cane decaf (washed)",
   "variety": "Castillo, Colombia",
   "altitude": "1600-2000 m n.m.",
   "summary": "Káva bez kofeinu z Kolumbie, zbavená kofeinu přírodní metodou sugar cane; název Atunkaa znamená „spánek a ospalé sny“.",
   "prepText": null,
   "priceFrom": 400,
   "priceTo": 2782,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://fathers.cz/kava/filtr/decaf-atunkaa-kolumbie",
     "sku": "b3a7ab2f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1391,
     "url": "https://fathers.cz/kava/filtr/decaf-atunkaa-kolumbie",
     "sku": "d90b90f5",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2782,
     "url": "https://fathers.cz/kava/filtr/decaf-atunkaa-kolumbie",
     "sku": "4408b21f",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "decafNote": "Kofein odstraněn přírodní metodou sugar cane (výtažek z cukrové třtiny).",
   "taste": "fruitFull"
  },
  {
   "id": "nikaragua-tierra-linda",
   "kind": "coffee",
   "name": "Nikaragua – Tierra Linda",
   "url": "https://fathers.cz/kava/espresso/nikaragua-tierra-linda",
   "photo": "/assets/fathers/nikaragua-tierra-linda.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "espresso"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "perník",
    "višně",
    "meduňkový čaj"
   ],
   "origin": "Nikaragua · Dipilto, Nueva Segovia",
   "region": "americas",
   "process": "promyté (washed)",
   "variety": "Caturra, Red Catuaí",
   "altitude": "1 220 m n. m.",
   "summary": "Tierra Linda znamená „krásná země“ - a u téhle kávy nám ten název dává smysl i tím, jak se na farmách pracuje s půdou, stínem a zdravím rostlin. Máme ji rádi i pro její klidný, čistý charakter.",
   "prepText": "Tuto kávu pražíme na espresso. Hodí se do pákových i automatických kávovarů, i pro domácí přípravu. Chcete ji na filtr? Pražíme ji i ve verzi na filtr - najdete ji zde: Nikaragua - Tierra Linda",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/espresso/nikaragua-tierra-linda",
     "sku": "c951a3e1",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/espresso/nikaragua-tierra-linda",
     "sku": "bcb87af2",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/espresso/nikaragua-tierra-linda",
     "sku": "8580501c",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "nikaragua-bethania",
   "kind": "coffee",
   "name": "Nikaragua – Bethania",
   "url": "https://fathers.cz/kava/filtr/nikaragua-bethania",
   "photo": "/assets/fathers/nikaragua-bethania.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "sušené brusinky",
    "nugát",
    "bílý čaj"
   ],
   "origin": "Nikaragua · Macuelizo, Nueva Segovia",
   "region": "americas",
   "process": "suché (natural), anaerobní",
   "variety": "Java",
   "altitude": "1 250–1 500 m n. m.",
   "summary": "Bethania je káva, která se k nám opakovaně vrací, protože ji máme rádi nejen pro její chuť, ale i pro práci farmy Finca Bethania. Ta klade důraz na udržitelnost, recykluje vodu použitou při zpracování kávy a pečuje o zachování přirozeného lesa, místního ekosystému a volně žijících zvířat.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Clever Dripper...).",
   "priceFrom": 425,
   "priceTo": 2956,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 425,
     "url": "https://fathers.cz/kava/filtr/nikaragua-bethania",
     "sku": "b2c637e6",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1478,
     "url": "https://fathers.cz/kava/filtr/nikaragua-bethania",
     "sku": "a2fa4074",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2956,
     "url": "https://fathers.cz/kava/filtr/nikaragua-bethania",
     "sku": "432c8ef2",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  },
  {
   "id": "tierralinda",
   "kind": "coffee",
   "name": "Nikaragua – Tierra Linda",
   "url": "https://fathers.cz/kava/filtr/tierralinda",
   "photo": "/assets/fathers/tierralinda.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "roasts": [
    "filter"
   ],
   "tastes": [
    "fruitFull"
   ],
   "notes": [
    "perník",
    "višně",
    "meduňkový čaj"
   ],
   "origin": "Nikaragua · Dipilto, Nueva Segovia",
   "region": "americas",
   "process": "promyté (washed)",
   "variety": "Caturra, Red Catuaí",
   "altitude": "1 220 m n. m.",
   "summary": "Tierra Linda znamená „krásná země“ - a u téhle kávy nám ten název dává smysl i tím, jak se na farmách pracuje s půdou, stínem a zdravím rostlin. Máme ji rádi i pro její klidný, čistý charakter.",
   "prepText": "Tuto kávu pražíme na filtr. Hodí se pro všechny druhy přípravy filtrované kávy (V60, Solo Dripper, Aeropress, Chemex, French press, Clever Dripper...). Chcete ji na espresso? Pražíme ji i v espresso verzi - najdete ji zde: Nikaragua - Tierra Linda",
   "priceFrom": 375,
   "priceTo": 2608,
   "weights": [
    250,
    1000,
    2000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://fathers.cz/kava/filtr/tierralinda",
     "sku": "48fc05a2",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "zobrazená cena na stránce produktu"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1304,
     "url": "https://fathers.cz/kava/filtr/tierralinda",
     "sku": "2686b2ab",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    },
    {
     "grams": 2000,
     "grind": "zrnková",
     "price": 2608,
     "url": "https://fathers.cz/kava/filtr/tierralinda",
     "sku": "50a34210",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty pro Česko z dat e-shopu (s DPH, zaokrouhleno nahoru jako zobrazené ceny)"
    }
   ],
   "checkedAt": "2026-10-23",
   "taste": "fruitFull"
  }
 ],
 "drip": {
  "id": "drip-bag-roger-chilcon-peru",
  "kind": "drip",
  "name": "Drip bag – Roger Chilcon, Peru",
  "url": "https://fathers.cz/kava/dripbagy/drip-bag-roger-chilcon-peru",
  "photo": "/assets/fathers/drip-bag-roger-chilcon-peru.jpg",
  "currency": "CZK",
  "price": 202,
  "pack": "5 × 12 g",
  "priceVerified": true,
  "available": true,
  "checkedAt": "2026-10-23",
  "notes": [
   "pomeranč",
   "heřmánkový čaj",
   "kešu oříšky"
  ],
  "origin": "Peru · El Diamante, San José de Lourdes",
  "summary": "Mletá výběrová káva z Peru v pěti sáčcích po 12 g – stačí šálek a horká voda.",
  "options": [
   {
    "id": "5x12",
    "title": "5 sáčků × 12 g",
    "detail": "202 Kč",
    "price": 202,
    "pack": "5 × 12 g"
   }
  ],
  "brew": [
   "Drip bag zavěste na šálek a zalijte vroucí vodou do poloviny; počkejte 20 sekund.",
   "Pomalu dolijte po okraj, nechte odtéct a ještě jednou dolijte (postup pražírny)."
  ]
 }
};
  (g.N447_DATA = g.N447_DATA || {}).fathers = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : window);
