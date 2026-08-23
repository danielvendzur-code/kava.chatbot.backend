# Audit ukážok očami majiteľa pražiarne

Metóda: každá ukážka bola načítaná v Chromiu (1440 × 900 a 390 × 844), odfotená
v stave, v akom ju uvidí príjemca e‑mailu v prvých sekundách, a premeraná cez
DOM/CDP. Hodnotenie je napísané z pozície majiteľa firmy, ktorému toto príde
do schránky ako nevyžiadaná ukážka.

Rozsah: `praziarnicka`, `diamonds`, `kaffa`, `vitazov`, `concept`, `jolka`
a kozmetická ukážka `mylo`.

---

## 1. Čo majiteľ uvidí ako prvé

Otvorím odkaz. Vidím bielu stránku, moje logo vľavo hore a nadpis:

> **„Pomôžte zákazníkovi vybrať správnu kávu.“**

Pod ním dva riadky textu, schému `Chat → Výber kávy → Produkt`, tri odrážky
a pätičku. Nič viac. Polovica obrazovky je prázdna.

**Problém:** takto vyzerá **všetkých šesť** kávových ukážok. Rovnaký nadpis,
rovnaký podnadpis, rovnaká schéma, rovnaké tri odrážky, rovnaká pätička,
rovnaké písmo (DM Sans 66 px), rovnaké biele pozadie. Jediné, čo sa mení,
je logo v ľavom hornom rohu.

Overené: `h1` je na všetkých šiestich ukážkach znak po znaku identický.

Ak si dve pražiarne vymenia odkaz — a v Bratislave si ho vymenia — okamžite
vidia, že nedostali návrh pre seba, ale šablónu s vymeneným logom. Tým padá
celý argument „prispôsobíme to vašej značke“.

**Prečo sa to deje:** `coffee-owner-conversion.js` beží ako posledný a metódou
`owner.innerHTML = markup(lockup)` prepíše celý obsah stránky jedným statickým
reťazcom. Zaujímavé je, že v repozitári **už existuje** kvalitná značková verzia
(`coffee-owner-page.js` — s fotkami produktov, reálnymi otázkami zákazníkov
tej‑ktorej pražiarne a ich vlastnými krokmi výberu). Generický skript ju bez
náhrady prepíše. Robíme teda prácu navyše na to, aby sme výsledok zhoršili.

---

## 2. Chyby, ktoré majiteľ uvidí bez toho, aby ich hľadal

### 2.1 Hlavné tlačidlo je neviditeľné (4 zo 6 ukážok) — kritické

Na `diamonds`, `kaffa`, `vitazov` a `concept` má primárne tlačidlo
**„Vyskúšať Výber kávy“** vypočítané:

```
background-color: rgba(0, 0, 0, 0)     ← priehľadné
color:            rgb(255, 255, 255)   ← biely text
```

Biely text na bielom pozadí. Tlačidlo v DOM je, je klikateľné, má správnu
veľkosť — ale **nie je ho vidieť**. Majiteľ vidí len sekundárny odkaz
„Skúsiť Chat“, ktorý bez susedného tlačidla visí v prázdnom priestore.

Na mobile je to ešte horšie: jediná viditeľná výzva na akciu je nenápadný
sivý text zarovnaný vpravo.

Ukážka, ktorá má predať konverzný nástroj, má rozbitú vlastnú konverznú akciu.

### 2.2 Obrí čierny krížik namiesto pozvánky (Káva Víťazov)

Bublina vpravo dole — prvá vec, na ktorú oko padne — vykreslí namiesto textu
**čierne X cez celú plochu**. Presne to je snímka, ktorú majiteľ uvidí, ak sa
pozrie do dvoch sekúnd od otvorenia.

Príčina: `coffee-widget-final.js` vloží do bubliny zatváracie tlačidlo, ktorého
štýl je v `coffee-widget-final.css`. Keď sa tá CSS nenačíta (viď 2.4), SVG
zostane v natívnej veľkosti a roztiahne sa cez celú bublinu.

### 2.3 Dva zatváracie krížiky v jednej bubline

`coffee-widget-final.js` sa pred vložením krížika pýta iba na
`.mc-teaser-close, .teaser__close, .launcher-teaser__close`. Ale Víťazov má
`.launcher__teaser-close`, Kaffa `.kf-teaser-close` a Diamonds `#teaserClose`.
Žiadny z nich nie je v zozname, takže sa pridá druhý krížik navrch prvého.
V DOM sú preukázateľne dve tlačidlá na tom istom mieste.

