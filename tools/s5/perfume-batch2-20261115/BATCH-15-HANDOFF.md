# Odovzdanie ďalších15 firiem pre MAIN –16.11.2026

SOURCE_LOCAL_COMPLETE, NIE živé Preview READY. Vetva `codex/s5-perfume-batch2-20261115`; rozsah oproti `c89c39dab76672b5350ed0e7b5cc0e27173e90cb`. Presný checkpoint je commit, ktorý obsahuje tento dokument. Predchádzajúca samostatná15firma dávka je vo wave9; nezapočítavať ju ako nové výsledky tejto dávky.

77 odlišných primárnych kompozícií,6 dobrovoľných20ml variantov rovnakej vône pre VonavePranie,231 jedinečných lokálnych výsledkových pohľadov pri320/390/1280. Retesty ani vyradené štyri Ravina produkty počet nezvyšujú. Samostatná kontrola vstupu a prvej otázky má45 konfigurácií; finálny report a snímky sú v evidence/entry-final-local-qa.zip.

| Firma | IČO | Kompozície | Lokálne pohľady | Tržby/pásmo so zdrojom v manifeste | Oficiálny kontakt |
|---|---|---:|---:|---|---|
| DEWS | 55473911 | 6 | 18 | 120686 EUR (2025) | info@wajda.sk |
| SI·LU | 56438761 | 6 | 18 | 19548 EUR (2025) | info@siluvone.sk |
| Durance | 24799025 | 6 | 18 | 1–3 mil. Kč CZK (2024) | info@durance.cz |
| Voňavé pranie | 44492197 | 6 | 18 | 388931 EUR (2025) | info@vonavepranie.sk |
| MMNT | 11673788 | 2 | 6 | 200–500 tis. Kč CZK (2024) | info@mmntshop.com |
| AROMIS | 44264542 | 6 | 18 | 3–5 mil. Kč CZK (2024) | obchod@aromis.eu |
| Rozvoněno | 10706577 | 6 | 18 | 3–5 mil. Kč CZK (2024) | info@rozvoneno.cz |
| KETT’S CANDLES | 05124174 | 6 | 18 | 1–200 tis. Kč CZK (2024) | ketts@kettscandles.com |
| toTap | 08047090 | 6 | 18 | 5–10 mil. Kč CZK (2024) | info@totap.cz |
| Kvapka vôní | 31713467 | 5 | 15 | UNKNOWN EUR (2025) | info@srubka.info |
| ALMA | 08881871 | 4 | 12 | 1–3 mil. Kč CZK (2024) | objednavky@alma.cz |
| Vůně BIS | 01570510 | 5 | 15 | 10–30 mil. Kč CZK (2024) | eshop@vunebis.cz |
| EsoDrogéria | 47350318 | 5 | 15 | UNKNOWN EUR (2025) | obchod@esodrogeria.eu |
| Candella | 51188112 | 6 | 18 | UNKNOWN EUR (2025) | info@candella.sk |
| RAVINA | 09331221 | 2 | 6 | 1–3 mil. Kč CZK (2024) | info@ravina.cz |

Presné súbory, SHA256, import, config fragment, CSS source/destination, backendBrand, explicitné účelové obmedzenia a finančné zdroje: `BATCH-15-INTEGRATION.json`. Každá firma má samostatný `candidate-packages/SLUG/integration-review.json`; nevkladať celý adresár assets bez allowlistu. RAVINA iba berry.jpg,lily.jpg,logo.png,avatar.svg; ostatné zachované výskumné fotografie nie sú určené na nasadenie.

MAIN vlastní spoločné registre/boot/backend. Worker ich nemenil. Lokálna immutable fixture používa snapshot68dbfbeb a odporúčacie jadro z c9e4da04; servovaná fixture vkladá kandidátsky register, companyCSS, existujúce result-extras a standalonepolish plus visual-v1 opt-in. MAIN musí zabezpečiť ekvivalentné zapojenie v skutočnej pracovnej vetve. Žiadna ďalšia oprava jadra sa tu nevytvárala. Existing polish paths sú n447/s5/perfume-ui-polish-20261113.css/.js; profil assets/s5/shared/fragrance-bottle-outline.svg; result extras n447/s5/fragrance-result-extras.js. Podľa existujúceho runtime skontrolovať načítanie, nie slepo duplikovať include.

