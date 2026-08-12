# Dorovnanie ostatných ukážok na úroveň Jolky

Jolka (`/ukazka/jolka`) slúžila ako referencia kvality. Cieľom bolo dotiahnuť
zvyšné ukážky — Pražiarnička, Diamonds Roastery, Kaffa Roastery, Káva Víťazov
a Concept Coffee Roasters — na rovnakú úroveň a opraviť rovnaké chyby všade,
kde sa vyskytovali. Vrátane Jolky samotnej tam, kde chybu mala aj ona.

Overované na desktope 1366 × 768 a na mobile 390 × 844.

---

## 1. Fotografie vo výbere musia niesť význam možnosti

| Ukážka | Pred | Po |
|---|---|---|
| Jolka | krok „Chuť“ mal štyri fotky **toho istého kraftového vrecka** | štyri chuťové fotografie (čokoláda a mandle, karamel a orechy, ovocie, tmavá čokoláda a espresso) |
| Concept | chuť, nápoj aj kofeín mali fotky **produktových dóz** | chuťové, nápojové a „kedy ju pijem“ fotografie |
| Káva Víťazov | cez všetky odpovede boli **prelepené Jolkine fotky prípravy** — „čokoláda a orechy“ mala obrázok kávovaru | používa sa vlastný choice sprite značky |
| Pražiarnička, Diamonds, Kaffa | v poriadku | nemenené |

Chuťové dlaždice sú orezané z existujúcich sprite fotografií v repozitári
(`assets/*/choice-sprite.png`), takže art direction ostáva jednotná naprieč
projektom. Krok „acidita“ v Jolke naďalej ukazuje reálnu kávu — tam nesie
význam štvorbodová škála, ktorá je teraz väčšia a čitateľnejšia.

Trojpoložkový krok už nerozťahuje poslednú kartu na širokú landscape dlaždicu;
všetky odpovede majú rovnaký tvar ako v Jolke.

## 2. Chipy kompaktnejšie, ale čitateľné

Predtým 2 × 2 mriežka tlačidiel cez celú šírku, text 10,5 – 12 px.
Teraz zalamované pilulky: výška 38 px, padding 14 px, text **13,5 px**.
Platí pre Diamonds, Kaffa, Víťazov, Concept aj Pražiarničku (tá mala 11 px).

## 3. Preview text a launcher

- Text v pozvánke bol zamknutý na `font-size:11px!important`
  (`coffee-no-black-lock.css`). Teraz **13,5 px**, nadpis 15 px.
- Launcher bol biely krúžok s tenkým rámikom a v ňom takmer neviditeľná značka.
  Teraz plná značková farba, 70 px, biela značka.
- Pozvánka je vyššie nad okrajom okna: `bottom` 24 px → 58 px na desktope.

## 4. Chat / Výber kávy — jeden prepínač, žiadne vrstvy

- Zrušený sliding indikátor, ktorý sa kreslil **pod** už zafarbeným aktívnym
  tlačidlom, takže prepínač pôsobil ako dva prepínače cez seba.
- Ikonky v prepínači odstránené, popisky 15 px.
- Pražiarnička mala prepínač plávajúci **pod** obsahom — na 768 px vysokom
  displeji prekrýval posledný riadok odpovedí. Teraz je hneď pod hlavičkou,
  cez celú šírku panela, rovnako ako v Jolke.

## 5. Duplicitný vstup do konfigurátora

Karta „Nájsť svoju kávu“ ostávala v chate navždy. Teraz zmizne po prvej
správe zákazníka a režim sa mení výhradne hlavným prepínačom — presne ako to
robí `jolka-chat-flow.js`. (Pražiarnička to už mala.)

## 6. Čitateľnosť

- **Hlavička widgetu**: text ostal biely po tom, ako neskoršia vrstva spravila
  hlavičku svetlou. Názov pražiarne bol biely na takmer bielom podklade.
  Na Diamonds bol invert nasadený na celý lockup, takže bledol aj wordmark.
- Bubliny 14,5 px, popisky odpovedí 14,5 / 12,5 px, texty vo výsledku
  z 8 – 11 px na 12 – 13,5 px. Spodná hranica je 11,5 px a len pre verzálky.
- Avatary v chate mali značku bielu na bielom (Víťazov) alebo zmenšený
  horizontálny wordmark do 25 px (Diamonds). Obe opravené.
- Bublina zákazníka bola na Diamonds čierna; teraz nesie farbu značky.

## 7. Preč s „AI demom“

- **Časové pečiatky** pri každej správe (`coffee-v8.js`, `concept-seasonal-chat.js`,
  `coffee-premium-v2.js`, `coffee-diamonds-final.js`) — odstránené. Jolka žiadne nemá.
