# Kaffa Roastery — UX/product audit

## Audit pred úpravou

- Kaffa používala rovnaký generický symbol a takmer identickú tmavozelenú/mintovú paletu ako ostatné varianty.
- Landing súťažil s poradcom tromi benefitmi a veľkým preview panelom, takže pôsobil ako druhý e-shop namiesto obchodnej ukážky.
- Produktové odporúčania neobsahovali priame odkazy na konkrétne produkty a časť cien/názvov už nezodpovedala aktuálnej ponuke.
- Teaser mal neplatnú vnorenú button štruktúru a opravoval sa až po renderi cez `coffee-v8-patch.js`.
- Aktívna Kaffa cesta načítavala dve CSS vrstvy, základný renderer, brand overrides a DOM patch.
- Ovocnosť bola vysvetlená príliš všeobecne; nerozlišovala šťavnatú ovocnú aciditu od ostrej nepríjemnej kyslosti.
- Výsledok miešal viac prvkov bez jasnej hierarchie a neposúval výber balenia/mletia až za odporúčanie.

## Zmeny

- Samostatný, priamo renderovaný Kaffa variant bez DOM patchovania; ostatné značky zostávajú na pôvodnej ceste.
- Editorial paleta s tromi farbami: prírodná čierna, teplá neutrálna a kyslo-limetkový akcent.
- Vlastný lineárny znak spájajúci abstraktné K, zrno a arómu; kresliaca animácia sa po otvorení zastaví a rešpektuje reduced motion.
- Landing má jeden obchodný argument a jednu ukážku výsledku namiesto troch konkurenčných benefitov.
- Presný tok: Chat / Chuťový poradca → 4 otázky → potvrdenie → jedno odporúčanie + jedna voliteľná alternatíva → balenie a mletie → konkrétny produkt.
- Stav otázok aj chatu sa zachováva pri prepínaní.
- Platný teaser markup, body scroll lock, mobile fullscreen, safe-area, klávesnicová obsluha a Escape close.
- Produktové CTA smerujú priamo na oficiálne produktové stránky.

## Porovnanie s produktovou rodinou

- Z Deratu zostáva čitateľný pevný launcher, samostatný teaser, pokojný panel a pomalý fill čipov.
- Z Môj Plotu a Koverty zostáva postupný výber po jednom rozhodnutí, jasný stav, návrat bez straty odpovedí a mobilný fullscreen.
- Z hlavného Môj Chatbot systému zostáva zaoblený prepínač, kompaktná hlavička a rovnaká interakčná logika.
- Kaffa sa odlišuje vlastným znakom, výraznou typografiou, trojfarebným editorial systémom a dominantným jediným produktom.

## Overené produktové zdroje (6. 8. 2026)

- Kaffa Roastery homepage: aktuálna ponuka, ceny, kontakt, prevádzky — https://kaffaroastery.sk/
- Mokka Espresso Blend: 11,90 € – 32,13 €, 80 % Arabica / 20 % Robusta, kakao, mandle, lieskovce — https://kaffaroastery.sk/produkt/mokka-espresso-blend/
- Kenya Kamundu Estate AA: 13,98 €, 250 g, washed, ríbezle, smotana, ibištek, malina, slivka, vanilka — https://kaffaroastery.sk/produkt/kenya-kamundu-estate-aa/
- Colombia Finca El Diviso Decaf: 16,42 €, 200 g, Sugar Cane Decaf, vanilka, citrónová tráva, mandarínka, jazmín — https://kaffaroastery.sk/produkt/colombia-finca-el-diviso-decaf/
- Mexico Finca La Esperanza: 12,79 €, 250 g, moderné espresso, marakuja, mandarínka, mliečna čokoláda, mandľa, toffee — https://kaffaroastery.sk/produkt/mexico-finca-la-esperanza/
- Geisha Ninety Plus Stellar Origin: 21,42 €, 150 g, V60/Origami/Kalita, mango, marakuja, med, pomarančový kvet — https://kaffaroastery.sk/produkt/stellar-origin/
- Kontakt: +421 907 627 466, info@kaffaroastery.sk — https://kaffaroastery.sk/kontakt/

## Audit po úprave

- Kaffa je vizuálne rozpoznateľná bez odtrhnutia od zaobleného panelu, čipov a prepínača rodiny Môj Chatbot.
- Landing vysvetľuje obchodnú hodnotu jednou vetou a ukazuje jediný presvedčivý výsledok.
- Kvíz používa bežné formulácie a pri ovocných profiloch explicitne odlišuje šťavnatosť od nepríjemnej kyslosti.
- Výsledok má jednu dominantnú produktovú plochu, dôvod, prípravu, chuť, balenie, mletie a konkrétne CTA.
- Žiadne scoring percentá, falošné recenzie ani všeobecné homepage CTA.

## Lokálne QA

- Chromium: 1440 × 960, 1280 × 800, 390 × 844 a 360 × 800.
- Overené: landing, chat, štyri otázky, potvrdenie, výsledok, alternatíva, priame CTA, balenie a mletie.
- Overené: platný teaser bez vnoreného tlačidla, klávesnica, Escape, body scroll lock, safe-area, zachovanie stavu a reduced motion.
- Produktové obrázky používajú oficiálny vzdialený WebP s lokálnym SVG fallbackom; pri výsledku sa zobrazuje iba jeden produktový vizuál.
- Žiadny deploy, pull request ani merge nebol manuálne spustený.

## Druhá revízia — klientsky použiteľný smer

Na základe ďalšieho hodnotenia bol prvý editorial smer príliš exhibičný a stále nepôsobil ako demo určené priamo majiteľovi firmy. Druhá revízia preto mení prioritu z veľkého typografického experimentu na praktický produktový návrh.

- Úvod teraz priamo víta majiteľa firmy a vysvetľuje, že ide o jeho personalizovaný návrh chatbotu a chuťového poradcu.
- Čierno-neutrálna báza je doplnená farebnými produktovými plochami podľa logiky obalov Kaffa; zrušený bol dominantný limetkový editorial akcent.
- Landing používa tri konkrétne obchodné prínosy: pomoc pri výbere, odpovede na otázky a odporúčanie konkrétneho produktu.
- Produktová ukážka zobrazuje viac balení a farebných labelov, nie jeden osamelý experimentálny výsledok.
- Chat panel má väčšiu pracovnú plochu a quick chips sú premiestnené do spodnej zóny priamo nad input.
- Možnosti v chuťovom poradcovi používajú vizuálne produktové karty namiesto emoji.
- Spodné kontaktné prvky boli odstránené; zostal iba nenápadný odkaz na mojchatbot.sk.
- Výsledok zostáva predajný: jedna dominantná fotografia/produktový vizuál, dôvod, príprava, chuť, balenie, mletie a priame CTA.

### QA druhej revízie

- Chromium vizuálna kontrola: 1440 × 960 a 390 × 844.
- DOM kontrola: žiadne vnorené tlačidlá, quick chips sú v spodnej chatovej zóne, panel má na desktope viac než 900 px a na mobile používa plnú šírku.
- Overené zachovanie stavu pri prepnutí Chat → Poradca → Chat → Poradca.
- Overené body scroll lock, odomknutie po zatvorení, nulový horizontálny overflow na 360 px a priame produktové CTA.
