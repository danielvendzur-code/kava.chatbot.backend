/* Odporúčacie jadro novej dávky kávových ukážok (447 € + 10 €/mes.).
   Čisté funkcie bez DOM: rovnaký kód používa prehliadač aj testy ciest.
   Pravidlá: každá otázka mení výber medzi existujúcimi kávami, možnosti vznikajú iba z katalógu,
   žiadna vetva nevedie k prázdnemu výsledku; nič, čo e-shop neuvádza, sa netvrdí. */

const TXT = {
  sk: {
    prepQ: 'Ako kávu najčastejšie pripravujete?', prepName: 'Príprava',
    prep: {
      espresso: ['Kávovar alebo automat', 'Espresso, cappuccino, latte'],
      moka: ['Moka kanvička', 'Na sporák alebo indukciu'],
      filter: ['Filter a ručná príprava', 'V60, AeroPress, French press, drip'],
      drip: ['Bez pomôcok, na cesty', 'Stačí šálka a horúca voda']
    },
    cafQ: 'Chcete kávu s kofeínom?', cafName: 'Kofeín',
    caf: {yes: ['S kofeínom', 'Bežná káva'], no: ['Bez kofeínu', 'Aj na večer']},
    tasteQ: 'Aká chuť vám sedí najviac?', tasteName: 'Chuť',
    taste: {
      choco: ['Čokoládová a karamelová', 'Sladká, plná, s orieškom či toffee'],
      fruitFull: ['Plná a ovocná', 'Tmavé ovocie, višne, bobule, sladké telo'],
      fresh: ['Svieža a šťavnatá', 'Ríbezle, citrus, čajové tóny']
    },
    budgetQ: 'Koľko chcete dať za kávu?', budgetName: 'Rozpočet',
    budgetUpTo: (x) => `Do ${x}`, budgetAny: 'Na cene až tak nezáleží',
    budgetDetail: (n, names) => n <= 3 ? names.join(', ') : `${n} ${n < 5 ? 'kávy' : 'káv'}, ktoré v e-shope začínajú do tejto sumy`,
    budgetAnyDetail: (n) => `Všetky vhodné kávy (${n})`,
    pickQ: 'Ktoré tóny vás lákajú najviac?', pickName: 'Chuťové tóny',
    dripQ: 'Ktorú kávu vo vrecúškach chcete?', dripName: 'Káva v drip',
    reasonPrep: {
      espresso: (r) => r === 'omni' ? ['Na espresso aj do automatu', 'Pražiareň ju ponúka v jednom „omni“ pražení, mletú aj na espresso.'] : ['Na espresso aj do automatu', 'Pražiareň ju ponúka v espresso pražení.'],
      moka: (r) => ['Do moka kanvičky', r === 'omni' ? 'Má „omni“ praženie a e-shop ju ponúka aj mletú na moka kanvičku.' : 'Má espresso praženie a e-shop ju ponúka aj mletú na moka kanvičku.'],
      filter: (r) => ['Na filter', r === 'omni' ? 'Má „omni“ praženie a e-shop ju ponúka aj mletú na drip, AeroPress či French press.' : 'Pražiareň ju ponúka vo filter pražení.']
    },
    reasonDecaf: ['Bez kofeínu', 'Kofeín sa odstraňuje šetrne, etylacetátom z cukrovej trstiny.'],
    reasonTaste: (label, notes) => [label, notes ? `V chuti: ${notes}.` : ''],
    reasonBudget: (from, limit) => ['V rozpočte', `Cena od ${from}, váš limit ${limit}.`],
    reasonPick: (notes) => ['Tóny, ktoré ste si vybrali', notes],
    roastLabel: {espresso: 'espresso roast', filter: 'filter roast', omni: 'omni roast'},
    grind: {
      espresso: 'zrnková (automat, vlastný mlynček) alebo mletá espresso (pákový kávovar)',
      moka: 'mletá moka konvička',
      filter: 'mletá drip (V60), mletá aeropress alebo mletá french press podľa pomôcky; ak meliete doma, zrnková'
    },
    noAlternative: '',
    altBudget: 'nad zvolený rozpočet',
    cheaper: 'lacnejšia', pricier: 'drahšia'
  },
  cs: {}
};

export const t = (lang) => TXT[lang] && Object.keys(TXT[lang]).length ? TXT[lang] : TXT.sk;

export function money(v, currency = 'EUR', lang = 'sk') {
  if (!Number.isFinite(v)) return '';
  if (currency === 'CZK') return Math.round(v).toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
  const s = Number.isInteger(v) ? v.toFixed(2) : v.toFixed(2);
  return s.replace('.', ',') + ' €';
}

const PREP_ROASTS = {espresso: ['espresso', 'omni'], moka: ['espresso', 'omni'], filter: ['filter', 'omni']};
const ORDER = ['prep', 'caffeine', 'taste', 'budget', 'pick'];

export const roastFor = (product, prep) => (product.roasts || []).find((r) => (PREP_ROASTS[prep] || []).includes(r)) || null;

