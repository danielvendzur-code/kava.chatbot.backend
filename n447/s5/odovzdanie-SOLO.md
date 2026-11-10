# S5-SOLO – NUTT, Pleva, JAGAIA a Capri na kontrolu

Aktuálne sú pripravené **4 nové ukážky na vlastne overenom Preview**, nie 20. Produkcia, kontrola pošty a schválenie majiteľa sú otvorené; všetky koncepty NOT_READY. Presné SHA/deployment a rozsah QA sú pri každej firme nižšie.

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
Rezervované pred kódom v `coord/s5-claims`, SHA `e493750bcc8863af7d21d88a0096b77d28e25c17`. Pleva s.r.o., IČO 48153061 potvrdené z aktuálnych `/s/conditions`; kontakt obchod@pleva.cz z pätičky. Živý SupportBox otvorený pred rezerváciou: „Momentálně tu nejsme“, pracovníčky Zuzána, Lucie, Markéta a kontaktný formulár. Bez správy. `/advisor` sú články, konkrétny sprievodca typmi pleti je statický publikovaný článok; netvrdíme, že to vylučuje každý iný režim webu. Zdrojové dáta 14 pleťových produktov zozbierané; do hotovej ukážky vybratých 12, QA a Preview nižšie.


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


## JAGAIA – Preview overený
Kód **fa37d0d6c9cb7c3f6d42841eac4cc0ce0baf6495**, READY **dpl_HxLY8ZJzNuL71TCDqyNvYYDxwnab**.
https://kava-chatbot-backend-pagjqfnko-danielvendzur-codes-projects.vercel.app/s5.html?demo=jagaia
Všetkých 8/8 výsledkov pracovník skutočne prešiel na tomto deployment, vrátane správnych cien/balení/produktových URL, fotografií complete/naturalWidth > 0, resetu a bez horizontálneho overflow pri viewport 1363×936. `dokazy/jagaia-preview-qa.json`. Žiadna Preview chat správa, 0 platených volaní, bez prihlásenia/bypassu. Log chyby rozšírenia chrome-extension sa neprezentujú ako chyba aplikácie; vlastné overenie nie je nezávislé schválenie. Celá mobilná QA zostáva označená lokálne/mock.


## Capri – zarezervované a implementované, QA zatiaľ otvorené
Kanonický obchod kosmetikacapri.cz, alias lachevre.cz; Kosmetika CAPRI spol. s r.o., IČO 62910566; info@kosmetikacapri.cz z aktuálnych https://www.kosmetikacapri.cz/informace/kontakty/ . Tržby NEOVERENÉ. Rezervácia pred kódom SHA 8aa407126c841a1212c5f67819028d894bcb38af. 91 vetiev preverovaných podľa domén, prevádzkovateľa, IČO a kontaktov, bez zhody; prílohy bez zhody. Živé widgety pred rezerváciou: home + produkt bez pozorovaného chatu, Zeptat se je Dotaz na prodejce s e-mailom/telefónom/správou/CAPTCHA; nič vyplnené ani odoslané. Tipy a rady sú 3 statické články. Iné cookie/session režimy nie sú vylúčené.

9 overených produktov: 5 krémov po 50 g, krémová maska 100 g, pláténková maska na jedno použitie 10 g, čistiaca pena 150 ml a voda 200 ml. Presné balenie pochádza z Obsah v opise, nie zo všeobecného parametra Objem ani prepravnej hmotnosti. UV/SPF/medicínske tvrdenia vynechané; rozpor veku 25+/35+ pri dennom ružovom kréme sa nepoužíva. Všetky oficiálne produktové fotografie vizuálne prezreté. Offline strom 11 listov / 9 produktov dosiahnuteľných; bez platených volaní. Browser QA sa nespustila: /tmp/chromium po obnove prostredia neexistuje; konkrétny log capri-qa-environment-error.txt. Runtime sa obnovuje z verejného npm @sparticuz/chromium mimo repozitára. Nie je to hotová ani overená ukážka.

## Lokálny Git – bezpečný pokračovací postup
Automatická kontrola odmietla git reset --mixed FETCH_HEAD pre možnú stratu zmien v indexe. Akcia nebola zopakovaná ani obídená. Read-only kontrola ukázala prázdny index, lokálny HEAD ef249f346d70d3b941bf25b80606cfc2c3b54c62 a zachované worktree súbory; JAGAIA je už uložená vo vzdialenom f4a329e8b8b5ab97e42941eca145f80c2f9feeb1. Pokračovať cez explicitné súbory/GitHub connector s expected SHA, bez resetu, force alebo plošného add. Nepribaliť Muši WIP, raw HTML, dva vynechané Pleva produkty ani dočasné runtime súbory.


## Capri – lokálne QA dokončené po oprave prostredia
Chýbajúci /tmp/chromium bol obnovený z oficiálneho npm @sparticuz/chromium 153.0.0 mimo checkout. Následný SkFontMgr fatal bol konfiguráciou Lambda fontov; systémové /etc/fonts obnovili funkčné vykresľovanie bez zmeny systémových súborov, certifikátov alebo ochrany webu. qa-environment-recovery.json a restore-browser.cjs zachytávajú presný postup.

Finálne QA: 33 výsledkov / 57 obrazoviek pri 320×568, 390×800, 1280×800; 9/9 produktov, 0 nálezov. Bez fotiek 11 výsledkov/19 obrazoviek, 0 nálezov. 4 čipy offline relevantné, 40 px, logo kontrastné; mock karty a odkazy bez novej karty. capri-qa.cjs overil hover bez posunu, porovnanie dvoch odlišných produktov s cenou/balením, pending/error/reduced motion. capri-extra.cjs overil progress, CTA/reset, follow raz a voliteľný doplnok: voda 385 Kč + krém 496 Kč = 881 Kč, predvolene nezaškrtnutý a po odškrtnutí znovu 385 Kč. Samostatný doklad capri-addon-qa.json. Backend 3 mock volania / 0 platených. Tri oficiálne produkty znovu HTTP 200/cena/sklad (capri-recheck-3.json).

Všetkých 9 finálnych výsledkových snímok ručne prezretých v pásoch. Capri fotografie mali široké biele okraje; iba CSS zobrazenie vo fixnom rámiku je zväčšené 1,4×, samotné oficiálne obrázky sa nemenili. Osobitne skontrolovaná aj pláténková maska. Spoločný S5 progress má opravené české/slovenské skloňovanie počtu krokov; pravidlá výberu sa nemenili. JAGAIA výsledkové QA znova prešlo a má samostatný jagaia-result-qa.json.

