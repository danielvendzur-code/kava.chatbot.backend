# S5-SOLO – dávka NUTT + Pleva na kontrolu

Pracovná vetva `codex/s5-solo-20261109`; východisko `6568fc1380a3fae796f4413256c4b61fd5647e99`. Predchádzajúci vzdialený checkpoint `e8556dd6bd7349fc973a3ea35b323681d35196a6`. Pracuje jeden worker, bez subagentov. Bežný git push nemá credential; zápisy cez GitHub konektor, bez force, main/master a PR.

## NUTT – nutt.cz – preview_verified, odovzdané na controller_review
- Prevádzkovateľ **Petr Bartoš, IČO 76374939**, https://www.nutt.cz/obchodni-podminky. Starý vyhľadávací výsledok s Patriciou Votíkovou nebol použitý.
- Kontakt **radost@nutt.cz**, verejná pätička https://www.nutt.cz/ . Tržby/rok: **NEOVERENÉ** (živnostník; žiadny odhad).
- Rezervácia: `claims.md` v autoritatívnej vetve `coord/s5-claims`, SHA `18b574908c6207f90e2090e313e8fe6b57b88da3`. Snapshot bude aj v `coord/s5-claims/claims.md` pracovnej vetvy.
- Dostupnosť vlastného poradcu: pracovník otvoril živý Smartsupp. Hlavička „Zavolejte nám na 775010550“, „Děkujeme!“, prázdny log, rovnaký text v poli. Žiadne produktové karty ani ovládanie generovania nepozorované. Nič napísané/odoslané. Je to konkrétny pozorovaný kontaktný stav, nie dôkaz všetkých možných režimov služby.
- **9** samostatných dostupných produktov: 7 masiel v 50 ml kelímku a 2 tuhé sprchové maslá 70 g. Štyri nedostupné štandardné balenia vynechané (Ambra, Curcuma, čisté Shea, Tea Tree & Lime v kelímku); mini nenahrádza bežné balenie. E-shop má viac produktov, poradca je reprezentatívny výber.
- Zdroj každej ceny/veľkosti/skladu/fotky/vlastnosti a čas: `sources/nutt/verified-products.json` a generovaný `catalogues/nutt.js`. Profil uvádza iba doložené typy pokožky, vôňu; bez skóre, liečebných účinkov alebo odvodenia zo zložky. Skořice zachováva obmedzenie pre citlivú pokožku/tehotenstvo/dojčenie zo zdroja.
- Dve zmysluplné otázky: forma používania → konkrétna vôňa. Všetkých 9 produktov má odlišnú cestu. Bez umelého rozpočtového kroku s rovnakým výsledkom.
- Doplnok vynechaný: všetky produkty majú rutinnú rolu krému/masla, nie vhodný komplementárny produkt. Cena výsledku je cena jednej položky; žiadny falošný set. Hranica dopravy zdarma neoverená na dopravnej stránke, preto sa neuvádza.
- Cena ponuky **447 € + 10 €/mesiac, bez trialu**. Produkčný Sonnet/model a kľúče nezmenené.

## Overenie – vlastné, nie nezávislé schválenie
- `tools/s3a/test-firm.sh http://127.0.0.1:8997 nutt`: **27 výsledkov / 39 obrazoviek**, 320×568, 390×800, 1280×800, **9/9** dosiahnuteľných produktov, **0 nálezov**. Bez obrázkov 9 výsledkov/13 obrazoviek, 0 nálezov.
- Čipy: **4 × 40 px** pri každej šírke; načítané kontrastné logo. Offline a mock chat: indikátor čakania, produktové karty, odkazy v rovnakej karte, 0 JS chýb.
- `tools/s5/qa.cjs`: prvé tri čipy odporúčajú konkrétne relevantné produkty (kokos, levanduľa/vanilka, dve tuhé maslá), štvrtý otvorí porovnanie dvoch odlišných produktov s cenou, balením a doloženými vlastnosťami. Hover horných kariet viditeľne zmení farbu/border bez posunu pri 320/390/1280. Reset/CTA a nadväzujúca veta iba raz. Pending indikátor zmizne aj po mock chybe; reduced motion je statický.
- Regresia oproti pôvodnému SHA: prvá úplná cesta VAANOK a Mýdlo z farmy má identický text výsledku a nenačítava CX_S5 (`dokazy/old-firms-regression.json`).
- `tools/s5/backend-mock.mjs`: 3 explicitne mocknuté modelové odpovede, HTTP 200 a správne produkty; **platené volania 0**. Offline výsledok nie je dôkaz produkčnej odpovede modelu.
- `tools/s5/offline-contract.cjs nutt`: všetky listy stromu, 9 rôznych produktov, lokálne fotky a zdroje.
- `dokazy/nutt-recheck-3.json`: opätovne načítané oficiálne produkty pri odovzdaní – Bergamot 385 Kč/50 ml, kokos 355 Kč/50 ml, tuhé TeaTree 445 Kč/70 g, HTTP 200 a skladom.
- `dokazy/nutt-cesta{1,2,3}-{320,390,1280}.webp`: 3 odlišné cesty × 3 šírky. **Všetkých 9 snímok ručne prezretých** v kontrolných pásoch; následne aj hover a porovnanie samostatne. PNG originály zostávajú lokálne; WebP sú odovzdané snímky rovnakého výstupu.
- QA nástroje prečítané pred spustením; server má fetch vypnutý a prehliadač mockuje /api. `S5_QA=1` iba lokálne mapuje starú testovaciu cestu na `s5.html`; neovplyvňuje Vercel/produkciu.