### 2.4 Dva skripty sa donekonečna bijú o posledné miesto v `<body>`

Toto je koreň väčšiny chýb vyššie.

`coffee-widget-final.js` aj `coffee-usability-release.js` si vložia vlastný
`<link>` a **oba** si držia MutationObserver, ktorý ten `<link>` presunie späť
na koniec `<body>`, kedykoľvek sa `<body>` alebo `<head>` zmení. Každé presunutie
jedného spustí observer druhého.

Namerané: **~920 mutácií `<body>` za 4 sekundy** na každej zo štyroch ukážok.
Nekonečná slučka, ktorá beží, kým je karta otvorená — na mobile to znamená
teplý telefón a vybíjajúca sa batéria pri statickej stránke.

Horší dôsledok: keďže sa `<link>` neustále odpája a pripája, prehliadač jeho
načítanie prerušuje. Na `vitazov` a `concept` sa **ani jedna z tých dvoch CSS
nikdy nezaregistruje** v `document.styleSheets`, hoci `<link>` v DOM je. Preto:

- nie sú definované premenné `--mc-brand`, `--mc-line`, `--mc-ink`
  → `background: var(--mc-brand)` je neplatné → **priehľadné tlačidlo (2.1)**
- nie sú štýly pre `.mc-teaser-close` → **obrie X (2.2)**
- nie sú opravy hlavičky widgetu → **prekryté texty (2.5)**

Je to náhodné podľa časovania siete, takže tá istá ukážka vyzerá pri každom
načítaní inak. To je pri odosielaní klientovi neprijateľné.

### 2.5 Prekryté texty v hlavičke widgetu (Kaffa)

V hlavičke Kaffa widgetu sedí text „Kaffa Roastery“ **nad** horným okrajom
panela a je orezaný, pod ním sa s ním prekrýva veľký nápis „KAFFA“ a slovo
„Online“ je orezané spodnou hranou. Tri riadky textu v priestore pre jeden.

### 2.6 Stránka končí uprostred obrazovky

Na `diamonds`, `kaffa` a `vitazov` sa obsah končí okolo 640 px a zvyšok
obrazovky je prázdna biela plocha. Pod ňou pritom stále visí **900 px starého,
orezaného obsahu** (`.diamonds-page`, `.kf-shell`, `.concept-page`) — mŕtvy
DOM, ktorý sa nikdy nezobrazí, ale načíta sa a prekresľuje.

Na mobile z toho vypadne aj spodný pás výhod a pätička.

### 2.7 Nadpis sa láme na štyri riadky

`Concept` a `Jolka` majú nadpis zlomený na štyri riadky, pričom „kávu.“ zostane
osamotené na poslednom riadku a diakritika sa dotýka riadku nad ním. Pri
`Concept` sa navyše nenačíta značkové písmo a text padne na systémový fallback.

### 2.8 Prázdna diera v chate

Po otvorení widgetu je medzi uvítacou správou a spodnými voľbami **prázdne
miesto vysoké 300–400 px** (na mobile ešte viac). Chat vyzerá, že sa nedokončil
načítavať. Je to zároveň premrhané miesto: presne tam patrí to, čo predáva —
konkrétne kávy, fotky, dôvod, prečo si má zákazník vybrať.

### 2.9 Kozmetická ukážka ťahá obrázok z cudzieho servera

`cosmetics.html` načítava hero fotku priamo z `naturalno.sk`. Request zlyhá
(`ERR_CONNECTION_RESET`) a v ukážke zostane rozmazaná prázdna plocha. Zároveň
sa nenačíta žiadne webové písmo — `document.fonts` je prázdne — takže celý
návrh beží na systémovom fonte.

---

## 3. Čo v ukážke chýba z pohľadu predaja

Aj keby všetko vyššie fungovalo, stránka nedáva majiteľovi dôvod odpovedať.

| Chýba | Prečo to majiteľ potrebuje |
|---|---|
| **Jeho vlastné kávy** | V repozitári sú fotky a overené ceny pre všetkých šesť pražiarní. Na stránke nie je ani jedna. Nič nedokazuje, že bot pozná práve jeho katalóg. |
| **Otázky, ktoré dostáva on** | „Je Kamundu kyslá?“, „Aká káva do kancelárie?“ — tieto vety v repozitári existujú, na stránke nie sú. |
| **Čo to spraví s predajom** | Sú tam tri neurčité odrážky („Ľahší výber pre zákazníka“). Žiadna nehovorí, čo sa stane s košíkom, s opustenými objednávkami ani s časom tímu. |
| **Koľko práce to je** | Majiteľ nevie, či ide o dvojtýždňovú integráciu alebo o jeden `<script>` tag. Nikde to nie je napísané. |
| **Ako pokračovať** | Jediná výzva je „Kontakt →“ v pätičke. Žiadny jasný ďalší krok. |
| **Vizuálne prepojenie na jeho web** | Farby sú síce odvodené od značky, ale používajú sa len na obrys tlačidla. Typografia, fotografia ani rytmus stránky nemajú s jeho webom nič spoločné. |

