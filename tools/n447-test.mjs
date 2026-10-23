/* Testy novej dávky (447 € + 10 €/mes.): dáta, všetky cesty skutočného jadra n447/engine.js,
   rozpočet na overené balenie, recept iba pre V60, chat offline a API s mockom.
   Žiadne platené AI volanie: aiAnswer dostáva podvrhnutý fetch a falošný kľúč.
   Použitie: node tools/n447-test.mjs --slug=black [--out=report.json] */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {answer as apiAnswer, DEMOS} from '../api/chat-447.js';
import {aiAnswer} from '../api/ai-chat.js';

const require = createRequire(import.meta.url);
const E = require('../n447/engine.js');
const {coffeeReply} = require('../n447/reply.js');
const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const slug = arg('slug', 'black');
const data = DEMOS[slug];
assert.ok(data, 'neznámy slug ' + slug);
const host = new URL(data.brand.web).hostname;
const report = {slug, ranAt: new Date().toISOString(), paidAiCalls: 0, checks: {}};

/* 1. Dáta */
const ids = new Set();
let verifiedVariants = 0, productsWithVerified = 0;
for (const p of data.products) {
  assert.ok(!ids.has(p.id), 'duplicitné id ' + p.id); ids.add(p.id);
  assert.equal(new URL(p.url).hostname, host, 'cudzí odkaz ' + p.url);
  assert.ok(fs.existsSync(new URL('..' + p.photo, import.meta.url)), 'chýba fotka ' + p.photo);
  assert.ok(Number.isFinite(p.priceFrom) && p.priceFrom > 0 && p.priceTo >= p.priceFrom, 'cena ' + p.id);
  assert.ok(((p.roasts && p.roasts.length) || (p.preps && p.preps.length)) && p.weights.length && p.origin && p.summary, 'neúplné dáta ' + p.id);
  assert.ok(p.notes.length || p.profile, 'chuť ' + p.id);
  const v = (p.variants || []).filter((x) => x.verifiedAt);
  for (const x of v) { assert.ok((!x.roast || p.roasts.includes(x.roast)) && p.weights.includes(x.grams) && Number.isFinite(x.price) && x.source, 'variant ' + p.id); if (x.url) assert.equal(new URL(x.url).hostname, host, 'cudzí odkaz balenia'); }
  verifiedVariants += v.length; if (v.length) productsWithVerified++;
}
assert.equal(new Set(data.products.map((p) => p.photo)).size, data.products.length, 'opakovaná fotka produktu');
report.checks.data = {products: data.products.length, drip: !!data.drip, verifiedVariants, productsWithVerified, productsWithoutVerifiedPrice: data.products.length - productsWithVerified};

/* 2. Všetky cesty cez skutočné jadro */
const paths = E.allPaths(data);
let maxQ = 0, budgetPaths = 0, verifiedResults = 0, followUps = 0;
for (const p of paths) {
  const r = p.result, a = p.answers;
  assert.ok(r && r.product, 'prázdny výsledok ' + JSON.stringify(a));
  maxQ = Math.max(maxQ, p.trail.length);
  for (const s of p.trail) {
    const o = s.question.options;
    assert.ok(o.length >= 2 && o.length <= 5, 'počet možností ' + s.key + ' ' + o.length);
    assert.equal(new Set(o.map((x) => x.value)).size, o.length);
    const photos = o.map((x) => x.photo).filter(Boolean);
    assert.equal(new Set(photos).size, photos.length, 'rovnaká fotka v otázke ' + s.key);
    if (s.key === 'pick' || s.key === 'detailProcess') followUps++;
  }
  if (r.kind === 'coffee') {
    assert.ok(E.pool(data, a).some((x) => x.id === r.product.id), 'výsledok nespĺňa odpovede');
    assert.equal(!!r.product.decaf, a.taste === 'decaf');
    if (r.priceVerified) {
      verifiedResults++;
      assert.ok(r.pack.verifiedAt && r.product.variants.includes(r.pack) && (!r.pack.roast || r.pack.roast === r.roast), 'overené balenie');
    } else assert.match(r.priceLabel, /^od /, 'neoverená cena musí byť iba orientačná');
    if (a.budget && a.budget !== 'any') {
      budgetPaths++;
      assert.ok(r.priceVerified && r.total <= Number(a.budget) + 1e-9, 'rozpočet nad limit alebo bez overeného balenia');
      assert.ok(Math.abs(r.total - (r.pack.price + (r.addon ? r.addon.price : 0))) < 1e-9, 'súčet zostavy');
      for (const x of r.packs) if (!x.chosen) assert.ok(x.over || Number(x.price.replace(/[^\d,]/g, '').replace(',', '.')) <= Number(a.budget), 'balenie nad limit bez označenia');
    }
    if (r.alternative) {
      assert.notEqual(r.alternative.product.id, r.product.id);
      if (a.budget && a.budget !== 'any') assert.ok(E.packFor(data, r.alternative.product, a), 'alternatíva mimo rozpočtu');
    }
    const steps = r.next.items.join(' ') + ' ' + r.next.title + ' ' + (r.next.link ? r.next.link.label : '');
    assert.ok(r.next.items.length, 'čo ďalej');
    if (a.prep === 'filter') {
      assert.ok(a.tool, 'filter bez otázky na pomôcku');
      if (a.tool === 'v60' && data.guides && data.guides.v60) assert.match(steps, /V60/); else if (a.tool !== 'v60') assert.doesNotMatch(steps, /V60|95 °C/, 'recept V60 pri ' + a.tool);
      if (!(data.guides && data.guides.v60)) assert.doesNotMatch(steps, /95 °C|300 g vody/, 'recept bez zdroja');
    } else assert.doesNotMatch(steps, /V60/);
    assert.ok(r.reasons.length >= 2 && r.reasons.every(([t, d]) => t && d && !/undefined|NaN|null/.test(t + d)), 'dôvody');
    assert.doesNotMatch(JSON.stringify(r.reasons) + r.packLabel + steps, /fallback|skóre|katalóg|informácie z e-shopu/i, 'žargón');
  }
}
/* Zmena skoršej odpovede ruší neskoršie */
assert.deepEqual(E.answer({prep: 'espresso', taste: 'choco', pick: 'doce-citrus'}, 'prep', 'filter'), {prep: 'filter'});
assert.equal(E.maxRemaining(data, {}), maxQ);
assert.ok(maxQ <= 6, 'priveľa krokov ' + maxQ);
report.checks.paths = {total: paths.length, maxQuestions: maxQ, followUpSteps: followUps, budgetPaths, verifiedPriceResults: verifiedResults};

