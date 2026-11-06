# Séria 3 – stavový register (rozloženie Andreine) · aktualizované 2026-11-06

Ponuka 447 € jednorazovo + 10 €/mes., bez skúšobného obdobia – iba v tejto novej sérii. Vetva `claude/n447-s3a-20261105` (samostatná, bez spoločnej histórie s pôvodnými ukážkami).
Základ: zdrojové súbory schválenej ukážky Andreine (nasadenie `dpl_GBL4YxYNrimfow7U7NJodUUvqdh6`). Súbory, aliasy a koncepty Codexu (pôvodné ukážky a osmička Šabata, Plenér, Purity, Noili, LIQOIL, SMYSSLY, Andreine, LucyLab) sa nemenili.

Opravu Beansmith's a reportované testy nezávisle preveruje Codex – zatiaľ nie sú nezávisle overené.

**Nič nie je nasadené do produkcie, žiadne DNS, žiadne zákaznícke e-maily, žiadne platené volania modelu.** Preview slúži iba na internú kontrolu – nie je to overená produkcia. Klientske adresy `<firma>.mojchatbot.sk` čakajú na schválenie.

## Stav: 20 firiem – ukážka pripravená na internú kontrolu (nie odoslaná, nie nasadená)
| Firma | Segment | Vlastný e-shop (zdroj) | Produkty | Dávka | Testy (všetky cesty) | Adresa na Preview |
|---|---|---|---|---|---|---|
| Beansmith's | káva CZ | https://beansmiths.com/kategorie-produktu/kava/ | 22 | 1 | 32 ciest · víťazi 22/22 · nálezy 0 | `?demo=beansmiths` |
| Merrybeans | káva CZ | https://www.merrybeans.cz/espresso | 11 | 1 | 14 ciest · víťazi 11/11 · nálezy 0 | `?demo=merrybeans` |
| TYPIKA | káva CZ | https://typika.coffee/collections/all | 10 | 1 | 10 ciest · víťazi 10/10 · nálezy 0 | `?demo=typika` |
| MLSNACAVA | káva SK | https://mlsnacava.sk/obchod/ | 12 | 1 | 13 ciest · víťazi 12/12 · nálezy 0 | `?demo=mlsnacava` |
| TARANI | kozmetika CZ | https://www.tarani.cz/ | 25 | 1 | 84 výsledkov · víťazi 25/25 · nálezy 0 | `?demo=tarani` |
| Coffee Source | káva CZ | https://coffeesource.eu/collections/kava | 14 | 2 | 25 ciest · víťazi 14/14 · nálezy 0 | `?demo=coffeesource` |
| Fiftybeans | káva CZ | https://fiftybeans.cz/cs/eshop | 23 | 2 | 62 ciest · víťazi 23/23 · nálezy 0 | `?demo=fiftybeans` |
| DOS MUNDOS | káva CZ | https://www.dos-mundos.cz/kava/ | 12 | 2 | 57 ciest · víťazi 12/12 · nálezy 0 | `?demo=dosmundos` |
| Illimité | káva SK | https://illimite.sk/obchod/ | 7 | 2 | 13 ciest · víťazi 7/7 · nálezy 0 | `?demo=illimite` |
| Tea Mountain | čaj CZ | https://www.teamountain.cz/ | 14 | 2 | 42 výsledkov · víťazi 14/14 · nálezy 0 | `?demo=teamountain` |
| Vitellaria | vlasy CZ | https://www.vitellaria.cz/ | 19 | 3 | 57 výsledkov · víťazi 19/19 · nálezy 0 | `?demo=vitellaria` |
| Ethia | kozmetika CZ | https://ethia.cz/ | 16 | 3 | 48 výsledkov · víťazi 16/16 · nálezy 0 | `?demo=ethia` |
| Pure Harmony | kozmetika CZ | https://www.pureharmony.cz/ | 25 | 3 | 75 výsledkov · víťazi 25/25 · nálezy 0 | `?demo=pureharmony` |
| Pražírna Voznice | káva CZ | https://www.prazirnavoznice.cz/cerstve-prazena-vyberova-kava-prazirna-vozniceva-kava | 13 | 3 | 23 ciest · víťazi 13/13 · nálezy 0 | `?demo=voznice` |
| Českáva | káva CZ | https://www.ceskava.cz/kava | 13 | 3 | 31 ciest · víťazi 13/13 · nálezy 0 | `?demo=ceskava` |
| KAMIKAVA | káva CZ | https://www.kamikava.cz/vyberova-kava | 17 | 3 | 34 ciest · víťazi 17/17 · nálezy 0 | `?demo=kamikava` |
| LaPrazirna | káva CZ | https://www.laprazirna.cz/e-shop/kava | 12 | 3 | 12 ciest · víťazi 12/12 · nálezy 0 | `?demo=laprazirna` |
| Mydlo z farmy | kozmetika SK | https://www.mydlozfarmy.sk/ | 25 | 3 | 75 výsledkov · víťazi 25/25 · nálezy 0 | `?demo=mydlozfarmy` |
| Kafe pro sebe | káva CZ | https://www.kafeprosebe.cz/cerstve-prazena-kava | 25 | 3 | 43 ciest · víťazi 25/25 · nálezy 0 | `?demo=kafeprosebe` |
| Poppy Beans | káva CZ | https://www.poppybeans.cz/collections/all | 13 | 3 | 28 ciest · víťazi 13/13 · nálezy 0 | `?demo=poppybeans` |

