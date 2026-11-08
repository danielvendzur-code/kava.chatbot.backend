# Séria 4 – register kandidátov (stav 7. 11. 2026)

Stavy: **kandidát** → **zdroje overené** → **implementované** → **lokálna kontrola** → **Preview overené**; **HOLD** = vyradené s dôvodom.
Duplicity preverené proti `existing-slugs.txt` (201 záznamov), všetkým vetvám repozitára (doména aj IČO) a medzi kandidátmi navzájom (rovnaký prevádzkovateľ = jedna firma).
Cena v ponuke: 447 € jednorazovo + 10 €/mesiac, bez skúšobného obdobia.

## Hotové (prvých 5)

| Firma | Web | Prevádzkovateľ / IČO | Kontakt (zdroj) | Produkty | Stav |
|---|---|---|---|---|---|
| Mohaji | mohaji.cz | MOHAJI s.r.o., 03924424 | kava@mohaji.cz (/kontakty/) | 16 zrnkových káv | lokálna kontrola (nálezy 0) |
| Ambere | ambere.cz | Ambere s.r.o., 08256519 | obchod.ambere@seznam.cz (/doprava-a-platba/) | 20 zrnkových káv | lokálna kontrola |
| MýdLenka | mydlenka.cz | Lenka Sojková, 72218533 | info@mydlenka.cz (obchodné podmienky) | 25 produktov (pleť, vlasy, deo, telo) | lokálna kontrola |
| ZRNA (Pražírna Kyjov) | prazirnazrna.cz | Vysněno s.r.o., 09270850 (prevádzka Pražírna Kyjov s.r.o.) | info@prazirnazrna.cz (/kontakty/) | 10 zrnkových káv | lokálna kontrola |
| Johnny Coffee | johnnycoffee.cz | CONSO MED s.r.o., 04543220 | info@johnnycoffee.cz (/kontakt/, parametre produktov) | 20 zrnkových káv | lokálna kontrola |
| VAANOK | vaanok.sk | VAAN, s. r. o., 35920581 (obrat 2025: 55 182 €) | info@vaanok.sk (/kontakt/) | 20 produktov (séra, balzamy, čistenie, hydroláty, masky, telo) | Preview overené (43281d7) |

Preview: po pushnutí vetvy `claude/n447-s4-20261107` (bez aliasov, nasadenie rieši Codex).

## Overené zdroje, pripravené na ďalšiu dávku

| Firma | Segment | Web | Prevádzkovateľ / IČO | Kontakt | Poznámka |
|---|---|---|---|---|---|
| Lázeňská káva | káva | eshop.lazenskakava.cz | Lazenskakava.cz s.r.o., 05825580 | chutna@lazenskakava.cz | nie Shoptet – treba vlastný zber |
| Longberry | káva | longberry.cz | LONGBERRY s.r.o., 08208361 | info@longberry.cz | WooCommerce |
| BARZZUZ (kafe.sk) | káva | kafe.sk | BARZZUZ s.r.o., 36647951 | info@kafe.sk | |
| 25coffee | káva | 25coffee.sk | (overiť v OP) | info@25coffee.sk | WooCommerce |
| Fabbrica | káva | fabbricacafe.sk | (overiť v OP) | info@fabbricacafe.sk | |
| co-bean | káva | co-bean.cz | co-bean, s.r.o., 04720776 | info@co-bean.cz | Shopify; overiť, či nejde o veľkoobchod |
| Valašská pražírna | káva | valasska-prazirna.cz | Valašská pražírna s.r.o., 09396527 | info@valasskaprazirna.cz | slabé údaje o chuti |
| Mystická mýdlárna | kozmetika | prirodnimydla.cz | Mystická mýdlárna s.r.o., 26834774 | info@prirodnimydla.cz | |
| Levandulový dům | kozmetika | levandulovydum.cz | IČO 74995448 | info@lavender.cz | |
| Mija | kozmetika | mijasoap.cz | Michaela Balášová, 08204471 | vasdotaz@mijasoap.cz | |
| RaE | kozmetika | raekosmetika.cz | PCsupport.cz s.r.o. | info@raekosmetika.com | |
| Nutt | kozmetika | nutt.cz | (overiť) | radost@nutt.cz | |
| Mydlove | kozmetika | mydlove.eu | Thermae s.r.o. | info@mydlove.com | |
| Koukol | kozmetika | mydlarnakoukol.cz | Koukol v obilí, z.s., 22740988 | mydlarnakoukol@seznam.cz | spolok – overiť vhodnosť |
| tee.sk | čaj | tee.sk | GREEN GOLD s.r.o., 47373971 | info@tee.sk | |
| e-tea | čaj | e-tea.eu | Čajovňa dobrých ľudí, 36526568 | (overiť) | |
| Sypané čaje | čaj | sypanecaje.sk | Peter Jurkovič, 43112269 | info@sypanecaje.sk | |
| Čarovňa | čaj | obchod.carovna.sk | IČO 40368696 | obchod@carovna.sk | |
| Dobrá čajovna Olomouc | čaj | dobracajovnaol.cz | Adam Křiva, 03508510 | info@dobracajovnaol.cz | |

