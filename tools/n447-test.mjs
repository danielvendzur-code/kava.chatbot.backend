/* Testy novej dávky (447 € + 10 €/mes.): dáta, všetky cesty skutočného jadra, chat offline + mock API.
   Žiadne platené AI volanie: aiAnswer dostáva podvrhnutý fetch a falošný kľúč.
   Použitie: node tools/n447-test.mjs --slug=black [--out=report.json] */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {allPaths, nextQuestion, answer, maxRemaining, pool} from '../n447/coffee-engine.mjs';
import {coffeeReply} from '../n447/coffee-reply.mjs';
import {answer as apiAnswer, DEMOS} from '../api/chat-447.js';
import {aiAnswer} from '../api/ai-chat.js';

const arg = (k, d) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1] || d;
const slug = arg('slug', 'black');
const data = DEMOS[slug];
assert.ok(data, 'unknown slug ' + slug);
const report = {slug, ranAt: new Date().toISOString(), paidAiCalls: 0, checks: {}};
const host = new URL(data.brand.web).hostname;

/* 1. Dáta */
const ids = new Set();
for (const p of data.products) {
  assert.ok(!ids.has(p.id), 'duplicitné id ' + p.id); ids.add(p.id);
  assert.equal(new URL(p.url).hostname, host, 'cudzí odkaz ' + p.url);
  assert.equal(new URL(p.photo).hostname, host, 'fotka mimo e-shopu ' + p.photo);
  assert.ok(Number.isFinite(p.priceFrom) && p.priceFrom > 0 && p.priceTo >= p.priceFrom, 'cena ' + p.id);
  assert.ok(['EUR', 'CZK'].includes(p.currency));
  assert.ok(p.roasts?.length && p.weights?.length && p.origin && p.summary, 'neúplné dáta ' + p.id);
  assert.ok(p.notes.length || p.profile, 'chuť ' + p.id);
}
const photos = data.products.map((p) => p.photo);
assert.equal(new Set(photos).size, photos.length, 'opakovaná fotka produktu');
report.checks.data = {products: data.products.length, drip: !!data.drip, excluded: data.excluded.length};

/* 2. Všetky cesty cez skutočné jadro */
const paths = allPaths(data);
let maxQ = 0, followUps = 0, budgetChecks = 0;
for (const p of paths) {
  const r = p.result;
  assert.ok(r && r.product, 'prázdny výsledok: ' + JSON.stringify(p.answers));
  maxQ = Math.max(maxQ, p.trail.length);
  for (const s of p.trail) {
    assert.ok(s.options >= 2, 'otázka s jedinou možnosťou: ' + s.key);
    const vals = s.question.options.map((o) => o.value);
    assert.equal(new Set(vals).size, vals.length);
    const photosQ = s.question.options.map((o) => o.photo).filter(Boolean);
    assert.equal(new Set(photosQ).size, photosQ.length, 'rovnaká fotka v otázke ' + s.key);
    if (s.key === 'pick') followUps++;
  }
  if (r.kind === 'coffee') {
    const a = p.answers;
    assert.ok(pool(data, a).some((x) => x.id === r.product.id), 'výsledok nespĺňa odpovede');
    if (a.budget && a.budget !== 'any') { budgetChecks++; assert.ok(r.product.priceFrom <= Number(a.budget), 'nad rozpočet'); }
    if (a.caffeine === 'no') assert.ok(r.product.decaf); else assert.ok(!r.product.decaf);
    assert.ok(r.reasons.length >= 2 && r.reasons.every(([t, d]) => t && d && !/undefined|NaN|null/.test(t + d)), 'dôvody');
    assert.ok(r.order.every(([, v]) => v && !/undefined/.test(v)), 'objednávka');
    assert.ok(r.next.items.length, 'čo ďalej');
    if (r.alternative) { assert.notEqual(r.alternative.product.id, r.product.id); assert.ok(r.alternative.diff.length || r.alternative.note, 'alternatíva bez rozdielu'); }
    const text = JSON.stringify(r);
    assert.ok(!/fallback|skóre|katalóg|informácie z e-shopu/i.test(text), 'technický žargón vo výsledku');
  }
}
/* Zmena skoršej odpovede ruší neskoršie */
const a1 = answer(answer(answer({}, 'prep', 'espresso'), 'caffeine', 'yes'), 'taste', 'choco');
assert.deepEqual(answer(a1, 'prep', 'filter'), {prep: 'filter'});
assert.equal(maxRemaining(data, {}), maxQ);
assert.ok(maxQ <= 6);
report.checks.paths = {total: paths.length, maxQuestions: maxQ, followUpPaths: followUps, budgetLimitedPaths: budgetChecks};

