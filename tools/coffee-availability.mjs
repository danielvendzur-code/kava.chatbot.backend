#!/usr/bin/env node
// Re-checks every coffee in a catalogue against its live product page and reports, or with
// --write saves, which coffees and which pack sizes the shop sells right now, and at what price.
// Usage: node tools/coffee-availability.mjs <slug>[,<slug>...] [--write]
//
// A coffee counts as available only when the shop sells at least one of its packs now.
// - Shoptet shops (Ready After, Coffee Sheep, Coffee Veronia) publish every variant's price and
//   stock in the page itself; each pack is read from there.
// - PrestaShop (Kávoholik) and Upgates (Grand Roastery) show a pack's stock and price only after it
//   is chosen, so for a coffee with several packs each one is chosen in a browser (Playwright;
//   set PLAYWRIGHT_MODULE to its path when it is not installed in this project).
// - Otherwise the page's own schema.org offer decides: InStock, LimitedAvailability or OnlineOnly
//   sell; PreOrder ("Momentálne pražíme, čoskoro naskladníme"), BackOrder, OutOfStock, SoldOut and
//   Discontinued do not, nor does an offer at 0 € with no way to buy it.
// A missing page (404/410) marks the coffee as gone: the shop no longer offers it at all.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELLING = /schema\.org\/(InStock|LimitedAvailability|OnlineOnly|InStoreOnly)$/i;
const NOT_SELLING = /schema\.org\/(PreOrder|PreSale|BackOrder|OutOfStock|SoldOut|Discontinued)$/i;
const NOT_SELLING_TEXT = /Momentálne pražíme|čoskoro naskladníme|Momentálne nedostupn|Vypredané|Nie je (?:na )?sklad|Není skladem|Vyprodáno/i;
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const [slugArg, ...flags] = process.argv.slice(2);
if (!slugArg) { console.error('Usage: node tools/coffee-availability.mjs <slug>[,<slug>...] [--write]'); process.exit(1); }
const write = flags.includes('--write');

const grams = s => { const m = String(s || '').match(/(?:(\d+)\s*[x×]\s*)?([\d.,]+)\s*(kg|g)\b/i); return m ? Math.round(Number(m[2].replace(',', '.')) * (/kg/i.test(m[3]) ? 1000 : 1) * Number(m[1] || 1)) : null; };
const euro = s => Number(String(s || '').replace(/[^\d,.]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
const money = v => v.toFixed(2).replace('.', ',') + ' €';
const packLabel = g => g >= 1000 ? (g / 1000 + ' kg').replace('.', ',') : g + ' g';

function load(slug) {
  const file = path.join(ROOT, 'coffee-catalogues', slug + '.js');
  const sandbox = {};
  sandbox.globalThis = sandbox;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox);
  return {file, catalogue: sandbox.CX_COFFEE_CATALOGUES[slug]};
}

function products(node, out = []) {
  if (Array.isArray(node)) node.forEach(n => products(n, out));
  else if (node && typeof node === 'object') {
    const type = [].concat(node['@type'] || []);
    if (type.includes('Product') || type.includes('ProductGroup')) out.push(node);
    for (const k of ['@graph', 'hasVariant', 'mainEntity']) if (node[k]) products(node[k], out);
  }
  return out;
}
const offersOf = product => [].concat(product.offers || [], ...[].concat(product.hasVariant || []).map(v => [].concat(v.offers || []))).flatMap(o => [].concat(o.offers || o));

/* Shoptet: every variant's price and stock are in shoptet.variantsSplit.necessaryVariantData. */
function shoptetPacks(html) {
  const data = html.match(/necessaryVariantData = (\{[\s\S]*?\});\s*\n/);
  if (!data) return null;
  const sizes = {};
  for (const m of html.matchAll(/<option value="(\d+)"[^>]*>\s*([\d.,]+\s*(?:g|kg))\s*</gi)) sizes[m[1]] = grams(m[2]);
  const packs = {};
  for (const [key, v] of Object.entries(JSON.parse(data[1]))) {
    const g = key.split('-').map(k => sizes[k]).find(Boolean);
    if (!g) continue;
    const price = Math.round(v.priceUnformatted * 100) / 100;
    const p = packs[g] || (packs[g] = {grams: g, price, available: false});
    p.price = Math.min(p.price, price);
    p.available = p.available || !!v.isNotSoldOut;
  }
  const list = Object.values(packs);
  return list.length ? list : null;
}

let browser = null, launching = null;
async function page() {
  if (browser === null) launching ||= (async () => {
    const pw = await import(process.env.PLAYWRIGHT_MODULE || 'playwright').catch(() => import('@playwright/test')).catch(() => null);
    browser = pw ? await pw.chromium.launch(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}).catch(() => false) : false;
  })();
  await launching;
  return browser ? (await browser.newContext({locale: 'sk-SK', userAgent: UA, viewport: {width: 1280, height: 900}})).newPage() : null;
}

