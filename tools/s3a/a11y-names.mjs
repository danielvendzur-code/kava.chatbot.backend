/* Séria 3: prístupné názvy a texty stránky podľa segmentu – pri káve a čaji žiadna „starostlivosť / péče / pleť“.
   Kontroluje aria-label, title, alt a viditeľný text úvodu, teasera, spúšťača a widgetu. node tools/s3a/a11y-names.mjs BASE SLUG…  (/api/** blokované) */
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const REG = require('./registry.json').demos;
const [BASE, ...slugs] = process.argv.slice(2);
const WRONG = /starostliv|péč|pece\b|pleť|pleti\b|kozmetik|kosmetik|skincare/i;
const b = await chromium.launch(); let bad = 0;
for (const slug of slugs) {
  const seg = REG[slug].type === 'coffee' ? 'coffee' : REG[slug].segment || 'cosmetics';
  const p = await b.newPage({viewport: {width: 390, height: 800}});
  await p.route('**/api/**', (r) => r.fulfill({status: 500, body: '{}'}));
  await p.goto(`${BASE}/cosmetics.html?demo=${slug}`, {waitUntil: 'networkidle'}); await p.waitForTimeout(400);
  const grab = () => p.evaluate(() => {
    const out = [];
    for (const e of document.querySelectorAll('[aria-label],[title],img[alt]')) for (const a of ['aria-label', 'title', 'alt']) { const v = e.getAttribute(a); if (v) out.push(a + ': ' + v); }
    out.push('title: ' + document.title);
    return {attrs: out, text: document.body.innerText};
  });
  const s1 = await grab();
  await p.click('[data-open="chat"]').catch(() => {}); await p.waitForTimeout(400);
  const s2 = await grab();
  const teaser = await p.evaluate(() => document.querySelector('.cx-teaser-open')?.getAttribute('aria-label') || document.querySelector('#cx-teaser')?.getAttribute('aria-label') || '');
  const all = [...new Set([...s1.attrs, ...s2.attrs])];
  const hits = !['coffee', 'tea'].includes(seg) ? [] : [...all.filter((x) => WRONG.test(x)), ...[s1.text, s2.text].join('\n').split('\n').filter((l) => WRONG.test(l)).map((l) => 'text: ' + l.trim().slice(0, 80))];
  if (hits.length) bad++;
  console.log(`${slug} (${seg}) teaser „${teaser}“ · ${hits.length ? 'NÁLEZY: ' + [...new Set(hits)].slice(0, 6).join(' | ') : 'OK'}`);
  await p.close();
}
await b.close(); process.exitCode = bad ? 1 : 0;
