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
TESTY

## Preview a SHA
PREVIEW
