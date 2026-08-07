import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');
const [shell, core, score, result, config, foundation, widget, advisor, responsive, chat] = await Promise.all([
  read('concept-seasonal-shell.js'), read('concept-seasonal-core.js'), read('concept-seasonal-score.js'),
  read('concept-seasonal-advisor-result.js'), read('concept-seasonal-config.js'), read('concept-seasonal-foundation.css'),
  read('concept-seasonal-widget.css'), read('concept-seasonal-advisor.css'), read('concept-seasonal-responsive.css'),
  read('concept-seasonal-chat.js')
]);

test('owner landing uses the approved concise proposition', () => {
  assert.match(shell, /Vitajte vo vašom návrhu AI poradcu pre Concept Coffee Roasters\./);
  assert.match(shell, /Ukážka, ako môže zákazníkovi zjednodušiť orientáciu v sezónnej ponuke a premeniť chuťové preferencie na konkrétny produkt\./);
  assert.match(shell, /Konkrétne odporúčanie, nie zoznam\./);
});

test('unverified company seal is removed and assistant mark stays secondary', () => {
  assert.doesNotMatch(core, /function brandSeal|concept-seal|>20<|>15</);
  assert.doesNotMatch(shell, /brandSeal|widget-brand__seal|site-brand__seal/);
  assert.match(core, /function mark/);
  assert.equal((core.match(/class="assistant-mark__/g) || []).length >= 2, true);
});

test('visible recommendation never exposes a fabricated percentage metric', () => {
  assert.doesNotMatch(score, /percentFor/);
  assert.doesNotMatch(result, /percentFor|match-score|%\s*zhoda|\$\{percent\}/);
  assert.match(result, /const alternative = list\.find/);
});

test('widget geometry is harmonized with the shared product family', () => {
  assert.match(foundation, /--radius-panel:24px/);
  assert.match(widget, /width:min\(448px,calc\(100vw - 40px\)\)/);
  assert.match(widget, /height:min\(720px,calc\(100dvh - 40px\)\)/);
  assert.match(widget, /\.chip\{min-height:44px/);
  assert.match(widget, /\.mode\{min-height:58px/);
  assert.match(widget, /\.composer__shell\{min-height:56px/);
});

test('chat remains minimal and the credit is readable', () => {
  assert.doesNotMatch(shell, /support-row|mailto:|tel:/);
  assert.match(shell, /Personalizovaná ukážka od/);
  assert.match(widget, /\.widget-credit,.advisor-credit\{min-height:44px/);
  assert.match(widget, /font-size:10\.5px/);
  assert.match(config, /quick: \['Svieži filter', 'Espresso do mlieka', 'Ovocné, nie ostré', 'Bez kofeínu'\]/);
  const seed = chat.match(/function seedChat\(\)[\s\S]*?\}/)?.[0] || '';
  assert.equal((seed.match(/addMessage\(/g) || []).length, 1);
});

test('photos are strong on preparation but not decoratively reused for taste', () => {
  const prep = core.match(/key: 'prep'[\s\S]*?\n    \},\n    \{\n      key: 'taste'/)?.[0] || '';
  const taste = core.match(/key: 'taste'[\s\S]*?\n    \},\n    \{\n      key: 'drink'/)?.[0] || '';
  assert.equal((prep.match(/photo:/g) || []).length, 4);
  assert.equal((taste.match(/photo:/g) || []).length, 0);
  assert.equal((taste.match(/icon:/g) || []).length, 4);
});

test('advisor uses human-language prompts and compact result hierarchy', () => {
  assert.match(core, /Ako si doma pripravuješ kávu\?/);
  assert.match(core, /Ktorý chuťový smer ti sedí\?/);
  assert.match(core, /Piješ ju skôr čistú alebo s mliekom\?/);
  assert.match(result, /Ako chutí/);
  assert.match(result, /Príprava/);
  assert.match(result, /Prečo práve táto/);
  assert.match(result, /Vybrať balenie/);
  assert.match(advisor, /\.result-photo\{height:158px/);
});

test('current decaf product data is grounded in the official catalog', () => {
  assert.match(config, /id: 'yellow-sunset'/);
  assert.match(config, /name: 'Yellow Sunset \(decaf\)'/);
  assert.match(config, /packages: \[\{ grams: 250, price: 12\.5 \}, \{ grams: 500, price: 24\.5 \}, \{ grams: 1000, price: 48 \}\]/);
  assert.match(config, /https:\/\/www\.conceptcoffee\.sk\/yellow-sunset\//);
  assert.match(config, /verifiedAt: '7\. 8\. 2026'/);
});

test('accent is supportive rather than the primary CTA treatment', () => {
  assert.match(foundation, /--accent:#c85b47/);
  assert.match(foundation, /\.primary-action,.product-link,.checkout-button[\s\S]*background:var\(--ink\)/);
  assert.doesNotMatch(foundation, /\.hero h1 em\{color:var\(--accent\)/);
});

test('mobile and motion accessibility contracts remain explicit', () => {
  assert.match(responsive, /height:100dvh/);
  assert.match(responsive, /env\(safe-area-inset-top\)/);
  assert.match(responsive, /prefers-reduced-motion:reduce/);
  assert.match(foundation, /:focus-visible/);
});

test('result has exactly one alternative template and no long availability block', () => {
  assert.equal((result.match(/class="alternative"/g) || []).length, 1);
  assert.doesNotMatch(result, /slice\(0,\s*2\)/);
  assert.doesNotMatch(result, /matchScore[^\n]*%/);
});
