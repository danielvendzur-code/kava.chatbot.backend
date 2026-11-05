/* Séria 3: chat bez platených volaní. (1) offline – /api zlyhá, odpovie overené jadro v prehliadači; (2) mock servera s oneskorením.
   Kontrola: tri bodky počas čakania, odpoveď, karty produktov z katalógu firmy, odkazy v rovnakej karte, žiadna cudzia firma.
   node tools/s3a/chat-mock.mjs BASE SLUG… */
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const [BASE, ...slugs] = process.argv.slice(2);
const b = await chromium.launch(); let bad = 0;
for (const slug of slugs) for (const mode of ['offline', 'mock']) {
  const p = await b.newPage({viewport: {width: 390, height: 800}});
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  let calls = 0;
  await p.goto(`${BASE}/cosmetics.html?demo=${slug}`, {waitUntil: 'networkidle'});
  const first = await p.evaluate(() => { const b = window.COSMETICS_DEMOS.brands[document.body.dataset.cosmeticsDemo]; return (b.catalogue || [])[0]; });
  await p.route('**/api/**', async (r) => { calls++; await new Promise((x) => setTimeout(x, 900)); if (mode === 'offline') return r.fulfill({status: 503, body: '{}'}); return r.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({reply: 'Odporúčam ' + first.name + ' – ' + first.price + '.\n' + first.url})}); });
  await p.click('[data-open="chat"]'); await p.waitForSelector('.cx-chips .cx-chip');
  await p.click('.cx-chips .cx-chip >> nth=0');
  const typing = await p.waitForSelector('#cx-widget .lg-typing', {timeout: 3000}).then(() => true).catch(() => false);
  await p.waitForFunction(() => !document.querySelector('#cx-widget .lg-typing'), null, {timeout: 15000}).catch(() => {});
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const last = [...document.querySelectorAll('.cx-message--assistant')].pop(); const links = [...last.querySelectorAll('a')];
    return {text: last.innerText.slice(0, 160).replace(/\n/g, ' '), cards: last.querySelectorAll('.lg-wine-card').length, links: links.map((a) => a.href), blank: links.some((a) => a.target === '_blank')}; });
  const ok = typing && r.text.length > 20 && !r.blank && !/undefined|NaN/.test(r.text) && (mode === 'offline' || r.cards > 0) && !errs.length;
  if (!ok) bad++;
  console.log(`${slug} ${mode}: ${ok ? 'OK' : 'CHYBA'} bodky=${typing} karty=${r.cards} volania=${calls} nová karta=${r.blank} · ${r.text}`);
  await p.close();
}
await b.close(); if (bad) process.exitCode = 1;
