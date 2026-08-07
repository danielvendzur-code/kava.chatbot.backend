# Pražiarnička v10 — director audit

## Nezávislý verdikt pred v10

Predchádzajúca v9 verzia neprešla finálnym director review. Bola čistá, ale príliš pokojná, customer-facing a vizuálne slabšia než Concept, Jolka a Káva Víťazov. Najväčšie problémy boli generický prvý dojem, fake packaging, slabšia produktová fotografia, zbytočný utility/contact smer a nedostatočne presvedčivý Chat / Výber kávy systém.

## v10 smer

- owner-facing headline a jasné vysvetlenie obchodnej hodnoty,
- tri farebné roly: tmavozelená, lime/mint akcent a warm off-white,
- 500 × 760 px desktop widget, radius 38 px,
- mobile 8 px inset fullscreen-like panel,
- veľký oválny Chat / Výber kávy switch,
- jedna welcome message,
- 4 quick chips v 2 × 2 spodnom bloku priamo nad composerom,
- 46 px send button,
- žiadny kontakt / telefón / e-shop utility strip,
- iba decentný `mojchatbot.sk` credit,
- fotografia pri príprave, hero preview a produkte,
- štyri rozhodovacie kroky: príprava, chuť, mlieko, kofeín,
- staggered reveal a 620 ms calm auto-advance,
- žiadne „Voľba je uložená“,
- výsledok bez fake match percenta,
- jedna alternatíva,
- balenie a mletie až po odporúčaní,
- priame produktové CTA.

## Overené produktové dáta

- Paganini blend — od 11,90 €, 75 % arabica / 25 % robusta, espresso / cappuccino / moka.
- Brazil Santos — od 9,90 €, 100 % arabica, jemný čokoládovo-orieškový profil, nízka acidita.
- Puccini blend — od 11,50 €.
- Cuba Serrano Lavado — od 12,90 €.
- Bezkofeínová Brazil — od 12,90 €.

Priamy produktový link je súčasťou výsledku. Dostupnosť a finálna cena sa nepotvrdzujú falošným UI údajom; zákazník ich vidí na oficiálnej produktovej stránke.

## Browser QA pred commitom

Desktop 1440 × 900:
- widget 500 × 760,
- dokument 1440 × 900 bez overflow,
- landing, chat, first step, selected state, result a package renderované,
- žiadne console/page errors.

Mobile 390 × 844:
- widget 374 × 828 s 8 px insetom,
- dokument 390 × 844 bez horizontálneho ani vertikálneho overflow,
- composer sa pri otvorení sám nezameria,
- chat, advisor a result renderované,
- žiadne console/page errors.

Po prvom screenshot review boli quick chips prerobené z horizontálne odrezaného radu na čistý 2 × 2 spodný blok. Vercel ani PR počas tejto iterácie nebol spustený.
