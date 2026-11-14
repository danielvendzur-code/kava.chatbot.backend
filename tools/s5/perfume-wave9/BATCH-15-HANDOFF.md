# Nová dávka15 — odovzdanie pre MAIN, 14.11.2026

**15 lokálne dokončených balíkov, 84 odlišných primárnych výrobkov, 25 voliteľných variantov rovnakej vône a 252 finálnych výsledkových pohľadov320/390/1280.** Pätnásť rôznych prevádzkovateľov/IČO. NIE15 nasadených alebo živým Preview QA schválených ukážok. Nezahŕňa predchádzajúcich17 odoslaných ani predchádzajúcich15 READY. Stav používateľovej poštyUNKNOWN; pracovník nevykonal žiadnu operáciu v pošte.

Všetko je na vlastnej vetve `codex/s5-perfume-wave9-20261114`; preber iba oddelené firemné súbory. Nezlučuj celý starší snapshot cez novší spoločný runtime. Predošlé odovzdania a SHA zostávajú zachované. Najnovšie spoločné zdroje/runtime vlastní MAIN; oprava jadra c9e4da04e19339492a4ffe91428e8ac960b866b6 sa neopakuje.

| Firma | Slug | IČO | Oficiálny kontakt | Primárne výrobky | Lokálne výsledky | Zdrojový balík |
|---|---|---|---|---:|---:|---|
| LUX PARFUM | luxparfum | 54911915 | luxparfum@luxparfum.cz | 6 | 18 | tools/s5/perfume-wave3/candidate-packages/luxparfum |
| ATMAN | atmanperfumes | 05194962 | hi@atmanperfumes.com | 6 | 18 | tools/s5/perfume-wave3/candidate-packages/atmanperfumes |
| Moje Hypno | hypno | 51654598 | info@mojehypno.sk | 4 | 12 | tools/s5/perfume-wave4/candidate-packages/hypno |
| Bookarazzi | bookarazzi | 51218399 | info@bookarazzi.sk | 5 | 15 | tools/s5/perfume-wave4/candidate-packages/bookarazzi |
| GOM Perfumes | gom | 17645468 | info@gom-perfumes.cz | 5 | 15 | tools/s5/perfume-wave5/candidate-packages/gom |
| Egoist Royal Parfums | egoist | 03277411 | info@egoist-parfums.cz | 6 | 18 | tools/s5/perfume-wave5/candidate-packages/egoist |
| Parfums4all | parfums4all | 36291781 | info@parfums4all.sk | 4 | 12 | tools/s5/perfume-wave6/candidate-packages/parfums4all |
| Yodeyma parfémy.cz | yodeymaparfemy | 05890969 | obchod@yodeymaparfemy.cz | 6 | 18 | tools/s5/perfume-wave6/candidate-packages/yodeymaparfemy |
| ODEUR | odeur | 56402554 | odeur@odeur.sk | 6 | 18 | tools/s5/perfume-wave7/candidate-packages/odeur |
| ELOBE | elobe | 05681430 | info@elobe.cz | 6 | 18 | tools/s5/perfume-wave7/candidate-packages/elobe |
| Top parfémy | topparfemy | 21825971 | info@top-parfemy.eu | 6 | 18 | tools/s5/perfume-wave8/candidate-packages/topparfemy |
| IN PARFUM | inparfum | 55021417 | info@inparfum.cz | 6 | 18 | tools/s5/perfume-wave8/candidate-packages/inparfum |
| AROMEA | aromea | 22042318 | boutique@aromea.cz | 6 | 18 | tools/s5/perfume-wave9/candidate-packages/aromea |
| KIFRA | kifra | 50184377 | predaj@kifra.sk | 6 | 18 | tools/s5/perfume-wave9/candidate-packages/kifra |
| Scents.cz | scents | 46721177 | info@scents.cz | 6 | 18 | tools/s5/perfume-wave9/candidate-packages/scents |

## Presný integračný kontrakt

- `BATCH-15-INTEGRATION-REVIEW.json` obsahuje pri každej firme presný katalóg, verifiedfacts, config fragment, integration-review, firemnéCSS, prevádzkovateľa, obrat/UNKNOWN, stav a QA report.
- Pre každýSLUG: `catalogues/SLUG.js`, `assets/s5/SLUG/`, `n447/s5/sources/SLUG/{verified-products.json,selection-model.json}`, `n447/s5/perfume-fragments/SLUG.{config,selection-model}.json`.
- MAIN prevezme `.registryObject` z configu, importkatalógu / backendBrand/offlineRules zo samostatného integration-review, firemné ui-review.css→`n447/s5/brands/SLUG.css` a nastaví companyCss. Potom vlastnám MAIN kontrola backend brand / rules / importov, žiadne tvrdenie, že samotný config už značku nasadil.
- Existujúci profilvýsledku vyžaduje explicitný opt-in `body.dataset.fragranceProfile="visual-v1"` aj pre nové slugy. Zachovať aktuálny S5 skincare vzhľad, pravdivý produktovýkind a len skutočné funkcie.
- Samostatný dizajnový fix zo spoločného odovzdania `tools/s5/perfume-wave5/POLISH-HANDOFF.md`: nové `n447/s5/perfume-ui-polish-20261113.css`, `.js`, `assets/s5/shared/fragrance-bottle-outline.svg`. Zarovnáva online poradcu k logu a nahrádza všeobecný symbol profilu obrysom flakónu. Existujúce spoločné runtime súbory pracovník nemenil.