## Capri – koncept NOT_READY
Kontakt info@kosmetikacapri.cz. Predmet: Průvodce pleťovou péčí pro Kosmetiku Capri

Dobrý den,
připravil jsem pro Kosmetiku Capri ukázku průvodce a chatbota, který pomůže vybrat denní či noční krém, čisticí péči nebo masku z vaší nabídky. Dva produkty také porovná a u vhodné kombinace nabídne volitelný doplněk s celkovou cenou.
[ŽIVÝ FIREMNÍ ODKAZ až po ověření; Preview není zákaznický odkaz.]
Nasazení stojí 447 € jednorázově a provoz 10 € měsíčně, bez zkušebního období. Měli byste zájem ukázku projít?
S pozdravem
Vendžúr
https://mojchatbot.sk

Nic odesláno ani naplánováno. Produkce, pošta a schválení PENDING.


## Ďalší kandidát pripravený na prácu – Aromatica
AROMATICA CZ s.r.o. / 26963523, aktuálne čerstvo načítané OP https://www.aromatica.cz/obchodni-podminky/ . eshop@aromatica.cz zo živej pätičky; tržby NEOVERENÉ. Rezervácia SHA d3b1d69999a0ccf2006bfd7abee3d355f5228f87 pred kódom. 91 vzdialených refs bez domény/IČO, prílohy bez zhody. Živá home a Ectoin produkt bez pozorovaného chatu; produktové ZEPTAT SE otvorí obyčajný Dotaz na prodejce (e-mail/telefón/správa/CAPTCHA), nič vyplnené. Dotazník je podľa vlastnej vstupnej stránky marketingový prieskum preferencií so zľavou; Google Forms neotvorený/nevyplnený. Pozorovaný stav nie je dôkaz všetkých cookie/session režimov. Prednosť dostane bežná kozmetika, nie zdravotné tvrdenia doplnkov stravy. Najprv dokončiť Capri Preview.

Botanica Slavica je HOLD_DUPLICATE_OPERATOR_AND_DOMAIN: historická botanica má priamo botanicaslavica.eu; aktuálny prevádzkovateľ je Soaphoria.sk s. r. o. / 56351747 a Soaphoria je tiež existujúca firma. Nenahrádzať to novým slugom. Botanico.cz má zatiaľ iba doménovú kontrolu; prevádzkovateľ a živé widgety sa musia doplniť pred prípadnou rezerváciou.


## Capri – vlastné Preview QA dokončené
Overený kód **d54217a148b3204de27edac05a0debe70e27aa93**, READY **dpl_FJXnRVWyra3vE2JyPr4vrVdCf2FC**.
https://kava-chatbot-backend-1s9a0b997-danielvendzur-codes-projects.vercel.app/s5.html?demo=capri
Pracovník skutočne prešiel všetkých 9/9 výsledkov na tomto deployment: 5 krémov, 2 masky, 2 čistiace formy. Ceny, balenia a produktové href zodpovedajú overeným dátam. Všetkých 9 fotografií potvrdených complete/naturalWidth=900; pôvodne pending obrázky boli samostatne znovu otvorené a skontrolované až po načítaní. Doplnok predvolene nezaškrtnutý, 385 → 881 → 385 Kč. Reset, bez horizontálneho overflow pri skutočnom viewport 1363×936. capri-preview-qa.json.

Úvodné networkidle čakanie skončilo timeoutom počas bootu; neskôr skutočný DOM potvrdil html lang=cs a českú celú stránku. Zachytené chyby rozšírenia chrome-extension nie sú označované ako chyby aplikácie; žiadna aplikácie nebola pozorovaná v zachytených logoch. Žiadny platený chat test, bez prihlasovania/bypassu. Mobilné úplné QA zostáva lokálne/mock. Nie je to nezávislé schválenie ani produkcia.

Nové subdomény iba ako návrh na schválenie: nutt.mojchatbot.sk, pleva.mojchatbot.sk, jagaia.mojchatbot.sk, capri.mojchatbot.sk. Žiadne DNS/produkčné aliasy priradené. Ďalší krok: Aromatica je už bezpečne rezervovaná; spracovať iba overenú bežnú kozmetiku a zopakovať plné QA.


## Oprava výberu kandidáta – Aromatica HOLD, nezapočítaná
Pri opätovnom prečítaní celého záväzného zadania sa zachytila výslovná podmienka nevracať BeButter bez rozhodnutia kontrolóra. Aromatica má priamo aktuálnu kategóriu https://www.aromatica.cz/bebutter/ a šesť zo siedmich spracovaných produktov je BeButter. Toto doménová/IČO kontrola nezachytila. Stav HOLD_HISTORICAL_BEBUTTER_RELATED, bez tvrdenia, že jej marketingový Dotazník je produktový poradca. Rozhodnutie o obnove patrí kontrolórovi. Vlastná chybná rezervácia sa opravila, nie potichu nahradila novým slugom.

Lokálne WIP dáta/fotografie a testy zachované; 7/7 výsledkov pri troch šírkach a osobitné čipy/porovnanie prešli, ale úplné snímky boli prerušené po odstránení vlastnej runtime registrácie (následný timeout data-open advisor). Žiadny Preview ani piaty hotový kus. V tomto checkpointe sa runtime nemení. Súčet zostáva štyri Preview overené firmy.

Botanico.cz bolo následne rezervované pred kódom: Botanico s.r.o., IČO 04280156, aktuálne oficiálne obchodné podmienky; info@botanico.cz z pätičky, tržby NEOVERENÉ. 91 refs bez domény/IČO/názvu, dodané registre bez zhody, živé home + produkt bez pozorovaného chatu, iba kontaktný formulár s CAPTCHA, nič vyplnené ani odoslané. Iné session/cookie režimy neisté. Doklad botanico-duplicates.json. Rezervačný commit koordinačnej vetvy cbdb08ea5dc07fba38798e1111a7da7c464ce634. Ďalší krok: overiť reprezentatívny kozmetický výber, pričom starý URL parameter 50ml pri kréme nezodpovedá aktuálnemu baleniu 75 ml; rozhoduje aktuálny názov/opis. Všetky emaily NOT_READY, Odoslané/Nepísať a globálny Vercel PENDING.


