/* Odporúčacie jadro novej dávky kávových ukážok (447 € + 10 €/mes.). Čisté funkcie bez DOM.
   Používa ho izolovaná kópia schváleného poradcu (n447/coffee-jolka-app-n447.js), API aj testy.
   Pravidlá:
   - každá otázka mení výber kávy alebo variant na objednanie; možnosti vznikajú iba z katalógu;
   - ROZPOČET platí na overenú cenu konkrétneho balenia (praženie × gramáž, mletie) + prípadný doplnok.
     Údaj „od“ je iba informatívny a nikdy nesplní limit. Otázka na rozpočet sa ukáže, iba keď má každá
     káva v aktuálnom výbere aspoň jedno overené balenie;
   - recept V60 iba pri V60; pri iných pomôckach len overená voľba mletia. */
(function (g) {
  'use strict';
  const EPS = 1e-9;
  const KEYS = ['prep', 'dripPick', 'tool', 'caffeine', 'taste', 'budget', 'detailProcess', 'detailMore', 'pick', 'pick2', 'pick3'];
  /* Zvolená káva: posledný výber, ktorý nie je „ďalšie vhodné kávy“ (more:N). */
  const chosen = (a) => [a.pick3, a.pick2, a.pick].find((v) => v && !String(v).startsWith('more:')) || null;
  const PREP_ROASTS = {espresso: ['espresso', 'omni'], moka: ['espresso', 'omni'], filter: ['filter', 'omni']};
  const PREP_PHOTO = {espresso: '/assets/scenes/coffee-espresso.jpg', moka: '/assets/scenes/coffee-moka.jpg', filter: '/assets/scenes/coffee-filter.jpg'};
  const TASTE_PHOTO = {choco: '/assets/scenes/coffee-caramel.jpg', fruitFull: '/assets/scenes/coffee-berries.jpg', fresh: '/assets/scenes/coffee-acidity-bright.jpg', decaf: '/assets/scenes/coffee-decaf-cup.jpg'};
  /* Výber kávy: fotka opisuje chuťový tón odpovede (nie vrecúško). V jednom kroku sa fotka neopakuje. */
  const TONE = (n) => '/assets/n447/tones/' + n + '.jpg', SC = (n) => '/assets/scenes/' + n + '.jpg';
  const TONES = [[/cokol|kakao|nugat|pralink|baileys/, SC('coffee-chocolate')], [/karamel|cukor|cukr|sirup|melas|panela|toffee|vanil/, SC('coffee-caramel')],
    [/orech|oriesk|orisk|lieskov|liskov|mandl|kesu|arasid/, SC('coffee-nuts')], [/\bmed\b|medov/, TONE('honey')],
    [/malin|ostruzin|ribez|rybiz|jahod|cucoried|boruvk|bobul|brusnic|cernic|lesne ovoc/, SC('coffee-berries')], [/visn|cerese|cerezn|tresn|cherry|granatov/, TONE('cherries')],
    [/broskv|broskyn|marhul|merunk|nektar|slivk|svestk|blumy/, TONE('stone-fruit')], [/citr|limet|bergamot|pomaranc|pomeranc|grapefruit|pomelo/, SC('coffee-acidity-bright')],
    [/jablk|hrusk/, TONE('apples')], [/mango|ananas|papaj|papay|marakuj|tropic|lici|hrozn/, TONE('tropical')], [/kvet|jasmin|ruz|ibist|fialk|maces|bezov/, TONE('flowers')],
    [/caj/, TONE('tea')], [/datl|fig|rozink|hrozienk|susen/, TONE('dried-fruit')], [/skoric|badyan|koren|pernik|tabak/, TONE('spice')]];
  const foldT = (x) => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function tonePhotos(list) {
    const used = new Set(), out = new Map();
    for (const x of list) {
      const notes = (x.notes && x.notes.length ? x.notes : [x.profile]).map(foldT);
      let photo = null;
      for (const n of notes) { const hit = TONES.find(([rx, ph]) => rx.test(n) && !used.has(ph)); if (hit) { photo = hit[1]; break; } }
      if (!photo) photo = [SC('coffee-explore'), SC('coffee-black'), SC('coffee-both')].find((ph) => !used.has(ph)) || null;
      if (photo) used.add(photo); out.set(x.id, photo);
    }
    return out;
  }
  const CAF_PHOTO = {yes: '/assets/scenes/coffee-beans.jpg', no: '/assets/scenes/coffee-decaf-cup.jpg'};
  /* Jednoduché ilustrácie pre voľby, ktoré nemajú vhodnú fotku (pomôcka, spracovanie, pôvod, praženie, zloženie, rozpočet, drip). */
  const IL = (n) => '/assets/n447/ilustracie/' + n + '.svg';
  /* Praženie: skutočné fotky zŕn (Pexels, zdroje v assets/n447/foto/sources.json). */
  const FOTO = (n) => '/assets/n447/foto/' + n + '.jpg';
  const roastClass = (label) => { const x = String(label).toLowerCase();
    if (/dark|tmav/.test(x)) return 'dark'; if (/light|svetl|světl/.test(x)) return 'light'; if (/medium|stred|střed/.test(x)) return 'medium'; return null; };
  const GRIND_FOR = {espresso: 'Zrnková', moka: 'Mletá moka konvička', v60: 'Mletá drip', aeropress: 'Mletá aeropress', frenchpress: 'Mletá french press'};

  const TXT = {
    sk: {
      prepQ: 'Ako si pripravujete kávu?', prepName: 'Príprava',
      prep: {espresso: ['Kávovar alebo automat', 'Espresso, cappuccino, latte'], moka: ['Moka kanvička', 'Príprava na sporáku'],
        filter: ['Filter a ručná príprava', 'V60, AeroPress, French press'], drip: ['Bez pomôcok, na cesty', 'Stačí šálka a horúca voda']},
      toolQ: 'Akú pomôcku na filter máte?', toolName: 'Pomôcka',
      tool: {v60: ['V60 alebo iný prelievaný filter', 'Papierový filter, prelievanie'], aeropress: ['AeroPress', 'Lúhovanie a pretlačenie'], frenchpress: ['French press', 'Lúhovanie s piestom']},
      dripQ: 'Ktorú kávu vo vrecúškach chcete?', dripName: 'Káva',
      cafQ: 'Chcete kávu s kofeínom, alebo bez neho?', cafName: 'Kofeín', caf: {yes: ['S kofeínom', 'Bežná káva'], no: ['Bez kofeínu', 'Aj na večer']},
      tasteQ: 'Aká chuť vám sedí najviac?', tasteName: 'Chuť',
      taste: {choco: ['Čokoládová a karamelová', 'Sladká, plná, s orieškom či toffee'], fruitFull: ['Plná a ovocná', 'Višne, bobule, tmavé ovocie'], fresh: ['Svieža a šťavnatá', 'Ríbezle, citrus, čajové tóny'], decaf: ['Bez kofeínu', 'Káva aj na večer']},
      budgetQ: 'Koľko chcete dať za celý nákup?', budgetName: 'Rozpočet', budgetAny: 'Na cene až tak nezáleží',
      processQ: 'Aký štýl chuti vám je bližší?', processName: 'Štýl chuti',
      procPlain: {washed: ['Čistejšia, svieža chuť', 'premývaná (washed)'], natural: ['Ovocnejšia, sladšia chuť', 'sušená v plode (natural)'],
        honey: ['Sladká, plná chuť', 'spracovanie honey'], semi: ['Vyvážená chuť', 'spracovanie semi-washed'], mix: ['Kombinácia oboch štýlov', 'natural aj washed']},
      blendPlain: {arabica: 'jemnejšia, menej horká', robusta: 'výraznejšia, viac kofeínu'},
      roastPlain: {light: 'Svetlejšie praženie', medium: 'Stredné praženie', dark: 'Tmavšie praženie'},
      regionQ: 'Odkiaľ má káva pochádzať?', regionName: 'Pôvod', region: {africa: 'Afrika', asia: 'Ázia', americas: 'Stredná a Južná Amerika', blend: 'Zmes viacerých krajín'},
      blendQ: 'Aké zloženie uprednostníte?', blendName: 'Zloženie', blend: {arabica: '100 % arabika', robusta: 'S podielom robusty'},
      pickQ: 'Ktoré chute vám viac sedia?', pickName: 'Chuťové tóny',
      roast: {espresso: 'espresso roast', filter: 'filter roast', omni: 'omni roast'},
      grindText: {espresso: 'zrnková do automatu alebo k vlastnému mlynčeku; na pákový kávovar bez mlynčeka „mletá espresso“',
        moka: 'mletá moka konvička', v60: 'mletá drip', aeropress: 'mletá aeropress', frenchpress: 'mletá french press'},
      reasonPrep: {espresso: ['Na espresso aj do automatu', (r) => r === 'omni' ? 'Pražiareň ju ponúka v „omni“ pražení, ktoré je na espresso aj filter.' : 'Pražiareň ju ponúka v espresso pražení.'],
        moka: ['Do moka kanvičky', (r) => (r === 'omni' ? 'Má „omni“ praženie' : 'Má espresso praženie') + ' a e-shop ju ponúka aj mletú na moka kanvičku.'],
        filter: ['Na filter', (r) => r === 'omni' ? 'Má „omni“ praženie, ktoré pražiareň ponúka na espresso aj filter.' : 'Pražiareň ju ponúka vo filter pražení.']},
      next: {espresso: ['Do automatu vyberte zrnkovú, automat si ju zomelie sám.', 'Na pákový kávovar bez mlynčeka zvoľte „mletá espresso“.'],
        moka: ['V e-shope zvoľte mletie „mletá moka konvička“.', 'Ak máte vlastný mlynček, zrnková vydrží po otvorení dlhšie čerstvá.'],
        aeropress: ['V e-shope zvoľte mletie „mletá aeropress“.', 'Ak meliete doma, vyberte zrnkovú a pomeľte tesne pred prípravou.'],
        frenchpress: ['V e-shope zvoľte mletie „mletá french press“ – je hrubšie než na filter.', 'Ak meliete doma, vyberte zrnkovú a pomeľte tesne pred prípravou.']},
      grindPriceNote: 'Overená cena platí pre zrnkovú kávu; cenu mletej e-shop zobrazí po výbere mletia.',
      /* E-shop predáva iba zrnkovú kávu: rada k mletiu, nie voľba mletia v košíku. */
      beansGrind: {espresso: 'Predáva sa zrnková – do automatu ju nasypte priamo.', moka: 'Predáva sa zrnková – pred prípravou ju pomeľte.',
        v60: 'Predáva sa zrnková – pred prípravou ju pomeľte stredne jemne.', aeropress: 'Predáva sa zrnková – pred prípravou ju pomeľte stredne jemne.', frenchpress: 'Predáva sa zrnková – pred prípravou ju pomeľte nahrubo.'},
      nextBeans: {espresso: ['Do automatu kávu nasypte zrnkovú, zomelie si ju sám.', 'Na pákový kávovar ju pomeľte jemne tesne pred prípravou.'],
        moka: ['Kávu pomeľte jemnejšie než na filter, no hrubšie než na espresso.', 'Zomieľajte tesne pred prípravou, aby ostala čerstvá.'],
        v60: ['Kávu pomeľte stredne jemne tesne pred prípravou.', 'Papierový filter pred nasypaním kávy prepláchnite horúcou vodou.'],
        aeropress: ['Kávu pomeľte stredne jemne tesne pred prípravou.', 'Zrnkovú kávu skladujte v uzavretej nádobe, mimo svetla.'],
        frenchpress: ['Kávu pomeľte nahrubo tesne pred prípravou.', 'Zrnkovú kávu skladujte v uzavretej nádobe, mimo svetla.']},
      /* E-shop melie zadarmo podľa voľby (data.grindLabels = presné názvy možností v košíku). */
      nextGround: {espresso: (g) => ['Do automatu vyberte zrnkovú, automat si ju zomelie sám.', 'Na pákový kávovar bez mlynčeka zvoľte „' + g + '“.'],
        moka: (g) => ['V e-shope zvoľte „' + g + '“.', 'Ak máte vlastný mlynček, zrnková vydrží po otvorení dlhšie čerstvá.'],
        v60: (g) => ['V e-shope zvoľte „' + g + '“.', 'Papierový filter pred nasypaním kávy prepláchnite horúcou vodou.'],
        aeropress: (g) => ['V e-shope zvoľte „' + g + '“.', 'Ak meliete doma, vyberte zrnkovú a pomeľte tesne pred prípravou.'],
        frenchpress: (g) => ['V e-shope zvoľte „' + g + '“.', 'Ak meliete doma, vyberte zrnkovú a pomeľte tesne pred prípravou.']},
      orderPick: ' Pri objednávke zvoľte ', listed: 'E-shop ju uvádza na: ', decaf: 'Bez kofeínu', decafFlag: 'E-shop ju označuje ako bezkofeínovú.',
      tones: 'Chuťové tóny', inTaste: 'V chuti: ', taste1: 'Chuť', inBudget: 'V rozpočte', together: ' spolu ', yourLimit: '; váš limit ',
      fOrigin: 'Pôvod', fProcess: 'Spracovanie', fRoast: 'Praženie', fComp: 'Zloženie', nextTitle: 'Čo ďalej', nextV60: 'Čo ďalej: príprava na V60',
      priceInfo: 'Orientačná cena; presnú cenu balenia ukáže e-shop po výbere', approxFrom: 'orientačne od ', from: 'od ', upTo: 'Do ',
      roastQ: 'Aké praženie vám viac vyhovuje?', moreTitle: 'Ďalšie vhodné kávy', pickMoreQ: 'Ďalšie rovnako vhodné kávy',
      procLabels: {natural: 'Natural spracovanie', washed: 'Washed spracovanie', honey: 'Honey spracovanie', semi: 'Semi-washed spracovanie', mix: 'Natural + washed'},
      nCoffees: (n) => n + (n === 1 ? ' káva' : n >= 2 && n <= 4 ? ' kávy' : ' káv'),
      nInBudget: (n) => n + (n === 1 ? ' káva' : n >= 2 && n <= 4 ? ' kávy' : ' káv') + ' v nákupe do tejto sumy', allFit: (n) => 'Všetky vhodné kávy (' + n + ')', diffTaste: 'v chuti ',
      dripReason: ['Bez pomôcok', 'Vrecúško zavesíte na šálku a prelejete horúcou vodou.'], dripChosen: 'Vybraná káva', dripNext: 'Ako ju pripraviť',
      beansWord: 'zrnková', nextRecipe: 'Čo ďalej: postup pražiarne'
    },
    cs: {
      prepQ: 'Jak si připravujete kávu?', prepName: 'Příprava',
      prep: {espresso: ['Kávovar nebo automat', 'Espresso, cappuccino, latte'], moka: ['Moka konvička', 'Příprava na sporáku'],
        filter: ['Filtr a ruční příprava', 'V60, AeroPress, French press'], drip: ['Bez pomůcek, na cesty', 'Stačí šálek a horká voda']},
      toolQ: 'Jakou pomůcku na filtr máte?', toolName: 'Pomůcka',
      tool: {v60: ['V60 nebo jiný překapávač', 'Papírový filtr, přelévání'], aeropress: ['AeroPress', 'Louhování a protlačení'], frenchpress: ['French press', 'Louhování s pístem']},
      dripQ: 'Kterou kávu v sáčcích chcete?', dripName: 'Káva',
      cafQ: 'Chcete kávu s kofeinem, nebo bez něj?', cafName: 'Kofein', caf: {yes: ['S kofeinem', 'Běžná káva'], no: ['Bez kofeinu', 'I na večer']},
      tasteQ: 'Jaká chuť vám sedí nejvíc?', tasteName: 'Chuť',
      taste: {choco: ['Čokoládová a karamelová', 'Sladká, plná, s oříšky'], fruitFull: ['Plná a ovocná', 'Višně, bobule, tmavé ovoce'], fresh: ['Svěží a šťavnatá', 'Rybíz, citrus, čajové tóny'], decaf: ['Bez kofeinu', 'Káva i na večer']},
      budgetQ: 'Kolik chcete dát za celý nákup?', budgetName: 'Rozpočet', budgetAny: 'Na ceně až tak nezáleží',
      processQ: 'Jaký styl chuti je vám bližší?', processName: 'Styl chuti',
      procPlain: {washed: ['Čistší, svěží chuť', 'praná (washed)'], natural: ['Ovocnější, sladší chuť', 'sušená v plodu (natural)'],
        honey: ['Sladká, plná chuť', 'zpracování honey'], semi: ['Vyvážená chuť', 'zpracování semi-washed'], mix: ['Kombinace obou stylů', 'natural i washed']},
      blendPlain: {arabica: 'jemnější, méně hořká', robusta: 'výraznější, více kofeinu'},
      roastPlain: {light: 'Světlejší pražení', medium: 'Střední pražení', dark: 'Tmavší pražení'},
      regionQ: 'Odkud má káva pocházet?', regionName: 'Původ', region: {africa: 'Afrika', asia: 'Asie', americas: 'Střední a Jižní Amerika', blend: 'Směs více zemí'},
      blendQ: 'Jaké složení upřednostníte?', blendName: 'Složení', blend: {arabica: '100 % arabika', robusta: 'S podílem robusty'},
      pickQ: 'Které chutě vám víc sedí?', pickName: 'Chuťové tóny',
      roast: {espresso: 'pražení na espresso', filter: 'pražení na filtr', omni: 'omni pražení (espresso i filtr)'},
      grindText: {espresso: 'zrnkovou do automatu nebo k vlastnímu mlýnku', moka: 'mletí pro moka konvičku', v60: 'mletí pro V60', aeropress: 'mletí pro AeroPress', frenchpress: 'mletí pro french press'},
      reasonPrep: {espresso: ['Na espresso i do automatu', (r) => r === 'omni' ? 'Pražírna ji nabízí v „omni“ pražení, vhodném na espresso i filtr.' : 'Pražírna ji nabízí v espresso pražení.'],
        moka: ['Do moka konvičky', (r) => (r === 'omni' ? 'Má „omni“ pražení' : 'Má espresso pražení') + ' a e-shop ji nabízí i namletou pro moka konvičku.'],
        filter: ['Na filtr', (r) => r === 'omni' ? 'Má „omni“ pražení, které pražírna nabízí na espresso i filtr.' : 'Pražírna ji nabízí ve filtrovém pražení.']},
      next: {}, grindPriceNote: '', nextRecipe: 'Co dál: postup pražírny',
      beansGrind: {espresso: 'Prodává se zrnková – do automatu ji nasypte přímo.', moka: 'Prodává se zrnková – před přípravou ji umelte.',
        v60: 'Prodává se zrnková – před přípravou ji umelte středně jemně.', aeropress: 'Prodává se zrnková – před přípravou ji umelte středně jemně.', frenchpress: 'Prodává se zrnková – před přípravou ji umelte nahrubo.'},
      nextBeans: {espresso: ['Do automatu kávu nasypte zrnkovou, umele si ji sám.', 'Na pákový kávovar ji umelte jemně těsně před přípravou.'],
        moka: ['Kávu umelte jemněji než na filtr, ale hruběji než na espresso.', 'Melte těsně před přípravou, aby zůstala čerstvá.'],
        v60: ['Kávu umelte středně jemně těsně před přípravou.', 'Papírový filtr před nasypáním kávy propláchněte horkou vodou.'],
        aeropress: ['Kávu umelte středně jemně těsně před přípravou.', 'Zrnkovou kávu skladujte v uzavřené nádobě, mimo světlo.'],
        frenchpress: ['Kávu umelte nahrubo těsně před přípravou.', 'Zrnkovou kávu skladujte v uzavřené nádobě, mimo světlo.']},
      nextGround: {espresso: (g) => ['Do automatu vyberte zrnkovou, automat si ji namele sám.', 'Na pákový kávovar bez mlýnku zvolte „' + g + '“.'],
        moka: (g) => ['V e-shopu zvolte „' + g + '“.', 'Máte-li vlastní mlýnek, zrnková káva vydrží po otevření déle čerstvá.'],
        v60: (g) => ['V e-shopu zvolte „' + g + '“.', 'Papírový filtr před nasypáním kávy propláchněte horkou vodou.'],
        aeropress: (g) => ['V e-shopu zvolte „' + g + '“.', 'Pokud melete doma, vyberte zrnkovou a umelte ji těsně před přípravou.'],
        frenchpress: (g) => ['V e-shopu zvolte „' + g + '“.', 'Pokud melete doma, vyberte zrnkovou a umelte ji těsně před přípravou.']},
      orderPick: ' Při objednávce zvolte ', listed: 'E-shop ji uvádí na: ', decaf: 'Bez kofeinu', decafFlag: 'E-shop ji označuje jako bezkofeinovou.',
      tones: 'Chuťové tóny', inTaste: 'V chuti: ', taste1: 'Chuť', inBudget: 'V rozpočtu', together: ' celkem ', yourLimit: '; váš limit ',
      fOrigin: 'Původ', fProcess: 'Zpracování', fRoast: 'Pražení', fComp: 'Složení', nextTitle: 'Co dál', nextV60: 'Co dál: příprava na V60',
      priceInfo: 'Orientační cena; přesnou cenu balení ukáže e-shop po výběru', approxFrom: 'orientačně od ', from: 'od ', upTo: 'Do ',
      roastQ: 'Jaké pražení vám víc vyhovuje?', moreTitle: 'Další vhodné kávy', pickMoreQ: 'Další stejně vhodné kávy',
      procLabels: {natural: 'Natural zpracování', washed: 'Washed zpracování', honey: 'Honey zpracování', semi: 'Semi-washed zpracování', mix: 'Natural + washed'},
      nCoffees: (n) => n + (n === 1 ? ' káva' : n >= 2 && n <= 4 ? ' kávy' : ' káv'),
      nInBudget: (n) => n + (n === 1 ? ' káva' : n >= 2 && n <= 4 ? ' kávy' : ' káv') + ' v nákupu do této částky', allFit: (n) => 'Všechny vhodné kávy (' + n + ')', diffTaste: 'v chuti ',
      dripReason: ['Bez pomůcek', 'Sáček zavěsíte na šálek a přelijete horkou vodou.'], dripChosen: 'Vybraná káva', dripNext: 'Jak ji připravit',
      beansWord: 'zrnková'
    }
  };
  TXT.cs.nextRecipe = 'Co dál: postup pražírny';
  const L = (data) => TXT[data.lang] || TXT.sk;

  function money(v, currency) {
    if (!Number.isFinite(v)) return '';
    if (currency === 'CZK') return Math.round(v).toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
    return v.toFixed(2).replace('.', ',') + ' €';
  }
  const grams = (n) => n >= 1000 ? String(n / 1000).replace('.', ',') + ' kg' : n + ' g';
  const roastFor = (p, prep) => (p.roasts || []).find((r) => (PREP_ROASTS[prep] || []).includes(r)) || null;
  /* Vhodnosť: podľa výslovného zoznamu prípravy z e-shopu (preps/tools), inak podľa praženia. */
  const suits = (p, prep) => Array.isArray(p.preps) ? p.preps.includes(prep) : !!roastFor(p, prep);
  const toolOk = (p, tool) => !tool || !Array.isArray(p.tools) || p.tools.includes(tool);
  const grindKey = (a) => a.prep === 'filter' ? a.tool : a.prep;

  /* Overené balenia pre zvolenú prípravu (správne praženie), najmenšie prvé. */
  function verifiedPacks(p, a) {
    const roast = roastFor(p, a.prep);
    return (p.variants || []).filter((v) => (!v.roast || v.roast === roast) && Number.isFinite(v.price) && v.verifiedAt && v.available !== false)
      .slice().sort((x, y) => x.grams - y.grams || x.price - y.price);
  }
  /* Doplnok k pomôcke z vlastného e-shopu (data.addons[tool]); voliteľný – ak sa s kávou nezmestí
     do rozpočtu, vynechá sa a káva ostáva. */
  const addonFor = (data, p, a) => typeof data.addonFor === 'function' ? data.addonFor(p, a) : (data.addons && a.tool && data.addons[a.tool]) || null;
  const total = (data, p, a, v) => v.price + (addonFor(data, p, a)?.price || 0);
  function packFor(data, p, a) {
    const packs = verifiedPacks(p, a);
    if (!a.budget || a.budget === 'any') return packs[0] || null;
    return packs.find((v) => v.price <= Number(a.budget) + EPS) || null;
  }
  /* Doplnok iba vtedy, keď sa celá zostava zmestí do limitu. */
  function addonFits(data, p, a, v) {
    const ad = addonFor(data, p, a);
    if (!ad || !v) return null;
    return !a.budget || a.budget === 'any' || v.price + ad.price <= Number(a.budget) + EPS ? ad : null;
  }

  /* Recept pražiarne: p.recipes[prípravu] (len pre danú prípravu) alebo spoločný p.recipe. */
  const recipeOf = (p, gk) => p.recipes ? p.recipes[gk] || null : p.recipe || null;
  const processGroup = (p) => { const x = String(p.process || '').toLowerCase();
    if (/honey/.test(x)) return 'honey'; if (/semi/.test(x)) return 'semi';
    if (/natural|anaerob/.test(x) && !/washed/.test(x)) return 'natural'; if (/washed/.test(x) && !/natural/.test(x)) return 'washed';
    if (/natural/.test(x) && /washed/.test(x)) return 'mix'; return null; };

  const SPLITS = {process: processGroup, region: (p) => p.region || null, blend: (p) => p.blend || null, roast: (p) => p.roastLabel ? String(p.roastLabel).split(',')[0].trim() : null};
  const detailOf = (p, v) => { const [kind, k] = String(v).split(':'); return SPLITS[kind] ? SPLITS[kind](p) === k : false; };
  function pool(data, a, except) {
    return data.products.filter((p) => p.available !== false && p.kind === 'coffee')
      .filter((p) => !a.prep || a.prep === 'drip' || suits(p, a.prep))
      .filter((p) => toolOk(p, a.tool))
      .filter((p) => !a.caffeine || (a.caffeine === 'no' ? !!p.decaf : !p.decaf))
      .filter((p) => except === 'taste' || !a.taste || (a.taste === 'decaf' ? !!p.decaf : (!!a.caffeine || !p.decaf) && tastesOf(p).includes(a.taste)))
      .filter((p) => except === 'budget' || !a.budget || a.budget === 'any' || !!packFor(data, p, a))
      .filter((p) => except === 'detailProcess' || !a.detailProcess || detailOf(p, a.detailProcess))
      .filter((p) => except === 'detailMore' || !a.detailMore || detailOf(p, a.detailMore))
      .filter((p) => except === 'pick' || !chosen(a) || p.id === chosen(a));
  }
  /* Káva môže patriť do viacerých chuťových skupín e-shopu (p.tastes). */
  const tastesOf = (p) => Array.isArray(p.tastes) && p.tastes.length ? p.tastes : [p.taste];
  const tones = (p) => p.notes && p.notes.length ? p.notes.slice(0, 2).join(' · ') : (p.profile || '');
  /* Limity schváleného UI na 320 × 568 bez posúvania: fotky 2 × 2 (najviac 4), textové karty najviac 3. */
  const MAX_PHOTO = 4, MAX_TEXT = 3;
  const text = (value, title, detail, photo) => ({value, title, detail, photo});

  /* Viac než štyri rovnocenné kávy bez ďalšieho overeného rozdielu: výber po stránkach v poradí e-shopu (3 kávy +
     „Ďalšie vhodné kávy“, posledná stránka až 4). Všetky kávy sú dostupné, cena ani iné skryté poradie nerozhoduje. */
  function pickPages(p) {
    const pages = []; let rest = p.slice();
    while (rest.length > MAX_PHOTO && pages.length < 2) { pages.push(rest.slice(0, MAX_PHOTO - 1)); rest = rest.slice(MAX_PHOTO - 1); }
    pages.push(rest);
    return pages;
  }
  function nextQuestion(data, a) {
    const t = L(data);
    if (!a.prep) {
      const options = Object.keys(PREP_ROASTS).filter((k) => pool(data, {prep: k}).length)
        .map((k) => ({value: k, title: t.prep[k][0], detail: t.prep[k][1], photo: PREP_PHOTO[k]}));
      if (data.drip) options.push({value: 'drip', title: t.prep.drip[0], detail: t.prep.drip[1], photo: SC('coffee-black')});
      return {key: 'prep', name: t.prepName, title: t.prepQ, options};
    }
    if (a.prep === 'drip') {
      const o = data.drip.options || [];
      return o.length > 1 && !a.dripPick ? {key: 'dripPick', name: t.dripName, title: data.drip.question || t.dripQ, options: o.map((x, i) => text(x.id, x.title, x.detail,
        x.photo || (/(^|\D)10\s*s/.test(x.title) ? IL('drip-10') : /(^|\D)5\s*s/.test(x.title) ? IL('drip-5') : IL(i ? 'drip-b' : 'drip-a'))))} : null;
    }
    if (a.prep === 'filter' && !a.tool) {
      const tools = Object.keys(t.tool).filter((k) => pool(data, {prep: 'filter', tool: k}).length);
      /* Pomôcky, ktoré vedú k úplne rovnakému výsledku (káva, balenie, mletie aj postup), sa spoja do jednej voľby. */
      const sigOf = (r) => r ? JSON.stringify([r.product && r.product.id, r.pack && r.pack.grams, r.pack && r.pack.price, r.next && r.next.items, r.packLabel, (r.reasons || []).map((x) => x[0])]) : 'none';
      const reach = (x) => { const q = nextQuestion(data, x); if (!q) return [sigOf(result(data, x))];
        return [...new Set(q.options.flatMap((o) => reach(answer(x, q.key, o.value))))]; };
      const groups = [];
      for (const k of tools) { const sg = reach(answer(a, 'tool', k)).sort().join('|'); const g = groups.find((x) => x.sg === sg); if (g) g.keys.push(k); else groups.push({sg, keys: [k]}); }
      const or = data.lang === 'cs' ? ' nebo ' : ' alebo ';
      if (groups.length > 1) return {key: 'tool', name: t.toolName, title: t.toolQ, options: groups.map((g) => text(g.keys[0], g.keys.length > 1 ? g.keys.map((k) => ({v60: 'V60', aeropress: 'AeroPress', frenchpress: 'French press'})[k]).join(or) : t.tool[g.keys[0]][0],
        g.keys.length > 1 ? (data.lang === 'cs' ? 'Stejná káva, mletí i postup' : 'Rovnaká káva, mletie aj postup') : t.tool[g.keys[0]][1], IL('tool-' + g.keys[0])))};
    }
    let p = pool(data, {prep: a.prep, tool: a.tool});
    /* Kofeín je samostatná otázka iba vtedy, keď sú medzi vhodnými kávami bezkofeínové aj s kofeínom. */
    if (!a.caffeine && p.some((x) => x.decaf) && p.some((x) => !x.decaf)) {
      const cafT = t.caf || TXT.sk.caf;
      return {key: 'caffeine', name: t.cafName, title: t.cafQ, options: ['yes', 'no'].map((k) => ({value: k, title: cafT[k][0],
        detail: cafT[k][1] + ' · ' + t.nCoffees(p.filter((x) => !!x.decaf === (k === 'no')).length), photo: CAF_PHOTO[k]}))};
    }
    p = pool(data, {prep: a.prep, tool: a.tool, caffeine: a.caffeine});
    /* Chuť iba medzi zostávajúcimi kávami a iba ak sa naozaj líšia. */
    if (!a.taste) {
      const labels = Object.assign({}, t.taste, data.tasteLabels || {});
      const groups = ['choco', 'fruitFull', 'fresh'].filter((k) => p.some((x) => (!!a.caffeine || !x.decaf) && tastesOf(x).includes(k)));
      if (groups.length > 1) return {key: 'taste', name: t.tasteName, title: t.tasteQ, options: groups.map((k) => ({value: k, title: labels[k][0], detail: labels[k][1], photo: TASTE_PHOTO[k]}))};
    }
    const base = {prep: a.prep, tool: a.tool, caffeine: a.caffeine, taste: a.taste};
    p = pool(data, base);
    if (!a.budget) {
      const cheapest = p.map((x) => { const v = verifiedPacks(x, base)[0]; return v ? {x, v, sum: v.price} : null; });
      if (cheapest.length > 1 && cheapest.every(Boolean)) {
        const prices = [...new Set(cheapest.map((c) => c.sum))].sort((m, n) => m - n);
        /* Rozpočet sa pýta, iba keď sa ceny vhodných káv naozaj líšia (aspoň o 20 % a 2 € / 50 Kč);
           pri malom rozdiele nasleduje otázka na skutočný rozdiel medzi kávami. */
        const lo = prices[0], hi = prices[prices.length - 1], minGap = p[0].currency === 'CZK' ? 50 : 2;
        const meaningful = hi - lo >= minGap && hi >= lo * 1.2;
        const limits = prices.filter((x) => cheapest.filter((c) => c.sum <= x + EPS).length < p.length);
        /* Spodný limit zahrnie aspoň tretinu vhodných káv (najmenej dve), horný všetky okrem najdrahších. */
        const need = Math.max(2, Math.ceil(p.length / 3));
        const low = limits.find((x) => cheapest.filter((c) => c.sum <= x + EPS).length >= need);
        let chosen = [...new Set([low, limits[limits.length - 1]].filter((x) => x !== undefined))];
        if (chosen.length === 2 && chosen[1] < chosen[0] * 1.15) chosen = [chosen[0]];
        if (meaningful && chosen.length === 2) {
          const cur = p[0].currency;
          const options = chosen.map((x, i) => { const fit = cheapest.filter((c) => c.sum <= x + EPS); return text(String(x), t.upTo + money(x, cur), fit.length === 1 && fit[0].x.name.length <= 28 ? fit[0].x.name + ' ' + grams(fit[0].v.grams) : t.nInBudget(fit.length), IL('budget-' + (i + 1))); });
          options.push(text('any', t.budgetAny, t.allFit(p.length), IL('budget-any')));
          return {key: 'budget', name: t.budgetName, title: t.budgetQ, options};
        }
      }
    }
    p = pool(data, Object.assign({}, base, {budget: a.budget}));
    /* Viac než štyri rovnocenné kávy: overený rozdiel v spracovaní, pôvode alebo zložení (najviac 3 textové možnosti).
       Najprv rozdelenie, kde má každá skupina najviac 4 kávy; ak také nie je, väčšiu skupinu rozdelí druhé upresnenie. */
    const names = (l) => l.map((x) => x.name).join(', ');
    /* Voľba upresnenia: bežný jazyk v názve, odborný pojem a počet káv v popise, ilustrácia namiesto holého textu. */
    const detailOption = (kind, k, l, labels, keys) => {
      const count = l.length === 1 && l[0].name.length <= 28 ? l[0].name : t.nCoffees(l.length);
      const cap = (v) => String(v).charAt(0).toUpperCase() + String(v).slice(1);
      if (kind === 'process') { const pl = (t.procPlain || {})[k]; return text(kind + ':' + k, pl ? pl[0] : labels[k] || cap(k), pl ? cap(pl[1]) + ' · ' + count : count, IL('proc-' + (pl ? k : 'mix'))); }
      if (kind === 'blend') return text(kind + ':' + k, labels[k] || cap(k), ((t.blendPlain || {})[k] ? cap(t.blendPlain[k]) + ' · ' : '') + count, IL('blend-' + (k === 'robusta' ? 'robusta' : 'arabica')));
      if (kind === 'region') return text(kind + ':' + k, labels[k] || cap(k), count, IL('region-' + (['africa', 'asia', 'americas'].includes(k) ? k : 'blend')));
      if (kind === 'roast') {
        const cls = keys.map(roastClass), mine = roastClass(k), distinct = !cls.includes(null) && new Set(cls).size === cls.length;
        return distinct ? text(kind + ':' + k, t.roastPlain[mine], cap(k) + ' · ' + count, FOTO('roast-' + mine))
          : text(kind + ':' + k, cap(k), count, FOTO('roast-' + (keys.indexOf(k) % 3 + 1)));
      }
      return text(kind + ':' + k, labels[k] || cap(k), count, FOTO('roast-1'));
    };
    const kinds = [['process', t.procLabels, t.processQ, t.processName], ['roast', {}, t.roastQ, t.fRoast],
      ['region', t.region, t.regionQ, t.regionName], ['blend', t.blend, t.blendQ, t.blendName]];
    const split = (list, key, used, strict) => {
      /* Voľnejšie rozdelenie: to s najmenšou najväčšou skupinou (najviac pomôže ďalšiemu kroku). */
      if (!strict) {
        const best = kinds.filter(([kind]) => !used.includes(kind)).map((k) => [k, [...new Set(list.map(SPLITS[k[0]]))]])
          .filter(([, keys]) => keys.length > 1 && keys.length <= MAX_TEXT && !keys.includes(null) && !keys.includes(undefined))
          .map(([k, keys]) => [k, Math.max(...keys.map((v) => list.filter((x) => SPLITS[k[0]](x) === v).length))]).sort((m, n) => m[1] - n[1])[0];
        if (!best) return null;
        const [kind, labels, title, name] = best[0], keyOf = SPLITS[kind], keys = [...new Set(list.map(keyOf))];
        return {key, name, title, options: keys.map((k) => detailOption(kind, k, list.filter((x) => keyOf(x) === k), labels, keys))};
      }
      for (const [kind, labels, title, name] of kinds) {
        if (used.includes(kind)) continue;
        const keyOf = SPLITS[kind];
        const keys = [...new Set(list.map(keyOf))];
        const groups = keys.map((k) => [k, list.filter((x) => keyOf(x) === k)]);
        if (keys.length > 1 && keys.length <= MAX_TEXT && !keys.includes(null) && !keys.includes(undefined) && (!strict || groups.every(([, l]) => l.length <= MAX_PHOTO)))
          return {key, name, title, options: groups.map(([k, l]) => detailOption(kind, k, l, labels, keys))};
      }
      return null;
    };
    /* Najviac 7 skutočných otázok: upresnenie sa pýta, iba keď po ňom ostane miesto na výber kávy; inak transparentné stránkovanie. */
    const asked = ['prep', 'tool', 'caffeine', 'taste', 'budget', 'detailProcess'].filter((k) => a[k] !== undefined).length;
    if (!a.detailProcess && p.length > MAX_PHOTO && asked + 2 <= 7) {
      const q = split(p, 'detailProcess', [], true) || split(p, 'detailProcess', [], false);
      if (q) return q;
    }
    p = pool(data, Object.assign({}, base, {budget: a.budget, detailProcess: a.detailProcess}));
    if (a.detailProcess && !a.detailMore && p.length > MAX_PHOTO && asked + 2 <= 7) {
      const used = [String(a.detailProcess).split(':')[0]];
      const q = split(p, 'detailMore', used, true) || split(p, 'detailMore', used, false);
      if (q) return q;
    }
    p = pool(data, Object.assign({}, base, {budget: a.budget, detailProcess: a.detailProcess, detailMore: a.detailMore}));
    if (!chosen(a) && p.length > 1) {
      const pages = pickPages(p), idx = a.pick2 ? 2 : a.pick ? 1 : 0, key = ['pick', 'pick2', 'pick3'][idx];
      const tp = tonePhotos(pages[idx]);
      const options = pages[idx].map((x) => ({value: x.id, title: tones(x), detail: x.name, photo: tp.get(x.id), product: x.id}));
      if (idx < pages.length - 1) {
        const later = pages.slice(idx + 1).flat();
        options.push({value: 'more:' + (idx + 1), title: t.moreTitle, detail: later.length <= 2 ? later.map((x) => x.name).join(', ') : t.nCoffees(later.length), photo: SC('coffee-beans')});
      }
      return {key, name: t.pickName, title: idx ? t.pickMoreQ : t.pickQ, options};
    }
    return null;
  }
  function answer(a, key, value) {
    const out = {};
    for (const k of KEYS) { if (k === key) { out[k] = value; break; } if (a[k] !== undefined) out[k] = a[k]; }
    return out;
  }
  function maxRemaining(data, a) {
    const q = nextQuestion(data, a);
    return q ? 1 + Math.max(...q.options.map((o) => maxRemaining(data, answer(a, q.key, o.value)))) : 0;
  }
  function priceLine(data, p, a) {
    const v = packFor(data, p, a);
    return v ? grams(v.grams) + ' · ' + money(v.price, p.currency) : L(data).approxFrom + money(p.priceFrom, p.currency);
  }
  function differences(data, main, other, a) {
    const parts = [];
    const fresh = (other.notes || []).filter((n) => !(main.notes || []).includes(n));
    if (fresh.length) parts.push(L(data).diffTaste + fresh.slice(0, 3).join(', '));
    else if (!(other.notes || []).length && other.profile) parts.push(other.profile);
    if (other.process && other.process !== main.process) parts.push(other.process);
    return parts;
  }

  function result(data, a) {
    const t = L(data);
    if (a.prep === 'drip') {
      const d = data.drip, opt = d.options.find((o) => o.id === a.dripPick) || d.options[0];
      const dp = Number.isFinite(opt.price) ? opt.price : d.price, dpack = opt.pack || d.pack;
      return {kind: 'drip', product: d, option: opt, pack: {label: dpack, price: dp, verifiedAt: d.checkedAt}, priceVerified: true, total: dp, limit: null,
        priceLabel: money(dp, d.currency), packLabel: opt.pack ? dpack : dpack + ' · ' + opt.title, packs: [], addon: null, alternative: null, facts: [],
        reasons: [t.dripReason, [t.dripChosen, opt.title + ': ' + opt.detail + '.']],
        next: {title: t.dripNext, items: d.brew, link: null}, shipping: data.shop && data.shop.freeShipping || ''};
    }
    const product = pool(data, a)[0];
    if (!product) return null;
    const roast = roastFor(product, a.prep);
    const pack = packFor(data, product, a);
    /* Najmenšie balenie v limite; ak sa s doplnkom zmestí aj iné balenie, ostáva najmenšie. */
    const addon = addonFits(data, product, a, pack);
    const limit = a.budget && a.budget !== 'any' ? Number(a.budget) : null;
    const sum = pack ? pack.price + (addon ? addon.price : 0) : null;
    if (limit !== null && !(pack && sum <= limit + EPS)) throw new Error('n447 budget invariant: ' + product.id);
    const gk = grindKey(a), beans = !!data.beansOnly;
    const roastLabel = roast ? t.roast[roast] : (product.roastLabel || '');
    const tasteLabels = Object.assign({}, t.taste, data.tasteLabels || {});
    const grindLabel = (data.grindLabels || {})[gk];
    const reasons = [[t.reasonPrep[a.prep][0], product.prepText ? t.listed + product.prepText + '.' : t.reasonPrep[a.prep][1](roast)]];
    if (a.tool) reasons[0][1] += beans ? ' ' + t.beansGrind[gk] : t.orderPick + (grindLabel ? '„' + grindLabel + '“' : t.grindText[gk]) + '.';
    if (product.decaf) reasons.push([t.decaf, product.decafNote || t.decafFlag]);
    if ((a.taste && a.taste !== 'decaf') || chosen(a)) reasons.push([a.taste && a.taste !== 'decaf' ? tasteLabels[a.taste][0] : t.tones, t.inTaste + ((product.notes || []).slice(0, 4).join(', ') || product.profile) + '.']);
    else if ((product.notes || []).length) reasons.push([t.taste1, t.inTaste + product.notes.slice(0, 4).join(', ') + '.']);
    if (limit !== null) reasons.push([t.inBudget, grams(pack.grams) + (addon ? ' + ' + addon.product.name : '') + t.together + money(sum, product.currency) + t.yourLimit + money(limit, product.currency) + '.']);
    const packs = verifiedPacks(product, a).map((v) => ({label: grams(v.grams), price: money(v.price, product.currency), chosen: v === pack, over: limit !== null && v.price + (addon ? addon.price : 0) > limit + EPS}));
    const facts = [[t.fOrigin, product.origin, 'origin'], [t.fProcess, product.process, 'process'], [t.fRoast, roastLabel, 'roast'], [t.fComp, product.compositionText, 'comp']].filter((x) => x[1]);
    const same = pool(data, a, 'pick').filter((p) => p.id !== product.id);
    const alt = same[0] || null;
    const alternative = alt ? {product: alt, diff: differences(data, product, alt, a), price: priceLine(data, alt, a)} : null;
    const next = a.prep === 'filter' && a.tool === 'v60' && data.guides && data.guides.v60
      ? {title: t.nextV60, items: data.guides.v60.steps, link: {href: data.guides.v60.url, label: data.guides.v60.title}}
      : recipeOf(product, gk) ? {title: t.nextRecipe, items: [recipeOf(product, gk)].concat(beans ? [t.beansGrind[gk]] : []).filter(Boolean), link: product.recipeLink || null}
      : {title: t.nextTitle, items: ((beans ? t.nextBeans[gk] : grindLabel ? t.nextGround[gk](grindLabel) : t.next[gk]) || []).concat(a.tool === 'v60' && data.notes && data.notes.v60Filters ? [data.notes.v60Filters] : []), link: null};
    return {kind: 'coffee', product, roast, pack, addon, total: sum, limit, packs, facts, reasons, alternative, next,
      priceVerified: !!pack, priceLabel: pack ? money(pack.price, product.currency) : t.from + money(product.priceFrom, product.currency),
      packLabel: pack ? [grams(pack.grams), roastLabel, String(pack.grind || t.beansWord).toLowerCase()].filter(Boolean).join(' · ') : t.priceInfo,
      grindNote: pack && !beans && !data.grindFree && GRIND_FOR[gk] !== 'Zrnková' ? t.grindPriceNote : '',
      promoNote: product.promoNote || '', shipping: data.shop && data.shop.freeShipping || ''};
  }
  function allPaths(data, a, trail) {
    a = a || {}; trail = trail || [];
    const q = nextQuestion(data, a);
    if (!q) return [{answers: a, trail, result: result(data, a)}];
    return q.options.reduce((out, o) => out.concat(allPaths(data, answer(a, q.key, o.value), trail.concat([{key: q.key, value: o.value, question: q}]))), []);
  }
  const api = {KEYS, money, grams, roastFor, suits, verifiedPacks, packFor, pool, nextQuestion, answer, maxRemaining, result, allPaths, priceLine, processGroup};
  g.N447Engine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
