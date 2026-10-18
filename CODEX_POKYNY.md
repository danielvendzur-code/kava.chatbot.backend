# Pokyny pre Codex — ukážky mojchatbot.sk (stav 18. 10. 2026)

Cieľ: dotiahnuť a skontrolovať všetky ukážky chatbotov (káva, kozmetika, vlasy, rastliny, víno, čaj) tak,
aby chat odpovedal prirodzene a pravdivo a poradca (výber) fungoval vo všetkých kombináciách.
Pracuj **iba na relevantných veciach**: kontroly a opravy ukážok. Nič nepokaz.

## 0. Pravidlá — platia vždy

- **Nepushuj do `master`/`main`, nerob force push, nerob rebase cudzej histórie.** Každý repozitár má svoju vetvu (nižšie); commituj a pushuj iba tam.
- **Nemeň DNS, hlavnú doménu, www, poštu, Vercel účet ani plán, nekupuj upgrade, neobchádzaj limity.** Nemeň nesúvisiace projekty.
- **Neposielaj žiadne e-maily ani správy.** Nevytváraj pull requesty, kým o to majiteľ nepožiada.
- **Nič si nevymýšľaj.** Ceny, dostupnosť, balenia, zloženie, dopravu, platby, adresy a kontakty ber iba priamo z e-shopu danej firmy; pred každou úpravou katalógu údaj na e-shope over a do katalógu zapíš dátum overenia.
- **Heslá, kľúče a tajomstvá nikdy nevypisuj** do kódu, commitov ani výstupov. `ANTHROPIC_API_KEY` je iba v nastaveniach Vercelu.
- **V otázkach a výbere poradcu nesmie byť scrollovanie** (320×568, 390×650, 560×600). Scrollovať smie iba finálny výsledok.
- Pred každým commitom spusti testy z bodu 3; počet úspešných prípadov nesmie klesnúť.
- Do commitov nepíš názvy ani ID modelov.
- Malé, overené commity s jasným popisom. Ak si nie si istý, že zmena je správna, nerob ju a zapíš ju do „Otvorené otázky“ na konci tohto súboru.

## 1. Repozitáre a vetvy

| Repozitár | Vetva | Čo obsahuje |
|---|---|---|
| `danielvendzur-code/kava.chatbot.backend` | `claude/coffee-deep3-20261016` | 22 kávových ukážok + kozmetika na *.mojchatbot.sk (živé cez Vercel, projekt `kava-chatbot-backend`). **Hlavná kópia** `chat-brain.js` a `chat-adapters.js`. |
| `danielvendzur-code/skincare` | `claude/nice-lovelace-k6lo35` | `kozmetika-nove/`, `vlasy-nove/`, `rastliny-demo/` (a starší `vino-demo/`) |
| `danielvendzur-code/vino` | `claude/nice-lovelace-k6lo35` | 43 vinárstiev |
| `danielvendzur-code/caj` | `claude/nice-lovelace-k6lo35` | Pauwex / Santée, AFRA BIO |

**Zdieľaný „mozog“ chatu:** `chat-brain.js` + `chat-adapters.js` sa upravujú **iba** v `kava.chatbot.backend` a potom sa skopírujú bez zmeny do:
`skincare/kozmetika-nove/`, `skincare/vlasy-nove/`, `skincare/rastliny-demo/`, `vino/`, `caj/`. Všetky kópie musia byť bajtovo rovnaké (`cmp`).

**AI odpovede:** `api/ai-chat.js` (funkcia `aiAnswer`) je v 6 kópiách — `kava.chatbot.backend/api/`, `skincare/kozmetika-nove/api/`, `skincare/vlasy-nove/api/`, `skincare/rastliny-demo/api/`, `vino/api/`, `caj/api/`. Tiež musia byť rovnaké.

## 2. Ako teraz funguje chat (nemeň princíp)

1. Pravidlá katalógu (`chat-brain.js` + adaptér rodiny) pripravia overený **návrh odpovede**.
2. `aiAnswer` pošle Claudovi otázku, históriu (8 správ), produkty (spomenuté + 30 najbližších), dopravu/platbu/odber a návrh.
3. Claude odpovie vlastnými slovami. Ak odpoveď obsahuje **cenu alebo odkaz, ktorý nie je v údajoch**, alebo nastane chyba/timeout (10 s) — pošle sa overený návrh (`fallback: true`).
4. Model: premenná `CHAT_MODEL` (predvolene Sonnet 5.5; lacnejšia možnosť Haiku 5.5). Frontend kávy ukáže lokálnu odpoveď po 4,5 s a nahradí ju AI odpoveďou, keď príde.

## 3. Testy, ktoré musia prejsť pred každým commitom

