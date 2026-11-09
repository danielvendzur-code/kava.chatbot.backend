# Séria 5 – rezervácie firiem (Codex A / Codex B)

Pred začatím firmy: `git fetch` → skontroluj, že tu doména nie je → pridaj riadok → commit → push (pri odmietnutí `git pull --rebase`, znova skontroluj).
Duplicitu kontroluj podľa **domény** aj vo všetkých Vercel projektoch (`*.mojchatbot.sk`), vetvách repozitára a v `kandidati.md` série 4.

Stavy: rezervované → postavené → otestované → nasadené (doména) | HOLD (dôvod)

| doména | slug | Codex | dátum čas | stav / dôvod |
|---|---|---|---|---|
| vaanok.sk | vaanok | séria 4 (Claude) | 2026-11-08 | hotové – nebrať |
| musiprirodne.sk | musi | S5-SOLO | 2026-11-09T12:03:25.350678+00:00 | HOLD_EXISTING_PRODUCT_CHAT – kontrolór: Storekick, uvítanie výberu produktu, produktové karty, input a Stop generation na https://www.musiprirodne.sk/; nič neodoslané; 2026-11-09 |
| nutt.cz | nutt | S5-SOLO | 2026-11-09 | preview_verified – SHA 2fe18852b36ce0904df2b29dbfd65fdc2b0f2809; 9 produktov, offline/mock QA + živý Preview výsledok; Petr Bartoš / 76374939 z aktuálnych OP; Smartsupp otvorený: iba Zavolejte nám na 775010550, prázdny log, bez správy; duplicita v 90 vetvách iba historický kandidát; globálny Vercel a Odoslané PENDING |
