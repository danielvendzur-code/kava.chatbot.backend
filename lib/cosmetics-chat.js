/* séria 3 (Andreine základ): chat kozmetiky – overený návrh z katalógu firmy (stráž konkrétnej požiadavky k2, mozog chatu Andreine),
   produkčný model (api/ai-chat.js) ho môže prirodzene preformulovať. Bez kľúča alebo pri chybe ostáva overený návrh. */
import '../advisor-core.js';
import '../catalogue-reply-core.js';
import '../chat-brain.js';
import '../chat-adapters.js';
import '../n447/s3/chat-guard-k2.js';
import '../n447/s3/tea-reply.js';
import '../catalogues/tarani.js';
import '../catalogues/teamountain.js';
import {aiAnswer} from '../api/ai-chat.js';

export const BRANDS = {tarani: {brand: "TARANI", web: "https://www.tarani.cz/", family: "cosmetics"}, teamountain: {brand: "Tea Mountain", web: "https://www.teamountain.cz/", family: "tea"}, vitellaria: {brand: "Vitellaria", web: "https://www.vitellaria.cz/", family: "hair"}, ethia: {brand: "Ethia", web: "https://ethia.cz/", family: "cosmetics"}};
const adapters = new Map();
const catalogues = () => globalThis.CX_CATALOGUES || {};

function brainReply(key, catalogue, text, history) {
  if (!catalogue?.products?.length || !globalThis.CXChatBrain) return '';
  if (!adapters.has(key)) adapters.set(key, globalThis.CXChatBrain.adapters.cosmetics(catalogue, {family: 'cosmetics'}));
  return globalThis.CXChatBrain.reply(adapters.get(key), text, history) || '';
}
function draft(slug, catalogue, text, history) {
  const g = globalThis.CXK2ChatGuard?.guard(catalogue, text, BRANDS[slug]?.brand || slug, history);
  if (g) {
    if (g.products.length && g.deterministic) return {text: g.draft, guard: g, sub: {...catalogue, products: g.products}};
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
export function draftReply(slug, text, history = []) { return draft(slug, catalogues()[slug], text, history).text; }

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
  if (demo.family === 'tea') {
    const text = globalThis.S3TeaReply.teaReply(catalogues()[slug], latest, messages);
    const reply = await ai({family: 'tea', brand: demo.brand, web: demo.web, catalogue: catalogues()[slug], messages, draft: text,
      extra: ['Doporučujte výhradně čaje z přiloženého katalogu; cena platí pro uvedené balení. Druh a charakter čaje berte z katalogu (kategorie a vlastnosti e-shopu). Neslibujte zdravotní účinky.']});
    return {status: 200, json: reply ? {reply} : {reply: text, fallback: true}};
  }
  const d = draft(slug, catalogues()[slug], latest, messages);
  const extra = ['Cena platí pro uvedené balení; jiné velikosti balení mají jinou cenu, kterou v údajích nemáme. Neslibujte léčbu ani zdravotní účinky.'];
  if (d.guard) extra.push('Zákazník chce konkrétní věc. Doporučujte výhradně produkty z přiloženého katalogu (splňují požadavek). Pokud je katalog prázdný, řekněte, že takový produkt v nabídce není, a zeptejte se, s čím jiným pomoci. Nikdy nenabízejte levnější nebo jiný nesouvisející produkt jako náhradu.');
  const sm = d.guard?.summary;
  if (sm) {
    extra.push('Platné požadavky zákazníka z celé konverzace (pozdější zpráva je mění jen výslovně): ' + sm.asked + '. Odpověď je musí dodržet všechny současně – typ, rozpočet i vyloučené složky.');
    if (sm.excluded.length) extra.push('Zákazník výslovně NECHCE: ' + sm.excluded.join(', ') + '. Nedoporučujte produkt, který to obsahuje. Nepřítomnost tvrďte jen u produktů z přiloženého katalogu (mají ji doloženou ve složení); jinak ji neslibujte a zeptejte se.');
  }
  const reply = await ai({family: 'cosmetics', brand: demo.brand, web: demo.web, catalogue: d.sub || catalogues()[slug], messages, draft: d.text, extra});
  return {status: 200, json: reply ? {reply} : {reply: d.text, fallback: true}};
}
