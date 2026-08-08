import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../kaffa-editorial.js', import.meta.url), 'utf8');
const data = readFileSync(new URL('../kaffa-data.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../kaffa-widget.css', import.meta.url), 'utf8');

test('page title and description speak to coffee customers', () => {
  assert.match(html, /Kaffa Roastery – nájdite svoju kávu/);
  assert.doesNotMatch(html, /neoficiálna|návrh AI|ukážka pre majiteľa/i);
});

test('customer-facing interface has no third-party promotion', () => {
  assert.doesNotMatch(app, /mojchatbot|self.?promo|ukážka pre majiteľa/i);
  assert.match(app, /© Kaffa Roastery/);
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

test('selection waits for an explicit Continue action', () => {
  assert.match(app, /id="continueQuestion"/);
  assert.match(app, /continueButton\.onclick/);
  assert.doesNotMatch(app, /setTimeout\(\(\) => \{\s*if \(state\.step < K\.questions\.length - 1\)/);
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
});
