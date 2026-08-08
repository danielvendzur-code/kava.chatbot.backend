# Pražiareň Jolka — audit a prestavba

Auditovaná bola **výhradne Jolka** (`/ukazka/jolka`). Ostatné coffee demá v repozitári
(Pražiarnička, Káva Víťazov, Diamonds, Kaffa, Concept) neboli auditované, menené ani
refaktorované. Slúžili len ako referencia kvality.

Stav pred zásahom: shared engine `coffee-v8.js` + `coffee-v8.css` + `coffee-v8-refine.css`
+ `coffee-v8-patch.js`, dáta v `coffee-configs.js`, farby prepisované v
`coffee-brand-overrides.js`.

---

## 1. Scorecard — stav pred zásahom

| Oblasť | Skóre | Poznámka |
|---|---:|---|
| Owner-facing landing | 4/10 | Headline na sedem riadkov, pravá polovica prázdna zelená plocha. Text hovorí o zákazníkovi, nie o majiteľovi. |
| First impression | 4/10 | Nula fotografie. Prvá obrazovka nepredáva nič. |
| Brand fidelity | **2/10** | Najvážnejší nález. Jolka má čiernu kruhovú značku s didone wordmarkom a kraftové obaly. Ukážka používala šalviovú zelenú a generický „bublina + lístok“ znak. |
| Logo / identity | **2/10** | `advisorLogo()` je speech bubble s lístkom. Nemá nič spoločné s Jolkou a pôsobí ako AI klipart. |
| Visual hierarchy | 5/10 | H1 prehlušuje všetko ostatné, benefity a CTA sa strácajú. |
| Color palette | 3/10 | Zelená nie je farbou Jolky. Cream, white a sage navyše splývali do jednej plochy. |
| Typography | 5/10 | Jeden grotesk na všetko. Žiadny display rez, žiadny brand charakter. |
| Whitespace | 4/10 | Nie whitespace, ale diery. Widget mal ~200 px prázdna pod obsahom. |
| Radius system | 7/10 | Konzistentný, ale univerzálny — rovnaký by sedel hocijakej značke. |
| Widget dimensions | 7/10 | 440 × 730 je v poriadku. Problém bol obsah, nie rozmer. |
| Mode switch | 6/10 | Veľký a klikateľný, ale poradie „Chat / Výber kávy“ tlačí zákazníka do slabšieho režimu. |
| Chat | 5/10 | Dve úvodné bubliny, potom 400 px prázdna. Kvíz entry card duplikoval mode switch. |
| Chat bubbles | 6/10 | Použiteľné, ale utilitárne. Timestamp pri každej správe je support-chat pattern. |
| Quick chips | 5/10 | Ako chip použitý „Vietnam“ — to nie je otázka zákazníka, to je názov produktu. |
| Input | 6/10 | V poriadku, ale splýva s pozadím. |
| Send button | 7/10 | Dostatočne veľký a viditeľný. |
| Advisor | 5/10 | Vyzerá ako dotazník. Prvá otázka je „príprava“, teda tá najmenej zaujímavá. |
| Question flow | 5/10 | Štyri kroky, ale krok 4 (kofeín) väčšinu zákazníkov nezaujíma. |
| Selected states | 6/10 | Fungujú, no potrebovali `coffee-v8-refine.css`, aby text pri prechode nezmizol. |
| Photography | **0/10** | Doslova nula fotografií. `.option__photo` sú prázdne zelené štvorce. |
| Product representation | **2/10** | Produkt v result-e je čierny box s oreznutým textom „Zmes …“ a bielym oválom. |
| Result | 4/10 | Textová karta. Zhoda 97 % bez podkladu. Nič, čo by presvedčilo kúpiť. |
| Alternative | 4/10 | Dve malé karty, jedna z nich **El Salvador SHG EP — vypredaný produkt**. |
| CTA | 3/10 | „Vybrať balenie“ vedie na krok navyše, potom na `/shop/`, čo je **404**. Nikdy na konkrétny produkt. |
| Mobile | 6/10 | Fullscreen funguje, ale prázdny chat a kontaktný riadok zaberajú priestor. |
| Accessibility | 5/10 | Chýba `role="dialog"`, focus trap, Escape, návrat focusu. Vnorený `<button>` v `<button>` v launcheri. |
| Animations | 6/10 | Slušné, ale `option-reveal` potrebovala patch, aby nerozbíjala selected state. |
| Conversion | 3/10 | Cesta k nákupu končí na neexistujúcej stránke. |
| Technical architecture | 4/10 | Štyri vrstvy (`v8.css` + `v8-refine.css` + `v8.js` + `v8-patch.js`), post-render DOM patch, ktorý prepisuje `innerHTML` launchera. |

