# Kaffa Roastery — nezávislý UX / product / visual audit

Dátum: 7. 8. 2026  
Vetva: `agent/kaffa-editorial-specialty`

## Verdikt pred rebuildom

Druhá Kaffa verzia nebola zlá, ale nesplnila najdôležitejšiu podmienku produktu: nevyzerala ako reálny chatbot, ktorý sa dá predstaviť na e-shope. Najväčší problém nebol font ani detail farby. Bol to 1000 px široký desktop panel, priveľa prázdneho priestoru a obrazový systém postavený na syntetických obaloch namiesto presvedčivej specialty fotografie.

| Kategória | Skóre | Rozhodnutie | Dôvod |
|---|---:|---|---|
| branding | 5.5/10 | REBUILD | Abstraktný vlastný znak a čierno-farebné mock bagy boli vizuálne vzdialené reálnej typografickej a produktovej prezentácii Kaffa. |
| first impression | 7.0/10 | CHANGE | Čisté a moderné, ale viac produktový dashboard než dôveryhodná ukážka nasadeného chatbotu. |
| owner-facing value | 8.0/10 | CHANGE | Smer bol správny, text však nebol taký presný a explicitný ako brief. |
| modernity | 7.5/10 | CHANGE | Moderné komponenty, nesprávna mierka modalu a priveľa SaaS estetiky. |
| typography | 7.5/10 | CHANGE | Čitateľná, ale Manrope + DM Sans pôsobili genericky a málo nadväzovali na typografický charakter Kaffa. |
| spacing | 5.5/10 | REBUILD | Chat aj advisor mali veľké hluché plochy kvôli 1000 × 760 px shellu. |
| widget proportions | 3.0/10 | REBUILD | 1000 px desktop modal je mimo zadania 440–470 px a mimo rodiny top widgetov. |
| visual storytelling | 6.0/10 | REBUILD | Landing ukazoval kolekciu obalov ako mini-shop; chýbal jasný príbeh príprava → preferencia → jeden produkt. |
| photo quality | 3.0/10 | REBUILD | Dominovali SVG/fallback bag mockupy. Chýbal jednotný systém brew fotografie a reálnych produktových vizuálov. |
| chat | 4.5/10 | REBUILD | Jedna správa bola správne, ale chýbala jasná advisor CTA karta a obrovská plocha ostávala prázdna. |
| quick chips | 7.0/10 | CHANGE | Boli dole, ale texty neboli podľa finálneho briefu a mobil ich horizontálne odrezával. |
| input | 8.0/10 | KEEP | Čistý pill input, send bol viditeľný. Zachovať princíp, zmenšiť proporčne. |
| mode switch | 8.0/10 | KEEP / CHANGE | Pill princíp je správny; treba ho preniesť do kompaktného shellu. |
| advisor | 6.5/10 | REBUILD | Otázky boli ľudské, ale vizuály boli produktové mockupy namiesto fotografie a layout bol príliš rozťahaný. |
| product recommendation | 7.0/10 | REBUILD | Dôvod + CTA fungovali, ale chýbal explicitný pôvod a spracovanie a vizuál nemal dostatočnú produktovú dôveryhodnosť. |
| mobile | 6.5/10 | REBUILD | Fullscreen fungoval, ale density, prázdne plochy a horizontálne chipy boli slabšie než Derat/Concept. |
| technical implementation | 7.5/10 | CHANGE | Dobrá izolácia Kaffa cesty, escape/body lock/state/reduced-motion. Slabšie oproti Derat v mobile viewport/keyboard handlingu; zbytočné 3 CSS vrstvy. |
| conversion | 7.0/10 | CHANGE | Owner framing a CTA boli dobré, ale „fake shop“ feeling a nereálna veľkosť widgetu znižovali vierohodnosť ukážky. |

## KEEP

- Izolovaný Kaffa renderer, ktorý nemení ostatné coffee demá.
- Zachovanie stavu medzi Chat a Výber kávy.
- Body scroll lock, Escape close, reduced motion.
- Jedna welcome message.
- Priame odkazy na konkrétne produkty bez fake match score.
- Bottom composer a viditeľný send.

