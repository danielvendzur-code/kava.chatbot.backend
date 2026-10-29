/* n447 dávka 2 – kópia api/cosmetics-chat-447.js pre kozmetiku2 (katalógy n447/kozmetika2). Pôvodne: chat kozmetických ukážok novej dávky (447 € + 10 €/mes.). Izolované od /api/cosmetics-chat: pozná iba firmy
   novej dávky, katalógy načíta staticky (Vercel), bez presmerovania na iný server. Neznáma firma = 400, nikdy cudzia. */
import '../n447/kozmetika2/advisor-core-k2.js';
import '../catalogue-reply-core.js';
import '../chat-brain.js';
import '../chat-adapters.js';
import '../n447/kozmetika2/catalogues/andreine447.js';
import '../n447/kozmetika2/catalogues/malinna.js';
import '../n447/kozmetika2/catalogues/mark.js';
import '../n447/kozmetika2/catalogues/akh.js';
import '../n447/kozmetika2/catalogues/libebit.js';
import '../n447/kozmetika2/catalogues/naturinka.js';
import '../n447/kozmetika2/catalogues/goodie.js';
import '../n447/kozmetika2/catalogues/moravite.js';
import '../n447/kozmetika2/catalogues/bohemikus.js';
import '../n447/kozmetika2/chat-guard-k2.js';
import {aiAnswer} from './ai-chat.js';

const BRANDS = {
  /* K2_BRANDS */
  bohemikus: {brand: "Bohemikus", web: "https://bohemikus.cz/"},
  moravite: {brand: "Moravité", web: "https://moravite.cz/"},
  goodie: {brand: "Goodie", web: "https://www.goodie.cz/"},
  naturinka: {brand: "NATURINKA", web: "https://www.naturinka.cz/"},
  libebit: {brand: "libebit", web: "https://www.libebit.cz/"},
  akh: {brand: "AKH aromaterapie", web: "https://www.aromakh.cz/"},
  mark: {brand: "MARK face & body", web: "https://www.markscrub.com/"},
  malinna: {brand: "MALINNA°", web: "https://malinna.com/"},
  andreine447: {brand: "Andreine", web: "https://andreine.com/"},
};
const adapters = new Map();

function brainReply(key, catalogue, text, history) {
  if (!catalogue?.products?.length || !globalThis.CXChatBrain) return '';
  if (!adapters.has(key)) adapters.set(key, globalThis.CXChatBrain.adapters.cosmetics(catalogue, {family: 'cosmetics'}));
  return globalThis.CXChatBrain.reply(adapters.get(key), text, history) || '';
}

/* k2: konkrétna požiadavka (zložka/vôňa, typ, rozpočet) → odpoveď iba z produktov, ktoré ju spĺňajú; inak úprimne „nemám“. */
export function draftReply(slug, text, history = []) {
  const catalogues = globalThis.CX_CATALOGUES || {};
  const catalogue = catalogues[slug];
  return draft(slug, catalogue, text, history).text;
}

function draft(slug, catalogue, text, history) {
  const g = globalThis.CXK2ChatGuard?.guard(catalogue, text, BRANDS[slug]?.brand || slug);
  if (g) {
    if (g.products.length) {
      const sub = {...catalogue, products: g.products};
      const reply = brainReply(slug + '|' + g.products.map((p) => p.id).join(','), sub, text, history);
      const allowed = new Set(g.products.map((p) => p.name));
      const named = (catalogue.products || []).filter((p) => reply.includes(p.name)).map((p) => p.name);
      const ok = reply && named.length && named.every((n) => allowed.has(n) || g.products.some((p) => p.name.includes(n)));
      return {text: ok ? reply : g.draft, guard: g, sub};
    }
    return {text: g.draft, guard: g, sub: {...catalogue, products: []}};
  }
  const reply = brainReply(slug, catalogue, text, history);
  if (reply) return {text: reply};
  return {text: globalThis.CXCatalogueReplyCore(catalogues(), slug, text, history) || 'Produkty, balení a ceny najdete ve Výběru.'};
}
const catalogues = () => globalThis.CX_CATALOGUES || {};

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
  const d = draft(slug, globalThis.CX_CATALOGUES[slug], latest, messages);
  const extra = ['Cena platí pro uvedené balení; jiné velikosti balení mají jinou cenu, kterou v údajích nemáme. Neslibujte léčbu ani zdravotní účinky.'];
  if (d.guard) extra.push('Zákazník chce konkrétní věc. Doporučujte výhradně produkty z přiloženého katalogu (splňují požadavek). Pokud je katalog prázdný, řekněte, že takový produkt v nabídce není, a zeptejte se, s čím jiným pomoci. Nikdy nenabízejte levnější nebo jiný nesouvisející produkt jako náhradu.');
  const reply = await ai({family: 'cosmetics', brand: demo.brand, web: demo.web, catalogue: d.sub || globalThis.CX_CATALOGUES[slug], messages, draft: d.text, extra});
  return {status: 200, json: reply ? {reply} : {reply: d.text, fallback: true}};
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
