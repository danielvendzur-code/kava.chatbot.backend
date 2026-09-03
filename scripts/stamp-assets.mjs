/**
 * Stamp every local script and stylesheet reference with a hash of that file's
 * contents.
 *
 * The demo pages name their assets by a bare path — /cosmetics.js,
 * /skincare-refresh.css — so a browser or a CDN that already holds one has no
 * way to learn a new deployment changed it, and the page renders new markup
 * with old behaviour and old styles. A URL that carries the file's own hash
 * changes only when the file does, so a cached copy is only ever used for the
 * bytes it was cached for.
 *
 * Idempotent: run it after any change to a .js or .css the pages load, and
 * commit the result.
 *
 *   node scripts/stamp-assets.mjs [--check]
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CHECK = process.argv.includes('--check');

const hashes = new Map();
function stampFor(assetPath) {
  if (hashes.has(assetPath)) return hashes.get(assetPath);
  const file = path.join(ROOT, assetPath.replace(/^\//, ''));
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  const hash = createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 8);
  hashes.set(assetPath, hash);
  return hash;
}

/* A reference is rewritten only when the file it names exists in the repo, so
   absolute URLs and anything generated at runtime are left alone. */
function stamp(text) {
  return text.replace(/(["'])(\/[A-Za-z0-9_\-./]+\.(?:js|css))(?:\?v=[0-9a-f]{8})?\1/g,
    (whole, quote, assetPath) => {
      const hash = stampFor(assetPath);
      return hash ? `${quote}${assetPath}?v=${hash}${quote}` : whole;
    });
}

const changed = [];
function apply(file) {
  const before = fs.readFileSync(file, 'utf8');
  const after = stamp(before);
  if (after === before) return;
  changed.push(path.relative(ROOT, file));
  if (!CHECK) fs.writeFileSync(file, after);
}

/* Stylesheets injected from JavaScript are stamped first, so the hash the HTML
   records for those scripts already accounts for the stamps inside them. */
const injectors = fs.readdirSync(ROOT)
  .filter((name) => name.endsWith('.js') && /^coffee-/.test(name))
  .map((name) => path.join(ROOT, name));
injectors.forEach(apply);
hashes.clear();

fs.readdirSync(ROOT).filter((name) => name.endsWith('.html'))
  .map((name) => path.join(ROOT, name)).forEach(apply);

/* One file a person can open in a browser to see which build they are looking
   at, without reading the page source. */
const RELEASE = 'verzia.txt';
const fingerprint = createHash('sha1')
  .update([...hashes.entries()].sort().map(([k, v]) => `${k}:${v}`).join('\n'))
  .digest('hex').slice(0, 8);
const release = [
  'Ukazky mojchatbot.sk',
  `verzia: ${fingerprint}`,
  'cosmetics.js: ' + (stampFor('/cosmetics.js') || '-'),
  'skincare-refresh.css: ' + (stampFor('/skincare-refresh.css') || '-'),
  'coffee-jolka-app.js: ' + (stampFor('/coffee-jolka-app.js') || '-'),
  'coffee-refresh.css: ' + (stampFor('/coffee-refresh.css') || '-'),
  ''
].join('\n');
if (fs.readFileSync(path.join(ROOT, RELEASE), 'utf8') !== release) {
  changed.push(RELEASE);
  if (!CHECK) fs.writeFileSync(path.join(ROOT, RELEASE), release);
}

if (CHECK && changed.length) {
  console.error('Assets are not stamped for their current contents:\n  ' + changed.join('\n  '));
  console.error('Run: node scripts/stamp-assets.mjs');
  process.exit(1);
}
console.log(changed.length ? `stamped ${changed.length} file(s):\n  ${changed.join('\n  ')}` : 'already stamped');
