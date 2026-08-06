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

test('Concept uses a dedicated ordered runtime without active legacy patches', () => {
  assert.match(index, /coffee-entry\.js/);
  assert.doesNotMatch(index, /coffee-v8-patch|coffee-brand-overrides|coffee-v8-refine/);
  assert.match(entry, /slug === 'concept'/);
  assert.match(entry, /concept-seasonal-foundation\.css/);
  assert.match(entry, /concept-seasonal-responsive\.css/);
  assert.match(entry, /concept-seasonal-config\.js/);
  for (const name of moduleNames) assert.match(entry, new RegExp(name.replaceAll('.', '\\.')));
  assert.doesNotMatch(entry, /\/concept-seasonal\.js/);
});

test('teaser does not nest an interactive control', () => {
  const shell = appParts[moduleNames.indexOf('concept-seasonal-shell.js')];
  const teaser = shell.match(/<aside class="launcher-teaser"[\s\S]*?<\/aside>/)?.[0] || '';
  assert.match(teaser, /launcher-teaser__close/);
  assert.match(teaser, /launcher-teaser__open/);
  assert.doesNotMatch(teaser, /<button[^>]*>(?:(?!<\/button>)[\s\S])*<button/);
});

test('assistant mark has two paths and is brand-specific', () => {
  const core = appParts[moduleNames.indexOf('concept-seasonal-core.js')];
  const markBody = core.match(/function mark[\s\S]*?return `([\s\S]*?)`;\n  }/)?.[1] || '';
  assert.equal((markBody.match(/<path/g) || []).length, 2);
  assert.match(markBody, /assistant-mark__c/);
  assert.match(markBody, /assistant-mark__bean/);
});

test('chat starts with exactly one assistant message', () => {
  const chatModule = appParts[moduleNames.indexOf('concept-seasonal-chat.js')];
  const seed = chatModule.match(/function seedChat\(\)[\s\S]*?\n  }/)?.[0] || '';
  assert.equal((seed.match(/addMessage\(/g) || []).length, 1);
  assert.match(seed, /config\.welcome/);
});

test('current product data includes exact product URLs, contact and verification boundary', () => {
  assert.match(config, /verifiedAt: '6\. 8\. 2026'/);
  assert.match(config, /phone: '\+421949205711'/);
  assert.match(config, /conceptcoffee\.sk\/weithaga-aa---kenya\//);
  assert.match(config, /conceptcoffee\.sk\/yellow-sunset\//);
  assert.doesNotMatch(config, /url: 'https:\/\/www\.conceptcoffee\.sk\/'/);
});

test('recommendation shows one alternative and packaging follows result', () => {
  assert.match(app, /const alternative = list\.find/);
  assert.match(app, /matchScore/);
  assert.doesNotMatch(app, /return \{ \.\.\.product, score \}/);
  assert.doesNotMatch(app, /slice\(0, 2\)/);
  assert.match(app, /app\.state\.stage = 'package'/);
  assert.match(app, /product\.packages\.map/);
  assert.match(app, /priceLabel/);
});

test('shared state module owns its configuration dependencies', () => {
  const shared = appParts[moduleNames.indexOf('concept-seasonal-shared.js')];
  assert.match(shared, /const \{ \$, \$\$, config, stateKey \} = app/);
  assert.match(shared, /sessionStorage\.setItem\(stateKey/);
  assert.match(shared, /demoId: config\.id/);
});

test('mobile and accessibility contracts are explicit', () => {
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /100dvh/);
  assert.match(css, /env\(safe-area-inset-bottom\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  assert.match(app, /lockedScrollY/);
  assert.match(app, /window\.scrollTo\(0, app\.lockedScrollY\)/);
});

test('audit documents before, after and official sources', () => {
  assert.match(audit, /## Before/);
  assert.match(audit, /## After/);
  assert.match(audit, /## Verified product dataset/);
  assert.match(audit, /conceptcoffee\.sk\/kontakty/);
});
