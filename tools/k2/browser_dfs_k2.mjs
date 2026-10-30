/* k2 – prehliadačová kontrola výberu: prejde VŠETKY cesty (DFS cez tlačidlá rozhrania) danej ukážky na danom rozmere.
   node tools/k2/browser_dfs_k2.mjs BASE SLUG WxH[,WxH…]   (/api/** je blokované – 0 platených volaní)
   Kontroluje na každej obrazovke: vodorovné posúvanie, voľby/odkazy mimo okna, rozbité obrázky, „undefined/NaN“, chyby JS,
   výsledok s produktom a odkazom na e-shop v tej istej karte (bez target=_blank), nadpis „Celá rutina“ pri darčekovej sade. */
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)('playwright');
const [BASE, SLUG, SIZES] = process.argv.slice(2);
const PROBE = () => {
  const w = document.querySelector('#cx-widget'), r = w.getBoundingClientRect(), st = document.querySelector('.cx-quality-stage');
  const clipped = [...st.querySelectorAll('.cx-catalogue-option, a, button')].filter((e) => e.offsetParent !== null)
    .filter((e) => { const b = e.getBoundingClientRect(); return b.width && (b.right > r.right + 1 || b.left < r.left - 1); }).map((e) => e.textContent.trim().slice(0, 30));
  const choices = [...st.querySelectorAll('[data-choice]')].map((b) => b.dataset.choice);
  return {hscroll: document.documentElement.scrollWidth - innerWidth, clipped, choices, next: !!st.querySelector('[data-page-next]'),
    broken: [...st.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0 && !/placeholder/.test(i.src)).map((i) => i.getAttribute('src')),
    title: st.querySelector('h2')?.textContent || '', text: st.innerText,
    links: [...st.querySelectorAll('.cx-quality-product a[href]')].map((a) => ({href: a.href, target: a.target}))};
};
const browser = await chromium.launch();
const report = {};
for (const size of SIZES.split(',')) {
  const [W, H] = size.split('x').map(Number);
  const page = await browser.newPage({viewport: {width: W, height: H}});
  const errs = []; page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await page.route('**/api/**', (r) => r.abort());
  await page.goto(`${BASE}/${SLUG}.html`, {waitUntil: 'networkidle'}); await page.waitForTimeout(500);
  await page.evaluate(() => document.querySelector('[data-open="advisor"]')?.click()); await page.waitForTimeout(600);
  const shop = await page.evaluate((s) => new URL(window.COSMETICS_DEMOS.brands[s].website).hostname.replace('www.', ''), SLUG);
  const issues = []; let screens = 0, results = 0;
  const restart = async () => { await page.evaluate(() => document.querySelector('#cx-reset')?.click()); await page.waitForTimeout(120); };
  const choose = async (v) => {
    for (let i = 0; i < 12; i++) {
      const ok = await page.evaluate((v) => { const b = [...document.querySelectorAll('.cx-quality-stage [data-choice]')].find((x) => x.dataset.choice === v); if (b) { b.click(); return 1; } const n = document.querySelector('.cx-quality-stage [data-page-next]'); if (n) { n.click(); return 2; } return 0; }, v);
      await page.waitForTimeout(90);
      if (ok === 1) return true; if (!ok) return false;
    }
    return false;
  };
  const allChoices = async () => { // všetky voľby otázky vrátane ďalších strán
    const out = []; let pr = await page.evaluate(PROBE); out.push(...pr.choices); let first = pr;
    while (pr.next) { await page.evaluate(() => document.querySelector('.cx-quality-stage [data-page-next]').click()); await page.waitForTimeout(90); pr = await page.evaluate(PROBE); out.push(...pr.choices); }
    return {list: out, first};
  };
  const check = (pr, trail) => {
    const where = `${size} ${trail.join(' > ')}`; screens++;
    if (pr.hscroll > 1) issues.push('hscroll ' + where);
    if (pr.clipped.length) issues.push(`clipped ${pr.clipped.slice(0, 2)} ${where}`);
    if (pr.broken.length) issues.push(`broken ${pr.broken[0]} ${where}`);
    if (/undefined|NaN|\[object/.test(pr.text)) issues.push('bad text ' + where);
  };
  const stack = [[]];
  while (stack.length) {
    const trail = stack.pop();
    await restart();
    let ok = true; for (const v of trail) if (!(await choose(v))) { ok = false; issues.push('replay ' + trail.join(' > ')); break; }
    if (!ok) continue;
    const {list, first} = await allChoices();
    // späť na prvú stranu otázky kvôli kontrole prvej obrazovky
    check(first, trail);
    if (!list.length) {
      results++;
      const pr = await page.evaluate(PROBE); check(pr, trail);
      if (!pr.links.length) issues.push(`výsledok bez produktu ${size} ${trail.join(' > ')}`);
      for (const l of pr.links) { const h = new URL(l.href).hostname.replace('www.', ''); if (h !== shop) issues.push('cudzí odkaz ' + l.href); if (l.target && l.target !== '_self') issues.push('nová karta ' + l.href); }
      if (/Celá rutina v hotovej sade|Celá rutina v hotové sadě/.test(pr.text) && /Darčekov|Dárkov/.test(pr.text.split(/Celá rutina/)[1]?.slice(0, 200) || '')) issues.push('darčeková sada ako celá rutina ' + trail.join(' > '));
      continue;
    }
    for (const v of [...new Set(list)].reverse()) stack.push([...trail, v]);
  }
  report[size] = {screens, results, issues: issues.slice(0, 8), issueCount: issues.length, errors: errs.slice(0, 3)};
  console.log(SLUG, size, `obrazovky ${screens}, výsledky ${results}, nálezy ${issues.length}, chyby JS ${errs.length}`, issues.slice(0, 3).join(' | '));
  await page.close();
}
await browser.close();
process.exit(Object.values(report).some((r) => r.issueCount || r.errors.length) ? 1 : 0);