Účely sú oddelené: pranie, sviečky, izbové vône, osobné parfumy. Žiadne falošné skincare mapovanie. Backend guard musí zachovať konkrétny účel a odmietnuť zdravotné/tehotenské/hormonálne účinky, nepodložené použitie v sušičke/na všetky látky či garantovanú výdrž. ALMA10ml a Eso10ml sú plné maloobchodné balenia, nie automaticky vzorky. Inšpirované toTap/RAVINA sú viditeľne označené; bez tvrdenia o originále alebo rovnocennosti značiek. Percentá/intenzity1–10 sa nevymýšľali; profil používa iba doložené tóny, prípadne doloženú pyramídu.

toTap presný50ml409Kč, nie rodičovské minimum159Kč/10ml. Kvapka250ml15,90€ a Vonave250ml majú viditeľný pokyn na výber balenia, ALMA ESSE alkohol10ml1390Kč. Audit14 skutočných oficiálnych otvorení je evidence/official-variant-deep-link-audit.zip: konkrétne balenie sa niekedy automaticky nepredvolilo. Preto sa automatický výber variantu negarantuje. Staršie proof archívy zachované; pre poslednú verziu Vonave/Kvapka použiť laundry-variant-notice-final-qa.zip, ALMA kombináciu základných9 neESSE pohľadov a3 náhradných ESSE pohľadov v alma-variant-notice-incremental-qa.zip. Výsledné12 sú v alma-ui-qa.json, nie15.

MMNT a RAVINA majú len2 skutočne reprezentatívne dostupné kompozície a1 zmysluplnú otázku, bez prázdneho kroku. KETTS nízke historické pásmo a CANDELLA oficiálne2025 tržby4127€ vyžadujú obchodné posúdenie. VůněBIS sekundárne2024 pásmo10–30mil.Kč je PRICING_REVIEW; cena447€+10€/mesiac sa nemení. Českým sekundárnym pásmam sa nepripisuje aktuálna presná2025 tržba; tá ostáva UNKNOWN. Cenové a skladové údaje sú bodové snímky s časom/URL, nie synchronizácia celého obchodu.

Reálne merchant home+produkt/widget pozorovania WPEWebKit/TLS-on sú v evidence/merchant-live-observations.zip, s cookie/session hranicami v jednotlivých reportoch. Nie sú to živé demo Preview testy. Callable control-browser/CUA pri poslednej kontrole chýbal; nepoužil sa TLS bypass. Eso má zachytený Smartsupp zdroj/frame s obmedzením cookie režimu; nie absolútne tvrdenie o neprítomnosti chatbota. toTap má manuálny vyhľadávač inšpirácie FIT_REVIEW. RAVINA bočný kruh je podľa skutočného elementFromPoint owl-next carousel arrow, nie chat.

Čerstvá kontrola duplicít: research/fresh-duplicates.json,104 dostupných vzdialených hláv/4101textblobov/missing0/45pozitívnychkontrol,2026-11-15T22:42:17UTC; rozsah dostupných vetiev, domén/aliasov/operatorov/IČO a claims. MAIN pred integráciou porovná s najnovšími zmenami. Staré HOLD a cudzie claims ostali zachované. Svieckovo je UNRESERVED_REVIEW pre nejasnú cenu s DPH; SVITSOL a Naturinka HOLD pre interaktívneho poradcu, Parfumylacno HOLD pre pozastavený obchod. Neobnovovať ich počtom.

Oficiálne kontakty a citácie sú OFFICIAL-CONTACTS-NOT-READY.json. Všetky kontakty majú NOT_READY, demoLiveUrl=null, história odoslania mimo workera UNKNOWN. Žiadna poštová aplikácia sa neotvárala/neupravovala; odoslaných0. MAIN doplní až overené reálne URL po integrácii a živom Preview QA všetkých231 výsledkov, overí fotografie/ceny/CTA/reset/progress/hover/addon/compare/reduced-motion a mock chat bez platených volaní. Až potom možno započítať nové READY ukážky.

QA snímky/ZIP a zdrojové dôkazy sa ukladajú do repo podľa výslovného povolenia majiteľa a zostávajú v existujúcich Vercel-ignore cestách /tools/, /n447/s5/sources/, /n447/s5/perfume-fragments/, /n447/s5/dokazy/. Žiadna produkcia/DNS/alias/main/master/pošta/platené volania;0 nových účtov alebo práv, žiadne mazanie starého WIP.