## Spoločný základ
`s5.html` + `n447/s5/boot.js`, konfigurácia/katalóg po firme, spoločný kompaktný výsledok v `support.js` a izolované CSS. Odporúčacie jadro ostáva CXAdvisorCore. Zmeny `catalogue-advisor.js` a `plus-chat.js` sú aktivované iba prítomnosťou S5; staré URL načítavajú pôvodný boot. Porovnanie S4 dostáva iba explicitný S5 variant dát. Žiadne kopírovanie celého enginu. Chatové bubliny sa nemenia, hotová odpoveď sa v S5 nevypisuje umelo postupne.

## Muši – HOLD_EXISTING_PRODUCT_CHAT
Doména musiprirodne.sk, Zuzkoris s.r.o. / 54529514. Nezávislý nález kontrolóra: Storekick na https://www.musiprirodne.sk/, uvítanie „Vitaj u nás ♥︎ Radi Ti poradíme s výberom vhodného produktu.“, karty Levanduvláska a V náruči Jemnosti, pole „Opýtajte sa čokoľvek…“, „Zastaviť generovanie“. Žiadna správa. Firemná práca zastavená; **Muši nemá povolený S5 runtime vstup** a jej WIP dáta/assety sa nepublikujú. HOLD rezervácie SHA `00cdb06055cd1c02361071b9a84660f7ae4208c5`.

## Rozsah duplicít a pošty
90 dostupných vzdialených vetiev prehľadaných podľa domény, mena a dostupných IČO; prílohy a registre prečítané. NUTT nájdený iba ako starý kandidát. Vercel konektor: 1 dostupný tím/projekt, 50 domén, next null – **nie globálna kontrola všetkých účtov/projektov**. Kontrolór hlási 201 Odoslaných, 27 Rozpísaných a 0 výsledkov domény Muši; to nie je úplná kontrola prevádzkovateľa ani NUTT. NUTT Odoslané/Nepísať: **PENDING_CONTROLLER**.

## Preview, produkcia, schválenie
Preview cieľ: nový deployment pracovnej vetvy existujúceho projektu, bez produkčných aliasov. Produkcia: **NOT_DEPLOYED**. Nová subdoména na návrh: `nutt.mojchatbot.sk`; DNS/nameservery a aliasy nezmenené. Kontrolór: **PENDING**; majiteľ: **PENDING**. Vzdialený kód a dôkazy: **2fe18852b36ce0904df2b29dbfd65fdc2b0f2809**. Preview **READY**, deployment **dpl_Gmyr8hoxKPdNu7f48Yf32jtAgGzN**:
https://kava-chatbot-backend-lujb9ubli-danielvendzur-codes-projects.vercel.app/s5.html?demo=nutt
Pracovník ho otvoril v pripojenom prehliadači a prešiel forma → Tea tree a limetka → správny produkt 70 g/445 Kč + konkrétne CTA. Ochrana sa nemenila ani neobchádzala. Chat sa na Preview neodosielal; model overený iba mockom. Nie je to nezávislé overenie kontrolórom ani produkcia.