/* 3. Regresia z kontroly a hranice cien (rovnaké jadro, syntetické kópie dát) */
{
  const ref = {...(data.products.find((p) => p.id === 'doce-citrus') || data.products.find((p) => (p.preps || []).includes('espresso')))};
  if (slug === 'black') {
    const solo = {...data, products: [ref, {...data.products.find((p) => p.id === 'black-sheep'), variants: [{roast: 'espresso', grams: 200, grind: 'Zrnková', price: 11.9, verifiedAt: 'test', source: 'test'}]}]};
    const q = E.nextQuestion(solo, {prep: 'espresso', taste: 'choco'});
    assert.equal(q.key, 'budget', 'rozpočet sa má zobraziť, keď sú overené všetky kávy výberu');
    const r = E.result(solo, {prep: 'espresso', taste: 'choco', budget: '10.5'});
    assert.equal(r.product.id, 'doce-citrus'); assert.equal(r.pack.grams, 200); assert.equal(r.total, 10.5);
    assert.deepEqual(r.packs.map((x) => [x.label, x.chosen, x.over]), [['200 g', true, false], ['500 g', false, true], ['1 kg', false, true]]);
    assert.ok(!r.packLabel.includes('500') && !r.packLabel.includes('1 kg'), 'v rozpočte 10,50 € sa nesmie ponúknuť 500 g/1 kg');
    assert.equal(E.nextQuestion(data, {prep: 'espresso', taste: 'choco'}).key, 'pick', 'bez overených cien všetkých káv sa rozpočet nepýta');
  }
  const roast = ref.roasts ? ref.roasts[0] : undefined, a = (b) => ({prep: 'espresso', budget: String(b)});
  const only = {...ref, id: 'syn', variants: [{roast, grams: 500, grind: 'Zrnková', price: 22.5, verifiedAt: 'x'}]};
  const syn = {...data, products: [only]};
  assert.ok(E.packFor(syn, only, a(22.5)), 'cena rovná limitu prejde');
  assert.equal(E.packFor(syn, only, a(22.49)), null, 'tesne pod cenou neprejde');
  const unv = {...ref, id: 'unv', priceFrom: 1, variants: [{roast, grams: 200, grind: 'Zrnková', price: 1}]};
  assert.equal(E.packFor({...data, products: [unv]}, unv, a(100)), null, 'neoverený variant nesmie splniť limit');
  const from = {...ref, id: 'from', priceFrom: 1, variants: []};
  assert.equal(E.pool({...data, products: [from]}, a(5)).length, 0, '„od“ nesmie splniť limit');
  const add = {...ref, id: 'add', variants: [{roast, grams: 200, grind: 'Zrnková', price: 10.5, verifiedAt: 'x'}]};
  const withAddon = {...data, products: [add], addonFor: () => ({product: {name: 'doplnok', url: data.brand.web}, price: 5})};
  const r155 = E.result(withAddon, {...a(15.5), pick: 'add'}), r1549 = E.result(withAddon, {...a(15.49), pick: 'add'});
  assert.ok(r155.addon && r155.total === 15.5, 'káva + doplnok rovno limitu: doplnok ostáva');
  assert.ok(!r1549.addon && r1549.total === 10.5, 'káva + doplnok nad limit: doplnok sa vynechá, káva ostáva');
  assert.equal(E.result(withAddon, {...a(10.49), pick: 'add'}), null, 'samotná káva nad limit');
  if (ref.roasts) { const wrong = {...ref, id: 'wr', variants: [{roast: 'filter', grams: 200, grind: 'Zrnková', price: 1, verifiedAt: 'x'}]};
  assert.equal(E.verifiedPacks(wrong, a(100)).length, 0, 'cena iného praženia'); }
  if (slug === 'verticcio') {
    /* Regresia Verticcio: limit 9,90 € pri čokoládovej chuti – iba balenia do 9,90 €, 1 kg nikdy. */
    const r = E.result(data, {prep: 'espresso', taste: 'choco', budget: '9.9', detailProcess: 'region:blend', pick: 'korzo-blend'});
    assert.equal(r.pack.grams, 200); assert.equal(r.total, 9.9); assert.ok(r.packs.find((x) => x.label === '1 kg').over);
    assert.equal(r.pack.url, 'https://www.verticcio.sk/kava-verticcio/verticcio-korzo-blend-200g', 'CTA na konkrétne balenie');
    assert.ok(!E.pool(data, {prep: 'espresso', taste: 'choco', budget: '9.89'}).some((p) => p.id === 'korzo-blend'), 'korzo 9,90 € nad limit 9,89 €');
  }
  report.checks.budgetRegression = 'PASS (doce citrus 200 g 10,50 € / 500 g 22,50 € / 1 kg 39,00 €; hranica rovná/pod; neoverené; „od“; doplnok; iné praženie)';
}

