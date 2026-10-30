# Kozmetika2 – oprava podľa nezávislého auditu (stav 2026-10-30)

Vetva `claude/n447-kozmetika2-20261029`. Audit Codexu sa týkal SHA `8161db9`; táto oprava nadväzuje na `6bffa0c`. SHA a Preview sú uvedené v odovzdávacej správe.
Ponuka 447 € jednorazovo + 10 €/mes., bez trialu. Produkcia, aliasy, zákaznícke subdomény, e-maily, modely ani odoslané ukážky sa nemenili.
Andreine 447 ostáva izolovaná ako `andreine447` a doménu `andreine.mojchatbot.sk` nemá.
Register sa nenasadzuje (`.vercelignore`).

| Firma | Stav | Stránka | Produkty (výber / chat) | Zloženie v chate | Strom výberu | Prehliadač (DFS všetkých ciest) |
|---|---|---|---|---|---|---|
| MusK | READY_FOR_REVIEW | /musk.html | 93 / 84 | 74 produktov (INCI zo stránky) | 30 obrazoviek otázok, 84 ciest | 4 rozmery |
| Bohemikus | READY_FOR_REVIEW | /bohemikus.html | 21 / 21 | 10 mydiel („Složení“ zo stránky) | 8 / 21 | 4 rozmery |
| AKH | READY_FOR_REVIEW | /akh.html | 100 / 100 | – | 40 / 98 | 390×650 |
| Andreine 447 | READY_FOR_REVIEW | /andreine447.html | 53 / 47 | – | 33 / 61 | 390×650 |
| Goodie | READY_FOR_REVIEW | /goodie.html | 106 / 97 | – | 37 / 97 | 390×650 |
| libebit | READY_FOR_REVIEW | /libebit.html | 63 / 52 | – | 33 / 65 | 390×650 |
| MALINNA° | READY_FOR_REVIEW | /malinna.html | 31 / 31 | – | 31 / 54 | 390×650 |
| MARK | READY_FOR_REVIEW | /mark.html | 90 / 84 | – | 37 / 86 | 390×650 |
| Moravité | READY_FOR_REVIEW | /moravite.html | 28 / 22 | – | 11 / 22 | 390×650 |
| NATURINKA | READY_FOR_REVIEW | /naturinka.html | 95 / 94 | – | 31 / 95 | 390×650 |

## Opravené nálezy auditu
1. **Zápor v chate** (`n447/kozmetika2/chat-guard-k2.js`)
   - Rozpoznané spojenia (SK aj CZ):
     - „bez …“, „nechcem/nechci …“, „nemám rád/rada …“;
     - „alergia na …“, „vadí mi …“, „okrem/kromě …“, „žiadny/žádný …“.
   - Zložky za záporom sú vylúčené, nie požadované. „bez vône/bez vůně“ ostáva požiadavka.
   - Produkt sa s vylúčenou zložkou nikdy neodporučí. Kontroluje sa názov, popis, overené zaradenie, zloženie (INCI) a pri sadách zloženie každej položky.
   - Pri produkte bez uvedeného zloženia chat neprítomnosť nesľubuje: uvedie výhradu, odporučí overiť zloženie a spýta sa, či ide o alergiu.
   - Príklad: MusK „mydlo bez kokosového oleja“. Všetky mydlá s uvedeným zložením obsahujú Cocos Nucifera Oil, preto chat neodporučí nič a opýta sa.
2. **Kontext z histórie**
   - Typ, zložka, vylúčená zložka a rozpočet z predchádzajúcich správ zákazníka platia ďalej.
   - Prepíše ich iba nová výslovná zmena, napríklad „kľudne aj do 6 €“ alebo nový typ produktu.
   - História sa nepreberá, keď posledná správa nič neupresňuje, a pri otázke na dopravu („doprava zdarma do 50 €“).
   - Rozpočet sa rozpozná aj vo vete „mám rozpočet 5 eur“ alebo „rozpočet mám 130 Kč“.
   - Následná AI dostane iba vyhovujúci podkatalóg a výslovný zoznam platných požiadaviek a vylúčených zložiek.
