/**
 * Build a complete roastery demo from one data file.
 *
 *   node scripts/new-demo.mjs data-nove/<slug>.json
 *
 * A demo is eight things — the data module, the theme, the page, two path
 * stubs, an entry in the owner page's brand table, the slug in the router, and
 * a row in the index — and a demo that is missing any one of them looks fine
 * until the moment a client opens it. They are written from a single source
 * here, and the script refuses to write anything until the data and the
 * photographs it names are complete.
 *
 * The four advisor steps are the same four questions on every roastery, and
 * the runtime already resolves their photographs from /assets/choice, so a
 * brand supplies only its own logo, one hero photograph and one per product.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const source = process.argv[2];
if (!source) { console.error('usage: node scripts/new-demo.mjs data-nove/<slug>.json'); process.exit(2); }

const data = JSON.parse(fs.readFileSync(path.resolve(ROOT, source), 'utf8'));
const problems = [];
const need = (cond, message) => { if (!cond) problems.push(message); };
const text = (value) => typeof value === 'string' && value.trim() !== '';

/* ------------------------------------------------------------------ checks */

const slug = data.slug;
need(/^[a-z0-9-]+$/.test(slug || ''), 'slug musí byť kebab-case');
need(data.brand && text(data.brand.name), 'brand.name chýba');
need(data.brand && text(data.brand.place), 'brand.place chýba');
need(data.brand && /^https?:\/\//.test(data.brand.shopUrl || ''), 'brand.shopUrl chýba');
need(data.brand && /^https?:\/\//.test(data.brand.storyUrl || ''), 'brand.storyUrl chýba');
need(text(data.ownerTitle), 'ownerTitle chýba — jedna veta o tom, čo poradca urobí práve pre tento e-shop');
need(text(data.ownerLead), 'ownerLead chýba — dve vety, ktoré to rozvedú');

const HEX = /^#[0-9a-fA-F]{6}$/;
['ink', 'brand', 'accent', 'soft', 'paper'].forEach((key) =>
  need(HEX.test(data.colors?.[key] || ''), `colors.${key} musí byť #rrggbb`));

need(Array.isArray(data.chips) && data.chips.length === 4 && data.chips.every(text),
  'chips musia byť presne 4 neprázdne otázky');

const products = Array.isArray(data.products) ? data.products : [];
need(products.length >= 5, `treba aspoň 5 produktov (je ${products.length})`);
need(products.some((p) => p.decaf === true), 'chýba bezkofeínová káva');
need(products.some((p) => (p.taste?.fruity ?? 0) >= 0.8), 'chýba výrazne ovocná káva');

const VECTORS = { taste: ['chocolate', 'balanced', 'fruity', 'bold'], prep: ['automat', 'lever', 'moka', 'filter'], drink: ['black', 'milk', 'both'] };
products.forEach((product, index) => {
  const at = `products[${index}] (${product.id || 'bez id'})`;
  ['id', 'name', 'line', 'url', 'price', 'priceUnit', 'acidityNote', 'bestFor', 'why'].forEach((key) =>
    need(text(product[key]), `${at}: ${key} chýba`));
  need(/^https?:\/\//.test(product.url || ''), `${at}: url musí byť celý odkaz`);
  need(Array.isArray(product.notes) && product.notes.length >= 2, `${at}: notes potrebujú aspoň 2 poznámky`);
  need(Number.isInteger(product.acidity) && product.acidity >= 0 && product.acidity <= 3, `${at}: acidity musí byť 0–3`);
  need(typeof product.explore === 'number', `${at}: explore chýba`);
  Object.entries(VECTORS).forEach(([group, keys]) => keys.forEach((key) =>
    need(typeof product[group]?.[key] === 'number', `${at}: ${group}.${key} chýba`)));
});

/* A photograph named in the data but missing from the repo is the one defect
   that survives every other check and shows up as a hole on the page. */
const assetDir = path.join(ROOT, 'assets', slug || '_');
const logo = ['logo.svg', 'logo.png'].map((name) => path.join(assetDir, name)).find((file) => fs.existsSync(file));
need(!!logo, `assets/${slug}/logo.svg (alebo .png) chýba`);
need(fs.existsSync(path.join(assetDir, 'hero.jpg')), `assets/${slug}/hero.jpg chýba`);
products.forEach((product) => need(fs.existsSync(path.join(assetDir, `${product.id}.jpg`)),
  `assets/${slug}/${product.id}.jpg chýba`));

if (problems.length) {
  console.error(`${source} nie je kompletný:\n  ` + problems.join('\n  '));
  process.exit(1);
}

/* ------------------------------------------------------------------ shaping */

const photo = (id) => `/assets/${slug}/${id}.jpg`;
const best = (pick) => products.slice().sort((a, b) => pick(b) - pick(a))[0].id;
const byAcidity = (wanted) => products.slice()
  .sort((a, b) => Math.abs(a.acidity - wanted) - Math.abs(b.acidity - wanted))[0].id;

const steps = [
  { key: 'taste', name: 'Chuť', title: 'Čo chcete cítiť v šálke?', options: [
    { value: 'chocolate', title: 'Sladká a čokoládová', detail: 'Kakao, orechy a karamel', product: best((p) => p.taste.chocolate) },
    { value: 'balanced', title: 'Vyvážená', detail: 'Čistá, jemná a univerzálna', product: best((p) => p.taste.balanced) },
    { value: 'fruity', title: 'Ovocná a svieža', detail: 'Výraznejší pôvod a iskra', product: best((p) => p.taste.fruity) },
    { value: 'bold', title: 'Výrazná a netradičná', detail: 'Chcem zaujímavý výberový profil', product: best((p) => p.taste.bold) }
  ] },
  { key: 'prep', name: 'Príprava', title: 'Ako si pripravujete kávu?', options: [
    { value: 'automat', title: 'Automat', detail: 'Rýchla každodenná šálka', product: best((p) => p.prep.automat) },
    { value: 'lever', title: 'Pákový kávovar', detail: 'Espresso pripravujete ručne', product: best((p) => p.prep.lever) },
    { value: 'moka', title: 'Moka kanvička', detail: 'Silnejšia domáca príprava', product: best((p) => p.prep.moka) },
    { value: 'filter', title: 'Filter', detail: 'V60 alebo prekvapkávanie', product: best((p) => p.prep.filter) }
  ] },
  { key: 'drink', name: 'Nápoj', title: 'Pijete ju čiernu alebo s mliekom?', options: [
    { value: 'black', title: 'Čiernu', detail: 'Chcem cítiť kávu naplno', product: best((p) => p.drink.black) },
    { value: 'milk', title: 'S mliekom', detail: 'Cappuccino alebo flat white', product: best((p) => p.drink.milk) },
    { value: 'both', title: 'Striedam oboje', detail: 'Potrebujem univerzálnu kávu', product: best((p) => p.drink.both) }
  ] },
  { key: 'acidity', name: 'Acidita', title: 'Koľko sviežosti chcete v šálke?', options: [
    { value: 'none', title: 'Čo najmenej', detail: 'Kyslá káva mi nesedí', product: byAcidity(0) },
    { value: 'mild', title: 'Jemnú', detail: 'Sviežosť iba v pozadí', product: byAcidity(1) },
    { value: 'bright', title: 'Výraznú', detail: 'Ovocná acidita mi chutí', product: byAcidity(3) },
    { value: 'explore', title: 'Prekvapte ma', detail: 'Chcem objavovať', product: best((p) => p.explore) }
  ] }
].map((step) => ({ ...step, options: step.options.map((o) => ({ ...o, photo: photo(o.product) })) }));

/* Every quick question has to land on an answer that names a coffee, and two
   questions landing on the same one reads as if the advisor knows one answer.
   The matches are built from the chips themselves and checked for both. */
const MATCHES = [
  { test: /acidit|kysl/i, keys: ['acidit', 'kysl', 'nekysl'], label: 'Nie veľmi kyslú', pick: () => byAcidity(0), lead: 'Ak nechcete výraznú aciditu, siahnite po' },
  { test: /mlie|cappucc|latte/i, keys: ['mlie', 'cappucc', 'latte', 'flat white'], label: 'Káva do mlieka', pick: () => best((p) => p.drink.milk), lead: 'Do mlieka sa najlepšie hodí' },
  { test: /filter|v60|prekvapk/i, keys: ['filter', 'v60', 'chemex', 'prekvapk'], label: 'Káva na filter', pick: () => best((p) => p.prep.filter), lead: 'Na filter odporúčam' },
  { test: /automat|kancel|prác/i, keys: ['automat', 'kancel', 'práca', 'praca', 'firm'], label: 'Káva do automatu', pick: () => best((p) => p.prep.automat), lead: 'Do automatu a na väčšiu spotrebu je stavaná' },
  { test: /ovoc|sviež|citrus/i, keys: ['ovoc', 'sviež', 'sviez', 'citrus'], label: 'Niečo ovocné', pick: () => best((p) => p.taste.fruity), lead: 'Z ovocných výberoviek vyberám' },
  { test: /čokolád|cokolad|orech|sladk/i, keys: ['čokolád', 'cokolad', 'orech', 'sladk'], label: 'Sladká a čokoládová', pick: () => best((p) => p.taste.chocolate), lead: 'Na čokoládovú klasiku je tu' },
  { test: /espresso|páko|pako/i, keys: ['espresso', 'páko', 'pako', 'krém', 'krem'], label: 'Espresso na páku', pick: () => best((p) => p.prep.lever), lead: 'Na espresso sa hodí' },
  { test: /bez kofe|bezkofe|decaf|večer/i, keys: ['bez kofe', 'bezkofe', 'decaf', 'večer', 'vecer'], label: 'Bez kofeínu', pick: () => products.find((p) => p.decaf)?.id, lead: 'Bez kofeínu je tu' },
  { test: /netradi|zaujímav|objav/i, keys: ['netradi', 'zaujímav', 'zaujimav', 'objav'], label: 'Niečo netradičné', pick: () => best((p) => p.taste.bold), lead: 'Najnetradičnejšia káva v ponuke je' }
];

const fallbacks = [];
const seen = new Set();
MATCHES.forEach((entry) => {
  const product = entry.pick();
  if (product) fallbacks.push({ match: entry.keys, product, lead: entry.lead });
});
data.chips.forEach((chip) => {
  const hit = MATCHES.find((entry) => entry.test.test(chip));
  if (!hit) {
    problems.push(`chip "${chip}" nemá odpoveď — použite radšej: ${MATCHES.map((entry) => entry.label).join(', ')}`);
    return;
  }
  const product = hit.pick();
  if (seen.has(product)) {
    /* Two questions landing on the same coffee reads as if the advisor knows
       one answer. The wording has to change, not the answer — the least acidic
       coffee is the honest reply to "nie veľmi kyslú" whatever else asks for it. */
    const free = MATCHES.filter((entry) => entry.pick() && !seen.has(entry.pick()))
      .map((entry) => entry.label);
    problems.push(`chip "${chip}" končí pri tej istej káve (${product}) ako iný chip`
      + (free.length ? ` — nahraďte ho napr. za: ${free.join(', ')}` : ''));
  }
  seen.add(product);
});
if (problems.length) {
  console.error(`${source} nie je kompletný:\n  ` + problems.join('\n  '));
  process.exit(1);
}

/* ------------------------------------------------------------------ writing */

const { name, place, shopUrl, storyUrl } = data.brand;
const heroId = best((p) => p.prep.automat + p.drink.both);
const logoPath = `/assets/${slug}/${path.basename(logo)}`;

/* An SVG that declares width="100%" height="100%" has no intrinsic size, and
   inside an <img> constrained only by max-height it lays out at nothing at all
   — the lockup loads and draws a header with a hole in it. The viewBox already
   carries the real proportions. */
if (logo.endsWith('.svg')) {
  const before = fs.readFileSync(logo, 'utf8');
  const box = before.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (box && /width="100%"/.test(before)) {
    fs.writeFileSync(logo, before
      .replace('width="100%"', `width="${box[1]}"`)
      .replace('height="100%"', `height="${box[2]}"`));
    console.log(`  ${path.relative(ROOT, logo)} (doplnená veľkosť)`);
  }
}

const JOLKA = {
  brand: { name, place, shopUrl, storyUrl, author: 'mojchatbot.sk' },
  acidityScale: ['minimálna', 'jemná', 'stredná', 'výrazná'],
  products: products.map((p) => ({
    id: p.id, name: p.name, line: p.line, url: p.url,
    photo: photo(p.id), tile: photo(p.id),
    price: p.price, priceUnit: p.priceUnit, priceFrom: p.price, weights: p.weights || '',
    notes: p.notes, acidity: p.acidity, acidityNote: p.acidityNote,
    bestFor: p.bestFor, why: p.why,
    taste: p.taste, prep: p.prep, drink: p.drink, explore: p.explore,
    ...(p.decaf ? { decaf: true } : {})
  })),
  steps,
  chat: {
    welcome: `Dobrý deň. Vyberieme spolu kávu z ponuky ${name} podľa vašej prípravy a chutí.`,
    placeholder: 'Napíšte, akú kávu hľadáte…',
    chips: data.chips
  },
  fallbacks,
  demo: {
    id: slug, rootId: `${slug}-clean-root`, pageClass: `${slug}-page`, heroProductId: heroId,
    logoInk: logoPath, logoBadge: logoPath, logoHeader: logoPath, logoAvatar: logoPath,
    heroImage: `/assets/${slug}/hero.jpg`, entryImage: `/assets/${slug}/hero.jpg`,
    eyebrow: `Pre tím ${name}`,
    heroTitle: `Vitajte vo vašom návrhu kávového poradcu pre ${name}.`,
    heroLead: 'Poradca zjednoduší pôvod, spracovanie aj chuťový profil a odporučí jednu konkrétnu kávu podľa prípravy.',
    heroHint: `Používa konkrétne produkty a fotografie z tejto ukážky ${name}.`,
    heroImageAlt: `${name} – produktová prezentácia`,
    ownerCredit: `ukážka pre ${name}`,
    teaserTitle: 'Nájdite svoju kávu', teaserText: '4 otázky · jedno odporúčanie',
    dialogLabel: `Kávový poradca ${name}`, advisorLabel: 'Online poradca',
    entryKicker: 'Kávový výber', entryTitle: 'Nájdite svoju kávu', entryText: '4 otázky · konkrétne odporúčanie'
  }
};

const write = (file, body) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, file), body);
  console.log('  ' + file);
};

