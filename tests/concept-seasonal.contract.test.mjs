import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');
const [shell, core, flow, score, result, config, foundation, widget, advisor, responsive, chat, init] = await Promise.all([
  read('concept-seasonal-shell.js'), read('concept-seasonal-core.js'), read('concept-seasonal-advisor-flow.js'),
  read('concept-seasonal-score.js'), read('concept-seasonal-advisor-result.js'), read('concept-seasonal-config.js'),
  read('concept-seasonal-foundation.css'), read('concept-seasonal-widget.css'), read('concept-seasonal-advisor.css'),
  read('concept-seasonal-responsive.css'), read('concept-seasonal-chat.js'), read('concept-seasonal-init.js')
]);

test('owner landing communicates the final Concept proposal value', () => {
  assert.match(shell, /Návrh AI chatbota pre Concept Coffee/);
  assert.match(shell, /Sezónna káva bez zdĺhavého vyberania\./);
  assert.match(shell, /Odpovie 24\/7/);
  assert.match(shell, /Vyberie kávu/);
  assert.match(shell, /Zvýši objednávku/);
  assert.doesNotMatch(shell, /neofici|personalizovan|nie je súčasť|fake/i);
});

test('recommendation never exposes a fabricated match percentage', () => {
  assert.doesNotMatch(score, /percentFor/);
  assert.doesNotMatch(result, /percentFor|match-score|%\s*zhoda|\$\{percent\}/);
  assert.equal((result.match(/class="alternative"/g) || []).length, 1);
});

test('chat follows the compact product layout without owner branding inside the widget', () => {
  assert.match(widget, /width:min\(480px,calc\(100vw - 32px\)\)/);
  assert.match(widget, /height:min\(790px,calc\(100dvh - 32px\)\)/);
  assert.match(widget, /\.chips\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(shell, /Nájsť svoju kávu/);
  assert.match(shell, /4 otázky · výsledok do minúty/);
  const widgetMarkup = shell.slice(shell.indexOf('<section class="widget"'));
  assert.doesNotMatch(widgetMarkup, /Môj Chatbot|mojchatbot\.sk/i);
  assert.doesNotMatch(widgetMarkup, /support-row|mailto:|tel:/);
  assert.equal((chat.match(/function seedChat\(\)[\s\S]*?addMessage\(/g) || []).length, 1);
});

test('every advisor answer is illustrated by what it means, not by a product jar', () => {
  const questionBlock = core.match(/const questions = \[[\s\S]*?\n  \];/)?.[0] || '';
  assert.equal((questionBlock.match(/photo:/g) || []).length, 14);
  assert.match(questionBlock, /prep-automatic\.webp/);
  // Taste, drink and caffeine used to reuse the same product photography, so a
  // flavour question was answered with a picture of a tin. They now show the
  // flavour, the drink and the time of day instead.
  assert.match(questionBlock, /taste\/chocolate\.webp/);
  assert.match(questionBlock, /taste\/fruity\.webp/);
  assert.match(questionBlock, /taste\/drink-milk\.webp/);
  assert.match(questionBlock, /taste\/caffeine-decaf\.webp/);
  assert.doesNotMatch(questionBlock, /product-[a-z-]+\.jpg/);
});

test('selection is guarded and advances automatically once', () => {
  assert.doesNotMatch(flow, /id="continueQuestion"/);
  assert.match(flow, /function advanceQuestion/);
  const selectAnswer = flow.match(/function selectAnswer[\s\S]*?\n  \}/)?.[0] || '';
  assert.match(selectAnswer, /state\.transitioning/);
  assert.match(selectAnswer, /setTimeout\(advanceQuestion, delay\)/);
  assert.match(flow, /button\.disabled = true/);
  assert.doesNotMatch(flow, /auto-advance-note/);
});

test('current products and direct URLs remain grounded', () => {
  assert.match(config, /id: 'yellow-sunset'/);
  assert.match(config, /https:\/\/www\.conceptcoffee\.sk\/yellow-sunset\//);
  assert.match(config, /https:\/\/www\.conceptcoffee\.sk\/weithaga-aa---kenya\//);
  assert.match(result, /product\.url/);
});

test('Concept palette is saturated and brand-specific', () => {
  assert.match(foundation, /--cobalt:#214aa4/);
  assert.match(foundation, /--berry:#55307c/);
  assert.match(foundation, /--teal:#137b7f/);
  assert.match(shell, /product-weithaga\.jpg/);
});

test('mobile and motion accessibility contracts remain explicit', () => {
  assert.match(responsive, /height:100dvh/);
  assert.match(responsive, /env\(safe-area-inset-top\)/);
  assert.match(responsive, /prefers-reduced-motion:reduce/);
  assert.match(responsive, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(foundation, /:focus-visible/);
  assert.match(init, /function trapFocus/);
  assert.match(init, /event\.key === 'Escape'/);
});