## Botanico – lokálne overené, Preview zatiaľ PENDING
Botanico s.r.o. / 04280156, kanonická botanico.cz, info@botanico.cz. 10 reprezentatívnych produktov: 6 pleťových krémov, 3 krémy na ruky, 1 maska. Deväť krémov 75 ml a maska 100 ml; staré URL 50ml sa nepoužívajú ako zdroj balenia. Ceny vrátane DPH 96,68 / 99,22 / 198,44 Kč z viditeľnej zákazníckej ceny; JSON-LD má ceny BEZ DPH, nepoužité v odporúčaní. Pôvodné názvy v source.originalTitle, skrátené zobrazované názvy bez zdvojenia balenia/anglického prekladu. Všetky oficiálne fotografie prezreté. Čokoládová maska vynechaná pre rozpor citlivej pleti a upozornenia na začervenanie; mandľový krém pre nejasné zloženie. Nočná oliva iba suchá pleť, nie rozporný mastný atribút. Medicínske tvrdenia a neoverená maloobchodná doprava vynechané.

Offline strom 22 listov/10 dosiahnuteľných produktov. Kompletný test-firm: 66 výsledkov/111 obrazoviek na 320×568,390×800,1280×800, 0 nálezov; bez obrázkov 22 výsledkov/37 obrazoviek, 0. Všetkých 10 konkrétnych výsledkov/fotografií/CTA/reset/follow samostatne pri troch šírkach. 4 čipy 40 px/relevantné karty, porovnanie 2 odlišných produktov s presnou cenou a balením, hover bez posunu, pending/error/reduced-motion, backend 3 mock/0 platených. Doplnok vynechaný, nie je vhodný pár čistenie/krém. Najdlhšia zmysluplná cesta má 5 krokov a vysvetlené maximum. Tri cesty × tri šírky finálne znova zachytené a ručne prezreté po skrátení názvov. 3 oficiálne produkty znovu overené pri odovzdaní. S5-only porovnanie má krátke Porovnání produktů; stará S4 vetva ostáva pôvodná.

Koncept NOT_READY, kontakt info@botanico.cz. Predmet: Průvodce pleťovou péčí pro Botanico
Dobrý den,
připravil jsem pro Botanico ukázku průvodce a chatbota pro výběr denního či nočního krému, péče o ruce nebo pleťové masky. Zákazník může také porovnat dva produkty.
[ŽIVÝ FIREMNÍ ODKAZ až po ověření; Preview není zákaznický odkaz.]
Nasazení stojí 447 € jednorázově a provoz 10 € měsíčně, bez zkušebního období. Měli byste zájem ukázku projít?
S pozdravem
Vendžúr
https://mojchatbot.sk

Janine, s.r.o. / 46689605 rezervovaná pred kódom koordinačným SHA 132dc90192c31e0947861397e90ff6724a9af86d. Živá home + krém bez pozorovaného poradcu/chatu; iné režimy neisté. 91 refs a prílohy bez zhody. Zdroj OP/contact v status.json. Šesť základných kozmetických produktov má aktuálne varianty; bežný 50 ml krém stojí 14,30 €, konkrétny query attribute_pa_velkost=50-ml bol skutočne otvorený a DOM potvrdil 50 ml/14,30 €, bez košíka. Mini 15 ml/8,20 € je dostupné, ale nebude ticho nahrádzať bežné balenie; prípadne iba v nižšom detaile s presnou cenou. Zatiaľ nejde o hotovú ukážku. BODYBE vyradené pre vlastný Smart Beauty Quiz priamo na aktuálnej home, konkrétny dôkaz v registri.


## Checkpoint pri skutočnom výpadku prostredia
Botanico kód **da47ce26de45c59f03b2a96bfc0cfa82e5bba4ff**, READY **dpl_Fsrv2jE3StxAhTTgRP9SEaud5C4Q**.
https://kava-chatbot-backend-q31t7hn8b-danielvendzur-codes-projects.vercel.app/s5.html?demo=botanico
Vlastné živé QA je iba ČIASTOČNÉ: cesta Pleť → každodenný krém → bez určenia typu → Mrtvé moře → ráno zobrazila správny produkt, 96,68 Kč, 75 ml a presný href. Fotografia ešte nebola potvrdená complete/naturalWidth; ďalších 9 produktov neprejdených. Stav ostáva local_verified, NIE preview_verified. Úvodný inert/Slovak shell sa po dobehnutí bootu prepol do češtiny; skutočným viditeľným tlačidlom sa potom otvoril výber. V zachytených logoch iba chyba chrome-extension metadata sender, nie chyba aplikácie; nejde o úplný runtime scan.

Pri ďalšom kroku CUA nastalo exec-server transport disconnected. Pokus načítať browser-troubleshooting skončil recovery timed out after 45s. Prostredie následne označené unavailable a overovací terminal pwd vrátil No usable execution environment is available. Žiadny nový účet, oprávnenie, obchádzanie ochrany ani iné prostredie nebolo založené. Čas obnovy sa nezobrazuje, nevymýšľa sa. GitHub/Vercel konektory stále fungujú, preto sa ukladá tento vzdialený checkpoint a 17 už pripravených WebP snímok. Nenasadzuje sa produkcia. Reálny počet plne Preview overených ukážok je stále **4**; Botanico je navyše lokálne overené/READY/živé QA nedokončené. Aromatica HOLD sa nezapočítava.

Presný ďalší krok po návrate prostredia: otvoriť vyššie uvedené Botanico Preview, dokončiť všetkých 10 výsledkov a fotografie až po complete/naturalWidth > 0, reset a CTA. Potom fresh fetch koordinačných claims a iba pri úspechu zmeniť Botanico na preview_verified. Mobilné úplné QA je lokálne, neprezentovať ho ako cloudovú kontrolu mobilu. Následne implementovať už rezervovanú Janine zo sources/janine/research-checkpoint.json; fotky/varianty overiť a zopakovať offline/mock + Preview. Žiadny zákaznícky chat ani email.

Aktívny lokálny checkout pred výpadkom: /workspace/scratch/3ddc5ee91f7a/s5-next (detached e831..., remote zápisy konektorom). Pôvodný repo checkout zostal zachovaný; žiadny reset sa neopakoval. Dokončené lokálne procesy 72329/7633, zachytávanie a recheck tiež dokončené; servre mali trap cleanup. Aromatica raw/WIP sú nepublikované, vlastné runtime zmeny boli odobraté po zálohe aromatica-wip. Janine zdroje a súvisiace dôkazy sa teraz zachovávajú aj konektorom, aby nezáviseli od scratch prostredia.


