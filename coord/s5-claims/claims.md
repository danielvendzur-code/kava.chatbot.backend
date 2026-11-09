# Séria 5 – rezervácie firiem (Codex A / Codex B)

Pred začatím firmy: `git fetch` → skontroluj, že tu doména nie je → pridaj riadok → commit → push (pri odmietnutí `git pull --rebase`, znova skontroluj).
Duplicitu kontroluj podľa **domény** aj vo všetkých Vercel projektoch (`*.mojchatbot.sk`), vetvách repozitára a v `kandidati.md` série 4.

Stavy: rezervované → postavené → otestované → nasadené (doména) | HOLD (dôvod)

| doména | slug | Codex | dátum čas | stav / dôvod |
|---|---|---|---|---|
| vaanok.sk | vaanok | séria 4 (Claude) | 2026-11-08 | hotové – nebrať |
| musiprirodne.sk | musi | S5-SOLO | 2026-11-09T12:03:25.350678+00:00 | HOLD_EXISTING_PRODUCT_CHAT – kontrolór: Storekick, uvítanie výberu produktu, produktové karty, input a Stop generation na https://www.musiprirodne.sk/; nič neodoslané; 2026-11-09 |
| nutt.cz | nutt | S5-SOLO | 2026-11-09 | preview_verified – SHA 9bb671eb81385353f46c8afb776af37a9203aac8; 9 produktov, offline/mock QA + živý Preview výsledok; Petr Bartoš / 76374939 z aktuálnych OP; Smartsupp otvorený: iba Zavolejte nám na 775010550, prázdny log, bez správy; duplicita v 90 vetvách iba historický kandidát; globálny Vercel a Odoslané PENDING |
| pleva.cz | pleva | S5-SOLO | 2026-11-09 | preview_verified – SHA 9bb671eb81385353f46c8afb776af37a9203aac8, READY dpl_8uJD1BBJUKRvPi2VFo84LtaxHaiF, všetkých 12 výsledkov overených na Preview, e-mail NOT_READY; 12 produktov, 21 listov, 63 výsledkov/93 obrazoviek na 3 šírkach, 0 nálezov; Pleva s.r.o. / 48153061, aktuálne /s/conditions; /advisor sú články; SupportBox otvorený: Momentálně tu nejsme, Zuzána/Lucie/Markéta, kontaktný formulár, bez správy; 90 vetiev bez domény/IČO; obrat a globálne kontroly PENDING |
| jagaia.cz | jagaia | S5-SOLO | 2026-11-09 | preview_verified – SHA fa37d0d6c9cb7c3f6d42841eac4cc0ce0baf6495, READY dpl_HxLY8ZJzNuL71TCDqyNvYYDxwnab, 8/8 výsledkov vlastné živé QA, e-mail NOT_READY; JAGAIA s.r.o. / 10863907, aktuálne OP; info@jagaia.cz; 91 vetiev bez domény/IČO/kontaktu, historické prílohy bez firmy; živá home + BREATHE IN: žiadny produktový chat nepozorovaný, iba newsletter 15 % ANO/NE; cookies iba nevyhnutné, iné režimy neisté; štandardné balenia overené, 33 ml séra a 15 ml oleje, globálne Vercel a Odoslané PENDING |
| kosmetikacapri.cz | capri | S5-SOLO | 2026-11-09 | local_verified – 9 produktov, 33 výsledkov/57 obrazoviek na 3 šírkach, 0 nálezov, 385→881→385 Kč doplnok, Preview pending; Kosmetika CAPRI spol. s r.o. / 62910566, info@kosmetikacapri.cz z aktuálnych kontaktov; alias lachevre.cz, značky La Chévre/Le Chaton/Capramedic; 91 vetiev bez domén/IČO/kontaktu, prílohy bez firmy; živá home+produkt: bez pozorovaného chatu, Zeptat se otvorí Dotaz na prodejce (e-mail/telefón/správa/CAPTCHA), nič vyplnené; Tipy a rady sú 3 články; iné cookie/session režimy neisté; tržby, globálny Vercel a Odoslané PENDING |
| botanicaslavica.eu | botanica | S5-SOLO | 2026-11-09 | HOLD_DUPLICATE_OPERATOR_AND_DOMAIN – už existuje ako botanica; aktuálne kontakty Soaphoria.sk s. r. o. / 56351747, aj Soaphoria je existujúca firma; nebrať |
| aromatica.cz | aromatica | S5-SOLO | 2026-11-09 | reserved – AROMATICA CZ s.r.o. / 26963523 z čerstvo načítaných OP, eshop@aromatica.cz z živej pätičky; 91 vetiev bez domény/IČO, prílohy bez slugu; živá home + Ectoin produkt: žiadny chat nepozorovaný, ZEPTAT SE NA PRODUKT otvorí Dotaz na prodejce (e-mail/telefón/správa/CAPTCHA), nič vyplnené; /dotaznik je marketingový prieskum s Google Forms, neotvorený/nevyplnený; iné cookie/session režimy neisté; tržby, globálny Vercel a Odoslané PENDING |

