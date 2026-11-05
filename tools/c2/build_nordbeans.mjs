/* c2 – Nordbeans: primárne údaje z verejného UI (Codex 29.–30. 10. 2026, nordbeans-primary-ui-2026-10-30.json, rozparsované
   tools/c2/parse_nordbeans.py). Všetko o príprave, chuti, kyslosti, pôvode, spracovaní a pražení je z bloku „Detaily“ produktu.
   node tools/c2/build_nordbeans.mjs PARSED.json → n447/c2/data/nordbeans.js */
import fs from 'fs';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const P = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OLD = require('../../n447/data/nordbeans.js');
const CHECKED = '2026-10-30';
const oldById = new Map(OLD.products.concat(OLD.held.map((h) => h.product)).map((p) => [p.url, p]));
const slugOf = (u) => u.split('cz/')[1].replace(/_z\d+\/$/, '');
const PHOTO = (u) => { const s = slugOf(u); return fs.existsSync('assets/nordbeans/' + s + '.jpg') ? '/assets/nordbeans/' + s + '.jpg' : null; };
const split = (s) => String(s || '').split(/\s*[,–-]\s*/).map((x) => x.trim()).filter(Boolean);
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const REGION = {Kolumbie: 'americas', Kostarika: 'americas', Brazílie: 'americas', Honduras: 'americas', Guatemala: 'americas', Nikaragua: 'americas', 'Santos Brazílie': 'americas',
  Etiopie: 'africa', Uganda: 'africa', Keňa: 'africa'};
