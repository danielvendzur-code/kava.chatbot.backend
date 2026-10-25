/* n447 – samostatný odovzdávací balík jednej firmy zo schváleného rozhrania.
   Zbiera tranzitívne závislosti stránky <slug>.html (statické src/href, reťazce ciest v JS/CSS vrátane dynamicky
   načítaných skriptov a štýlov, url() v CSS, fotky všetkých produktov z dát firmy), API iba pre túto firmu a jeho
   importy. Zdieľané viacznačkové súbory sa do balíka nedávajú v pôvodnej podobe: ich tabuľky značiek sa zúžia na
   prázdne (vlastná značka prichádza z vlastného súboru značky). Interné súbory (.env, register, e-mailové koncepty,
   nástroje) sa nikdy nezahrnú.
   node tools/n447-bundle.mjs --slug=verticcio --out=DIR   → DIR/<slug>/ (nasaditeľný obsah) + DIR/<slug>.manifest.json (mimo neho) */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';

const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const SLUG = arg('slug');
const OUT = path.resolve(arg('out') || 'n447-bundles');
const ROOT = process.cwd();
const COFFEE = ['black', 'verticcio', 'rebelbean', 'nordbeans', 'doubleshot', 'fathers', 'candycane', '9gramscoffee'];
const COSMETICS = ['saloos', 'renovality', 'nobilistilia', 'manufaktura'];
const family = COFFEE.includes(SLUG) ? 'coffee' : COSMETICS.includes(SLUG) ? 'cosmetics' : null;
if (!family) { console.error('neznáma firma ' + SLUG); process.exit(2); }

