/* Séria 3 (Andreine základ) – prehliadačová kontrola kávového poradcu: prejde VŠETKY cesty výberu tlačidlami rozhrania.
   node tools/s3a/dfs-coffee.mjs BASE SLUG WxH[,WxH…] [--noimg] [--shots DIR]   (/api/** blokované – 0 platených volaní)
   Každá otázka: vodorovné posúvanie, karta mimo panela, rozbitý obrázok, opakovaná fotka v otázke, rovnaká výška textu kariet,
   „undefined/NaN“, chyby JS. Výsledok: názov, cena, odkaz na presnú URL produktu bez target=_blank, alternatíva (ak ju jadro má),
   doplnok iba v rozpočte, súčet ≤ limit, Späť vráti predchádzajúcu otázku. */
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const args = process.argv.slice(2), [BASE, SLUG, SIZES] = args, NOIMG = args.includes('--noimg');
const SHOTS = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : '';
globalThis.window = globalThis;
const E = require(process.cwd() + '/n447/c2/engine-c2.js'); const D = require(process.cwd() + `/n447/c2/data/${SLUG}.js`);
const paths = [];
const walk = (a, seq) => { const q = E.nextQuestion(D, a); if (!q) { paths.push({seq, a, r: E.result(D, a)}); return; } for (const o of q.options) walk(E.answer(a, q.key, o.value), [...seq, [q.key, o.value]]); };
walk({}, []);
const b = await chromium.launch(); const fails = []; let screens = 0;
for (const size of SIZES.split(',')) {
  const [w, h] = size.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await p.route('**/api/**', (r) => r.fulfill({status: 500, body: '{}'}));
  if (NOIMG) await p.route(/\.(jpg|jpeg|png|webp)(\?|$)/, (r) => r.fulfill({status: 404, body: ''}));
  await p.goto(BASE + `/cosmetics.html?demo=${SLUG}`, {waitUntil: 'networkidle'}); await p.waitForTimeout(400);
  await p.click('[data-open="advisor"]'); await p.waitForSelector('.cx-quality-stage:not([hidden]) .cx-quality-body');
  const probe = () => p.evaluate(() => {
    const vw = document.documentElement.clientWidth, panel = document.querySelector('.cx-quality-stage'), pr = panel.getBoundingClientRect();
    const opts = [...panel.querySelectorAll('.cx-catalogue-option')];
    const out = opts.filter((e) => { const x = e.getBoundingClientRect(); return x.right > pr.right + 1 || x.left < pr.left - 1; }).map((e) => e.innerText.trim().slice(0, 30));
    const imgs = [...panel.querySelectorAll('.cx-catalogue-option img')].map((i) => i.getAttribute('src').split('?')[0]);
    const broken = [...panel.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src').slice(-50));
    const hs = [...panel.querySelectorAll('.cx-catalogue-options .cx-catalogue-option')].map((c) => Math.round(c.getBoundingClientRect().height));
    const txt = panel.innerText;
    const main = panel.querySelector('.cx-quality-product.is-primary');
    return {same: (() => { const k = opts.filter((o) => o.dataset.choice !== undefined && !/^more:/.test(o.dataset.choice)).map((o) => [...o.querySelectorAll('b, small, span, p')].map((e) => e.textContent).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()); return k.filter((x, i) => x && k.indexOf(x) !== i); })(), question: opts.length > 0, n: opts.length, hscroll: document.documentElement.scrollWidth > vw + 1, out, dup: imgs.length !== new Set(imgs).size, imgs, broken,
      unequal: hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 1, bad: /undefined|NaN|\[object|null/.test(txt), emptyTitle: opts.some((o) => !o.querySelector('b')?.textContent.trim()),
      name: main?.querySelector('h2')?.textContent || '', price: main?.querySelector('strong')?.textContent || '', href: main?.querySelector('a')?.getAttribute('href') || '',
      target: [...panel.querySelectorAll('a')].some((a) => a.target && a.target !== '_self'), alt: /Alternatíva|Alternativa/i.test(txt), addon: /Doplnok|Doplněk/i.test(txt),
      total: (txt.match(/(Spolu za odporúčanú zostavu|Celkem za doporučenou sestavu): ([^\n]+)/) || [])[2] || '', h2: panel.querySelector('.cx-quality-body > h2')?.textContent};
  });
  let shot = 0;
  for (const path of paths) {
    await p.click('[data-restart], #cx-reset').catch(() => {}); await p.waitForTimeout(60);
    const st = await p.evaluate(() => window.CXCoffeeAdvisorS3.state.trail.length);
    if (st) { await p.evaluate(() => { const s = window.CXCoffeeAdvisorS3.state; s.answers = {}; s.trail = []; window.CXCoffeeAdvisorS3.render(); }); }
    const label = `${size} ${JSON.stringify(path.seq)}`;
    let prevH2 = '';
    for (const [k, v] of path.seq) {
      const s = await probe(); screens++;
      if (!s.question) { fails.push(label + ' chýba otázka ' + k); break; }
      const bad = [s.hscroll && 'hscroll', s.out.length && 'mimo:' + s.out, s.dup && !NOIMG && 'opakovaná fotka', s.broken.length && 'rozbitý obrázok ' + s.broken, s.unequal && 'nerovnaká výška kariet', s.bad && 'undefined/NaN', s.emptyTitle && 'prázdny názov', s.same.length && 'významovo rovnaké odpovede: ' + s.same.join(' / ')].filter(Boolean);
      if (bad.length) fails.push(label + ' @' + k + ': ' + bad.join(', '));
      if (SHOTS && shot < 6 && size.startsWith('390')) { await p.screenshot({path: `${SHOTS}/${SLUG}-${size}-q${shot}.png`}); shot++; }
      prevH2 = s.h2;
      await p.click(`.cx-quality-stage [data-choice="${String(v).replace(/"/g, '\\"')}"]`);
      await p.waitForTimeout(40);
    }
    const s = await probe(); screens++;
    const r = path.r;
    const bad = [];
    if (!r) bad.push('jadro bez výsledku');
    else {
      if (s.name !== r.product.name) bad.push('názov ' + s.name + ' ≠ ' + r.product.name);
      if (!s.price || s.price !== r.priceLabel) bad.push('cena ' + s.price + ' ≠ ' + r.priceLabel);
      if (s.href !== r.product.url) bad.push('odkaz ' + s.href);
      if (s.target) bad.push('odkaz v novej karte');
      if (!!r.alternative !== s.alt) bad.push('alternatíva ' + s.alt);
      if (!!r.addon !== s.addon) bad.push('doplnok ' + s.addon);
      if (r.limit != null && r.total != null && r.total > r.limit + 0.001) bad.push('súčet nad limit');
    }
    if (s.hscroll) bad.push('hscroll'); if (s.bad) bad.push('undefined/NaN'); if (s.broken.length && !NOIMG) bad.push('rozbitý obrázok ' + s.broken);
    if (bad.length) fails.push(label + ' výsledok: ' + bad.join(', '));
    if (SHOTS && size.startsWith('390') && paths.indexOf(path) < 3) await p.screenshot({path: `${SHOTS}/${SLUG}-${size}-result${paths.indexOf(path)}.png`, fullPage: false});
    /* Späť z výsledku vráti poslednú otázku */
    if (path.seq.length) { await p.click('.cx-quality-stage [data-back]'); await p.waitForTimeout(40); const back = await probe(); if (!back.question) fails.push(label + ' Späť nevrátil otázku'); }
  }
  if (errs.length) fails.push(size + ' JS: ' + [...new Set(errs)].join(' | '));
  await ctx.close();
}
await b.close();
const reach = new Set(paths.map((x) => x.r && x.r.product.id)).size, all = D.products.filter((p) => p.available !== false && p.kind === 'coffee').length;
console.log(`${SLUG} ${SIZES}${NOIMG ? ' bez fotiek' : ''}: ${paths.length} ciest, ${screens} obrazoviek, dosiahnuteľné kávy ${reach}/${all}, nálezy ${fails.length}`);
for (const f of fails.slice(0, 40)) console.log(f);
if (fails.length || reach !== all) process.exitCode = 1;