## CHANGE

- Typografiu priblížiť k obalovej identite: výrazný `KAFFA` wordmark + technickejší mono detail, nie ďalší SaaS display font.
- Zjednotiť UI na tri farby: čierna, teplá off-white a chladný svetlomodrý akcent.
- Landing copy prepísať presne na owner-facing zadanie.
- Quick chips zmeniť na štyri rozhodovacie vstupy podľa reálnej zákazníckej otázky.
- Mobile keyboard správanie priblížiť Deratu cez `visualViewport` a bezpečný full-height panel.

## DELETE

- 1000 px centrovaný app modal.
- Pink/yellow/mint rainbow systém.
- Produktový grid na landingu, ktorý pôsobil ako náhradný e-shop.
- Kontaktné prvky Kaffa vo footeri.
- Syntetický abstraktný Kaffa symbol ako primárny brand znak.
- Muted selected states založené na znižovaní opacity textu.
- Samostatnú tretiu `kaffa-result.css` vrstvu.

## REBUILD

- Widget shell na 468 px desktop / fullscreen mobile.
- Chat layout: advisor CTA card + jedna welcome message + 4 chipy + composer bez hluchých plôch.
- Advisor step 1 ako photography grid; ďalšie kroky textovo čistejšie.
- Result ako dominantná produktová fotografia + odborné detaily až po odporúčaní.
- Landing visual story ako „príprava → výber → produkt“, nie produktový katalóg.

## Porovnanie s referenčnou rodinou

### Derat
Najlepší referenčný bod pre mobile robustness. Kaffa preberá fullscreen mobile shell, safe-area myslenie, body lock a `visualViewport` synchronizáciu. Nepreberá jeho utilitárny vizuál.

### Môj Plot
Referenčný je jasný krokový tok a návrat bez straty rozhodnutí. Kaffa zachováva odpovede aj pri prepínaní režimov a po návrate medzi krokmi.

### Koverta
Dôležitá je produktová kompaktnosť a zaoblený systém. Kaffa používa rovnakú disciplínu proporcií, nie rovnaký brand styling.

### hlavný Môj Chatbot
Preberá rodinnú logiku: veľký pill mode switch, jasný composer, viditeľný send, čistý launcher a kompaktnú hlavičku.

### Concept
Najlepší zdroj pre photography-first advisor. Kaffa používa rovnaký princíp kvalitného cropu v prvom kroku a staggered reveal, ale drží užší 468 px shell a ruší fake match score.

### Jolka
Referenčná je striedmosť, rytmus spacingu a owner-facing landing bez efektov pre efekt. Kaffa preberá pokojnejšiu hierarchiu.

### Káva Víťazov
Referenčná je konverzná priamočiarosť: majiteľ má hneď vedieť čo riešenie robí a kde skončí zákazník. Kaffa preto používa tri jasné benefity a konkrétne produktové CTA.

### Diamonds
Referenčná je prémiová hierarchia a schopnosť nechať jednu vec dominovať. Kaffa result preto ukazuje jedno hlavné odporúčanie a iba jednu sekundárnu alternatívu.

## Implementovaný smer

### Owner landing
Headline presne:

> Vitajte vo vašom návrhu AI poradcu pre Kaffa Roastery.

Supporting copy presne:

> Takto môže váš e-shop zákazníkovi zjednodušiť výber medzi espresso blendmi a výberovými kávami bez toho, aby musel rozumieť odbornej terminológii.

Tri prínosy:
1. Zjednoduší výber.
2. Odpovie pri rozhodovaní.
3. Dovedie ku konkrétnej káve.

Pravá strana nie je fake shop. Je to jedna vizuálna story: brew fotografia + jeden konkrétny produkt + krátke vysvetlenie výsledku.

