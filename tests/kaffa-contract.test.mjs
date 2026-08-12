import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const router = readFileSync(new URL('../coffee-final-entry.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../kaffa-editorial.js', import.meta.url), 'utf8');
const finalApp = readFileSync(new URL('../kaffa-final.js', import.meta.url), 'utf8');
const data = readFileSync(new URL('../kaffa-data.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../kaffa-widget.css', import.meta.url), 'utf8');
const finalCss = readFileSync(new URL('../kaffa-final.css', import.meta.url), 'utf8');

test('final router keeps Kaffa metadata and dedicated editorial runtime', () => {
  assert.match(router, /Kaffa Roastery – nájdite svoju kávu/);
  assert.match(router, /kaffa-editorial\.css/);
  assert.match(router, /kaffa-editorial\.js/);
  assert.match(router, /kaffa-final\.js/);
  assert.doesNotMatch(router, /neoficiálna|fake/i);
});

test('owner page explains the proposed solution without disclaimers', () => {
  assert.match(finalApp, /kf-owner-badge/);
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

test('recommendations close on a real product link, not a simulated basket', () => {
  assert.equal((data.match(/https:\/\/kaffaroastery\.sk\/produkt\//g) || []).length, 4);
  assert.match(app, /Pozrieť kávu/);
  assert.match(finalApp, /Pozrieť produkt v e-shope/);
  // The pack picker, the tote-bag upsell and the add-to-cart button never
  // reached a basket, so the closing step read as a feature demo.
  assert.doesNotMatch(finalApp, /Pridať do košíka/);
  assert.doesNotMatch(finalApp, /ONLY GOOD KAFFA vak/);
  assert.doesNotMatch(finalApp, /kf-final-packs/);
});