## Obnovené prostredie – Botanico Preview dokončené
Existujúci terminál aj Chrome/CDP sú späť. Fresh git ls-remote potvrdil najnovší cf46b65bf54bc995074393154ae26c58e3336107, ktorý nadväzuje na 969cbae... a synchronizuje claims. Vytvorený nový detached worktree s5-resumed z cf46, staré repo/s5-next sú zachované, bez resetu.

Botanico vlastné živé QA dokončené na kóde **da47ce26de45c59f03b2a96bfc0cfa82e5bba4ff**, READY **dpl_Fsrv2jE3StxAhTTgRP9SEaud5C4Q**. Presný link ostáva https://kava-chatbot-backend-q31t7hn8b-danielvendzur-codes-projects.vercel.app/s5.html?demo=botanico . Skutočne prejdených všetkých 10 výsledkov, ceny/balenia/href zodpovedajú zdrojom; všetkých 10 fotografií complete=true/naturalWidth=500 potvrdené až po načítaní pred resetom. Reset vrátil Pleť/Ruce, CTA v rovnakej karte. Viewport 1363×936, bez horizontálneho overflow, čeština. Zachytené chyby iba chrome-extension metadata sender; žiadna aplikácie v zachytenej vzorke, nie úplný runtime audit. Žiadny chat/košík/model request/login/bypass/produkcia. Doklad botanico-preview-qa.json; pôvodný partial sa zachováva ako história. Mobilné QA bolo lokálne/mock.

Stav Botanico preview_verified, vlastné overenie NIE schválenie kontrolórom ani produkcia. Počet plne vlastne Preview overených nových ukážok je teraz 5. Ďalší krok už vykonávaný: rezervovaná Janine, zachované dáta; bežné balenie prednostne 50 ml, zmysluplné 15/30 ml veľkosti sa nevyraďujú, uvedú sa s presnou cenou vo vhodnom detaile. Cena447+10 a NOT_READY emaily zachované. Muši/Aromatica/BeButter HOLD bez zmeny.


## Janine – implementácia a lokálne testy
Janine, s.r.o. / 46689605, janinekozmetika.sk, janinekozmetika@gmail.com z OP. Tržby NEOVERENÉ. Rezervácia 132dc90192c31e0947861397e90ff6724a9af86d pred kódom, 91 refs a prílohy bez zhody; živé home+krém bez pozorovaného poradcu/chatu, newsletter/produktové varianty, iné cookie režimy neisté.

6 rozličných produktov: denný krém Slamienka Kyselina ferulová 50 ml/14,30 €, olejové sérum 50 ml s dávkovačom/14,30 €, 3 kvetové vody s rozprašovačom po 50 ml/4,90 €, telový krém Q10 50 ml/10,60 €. Menšie balenia sa nevyraďujú: krém 15 ml/8,20 € a 30 ml/10,90 €, sérum 30 ml s dávkovačom/10,90 € v nižšom detaile; hlavný výsledok prednostne bežných 50 ml. Mini sa nepočíta ako ďalšia receptúra ani ticho nenahrádza bežné balenie. 30 ml sérum s kvapátkom vynechané pre nesúlad oficiálnej fotografie. Všetky zvolené fotky zodpovedajú 50 ml a boli ručne prezreté.

Exact variant query URL používa attribute_pa_velkost/attribute_pa_uzaver podľa skutočného Woo exportu. Všetkých 6 odkazov skutočne otvorených: select vybral správne parametre. Sérum 50 ml/dávkovač potvrdilo cenu 14,30 €; mini krém 15 ml/8,20 € a Hamamel parent price4,90 € tiež priamo DOM. Prázdne okamžité variation-price pri ďalších produktoch sa nepovažujú za cenový dôkaz; 3 reprezentatívne aktuálne varianty nezávisle HTTP/stock/cena/atribúty rechecked. Doklady janine-live-variant-urls.json, janine-recheck-3.json. Nič pridané do košíka ani odoslané.

Offline strom 8 listov/6 produktov, test-firm 24 výsledkov/42 obrazoviek na 3 šírkach, 0 nálezov; bez obrázkov8/14, 0. Každý konkrétny produkt pri každej šírke overený vrátane fotografie, ceny, packu, presného CTA, resetu a follow raz. 4čipy 40px, relevantné karty, porovnanie2odlišných produktov/cena/balenie, hover bez posunu, pending/error/reduced motion. Mini detail pri3šírkach zachová hlavný50ml14,30 €, zobrazuje15ml8,20 a30ml10,90. Backend3mock/0platených. Doplnok nie je vynútený: spoločný core odmietne ako doplnok krém s kyselinou; názov/rola sa kvôli tomu nemenia. Geranium má doložené všetky typy pleti, preto umožňuje aj Bez výrazného problému; údaj nie je odvodený z kategórie. Medicínske/SPF tvrdenia a neoverená doprava vynechané.

Pri ručnej kontrole iba CSS zobrazovanie troch kvetových vôd zväčšené1,8× v pevnom rámiku, orežú sa široké biele okraje, nie produkt; originálne obrázky sa nemenili. Finálne snímky po fade sa zachytávajú znova, Preview zatiaľ PENDING.

Koncept NOT_READY, kontakt janinekozmetika@gmail.com. Predmet: Sprievodca výberom starostlivosti Janine
Dobrý deň,
pripravil som pre Janine ukážku sprievodcu a chatbota, ktorý pomôže vybrať pleťový krém, olejové sérum, kvetovú vodu alebo telový krém z vašej ponuky. Umožňuje aj porovnať dva produkty a pozrieť dostupné menšie balenia.
[ŽIVÝ FIREMNÝ ODKAZ až po overení; Preview nie je zákaznícky odkaz.]
Nasadenie stojí 447 € jednorazovo a prevádzka 10 € mesačne, bez skúšobného obdobia. Mali by ste záujem ukážku prejsť?
S pozdravom
Vendžúr
https://mojchatbot.sk

