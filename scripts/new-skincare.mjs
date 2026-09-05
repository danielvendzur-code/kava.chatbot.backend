/* Generates a complete skincare demo from data-nove/skincare-<slug>.json.
 *
 * The coffee demos each own a page; the skincare demos share cosmetics.html and
 * differ only by the entry in cosmetics-config.js, so a new brand is a data
 * change in five files that have to stay in step: the brand table, the redirect
 * page, the live chat catalogue, the router, and the cache rules. Doing that by
 * hand is how a demo ends up live with no chat and no cache policy, which is
 * exactly what happened to the first four coffee demos.
 *
 * Usage: node scripts/new-skincare.mjs data-nove/skincare-modrapupava.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const source = process.argv[2];
if (!source) {
  console.error('Použitie: node scripts/new-skincare.mjs data-nove/skincare-<slug>.json');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path.resolve(source), 'utf8'));
const problems = [];
const need = (condition, message) => { if (!condition) problems.push(message); };

const slug = String(data.slug || '');
need(/^[a-z][a-z0-9]{2,19}$/.test(slug), 'slug musí byť 3–20 malých písmen/číslic');

const products = Array.isArray(data.products) ? data.products : [];
need(products.length === 4, 'ukážka potrebuje presne štyri produkty (toľko ich nesie karta výsledku)');
need(Array.isArray(data.benefit) && data.benefit.length === 3, 'benefit musí mať tri body');

/* The four questions the advisor asks. A tag outside this list scores nothing
   and silently makes the product unreachable. */
const VOCAB = {
  skin: ['dry', 'oily', 'sensitive', 'balanced'],
  goal: ['hydrate', 'calm', 'clarity', 'mature'],
  routine: ['simple', 'basic', 'full', 'target'],
  texture: ['cream', 'serum', 'oil', 'any']
};
const ALL = Object.values(VOCAB).flat();

