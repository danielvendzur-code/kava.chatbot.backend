/* Czech companies get the whole demo in Czech: the page around the widget, the advisor and the chat.
   The demos are authored in Slovak; this pass rewrites rendered text for shops on a .cz domain.
   Product names are never touched. Loaded last on every demo page. */
(() => {
  'use strict';
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug] || {};
  const urls = [window.JOLKA?.brand?.shopUrl, window.JOLKA?.brand?.storyUrl, brand.url, brand.shopUrl, brand.website, brand.shop, brand.catalogue?.[0]?.url, brand.products?.[0]?.url, window.CX_BRAND_URL];
  const czech = window.CX_FORCE_LANG === 'cs' || urls.some((u) => /^https?:\/\/[^/]*\.cz(\/|$)/i.test(String(u || '')));
  if (!czech) return;
  document.documentElement.lang = 'cs';
  window.CX_LANG = 'cs';

  /* Whole text nodes. */
  const exact = {
    // shared page copy
    'Mám záujem': 'Mám zájem', 'Čo dostanete': 'Co získáte', 'Chcem to na svoj web': 'Chci to na svůj web', 'Chatbot pre váš e-shop': 'Chatbot pro váš e-shop',
    'Odpovedá aj o polnoci': 'Odpovídá i o půlnoci', 'aj cez víkend, bez vás': 'i o víkendu, bez vás', 'Pozná vašu ponuku': 'Zná vaši nabídku', 'Pozná váš katalóg': 'Zná váš katalog',
    'História konverzácií': 'Historie konverzací', 'vidíte, na čo sa zákazníci pýtajú': 'vidíte, na co se zákazníci ptají', 'Vidíte, na čo sa pýtajú': 'Vidíte, na co se ptají',
    'História konverzácií, aj otázky, na ktoré ponuka neodpovedá.': 'Historie konverzací i otázky, na které nabídka neodpovídá.',
    'Prvý mesiac zdarma': 'První měsíc zdarma', 'jednorazovo': 'jednorázově', 'mesačne': 'měsíčně', 'Bez viazanosti, vypnete kedykoľvek.': 'Bez závazků, vypnete kdykoli.',
    'Bez viazanosti, vypnete kedykoľvek. Preklik na produkt alebo napojenie na košík za príplatok.': 'Bez závazků, vypnete kdykoli. Proklik na produkt nebo napojení na košík za příplatek.',
    'prevádzka, zmeny v ponuke, opravy': 'provoz, změny v nabídce, opravy', 'Ozvite sa mi': 'Ozvěte se mi', 'Otvoriť poradcu': 'Otevřít poradce', 'Skúsiť chat': 'Zkusit chat', 'Vyskúšať výber': 'Vyzkoušet výběr', 'Viac info': 'Více info',
    'online poradca': 'online poradce', 'Späť': 'Zpět', '‹ Späť': '‹ Zpět', 'Výsledok': 'Výsledek', 'Zmeniť odpovede': 'Změnit odpovědi', 'Vybrať znova': 'Vybrat znovu',
    'Odporúčam vám': 'Doporučuji vám', 'Otvoriť v e-shope': 'Otevřít v e-shopu', 'Pozrieť v e-shope ↗': 'Zobrazit v e-shopu ↗', 'Pozrieť produkt ↗': 'Zobrazit produkt ↗', 'Pozrieť produkt v e-shope ↗': 'Zobrazit produkt v e-shopu ↗',
    'Zavrieť': 'Zavřít', 'Cena': 'Cena', 'Skryť pozvánku': 'Skrýt pozvánku', 'Začať odznova': 'Začít znovu', 'Zavrieť poradcu': 'Zavřít poradce', 'Režim poradcu': 'Režim poradce', 'Odoslať správu': 'Odeslat zprávu',
    'Zavrieť náhľad': 'Zavřít náhled', 'Otvoriť poradcu ': 'Otevřít poradce',
    // coffee
    'Chatbot s vašimi kávami': 'Chatbot s vašimi kávami', 'Vaše kávy a ceny, nie všeobecné odpovede.': 'Vaše kávy a ceny, ne obecné odpovědi.',
    'Pôvod, praženie, príprava aj porovnanie dvoch káv.': 'Původ, pražení, příprava i srovnání dvou káv.', 'Výber cez štyri otázky': 'Výběr přes čtyři otázky',
    'Chuť, príprava, nápoj a kofeín — na konci jedna konkrétna káva.': 'Chuť, příprava, nápoj a kofein — na konci jedna konkrétní káva.',
    'Poradí zákazníkovi kávu a odpovie mu na otázky.': 'Poradí zákazníkovi kávu a odpoví mu na otázky.', 'pracuje s vašimi kávami a cenami': 'pracuje s vašimi kávami a cenami',
    'na konci jedna konkrétna káva': 'na konci jedna konkrétní káva', 'nastavenie a naplnenie vašimi kávami': 'nastavení a naplnění vašimi kávami',
    'Nájdite svoju kávu': 'Najděte svou kávu', '4 otázky · jedno odporúčanie': '4 otázky · jedno doporučení', '4 otázky · konkrétne odporúčanie': '4 otázky · konkrétní doporučení',
    'Výber kávy': 'Výběr kávy', 'Kávový výber': 'Kávový výběr', 'Príprava': 'Příprava', 'Nápoj': 'Nápoj', 'Acidita': 'Acidita', 'Chuť': 'Chuť',
    'Čo chcete cítiť v šálke?': 'Co chcete cítit v šálku?', 'Sladká a čokoládová': 'Sladká a čokoládová', 'Kakao, orechy a karamel': 'Kakao, ořechy a karamel',
    'Vyvážená': 'Vyvážená', 'Čistá, jemná a univerzálna': 'Čistá, jemná a univerzální', 'Ovocná a svieža': 'Ovocná a svěží', 'Výraznejší pôvod a iskra': 'Výraznější původ a jiskra',
    'Výrazná a netradičná': 'Výrazná a netradiční', 'Chcem zaujímavý výberový profil': 'Chci zajímavý výběrový profil',
    'Ako si pripravujete kávu?': 'Jak si připravujete kávu?', 'Automat': 'Automat', 'Rýchla každodenná šálka': 'Rychlý každodenní šálek', 'Pákový kávovar': 'Pákový kávovar',
    'Espresso pripravujete ručne': 'Espresso připravujete ručně', 'Moka kanvička': 'Moka konvička', 'Silnejšia domáca príprava': 'Silnější domácí příprava', 'V60 alebo prekvapkávanie': 'V60 nebo překapávání',
    'Pijete ju čiernu alebo s mliekom?': 'Pijete ji černou, nebo s mlékem?', 'Čiernu': 'Černou', 'Chcem cítiť kávu naplno': 'Chci cítit kávu naplno', 'S mliekom': 'S mlékem',
    'Cappuccino alebo flat white': 'Cappuccino nebo flat white', 'Striedam oboje': 'Střídám obojí', 'Potrebujem univerzálnu kávu': 'Potřebuji univerzální kávu',
    'Koľko sviežosti chcete v šálke?': 'Kolik svěžesti chcete v šálku?', 'Čo najmenej': 'Co nejméně', 'Kyslá káva mi nesedí': 'Kyselá káva mi nesedí', 'Jemnú': 'Jemnou',
    'Sviežosť iba v pozadí': 'Svěžest jen v pozadí', 'Výraznú': 'Výraznou', 'Ovocná acidita mi chutí': 'Ovocná acidita mi chutná', 'Prekvapte ma': 'Překvapte mě', 'Chcem objavovať': 'Chci objevovat',
    'Vaša káva': 'Vaše káva', 'Osobné odporúčanie': 'Osobní doporučení', 'Najbližšia možnosť': 'Nejbližší možnost', 'Vaša voľba': 'Vaše volba', 'Prečo práve táto': 'Proč právě tato',
    'Ak by ste chceli inú': 'Kdybyste chtěli jinou', 'Acidita opisuje chuťovú sviežosť, nie kvalitu kávy.': 'Acidita popisuje chuťovou svěžest, ne kvalitu kávy.',
    'minimálna': 'minimální', 'jemná': 'jemná', 'stredná': 'střední', 'výrazná': 'výrazná', 'Espresso a filter': 'Espresso a filtr', 'Espresso a mliečne nápoje': 'Espresso a mléčné nápoje', 'Filter': 'Filtr',
    'Jednodruhové kávy': 'Jednodruhové kávy', 'Kávové zmesi': 'Kávové směsi', 'Bezkofeínová káva': 'Bezkofeinová káva',
    'Káva do automatu': 'Káva do automatu', 'Káva na filter': 'Káva na filtr', 'Niečo netradičné': 'Něco netradičního', 'Bez kofeínu': 'Bez kofeinu',
    'Do automatu a na väčšiu spotrebu je stavaná': 'Do automatu a na větší spotřebu je stavěná', 'Na filter odporúčam': 'Na filtr doporučuji', 'Najnetradičnejšia káva v ponuke je': 'Nejnetradičnější káva v nabídce je', 'Bez kofeínu je tu': 'Bez kofeinu je tu',
    'Napíšte, akú kávu hľadáte…': 'Napište, jakou kávu hledáte…', 'Napíšte otázku o káve': 'Napište otázku o kávě', 'Otvoriť kávového poradcu': 'Otevřít kávového poradce',
    'Presnú zhodu v ponuke nemáme.': 'Přesnou shodu v nabídce nemáme.',
// skincare
    'Čierny čaj': 'Černý čaj', 'Zelený čaj': 'Zelený čaj', 'Biely čaj': 'Bílý čaj', 'Ovocný čaj': 'Ovocný čaj', 'Bylinný čaj': 'Bylinný čaj', 'v sáčkoch': 'v sáčcích', 'sypaný': 'sypaný', 'ochutený': 'ochucený', 'bez príchute': 'bez příchutě', 'pre suchú pokožku': 'pro suchou pokožku', 'pre mastnú pleť': 'pro mastnou pleť', 'pre citlivú pokožku': 'pro citlivou pokožku', 'proti vráskam': 'proti vráskám', 'hydratácia': 'hydratace', 'upokojenie': 'zklidnění', 'čistenie': 'čištění',
    'Ktorý z nich vám sedí viac?': 'Který z nich vám sedí víc?', 'Tieto produkty spĺňajú vaše odpovede.': 'Tyto produkty splňují vaše odpovědi.', 'Vybrali ste si ho z produktov, ktoré spĺňajú vaše odpovede.': 'Vybrali jste si ho z produktů, které splňují vaše odpovědi.', 'Výber': 'Výběr', 'Ktorý čaj si vyberiete?': 'Který čaj si vyberete?', 'Tieto čaje spĺňajú vaše odpovede.': 'Tyto čaje splňují vaše odpovědi.', 'Vybrali ste si ho z čajov, ktoré spĺňajú vaše odpovede.': 'Vybrali jste si ho z čajů, které splňují vaše odpovědi.',
    'Tento produkt nájdete aj v sade': 'Tento produkt najdete i v sadě', 'Doplňte starostlivosť': 'Doplňte péči', 'Sada': 'Sada', 'Rastlina': 'Rostlina', 'Aký bylinný čaj hľadáte?': 'Jaký bylinný čaj hledáte?', 'Podľa časti rastliny, z ktorej čaj je.': 'Podle části rostliny, ze které čaj je.', 'Z kvetov': 'Z květů', 'Jemné kvetové čaje': 'Jemné květové čaje', 'Z vňate a listov': 'Z natě a listů', 'Bylinné čaje z celej rastliny': 'Bylinné čaje z celé rostliny', 'Z plodov': 'Z plodů', 'Plodové čaje': 'Plodové čaje',
    'Ďalšie možnosti': 'Další možnosti',
    'Chatbot s vaším katalógom': 'Chatbot s vaším katalogem', 'Vaše produkty a ceny, nie všeobecné odpovede.': 'Vaše produkty a ceny, ne obecné odpovědi.',
    'Zloženie, typ pleti, rutina aj porovnanie dvoch produktov.': 'Složení, typ pleti, rutina i srovnání dvou produktů.',
    'Výber podľa potrieb': 'Výběr podle potřeb', 'Typ pleti, priorita, typ produktu a rozpočet — na konci konkrétny produkt.': 'Typ pleti, priorita, typ produktu a rozpočet — na konci konkrétní produkt.',
    'Poradí zákazníkovi starostlivosť a odpovie mu na otázky.': 'Poradí zákazníkovi péči a odpoví mu na otázky.', 'pracuje s vašimi produktmi a cenami': 'pracuje s vašimi produkty a cenami',
    'Výber podľa vašich potrieb': 'Výběr podle vašich potřeb', 'na konci konkrétny produkt': 'na konci konkrétní produkt', 'nastavenie a naplnenie vašimi produktmi': 'nastavení a naplnění vašimi produkty',
    'Pomôcť s výberom?': 'Pomoci s výběrem?', 'Pár otázok · konkrétny produkt': 'Pár otázek · konkrétní produkt', 'Výber starostlivosti': 'Výběr péče', 'VÝBER STAROSTLIVOSTI': 'VÝBĚR PÉČE',
    'Nájsť vhodný produkt': 'Najít vhodný produkt', 'Vaše potreby · typ produktu · rozpočet': 'Vaše potřeby · typ produktu · rozpočet',
    'Mám suchú pleť': 'Mám suchou pleť', 'Produkty na vlasy': 'Produkty na vlasy', 'Starostlivosť o telo': 'Péče o tělo', 'Darčekové sady': 'Dárkové sady',
    'Otvoriť výber starostlivosti': 'Otevřít výběr péče', 'Opýtajte sa na starostlivosť…': 'Zeptejte se na péči…', 'Otázka': 'Otázka', 'Odoslať': 'Odeslat', 'Poradca pri výbere starostlivosti': 'Poradce při výběru péče',
    'Oblasť': 'Oblast', 'S čím vám môžem pomôcť?': 'S čím vám mohu pomoci?', 'Najprv vyberte oblasť starostlivosti.': 'Nejprve vyberte oblast péče.',
    'Pleť': 'Pleť', 'Pery': 'Rty', 'Telo': 'Tělo', 'Vlasy': 'Vlasy', 'Darčeky a sady': 'Dárky a sady', 'Doplnky a ďalšia ponuka': 'Doplňky a další nabídka', 'Doplnky výživy': 'Doplňky stravy', 'Líčenie': 'Líčení',
    'Okolie očí': 'Oční okolí', 'Brada': 'Vousy', 'Deti a mamy': 'Děti a maminky', 'Vône do domácnosti': 'Vůně do domácnosti', 'Čaje': 'Čaje',
    'Vaše potreby': 'Vaše potřeby', 'Aká je vaša pleť?': 'Jaká je vaše pleť?', 'Ako sa cíti vaša pokožka?': 'Jak se cítí vaše pokožka?', 'Aké sú vaše vlasy a pokožka hlavy?': 'Jaké jsou vaše vlasy a pokožka hlavy?',
    'Zohľadním to pri odporúčaní.': 'Zohledním to při doporučení.', 'Suchá a napnutá': 'Suchá a napjatá', 'Chýba jej komfort': 'Chybí jí komfort', 'Mastná alebo zmiešaná': 'Mastná nebo smíšená', 'Lesk a nedokonalosti': 'Lesk a nedokonalosti',
    'Citlivá': 'Citlivá', 'Reaguje na bežnú starostlivosť': 'Reaguje na běžnou péči', 'Bez výrazného problému': 'Bez výrazného problému', 'Bežná každodenná starostlivosť': 'Běžná každodenní péče',
    'Nechám si poradiť': 'Nechám si poradit', 'Podľa ostatných odpovedí': 'Podle ostatních odpovědí', 'Suché vlasy': 'Suché vlasy', 'Potrebujú výživu a komfort': 'Potřebují výživu a komfort',
    'Rýchlo sa mastiace': 'Rychle se mastící', 'Starostlivosť o vlasy a pokožku hlavy': 'Péče o vlasy a pokožku hlavy', 'Citlivá pokožka hlavy': 'Citlivá pokožka hlavy', 'Jemná starostlivosť': 'Jemná péče', 'Bežné umývanie a starostlivosť': 'Běžné mytí a péče',
    'Priorita': 'Priorita', 'Čo je pre vás najdôležitejšie?': 'Co je pro vás nejdůležitější?', 'Vyberte jednu hlavnú potrebu.': 'Vyberte jednu hlavní potřebu.',
    'Hydratácia a výživa': 'Hydratace a výživa', 'Doplniť bežnú starostlivosť': 'Doplnit běžnou péči', 'Komfort a upokojenie': 'Komfort a zklidnění', 'Menej mastenia': 'Méně maštění', 'Cielenejšia starostlivosť': 'Cílenější péče',
    'Každodenná starostlivosť': 'Každodenní péče', 'Pravidelný základ': 'Pravidelný základ', 'Pružnosť a zrelá pleť': 'Pružnost a zralá pleť', 'Starostlivosť proti vráskam': 'Péče proti vráskám',
    'Čistenie a umývanie': 'Čištění a mytí', 'Čistý základ starostlivosti': 'Čistý základ péče',
    'Typ produktu': 'Typ produktu', 'Ktorý typ produktu hľadáte?': 'Jaký typ produktu hledáte?', 'Vyberte formu, ktorú chcete používať.': 'Vyberte formu, kterou chcete používat.', 'Forma nie je pre mňa dôležitá': 'Forma pro mě není důležitá',
    'Krémy a balzamy': 'Krémy a balzámy', 'Šampóny': 'Šampony', 'Séra': 'Séra', 'Oleje': 'Oleje', 'Masky': 'Masky', 'Gély': 'Gely', 'Krémy': 'Krémy', 'Toniká a vody': 'Tonika a vody', 'Kondicionéry': 'Kondicionéry',
    'Doplnky': 'Doplňky', 'Darčekové poukazy': 'Dárkové poukazy', 'Vône': 'Vůně', 'Sviečky': 'Svíčky', 'Iné produkty': 'Jiné produkty', 'Ďalšia ponuka': 'Další nabídka', 'Starostlivosť': 'Péče',
    'Rozpočet': 'Rozpočet', 'Do akej sumy vyberáme?': 'Do jaké částky vybíráme?', 'Cena jedného produktu.': 'Cena jednoho produktu.', 'Bez limitu': 'Bez limitu', 'Rozhodne vhodnosť produktu': 'Rozhodne vhodnost produktu',
    'Váš výber': 'Váš výběr', 'Toto vám odporúčam': 'Tohle vám doporučuji', 'Konkrétny produkt podľa vašich odpovedí.': 'Konkrétní produkt podle vašich odpovědí.', 'Prečo práve tento': 'Proč právě tento',
    'Ďalšia vhodná možnosť': 'Další vhodná možnost', 'Skryť ďalšie možnosti': 'Skrýt další možnosti', 'Cenu potvrdí e-shop': 'Cenu potvrdí e-shop',
    'Takúto kombináciu v ponuke nemáme': 'Takovou kombinaci v nabídce nemáme',
    'Žiadny produkt nespĺňa všetky vaše odpovede naraz. Skúste upraviť rozpočet alebo sa vráťte o krok späť.': 'Žádný produkt nesplňuje všechny vaše odpovědi najednou. Zkuste upravit rozpočet nebo se vraťte o krok zpět.',
    'Je to jediný produkt v ponuke, ktorý spĺňa všetky vaše odpovede.': 'Je to jediný produkt v nabídce, který splňuje všechny vaše odpovědi.',
    'Z produktov, ktoré spĺňajú vaše odpovede, je cenovo najdostupnejší.': 'Z produktů, které splňují vaše odpovědi, je cenově nejdostupnější.',
    'Otázku liečby kožného ochorenia riešte s lekárom. Môžem vám ukázať kozmetické produkty a odkazy na ich úplné zloženie.': 'Otázku léčby kožního onemocnění řešte s lékařem. Mohu vám ukázat kosmetické produkty a odkazy na jejich úplné složení.',
    'Táto ponuka má ceny v Kč. Zadajte prosím rozpočet v Kč alebo vyberajte bez cenového limitu.': 'Tato nabídka má ceny v Kč. Zadejte prosím rozpočet v Kč nebo vybírejte bez cenového limitu.',
    'Takúto formu produktu v tejto oblasti ponuky nemáme. Vyberte inú formu vo Výbere starostlivosti.': 'Takovou formu produktu v této oblasti nabídky nemáme. Vyberte jinou formu ve Výběru péče.',
    'V overenej ponuke sa nenašla táto kombinácia potrieb a rozpočtu. Skúste upraviť jednu podmienku vo Výbere starostlivosti.': 'V ověřené nabídce se tato kombinace potřeb a rozpočtu nenašla. Zkuste upravit jednu podmínku ve Výběru péče.',
    'Poradcu sa nepodarilo načítať. Skúste obnoviť stránku.': 'Poradce se nepodařilo načíst. Zkuste obnovit stránku.',
    'suchú pokožku': 'suchou pokožku', 'mastnú alebo zmiešanú pleť': 'mastnou nebo smíšenou pleť', 'mastnú pokožku': 'mastnou pokožku', 'citlivú pokožku': 'citlivou pokožku', 'pokožku bez výrazného problému': 'pokožku bez výrazného problému',
    'rýchlo sa mastiace vlasy': 'rychle se mastící vlasy', 'citlivú pokožku hlavy': 'citlivou pokožku hlavy', 'bežné vlasy bez výrazného problému': 'běžné vlasy bez výrazného problému',
    'hydratácia a výživa': 'hydratace a výživa', 'jemná starostlivosť': 'jemná péče', 'menej mastenia': 'méně maštění', 'pružnosť a zrelá pleť': 'pružnost a zralá pleť', 'čistenie a umývanie': 'čištění a mytí', 'každodenná starostlivosť': 'každodenní péče',
    // tea
    'Kofeín, druh čaju, chuť a rozpočet — na konci konkrétny čaj.': 'Kofein, druh čaje, chuť a rozpočet — na konci konkrétní čaj.', 'Pár otázok · konkrétny čaj': 'Pár otázek · konkrétní čaj',
    'Poradí zákazníkovi čaj a odpovie mu na otázky.': 'Poradí zákazníkovi čaj a odpoví mu na otázky.', 'Výber čaju': 'Výběr čaje', 'VÝBER ČAJU': 'VÝBĚR ČAJE', 'Nájsť vhodný čaj': 'Najít vhodný čaj',
    'Kofeín · druh · chuť · rozpočet': 'Kofein · druh · chuť · rozpočet', 'Poradca pri výbere čaju': 'Poradce při výběru čaje', 'Otvoriť výber čaju': 'Otevřít výběr čaje',
    'Pre koho': 'Pro koho', 'Kofeín': 'Kofein', 'Druh čaju': 'Druh čaje', 'Pre koho čaj vyberáte?': 'Pro koho čaj vybíráte?', 'Podľa toho vyberiem čaj alebo darčekovú sadu.': 'Podle toho vyberu čaj nebo dárkovou sadu.',
    'Pre seba': 'Pro sebe', 'Čaj na každý deň': 'Čaj na každý den', 'Ako darček': 'Jako dárek', 'Čajová sada alebo kolekcia': 'Čajová sada nebo kolekce',
    'Kedy si čaj doprajete?': 'Kdy si čaj dopřejete?', 'Rozhoduje to o tom, či má čaj obsahovať kofeín.': 'Rozhoduje to o tom, zda má čaj obsahovat kofein.',
    'Ráno a cez deň': 'Ráno a přes den', 'S kofeínom: čierny, zelený alebo biely čaj': 'S kofeinem: černý, zelený nebo bílý čaj', 'Večer alebo pre deti': 'Večer nebo pro děti',
    'Bez kofeínu: ovocné, bylinné čaje a rooibos': 'Bez kofeinu: ovocné, bylinné čaje a rooibos', 'Nezáleží mi na tom': 'Nezáleží mi na tom', 'Vyberiem podľa chuti': 'Vyberu podle chuti',
    'Aký čaj máte radi?': 'Jaký čaj máte rádi?', 'Vyberte druh čaju.': 'Vyberte druh čaje.', 'Ovocný': 'Ovocný', 'Ovocné zmesi': 'Ovocné směsi', 'Jemný, prirodzene bez kofeínu': 'Jemný, přirozeně bez kofeinu',
    'Biely': 'Bílý', 'Jemný pravý čaj': 'Jemný pravý čaj', 'Čierny': 'Černý', 'Plný pravý čaj': 'Plný pravý čaj', 'Zelený': 'Zelený', 'Svieži pravý čaj': 'Svěží pravý čaj', 'Bylinný': 'Bylinný', 'Byliny, kvety a plody': 'Byliny, květy a plody',
    'Druh nie je pre mňa dôležitý': 'Druh pro mě není důležitý', 'Akú chuť hľadáte?': 'Jakou chuť hledáte?', 'Podľa ovocia a korenia v názve čaju.': 'Podle ovoce a koření v názvu čaje.',
    'Hrejivú a korenistú': 'Hřejivou a kořeněnou', 'Zimné zmesi, škorica, punč': 'Zimní směsi, skořice, punč', 'Bobuľovú': 'Bobulovou', 'Jahoda, malina, čučoriedka, čerešňa': 'Jahoda, malina, borůvka, třešeň',
    'Exotickú a citrusovú': 'Exotickou a citrusovou', 'Mango, melón, mandarínka, limetka': 'Mango, meloun, mandarinka, limetka', 'Sadové ovocie': 'Sadové ovoce', 'Slivka, hruška': 'Švestka, hruška',
    'Inú ovocnú': 'Jinou ovocnou', 'Ďalšie ovocné zmesi': 'Další ovocné směsi', 'Chuť nie je pre mňa dôležitá': 'Chuť pro mě není důležitá', 'Cena jedného balenia.': 'Cena jednoho balení.',
    'Konkrétny čaj podľa vašich odpovedí.': 'Konkrétní čaj podle vašich odpovědí.', 'Čajová sada vhodná ako darček.': 'Čajová sada vhodná jako dárek.', 'Tento druh čaju je prirodzene bez kofeínu.': 'Tento druh čaje je přirozeně bez kofeinu.',
    'Obsahuje zložku s kofeínom.': 'Obsahuje složku s kofeinem.', 'Pravý čaj obsahuje kofeín.': 'Pravý čaj obsahuje kofein.', 'Darčeková sada': 'Dárková sada', 'S kofeínom': 'S kofeinem',
    'Ovocné čaje': 'Ovocné čaje', 'Biele čaje': 'Bílé čaje', 'Čierne čaje': 'Černé čaje', 'Zelené čaje': 'Zelené čaje', 'Bylinné čaje': 'Bylinné čaje', 'Darčekové čajové sady': 'Dárkové čajové sady',
    'ovocný čaj': 'ovocný čaj', 'biely čaj': 'bílý čaj', 'čierny čaj': 'černý čaj', 'zelený čaj': 'zelený čaj', 'bylinný čaj': 'bylinný čaj', 'čajová sada': 'čajová sada',
    'Zdravotné účinky čajov neposudzujem. Vyberiem vám čaj podľa druhu, chuti a toho, či má obsahovať kofeín; zloženie nájdete pri produkte v e-shope.': 'Zdravotní účinky čajů neposuzuji. Vyberu vám čaj podle druhu, chuti a toho, zda má obsahovat kofein; složení najdete u produktu v e-shopu.',
    'Dopravu, platbu a kontakty nájdete priamo v e-shope. Tu vám pomôžem vybrať konkrétny čaj.': 'Dopravu, platbu a kontakty najdete přímo v e-shopu. Tady vám pomohu vybrat konkrétní čaj.',
    'Tu vyberáme čaje. Ďalší sortiment nájdete v e-shope.': 'Tady vybíráme čaje. Další sortiment najdete v e-shopu.', 'Táto ponuka má ceny v Kč. Zadajte prosím rozpočet v Kč.': 'Tato nabídka má ceny v Kč. Zadejte prosím rozpočet v Kč.',
    'Takýto čaj v ponuke nemáme. Skúste zmeniť druh čaju alebo rozpočet, prípadne otvorte Výber čaju.': 'Takový čaj v nabídce nemáme. Zkuste změnit druh čaje nebo rozpočet, případně otevřete Výběr čaje.',
    // tasting notes
    'broskyne': 'broskve', 'kakao': 'kakao', 'jazmínový čaj': 'jasmínový čaj', 'čokoláda': 'čokoláda', 'oriešky': 'oříšky', 'marhule': 'meruňky', 'mliečna čokoláda': 'mléčná čokoláda', 'červené jablko': 'červené jablko',
    'med': 'med', 'pečené jablká': 'pečená jablka', 'vanilka': 'vanilka', 'karamel': 'karamel', 'sušené ovocie': 'sušené ovoce', 'nugát': 'nugát', 'zemitosť': 'zemitost', 'smotana': 'smetana', 'mandarínka': 'mandarinka',
    'pomarančová kôra': 'pomerančová kůra', 'slivky': 'švestky', 'mandle': 'mandle', 'orechy': 'ořechy', 'lieskové orechy': 'lískové ořechy', 'horká čokoláda': 'hořká čokoláda', 'tmavá čokoláda': 'tmavá čokoláda',
    'citrusy': 'citrusy', 'lesné ovocie': 'lesní ovoce', 'čučoriedky': 'borůvky', 'jahody': 'jahody', 'maliny': 'maliny', 'čerešne': 'třešně', 'višne': 'višně', 'hrozno': 'hrozny', 'trstinový cukor': 'třtinový cukr',
    'kvety': 'květy', 'korenie': 'koření', 'škorica': 'skořice', 'tabak': 'tabák', 'hrozienka': 'rozinky', 'sladké ovocie': 'sladké ovoce', 'tropické ovocie': 'tropické ovoce', 'čierny čaj': 'černý čaj', 'bergamot': 'bergamot'
  };

  /* Sentences with a changing part. */
  const patterns = [
    [/^Kávový chatbot pre (.+)$/, 'Kávový chatbot pro $1'], [/^Krok (\d+) zo (\d+)$/, 'Krok $1 ze $2'], [/^(\d+)\. krok$/, '$1. krok'],
    [/^(.+) – kávový poradca$/, '$1 – kávový poradce'], [/^Kávový poradca (.+)$/, 'Kávový poradce $1'], [/^(.+) – produktová prezentácia$/, '$1 – produktová prezentace'],
    [/^Dobrý deň\. Vyberieme spolu kávu z ponuky (.+) podľa vašej prípravy a chutí\.$/, 'Dobrý den. Vybereme spolu kávu z nabídky $1 podle vaší přípravy a chutí.'],
    [/^Chuť: (.+)\.$/, (m, list) => 'Chuť: ' + pieces(list) + '.'],
    [/^\. Chuť: (.+?)\. (.+?)\. Balenie (.+)\.$/, (m, list, price, pack) => '. Chuť: ' + pieces(list) + '. ' + price + '. Balení ' + pack + '.'],
    [/^Acidita: (.+)$/, (m, level) => 'Acidita: ' + ({'čo najmenej':'co nejméně','jemnú':'jemnou','výraznú':'výraznou','prekvapte ma':'překvapte mě'}[level] ?? level)],
    [/^Z ponuky by som začal kávou$/, 'Z nabídky bych začal kávou'],
    [/^\. Chuť: (.+?)\. Cez štyri krátke otázky vo Výbere kávy vyberiem jednu konkrétnu aj s dôvodom\.$/, (m, list) => '. Chuť: ' + pieces(list) + '. Přes čtyři krátké otázky ve Výběru kávy vyberu jednu konkrétní i s důvodem.'],
    [/^Pôvod je uvedený pri každej káve — napríklad (.+)\. Napíšte, akú chuť hľadáte, a vyberiem jednu konkrétnu\.$/, 'Původ je uvedený u každé kávy — například $1. Napište, jakou chuť hledáte, a vyberu jednu konkrétní.'],
    [/^Ceny sa líšia podľa gramáže —$/, 'Ceny se liší podle gramáže —'],
    [/^je (.+)\. Cez krátky výber vyberiem tú, ktorá vám sadne, aj s cenou\.$/, 'je $1. Přes krátký výběr vyberu tu, která vám sedne, i s cenou.'],
    [/^: Chuť: (.+)\.$/, (m, list) => ': Chuť: ' + pieces(list) + '.'],
    [/^(.+) — (.+)\. Chuť: (.+)\.$/, (m, name, price, list) => name + ' — ' + price + '. Chuť: ' + pieces(list) + '.'],
    [/^Táto ukážka vyberá kávu podľa chuti a prípravy\. Úplné informácie o produkte nájdete v oficiálnom e-shope\.$/, 'Tento poradce vybírá kávu podle chuti a přípravy. Úplné informace o produktu najdete v oficiálním e-shopu.'],
    [/^Aktuálne podmienky dopravy, platby a vrátenia nájdete v oficiálnom e-shope\..*$/, 'Aktuální podmínky dopravy, platby a vrácení najdete v oficiálním e-shopu.'],
[/^Chatbot pre (.+)$/, 'Chatbot pro $1'], [/^(.+) – výber starostlivosti$/, '$1 – výběr péče'], [/^Poradca starostlivosti (.+)$/, 'Poradce péče $1'], [/^Poradca starostlivosti$/, 'Poradce péče'],
    [/^Dobrý deň\. Vyberajte z ponuky (.+)\. Napíšte, aký produkt hľadáte, alebo otvorte Výber\.$/, 'Dobrý den. Vybírejte z nabídky $1. Napište, jaký produkt hledáte, nebo otevřete Výběr.'],
    [/^(\d+) (produkt|produkty|produktov)$/, (m, n) => n + (n === '1' ? ' produkt' : +n >= 2 && +n <= 4 ? ' produkty' : ' produktů')],
    [/^Pozrieť ďalšie možnosti \((\d+)\)$/, 'Zobrazit další možnosti ($1)'], [/^Načítať ďalšie \((\d+)\)$/, 'Načíst další ($1)'], [/^Vzorky — (.+)$/, (m, kind) => 'Vzorky — ' + (exact[kind] ?? kind)],
    [/^Je určený pre ([^.]+)\.$/, (m, target) => 'Je určený pro ' + (exact[target] ?? target) + '.'],
    [/^Zodpovedá vašej priorite: ([^.]+)\.$/, (m, goal) => 'Odpovídá vaší prioritě: ' + (exact[goal] ?? goal) + '.'],
    [/^Zmestí sa do rozpočtu ([^.]+)\.$/, 'Vejde se do rozpočtu $1.'], [/^Úplné zloženie nájdete pri (.+)$/, 'Úplné složení najdete u $1'],
    [/^(.+) – výber čaju$/, '$1 – výběr čaje'], [/^Je to ([^.]+)\.$/, (m, kind) => 'Je to ' + (exact[kind] ?? kind) + '.'], [/^Poradca čaju (.+)$/, 'Poradce čaje $1'],
    [/^Žiadna káva nespĺňa naraz vašu (.+)\. Toto je najbližšia možnosť – alebo zmeňte odpovede\.$/, (m, what) => 'Žádná káva nesplňuje zároveň vaši ' + what.replace('prípravu', 'přípravu').replace(' aj ', ' i ') + '. Toto je nejbližší možnost – nebo změňte odpovědi.']
  ];

  const pieces = (list) => list.split(/(, | · )/).map((part) => exact[part] ?? part).join('');
  window.CX_LANG_CS = {exact, patterns};

  function one(core) {
    if (Object.prototype.hasOwnProperty.call(exact, core)) return exact[core];
    for (const [test, replacement] of patterns) if (test.test(core)) return core.replace(test, replacement);
    return null;
  }

  function translate(text) {
    const core = text.replace(/\s+/g, ' ').trim();
    if (!core) return null;
    let out = Object.prototype.hasOwnProperty.call(exact, core) ? exact[core] : null;
    if (out === null) for (const [test, replacement] of patterns) if (test.test(core)) { out = core.replace(test, replacement); break; }
    if (out === null && /[.?!] \S/.test(core)) {
      const parts = core.split(/(?<=[.?!]) /), done = parts.map((part) => one(part) ?? part);
      if (done.some((part, index) => part !== parts[index])) out = done.join(' ');
    }
    if (out === null && /, | · /.test(core)) { const joined = pieces(core); if (joined !== core) out = joined; }
    if (out === null || out === core) return null;
    return text.replace(/^(\s*)[\s\S]*?(\s*)$/, (m, lead, tail) => lead + out + tail);
  }

  const ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'];
  /* Another script may keep writing its own Slovak text back; never fight it in a loop. */
  const pace = new WeakMap();
  const calm = (element) => {
    if (!element) return true;
    const now = performance.now(), entry = pace.get(element) || {since: now, count: 0};
    if (now - entry.since > 2000) { entry.since = now; entry.count = 0; }
    entry.count += 1; pace.set(element, entry);
    return entry.count <= 8;
  };
  function sweep(node) {
    if (node.nodeType === 3) {
      if (node.parentElement?.closest('script,style,textarea')) return;
      const next = translate(node.nodeValue);
      if (next !== null && calm(node.parentElement)) node.nodeValue = next;
      return;
    }
    if (node.nodeType !== 1) return;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(sweep);
    [node, ...node.querySelectorAll('[placeholder],[aria-label],[title],[alt]')].forEach((element) => ATTRIBUTES.forEach((name) => {
      const value = element.getAttribute?.(name);
      const next = value && translate(value);
      if (next) element.setAttribute(name, next);
    }));
  }
  const title = translate(document.title); if (title) document.title = title;
  sweep(document.body);
  new MutationObserver((records) => records.forEach((record) => {
    if (record.type === 'characterData') sweep(record.target);
    else if (record.type === 'attributes') { const next = translate(record.target.getAttribute(record.attributeName) || ''); if (next) record.target.setAttribute(record.attributeName, next); }
    else record.addedNodes.forEach(sweep);
  })).observe(document.documentElement, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRIBUTES});
})();
