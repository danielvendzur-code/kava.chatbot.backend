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
  lockup: '<img src="/brand/…" alt="Pražiareň X">',
  mark: { text: 'X', font: '…' },               // značka na bubline widgetu
  theme: { ink, brand, accent, soft, paper },   // ich farby
  display: { family, weight, tracking },        // voliteľné písmo nadpisov
  chips: ['…', '…', '…', '…'],                  // štyri rýchle otázky
  figures: [[hodnota, názov, riadok], …]        // tri čísla v paneli vpravo
}
```

### Texty

Nadpis a odsek pod ním sú **rovnaké pre všetkých** — konštanty `HEADING`
a `LEAD` v `coffee-owner-brand.js`. Značku nesie logo, paleta, písmo, riadok
nad nadpisom a pätička; nie copywriting. Každá ukážka mala predtým vlastný
slogan a čítalo sa to ako reklama, nie ako vysvetlenie toho, čo je v ponuke.

### Cena

Jedna verzia — **247 € nasadenie + 10 € mesačne** — v konštante `PRICING` na
začiatku `coffee-owner-brand.js`. Mení sa tam a premietne sa do všetkých ukážok
naraz.

Do `points` patrí len to, čo cena naozaj kryje; nič účtované osobitne. Riadok
`addon` (napojenie na košík e-shopu) stojí pod zoznamom oddelene práve preto,
že je to doplnok — zmazaním toho riadku zmizne zo všetkých ukážok.

### Widget

- `coffee-widget-polish.js` / `.css` — zjednotená pozvánka nad bublinou, značka
  pražiarne na bubline namiesto generickej ikonky, popisky sekcií v paneli
  tónovaná spodná lišta s výraznejšími chipmi
  a vstupným poľom, čas pri správach, „píše…“ pred odpoveďou, „Premýšľam…“ pred
  výsledkom poradcu a pulzujúci stav Online. Farby si berie zo záznamu značky,
  nie z `--nb-*` — tie sa na Pražiarničke nikdy nenačítali, lebo
  `coffee-no-black.css` ich píše pod `data-demo="praziarnicka"`, kým skutočná
  hodnota je `praziarnicka-v13`.
Panel obsahuje len konverzáciu: hlavičku, prepínač, kartu „Nájsť svoju kávu“,
privítanie, štyri rýchle otázky a vstupné pole. Popisky sekcií ani pás
s kávami pod privítaním tam nepatria — obe boli skúšané a obe sú preč.

### Rýchle otázky

Štyri popisky na pražiareň. Píšu sa na dvoch miestach naraz: v `chips` v zázname
značky (odtiaľ ich `coffee-widget-polish.js` presadzuje) a v runtime, ktorý ich
vykresľuje — inak si ich tá vrstva prepíše späť. Runtime posiela pri kliknutí
`chip.textContent`, takže popisok je zároveň otázka.

Dve z nich sa pýtajú na to, čo z e-shopu nevyčítate — „Odkiaľ je káva?“
a „Porovnajte dve kávy“. Odpovede majú vlastné vetvy vo fallbackoch:
`coffee-api-route.js` má pre každú pražiareň `origin` a `compare` z jej
katalógu, `coffee-usability-release.js` všeobecnú vetvu.

Poradie stylesheetov riadi `data-mc-order`: `10` usability-release,
`20` widget-final, `25` header-cleanup, `30` owner-brand, `35` widget-polish.
Zoradí ich jeden ohraničený prechod v `coffee-widget-final.js` — žiadny
MutationObserver, ktorý by ich presúval donekonečna.

Audit stavu pred touto zmenou a zoznam opráv je v
[`AUDIT_2026-08_OWNER_VIEW.md`](AUDIT_2026-08_OWNER_VIEW.md).