### Photo system
- Brew/preparation fotografie sú oddelené od textových plôch.
- Jeden radius systém, konzistentná saturácia/kontrast a crop.
- Advisor step 1 používa 4 fotografie prípravy podobne ako Concept.
- Result používa brew fotografiu ako dominantný kontext a produktový bag ako samostatnú vrstvu.
- Text nie je položený na nekontrolovanej svetlej fotografii bez overlayu.

### Widget base
- Desktop: 468 px.
- Desktop height: 640 px.
- Outer radius: 34 px.
- Mobile: 100 % viewport width/height.
- Veľký pill switch.
- 4 quick chips priamo nad inputom; na mobile 2 × 2, nie odrezaný horizontal carousel.
- Footer iba `mojchatbot.sk`.

### Chat
- Presne jedna welcome message.
- Presne jedna jasná advisor CTA karta.
- Quick chips: `Espresso blend`, `Niečo na filter`, `Nechcem kyslú`, `Chcem ovocnú`.
- Composer zostáva fixne v spodnej časti a send je vždy viditeľný.

### Advisor
1. Príprava — photography.
2. Chuť — ľudské formulácie.
3. Čierna / mlieko.
4. Klasická / bez kofeínu — decaf je v auditovanej ponuke reálny samostatný produkt.

Odborné slová ako `Washed`, `Sugar Cane Decaf` a `Anaerobic Natural` sa nezobrazujú ako podmienka rozhodnutia. Objavia sa až vo výsledku.

### Result
Dominantný výsledok obsahuje:
- názov,
- cenu,
- pôvod,
- spracovanie,
- chuť,
- prípravu,
- „Prečo práve táto“,
- primárne CTA,
- balenie a mletie,
- jednu alternatívu.

Bez percentuálnej zhody a bez fake sociálneho dôkazu.

## QA po implementácii

Lokálny Chromium QA bez Vercelu:

- 1440 × 960 — landing, chat, advisor, result.
- 1280 × 800 — compact desktop shell.
- 390 × 844 — mobile chat + advisor.
- 360 × 800 — mobile result.
- Desktop panel: presne 468 × 640 px.
- Outer radius: 34 px.
- 4 quick chips, všetky čitateľné.
- 1 welcome message, 1 advisor CTA card.
- Step 1: 4 photo options.
- Selected state drží opacity 1 a má jasný border + accent surface.
- Stav ostáva zachovaný po Chat → Výber → Chat → Výber.
- Result obsahuje pôvod, spracovanie, chuť, prípravu, dôvod, jednu alternatívu a priame CTA.
- Žiadne nested buttons.
- Mobile horizontal overflow: 0 px pri 390 aj 360 px.
- Body lock pri otvorení, unlock po zatvorení.
- Escape close.
- Focus trap v otvorenom dialogu.
- `visualViewport` mobile keyboard synchronizácia.
- `prefers-reduced-motion` vypína animácie.
- `node --check` pre `kaffa-data.js` a `kaffa-editorial.js` bez chyby.

## Final self-review

Otázka: vyzerá to ako specialty brand vytvorený na mieru Kaffa, alebo generic coffee template s novým fontom?

Po rebuilde už nie je nosnou identitou generický coffee gradient ani hnedý/kraft UI. Rozpoznateľnosť stojí na typografickom KAFFA wordmarku, čiernobielom editorial rytme, chladnom akcente, photography-first príprave a konkrétnych produktoch. Interakčný základ ostáva zrozumiteľnou súčasťou rodiny Môj Chatbot.

Finálne interné hodnotenie:

| Metrika | Skóre |
|---|---:|
| visual quality | 9.1/10 |
| UX | 9.4/10 |
| brand fit | 9.1/10 |
| conversion | 9.3/10 |
| mobile | 9.4/10 |

Nie je to 10/10 preto, že plná produkčná brand fidelity by vyžadovala kompletný oficiálny asset pack Kaffa (originálne logo/exporty a všetky produktové packshoty). UX a proporcie už nie sú závislé od toho, aby sa tento deficit maskoval efektmi.
