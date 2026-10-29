/* n447 dávka 2 – kópia api/cosmetics-chat-447.js pre kozmetiku2 (katalógy n447/kozmetika2). Pôvodne: chat kozmetických ukážok novej dávky (447 € + 10 €/mes.). Izolované od /api/cosmetics-chat: pozná iba firmy
   novej dávky, katalógy načíta staticky (Vercel), bez presmerovania na iný server. Neznáma firma = 400, nikdy cudzia. */
import '../n447/kozmetika2/advisor-core-k2.js';
import '../catalogue-reply-core.js';
import '../chat-brain.js';
import '../chat-adapters.js';
import '../n447/kozmetika2/catalogues/andreine.js';
import '../n447/kozmetika2/catalogues/malinna.js';
import '../n447/kozmetika2/catalogues/mark.js';
import {aiAnswer} from './ai-chat.js';

const BRANDS = {
  /* K2_BRANDS */
  mark: {brand: "MARK face & body", web: "https://www.markscrub.com/"},
  malinna: {brand: "MALINNA°", web: "https://malinna.com/"},
  andreine: {brand: "Andreine", web: "https://andreine.com/"},
};
const adapters = new Map();

export function draftReply(slug, text, history = []) {
  const catalogues = globalThis.CX_CATALOGUES || {};
  const catalogue = catalogues[slug];
  if (catalogue?.products?.length && globalThis.CXChatBrain) {
    if (!adapters.has(slug)) adapters.set(slug, globalThis.CXChatBrain.adapters.cosmetics(catalogue, {family: 'cosmetics'}));
    const reply = globalThis.CXChatBrain.reply(adapters.get(slug), text, history);
    if (reply) return reply;
  }
  return globalThis.CXCatalogueReplyCore(catalogues, slug, text, history) || 'Produkty, balení a ceny najdete ve Výběru.';
}

export async function answer(body, {ai = aiAnswer} = {}) {
  const slug = String(body && body.demoId || '');
  const demo = Object.prototype.hasOwnProperty.call(BRANDS, slug) ? BRANDS[slug] : null;
  if (!demo) return {status: 400, json: {error: 'Unknown demo'}};
  const messages = (Array.isArray(body.messages) ? body.messages : []).filter((m) => m && (m.role === 'user' || m.role === 'assistant')).slice(-10)
    .map((m) => ({role: m.role, content: String(m.content || '').slice(0, 700)})).filter((m) => m.content.trim());
  while (messages[0]?.role === 'assistant') messages.shift();
  while (messages.at(-1)?.role === 'assistant') messages.pop();
  const latest = messages.filter((m) => m.role === 'user').at(-1)?.content || '';
  if (!latest) return {status: 400, json: {error: 'Missing user message'}};
  const draft = draftReply(slug, latest, messages);
  const reply = await ai({family: 'cosmetics', brand: demo.brand, web: demo.web, catalogue: globalThis.CX_CATALOGUES[slug], messages, draft,
    extra: ['Cena platí pro uvedené balení; jiné velikosti balení mají jinou cenu, kterou v údajích nemáme. Neslibujte léčbu ani zdravotní účinky.']});
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
