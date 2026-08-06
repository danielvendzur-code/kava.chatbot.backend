# Káva Víťazov — conversion system audit

Dátum kontroly: 6. 8. 2026  
Pracovná vetva: `agent/vitazov-conversion-system`

## Rozhodnutie

Počet rozhodovacích krokov zostáva **štyri**, ale pôvodné všeobecné poradie `príprava → chuť → nápoj → kofeín` bolo nahradené tokom:

1. **Použitie** — domov, kancelária, automat, filter/objavovanie.
2. **Očakávanie od chuti** — silná, jemnejšia, ovocnejšia alebo bezkofeínová.
3. **Príprava** — automat, páka, moka alebo filter.
4. **Nápoj** — čierna, s mliekom alebo oboje.

Piaty krok nebol pridaný. Bezkofeínová požiadavka je rozhodujúci chuťovo-funkčný zámer a je preto súčasťou druhého kroku. Takto poradca zachová krátky tok, no rozlíši kancelársku prevádzku, silnú nízkoacidnú kávu, jemnejšiu 100 % arabiku, výberovú kávu aj decaf.

## Audit pred úpravou

- Jedno generické logo pre všetky značky; Káva Víťazov nemala vlastnú rozpoznateľnú značku poradcu.
- Všetky demá používali takmer identickú vizuálnu a informačnú štruktúru.
- Teaser obsahoval tlačidlo vložené do iného tlačidla. Samostatný patch JavaScript následne opravoval poškodený DOM.
- Samostatný refine CSS súbor opravoval selected/muted stavy po načítaní hlavného CSS.
- Prvý krok sa pýtal na kávovar, hoci najsilnejšie obchodné rozlíšenie značky je použitie: domácnosť, firma, automat alebo objavovanie.
- Výsledok ukazoval generické percento zhody, ale nevysvetľoval presne pre koho je produkt, do čoho patrí a aká je alternatíva.
- Falošný medzikrok balenia a mletia ponúkal všeobecné varianty 250/500/1000 g bez väzby na reálne varianty produktu.
- Telefón bol prázdny; fallback správanie vytváralo generický kontakt.
- Prepnutie do chatu mohlo na desktope automaticky zaostriť input. Na dotykových zariadeniach to zvyšovalo riziko nechceného otvorenia klávesnice.
- Muted možnosti pôsobili deaktivovane a menšie mobilné texty znižovali čitateľnosť.
- Scroll stránky bol blokovaný iba cez `overflow: hidden`, bez spoľahlivého zachovania pozície na mobile.

## Audit po úprave

- Nové logo spája dve polovice kávového zrna do jemného `V`; koncový bod funguje ako komunikačné/výberové potvrdenie. Rovnaká značka funguje v launcheri, hlavičke, avatari a produktovej vizualizácii.
- Logo sa pri otvorení raz zostaví a pri výsledku jemne potvrdí výber. Pri `prefers-reduced-motion: reduce` sa animácie skrátia na prakticky nulové trvanie.
- Teaser má platný DOM bez nested button a bez opravného patch skriptu.
- Finálne CSS moduly obsahujú selected stavy priamo; neaktívne možnosti zostávajú čitateľné a nepôsobia disabled.
- Landing obsahuje jednu headline, jednu krátku vetu, tri konkrétne benefity a jediné dominantné CTA.
- Preview ukazuje reálny produkt Office Blend, cenu, použitie, chuťové značky, dôvod a konkrétne CTA.
- Výsledok obsahuje: pre koho, vhodnú prípravu, chuťový profil, dôvod výberu, alternatívu a priamy produktový odkaz.
- Kancelársky výsledok sa zobrazí bez ďalšej bariéry. Až pod ním je voliteľná spotreba `do 1 kg / 1–3 kg / 4+ kg` a kontakt pre firmu.
- Telefón sa nezobrazuje. Aktuálna kontaktná stránka a obchodné podmienky uvádzajú dve odlišné čísla, preto poradca používa overenú kontaktnú stránku a `kontakt@kavavitazov.sk`.
- Prepínač režimov nefocusuje input. Mobilný browser test potvrdil, že po otvorení výberu nie je aktívny `chatInput`.
- Otvorený panel fixuje body, zachová scroll pozíciu a vnútorné oblasti používajú `overscroll-behavior: contain`.
- Pri API chybe sa zobrazí označená lokálna odpoveď namiesto prázdneho alebo rozbitého stavu.

