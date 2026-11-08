# Séria 4 – odovzdanie prvých 6 firiem (7. 11. 2026)

Vetva `claude/n447-s4-20261107`. Preview vznikol automaticky z pushu vetvy, bez aliasov a bez zmeny produkcie. Stav: lokálne overenie + Preview, nie produkcia:
`kava-chatbot-backend-7jkcs6dyk-danielvendzur-codes-projects.vercel.app` (dpl_2ond9v14uZYNncVVWbwwjidJ8V6A, SHA 48e65ce, stav READY).
Ukážka firmy na Preview: `/cosmetics.html?demo=<slug>`. Ostrú adresu `<slug>.mojchatbot.sk` nastavuje Codex až po kontrole.

Všetkých 6 je v schválenom rozložení Andreine/skincare:
- kompaktný výsledok kávy s cenou a CTA;
- štyri rovnaké 40px chipy;
- biela bublina launchera;
- popisné fotky volieb bez opakovania v jednej otázke;
- CTA do rovnakej karty na presný produkt;
- chat s animáciou písania, kartami produktov a logom.

Pribudlo podľa požiadavky zo 7. 11. („úprava výsledku, porovnanie produktov, tabuľka s percentami“):

- **Káva – tabuľka chuti priamo vo výsledku.** Sekcia „Chuťový profil podle pražírny“ je viditeľne vo výsledku, nie v rozbaľovacom bloku.
  - Ak pražiareň uvádza čísla (Mohaji kyselost/hořkost/sladkost N/5), zobrazujú sa ako pruhy.
  - Ak ich uvádza slovom (Ambere, ZRNA, Johnny Coffee), zobrazí sa slovo. Čísla ani percentá sa nevymýšľajú.
- **Porovnanie dvoch produktov aj pri kozmetike (s4).** Chip „Porovnat/Porovnať dva produkty“ ponúkne 6 produktov z jednej oblasti. Zákazník ťukne na dva a v chate ich vidí vedľa seba: cena, balenie, druh, „podľa e-shopu“, odkaz.
- **Kozmetika – doplnok k výsledku podľa firmy.**
  - Šampón ponúka zodpovedajúci kondicionér.
  - Čistenie ponúka tonikum, tonikum ponúka sérum alebo olej.
  - Rozpočet zahŕňa celú zostavu.

## Kontroly (lokálne, 0 platených volaní)

Pre každú firmu prebehli tieto kontroly:
- všetky cesty pri 320/390/1280;
- beh bez fotiek;
- chipy a avatar;
- chat offline aj s mockom;
- názvy pre čítačky;
- otázky s rovnakým významom.

Výsledky sú v `n447/s4/dokazy/<slug>-testy.txt`. Screenshoty 3 ciest × 320/390/1280 sú v `n447/s4/dokazy/odovzdanie/`.

| Firma | Cesty | Dosiahnuteľné produkty | Nálezy |
|---|---|---|---|
| Mohaji | 20 | 16/16 | 0 |
| Ambere | 58 | 20/20 | 0 |
| ZRNA | 18 | 10/10 | 0 |
| Johnny Coffee | 20 | 20/20 | 0 |
| MýdLenka | 25 výsledkov | 25/25 | 0 |
| MYDLOVE | 25 výsledkov | 25/25 | 0 |

Kontrola starších ukážok po úpravách jadra: mydlozfarmy 25/25 a teamountain 14/14, obe bez nálezov. Zmeny v jadre sú zapínané iba pre s4 (`categoryLocked`, `kindLocked`, `upsellFocus`, formát € v s4).

## Firmy

### 1. Mohaji – mohaji.cz (káva, CZ)
- **Prevádzkovateľ:** MOHAJI s.r.o., IČO 03924424.
- **Kontakt:** kava@mohaji.cz (zdroj /kontakty/).
- **Zdroje (7. 11. 2026):** kategórie Pražení na espresso / na filtr / Bez kofeinu / Limitované edice. Z karty produktu sa berú parametre Kyselost, Hořkost, Sladkost (●○ → N/5), Stupeň pražení, Země původu a Charakteristika.
- **Produkty:** 16 zrnkových káv. Ceny a sklad sú pre každé balenie 250 g / 500 g / 1 kg (`n447/c2/data/mohaji.js`).
- **Doplnok:** filtre Hario V60-02 za 79 Kč.
- **Doprava zdarma:** od 1 200 Kč (/doprava-a-platba/).
- **Cesty (screenshoty cesta1–3):**
  1. kávovar → s kofeínom → čokoládová → espresso;
  2. filter → V60 → svieža;
  3. kávovar → bez kofeínu.