## Koncept e-mailu – NOT_READY, neodoslané, nenaplánované
Kontakt: radost@nutt.cz. Predmet: Výběr bambuckého másla přímo pro NUTT

Dobrý den,
připravil jsem pro NUTT ukázku průvodce a chatbota, který zákazníkovi pomůže vybrat mezi máslem v kelímku a tuhým máslem do sprchy a zohlední jeho oblíbenou vůni. Dva produkty také porovná vedle sebe.
[ŽIVÝ FIREMNÍ ODKAZ doplnit až po ověření domény; Preview sem nepatří.]
Nasazení stojí 447 € jednorázově a provoz 10 € měsíčně, bez zkušebního období. Měli byste zájem ukázku projít?
S pozdravem
Vendžúr
https://mojchatbot.sk

## Kontrolór – nezávislý čiastočný nález (nie schválenie)
Kontrolór potvrdil READY `dpl_Gmyr8hoxKPdNu7f48Yf32jtAgGzN`, SHA `2fe18852b36ce0904df2b29dbfd65fdc2b0f2809`. Bez prihlasovania/bypassu prešiel 390×800 kelímek → bergamot/kakao → 385 Kč/50 ml, fotografia a produktový odkaz načítané; úvodná konzola bez JS chýb. Toto je jedna nezávislá cesta, nie úplné schválenie. Požadovaná oprava: odlišné opisy prvých kariet. Nové texty + zdroje: `sources/nutt/first-step-evidence.json`.

## NUTT – oprava a skutočné Preview QA dokončené
Aktuálny kód **59395937ead6802ca0027182ca144c893cf28a3f**, deployment **dpl_A8XfYhDqLkTrDT1pzQFUcjreQqru**, READY.
https://kava-chatbot-backend-lxcg94i9a-danielvendzur-codes-projects.vercel.app/s5.html?demo=nutt
Pracovník prešiel **všetkých 9 výsledkov**, vrátane stránkovania 7 kelímkov, 2 tuhých masiel a resetu. Overené ceny, produktové odkazy, načítané fotografie a nulový horizontálny overflow pri skutočnom viewport 1363×936. Obidva rozdielne opisy prvého kroku viditeľné. Doklad `dokazy/nutt-preview-qa.json`. Skoré kontroly obrázkov zachytili ešte prebiehajúce načítanie; následne všetky 9 fotografie potvrdené complete/naturalWidth > 0. Nástrojový DOM wrapper nemá metódu img.decode, preto sa načítanie overilo pozorovaním skutočnej snímky a DOM rozmerov. V zachytenom logu boli chyby rozšírenia chrome-extension pri posielaní metadát; žiadnu z nich neoznačujeme ako chybu aplikácie. Žiadna správa v Preview chate, 0 platených volaní, žiadny bypass. Nezávislý kontrolór overil zatiaľ iba svoju jednu cestu staršieho SHA. Produkcia a e-mail naďalej NOT_READY.

## Ďalšia firma – Pleva, reálna práca začatá
Rezervované pred kódom v `coord/s5-claims`, SHA `e493750bcc8863af7d21d88a0096b77d28e25c17`. Pleva s.r.o., IČO 48153061 potvrdené z aktuálnych `/s/conditions`; kontakt obchod@pleva.cz z pätičky. Živý SupportBox otvorený pred rezerváciou: „Momentálně tu nejsme“, pracovníčky Zuzána, Lucie, Markéta a kontaktný formulár. Bez správy. `/advisor` sú články, konkrétny sprievodca typmi pleti je statický publikovaný článok; netvrdíme, že to vylučuje každý iný režim webu. Zdrojové dáta 14 pleťových produktov (cena/variant/hmotnosť/sklad/fotka/typ pleti) už zozbierané; nie je to hotová ukážka.


## Pleva – lokálne aj vlastné Preview QA dokončené
12 overených dostupných produktov, samostatné cesty pre krémy, čistenie, masky/peeling a očné okolie. Nie je to celý obchod. Dve zachytené odličovacie mlieka sú zámerne mimo reprezentatívneho výberu. Výrobca výslovne nazýva Elixír mládí krémom; automaticky sa nemení na sérum.

Zdroje: `sources/pleva/verified-products.json`, aktuálne oficiálne produktové stránky s cenou/variantom/hmotnosťou, explicitnými typmi pleti, fotkou, skladom a časom. Tržby NEOVERENÉ. Doprava podľa https://www.pleva.cz/doprava-a-platba iba pre ČR, koncového zákazníka, striktne nad 2 300 Kč; príplatky zvlášť. Žiadny vymyslený údaj o doprave ani záruka účinkov.

