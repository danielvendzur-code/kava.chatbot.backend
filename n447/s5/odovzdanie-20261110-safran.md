# Safran — checkpoint 10.11.2026

Nadväzuje na odovzdanie-SOLO.md a odovzdanie-20261110-spolupraca.md. Starý vzdialený SOLO súbor sa nemení: jeho úplný upload automatická kontrola odmietla pre súkromné odkazy na relácie. Toto je samostatný nový checkpoint bez takých odkazov.

## Firma a zdroje
Mýdlárna Šafrán, mydlarnasafran.cz, Klára Šafránková, IČO76267334. Oficiálne kontakty a podmienky súhlasia. Kontakt info@mydlarnasafran.cz z https://www.mydlarnasafran.cz/kontakty . Rezervácia claims3619670ff03fcdd22d925d885fb4fe2889ef40e1; doména/prevádzkovateľ prehľadané v91 dostupných vzdialených vetvách. Nie globálna kontrola Vercelu ani pošty.

Pred rezerváciou vlastný browser home a produkt po Přijmout nezbytné: telefónny kontakt Klára/Jsem tu pro vás, tel odkaz, Heureka recenzný tab. Produktový chat ani interaktívny poradca v tomto režime nepozorovaný; iné cookie/session režimy nepotvrdené. Bez kontaktu, formulára, košíka či zákazníckej správy.

12 produktových stránok zachytených, šípkový peeling aktuálne OutOfStock vylúčený.11 odlišných receptúr. Štyri pleťové prípravky, dve mydlá na ruky/telo, olej na nehtovú kůžičku, balzám na paty, pemzové mýdlo na chodidlá, jeden aktívny šampuk, balzám na pery. Mini/veľkosti nie sú ďalšie produkty.

14 presných variantových stránok overuje11 hlavných a3 menšie balenia. Ceny s DPH sú viditeľné retail ceny, nie nižšie netto. Šampuk60g ovál223Kč, mini15g84Kč;30g OutOfStock vylúčené. Odličovač100ml269Kč,50ml169Kč. Balzám na paty90g447Kč,45g289Kč. Mydlá cca90g ±5%, dostupné bez obalu; ostatné obaly OutOfStock. Balzám na pery cca10g podľa opisu; jednotková cena za ml nie je podklad na vymyslený objem. Šípkový olej30ml229Kč, argan50ml279Kč, nechtový roll-on5ml175Kč.

## Obsah a rozhranie
11 výsledkov v11 koncových cestách,8 otázkových uzlov. Žiadne prázdne odbočky ani nedosiahnuteľné receptúry. Žiadny sľub rozpočtu, pretože strom sa naň nepýta. Jediný doplnok: po umytí chodidiel pemzovým mydlom162Kč voliteľný nezaškrtnutý balzám90g447Kč, spolu609Kč; bez krížového predaja k telovým mydlám či pleťovým olejom.

Fotografie11 oficiálnych výrobkov prezreté. Zdieľané kvalitné scény zachované. Vizuálna kontrola opravila mytí tela s nevhodnou fotkou tváre na samostatnú scénu umývania rúk. Olejové voľby používajú aplikáciu oleja a zrelú tvár. Voľba pemzového mydla používa pravdivý oficiálny packshot namiesto nesúvisiaceho horného tela v sprche. Staré snímky zachované iba lokálne v sources/safran/before-scene-fix; nie finálne dôkazy.

Porovnanie má4 explicitné odlišné pleťové prípravky. Nový malý opt-in REG.compareProductIds v compare-native.js iba pre S5. Žiadna stará firma tento parameter nemá; pôvodná vetva výberu ostáva nezmenená. Čip presne „Porovnat pleťovou péči“, ostatné3 čipy príslušných výrobkov; všetky40px. Kontrastný oficiálny favicon avatar.

