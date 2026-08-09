import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');
const [index, core, config, overrides, brand, css] = await Promise.all([
  read('index.html'),
  read('coffee-v8.js'),
  read('coffee-configs.js'),
  read('coffee-brand-overrides.js'),
  read('coffee-vitazov-brand.js'),
  read('coffee-v8-vitazov.css'),
]);

test('landing copy is customer-facing and uses plain language', () => {
  assert.match(overrides, /Káva, ktorú si zákazník vyberie s istotou\./);
  assert.match(overrides, /Jednoduchý výber/);
  assert.match(overrides, /Pomoc 24\/7/);
  assert.doesNotMatch(overrides, /návrhu AI|personalizovaná ukážka|neoficiálna/i);
  assert.doesNotMatch(index, /neoficiálna|ukážka/i);
});

test('chat uses compact full-width entry, centered text chips and no self promo', () => {
  assert.match(core, /Nájsť kávu na mieru/);
  assert.match(core, /4 otázky · výsledok do minúty/);
  assert.match(css, /\.advisor-entry \{[\s\S]*?min-height: 62px/);
  assert.match(css, /\.chip \{[\s\S]*?min-height: 42px[\s\S]*?justify-content: center/);
  assert.doesNotMatch(brand, /widget-credit|mojchatbot\.sk/i);
  assert.doesNotMatch(core.match(/function renderChips[\s\S]*?\n  \}/)?.[0] || '', /icons\.next/);
});

test('selection is guarded and advances automatically once', () => {
  const select = core.match(/function selectAnswer[\s\S]*?\n  \}/)?.[0] || '';
  assert.doesNotMatch(core, /id="continueQuestion"/);
  assert.match(core, /function advanceQuestion/);
  assert.match(select, /state\.transitioning/);
  assert.match(select, /setTimeout\(advanceQuestion, delay\)/);
  assert.match(select, /button\.disabled = true/);
});

test('every answer card uses the local sprite without stretching it', async () => {
  const sprite = await stat(new URL('assets/vitazov-choice-sprite.png', root));
  assert.ok(sprite.size > 100_000);
  assert.match(css, /background-image: url\('\/assets\/vitazov-choice-sprite\.png'\)/);
  const scale = await read('coffee-v8-jolka-scale.css');
  assert.match(scale, /background-size:400% auto/);
  for (const value of ['home', 'office', 'automatic', 'discovery', 'classic', 'balanced', 'fruity', 'black', 'milk', 'both', 'strong', 'caffeine', 'decaf']) {
    assert.match(css, new RegExp(`option__photo--${value}`));
  }
});

test('brand system, local official logo and large progress remain explicit', async () => {
  assert.match(css, /--kv-green: #063f35/);
  assert.match(css, /--kv-lime: #b7e84d/);
  assert.match(css, /\.progress i \{[\s\S]*?height: 8px/);
  assert.match(brand, /\/assets\/vitazov-logo\.svg/);
  const logo = await stat(new URL('assets/vitazov-logo.svg', root));
  assert.ok(logo.size > 10_000);
});

test('recommendations use direct products without fabricated percentages', () => {
  assert.match(config, /https:\/\/kavavitazov\.sk\/espresso-blend\//);
  assert.match(config, /100 % Arabica bez kofeínu/);
  assert.doesNotMatch(core, /match-score|%\s*zhoda|percentFor/);
  assert.match(brand, /label\.textContent !== labels\[index\]/);
});
