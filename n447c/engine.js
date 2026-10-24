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
  const KEYS = ['prep', 'dripPick', 'tool', 'pack', 'taste', 'budget', 'detailProcess', 'pick'];
  const PREP_ROASTS = {espresso: ['espresso', 'omni'], moka: ['espresso', 'omni'], filter: ['filter', 'omni']};
  const PREP_PHOTO = {espresso: '/assets/scenes/coffee-espresso.jpg', moka: '/assets/scenes/coffee-moka.jpg', filter: '/assets/scenes/coffee-filter.jpg'};
  const TASTE_PHOTO = {choco: '/assets/scenes/coffee-caramel.jpg', fruitFull: '/assets/scenes/coffee-berries.jpg', fresh: '/assets/scenes/coffee-acidity-bright.jpg', decaf: '/assets/scenes/coffee-decaf-cup.jpg'};
  const GRIND_FOR = {espresso: 'Zrnková', moka: 'Mletá moka konvička', v60: 'Mletá drip', aeropress: 'Mletá aeropress', frenchpress: 'Mletá french press'};

  const TXT = {
    sk: {
      prepQ: 'Ako si pripravujete kávu?', prepName: 'Príprava',
      prep: {espresso: ['Kávovar alebo automat', 'Espresso, cappuccino, latte'], moka: ['Moka kanvička', 'Príprava na sporáku'],
        filter: ['Filter a ručná príprava', 'V60, AeroPress, French press'], drip: ['Bez pomôcok, na cesty', 'Stačí šálka a horúca voda']},
      toolQ: 'Akú pomôcku na filter máte?', toolName: 'Pomôcka',
      tool: {v60: ['V60 alebo iný prelievaný filter', 'Papierový filter, prelievanie'], aeropress: ['AeroPress', 'Lúhovanie a pretlačenie'], frenchpress: ['French press', 'Lúhovanie s piestom']},
      dripQ: 'Ktorú kávu vo vrecúškach chcete?', dripName: 'Káva',
      cafQ: 'Má káva obsahovať kofeín?', cafName: 'Kofeín', caf: {yes: ['S kofeínom', 'Bežná káva z ponuky'], no: ['Bez kofeínu', 'Aj na večer']},
      tasteQ: 'Aká chuť vám sedí najviac?', tasteName: 'Chuť',
      taste: {choco: ['Čokoládová a karamelová', 'Sladká, plná, s orieškom či toffee'], fruitFull: ['Plná a ovocná', 'Višne, bobule, tmavé ovocie'], fresh: ['Svieža a šťavnatá', 'Ríbezle, citrus, čajové tóny'], decaf: ['Bez kofeínu', 'Káva aj na večer']},
      budgetQ: 'Koľko chcete dať za balenie?', budgetName: 'Rozpočet', budgetAny: 'Na cene až tak nezáleží',
      processQ: 'Aké spracovanie kávy vám je bližšie?', processName: 'Spracovanie',
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
      nInBudget: (n) => n + ' káv v balení do tejto sumy', allFit: (n) => 'Všetky vhodné kávy (' + n + ')', diffTaste: 'v chuti ',
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
      tasteQ: 'Jaká chuť vám sedí nejvíc?', tasteName: 'Chuť',
      taste: {choco: ['Čokoládová a karamelová', 'Sladká, plná, s oříšky'], fruitFull: ['Plná a ovocná', 'Višně, bobule, tmavé ovoce'], fresh: ['Svěží a šťavnatá', 'Rybíz, citrus, čajové tóny'], decaf: ['Bez kofeinu', 'Káva i na večer']},
      budgetQ: 'Kolik chcete dát za balení?', budgetName: 'Rozpočet', budgetAny: 'Na ceně až tak nezáleží',
      processQ: 'Jaké zpracování kávy je vám bližší?', processName: 'Zpracování',
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
      nInBudget: (n) => n + ' káv v balení do této částky', allFit: (n) => 'Všechny vhodné kávy (' + n + ')', diffTaste: 'v chuti ',
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
    return (p.variants || []).filter((v) => (!v.roast || v.roast === roast) && (!a.pack || v.grams === Number(a.pack)) && Number.isFinite(v.price) && v.verifiedAt && v.available !== false)
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
    if (/natural|anaerob/.test(x) && !/washed/.test(x)) return 'natural'; if (/washed/.test(x) && !/natural/.test(x)) return 'washed'; return null; };

  const SPLITS = {process: processGroup, region: (p) => p.region || null, blend: (p) => p.blend || null};
  const detailOf = (p, v) => { const [kind, k] = String(v).split(':'); return SPLITS[kind] ? SPLITS[kind](p) === k : false; };
  function pool(data, a, except) {
    return data.products.filter((p) => p.available !== false && p.kind === 'coffee')
      .filter((p) => !a.prep || a.prep === 'drip' || suits(p, a.prep))
      .filter((p) => toolOk(p, a.tool))
      .filter((p) => except === 'taste' || !a.taste || (a.taste === 'decaf' ? !!p.decaf : !p.decaf && tastesOf(p).includes(a.taste)))
      .filter((p) => except === 'budget' || !a.budget || a.budget === 'any' || !!packFor(data, p, a))
      .filter((p) => except === 'detailProcess' || !a.detailProcess || detailOf(p, a.detailProcess))
      .filter((p) => except === 'pick' || !a.pick || p.id === a.pick);
  }
  /* Káva môže patriť do viacerých chuťových skupín e-shopu (p.tastes). */
  const tastesOf = (p) => Array.isArray(p.tastes) && p.tastes.length ? p.tastes : [p.taste];
  const tones = (p) => p.notes && p.notes.length ? p.notes.slice(0, 3).join(' · ') : (p.profile || '');
  const text = (value, title, detail) => ({value, title, detail, textOnly: true});

  function nextQuestion(data,a) {
    if(!a.prep) return {key:'prep',name:'Príprava',title:'Ako si pripravujete kávu?',options:[{value:'espresso',title:'Kávovar alebo automat',detail:'Espresso, cappuccino, latte',photo:PREP_PHOTO.espresso},{value:'filter',title:'Filter a ručná príprava',detail:'V60, AeroPress, French press',photo:PREP_PHOTO.filter}]};
    if(a.prep==='filter'&&!a.tool)return {key:'tool',name:'Pomôcka',title:'Akú pomôcku na filter máte?',textOnly:true,options:Object.entries(TXT.sk.tool).map(([k,v])=>text(k,...v))};
    if(!a.pack)return {key:'pack',name:'Balenie',title:'Aké veľké balenie chcete?',textOnly:true,options:[text('250','250 g · menšie balenie','Na vyskúšanie alebo menšiu spotrebu'),text('900','900 g · veľké balenie','Nižšia cena za 100 g; na pravidelnú spotrebu')]};
    const base={prep:a.prep,tool:a.tool,pack:a.pack};let p=pool(data,base);
    if(!a.budget&&p.length>1){const prices=[...new Set(p.map(x=>packFor(data,x,base)?.price))].filter(Number.isFinite).sort((x,y)=>x-y);if(prices.length>1)return {key:'budget',name:'Rozpočet',title:'Koľko chcete dať za zvolené balenie?',textOnly:true,options:[text(String(prices[0]),'Do '+money(prices[0],'EUR'),'Len káva v tomto limite; bez dopravy'),text('any','Vyberiem podľa zloženia','Porovnanie oboch káv a ich presné ceny')]};}
    p=pool(data,{...base,budget:a.budget});
    if(!a.detailProcess&&p.length>1)return {key:'detailProcess',name:'Zloženie a chuť',title:'Ktorý rozdiel je pre vás dôležitejší?',textOnly:true,options:p.map(x=>text('blend:'+x.blend,x.compositionText,x.blend==='arabica'?'Figy a čokoláda · '+money(packFor(data,x,base).price,'EUR'):'Horká čokoláda a oriešky, viac kofeínu · '+money(packFor(data,x,base).price,'EUR')))};
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
    const roastLabel = roast ? (product.roastLabel || t.roast[roast]) : (product.roastLabel || '');
    const tasteLabels = Object.assign({}, t.taste, data.tasteLabels || {});
    const grindLabel = (data.grindLabels || {})[gk];
    const reasons = [[t.reasonPrep[a.prep][0], product.prepText ? 'Hodí sa na ' + product.prepText + '.' : t.reasonPrep[a.prep][1](roast)]];
    if (a.tool) reasons[0][1] += beans ? ' ' + t.beansGrind[gk] : t.orderPick + (grindLabel ? '„' + grindLabel + '“' : t.grindText[gk]) + '.';
    if (product.decaf) reasons.push([t.decaf, product.decafNote || t.decafFlag]);
    if ((a.taste && a.taste !== 'decaf') || a.pick) reasons.push([a.taste && a.taste !== 'decaf' ? tasteLabels[a.taste][0] : t.tones, t.inTaste + ((product.notes || []).slice(0, 4).join(', ') || product.profile) + '.']);
    else if ((product.notes || []).length) reasons.push([t.taste1, t.inTaste + product.notes.slice(0, 4).join(', ') + '.']);
    if (limit !== null) reasons.push([t.inBudget, grams(pack.grams) + (addon ? ' + ' + addon.product.name : '') + t.together + money(sum, product.currency) + t.yourLimit + money(limit, product.currency) + '.']);
    if(a.pack) reasons.push(['Zvolené balenie', grams(pack.grams)+' za '+money(pack.price, product.currency)+'. Cena zodpovedá tomuto konkrétnemu baleniu.']);
    const packs = verifiedPacks(product, {...a,pack:undefined}).map((v) => ({label: grams(v.grams), price: money(v.price, product.currency), chosen: v === pack, over: limit !== null && v.price + (addon ? addon.price : 0) > limit + EPS}));
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
      promoNote: pack?.grams === 250 ? product.promoNote || '' : '', shipping: data.shop && data.shop.freeShipping || ''};
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