- **Neoverené:** chuťové tóny sú prepísané do 1. pádu z popisu (`NOTES` v build skripte). Káva Nicaragua Santa Maria má v parametri „Země původu“ Colombia, ale v názve a popise Nicaragua. Pôvod sa neodvodzuje a pri tejto káve sa nezobrazuje (opravené 8. 11.).

### 2. Ambere – ambere.cz (káva, CZ)
- **Prevádzkovateľ:** Ambere s.r.o., IČO 08256519.
- **Kontakt:** obchod.ambere@seznam.cz (zdroj /doprava-a-platba/).
- **Zdroje:** kategórie KÁVA AMBERE, Espresso směsi, Káva na filtr, Mikroloty. Parametre Kyselost / Tělo / Hořkost sú slovné; ďalej Profil pražení, Chuťový profil, Způsob přípravy.
- **Produkty:** 20 káv, iba zrnkové varianty 150 g – 1 kg, ktoré sú skladom. Zvýhodnené balíčky sa nepreberajú.
- **Doprava zdarma:** od 800 Kč.
- **Cesty:**
  1. automat → bez kyseliny → do 150 Kč;
  2. pákový kávovar → bez kyseliny;
  3. automat → čokoláda s ovocím → Ázia.
- **Neoverené:**
  - Rodinná směs nemá parameter Chuťový profil. Tóny (čokoláda, oriešok, nugát, karamel) sú z krátkeho popisu.
  - Ako kontakt e-shopu sa uvádza adresa na seznam.cz, nie na vlastnej doméne.

### 3. MýdLenka – mydlenka.cz (kozmetika, CZ)
- **Prevádzkovateľka:** Lenka Sojková, IČO 72218533.
- **Kontakt:** info@mydlenka.cz (obchodné podmienky).
- **Zdroje:**
  - kategórie Péče o normální / citlivou / suchou / problematickou pleť, Vlasy, Deodoranty, Péče o tělo;
  - typ pleti presne podľa kategórií e-shopu; produkt zaradený do všetkých štyroch kategórií sa zobrazuje ako „Normální, citlivá, suchá i problematická“, nie „pro všechny typy pleti“ (opravené 8. 11.; produktový zdroj „všetky typy“ výslovne neuvádza);
  - typ vlasov z názvu šampónu.
- **Produkty:** 25 (séra, sady, odličovač, šampóny, kondicionér, deodoranty, telo). Mini varianty sa nepreberajú.
- **Doprava zdarma:** od 1 800 Kč.
- **Cesty:**
  1. vlasy → jemné;
  2. pleť → sada → citlivá;
  3. telo → telový balzam.
- **Neoverené:** popisy používajú prvú vetu e-shopu, filtrovanú od zdravotných tvrdení. Marketingové vety („rozjasní, vyživí“) sú citované z e-shopu, nie vymyslené.

### 4. ZRNA (Pražírna Kyjov) – prazirnazrna.cz (káva, CZ)
- **Prevádzkovateľ:** Vysněno s.r.o., IČO 09270850; prevádzka Pražírna Kyjov s.r.o.
- **Kontakt:** info@prazirnazrna.cz (/kontakty/).
- **Zdroje:** kategória Zrnková káva, parametre Pražení, Acidita (slovom), Chuťový profil, Země původu, Zpracování, Odrůda, Stupeň pražení. Gramáž balení sa berie z kódu varianty.
- **Produkty:** 10 káv, 250/500/1000 g (Luisa iba 150 g).
- **Doplnok:** filtre V60-02 za 140 Kč.
- **Doprava zdarma:** od 2 000 Kč (/doprava-a-platby/).
- **Cesty:**
  1. kávovar → nízka acidita;
  2. filter → V60 → vyššia acidita;
  3. kávovar → stredná acidita.