3. **Bez názvového katalógu**
   - Posledná otázka (focus) vo všetkých 10 ukážkach ukazuje pravdivú vlastnosť z popisu alebo zloženia, nie marketingový názov. Príklady:
     - MusK: „So sušenými levanduľovými kvetmi“, „S morskou soľou a levanduľou“, „S lupeňmi ruže“.
     - Bohemikus: „Levandule s olivovým olejem“, „Solné bez parfemace“.
   - Znenie otázky závisí od oblasti, napr. „Čo vám na mydle vyhovuje?“ alebo „Co vám na mýdle vyhovuje?“.
   - Generické vlastnosti (kozie, olivové, ingrediencie) ostávajú.
   - Opravená aj nepravdivá voľba Goodie: „Hroznové víno“ → „Grapefruit“, podľa popisu šumivky.
   - Zdroj textov: `tools/k2/gen/focus_titles.py` a `tools/k2/gen/musk_brand.py`.
4. **MusK – potreba vlasov a výsledok**
   - Otázka „Aké máte vlasy?“ už neobsahuje vôňu.
   - Vôňa Vianoc a Kondicionér na denné použitie, ktoré typ vlasov neuvádzajú, sú pod „Bez konkrétneho problému“. Predtým bola Vôňa Vianoc ako „Vianočná vôňa“ a kondicionér ako „Normálne“.
   - Sada pri výsledku má nadpis „Hotová darčeková sada“ (pri darčekových sadách), „Celá rutina v hotovej sade“ iba keď sada obsahuje rôzne druhy produktov, inak „Hotová sada“.
   - Vysvetlenie výsledku namiesto „MusK ho zaraďuje presne sem“ uvádza konkrétnu zhodu (napr. „Levanduľa a kvety · So sušenými levanduľovými kvetmi“) a pri doloženom zaradení aj doklad z e-shopu.
5. **Oficiálne logo MusK**
   - Pochádza z `musk.sk/brand/musk-logo-black.svg` (dodal Codex, bez obchádzania ochrany).
   - Do SVG sú doplnené iba atribúty `width/height`, aby sa logo na úvodnej stránke nezobrazovalo s nulovou veľkosťou. Krivky sú nezmenené.

## Testy (bez siete, bez Sonnet/plateného API)
- `node tools/k2/test_chat_k2.mjs`: 43/43. Obsahuje pôvodných 28 prípadov a nové prípady:
  - zápor (SK/CZ, alergia, „nemám rada“, kokos);
  - história (rozpočet, typ, zápor, výslovná zmena limitu, doprava);
  - pri každom menovanom produkte: požadovaná zložka, žiadna vylúčená zložka, správny typ, limit a výhrada pri chýbajúcom zložení.
- `node tools/k2/audit_cases_k2.mjs`: 7/7 prípadov z `claude-k2-independent-chat-2026-10-30.json` v presnom znení.
- `node tools/k2/test_tree_k2.mjs`: PASS. Pokrýva všetky otázky a cesty 10 ukážok, focus bez marketingových názvov, MusK hairNeed bez vône a vysvetlenie bez tautológie.
- `node tools/k2/browser_dfs_k2.mjs BASE SLUG ROZMERY`: všetky cesty cez tlačidlá rozhrania. Kontroluje pretečenie, orezanie, rozbité obrázky, cudzie odkazy, odkaz v rovnakej karte a nadpis sady.
- 4 rýchle voľby chatu pri každej z 10 ukážok menujú produkt (mock, 0 platených volaní).

## Konkrétne limity
- **Zloženie** je v chate iba pri MusK (74 z 84 produktov) a Bohemikus (10 mydiel).
  - Bez zloženia sú Královna jihu, sady a šampóny Bohemikus a ostatných 8 firiem.
  - Pri týchto produktoch chat pri zápore nič nesľubuje: vylúči produkty, ktoré zložku spomínajú, a pri ostatných uvedie výhradu a otázku.
  - Zloženie Goodie, libebit a NATURINKA je v pôvodne stiahnutých stránkach, ale do katalógu zatiaľ nie je prevzaté.
- **Rozpočet z histórie** platí aj po zmene typu produktu („mydlo do 5 €“ → „a šampón?“ hľadá šampón do 5 €), kým ho zákazník výslovne nezmení. Výsledná odpoveď limit vždy uvedie.
- Hydrolát MusK s URL `mydelnicka-drevena-2` ostáva tak, ako ho Codex overil: vedie na HYDROLÁT-LEVANDUĽA 100 ml za 8 €.
- Cena platí pre uvedené balenie. Iné veľkosti sa neodvodzujú.
