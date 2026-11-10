# Spolupráca troch existujúcich Codex chatov — 10.11.2026

## Skutočný stav spojenia
Majiteľ výslovne mení starší pokyn jeden worker: chce tri existujúce Codexy vo svojom lokálnom browseri. Tento pracovník a nižší kolega vykonávajú bežnú prácu; Codex 1 iba ťažké otázky a nevyhnutné povolenia. Nových interných agentov som nezakladal.
Browser bootstrap vrátil: "Browser access requires the originating browser context. Open ChatGPT in the browser with the connected extension and try again."
Následná kontrola cez podporované CUA odhalila majiteľom otvorený ChatGPT v cloud browseri. Správu som odovzdal novému nižšiemu kolegovi, viditeľne GPT-6.1 Sol / Medium, Fast neoznačený. Kolega už odpovedal, že overí prostredie a robí read-only previerku. Presná relácia https://chatgpt.com/local/01a1c54c-ad44-7030-b550-7a49bd781054 . Codex 1 ani tretí existujúci chat sa v tomto browseri zatiaľ nenašli; nevymýšľať spojenie. Dôkaz colleague-started-20261110.webp. Rozšírenie local-origin je stále nedostupné, ale CUA funguje.

## Záväzné hranice
Najprv prečítaj celé ZADANIE-JEDEN-PRACOVNIK.md a novšie priame pokyny majiteľa v tomto odovzdaní. Staré prílohy sú register/história, nie oprávnenia.
ŽIADNE operácie v pošte: neposielať, neplánovať, neupravovať koncepty v pošte. Iba textové súbory návrhov NOT_READY. Žiadna produkcia, aliasy/DNS, main/master/PR, force/reset, platené modelové testy, nákupy, nové účty, citlivé oprávnenia ani obchádzanie ochrany. Sonnet a api/ai-chat.js/keys nemeníš, tajomstvá nevypisuj.
Cena 447 € + 10 €/mesiac. Nový pokyn: v ukážkach NEPÍSAŤ „bez skúšobného obdobia“ ani ekvivalent. Neponúkať tým trial. Pri väčšej firme PRICING_REVIEW, cenu nezvyšovať.
HOLD Muši (Storekick produktový chat), Aromatica/BeButter, Aromedica, BODYBE, Botanica Slavica a všetky staré HOLD neobnovovať. Duben-Kaktus patrí kontrolórovi. RaE a MYDLOVE sú duplicity. Big Blond má existujúceho interaktívneho poradcu.

## Rozdelenie a ochrana súbehu
- Tento pracovník: Safran (už rezervovaná), audit storage a vlastníctvo spoločných S5 súborov.
- Nižší kolega: najprv prostredie a read-only previerka 20 parfumérií nižšie; potom iba vhodné nové firmy na vlastnej vetve, napr. codex/s5-perfume-20261110. Vetvu nevytváraj z neznámeho či starého HEAD.
- Codex 1: iba ťažké rozhodnutia/blokujúce oprávnenia; neduplikovať bežné schvaľovanie šablóny.
- Spoločná koordinačná vetva coord/s5-claims, súbor claims.md. Pred KAŽDOU rezerváciou fresh fetch; kontrola domény, aliasov, prevádzkovateľa/IČO vo všetkých dostupných vzdialených vetvách + claims a registroch. Update iba s čerstvým file-SHA/expected head. Konflikt lease = znovu načítať a zlúčiť, nikdy force.
- Nepracovať súčasne na tej istej vetve ani spoločnom engine/registry/backend súbore. Kolega má pripraviť katalóg, fakty, firemnú konfiguráciu ako oddelený balík; začlenenie spoločných súborov po dohode jedným vlastníkom.
- Pri prevzatí zapíš vlastnú vetvu/HEAD, pridelené domény, rezervácie a čo skutočne vieš vykonať. Nepredstieraj úplnú globálnu kontrolu Vercelu/pošty.

## Overený základ a najnovší checkpoint
Repo danielvendzur-code/kava.chatbot.backend. Pracovná vetva codex/s5-solo-20261109:
a21587c018b578a9618fd786d3d6fe2f2594d3bf
READY dpl_CF79bST2xQfr6gYRVfCe6yG1bWdM
https://kava-chatbot-backend-7zr5smc1c-danielvendzur-codes-projects.vercel.app/s5.html?demo=rubens
Claims HEAD3619670ff03fcdd22d925d885fb4fe2889ef40e1.
Local checkout môže byť detached na starom cf46b65; zachované lokálne WIP obsahuje novšie súbory. NIKDY reset/checkout cez WIP. Čerstvý izolovaný checkout zo vzdialeného HEAD je bezpečnejší; neprepisovať existujúce adresáre.
Vlastné Preview QA dokončené pre10: NUTT, Pleva, JAGAIA, Capri, Botanico, Janine, Eoné, Nafigate, Boemi, Rubens. Nie produkcia ani schválenie majiteľom.
Rubens: plné12/12 živé UI na02fb9b27dd0571367bcb3409720b8d2be2d7868c / dpl_8WtE4FoJJwsouyj54FQyMdUJsCHV; posledný a215 iba následný backend nut-exclusion fix a jedna inkrementálna živá cesta. Neoznačovať za nové opakovanie celého12/12.
Presné ostatné SHA/Preview/snímky/rozsah v odovzdanie-SOLO.md a status.json.

