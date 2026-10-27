/* n447 – úplný graf otázok kozmetiky presne ako v rozhraní (catalogue-advisor.js): kroky z jadra, filter „viable“,
   pri rozpočte navyše voľba „Bez limitu“ (''). Pri každej otázke porovná MNOŽINY KONEČNÝCH hlavných produktov pod
   jednotlivými odpoveďami. Nadbytočné = dve odpovede s rovnakou množinou alebo otázka s jedinou rôznou možnosťou.
   node tools/n447-cx-paths.mjs --slug=saloos [--core=n447/kozmetika/advisor-core-n447.js] [--json=FILE] */
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const slug = arg('slug');
globalThis.window = globalThis;
require('../' + (arg('core') || 'n447/kozmetika/advisor-core-n447.js'));
require(`../n447/kozmetika/catalogues/${slug}.js`);
const engine = globalThis.CXAdvisorCore.create(globalThis.CX_CATALOGUES[slug].products);
const viable = (a, s) => (s.options || []).filter((v) => { const value = v && typeof v === 'object' ? v.value : v; return value === 'any' || !!engine.recommend({...a, [s.key]: value}).winner; });
function next(a) {
  const steps = engine.steps(a).map((s) => ({...s, options: viable(a, s)}));
  const s = steps.find((x) => a[x.key] === undefined);
  if (!s) return null;
  const values = s.options.map((v) => v && typeof v === 'object' ? v.value : v).map(String);
  if (s.key === 'budget') values.push('');
  return {key: s.key, values};
}
const memo = new Map();
let states = 0, ends = 0;
const redundant = [];
function finals(a) {
  const k = JSON.stringify(a);
  if (memo.has(k)) return memo.get(k);
  const q = next(a);
  let out;
  if (!q) { ends++; const w = engine.recommend(a).winner; out = new Set([w ? w.id : 'none']); }
  else {
    states++;
    const per = q.values.map((v) => [v, finals({...a, [q.key]: v})]);
    const sig = per.map(([v, set]) => [v, [...set].sort().join(',')]);
    const groups = new Map();
    for (const [v, sg] of sig) groups.set(sg, [...(groups.get(sg) || []), v]);
    for (const vs of groups.values()) if (vs.length > 1) redundant.push({answers: a, key: q.key, values: vs, finals: [...per.find(([v]) => v === vs[0])[1]]});
    if (q.values.length < 2) redundant.push({answers: a, key: q.key, values: q.values, single: true});
    out = new Set(per.flatMap(([, set]) => [...set]));
  }
  memo.set(k, out);
  return out;
}
finals({});
const report = {slug, states, ends, redundantPairs: redundant.length, examples: redundant.slice(0, 12)};
if (arg('json')) fs.writeFileSync(arg('json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify({slug, states, ends, redundant: redundant.length}));
for (const r of redundant.slice(0, Number(arg('show') || 5))) console.log('  ', JSON.stringify(r).slice(0, 260));
process.exitCode = redundant.length ? 1 : 0;