Žiadny email odoslaný/plánovaný. Odoslané/Nepísať/globálny Vercel PENDING, produkcia NOT_DEPLOYED. Nová subdoména iba návrh pre kontrolóra: janine.mojchatbot.sk, bez DNS/alias zmeny.


Janine finálna lokálna kontrola: 9 výsledkových snímok + 9 kontrol orezov kvetových vôd a mini3šírky ručne prezreté. Pôvodný menej špecifický CSS zoom prekrývalo transform:none; opravená špecificita iba pre tri Janine vody, vypočítaná matica1.8 potvrdená9×. Produkt sa neorezal. Jediná snímková cesta vôd znovu zachytená v plnej výške podľa štandardného shots3 postupu; nezmenené všeobecné testy sa neopakovali. Mini detail má teraz aj presné odkazy15/30ml, v rovnakej karte; priame30mlURL na živom e-shope potvrdilo30-ml/10,90€. Mini15ml8,20€ overené predtým. Focused janine-mini.cjs overil ceny/URL/no silent substitution a pravdivý úvod na3šírkach.

Pokrytie potrieb doložené v janine-needs-coverage.json: krém vs olejové sérum, odlišné vody podľa pleti/vône, samostatná telová starostlivosť. Šesť receptúr, nie nafúknuté varianty. Konkrétny úvod Pleť a telo · typ starostlivosti · vôňa nesľubuje rozpočet, na ktorý sa tento výber nepýta. S5-only rešpektovanie nakonfigurovaného úvodu ponecháva pôvodný fallback starým sériám. Janine je local_verified, Preview zatiaľ PENDING.


## Janine – Preview vlastne overené6/6
Kód **4359f12f994aa6d864f8bef2d22deaf9537b1719**, READY **dpl_4d7i7iXYPj8LTLQvnWVMU4dbqCQZ**.
https://kava-chatbot-backend-12c7fw998-danielvendzur-codes-projects.vercel.app/s5.html?demo=janine
Pracovník skutočne prešiel všetkých6výsledkov, ceny/50ml/produktové href vrátane konkrétnych atribútov sedia; všetkých6fotografií complete=true/naturalWidth600. Mini detail15ml8,20€/30ml10,90€ a oba presné same-tabURL tiež skutočne prečítané v Preview. Úvod presne Pleť a telo · typ starostlivosti · vôňa, bez sľubu otázky na rozpočet. Reset vrátil Pleť/Telo. Viewport1363×936, langsk, bez horizontálneho overflow. V zachytených logoch iba chrome-extension metadata sender chyby, nie aplikácia; nejde o úplný runtime audit. Žiadny chatový model request/košík/login/bypass/email/produkcia. Mobilné úplnéQA je lokálne/mock. Dôkaz janine-preview-qa.json;23finálnych WebP dôkazov priložených k checkpointu. Nie je to nezávislé schválenie ani approved_live.

Vlastne Preview overených6: NUTT,Pleva,JAGAIA,Capri,Botanico,Janine. Majiteľov nový dlhodobý pokyn je uložený v BACKLOG-DLHODOBE-20261109.md: najmenej20, potom zásoba smerom40 a ďalej pri dostupnej kapacite; nekončiť pri odovzdaní. Jeden pracovník, cena447+10, emailyNOT_READY/žiadne odoslanie ani plánovanie, produkciazakázaná. Ďalší vykonávaný krok Aromedica/Eoné, zatiaľ nerezerované: Aromedica sa našla v starom kandidati.md (treba prečítať dôvod), Eoné doména/názov bez91refzhody, treba doplniť IČO27321151 a prezrieť živú home/produkt/poradňu. Nevydávať ich vhodnosť za schválenú.


## Ďalšia firma po šiestich Preview – 2026-11-09T21:51:50.826942+00:00

Eoné rezervovaná v coord/s5-claims commit76e95bbff70cb7a6623b620748ed8303bc206fbe po 91-ref kontrole domény/prevádzkovateľa/IČO a živej home + LIGIA + Poradna kontrole. Poradna je osobná e-mailová rada; chat pri Komentáře je ikona recenzií. Nevyhnutné cookies; iné režimy nepreukázané. Zdroje sa zbierajú, ukážka zatiaľ nie hotová.

Aromedica HOLD_SOURCE_ACCESS_BLOCKED: domovská stránka zobrazila Access temporarily blocked pre suspicious activity; žiadna kompletná kontrola widgetu, žiadne obchádzanie ani kód. Oficiálne OP: AROMEDICA s.r.o./25126059; historický kandidát, nezapočítaná ukážka.

Posledný kompletný vzdialený checkpoint d983e0a22ae515936d77f89045a09ffe439ef587: 6 vlastne Preview overených, Janine kód4359f12f994aa6d864f8bef2d22deaf9537b1719 / dpl_4d7i7iXYPj8LTLQvnWVMU4dbqCQZ a23snímok. Pokračovať Eoné a ďalšími firmami, nie zastaviť pri odovzdaní.


## Eoné – lokálne overená, Preview ešte PENDING

9 rôznych receptúr: 2 krémy30ml,3 pleťové oleje20ml, ružová voda30ml, hydrofilný olej50ml, mycí balzám100ml a kondicionér100ml. Uvádzaná dostupnosť z oficiálnych stránok:8× Vyrábíme čerstvé (MadeToOrder, nie InStock), LIA posledné kusy. 50ml čistič3v1 nedostupný, vyradený bez náhrady iným balením. Žiadne zdravotné/SPF/psychické tvrdenia.

UI DFS54 výsledkov/99 obrazoviek,9/9 hlavných odporúčaní na320/390/1280,0 nálezov; bezfotiek18/33,0. Priamy engine kontrakt23 listov/9 produktov; UI33 obrazoviek našírku má18 listov. Samostatné ceny/balenie/CTA/obrázok/reset/follow:9 produktov×3 šírky. Prvý320 beh prešiel výsledkami, zastavil sa na predčasnom hover-meraní počas otváracej animácie; následné320 interakcie a390/1280 výsledky prešli. Medzera Kč normalizovaná v teste po rovnakom číselnom súčte; bez zmeny ceny. Ružová voda+krém dobrovoľne193→587→193Kč. Žiadny doplnok vopred zvolený.4 čipy40px,2 rôzne produkty v porovnaní,3 backendmock/0platených. Finálne27 snímok produktov a9 otázkových stavov;3 CSS orezy iba bielych okrajov, avatar s kontrastnejším pôvodným logom. A11y po doplnení QAregistra prešla. Preview ešte neoverený; e-mail NOT_READY, produkcia NOT_DEPLOYED. Pokračovať živým QA, potom rezervovaná Nafigate.