console.log(`${name}:`);
write(`${slug}-jolka-data.js`, `window.JOLKA=${JSON.stringify(JOLKA)};\n`);

const c = data.colors;
/* The lockup is drawn in the brand's ink, which reads on the light owner page
   and disappears on the widget header, the avatar and the launcher disc when
   those are painted in that same ink. There it is inverted to white. */
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const invert = luminance(c.brand) < 0.4 ? ';filter:brightness(0) invert(1)' : '';
const mix = (hex, pct) => hex; // brand tokens stay literal; the shared system does the shading
write(`${slug}-jolka-theme.css`, `/* ${name} brand tokens on the shared Jolka system. */
:root{--ink:${c.ink};--ink-2:${c.brand};--ink-3:${c.brand};--paper:${c.paper};--surface:#fff;--surface-2:${c.soft};--line:${c.line || '#e3ded6'};--line-strong:${c.line || '#cec8bf'};--kraft:${c.accent};--kraft-deep:${c.accent};--kraft-tint:${c.soft};--text:${c.ink};--text-2:#5f5a55;--text-3:#8a837c;--on-ink:#fff;--on-ink-2:rgba(255,255,255,.74)}
body.${slug}-clean :is(.widget__brand>img,.msg__avatar img,.launcher__button img){object-fit:contain${invert}}
body.${slug}-clean .widget__brand>img{width:64px!important;min-width:64px!important;max-width:64px!important;height:40px!important}
body.${slug}-clean .msg__avatar img{width:30px!important;height:30px!important}
body.${slug}-clean .launcher__button img{width:54px!important;height:54px!important}
`);

