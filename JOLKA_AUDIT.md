# Pražiareň Jolka — finálny audit pred/po

Dátum kontroly: 6. august 2026  
Vetva: `agent/jolka-modern-craft`

## Rozsah

Úprava je izolovaná na samostatný Jolka entrypoint. Ostatné firemné varianty, API routy, environment variables a staré coffee v2–v7 súbory neboli upravené. Nevznikol nový patch ani override súbor.

## Stav pred týmto refinementom

Prvá modern-craft verzia už odstránila ružovo-hnedú paletu, generický symbol a neplatný nested button. Stále však pôsobila skôr ako landing pre zákazníka než ako personalizovaný návrh pre majiteľa firmy.

Zostávajúce problémy:

- hero komunikoval generický zákaznícky slogan namiesto obchodného prínosu pre Pražiareň Jolka,
- chatbot panel bol použiteľný, ale vizuálne menší a menej plnohodnotný než silné verzie Derat, Môj Plot, Koverta a hlavný Môj Chatbot,
- produktové fotografie neboli dostatočne výraznou súčasťou výberu,
- quick chips boli nad inputom, ale nemali dostatočne silný rozmer a bottom-control charakter,
- chat obsahoval samostatný kontaktný blok Zavolať / Kontakt / E-shop, ktorý v prezentačnom e-shop deme zbytočne zahusťoval spodnú časť,
- prepínač mal dobrý základ, ale potreboval väčšiu výšku, jasnejší aktívny stav a sekundárny popis,
- landing a widget neboli dostatočne prepojené owner-facing copywritingom,
- pôvodný jeden CSS a jeden JavaScript súbor miešali landing, widget, produktové dáta a interakčnú logiku bez jasného rozdelenia zodpovedností.

## Stav po refinemente

### Owner-facing landing

Landing teraz explicitne komunikuje:

- „Vitajte vo vašom návrhu chatbotu pre Pražiareň Jolka“,
- „Takto môže vyzerať AI poradca pre váš e-shop“,
- prínos: jednoduchší výber kávy, zrozumiteľná acidita a menej opakujúcich sa otázok.

Obsah je zredukovaný na jednu hlavnú vetu, tri obchodné benefity, jedno CTA a jednu vizuálnu ukážku zákazníckej skúsenosti. Na notebooku sa zmestí bez zbytočného scrollovania.

### Produktová rodina a brand osobnosť

Zostali zachované pravidlá spoločné s Deratom, Môj Plotom, Kovertou a hlavným Môj Chatbotom:

- veľký panel,
- výrazný oválny prepínač,
- mobilný fullscreen,
- jeden jasný progres,
- pokojné selected stavy,
- oblé až oválne ovládanie,
- čistá hierarchia bez efektového chaosu.

Jolka si ponecháva vlastnú identitu cez tmavú zelenú `#173a32`, smotanovú `#f7f4ec`, sage `#c8d5c8`, kávové produktové fotografie a vlastný dvojcestný znak J / zrno / bublina.

### Panel a prepínač

- desktop panel: 520 × 790 px,
- mobil 390 px a 360 px: fullscreen,
- prepínač Výber kávy / Chat má 66 px, oválny indikátor a sekundárny popis,
- panel nepôsobí ako polovičný floating widget,
- focus trap, Escape, scroll lock a safe-area pravidlá zostali zachované.

### Fotografie

Oficiálne produktové fotografie Pražiarne Jolka sú použité:

- v landing výsledkovej ukážke,
- v piatich smeroch prvej otázky,
- vo výsledku konkrétneho produktu.

Pri nedostupnom externom obrázku sa zobrazí čistý značkový fallback bez rozbitého alt textu. Emoji sa nepoužívajú ako vizuálna náhrada produktu.

### Chat a quick chips