**HOLD_DUPLICATE – mamacoffee:** rezervované Codexu (existujúca ukážka a obchodná história vo vetve `origin/codex/new-content-20261024`). Moja kópia sa nezverejňuje: nie je v `s3-registry.js`, chate, `vercel.json` ani v zozname; `?demo=mamacoffee` zobrazí „Ukážka sa nenašla“. Ponuka sa neposiela (koncept premenovaný na `HOLD_DUPLICATE-email-mamacoffee.md`), existujúca verzia ani alias Codexu sa nemenili. Príčina: kontrola duplicít prehľadávala iba lokálne vetvy – teraz po `git fetch` aj `refs/remotes` (90 vetiev). Náhrada: **Poppy Beans** (Poppy Beans s.r.o., IČO 09074112, Brno). Ostatných 19 firiem prešlo rovnakou kontrolou vrátane vzdialených vetiev – zhoda iba s mojou staršou vetvou `claude/n447-seria3-20261105` (rovnaký autor) a pri Vitellarii latinský názov bambuckého masla v katalógu Goodie.

Každá ukážka: najviac 25 dostupných produktov s overenou cenou, fotkou a presným odkazom (otvára sa v tej istej karte); otázky na skutočné vlastnosti podľa e-shopu (príprava, kofeín, chuť/kyslosť, druh, charakter, zložka); rozpočet = celá zostava vrátane doplnku; popisné fotky volieb bez opakovania v jednej otázke; 4 rýchle voľby 40 px rovnakej veľkosti; logo v bielom kruhu správy načítané. Kandidáti, vyradení a odložení s dôvodmi (vrátane opravy Fiftybeans / DOS MUNDOS – vlastné e-shopy): `n447/s3/kandidati.md`. Koncepty e-mailov (päta mojchatbot.sk, neodoslané): `n447/s3/email-<firma>.md`.

