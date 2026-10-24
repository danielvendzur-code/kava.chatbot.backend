# Nové ukážky 447 € + 10 €/mes. bez trialu – stav (2026-10-24)

Vetva `claude/n447-black-20261022`, HEAD `3f1136f`, spoločné jadro a API naposledy zmenené v `3f1136f` (stĺpec Commit = posledná zmena vlastných súborov firmy). Interný Preview: https://kava-chatbot-backend-7jd6yjbet-danielvendzur-codes-projects.vercel.app (commit 3f1136f). Interný Preview (Vercel, vetva). Zelený build nie je overená produkcia; produkcia ani zákaznícke subdomény nie sú nasadené.

| Firma | Stav | Stránka (Preview) | Produkty / overené balenia | Prehliadač | Commit | Poznámky |
|---|---|---|---|---|---|---|
| BLACK. (pražiareň black.) | BLOCKED_PRICES | /black.html | 15 / 3 overených balení | NOT_FINISHED | d032700 | E-shop ukazuje pri káve iba rozsah ceny; cenu konkrétneho balenia načíta až interakciou. Overené iba doce citrus (Codex). Priame POST požiadavky blokuje WAF (Access Denied), Playwright dostal 429 – požiadavky zastavené, neobchádzané.; ceny balení 14 z 15 káv neoverené → otázka rozpočtu sa neponúka; deduplikácia pošty neoverená (bez prístupu k webmailu) |
| Verticcio | READY_FOR_REVIEW | /verticcio.html | 21 / 40 overených balení | NOT_FINISHED | db8243c | kontakt marketing@verticcio.sk zo zadania – kontaktná stránka za WAF (466), znovu neoverovaný |
| Rebelbean | READY_FOR_REVIEW | /rebelbean.html | 11 / 21 overených balení | NOT_FINISHED | 4745e87 | – |
| Nordbeans | READY_FOR_REVIEW_PARTIAL | /nordbeans.html | 15 / 30 overených balení | NOT_FINISHED | 9016a7b | 5 produktových stránok vrátilo 403 aj po jednom pomalom opakovaní – tieto kávy nie sú vo výbere.; 5 káv nezahrnutých (403); chat s AI: zdieľaný ai-chat.js maže „_“ z odkazov, odkazy Nordbeans (…_z123/) preto vždy padnú na overenú odpoveď z katalógu |
| doubleshot | READY_FOR_REVIEW | /doubleshot.html | 11 / 21 overených balení | NOT_FINISHED | 0fa76b6 | Farm • Bule Hora vyradená (rozpor gramáže 300 g vs 350 g) |
| Father's Coffee Roastery | READY_FOR_REVIEW | /fathers.html | 32 / 89 overených balení | NOT_FINISHED | 3f1136f | ceny 1 kg / 2 kg z dát e-shopu (s DPH pre ČR, zaokrúhlené nahor podľa zobrazených 250 g cien); priamo zobrazená je iba cena 250 g; Zebigi a Inzá (espresso) vyradené – kategória Espresso, popis uvádza filter |
| Candycane coffee | READY_FOR_REVIEW | /candycane.html | 10 / 11 overených balení | NOT_FINISHED | b103455 | overená je iba cena predvoleného balenia; ceny 1 kg / 2,5 kg stránka bez práce s košíkom neukazuje |
| 9 Grams Coffee (e-shop coffeeart.me) | READY_FOR_REVIEW | /9gramscoffee.html | 30 / 51 overených balení | NOT_FINISHED | 3f1136f | jedna obchodná ukážka pre prevádzkovateľa 9 Grams Coffee s.r.o. (CoffeeArt/Costadoro sa neoslovujú zvlášť); e-shop dočasne vrátil 403, stiahnuté po pauze; obrázky z CDN tiež po pauze |
| Renovality | IN_PROGRESS | – | – | – | – | Shoptet vrátil 403 po 8 požiadavkách; jedno pomalé opakovanie (8 s) po 20 min pauze. |
| Saloos | READY_FOR_REVIEW | /saloos.html | 124 / 124 overených balení | – | b593f86 | overená je cena predvoleného balenia z výpisu; iné veľkosti sa načítajú až po výbere; prehliadačová kontrola kozmetiky: ručný priechod (pleť, telo); automatická sada pre kozmetiku zatiaľ nie je |
| Nobilis Tilia | NOT_STARTED | – | – | – | – | – |
| Manufaktura | NOT_STARTED | – | – | – | – | – |

Pravidlá: Rozpočet platí pre celý nákup vrátane doplnku. Otázka rozpočtu sa ponúkne iba vtedy, keď má každá vhodná káva overené balenie; hranica sa porovnáva s cenou konkrétneho balenia. Cena „od“ je iba informatívna a rozpočet nikdy nesplní; doplnok sa pridá len keď sa celok zmestí. Pri viac než 4 rovnocenných kávach sa jadro pýta na overený rozdiel (spracovanie, pôvod, zloženie, stupeň praženia). Ak už rozdiel neexistuje, výber je stránkovaný v poradí e-shopu („Ďalšie vhodné kávy“); cena ani iné skryté poradie nerozhoduje (oprava regresie d032700 v d853d08).

Testy: Node: tools/n447-test.mjs (všetky cesty, rozpočtové hranice, dosiahnuteľnosť každej kávy, regresie Codexu, jazyk CS, chat offline, API mock 0 platených volaní); kozmetika tools/n447-cx-test.mjs; prehliadač tools/n447_browser_check.py (pokrývajúca sada ciest na 320×568, 390×650, 560×600, 1280×800).

E-maily: iba koncepty `n447/email-<slug>.md` (DRAFT), neodoslané a nenaplánované. Zákazník dostane výhradne vlastnú subdoménu mojchatbot.sk až po schválení produkcie.
