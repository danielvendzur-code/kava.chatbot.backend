# Kávový poradca — ukážka pre klienta

Hotová prezentačná ukážka v jedinom súbore `index.html`. Otvorí sa dvojklikom v prehliadači, nepotrebuje server ani inštaláciu — dá sa poslať e-mailom ako príloha alebo nahrať na hosting.

Hlavná vec je **poradca (kvíz) v chate**. Stránka za ním nie je falošný e-shop, ale prezentácia: čo bot robí, ako funguje a čo prinesie majiteľovi.

## Čo klient v ukážke uvidí

**Stránka**
- hero s hlavným posolstvom a otázkami, ktoré poradca kladie
- „Ako to funguje“ — štyri kroky od návštevníka k objednávke
- „Čo poradca prinesie vášmu e-shopu“ — štyri konkrétne prínosy
- „Prispôsobíme ho vašej značke“ — čo všetko sa dá vymeniť
- animácie: postupné odhaľovanie sekcií pri scrollovaní, hover efekty, pulzujúci launcher

**Poradca (otvorí sa sám po ~1 s)**
- privítanie od poradkyne Emmy s „píše…“ indikátorom
- kvíz priamo v konverzácii: 5 otázok, veľké tlačidlá s emoji, možnosti nabiehajú postupne
- po kliknutí sa možnosť zvýrazní a označí ✓, ostatné zošednú
- segmentový progres „Otázka X / 5“, tlačidlo Späť a Začať odznova
- reakcie bota na každú odpoveď (pôsobí ako živý rozhovor)
- výsledok: 3 kávy zoradené podľa zhody, s animovaným pruhom zhody a zvýraznenou najlepšou
- rekapitulácia odpovedí ako štítky
- zľavový kód `PORADCA10` s kopírovaním na klik
- kontextový upsell podľa typu zákazníka (firma / darček / domov)
- „Vybrať túto“ → bot potvrdí voľbu a pripraví objednávkový formulár
- dopyt formulár s predvyplneným výberom a potvrdením

Chat rozumie aj písanému textu: `automat`, `firma`, `darček`, `filter`, `bez kofeínu`, `doprava`, `cena`, `dopyt` a pozdravy.

**URL parametre:** `?open=0` — poradca sa neotvorí automaticky, zobrazí sa len bublina.

## Rebranding na konkrétnu firmu

Všetko podstatné je označené komentármi v súbore.

**1. Farby** — blok `:root` v `<style>`. Stačia štyri hodnoty:

```css
--espresso: #201310;   /* hlavná tmavá farba značky */
--copper:   #c2703c;   /* akcent — tlačidlá, zvýraznenia */
--copper-2: #e0965c;   /* svetlejší odtieň akcentu */
--gold:     #e8c290;   /* doplnkový akcent na tmavom pozadí */
```

**2. Názov a logo** — hlavička stránky (`.logo`), meno poradkyne v `.kb-titles`. Logo je inline SVG (kávové zrno), vymení sa za klientovo.

**3. Produkty** — pole `products` v `<script>`, sekcia `1. KATALÓG`:

```js
{
  id: "…", name: "…", origin: "…", price: 9.90, unit: "250 g",
  roast: "stredné praženie",
  brew: ["espresso","automat"],   // kde sa dá pripraviť
  taste: ["čokoláda"],            // chuťový profil pre kvíz
  notes: ["…","…","…"],           // tri chuťové tóny do karty
  acidity: "nízka",               // nízka | stredná | vyššia | mix
  pack: ["250g"],                 // 250g | 1kg | box
  intent: ["home","office"],      // home | office | gift
  description: "…",
  reason: "…"                     // prečo ju bot odporúča
}
```

**4. Zľavový kód** — konštanta `COUPON` pod katalógom.

**5. Otázky kvízu** — pole `steps`, reakcie bota `reactions`. Kľúče (`intent`, `brew`, `taste`, `acidity`, `pack`) musia sedieť s hodnotami v produktoch. Progres sa počtu otázok prispôsobí sám.

## Nasadenie na ostrý web

Ukážka je demo — pri reálnom nasadení sa katalóg a dopyty napoja na backend:

- `GET /api/products` — produkty namiesto poľa `products`
- `POST /api/recommend` — odporúčanie na strane servera (voliteľné)
- `POST /api/leads` — odoslanie dopytu do e-mailu alebo CRM
- výber kávy sa dá napojiť na košík e-shopu (Shoptet, WooCommerce, Shopify…)

Widget sa na existujúci web vkladá jedným `<script>` tagom.

---

## Stránka za widgetom (prezentácia pre majiteľa)

Stránku, ktorú majiteľ pražiarne uvidí ako prvú, stavia
`coffee-owner-brand.js`. Je to **jedna obrazovka bez scrollu**: kto to je,
čo to robí, tri výhody, cena a kontakt. Žiadne texty ako z landing page,
žiadne označenia typu „ukážka“ — pražiareň to má vidieť ako hotovú vec pre seba.

Vizuál vpravo je samotný výber v polovici cesty (krok, štyri možnosti, jedna
označená, výsledok), pretože zákazník **klikaním vyberá, nepíše**.

Obsah je v objekte `BRANDS`, štýly v `coffee-owner-brand.css` pod prefixom
`mcb-`. Pridanie ďalšej pražiarne je jeden záznam:

```js
nazov: {
  name: 'Pražiareň X', place: 'Pražiareň X · mesto',
  forName: 'Pražiareň X',                       // 4. pád do pätičky
  root: '.selektor-korenoveho-prvku',           // kam sa stránka vykreslí
  shop: 'https://…',                            // odkaz z produktových kariet
  lockup: '<img src="/brand/…" alt="Pražiareň X">',
  mark: { src: '…' } | { text: 'X', font: '…' },// značka na bubline widgetu
  theme: { ink, brand, accent, soft, paper },   // ich farby
  display: { family, weight, tracking },        // voliteľné písmo nadpisov
  headline, lead,                               // nadpis musí byť ich vlastný
  benefits: [[ikona, titulok, text], …],        // tri
  preview: { step, of, title, options, picked, result },  // postup vo výbere
  shelf: [{ photo, name, note, price }, …]      // ponuka do chatu
}
```

### Cena

Ceny sú na jednom mieste — konštanta `PRICING` na začiatku
`coffee-owner-brand.js`. Sú to **návrhové čísla**, nie dohodnutý cenník; menia
sa tam a premietnu sa do všetkých ukážok naraz.

### Widget

- `coffee-widget-polish.js` / `.css` — zjednotená pozvánka nad bublinou
  (jeden krátky riadok, ~205 px namiesto 290 px), značka pražiarne na bubline
  namiesto generickej ikonky, a popisky sekcií v paneli
  („Rýchly výber“, „Časté otázky“), aby sa v ňom dalo zorientovať.
- `coffee-chat-starter.js` — dve kávy z ponuky hneď pod privítaním, s odkazom
  do ich e-shopu. Zmiznú, len čo zákazník napíše prvú správu.

Poradie stylesheetov riadi `data-mc-order`: `10` usability-release,
`20` widget-final, `25` header-cleanup, `30` owner-brand, `35` widget-polish.
Zoradí ich jeden ohraničený prechod v `coffee-widget-final.js` — žiadny
MutationObserver, ktorý by ich presúval donekonečna.

Audit stavu pred touto zmenou a zoznam opráv je v
[`AUDIT_2026-08_OWNER_VIEW.md`](AUDIT_2026-08_OWNER_VIEW.md).