## Čo sa zmenilo oproti Andreine (iba obsah, nie rozloženie)
- `s3-boot.js`, `s3-brands.js` – jedna adresa = jedna firma (iné `?demo=` alebo subdoména neukáže cudziu firmu), texty segmentu (káva/kozmetika), cena 447 € bez trialu, logá.
- `cosmetics.js` – texty sú voliteľné cez `window.CX_SEGMENT`; bez neho ostáva presný text Andreine. Háčik `CX_LOCAL_REPLY` pre offline odpoveď kávy.
- `full-coffee-advisor.js` – káva v paneli Andreine (rovnaké triedy `.cx-quality-*`, karty, postup, Späť), otázky a výsledok z overeného jadra `n447/c2/engine-c2.js`.
- `catalogue-advisor.js` – jediný riadok: texty vlastných vlastností firmy (`CX_TRAIT_COPY`).
- `n447/s3/s3a-plus.css` – z PLUS iba chat: karty produktov, tri bodky, príchod správy, logo v kruhu, rýchle voľby 4 × rovnaké 40 px.
- `n447/s3/plus-chat.js` – kruh správy: biely podklad s logom firmy vo farbách (žiadny tmavý obrázok na tmavom kruhu).
- Popisné fotky volieb kávy: `assets/s3/coffee/` (zdroje a licencie v `sources.json`, CC0 / CC BY).
- Chat: `api/cosmetics-chat.js` → `lib/coffee-chat.js` / `lib/cosmetics-chat.js`; produkčný model ostáva v `api/ai-chat.js` (Sonnet, kľúč iba z prostredia), bez kľúča alebo pri chybe overený návrh z katalógu.
- `n447/c2/engine-c2.js` (s3a kópia) – otázka na prípravu s jedinou možnosťou sa preskakuje; významovo rovnaké odpovede → overená otázka na kávovar alebo rozdiel zo škál pražiarne.
- `skincare-final-fix.js`, `catalogue-advisor.js` – prístupné názvy teasera a panela podľa segmentu (`CX_SEGMENT.teaserAria`, `advisorName`).
- Nové kontroly: `tools/s3a/same-meaning.cjs`, `tools/s3a/a11y-names.mjs` (spúšťa ich `tools/s3a/test-firm.sh`).


## Opravy podľa auditu Codexu (SHA 8ab2982)
1. **Beansmith's – nerozlišujúca otázka „Které chutě vám víc sedí?“** (3 cesty: espresso · s kofeinem · čokoládová · rozpočet 250 / 350 / bez limitu + spracovanie mix): CORE OF ESPRESSO pro automatický kávovar a bežné CORE OF ESPRESSO mali rovnakú odpoveď „křížaly · smetana“ (líšila sa iba pravopisom Naturalní/Naturální).
   Oprava v jadre: ak by výber kávy ponúkol významovo rovnaké odpovede a kávy sa líšia doporučenou prípravou v e-shope („Doporučená příprava: Automatický kávovar“ vs. „Espresso“), pýta sa **„Jaký kávovar používáte?“ – Automatický kávovar / Pákový kávovar** (počet káv, popisné fotky, bez názvov produktov). Automat → CORE OF ESPRESSO pro automatický kávovar; páka → výber z CORE OF ESPRESSO a HOLY ESKO s odlišnými tónmi. Snímka `n447/s3/dokazy-s3a/beansmiths-oprava-kavovar-390.png`.
   Bez rozdielu v kávovare sa rovnaké odpovede doplnia o overený rozdiel zo škál pražiarne (KAMIKAVA K2/K3: „hořkost 6/10, sladkost 3/10“ vs. „hořkost 7/10, sladkost 2/10“), inak sa zlúčia. Otázka s jedinou možnosťou sa preskakuje (LaPrazirna – všetky kávy na espresso).
2. **Kontrola významovo rovnakých odpovedí vo všetkých nových ukážkach** – `tools/s3a/same-meaning.cjs` (všetky cesty jadra; rovnaký nadpis + popis po odstránení diakritiky a interpunkcie; aj otázky s jedinou možnosťou) a rovnaká kontrola v DOM testoch `dfs-coffee.mjs` / `dfs-native.mjs`. Na jadre z `8ab2982` nájde presne 3 cesty Beansmith's; teraz 0 vo všetkých 14 kávových a 6 natívnych ukážkach.
3. **Teaser kávy** – prístupný názov bol „Otevřít výběr péče“ (natvrdo v `skincare-final-fix.js`); teraz podľa segmentu „Otevřít výběr kávy“ / „Otvoriť výber kávy“, pri čaji „Otevřít výběr čaje“ (aj `aria-label` panela poradcu čaju). Kontrola `tools/s3a/a11y-names.mjs`: pri káve a čaji žiadne „péče / starostlivosť / pleť“ v `aria-label`, `title`, `alt` ani v texte – všetky OK.

