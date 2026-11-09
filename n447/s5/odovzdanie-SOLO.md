# S5-SOLO – priebežný checkpoint

Vetva: `codex/s5-solo-20261109`. Východiskový SHA: `6568fc1380a3fae796f4413256c4b61fd5647e99`. Vzdialená vetva vytvorená. Bežný git push nemá credential; GitHub connector funguje. Žiadny main/master/PR.

## Muši – HOLD_EXISTING_PRODUCT_CHAT
- musiprirodne.sk, Zuzkoris s.r.o., IČO 54529514; kontakt z https://www.musiprirodne.sk/pages/contact.
- Rezervácia zapísaná v `claims.md` vetvy `coord/s5-claims`, SHA `84a1ea5837bd693a7a47ffcc2338a12b453a6082`; zmena na HOLD bude nasledovať.
- Kontrolór nezávisle našiel Storekick produktový chat na https://www.musiprirodne.sk/: uvítanie „Vitaj u nás ♥︎ Radi Ti poradíme s výberom vhodného produktu.“, karty Levanduvláska a V náruči Jemnosti, pole „Opýtajte sa čokoľvek…“ a „Zastaviť generovanie“. Bez odoslanej správy.
- Firemnú ukážku zastavená. Rozpracované dáta nie sú hotový výstup; žiadny Preview/produkcia/e-mail.
- Vlastná kontrola textovej navigácie widget nezachytila; netvrdíme neprítomnosť poradcu.

## Spoločný základ – WIP
- S5 samostatný vstup `s5.html`, boot/config, kompaktný výsledok, profil, nepovinný doplnok bez predvoľby a súčet; používa CXAdvisorCore. Zmeny spoločných súborov pod CX_S5 guardom.
- Pre S5 vypnuté simulované postupné vypisovanie hotovej odpovede. Produkčný Sonnet/API kľúče nezmenené, platené testy 0.
- QA zatiaľ NIE je dokončené. Playwright balík je dostupný; štandardný download browsera zlyhal (neplatný ZIP). Pripravuje sa npm Chromium.
- Lokálny server: `node tools/s3a/serve.mjs <repo> 8997`, sieť fetch v serveri vypnutá.

## Duplicity a kontrola pošty
- Prehľadaných 90 vzdialených vetiev podľa domén a dostupných prevádzkovateľov/IČO; aktuálny zoznam Vercel konektora: 1 tím, 1 projekt, 50 domén, next null. NIE globálna kontrola mimo dostupného tímu. Historický register má ďalšie existujúce firmy.
- Kontrolór: Odoslané 201 správ, Rozpísané 27, hľadanie musiprirodne 0. Úplná kontrola kontaktu/prevádzkovateľa PENDING. Nič neodoslané ani naplánované.

## Presný ďalší krok
Označiť vzdialenú rezerváciu Muši HOLD, overiť živý web NUTT vrátane widgetov bez kontaktovania firmy; skontrolovať IČO, sortiment a varianty, prípadne zvoliť iného skincare kandidáta. Dokončiť prvú vhodnú firmu pred dávkou.