**Celkovo pred zásahom: 4,4 / 10.** Ako demo obstojí. Ako produkt, ktorý ukážeš majiteľovi, nie.

### Dátové chyby (najzávažnejšie)

| Nález | Skutočnosť podľa e-shopu Jolky |
|---|---|
| `shopUrl: praziarenjolka.sk/shop/` | **404.** Správne je `/eshop-kava/`. |
| Katalóg má 5 produktov | Jolka má v ponuke **19 položiek**, z toho 14 káv. |
| Odporúča El Salvador SHG EP | **Vypredaný.** |
| Chýba bezkofeínová káva | Jolka predáva **DECAF Etiópia**. |
| Chýbajú Horké zlato, 9-to-Fine, Guatemala, Colombia, Honduras, Brazil, India, Jamaica, Sviatočná zmes | Všetko skladom. |
| Cena „od 5,90 €“ bez jednotky | 5,90 € je cena za 75 g vzorku, nie za bežné balenie. |

---

## 2. Verdikt bez diplomacie

**WHAT LOOKS PROFESSIONAL**
Rozmer widgetu. Radius systém. Veľkosť mode switchu. Plynulosť prechodov medzi krokmi.
Automatický posun po výbere. Princíp „jedna otázka, štyri veľké voľby“.

**WHAT LOOKS GENERIC**
Úplne všetko, čo tvorí identitu. Zelená paleta, sparkle ikonka, speech-bubble logo,
copy typu „Pomôže s výberom / Odpovie na otázky / Kvíz podľa chuti“. Vymeň názov a máš
Pražiarničku. To je presne to, čo sa nesmelo stať.

**WHAT LOOKS OLD**
Timestampy pri každej bubline. Kontaktný riadok E-shop / Web / Kontakt pod inputom.
Krok „balenie a mletie“ so sumárnou tabuľkou — to je e-shop z roku 2014, nie poradca.

**WHAT LOOKS TOO SMALL**
`.result-product__origin`, `.taste-tags`, `.alternative small`, `.summary__row span`,
progress label — všetko 10–11 px. Product visual 96 × 96 px pre hlavný predajný moment.

**WHAT LOOKS TOO BIG**
H1 na desktope. Sedem riadkov na 50 px je pomník, nie headline. Prázdna zelená kruhová
plocha za preview panelom zaberá štvrtinu obrazovky a nenesie žiadnu informáciu.

**WHAT LOOKS LIKE A TEMPLATE**
Celá pravá strana landingu. „Osobné odporúčanie · pripravené za minútu“ so štyrmi
šedými prúžkami je wireframe, ktorý sa nedorobil.

**WHAT HURTS CONVERSION**
1. CTA vedie na 404.
2. Odporúčaný alternatívny produkt je vypredaný.
3. Medzi odporúčaním a e-shopom stojí zbytočný krok navyše.
4. Zákazník nikdy neuvidí, ako káva vyzerá.
5. Zhoda 97 % bez akéhokoľvek dôvodu pôsobí ako marketingové číslo.

**WHAT SHOULD BE REMOVED**
Kontaktný riadok. Timestampy. Krok balenie/mletie. Kvíz entry card v chate.
`coffee-v8-patch.js` pre Jolku. Zelená paleta. Speech-bubble logo. Chip „Vietnam“.

