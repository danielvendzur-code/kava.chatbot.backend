/* Séria 3: rýchle voľby (4 rovnaké obdĺžniky 40 px, text celý viditeľný) a logo v kruhu správy (načítané, viditeľné, kontrast).
   node tools/s3a/chips-avatar.mjs BASE SLUG… [--shots DIR]   (/api/** blokované) */
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const args = process.argv.slice(2), BASE = args[0], SHOTS = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : '';
const slugs = args.slice(1).filter((a, i, all) => !a.startsWith('--') && all[i] !== SHOTS);
const b = await chromium.launch(); let bad = 0;
for (const slug of slugs) for (const [w, h] of [[320, 640], [390, 800], [1280, 800]]) {
  const p = await b.newPage({viewport: {width: w, height: h}});
  await p.route('**/api/**', (r) => r.fulfill({status: 500, body: '{}'}));
  await p.goto(`${BASE}/cosmetics.html?demo=${slug}`, {waitUntil: 'networkidle'}); await p.waitForTimeout(300);
  await p.click('[data-open="chat"]'); await p.waitForSelector('.cx-chips .cx-chip'); await p.waitForTimeout(500);
  const r = await p.evaluate(async () => {
    const chips = [...document.querySelectorAll('#cx-widget .cx-chips .cx-chip')].map((c) => { const x = c.getBoundingClientRect(); return {w: Math.round(x.width * 10) / 10, h: Math.round(x.height * 10) / 10, clip: c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1, t: c.textContent}; });
    const av = document.querySelector('#cx-widget .cx-message-avatar'); const cs = getComputedStyle(av), after = getComputedStyle(av, '::after');
    const img = av.querySelector('img'); const ar = av.getBoundingClientRect();
    /* ktorý obrázok kruh naozaj ukazuje: pseudo-prvok (znak), pozadie alebo <img> */
    const urlOf = (v) => (String(v).match(/url\("?([^")]+)"?\)/) || [])[1] || '';
    const src = urlOf(after.webkitMaskImage || after.maskImage) || urlOf(cs.backgroundImage) || (img && getComputedStyle(img).visibility !== 'hidden' ? img.currentSrc : '');
    let loaded = false, w = 0; if (src) { const i = new Image(); i.src = src; try { await i.decode(); loaded = i.naturalWidth > 0; w = i.naturalWidth; } catch (_) {} }
    return {chips, avatar: {w: ar.width, h: ar.height, bg: cs.backgroundColor, mode: after.content !== 'none' && (after.webkitMaskImage || after.maskImage) !== 'none' ? 'znak (biela maska)' : urlOf(cs.backgroundImage) ? 'pozadie' : img ? 'img' : 'nič', src, loaded}};
  });
  const ws = r.chips.map((c) => c.w), hs = r.chips.map((c) => c.h);
  const okChips = r.chips.length === 4 && Math.max(...ws) - Math.min(...ws) < 0.6 && hs.every((x) => Math.abs(x - 40) < 0.6) && !r.chips.some((c) => c.clip);
  const okAv = r.avatar.src && r.avatar.loaded && r.avatar.w > 0;
  if (!okChips || !okAv) bad++;
  console.log(`${slug} ${w}px chipy ${okChips ? 'OK' : 'CHYBA'} ${JSON.stringify(r.chips.map((c) => [c.w, c.h, c.clip ? 'orezané' : '']))} · avatar ${okAv ? 'OK' : 'CHYBA'} ${r.avatar.mode} ${r.avatar.bg} ${r.avatar.src.split('/').pop()}`);
  if (SHOTS && w === 390) { const box = await p.locator('#cx-widget').boundingBox(); await p.screenshot({path: `${SHOTS}/${slug}-chat-390.png`, clip: box}); }
  await p.close();
}
await b.close(); if (bad) process.exitCode = 1;
