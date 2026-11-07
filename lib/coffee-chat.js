/* séria 3 (Andreine základ): kávový chat pre beansmiths, merrybeans, typika, mlsnacava; HTTP vrstva je v api/cosmetics-chat.js.
   Pôvodne c2 – izolovaná kópia api/chat-447.js iba pre BLACK a Nordbeans (primárne údaje 29.–30. 10.). Odoslané ukážky ju nenačítajú.
   Pôvodne: Chat pre novú dávku ukážok (447 € + 10 €/mes.). Oddelený od api/chat.js, aby staré ukážky
   nedostali žiadnu vedľajšiu zmenu. Overený návrh odpovede pripraví n447/reply.js z dát pražiarne;
   nezmenený aiAnswer (produkčný model) ho môže prirodzene preformulovať a odmietne neoverenú cenu či odkaz. */
import {aiAnswer} from '../api/ai-chat.js';
import ENG from '../n447/c2/engine-c2.js';
import REPLY from '../n447/c2/reply-c2.js';
import D_beansmiths from '../n447/c2/data/beansmiths.js';
import D_merrybeans from '../n447/c2/data/merrybeans.js';
import D_typika from '../n447/c2/data/typika.js';
import D_mlsnacava from '../n447/c2/data/mlsnacava.js';
import D_coffeesource from '../n447/c2/data/coffeesource.js';
import D_fiftybeans from '../n447/c2/data/fiftybeans.js';
import D_dosmundos from '../n447/c2/data/dosmundos.js';
import D_illimite from '../n447/c2/data/illimite.js';
import D_voznice from '../n447/c2/data/voznice.js';
import D_ceskava from '../n447/c2/data/ceskava.js';
import D_kamikava from '../n447/c2/data/kamikava.js';
import D_laprazirna from '../n447/c2/data/laprazirna.js';
import D_kafeprosebe from '../n447/c2/data/kafeprosebe.js';
import D_poppybeans from '../n447/c2/data/poppybeans.js';
import D_mohaji from '../n447/c2/data/mohaji.js';

const {coffeeReply} = REPLY;
const euro = (v, c) => ENG.money(v, c).replace(/ /g, ' ');

/* Iba firmy novej dávky; neznámy identifikátor dostane 400, nikdy cudziu firmu. */
export const DEMOS = {beansmiths: D_beansmiths, merrybeans: D_merrybeans, typika: D_typika, mlsnacava: D_mlsnacava, coffeesource: D_coffeesource, fiftybeans: D_fiftybeans, dosmundos: D_dosmundos, illimite: D_illimite, voznice: D_voznice, ceskava: D_ceskava, kamikava: D_kamikava, laprazirna: D_laprazirna, kafeprosebe: D_kafeprosebe, poppybeans: D_poppybeans, mohaji: D_mohaji};

export function catalogueFor(data) {
  const products = data.products.filter((p) => p.available !== false).map((p) => ({
    name: p.name, url: p.url, price: (() => { const v = (p.variants || []).filter((x) => x.verifiedAt && Number.isFinite(x.price)).sort((m, n) => m.price - n.price || n.grams - m.grams)[0]; return v ? ENG.grams(v.grams) + ' za ' + euro(v.price, p.currency) + (v.regularPrice > v.price ? ' (akcia, bežne ' + euro(v.regularPrice, p.currency) + ')' : '') : ''; })(), kind: 'zrnková/mletá káva',
    facts: (p.variants || []).filter((v) => v.verifiedAt && Number.isFinite(v.price)).map((v) => `Overená cena: ${ENG.grams(v.grams)}${v.roast ? ', ' + v.roast + ' roast' : ''}, ${String(v.grind).toLowerCase()} = ${euro(v.price, p.currency)}${v.url ? ' (' + v.url + ')' : ''}.`),
    notes: p.notes && p.notes.length ? p.notes : [p.profile].filter(Boolean),
    bestFor: (p.prepText ? 'príprava podľa e-shopu: ' + p.prepText : 'praženie: ' + (p.roasts ? p.roasts.join(', ') : p.roastLabel || '')) + '; balenia: ' + p.weights.map(ENG.grams).join(', '),
    description: [p.summary, p.origin, p.process, p.decaf ? 'bez kofeínu' : ''].filter(Boolean).join('. ')
  }));
  for (const st of data.sets || []) products.push({name: st.name, url: st.url, price: euro(st.price, st.currency), kind: 'hotový set ' + st.pack, description: st.summary + ' Obsahuje: ' + st.containsNames.join(', ') + '.'});
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
    extra: ['Ceny sú presné ceny konkrétnych balení z verejného UI e-shopu (akciové ceny môžu skončiť). Uvádzajte iba ceny z riadkov „Overená cena“. Rozpočet porovnávajte s cenou celého nákupu. Netvrďte, že firma nemá vlastného sprievodcu ani chatbota.']});
  return {status: 200, json: reply ? {reply} : {reply: draft, fallback: true}};
}

