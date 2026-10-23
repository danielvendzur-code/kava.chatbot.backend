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
  const KEYS = ['prep', 'dripPick', 'tool', 'taste', 'budget', 'detailProcess', 'pick'];
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
        frenchpress: ['Kávu pomeľte nahrubo tesne pred prípravou.', 'Zrnkovú kávu skladujte v uzavretej nádobe, mimo svetla.']}
    }
  };
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
  const addonFor = (data, p, a) => typeof data.addonFor === 'function' ? data.addonFor(p, a) : null;
  const total = (data, p, a, v) => v.price + (addonFor(data, p, a)?.price || 0);
  function packFor(data, p, a) {
    const packs = verifiedPacks(p, a);
    if (!a.budget || a.budget === 'any') return packs[0] || null;
    return packs.find((v) => total(data, p, a, v) <= Number(a.budget) + EPS) || null;
  }

  const processGroup = (p) => { const x = String(p.process || '').toLowerCase();
    if (/honey/.test(x)) return 'honey'; if (/semi/.test(x)) return 'semi';
    if (/natural|anaerob/.test(x) && !/washed/.test(x)) return 'natural'; if (/washed/.test(x) && !/natural/.test(x)) return 'washed'; return null; };

  const SPLITS = {process: processGroup, region: (p) => p.region || null, blend: (p) => p.blend || null};
  const detailOf = (p, v) => { const [kind, k] = String(v).split(':'); return SPLITS[kind] ? SPLITS[kind](p) === k : false; };
  function pool(data, a, except) {
    return data.products.filter((p) => p.available !== false && p.kind === 'coffee')
      .filter((p) => !a.prep || a.prep === 'drip' || suits(p, a.prep))
      .filter((p) => toolOk(p, a.tool))
      .filter((p) => except === 'taste' || !a.taste || (a.taste === 'decaf' ? !!p.decaf : !p.decaf && p.taste === a.taste))
      .filter((p) => except === 'budget' || !a.budget || a.budget === 'any' || !!packFor(data, p, a))
      .filter((p) => except === 'detailProcess' || !a.detailProcess || detailOf(p, a.detailProcess))
      .filter((p) => except === 'pick' || !a.pick || p.id === a.pick);
  }
  const tones = (p) => p.notes && p.notes.length ? p.notes.slice(0, 3).join(' · ') : (p.profile || '');
  const text = (value, title, detail) => ({value, title, detail, textOnly: true});

  function nextQuestion(data, a) {
    const t = L(data);
    if (!a.prep) {
      const options = Object.keys(PREP_ROASTS).filter((k) => pool(data, {prep: k}).length)
        .map((k) => ({value: k, title: t.prep[k][0], detail: t.prep[k][1], photo: PREP_PHOTO[k]}));
      if (data.drip) options.push({value: 'drip', title: t.prep.drip[0], detail: t.prep.drip[1], photo: data.drip.photo});
      return {key: 'prep', name: t.prepName, title: t.prepQ, options};
    }
    if (a.prep === 'drip') {
      const o = data.drip.options || [];
      return o.length > 1 && !a.dripPick ? {key: 'dripPick', name: t.dripName, title: t.dripQ, textOnly: true, options: o.map((x) => text(x.id, x.title, x.detail))} : null;
    }
    if (a.prep === 'filter' && !a.tool) {
      const tools = Object.keys(t.tool).filter((k) => pool(data, {prep: 'filter', tool: k}).length);
      if (tools.length > 1) return {key: 'tool', name: t.toolName, title: t.toolQ, textOnly: true, options: tools.map((k) => text(k, t.tool[k][0], t.tool[k][1]))};
    }
    let p = pool(data, {prep: a.prep, tool: a.tool});
    /* Chuť a kofeín v jednej otázke: bezkofeínová káva je samostatná karta, nie ďalší krok. */
    if (!a.taste) {
      const labels = Object.assign({}, t.taste, data.tasteLabels || {});
      const groups = ['choco', 'fruitFull', 'fresh'].filter((k) => p.some((x) => !x.decaf && x.taste === k));
      if (p.some((x) => x.decaf)) groups.push('decaf');
      if (groups.length > 1) return {key: 'taste', name: t.tasteName, title: t.tasteQ, options: groups.map((k) => ({value: k, title: labels[k][0], detail: labels[k][1], photo: TASTE_PHOTO[k]}))};
    }
    const base = {prep: a.prep, tool: a.tool, taste: a.taste};
    p = pool(data, base);
    if (!a.budget) {
      const cheapest = p.map((x) => { const v = verifiedPacks(x, base)[0]; return v ? {x, v, sum: total(data, x, base, v)} : null; });
      if (cheapest.length > 1 && cheapest.every(Boolean)) {
        const prices = [...new Set(cheapest.map((c) => c.sum))].sort((m, n) => m - n);
        const limits = prices.filter((x) => cheapest.filter((c) => c.sum <= x + EPS).length < p.length);
        /* Spodný limit zahrnie aspoň tretinu vhodných káv (najmenej dve), horný všetky okrem najdrahších. */
        const need = Math.max(2, Math.ceil(p.length / 3));
        const low = limits.find((x) => cheapest.filter((c) => c.sum <= x + EPS).length >= need);
        const chosen = [...new Set([low, limits[limits.length - 1]].filter((x) => x !== undefined))];
        if (chosen.length) {
          const cur = p[0].currency;
          const options = chosen.map((x) => { const fit = cheapest.filter((c) => c.sum <= x + EPS); return text(String(x), 'Do ' + money(x, cur), fit.length <= 3 ? fit.map((c) => c.x.name + ' ' + grams(c.v.grams)).join(', ') : fit.length + ' káv v balení do tejto sumy'); });
          options.push(text('any', t.budgetAny, 'Všetky vhodné kávy (' + p.length + ')'));
          return {key: 'budget', name: t.budgetName, title: t.budgetQ, textOnly: true, options};
        }
      }
    }
    p = pool(data, Object.assign({}, base, {budget: a.budget}));
    /* Viac než štyri rovnocenné kávy: najprv overený rozdiel v spracovaní, inak v pôvode, potom konkrétne tóny. */
    if (!a.detailProcess && p.length > 4) {
      const names = (l) => l.map((x) => x.name).join(', ');
      const kinds = [['process', {natural: 'Natural spracovanie', washed: 'Washed spracovanie', honey: 'Honey spracovanie', semi: 'Semi-washed spracovanie'}, t.processQ, t.processName],
        ['region', t.region, t.regionQ, t.regionName], ['blend', t.blend, t.blendQ, t.blendName]];
      for (const max of [4, 5]) for (const [kind, labels, title, name] of kinds) {
        const keyOf = SPLITS[kind];
        const keys = [...new Set(p.map(keyOf))];
        const groups = keys.map((k) => [k, p.filter((x) => keyOf(x) === k)]);
        if (keys.length > 1 && !keys.includes(null) && groups.every(([, l]) => l.length <= max))
          return {key: 'detailProcess', name, title, textOnly: true, options: groups.map(([k, l]) => text(kind + ':' + k, labels[k] || k, names(l)))};
      }
    }
    p = pool(data, Object.assign({}, base, {budget: a.budget, detailProcess: a.detailProcess}));
    if (!a.pick && p.length > 1)
      return {key: 'pick', name: t.pickName, title: t.pickQ, textOnly: true, options: p.map((x) => text(x.id, tones(x), x.name))};
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
    return v ? grams(v.grams) + ' · ' + money(v.price, p.currency) : 'orientačne od ' + money(p.priceFrom, p.currency);
  }
  function differences(data, main, other, a) {
    const parts = [];
    const fresh = (other.notes || []).filter((n) => !(main.notes || []).includes(n));
    if (fresh.length) parts.push('v chuti ' + fresh.slice(0, 3).join(', '));
    else if (!(other.notes || []).length && other.profile) parts.push(other.profile);
    if (other.process && other.process !== main.process) parts.push(other.process);
    return parts;
  }

  function result(data, a) {
    const t = L(data);
    if (a.prep === 'drip') {
      const d = data.drip, opt = d.options.find((o) => o.id === a.dripPick) || d.options[0];
      return {kind: 'drip', product: d, option: opt, pack: {label: d.pack, price: d.price, verifiedAt: d.checkedAt}, priceVerified: true, total: d.price, limit: null,
        priceLabel: money(d.price, d.currency), packLabel: d.pack + ' · ' + opt.title, packs: [], addon: null, alternative: null, facts: [],
        reasons: [['Bez pomôcok', 'Vrecúško zavesíte na šálku a prelejete horúcou vodou.'], ['Vybraná káva', opt.title + ': ' + opt.detail + '.']],
        next: {title: 'Ako ju pripraviť', items: d.brew, link: null}, shipping: data.shop && data.shop.freeShipping || ''};
    }
    const product = pool(data, a)[0];
    if (!product) return null;
    const roast = roastFor(product, a.prep);
    const pack = packFor(data, product, a);
    const addon = pack ? addonFor(data, product, a) : null;
    const limit = a.budget && a.budget !== 'any' ? Number(a.budget) : null;
    const sum = pack ? pack.price + (addon ? addon.price : 0) : null;
    if (limit !== null && !(pack && sum <= limit + EPS)) throw new Error('n447 budget invariant: ' + product.id);
    const gk = grindKey(a), beans = !!data.beansOnly;
    const roastLabel = roast ? t.roast[roast] : (product.roastLabel || '');
    const tasteLabels = Object.assign({}, t.taste, data.tasteLabels || {});
    const reasons = [[t.reasonPrep[a.prep][0], product.prepText ? 'E-shop ju uvádza na: ' + product.prepText + '.' : t.reasonPrep[a.prep][1](roast)]];
    if (a.tool) reasons[0][1] += beans ? ' ' + t.beansGrind[gk] : ' Pri objednávke zvoľte ' + t.grindText[gk] + '.';
    if (product.decaf) reasons.push(['Bez kofeínu', product.decafNote || 'E-shop ju označuje ako bezkofeínovú.']);
    if ((a.taste && a.taste !== 'decaf') || a.pick) reasons.push([a.taste && a.taste !== 'decaf' ? tasteLabels[a.taste][0] : 'Chuťové tóny', 'V chuti: ' + ((product.notes || []).slice(0, 4).join(', ') || product.profile) + '.']);
    else if ((product.notes || []).length) reasons.push(['Chuť', 'V chuti: ' + product.notes.slice(0, 4).join(', ') + '.']);
    if (limit !== null) reasons.push(['V rozpočte', grams(pack.grams) + (addon ? ' + ' + addon.product.name : '') + ' spolu ' + money(sum, product.currency) + '; váš limit ' + money(limit, product.currency) + '.']);
    const packs = verifiedPacks(product, a).map((v) => ({label: grams(v.grams), price: money(v.price, product.currency), chosen: v === pack, over: limit !== null && v.price + (addon ? addon.price : 0) > limit + EPS}));
    const facts = [['Pôvod', product.origin], ['Spracovanie', product.process], ['Praženie', roastLabel], ['Zloženie', product.compositionText]].filter((x) => x[1]);
    const same = pool(data, a, 'pick').filter((p) => p.id !== product.id);
    const alt = same[0] || null;
    const alternative = alt ? {product: alt, diff: differences(data, product, alt, a), price: priceLine(data, alt, a)} : null;
    const next = a.prep === 'filter' && a.tool === 'v60' && data.guides && data.guides.v60
      ? {title: 'Čo ďalej: príprava na V60', items: data.guides.v60.steps, link: {href: data.guides.v60.url, label: data.guides.v60.title}}
      : {title: 'Čo ďalej', items: (beans ? t.nextBeans[gk] : t.next[gk]) || [], link: null};
    return {kind: 'coffee', product, roast, pack, addon, total: sum, limit, packs, facts, reasons, alternative, next,
      priceVerified: !!pack, priceLabel: pack ? money(pack.price, product.currency) : 'od ' + money(product.priceFrom, product.currency),
      packLabel: pack ? [grams(pack.grams), roastLabel, String(pack.grind || 'Zrnková').toLowerCase()].filter(Boolean).join(' · ') : 'Orientačná cena; presnú cenu balenia ukáže e-shop po výbere',
      grindNote: pack && !beans && GRIND_FOR[gk] !== 'Zrnková' ? t.grindPriceNote : '',
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
