/* s3 – prehliadačová kontrola kávovej ukážky (jadro c2): prejde VŠETKY cesty výberu tlačidlami rozhrania.
   node tools/s3/browser_dfs_coffee.mjs BASE SLUG WxH[,WxH…] [--noimg]   (/api/** blokované – 0 platených volaní)
   Na každej obrazovke: vodorovné posúvanie, voľby mimo okna, rozbité obrázky, „undefined/NaN“, chyby JS;
   vo výsledku: produkt a CTA na presnú URL overenej varianty, CTA bez target=_blank, alternatíva, návrat (#restart). */
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const [BASE, SLUG, SIZES] = process.argv.slice(2); const NOIMG = process.argv.includes('--noimg');
globalThis.window = globalThis;
const E = require(process.cwd() + '/n447/c2/engine-c2.js'); const D = require(process.cwd() + `/n447/c2/data/${SLUG}.js`);
/* poradie odpovedí každej cesty podľa jadra */
const seqs = [];
const walk = (a, seq) => { const q = E.nextQuestion(D, a); if (!q) { seqs.push({seq, r: E.result(D, a)}); return; } for (const o of q.options) walk(E.answer(a, q.key, o.value), [...seq, [q.key, o.value]]); };
walk({}, []);
const b = await chromium.launch(); let fails = [], screens = 0;
for (const size of SIZES.split(',')) {
  const [w, h] = size.split('x').map(Number);
  const p = await b.newPage({viewport: {width: w, height: h}});
  const errs = []; p.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await p.route('**/api/**', (r) => r.fulfill({status: 500, body: '{}'}));
  if (NOIMG) await p.route(/\.(jpg|jpeg|png|webp)(\?|$)/, (r) => r.request().url().includes('/assets/s3/') ? r.fulfill({status: 404, body: ''}) : r.continue());
  await p.goto(BASE + `/${SLUG}.html`, {waitUntil: 'networkidle'}); await p.waitForTimeout(500);
  await p.click('#open'); await p.waitForTimeout(500);
  const probe = () => p.evaluate(() => {
    const vw = document.documentElement.clientWidth, wd = document.querySelector('#widget'), r = wd.getBoundingClientRect();
    const out = [...document.querySelectorAll('#advisor .option, #advisor a, #advisorFoot a, #advisorFoot button')].filter((e) => e.offsetParent).filter((e) => { const x = e.getBoundingClientRect(); return x.width && (x.right > r.right + 1 || x.left < r.left - 1); }).map((e) => e.textContent.trim().slice(0, 30));
    const broken = [...document.querySelectorAll('#advisor img')].filter((i) => i.complete && i.offsetParent && i.naturalWidth === 0 && !i.closest('.is-missing')).map((i) => i.src.slice(-50));
    const txt = document.querySelector('#advisor').innerText;
    return {hscroll: document.documentElement.scrollWidth > vw + 1, out, broken, bad: /undefined|NaN|\[object/.test(txt), cta: document.querySelector('#addToCart')?.getAttribute('href'), target: document.querySelector('#addToCart')?.getAttribute('target'), alt: /Pokud byste chtěli jinou|Ak by ste chceli inú|Další kávy|Ďalšie kávy/.test(txt), title: document.querySelector('#advisor h2, #advisor h3')?.textContent || ''};
  });
  for (const {seq, r} of seqs) {
    for (const [key, v] of seq) {
      const st = await probe(); screens++;
      if (st.hscroll || st.out.length || (!NOIMG && st.broken.length) || st.bad) fails.push(`${size} ${key}: ${JSON.stringify(st)}`);
      const sel = `#advisor button.option[data-value="${String(v).replace(/"/g, '\\"')}"]`;
      const ok = await p.waitForSelector(sel, {timeout: 4000}).then(async () => { await p.click(sel); return true; }).catch(() => false);
      if (!ok) { fails.push(`${size} chýba voľba ${key}=${v} (cesta ${JSON.stringify(seq)})`); break; }
      await p.waitForTimeout(260);
    }
    await p.waitForSelector('#addToCart', {timeout: 4000}).catch(() => {}); await p.waitForTimeout(200);
    const st = await probe(); screens++;
    const expect = (r.pack && r.pack.url) || r.product.url;
    if (st.cta !== expect) fails.push(`${size} ${JSON.stringify(seq)}: CTA ${st.cta} ≠ ${expect}`);
    if (st.target) fails.push(`${size}: CTA s target=${st.target}`);
    if (st.hscroll || st.out.length || (!NOIMG && st.broken.length) || st.bad) fails.push(`${size} výsledok ${JSON.stringify(seq)}: ${JSON.stringify(st)}`);
    const back = await p.waitForSelector('#restart', {timeout: 3000}).then(async () => { await p.click('#restart'); return true; }).catch(() => false);
    if (!back) fails.push(`${size}: chýba návrat (#restart)`);
    await p.waitForTimeout(300);
  }
  if (errs.length) fails.push(`${size} JS: ${errs.join(' | ')}`);
  await p.close();
}
await b.close();
console.log(`${SLUG} ${SIZES}${NOIMG ? ' bez fotiek' : ''}: ${seqs.length} ciest, ${screens} obrazoviek, nálezy ${fails.length}`);
if (fails.length) { console.log(fails.slice(0, 15).join('\n')); process.exitCode = 1; }
