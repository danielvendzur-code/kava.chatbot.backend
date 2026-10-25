/* n447 – lokálny server jedného balíka (QA). Statické súbory iba z adresára balíka, /api/<meno> spustí handler
   z balíka (api/<meno>.js). Bez ANTHROPIC_API_KEY; každé volanie fetch mimo localhost sa zablokuje a započíta,
   takže platené volania sú vylúčené. Počty sa zapisujú do <stats>.
   node tools/n447-bundle-serve.mjs --dir=BUNDLE --port=8990 --stats=FILE */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const arg = (k) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const DIR = path.resolve(arg('dir'));
const PORT = Number(arg('port') || 8990);
const STATS = arg('stats');
delete process.env.ANTHROPIC_API_KEY;
const stats = {apiCalls: 0, outboundBlocked: 0, outboundHosts: [], served: 0, notFound: 0};
const save = () => STATS && fs.writeFileSync(STATS, JSON.stringify(stats));
const realFetch = globalThis.fetch;
globalThis.fetch = async (u, ...rest) => {
  const host = new URL(String(u)).hostname;
  if (host === '127.0.0.1' || host === 'localhost') return realFetch(u, ...rest);
  stats.outboundBlocked += 1; stats.outboundHosts.push(host); save();
  throw new Error('n447 QA: odchádzajúce volanie zablokované');
};
const TYPES = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon'};
const handlers = {};
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  let p = decodeURIComponent(url.pathname);
  if (p.startsWith('/api/')) {
    const name = p.slice(5).replace(/\/$/, '').replace(/\.js$/, '');
    const file = path.join(DIR, 'api', name + '.js');
    if (!/^[a-z0-9-]+$/.test(name) || !fs.existsSync(file)) { stats.notFound += 1; save(); res.writeHead(404); return res.end('not found'); }
    let body = '';
    for await (const c of req) body += c;
    stats.apiCalls += 1; save();
    handlers[name] ||= (await import(pathToFileURL(file).href)).default || null;
    if (!handlers[name]) { res.writeHead(404); return res.end('no handler'); }
    const shim = {statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.statusCode = c; return this; },
      json(o) { res.writeHead(this.statusCode, {...this.headers, 'Content-Type': 'application/json'}); res.end(JSON.stringify(o)); return this; }, end(x) { res.writeHead(this.statusCode, this.headers); res.end(x); return this; }};
    try { await handlers[name]({method: req.method, headers: req.headers, body, url: req.url}, shim); }
    catch (e) { res.writeHead(500); res.end('error'); }
    return;
  }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(DIR, path.normalize(p));
  if (!file.startsWith(DIR + path.sep) || /^api(\/|$)/.test(path.relative(DIR, file))
      || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    stats.notFound += 1; save(); res.writeHead(404); return res.end('not found');
  }
  stats.served += 1; save();
  res.writeHead(200, {'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
}).listen(PORT, '127.0.0.1', () => console.log('ready ' + PORT));
