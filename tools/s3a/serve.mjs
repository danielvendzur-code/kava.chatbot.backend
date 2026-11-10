// lokálny server séria 3: statické súbory + /api/<meno> cez handler z repozitára; sieť vypnutá (žiadny model, žiadne platené volania)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import {pathToFileURL} from 'node:url';
globalThis.fetch = async () => { throw new Error('sieť je v lokálnom teste vypnutá'); };
process.on('uncaughtException', (e) => console.error('serve error', e && e.message));
const root = process.argv[2], port = +process.argv[3] || 8995;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2'};
const mods = {};
http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if(process.env.S5_QA==='1' && u.pathname==='/cosmetics.html' && ['nutt','pleva','jagaia','capri','botanico','janine','eone','nafigate','boemi','rubens','safran','adoraniche','nicheandglow'].includes(u.searchParams.get('demo')))u.pathname='/s5.html'; // QA alias for unchanged legacy scripts
  const m = u.pathname.match(/^\/api\/([\w-]+)$/);
  if (m) {
    const f = path.join(root, 'api', m[1] + '.js');
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end('{}'); }
    mods[f] ||= await import(pathToFileURL(f).href);
    let body = ''; for await (const c of req) body += c;
    const r = {statusCode: 200, setHeader() {}, end() { res.end(); }, status(c) { this.statusCode = c; return this; }, json(o) { res.writeHead(this.statusCode, {'content-type': 'application/json'}); res.end(JSON.stringify(o)); }};
    try { return await mods[f].default({method: req.method, body, headers: req.headers, query: {}}, r); } catch (e) { res.writeHead(500); return res.end(String(e)); }
  }
  let p = path.join(root, decodeURIComponent(u.pathname)); if (p.endsWith('/')) p += 'index.html';
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); return res.end('nf'); } res.writeHead(200, {'content-type': types[path.extname(p)] || 'application/octet-stream'}); res.end(d); });
}).listen(port, '127.0.0.1');
console.log('serve', root, port);
