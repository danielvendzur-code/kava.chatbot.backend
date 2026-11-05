/* c2 – testy BLACK a Nordbeans (izolované jadro n447/c2/engine-c2.js, dáta n447/c2/data, chat api/chat-447c2.js).
   Bez siete a bez plateného modelu (AI vrstva = mock, ktorý vráti overený návrh).  node tools/c2/test-c2.mjs
   Kontroluje: (1) každá otázka má ≥ 2 voľby a nie všetky vedú k tomu istému výsledku; (2) voľby nikdy neukazujú názov produktu;
   (3) každá káva je dosiahnuteľná; (4) rozpočet: súčet zostavy (balenie + doplnok) ≤ limit, hranica = cena balenia je „v rozpočte“,
   každá káva s balením v limite ostane dosiahnuteľná, hotový set iba v rozpočte; (5) ceny presne podľa primárnych údajov
   (akcia black sheep 500 g za 10 €, Diego 1 kg vyradené, BOLD DEER iba 1000 g, Cocondo/Honduras/Jizerky, set 1150 Kč);
   (6) CTA = presná URL varianty (Nordbeans s #id); (7) bez receptu BOLD DEER; (8) chuť oddelená od kofeínu;
   (9) fotky volieb sú scény/tóny, nie vrecúška; (10) 4 rýchle voľby chatu menujú vlastnú kávu (mock, 0 platených). */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const E = require('../../n447/c2/engine-c2.js');
const DATA = {black: require('../../n447/c2/data/black.js'), nordbeans: require('../../n447/c2/data/nordbeans.js')};
const RAW = {black: JSON.parse(fs.readFileSync(process.argv[2] || '/dev/null', 'utf8') || 'null')};
const fold = (s) => String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
let checks = 0;
const ok = (c, m) => { checks++; assert.ok(c, m); };