- Úplný strom: 21 listov, 12/12 produktov. 63 výsledkov a 93 obrazoviek pri 320×568, 390×800, 1280×800; 0 nálezov. Bez fotografií 21 výsledkov/31 obrazoviek, 0 nálezov.
- Prvé tri čipy majú relevantné produkty, štvrtý porovnanie; 4×40 px, načítaný kontrastný avatar, offline/mock karty, odkazy v rovnakej karte, bez plateného modelu.
- `pleva-extra-qa.json`: hover bez posunu, správny maximálny počet krokov podľa vetvenia (4 pre krém, 2 pre čistenie), CTA, reset, nadväzujúca veta raz. Doplnok je nepovinný a nezaškrtnutý; gel 187 Kč + denný krém 263 Kč = 450 Kč; odškrtnutie vráti pôvodný súčet. Kompatibilitu stále vyhodnocuje spoločné jadro. Nejde o pridanie do košíka e-shopu.
- `pleva-backend-mock.json`: 3 relevantné odpovede, 3 mock volania, 0 platených volaní.
- 3 rôzne cesty × 3 šírky, vizuálne prezreté. Pri kontrole opravený biely ovál namiesto oficiálneho loga a interný tag face → Pleť. Finálne snímky sú v `dokazy/pleva-cesta*.webp`; checkbox, hover a porovnanie samostatne.
- Oba buildery sú offline reprodukovateľné z overených dát; kompletné HTML ani recenzie sa nepublikujú.

Produkcia NOT_DEPLOYED. Kontrolór a majiteľ PENDING. Globálne duplicity mimo pripojeného tímu a úplná pošta/Nepísať PENDING_CONTROLLER. Pozorovaný SupportBox je ľudský kontaktný stav; iné režimy nie sú vylúčené. Statické poradenské články sú výslovne zaznamenané.

## Pleva – koncept e-mailu NOT_READY
Kontakt obchod@pleva.cz. Predmet: Průvodce pleťovou péčí pro Pleva

Dobrý den,
připravil jsem pro Pleva ukázku průvodce a chatbota pro výběr pleťové péče. Zákazník projde podle druhu péče a typu pleti ke konkrétnímu produktu, porovná dvě možnosti a může si zvolit vhodný doplněk.
[ŽIVÝ FIREMNÍ ODKAZ doplnit až po ověření; Preview není zákaznický odkaz.]
Nasazení stojí 447 € jednorázově a provoz 10 € měsíčně, bez zkušebního období. Měli byste zájem ukázku projít?
S pozdravem
Vendžúr
https://mojchatbot.sk

Nic odesláno ani naplánováno. Finální schválení majitele chybí.


## Dávka – aktuálny overený Preview checkpoint
Kód **9bb671eb81385353f46c8afb776af37a9203aac8**, READY **dpl_8uJD1BBJUKRvPi2VFo84LtaxHaiF**.
NUTT: https://kava-chatbot-backend-hwlejxu75-danielvendzur-codes-projects.vercel.app/s5.html?demo=nutt
Pleva: https://kava-chatbot-backend-hwlejxu75-danielvendzur-codes-projects.vercel.app/s5.html?demo=pleva

Vlastné živé QA na tomto SHA: **9/9 NUTT + 12/12 Pleva** výsledkov, správne ceny/balenia/produktové odkazy, všetky fotografie complete/naturalWidth > 0, stránkovanie a reset, bez horizontálneho overflow pri skutočnom viewport 1363×936. Pleva: doplnok predvolene vypnutý, 187 → 450 → 187 Kč. Žiadny platený chat test. Mobilné úplné stromy a mock chat sú overené lokálne na 320/390, nie vydávané za živé mobilné QA. Zachytené chyby rozšírenia chrome-extension nie sú chyby aplikácie. Doklad `dokazy/batch-preview-qa.json`.

Nie je to schválenie majiteľom/kontrolórom ani produkcia. Obe firmy email NOT_READY; žiadna správa odoslaná alebo naplánovaná. Doteraz sú pripravené 2 nové ukážky, cieľ 20 denne nie je splnený. Ďalší výber musí znovu prejsť živými widgetmi, doménou aj prevádzkovateľom pred rezerváciou.


