/* Nordbeans – ověřený katalog nové dávky (447 € + 10 €/měs., bez trialu). Zdroj: https://www.nordbeans.cz/kava/ a produktové
   stránky (JSON-LD ceny 250 g / 1000 g, blok Detaily: příprava, chuť, intenzita kyselosti, původ), staženo 2026-10-23.
   5 stránek e-shop zablokoval (403) – tyto kávy ve výběru nejsou. Chuťová skupina podle intenzity kyselosti od pražírny. */
(function (g) {
  'use strict';
  const DATA = {
 "slug": "nordbeans",
 "lang": "cs",
 "checkedAt": "2026-10-23",
 "beansOnly": true,
 "demo": {
  "heroProductId": "honduras"
 },
 "brand": {
  "name": "Nordbeans",
  "legal": "NORDBEANS s.r.o.",
  "place": "Nordbeans · čerstvá káva z hor",
  "shopUrl": "https://www.nordbeans.cz/kava/",
  "web": "https://www.nordbeans.cz/",
  "logo": "/assets/nordbeans/logo.png",
  "logoLight": "/assets/nordbeans/logo-light.png",
  "hero": "/assets/nordbeans/honduras.jpg",
  "contact": "info@nordbeans.cz",
  "contactSource": "https://www.nordbeans.cz/ (hlavička a údaje výrobce na stránce produktu)",
  "theme": {
   "ink": "#1c1c1c",
   "brand": "#1c1c1c",
   "accent": "#5fae9c",
   "soft": "#f4f1ec",
   "paper": "#ffffff"
  }
 },
 "tasteLabels": {
  "choco": [
   "Čokoládová a oříšková",
   "Nízká kyselost podle pražírny"
  ],
  "fruitFull": [
   "Vyvážená s ovocem",
   "Střední kyselost podle pražírny"
  ],
  "fresh": [
   "Svěží a ovocná",
   "Vysoká kyselost podle pražírny"
  ],
  "decaf": [
   "Bez kofeinu",
   "Káva i na večer"
  ]
 },
 "scope": "Zrnkové kávy z kategorie Káva, jejichž produktové stránky šlo načíst. Kapsle, rozpustná káva, čaje, předplatné, sady a vybavení nejsou ve výběru.",
 "excluded": [
  "Jizerky: na stránce není uvedena gramáž balení – vyřazeno",
  "Neověřeno – e-shop vrátil 403 (Access Denied), požadavky zastaveny: chelbesa-washed, el-cambalache-natural, keramo-natural, cocondo-natural, vara-blanca-honey",
  "kapsle (3), rozpustná káva, čtyřbalení (sada)",
  "balení 2000 g ve vratném obalu (velkoobchod)"
 ],
 "shop": {
  "freeShipping": "",
  "shippingNote": "Doprava od 69 Kč (podle stránky produktu).",
  "freeShippingSource": "https://www.nordbeans.cz/"
 },
 "products": [
  {
   "id": "bold-deer",
   "kind": "coffee",
   "name": "BOLD DEER",
   "url": "https://www.nordbeans.cz/bold-deer_z3626/",
   "photo": "/assets/nordbeans/bold-deer.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso"
   ],
   "roastLabel": "světlé pražení, řada Nordbeans",
   "prepText": "Pražírna ji doporučuje na: espresso",
   "taste": "fruitFull",
   "tastes": [
    "fruitFull"
   ],
   "acidityLabel": "Střední",
   "notes": [
    "marcipán",
    "maliny",
    "švestky"
   ],
   "origin": "Uganda",
   "region": "africa",
   "process": "Anaerobní Natural",
   "variety": "SL28, SL14, Catimor",
   "summary": "Mohutné tělo, přirozená sladkost a plná chuť, která se nebojí zůstat v paměti. Stejně jako jelen – hrdý a vyrovnaný, je i tohle espresso symbolem síly a vnitřního klidu.",
   "priceFrom": 375,
   "priceTo": 1363,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://www.nordbeans.cz/bold-deer_z3626/",
     "sku": "3626_1116",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1363,
     "url": "https://www.nordbeans.cz/bold-deer_z3626/",
     "sku": "3626_1117",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 18 g, voda 40 ml, poměr 1:2,7, čas 27 sec."
   }
  },
  {
   "id": "brazilie",
   "kind": "coffee",
   "name": "Brazílie",
   "url": "https://www.nordbeans.cz/brazilie_z22/",
   "photo": "/assets/nordbeans/brazilie.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "aeropress",
    "frenchpress"
   ],
   "roastLabel": "tmavé pražení, řada Sweet City",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, AeroPress, frenchpress, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nízká",
   "notes": [
    "čokoláda",
    "sušené ovoce",
    "arašídy"
   ],
   "origin": "Santos Brazílie",
   "region": "americas",
   "process": "Aerobní fermentace",
   "variety": null,
   "summary": "Objevte lahodnou chuť naší Brazílie Santos, která pochází z vyhlášené oblasti Minas Gerais v jihovýchodní Brazílii. Tato oblast je známá produkcí kávových zrn s nízkou aciditou a vysokou sladkostí, díky čemuž je káva oblíbená po celém světě.",
   "priceFrom": 250,
   "priceTo": 846,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 250,
     "url": "https://www.nordbeans.cz/brazilie_z22/",
     "sku": "22_422",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 846,
     "url": "https://www.nordbeans.cz/brazilie_z22/",
     "sku": "22_423",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "buena-vista",
   "kind": "coffee",
   "name": "Buena Vista",
   "url": "https://www.nordbeans.cz/buena-vista_z20/",
   "photo": "/assets/nordbeans/buena-vista.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka"
   ],
   "roastLabel": "tmavé pražení, řada Sweet City",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nízká",
   "notes": [
    "čokoláda",
    "zralé ovoce"
   ],
   "origin": "Brazílie",
   "region": "americas",
   "process": "Natural",
   "variety": null,
   "summary": "Pro milovníky tradičních káv, kteří chtějí vkročit do světa výběrové kávy, je náš blend Espresso Buena Vista dokonalou volbou. Tento blend pochází z Latinské Ameriky a skládá se z káv, které jsou vyhlášené svou bohatou chutí a aromatem.",
   "priceFrom": 288,
   "priceTo": 998,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 288,
     "url": "https://www.nordbeans.cz/buena-vista_z20/",
     "sku": "20_416",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 998,
     "url": "https://www.nordbeans.cz/buena-vista_z20/",
     "sku": "20_417",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "fearless-lynx-etiopie",
   "kind": "coffee",
   "name": "FEARLESS LYNX - Etiopie",
   "url": "https://www.nordbeans.cz/fearless-lynx-etiopie_z4055/",
   "photo": "/assets/nordbeans/fearless-lynx-etiopie.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "aeropress",
    "frenchpress"
   ],
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, AeroPress, frenchpress, automatický kávovar",
   "taste": "fresh",
   "tastes": [
    "fresh"
   ],
   "acidityLabel": "Vysoká",
   "notes": [
    "hroznové víno",
    "mandarinky",
    "jasmín"
   ],
   "origin": "Etiopie · Yirgacheffe",
   "region": "africa",
   "process": "Promyté (washed)",
   "variety": "Heirloom",
   "summary": "Rys tentokrát míří do Etiopie. Z Chelbesy přináší espresso s tóny hroznového vína, mandarinek a jasmínu.",
   "priceFrom": 400,
   "priceTo": 1460,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 400,
     "url": "https://www.nordbeans.cz/fearless-lynx-etiopie_z4055/",
     "sku": "4055_1527",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1460,
     "url": "https://www.nordbeans.cz/fearless-lynx-etiopie_z4055/",
     "sku": "4055_1528",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 17 g, voda 45ml, poměr 1:2,6, čas 23 sec."
   }
  },
  {
   "id": "guatemala-washed",
   "kind": "coffee",
   "name": "Guatemala Washed",
   "url": "https://www.nordbeans.cz/guatemala-washed_z3916/",
   "photo": "/assets/nordbeans/guatemala-washed.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka"
   ],
   "roastLabel": "střední pražení, řada Nový Standard",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nižší",
   "notes": [
    "jablko",
    "mléčná čokoláda",
    "karamel"
   ],
   "origin": "Guatemala",
   "region": "americas",
   "process": "Promyté (washed)",
   "variety": "Caturra, Catuaí",
   "summary": "Sladký karamel a čokoláda v každém zrnku. Taková je káva z vysokých hor Guatemaly.",
   "priceFrom": 300,
   "priceTo": 1071,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 300,
     "url": "https://www.nordbeans.cz/guatemala-washed_z3916/",
     "sku": "3916_1346",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1071,
     "url": "https://www.nordbeans.cz/guatemala-washed_z3916/",
     "sku": "3916_1347",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "honduras",
   "kind": "coffee",
   "name": "Honduras",
   "url": "https://www.nordbeans.cz/honduras_z3564/",
   "photo": "/assets/nordbeans/honduras.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "aeropress"
   ],
   "roastLabel": "střední pražení, řada Nový Standard",
   "prepText": "Pražírna ji doporučuje na: moka konvička, AeroPress, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nízká",
   "notes": [
    "sladká",
    "čokoládová",
    "oříšková"
   ],
   "origin": "Honduras",
   "region": "americas",
   "process": "Promyté (washed)",
   "variety": "Catuaí, Pacas, Paraneima",
   "summary": "Honduras je káva, která propojuje tradiční espresso se světem výběrové kávy. Smetanově oříšková chuť, jemné krémové tělo a nízká acidita dělají z této kávy dokonalý vstupní bod pro každého, kdo chce objevit kvalitu a čistotu výběrové produkce.",
   "priceFrom": 351,
   "priceTo": 1201,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 351,
     "url": "https://www.nordbeans.cz/honduras_z3564/",
     "sku": "3564_1107",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1201,
     "url": "https://www.nordbeans.cz/honduras_z3564/",
     "sku": "3564_1108",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 15 g, voda 45 ml, poměr 1:3, čas 30 sec."
   }
  },
  {
   "id": "horizont",
   "kind": "coffee",
   "name": "Horizont",
   "url": "https://www.nordbeans.cz/horizont_z15/",
   "photo": "/assets/nordbeans/horizont.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "frenchpress"
   ],
   "roastLabel": "střední pražení, řada Nový Standard",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, frenchpress, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nižší",
   "notes": [
    "čokoláda",
    "oříšky",
    "zralé ovoce"
   ],
   "origin": "Brazílie/Kamerun",
   "region": "blend",
   "process": "Natural",
   "variety": "Yellow & Red Catuaí",
   "summary": "Středobod naší nabídky – stabilní espresso, na které se můžete spolehnout. Kombinace Brazílie a Kamerunu vytváří dokonale vyváženou chuť plnou sladkých tónů mléčné čokolády a jemných tónů zralého peckového ovoce.",
   "priceFrom": 290,
   "priceTo": 1020,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 290,
     "url": "https://www.nordbeans.cz/horizont_z15/",
     "sku": "15_403",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1020,
     "url": "https://www.nordbeans.cz/horizont_z15/",
     "sku": "15_401",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "house-blend",
   "kind": "coffee",
   "name": "House Blend",
   "url": "https://www.nordbeans.cz/house-blend_z19/",
   "photo": "/assets/nordbeans/house-blend.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "frenchpress"
   ],
   "roastLabel": "tmavé pražení, řada Sweet City",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, frenchpress, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nízká",
   "notes": [
    "višně",
    "čokoláda",
    "oříšky"
   ],
   "origin": "Brazílie/Vietnam",
   "region": "blend",
   "process": null,
   "variety": null,
   "summary": "Espresso Houseblend je stvořený pro milovníky silné kávy, kteří chtějí zkusit něco nového ze světa výběrových káv, ale nechtějí se vzdát robustní chuti, na kterou jsou zvyklí.",
   "priceFrom": 246,
   "priceTo": 818,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 246,
     "url": "https://www.nordbeans.cz/house-blend_z19/",
     "sku": "19_413",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 818,
     "url": "https://www.nordbeans.cz/house-blend_z19/",
     "sku": "19_414",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "limited-nanolot-odako-natural",
   "kind": "coffee",
   "name": "Limited Nanolot: Odako Natural",
   "url": "https://www.nordbeans.cz/limited-nanolot-odako-natural_z4005/",
   "photo": "/assets/nordbeans/limited-nanolot-odako-natural.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "filter"
   ],
   "tools": [
    "v60",
    "aeropress",
    "frenchpress"
   ],
   "prepText": "Pražírna ji doporučuje na: filtr, AeroPress, frenchpress, chemex, batch brew",
   "taste": "fruitFull",
   "tastes": [
    "fruitFull"
   ],
   "acidityLabel": "Střední",
   "notes": [
    "kandovaný pomeranč",
    "meruňky",
    "jasmín"
   ],
   "origin": "Etiopie · Sidama",
   "region": "africa",
   "process": "Natural",
   "variety": "JARC 74112",
   "summary": "Odako je výjimečný nanolot z etiopského regionu Sidama – mimořádně malá šarže pocházející z okolí vesnice Shantawene. Kávovníky zde rostou ve stínu staletých stromů, mezi divokými řekami a vodopády.",
   "priceFrom": 700,
   "priceTo": 2500,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 700,
     "url": "https://www.nordbeans.cz/limited-nanolot-odako-natural_z4005/",
     "sku": "4005_1467",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 2500,
     "url": "https://www.nordbeans.cz/limited-nanolot-odako-natural_z4005/",
     "sku": "4005_1468",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23"
  },
  {
   "id": "limited-nanolot-rumu-damo-washed",
   "kind": "coffee",
   "name": "Limited Nanolot: Rumu Damo Washed",
   "url": "https://www.nordbeans.cz/limited-nanolot-rumu-damo-washed_z4004/",
   "photo": "/assets/nordbeans/limited-nanolot-rumu-damo-washed.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "filter"
   ],
   "tools": [
    "v60",
    "aeropress",
    "frenchpress"
   ],
   "prepText": "Pražírna ji doporučuje na: filtr, AeroPress, frenchpress, chemex, batch brew",
   "taste": "fruitFull",
   "tastes": [
    "fruitFull"
   ],
   "acidityLabel": "Střední",
   "notes": [
    "nektarinky",
    "citronová tráva",
    "jahody"
   ],
   "origin": "Etiopie · Sidama",
   "region": "africa",
   "process": "Anaerobic Washed",
   "variety": "Heirloom",
   "summary": "Výjimečná káva, které vzniklo jen několik málo pytlů. Rumu Damo je nanolot z etiopské Sidamy – mimořádně malá a opravdu pečlivě vybraná šarže, která zachycuje jedinečný charakter konkrétního místa a sklizně.",
   "priceFrom": 600,
   "priceTo": 2143,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 600,
     "url": "https://www.nordbeans.cz/limited-nanolot-rumu-damo-washed_z4004/",
     "sku": "4004_1463",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 2143,
     "url": "https://www.nordbeans.cz/limited-nanolot-rumu-damo-washed_z4004/",
     "sku": "4004_1464",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23"
  },
  {
   "id": "market-blend",
   "kind": "coffee",
   "name": "Market Blend",
   "url": "https://www.nordbeans.cz/market-blend_z24/",
   "photo": "/assets/nordbeans/market-blend.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "frenchpress"
   ],
   "roastLabel": "tmavé pražení, řada Sweet City",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, frenchpress, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nízká",
   "notes": [
    "hořká čokoláda",
    "sušené ovoce",
    "arašídy"
   ],
   "origin": "Latinská Amerika & Afrika",
   "region": "blend",
   "process": null,
   "variety": null,
   "summary": "Market Blend je ideální start pro ty, kteří chtějí vstoupit do světa výběrových káv bez velkého rizika.",
   "priceFrom": 240,
   "priceTo": 810,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 240,
     "url": "https://www.nordbeans.cz/market-blend_z24/",
     "sku": "24_428",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 810,
     "url": "https://www.nordbeans.cz/market-blend_z24/",
     "sku": "24_429",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "pamet-naroda-sametova",
   "kind": "coffee",
   "name": "Paměť národa - Sametová",
   "url": "https://www.nordbeans.cz/pamet-naroda-sametova_z596/",
   "photo": "/assets/nordbeans/pamet-naroda-sametova.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "aeropress",
    "frenchpress"
   ],
   "roastLabel": "střední pražení, řada Nový Standard",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, AeroPress, frenchpress, automatický kávovar",
   "taste": "choco",
   "tastes": [
    "choco"
   ],
   "acidityLabel": "Nižší",
   "notes": [
    "zralé ovoce",
    "ořechy",
    "žluté jablko"
   ],
   "origin": "Honduras",
   "region": "americas",
   "process": "Promyté (washed)",
   "variety": "Catuaí",
   "summary": "Spolupracujeme s místními médii, úřady a kulturními organizacemi.",
   "priceFrom": 325,
   "priceTo": 1169,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 325,
     "url": "https://www.nordbeans.cz/pamet-naroda-sametova_z596/",
     "sku": "596_624",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1169,
     "url": "https://www.nordbeans.cz/pamet-naroda-sametova_z596/",
     "sku": "596_641",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 16 g, voda 45 ml, poměr 1:2,8, čas 26 sec."
   }
  },
  {
   "id": "sleepy-sheep",
   "kind": "coffee",
   "name": "SLEEPY SHEEP",
   "url": "https://www.nordbeans.cz/sleepy-sheep_z755/",
   "photo": "/assets/nordbeans/sleepy-sheep.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": true,
   "preps": [
    "espresso",
    "filter"
   ],
   "tools": [
    "v60",
    "aeropress",
    "frenchpress"
   ],
   "roastLabel": "světlé pražení, řada Nordbeans",
   "prepText": "Pražírna ji doporučuje na: espresso, filtr, AeroPress, frenchpress, chemex, batch brew",
   "taste": "fruitFull",
   "tastes": [
    "fruitFull"
   ],
   "acidityLabel": "Střední",
   "notes": [
    "broskev",
    "bezinka",
    "jahoda"
   ],
   "origin": "Kolumbie",
   "region": "americas",
   "process": "Natural, Sugarcane Decaf",
   "variety": null,
   "summary": "Atunkaa je káva, která přináší nejen skvělý chuťový zážitek bez kofeinu, ale také silný příběh. Pochází z oblasti Argelia v jihozápadní části departementu Cauca v Kolumbii.",
   "priceFrom": 375,
   "priceTo": 1363,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 375,
     "url": "https://www.nordbeans.cz/sleepy-sheep_z755/",
     "sku": "755_749",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1363,
     "url": "https://www.nordbeans.cz/sleepy-sheep_z755/",
     "sku": "755_750",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "decafNote": "Kofein odstraněn metodou sugarcane decaf (podle pražírny)."
  },
  {
   "id": "uganda",
   "kind": "coffee",
   "name": "Uganda",
   "url": "https://www.nordbeans.cz/uganda_z3670/",
   "photo": "/assets/nordbeans/uganda.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "aeropress",
    "frenchpress"
   ],
   "roastLabel": "střední pražení, řada Nový Standard",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, AeroPress, frenchpress, automatický kávovar",
   "taste": "fruitFull",
   "tastes": [
    "fruitFull"
   ],
   "acidityLabel": "Střední",
   "notes": [
    "sladká",
    "citrusová",
    "čokoládová"
   ],
   "origin": "Uganda",
   "region": "africa",
   "process": "Natural",
   "variety": "Catimor, SL34",
   "summary": "\"Uganda je na vzestupu – a my jsme u toho. Kávy z Ugandy milujeme pro jejich sladkost s tóny čokolády, citrusů a rozinek.",
   "priceFrom": 300,
   "priceTo": 1071,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 300,
     "url": "https://www.nordbeans.cz/uganda_z3670/",
     "sku": "3670_1162",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1071,
     "url": "https://www.nordbeans.cz/uganda_z3670/",
     "sku": "3670_1159",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 15 g, voda 45 ml, poměr 1:3, čas 30 sec."
   }
  },
  {
   "id": "wild-fox-espresso-brazilie",
   "kind": "coffee",
   "name": "WILD FOX ESPRESSO - Brazílie",
   "url": "https://www.nordbeans.cz/wild-fox-espresso-brazilie_z4054/",
   "photo": "/assets/nordbeans/wild-fox-espresso-brazilie.jpg",
   "currency": "CZK",
   "available": true,
   "decaf": false,
   "preps": [
    "espresso",
    "moka",
    "filter"
   ],
   "tools": [
    "aeropress",
    "frenchpress"
   ],
   "roastLabel": "světlé pražení, řada Nordbeans",
   "prepText": "Pražírna ji doporučuje na: espresso, moka konvička, AeroPress, frenchpress, automatický kávovar",
   "taste": "fresh",
   "tastes": [
    "fresh"
   ],
   "acidityLabel": "Vysoká",
   "notes": [
    "mandle",
    "jahody",
    "čokoláda"
   ],
   "origin": "Brazílie · Sul de Minas",
   "region": "americas",
   "process": "Anaerobní Natural",
   "variety": "Yellow Bourbon",
   "summary": "Liška má novou stopu. Vede do Brazílie k Otáviu Reisovi a voní po mandlích, jahodách a čokoládě.",
   "priceFrom": 300,
   "priceTo": 1071,
   "weights": [
    250,
    1000
   ],
   "variants": [
    {
     "grams": 250,
     "grind": "zrnková",
     "price": 300,
     "url": "https://www.nordbeans.cz/wild-fox-espresso-brazilie_z4054/",
     "sku": "4054_1524",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    },
    {
     "grams": 1000,
     "grind": "zrnková",
     "price": 1071,
     "url": "https://www.nordbeans.cz/wild-fox-espresso-brazilie_z4054/",
     "sku": "4054_1525",
     "available": true,
     "verifiedAt": "2026-10-23",
     "source": "cena varianty ze stránky produktu (strukturovaná data e-shopu)"
    }
   ],
   "checkedAt": "2026-10-23",
   "recipes": {
    "espresso": "Espresso podle pražírny: káva 17 g, voda 42 ml, poměr 1:2,4, čas 28 sec."
   }
  }
 ]
};
  (g.N447_DATA = g.N447_DATA || {}).nordbeans = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : window);
