# Hypno a Bookarazzi — dokončené zdroje a lokálne QA pre MAIN

Vlastná vetva `codex/s5-perfume-wave4-20261113`, základ `ef38930705f7ace33d9e2074cfe2f10847be4cbf`. Predchádzajúca dvojica LUX PARFUM/ATMAN ostala zmrazená na vetve `codex/s5-perfume-wave3-20261113` na ef38930. MAIN vlastní začlenenie a živé Preview QA podľa výslovného pokynu majiteľa. Worker nevykonal spoločné runtime/backend zmeny, produkciu/DNS/poštu/platené volania. Cena447+10nezmenená, trialcopynevložená.

## Obsah a dôkazy

| Slug | Prevádzkovateľ/IČO | Tržby za2025oficiálne | Primárne balenia/ceny sDPH | Finálne lokálne výsledky |
|---|---|---:|---|---:|
| hypno | Hypno, s.r.o./51654598 SK |126622EUR |4vybrané nové kompozície,Fatria/Betlior/Tatrion/Vahrin,každá50ml79.90EUR |12/12na320/390/1280 |
| bookarazzi | Mooni s. r. o./51218399 SK,starší názovMoltoBelloDue |71901EUR |5kompozícií,každá50ml89EUR |15/15na320/390/1280 |

Preferovaný obratový strop500000EUR splnený u oboch. Hypno oficiálny report10321367/PDF12825897: čistýobrat r01 a tržbytovar r03=126622; bežné2025,wholeEURheader potvrdený. Bookarazzi/Mooni report9910985/PDF12145375 r02goods6149+r03výrobky/služby65752=71901EUR,nieprevádzkovévýnosy71955,zisk aleboaktíva. Ide ocelého právneho prevádzkovateľa,neodhadované osobitné tržby značky. RPOaktuálniaktívni/bezkonca, relevantné staré názvy skontrolované.

Pred rezerváciou fresh97remoteheads/2820unikátnychtextblobov/missing0: oficiálnedomény/aliasy/operátor/IČO/legacyname bez starej zhody, freshclaims bezcudzieho claimu. DostupnýVercelprojekt50domén a79teamaliasov, paginationnextnull voboch, bezzhody; nejde oglobálny audit iných účtov. Rezervačnýcommit `5dc5be907738007f93f8375b8e5a129f26459d77`, ownerPERFUME_WORKER, source-onlyscope.

## Skutočné merchantlive QA — nie demoPreviewQA

Automatizovaný skutočnýWPEWebKit sTLSverificationON, nie CUA/Chrome/fyzické zariadenia. Hypno home https://www.mojehypno.sk/ a https://www.mojehypno.sk/hypno-fatria-damsky-parfum-50ml/ poOdmietnuťcookies reálne vykreslené a snímky vizuálne prezreté. Žiadny produktchat/advisorlauncher nepozorovaný v týchto pohľadoch. PravýdolnýGoogleReviewsbadge je hodnotenie, niepozorovanýproduktchat. Opýtaťsa neskôr skutočne otvorené: modál Otázka na predajcu, Vášemail/Telefón/Správa, bezpečnostnácaptcha/Odoslať; ničvyplnené/odoslané, captcha neriešená. Je to pozorovaný kontaktnýformulár. Inécookie/session/neprejdenéstránky neisté.

Bookarazzi home https://www.bookarazzi.sk/ a https://bookarazzi.sk/produkt/the-final-chapter/ poOdmietnuťvoliteľnécookies reálne vykreslené a snímky vizuálne prezreté. Nezistený produktchat/advisorlauncher v týchto pohľadoch; bežnýnewsletter/contact neodoslaný. Prvýhome screenshot narazil na5sfonttimeout, normálny opakovanýscreenshot s30slimitom a vypnutím screenshotanimácií vyšiel; nebolto výpadokwebu/TLSobchádzanie. .comdiscovery503nedefinuje výpadok .sk. Všetky pohľady nonGET/cartrequestyblokované, ničdochatu/formulára/košíka. Automatickéfunkcie ovplyvnené blokovaním sú zreteľne ohraničené.

## Presnosť balení, skladov a fotografií

Hypno vybrané4nové50mlSKU bezvariantov. OficiálneProductdataLayer codes[0].quantity=>5 pri každomkonkrétnomjedinomSKU; je to explicitnéverejné skladovévyhlásenie vydavateľa, nie odhad ztlačidlaDokošíka či fyzickýaudit skladu. Viditeľná79.90cena súhlasí s product:price a itempropprice; VOP5.2cenyvrátaneDPH. Pôvodnéfotografie sú skutočnéobrazy50mlbalenia/krabičiek,niesúvymyslenéflakóny. Číselnepodobné2mlvzorky/sety ani ďalšie6staršíchkompozícií nie sú pridané do reprezentatívneho počtu. Príbehy/intenzita/príležitosti/zdravotné účinky nepreberané ako nedoloženýfakt; používa sa doslovnátonová pyramída.

Bookarazzi všetkých5namedkompozícií. Každýkonkrétny50mlproductURL má ProductOffer89EUR/InStock/valueAddedTaxIncluded=true a viditeľné50mltlačidloodkazujenasaméseba.3mlje samostatnývzorkaSKU inéhoURL,niesúto dvekompozície. Žiadnaagregovanánajnižšiavzorkovácena. Oficiálne5jednotlivých flakónovýchfotografií, nie5uhlovjednejvône. Zdroj má plochýzoznamtónov; UIzobrazuje kompletnéfarebnéznačky, žiadnefalošnéHlava/Srdce/Základ ani%/1–10. PriHypno je skutočnápyramída zobrazenáako3riadky. Všetkyoriginálybytepreserved,žiadnyretuš/upscale.