/* PrestaShop and Upgates: choose each pack on the page and read its price and stock. */
async function browserPacks(url, kind) {
  const p = await page();
  if (!p) return null;
  try {
    await p.goto(url, {waitUntil: 'domcontentloaded', timeout: 60000});
    await p.waitForTimeout(3000);
    const packs = [];
    if (kind === 'prestashop') {
      // Weight is a radio list or a drop-down, depending on the product.
      const opts = await p.$$eval('.product-variants input[type=radio], .product-variants select option', els => els.map(e => ({tag: e.tagName, name: e.name || e.parentElement.name, v: e.value, t: (e.tagName === 'OPTION' ? e.textContent : e.closest('li,label')?.innerText || '').trim()})));
      if (!opts.length) opts.push({tag: 'NONE', t: ''});
      for (const o of opts) {
        if (o.tag === 'NONE') {}
        else if (o.tag === 'OPTION') await p.selectOption(`select[name="${o.name}"]`, o.v);
        else await p.evaluate(({name, v}) => document.querySelector(`input[name="${name}"][value="${v}"]`).click(), o);
        await p.waitForTimeout(2000);
        const r = await p.evaluate(() => ({price: document.querySelector('.current-price [itemprop=price], .current-price-value, .current-price span')?.innerText || '', stock: document.querySelector('#product-availability')?.innerText || '', cart: !!document.querySelector('button.add-to-cart:not([disabled])')}));
        packs.push({grams: grams(o.t), price: euro(r.price), available: r.cart && !NOT_SELLING_TEXT.test(r.stock)});
      }
    } else {
      const opts = await p.$$eval('a[data-option-id][data-attr-value-id]', as => as.map(a => { const sel = document.querySelector(`select[name="options[${a.dataset.optionId}]"]`); const o = sel && [...sel.options].find(x => x.value === a.dataset.attrValueId); return {id: a.id, t: o ? o.text.trim() : ''}; }));
      for (const o of opts) {
        await p.evaluate(id => document.getElementById(id).click(), o.id);
        await p.waitForTimeout(2200);
        const r = await p.evaluate(() => ({price: document.querySelector('.pd-prices-main strong')?.innerText || '', form: document.querySelector('#frm-productForm')?.innerText || '', cart: !![...document.querySelectorAll('button, input[type=submit]')].find(e => /do košíka/i.test(e.innerText || e.value || '') && !e.disabled)}));
        packs.push({grams: grams(o.t), label: o.t, price: euro(r.price), available: r.cart && !/Vypredan/i.test(r.form)});
      }
    }
    return packs.length ? packs : null;
  } catch { return null; } finally { await p.context().close(); }
}

async function check(p) {
  let res;
  try { res = await fetch(p.url, {headers: {'user-agent': UA, 'accept-language': 'sk-SK,sk;q=0.9'}, redirect: 'follow', signal: AbortSignal.timeout(30000)}); }
  catch (e) { return {available: null, why: 'fetch failed: ' + e.message}; }
  if (res.status === 404 || res.status === 410) return {available: false, gone: true, why: 'HTTP ' + res.status};
  if (!res.ok) return {available: null, why: 'HTTP ' + res.status};
  const html = await res.text();
  const several = (p.variants || []).length > 1 || /viac balen/i.test(p.priceUnit || '');
  const platform = /var prestashop\s*=/.test(html) ? 'prestashop' : /cdn-upgates\.com/.test(html) ? 'upgates' : '';
  const packs = shoptetPacks(html) || (several && platform ? await browserPacks(p.url, platform) : null);
  // A page with one pack does not name it; the catalogue already knows its size.
  if (packs && packs.length === 1 && !packs[0].grams) packs[0].grams = grams(p.priceUnit) || grams(p.name) || p.variants?.[0]?.grams || null;
  if (packs) {
    if (packs.every(k => k.price === 0)) return {available: false, why: 'offer price 0 €'};
    const live = packs.filter(k => k.available);
    return {available: live.length > 0, packs, why: packs.map(k => `${k.grams ?? k.label}:${k.price}${k.available ? '' : ' (nie)'}`).join(', ')};
  }
  if (several && platform) return {available: null, why: 'packs need a browser (install Playwright or set PLAYWRIGHT_MODULE)'};
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => { try { return JSON.parse(m[1].trim()); } catch { return null; } }).filter(Boolean);
  // The page's own product is the first Product in its structured data; related products come later.
  const own = products(blocks)[0];
  let states = own ? offersOf(own).map(o => String(o.availability || '')).filter(Boolean) : [];
  let prices = own ? offersOf(own).map(o => Number(o.price ?? o.lowPrice)).filter(Number.isFinite) : [];
  if (!states.length) {
    // Microdata: inside the page's first Product, or the first Offer when the page has no Product item.
    const starts = [...html.matchAll(/itemtype="https?:\/\/schema\.org\/Product"/gi)].map(m => m.index);
    const offer = html.search(/itemtype="https?:\/\/schema\.org\/Offer"/i);
    const part = starts.length ? html.slice(starts[0], starts[1] ?? html.length) : offer >= 0 ? html.slice(offer, offer + 4000) : '';
    states = [...part.matchAll(/itemprop="availability"[^>]*?(?:href|content)="([^"]+)"/gi)].map(m => m[1]);
    prices = [...part.matchAll(/itemprop="price"[^>]*?content="([^"]+)"/gi)].map(m => Number(m[1].replace(',', '.'))).filter(Number.isFinite);
  }
  if (prices.length && prices.every(v => v === 0)) return {available: false, why: 'offer price 0 €'};
  if (states.some(s => SELLING.test(s))) return {available: true, why: states.join(' ')};
  if (states.length && states.every(s => NOT_SELLING.test(s))) return {available: false, why: states.join(' ')};
  const h1 = html.search(/<h1[\s>]/i);
  const near = h1 >= 0 ? html.slice(h1, h1 + 20000).replace(/<[^>]+>/g, ' ') : '';
  if (NOT_SELLING_TEXT.test(near)) return {available: false, why: 'text: ' + near.match(NOT_SELLING_TEXT)[0]};
  return {available: states.length ? null : true, why: states.length ? 'unknown offer: ' + states.join(' ') : 'no offer data, no stock warning'};
}

