# Káva Víťazov — nezávislý product / UX audit

Dátum: 7. 8. 2026  
Branch: `agent/vitazov-conversion-system`

## Skóre pred zásahom

| Oblasť | /10 |
|---|---:|
| landing hierarchy | 8.1 |
| owner-facing value | 7.8 |
| brand identity | 8.2 |
| logo | 8.4 |
| widget dimensions | 9.2 |
| radius system | 8.6 |
| mode switch | 9.0 |
| chat | 7.6 |
| quick chips | 7.8 |
| photos | 6.9 |
| advisor logic | 8.3 |
| result | 7.2 |
| CTA | 8.6 |
| mobile | 8.7 |
| accessibility | 8.7 |
| animations | 8.3 |
| conversion | 8.2 |
| technical quality | 7.5 |

## TOP 5 STRONGEST ELEMENTS

1. Use-first advisor: domov / kancelária / automat / objavovanie naozaj mapuje ponuku značky.
2. Rozmer widgetu: 482 × 780 px dáva poradcu dostatočný priestor bez pocitu samostatnej stránky.
3. Veľký segmented Chat / Výber kávy switch.
4. Priamy produktový CTA namiesto všeobecného odporúčania.
5. Tmavozelená + lime identita, pokiaľ lime ostáva akcentom.

## TOP 10 PROBLEMS

1. Landing bol typograficky silný, ale málo personalizovaný pre majiteľa.
2. Owner note, headline a tri benefit cards opakovali tú istú hodnotu.
3. Lime wash pôsobil viac ako app UI než coffee brand.
4. Office Blend pack sa opakoval príliš často a začínal pôsobiť ako placeholder.
5. 300 × 300 produktové assety boli na väčších plochách mäkké.
6. Use-step používal tašky namiesto situácií: domov, kancelária, automat, filter.
7. Samostatný brew-method krok mal nižší informačný zisk než intenzita/kofeín.
8. Chat bubbles pôsobili genericky a owner meta text bol vo vnútri zákazníckeho chatu.
9. Result bol preplnený tromi detail cards, reason card, actions, alternative a office follow-up.
10. Brand post-processing pozoroval celý root a robil viac DOM patchingu, než bolo nutné.

## 3 THINGS THAT MUST BE DELETED

1. Boxové benefit cards na landingu.
2. Opakované produktové tašky v prvom advisor kroku.
3. Samostatná tretia secondary detail card `Pre koho` vo výsledku.

## 3 THINGS THAT MUST BE MADE STRONGER

1. Owner-facing landing.
2. Photo system s jasnou rolou produktovej vs. kontextovej fotografie.
3. Result hierarchy: produkt → dôvod → chuť/príprava → CTA.

## Advisor rozhodnutie

Prvý krok `Čo dnes vyberáte?` zostáva. Oficiálna ponuka reálne pokrýva domácnosti, firmy/kancelárie, automatové použitie, klasické 100 % arabiky, specialty coffee aj decaf.

Tok sa mení z `use → taste → prep → drink` na:

1. `use` — domov / kancelária / automat / filter a objavovanie,
2. `profile` — čokoláda a orechy / jemná a vyvážená / ovocná a objavná,
3. `drink` — čierna / s mliekom / oboje,
4. `taste` — jemnejšia / výrazná / viac kofeínu / bez kofeínu.

Kontrolné scoring scenáre:

- home + balanced + black + balanced → Victory Blend,
- office + classic + milk + caffeine → Office Blend,
- home + classic + both + decaf → Bezkofeínová,
- discovery + fruity + black + balanced → Etiópia.

## Zmeny

- Presná headline: `Vitajte vo vašom návrhu AI poradcu pre Kávu Víťazov.`
- Supporting copy priamo vysvetľuje domov, automat, kanceláriu a konkrétny produkt.
- Benefits sú redukované na `Menej váhania. / Konkrétna káva. / Domov aj firma.`
- Zmizol dekoratívny top-right pill aj plošný lime wash; základ je biely.
- Office Blend ostáva produktovým hero obrázkom, ale use-step používa štyri odlišné kontextové fotografie.
- Chat je customer-facing; kontakty a shortcut card sú odstránené, chips sú väčšie a dole.
- Result má jednu dominantnú product card, iba dve sekundárne detail položky, otvorený reason text a dominantné CTA.
- `coffee-vitazov-brand.js` už nepozoruje celý root. MutationObserver je obmedzený na dynamickú fotografiu výsledku.
- Brand CSS je konsolidované do jedného `coffee-v8-vitazov.css`.

## Skóre po zásahu

| Oblasť | /10 |
|---|---:|
| landing hierarchy | 9.2 |
| owner-facing value | 9.5 |
| brand identity | 9.0 |
| logo | 8.8 |
| widget dimensions | 9.2 |
| radius system | 9.0 |
| mode switch | 9.1 |
| chat | 8.7 |
| quick chips | 9.0 |
| photos | 8.9 |
| advisor logic | 9.2 |
| result | 9.1 |
| CTA | 9.2 |
| mobile | 9.0 |
| accessibility | 8.9 |
| animations | 8.5 |
| conversion | 9.3 |
| technical quality | 8.7 |

## QA hranice

Browser politika pracovného prostredia blokuje navigáciu Chromia na localhost/file URL, takže finálny branch nebol predstieraný ako end-to-end Playwright run. QA preto pozostáva z:

- auditu existujúcich branch screenshotov,
- overenia sortimentu na oficiálnom webe,
- scoring simulácie,
- JS/test syntax kontroly,
- kontroly selectorov voči aktívnemu `coffee-v8` markupu,
- izolovaných layout renderov cez Playwright `page.set_content` pre landing, chat, advisor a result.

Vercel preview ani deployment nebol použitý.