**WHAT SHOULD BE REBUILT**
Identita, paleta, typografia, landing, result, dátová vrstva, scoring a celá
photography vrstva. Teda: prakticky všetko okrem rozmerov shellu.

---

## 3. Čo bolo postavené

### Vlastný entrypoint
Jolka už nebeží na shared v8 engine. Má vlastný, izolovaný stack:

```
jolka.html                 ← entrypoint
jolka/jolka.css            ← jediný stylesheet, žiadne refine/override/patch vrstvy
jolka/jolka-data.js        ← dátová vrstva
jolka/jolka-app.js         ← render + interakcia + scoring
assets/jolka/*.webp        ← oficiálna fotografia Jolky + logo + self-hosted fonty
```

Routing: `vercel.json` posiela `/ukazka/jolka` na `/jolka.html`,
`coffee-bootstrap.js` má jednu jolka-only vetvu pre `?demo=jolka`.
Žiadny iný projekt sa nezmenil.

### Identita
Použitý **oficiálny znak Jolky** — čierny kruh s wordmarkom `jolka.` a podtitulkom
`PRAŽIAREŇ KÁVY`, vytiahnutý z oficiálneho brand assetu firmy a pripravený v dvoch
verziách (ink na svetlom, cream na tmavom). Žiadny vymyslený companion mark, žiadna
sparkle ikonka, žiadne „J“ v bubline. AI vrstva nemá vlastnú značku — hovorí menom Jolky.

### Paleta
Odvodená od skutočnej značky, nie od predchádzajúcej zelenej:

```
ink       #14110F   wordmark, header, CTA, selected states
paper     #EFE6D9   stránka
surface   #FFFDFA   karty a widget
surface-2 #F8F1E6   vnorené plochy
kraft     #C08B4E   akcent z obalu
```

Tri jasne oddelené úrovne plôch. Tmavá slúži len na header, CTA a selected.

### Typografia
Playfair Display (display, blízko didone wordmarku Jolky) + Inter (UI).
Obe rodiny sú **self-hosted** (4 × WOFF2, 190 KB, OFL licencia) — widget nezávisí od
Google Fonts, čo odstraňuje render-blocking request na cudzí server. Najmenší text
v produkte je 11,5 px a je to výhradne uppercase label. Žiadne 8–9 px.

### Widget shell
452 × 788 px, outer radius 32 px. Na mobile fullscreen s `100dvh` a safe-area paddingom.
Prepínač je veľký oval segmented control, poradie **Výber kávy | Chat** — advisor je
predvolený režim, lebo konvertuje lepšie ako otvorený chat.

### Photography
Toto bola najväčšia zmena a zároveň jedno vedomé rozhodnutie, ktoré treba pomenovať.

Použitá je **výhradne oficiálna fotografia Pražiarne Jolka** — 14 produktových
záberov plus lifestyle záber z domovskej stránky. Všetky majú rovnakú art direction
(kraftový sáčok, transparentné pozadie, rovnaké svetlo), lebo pochádzajú z jednej
produkcie. Sú stiahnuté, orezané, prepočítané na WebP a servované lokálne
(431 KB za 14 fotiek, lazy-loaded).

Fotografia sa objavuje na: landing hero, landing preview card, **krok 1 advisora**
(každý chuťový smer nesie reálnu kávu, ktorá ho zastupuje), result hero (132 × 178 px)
a alternatíva.

**Vedomé rozhodnutie:** pre krok „príprava“ som *nepoužil* stock fotografie.
Preveril som Unsplash (blokovaný bez API kľúča), Pexels (to isté), StockSnap
(Cloudflare 403), Openverse CC0 a Wikimedia Commons. Dostupný CC materiál je
kvalitatívne nesúrodý — snapshoty domácich kávovarov na rôznych pozadiach. Nalepiť
ich vedľa čistej produktovej fotografie Jolky by bol presne ten „random stock-photo
mix“, ktorý znižuje perceived quality. Namiesto toho krok používa vlastnú ikonografiu
odvodenú od piktogramov mletia, ktoré Jolka **tlačí priamo na svoje obaly**.
Ak majiteľ dodá vlastné fotky prípravy, sú to štyri súbory a jeden riadok v dátach.

