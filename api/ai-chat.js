/* Natural answers for every chat message: Claude answers the customer in its own words, grounded in
   the shop's verified catalogue, shipping facts and the catalogue rules' draft answer. Anything the
   model writes that is not in that data (a price, a link) sends the draft answer instead. */
const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CHAT_MODEL || 'claude-sonnet-5-5';
// Claude Sonnet 5.5 and Haiku 5.5 take no temperature; thinking stays off for these short chat answers,
// and Sonnet 5.5 hands a declined request to the fallback model instead of returning nothing.
const MODEL_OPTIONS = /^claude-sonnet-5-5/.test(MODEL) ? {thinking: {type: 'between_tools'}, output_config: {effort: 'low'}, fallbacks: 'default'} : /^claude-haiku-5-5/.test(MODEL) ? {thinking: {type: 'disabled'}, output_config: {effort: 'low'}} : {temperature: 0.3};
const MODEL_HEADERS = /^claude-sonnet-5-5/.test(MODEL) ? {'anthropic-beta': 'server-side-fallback-2026-07-01'} : {};

const FAMILY = {
  coffee: {sk: 'kávy', cs: 'kávy', knows: 'káve (druhy, pôvod, praženie, príprava, mletie, skladovanie, chuť)'},
  cosmetics: {sk: 'prírodnej kozmetiky', cs: 'přírodní kosmetiky', knows: 'starostlivosti o pleť a telo (typy pleti, poradie krokov, zložky, používanie)'},
  hair: {sk: 'vlasovej kozmetiky', cs: 'vlasové kosmetiky', knows: 'starostlivosti o vlasy a pokožku hlavy'},
  plants: {sk: 'rastlín', cs: 'rostlin', knows: 'pestovaní rastlín (svetlo, zálievka, presádzanie, substráty)'},
  wine: {sk: 'vína', cs: 'vína', knows: 'víne (odrody, štýly, párovanie s jedlom, servírovanie, skladovanie)'},
  tea: {sk: 'čaju', cs: 'čaje', knows: 'čaji (druhy, príprava, teplota vody, lúhovanie)'}
};

const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const words = s => norm(s).split(/[^a-z0-9]+/).filter(w => w.length >= 4).map(w => w.slice(0, 6));
const short = (s, n) => { const t = String(s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t; };

function productLine(p) {
  const bits = [p.kind, p.category, p.volume && !/balenie podla|baleni podle/.test(norm(p.volume)) ? p.volume : '', p.weights, Array.isArray(p.notes) ? 'chuť: ' + p.notes.join(', ') : '', p.acidityNote, p.bestFor, p.what, ...Object.entries(p.wineFacts || {}).filter(([, v]) => v && typeof v !== 'object').map(([k, v]) => k + ': ' + v), Array.isArray(p.facts) ? p.facts.join(' ') : '', short(p.description || p.reason, 160)].filter(Boolean);
  const price = p.price || (Number.isFinite(p.priceAmount) ? String(p.priceAmount) : '');
  return `- ${p.name}${price ? ' — ' + price : ''}${p.available === false ? ' (momentálne nie je skladom)' : ''}${bits.length ? ' | ' + bits.join('; ') : ''} | ${p.url || ''}`;
}

/* The products the conversation is about: those just shown, then the closest matches to the question. */
function pickProducts(products, messages, draft) {
  const shown = new Set([draft, ...messages.slice(-4).map(m => m.content)].join(' ').match(/https?:\/\/[^\s)]+/g) || []);
  const asked = new Set(words(messages.filter(m => m.role === 'user').slice(-2).map(m => m.content).join(' ')));
  const score = p => words([p.name, p.kind, p.category, Array.isArray(p.notes) ? p.notes.join(' ') : '', p.description].join(' ')).filter(w => asked.has(w)).length;
  const said = norm([draft, ...messages.slice(-4).map(m => m.content)].join(' '));
  const isShown = p => (p.url && shown.has(p.url)) || (p.name && p.name.length > 5 && said.includes(norm(p.name)));
  const mentioned = products.filter(isShown);
  const rest = products.filter(p => p.available !== false && !isShown(p)).map(p => [score(p), p]).sort((a, b) => b[0] - a[0]).slice(0, 30).map(x => x[1]);
  return [...mentioned, ...rest].slice(0, 36);
}

/* Compare whole monetary values, including currency. Formatting is not a new price:
   12.9 €, 12,90 eur and 12.90 EUR are equal; 2.9 €, 12.9 Kč and a date are not. */
