/* n447 – kontrola kozmetickej ukážky novej dávky: dáta katalógu, značka, chat offline a API s mockom (0 platených volaní).
   node tools/n447-cx-test.mjs --slug=saloos */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const slug = (process.argv.find((a) => a.startsWith('--slug=')) || '--slug=saloos').slice(7);
globalThis.window = globalThis; globalThis.COSMETICS_DEMOS = {brands: {}};
require(`../n447/kozmetika/catalogues/${slug}.js`);
require(`../n447/kozmetika/brands/${slug}.js`);
const cat = globalThis.CX_CATALOGUES[slug], brand = globalThis.COSMETICS_DEMOS.brands[slug];
const report = {slug, checks: {}};
const KINDS = new Set(['Krémy a balzamy', 'Krémy', 'Séra', 'Oleje', 'Masky', 'Toniká a vody', 'Mlieka a emulzie', 'Čistenie a umývanie', 'Peelingy', 'Šampóny', 'Kondicionéry', 'Dezodoranty', 'Kúpeľové výrobky', 'Parfémy']);
const TAGS = new Set(['dry', 'oily', 'sensitive', 'balanced', 'hydrate', 'calm', 'balance', 'mature', 'clean', 'daily']);
const host = new URL(brand.website).hostname.replace(/^www\./, '');
assert.ok(brand.n447, 'značka nie je označená ako n447');
assert.ok(cat.products.length >= 5, 'príliš málo produktov');
const ids = new Set();
for (const p of cat.products) {
  assert.ok(!ids.has(p.id), 'duplicitné id ' + p.id); ids.add(p.id);
  assert.ok(Number.isFinite(p.priceAmount) && p.priceAmount > 0, 'cena ' + p.name);
  assert.ok(p.price.includes(p.currency === 'CZK' ? 'Kč' : '€'), 'mena ' + p.name);
  assert.ok(new URL(p.url).hostname.replace(/^www\./, '') === host, 'cudzí odkaz ' + p.url);
  assert.ok(/^https:\/\/|^\/assets\//.test(p.photo), 'fotka ' + p.name);
  assert.ok(!p.isSample && !/vzor|sample|tester/i.test(p.volume || ''), 'vzorka ako cena ' + p.name);
  assert.ok(KINDS.has(p.kind), 'neznámy typ ' + p.kind);
  assert.ok(p.tags.length && p.tags.every((t) => TAGS.has(t) || ['cream', 'serum', 'mask', 'simple', 'basic', 'full', 'target'].includes(t)), 'tagy ' + p.name);
  assert.ok(p.source && p.source.verifiedAt && p.source.url === p.url, 'zdroj ' + p.name);
  assert.doesNotMatch(JSON.stringify(p), /undefined|NaN|lieči|léčí|vyléčí/, 'text ' + p.name);
}
const photos = cat.products.map((p) => p.photo);
report.checks.data = {products: cat.products.length, uniquePhotos: new Set(photos).size, kinds: [...new Set(cat.products.map((p) => p.kind))], categories: [...new Set(cat.products.map((p) => p.category))]};
for (const f of [`n447/kozmetika/brands/${slug}.js`, 'n447/kozmetika/cosmetics-n447.js', 'n447/owner-more-info-n447.js'])
  assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /247\s*€|'247'|mesiac zdarma|měsíc zdarma|30 dní zdarma|História konverzácií/i, 'stará ponuka v ' + f);
const page = fs.readFileSync(`${slug}.html`, 'utf8');
for (const bad of ['/advisor-boot.js', '/cosmetics.js?', '/catalogue-data.js', '/nove-znacky-config.js', '/owner-more-info.js']) assert.ok(!page.includes(bad), 'stránka načítava ' + bad);
assert.ok(page.includes(`window.N447_COSMETICS_SLUG='${slug}'`), 'pevný slug');
const {answer, draftReply} = await import('../api/cosmetics-chat-447.js');
const {aiAnswer} = await import('../api/ai-chat.js');
for (const q of ['Pomozte mi vybrat', 'Mám suchou pleť', 'Jakou máte dopravu?', 'Kolik to stojí?']) {
  const out = draftReply(slug, q, []);
  assert.ok(out && !/undefined|NaN/.test(out), 'chat ' + q);
  for (const u of out.match(/https?:\/\/[^\s)]+/g) || []) assert.equal(new URL(u).hostname.replace(/^www\./, ''), host, 'cudzí odkaz v chate ' + u);
}
let calls = 0;
const mock = (reply) => (args) => aiAnswer({...args, apiKey: 'test-not-a-key', fetchImpl: async () => { calls++; return new Response(JSON.stringify({content: [{type: 'text', text: reply}], stop_reason: 'end_turn'}), {status: 200}); }});
assert.ok((await answer({demoId: slug, messages: [{role: 'user', content: 'Kolik stojí?'}]}, {ai: mock('Stojí 1 234 567 Kč.')})).json.fallback, 'vymyslená cena prešla');
assert.equal((await answer({demoId: 'mylo', messages: [{role: 'user', content: 'x'}]})).status, 400, 'cudzia firma');
report.checks.api = {mockedProviderCalls: calls, realProviderCalls: 0};
console.log('PASS', JSON.stringify(report.checks));