/* 4. Chat offline */
const chat = [['Čo do automatu?', /espresso|automat/i], ['Káva na V60', /V60|filt/i], ['Máte kávu bez kofeínu?', /decaf|kofe/i],
  ['Aká je doprava?', /40 €|doprav|poštovn/i], ['Povedz mi o gotiti', /gotiti/i], ['porovnaj black sheep a doce citrus', /black sheep[\s\S]*doce citrus/i],
  ['niečo na cesty', /drippin/], ['máte kapsule?', /kapsul/i], ['ahoj', /black\./]];
for (const [q, re] of (slug === 'black' ? chat : chat.slice(0, 4))) {
  const out = coffeeReply(data, q, []);
  assert.match(out, re, 'chat: ' + q);
  for (const u of out.match(/https?:\/\/[^\s]+/g) || []) assert.equal(new URL(u).hostname, host, 'cudzí odkaz ' + u);
  assert.doesNotMatch(out, /undefined|NaN|null/);
}
for (const p of data.products) {
  const txt = coffeeReply(data, 'koľko stojí ' + p.name.split('•').pop().trim(), []);
  const v = (p.variants || []).filter((x) => x.verifiedAt);
  if (v.length) for (const x of v) assert.ok(txt.includes(E.money(x.price, p.currency).replace(/\u00a0/g, ' ')), 'chat bez overenej ceny ' + p.id);
  else assert.match(txt, /orientačn|orientační/, 'chat neoznačil orientačnú cenu ' + p.id);
}
if (slug === 'black') assert.match(coffeeReply(data, 'a koľko stojí?', [{role: 'user', content: 'gotiti?'}, {role: 'assistant', content: coffeeReply(data, 'gotiti', [])}]), /gotiti/i, 'kontext');
report.checks.chatOffline = 'PASS';

/* 5. API s mockom */
let calls = 0;
const mock = (reply, status = 200) => (args) => aiAnswer({...args, apiKey: 'test-not-a-key', fetchImpl: async (url, init) => {
  calls++; assert.equal(url, 'https://api.anthropic.com/v1/messages'); assert.ok(JSON.parse(init.body).model);
  return new Response(status === 200 ? JSON.stringify({content: [{type: 'text', text: reply}], stop_reason: 'end_turn'}) : 'err', {status});
}});
const msgs = [{role: 'user', content: 'Čo do automatu?'}];
const p0 = data.products[0];
const good = await apiAnswer({demoId: slug, messages: msgs}, {ai: mock(`Skúste ${p0.name}.\n${p0.url}`)});
assert.ok(!good.json.fallback, 'správna odpoveď prejde');
assert.ok((await apiAnswer({demoId: slug, messages: msgs}, {ai: mock(p0.name + ' stojí 7,90 €.')})).json.fallback, 'vymyslená cena');
assert.ok((await apiAnswer({demoId: slug, messages: msgs}, {ai: mock('Pozrite https://www.inyobchod.sk/kava')})).json.fallback, 'cudzí odkaz');
const err = await apiAnswer({demoId: slug, messages: msgs}, {ai: mock('', 529)});
assert.ok(err.json.fallback && err.json.reply.length > 20, 'chyba poskytovateľa');
assert.equal((await apiAnswer({demoId: 'grain', messages: msgs})).status, 400, 'stará/cudzia firma');
assert.equal((await apiAnswer({demoId: '__proto__', messages: msgs})).status, 400);
assert.ok((await apiAnswer({demoId: slug, messages: msgs}, {ai: (x) => aiAnswer({...x, apiKey: ''})})).json.fallback, 'bez kľúča bez volania');
report.checks.apiMock = {mockedProviderCalls: calls, realProviderCalls: 0};

const out = arg('out', '');
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log('PASS', JSON.stringify(report.checks));
