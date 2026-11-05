/* c2 – BLACK: primárne údaje z verejného UI (Codex, 29. 10. 2026, black-primary-ui-2026-10-30.json) + overené fakty
   z n447/data/black.js (pôvod, spracovanie, tóny). node tools/c2/build_black.mjs RAW.json → n447/c2/data/black.js */
import fs from 'fs';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const RAW = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const OLD = require('../../n447/data/black.js');
const CHECKED = '2026-10-29';
const raw = new Map(RAW.products.map((p) => [p.url.replace(/\/$/, ''), p]));
const grams = (s) => { const m = String(s).replace(',', '.').match(/([\d.]+)\s*(kg|g)/i); return m ? Math.round(Number(m[1]) * (m[2].toLowerCase() === 'kg' ? 1000 : 1)) : null; };
const roastOf = (s) => /espresso/.test(s) ? 'espresso' : /filter/.test(s) ? 'filter' : /omni/.test(s) ? 'omni' : null;
const report = [];
const products = OLD.products.map((p) => {
  const r = raw.get(p.url.replace(/\/$/, ''));
  if (!r) { report.push(['CHÝBA v primárnych údajoch', p.name]); return {...p, available: false}; }
  const variants = r.variants.filter((v) => v.orderable && v.grind === 'Zrnková').map((v) => {
    const nums = [...String(v.priceText).matchAll(/(\d+(?:\.\d+)?)\s*€/g)].map((m) => Number(m[1]));
    const out = {roast: roastOf(v.requestedRoast), grams: grams(v.selectedPack), grind: 'Zrnková', price: v.priceAmount, verifiedAt: CHECKED,
      source: 'verejné UI e-shopu, viditeľný výber praženia a gramáže (Codex 29. 10.)'};
    if (nums.length > 1 && nums[1] > v.priceAmount) out.regularPrice = nums[1];
    return out;
  });
  const roasts = [...new Set(variants.map((v) => v.roast))];
  const weights = [...new Set(variants.map((v) => v.grams))].sort((a, b) => a - b);
  const lead = (r.productText.split('\n').find((l) => / s tónmi |sladká a |šťavnatá/.test(l)) || '').trim();
  const q = {...p, checkedAt: CHECKED, variants, roasts, weights, priceFrom: Math.min(...variants.map((v) => v.price)), priceTo: Math.max(...variants.map((v) => v.price)),
    held: r.variants.filter((v) => !v.orderable).map((v) => grams(v.selectedPack) + ' g (' + roastOf(v.requestedRoast) + ')')};
  delete q.heldVariants; delete q.promoNote;
  q.summary = String(q.summary || '').replace(/\s*\((?:novinka, )?prečítané[^)]*\)/, '');
  if (!q.held.length) delete q.held;
  if (lead) q.tasteLine = lead;
  report.push([p.name, variants.length + ' balení', roasts.join('/'), variants.filter((v) => v.regularPrice).length ? 'AKCIA' : '', JSON.stringify(roasts) === JSON.stringify(p.roasts.filter((x) => roasts.includes(x))) && roasts.length === p.roasts.length ? '' : 'PRAŽENIE ZMENENÉ ' + p.roasts + '→' + roasts]);
  return q;
});
const dr = raw.get(OLD.drip.url.replace(/\/$/, ''));
const dv = dr.variants.filter((v) => v.orderable);
const drip = {...OLD.drip, checkedAt: CHECKED, price: dv[0].priceAmount, pack: 'balenie 8 ks',
  options: OLD.drip.options.filter((o) => dv.some((v) => v.requestedRoast.toLowerCase().includes(o.id === 'juicy' ? 'juicy' : o.id)))};
const DATA = {...OLD, checkedAt: CHECKED, chips: ['Káva do automatu', 'Máte ovocnú kávu?', 'Máte kávu bez kofeínu?', 'Máte drip vrecúška na cesty?'],
  scope: 'Všetkých 16 zrnkových káv z kategórie káva a drip vrecúška drippin., ako ich 29. 10. 2026 ukazovalo verejné UI e-shopu. Cena platí pre zrnkovú kávu (mletie Zrnková); cenu iného mletia sme neoverovali. Kapsule, cascara, doplnky a merch nie sú vo výbere.',
  priceScope: RAW.priceScope, grindPriceNote: true,
  excluded: OLD.excluded.concat(RAW.held.map((h) => ({name: h.product + ' – ' + h.pack + (h.requestedRoast.includes('drip') ? ' (' + h.requestedRoast.replace('drip coffee: ', '') + ')' : ''), url: '', reason: 'Kombinácia sa v e-shope nedala objednať; jej zobrazenú cenu nepoužívame.'}))),
  products, drip,
  demo: {...OLD.demo, heroProductId: 'doce-citrus'}};
const js = `/* BLACK. (pražiareň black., Bratislava) – c2: katalóg z primárnych údajov verejného UI e-shopu (Codex 29. 10. 2026:
   17 produktov, 76 objednateľných kombinácií praženie × gramáž pri mletí „Zrnková“; 2 neobjednateľné kombinácie vyradené).
   Akciové ceny sú zachované tak, ako ich e-shop zobrazil (black sheep 500 g za 10 €); bežná cena je v regularPrice.
   Fakty o pôvode a tónoch z produktových stránok (22.–27. 10.). Vygenerované: tools/c2/build_black.mjs. */
(function (g) {
  'use strict';
  const DATA = ${JSON.stringify(DATA, null, 1)};
  (g.N447_DATA = g.N447_DATA || {}).black = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof globalThis !== 'undefined' ? globalThis : window);
`;
fs.writeFileSync('n447/c2/data/black.js', js);
for (const r of report) console.log(r.join(' | '));
console.log('drip', drip.options.map((o) => o.id), drip.price);