/* Kávy, ktoré spĺňajú doterajšie odpovede (bez kroku `exceptKey`). */
export function pool(data, answers, exceptKey = null) {
  const a = answers;
  return data.products.filter((p) => p.available !== false && p.kind === 'coffee')
    .filter((p) => !a.prep || a.prep === 'drip' ? true : !!roastFor(p, a.prep))
    .filter((p) => exceptKey === 'caffeine' || !a.caffeine || (a.caffeine === 'no') === !!p.decaf)
    .filter((p) => exceptKey === 'taste' || !a.taste || p.taste === a.taste)
    .filter((p) => exceptKey === 'budget' || !a.budget || a.budget === 'any' || p.priceFrom <= Number(a.budget))
    .filter((p) => exceptKey === 'pick' || !a.pick || p.id === a.pick);
}

const notesText = (p) => p.notes?.length ? p.notes.slice(0, 4).join(' · ') : (p.profile || '');

/* Nasledujúca otázka alebo null, keď je výsledok jednoznačný. */
export function nextQuestion(data, answers) {
  const L = t(data.lang), a = answers;
  if (!a.prep) {
    const options = Object.keys(PREP_ROASTS).filter((k) => pool(data, {prep: k}).length)
      .map((k) => ({value: k, title: L.prep[k][0], detail: L.prep[k][1], photo: `/assets/scenes/coffee-${k === 'espresso' ? 'espresso' : k}.jpg`}));
    if (data.drip) options.push({value: 'drip', title: L.prep.drip[0], detail: L.prep.drip[1], photo: data.drip.photo, contain: true});
    return {key: 'prep', name: L.prepName, title: L.prepQ, options, layout: 'photo'};
  }
  if (a.prep === 'drip') {
    const opts = data.drip?.options || [];
    if (opts.length > 1 && !a.dripPick) return {key: 'dripPick', name: L.dripName, title: L.dripQ, layout: 'text', options: opts.map((o) => ({value: o.id, title: o.title, detail: o.detail}))};
    return null;
  }
  let p = pool(data, {prep: a.prep});
  if (!a.caffeine) {
    const kinds = new Set(p.map((x) => !!x.decaf));
    if (kinds.size > 1) return {key: 'caffeine', name: L.cafName, title: L.cafQ, layout: 'text', options: [
      {value: 'yes', title: L.caf.yes[0], detail: L.caf.yes[1]}, {value: 'no', title: L.caf.no[0], detail: L.caf.no[1]}]};
  }
  p = pool(data, {prep: a.prep, caffeine: a.caffeine});
  if (!a.taste) {
    const groups = [...new Set(p.map((x) => x.taste))].filter(Boolean);
    if (groups.length > 1) {
      const photo = {choco: '/assets/scenes/coffee-chocolate.jpg', fruitFull: '/assets/scenes/coffee-berries.jpg', fresh: '/assets/scenes/coffee-acidity-bright.jpg'};
      return {key: 'taste', name: L.tasteName, title: L.tasteQ, layout: 'photo', options: ['choco', 'fruitFull', 'fresh'].filter((g) => groups.includes(g))
        .map((g) => ({value: g, title: L.taste[g][0], detail: L.taste[g][1], photo: photo[g]}))};
    }
  }
  p = pool(data, {prep: a.prep, caffeine: a.caffeine, taste: a.taste});
  if (!a.budget) {
    const prices = [...new Set(p.map((x) => x.priceFrom))].sort((x, y) => x - y);
    if (prices.length > 1) {
      const cur = p[0].currency, thresholds = [...new Set([prices[0], prices[prices.length - 2]])];
      const options = thresholds.map((x) => {
        const n = p.filter((q) => q.priceFrom <= x).length;
        return {value: String(x), title: L.budgetUpTo(money(x, cur)), detail: L.budgetDetail(n, p.filter((q) => q.priceFrom <= x).map((q) => q.name))};
      });
      options.push({value: 'any', title: L.budgetAny, detail: L.budgetAnyDetail(p.length)});
      return {key: 'budget', name: L.budgetName, title: L.budgetQ, layout: 'text', options};
    }
  }
  p = pool(data, {prep: a.prep, caffeine: a.caffeine, taste: a.taste, budget: a.budget});
  if (!a.pick && p.length > 1) {
    return {key: 'pick', name: L.pickName, title: L.pickQ, layout: 'text', pageSize: 4,
      options: p.map((x) => ({value: x.id, title: notesText(x), detail: `${x.name} · ${x.process || ''}`.replace(/ · $/, '')}))};
  }
  return null;
}

/* Najväčší možný počet ďalších otázok (presne, cez všetky vetvy). */
export function maxRemaining(data, answers) {
  const q = nextQuestion(data, answers);
  if (!q) return 0;
  return 1 + Math.max(...q.options.map((o) => maxRemaining(data, {...answers, [q.key]: o.value})));
}