write(`${slug}.html`, `<!doctype html>
<html lang="sk">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="${c.ink}">
  <meta name="robots" content="noindex,nofollow">
  <title>${name} – kávový poradca</title>
  <meta name="description" content="Ukážka kávového poradcu pripravená pre ${name}.">
  <link rel="icon" href="${logoPath}">
  <link rel="preload" as="font" type="font/woff2" href="/assets/jolka/fonts/inter-latin-ext.woff2" crossorigin>
  <link rel="stylesheet" href="/jolka/jolka.css">
  <link rel="stylesheet" href="/coffee-jolka-shell.css">
  <link rel="stylesheet" href="/${slug}-jolka-theme.css">
</head>
<body class="${slug}-clean">
  <div id="${slug}-clean-root"></div>
  <script>window.COFFEE_DEMO_SLUG='${slug}';window.__COFFEE_DEMO_SLUG__='${slug}';</script>
  <script src="/coffee-api-route.js"></script>
  <script src="/coffee-local-api.js"></script>
  <script src="/${slug}-jolka-data.js"></script>
  <script src="/coffee-jolka-app.js"></script>
  <script src="/coffee-owner-brand.js"></script>
</body>
</html>
`);

const stub = (title) => `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${title}</title>
<link rel="canonical" href="/${slug}.html">
<meta http-equiv="refresh" content="0;url=/${slug}.html">
<script>location.replace('/${slug}.html');</script>
</head>
<body><p>Presmerovanie na <a href="/${slug}.html">${title}</a>…</p></body>
</html>
`;
write(`${slug}/index.html`, stub(name));
write(`ukazka/${slug}/index.html`, stub(name));

