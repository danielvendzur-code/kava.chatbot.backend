import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../kaffa-editorial.js', import.meta.url), 'utf8');
const finalApp = readFileSync(new URL('../kaffa-final.js', import.meta.url), 'utf8');
const data = readFileSync(new URL('../kaffa-data.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../kaffa-widget.css', import.meta.url), 'utf8');
const finalCss = readFileSync(new URL('../kaffa-final.css', import.meta.url), 'utf8');

test('page title and metadata stay customer friendly', () => {
  assert.match(html, /Kaffa Roastery – nájdite svoju kávu/);
  assert.doesNotMatch(html, /neoficiálna|fake|živá ukážka/i);
});

test('owner page explains the proposed solution without disclaimers', () => {
  assert.match(finalApp, /Ukážka riešenia/);
  assert.match(finalApp, /mojchatbot\.sk/);
  assert.match(finalApp, /Káva vybraná za minútu/);
  assert.match(finalApp, /Odpovie 24\/7/);
  assert.doesNotMatch(finalApp, /neoficiálna|fake|ukážka pre majiteľa/i);
});

test('chat keeps compact action, centered chips and input at the bottom', () => {
  assert.match(app, /kf-advisor-entry/);
  assert.match(css, /height:60px/);
  assert.match(css, /\.kf-chips\{max-width:430px;margin:0 auto 8px/);
  assert.match(app, /kf-chips[\s\S]*kf-composer/);
});

test('every configurator step uses the Kaffa photo sprite', () => {
  assert.equal((data.match(/key: '/g) || []).length, 4);
  assert.match(app, /kf-option kf-option--photo/);
  assert.match(css, /choice-sprite\.png/);
});

test('final shell is compact and uses natural photo ratios', () => {
  assert.match(finalCss, /max-width:420px!important/);
  assert.match(finalCss, /max-height:724px!important/);
  assert.match(finalCss, /aspect-ratio:4\/3!important/);
  assert.match(finalCss, /object-fit:contain/);
});

test('selection is guarded and advances automatically once', () => {
  assert.doesNotMatch(app, /id="continueQuestion"/);
  assert.match(app, /state\.transitioning/);
  assert.match(app, /setTimeout\(advanceQuestion, delay\)/);
  assert.match(app, /candidate\.disabled = true/);
});

test('progress, back navigation, reset and escape are available', () => {
  assert.match(app, /id="stepLabel"/);
  assert.match(app, /kf-progress-back/);
  assert.match(app, /id="resetWidget"/);
  assert.match(app, /event\.key === 'Escape'/);
});

test('recommendations link to real Kaffa products', () => {
  assert.equal((data.match(/https:\/\/kaffaroastery\.sk\/produkt\//g) || []).length, 4);
  assert.match(app, /Pozrieť kávu/);
  assert.match(finalApp, /ONLY GOOD KAFFA vak/);
  assert.match(finalApp, /13,00 €/);
  assert.match(finalApp, /Pridať do košíka/);
});