- **Neoverené:** El Balar má pre espresso aj filter rovnakú cenu; preberá sa jedna cena za balenie.

### 5. Johnny Coffee – johnnycoffee.cz (káva, CZ)
- **Prevádzkovateľ:** CONSO MED s.r.o., IČO 04543220, Moravský Krumlov.
- **Kontakt:** info@johnnycoffee.cz (/kontakt/ a parametre produktov).
- **Zdroje:** kategórie Středně / Tmavě pražená, Bez kofeinu, Espresso směsi, Espresso 100 % arabica. Parametre Doporučená příprava, Kyselost, Hořkost (slovom), Chuťový profil, Stupeň pražení, Země, Zpracování, Obsah kofeinu.
- **Produkty:** 20 káv, 200 g – 1 kg.
- **Vyradené:**
  - sety;
  - dvojbalenia 200 + 200 g;
  - 5 káv bez parametrov chuti (Peru, Podpultovka, Santos, V2.0, Keňa);
  - nedostupný Decaf Swiss Water.
- **Doprava zdarma:** od 990 Kč (/doprava-zdarma-na-kavu/).
- **Cesty:**
  1. kávovar → bez kyseliny → zmes;
  2. filter → jemná svežosť;
  3. kávovar → bez kofeínu.
- **Neoverené:** firma predáva aj kávovary (Lelit, Gaggia), tie v ukážke nie sú. Hlavička používa iba textovú časť loga, lebo kruhový portrét sa na tmavom pozadí nečíta.

### 6. MYDLOVE – mydlove.com (kozmetika, SK)
- **Prevádzkovateľ:** Thermae s.r.o., IČO 50 828 908, Trenčianske Teplice.
- **Kontakt:** info@mydlove.com (/kontakt/).
- **Zdroje:** verejné WooCommerce Store API e-shopu (názov, cena, sklad, kategórie, atribúty Typ vlasov / Typ pleti / Vôňa).
- **Produkty:** 25 – tuhé šampóny (5), kondicionéry (2), čistiace gély (3), toniká (2), sérum a olej, 2 masky, telové maslá (5), náplne dezodorantu (4).
- **Doprava zdarma:** od 45 € v SR (hlavička webu).
- **Cesty:**
  1. vlasy → šampón → jemné;
  2. pleť → tonikum → Kombucha (doplnok olej ESPLANADE);
  3. telo → bambucké maslo.
- **Neoverené:**
  - Objem séra PEAT a oleja ESPLANADE e-shop pri cene neuvádza, preto ho ukážka nezobrazuje.
  - Názov šampónu „… – rast vlasov“ je názov e-shopu. Ukážka ho v otázke neopakuje, voľba znie „S kofeínom a ílom“.
  - Náplne dezodorantu potrebujú aplikátor (8 €), čo je uvedené v popise.
  - Firma má aj kamenné predajne.

## HOLD v tejto dávke
- **Abuamo:** iba packshoty sáčkov. Čaj by si vyžadoval ďalšie schválené fotky. Podrobnosti sú v `kandidati.md`.

## Ďalší postup
Pokračujem ďalšími kandidátmi z `kandidati.md` do 20 firiem. Ďalšie na rade:
- Mystická mýdlárna, Levandulový dům, BARZZUZ, 25coffee, co-bean, Sypané čaje;
- čajové firmy až po vyriešení fotiek.

## Dávka 2 (8. 11. 2026)

### 7. RaE – raekosmetika.cz (kozmetika, CZ)
- **Prevádzkovateľ:** KULISH RADOMÍR s.r.o., IČO 28569725, Návsí.
- **Kontakt:** info@raekosmetika.cz (/kontakt). Pätička e-shopu uvádza „by PCsupport.cz s.r.o.“ (tvorca webu).
- **Zdroje (8. 11.):** WooCommerce Store API e-shopu (názov, cena, sklad, kategórie, varianty 30/50 a 100/250).
- **Produkty:** 18 – tuhé deodoranty so sódou a bez sódy (podľa kategórie e-shopu), bambucké telové maslá, hydratačné mlieka. Vôňa je vždy z názvu produktu.
- **Doprava zdarma:** od 2 000 Kč (hlavička webu).
- **Cesty:**
  1. deodorant → tuhý → levanduľa;
  2. deodorant → bez sódy → vanilka a orchidea;
  3. telo → bambucké maslo → konopný olej (doplnok: mlieko bylinky).