products.forEach((product, index) => {
  const where = `produkt ${index + 1}`;
  ['id', 'name', 'price', 'url', 'reason'].forEach((field) =>
    need(product[field], `${where}: chýba ${field}`));
  need(/^https:\/\//.test(product.url || ''), `${where}: url musí byť https odkaz na e-shop`);
  need(Array.isArray(product.tags) && product.tags.length >= 4, `${where}: potrebuje aspoň štyri tagy`);
  (product.tags || []).forEach((tag) => need(ALL.includes(tag),
    `${where}: tag "${tag}" neexistuje — použite: ${ALL.join(', ')}`));
  need(fs.existsSync(path.join(ROOT, 'assets/cosmetics', `${slug}-${product.id}.jpg`)),
    `assets/cosmetics/${slug}-${product.id}.jpg chýba — karta výsledku ukazuje fotku produktu, nie značky`);
});

need(fs.existsSync(path.join(ROOT, 'assets/cosmetics', `${slug}.jpg`)),
  `assets/cosmetics/${slug}.jpg chýba (hero fotka značky)`);

/* Every answer has to lead somewhere. A value no product carries drops every
   candidate by the same amount, so the advisor still answers — with whatever
   was first in the list, for no reason the visitor can see. */
Object.entries(VOCAB).forEach(([question, values]) => values.forEach((value) => {
  if (value === 'any') return;
  need(products.some((product) => (product.tags || []).includes(value)),
    `odpoveď "${value}" (${question}) nemá produkt — doplňte ju niektorému`);
}));

/* Two answers that land on the same product read as if the advisor knows one
   answer. The four skin types are the ones a visitor notices. */
const skinPicks = new Map();
VOCAB.skin.forEach((value) => {
  const hit = products.find((product) => (product.tags || []).includes(value));
  if (hit) skinPicks.set(value, hit.id);
});
need(new Set(skinPicks.values()).size >= 3,
  `štyri typy pleti vedú len na ${new Set(skinPicks.values()).size} produkty — rozložte tagy`);

/* The headline speaks to the shop owner, who is the one reading the demo. */
const title = String(data.ownerTitle || '');
need(title.length > 12 && title.length < 72, 'ownerTitle má mať 12–72 znakov');
need(!/\bvaša pleť|vašu pleť|vám sadne|vaše pleti\b/i.test(title),
  'ownerTitle je písaný zákazníkovi — otočte ho na majiteľa (Poraďte…, Doveďte…, Chatbot…)');
need(/chatbot|poradca|poradí/i.test(`${title} ${data.ownerText || ''}`),
  'ownerTitle ani ownerText nehovoria, čo to je — spomeňte chatbota alebo poradcu');

if (problems.length) {
  console.error(`${source} nie je kompletný:\n  ` + problems.join('\n  '));
  process.exit(1);
}

/* ------------------------------------------------------------------ shaping */

const { name, domain, website } = data.brand;
const c = data.colors;
const logo = ['svg', 'png', 'webp'].map((ext) => `assets/cosmetics/${slug}-logo.${ext}`)
  .find((file) => fs.existsSync(path.join(ROOT, file)));
const wordmark = logo
  ? `<img class="cx-wordmark cx-logo" src="/${logo}" alt="${name.replace(/"/g, '&quot;')}">`
  : `<span class="cx-wordmark cx-wordmark--${slug}">${data.wordmarkText || name}</span>`;

const line = (product) => `{id:'${product.id}',name:${JSON.stringify(product.name)},`
  + `price:${JSON.stringify(product.price)},url:${JSON.stringify(product.url)},`
  + `photo:'/assets/cosmetics/${slug}-${product.id}.jpg',`
  + `tags:[${product.tags.map((tag) => `'${tag}'`).join(',')}],`
  + `reason:${JSON.stringify(product.reason)}}`;

const entry = `    ${slug}: {\n`
  + `      name:${JSON.stringify(name)}, domain:${JSON.stringify(domain)}, website:${JSON.stringify(website)},\n`
  + `      theme:{brand:'${c.brand}',accent:'${c.accent}',soft:'${c.soft}',paper:'${c.paper}',ink:'${c.ink}',line:'${c.line}'},\n`
  + `      wordmark:${JSON.stringify(wordmark)},\n`
  + `      hero:'/assets/cosmetics/${slug}.jpg',\n`
  + `      ownerTitle:${JSON.stringify(data.ownerTitle)},\n`
  + `      ownerText:${JSON.stringify(data.ownerText)},\n`
  + `      benefit:[${data.benefit.map((item) => JSON.stringify(item)).join(',')}],\n`
  + `      products:[\n`
  + products.map((product) => `        ${line(product)}`).join(',\n') + '\n'
  + `      ]\n`
  + `    }`;

const written = [];

/* An entry that exists is replaced, so a wording change reaches the page
   instead of stopping at "it is already there". */
{
  const file = 'cosmetics-config.js';
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  const head = `    ${slug}: {`;
  const at = before.indexOf(head);
  let after;
  if (at === -1) {
    const open = before.indexOf('  const brands = {');
    const close = before.indexOf('\n  };', open);
    if (open === -1 || close === -1) throw new Error(`${file}: nenašiel som tabuľku brands`);
    after = `${before.slice(0, close)},\n${entry}${before.slice(close)}`;
  } else {
    const stop = before.indexOf('\n    }', at);
    if (stop === -1) throw new Error(`${file}: nenašiel som koniec záznamu ${slug}`);
    after = before.slice(0, at) + entry + before.slice(stop + '\n    }'.length);
  }
  if (after === before) console.log(`  ${file} (bez zmeny)`);
  else { fs.writeFileSync(full, after); written.push(file); console.log(`  ${file}${at === -1 ? '' : ' (aktualizované)'}`); }
}

/* The redirect page is what /<slug>/ serves; cosmetics.html reads the slug back
   out of the query string. */
const redirect = path.join(ROOT, slug, 'index.html');
fs.mkdirSync(path.dirname(redirect), { recursive: true });
fs.writeFileSync(redirect, `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${name}</title>
<link rel="canonical" href="/cosmetics.html?demo=${slug}">
<meta http-equiv="refresh" content="0;url=/cosmetics.html?demo=${slug}">
<script>location.replace('/cosmetics.html?demo=${slug}');</script>
</head>
<body><p>Presmerovanie na <a href="/cosmetics.html?demo=${slug}">${name}</a>…</p></body>
</html>
`);
written.push(`${slug}/index.html`);
console.log(`  ${slug}/index.html`);

/* A brand missing from api/cosmetics-chat.js gets "Unknown demo" and the page
   falls back to its offline answers, so the model never speaks for the shop. */
{
  const file = 'api/cosmetics-chat.js';
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  const pick = (tag) => products.find((product) => product.tags.includes(tag)) || products[0];
  const fallback = {
    dry: `Pri suchej alebo napnutej pleti je dobrý smer ${pick('dry').name}. Výber starostlivosti ešte zohľadní, či chcete krém, sérum alebo olej.`,
    oily: `Pri vyššej tvorbe mazu sa pozrite na ${pick('oily').name}. Výber ešte spresní vašu hlavnú prioritu.`,
    sensitive: `Pri citlivejšej pleti je z ponuky vhodný smer ${pick('sensitive').name}. Ak pokožka výrazne alebo dlhodobo reaguje, konzultujte starostlivosť s odborníkom.`,
    mature: `Pre zrelšiu pleť je priamy smer ${pick('mature').name}. Výber starostlivosti ešte zohľadní, ako komplexnú rutinu chcete.`,
    default: `Ak neviete, kde začať, prejdite Výber starostlivosti. Štyri krátke kroky zúžia ponuku ${name} na konkrétny produkt.`
  };
  const body = `  ${slug}:{brand:${JSON.stringify(name)},web:${JSON.stringify(website)},`
    + `products:[${products.map((product) => JSON.stringify(product.name)).join(',')}],`
    + `fallback:{${Object.entries(fallback).map(([key, text]) => `${key}:${JSON.stringify(text)}`).join(',')}}}`;
  const at = before.indexOf(`\n  ${slug}:{`);
  let after;
  if (at === -1) {
    const close = before.indexOf('\n};', before.indexOf('const DEMOS = {'));
    after = `${before.slice(0, close)},\n${body}${before.slice(close)}`;
  } else {
    const end = before.indexOf('\n', at + 1);
    after = before.slice(0, at + 1) + body + (before[end - 1] === ',' ? ',' : '') + before.slice(end);
  }
  if (after === before) console.log(`  ${file} (bez zmeny)`);
  else { fs.writeFileSync(full, after); written.push(file); console.log(`  ${file}`); }
}

/* The router keeps a cosmetics subdomain from landing on a roastery. */
{
  const file = 'coffee-final-entry.js';
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  if (before.includes(`'${slug}'`)) console.log(`  ${file} (už tam je)`);
  else {
    const after = before.replace(/(const SKINCARE = new Set\(\[)([^\]]*)(\]\))/,
      (whole, head, list, tail) => `${head}${list}, '${slug}'${tail}`);
    if (after === before) throw new Error(`${file}: nenašiel som zoznam SKINCARE`);
    fs.writeFileSync(full, after);
    written.push(file);
    console.log(`  ${file}`);
  }
}