function moneyKey(raw, currency) {
  const value = raw.trim().replace(/[\u00a0\u202f]/g, ' ');
  let whole, fraction = '';
  if (/^\d+(?:[.,]\d{1,2})?$/.test(value)) [whole, fraction = ''] = value.split(/[.,]/);
  else {
    const grouped = value.match(/^(\d{1,3}(?: \d{3})+|\d{1,3}(?:\.\d{3})+|\d{1,3}(?:,\d{3})+)(?:([.,])(\d{1,2}))?$/);
    if (!grouped || (grouped[2] && grouped[1].includes(grouped[2]))) return null;
    whole = grouped[1].replace(/[ .,]/g, ''); fraction = grouped[3] || '';
  }
  return (/^(?:€|eur)$/i.test(currency) ? 'EUR:' : 'CZK:') + whole.replace(/^0+(?=\d)/, '') + '.' + fraction.padEnd(2, '0');
}
const moneyTokens = text => [...String(text).matchAll(/(?<![\p{L}\p{N}.,])(\d[\d \u00a0\u202f.,]*?)\s*(€|(?:eur|kč|kc|czk)(?!\p{L}))/giu)];
const links = text => (String(text).match(/https?:\/\/[^\s<>"')]+/g) || []).map(u => u.replace(/[.,;]+$/, ''));
function grounded(reply, data) {
  const prices = new Set(moneyTokens(data).map(m => moneyKey(m[1], m[2])).filter(Boolean));
  for (const m of moneyTokens(reply)) {
    const key = moneyKey(m[1], m[2]);
    if (!key || !prices.has(key)) return false;
  }
  const allowedLinks = new Set(links(data));
  return links(reply).every(u => allowedLinks.has(u));
}

export async function aiAnswer({family = 'coffee', brand, web, catalogue, messages, draft = '', extra = [], apiKey = API_KEY, fetchImpl = fetch}) {
  if (!apiKey || !Array.isArray(messages) || !messages.length) return null;
  const lang = /\.cz(\/|$)|\/cs\//.test(String(web || catalogue?.source || '')) ? 'cs' : 'sk';
  const fam = FAMILY[family] || FAMILY.coffee;
  const products = pickProducts(Array.isArray(catalogue?.products) ? catalogue.products : [], messages, draft);
  const s = catalogue?.shipping || {};
  const shop = [...(s.lines || []), ...(s.payment || []), ...(s.delivery || []), ...(s.pickup || [])];
  const data = [
    `E-shop: ${brand} — ${web}`,
    products.length ? `Produkty z ponuky (názov — cena | údaje | odkaz):\n${products.map(productLine).join('\n')}` : '',
    shop.length ? `Doprava, platba, doručenie a osobný odber podľa e-shopu${s.checkedAt ? ' (' + s.checkedAt + ')' : ''}:\n- ${shop.join('\n- ')}${s.url ? '\nPodrobnosti: ' + s.url : ''}` : 'Dopravu, platbu a kontakt v ukážke overené nemáme; sú v e-shope.',
    ...extra.filter(Boolean),
    draft ? `Návrh odpovede z pravidiel katalógu (overené, môžete ho použiť, skrátiť alebo preformulovať; ak nesedí na otázku, nepoužite ho):\n${draft}` : ''
  ].filter(Boolean).join('\n\n');
  const system = [
    `Ste priateľský a šikovný online predajca ${fam[lang]} v e-shope ${brand}. Rozprávate sa so zákazníkom ako skúsený predavač v obchode: odpovedáte presne na to, na čo sa pýta, prirodzene a ľudsky, a pomáhate mu vybrať a kúpiť.`,
    lang === 'cs' ? 'Odpovídejte česky, vykejte, bez rodových tvarů o sobě.' : 'Odpovedajte po slovensky, vykajte, bez rodových tvarov o sebe.',
    'Píšte stručne: 1 až 4 vety, pri odporúčaní najviac 3 produkty, každý na samostatnom riadku v tvare „Názov — cena“ a pod ním jeho celý odkaz z údajov. Obyčajný text, žiadne hviezdičky, mriežky ani markdown.',
    'Konkrétne produkty, ceny, balenia, zloženie, dopravu, platbu, adresy, kontakty a otváracie hodiny uvádzajte IBA z údajov nižšie, presne tak, ako sú napísané. Nič si nevymýšľajte. Čo v údajoch nie je, povedzte otvorene a odkážte na e-shop.',
    `Na všeobecné otázky o ${fam.knows} môžete odpovedať zo všeobecných znalostí, krátko a bez tvrdení o konkrétnych produktoch, ktoré nie sú v údajoch.`,
    'Zdravotné otázky neposudzujte: pri chorobe, tehotenstve či alergii odporučte lekára alebo lekárnika a ponúknite len to, čo údaje výslovne uvádzajú.',
    'Ak otázka nesúvisí s nákupom ani s témou obchodu, odpovedzte jednou vetou a ponúknite pomoc s výberom.',
    'Keď sa to hodí, pomôžte rozhodnúť: povedzte, prečo sa produkt hodí, a navrhnite ďalší krok (napr. veľkosť balenia alebo doplnok).'
  ].join('\n');
  const history = messages.slice(-8).map(m => ({role: m.role, content: String(m.content).slice(0, 1500)}));
  while (history[0]?.role === 'assistant') history.shift();
  try {
    const res = await fetchImpl('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: AbortSignal.timeout(10000),
      headers: {'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', ...MODEL_HEADERS},
      body: JSON.stringify({model: MODEL, max_tokens: 600, ...MODEL_OPTIONS, system: [{type: 'text', text: system}, {type: 'text', text: 'Overené údaje:\n\n' + data}], messages: history})
    });
    if (!res.ok) { console.error('ai chat error', res.status, (await res.text()).slice(0, 300)); return null; }
    const out = await res.json();
    if (out.stop_reason === 'refusal') return null;
    const text = (Array.isArray(out.content) ? out.content.filter(b => b.type === 'text').map(b => b.text).join('') : '')
      .replace(/[*_`#]+/g, '').replace(/\n{3,}/g, '\n\n').trim();
    if (!text) return null;
    if (!grounded(text, data)) { console.warn('ai chat answer not grounded, using catalogue answer'); return null; }
    return text;
  } catch (error) { console.error('ai chat failed', error?.message || error); return null; }
}
