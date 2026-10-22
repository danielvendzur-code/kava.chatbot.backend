/* Chat pre novú dávku ukážok (447 € + 10 €/mes.). Oddelený od api/chat.js, aby staré ukážky
   nedostali žiadnu vedľajšiu zmenu. Overený návrh odpovede pripraví coffee-reply z dát pražiarne;
   nezmenený aiAnswer (produkčný model) ho môže prirodzene preformulovať a odmietne neoverenú cenu či odkaz. */
import {aiAnswer} from './ai-chat.js';
import {coffeeReply} from '../n447/coffee-reply.mjs';
import {money} from '../n447/coffee-engine.mjs';
import BLACK from '../n447/data/black.mjs';

export const DEMOS = {black: BLACK};

export function catalogueFor(data) {
  const products = data.products.filter((p) => p.available !== false).map((p) => ({
    name: p.name, url: p.url, price: 'od ' + money(p.priceFrom, p.currency).replace(' ', ' '), kind: 'zrnková/mletá káva',
    notes: p.notes?.length ? p.notes : [p.profile].filter(Boolean),
    bestFor: 'praženie: ' + p.roasts.join(', ') + '; balenia: ' + p.weights.map((g) => g >= 1000 ? g / 1000 + ' kg' : g + ' g').join(', '),
    description: [p.summary, p.origin, p.process, p.decaf ? 'bez kofeínu' : ''].filter(Boolean).join('. ')
  }));
  if (data.drip) products.push({name: data.drip.name, url: data.drip.url, price: money(data.drip.price, data.drip.currency).replace(' ', ' '), kind: 'drip vrecúška', weights: data.drip.pack, description: data.drip.summary});
  return {source: data.brand.web, products, shipping: {lines: [data.shop.freeShipping], url: data.shop.freeShippingSource, checkedAt: data.checkedAt}};
}

export async function answer(body, {ai = aiAnswer} = {}) {
  const data = DEMOS[String(body?.demoId || '')];
  if (!data) return {status: 400, json: {error: 'Unknown demo'}};
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant')).slice(-10)
    .map((m) => ({role: m.role, content: String(m.content || '').slice(0, 700)})).filter((m) => m.content.trim());
  while (messages[0]?.role === 'assistant') messages.shift();
  while (messages.at(-1)?.role === 'assistant') messages.pop();
  const latest = messages.filter((m) => m.role === 'user').at(-1)?.content || '';
  if (!latest) return {status: 400, json: {error: 'Missing user message'}};
  const draft = coffeeReply(data, latest, messages.slice(0, -1));
  const reply = await ai({family: 'coffee', brand: data.brand.name, web: data.brand.web, catalogue: catalogueFor(data), messages, draft,
    extra: ['Ceny v údajoch sú najnižšie ceny „od“; presnú cenu balenia a mletia ukáže e-shop. Netvrďte, že je produkt skladom.']});
  return {status: 200, json: reply ? {reply} : {reply: draft, fallback: true}};
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const ok = origin === '' || /(^https:\/\/([a-z0-9-]+\.)?mojchatbot\.sk$)|(^https:\/\/.*\.vercel\.app$)|(^http:\/\/(localhost|127\.0\.0\.1):\d+$)/i.test(origin);
  res.setHeader('Access-Control-Allow-Origin', ok && origin ? origin : 'https://mojchatbot.sk');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  let body = {};
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {}); } catch { return res.status(400).json({error: 'Invalid body'}); }
  const out = await answer(body);
  return res.status(out.status).json(out.json);
}
