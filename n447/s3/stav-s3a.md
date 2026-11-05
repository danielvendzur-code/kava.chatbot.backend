# Séria 3 – stavový register (rozloženie Andreine) · 2026-11-05

Ponuka 447 € jednorazovo + 10 €/mes., bez skúšobného obdobia. Vetva `claude/n447-s3a-20261105` (samostatná, bez spoločnej histórie s pôvodnými ukážkami).
Základ: zdrojové súbory schválenej ukážky Andreine (nasadenie `dpl_GBL4YxYNrimfow7U7NJodUUvqdh6`, 216 súborov stiahnutých a overených SHA1).
Súbory, aliasy a koncepty Codexu (pôvodné ukážky a osmička Šabata, Plenér, Purity, Noili, LIQOIL, SMYSSLY, Andreine, LucyLab) sa nemenili – kópie ich značiek boli z tejto vetvy odstránené.

**Nič nie je nasadené do produkcie, žiadne DNS, žiadne e-maily, žiadne platené volania modelu.** Preview je iba na internú kontrolu; klientska adresa `<firma>.mojchatbot.sk` čaká na schválenie.

## Čo sa zmenilo oproti Andreine (iba obsah, nie rozloženie)
- `s3-boot.js`, `s3-brands.js` – jedna adresa = jedna firma (iné `?demo=` alebo subdoména neukáže cudziu firmu), texty segmentu (káva/kozmetika), cena 447 € bez trialu, logá.
- `cosmetics.js` – texty sú voliteľné cez `window.CX_SEGMENT`; bez neho ostáva presný text Andreine. Háčik `CX_LOCAL_REPLY` pre offline odpoveď kávy.
- `full-coffee-advisor.js` – káva v paneli Andreine (rovnaké triedy `.cx-quality-*`, karty, postup, Späť), otázky a výsledok z overeného jadra `n447/c2/engine-c2.js`.
- `catalogue-advisor.js` – jediný riadok: texty vlastných vlastností firmy (`CX_TRAIT_COPY`).
- `n447/s3/s3a-plus.css` – z PLUS iba chat: karty produktov, tri bodky, príchod správy, logo v kruhu, rýchle voľby 4 × rovnaké 40 px.
- `n447/s3/plus-chat.js` – kruh správy: biely podklad s logom firmy vo farbách (žiadny tmavý obrázok na tmavom kruhu).
- Popisné fotky volieb kávy: `assets/s3/coffee/` (zdroje a licencie v `sources.json`, CC0 / CC BY).
- Chat: `api/cosmetics-chat.js` → `lib/coffee-chat.js` / `lib/cosmetics-chat.js`; produkčný model ostáva v `api/ai-chat.js` (Sonnet, kľúč iba z prostredia), bez kľúča alebo pri chybe overený návrh z katalógu.

## Firmy (dávka 1 prerobená na Andreine)
Stav pre všetky: **ukážka pripravená na kontrolu** – nie odoslaná, nie nasadená.

| Firma | Segment | Zdroj katalógu (overené 5. 11. 2026) | Produkty | Nákupná otázka |
|---|---|---|---|---|
| Beansmith's | káva CZ | https://beansmiths.com/kategorie-produktu/kava/ (Woo Store API) | 22 káv | príprava (automat / filter), acidita a chuť |
| Merrybeans | káva CZ | https://www.merrybeans.cz/espresso (+ filtr, stránky variantov) | 11 káv | espresso vs. filter, spracovanie |
| TYPIKA | káva CZ | https://typika.coffee/collections/all (Shopify products.json) | 10 káv | filter vs. espresso roast, chuťové tóny |
| MLSNACAVA | káva SK | https://mlsnacava.sk/obchod/ (Woo + stránky produktov) | 12 káv | espresso vs. filter, spracovanie, rozpočet |
| TARANI | kozmetika CZ | https://www.tarani.cz/kosmetika-pece-o-plet/ (kategórie Pleť dle typu / dle problematiky) | 25 z 64 dostupných pleťových | druh starostlivosti a čo má riešiť (upokojenie, hydratácia, vrásky, póry, výživa, rozjasnenie) |

TARANI: zákazníkovi sa limit nehovorí; výber 25 = každá kombinácia (druh × účinok podľa e-shopu) raz, všetkých 25 je hlavným odporúčaním aspoň jednej cesty.