## Eoné Preview skutočne overený – 2026-11-09T22:10:16.309949+00:00

Kód3de371af82ab788b21d02b9d0f1afe1d9dd2903a, READY dpl_Ek2q5CDfsKxN6CV45UYXqzEegh9v. https://kava-chatbot-backend-49qrdrxkw-danielvendzur-codes-projects.vercel.app/s5.html?demo=eone . Vlastné živé QA9/9 výsledkov, každá fotografia po načítaní complete/naturalWidth800, ceny/balenia/presné variantné CTA bez novej karty, reset medzi výsledkami;1363×936,cs,bez horizontálneho pretečenia. Doplnok nezaškrtnutý193→587→193Kč. Posledných10 konzolových chýb je chrome-extension metadata, nie aplikačné chyby; vzorka nie globálna záruka.0modelových volaní. Záznam dokazy/eone-preview-qa.json. Séria má7 vlastne Preview overených, nie schválenú produkciu. Ďalej rezervovaná Nafigate, claim79ba67de42653b7aa2b15deb7048bc879f773c7f.


## Nafigate – lokálna kontrola dokončená, Preview ešte PENDING

NAFIGATE Cosmetics, a.s., IČO 04244061, nafigatecosmetics.cz, info@nafigatecosmetics.cz z aktuálnych OP. Aktuálne tržby NEOVERENÉ; správa z roku 2018 nie je aktuálny obrat. Živá domovská stránka a Hyaluron Essential: po odmietnutí cookies bez pozorovaného produktového chatu; „Zeptat se“ otvorí Dotaz na prodejce s kontaktnými poľami a CAPTCHA. Nič nevyplnené ani odoslané. Iné režimy zostávajú neisté.

Osem rôznych produktov má osem koncových ciest. Čistenie odlišuje oplachový gel od oleja na vodoodolný make-up; naväzujúca starostlivosť odlišuje nočný krém od séra. Štyri séra majú doložené odlišné zameranie: základná hyalurónová starostlivosť 25+, veľmi suchá pleť so ženšenom, zrelá pleť 40+ s Bulbine a zrelá pleť 50+. Úvod nesľubuje rozpočet. Nezaradené: vypredané položky aj pri kladnom počte kusov, Peptide s rozporom 15/100 ml, akútne cyklické acne prípravky, ihly a sady.

Lokálne: 24 výsledkov / 39 obrazoviek na 320/390/1280 px, 8/8 hlavných odporúčaní, 0 nálezov. Bez fotografií 8/13, 0 nálezov. Každý produkt má samostatne overenú cenu, balenie, načítanú fotografiu, presné CTA bez novej karty, reset a nadviazanie. Čipy sú štyri, všetky 40 px; hover bez posunu, čakací indikátor a chyba len cez mock, reduced motion, 3 backend mock volania / 0 platených.

Vizuálna kontrola odhalila skrátený opis nočného krému pri voľbe a príliš všeobecné porovnanie sér. Krátky opis teraz jasne uvádza nočnú starostlivosť 50 ml od 30 rokov. Len pre Nafigate je porovnanie opt-in: namiesto rovnakého „všetky typy pleti“ ukazuje konkrétne zameranie z overeného opisu. Ceny a balenia zostávajú v tej istej karte. Následná cielená kontrola prešla na troch šírkach, nezmenený celý strom sa neopakoval. CSS zväčšuje iba biele okraje pôvodných packshotov; originály sa nemenili.

Preview ešte nie je overený. E-mail NOT_READY, produkcia NOT_DEPLOYED. Ďalšia rezervácia: Boemi, Cosmetica Bohemica s.r.o. / 27888665, aj súvisiace SK zastúpenie boemikozmetika.sk / 47046635 skontrolované v 91 refs. Výrobca je iba historický kandidát, nie existujúca ukážka.


## Ranná obnova 10. 11. – Nafigate Preview 8/8

Fresh vzdialená vetva je 06495078636f3dc16050aea332db1c2c9cdf9291. Kód, aktuálne zdroje, JSON QA a šesť priamych WebP dôkazov už sú v tomto commite. Deployment dpl_8DJcVDGp6LB2SxmbDUMtmdPKr7q7 je READY: https://kava-chatbot-backend-9twzo7mu9-danielvendzur-codes-projects.vercel.app/s5.html?demo=nafigate .

Dnes vlastné živé QA všetkých ôsmich koncových výsledkov: správna cena, balenie, konkrétne CTA v rovnakej karte, fotografie po skutočnom načítaní complete/naturalWidth1024. Reset použitý medzi všetkými výsledkami, čeština, viewport1363×936, bez horizontálneho pretečenia. Živé porovnanie Hyaluron Essential399Kč/20ml a Skin Restore614Kč/15ml ukazuje aj konkrétne odlišné zameranie. V posledných10 zachytených konzolových chybách iba chrome-extension metadata sender; nejde o úplný audit logov.0 modelových volaní. Dôkaz nafigate-preview-qa.json. Séria má osem vlastne Preview overených, stále bez nezávislého schválenia a produkcie.

Presný blok pred obnovením: pokus create_blob pre nafigate-screenshots.zip (1 180 231 B, očakávaný Git blob ae1793ce800a766a503c1cea784ebb6f6d759391) nedal výsledok a bol prerušený. Ranné read-only fetch_blob vrátilo404, teda archív nie je doložený ako uložený. Neriešim to opakovaním veľkého zápisu; originálny zip aj40 WebP sú zachované lokálne, menšie priame súbory sa uložia samostatne. Žiadne bežiace ref update sa neprepisuje. Poštu vôbec neotváram ani nemením; ranných19 správ je vec kontrolóra. Duben-Kaktus HOLD zostáva mimo tejto práce.


Uloženie dôkazov po obnove: všetkých chýbajúcich 34 menších WebP má potvrdený GitHub blob SHA; spolu so šiestimi už uloženými ide o všetkých 40 snímok z manifestu. Priebežný zoznam SHA je v nafigate-upload-progress.json. Archív zip sa nepovažuje za uložený; jednotlivé súbory sú plnohodnotné dôkazy a zachovávajú originálny manifest SHA256.


## Boemi – lokálne overené, Preview PENDING (10. 11.)

