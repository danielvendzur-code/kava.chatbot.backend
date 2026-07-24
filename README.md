# AI kávový poradca — ukážka pre klienta

Hotová prezentačná ukážka v jedinom súbore `index.html`. Otvorí sa dvojklikom v prehliadači, nepotrebuje server, internet ani inštaláciu — dá sa poslať e-mailom ako príloha alebo nahrať na hosting.

Ukážka je pripravená pre vzorovú značku **Zrnko & Co.** (rodinná pražiareň). Značku, farby aj produkty vymeníte za klientove za pár minút — návod nižšie.

## Čo klient v ukážke uvidí

| Časť stránky | Čo demonštruje |
|---|---|
| Mock e-shop v pozadí | Ako poradca vyzerá priamo na webe pražiarne — hlavička, hero, katalóg, košík |
| Chat „Barista Emma“ | Otvorí sa sám po ~1 s, privíta zákazníka a ponúkne výber |
| Kvíz v konverzácii | 5 otázok klikaním, reakcie bota, progres, tlačidlo Späť |
| Odporúčanie | 3 kávy zoradené podľa zhody, najlepšia zvýraznená, tlačidlo **Do košíka** |
| Košík v hlavičke | Po pridaní z chatu naskočí počítadlo — vidno cestu od otázky k objednávke |
| Zľavový kód | `ZRNKO10` sa odomkne po dokončení kvízu (konverzný ťahák) |
| Dopyt | Formulár priamo v chate s predvyplneným výberom + potvrdenie |
| Sekcia „Pre majiteľa e-shopu“ | Štyri konkrétne prínosy — argumentácia pre rozhodovanie majiteľa |

Chat rozumie aj písanému textu: `automat`, `firma`, `darček`, `filter`, `bez kofeínu`, `doprava`, `cena`, `dopyt` a pozdravy.

**URL parametre:** `?open=0` — chat sa neotvorí automaticky, zobrazí sa len bublina (na screenshoty stránky).

## Rebranding na konkrétnu firmu

Všetko podstatné je na začiatku súboru a je označené komentármi.

**1. Farby** — blok `:root` v `<style>` (riadok ~12). Stačí prepísať štyri hodnoty:

```css
--espresso: #241610;   /* hlavná tmavá farba značky */
--copper:   #c2703c;   /* akcent — tlačidlá, zvýraznenia */
--copper-2: #dd9057;   /* svetlejší odtieň akcentu */
--gold:     #e5bb84;   /* doplnkový akcent na tmavom pozadí */
```

**2. Názov a texty značky** — hľadajte `Zrnko & Co.` (hlavička, hero, pätička, meno poradkyne v chate).

**3. Produkty** — pole `products` v `<script>`, sekcia `1. KATALÓG`. Každá položka:

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

Prvé štyri produkty sa zobrazujú aj v katalógu na stránke.

**4. Zľavový kód** — konštanta `COUPON` hneď pod katalógom.

**5. Otázky kvízu** — pole `steps`, reakcie bota `reactions`. Kľúče (`brew`, `taste`, `acidity`, `pack`, `intent`) musia sedieť s hodnotami v produktoch.

## Nasadenie na ostrý web

Ukážka je demo — pri reálnom nasadení sa katalóg a dopyty napoja na backend:

- `GET /api/products` — produkty namiesto poľa `products`
- `POST /api/recommend` — odporúčanie na strane servera (voliteľné)
- `POST /api/leads` — odoslanie dopytu do e-mailu alebo CRM
- pridanie do košíka sa napojí na e-shop platformu (Shoptet, WooCommerce, Shopify…)

Widget sa na existujúci web vkladá jedným `<script>` tagom.