const report = [], products = [];
let set = null;
for (const x of P) {
  const f = x.facts, old = oldById.get(x.url) || {};
  const offers = x.offers.filter((o) => o.inStock);
  if (/four-pack/i.test(x.name)) {
    set = {id: 'vyber-baristy', kind: 'set', name: 'Výběr baristy: four-pack na espresso', url: x.url, photo: PHOTO(x.url) || '/assets/nordbeans/horizont.jpg', currency: 'CZK',
      price: offers[0].price, pack: '4 × 250 g', preps: ['espresso'], checkedAt: CHECKED,
      containsNames: ['BOLD DEER', 'HORIZONT', 'GUATEMALA', 'HOUSE BLEND'], contains: ['bold-deer', 'horizont', 'guatemala-washed', 'house-blend'],
      summary: 'Degustační set 4 × 250 g od headbaristy Nordbeans: čtyři různá espressa v jednom balení.'};
    continue;
  }
  const prepList = split(f['Příprava']).map((s) => s.toLowerCase());
  const preps = [], tools = [];
  if (prepList.some((s) => /espresso|automatick/.test(s))) preps.push('espresso');
  if (prepList.some((s) => /moka/.test(s))) preps.push('moka');
  if (prepList.some((s) => /^filtr|chemex|batch/.test(s))) tools.push('v60');
  if (prepList.some((s) => /aeropress/.test(s))) tools.push('aeropress');
  if (prepList.some((s) => /frenchpress|french press/.test(s))) tools.push('frenchpress');
  if (tools.length) preps.push('filter');
  const acid = f['Intenzita kyselosti'] || '';
  const taste = /nízk|nižš/i.test(acid) ? 'choco' : /středn/i.test(acid) ? 'fruitFull' : /vyšš|vysok/i.test(acid) ? 'fresh' : null;
  let notes = split(f['Charakteristika']).map(lc).map((n) => n === 'smetanova' ? 'smetanová' : n);
  if (!notes.length && x.name === 'Jizerky') notes = ['hořká čokoláda', 'pražené oříšky'];   // sekce Charakter: „tóny hořké čokolády, jemně pražených oříšků…“
  const decaf = /decaf/i.test(f['Zpracování'] || '') || /decaf/i.test(x.name);
  const roast = f['Stupeň pražení'] ? f['Stupeň pražení'].replace(/^(\S+)\s*-\s*(.+)$/, (m, a, b) => a.toLowerCase() + ' pražení, řada ' + b) : ({'Sweet City': 'tmavé pražení, řada Sweet City', 'Nový standard': 'střední pražení, řada Nový Standard', Nordbeans: 'světlé pražení, řada Nordbeans'}[f['Řada']] || old.roastLabel || null);
  const proc = /^(V regionu|Tento)/.test(f['Zpracování'] || '') ? 'Natural' : (f['Zpracování'] === 'Promyté' ? 'Promyté (washed)' : f['Zpracování'] || null);
  /* Recept: espresso iba ak dávka × pomer zodpovedá vode (± 3), inak sa nepreberá (BOLD DEER 18 g / 40 ml / 1:2,7 nesedí). */
  const recipes = {};
  if (x.recipe) {
    const t = x.recipe.join(' ').replace(/ /g, ' ');
    const dose = +((t.match(/Káva (\d+(?:[.,]\d+)?) g/) || [])[1] || NaN), water = +((t.match(/Voda (\d+)\s*(ml|g)/) || [])[1] || NaN), ratio = +(((t.match(/Poměr 1:(\d+(?:,\d+)?)/) || [])[1] || '').replace(',', '.') || NaN);
    const time = (t.match(/Čas\s+([\d:,\- ]+\s*(sec|min|m|mn)\b)/) || [])[1];
    const temp = (t.match(/Teplota (\d+ °C)/) || [])[1];
    if (Number.isFinite(ratio)) {
      if (Math.abs(dose * ratio - water) <= 3) recipes.espresso = `Espresso podle pražírny: káva ${dose} g, nápoj ${water} ml, poměr 1:${String(ratio).replace('.', ',')}, čas ${time.replace(/\s+/g, ' ').replace(' sec', ' s')}.`;
      else report.push(['RECEPT VYNECHANÝ (nesedí dávka × pomer)', x.name, t]);
    } else if (Number.isFinite(dose) && Number.isFinite(water) && tools.includes('v60')) {
      recipes.v60 = `Filtr podle pražírny: káva ${dose} g, voda ${water} ml` + (temp ? `, ${temp}` : '') + (time ? `, čas ${time.replace(/\s+/g, ' ').replace(/ (m|mn)$/, ' min')}` : '') + '.';
    }
  }
  const variants = offers.map((o) => ({grams: o.label ? parseInt(o.label) : 250, grind: 'zrnková', price: o.price, url: o.url, available: true, stock: o.stockText.replace(/ /g, ' '),
    verifiedAt: CHECKED, source: 'verejné UI e-shopu, viditeľný výběr balení po dokončení načtení ceny (Codex 29.–30. 10.)'}));
  const id = old.id || slugOf(x.url);
  const p = {id, kind: 'coffee', name: x.name, url: x.url, photo: PHOTO(x.url) || old.photo || x.photo, photoRemote: !(PHOTO(x.url) || old.photo), currency: 'CZK', available: variants.length > 0, decaf,
    preps, tools, roastLabel: roast, prepText: prepList.join(', '), taste, tastes: [taste], acidityLabel: acid, notes,
    origin: [f['Původ'], f['Lokalita']].filter(Boolean).join(' · '), region: x.name === 'Market Blend' || /\//.test(f['Původ'] || '') ? 'blend' : REGION[f['Původ']] || null,
    process: proc, variety: f['Odrůda'] || null, summary: (x.sections.Charakter || old.summary || '').split(/(?<=\.)\s+/).slice(0, 2).join(' '), series: f['Řada'] || null,
    priceFrom: Math.min(...variants.map((v) => v.price)), priceTo: Math.max(...variants.map((v) => v.price)), weights: variants.map((v) => v.grams),
    variants, checkedAt: CHECKED};
  if (Object.keys(recipes).length) p.recipes = recipes;
  if (decaf) p.decafNote = 'Kofein odstraněn metodou sugarcane decaf (podle pražírny).';
  if (x.name === 'BOLD DEER') p.packNote = 'Samostatně se teď prodává jen balení 1000 g; 250 g je pouze v setu Výběr baristy.';
  if (!taste || !preps.length || !notes.length) report.push(['NEÚPLNÉ', x.name, JSON.stringify({taste, preps, notes})]);
  const diff = old.id ? ['taste', 'notes', 'preps', 'tools', 'process'].filter((k) => JSON.stringify(old[k]) !== JSON.stringify(p[k])).map((k) => k + ': ' + JSON.stringify(old[k]) + ' → ' + JSON.stringify(p[k])) : ['NOVÁ'];
  report.push([x.name, variants.map((v) => v.grams + 'g ' + v.price).join(', '), diff.join(' ; ')]);
  products.push(p);
}
const DATA = {...OLD, checkedAt: CHECKED, chips: ['Káva do automatu', 'Káva na filtr', 'Máte hotový set na espresso?', 'Máte kávu bez kofeinu?'],
  tasteLabels: {choco: ['Čokoládová a oříšková', 'Nízká až nižší kyselost podle pražírny'], fruitFull: ['Vyvážená s ovocem', 'Střední kyselost podle pražírny'],
    fresh: ['Svěží a ovocná', 'Vyšší až vysoká kyselost podle pražírny'], decaf: ['Bez kofeinu', 'Káva i na večer']},
  scope: '21 zrnkových káv a hotový set Výběr baristy, jak je 29.–30. 10. 2026 ukazovalo veřejné UI e-shopu (jen viditelná spotřebitelská balení se stavem „Skladem“). Kapsle, rozpustná káva, čaje, předplatné a vybavení nejsou ve výběru.',
  excluded: ['velkoobchodní balení (skrytá ve výběru gramáže)', 'kapsle, rozpustná káva, předplatné, vybavení', 'BOLD DEER 250 g – samostatně se neprodává (jen v setu Výběr baristy)'],
  commercialNote: 'Nordbeans už má vlastního průvodce výběrem a chatbota Talabot; ukázka je doplněk, ne náhrada.',
  products, sets: set ? [set] : [], held: []};
delete DATA.drip;
fs.writeFileSync('n447/c2/data/nordbeans.js', `/* Nordbeans – c2: katalog z primárních údajů veřejného UI e-shopu (Codex 29.–30. 10. 2026: 22 produktů, 40 přesně ověřených
   spotřebitelských variant se stavem „Skladem“, přesné URL varianty). Chuťová skupina podle „Intenzita kyselosti“ pražírny.
   Recept BOLD DEER (18 g / 40 ml / 1:2,7) je nekonzistentní a nepřebírá se. Vygenerováno: tools/c2/build_nordbeans.mjs. */
(function (g) {
  'use strict';
  const DATA = ${JSON.stringify(DATA, null, 1)};
  (g.N447_DATA = g.N447_DATA || {}).nordbeans = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : window);
`);
for (const r of report) console.log(r.join(' | '));
console.log('set', set && set.price, products.length, 'káv', products.reduce((n, p) => n + p.variants.length, 0), 'variant');
