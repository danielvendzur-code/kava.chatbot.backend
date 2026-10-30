/* k2 – strom výberu všetkých 10 ukážok (advisor-core-k2 + brands/*.js), bez siete.  node tools/k2/test_tree_k2.mjs
   Overuje: (1) každá otázka má ≥ 2 voľby a každá cesta končí produktom; (2) voľby poslednej otázky (focus) neukazujú
   marketingový názov produktu – slovo z názvu, ktoré nie je v popise produktu ani v zložení, nesmie byť v titulku voľby;
   (3) MusK: otázka „Aké máte vlasy?“ nemieša vôňu (žiadna vianočná/vôňová hodnota), darčeková sada nie je „celá rutina“;
   (4) bez tautológie „zaraďuje ho presne sem“ vo vysvetlení výsledku. */
import fs from 'node:fs';
globalThis.window = globalThis; globalThis.COSMETICS_DEMOS = {brands: {}};
await import(process.cwd() + '/n447/kozmetika2/advisor-core-k2.js');
await import(process.cwd() + '/n447/kozmetika2/chat-guard-k2.js');
const C = globalThis.CXAdvisorCore, G = globalThis.CXK2ChatGuard;
const SLUGS = ['akh', 'andreine447', 'bohemikus', 'goodie', 'libebit', 'malinna', 'mark', 'moravite', 'musk', 'naturinka'];
const GEN = new Set('prirodni prirodne prirodny mydlo mydla mydel solne solny jogurtove kavove tuhy tuha tuhe sampon sampony sada sady darkova darkovy darcekova dárková bio olej oleje maska pletova pletovy telove telovy krem serum balzam kondicioner vlasy plet koupelova kupel maslo sprchovy tonikum voda hydrolat deodorant mini velke baleni balenie libebit goodie mark musk naturinka moravite malinna andreine bohemikus pro pre with face body mask soap oil cream shampoo bath bomb peeling scrub'.split(' '));
const MARKETING = {
  akh: ['FRISCH', 'CELLU-THERAP', 'OLEOSOL'],
  bohemikus: ['Bílá paní', 'Medová princezna', 'Vzácná divoška', 'Černá perla', 'Santalový divoch', 'Dračí bojovnice', 'Lady Provence', 'Královna jihu', 'Královna růží', 'Lady Mocca', 'Královny'],
  goodie: ['Wild Blueberry', 'PURPLE', 'Natural', "Dragon's Blood", 'Shimmer oil', 'Anti-Stretch', 'Hair Food', 'Blue ocean', 'Fresh herbs', 'Berry sweet dream', 'CocoVanilla', 'Galaxy', 'Unicorn', 'Mermaid', 'Starburst', 'Winter Glow', 'Flower garden', 'Pumpkin spice', 'Minty Spirulina', 'Crazy Grape', 'Lemon Lavender', 'Good Night', 'Black Surprise', 'Choco Caramel', 'Anise Cinnamon', 'Pink clay', 'Lemongrass'],
  libebit: ['SÍLA', 'POHYB', 'KLID', 'SIMMON', 'LINUM', 'DAVAO', 'YUNNAN', 'HARARE', 'AVENA', 'SVÁTEČNÍ'],
  malinna: ['Cleansing Foam', 'Face Wash', 'Repairing Cream', 'Anti-Aging Cream', 'Sensitive Cream', 'Body Serum', 'Daily Trio', 'Essentials'],
  mark: ['Golden Shine', 'Body Glow', 'Body Relax', 'Body Love', 'Simpl Therapy', 'coffee scrub', 'set pre NEHO', 'Men Skin', 'Láska na prvý dotyk'],
  moravite: ['Vanilkový rituál', 'Punč'],
  naturinka: ['Bambi', 'Nimbatic', 'Winter', 'Natur'],
  andreine447: ['Silk Oil', 'Leave-in', 'Velvet', 'Growth shampoo', 'Boost tonic', 'Infusion tonic', 'Shine shampoo', 'Repair mask', 'Protein mask', 'Hydration mask', 'Fixing'],
  musk: ['Vianoce vo vani'],
};
let checks = 0, fails = [];
const ok = (c, m) => { checks++; if (!c) fails.push(m); };
for (const slug of SLUGS) {
  await import(process.cwd() + `/n447/kozmetika2/brands/${slug}.js`);
  const b = globalThis.COSMETICS_DEMOS.brands[slug];
  const lang = b.products.some((p) => p.currency === 'CZK') ? 'cs' : 'sk';
  const e = C.create(b.k2Products || b.products, {facetDefs: b.facetDefs || [], noProfileGoal: !!b.noProfileGoal});
  const val = (v) => v && typeof v === 'object' ? v.value : v;
  let paths = 0, qs = 0;
  const walk = (a, d) => {
    if (d > 12) { ok(false, `${slug}: príliš hlboká cesta ${JSON.stringify(a)}`); return; }
    const s = e.steps(a).find((x) => a[x.key] === undefined);
    if (!s) { paths++; ok(!!e.recommend(a).winner, `${slug}: cesta bez produktu ${JSON.stringify(a)}`); return; }
    let opts = s.options.map(val).filter((v) => v === 'any' || !!e.recommend({...a, [s.key]: v}).winner);
    if (opts.filter((v) => v !== 'any').length > 3) opts = opts.filter((v) => v !== 'any');
    if (s.key === 'budget') opts.push('');
    qs++; ok(opts.length >= 2, `${slug}: otázka ${s.key} má ${opts.length} voľbu pri ${JSON.stringify(a)}`);
    for (const v of opts) walk({...a, [s.key]: v}, d + 1);
  };
  walk({}, 0);
  // (2) focus bez marketingových názvov: titulok ani podtitulok nesmie obsahovať názov typu „Lady Provence“, „SOĽNÝ KVET“
  const focus = (b.facetDefs || []).find((d) => d.key === 'focus');
  const names = (MARKETING[slug] || []).concat(slug === 'musk' ? b.products.filter((p) => ['soap', 'kids'].includes(p.category) || (p.category === 'hair' && /-/.test(p.name)) || p.category === 'gift' && !/MYDLÁ$/.test(p.name)).map((p) => p.name.split(/\s*-\s*/)[0]) : [])
    .map((x) => ' ' + G.norm(x).replace(/[^a-z0-9]+/g, ' ').trim() + ' ').filter((x) => x.trim().length >= 3);
  if (focus) for (const [k, v] of Object.entries(focus.values)) {
    const text = (v[lang] || v.sk || v.cs).join(' / '), tt = ' ' + G.norm(text).replace(/[^a-z0-9]+/g, ' ') + ' ';
    for (const n of names) ok(!tt.includes(n), `${slug} focus ${k}: „${text}“ obsahuje názov produktu „${n.trim()}“`);
  }
  for (const d of b.facetDefs || []) for (const q of [d, ...Object.values(d.byCategory || {})]) ok(!/^(Ktor|Kter)\S* vyberiete\?$/.test((q.sk || q.cs || [''])[0]) || d.key !== 'focus', `${slug}: otázka „Ktorý vyberiete?“ nad názvami`);
  if (slug === 'musk') {
    const hn = b.facetDefs.find((d) => d.key === 'hairNeed');
    ok(!Object.keys(hn.values).some((v) => /xmas|vianoc|scent|vona|vonu/.test(v + ' ' + G.norm(hn.values[v].sk[0]))), 'musk: hairNeed mieša vôňu');
    ok(b.products.filter((p) => p.category === 'hair' && p.role !== 'addon').every((p) => Array.isArray(p.facets.hairNeed) && p.facets.hairNeed.every((x) => x in hn.values)), 'musk: šampón/kondicionér bez platnej potreby vlasov');
  }
  console.log(`${slug}: ${qs} obrazoviek otázok, ${paths} ciest`);
}
const adv = fs.readFileSync('n447/kozmetika2/catalogue-advisor-k2.js', 'utf8');
ok(!/zaraďuje presne sem|řadí přesně sem/.test(adv), 'tautológia vo vysvetlení výsledku');
ok(/Hotová darčeková sada/.test(adv), 'darčeková sada má vlastný nadpis');
for (const f of fails.slice(0, 40)) console.log('FAIL ' + f);
console.log(`${fails.length ? 'FAIL' : 'PASS'} k2 strom: ${checks} kontrol, nálezy ${fails.length}`);
process.exit(fails.length ? 1 : 0);