## JAGAIA – tretia nová firma, local_verified
Doména jagaia.cz, JAGAIA s.r.o., IČO 10863907; verejný kontakt info@jagaia.cz a prevádzkovateľ z https://www.jagaia.cz/obchodni-podminky/ . Tržby/rok NEOVERENÉ. Rezervácia pred kódom, coord/s5-claims SHA 7a493ed37967223d350a9a0fb6cd10dc8746fb76. Kontrola 91 vetiev podľa domény/IČO/kontaktu a historických príloh bez zhody. Vercel mimo pripojeného tímu a pošta/Nepísať PENDING_CONTROLLER.

Pred rezerváciou živá home aj stránka BREATHE IN: v DOM a snímkach žiadny chat launcher ani produktový chat nepozorovaný, iba zľavová newsletter ponuka ANO/NE. Navigácia podľa typu pleti sú kategórie, nie pozorovaný interaktívny poradca. Povolené iba nevyhnutné cookies; neprítomnosť vo všetkých iných cookie/session režimoch nie je dokázaná. Žiadne správy ani formuláre odoslané.

8 produktov: 1 oplachový gel, 3 séra (konkrétny dostupný variant 33 ml), 4 pleťové oleje po 15 ml. Ceny z presného variant option a Product microdata, bez ceny „od“. Samostatné vzorky 1/1,5 ml sa nenahrádzajú za bežné balenie; očný roll-on vynechaný pre neistý objem. BREATHE IN živým výberom variantu 33 ml potvrdil 1 360 Kč. Oficiálny web používa aj pre zvolený bežný variant historický sample/size alt a názov obrázka; v skutočnosti fotografia zobrazuje fľašu produktu. Tento nesúlad je zaznamenaný v dátach, veľkosť sa neodvodzuje z obrázka. Všetkých 8 oficiálnych fotografií vizuálne prezretých. Zdroj `sources/jagaia/verified-products.json`.

Žiadne vlastné medicínske tvrdenia, percentá účinnosti alebo odvodená ochrana SPF. Typy pleti len z explicitného tvrdenia o celom produkte. Doplnok vynechaný: existujúce jadro kvalifikuje čistenie/krém a sérum/krém, nie tento sérum/olej systém. Olej sa nepreznačuje na krém. Celková cena je jedna položka. Hranica dopravy nie je pridaná bez overenia podmienok dopravy.

QA: 19 listov, 8/8 produktov, 57 výsledkov/87 obrazoviek pri 320×568, 390×800, 1280×800; 0 nálezov. Bez fotiek 19 výsledkov/29 obrazoviek, 0 nálezov. 4×40 px čipy, logo; všetky 4 čipy offline, relevantné karty; dvojproduktové porovnanie. `jagaia-qa.cjs` držaný mock pending/error, reduced motion, hover bez pohybu na všetkých šírkach; `jagaia-extra.cjs` správny progress, CTA, reset, follow iba raz, súčet a úmyselné nepridanie nevhodného doplnku. Backend 3 mock odpovede, 0 platených volaní. `jagaia-recheck-3.json`: nové HTTP 200, zodpovedajúce ceny a sklad pri troch oficiálnych produktoch. Všetkých 9 finálnych výsledkových snímok ručne prezretých; opravené zdvojené balenie (33 ml · 33 ml) z redundantného variantLabel. Testy najprv odhalili nesprávne očakávanie doplnku a nesprávny predpoklad poradia porovnania; opravené podľa skutočných rolí produktov a vybraných položiek, nie pridaním falošného doplnku.

## JAGAIA – koncept NOT_READY
Kontakt info@jagaia.cz. Predmet: Výběr pleťové péče přímo pro JAGAIA

Dobrý den,
připravil jsem pro JAGAIA ukázku průvodce a chatbota, který pomůže vybrat čisticí gel, sérum nebo pleťový olej podle typu pleti a preferovaného složení. Dva produkty lze také porovnat vedle sebe.
[ŽIVÝ FIREMNÍ ODKAZ doplnit až po ověření; Preview není zákaznický odkaz.]
Nasazení stojí 447 € jednorázově a provoz 10 € měsíčně, bez zkušebního období. Měli byste zájem ukázku projít?
S pozdravem
Vendžúr
https://mojchatbot.sk

Neodesláno a nenaplánováno; produkce, pošta a schválení PENDING.
