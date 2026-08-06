# Pražiareň Jolka — audit pred/po

Dátum kontroly: 6. august 2026  
Vetva: `agent/jolka-modern-craft`

## Rozsah

Úprava je izolovaná na osobitný Jolka entrypoint. Ostatné firemné varianty, API routy, environment variables a staré coffee v2–v7 súbory neboli upravené. Nebol vytvorený ďalší patch ani override súbor.

## Audit pred úpravou

Aktívny Jolka variant používal spoločný `coffee-v8.js` a `coffee-v8.css` systém spolu s dodatočnými súbormi `coffee-v8-refine.css`, `coffee-v8-patch.js` a `coffee-brand-overrides.js`.

Zistené problémy:

- tmavá ružovo-hnedá `#3d3035`, svetloružový akcent `#ead9df` a ružovkastý surface nepôsobili moderne ani technologicky,
- rovnaký symbol poradcu a rovnaká landing kompozícia ako pri ostatných značkách,
- neplatná HTML štruktúra: tlačidlo na zatvorenie bolo vnorené do tlačidla teaseru,
- prázdny telefón a kontakt smerujúci na nesprávnu podstránku,
- CTA po konfigurácii smerovalo iba na všeobecný e-shop, nie na vybraný produkt,
- opis Vietnamu bol príliš všeobecný a nezodpovedal konkrétnym oficiálnym tónom,
- skórovanie bolo generické podľa prípravy/chuti/mlieka/kofeínu a nerozlišovalo päť dôležitých Jolka nákupných smerov,
- výsledok nevysvetľoval aciditu bežným jazykom a zobrazoval dve alternatívy,
- viacero informačných textov a stavov bolo typograficky príliš drobných,
- Jolka bola závislá od ďalších refine/patch vrstiev namiesto jedného príčinného systému.

## Stav po úprave

### Vizuálny systém

- farby: tmavá zelená `#183a32`, svetlá smotanová `#f7f4ec`, jemný sage `#c7d3c4`,
- žiadna oranžová, bronzová, ružovo-hnedá, kraft textúra ani vintage dekor,
- pokojná landing kompozícia s jednou vetou, tromi benefitmi, jednou ukážkou výsledku a jedným hlavným CTA,
- samostatný Jolka entrypoint s jedným CSS a jedným JavaScript súborom,
- notebooková výška 768 px sa zmestí bez zbytočného scrollovania.

### Nový znak poradcu

Znak je vytvorený iba dvoma SVG cestami. Vonkajšia línia je súčasne komunikačná bublina a obrys kávového zrna. Vnútorná línia vytvára písmeno J a zároveň pripomína rez zrna. Nie je to J nalepené do generickej bubliny.

Pri otvorení sa obe línie krátko dotiahnu. Pri úspešnom dokončení výberu sa zobrazí jeden jemný pulse. `prefers-reduced-motion` skracuje animácie na prakticky nulové trvanie.

### Poradca a skórovanie

Štyri otázky:

1. nákupný smer: klasika / do mlieka / vyvážená / ovocná / experiment,
2. spôsob prípravy,
3. čierna alebo mliečna káva,
4. tolerancia prirodzenej acidity.

Nákupný smer má najvyššiu váhu. Príprava a acidita spresňujú výsledok. Osobitné bonusy rozlišujú:

- Zmes Jolka ako bezpečnú klasiku,
- Zmes Čokoláda ako výraznejšiu voľbu do mlieka,
- El Salvador ako vyvážený prechod,
- Ethiopia Sidamo ako čistý ovocný filter,
- Vietnam Lang Biang ako netradičný anaeróbny experiment.

Výsledok obsahuje konkrétny produkt, cenu od najnižšieho balenia, tri chuťové tóny, normálne vysvetlenie acidity, odporúčanú prípravu, dôvod, presne jednu alternatívu a priamy produktový odkaz.

### Kontakt a odkazy

- telefón: `+421 907 736 454`,
- kontakt: `https://www.praziarenjolka.sk/kontakty/`,
- e-shop: `https://www.praziarenjolka.sk/shop/`.

## Overené produkty

| Produkt | Cena použitá v ukážke | Priamy odkaz | Stav |
|---|---:|---|---|
| Zmes Jolka | od 5,90 € | https://www.praziarenjolka.sk/produkt/zmes-jolka/ | dostupná produktová stránka |
| Zmes Čokoláda | od 5,90 € | https://www.praziarenjolka.sk/produkt/zmes-cokolada/ | dostupná produktová stránka |
| Ethiopia SIDAMO GR.2 | od 5,90 € | https://www.praziarenjolka.sk/produkt/ethiopia-sidamo/ | dostupná produktová stránka |
| Vietnam Lang Biang – Anaerobic Natural | od 6,50 € | https://www.praziarenjolka.sk/produkt/vietnam-lang-biang-anaerobic-natural/ | dostupná produktová stránka |
| El Salvador SHG EP | od 5,90 € | https://www.praziarenjolka.sk/produkt/el-salvador-shg-ep/ | dostupná produktová stránka |

Ukážka nepovažuje cenu za cenu konkrétneho nakonfigurovaného balenia. Zobrazuje iba bezpečné „od“ a pred nákupom otvorí aktuálnu produktovú stránku.

## Testy

Výsledok: **24/24 prešlo**.

- 1440 × 900 desktop landing a výsledok,
- 1366 × 768 notebook bez scrollu landing stránky,
- 390 × 844 mobilný fullscreen a Sidamo tok,
- 360 × 800 mobilný chat a API fallback,
- klasický tok → Zmes Jolka,
- ovocný tok → Ethiopia SIDAMO GR.2,
- experimentálny tok → Vietnam Lang Biang,
- návrat so zachovaným selected stavom,
- reset,
- výber 250 g a mletia espresso,
- priamy produktový odkaz,
- presne jedna alternatíva,
- API odpoveď aj fallback,
- blokovanie scrollu pozadia,
- focus trap a zatvorenie Escape,
- bez horizontálneho overflow,
- reduced motion,
- bez JavaScript runtime chýb,
- bez vnoreného `button button`.

Prehliadač v pracovnom prostredí blokoval navigáciu na localhost aj `file://`. Testovací runner preto načítal nezmenený obsah `jolka.html`, `jolka.css` a `jolka.js` do inline dokumentu; nejde o inú testovaciu implementáciu.

## Upravené súbory

- `jolka.html` — samostatný, semantický Jolka entrypoint,
- `jolka.css` — kompletný vizuálny a responzívny systém,
- `jolka.js` — logo, skórovanie, výsledok, balenie/mletie, chat, fallback a prístupnosť,
- `vercel.json` — iba špecifické routovanie `/ukazka/jolka` pred existujúcim generickým routovaním,
- `JOLKA_AUDIT.md` — tento audit a overenie.

## Nasadenie

Nebolo vykonané nasadenie na Vercel, preview deployment, otvorenie pull requestu ani merge do `main`.