- `node skincare/rastliny-demo/tools/api-test.mjs` → musí vypísať `PASS API`.
- `node --check` na každý zmenený `.js` súbor.
- V `kava.chatbot.backend`: `node scripts/stamp-assets.mjs` a potom `node scripts/stamp-assets.mjs --check` (verzie súborov v HTML). Ak meníš súbory zo zoznamu v `advisor-boot.js`, prepočítaj ich `?v=` (prvých 8 znakov SHA-1 obsahu súboru).
- Napíš si (a commitni do `tools/` príslušného repozitára) **regresný skript**, ktorý zavolá handler `api/*.js` priamo v Node (bez kľúča → deterministická odpoveď) pre každú ukážku a sadu otázok z bodu 5. Výsledok porovnávaj pred a po zmene. Pôvodná sada mala 2866/2909 úspešných prípadov.
- Test s **podvrhnutým `fetch`** (mock Anthropic API) pre každú rodinu: (a) prirodzená odpoveď sa vráti bez zmeny, (b) odpoveď s vymyslenou cenou „9 999 €“ alebo cudzím odkazom sa nahradí návrhom, (c) chyba poskytovateľa → návrh. Toto teraz funguje vo všetkých 7 handleroch; drž to tak.

## 4. Priorita A — produkcia a živé overenie

1. Over na Verceli, že posledný commit vetvy `claude/coffee-deep3-20261016` (`12d8209` alebo novší) má úspešný Preview build. **Do produkcie ho nepromuj sám** — pošli majiteľovi odkaz na nasadenie, promuje ho on.
2. Po promovaní over živé: `https://praziarnicka.mojchatbot.sk/verzia.txt` musí ukazovať novú verziu.
3. Živý test chatu (POST na `https://praziarnicka.mojchatbot.sk/api/chat`, telo `{"demoId":"praziarnicka","messages":[{"role":"user","content":"kde sídli vaša firma"}]}`): odpoveď **nesmie** mať `"fallback": true`. Ak má vždy `fallback: true`, pozri Vercel runtime logy hľadaj `ai chat error <status>`:
   - 401 → kľúč chýba v prostredí Production (povedz majiteľovi, kľúč nevypisuj).
   - 400 → model odmieta niektorý parameter v `MODEL_OPTIONS` (`api/ai-chat.js`). Oprav podľa aktuálnej dokumentácie Anthropic API (docs.anthropic.com) pre daný model, alebo dočasne odporuč `CHAT_MODEL=claude-haiku-5-5`. Oprav vo všetkých 6 kópiách.
   - `ai chat answer not grounded` príliš často (> 20 % odpovedí) → model píše ceny v inom tvare (napr. „12,90 eur“ vs. „12.9 €“). Uprav porovnanie v `grounded()` tak, aby tolerovalo formát, ale **nikdy** nepustilo cenu, ktorá v údajoch nie je.
4. Rovnaký živý test sprav pre kozmetiku (`/api/cosmetics-chat`, napr. `kvitok`, `soaphoria`, `natureal`) a každú ďalšiu rodinu, ktorá je nasadená. Zisti, kde sú živé vlasy, rastliny, víno a čaj (Vercel projekty majiteľa); ak nikde, napíš to do „Otvorené otázky“.
5. Skontroluj čas odpovede: medián < 5 s, max < 10 s. Ak je pomalšie, zníž počet produktov v `pickProducts` (36 → 20) alebo `max_tokens`.

## 5. Priorita B — kontrola kvality odpovedí (každá ukážka)

Pre **každú** ukážku (22 káv, kozmetika `kozmetika-nove`, vlasy, rastliny, 43 vín, 2 čaje) prejdi tieto otázky v rozhovore (aj ako nadväzujúce otázky) a skontroluj odpoveď s mockom aj (ak je k dispozícii kľúč na Preview) naživo:

- pozdrav, „ďakujem“, otázka mimo témy (počasie) → krátka slušná odpoveď a ponuka pomoci;
- „kde sídlite / adresa / osobný odber“, „koľko stojí doprava“, „kedy to príde“, „dá sa platiť kartou / dobierkou“, „doprava zadarmo od koľko“ → iba fakty z `shipping` katalógu;
- „odporuč mi niečo do X €“, „lacnejšie“, „drahšie“, „iné“, „nie tento“, zmena rozpočtu, „porovnaj A a B“, „aký je rozdiel“;
- presný názov produktu (aj s veľkosťou balenia, napr. „7 cm květináč“), vypredaný produkt, produkt, ktorý obchod nepredáva, cudzia značka;
- rodinné otázky: káva (mletie, príprava, bez kofeínu, darček, kapsule), kozmetika (typ pleti, SPF, tehotenstvo → odkaz na lekára, vegánske, pre mužov, vzorky, poradie krokov), vlasy (mastné, suché, lupiny, bez sulfátov, farbené), rastliny (polotieň, mačka/pes, začiatočník, žltnúce listy → nie produkt, kaktusy, sukulenty, kvetináč/substrát), víno (k jedlu, darček, suché/sladké, nealko, ročník), čaj (sypaný/vrecúška, bez kofeínu, príprava);
- čeština pri .cz e-shopoch (odpoveď musí byť česky, meny Kč).