## Testy (lokálny server, sieť a model vypnuté, /api blokované alebo mock)
Všetky cesty výberu cez tlačidlá rozhrania (320 × 568, 390 × 800, 1280 × 800) a bez fotiek (390 × 800): hscroll, karta mimo panela, rozbitý obrázok, opakovaná fotka v otázke, rovnaká výška kariet, undefined/NaN; výsledok = názov, cena a odkaz z jadra, bez novej karty, alternatíva, rozpočet; Späť.
```
beansmiths 320x568,390x800,1280x800: 32 ciest, 561 obrazoviek, dosiahnuteľné kávy 22/22, nálezy 0
beansmiths 390x800 bez fotiek: 32 ciest, 187 obrazoviek, dosiahnuteľné kávy 22/22, nálezy 0
merrybeans 320x568,390x800,1280x800: 14 ciest, 192 obrazoviek, dosiahnuteľné kávy 11/11, nálezy 0
merrybeans 390x800 bez fotiek: 14 ciest, 64 obrazoviek, dosiahnuteľné kávy 11/11, nálezy 0
typika 320x568,390x800,1280x800: 10 ciest, 114 obrazoviek, dosiahnuteľné kávy 10/10, nálezy 0
typika 390x800 bez fotiek: 10 ciest, 38 obrazoviek, dosiahnuteľné kávy 10/10, nálezy 0
mlsnacava 320x568,390x800,1280x800: 13 ciest, 186 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
mlsnacava 390x800 bez fotiek: 13 ciest, 62 obrazoviek, dosiahnuteľné kávy 12/12, nálezy 0
tarani 320x568,390x800,1280x800: 84 výsledkov, 126 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
tarani 390x800 bez fotiek: 28 výsledkov, 42 obrazoviek, hlavné odporúčanie 25/25, nálezy 0
```
Rýchle voľby (4 obdĺžniky rovnakej šírky, výška 40 px, text neorezaný) a logo v kruhu správy (načítané, biely podklad):
```
beansmiths 320px chipy OK [[148,40,""],[148,40,""],[148,40,""],[148,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
beansmiths 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
beansmiths 1280px chipy OK [[257.5,40,""],[257.5,40,""],[257.5,40,""],[257.5,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
merrybeans 320px chipy OK [[148,40,""],[148,40,""],[148,40,""],[148,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
merrybeans 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
merrybeans 1280px chipy OK [[257.5,40,""],[257.5,40,""],[257.5,40,""],[257.5,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
typika 320px chipy OK [[148,40,""],[148,40,""],[148,40,""],[148,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
typika 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
typika 1280px chipy OK [[257.5,40,""],[257.5,40,""],[257.5,40,""],[257.5,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
mlsnacava 320px chipy OK [[148,40,""],[148,40,""],[148,40,""],[148,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
mlsnacava 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
mlsnacava 1280px chipy OK [[257.5,40,""],[257.5,40,""],[257.5,40,""],[257.5,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
tarani 320px chipy OK [[148,40,""],[148,40,""],[148,40,""],[148,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
tarani 390px chipy OK [[183,40,""],[183,40,""],[183,40,""],[183,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
tarani 1280px chipy OK [[257.5,40,""],[257.5,40,""],[257.5,40,""],[257.5,40,""]] · avatar OK pozadie rgb(255, 255, 255) logo.png
```
Chat bez platených volaní – offline (overené jadro v prehliadači) a mock servera: tri bodky, odpoveď, karty produktov, odkazy v rovnakej karte:
```
beansmiths offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a jemná“ do automatu či kávovaru mají například: HOLY ESKO Káva V chuti: čokoládová, ovocná (chutě podle e-shopu). 250 g za 137 Kč Zobrazit ↗ C
beansmiths mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Duwancho – 250 g · 405 Kč. Duwancho Káva 250 g · 405 Kč Zobrazit ↗
merrybeans offline: OK bodky=true karty=1 volania=1 nová karta=false · Chuť „čokoládová a oříšková“ do automatu či kávovaru mají například: Espresso blend Káva V chuti: čokoláda, oříšky, med. 250 g za 230 Kč Zobrazit ↗
merrybeans mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Brazílie Aguiar – 250 g · 320 Kč. Brazílie Aguiar Káva 250 g · 320 Kč Zobrazit ↗
typika offline: OK bodky=true karty=1 volania=1 nová karta=false · Chuť „čokoládová a oříšková“ do automatu či kávovaru mají například: BASELINE Espresso Blend Káva V chuti: čokoláda, lískový ořech, karamel. 250 g za 260 Kč Zob
typika mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Colombia El Indio - Natural – 250 g · 360 Kč. Colombia El Indio - Natural Káva 250 g · 360 Kč Zobrazit ↗
mlsnacava offline: OK bodky=true karty=2 volania=1 nová karta=false · Chuť „čokoládová a oriešková“ do automatu či kávovaru majú napríklad: Espresso: Brazil Monteiro Lobato Káva V chuti: karamel, lieskovce, mliečna čokoláda. 250 g
mlsnacava mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam Espresso: Rwanda Impinga 550 – 250 g · 14,00 €. Espresso: Rwanda Impinga 550 Káva 250 g · 14,00 € Zobraziť ↗
tarani offline: OK bodky=true karty=3 volania=1 nová karta=false · Z nabídky vybírám (pleť, pro citlivou pleť): ČERNÝ RYBÍZ krém proti zarudnutí Krémy Podle popisu pro citlivou pleť, zklidnění. 455 Kč Zobrazit ↗ EMBELIKA Adapto
tarani mock: OK bodky=true karty=1 volania=1 nová karta=false · Odporúčam 24K GOLD & ŠAFRÁN rozjasňující gel – 1 653 Kč. 24K GOLD & ŠAFRÁN rozjasňující gel Emulze a gely 1 653 Kč Zobrazit ↗
```
Server lokálne (sieť vypnutá → overený návrh): beansmiths, typika, mlsnacava, tarani odpovedajú 200; neznáma firma 400.
Nástroje: `tools/s3a/dfs-coffee.mjs`, `tools/s3a/dfs-native.mjs`, `tools/s3a/chips-avatar.mjs`, `tools/s3a/chat-mock.mjs`; snímky `n447/s3/dokazy-s3a/`.

## Preview a SHA
- SHA testovanej verzie: `8ab2982` (vetva `claude/n447-s3a-20261105`), build Preview READY.
- Preview (interné, Vercel ochrana): https://kava-chatbot-backend-5qc540k8j-danielvendzur-codes-projects.vercel.app/ → zoznam 5 ukážok, každá `/cosmetics.html?demo=<firma>`.
- Na Preview neboli volané chaty (každé volanie by išlo do produkčného modelu) – chat overený lokálne cez mock.
- Klientske adresy `<firma>.mojchatbot.sk`: nepriradené, čakajú na schválenie. Koncepty e-mailov `n447/s3/email-*.md` (päta mojchatbot.sk), neodoslané.