### Advisor
Štyri kroky, poradie prerobené tak, aby prvá otázka bola tá, ktorá zákazníka zaujíma:

1. **Chuť** — čokoláda / vyvážená / ovocná / výrazná (s reálnou fotkou kávy pri každej voľbe)
2. **Príprava** — automat / páka / moka a džezva / filter
3. **Nápoj** — čierna / s mliekom / striedam
4. **Acidita** — čo najmenej / jemná / svieža / *prekvapte ma*

Štvrtý krok nahradil pôvodnú otázku na kofeín. „Prekvapte ma“ je diskriminátor pre
experimentálny profil — bez neho by sa Vietnam Lang Biang nikdy neodporučil.

Scoring je **weighted a deterministický**, nie mapovanie odpoveď → produkt:

```
skóre = 3,2 × chuť + 2,4 × príprava + 2,0 × nápoj + 2,6 × acidita
```

Acidita sa boduje vzdialenosťou od cieľovej hodnoty, nie zhodou. Bezkofeínová káva má
penalizáciu −1,6, aby sa nevnucovala tomu, kto o ňu nežiadal — je dostupná cez chat.

Otestovaných všetkých **192 kombinácií odpovedí**. Osem reprezentatívnych ciest dáva
osem rôznych produktov:

| Cesta | Výsledok |
|---|---|
| čokoláda / automat / mlieko / žiadna acidita | Zmes Čokoláda |
| výrazná / páka / mlieko / žiadna acidita | Horké zlato |
| vyvážená / moka / čierna / jemná | Colombia Supremo Sofía |
| ovocná / filter / čierna / svieža | Ethiopia SIDAMO GR.2 |
| ovocná / filter / čierna / prekvapte ma | Vietnam Lang Biang |
| čokoláda / automat / striedam / žiadna | Zmes Jolka |
| vyvážená / páka / čierna / svieža | Guatemala SHB EP |
| vyvážená / filter / čierna / jemná | Jamaica Blue Mountain |

### Result
Veľká reálna fotka produktu, názov, pôvod, cena **s jednotkou** (250 g / 13,50 €),
chuťové tóny, acidita na štvorbodovej škále — tá istá, akú Jolka tlačí na obaly —
s citáciou z oficiálneho popisu, odporúčaná príprava, dostupné balenia, krátke WHY,
jedna alternatíva a CTA priamo na **konkrétny produkt** na praziarenjolka.sk.

CTA nie je v scrolle — je to **trvalá spodná lišta** advisora, takže nákupný krok
nikdy nezmizne z obrazovky. Nad ohybom je všetko podstatné: fotka, názov, cena
a blok „Prečo práve táto“. Acidita, príprava a alternatíva sú na jeden krátky scroll.

Krok „balenie a mletie“ je odstránený: gramáž aj mletie si zákazník vyberá na
produktovej stránke, takže krok navyše len predlžoval cestu.

### Chat
Jedna uvítacia správa + jedno CTA do advisora. Štyri quick chips pri inpute:
Nízka acidita · Káva na cappuccino · Ovocný filter · Niečo netradičné.
Každý chip má minimálne 44 px. Kontakty odstránené, vo footeri je len `mojchatbot.sk`.
Fallback pri nedostupnom API odpovedá z overeného katalógu — nikdy si nevymyslí produkt.

### Dáta
Všetko overené proti WooCommerce Store API Jolky 8. 8. 2026: názvy, ceny podľa gramáže,
dostupné balenia, chuťové profily, odporúčaná príprava a URL. Vypredaný El Salvador
odstránený. `api/chat.js` má aktualizovaný **len jolka blok** — 16 overených položiek,
správny e-shop URL a poznámka, aby AI neodporúčala vypredaný produkt.

---

## 4. Čo sa vedome nemenilo

- `coffee-v8.js`, `coffee-v8.css`, `coffee-v8-refine.css`, `coffee-v8-patch.js`
- `coffee-configs.js` (vrátane starého `jolka` bloku — je pre nový entrypoint nedosiahnuteľný,
  ale ponechaný, aby sa nehýbalo so shared súborom)