Chyby: každá cena a odkaz v odpovedi musí byť v katalógu; žiadne „undefined/NaN/null“; žiadne markdown hviezdičky; max. 3 produkty; odkazy celé. Oprav v `chat-brain.js`/`chat-adapters.js` (hlavná kópia) alebo v systémovom prompte `ai-chat.js`, potom skopíruj kópie.

Známe zlyhania deterministických pravidiel (oprav, ak sa dá bez rizika):
`plants named_type_explicit 12/22`, `plants context_budget_initial 21/22`, `skin compare 47/52`, `skin context_constraint_initial 47/52`, `skin fragrance 49/52`, `skin fragrance_correct_currency 46/52`, `skin budget_change 51/52`, `skin context_budget 51/52`, `wine budget_change 39/43`, `wine context_budget_initial 39/43`, `wine compare 42/43`, `wine product_detail 42/43`, `wine use 42/43`.

## 6. Priorita C — údaje v katalógoch

1. Pre každú ukážku náhodne over aspoň 10 produktov priamo na e-shope (cena, dostupnosť, balenie, odkaz funguje — HTTP 200 a nie je to iný produkt). Opravy zapíš s dátumom overenia.
2. Over dopravu, platby, osobný odber a doručenie (`shipping` v katalógu) proti stránke obchodu „Doprava a platba“ / VOP. Ak sa líšia, oprav a aktualizuj `checkedAt`.
3. Produkty, ktoré nie sú hlavný tovar (klinec, lišta, suchý zip, darčekový poukaz, vyhrievacie teleso, hnojivo), nesmú vychádzať ako hlavné odporúčanie pre rastliny/kozmetiku — skontroluj regex `main` v adaptéri rastlín a podobné pravidlá v ostatných.
4. Kategórie: produkt musí byť v správnej kategórii (krém ≠ šampón, kaktus ≠ sukulent, ružové ≠ červené víno). Opravuj iba podľa údajov z e-shopu.

## 7. Priorita D — poradca (výber) a vzhľad

1. Prejdi **všetky cesty** poradcu v každej ukážke (do hĺbky, tlačidlom Späť): žiadna slepá ulička (každá kombinácia vedie k aspoň jednému produktu alebo k jasnej správe s ďalším krokom), žiadne „undefined“, cena a odkaz vo výsledku, hlavné odporúčanie + dôvody + alternatíva + doplnok, kde to dáva zmysel.
2. Vzhľad pri 320×568, 390×650, 560×600 a desktope 1280×800: v otázkach a výbere žiadne scrollovanie ani orezané tlačidlá, žiadny horizontálny scroll stránky, logo a farby značky správne, tmavý režim čitateľný.
3. Chat widget: správy sa nestrácajú pri rýchlom písaní, „Overujem odpoveď…“ sa vždy nahradí odpoveďou, odkazy sú klikateľné, na mobile klávesnica neprekrýva vstup.
4. Používaj Playwright s Chromiom; v testoch poradcu blokuj `/api/**`, aby test nezávisel od modelu.

## 8. Ako odovzdať prácu

- Na konci každého väčšieho kroku: commit + push na vetvu repozitára (bod 1).
- Do tohto súboru dopíš sekciu „Hotovo (dátum)“: čo si skontroloval, čo opravil (repo, commit), výsledky testov (počty), a odkazy na Preview nasadenia na kontrolu.
- Do sekcie „Otvorené otázky“ zapíš všetko, čo musí rozhodnúť majiteľ (promovanie do produkcie, chýbajúce údaje na e-shope, kde sú nasadené ďalšie rodiny).

## Hotovo (18. 10. 2026, Claude)

- Každá správa vo všetkých 7 chat handleroch ide cez Claude s overenými údajmi; neoverená cena/odkaz → overený návrh.
- Opravy pravidiel: „kde sídli firma“ → adresa/odber; najlacnejšia alternatíva pod rozpočtom je hlavný tovar; „Porovnaj kaktusy“ porovná kategóriu; veľkosť kvetináča v názve produktu = ten produkt; choroby rastlín → odpoveď poradcu.
- Commity: kava.chatbot.backend `12d8209`, skincare `a125fcd`, vino `10c700f`, caj `ad10616`.

## Otvorené otázky

- Promovanie `12d8209` do produkcie na Verceli robí majiteľ.
- Kde sú živé vlasy, rastliny, víno a čaj — zistiť.