## Závislé kontroly pre MAIN

- **ODEUR/KIFRA:** parfumy do prania, nie osobnéEDP. Konkrétne brandbackendguard požiadavky v ich integration-review.scopeReview a odovzdaniach. ODEUR 5 ml a jeho zákazy tkanín nesmie MAIN preniesť na KIFRA; KIFRA 2,5 ml, zriedenie 50 ml iba tam, kde je priamo doložené. Žiadne vymyslené filtre tkanín/rozpočtu, zdravie alebo detská bezpečnosť.
- **Scents.cz:** vôňa do auta, nie pokožka/pranie. Osobitný carbrandguard, žiadne záruky výdrže60dní/ochranyplastov/zdravia. Presné42g/70alebo90Kč a slovnýcharakter zo zdrojov; žiadna vymyslená pyramída či percentá.
- **AROMEA:** oficiálna stará doména svetbytovychvuni.cz aj bývalá prevádzkovateľka 74144227 sú preverené. Malé pásmo 2024 nemožno vyhlásiť za aktuálne tržby po prevodepodniku; presné tržby 2025 UNKNOWN, CURRENT_SIZE_REVIEW.
- **GOM/Egoist/Scents:** väčšia fallbackfirma/PRICING_REVIEW. Cena zostáva 447 € + 10 €/mesiac. Pásma 2024 nie sú presné tržby 2025; aktíva/zisk sa za tržby nevydávajú.
- LUXPARFUM a INPARFUM majú ručné prevodníky názvov/facety, presne popísané FIT_REVIEW; nie tvrdenie, že web nemá žiadne pomôcky. Existujúce produktové AI ESCENT je HOLD a nemá vytvorenú ukážku.
- MAIN vykoná začlenenie a svoje živé QA VŠETKÝCH výsledkov na konkrétnom READY Preview. Žiadne verejné URL/domény pre tieto nové balíky si pracovník nevymyslel ani nenasadil. Chat overený iba cez source-IDoffline/mock odpovede, platené volania 0, nasadenýprovider netestovaný.

## Dôkazy a hranice

Každý balík obsahuje vlastný strom, presné SKU/balenie/cenu/sklad/fotografiu/URL/čas a pôvodnézdroje. Všetky finálne lokálne výsledky boli skutočne vykreslené a snímky vizuálne prezreté. Testy pokrývajú načítané fotografie, cenu/balenie/CTA, reset/progress, štyri rovnaké 40 px čipy, hover/reducedmotion, dve odlišné produkty v porovnaní a existujúce dobrovoľné doplnky/súčty/odškrtnutie. Vzorky/mini nepredstierajú ďalšie formuly.

Merchant home+produkt/widget kontrola je skutočný automatizovaný WPEWebKit so zapnutým overovanímTLS, nie deklarované CUA/Chrome. Žiadny dostupný callable control-browser/CUA JS pri poslednej kontrole. Cookie/session obmedzenia a obyčajné kontakty sú popísané pri každej firme; nikde nejde o absolútne bezchatbotové potvrdenie. Scents normálne uloženie odmietnutia vyžadovalo povoliť iba vlastný cookie POST endpoint, nie cudzie formuláre/chat/košík alebo obchádzanie ochrany.

ZIPy merchant/localQA, reporty a SHA256manifesty sú v `tools/s5/perfume-wave*/proof/`, existujúce Vercel vylúčenie /tools zostalo zachované. Scentisimo a všetky staré archívy sa zachovali. Žiadne mazanie/storagecleanup, produkcia/DNS/aliasy/main/master/PR/force/reset, nové účty/oprávnenia alebo pošta. Pôvodné cudzie WIP aj všetky HOLD zachované. Po dosiahnutí cieľa 15 sa nerezervovala šestnásta firma.

`BATCH-15-TREE-VERIFICATION.json` nezávisle prešiel všetkých 84 koncov na nezmenenom c9 jadre; agregácia 15 uložených finálnych UI reportov overila 252 pohľadov bez chýb. `BATCH-15-CONTACTS-NOT-READY.csv` je iba súbor oficiálnych kontaktov, nie odoslané/plánované maily. `REVIEW-GALLERY-MANIFEST.json` odkazuje na 15 skutočných výsledkov pri šírke 390 px v pôvodnýchQAarchívoch.