/* --------------------------------------------------- wiring the three lists */

const patch = (file, find, replacement, describe) => {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  if (before.includes(`${slug}:`) || before.includes(`/${slug}/`)) { console.log(`  ${file} (už tam je)`); return; }
  if (!before.includes(find)) throw new Error(`${file}: nenašiel som ${describe}`);
  fs.writeFileSync(full, before.replace(find, replacement));
  console.log('  ' + file);
};

{
  /* Insert before the brace that closes the brand table, wherever it sits, and
     supply the comma the last entry does not carry. Anchoring on the text that
     follows the table broke the moment a comment was added above it. */
  const file = 'coffee-owner-brand.js';
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  if (before.includes(`${slug}: {`)) { console.log(`  ${file} (uz tam je)`); }
  else {
    const open = before.indexOf('const BRANDS = {');
    const close = before.indexOf('\n  };', open);
    if (open === -1 || close === -1) throw new Error(`${file}: nenasiel som tabulku BRANDS`);
    const entry = `,\n\n    ${slug}: {\n`
      + `      name: ${JSON.stringify(name)},\n`
      + `      place: ${JSON.stringify(place)},\n`
      + `      title: ${JSON.stringify(data.ownerTitle)},\n`
      + `      lead: ${JSON.stringify(data.ownerLead)},\n`
      + `      root: '.${slug}-page',\n`
      + `      shop: ${JSON.stringify(shopUrl)},\n`
      + `      lockup: '<img src="${logoPath}" alt="${name.replace(/"/g, '&quot;')}">',\n`
      + `      theme: { ink: '${c.ink}', brand: '${c.brand}', accent: '${c.accent}', soft: '${c.soft}', paper: '${c.paper}' },\n`
      + `      hero: '/assets/${slug}/hero.jpg',\n`
      + `      figures: commonFigures('príprava · chuť · nápoj · kofeín')\n`
      + `    }`;
    fs.writeFileSync(full, before.slice(0, close) + entry + before.slice(close));
    console.log('  ' + file);
  }
}

const router = path.join(ROOT, 'coffee-final-entry.js');
const routerText = fs.readFileSync(router, 'utf8');
if (!routerText.includes(`'${slug}'`)) {
  fs.writeFileSync(router, routerText.replace(
    /(const VALID = new Set\(\[)([^\]]*)(\]\))/,
    (whole, head, list, tail) => `${head}${list}, '${slug}'${tail}`));
  console.log('  coffee-final-entry.js');
}

patch('ukazky.html', '\n    </ul>', `\n      <li><a href="/${slug}/">${name}</a></li>\n    </ul>`, 'zoznam ukážok');

execFileSync(process.execPath, [path.join(ROOT, 'scripts/stamp-assets.mjs')], { stdio: 'inherit' });
console.log(`\nHotové. Otvorte http://localhost:4400/${slug}/`);