- `coffee-brand-overrides.js`
- `index.html` a routing ostatných piatich demo značiek
- `api/chat.js` mimo `jolka` bloku

Jediné dva zásahy do shared súborov sú jolka-scoped: vetva v `coffee-bootstrap.js`
a `jolka` blok v `api/chat.js`. Ani jeden nemení správanie ostatných projektov.

---

## 5. Výsledky QA

Automatizovaný beh (`tests/jolka.spec.mjs`, 9 testov, Chromium) — **všetko zelené**:

| Kontrola | Výsledok |
|---|---|
| Owner landing, identita a dekódovanie fotografií | OK |
| Advisor 4 kroky, CTA na reálnu produktovú URL | OK |
| Scoring rozlíši klasiku, mlieko, vyváženú, ovocnú a experiment | 5 rôznych výsledkov |
| Back zachová odpoveď, alternatíva prepne produkt, reset vyčistí stav | OK |
| 4 quick chips ≥ 44 px, žiadny `tel:`/`mailto:`, offline fallback z katalógu | OK |
| Escape, návrat focusu, focus trap, scroll lock | OK |
| Mobile 390 × 844 a 360 × 800: fullscreen, žiadny horizontal overflow | OK |
| Žiadne vnorené buttony, žiadny text pod 11 px | OK |

Vizuálny beh naviac (1440 × 900, 1366 × 768, 390 × 844, 360 × 800): žiadne console
errory, žiadne zlyhané requesty, žiadny horizontálny overflow, CTA viditeľné bez
scrollu, reduced-motion overený.

Osem reprezentatívnych ciest advisora dá osem rôznych produktov so zhodou 94–97 %.

Poznámka: tri testy v `tests/widget-smoke.spec.mjs` (shared v8 demá) v tomto sandboxe
padajú na nedostupnom `fonts.googleapis.com`. Overené na čistom `origin/main` —
padajú identicky aj bez mojich zmien, takže nejde o regresiu. V CI so sieťou prejdú.

Regresný test ostatných značiek: Pražiarnička, Diamonds, Kaffa, Káva Víťazov aj
Concept sa naďalej renderujú so správnym brandom. `?demo=jolka` korektne presmeruje
na nový entrypoint.

## 6. Skóre po prestavbe

| Oblasť | Pred | Po |
|---|---:|---:|
| Brand fidelity | 2 | 9 |
| Logo / identity | 2 | 9 |
| Photography | 0 | 8 |
| Product representation | 2 | 9 |
| Result | 4 | 9 |
| CTA / conversion | 3 | 9 |
| Advisor inteligencia | 5 | 9 |
| Landing | 4 | 8 |
| Typography | 5 | 8 |
| Accessibility | 5 | 9 |
| Technical architecture | 4 | 9 |
| Dátová správnosť | 3 | 10 |

Photography je 8, nie 10 — chýbajú vlastné fotky prípravy a interiéru pražiarne.
To je jediná vec, ktorú neviem vyriešiť bez podkladov od majiteľa.

---

## 7. Porovnanie s ostatnými botmi

Len kvalitatívne, bez auditu tých projektov.

| | Jolka (po) | Referenčné coffee demá |
|---|---|---|
| Clarity | Landing povie za 3 sekundy, čo to je a pre koho | porovnateľné |
| Perceived quality | Vlastná identita postavená na skutočnej značke | Jolka je nad úrovňou zelených variantov |
| Interaction quality | Rovnaký shell feel, plynulejší advisor | porovnateľné |
| Photography | Reálna produktová fotografia v štyroch miestach | nad úrovňou (ostatné majú nulu) |
| Product value | 14 overených produktov, ceny s jednotkou | výrazne nad |
| Conversion | CTA na konkrétny produkt, o krok kratšia cesta | nad |

Jolka kvalitatívne nezaostáva. V dátovej správnosti a v produktovej fotografii je
najďalej z coffee vetvy.