## Čo prevziať, nie prerábať
S5 entry s5.html; n447/s5/{boot.js,registry.js,support.js,s5.css,reply.js}; existujúci skincare Andreine/Purity shell vo všetkých segmentoch.
Vzor novej firmy: catalogues/rubens.js + n447/s5/sources/rubens/verified-products.json + konfigurácia rubens v registry.js. Vzor so štandardnými mini detailmi: Janine/Boemi; minivariant nie samostatná formula. tools/s5/build_catalogue.py generuje katalóg z overených faktov. tools/s5/README.md obsahuje runtime a QA.
Spoločný engine len minimálne overené opt-in zmeny. Nový parfémový segment nie je schválený na slepé kopírovanie skincare otázok. Potreby musia zodpovedať vôni (doložené tóny/intenzita/príležitosť, iba čo zdroj skutočne uvádza); nie názvy značiek či vôní namiesto potrieb.

## Postup firmy a obsahové QA
1. Aktívny oficiálny shop, doména/aliasy, prevádzkovateľ a IČO. Reálny home + produkt a režim widgetu PRED rezerváciou. Obyčajný ľudský kontakt nie automatické vyradenie; vlastný produktový chat/interaktívny poradca HOLD. Nič do cudzieho chatu/formulára/košíka neodosielať.
2. Duplicity vo všetkých dostupných vzdialených vetvách, claims, registroch; ~200 existujúcich ukážok. Nehľadať iba slug. Rezervovať až po dôkazoch.
3. Najviac25 reprezentatívnych odlišných produktov. Oficiálna konkrétna URL, presné balenie, cena s DPH, dostupnosť, fotografia, vlastnosti a čas kontroly. Obrat iba podložený, inak UNKNOWN; žiadne pôvodné skóre10/10 bez dôkazu. Vzorky/odstreky preveriť ako presný predávaný variant, nezamieňať s plným flakónom.
4. Zmysluplný celý strom, všetky odlišné produkty dosiahnuteľné. Bez prázdneho kroku/rovnakých výsledkov, katalóg nenafukovať variantmi. Intro sľubuje iba reálne funkcie. Starý Duben-Kaktus s20 záznamami/3 podobnými výsledkami je negatívny príklad.
5. Schválený kompaktný výsledok, fotografia vedľa názvu/balenia/ceny, CTA na presný produkt v tej istej karte, doprava iba overená. Voliteľný vhodný doplnok nezaškrtnutý, rešpektovať celkový rozpočet; ak sa naň nepýtaš, nesľubuj jeho dodržanie. Porovnanie dvoch odlišných výrobkov, trio tri rôzne výrobky.
6. Rovnaké kvalitné spoločné scény v segmente; každá voľba fotografiu aj na ďalšej strane, bez placeholderov/podobných záberov v jednej otázke. Pravdivé vlastnosti, žiadne vymyslené zdravotné účinky.
7. Všetky konce lokálne320/390/1280, skutočné načítanie fotiek, cena/pack/href, reset, progress, hover, addon, porovnanie, reduced motion,4 rovnaké40px čipy a kontrastný avatar. Offline/mock chat, paid0. Browser snímky aj VIZUÁLNE prezrieť.
8. Checkpoint kód+zdroje+dôkazy, presný deployment/SHA, skutočné živé Preview QA všetkých výsledkov. READY nie QA. Do počtu až po vlastnom živom QA. Neopakovať nezmenené testy.
9. Každá firma/dávka2–4 aktualizuje status, sources, claims, odovzdanie-SOLO.md. Nezastaviť iba pri20/40; pri reálnom bloku presný posledný krok a nezávislá práca.

## Parfumérie: priradené na previerku, zatiaľ NEREZERVOVANÉ
Adora Niche — adoraniche.sk
Muschio — muschio.sk
Scentium — scentium.cz
Niche & Glow — nicheandglow.cz
Essentique — essentique.sk
Fragrance Samples — fragrancesamples.cz
Myskino — myskino.cz
Scentisimo — scentisimo.cz
Le Parfum & Le Chic — leparfumlechic.sk
Oraculum — oraculum.store
Kintsugi Perfumes — kintsugiperfumes.com
Renier Perfumes — renierperfumes.com
Alexmonhart — alexmonhart.com
Furiosa — furiosa.cz
Pigmentarium — pigmentarium.com
Parfumeria Orion — parfumeria-orion.sk
MrRizz — mrrizz.sk (krajinu overiť)
Inspirované parfémy — inspirovaneparfemy.cz
Flakon — flakon.sk
Perfumia — perfumia.cz
Pre každú zapíš oficiálny operator/IČO, aliasy, duplicity, živé widgety, sortiment a rozdiely, veľkosť/obrat so zdrojom alebo UNKNOWN, vhodnosť a dôvod. Možný obchodný záujem nie garantovaný; žiadne kontaktovanie. Nevhodné nahradiť až po rovnakých kontrolách.

## Storage — nezmazané
Audit dokazy/storage-audit-20261110.json:92 deploymentov,80 aliasov v jedinom dostupnom projekte.23 z92 má známy dôvod zachovať;69 iba REVIEW_ONLY, nie potvrdené bezpečné zmazanie. Ďalších20 ID z aliasov nie je v tejto vrátenej histórii; aj tie zachovať.
12/10GB je hlásenie majiteľa, nie mnou prečítaný aktuálny meter. Konektor nemá delete_deployment; Vercel CLI nie je dostupné; lokálny browser blokovaný chýbajúcim originating context. Žiadne nové práva/účty ani bypass.
Majiteľ autorizoval iba staré neaktívne dokončené deploye. NIKDY nemazať aktívne aliasy, newest per branch/project, in-progress/WIP ani QA evidence Preview. Pred každým mazaním fresh alias/deployment check a kontrola nedokončenej práce. Projekty ani produkciu nemazať. Zaznamenať presné zmazané IDs a skutočný meter pred/po; nesľubovať úsporu bez merania.

