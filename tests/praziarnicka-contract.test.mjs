import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const router = readFileSync(new URL('../coffee-final-entry.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../praziarnicka-v12.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../praziarnicka-v12.css', import.meta.url), 'utf8');

test('final router loads the latest Praziarnicka v12 runtime', () => {
  assert.match(router, /praziarnicka-v12\.css/);
  assert.match(router, /praziarnicka-v12\.js/);
  assert.match(router, /Pražiarnička – kávový poradca/);
});

test('owner page explains the solution and keeps the live widget separate', () => {
  assert.match(app, /Návrh AI chatbota pre Pražiarničku/);
  assert.match(app, /Zákazník odpovie na štyri otázky/);
  assert.match(app, /Vyskúšať chatbot/);
  assert.match(css, /#coffee-demo-root\{display:none!important\}/);
});

test('chat uses a compact two by two chip grid above the composer', () => {
  assert.match(app, /pz-chips[\s\S]*pz-composer/);
  assert.match(css, /\.pz-chips\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.pz-chip\{[\s\S]*?min-height:42px/);
});

test('widget uses the final Jolka-scale proportions without page scrolling', () => {
  assert.match(css, /width:min\(452px,calc\(100vw - 32px\)\)/);
  assert.match(css, /height:min\(788px,calc\(100dvh - 52px\)\)/);
  assert.match(css, /body\{overflow:hidden\}/);
  assert.match(css, /\.pz-view\{min-height:0;overflow:hidden/);
});

test('four-step advisor advances automatically once and preserves answers', () => {
  const questions = app.match(/const questions = \[[\s\S]*?\n  \];/)?.[0] || '';
  assert.equal((questions.match(/key: '/g) || []).length, 4);
  assert.doesNotMatch(app, /id="continueQuestion"/);
  assert.match(app, /state\.transitioning/);
  assert.match(app, /setTimeout\(\(\) => \{/);
  assert.match(app, /\}, 330\);/);
  assert.match(app, /state\.answers\[question\.key\]/);
  assert.match(app, /event\.key === 'Escape'/);
});

test('recommendations link to five real Praziarnicka products', () => {
  assert.equal((app.match(/https:\/\/praziarnicka\.sk\/produkt\//g) || []).length, 5);
  assert.match(app, /Otvoriť e-shop/);
});
