# Séria 5 – rezervácie firiem (Codex A / Codex B)

Pred začatím firmy: `git fetch` → skontroluj, že tu doména nie je → pridaj riadok → commit → push (pri odmietnutí `git pull --rebase`, znova skontroluj).
Duplicitu kontroluj podľa **domény** aj vo všetkých Vercel projektoch (`*.mojchatbot.sk`), vetvách repozitára a v `kandidati.md` série 4.

Stavy: rezervované → postavené → otestované → nasadené (doména) | HOLD (dôvod)

| doména | slug | Codex | dátum čas | stav / dôvod |
|---|---|---|---|---|
| vaanok.sk | vaanok | séria 4 (Claude) | 2026-11-08 | hotové – nebrať |
| musiprirodne.sk | musi | S5-SOLO | 2026-11-09T12:03:25.350678+00:00 | HOLD_EXISTING_PRODUCT_CHAT – kontrolór: Storekick, uvítanie výberu produktu, produktové karty, input a Stop generation na https://www.musiprirodne.sk/; nič neodoslané; 2026-11-09
| nutt.cz | nutt | S5-SOLO | 2026-11-09 | preview_verified – SHA 59395937ead6802ca0027182ca144c893cf28a3f; 9 produktov, všetkých 9 ciest na Preview; Petr Bartoš / 76374939; ľudský kontaktný stav Smartsupp pozorovaný, iné režimy neisté; globálny Vercel a Odoslané PENDING |
| pleva.cz | pleva | S5-SOLO | 2026-11-09 | preview_verified – 9bb671eb81385353f46c8afb776af37a9203aac8, READY dpl_8uJD1BBJUKRvPi2VFo84LtaxHaiF, 12/12 výsledkov živé QA; Pleva s.r.o. / 48153061; SupportBox ľudský kontaktný stav, iné režimy neisté; globálne kontroly a Odoslané PENDING |
| jagaia.cz | jagaia | S5-SOLO | 2026-11-09 | local_verified – 8 produktov, 57 výsledkov/87 obrazoviek, 0 nálezov; rezervácia 7a493ed37967223d350a9a0fb6cd10dc8746fb76; JAGAIA s.r.o. / 10863907; živá home a BREATHE IN bez pozorovaného produktového chatu, iba newsletter 15 %, iné cookie režimy neisté; globálne Vercel a Odoslané PENDING |