/* Pack prices and stock into the catalogue record; the shown price is the smallest regular pack on sale. */
function applyPacks(p, packs) {
  // A pack is matched to a catalogue variant by its edition name (Grand Roastery "Sissi") or else by size.
  const match = v => packs.find(k => k.label && v.extra && k.label.toLowerCase().includes(String(v.extra).toLowerCase()) && (!k.grams || k.grams === v.grams)) || packs.find(k => k.grams && k.grams === v.grams);
  for (const v of p.variants || []) {
    const k = match(v);
    if (!k) { v.available = false; continue; }
    v.price = k.price; v.priceLabel = money(k.price); v.available = k.available;
  }
  if (!(p.variants || []).length && packs.length > 1) p.variants = packs.filter(k => k.grams).map(k => ({grams: k.grams, price: k.price, extra: null, available: k.available, grind: 'beans', label: packLabel(k.grams), priceLabel: money(k.price)}));
  const live = (p.variants || []).length ? p.variants.filter(v => v.available && Number.isFinite(v.price)) : packs.filter(k => k.available);
  const regular = live.filter(k => !k.grams || k.grams >= 150);
  const base = regular.length ? regular : live;
  if (!base.length) return;
  const min = Math.min(...base.map(k => k.price));
  p.priceAmount = min;
  p.price = (new Set(base.map(k => k.price)).size > 1 ? 'od ' : '') + money(min);
  p.priceFrom = p.price;
  const sizes = [...new Set(base.map(k => k.grams).filter(Boolean))].sort((x, y) => x - y);
  if (sizes.length && !base.some(k => k.extra)) { p.weights = sizes.map(packLabel).join(', '); p.priceUnit = sizes.length > 1 ? 'Viac balení' : packLabel(sizes[0]); }
}

for (const slug of slugArg.split(',')) {
  const {file, catalogue} = load(slug);
  const list = catalogue.products.filter(p => p.url && (!p.kind || p.kind === 'Káva'));
  const changes = [];
  let packChanges = 0;
  for (let i = 0; i < list.length; i += 3) {
    await Promise.all(list.slice(i, i + 3).map(async p => {
      const r = await check(p);
      if (r.available === null) { console.log(`?  ${slug} ${p.name} — ${r.why}`); return; }
      if (r.packs) {
        const before = JSON.stringify([p.price, (p.variants || []).map(v => [v.price, v.available])]);
        const copy = JSON.parse(JSON.stringify(p));
        applyPacks(copy, r.packs);
        if (JSON.stringify([copy.price, (copy.variants || []).map(v => [v.price, v.available])]) !== before) { packChanges++; console.log(`~  ${slug} ${p.name} — ${r.why}`); if (write) applyPacks(p, r.packs); }
      }
      if (r.available !== (p.available !== false) || (r.gone || false) !== (p.gone || false)) changes.push({p, r});
    }));
  }
  for (const {p, r} of changes) console.log(`${r.available ? '+ ' : '- '} ${slug} ${p.name} — ${r.why}`);
  console.log(`${slug}: ${list.length} coffees checked, ${changes.length} availability change(s), ${packChanges} pack change(s)`);
  if (write && (changes.length || packChanges)) {
    const now = new Date().toISOString();
    for (const {p, r} of changes) { p.available = r.available; if (r.gone) p.gone = true; else delete p.gone; p.verifiedAt = now; }
    fs.writeFileSync(file, `globalThis.CX_COFFEE_CATALOGUES ||= {};\nglobalThis.CX_COFFEE_CATALOGUES[${JSON.stringify(slug)}] = ${JSON.stringify(catalogue)};\n`);
  }
}
if (browser) await browser.close();
