/* Overená odpoveď chatu pre novú dávku. Odpovedá iba z dát konkrétnej pražiarne;
   používa ju prehliadač (okamžitá odpoveď) aj API (návrh, ktorý AI môže preformulovať). */
import {money} from './coffee-engine.mjs';

const fold = (s) => String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const line = (p) => `${p.name} — ${p.kind === 'drip' ? money(p.price, p.currency) : 'od ' + money(p.priceFrom, p.currency)}\n${p.url}`;
const tones = (p) => p.notes?.length ? p.notes.slice(0, 4).join(', ') : (p.profile || '');
const roastText = (p) => p.roasts.map((r) => ({espresso: 'espresso', filter: 'filter', omni: 'omni'}[r])).join(' aj ');
const weights = (p) => p.weights.map((g) => g >= 1000 ? String(g / 1000).replace('.', ',') + ' kg' : g + ' g').join(', ');

/* Kľúčové slová názvu (bez krajiny a „blend“) – „black sheep“, „gotiti“, „sophie“ … */
function keyWords(p) {
  const tail = fold(p.name.split('•').pop()).replace(/\b(aa|ab|decaf)\b/g, '').trim();
  return [tail, ...tail.split(/\s+/).filter((w) => w.length >= 5)];
}
function mentioned(data, text) {
  /* Adresy a názov značky (napr. „black“ v black.sk) nie sú zmienka o konkrétnej káve. */
  const brand = fold(data.brand.name).replace(/[^a-z0-9]/g, '');
  const q = fold(text).replace(/https?:\/\/\S+/g, ' ');
  const hits = [...data.products, data.drip].filter(Boolean).map((p) => {
    const kw = keyWords(p).filter((k) => k && k !== brand);
    const idx = Math.min(...kw.map((k) => q.indexOf(k)).filter((i) => i >= 0), p.kind === 'drip' && /drippin/.test(q) ? q.indexOf('drippin') : Infinity);
    return [idx, p];
  }).filter(([i]) => Number.isFinite(i));
  return hits.sort((a, b) => a[0] - b[0]).map(([, p]) => p);
}

function facts(p) {
  if (p.kind === 'drip') return `${p.name} je balenie ${p.pack} za ${money(p.price, p.currency)}. Vyberáte si kávu: ${p.options.map((o) => o.title).join(' alebo ')}.\n${p.url}`;
  const bits = [`${p.name}:`, p.summary, tones(p) ? `V chuti: ${tones(p)}.` : '', `Pôvod: ${p.origin}${p.process ? ', spracovanie ' + p.process : ''}.`, `Praženie: ${roastText(p)}; balenia ${weights(p)}.`];
  return bits.filter(Boolean).join(' ') + `\nCena od ${money(p.priceFrom, p.currency)}, presnú cenu ukáže e-shop po výbere balenia a mletia.\n${p.url}`;
}