## Skutočné QA
- Offline celý strom11/11, bez prázdnych ciest. Lokálne33 výsledkov pri320/390/1280: načítané fotografie, presné ceny/balenia/CTA, reset, voliteľný doplnok a súčet, progress, hover bez posunu,4x40 čipy, mock pending/error a reduced motion, bez application JS errors.
- Po úprave scén iba6 zasiahnutých výsledkov telových mydiel a9 scén na3 šírkach,3 menšie balenia s presnou cenou/URL, opravené porovnanie. Posledný samostatný test explicitných4 pleťových kandidátov a porovnania/čipov na všetkých3 šírkach.
-3 backend mock volania, platené0. Žiadne živé modelové otázky ani zahraničné zákaznícke testy.
- Pôvodný test mal chybný predpoklad ml pri porovnaní mydiel; opravený na jednotky konkrétnych zvolených výrobkov, už prejdených11 výsledkov320px zachovaných. Druhá konkrétna chyba bola pevne zvolená telová dvojica mimo aktuálneho pickera; obsahový výber opravený explicitným pleťovým zoznamom.
- Výsledkové snímky33 a otázky vizuálne prezreté; desktop review koláže sú len výrezy pravého widgetu, pôvodné plné browser snímky sa zachovávajú.

Historický stav pred runtime uploadom: Preview bolo PENDING. Aktuálny dokončený stav je nižšie (11/11, séria11). Textová e-mailová ponuka NOT_READY. Žiadna produkcia, alias/DNS, pošta ani platený model.

## Súbežná práca
Nižší browser kolega po obnove prihlásenia prijal pokračovanie Adora Niche/Niche & Glow. Môže vlastnú izolovanú codex/s5-perfume-20261110, rezervácie až po živom home/product/widget a fresh domain/operator kontrole, claims s lease. Len vlastné katalógy/fakty/asset/config fragmenty, spoločné súbory vlastní tento pracovník. Muschio/Perfumia a všetky HOLD zachované. Storage zoznam odovzdaný majiteľovi pre najvyšší Codex; skutočné mazanie/poklesGB zatiaľ nepotvrdené.

Copy: ponuka bez explicitného textu o skúšobnom období už vlastne overená na READY dpl_DKBD55LqTS6rcifAscXEeVzBXpFC /2466a399f99d72180d52fa205212296d59f79d1f, iba živý offer-scope. Dôkaz s5-offer-preview-20261110.json/webp. Cena447+10 zostáva.


## Vlastné živé Preview dokončené
Runtime SHA2205d09478a99c988f134dc71a2be461d76b450e, READY dpl_9kwZ1rYSMwoFqvLPvredsQGR4MQU.
https://kava-chatbot-backend-qc9ixwf4l-danielvendzur-codes-projects.vercel.app/s5.html?demo=safran
Vlastné živé11/11 výsledkov, ceny/balenia/konkrétne CTA, skutočné naturalWidth800 až2327, optimalizovaný nechtový roll-on1024. Všetkých8 otázkových uzlov s načítanými obrázkami, progress a4 root voľby po resete.3 menšie varianty presné ceny/URL, doplnok162→609→162,4x40px čipy, explicitný pleťový picker a odlíčenie vs pleťové mydlo s načítanými fotografiami/cenami/balením/popisom/odkazmi. Žiadna živá modelová otázka ani platené volanie. Preview šírka1363, lokálne320/390/1280.5 živých snímok vizuálne prezretých.
Počiatočné predčasné čítanie obrázka sa nepočítalo, kým v ďalšom reálnom browser kroku nemal kladnú naturalWidth. Konzolový nález: v posledných200 zachytených error záznamoch všetky pochádzali z chrome-extension content-script a hlásili Error sending browser metadata to extension. V tejto obmedzenej vzorke žiadna aplikačná chyba; nejde o tvrdenie absolútne čistej celej konzoly. Rozšírenie/ochrana sa nemenili. Lokálne pageerror testy0.
Počet vlastne Preview overených teraz11. Nie produkcia ani schválenie majiteľom; návrh e-mailu stáleNOT_READY, pošta/NepísaťPENDING_CONTROLLER.

Plné dôkazy:57 finálnych lokálnych browser snímok v8 samostatných ZIPoch každý<250KB plus5 živých PreviewWebP. Manifest obsahuje SHA256 súborov/archívov. Všetkých13 binárnych objektov (8 samostatných ZIPov +5 živých WebP) úspešne uložených cez GitHub create_blob; manifest sa prikladá do tohto proof checkpointu. Zmena iba dôkazov/stavu, runtime2205 ostáva rozsahom živého QA. Žiadne opakovanie nezmenených testov.