Voprednezaškrtnutý kompatibilnýdoplnok zostáva vypnutý: k2/3mlsamostatnémuSKU nie je nezávisle overený adekvátnyfotokontrakt a podporovanýsamostatnýmalýpackscope. Neoznačovať inýprodukt falošnezaShoptet/Shopifyvariant. Overené sú skutočneodlišné alternatívy a porovnanie. Rozpočet sa nepýta a nesľubuje.

## Lokálne QA

27/27finálnych výsledkov,27source-boundprofilov, všetkých9listovdosiahnuteľných a6neprázdnych stavovotázok.320/390/1280overené foto načítané/nativepixelrozmery, presnéceny/balenia/href, konkrétneCTA vrovnakejkarte, reset/priebeh,4rovnaké40pxčipy, hover/reducedmotion,2odlišnéporovnávanéprodukty.18cielených chipodpovedí len offline/sourceIDmock. ChatavatarHypnoH ajBookarazziseal kontrastný,vizuálne prezretý. Všetkých27finálnych primárnychsnímok vizuálneprezretých cez6kontaktnýchlistov; odlišnéoriginálneproduktovéfotografie tiež.

Bookarazziwordmark bol najprv prílišmalý, zväčšený iba vovlastnom companyCSS, bezúpravyzdrojovéhoSVG. Celých15Bookvýsledkov opäťoverených,avizuálne všetky3šírky. Hypnonezmenených12nereštartovaných, proofjasneodlišujepôvodných15Bookodfinálnych15,tieniesúďalšieprodukty. Dlhénázvynamobile riadnezalamované,390pxkontrolageometrie vnútornýchprvkov bezoverflow;320pxsnímky všetkyvizuálneprezreté.

`proof/summary.json`, `proof/hypno-local-ui.json`, `proof/bookarazzi-local-ui.json` a per-entryhashmanifesty. ZIPy obsahujúvšetkyfinálnelokálnesnímky+merchantlive/snímkykontaktnéhoformulára+kontaktnélisty. `proof/source-inputs.json` presnéhashy48vstupnýchsource/config/assets/CSSsúborov. Predchádzajúce ajnové rawtestysú zachovanépracovisku,ničnezmazané. VšetkyQAarchívy pod/tools/ vylúčené zVerceluexistujúcimpravidlom.

## Presné začlenenie pre MAIN

Pre slug `hypno`, `bookarazzi`:

- `catalogues/SLUG.js` — import vfrontende/backenderegistri BRANDS sSKjazykom
- `assets/s5/SLUG/` — pôvodnéfotografie,oficiálnelogo/avatar
- `n447/s5/sources/SLUG/verified-products.json` a `selection-model.json`
- `n447/s5/perfume-fragments/SLUG.config.json` — registryObject, exactIDofflineReplyRequirements, compareProductIds
- `n447/s5/perfume-fragments/SLUG.selection-model.json`
- `tools/s5/perfume-wave4/candidate-packages/SLUG/ui-review.css` skopírovať do nového `n447/s5/brands/SLUG.css`, nastaviť registryObject.companyCss='/n447/s5/brands/SLUG.css'
- `tools/s5/perfume-wave4/candidate-packages/SLUG/integration-review.json` — strojový presnýimport/brand/rulecontract

Použiť existujúcu prezentačnúvrstvu a918zprvých15:fragrance-profile.css,extras.scentProfileverziu1 a supporthideStepEstimatepodmienku. Pridanénovéfragmenty už majúfragrancePresentation.hideStepEstimate=true a fragranceResultExtras.scentProfile. Pri každomnovomslugu nastaviťbody.dataset.fragranceProfile='visual-v1'. Žiadnanováoprava c9jadra, žiadnypurpose=face/hairhack. Registrytypecosmeticsje existujúciS5transport, samotnéproduktymajú category=fragrance a správnyExtrait/EDPkind.

MAIN nech freshskontroluje svojHEAD a preberie iba novýwave4commitrespnovécompanysúbory, nie automaticky celústaršiu spoločnúhistóriubaseef. Vlastnéspoločné registry/boot/support/reply/extras/backend/core sa nemenili. ŽivýREADYdeployment eštenieznačíhotovéQA; dohotových ažpo MAINzačlenení a vlastnomživomQA všetkých4+5výsledkov na konkrétnomdeployment/SHA. Niesúvymyslené novésubdomény aniEmailodoslania. Oficiálnekontakty info@mojehypno.sk /info@bookarazzi.sk. Starých17oslovených sa nemení, predošlých15hotovýchodkazov zachovaných.

Lokálnevizuály:/workspace/previews/20261113-wave4/. Cena447+10, záujem/predajnegantovaný. StaréHOLD,Scentisimoarchívy a ďalšieWIP zachované. Jeden existujúci ownread-onlyresearchdelta v tools/s5/perfume-wave3/research/next-niche-parfum-unreserved.json je nezáväznýUNRESERVEDa zachovanýlokálne; nieje prenosstaréhoHOLD/registrovanáfirma ani súčasťnovýchdemoimportov.
