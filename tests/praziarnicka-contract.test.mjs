import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const router = readFileSync(new URL('../coffee-final-entry.js', import.meta.url), 'utf8');
const app = readFileSync(new URL('../praziarnicka-v13.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../praziarnicka-v13.css', import.meta.url), 'utf8');

test('final router keeps the isolated Praziarnicka v13 runtime', () => {
  assert.match(router, /praziarnicka-v13\.css/);
  assert.match(router, /praziarnicka-v13\.js/);
  assert.doesNotMatch(router, /praziarnicka-v12\.css/);
  assert.doesNotMatch(router, /praziarnicka-v12\.js/);
});

test('background is a customer-facing Praziarnicka shop page, not an owner process map', () => {
  assert.match(app, /PRAŽIAREŇ KÁVY A KAVIAREŇ V TRENČÍNE/);
  assert.match(app, /Vitajte v Pražiarničke/);
  assert.match(app, /Prémiová kvalita/);
  assert.match(app, /NAŠA PONUKA/);
  assert.match(app, /Poštovné zdarma/);
  assert.match(app, /Čerstvo pražená káva/);
  assert.match(app, /98 % spokojnosť/);
  assert.match(app, /Brazil Santos/);
  assert.match(app, /Paganini blend/);
  assert.doesNotMatch(app, /AKO TO FUNGUJE PRE ZÁKAZNÍKA|PROBLÉM|Konkrétna káva \+ dôvod/);
  assert.doesNotMatch(app, /Návrh AI chatbota|Ukážka riešenia/);
  assert.match(css, /grid-template-rows:76px minmax\(0,1fr\) 184px 72px/);
});

test('find-your-coffee CTA is rendered before the welcome message', () => {
  const renderStart = app.indexOf('function renderChat()');
  const renderEnd = app.indexOf('async function send', renderStart);
  const chat = app.slice(renderStart, renderEnd);
  assert.ok(chat.indexOf('pz13-advisor-entry') >= 0);
  assert.ok(chat.indexOf('state.messages.map(messageMarkup)') >= 0);
  assert.ok(chat.indexOf('pz13-advisor-entry') < chat.indexOf('state.messages.map(messageMarkup)'));
  assert.match(chat, /Nájsť svoju kávu za 4 kroky/);
});

test('Chat / Vyber kavy is a compact bottom-centered switching chip', () => {
  const stageIndex = app.indexOf('<div class="pz13-stage"');
  const modeIndex = app.indexOf('<div class="pz13-mode-shell">');
  assert.ok(stageIndex >= 0 && modeIndex > stageIndex);
  assert.match(app, /<span class="pz13-mode-thumb"/);
  assert.match(app, /data-mode="chat"/);
  assert.match(app, /data-mode="advisor"/);
  assert.match(css, /\.pz13-mode-shell\{[^}]*display:grid;place-items:center/);
  assert.match(css, /\.pz13-mode\{[^}]*width:244px;height:46px/);
  assert.match(css, /\.pz13-mode\.is-advisor \.pz13-mode-thumb/);
});

test('chat keeps quick chips next to the composer and removes choice clutter after first message', () => {
  assert.match(css, /\.pz13-chips\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /\.pz13-chip\{min-height:42px/);
  assert.match(css, /\.pz13-bubble\{[\s\S]*font-size:12\.5px/);
  assert.match(app, /!state\.interacted \? `<div class="pz13-chips">/);
  assert.match(app, /state\.interacted = true/);
  assert.match(app, /dole „Výber kávy“/);
});

test('first advisor step uses four real distinct preparation photos and keeps four steps', () => {
  const questions = app.match(/const questions = \[[\s\S]*?\n  \];/)?.[0] || '';
  assert.equal((questions.match(/key:'/g) || []).length, 4);
  assert.match(app, /prep-automatic\.webp/);
  assert.match(app, /prep-lever\.webp/);
  assert.match(app, /prep-moka\.webp/);
  assert.match(app, /prep-filter\.webp/);
  assert.match(app, /class="pz13-option__img"/);
  assert.match(css, /\.pz13-option__img\{[^}]*object-fit:cover/);
  assert.match(css, /choice-sprite\.png/);
});

test('advisor advances automatically and keeps back/reset/escape behavior', () => {
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