for (const [slug, D] of Object.entries(DATA)) {
  const coffees = D.products.filter((p) => p.available !== false);
  /* názvy produktov; názov, ktorý je zároveň krajinou pôvodu (Brazílie, Uganda, Honduras), sa ako pôvod ukázať smie */
  const origins = coffees.map((p) => fold(p.origin)).join(' | ');
  const names = coffees.map((p) => fold(p.name)).concat((D.sets || []).map((s) => fold(s.name))).filter((n) => !origins.includes(n));
  const sig = (r) => r ? JSON.stringify([r.product.id, r.pack && (r.pack.grams || r.pack.label), r.pack && r.pack.price, r.option && r.option.id]) : 'null';
  const reach = (a) => { const q = E.nextQuestion(D, a); return q ? [...new Set(q.options.flatMap((o) => reach(E.answer(a, q.key, o.value))))] : [sig(E.result(D, a))]; };
  /* Prechod stromom otázok. */
  const walk = (a, depth) => {
    const q = E.nextQuestion(D, a);
    if (!q) return;
    ok(q.options.length >= 2, `${slug} ${JSON.stringify(a)}: otázka ${q.key} má < 2 voľby`);
    const outs = q.options.map((o) => reach(E.answer(a, q.key, o.value)).sort().join('|'));
    ok(new Set(outs).size > 1, `${slug} ${JSON.stringify(a)}: všetky voľby otázky ${q.key} vedú k tomu istému`);
    for (const o of q.options) {
      for (const n of names) ok(!fold(o.title + ' ' + o.detail).includes(n), `${slug} ${q.key}: voľba ukazuje názov produktu „${o.title} / ${o.detail}“`);
      ok(o.photo && !/\/assets\/(black|nordbeans)\/|nordbeans\.cz|black\.sk/.test(o.photo), `${slug} ${q.key}: voľba bez scény alebo s produktovou fotkou ${o.photo}`);
      if (q.key === 'taste') ok(o.value !== 'decaf' && !/kofe/i.test(o.title + o.detail), `${slug}: chuť zmiešaná s kofeínom`);
      walk(E.answer(a, q.key, o.value), depth + 1);
    }
  };
  walk({}, 0);
  const paths = E.allPaths(D);
  const reached = new Set(paths.map((p) => p.result && p.result.product.id));
  for (const p of coffees) ok(reached.has(p.id), `${slug}: káva ${p.name} nie je dosiahnuteľná`);
  if (D.drip) ok(reached.has(D.drip.id), `${slug}: drip nie je dosiahnuteľný`);
  for (const p of paths) {
    const r = p.result, a = p.answers;
    ok(r, `${slug} ${JSON.stringify(a)}: bez výsledku`);
    if (r.kind !== 'coffee') continue;
    ok(r.pack && r.priceVerified, `${slug} ${r.product.name}: výsledok bez overeného balenia`);
    const limit = a.budget && a.budget !== 'any' ? Number(a.budget) : null;
    if (limit !== null) {
      ok(r.total <= limit + 1e-9, `${slug} ${r.product.name}: zostava ${r.total} nad limit ${limit}`);
      if (r.set) ok(r.set.price <= limit, `${slug}: set nad rozpočet`);
      /* hranica: každá káva z rovnakých odpovedí, ktorej najlacnejšie balenie je ≤ limit, musí ostať ponúknutá */
      const base = {prep: a.prep, tool: a.tool, caffeine: a.caffeine, taste: a.taste};
      for (const c of E.pool(D, base)) { const v = E.verifiedPacks(c, base)[0]; if (v && v.price <= limit) ok(E.pool(D, {...base, budget: a.budget}).some((x) => x.id === c.id), `${slug}: ${c.name} ${v.price} vypadla z limitu ${limit}`); }
    }
    if (r.addon) ok(r.total === r.pack.price + r.addon.price, `${slug}: súčet zostavy nesedí`);
    const url = (r.pack && r.pack.url) || r.product.url;
    ok(/^https:\/\/www\.(black\.sk|nordbeans\.cz)\//.test(url), `${slug}: CTA mimo e-shopu ${url}`);
    if (slug === 'nordbeans') ok(/#\d+$/.test(r.pack.url) || r.product.variants.length === 1, `${slug} ${r.product.name}: CTA bez presnej varianty ${r.pack.url}`);
    if (r.set) ok(r.set.product.contains.includes(r.product.id) && (r.set.product.preps || []).includes(a.prep), `${slug}: set nesedí k odporúčaniu`);
    for (const x of r.next.items) ok(!/18 g.*40 ml|1:2,7/.test(x), `${slug}: prevzatý nekonzistentný recept BOLD DEER`);
  }
  /* Hranice rozpočtu: limit presne na cene balenia ho zahrnie, o cent menej nie. */
  for (const p of coffees) for (const v of E.verifiedPacks(p, {prep: (p.roasts || []).includes('filter') || (p.preps || []).includes('filter') ? 'filter' : 'espresso'})) {
    const prep = (p.roasts || []).includes('filter') || (p.preps || []).includes('filter') ? 'filter' : 'espresso';
    const smallest = E.verifiedPacks(p, {prep})[0];
    if (v !== smallest) continue;
    ok(E.packFor(D, p, {prep, budget: String(v.price)}) === v, `${slug} ${p.name}: limit = cena ${v.price} balenie nezahrnie`);
    ok(E.packFor(D, p, {prep, budget: String(v.price - 0.01)}) === null, `${slug} ${p.name}: limit pod cenou balenie zahrnie`);
  }
}

/* Presné údaje z primárneho zberu. */
const B = DATA.black, N = DATA.nordbeans;
const bp = (id) => B.products.find((p) => p.id === id);
const sheep = E.result(B, {prep: 'espresso', caffeine: 'yes', taste: 'choco', pick: 'black-sheep'});
ok(sheep.pack.grams === 500 && sheep.pack.price === 10 && /22,50/.test(sheep.promoNote), 'black sheep: akcia 500 g za 10 € (bežne 22,50 €)');
ok(!E.verifiedPacks(bp('black-sheep'), {prep: 'espresso'}).some((v) => v.grams === 200), 'black sheep: 200 g za rovnakú cenu sa neodporúča');
ok(!bp('diego-bermudez').variants.some((v) => v.grams === 1000), 'diego bermudez 1 kg je neobjednateľné');
ok(B.products.reduce((n, p) => n + p.variants.length, 0) + 1 === 76, 'BLACK: 75 kombinácií kávy + 1 drip = 76 objednateľných');
ok(B.drip.options.length === 1 && B.drip.price === 12, 'drippin.: iba objednateľná juicy pussy, 12 €');
ok(B.products.every((p) => p.variants.every((v) => v.grind === 'Zrnková')), 'BLACK: ceny iba pre mletie Zrnková');
const np = (id) => N.products.find((p) => p.id === id);
ok(np('bold-deer').variants.length === 1 && np('bold-deer').variants[0].grams === 1000 && !np('bold-deer').recipes, 'BOLD DEER: iba 1000 g, bez receptu');
ok(np('cocondo-natural').variants.map((v) => v.price).join() === '400,1460', 'Cocondo 400 / 1460 Kč');
ok(np('honduras').variants.map((v) => v.price).join() === '351,1201', 'Honduras 351 / 1201 Kč');
ok(np('jizerky').variants[0].price === 299 && np('jizerky').variants[0].grams === 250, 'Jizerky 250 g 299 Kč');
ok(np('vara-blanca-honey').variants.length === 1, 'Vara Blanca iba 250 g');
ok(N.sets[0].price === 1150 && N.sets[0].containsNames.length === 4, 'Výběr baristy 4 × 250 g za 1150 Kč');
ok(N.products.reduce((n, p) => n + p.variants.length, 0) + N.sets.length === 40, 'Nordbeans: 40 overených variantov');
ok(N.products.every((p) => p.variants.every((v) => /Skladem/.test(v.stock))), 'Nordbeans: všetky varianty so „Skladem“');
ok(/Talabot/.test(N.commercialNote), 'Nordbeans: netvrdíme, že nemajú sprievodcu ani chatbota');

/* Chat: 4 rýchle voľby, odpoveď menuje vlastnú kávu, mock bez platených volaní. */
globalThis.fetch = () => { throw new Error('sieť počas testu'); };
globalThis.window = globalThis;
const chat = await import('../../api/chat-447c2.js');
let mocked = 0;
const CHIPS = {black: DATA.black.chips, nordbeans: DATA.nordbeans.chips};
for (const [slug, list] of Object.entries(CHIPS)) {
  const D = DATA[slug], prods = D.products.concat(D.drip ? [D.drip] : [], D.sets || []);
  for (const chip of list) {
    const out = await chat.answer({demoId: slug, messages: [{role: 'user', content: chip}]}, {ai: async ({draft}) => { mocked++; return draft; }});
    const named = prods.filter((p) => fold(out.json.reply).includes(fold(p.name)));
    ok(out.status === 200 && named.length, `${slug} „${chip}“: odpoveď nemenuje kávu – ${String(out.json.reply).slice(0, 140)}`);
    ok(list.length === 4, `${slug}: rýchle voľby ${list.length}`);
    if (/drip/.test(fold(chip))) ok(named.some((p) => p.kind === 'drip'), `${slug}: drip bez drip vrecúšok`);
    if (/set/.test(fold(chip))) ok(named.some((p) => p.kind === 'set'), `${slug}: set bez setu`);
    if (/kofe/.test(fold(chip))) ok(named.some((p) => p.decaf), `${slug}: bez kofeínu nemenuje decaf`);
    console.log(`  chat ${slug} „${chip}“ → ${named.slice(0, 3).map((p) => p.name).join(' ; ')}`);
  }
}
ok((await chat.answer({demoId: 'verticcio', messages: [{role: 'user', content: 'x'}]})).status === 400, 'c2 chat nepozná iné firmy');
console.log(`PASS c2: ${checks} kontrol · cesty BLACK ${E.allPaths(B).length}, Nordbeans ${E.allPaths(N).length} · AI mock ${mocked}, platené 0`);