## Overené produkty a odkazy

Ceny boli overené v aktuálnom obchode 6. 8. 2026. Produktové vlastnosti sú založené na oficiálnych produktových stránkach.

| Produkt | Aktuálna cena od | Priamy odkaz | Použitie v poradci |
|---|---:|---|---|
| Office Blend | 15,90 € | https://kavavitazov.sk/espresso-blend/ | kancelária, automat, silnejšia káva, mlieko, nízka výraznosť acidity |
| Victory Blend | 17,90 € | https://kavavitazov.sk/blend-arabica/ | univerzálna 100 % arabika, hladší každodenný profil |
| Brazília | 16,90 € | https://kavavitazov.sk/kava-brazilia/ | jemná single-origin arabika, lieskovce, mierna kyslosť |
| Etiópia | 19,90 € | https://kavavitazov.sk/prazena-kava-etiopia/ | výberová arabika Sidamo, korenistá aróma, višňová dochuť, objavovanie |
| Bezkofeínová | 17,90 € | https://kavavitazov.sk/bezkofeinova-decaf/ | brazílska 100 % arabika, Swiss Water decaf |

Ďalšie overené odkazy:

- Obchod: https://kavavitazov.sk/obchod/
- Kontakt: https://kavavitazov.sk/kontakt/
- E-mail: `kontakt@kavavitazov.sk`

## Referenčné princípy

- **Derat:** stabilný panel, jasná kompaktná hierarchia, kontakt pri spodnej hrane, reset/zatvorenie a odolný fallback.
- **Môj Plot:** silný teaser, vyklikaný postup, rekapitulácia a jednoznačná ďalšia akcia.
- **Môj Chatbot:** segmentovaný prepínač, postupné odhaľovanie možností, selected stav bez miznutia textu a konzistentná typografia.

Vizuál ani obsah neboli skopírované. Prevzaté boli len overené systémové princípy.

## Browser QA

Automatizovaná kontrola prešla **29/29** bodov v lokálnom Chromiu:

- 1440 × 900: landing, chat a API fallback, kancelársky výsledok a voliteľná spotreba.
- 1280 × 720: domáci tok, návrat späť, reset.
- 390 × 844: decaf výsledok, panel v bezpečnej ploche, bez horizontálneho overflow.
- 360 × 800: prvý krok, selected stav, čitateľnosť všetkých možností, zatvorenie.
- Reduced motion: nulové praktické trvanie animácií a okamžitý prechod kroku.
- DOM: žiadne nested button, žiadny prázdny `tel:` odkaz.
- Scroll: body je počas otvorenia fixnuté.
- Keyboard: prepnutie do výberu neaktivuje chat input.

Výsledky: `artifacts/vitazov/qa-report.json`

## Screenshoty

V branchi je jeden kontaktový hárok so všetkými ôsmimi kontrolovanými stavmi:

- `artifacts/vitazov/vitazov-contact-sheet.webp`

Plné PNG súbory boli vytvorené lokálne pre výstup a zahŕňajú landing, chat fallback, kancelársky výsledok, kancelársky follow-up, domáci výsledok, decaf mobil, mobilný selected stav a reduced motion.

## Delivery guardrails

- Žiadny Vercel deployment ani preview.
- Žiadny merge do `main`.
- Žiadna zmena API endpointu, environment variables alebo serverless architektúry.
- Aktívny JavaScript entrypoint je `coffee-v8.js`. `coffee-v8.css` je čistý CSS entrypoint, ktorý importuje päť finálnych tematických modulov; patch a refine vrstva boli odstránené z načítania aj z vetvy.