- Text **„Overená lokálna odpoveď · 19:26“** sa zobrazoval zákazníkovi pri
  výpadku API. Odpoveď z overeného katalógu ostáva, poznámka o inštalatérstve nie.
- Vymyslený štítok **„TOP“** nalepený na vždy prvej odpovedi — odstránený.
- **Simulovaný košík** vo výsledku (výber balenia, upsell, „Pridať do košíka“,
  ktoré len prepísalo vlastný popisok) — odstránený na Diamonds, Kaffa,
  Víťazov aj Concept. Výsledok končí jedným odkazom na skutočný produkt,
  rovnako ako v Jolke.
- Emoji v CTA („🛒 Do košíka“) — preč.
- Vo výsledku Víťazova sa v riadku „Chuť“ tlačil surový skórovací token
  `classic`, lebo `profile` slúžil zároveň ako dáta aj ako text. Opravené.

## 8. Stránka za widgetom je e-shop značky

Diamonds, Kaffa, Víťazov a Concept mali **tú istú** stránku o chatbote:
„Zákazník odpovie na štyri otázky… Poradca odporučí konkrétnu kávu“ plus pásik
„Odpovie 24/7 / Vyberie kávu / Zvýši objednávku“. Tri rôzne pražiarne, jedna
prezentácia riešenia.

Nové `coffee-storefront.js` + `coffee-storefront.css` renderujú pre každú
značku jej vlastný obchod: logo a menu s odkazmi na reálny web, hero s copy
značky, ponuka štyroch skutočných káv s cenami a odkazmi z katalógu ukážky,
a servisný pásik. Poradca je ponúknutý tak, ako obchod ponúka pomoc.

Pražiarnička taký web už mala (`praziarnicka-v13.js`) a slúžila ako vzor.

## 9. Žiadne veľké tmavé plochy

- Concept mal pod chipmi a inputom pás s prechodom až do `rgba(7,24,20,.36)`.
- Diamonds mal čierne bubliny zákazníka a čiernu pilulku vybraného balenia.
- Modálny závoj bol taký hustý, že zošedol celý obchod za ním.

## 10. Rozmery

| | Pred | Po |
|---|---|---|
| Diamonds mobil | panel 827 px od y = 24 → 8 px pod okrajom | fullscreen |
| Kaffa mobil | panel 724 px, pod ním presvitala stránka | fullscreen |
| Pražiarnička desktop | posledný riadok odpovedí pod plávajúcim prepínačom | prepínač hore, obsah sa zmestí |
| Víťazov mobil (obchod) | hero a ponuka sa prekrývali (grid stránky prebil layout) | jednostĺpcový tok |

Na 1366 × 768 aj 390 × 844 nemá ani jedna ukážka horizontálny ani vertikálny
overflow (`scrollWidth === innerWidth`, `scrollHeight === innerHeight`).

## 11. Fonty

Kaffa sa **vôbec nenačítala**, keď bol `fonts.googleapis.com` nedostupný —
`coffee-final-entry.js` považoval zlyhanie cudzieho stylesheetu za fatálnu
chybu a vypísal „Ukážku sa nepodarilo načítať“. DM Sans a IBM Plex Mono sú
teraz self-hosted v `assets/fonts/` (12 × WOFF2, 158 KB), rovnako ako to robí
Jolka so svojimi fontmi. Žiadna ukážka už nezávisí od cudzieho servera.

---

## Testy

Kontraktné testy, ktoré kódovali staré správanie, boli prepísané na nový
kontrakt — nie vypnuté:

- `concept-seasonal.contract.test.mjs` — odpovede nesmú používať produktové fotky
- `kaffa-contract.test.mjs` — výsledok končí odkazom na produkt, nie košíkom
- `praziarnicka-contract.test.mjs` — prepínač pod hlavičkou, chipy ako pilulky
- `praziarnicka-live.spec.mjs` — poloha prepínača voči hlavičke a composeru
- `vitazov-conversion.spec.mjs` — obchod namiesto pitchu, sprite namiesto
  prelepených fotiek, jedno reálne CTA, žiadna pečiatka vo fallbacku

Stav: 37 kontraktných testov a 25 browser testov zelených
(`jolka.spec.mjs` 10/10, `praziarnicka-live` 4/4, `vitazov-conversion` 7/7,
`chat-final-state` 4/4).

## Čo sa vedome nemenilo

- Skórovanie a dátové vrstvy ukážok (okrem opravy `profile` v `coffee-v8.js`).
- Identita, paleta a typografia Jolky.
- `widget-smoke.spec.mjs` — beží nad starším shared shellom a v tomto
  sandboxe nebol spustený.