/* A demo path with no cache policy is served from whatever the CDN still holds,
   which is how the live links kept showing an older build. */
{
  const file = 'vercel.json';
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  if (before.includes(`|${slug}|`) || before.includes(`|${slug})`)) console.log(`  ${file} (už tam je)`);
  else {
    const after = before.replaceAll('|anemone)', `|anemone|${slug})`);
    if (after === before) throw new Error(`${file}: nenašiel som zoznam ukážok`);
    JSON.parse(after);
    fs.writeFileSync(full, after);
    written.push(file);
    console.log(`  ${file}`);
  }
}

/* The index lists the demos and says how many there are. */
{
  const file = 'ukazky.html';
  const full = path.join(ROOT, file);
  let text = fs.readFileSync(full, 'utf8');
  if (text.includes(`href="/${slug}/"`)) console.log(`  ${file} (už tam je)`);
  else {
    const close = text.lastIndexOf('\n    </ul>');
    text = `${text.slice(0, close)}\n      <li><a href="/${slug}/">${name}</a></li>${text.slice(close)}`;
  }
  const counts = [...text.matchAll(/<ul>([\s\S]*?)<\/ul>/g)]
    .map((block) => (block[1].match(/<li>/g) || []).length);
  const word = (n) => ['nula', 'jedna', 'dve', 'tri', 'štyri', 'päť', 'šesť', 'sedem', 'osem',
    'deväť', 'desať', 'jedenásť', 'dvanásť', 'trinásť', 'štrnásť', 'pätnásť', 'šestnásť',
    'sedemnásť', 'osemnásť', 'devätnásť', 'dvadsať', 'dvadsaťjeden', 'dvadsaťdva',
    'dvadsaťtri', 'dvadsaťštyri'][n] || String(n);
  const total = counts.reduce((sum, n) => sum + n, 0);
  text = text.replace(/<p class="lead">[^<]*<\/p>/,
    `<p class="lead">${word(total).replace(/^./, (ch) => ch.toUpperCase())} ukážok — `
    + `${word(counts[0])} pražiarní a ${word(counts[1])} značiek starostlivosti.</p>`);
  const before = fs.readFileSync(full, 'utf8');
  if (text === before) console.log(`  ${file} (bez zmeny)`);
  else { fs.writeFileSync(full, text); written.push(file); console.log(`  ${file}`); }
}

/* A recommendation that ends at a 404 in the shop's own e-shop is the one
   defect a demo cannot survive. Node's fetch ignores the proxy this environment
   sets, so curl does the asking; no network means no check, never a failure. */
if (!process.argv.includes('--no-links')) {
  const links = [website, ...products.map((product) => product.url)];
  const codes = links.map((url) => {
    try {
      return execFileSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-L',
        '-m', '20', url], { encoding: 'utf8' }).trim();
    } catch { return '000'; }
  });
  if (codes.every((code) => code === '000')) console.log('\nOdkazy: bez siete, nekontrolované.');
  else {
    const broken = links.map((url, i) => [url, codes[i]]).filter(([, code]) => !/^2/.test(code));
    if (!broken.length) console.log(`\nOdkazy: ${links.length}× v poriadku.`);
    else broken.forEach(([url, code]) => console.log(`\nPOZOR: ${url} vracia ${code}`));
  }
}

execFileSync(process.execPath, [path.join(ROOT, 'scripts/stamp-assets.mjs')], { stdio: 'inherit' });
console.log(`\nHotové. Otvorte http://localhost:4400/${slug}/`);