12 rôznych receptúr / 12 dosiahnuteľných výsledkov, osem otázkových uzlov. Lokálne 36 výsledkov /60 obrazoviek na320/390/1280px, bez fotografií12/20,0nálezov. Každý výsledok má načítanú oficiálnu fotografiu, presnú cenu/balenie/CTA, reset a nadviazanie. Štyri čipy40px, hover bez posunu, porovnanie dvoch odlišných výrobkov s opisom, mock čakanie a reduced motion.3backend mock volania,0platených. Vizuálne prezreté všetky výsledky na troch šírkach a osem otázok. Drobný široký avatar sa nahrádza oficiálnym faviconom; následná cielená kontrola je osobitný dôkaz.

Hlavný krém na ruky Shea150ml147Kč;70ml110Kč iba rozbaliteľný variant s presnou URL. Tělové máslo130ml220Kč a peeling150g250Kč používajú aktuálne oficiálne balenia aj keď staré URL obsahujú150ml/180g. Citrusový sprchový gél250ml140Kč má staré240ml v URL. Dobrovoľný nezvolený doplnok iba maslo220 + sprchový gél145=365Kč, rozpočet300 ho v jadre vylúči. Úvod rozpočet nesľubuje.

Pri obsahu sa našla heuristická zámena bambuckého krému/gélu za maslo. Dvojriadkový opt-in routineRoleVerified v jadre akceptuje iba explicitne uzamknuté overené S5 role. Boemi má doloženú rolu aj textúru; fingerprinty pripravených rolí/vlastností všetkých ôsmich starších katalógov sa nezmenili (verified-role-compatibility.json). Staré UI testy sa neopakovali.

Cosmetica Bohemica s.r.o./27888665, súvisiace obchod-boemi.cz a SK zastúpenie boemikozmetika.sk/47046635 skontrolované v91refs; bežné filtre, žiadny produktový chat pozorovaný pri home+produkt kontrole, iné režimy neisté. Doprava zdarma iba nad1200Kč podľa CZ maloobchodných OP. Kontakt info@boemi.cz z oficiálnych kontaktov; textový návrh NOT_READY447+10, pošta PENDING_CONTROLLER. Preview zatiaľ PENDING, nezapočítavať do ôsmich živých.


## Boemi – vlastné živé Preview12/12 (2026-11-10T07:24:59.127805+00:00)

Kód922cbf3a121faba3ed622c4a28d7cadb171b5411 / READY dpl_9fLJ4vgUyvQopJmTwC69EZtTyXBe. Preview: https://kava-chatbot-backend-qczt6lhux-danielvendzur-codes-projects.vercel.app/s5.html?demo=boemi

Vlastný cloud browser prešiel všetkých12koncových ciest s resetom medzi nimi,1363×936,čeština,bez horizontálneho pretečenia. Všetky fotografie po skutočnom načítaní800px(okrem Levandule1500px), presná cena/balenie/CTA v rovnakej karte. Overený variant70ml110Kč, doplnok pôvodne nezaškrtnutý220→365→220Kč, porovnanie mlieko127Kč150ml vs maslo220Kč130ml a štyri40pxčipy.0modelových volaní. JSON boemi-preview-qa.json obsahuje12skutočných DOM výsledkov overených proti oficiálnym faktom. Snímky Preview zachované aj ako samostatné WebP; lokálne všetkých12PNG. Celý lokálny56WebP dôkazový balík má manifest a viac samostatných archívov pod250KB, aby sa neopakoval veľký visiací upload.

Séria má deväť vlastne Preview overených ukážok. Žiadna produkcia ani zákaznícke schválenie; textové návrhyNOT_READY, poštaPENDING_CONTROLLER a bez zmien.

Ďalšia previerka: Big Blond Coffee / Beskydská pražírna kávy s.r.o./08181241 je HOLD_EXISTING_INTERACTIVE_ADVISOR. Vlastný browser otvoril home→Chci poradit→Jak připravujete kávu(6príprav)→espresso→Jaké preferujete chutě(3chute, odkazy na filtrované produkty). Nie je iba ľudský kontakt; už má výberový poradca. Bez rezervácie/kódu/správy. Pokračovať ďalšou vhodnou firmou, neobnovovať HOLD.


## Pokračovanie po deviatich Preview – Rubens rezervovaný

Najnovší úplný checkpoint1d2adf0013b1e13b99080db3499cfacd4e2ac775, Boemi kód922cbf3/dpl_9fLJ4vgUyvQopJmTwC69EZtTyXBe.56WebP snímok uložených v8samostatných archívoch(každý<250KB) s manifestmi a4priamymi Preview WebP. Žiadne čakanie na metadata-only build.

RaE a MYDLOVE sú existujúce ukážky vo vzdialenej sérii4 podľa domény aj prevádzkovateľa, preto HOLD_DUPLICATE; ich kód sa nemenil. Fresh91ref audit rae-mydlove-duplicates.json. RaE aktuálny prevádzkovateľ KULISH RADOMÍR/28569725; PCsupport.cz je tvorca webu.

Nový Rubens/mydlarnarubens.cz rezervovaný v coord/s5-claims a50a7366410911084b8808b06a4f9e9fb438c3ef po kontrole91refs aj rubensherbar.cz a Miloslavy Hrachovcovej/69282749. Živá home+šampón, cookies odmietnuté, Zeptat se otvoril Dotaz na prodejce; bez vyplnenia. Iné widgetové režimy nepreukázané. Aktuálne12receptúr zo13prezretých zdrojov:3šampóny,kondicionér,3pleťové oleje,2telové tuky,2peelingy,1roll-onbalzam. Všetky oficiálne fotografie vizuálne prezreté; webové WebP zachovávajú obsah originálnych PNG, iba znižujú veľkosť. Varianty15/45ml,140/350g a obaly nie sú ďalšie receptúry; ružový45mlvypredaný sa neponúka. Verzia balzamu označená pre alergikov nezaradená; normálny9gobsahuje ořechovéoleje a ponecháva konkrétne obmedzenie výrobcu. Bez SPF,liečenia či rastu vlasov.

Rubens kód zatiaľ lokálny WIP,12/12dosiahnuteľnosť potvrdenáoffline; QA3šírok beží a výsledok ešte nie je odovzdaný. PreviewPENDING. Ďalší krok: vyhodnotiť výsledok procesu,vizuálne prezrieť otázky/výsledky,uložiťruntime a skutočne overiť12Preview ciest.