---

## 4. Poradie závažnosti

| # | Problém | Dopad |
|---|---|---|
| 1 | Neviditeľné hlavné tlačidlo (4/6) | Ukážka nemá funkčnú výzvu na akciu |
| 2 | Šesť pražiarní, jedna stránka | Ukážka pôsobí ako hromadná pošta |
| 3 | Nekonečná slučka dvoch skriptov | Náhodne rozbité štýly + vybíjanie batérie |
| 4 | Obrie X namiesto pozvánky (Víťazov) | Prvý dojem je zjavná chyba |
| 5 | Prekryté texty v hlavičke (Kaffa) | Pôsobí nedokončene |
| 6 | Prázdna spodná polovica stránky | Vyzerá ako rozbitý layout |
| 7 | Nulový predajný obsah | Nie je dôvod odpovedať na e‑mail |
| 8 | Prázdna diera v chate | Widget vyzerá nedonačítaný |
| 9 | Cudzí a rozbitý obrázok (kozmetika) | Nefunkčná ukážka |
| 10 | Lámanie nadpisu, chýbajúce písmo | Nedbalá typografia |

---

## 5. Zhrnutie jednou vetou

Ukážky fungujú technicky — poradca sa otvorí, kvíz beží, odporúčanie dá zmysel.
Zlyháva okolo nich to, na čom stojí prvý dojem: hlavné tlačidlo nie je vidieť,
prvá vec na obrazovke je niekedy chybová grafika, stránka je pre všetkých
rovnaká a nikde nie je napísané, čo z toho majiteľ bude mať.

---

# Čo sa opravilo

## 6.1 Koreňová chyba: dva skripty v nekonečnej slučke

`coffee-widget-final.js` a `coffee-usability-release.js` si už nedržia
MutationObserver, ktorý presúval ich `<link>` na koniec `<body>`. Namiesto toho
má každý stylesheet pevné poradie (`data-mc-order`) a jeden ohraničený prechod
ich zoradí — beží pri vložení, na `load` a na troch časovačoch, potom skončí.

Namerané: **920 mutácií `<body>` za 4 s → 5–37**, a obe CSS sa odteraz načítajú
spoľahlivo na všetkých ukážkach. Tým padli aj chyby 2.1, 2.2 a 2.5.

## 6.2 Neviditeľné tlačidlo

Premenné `--mc-brand` sa už načítajú vždy, takže `background:var(--mc-brand)` má
čo dosadiť. Nová stránka navyše nekreslí značkovú farbu cez premennú, ktorá by
mohla chýbať. Overené na všetkých šiestich ukážkach: primárne tlačidlo má plnú
značkovú výplň a biely text.

Test to odteraz stráži: primárna akcia nesmie mať priehľadné pozadie ani
rovnakú farbu textu ako pozadia.

## 6.3 Obrí krížik a dvojité zatváracie tlačidlá

- Vložený krížik má rozmery zapísané aj inline, takže ho chýbajúca CSS nemôže
  roztiahnuť cez celú bublinu.
- Kontrola pred vložením pozná aj `.launcher__teaser-close`, `.kf-teaser-close`,
  `#closeTeaser` a `#teaserClose`. Každá bublina má teraz práve jeden krížik
  (overené na všetkých piatich).
- Nová stránka dáva každému `<svg>` základný rozmer 16 px, takže žiadna ikona
  sa nemôže roztiahnuť, ani keď jej vlastné pravidlo chýba.

## 6.4 Prekryté texty v hlavičke Kaffa

`coffee-no-black-lock.css` skrývalo skutočný wordmark a namiesto neho písalo
„Kaffa Roastery“ a „Online“ ako pseudo-elementy, zatiaľ čo
`coffee-accessibility-preserve.css` ten wordmark nútilo späť. Vykreslili sa oba
naraz. Skutočný lockup pražiarne vyhral, náhradné texty sú preč a kontajner
značky zostáva riadkom, nie stĺpcom.

## 6.5 Šesť pražiarní, šesť stránok

