/* s3a: kontrola významovo rovnakých odpovedí v jadre c2 (všetky cesty všetkých kávových ukážok).
   Rovnaký význam = rovnaký nadpis aj popis po odstránení diakritiky, veľkosti písmen a interpunkcie.
   node tools/s3a/same-meaning.cjs [slug…] */
const path = require('path'), ROOT = path.resolve(__dirname, '../..');
const E = require(ROOT + '/n447/c2/engine-c2.js');
const reg = require(ROOT + '/tools/s3a/registry.json').demos;
const norm = (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(reg).filter((s) => reg[s].type === 'coffee');
let total = 0;
for (const s of slugs) {
  require(ROOT + '/n447/c2/data/' + s + '.js'); const d = globalThis.N447_DATA[s];
  const found = []; let paths = 0;
  const walk = (a, seq) => { const q = E.nextQuestion(d, a); if (!q) { paths++; return; }
    const k = q.options.map((o) => norm(o.title) + '|' + norm(o.detail));
    const dup = k.filter((x, i) => k.indexOf(x) !== i);
    if (dup.length) found.push(JSON.stringify(seq) + ' @' + q.key + ': ' + dup.join(' / '));
    if (q.options.length < 2) found.push(JSON.stringify(seq) + ' @' + q.key + ': jediná možnosť');
    for (const o of q.options) walk(E.answer(a, q.key, o.value), [...seq, [q.key, o.value]]); };
  walk({}, []);
  total += found.length;
  console.log(`${s}: ${paths} ciest, významovo rovnaké / jednomožnostné otázky ${found.length}`); for (const f of found.slice(0, 5)) console.log('   ' + f);
}
process.exitCode = total ? 1 : 0;
