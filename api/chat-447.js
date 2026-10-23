/* Chat pre novú dávku ukážok (447 € + 10 €/mes.). Oddelený od api/chat.js, aby staré ukážky
   nedostali žiadnu vedľajšiu zmenu. Overený návrh odpovede pripraví n447/reply.js z dát pražiarne;
   nezmenený aiAnswer (produkčný model) ho môže prirodzene preformulovať a odmietne neoverenú cenu či odkaz. */
import {createRequire} from 'node:module';
import {aiAnswer} from './ai-chat.js';

const require = createRequire(import.meta.url);
const ENG = require('../n447/engine.js');
const {coffeeReply} = require('../n447/reply.js');
const euro = (v, c) => ENG.money(v, c).replace(/ /g, ' ');

/* Iba firmy novej dávky; neznámy identifikátor dostane 400, nikdy cudziu firmu. */
export const DEMOS = {black: require('../n447/data/black.js')};

export function catalogueFor(data) {
  const products = data.products.filter((p) => p.available !== false).map((p) => ({
    name: p.name, url: p.url, price: 'orientačne od ' + euro(p.priceFrom, p.currency), kind: 'zrnková/mletá káva',
    facts: (p.variants || []).filter((v) => v.verifiedAt && Number.isFinite(v.price)).map((v) => `Overená cena: ${ENG.grams(v.grams)}, ${v.roast} roast, ${String(v.grind).toLowerCase()} = ${euro(v.price, p.currency)}.`),
    notes: p.notes && p.notes.length ? p.notes : [p.profile].filter(Boolean),
    bestFor: 'praženie: ' + p.roasts.join(', ') + '; balenia: ' + p.weights.map(ENG.grams).join(', '),
    description: [p.summary, p.origin, p.process, p.decaf ? 'bez kofeínu' : ''].filter(Boolean).join('. ')
  }));
  if (data.drip) products.push({name: data.drip.name, url: data.drip.url, price: euro(data.drip.price, data.drip.currency), kind: 'drip vrecúška', weights: data.drip.pack, description: data.drip.summary});
  const lines = data.shop && data.shop.freeShipping ? [data.shop.freeShipping] : [];
  return {source: data.brand.web, products, shipping: {lines, url: data.shop && data.shop.freeShippingSource, checkedAt: data.checkedAt}};
}

export async function answer(body, {ai = aiAnswer} = {}) {
  const data = Object.prototype.hasOwnProperty.call(DEMOS, String(body && body.demoId || '')) ? DEMOS[body.demoId] : null;
  if (!data) return {status: 400, json: {error: 'Unknown demo'}};
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant')).slice(-10)
    .map((m) => ({role: m.role, content: String(m.content || '').slice(0, 700)})).filter((m) => m.content.trim());
  while (messages[0] && messages[0].role === 'assistant') messages.shift();
  while (messages.length && messages[messages.length - 1].role === 'assistant') messages.pop();
  const latest = messages.filter((m) => m.role === 'user').pop();
  if (!latest) return {status: 400, json: {error: 'Missing user message'}};
  const draft = coffeeReply(data, latest.content, messages.slice(0, -1));
  const reply = await ai({family: 'coffee', brand: data.brand.name, web: data.brand.web, catalogue: catalogueFor(data), messages, draft,
    extra: ['Cena „orientačne od“ je iba dolná hranica rozsahu, nie cena konkrétneho balenia; nikdy ju nepoužite na potvrdenie, že sa balenie zmestí do rozpočtu. Presnú cenu uvádzajte iba z riadkov „Overená cena“. Netvrďte, že je produkt skladom.']});
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
