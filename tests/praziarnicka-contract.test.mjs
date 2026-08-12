import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../praziarnicka-v11.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../praziarnicka-v11.css', import.meta.url), 'utf8');

test('page is written for coffee customers', () => {
  assert.match(html, /Pražiarnička – nájdite svoju kávu/);
  assert.doesNotMatch(app, /návrh AI|ukážka pre majiteľa|neoficiálna|mojchatbot/i);
});

test('chat has no promotional footer and keeps input below compact chips', () => {
  assert.doesNotMatch(app, /pz-credit|mojchatbot/);
  assert.match(app, /pz-chips[\s\S]*pz-composer/);
  assert.match(css, /\.pz-chip\{min-height:41px/);
});

test('coffee finder action is full width and only sixty pixels high', () => {
  assert.match(app, /Nájsť svoju kávu/);
  assert.match(css, /\.pz-advisor-cta\{width:100%;height:60px;min-height:60px/);
});

test('every step renders branded photo cards', () => {
  assert.equal((app.match(/key: '/g) || []).length, 4);
  assert.match(app, /pz-option-photo/);
  assert.match(css, /choice-sprite\.png/);
});

test('questions advance automatically once after a guarded selection', () => {
  assert.doesNotMatch(app, /id="continueQuestion"/);
  assert.match(app, /state\.transitioning/);
  assert.match(app, /setTimeout\(advanceQuestion, delay\)/);
  assert.match(app, /candidate\.disabled = true/);
});

test('answers survive back navigation and the dialog supports reset and escape', () => {
  assert.match(app, /state\.answers\[question\.key\]/);
  assert.match(app, /id="pz-back"/);
  assert.match(app, /function resetAll/);
  assert.match(app, /event\.key === 'Escape'/);
});

test('results link to real Pražiarnička products', () => {
  assert.equal((app.match(/https:\/\/praziarnicka\.sk\/produkt\//g) || []).length, 5);
  assert.match(app, /Pozrieť kávu/);
});