`coffee-owner-conversion.js` už nič neprekresľuje — načíta
`coffee-owner-brand.js`, ktorý stavia stránku z dát tej-ktorej pražiarne:

- **vlastná paleta a typografia** (Jolka Playfair a hnedá, Kaffa Georgia a teplý
  papier, Diamonds čierna a limetková, Víťazov zelená a limetková, Concept
  terakota, Pražiarnička zelená a medená),
- **vlastný nadpis** — žiadne dve ukážky nezačínajú rovnakou vetou (stráži test),
- **vlastná fotografia** z `/assets` namiesto prázdnej bielej plochy,
- **odporúčacia karta** s ich vlastnou kávou, chuťovými tónmi, cenou a
  animovaným pruhom zhody,
- **ich katalóg** — štyri reálne kávy s fotkami, popismi a cenami,
- **ich otázky** — vety, ktoré ich zákazníci naozaj píšu.

## 6.6 Predajný obsah, ktorý chýbal

Stránka sa už nekončí uprostred obrazovky; roluje a má sekcie, ktoré dávajú
majiteľovi dôvod odpovedať:

| Sekcia | Čo rieši |
|---|---|
| „Čo sa na vašom webe zmení“ | Dnes vs. s poradcom, tri konkrétne situácie |
| „Poradca pozná vaše kávy“ | Štyri ich kávy s fotkami — dôkaz, že ide o ich katalóg |
| „Dve cesty k tej istej káve“ | Chat s ich otázkami, výber so štyrmi krokmi |
| „Prečo to stojí za zavedenie“ | Opustené košíky, otázky na tím, predaj mimo hodín |
| „Jeden riadok vo vašom e-shope“ | Skutočný `<script>` tag — koľko práce to je |
| Záverečné CTA | Jasný ďalší krok namiesto odkazu v pätičke |

Animácie: postupné odhaľovanie sekcií pri scrollovaní so stagger oneskorením,
nadvihnutie kariet pri hoveri, pomalý zoom hero fotky, nabiehajúci pruh zhody
a typing bodky v ukážke chatu. Všetko sa vypína pri `prefers-reduced-motion`.

## 6.7 Prázdna diera v chate

Nový `coffee-chat-starter.js` vloží hneď pod privítanie tri kávy tej pražiarne —
fotka, názov, chuťové tóny, cena — každá s odkazom do ich e-shopu. Zmizne, len
čo zákazník napíše prvú správu.

Pri tom vyšli najavo dve ďalšie chyby, ktoré sú opravené: prázdny chat sa
skladal zdola (`justify-content:flex-end`), takže po pridaní obsahu pretiekol
**smerom hore** a privítanie sa stalo nedosiahnuteľným; Kaffa navyše naťahovala
úvodný blok na plnú výšku a privítanie pripínala k jeho spodnej hrane.

## 6.8 Kozmetická ukážka

- Doplnené lokálne písmo (`document.fonts` bolo prázdne, celý návrh bežal na
  systémovom fonte).
- Každá fotka má fallback: keď cudzí server request odmietne, kontajner sa
  označí a vykreslí značkový panel namiesto prázdneho rámčeka.

**Zostáva na zváženie:** všetkých 20 fotografií v tejto ukážke sa načítava
z cudzích serverov — vrátane webov konkurencie a ruskej stock fotobanky.
Ktorýkoľvek z nich to môže kedykoľvek zablokovať a demo sa rozpadne. Na ostré
posielanie klientom by mali byť lokálne.

## 6.9 Prístupnosť a rolovanie

- Žiadny text na novej stránke nie je menší než 11 px (repozitár si toto
  pravidlo drží kvôli starším používateľom; nová stránka ho porušovala
  18-krát).
- Stránka roluje, ale kým je otvorený widget, zámok rolovania patrí jemu —
  inak by prestal fungovať focus trap dialógu.

## 6.10 Stav testov

| | Pred | Po |
|---|---:|---:|
| Prešlo | 25–26 | 30 |
| Zlyhalo | 8–9 | 4 |

Štyri zostávajúce zlyhania existovali aj pred touto zmenou a týkajú sa iných
oblastí (finálna odpoveď chatu, výška krokov poradcu, fotografie krokov Víťazova
a `jolkaParity` príznak, ktorý sa nikdy nenastaví).

Tri testy boli prepísané, pretože popisovali stránku, ktorá už neexistuje.
Nové znenie stráži silnejšie veci než pôvodné: unikátny nadpis pre každú
pražiareň, viditeľné primárne tlačidlo, štyri produktové karty s načítanými
fotkami a minimálnu veľkosť písma na mobile.