/* 3. Chat offline */
const chat = [
  ['Čo do automatu?', /espresso|automat/i], ['Káva na V60', /V60|filter/i], ['Máte kávu bez kofeínu?', /decaf|kofeín/i],
  ['Aká je doprava?', /40 €/], ['Povedz mi o gotiti', /gotiti/i], ['porovnaj black sheep a doce citrus', /black sheep[\s\S]*doce citrus/i],
  ['nieco na cesty do prace', /drippin/], ['máte kapsule?', /kapsul/i], ['ahoj', /black\./]
];
for (const [q, re] of chat) {
  const out = coffeeReply(data, q, []);
  assert.match(out, re, 'chat: ' + q);
  for (const u of out.match(/https?:\/\/[^\s]+/g) || []) assert.equal(new URL(u).hostname, host, 'cudzí odkaz v chate ' + u);
  assert.ok(!/undefined|NaN|null/.test(out));
}
const follow = coffeeReply(data, 'a koľko stojí?', [{role: 'user', content: 'gotiti?'}, {role: 'assistant', content: coffeeReply(data, 'gotiti', [])}]);
assert.match(follow, /gotiti/i, 'kontext doplňujúcej otázky');
report.checks.chatOffline = {questions: chat.length + 1, passed: true};

/* 4. API s mockom – odpoveď, vymyslená cena/odkaz, chyba poskytovateľa */
let calls = 0;
const mockAi = (reply, status = 200) => (args) => aiAnswer({...args, apiKey: 'test-not-a-key', fetchImpl: async (url, init) => {
  calls++; assert.equal(url, 'https://api.anthropic.com/v1/messages');
  const body = JSON.parse(init.body); assert.ok(body.model, 'model sa posiela');
  return new Response(status === 200 ? JSON.stringify({content: [{type: 'text', text: reply}], stop_reason: 'end_turn'}) : 'err', {status});
}});
const msgs = [{role: 'user', content: 'Čo do automatu?'}];
const good = await apiAnswer({demoId: slug, messages: msgs}, {ai: mockAi('Do automatu skúste brazil • doce citrus — od 10,50 €\nhttps://www.black.sk/sk/brazil-doce-citrus')});
assert.ok(good.json.reply.includes('doce citrus') && !good.json.fallback, 'správna odpoveď AI prejde');
const fakePrice = await apiAnswer({demoId: slug, messages: msgs}, {ai: mockAi('Doce citrus stojí 7,90 €.')});
assert.ok(fakePrice.json.fallback, 'vymyslená cena sa odmietne');
const fakeLink = await apiAnswer({demoId: slug, messages: msgs}, {ai: mockAi('Pozrite https://www.inyobchod.sk/kava')});
assert.ok(fakeLink.json.fallback, 'cudzí odkaz sa odmietne');
const err = await apiAnswer({demoId: slug, messages: msgs}, {ai: mockAi('', 529)});
assert.ok(err.json.fallback && err.json.reply.length > 20, 'chyba poskytovateľa = overená odpoveď');
const unknown = await apiAnswer({demoId: 'mylo', messages: msgs});
assert.equal(unknown.status, 400, 'neznáma firma nedostane cudzie dáta');
const noKey = await apiAnswer({demoId: slug, messages: msgs}, {ai: (args) => aiAnswer({...args, apiKey: ''})});
assert.ok(noKey.json.fallback, 'bez kľúča bez volania');
report.checks.apiMock = {mockedProviderCalls: calls, realProviderCalls: 0, passed: true};

const out = arg('out', '');
if (out) fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log('PASS', JSON.stringify(report.checks));
