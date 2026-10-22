# Dokončovanie ukážok — 21. 10. 2026

- Zachovaný verejný odkaz Dulcia, nový oficiálny LucyLab: 187 produktov, pôvodné oficiálne SVG logo, farby, aktuálne produktové odkazy a podmienky dopravy. Organization JSON-LD LucyLabu uvádza Dulcia a DULCIA natural ako alternateName. Používateľ výmenu schválil.
- Purity: konkrétny Shopify variant 53212181692739 stojí 1 329 Kč; levanduľový rituál je sada, nie samostatné sérum.
- Otázka na rozpočet nepotrebuje vytvárať všetky dvojice produktov a doplnkov. Presné maximum prípustnej zostavy zachováva pôvodné otázky; výnimka pre duplicitné ID zachováva pôvodné vylučovanie položiek.
- Doplnený chýbajúci český preklad prípravy na sporáku; obnovené verzie súborov.

Overenie: 63 kozmetických/vlasových katalógov, 679 porovnaní pôvodných a nových otázok bez rozdielu; samostatná kontrola duplicitného ID a hranice rozpočtu. Úplný aktuálny renderer oboch rodín: 9 068 výsledkových ciest. Zmenené katalógy a skin core zodpovedajú samostatnému skincare projektu; čas overenia v metadátach Purity sa líši o 30 ms. Offline skin API: 2 897/2 897. Mobilná kontrola 52 kozmetických značiek, vrátane veľkých Natureal a Soaphoria, prešla. Podrobné dôkazy sú v pracovnom adresári outputs/qa.

Produkčné modely, tajomstvá, DNS ani ochrana nasadení sa nemenia. Testy neposielali žiadne platené AI požiadavky. Stav nasadenia a odosielania sa vedie oddelene od miestnych testov.

Dodatočná kontrola kávy našla chýbajúce rozhodnutie pri viacerých vhodných kávach. Spoločný poradca teraz voliteľne pridá otázku na skutočné chuťové tóny a doložené zloženie. Rovnaké tóny ani neznáme fakty nevytvárajú otázku; najviac dve doplňujúce rozhodnutia. Zmena predchádzajúcej odpovede odstráni nasledujúce rozhodnutia a reset obnoví pôvodné kroky. Textové porovnávacie riadky nepoužívajú opakované fotografie.

`node tools/coffee-differences-test.cjs` overuje reálne možnosti Pražiarničky aj neznáme/zhodné údaje. Úplná kontrola skutočného rankera a nového modulu nad aktuálnymi dátami všetkých 22 ukážok prešla: 3 480 základných kombinácií, 4 715 konečných ciest, 628 zobrazení doplňujúcej otázky. Mobilné vetvy Pražiarničky vedú správne na Brazil Santos a Cuba Serrano; návrat medzi otázkami a reset prešli.


22. 10.: podľa novej požiadavky sú staršie odoslané ukážky zmrazené. Doplňujúce otázky sa načítajú iba v neodoslaných ukážkach Don Franko a Pražírna Brno cez samostatné coffee-jolka-app-current.js a coffee-quality-current.css. Pôvodných 20 HTML a pôvodné spoločné JS/CSS zostávajú po bajtoch zhodné s produkčným commitom 47d5c9b6aa580469fa593a5d8c6e2bd8706db330. Predchádzajúce testy Pražiarničky dokazujú logiku modulu, nejde o zmenu jej produkčnej stránky.

22. 10., záverečná jazyková kontrola: chuťové tóny v dvoch českých neodoslaných ukážkach sa zobrazujú po česky aj v doplňujúcich otázkach, výsledku a rozbalenom zozname. Pôvodné chuťové hodnoty pre filtrovanie, názvy produktov a staršie ukážky sa nemenia.
