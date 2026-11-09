# S5-SOLO – prvá nová ukážka na kontrolu

Pracovná vetva `codex/s5-solo-20261109`; východisko `6568fc1380a3fae796f4413256c4b61fd5647e99`. Predchádzajúci vzdialený checkpoint `e8556dd6bd7349fc973a3ea35b323681d35196a6`. Pracuje jeden worker, bez subagentov. Bežný git push nemá credential; zápisy cez GitHub konektor, bez force, main/master a PR.

## NUTT – nutt.cz – local_verified, Preview čaká
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
Preview cieľ: nový deployment pracovnej vetvy existujúceho projektu, bez produkčných aliasov. Produkcia: **NOT_DEPLOYED**. Nová subdoména na návrh: `nutt.mojchatbot.sk`; DNS/nameservery a aliasy nezmenené. Kontrolór: **PENDING**; majiteľ: **PENDING**. Vzdialený build a URL budú doplnené po ich skutočnom zistení.

## Koncept e-mailu – NOT_READY, neodoslané, nenaplánované
Kontakt: radost@nutt.cz. Predmet: Výběr bambuckého másla přímo pro NUTT

Dobrý den,
připravil jsem pro NUTT ukázku průvodce a chatbota, který zákazníkovi pomůže vybrat mezi máslem v kelímku a tuhým máslem do sprchy a zohlední jeho oblíbenou vůni. Dva produkty také porovná vedle sebe.
[ŽIVÝ FIREMNÍ ODKAZ doplnit až po ověření domény; Preview sem nepatří.]
Nasazení stojí 447 € jednorázově a provoz 10 € měsíčně, bez zkušebního období. Měli byste zájem ukázku projít?
S pozdravem
Vendžúr
https://mojchatbot.sk

## Presný ďalší krok
Uložiť otestovaný zdroj a dôkazy na pracovnú vetvu; overiť nový Preview na konkrétnom SHA bez obchádzania ochrany. Pri blokovanej ochrane označiť iba Preview HOLD a pokračovať lokálnou prácou. Ďalší kandidát Pleva (pleva.cz / 48153061): zatiaľ nerezervovaný, treba živý widget/poradcu, veľkosť a zdroje; Onclé PRICING_REVIEW (veľký prevádzkovateľ Melitrade), FOR LIFE & MADAGA HOLD (sprievodca výberom).
