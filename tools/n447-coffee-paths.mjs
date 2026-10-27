/* n447 – úplný audit kávových ciest: zbytočné otázky (dve odpovede s rovnakou množinou celých výsledkov: káva, balenie,
   cena, ďalší postup), produktové fotky v otázkach, rovnaká fotka v jednom kroku.  node tools/n447-coffee-paths.mjs --slug=verticcio [--json=FILE] */
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const slug = arg('slug'), E = require('../n447/engine.js'), d = require(`../n447/data/${slug}.js`);
const sig = (r) => r ? JSON.stringify([r.product && r.product.id, r.pack && r.pack.grams, r.pack && r.pack.price, r.next && r.next.items, r.packLabel, (r.reasons || []).map((x) => x[0])]) : 'none';
const memo = new Map();
const reach = (a) => { const k = JSON.stringify(a); if (memo.has(k)) return memo.get(k); const q = E.nextQuestion(d, a);
  const out = q ? [...new Set(q.options.flatMap((o) => reach(E.answer(a, q.key, o.value))))] : [sig(E.result(d, a))]; memo.set(k, out); return out; };
const seen = new Set(), useless = [], productPhotos = [], dupPhotos = [];
let questions = 0;
(function walk(a) { const q = E.nextQuestion(d, a); if (!q) return; const k = JSON.stringify(a); if (seen.has(k)) return; seen.add(k); questions++;
  const sets = q.options.map((o) => reach(E.answer(a, q.key, o.value)).sort().join('|'));
  if (new Set(sets).size < sets.length && !/^pick/.test(q.key)) useless.push({answers: a, key: q.key, options: q.options.map((o) => o.title)});
  const ph = q.options.map((o) => o.photo); if (new Set(ph).size < ph.length) dupPhotos.push({answers: a, key: q.key});
  for (const o of q.options) if (!o.photo || !/^\/assets\/(scenes|n447)\//.test(o.photo)) productPhotos.push({key: q.key, option: o.title, photo: o.photo});
  for (const o of q.options) walk(E.answer(a, q.key, o.value)); })({});
const paths = E.allPaths(d);
const out = {slug, questions, paths: paths.length, avgSteps: +(paths.reduce((n, p) => n + p.trail.length, 0) / paths.length).toFixed(2), uselessQuestions: useless, productPhotosInQuestions: productPhotos, duplicatePhotosInStep: dupPhotos};
if (arg('json')) fs.writeFileSync(arg('json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify({slug, questions, paths: paths.length, useless: useless.length, productPhotos: productPhotos.length, dupPhotos: dupPhotos.length}));
process.exitCode = useless.length || productPhotos.length || dupPhotos.length ? 1 : 0;
