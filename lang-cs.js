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
    [/^Chuťový profil podľa e-shopu: (.+)\.$/, (m, list) => 'Chuťový profil podle e-shopu: ' + pieces(list) + '.'],
    [/^\. Chuťový profil podľa e-shopu: (.+?)\. (.+?)\. Balenie (.+)\.$/, (m, list, price, pack) => '. Chuťový profil podle e-shopu: ' + pieces(list) + '. ' + price + '. Balení ' + pack + '.'],
    [/^Z ponuky by som začal kávou$/, 'Z nabídky bych začal kávou'],
    [/^\. Chuťový profil podľa e-shopu: (.+?)\. Cez štyri krátke otázky vo Výbere kávy vyberiem jednu konkrétnu aj s dôvodom\.$/, (m, list) => '. Chuťový profil podle e-shopu: ' + pieces(list) + '. Přes čtyři krátké otázky ve Výběru kávy vyberu jednu konkrétní i s důvodem.'],
    [/^Pôvod je uvedený pri každej káve — napríklad (.+)\. Napíšte, akú chuť hľadáte, a vyberiem jednu konkrétnu\.$/, 'Původ je uvedený u každé kávy — například $1. Napište, jakou chuť hledáte, a vyberu jednu konkrétní.'],
    [/^Ceny sa líšia podľa gramáže —$/, 'Ceny se liší podle gramáže —'],
    [/^je (.+)\. Cez krátky výber vyberiem tú, ktorá vám sadne, aj s cenou\.$/, 'je $1. Přes krátký výběr vyberu tu, která vám sedne, i s cenou.'],
    [/^: Chuťový profil podľa e-shopu: (.+)\.$/, (m, list) => ': Chuťový profil podle e-shopu: ' + pieces(list) + '.'],
    [/^(.+) — (.+)\. Chuť: (.+)\.$/, (m, name, price, list) => name + ' — ' + price + '. Chuť: ' + pieces(list) + '.'],
    [/^Táto ukážka vyberá kávu podľa chuti a prípravy\. Úplné informácie o produkte nájdete v oficiálnom e-shope\.$/, 'Tento poradce vybírá kávu podle chuti a přípravy. Úplné informace o produktu najdete v oficiálním e-shopu.'],
    [/^Aktuálne podmienky dopravy, platby a vrátenia nájdete v oficiálnom e-shope\..*$/, 'Aktuální podmínky dopravy, platby a vrácení najdete v oficiálním e-shopu.'],
    [/^Žiadna káva nespĺňa naraz vašu (.+)\. Toto je najbližšia možnosť – alebo zmeňte odpovede\.$/, (m, what) => 'Žádná káva nesplňuje zároveň vaši ' + what.replace('prípravu', 'přípravu').replace(' aj ', ' i ') + '. Toto je nejbližší možnost – nebo změňte odpovědi.']
  ];

  const pieces = (list) => list.split(/(, | · )/).map((part) => exact[part] ?? part).join('');
  window.CX_LANG_CS = {exact, patterns};

  function translate(text) {
    const core = text.replace(/\s+/g, ' ').trim();
    if (!core) return null;
    let out = Object.prototype.hasOwnProperty.call(exact, core) ? exact[core] : null;
    if (out === null) for (const [test, replacement] of patterns) if (test.test(core)) { out = core.replace(test, replacement); break; }
    if (out === null && /, | · /.test(core)) { const joined = pieces(core); if (joined !== core) out = joined; }
    if (out === null || out === core) return null;
    return text.replace(/^(\s*)[\s\S]*?(\s*)$/, (m, lead, tail) => lead + out + tail);
  }

  const ATTRIBUTES = ['placeholder', 'aria-label', 'title', 'alt'];
  function sweep(node) {
    if (node.nodeType === 3) {
      if (node.parentElement?.closest('script,style,textarea')) return;
      const next = translate(node.nodeValue);
      if (next !== null) node.nodeValue = next;
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
