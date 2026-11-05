/* BLACK. (pražiareň black., Bratislava) – c2: katalóg z primárnych údajov verejného UI e-shopu (Codex 29. 10. 2026:
   17 produktov, 76 objednateľných kombinácií praženie × gramáž pri mletí „Zrnková“; 2 neobjednateľné kombinácie vyradené).
   Akciové ceny sú zachované tak, ako ich e-shop zobrazil (black sheep 500 g za 10 €); bežná cena je v regularPrice.
   Fakty o pôvode a tónoch z produktových stránok (22.–27. 10.). Vygenerované: tools/c2/build_black.mjs. */
(function (g) {
  'use strict';
  const DATA = {
 "slug": "black",
 "lang": "sk",
 "checkedAt": "2026-10-29",
 "demo": {
  "heroProductId": "doce-citrus",
  "logoMono": true,
  "logoWide": true
 },
 "brand": {
  "name": "black.",
  "legal": "pražiareň black.",
  "place": "Pražiareň black. · Bratislava",
  "shopUrl": "https://www.black.sk/sk/e-shop/kava",
  "web": "https://www.black.sk/sk",
  "logo": "/assets/black/logo.png",
  "hero": "/assets/black/hero.jpg",
  "contact": "ahoj@black.sk",
  "contactSource": "https://www.black.sk/sk/kontakt",
  "theme": {
   "ink": "#141414",
   "brand": "#141414",
   "accent": "#141414",
   "soft": "#f3f1ee",
   "paper": "#ffffff"
  }
 },
 "scope": "Všetkých 16 zrnkových káv z kategórie káva a drip vrecúška drippin., ako ich 29. 10. 2026 ukazovalo verejné UI e-shopu. Cena platí pre zrnkovú kávu (mletie Zrnková); cenu iného mletia sme neoverovali. Kapsule, cascara, doplnky a merch nie sú vo výbere.",
 "excluded": [
  {
   "name": "cascara • costa rica las lajas",
   "url": "https://www.black.sk/sk/cascara",
   "reason": "Čaj zo sušenej kávovej čerešne, nie káva."
  },
  {
   "name": "kapsule • black sheep",
   "url": "https://www.black.sk/sk/kapsule-black-sheep",
   "reason": "Kapsule."
  },
  {
   "name": "kapsule • colombia aponte",
   "url": "https://www.black.sk/sk/kapsule-colombia-aponte",
   "reason": "Kapsule."
  },
  {
   "name": "kapsule • colombia popayán decaf",
   "url": "https://www.black.sk/sk/kapsule-decaf",
   "reason": "Kapsule."
  },
  {
   "name": "colombia • diego bermudez – 1kg",
   "url": "",
   "reason": "Kombinácia sa v e-shope nedala objednať; jej zobrazenú cenu nepoužívame."
  },
  {
   "name": "drippin. – balenie 8ks (burundi • rumbagabanga)",
   "url": "",
   "reason": "Kombinácia sa v e-shope nedala objednať; jej zobrazenú cenu nepoužívame."
  }
 ],
 "shop": {
  "freeShipping": "Doprava zdarma pri nákupe nad 40 € na Slovensko a do Česka.",
  "freeShippingSource": "https://www.black.sk/sk/brazil-doce-citrus"
 },
 "guides": {
  "v60": {
   "title": "Recept na HARIO V60 od black.",
   "url": "https://www.black.sk/sk/hario-v60",
   "steps": [
    "20 g kávy a približne 300 g vody s teplotou okolo 95 °C.",
    "Papierový filter prepláchnite horúcou vodou a vodu vylejte.",
    "Najprv 60–80 g vody na 20–40 sekúnd, potom zvyšok pomaly v krúžkoch.",
    "Celé lúhovanie najviac približne 2,5 minúty."
   ]
  }
 },
 "products": [
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000,
    2500
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 10,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 10.5
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 10,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 22.5
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 39,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 2500,
     "grind": "Zrnková",
     "price": 90,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "black-sheep",
   "slug": "blend-black-sheep",
   "name": "blend • black sheep",
   "photo": "/assets/black/blend-black-sheep.jpg",
   "priceFrom": 10,
   "priceTo": 90,
   "roasts": [
    "espresso"
   ],
   "taste": "choco",
   "notes": [
    "horká čokoláda",
    "lesné ovocie",
    "sušené kôstkové ovocie"
   ],
   "origin": "Brazília (Cerrado Mineiro) & Etiópia (Guji)",
   "variety": "Yellow Bourbon & heirloom",
   "process": "pulped natural & natural",
   "altitude": "1150–1950 m n. m.",
   "summary": "Sladký a plný blend pre tých, ktorí sú zvyknutí skôr na tmavšie kávy; spája sladkosť brazílskej kávy s ovocnosťou etiópskej natural.",
   "url": "https://www.black.sk/sk/blend-black-sheep"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 10.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 22.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 39,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "doce-citrus",
   "region": "americas",
   "slug": "brazil-doce-citrus",
   "name": "brazil • doce citrus",
   "photo": "/assets/black/brazil-doce-citrus.jpg",
   "priceFrom": 10.5,
   "priceTo": 39,
   "roasts": [
    "espresso"
   ],
   "taste": "choco",
   "notes": [
    "marhuľa",
    "hrozienka",
    "karamel",
    "horká čokoláda",
    "lieskový oriešok"
   ],
   "origin": "Brazília · Monte Carmelo",
   "farm": "Cosme e Damião",
   "variety": "Obatã, Acaiá, Arara",
   "process": "natural",
   "altitude": "835 m n. m.",
   "summary": "Sladká a krémová káva, ktorú pražiareň predstavuje ako klasickú voľbu do kávovaru aj na domácu prípravu.",
   "url": "https://www.black.sk/sk/brazil-doce-citrus",
   "tasteLine": "sladká a krémová s tónmi marhúľ, hrozienok, aciditou červeného jablka, sladkosťou karamelu a dlhou dochuťou tmavej čokolády a lieskovcov"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 11,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 23,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 42,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "los-hibiscos",
   "region": "americas",
   "slug": "colombia-los-hibiscos",
   "name": "colombia • los hibiscos",
   "photo": "/assets/black/colombia-los-hibiscos.jpg",
   "priceFrom": 11,
   "priceTo": 42,
   "roasts": [
    "espresso"
   ],
   "taste": "choco",
   "notes": [
    "toffee",
    "lesné ovocie",
    "červené jablko",
    "mliečna čokoláda"
   ],
   "origin": "Kolumbia · Huila",
   "variety": "Caturra",
   "process": "washed",
   "altitude": "1300–1900 m n. m.",
   "summary": "Sladká, sirupová káva z kolumbijskej Huily; pražiareň ju uvádza ako dobrý pomer ceny a chuti do domáceho kávovaru.",
   "url": "https://www.black.sk/sk/colombia-los-hibiscos",
   "tasteLine": "sladká a sirupová s tónmi toffee, sladkosťou lesného ovocia, aciditou červeného jablka a dochuťou mliečnej čokolády"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 13.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 15
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 28.8,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 32
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 52.2,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 58
    }
   ],
   "id": "gundikhan",
   "region": "asia",
   "slug": "india-gundikhan",
   "name": "india • gundikhan",
   "photo": "/assets/black/india-gundikhan.jpg",
   "priceFrom": 13.5,
   "priceTo": 52.2,
   "roasts": [
    "espresso"
   ],
   "taste": "fruitFull",
   "notes": [
    "višne",
    "purpurové hrozno",
    "biela broskyňa",
    "mliečna čokoláda"
   ],
   "origin": "India · Karnataka (Chikkamagalur)",
   "variety": "Chandragiri",
   "process": "washed",
   "altitude": "1400 m n. m.",
   "summary": "Sladká a plná washed káva z rodinnej farmy, ktorá pestuje v tieni pôvodných stromov pri rezervácii Bhadra.",
   "url": "https://www.black.sk/sk/india-gundikhan",
   "tasteLine": "sladká a plná s tónmi višní, purpurového hrozna, sladkosťou bielej broskyne, aciditou červeného jablka a dochuťou mliečnej čokolády"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 58,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 58,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "hospura",
   "region": "asia",
   "slug": "india-hospura",
   "name": "india • hospura",
   "photo": "/assets/black/india-hospura.jpg",
   "priceFrom": 15,
   "priceTo": 58,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fruitFull",
   "notes": [
    "višne",
    "datle",
    "brusnice",
    "čučoriedky",
    "kakao"
   ],
   "origin": "India · Karnataka (Baba Budan Giri)",
   "farm": "Hospura Estate",
   "variety": "Chandragiri",
   "process": "natural",
   "altitude": "1300 m n. m.",
   "summary": "Sladká a krémová natural káva z farmy Hospura pestovanej v tieni stromov; v závere kakao.",
   "url": "https://www.black.sk/sk/india-hospura",
   "tasteLine": "sladká a krémová s tónmi čerešní, datlí, aciditou brusníc, sladkosťou čučoriedok a príjemnou dochuťou kakaových bôbov"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 16,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 34,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 58,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 16,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 34,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 58,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "esayas-beriso",
   "region": "africa",
   "slug": "ethiopia-esayas-beriso",
   "name": "ethiopia • esayas beriso",
   "photo": "/assets/black/ethiopia-esayas-beriso.jpg",
   "priceFrom": 16,
   "priceTo": 58,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fruitFull",
   "notes": [
    "maliny",
    "čučoriedky",
    "ananás",
    "bergamot"
   ],
   "origin": "Etiópia · Hambela Wamena",
   "farm": "farma Esayasa Berisa",
   "variety": "74158",
   "process": "natural",
   "altitude": "2350 m n. m.",
   "summary": "Krémová a tropická natural káva z vysoko položenej farmy; bobule sa sušia na vyvýšených lôžkach.",
   "url": "https://www.black.sk/sk/ethiopia-esayas-beriso",
   "tasteLine": "krémová a tropická s tónmi malín, sladkosťou čučoriedok, aciditou ananásu a florálnou dochuťou bergamotu"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 12.6,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 14
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 26.1,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 29
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 44.1,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 49
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 12.6,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 14
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 26.1,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 29
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 44.1,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)",
     "regularPrice": 49
    }
   ],
   "id": "el-paraiso",
   "region": "americas",
   "slug": "honduras-el-paraiso",
   "name": "honduras • el paraíso",
   "photo": "/assets/black/honduras-el-paraiso.jpg",
   "priceFrom": 12.6,
   "priceTo": 44.1,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fruitFull",
   "notes": [
    "ibištek",
    "ostružiny",
    "papája",
    "červené ríbezle",
    "slivka"
   ],
   "origin": "Honduras · Santa Rosa de Copán",
   "farm": "El Paraíso",
   "variety": "Parainema",
   "process": "natural anaerobic",
   "altitude": "približne 1600 m n. m.",
   "summary": "Sladká a sirupová káva s krémovým telom; anaeróbne natural spracovanie z farmy El Paraíso.",
   "url": "https://www.black.sk/sk/honduras-el-paraiso",
   "tasteLine": "sladká a sirupová s tónmi ibišteka, černice, sladkosťou papáje, aciditou červených ríbezlí a dochuťou sliviek"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "sophie-wafula",
   "region": "africa",
   "slug": "kenya-sophie-wafula",
   "name": "kenya • sophie wafula",
   "photo": "/assets/black/kenya-sophie-wafula.jpg",
   "priceFrom": 15,
   "priceTo": 54,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fruitFull",
   "notes": [
    "granátové jablko",
    "liči",
    "čierne ríbezle",
    "javorový sirup"
   ],
   "origin": "Keňa · Nairobi",
   "farm": "rodinná farma Davida a Sophie Wafulových",
   "variety": "Ruiru 11, Batian",
   "process": "natural",
   "altitude": "1500 m n. m.",
   "summary": "Ovocná natural káva z Kene; bobule fermentujú 72 hodín pred sušením, v závere javorový sirup.",
   "url": "https://www.black.sk/sk/kenya-sophie-wafula",
   "tasteLine": "šťavnatá a tropická s tónmi granátového jablka, liči, sladkosťou černíc, aciditou ríbezlí a dlhou dochuťou javorového sirupu"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "jukia",
   "region": "africa",
   "slug": "uganda-jukia",
   "name": "uganda • jukia",
   "photo": "/assets/black/uganda-jukia.jpg",
   "priceFrom": 15,
   "priceTo": 54,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fruitFull",
   "notes": [
    "papája",
    "višne",
    "hrozno",
    "maliny",
    "kakao"
   ],
   "origin": "Uganda · Zombo (Alur Highlands)",
   "farm": "spracovateľská stanica Jukia",
   "variety": "SL14 & Bourbon",
   "process": "natural",
   "altitude": "1250 m n. m.",
   "summary": "Sladká a krémová natural káva so 48-hodinovou fermentáciou; v závere kakao.",
   "url": "https://www.black.sk/sk/uganda-jukia",
   "tasteLine": "sladká a krémová s tónmi papáje, višne, sladkosťou hrozna syrah, malinovou aciditou a dochuťou kakaových bôbov"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 56,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 56,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "gicherori",
   "region": "africa",
   "slug": "kenya-gicherori-aa",
   "name": "kenya • gicherori aa",
   "photo": "/assets/black/kenya-gicherori-aa.jpg",
   "priceFrom": 15,
   "priceTo": 56,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fresh",
   "notes": [
    "cherry cola",
    "čierne ríbezle",
    "granátové jablko",
    "ostružiny",
    "baza"
   ],
   "origin": "Keňa · Embu (Mount Kenya)",
   "farm": "stanica Gicherori, družstvo Kibugu",
   "variety": "SL28 & SL34",
   "process": "washed",
   "altitude": "1600–1800 m n. m.",
   "summary": "Sirupová a šťavnatá washed káva z družstva na svahoch Mount Kenya; v závere baza.",
   "url": "https://www.black.sk/sk/kenya-gicherori-aa",
   "tasteLine": "sirupová a šťavnatá s tónmi cherry coly, čiernych ríbezlí, aciditou granátového jablka, sladkosťou černíc a dochuťou bazy"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 15,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 32,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "kiangoi",
   "region": "africa",
   "slug": "kenya-kiangoi-ab",
   "name": "kenya • kiangoi ab",
   "photo": "/assets/black/kenya-kiangoi-ab.jpg",
   "priceFrom": 15,
   "priceTo": 54,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fresh",
   "notes": [
    "čierne ríbezle",
    "maliny",
    "limetka",
    "šípkový čaj"
   ],
   "origin": "Keňa · Embu",
   "farm": "stanica Kiangoi, družstvo Rungeto",
   "variety": "SL28 & SL34",
   "process": "washed",
   "altitude": "1100–1650 m n. m.",
   "summary": "Šťavnatá a hravá washed káva s limetkovou kyslosťou a záverom pripomínajúcim šípkový čaj.",
   "url": "https://www.black.sk/sk/kenya-kiangoi-ab",
   "tasteLine": "šťavnatá a hravá s tónmi čiernych ríbezlí, malín, aciditou limetky a dochuťou šípkového čaju"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 14,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 30,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 14,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 30,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "gitega",
   "region": "africa",
   "slug": "rwanda-gitega",
   "name": "rwanda • gitega",
   "photo": "/assets/black/rwanda-gitega.jpg",
   "priceFrom": 14,
   "priceTo": 54,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fresh",
   "notes": [
    "červené ríbezle",
    "čierny čaj",
    "maliny",
    "limetka",
    "ibištek"
   ],
   "origin": "Rwanda · Nyamagabe",
   "farm": "stanica Gitega Hills",
   "variety": "Red Bourbon, Mbirizi",
   "process": "washed",
   "altitude": "1700–1900 m n. m.",
   "summary": "Washed káva z vysoko položenej stanice v južnej Rwande; čistý, ovocný a svieži šálok s ibištekom v závere.",
   "url": "https://www.black.sk/sk/rwanda-gitega",
   "tasteLine": "živá a hodvábna s tónmi červených ríbezlí, čierneho čaju, sladkosťou malín, aciditou limetky a dochuťou ibišteka"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 14.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 29,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 200,
     "grind": "Zrnková",
     "price": 14.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 500,
     "grind": "Zrnková",
     "price": 29,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "espresso",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 54,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "gotiti",
   "region": "africa",
   "slug": "ethiopia-gotiti",
   "name": "ethiopia • gotiti",
   "photo": "/assets/black/ethiopia-gotiti.jpg",
   "priceFrom": 14.5,
   "priceTo": 54,
   "roasts": [
    "filter",
    "espresso"
   ],
   "taste": "fresh",
   "notes": [
    "jahody",
    "bergamot",
    "broskyňový ľadový čaj",
    "biely čaj"
   ],
   "origin": "Etiópia · Gedeb (Gedeo)",
   "farm": "stanica Eva Gotiti",
   "variety": "74110, 74112",
   "process": "washed",
   "altitude": "2000–2100 m n. m.",
   "summary": "Ľahká, ale zložitá washed káva od malých pestovateľov; v závere biely čaj.",
   "url": "https://www.black.sk/sk/ethiopia-gotiti",
   "tasteLine": "ľahká a komplexná s tónmi jahôd, bergamotu, broskyňového iced tea, citrusovou aciditou a dochuťou bieleho čaju"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 200,
     "grind": "Zrnková",
     "price": 13.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 28.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 55,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "juicy-pussy",
   "region": "blend",
   "slug": "juicy-pussy",
   "name": "blend • juicy pussy",
   "photo": "/assets/black/blend-juicy-pussy.jpg",
   "priceFrom": 13.5,
   "priceTo": 55,
   "roasts": [
    "filter"
   ],
   "taste": "fresh",
   "notes": [],
   "profile": "šťavnatá, sladká a svieža",
   "origin": "sezónny blend (zložky sa menia podľa sezóny)",
   "process": "washed kávy s malým podielom natural",
   "summary": "Sezónny filtrový blend na každý deň: ovocné washed kávy doplnené natural zložkou pre telo a sladkosť.",
   "url": "https://www.black.sk/sk/juicy-pussy",
   "tasteLine": "šťavnatá, sladká a svieža káva, ktorá prebudí tvoje chuťové poháriky – každý deň!"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    200,
    500,
    1000
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": true,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "omni",
     "grams": 200,
     "grind": "Zrnková",
     "price": 13.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "omni",
     "grams": 500,
     "grind": "Zrnková",
     "price": 28.5,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "omni",
     "grams": 1000,
     "grind": "Zrnková",
     "price": 52,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "popayan-decaf",
   "region": "americas",
   "slug": "colombia-popayan-decaf",
   "name": "colombia • popayán decaf",
   "photo": "/assets/black/black-decaf.jpg",
   "priceFrom": 13.5,
   "priceTo": 52,
   "roasts": [
    "omni"
   ],
   "taste": "fresh",
   "decafNote": "Kofeín sa odstraňuje šetrne, etylacetátom z cukrovej trstiny.",
   "notes": [
    "pomarančový džús",
    "broskyňa",
    "žlté kôstkové ovocie",
    "červené jablko",
    "mandle"
   ],
   "origin": "Kolumbia · Popayán (Cauca)",
   "farm": "Cofinet, približne 65 pestovateľov",
   "variety": "Colombia, Castillo, Caturra",
   "process": "washed, bez kofeínu metódou z cukrovej trstiny",
   "altitude": "1500–2070 m n. m.",
   "summary": "Bezkofeínová káva; kofeín sa odstraňuje etylacetátom z cukrovej trstiny. Sladká a sirupová s mandľovým záverom.",
   "url": "https://www.black.sk/sk/colombia-popayan-decaf",
   "tasteLine": "sladká a sirupovitá s tónmi pomarančového džúsu, broskyne, sladkosťou žltého kôstkového ovocia, aciditou červeného jablka a dochuťou mandlí"
  },
  {
   "kind": "coffee",
   "currency": "EUR",
   "weights": [
    150,
    500
   ],
   "grinds": [
    "Zrnková",
    "Mletá espresso",
    "Mletá moka konvička",
    "Mletá aeropress",
    "Mletá drip",
    "Mletá french press",
    "Mletá cold brew"
   ],
   "decaf": false,
   "available": true,
   "stockStated": false,
   "checkedAt": "2026-10-29",
   "variants": [
    {
     "roast": "filter",
     "grams": 150,
     "grind": "Zrnková",
     "price": 18,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    },
    {
     "roast": "filter",
     "grams": 500,
     "grind": "Zrnková",
     "price": 48,
     "verifiedAt": "2026-10-29",
     "source": "verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)"
    }
   ],
   "id": "diego-bermudez",
   "region": "americas",
   "slug": "colombia-diego-bermudez",
   "name": "colombia • diego bermudez",
   "photo": "/assets/black/colombia-diego-bermudez.jpg",
   "priceFrom": 18,
   "priceTo": 48,
   "roasts": [
    "filter"
   ],
   "taste": "fresh",
   "notes": [
    "kardamóm",
    "jablkové crumble",
    "vanilka",
    "pistácie"
   ],
   "origin": "Kolumbia · Cauca (Piendamó)",
   "farm": "Finca El Paraíso",
   "variety": "Castillo",
   "process": "double anaerobic washed",
   "altitude": "1960 m n. m.",
   "summary": "Sladká a dezertná káva s tónmi kardamómu, jablkového crumble a vanilky, citrusovou aciditou a dochuťou pistácií.",
   "url": "https://www.black.sk/sk/colombia-diego-bermudez",
   "held": [
    "1000 g (filter)"
   ],
   "tasteLine": "sladká a dezertná s tónmi kardamómu, jablkového crumble, sladkosťou vanilky, citrusovou aciditou a dlhotrvajúcou dochuťou pistácií"
  }
 ],
 "drip": {
  "id": "drippin",
  "kind": "drip",
  "name": "drippin.",
  "url": "https://www.black.sk/sk/drippin",
  "photo": "/assets/black/drippin-hlavna-foto.jpg",
  "price": 12,
  "currency": "EUR",
  "priceVerified": true,
  "pack": "balenie 8 ks",
  "available": true,
  "stockStated": false,
  "checkedAt": "2026-10-29",
  "summary": "Drip vrecúška s výberovou kávou black.: stačí šálka a horúca voda.",
  "options": [
   {
    "id": "juicy",
    "title": "blend juicy pussy (Kolumbia)",
    "detail": "šťavnatá, sladká a svieža"
   }
  ],
  "brew": [
   "Vrecúško otvorte a filter pevne zaveste na šálku.",
   "Prelievajte filtrovanou vodou s teplotou okolo 96 °C po dávkach približne 60 ml; každú nechajte pretiecť.",
   "Spolu približne 200 ml, celé to trvá okolo 2 minút. Potom filter vyberte."
  ]
 },
 "chips": [
  "Káva do automatu",
  "Máte ovocnú kávu?",
  "Máte kávu bez kofeínu?",
  "Máte drip vrecúška na cesty?"
 ],
 "priceScope": "Exact displayed price for selected roast and pack. Coffee grind was Zrnková; other grind prices have not been verified.",
 "grindPriceNote": true
};
  (g.N447_DATA = g.N447_DATA || {}).black = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : window);