- quick chips sú súčasťou spodného ovládacieho bloku priamo pri inpute,
- majú minimálnu výšku 44 px,
- na mobile sú horizontálne posúvateľné bez rozbíjania layoutu,
- odstránený bol celý kontaktný blok Zavolať / Kontakt / E-shop,
- zostal iba decentný preklik `mojchatbot.sk` v pätičke panelu,
- chat má owner-facing vysvetlenie, že ide o ukážku zákazníckych otázok.

### Výsledok a konverzia

Výsledok obsahuje:

- konkrétnu kávu,
- reálnu produktovú fotografiu,
- cenu „od“,
- tri chuťové tóny,
- aciditu vysvetlenú normálnym jazykom,
- odporúčanú prípravu,
- jeden dôvod odporúčania,
- presne jednu alternatívu,
- výber balenia a mletia,
- priamy odkaz na reálny produkt.

Desktop výsledok bol skompaktnený tak, aby boli obe hlavné CTA viditeľné bez ďalšieho scrollovania.

## Overené produkty a odkazy

| Produkt | Cena použitá v ukážke | Priamy odkaz |
|---|---:|---|
| Zmes Jolka | od 5,90 € | https://www.praziarenjolka.sk/produkt/zmes-jolka/ |
| Zmes Čokoláda | od 5,90 € | https://www.praziarenjolka.sk/produkt/zmes-cokolada/ |
| Ethiopia SIDAMO GR.2 | od 5,90 € | https://www.praziarenjolka.sk/produkt/ethiopia-sidamo/ |
| Vietnam Lang Biang – Anaerobic Natural | od 6,50 € | https://www.praziarenjolka.sk/produkt/vietnam-lang-biang-anaerobic-natural/ |
| El Salvador SHG EP | od 5,90 € | https://www.praziarenjolka.sk/produkt/el-salvador-shg-ep/ |

Ukážka nepovažuje cenu „od“ za cenu zvoleného balenia. Aktuálnu cenu a dostupnosť vždy potvrdí produktová stránka.

## Testy

Výsledok finálnej sady: **20/20 prešlo**.

- owner-facing headline a obchodný benefit,
- odstránený kontaktný blok,
- dva decentné odkazy na `mojchatbot.sk`,
- veľký desktop panel,
- fotografie v prvej otázke,
- bez nested button,
- klasický tok → Zmes Jolka,
- ovocný tok → Ethiopia SIDAMO GR.2,
- experimentálny tok → Vietnam Lang Biang,
- presne jedna alternatíva,
- priamy produktový odkaz,
- návrat so zachovaným selected stavom,
- quick chips v bottom controls a minimálna výška 44 px,
- API odpoveď,
- lokálny fallback,
- 390 px fullscreen,
- 360 px reduced motion,
- bez horizontálneho overflow,
- bez JavaScript runtime chýb.

Testovací prehliadač v pracovnom prostredí blokuje localhost a externé obrázky. Presné produkčné súbory boli preto vložené bez funkčných zmien do inline testovacieho dokumentu. Finálna modulárna zostava prešla znovu celou sadou 20 kontrol; externé fotografie boli pri fallback QA zámerne blokované.

## Upravené súbory

- `jolka.html` — owner-facing landing, veľký widget a čisté načítanie modulov,
- `jolka.css` — základ značky, landing, teaser a spoločný shell,
- `jolka-experience.css` — panel, poradca, výsledok, chat a responzívne pravidlá ako jedna funkčná vrstva, nie opravný override,
- `jolka-data.js` — overené produkty, fotografie, otázky a chuťové dáta,
- `jolka.js` — skórovanie, interakcie, chat, fallback a prístupnosť,
- `JOLKA_AUDIT.md` — finálny audit a testovací rozsah.

## Nasadenie

Nebol spustený žiadny manuálny Vercel príkaz, preview príkaz, pull request ani merge do `main`. Aktualizácia GitHub vetvy môže automaticky aktivovať už pripojenú Vercel integráciu repozitára; nejde o manuálne spustený deployment z tohto pracovného postupu.
