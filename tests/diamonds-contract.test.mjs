import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');
const [index, foundation, controller, overrides, landing, widget] = await Promise.all([
  read('index.html'),
  read('coffee-v8-diamonds-foundation.js'),
  read('coffee-v8-diamonds-controller.js'),
  read('coffee-brand-overrides.js'),
  read('coffee-v8-diamonds-landing.css'),
  read('coffee-v8-diamonds-widget.css'),
]);

test('Diamonds page reads like a real customer website', () => {
  assert.match(foundation, /Káva, ktorá vám sadne\./);
  assert.match(foundation, /Pomoc 24\/7/);
  assert.match(foundation, /Konkrétna káva/);
  assert.doesNotMatch(foundation, /návrhu AI|návrh pre majiteľa|ukážka od|Môj Chatbot/i);
  assert.doesNotMatch(index, /neoficiálna|personalizovaná ukážka/i);
});

test('chat hierarchy is compact and self promo is absent', () => {
  assert.match(foundation, /Nájsť svoju kávu/);
  assert.match(foundation, /4 otázky · výsledok do minúty/);
  assert.doesNotMatch(foundation, /welcome-card|widget-credit|mojChatbotUrl/);
  assert.match(widget, /\.advisor-entry \{[\s\S]*?min-height: 60px/);
  assert.match(widget, /\.quick-grid button \{[\s\S]*?min-height: 42px/);
});

test('advisor advances automatically once and remembers the answer', () => {
  const question = controller.match(/function renderQuestion[\s\S]*?\n  \}/)?.[0] || '';
  assert.doesNotMatch(controller, /id="continueQuestion"/);
  assert.match(controller, /function advanceQuestion/);
  assert.match(question, /state\.transitioning/);
  assert.match(question, /setTimeout\(advanceQuestion, delay\)/);
  assert.match(question, /candidate\.disabled = true/);
  assert.match(controller, /aria-pressed/);
});

test('every option uses the local Diamonds photo sprite in a two-column grid', async () => {
  const sprite = await stat(new URL('assets/diamonds/choice-sprite.png', root));
  assert.ok(sprite.size > 100_000);
  assert.match(widget, /background-image: url\('\/assets\/diamonds\/choice-sprite\.png'\)/);
  const scale = await read('coffee-v8-diamonds-jolka.css');
  assert.match(scale, /background-size:400% auto/);
  assert.match(widget, /\.answers \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  for (const value of ['automatic', 'espresso', 'filter', 'moka', 'chocolate', 'balanced', 'fruity', 'black', 'milk', 'both', 'classic', 'decaf']) {
    assert.match(widget, new RegExp(`answer-photo--${value}`));
  }
});

test('large progress and accessibility remain explicit', () => {
  assert.match(widget, /\.progress \{ height: 8px/);
  assert.match(controller, /function trapFocus/);
  assert.match(controller, /event\.key === 'Escape'/);
  assert.match(landing, /prefers-reduced-motion/);
});

test('recommendations link to real products without fabricated percentages', () => {
  assert.match(overrides, /https:\/\/diroastery\.sk\/produkt\/peru-valley-coffee-zrnkova-kava\//);
  assert.match(overrides, /Kolumbia El Buho bez kofeínu/);
  assert.doesNotMatch(controller, /match-score|percentFor|%\s*zhoda/);
});