## HOLD

| Firma | Dôvod |
|---|---|
| Abuamo (abuamo.com, Axneo s.r.o., 04564448) | e-shop má iba packshoty sáčkov (rovnaký kraftový sáčok), žiadne kvalitné fotky na voľby; schválené čajové scény sú len 3 → nedá sa splniť „bez opakovania v jednej otázke“. Možný návrat, ak sa schvália ďalšie čajové fotografie. |
| LOBEY | vlastná Diagnostika pleti (porovnateľný poradca) |
| Čajový dýchánek, Zelený Drak | vlastný „Čajový průvodce“ |
| Čajový krámek | Albi s.r.o. – veľká firma |
| Happy Hair | sieť salónov, multi-brand |
| Rusty Nails | nemá vlastný e-shop (iba predajcovia) |
| DI roastery | duplicita (už existujúca ukážka diamonds) |
| ecajovna.sk + cajovydom.sk | jeden prevádzkovateľ (Tea Trade Slovakia) – ponechať najviac jednu |
| Industra, Natural Factory, Alma, Ethic Routine | web nedostupný pri kontrole |
| Karel Hadek | 403 pri kontrole |
| Ladatha | web nefunkčný |
| Mamacoffee | HOLD_DUPLICATE (pôvodná séria) |
| Pražírna Brno (prazirnabrno.cz) | duplicita – už spracovaná ako ukážka „black“ (vetvy n447-black, coffee-deep3) |
| Pražírna Mikulov | sporné podklady: parameter „Země původu“ uvádza Ethiopia pri Venezuele, Brazílii aj Kostarike; príprava neuvedená |
| Crazy beans | príprava (espresso/filter) pri väčšine káv neuvedená |
| Zicoffee | bez chuťových parametrov, široký veľkoobchodný sortiment |
| Mystická mýdlárna | prevažne mydlá, darčekové koše a veľkoobchodné 800 g bloky – nie výber starostlivosti |
| Ave NATURA | web blokuje automatický prístup (466) – podklady nedostupné |
| King's Coffee, Café Monte Cintu | iba 4–6 káv |
| co-bean | distribútor viacerých značiek (BlackStar, Charisma, Ronnefeldt) a profesionálnych kávovarov – nie vlastná ponuka jednej firmy |
| Lexa coffee | 9 káv bez uvedenej prípravy a bez kyselosti |
| Zrnka z Hrnka | produktové fotky sú generované AI (názov súboru „Gemini_Generated_Image“), príprava neuvedená |
| JAMAI CAFE | vlastný kvíz výberu kávy |
| GP káva | veľký obchod (kávovary, čaje, stovky kategórií), vlastné návody výberu |
| AV Coffee | predáva La Marzocco, komerčné pražičky a veľkoobchod – väčšia firma |
| Zelená alchymie, BeButter | obchod s viacerými značkami; BeButter má vlastný dotazník |
| Mýdlovar | popisy typov pokožky plné zdravotných tvrdení (ekzém, akné, lupienka) – nedá sa pravdivo ponúknuť bez nich |
| Fraela, Stabla, Cannor | dekoratívna kozmetika / CBD (Cannor má vlastného „průvodce“) – mimo zamerania |
| Melody fine roastery | iba 8 káv, z toho 2 vypredané; názvy variant chýbajú |
| Liberecká pražírna | chuť a príprava iba vo všeobecnom texte („vhodná pro všechny způsoby přípravy“), bez parametrov |
| Valašská pražírna | chuť iba „Nekyselé / Lehce ovocité / Výrazné“, príprava len pri niektorých – slabé podklady |
| Levandulový dům | e-shop bez parametrov (typ pleti/vlasov, vôňa) – iba názvy; mýdla a deo kategórie prázdne pri zbere |
| Mija | najmä sviečky, prostorové parfémy, saunové esencie a veľkoobchodný cenník – nie je to výber starostlivosti |
| COFFEESPOT | vlastný „Průvodce výběrem kávy“ (porovnateľný poradca), väčšia firma s pobočkami |
| Latino Café (kava-arabica.cz) | veľká sieť s pobočkami, vlastné menu „Co od své kávy očekáváte?“ |
| 25coffee | e-shop neuvádza prípravu (espresso / filter) – výber by si musel vymýšľať |
| Longberry | longberry.cz vracia chorvátsky sortiment (zahraničný reťazec) |
| BARZZUZ | vlastná platforma bez štruktúrovaných údajov, predáva aj kávovary La Pavoni a pražiace stroje – odložené |

