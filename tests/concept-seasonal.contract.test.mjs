import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const moduleNames = [
  'concept-seasonal-core.js',
  'concept-seasonal-shell.js',
  'concept-seasonal-shared.js',
  'concept-seasonal-score.js',
  'concept-seasonal-advisor-flow.js',
  'concept-seasonal-advisor-result.js',
  'concept-seasonal-advisor-completion.js',
  'concept-seasonal-chat.js',
  'concept-seasonal-init.js'
];

const [index, entry, appParts, cssParts, config, audit] = await Promise.all([
  read('index.html'),
  read('coffee-entry.js'),
  Promise.all(moduleNames.map(read)),
  Promise.all([
    read('concept-seasonal-foundation.css'),
    read('concept-seasonal-widget.css'),
    read('concept-seasonal-advisor.css'),
    read('concept-seasonal-responsive.css')
  ]),
  read('concept-seasonal-config.js'),
  read('CONCEPT_SEASONAL_AUDIT.md')
]);
const app = appParts.join('\n');
const css = cssParts.join('\n');
const shell = appParts[moduleNames.indexOf('concept-seasonal-shell.js')];
const chat = appParts[moduleNames.indexOf('concept-seasonal-chat.js')];
const core = appParts[moduleNames.indexOf('concept-seasonal-core.js')];

test('Concept keeps its dedicated ordered runtime without active legacy patches', () => {
  assert.match(index, /coffee-entry\.js/);
  assert.doesNotMatch(index, /coffee-v8-patch|coffee-brand-overrides|coffee-v8-refine/);
  assert.match(entry, /slug === 'concept'/);
  for (const name of moduleNames) assert.match(entry, new RegExp(name.replaceAll('.', '\\.')));
});

test('landing is explicitly owner-facing and demonstrates business value', () => {
  assert.match(shell, /Vitajte vo vašom návrhu chatbotu/);
  assert.match(shell, /Takto môže vyzerať AI poradca pre váš e-shop/);
  assert.match(shell, /Pomôže s výberom/);
  assert.match(shell, /Odpovie okamžite/);
  assert.match(shell, /Vedie k produktu/);
  assert.match(shell, /Funkčný koncept pripravený pre majiteľa/);
});

test('Concept company identity and assistant identity remain distinct', () => {
  assert.match(core, /function brandSeal/);
  assert.match(core, /concept-seal/);
  assert.match(shell, /site-brand__seal/);
  assert.match(shell, /widget-brand__seal/);
  const markBody = core.match(/function mark[\s\S]*?return `([\s\S]*?)`;\n  }/)?.[1] || '';
  assert.equal((markBody.match(/<path/g) || []).length, 2);
  assert.match(markBody, /assistant-mark__c/);
  assert.match(markBody, /assistant-mark__bean/);
});

test('widget is a large premium panel with the approved segmented control', () => {
  assert.match(css, /width:min\(548px,calc\(100vw - 44px\)\)/);
  assert.match(css, /height:min\(780px,calc\(100dvh - 44px\)\)/);
  assert.match(css, /--radius-panel:30px/);
  assert.match(shell, /<b>Chat<\/b>/);
  assert.match(shell, /<b>Výber kávy<\/b>/);
});

test('chat has one opening message, four prompts by the composer and no contact row', () => {
  const seed = chat.match(/function seedChat\(\)[\s\S]*?\n  }/)?.[0] || '';
  assert.equal((seed.match(/addMessage\(/g) || []).length, 1);
  assert.match(config, /quick: \['Svieži filter', 'Espresso do mlieka', 'Ovocné, nie ostré', 'Bez kofeínu'\]/);
  assert.match(shell, /<div class="chat-bottom">[\s\S]*id="quickChips"[\s\S]*class="composer"/);
  assert.doesNotMatch(shell, /support-row/);
  assert.doesNotMatch(chat, /renderSupport/);
  assert.match(shell, /https:\/\/mojchatbot\.sk/);
});

test('teaser remains valid and contains no nested button', () => {
  const teaser = shell.match(/<aside class="launcher-teaser"[\s\S]*?<\/aside>/)?.[0] || '';
  assert.match(teaser, /launcher-teaser__close/);
  assert.match(teaser, /launcher-teaser__open/);
  assert.doesNotMatch(teaser, /<button[^>]*>(?:(?!<\/button>)[\s\S])*<button/);
});

test('photography is integrated into entry, preparation, flavour and result', () => {
  assert.match(shell, /advisor-entry__visual/);
  assert.match(core, /prep-automatic\.webp/);
  assert.match(core, /prep-filter\.webp/);
  assert.match(core, /photo: '\/assets\/concept\/result-filter\.webp'/);
  assert.match(core, /photo: '\/assets\/concept\/result-espresso\.webp'/);
  assert.match(app, /class="result-photo"/);
});

test('recommendation prioritises its reason and packaging CTA before details', () => {
  const result = appParts[moduleNames.indexOf('concept-seasonal-advisor-result.js')];
  assert.ok(result.indexOf('class="reason"') < result.indexOf('class="result-actions"'));
  assert.ok(result.indexOf('class="result-actions"') < result.indexOf('class="result-story"'));
  assert.match(result, /const alternative = list\.find/);
  assert.doesNotMatch(result, /slice\(0, 2\)/);
  assert.match(app, /app\.state\.stage = 'package'/);
  assert.match(app, /product\.packages\.map/);
});

test('seasonal product data uses exact URLs and a non-permanent stock boundary', () => {
  assert.match(config, /verifiedAt: '6\. 8\. 2026'/);
  assert.match(config, /conceptcoffee\.sk\/weithaga-aa---kenya\//);
  assert.match(config, /conceptcoffee\.sk\/yellow-sunset\//);
  assert.match(config, /Dostupnosť sa overí na produktovej stránke/);
  assert.doesNotMatch(config, /Skladom viac ako 5 ks/);
});

test('mobile, focus and reduced-motion contracts stay explicit', () => {
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /100dvh/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.match(app, /window\.scrollTo\(0, app\.lockedScrollY\)/);
  assert.match(app, /focus\(\{ preventScroll: true \}\)/);
});

test('audit records the reference refinement and complete QA boundary', () => {
  assert.match(audit, /## Before/);
  assert.match(audit, /## After/);
  assert.match(audit, /35 browser assertions pass/);
  assert.match(audit, /No PR, merge, Vercel deploy or preview deploy/);
});
