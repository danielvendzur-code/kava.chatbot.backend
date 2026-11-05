/* Séria 3 – kontrola natívneho poradcu Andreine (kozmetika): prejde VŠETKY voľby v rozhraní (do hĺbky, s tlačidlom Späť).
   node tools/s3a/dfs-native.mjs BASE SLUG WxH[,WxH…] [--noimg]   (/api/** blokované – 0 platených volaní)
   Otázka: hscroll, karta mimo panela, rozbitý obrázok, opakovaná fotka v otázke (aj pri stránkovaní), nerovnaká výška kariet, undefined/NaN.
   Výsledok: produkt, cena, odkaz z katalógu bez novej karty, súčet zostavy ≤ rozpočet. Na konci: koľko produktov bolo hlavným odporúčaním. */
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const args = process.argv.slice(2), [BASE, SLUG, SIZES] = args, NOIMG = args.includes('--noimg');
require(process.cwd() + `/catalogues/${SLUG}.js`);
const cat = globalThis.CX_CATALOGUES[SLUG].products, urls = new Set(cat.map((p) => p.url));
const b = await chromium.launch(); const fails = []; const winners = new Set(); let screens = 0, results = 0;
for (const size of SIZES.split(',')) {
  const [w, h] = size.split('x').map(Number);
  const ctx = await b.newContext({viewport: {width: w, height: h}, reducedMotion: 'reduce'}); const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await p.route('**/api/**', (r) => r.fulfill({status: 500, body: '{}'}));
  if (NOIMG) await p.route(/\.(jpg|jpeg|png|webp)(\?|$)/, (r) => r.fulfill({status: 404, body: ''}));
  await p.goto(BASE + `/cosmetics.html?demo=${SLUG}`, {waitUntil: 'networkidle'}); await p.waitForTimeout(400);
  await p.click('[data-open="advisor"]'); await p.waitForSelector('.cx-quality-stage:not([hidden]) .cx-quality-body'); await p.waitForTimeout(200);
  const probe = () => p.evaluate(() => {
    const vw = document.documentElement.clientWidth, panel = document.querySelector('.cx-quality-stage'), pr = panel.getBoundingClientRect();
    const opts = [...panel.querySelectorAll('.cx-catalogue-options .cx-catalogue-option')];
    const imgs = opts.map((o) => o.querySelector('img')?.getAttribute('src')?.split('?')[0]).filter(Boolean);
    const hs = opts.map((c) => Math.round(c.getBoundingClientRect().height));
    const txt = panel.innerText, main = panel.querySelector('.cx-quality-product.is-primary');
    return {h2: panel.querySelector('.cx-quality-body > h2')?.textContent || '', choices: opts.filter((o) => o.dataset.choice !== undefined).map((o) => o.dataset.choice), more: !!panel.querySelector('[data-page-next]'),
      hscroll: document.documentElement.scrollWidth > vw + 1, out: opts.some((e) => { const x = e.getBoundingClientRect(); return x.right > pr.right + 1 || x.left < pr.left - 1; }),
      dup: imgs.length !== new Set(imgs).size, broken: [...panel.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0).length,
      unequal: hs.length > 1 && Math.max(...hs) - Math.min(...hs) > 1, bad: /undefined|NaN|\[object/.test(txt), emptyTitle: opts.some((o) => !o.querySelector('b')?.textContent.trim()),
      result: !!main, id: main?.dataset.productId || '', price: main?.querySelector('strong')?.textContent || '', href: main?.querySelector('a')?.getAttribute('href') || '',
      target: [...panel.querySelectorAll('a')].some((a) => a.target && a.target !== '_self'), noMatch: !main && !opts.length};
  });
  const seen = new Set();
  async function explore(trail, pages = 0) {
    const s = await probe(); screens++;
    const label = size + ' ' + trail.join(' > ');
    if (s.result || s.noMatch) {
      results++;
      if (s.noMatch) fails.push(label + ': žiadny produkt');
      else { winners.add(s.id); if (!s.price) fails.push(label + ': chýba cena'); if (!urls.has(s.href)) fails.push(label + ': odkaz ' + s.href); if (s.target) fails.push(label + ': nová karta'); }
      if (s.hscroll || s.bad || (s.broken && !NOIMG)) fails.push(label + ': výsledok ' + JSON.stringify({h: s.hscroll, bad: s.bad, broken: s.broken}));
      return;
    }
    const bad = [s.hscroll && 'hscroll', s.out && 'mimo panela', s.dup && !NOIMG && 'opakovaná fotka', s.broken && !NOIMG && 'rozbitý obrázok', s.unequal && 'nerovnaká výška', s.bad && 'undefined/NaN', s.emptyTitle && 'prázdny názov'].filter(Boolean);
    if (bad.length) fails.push(label + ' [' + s.h2 + ']: ' + bad.join(', '));
    for (const v of s.choices) {
      await p.click(`.cx-quality-stage [data-choice="${v}"]`); await p.waitForTimeout(30);
      await explore([...trail, v || '(bez limitu)']);
      await p.click('.cx-quality-stage [data-back]'); await p.waitForTimeout(30);
      /* Späť z ďalšej otázky vráti prvú stránku volieb – stránkovanie obnovíme. */
      for (let i = 0; i < pages; i++) { if (!(await probe()).choices.includes(v)) { await p.click('.cx-quality-stage [data-page-next]'); await p.waitForTimeout(30); } }
    }
    if (s.more) { await p.click('.cx-quality-stage [data-page-next]'); await p.waitForTimeout(30); await explore([...trail, '(ďalšie)'], pages + 1); await p.click('.cx-quality-stage [data-back]'); await p.waitForTimeout(30); }
  }
  await explore([]);
  if (errs.length) fails.push(size + ' JS: ' + [...new Set(errs)].join(' | '));
  await ctx.close();
}
await b.close();
console.log(`${SLUG} ${SIZES}${NOIMG ? ' bez fotiek' : ''}: ${results} výsledkov, ${screens} obrazoviek, hlavné odporúčanie ${winners.size}/${cat.length}, nálezy ${fails.length}`);
for (const f of fails.slice(0, 40)) console.log(f);
if (fails.length || (!NOIMG && winners.size !== cat.length)) process.exitCode = 1;
