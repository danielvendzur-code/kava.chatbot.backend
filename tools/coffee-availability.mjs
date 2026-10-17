#!/usr/bin/env node
// Re-checks every coffee in a catalogue against its live product page and reports, or with
// --write saves, which ones the shop does not sell right now.
// Usage: node tools/coffee-availability.mjs <slug>[,<slug>...] [--write]
//
// A coffee counts as available only when the page's own schema.org offer says InStock,
// LimitedAvailability or OnlineOnly. PreOrder ("Momentálne pražíme, čoskoro naskladníme" on
// Kávoholik), BackOrder, OutOfStock, SoldOut, Discontinued and a missing page (404/410) all
// count as not available, and so does the visible stock text when the page has no offer data.
// A missing page also marks the coffee as gone: the shop no longer offers it at all.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELLING = /schema\.org\/(InStock|LimitedAvailability|OnlineOnly|InStoreOnly)$/i;
const NOT_SELLING = /schema\.org\/(PreOrder|PreSale|BackOrder|OutOfStock|SoldOut|Discontinued)$/i;
const NOT_SELLING_TEXT = /Momentálne pražíme|čoskoro naskladníme|Momentálne nedostupn|Vypredané|Nie je (?:na )?sklad|Není skladem|Vyprodáno/i;

const [slugArg, ...flags] = process.argv.slice(2);
if (!slugArg) { console.error('Usage: node tools/coffee-availability.mjs <slug>[,<slug>...] [--write]'); process.exit(1); }
const write = flags.includes('--write');

function load(slug) {
  const file = path.join(ROOT, 'coffee-catalogues', slug + '.js');
  const sandbox = {globalThis: {}};
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

function offerStates(product) {
  const offers = [].concat(product.offers || [], ...[].concat(product.hasVariant || []).map(v => [].concat(v.offers || [])));
  return offers.flatMap(o => [].concat(o.offers || o)).map(o => String(o.availability || '')).filter(Boolean);
}

async function check(url) {
  let res;
  try { res = await fetch(url, {headers: {'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'accept-language': 'sk-SK,sk;q=0.9'}, redirect: 'follow', signal: AbortSignal.timeout(30000)}); }
  catch (e) { return {available: null, why: 'fetch failed: ' + e.message}; }
  if (res.status === 404 || res.status === 410) return {available: false, gone: true, why: 'HTTP ' + res.status};
  if (!res.ok) return {available: null, why: 'HTTP ' + res.status};
  const html = await res.text();
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m => { try { return JSON.parse(m[1].trim()); } catch { return null; } }).filter(Boolean);
  // The page's own product is the first Product in its structured data; related products come later.
  const own = products(blocks)[0];
  let states = own ? offerStates(own) : [];
  let prices = own ? [].concat(own.offers || []).flatMap(o => [].concat(o.offers || o)).map(o => Number(o.price ?? o.lowPrice)).filter(Number.isFinite) : [];
  if (!states.length) {
    // Shoptet, Upgates and similar shops mark the offer with microdata: inside the page's first
    // Product, or as the first Offer when the page has no Product item.
    const starts = [...html.matchAll(/itemtype="https?:\/\/schema\.org\/Product"/gi)].map(m => m.index);
    const offer = html.search(/itemtype="https?:\/\/schema\.org\/Offer"/i);
    const part = starts.length ? html.slice(starts[0], starts[1] ?? html.length) : offer >= 0 ? html.slice(offer, offer + 4000) : '';
    states = [...part.matchAll(/itemprop="availability"[^>]*?(?:href|content)="([^"]+)"/gi)].map(m => m[1]);
    prices = [...part.matchAll(/itemprop="price"[^>]*?content="([^"]+)"/gi)].map(m => Number(m[1].replace(',', '.'))).filter(Number.isFinite);
  }
  // An offer at 0 € with no way to buy it (Grand Roastery's free samples) is not a sale.
  if (prices.length && prices.every(v => v === 0)) return {available: false, why: 'offer price 0 €'};
  if (states.some(s => SELLING.test(s))) return {available: true, why: states.join(' ')};
  if (states.length && states.every(s => NOT_SELLING.test(s))) return {available: false, why: states.join(' ')};
  const h1 = html.search(/<h1[\s>]/i);
  const near = h1 >= 0 ? html.slice(h1, h1 + 20000).replace(/<[^>]+>/g, ' ') : '';
  if (NOT_SELLING_TEXT.test(near)) return {available: false, why: 'text: ' + near.match(NOT_SELLING_TEXT)[0]};
  return {available: states.length ? null : true, why: states.length ? 'unknown offer: ' + states.join(' ') : 'no offer data, no stock warning'};
}

for (const slug of slugArg.split(',')) {
  const {file, catalogue} = load(slug);
  const list = catalogue.products.filter(p => p.url && (!p.kind || p.kind === 'Káva'));
  const changes = [];
  for (let i = 0; i < list.length; i += 4) {
    await Promise.all(list.slice(i, i + 4).map(async p => {
      const r = await check(p.url);
      if (r.available === null) { console.log(`?  ${slug} ${p.name} — ${r.why}`); return; }
      if (r.available !== (p.available !== false) || (r.gone || false) !== (p.gone || false)) changes.push({p, r});
    }));
  }
  for (const {p, r} of changes) console.log(`${r.available ? '+ ' : '- '} ${slug} ${p.name} — ${r.why}`);
  console.log(`${slug}: ${list.length} coffees checked, ${changes.length} change(s)`);
  if (write && changes.length) {
    const now = new Date().toISOString();
    for (const {p, r} of changes) { p.available = r.available; if (r.gone) p.gone = true; else delete p.gone; p.verifiedAt = now; }
    fs.writeFileSync(file, `globalThis.CX_COFFEE_CATALOGUES ||= {};\nglobalThis.CX_COFFEE_CATALOGUES[${JSON.stringify(slug)}] = ${JSON.stringify(catalogue)};\n`);
  }
}
