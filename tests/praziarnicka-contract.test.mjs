import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const router = readFileSync(new URL('../coffee-final-entry.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../praziarnicka-v13.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../praziarnicka-v13.css', import.meta.url), 'utf8');

test('final router loads isolated Praziarnicka v13 and bypasses legacy parity', () => {
  assert.match(router, /praziarnicka-v13\.css/);
  assert.match(router, /praziarnicka-v13\.js/);
  assert.match(router, /praziarnicka-v13/);
  assert.doesNotMatch(router, /praziarnicka-v12\.css/);
  assert.doesNotMatch(router, /praziarnicka-v12\.js/);
});

test('owner page is a process map instead of a fake Praziarnicka website', () => {
  assert.match(app, /AKO TO FUNGUJE PRE ZÁKAZNÍKA/);
  assert.match(app, /Z neistoty pri výbere ku konkrétnej káve za štyri kroky/);
  assert.match(app, /PROBLÉM/);
  assert.match(app, /VÝSLEDOK/);
  assert.match(app, /Konkrétna káva \+ dôvod \+ odkaz na produkt/);
  assert.doesNotMatch(app, /Návrh AI chatbota/);
  assert.doesNotMatch(app, /Funkčná ukážka s produktmi/);
  assert.match(css, /grid-template-rows:82px minmax\(0,1fr\) 104px/);
});

test('chat has one top mode switch and removes advisor entry after first message', () => {
  assert.match(app, /<nav class="pz13-mode"/);
  assert.doesNotMatch(app, /mode-indicator/);
  assert.match(app, /!state\.interacted \? `<button class="pz13-advisor-entry"/);
  assert.match(app, /state\.interacted = true/);
  assert.match(app, /if \(mode === 'chat'\) renderChat\(\); else renderAdvisor\(\);/);
});

test('chat uses readable two by two chips and visible message bubbles', () => {
  assert.match(css, /\.pz13-chips\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.pz13-chip\{min-height:42px/);
  assert.match(css, /font-size:11\.5px/);
  assert.match(css, /\.pz13-bubble\{[\s\S]*font-size:12\.5px/);
  assert.match(css, /\.pz13-message--user \.pz13-bubble\{[\s\S]*background:var\(--pz13-ink\)/);
});

test('preview and launcher are larger and sit above the viewport floor', () => {
  assert.match(css, /\.pz13-preview\{[\s\S]*width:274px;min-height:78px/);
  assert.match(css, /\.pz13-preview b\{font-size:14px/);
  assert.match(css, /\.pz13-preview span\{[\s\S]*font-size:11\.5px/);
  assert.match(css, /\.pz13-launcher__button\{[\s\S]*width:74px;height:74px/);
});

test('four-step advisor uses one semantic photo crop per option', () => {
  const questions = app.match(/const questions = \[[\s\S]*?\n  \];/)?.[0] || '';
  assert.equal((questions.match(/key:'/g) || []).length, 4);
  assert.match(app, /spriteStyle\(index, state\.step\)/);
  assert.match(css, /choice-sprite\.png/);
  assert.match(css, /background-size:400% 400%/);
  assert.match(css, /background-position:var\(--pz13-x\) var\(--pz13-y\)/);
  assert.doesNotMatch(app, /pz-option-photo/);
});

test('advisor advances automatically once and keeps navigation/reset', () => {
  assert.match(app, /state\.transitioning = true/);
  assert.match(app, /window\.setTimeout\(\(\) => \{/);
  assert.match(app, /\}, 230\);/);
  assert.match(app, /state\.answers\[question\.key\]/);
  assert.match(app, /event\.key === 'Escape'/);
  assert.match(app, /resetAdvisor/);
});

test('recommendations remain grounded in five real Praziarnicka product URLs', () => {
  assert.equal((app.match(/https:\/\/praziarnicka\.sk\/produkt\//g) || []).length, 5);
  assert.match(app, /Pozrieť produkt/);
  assert.match(app, /Ďalšia vhodná voľba/);
});