/* Zmena skoršej odpovede zruší všetky neskoršie. */
export function answer(answers, key, value) {
  const keys = ['prep', 'dripPick', 'caffeine', 'taste', 'budget', 'pick'];
  const out = {};
  for (const k of keys) { if (k === key) { out[k] = value; break; } if (answers[k] !== undefined) out[k] = answers[k]; }
  return out;
}

function differences(main, other, L) {
  const parts = [];
  const fresh = (other.notes || []).filter((n) => !(main.notes || []).includes(n));
  if (fresh.length) parts.push('v chuti ' + fresh.slice(0, 3).join(', '));
  else if (!other.notes?.length && other.profile) parts.push(other.profile);
  if (other.process && other.process !== main.process) parts.push(other.process);
  if (other.priceFrom < main.priceFrom) parts.push(`${L.cheaper}, od ${money(other.priceFrom, other.currency)}`);
  else if (other.priceFrom > main.priceFrom) parts.push(`od ${money(other.priceFrom, other.currency)}`);
  return parts;
}

export function result(data, answers) {
  const L = t(data.lang), a = answers;
  if (a.prep === 'drip') {
    const d = data.drip, opt = d.options.find((o) => o.id === a.dripPick) || d.options[0];
    return {kind: 'drip', product: d, option: opt, priceLabel: money(d.price, d.currency), pack: d.pack,
      reasons: [['Bez pomôcok', 'Vrecúško zavesíte na šálku a prelejete horúcou vodou.'], ['Vybraná káva', `${opt.title}: ${opt.detail}.`]],
      order: [['Pri objednávke zvoľte', opt.title], ['Balenie', d.pack]],
      next: {title: 'Ako ju pripraviť', items: d.brew, link: null}, alternative: null, shipping: data.shop?.freeShipping || ''};
  }
  const list = pool(data, a);
  const product = list[0];
  if (!product) return null;
  const roast = roastFor(product, a.prep);
  const reasons = [L.reasonPrep[a.prep](roast)];
  if (product.decaf) reasons.push(L.reasonDecaf);
  if (a.taste) reasons.push(L.reasonTaste(L.taste[a.taste][0], product.notes?.slice(0, 4).join(', ') || product.profile));
  if (a.budget && a.budget !== 'any') reasons.push(L.reasonBudget(money(product.priceFrom, product.currency), money(Number(a.budget), product.currency)));
  if (a.pick) reasons.push(L.reasonPick(notesText(product)));
  if (!a.taste && !a.pick && product.notes?.length) reasons.push(['Chuť', `V chuti: ${product.notes.slice(0, 4).join(', ')}.`]);
  const weights = product.weights.map((g) => g >= 1000 ? (g / 1000 + ' kg').replace('.', ',') : g + ' g').join(' · ');
  const order = [['Praženie', L.roastLabel[roast]], ['Balenie', weights], ['Mletie', L.grind[a.prep]]];
  const facts = [['Pôvod', product.origin], ['Farma / stanica', product.farm], ['Odroda', product.variety], ['Spracovanie', product.process], ['Nadmorská výška', product.altitude]].filter(([, v]) => v);
  /* Alternatíva: iná káva z rovnakých podmienok; ak nie je, rovnaká príprava a kofeín mimo zvoleného rozpočtu. */
  const same = pool(data, a, 'pick').filter((p) => p.id !== product.id);
  let altProduct = same[0] || null, altNote = '';
  if (!altProduct && a.budget && a.budget !== 'any') { altProduct = pool(data, {...a, budget: 'any', pick: undefined}).find((p) => p.id !== product.id) || null; altNote = altProduct ? L.altBudget : ''; }
  const alternative = altProduct ? {product: altProduct, diff: differences(product, altProduct, L), note: altNote} : null;
  const next = a.prep === 'filter' && data.guides?.v60
    ? {title: 'Čo ďalej: príprava na V60', items: data.guides.v60.steps, link: {href: data.guides.v60.url, label: data.guides.v60.title}}
    : a.prep === 'moka'
      ? {title: 'Čo ďalej', items: ['V košíku zvoľte mletie „moka konvička“, kávu netreba doma mlieť.', 'Ak máte vlastný mlynček, zrnková vydrží po otvorení dlhšie čerstvá.'], link: null}
      : {title: 'Čo ďalej', items: ['Do automatu vyberte zrnkovú, automat si ju zomelie sám.', 'Na pákový kávovar bez mlynčeka zvoľte „mletá espresso“.'], link: null};
  return {kind: 'coffee', product, roast, priceLabel: 'od ' + money(product.priceFrom, product.currency), reasons, order, facts, alternative, next,
    shipping: data.shop?.freeShipping || '', promoNote: product.promoNote || ''};
}

/* Všetky dosiahnuteľné cesty (pre testy). */
export function allPaths(data, answers = {}, trail = []) {
  const q = nextQuestion(data, answers);
  if (!q) return [{answers, trail, result: result(data, answers)}];
  return q.options.flatMap((o) => allPaths(data, answer(answers, q.key, o.value), [...trail, {key: q.key, value: o.value, options: q.options.length, question: q}]));
}