- **Vyradené:**
  - parfémy s vlastnými názvami vôní;
  - testery, sady, náplne;
  - vône bez pravdivej fotky (indický lotos, cashmere, papaya, divoká višňa);
  - balzamy na pery – e-shop má každý dvakrát s rôznou cenou 125 a 160 Kč, cena nie je jednoznačná.
- **Neoverené:** jednotka variant masiel „obsah 30/50“ nie je v e-shope uvedená (ml/g), preto sa nezobrazuje. V hlavičke je iba ďatelina z loga, lebo celé logo je na tmavom pozadí nečitateľné.

### Opravy prvej šestice (8. 11.)
- **Mohaji:** sporný pôvod Nicaragua/Colombia vynechaný.
  - Chuťová voľba je iba podľa škály kyselosti pražiarne (0–2 / 3 / 4–5 z 5).
  - Narozeninová limitka s kyselosťou 3/5 už nie je označená ako „vyššia kyselosť“.
- **Ambere, ZRNA, Johnny Coffee:** popisy chuťových volieb opisujú iba kyselosť/aciditu, ako ju uvádza pražiareň. Žiadne zovšeobecnené tóny.
- **MýdLenka:** produkty v štyroch kategóriách pleti sú uvedené ako „Normální, citlivá, suchá i problematická“, nie „pro všechny typy pleti“; `allSkinTypes` = false.
- **Cena za 100 g (nové kópie s4):** `Math.round(cena/gramy*10000)/100`, pri EUR bez zaokrúhlenia na celé eurá. Staršie ukážky bez zmeny.
- **Chat kozmetiky s4:** po „Zeptat se poradce“ jedna krátka nadväzujúca veta k vybranému produktu.

## Dávka 3 (8. 11. 2026)

### 8. Padmé Roastery – padmeroastery.sk (káva, SK)
- **Prevádzkovateľ:** Padmé Roastery, s.r.o., IČO 55 346 740, Rožňava (vlastná kaviareň Padmé Caffé v Betliari).
- **Kontakt:** padme.roastery@gmail.com (/kontakt/).
- **Zdroje (8. 11.):**
  - kategórie Káva na espresso / Káva na filter / Bezkofeínová (príprava = kategória e-shopu);
  - karta produktu: Praženie, Chuťový profil, Oblasť/Krajina, spracovanie, Odporúčaná príprava;
  - ceny a sklad variant z dát varianty na karte (250 g, 1000 g; Lemongrass 200 g).
- **Produkty:** 12 zrnkových káv. Sety (duo, trio, four pack, box, tasting) sa nepreberajú.
- **Chuťová voľba** = štýl praženia podľa pražiarne:
  - Old School Espresso = „Klasické espresso“;
  - Espresso / New Wave roast = „Moderné espresso“;
  - Filter / Light = „Svetlé praženie“.
  - Kyselosť ani percentá sa nevymýšľajú. Číselné škály (Acidita 1/5, Telo 4/5) má iba India a zobrazujú sa iba pri nej.
- **Doprava zdarma:** nad 60 € (/doprava-a-platba/).
- **Cena za 100 g** na centy: Betliarsky poklad 1 kg 3,30 €/100 g namiesto 4,40 €.
- **Cesty:**
  1. kávovar → s kofeínom → klasické espresso;
  2. filter → s kofeínom;
  3. kávovar → bez kofeínu.
- **Testy:** všetky cesty 320/390/1280, bez fotiek, chipy, avatar, chat offline/mock, rovnaký význam – nálezy 0.
- **Neoverené:** R2Decaf má praženie „Omni“ (svetlé aj moderné espresso); zaradené do „Moderné espresso“ a príprava je espresso aj filter podľa oboch kategórií e-shopu.
