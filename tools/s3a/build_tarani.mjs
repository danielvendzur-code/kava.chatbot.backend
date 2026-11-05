/* Séria 3 – TARANI v natívnom poradcovi Andreine (catalogue-advisor.js + advisor-core.js).
   Zdroj: overený katalóg séria 3 (kategórie e-shopu tarani.cz a produktové stránky, 5. 11. 2026).
   Najviac 25 dostupných produktov pleťovej starostlivosti; typ pleti a účinok iba z kategórií e-shopu (suitabilityEvidence).
   node tools/s3a/build_tarani.mjs SOURCE_CATALOGUE.js  → catalogues/tarani.js + výpis dosiahnuteľnosti */
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
require(process.argv[2]);
const src = globalThis.CX_CATALOGUES.tarani;
const face = src.products.filter((p) => p.category === 'face' && p.available !== false && Number.isFinite(p.priceAmount));
const SKIN = {sensitive: 'sensitive', blemish: 'oily', dry: 'dry', mature: 'mature'};
const EFFECT = {calm: 'calm', hydrate: 'hydrate', antiage: 'mature', detox: 'balance', nourish: 'hydrate'};
const KIND_ORDER = ['Čištění a odličování', 'Tonika a pleťové vody', 'Séra a oleje', 'Emulze a gely', 'Krémy', 'Masky a peelingy'];
/* Typ starostlivosti podľa druhu produktu v e-shope; účinok z kategórie „dle problematiky“. Iba produkty s oboma údajmi. */
const CARE = {'Čištění a odličování': 's3Cleanse', 'Tonika a pleťové vody': 's3Tone', 'Séra a oleje': 's3Serum', 'Emulze a gely': 's3Gel', 'Krémy': 's3Cream', 'Masky a peelingy': 's3Mask'};
const EFF = {calm: 's3Calm', hydrate: 's3Hydrate', antiage: 's3Antiage', detox: 's3Detox', nourish: 's3Nourish', bright: 's3Bright'};
const usable = face.filter((p) => CARE[p.kind] && EFF[p.facets?.effect]);
/* Výber: najprv každá kombinácia (druh × účinok) raz – každá vedie k inému výsledku; potom ďalší typ pleti v tej istej kombinácii; najviac 25. */
const chosen = [], combo = new Set();
for (const p of usable) { const c = p.kind + '|' + p.facets.effect; if (!combo.has(c)) { combo.add(c); chosen.push(p); } }
for (const p of usable) { if (chosen.length >= 25) break; if (!chosen.includes(p) && !chosen.some((c) => c.kind === p.kind && c.facets.effect === p.facets.effect && JSON.stringify(c.facets.skin) === JSON.stringify(p.facets.skin))) chosen.push(p); }
chosen.splice(25);
const products = chosen.map((p) => {
  const skin = p.facets?.skin || [];
  const tags = [...new Set([...skin.map((s) => SKIN[s]).filter(Boolean), EFFECT[p.facets?.effect]].filter(Boolean))];
  const evidence = Object.assign({}, p.source?.suitabilityEvidence || {});
  if (p.facets?.effect) evidence[EFFECT[p.facets.effect]] = evidence[EFFECT[p.facets.effect]] || ('kategorie e-shopu (dle problematiky): ' + (p.k2Terms || p.facets.effect));
  const description = String(p.description || p.reason || '').split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 3).join('. ').replace(/…$/, '').replace(/\.\./g, '.');
  return {id: p.id, name: p.name, url: p.url, priceAmount: p.priceAmount, currency: 'CZK', price: p.price, volume: p.volume || '', variantLabel: p.variantLabel || '',
    category: 'face', kind: p.kind, tags, photo: p.photo, available: true, isSample: false, description, reason: description,
    source: {...p.source, suitabilityEvidence: evidence, selectionTraits: {careUse: CARE[p.kind], purpose: CARE[p.kind], skinFocus: EFF[p.facets.effect]}, selectionTraitsEvidence: 'druh produktu a kategorie „Pleť dle problematiky“ v e-shopu tarani.cz (' + (p.k2Terms || '') + ')', allSkinTypes: skin.includes('all'), suitabilitySource: 'kategorie e-shopu tarani.cz (Pleť dle typu / dle problematiky)', descriptionSource: 'oficiální stránka produktu'}};
});
const out = {verifiedAt: src.verifiedAt, source: src.source, collectionMethod: src.collectionMethod + '; séria 3: výber 25 dostupných produktů péče o pleť', excluded: src.excluded, products};
fs.writeFileSync('catalogues/tarani.js', '/* Séria 3 (Andreine základ) – TARANI: 25 dostupných produktov starostlivosti o pleť z overeného katalógu (5. 11. 2026). Generované: tools/s3a/build_tarani.mjs. */\nglobalThis.CX_CATALOGUES ||= {};\nglobalThis.CX_CATALOGUES["tarani"] = ' + JSON.stringify(out) + ';\n');
/* dosiahnuteľnosť cez natívny poradca: víťaz, ďalšie odporúčanie alebo „ďalšie vhodné možnosti“ */
const core = require(process.cwd() + '/advisor-core.js');
const engine = core.create(products);
const winners = new Set(), shown = new Set(); let paths = 0, maxDepth = 0;
const walk = (a, depth) => {
  const steps = engine.steps(a).map((s) => ({...s, options: s.options.filter((v) => v === 'any' || engine.recommend({...a, [s.key]: v}).winner)}));
  const step = steps.find((s) => a[s.key] === undefined);
  if (!step) { const r = engine.recommend(a); paths++; maxDepth = Math.max(maxDepth, depth); if (r.winner) { winners.add(r.winner.id); r.matches.forEach((m) => shown.add(m.id)); } return; }
  for (const v of step.options) walk({...a, [step.key]: v}, depth + 1);
};
walk({}, 0);
console.log(`tarani: ${products.length} produktov, ${paths} ciest, hĺbka ${maxDepth}, víťaz ${winners.size}/${products.length}, zobrazené ${shown.size}/${products.length}`);
console.log('nikdy víťaz:', products.filter((p) => !winners.has(p.id)).map((p) => p.name + ' [' + p.kind + ' ' + p.tags + ']').join('; '));