## Testy (lokálny server v cloudovej relácii, sieť a model vypnuté, /api blokované alebo mock – 0 platených volaní)
Každá firma: všetky cesty výberu cez tlačidlá (320 × 568, 390 × 800, 1280 × 800) + bez fotiek; chipy a logo (320/390/1280 px); chat offline a mock (tri bodky, karty, odkazy v tej istej karte); prístupné názvy; významovo rovnaké odpovede. Úplné výstupy `n447/s3/dokazy-s3a/<firma>-testy.txt`.
```
beansmiths 320x568,390x800,1280x800: 32 ciest, 582 obrazoviek, dosiahnuteľné kávy 22/22, nálezy 0
beansmiths 390x800 bez fotiek: 32 ciest, 194 obrazoviek, dosiahnuteľné kávy 22/22, nálezy 0
beansmiths 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
beansmiths offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a jemná“ do automatu či kávovaru mají například: HOLY ESKO Káv
beansmiths mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Duwancho – 250 g · 405 Kč. Duwancho Káva 250 g · 405 Kč Zobrazit ↗
beansmiths (coffee) teaser „Otevřít výběr kávy“ · OK
beansmiths: 32 ciest, významovo rovnaké / jednomožnostné otázky 0
merrybeans 320x568,390x800,1280x800: 14 ciest, 192 obrazoviek, dosiahnuteľné kávy 11/11, nálezy 0
merrybeans 390x800 bez fotiek: 14 ciest, 64 obrazoviek, dosiahnuteľné kávy 11/11, nálezy 0
merrybeans 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
merrybeans offline: OK bodky=true karty=1 volania=1 nová karta=false · Chuť „čokoládová a oříšková“ do automatu či kávovaru mají například: Espresso b
merrybeans mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Brazílie Aguiar – 250 g · 320 Kč. Brazílie Aguiar Káva 250 g · 320 Kč Zo
merrybeans (coffee) teaser „Otevřít výběr kávy“ · OK
merrybeans: 14 ciest, významovo rovnaké / jednomožnostné otázky 0
typika 320x568,390x800,1280x800: 10 ciest, 114 obrazoviek, dosiahnuteľné kávy 10/10, nálezy 0
typika 390x800 bez fotiek: 10 ciest, 38 obrazoviek, dosiahnuteľné kávy 10/10, nálezy 0
typika 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
typika offline: OK bodky=true karty=1 volania=1 nová karta=false · Chuť „čokoládová a oříšková“ do automatu či kávovaru mají například: BASELINE Espre
typika mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Colombia El Indio - Natural – 250 g · 360 Kč. Colombia El Indio - Natural Ká
typika (coffee) teaser „Otevřít výběr kávy“ · OK
typika: 10 ciest, významovo rovnaké / jednomožnostné otázky 0
mlsnacava 320x568,390x800,1280x800: 13 ciest, 186 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
mlsnacava 390x800 bez fotiek: 13 ciest, 62 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
mlsnacava 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
mlsnacava offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a oriešková“ do automatu či kávovaru majú napríklad: Espresso: 
mlsnacava mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Espresso: Rwanda Impinga 550 – 250 g · 14,00 €. Espresso: Rwanda Impinga 
mlsnacava (coffee) teaser „Otvoriť výber kávy“ · OK
mlsnacava: 13 ciest, významovo rovnaké / jednomožnostné otázky 0
tarani 320x568,390x800,1280x800: 84 výsledkov, 126 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
tarani 390x800 bez fotiek: 28 výsledkov, 42 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
tarani 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
tarani offline: OK bodky=true karty=3 volania=1 nová karta=false · Z nabídky vybírám (pleť, pro citlivou pleť): ČERNÝ RYBÍZ krém proti zarudnutí Krémy
tarani mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam 24K GOLD & ŠAFRÁN rozjasňující gel – 1 653 Kč. 24K GOLD & ŠAFRÁN rozjasňujíc
tarani (cosmetics) teaser „Otevřít výběr péče“ · OK
coffeesource 320x568,390x800,1280x800: 25 ciest, 420 obrazoviek, dosiahnuteľné kávy 14/14, nálezy 0
coffeesource 390x800 bez fotiek: 25 ciest, 140 obrazoviek, dosiahnuteľné kávy 14/14, nálezy 0
coffeesource 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.svg
coffeesource offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „nízká kyselost“ do automatu či kávovaru mají například: BLACK Blend Káv
coffeesource mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Ethiopia Suke Quto washed – 250 g · 329 Kč. Ethiopia Suke Quto washed 
coffeesource (coffee) teaser „Otevřít výběr kávy“ · OK
coffeesource: 25 ciest, významovo rovnaké / jednomožnostné otázky 0
fiftybeans 320x568,390x800,1280x800: 62 ciest, 1296 obrazoviek, dosiahnuteľné kávy 23/23, nálezy 0
fiftybeans 390x800 bez fotiek: 62 ciest, 432 obrazoviek, dosiahnuteľné kávy 23/23, nálezy 0
fiftybeans 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
fiftybeans offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „sladká káva“ do automatu či kávovaru mají například: Bohumil Classic Káva
fiftybeans mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Berry twist – 200 g · 419 Kč. Berry twist Káva 200 g · 419 Kč Zobrazit ↗
fiftybeans (coffee) teaser „Otevřít výběr kávy“ · OK
fiftybeans: 62 ciest, významovo rovnaké / jednomožnostné otázky 0
dosmundos 320x568,390x800,1280x800: 57 ciest, 1194 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
dosmundos 390x800 bez fotiek: 57 ciest, 398 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
dosmundos 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
dosmundos offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „chuťově plnější“ do automatu či kávovaru mají například: Indie Harangal Ká
dosmundos mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Brazílie Vargem Alegre – 250 g · 360 Kč. Brazílie Vargem Alegre Káva 250 
dosmundos (coffee) teaser „Otevřít výběr kávy“ · OK
dosmundos: 57 ciest, významovo rovnaké / jednomožnostné otázky 0
illimite 320x568,390x800,1280x800: 13 ciest, 180 obrazoviek, dosiahnuteľné kávy 7/7, nálezy 0
illimite 390x800 bez fotiek: 13 ciest, 60 obrazoviek, dosiahnuteľné kávy 7/7, nálezy 0
illimite 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
illimite offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a sladká“ do automatu či kávovaru majú napríklad: Brasil Fazenda
illimite mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Guatemala Finca La Senda – 220 g · 13,50 €. Guatemala Finca La Senda Káva 
illimite (coffee) teaser „Otvoriť výber kávy“ · OK
illimite: 13 ciest, významovo rovnaké / jednomožnostné otázky 0
teamountain 320x568,390x800,1280x800: 42 výsledkov, 63 obrazoviek, hlavné odporúčanie 14/14, nálezy 0
teamountain 390x800 bez fotiek: 14 výsledkov, 21 obrazoviek, hlavné odporúčanie 14/14, nálezy 0
teamountain 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
teamountain offline: OK bodky=true karty=3 volania=1 nová karta=false · Podle toho, co hledáte (zelený čaj), z nabídky vybírám: Spring Pinglin Bi Luo 
teamountain mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Kalapani Summer Gold – 260 Kč. Kalapani Summer Gold Černé čaje · 50 g ·
teamountain (tea) teaser „Otevřít výběr čaje“ · OK
vitellaria 320x568,390x800,1280x800: 57 výsledkov, 84 obrazoviek, hlavné odporúčanie 19/19, nálezy 0
vitellaria 390x800 bez fotiek: 19 výsledkov, 28 obrazoviek, hlavné odporúčanie 19/19, nálezy 0
vitellaria 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.svg
vitellaria offline: OK bodky=true karty=3 volania=1 nová karta=false · Z nabídky vybírám (vlasy): Šampuk - pro muže Šampony Výrobce uvádí pro všechny 
vitellaria mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Šampuk - pro muže – 170 Kč. Šampuk - pro muže Šampony 170 Kč Zobrazit ↗
vitellaria (hair) teaser „Otevřít výběr péče“ · OK
ethia 320x568,390x800,1280x800: 48 výsledkov, 78 obrazoviek, hlavné odporúčanie 16/16, nálezy 0
ethia 390x800 bez fotiek: 16 výsledkov, 26 obrazoviek, hlavné odporúčanie 16/16, nálezy 0
ethia 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
ethia offline: OK bodky=true karty=3 volania=1 nová karta=false · Z nabídky vybírám (pleť, pro mastnou pleť): Rozjasňující sérum – vitamín C a rakytní
ethia mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Rozjasňující sérum – vitamín C a rakytník – 890 Kč. Rozjasňující sérum – vita
ethia (cosmetics) teaser „Otevřít výběr péče“ · OK
pureharmony 320x568,390x800,1280x800: 75 výsledkov, 105 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
pureharmony 390x800 bez fotiek: 25 výsledkov, 35 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
pureharmony 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
pureharmony offline: OK bodky=true karty=3 volania=1 nová karta=false · Z nabídky vybírám: AROMA CARE deodorant Růže s Vanilla Chai Deodoranty Výrobce
pureharmony mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam AROMA CARE deodorant Růže s Vanilla Chai – 329 Kč. AROMA CARE deodorant
pureharmony (cosmetics) teaser „Otevřít výběr péče“ · OK
voznice 320x568,390x800,1280x800: 23 ciest, 345 obrazoviek, dosiahnuteľné kávy 13/13, nálezy 0
voznice 390x800 bez fotiek: 23 ciest, 115 obrazoviek, dosiahnuteľné kávy 13/13, nálezy 0
voznice 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
voznice offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „bez kyselosti“ do automatu či kávovaru mají například: India KAAPI Royale Ká
voznice mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Brazil Fazenda Sao Silvestre – 150 g · 195 Kč. Brazil Fazenda Sao Silvestre
voznice (coffee) teaser „Otevřít výběr kávy“ · OK
voznice: 23 ciest, významovo rovnaké / jednomožnostné otázky 0
ceskava 320x568,390x800,1280x800: 31 ciest, 471 obrazoviek, dosiahnuteľné kávy 13/13, nálezy 0
ceskava 390x800 bez fotiek: 31 ciest, 157 obrazoviek, dosiahnuteľné kávy 13/13, nálezy 0
ceskava 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
ceskava offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „nižší acidita“ do automatu či kávovaru mají například: Českáva Brazílie Robu
ceskava mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Českáva Brazílie – 250 g · 215 Kč. Českáva Brazílie Káva 250 g · 215 Kč Zob
ceskava (coffee) teaser „Otevřít výběr kávy“ · OK
ceskava: 31 ciest, významovo rovnaké / jednomožnostné otázky 0
kamikava 320x568,390x800,1280x800: 34 ciest, 594 obrazoviek, dosiahnuteľné kávy 17/17, nálezy 0
kamikava 390x800 bez fotiek: 34 ciest, 198 obrazoviek, dosiahnuteľné kávy 17/17, nálezy 0
kamikava 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
kamikava offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „nízká kyselost“ do automatu či kávovaru mají například: India Cherry Káva V
kamikava mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Brazil Mogiana – 100 g · 101 Kč. Brazil Mogiana Káva 100 g · 101 Kč Zobraz
kamikava (coffee) teaser „Otevřít výběr kávy“ · OK
kamikava: 34 ciest, významovo rovnaké / jednomožnostné otázky 0
laprazirna 320x568,390x800,1280x800: 12 ciest, 144 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
laprazirna 390x800 bez fotiek: 12 ciest, 48 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
laprazirna 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
laprazirna offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „bez kyselosti“ do automatu či kávovaru mají například: LaPrazirna SILVER 
laprazirna mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam LaPrazirna BARISTA – 250 g · 280 Kč. LaPrazirna BARISTA Káva 250 g · 280
laprazirna (coffee) teaser „Otevřít výběr kávy“ · OK
laprazirna: 12 ciest, významovo rovnaké / jednomožnostné otázky 0
mydlozfarmy 320x568,390x800,1280x800: 75 výsledkov, 111 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
mydlozfarmy 390x800 bez fotiek: 25 výsledkov, 37 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
mydlozfarmy 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
mydlozfarmy offline: OK bodky=true karty=3 volania=1 nová karta=false · Z ponuky vyberám (pre citlivú pleť, mydlo): Levanduľa a šalvia mydlo Bylinkové
mydlozfarmy mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Vanilkové pery v plechovke – 5,00 €. Vanilkové pery v plechovke Balzamy
mydlozfarmy (cosmetics) teaser „Otvoriť výber starostlivosti“ · OK
kafeprosebe 320x568,390x800,1280x800: 43 ciest, 777 obrazoviek, dosiahnuteľné kávy 25/25, nálezy 0
kafeprosebe 390x800 bez fotiek: 43 ciest, 259 obrazoviek, dosiahnuteľné kávy 25/25, nálezy 0
kafeprosebe 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
kafeprosebe offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a oříšková“ do automatu či kávovaru mají například: Fuerte Ká
kafeprosebe mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Brazílie - Black Diamond – 250 g · 198 Kč. Brazílie - Black Diamond Káv
kafeprosebe (coffee) teaser „Otevřít výběr kávy“ · OK
kafeprosebe: 43 ciest, významovo rovnaké / jednomožnostné otázky 0
poppybeans 320x568,390x800,1280x800: 28 ciest, 447 obrazoviek, dosiahnuteľné kávy 13/13, nálezy 0
poppybeans 390x800 bez fotiek: 28 ciest, 149 obrazoviek, dosiahnuteľné kávy 13/13, nálezy 0
poppybeans 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) mark.png
poppybeans offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a sladká“ do automatu či kávovaru mají například: Rwanda Inzov
poppybeans mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Ethiopia Rumudamo natural – 250 g · 439 Kč. Ethiopia Rumudamo natural Ká
poppybeans (coffee) teaser „Otevřít výběr kávy“ · OK
poppybeans: 28 ciest, významovo rovnaké / jednomožnostné otázky 0
```
Poznámka: jeden beh Beansmith's bez fotiek počas dvoch súbežných testov hlásil 9× „rozbitý obrázok“ (časovanie náhradného obrázka); samostatné opakovanie 0 nálezov – v registri je opakovaný beh.

## Preview a SHA
- SHA testovanej verzie: `57405fc` (vetva `claude/n447-s3a-20261105`), Preview READY: https://kava-chatbot-backend-qrfprnjpy-danielvendzur-codes-projects.vercel.app/ (Vercel ochrana; zoznam ukážok, každá `/cosmetics.html?demo=<firma>`). Iba interná kontrola.
- Na Preview neboli volané chaty (išli by do produkčného modelu) – chat overený lokálne cez mock.
- Predchádzajúce: dávka 1 `8ab2982` / register `8fed03a` / Preview `5qc540k8j`.

## Prekážky
- Počítač LAPTOP-NSU02PK6: „Asleep or app closed“. Práca a testy bežali v cloudovom prostredí relácie (vetva a lokálny server tu); na počítači sa nič nespúšťalo ani neukladalo.
- Neobchádzané: Wikimedia 429, odmietnutia proxy 466 (Triple Five, Herbadent, Levanduland, RaE), SPA bez dát (SAELA).
