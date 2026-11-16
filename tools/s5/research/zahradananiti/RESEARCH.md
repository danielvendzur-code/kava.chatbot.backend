# Zahrada na niti

Kandidát na poradcu pre výber izbových rastlín podľa svetla a preferovaného tvaru či zálievky. Oficiálne podmienky uvádzajú koke no koke s.r.o., IČO 06096221. Katalóg 23 konkrétnych produktových stránok poskytol 17 dostupných variantov v 15 produktoch. Vybraných 12 rastlín má doloženú cenu, rozmer pestovateľského kvetináča, odporúčané svetlo, zálievku a použiteľnú oficiálnu fotografiu. Pri cik-cak kaktuse stojí skladom dostupný variant Ø 12 cm 490 Kč. Lacnejší variant bol v zdrojových údajoch vypredaný.

- [Katalóg izbových rastlín](https://www.zahradananiti.cz/pokojove-rostliny/)
- [Firemné obchodné podmienky](https://www.zahradananiti.cz/obchodni-podminky/)
- [Pilea pepřincová](https://www.zahradananiti.cz/pokojove-rostliny/pilea-peprincova/)
- [Najčastejšie otázky](https://www.zahradananiti.cz/nejcastejsi_dotazy/)

## Chat obchodu

V relácii Chrome 16. novembra 2026 bol na úvodnej stránke a na stránke Pilea pepřincová otvoriteľný widget Smartsupp. Po prijatí cookies ukazoval „Napište nám“ a „Odpovíme hned, jak budeme online!“. V otvorenom logu neboli produktové návrhy. Nenašiel som automatický výber produktu v tomto stave. Správa ani formulár sa neodoslali. Oficiálne FAQ odkazuje na tento chat aj pri dostupnosti kokedám. Odpoveď pri aktívnej obsluhe alebo po odoslaní prvej správy je neoverená.

## Duplicity

V stave k 16. novembru sa nenašla zhoda pre názov, doménu, IČO alebo prevádzkovateľa v claims.md ani v zozname súborov vyhradených rezervácií. Kontrola 21 relevantných úplných stromov vetiev, deviatich verzií registra, histórie a dokumentov kandidátov vrátane série 4 tiež bez zhody. Vyhľadanie pomenovaní vetiev, commitov podľa domény a IČO, Vercel projektov podľa slugu a presnej aliasovej domény vrátilo nula záznamov alebo 404. Globálne overenie ostatných účtov a Odoslaných zostáva mimo tejto relácie.

## Lokálna ukážka

Súbory demo.json a catalogue.js fungujú s existujúcim S5 výberom pod slugom zahradananiti. Dve otázky vedú k jednému z 12 overených odporúčaní. Pole selection-model.json obsahuje zdrojový rozpis štyroch stanovišť. Obrázky v images/ sú oficiálne fotografie, logo a kvetinová ikona. Karty uvádzajú rozmer pestovateľského kvetináča, vybranú cenu a odkaz priamo na oficiálny produkt. Pri variantoch sa voľba vykonáva na stránke predajcu.

Lokálny Chromium overil všetkých 36 ciest pri 320, 390 a 1280 px. Dôkazy sú v qa/. catalogue-reply.js obsahuje českú vetvu odpovedí z katalógu so siedmimi kontrolami v test-chat.cjs. Štyri odpovede vrátane porovnania dvoch rastlín prešli aj v izolovanom Chromium s vynúteným offline režimom. Pre serverovú integráciu treba pridať import katalógu, dispatch tejto vetvy v S5 a registráciu do cosmetics-chat. Výsledok zatiaľ nemá Vercel Preview ani rezerváciu.