export function coffeeReply(data, text, history = []) {
  const q = fold(text);
  const coffees = data.products.filter((p) => p.available !== false);
  const pick = (ids) => ids.map((id) => coffees.find((p) => p.id === id)).filter(Boolean);
  const byTaste = (g, n = 2) => coffees.filter((p) => p.taste === g && !p.decaf).sort((a, b) => a.priceFrom - b.priceFrom).slice(0, n);
  let named = mentioned(data, text);
  /* Doplňujúca otázka bez názvu („a koľko stojí?“) sa týka poslednej spomenutej kávy. */
  if (!named.length && /cen|stoj|kolko|balen|prazen|mlet|chut|povod|odkial|kysl/.test(q)) {
    const last = [...history].reverse().find((m) => m.role === 'assistant');
    if (last) named = mentioned(data, last.content).slice(0, 1);
  }
  if (named.length >= 2 && /porovn|rozdiel|alebo|vs|lepsi|ktor/.test(q)) {
    const [a, b] = named;
    const desc = (p) => p.kind === 'drip' ? `${p.name}: ${p.pack}` : `${p.name}: ${tones(p)}; ${p.process || ''}; praženie ${roastText(p)}`;
    return `${desc(a)}.\n${desc(b)}.\nAk chcete sladší a plnší šálok, siahnite skôr po tej s čokoládou či tmavým ovocím; ak sviežejší, po tej s ríbezľami alebo citrusom.\n${line(a)}\n${line(b)}`;
  }
  if (named.length && /cen|stoj|kolko/.test(q) && named[0].kind !== 'drip') {
    const p = named[0];
    return `${p.name} začína v e-shope na ${money(p.priceFrom, p.currency)}; v ponuke sú balenia ${weights(p)}. Presnú cenu e-shop ukáže po výbere balenia a mletia.\n${p.url}`;
  }
  if (named.length) return facts(named[0]);
  if (/bez ?kofe|decaf|vecer/.test(q)) {
    const d = coffees.find((p) => p.decaf);
    return d ? `Bez kofeínu je ${d.name}. ${d.summary}\n${line(d)}` : 'Kávu bez kofeínu v ponuke momentálne nevidím.';
  }
  if (/kapsul|nespresso/.test(q)) return 'Kapsule pražiareň predáva samostatne v kategórii káva; tento výber odporúča zrnkovú a mletú kávu. Kompatibilitu kapsúl si overte priamo pri produkte.\n' + data.brand.shopUrl;
  if (/drip|vreck|vrecus|cest|praca|kancel|bez kavovar|bez pomuc|hotel|chata/.test(q) && data.drip) return `Na cesty sa hodí ${data.drip.name}: ${data.drip.pack}, stačí šálka a horúca voda.\n${line(data.drip)}`;
  if (/doprav|postovn|doruc|zasiel/.test(q)) return `${data.shop.freeShipping} Ďalšie možnosti dopravy a platby nájdete pri objednávke v e-shope.`;
  if (/kontakt|mail|telef|kaviaren|predajn|adres/.test(q)) return `Pražiareň black. je k dispozícii na ${data.brand.contact}. Kaviarne nájdete na ${data.brand.web.replace(/\/sk$/, '')}/sk/nase-kaviarne`;
  if (/v60|hario|filtr|filter|aeropress|french|chemex|prekvap/.test(q)) {
    const recs = pick(['gitega', 'juicy-pussy']);
    const recipe = /v60|hario/.test(q) && data.guides?.v60 ? `\nRecept pražiarne na V60: ${data.guides.v60.steps[0]} ${data.guides.v60.url}` : '';
    return `Na filter odporúčam kávy vo filter pražení, napríklad:\n${recs.map(line).join('\n')}\nPri objednávke zvoľte mletie podľa pomôcky (drip, AeroPress, French press) alebo zrnkovú.${recipe}`;
  }
  if (/cokol|karamel|orech|oriesk|horka|tmav|klasick|mliek|capp|latte|automat|pakov|espresso|moka/.test(q)) {
    const recs = byTaste('choco');
    return `Ak chcete sladšiu, čokoládovú chuť do kávovaru, skúste:\n${recs.map((p) => `${line(p)}\n(V chuti: ${tones(p)}.)`).join('\n')}\nObe sú v espresso pražení; do automatu zvoľte zrnkovú.`;
  }
  if (/ovoc|bobul|visn|malin|cucori|tropic/.test(q)) {
    const recs = byTaste('fruitFull');
    return `Plnú ovocnú chuť majú napríklad:\n${recs.map((p) => `${line(p)}\n(V chuti: ${tones(p)}.)`).join('\n')}`;
  }
  if (/kysl|sviez|citrus|ribez|caj|lahk|jemn/.test(q)) {
    const recs = byTaste('fresh');
    return `Sviežu, šťavnatú chuť majú napríklad:\n${recs.map((p) => `${line(p)}\n(V chuti: ${tones(p)}.)`).join('\n')}`;
  }
  if (/cen|lacn|najlacn|stoj|kolko|rozpoc/.test(q)) {
    const cheap = coffees.filter((p) => !p.decaf).sort((a, b) => a.priceFrom - b.priceFrom).slice(0, 2);
    return `Najnižšie ceny v ponuke majú:\n${cheap.map(line).join('\n')}\nPresná cena závisí od balenia (200 g, 500 g, 1 kg) a mletia; e-shop ju ukáže po výbere.`;
  }
  return `Rád pomôžem vybrať kávu z ponuky black. Napíšte, ako kávu pripravujete a akú chuť máte radi, alebo skúste krátky výber v záložke Výber kávy. Na začiatok napríklad:\n${line(pick(['doce-citrus'])[0])}`;
}