## Rubens – lokálne QA dokončené, Preview PENDING

12/12hlavných výsledkov,7otázkových uzlov;36výsledkov/57obrazoviek na320/390/1280px,bezfotografií12/19,0nálezov. Ceny,bellenia,CTA,načítané fotografie,reset,nepredvolený kondicionér339,10Kčdokopy,porovnanie,čipy4×40px,kontrastnýoficiálnyavatar,hover,čakanie/reducedmotion a mockchat prešli.3základnébackendmock +2vylúčenieorechov,0platených.

Vizuálne prezreté12výsledkovna3šírkach a7otázok. Konfigurácia opravila nevhodnú fotku telovéhooleja pri kondicionéri na rozčesávanie, telovútextúru a čajovélístky pri heřmánku na kúpeľ. Zmenené kroky sa overili cielene3šírky, celý nezmenenýDFS sa neopakoval. Prechodové snímky boli znovu zachytené bez animácie.

Konkrétny nový QA nález: dotaz Nechci ořechové oleje, poraď balzám na rty predtým odporučil9g7Vit s orechovými olejmi. Pravidlo iba Rubens v S5reply teraz takýprodukt neodporúča a neponúka neoverenú alternatívu ako vhodnú pri alergii; prešlo priame aj nadväzujúce zadanie v backend mock a v skutočnom offlineUI. Spoločný engine a staréfirmy bez zmeny.

Úvod bez sľubu rozpočtu; hlavné varianty presne označené, bez vymyslených predvolených variantovýchURL (e-shop vyžaduje vlastný výber obalu/objemu). Žiadna výroba histórie,SPF,liečenia,rastu vlasov či hypoalergénnych garancií. Zdroj dopravy je aktuálne načítaný oficiálny modal: PPL114/Parcelshop79,od3000Kčzdarma; UI uvádza zostávajúcu sumu a podmienky e-shopu.

Email je iba textovýNOT_READY447+10sinfo@mydlarnarubens.cz z kontaktov. Pošta bez zmien, produkciaNOT_DEPLOYED. Preview zatiaľPENDING; počet stáledeväť.


## Rubens – vlastné živé Preview12/12 (2026-11-10T08:03:35.999977+00:00)

Runtime02fb9b27dd0571367bcb3409720b8d2be2d7868c / READYdpl_8WtE4FoJJwsouyj54FQyMdUJsCHV. Preview: https://kava-chatbot-backend-7klg6aubb-danielvendzur-codes-projects.vercel.app/s5.html?demo=rubens

Vlastný browser1363×936 prešiel12/12koncových výsledkov, všetkyfotografiecomplete/naturalWidth1024, presné ceny,belenia aCTA vtejistejkarte. Reset medzi všetkými výsledkami a nakoniec4oblasti. Doplnok nezaškrtnutý,150→339,10→150Kč. Porovnanie dvoch odlišných receptúr telového tuku(Tropiqueovocná vôňa vs rakytníkbezvône),277,60Kč/140gobidva,s konkrétnym opisom,nie rovnakými všeobecnými vlastnosťami. Čipy4×40px,čeština,bez pretečenia.0modelovýchvolaní. Obmedzenie orechov sa živým modelom netestovalo, ibaoffline/mock.

Séria má desať vlastne Preview overených ukážok. Žiadna produkcia ani zákaznícke schválenie. Samostatné WebPPreview aJSONobsahujú aktuálne overené výsledky; všetkých63lokálnych WebP je pripravených v9samostatných malých archívoch s manifestom, ich upload sa potvrdzuje jednotlivo. Ďalej preveriť Alchymistky a Mýdlárna Šafrán, bez rezervácie pred živou kontrolou widgetov a prevádzkovateľov.

Uloženie Rubens dôkazov: všetkých9samostatných archívov(63WebP) a4priame PreviewWebP majú potvrdené GitHub blob SHA. rubens-proof-upload-progress.json a manifest archívov ukladajú presné cesty/SHA256.


## Rubens – deterministické vylúčenie pred modelom

Dodatočné spevnenie: samotný správny lokálny draft ešte umožňoval jeho preformulovanie poskytovateľom. Vylúčenie orechových olejov Rubens sa preto teraz vracia priamo pred volaním modelu. Významový test dáva modelovému mocku zámerne vyhodiť chybu, ak by bol oslovený: priamy aj nadväzujúci dotaz prešli s0volaniami; bežný dotaz zostáva1mockvolanie. Žiadne platenétesty a súbor api/ai-chat.js/model/kľúče bez zmeny. OfflineUI oboch správ po úprave prešlo. Zmena iba S5exclusion helper a jeho backend spotreba;12produktov,strom,fotky arozhranie bez zmeny. Kompletné živé12/12 dokázané na02fb9b27/dpl_8WtE4FoJJwsouyj54FQyMdUJsCHV; nový backendovýdelta sa odovzdáva s vlastnýmSHA, bez predstierania ďalšieho plného PreviewQA.

Alchymistky zatiaľ NEREZERVOVANÉ: aktuálny officialweb bol úspešne získanýwebretrievalom; prehliadka vlastného widgetu však skončila Page.navigate timedout a následne Page.getFrameTree timedout na novej about:blankkarte8. Nie je to dôkazbota ani nefunkčnostiwebu. Pred kódom treba dokončiť živúhome+produkt kontrolu. Predbežný91refaudit domény/IČO06542433/Alchemix bez zhody; slovo alchymistky v7starýchrefs je iba opis produktuALCHYMISTKA(pimpinella.co/alchymistka/), nie táto značka ani operátor. Šafrán predbežne bez domény/menaoperátora; IČO76267334 ešte doplniťdoauditu a živúkontrolu.


## 2026-11-10 — Scentisimo integration and evidence recovery

Current detailed checkpoint: `odovzdanie-20261110-scentisimo.md`.13 own Preview-verified; Scentisimo36/36 local results +15question pages +3backend mock, live12routes PENDING. All38evidence archives uploaded with explicit owner authorization, remain excluded from Vercel. No paid calls, production or mailbox actions. Existing older WIP preserved. Existing colleague branch9d756370 imported; browser chat blank, async handoff in perfume-fragments/MAIN-TO-PERFUME-20261110.md. Next actual step publish runtime then own live QA.
