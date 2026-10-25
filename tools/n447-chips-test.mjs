/* n447 – overenie rýchlych volieb chatu (majiteľ 25. 10.: presne 4 zmysluplné). Voľby sa zbierajú z vykreslenej stránky
   (tools/n447_chips_collect.py → JSON) a každá sa pošle do API novej dávky s náhradou modelu (mock vráti overený návrh),
   takže sa neodošle žiadne platené volanie. Odpoveď musí: byť neprázdna, menovať konkrétny produkt firmy, sedieť s témou
   voľby a odkazovať iba na vlastný e-shop.  node tools/n447-chips-test.mjs --chips=FILE [--out=FILE] */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const chips = JSON.parse(fs.readFileSync(arg('chips'), 'utf8'));
const coffee = await import('../api/chat-447.js');
const cosm = await import('../api/cosmetics-chat-447.js');
let mocked = 0;
const realFetch = globalThis.fetch;
globalThis.fetch = () => { throw new Error('sieťové volanie počas testu'); };
const mock = async ({draft}) => { mocked += 1; return draft; };
const fold = (s) => String(s).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const report = {};
for (const [slug, list] of Object.entries(chips)) {
  assert.equal(list.length, 4, `${slug}: počet volieb ${list.length}`);
  assert.equal(new Set(list).size, 4, `${slug}: opakovaná voľba`);
  const isCoffee = Object.prototype.hasOwnProperty.call(coffee.DEMOS, slug);
  const data = isCoffee ? coffee.DEMOS[slug] : globalThis.CX_CATALOGUES[slug];
  const products = isCoffee ? data.products.concat(data.drip ? [data.drip] : []) : data.products;
  const cs = isCoffee ? data.lang === 'cs' : /\.cz\//.test(products[0].url);
  const hosts = new Set(products.map((p) => new URL(p.url).host));
  report[slug] = [];
  const seenReplies = new Set();
  for (const chip of list) {
    if (cs) assert.doesNotMatch(chip, /[äôľĺŕ]/, `${slug}: slovenská voľba na českej stránke „${chip}“`);
    const body = {demoId: slug, messages: [{role: 'user', content: chip}]};
    const out = isCoffee ? await coffee.answer(body, {ai: mock}) : await cosm.answer(body, {ai: mock});
    assert.equal(out.status, 200, `${slug} „${chip}“: status ${out.status}`);
    const reply = out.json.reply || '';
    assert.ok(reply.trim().length > 20, `${slug} „${chip}“: prázdna odpoveď`);
    const named = products.filter((p) => fold(reply).includes(fold(p.name)));
    assert.ok(named.length, `${slug} „${chip}“: odpoveď nemenuje produkt firmy – ${reply.slice(0, 160)}`);
    for (const u of reply.match(/https?:\/\/[^\s)<>"]+/g) || []) assert.ok(hosts.has(new URL(u).host), `${slug} „${chip}“: cudzí odkaz ${u}`);
    const c = fold(chip), r = fold(reply);
    if (/bez kofe/.test(c)) assert.ok(named.some((p) => p.decaf), `${slug}: bez kofeínu nemenuje bezkofeínovú kávu`);
    if (/automat/.test(c)) assert.ok(named.some((p) => p.kind !== 'drip' && !p.decaf), `${slug}: automat bez kávy`);
    if (/filtr|filter/.test(c)) assert.match(r, /filt|v60|aeropress|french/, `${slug}: filter bez súvisu`);
    if (/cokol/.test(c)) assert.match(r, /cokol|karamel|orech|oriech|orisk/, `${slug}: čokoládová bez chuťových tónov`);
    if (/such/.test(c)) assert.ok(named.some((p) => (p.tags || []).includes('dry') || (p.tags || []).includes('hydrate')), `${slug}: suchá pleť bez vhodného produktu`);
    if (/telo|telo|pece o telo/.test(c)) assert.ok(named.some((p) => p.category === 'body'), `${slug}: telo bez telového produktu`);
    if (/oci|ocni/.test(c)) assert.ok(named.some((p) => p.category === 'eyes'), `${slug}: oči bez produktu na oči`);
    const head = fold(reply).replace(/\s+/g, ' ').slice(0, 140);
    assert.ok(!seenReplies.has(head), `${slug} „${chip}“: rovnaká odpoveď ako iná voľba`); seenReplies.add(head);
    if (/ovocn/.test(c)) assert.match(r, /ovoc|bobul|visn|malin|citrus|jahod|tropic|cucori|boruv/, `${slug}: ovocná bez ovocných tónov`);
    if (/citliv/.test(c)) assert.ok(named.some((p) => (p.tags || []).includes('sensitive') || (p.tags || []).includes('calm')), `${slug}: citlivá pleť bez vhodného produktu`);
    if (/masti/.test(c)) assert.ok(named.some((p) => (p.tags || []).includes('oily') || (p.tags || []).includes('balance')), `${slug}: mastná pleť bez vhodného produktu`);
    if (/vrask/.test(c)) assert.ok(named.some((p) => (p.tags || []).includes('mature')), `${slug}: vrásky bez vhodného produktu`);
    report[slug].push({chip, named: named.slice(0, 3).map((p) => p.name), reply: reply.slice(0, 220)});
  }
}
globalThis.fetch = realFetch;
const total = Object.values(report).reduce((n, l) => n + l.length, 0);
if (arg('out')) fs.writeFileSync(arg('out'), JSON.stringify({checkedAt: new Date().toISOString().slice(0, 10), mockedModelCalls: mocked, paidCalls: 0, chips: report}, null, 1));
console.log(`PASS ${Object.keys(report).length} firiem × 4 voľby = ${total}, mock ${mocked}, platené 0`);