const FORBIDDEN = [/(^|\/)\.env/, /(^|\/)\.git\//, /^n447\/stav\./, /^n447\/email-/, /^tools\//, /^node_modules\//, /\.md$/, /(^|\/)\.vercel/];
const dest = path.join(OUT, SLUG);
fs.rmSync(dest, {recursive: true, force: true});
const files = new Map(); // rel → {source, generated}
const external = new Set();
const missing = new Set();
const excludedForeign = new Set();
/* cudzie značky: ostatné stránky v koreni, značky starých kozmetických ukážok, kávové ukážky zo zdieľaného súboru */
const FOREIGN = (() => {
  const t = new Set(fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
  const w = {}; w.window = w; vm.createContext(w); vm.runInContext(fs.readFileSync(path.join(ROOT, 'cosmetics-config.js'), 'utf8'), w);
  Object.keys(w.COSMETICS_DEMOS.brands).forEach((k) => t.add(k));
  for (const m of fs.readFileSync(path.join(ROOT, 'catalogue-config.js'), 'utf8').matchAll(/'([a-z0-9]+)'/g)) t.add(m[1]);
  for (const m of fs.readFileSync(path.join(ROOT, 'coffee-owner-brand.js'), 'utf8').matchAll(/^\s+'?([a-z0-9-]+)'?: \{/gm)) t.add(m[1]);
  for (const g of ['index', 'cosmetics', 'ukazky', 'jolka', 'display', 'face', 'mark', 'theme', 'two', 'black', SLUG]) t.delete(g);
  return [...t].filter((x) => x.length > 2).sort();
})();
const OTHER = [...COFFEE, ...COSMETICS].filter((x) => x !== SLUG);
const ownAsset = (rel) => rel.startsWith(`assets/${SLUG}/`) || rel.startsWith(`assets/n447-kozmetika/${SLUG}/`);
const foreignAsset = (rel) => !ownAsset(rel) && (OTHER.some((o) => rel.startsWith(`assets/${o}/`) || rel.startsWith(`assets/n447-kozmetika/${o}/`)) || /\.(png|jpe?g|webp|svg|gif|avif|mp4)$/i.test(rel) && FOREIGN.some((t) => new RegExp(`(^|[/_.-])${t}([/_.-]|$)`, 'i').test(rel)));

const clean = (p) => p.split('?')[0].split('#')[0].replace(/^\/+/, '');
function add(rel, from) {
  rel = clean(rel);
  if (!rel || files.has(rel)) return;
  if (foreignAsset(rel)) { excludedForeign.add(rel); return; }
  if (FORBIDDEN.some((r) => r.test(rel))) throw new Error(`zakázaný súbor ${rel} (z ${from})`);
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) { missing.add(`${rel} ← ${from}`); return; }
  files.set(rel, {source: rel});
  if (/\.(js|mjs|css|html)$/.test(rel)) scan(rel);
}
function scan(rel, text = fs.readFileSync(path.join(ROOT, rel), 'utf8')) {
  const refs = new Set();
  for (const m of text.matchAll(/(?:src|href)\s*=\s*["']([^"'#]+)["']/g)) refs.add(m[1]);
  for (const m of text.matchAll(/["'`](\/[A-Za-z0-9_@.\/-]+\.(?:js|mjs|css|png|jpe?g|webp|svg|gif|woff2?|ttf|json|ico|avif|mp4))(?:\?[^"'`]*)?["'`]/g)) refs.add(m[1]);
  for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) refs.add(m[1]);
  for (const m of text.matchAll(/^\s*import\s+(?:[^'"]*from\s+)?["'](\.{1,2}\/[^"']+)["']/gm)) refs.add(path.posix.join(path.posix.dirname('/' + rel), m[1]));
  /* dynamicky skladané cesty ('/assets/scenes/'+meno+'.jpg'): zahrnú sa súbory adresára, ktorých meno je v súbore ako reťazec */
  for (const m of text.matchAll(/["'`](\/assets\/[A-Za-z0-9_\/-]+\/)["'`]\s*\+/g)) {
    const dir = path.join(ROOT, clean(m[1]));
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (clean(m[1]).startsWith('assets/n447/')) { refs.add(m[1] + f); continue; }  // vlastné ilustrácie novej dávky: mená sa skladajú v kóde ('tool-' + k)
      const base = f.replace(/\.[^.]+$/, '');
      if (new RegExp(`["'\`]${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\`]`).test(text)) refs.add(m[1] + f);
    }
  }
  for (let r of refs) {
    if (/^(data:|mailto:|tel:|javascript:|#)/.test(r)) continue;
    if (/^https?:\/\//.test(r)) { external.add(r); continue; }
    if (!r.startsWith('/')) r = path.posix.join(path.posix.dirname('/' + rel), r);
    if (/\.[a-z0-9]{2,5}$/i.test(clean(r))) add(r, rel);
  }
}

/* zúženie zdieľaných viacznačkových súborov (iba dáta; logika ostáva) */
function sandbox(file, pre = {}) {
  const w = {console, ...pre}; w.window = w; w.globalThis = w; w.document = {documentElement: {}, querySelector: () => null, addEventListener() {}};
  vm.createContext(w); vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), w); return w;
}
const GENERATED = {};
if (family === 'cosmetics') {
  const w = sandbox('cosmetics-config.js');
  const d = w.COSMETICS_DEMOS;
  const keep = {brands: {}, questions: d.questions, semanticPhotos: d.semanticPhotos};
  if (JSON.stringify(Object.keys(d).sort()) !== JSON.stringify(Object.keys(keep).sort())) throw new Error('cosmetics-config.js: neočakávaná štruktúra ' + Object.keys(d));
  /* overené texty produktov iných obchodov: ponechané iba z domény firmy */
  const guide = fs.readFileSync(path.join(ROOT, 'care-result-guide.js'), 'utf8');
  const gm = guide.match(/const details=\/\* VERIFIED_DETAILS \*\/(\{.*?\});/s);
  if (!gm) throw new Error('care-result-guide.js: VERIFIED_DETAILS nenájdené');
  const host = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };
  const bw = sandbox(`n447/kozmetika/brands/${SLUG}.js`, {COSMETICS_DEMOS: {brands: {}}});
  const ownHost = host(bw.COSMETICS_DEMOS.brands[SLUG].website);
  const det = Object.fromEntries(Object.entries(JSON.parse(gm[1])).filter(([, v]) => host(v.url) === ownHost));
  GENERATED['care-result-guide.js'] = guide.replace(gm[1], JSON.stringify(det));
  /* úpravy cien a fotiek iných značiek (bez vlastnej značky by skončili chybou): ponechaná iba všeobecná kontrola obrázkov */
  const facts = fs.readFileSync(path.join(ROOT, 'cosmetics-brand-facts.js'), 'utf8');
  const cut = facts.indexOf('  // Fresh visual sources and product facts');
  if (cut < 0 || !facts.trimEnd().endsWith('})();')) throw new Error('cosmetics-brand-facts.js: neočakávaná štruktúra');
  GENERATED['cosmetics-brand-facts.js'] = facts.slice(0, cut) + '  // n447 balík: úpravy iných značiek vynechané\n})();\n';
  GENERATED['cosmetics-config.js'] = `/* n447 balík ${SLUG}: zo schváleného cosmetics-config.js ponechané otázky a fotky volieb; tabuľka značiek prázdna (vlastná značka: n447/kozmetika/brands/${SLUG}.js) */\nwindow.COSMETICS_DEMOS = ${JSON.stringify(keep)};\n`;
}

/* API len pre túto firmu */
if (family === 'coffee') {
  let src = fs.readFileSync(path.join(ROOT, 'api/chat-447.js'), 'utf8');
  const own = src.match(new RegExp(`^import (\\w+) from '\\.\\./n447/data/${SLUG.replace(/[.]/g, '\\.')}\\.js';$`, 'm'));
  const line = src.match(/^export const DEMOS = \{[^\n]*\};$/m);
  if (!own || !line) throw new Error('api/chat-447.js: import firmy alebo DEMOS nenájdené');
  src = src.split('\n').filter((l) => !/^import \w+ from '\.\.\/n447\/data\//.test(l) || l === own[0]).join('\n');
  GENERATED['api/chat-447.js'] = src.replace(line[0], `export const DEMOS = {${JSON.stringify(SLUG)}: ${own[1]}};`);
} else {
  let src = fs.readFileSync(path.join(ROOT, 'api/cosmetics-chat-447.js'), 'utf8');
  src = src.split('\n').filter((l) => !/^import '\.\.\/n447\/kozmetika\/catalogues\//.test(l) || l.includes(`/${SLUG}.js'`)).join('\n');
  const b = src.match(/const BRANDS = \{[\s\S]*?\n\};/);
  const w = {}; vm.createContext(w); vm.runInContext(b[0].replace('const BRANDS', 'BRANDS'), w);
  if (!w.BRANDS[SLUG]) throw new Error('api/cosmetics-chat-447.js: firma chýba v BRANDS');
  GENERATED['api/cosmetics-chat-447.js'] = src.replace(b[0], `const BRANDS = ${JSON.stringify({[SLUG]: w.BRANDS[SLUG]}, null, 2)};`);
}

/* konfigurácia nasadenia balíka: iba všeobecné hlavičky pôvodného vercel.json, bez prepisov na iné ukážky */
{
  const v = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
  const headers = v.headers.filter((h) => ['/(.*)', '/(.*)\\.html', '/(.*)\\.js', '/(.*)\\.css'].includes(h.source));
  GENERATED['vercel.json'] = JSON.stringify({$schema: v.$schema, headers: [...headers, {source: '/api/(.*)', headers: [{key: 'Cache-Control', value: 'no-store'}]}]}, null, 2) + '\n';
  GENERATED['package.json'] = JSON.stringify({name: `n447-${SLUG}`, private: true, version: '1.0.0'}, null, 2) + '\n';
}

/* zber: vygenerované súbory sa zaregistrujú pred prechodom, aby sa nikdy nenačítal pôvodný viacznačkový obsah */
for (const rel of Object.keys(GENERATED)) files.set(rel, {source: rel, generated: true});
for (const [rel, text] of Object.entries(GENERATED)) scan(rel, text);
add(`${SLUG}.html`, 'vstup');
/* fotky všetkých produktov (aj alternatívnych odporúčaní) */
if (family === 'coffee') {
  const w = sandbox(`n447/data/${SLUG}.js`);
  const d = w.N447_DATA[SLUG];
  for (const p of d.products) { for (const k of ['photo', 'image']) if (p[k]) (/^https?:/.test(p[k]) ? external.add(p[k]) : add(p[k], 'dáta')); }
  if (d.drip && d.drip.photo) add(d.drip.photo, 'dáta');
} else {
  const w = sandbox(`n447/kozmetika/catalogues/${SLUG}.js`);
  for (const p of w.CX_CATALOGUES[SLUG].products) (/^https?:/.test(p.photo) ? external.add(p.photo) : add(p.photo, 'katalóg'));
}

/* zápis */
const manifest = {slug: SLUG, family, builtFrom: process.env.N447_COMMIT || null, entry: `${SLUG}.html`, files: [], externalOwnShop: [], note:
  'Balík obsahuje iba stránku firmy, jej dáta, API pre túto firmu a ich závislosti. Zdieľané viacznačkové dáta sú zúžené. Bez .env, poverení, registra a e-mailových konceptov.'};
for (const [rel, f] of [...files.entries()].sort()) {
  const buf = f.generated ? Buffer.from(GENERATED[rel]) : fs.readFileSync(path.join(ROOT, rel));
  const o = path.join(dest, rel); fs.mkdirSync(path.dirname(o), {recursive: true}); fs.writeFileSync(o, buf);
  manifest.files.push({path: rel, bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex'), ...(f.generated ? {generated: 'zúžené pre firmu'} : {})});
}
fs.copyFileSync(path.join(dest, `${SLUG}.html`), path.join(dest, 'index.html'));
const ib = fs.readFileSync(path.join(dest, 'index.html'));
manifest.files.push({path: 'index.html', bytes: ib.length, sha256: crypto.createHash('sha256').update(ib).digest('hex'), copyOf: `${SLUG}.html`});
manifest.externalOwnShop = [...new Set([...external].map((u) => new URL(u).host))].sort();
manifest.externalCount = external.size;
manifest.missing = [...missing].sort();
manifest.excludedForeignAssets = [...excludedForeign].sort();
manifest.foreignTokens = FOREIGN;
manifest.totalBytes = manifest.files.reduce((n, f) => n + f.bytes, 0);
fs.writeFileSync(path.join(OUT, `${SLUG}.manifest.json`), JSON.stringify(manifest, null, 1));
console.log(JSON.stringify({slug: SLUG, files: manifest.files.length, bytes: manifest.totalBytes, external: manifest.externalOwnShop, missing: manifest.missing.slice(0, 12), excludedForeign: manifest.excludedForeignAssets.length}));