## Na rozhodnutie majiteľa (nie HOLD, ale sporné)
- Lázeňská káva (eshop.lazenskakava.cz, Lazenskakava.cz s.r.o., 05825580): dobré podklady (káva „espresso“ / „filtr“ v názve). Má však „Online konzultaci zdarma“ (ľudská poradňa) a silný B2B profil (kávovary, HACCP, e-book pre kaviarne). Ak ľudská konzultácia nevadí, je to vhodný kandidát.

## Hľadanie cez Google + tržby (8. 11.) – vyradené
Duplicity sa odteraz overujú podľa **domény** v `firmy.json`, `STAV_152.json`, `existing-slugs.txt` a vo všetkých vetvách (nie iba podľa slugu – TWO cosmetics má slug `two`).

| Firma | Dôvod |
|---|---|
| TWO cosmetics (twocosmetics.sk) | duplicita – existuje ako `two` |
| a-ORIGINAL | obchod s viacerými značkami, živnostník |
| Ina Essentials | zdravotné tvrdenia |
| NATAVA (UC TRADE CZ) | obrat 100–200 mil. Kč – veľká firma |
| Mony Key, KS Prírodné mydlá | živnostník / veľmi malé (KS ~11 tis. €), takmer iba mydlá |
| Queenstar / QS Cosmetics / JFenzi | dekoratívna kozmetika a parfémy |
| Herb-Pharma, Eco Rovnak | farmácia / veľkoobchod |
| benigma | = Cyprianus (existuje) |
| Boemi (Cosmetica Bohemica, 27888665) | najmä kúpeľová a darčeková telová kozmetika, tržby nezistené |
| NaomiBioCosmetics | iba 8 produktov |
| Bioregal, Biokrása, Dotek slunce, Wereco, Dalora, Sashe | obchody s viacerými značkami / marketplace |
| Protože JSI | kozmetika „na ekzém“ – zdravotné tvrdenia |
| SiSi (sisikosmetika.cz) | ~9 produktov (zvyšok mini/maxi/testery), všetko pre citlivú a zrelú pleť – málo podkladov na voľby |
| deNatura | cieli na obrat 150 mil. Kč, séra na riasy |
| Henep | web nefunkčný |
| Panakeia, Kvitok, Modrá púpava, Barbora Lori, Lavelin, Soaphoria, Natureal, Dr. Sandra, Klara Rott, Anela, Manufaktura, Renovality, Purity, Malinna, Naturinka, Goodie, Libebit, Bellcoria, Dulcia, Kvetu, Puaree, LucyLab, Yemna, Facederma, Iuvenio, Noili, Saloos, Nobilis | duplicita (už existujú) |

Muši (musiprirodne.sk, Zuzkoris s.r.o., 54529514): tržby 2025 19 544 €, ~13 vlastných produktov (mydlá podľa typu pleti, tuhé šampóny, maslá) – možný kandidát, ale tenký sortiment.
