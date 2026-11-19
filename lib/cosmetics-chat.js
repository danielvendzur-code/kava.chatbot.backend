import '../catalogues/verticeramics.js';
import '../catalogues/etani.js';
import '../catalogues/sumavaforrest.js';
import '../catalogues/amoria.js';
import '../catalogues/vontree.js';
import '../catalogues/bylinkokraska.js';
import '../catalogues/essencebliss.js';
import '../catalogues/svetlonosky.js';
import '../catalogues/nabetondesign.js';
import '../catalogues/sojka.js';
import '../catalogues/dews.js';
import '../catalogues/siluvone.js';
import '../catalogues/durance.js';
import '../catalogues/vonavepranie.js';
import '../catalogues/mmnt.js';
import '../catalogues/aromis.js';
import '../catalogues/rozvoneno.js';
import '../catalogues/ketts.js';
import '../catalogues/totap.js';
import '../catalogues/kvapkavoni.js';
import '../catalogues/alma.js';
import '../catalogues/vunebis.js';
import '../catalogues/esodrogeria.js';
import '../catalogues/candella.js';
import '../catalogues/ravina.js';
import '../catalogues/inparfemy.js';
import '../catalogues/czechfragranceclub.js';
import '../catalogues/perfumeries1907.js';
import '../catalogues/veelyn.js';
import '../catalogues/parfumeur.js';
import '../catalogues/beviro.js';
import '../catalogues/spacefluid.js';
import '../catalogues/vonya.js';
import '../catalogues/essentique.js';
import '../catalogues/fragrancesamples.js';
import '../catalogues/alexmonhart.js';
import '../catalogues/flakon.js';
import '../catalogues/orion.js';
import '../catalogues/inspirovane.js';
import '../catalogues/leparfumlechic.js';
import '../catalogues/vavavoom.js';
import '../catalogues/rafinad.js';
import '../catalogues/myskino.js';
import '../catalogues/oraculum.js';
import '../catalogues/kintsugi.js';
import '../catalogues/scentisimo.js';
import '../catalogues/nicheandglow.js';
import '../catalogues/adoraniche.js';
/* séria 3 (Andreine základ): chat kozmetiky – overený návrh z katalógu firmy (stráž konkrétnej požiadavky k2, mozog chatu Andreine),
   produkčný model (api/ai-chat.js) ho môže prirodzene preformulovať. Bez kľúča alebo pri chybe ostáva overený návrh. */
import '../advisor-core.js';
import '../catalogue-reply-core.js';
import '../chat-brain.js';
import '../chat-adapters.js';
import '../n447/s3/chat-guard-k2.js';
import '../n447/s3/tea-reply.js';
import '../catalogues/tarani.js';
import '../catalogues/nutt.js';
import '../catalogues/pleva.js';
import '../catalogues/jagaia.js';
import '../catalogues/capri.js';
import '../catalogues/botanico.js';
import '../catalogues/janine.js';
import '../catalogues/eone.js';
import '../catalogues/nafigate.js';
import '../catalogues/boemi.js';
import '../catalogues/rubens.js';
import '../catalogues/safran.js';
import '../n447/s5/reply.js';
import '../catalogues/teamountain.js';
import {aiAnswer} from '../api/ai-chat.js';

export const BRANDS = {
  verticeramics: {brand: "verti ceramics", web: "https://www.verti-ceramics.sk/", family: "cosmetics"},
  "etani":{"brand":"ETANI","web":"https://www.etani.cz/pletova-kosmetika/","family":"cosmetics"},"sumavaforrest":{"brand":"Šumava FORREST","web":"https://www.sumavaforrest.cz/collections/prirodni-kosmetika","family":"cosmetics"},
  "essencebliss": {"brand": "ESSENCE BLISS", "web": "https://www.essencebliss.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Only interior scented candles, not perfume on skin or laundry. No health/infant/pet/pregnancy/aromatherapy/fire-safety/nontoxic/smokefree/longevity guarantees; no magic or attraction promises. Literal sourced fragrance notes and exact pack, selectedvariant price and stock timestamp only. No invented paid accessory or automatic cart. No inferred percent/1-10 strength."},
  "svetlonosky": {"brand": "SVĚTLONOŠKY", "web": "https://www.svetlonosky.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Only interior scented candles, not perfume on skin or laundry. No health/infant/pet/pregnancy/aromatherapy/fire-safety/nontoxic/smokefree/longevity guarantees; no magic or attraction promises. Literal sourced fragrance notes and exact pack, selectedvariant price and stock timestamp only. No invented paid accessory or automatic cart. No inferred percent/1-10 strength."},
  "nabetondesign": {"brand": "NABETONdesign", "web": "https://www.nabetondesign.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Only interior scented candles, not perfume on skin or laundry. No health/infant/pet/pregnancy/aromatherapy/fire-safety/nontoxic/smokefree/longevity guarantees; no magic or attraction promises. Literal sourced fragrance notes and exact pack, selectedvariant price and stock timestamp only. No invented paid accessory or automatic cart. No inferred percent/1-10 strength."},
  "sojka": {"brand": "SOJKA", "web": "https://www.nasesojka.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Only interior scented candles, not perfume on skin or laundry. No health/infant/pet/pregnancy/aromatherapy/fire-safety/nontoxic/smokefree/longevity guarantees; no magic or attraction promises. Literal sourced fragrance notes and exact pack, selectedvariant price and stock timestamp only. No invented paid accessory or automatic cart. No inferred percent/1-10 strength."},
  "dews": {"brand": "DEWS", "web": "https://www.dews.sk/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Laundry fragrance only; not skin perfume. Use only sourced notes/pack/SKU price/stock; avoid health/all-fabric/dryer/duration guarantees. Usage advice requires exact brand official instructions. No invented budget/cart integration."},
  "siluvone": {"brand": "SI·LU", "web": "https://www.siluvone.sk/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Laundry fragrance only; not skin perfume. Use only sourced notes/pack/SKU price/stock; avoid health/all-fabric/dryer/duration guarantees. Usage advice requires exact brand official instructions. No invented budget/cart integration."},
  "durance": {"brand": "Durance", "web": "https://durance.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Only selected Eau de parfum50ml SKUs and literal sourced notes; do not infer intensity, occasion, fixed longevity, medical benefits or EDTmini compatibility. Prices and stock are point-in-time source snapshots, not live inventory synchronization."},
  "vonavepranie": {"brand": "Voňavé pranie", "web": "https://www.vonavepranie.sk/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Laundry fragrance, not skin perfume. Source-only scent/pack/price/stock. No allfabric/medical/disinfection/dryer400C/duration guarantees. Exact usage instructions require brand source."},
  "mmnt": {"brand": "MMNT", "web": "https://mmntshop.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Two in-stock candle formulas only. Umami220/280ml out of stock excluded. Not personal perfume/laundry. No medical, toxin-free or fire-safety/burn duration guarantees."},
  "aromis": {"brand": "AROMIS", "web": "https://www.aromis.eu/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Candles for home fragrance only, not skin perfume or laundry. Preserve actual wax/vessel/dimension packs and SKU prices. No medical/aromatherapy/fire-safety/guaranteed burn duration claims. Usage only from exact official candle instructions."},
  "rozvoneno": {"brand": "Rozvoněno", "web": "https://www.rozvoneno.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Candles only, not skin perfume or laundry. No source pregnancy/infant/respiratory/mental-health/aromatherapy/air-cleaning/fire-safety or guaranteed burn claims. Exact scent/pack/price/availability only; usage per exact official instructions."},
  "ketts": {"brand": "KETT’S CANDLES", "web": "https://www.kettscandles.com/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Candles only, not skin perfume or laundry. No source pregnancy/infant/respiratory/mental-health/aromatherapy/air-cleaning/fire-safety or guaranteed burn claims. Exact scent/pack/price/availability only; usage per exact official instructions."},
  "totap": {"brand": "toTap", "web": "https://www.totap.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Own toTap inspired scents, not designer originals or equivalence guarantees. Preserve disclosure and exact native50ml409CZK SKUs.10ml159 not full-bottleprice. No measuredintensity/occasion/lasting claims beyond specific official source."},
  "kvapkavoni": {"brand": "Kvapka vôní", "web": "https://www.kvapkavoni.eu/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Laundry perfume only, never skin perfume. No disinfection, therapeutic, fabric-safety, pregnancy, dryer or guaranteed duration claims. Exactselected250ml15.90EUR, no10mlminimum confusion. Follow exact official usage only."},
  "alma": {"brand": "ALMA", "web": "https://www.alma.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Perfume sensory descriptions only. Explicitly never repeat source claims of healing/depression/anxiety/sleep/hormones/menstruation/pregnancy/birth/crystalenergy/highvibration. Do not infer fragrance notes from INCI.10ml retailpack not samples. ESSEalcoholSKU1038price1390CZK not oil duplicate. No fixed duration promise."},
  "vunebis": {"brand": "Vůně BIS", "web": "https://www.vunebis.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Laundry perfume only, neverpersonal skinuse. No guaranteed fabriccompatibility/dryer/doses/duration/therapeutic claims. Do not repeat designeroriginal/equivalence or sourceAngels10mlconflict. Five fixed50ml219.90CZK SKUs only. PRICING_REVIEW historical10–30mCZK, price447+10unchanged."},
  "esodrogeria": {"brand": "EsoDrogéria", "web": "https://www.esodrogeria.eu/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Roomreedfragrances versus roomaromaoils explicitlydistinct; neverpersonalperfume/laundry, neveringest or useonskin. Oilsnotpersonal samples;10ml fullretail. No generic electricdiffuser compatibility. No health/aromatherapy/aircleaning/infant/pet/pregnancy, guaranteeoflasting claims. NightFlowerflatnotes notconflictingpyramid."},
  "candella": {"brand": "Candella", "web": "https://www.candella.sk/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "Candles only. Literalverifiedscent/retailprice/145gwaxpack, not personalperfume/laundry. No therapeutic/no-smoke/IFRAsafety/burntimeguarantees. Lid included, notpaidaddon. SellerVATstatusUNKNOWN, notSASHEintermediaryVAT."},
  "ravina": {"brand": "RAVINA", "web": "https://ravina.cz/", "family": "cosmetics", "segment": "fragrance", "catalogueRestrictions": "APARowninspiredfragrances, neverdesigneroriginal/equivalence/guaranteedattractionor duration. OnlyF001/F065 selected50mlSTANDARD269CZK. F219/F163 photos unsuitable excluded; F002/F271soldout excluded. MALSsameoperatoronecompany. Photosillustrativeofficialgallerywithsomeinspirationinsets, not promiseddesignerbottleincluded."},
  "vontree": {"brand": "VONTREE CANDLE", "web": "https://www.vontreecandle.cz/", "family": "cosmetics", "segment": "fragrance", "scentedCandles": true},
  "bylinkokraska": {"brand": "BylinkoKráska", "web": "https://www.bylinkokraska.cz/", "family": "cosmetics", "segment": "fragrance", "scentedCandles": true},
  "amoria":{"brand":"Amoria","web":"https://amoria.cz/","family":"cosmetics","segment":"fragrance"},"inparfemy":{"brand":"INPARFEMY","web":"https://www.inparfemy.sk/","family":"cosmetics","segment":"fragrance"},"czechfragranceclub":{"brand":"Czech Fragrance Club","web":"https://www.czechfragranceclub.cz/","family":"cosmetics","segment":"fragrance"},
  "perfumeries1907":{"brand":"1907 Niche Perfumeries","web":"https://www.1907perfumeries.sk/","family":"cosmetics","segment":"fragrance"},"veelyn":{"brand":"VEELYN","web":"https://www.veelyn.sk/","family":"cosmetics","segment":"fragrance"},"parfumeur":{"brand":"PARFUMEUR","web":"https://www.parfemy-parfumeur.cz/","family":"cosmetics","segment":"fragrance"},"beviro":{"brand":"Beviro","web":"https://www.beviro.cz/","family":"cosmetics","segment":"fragrance"},"spacefluid":{"brand":"Space Fluid","web":"https://www.spacefluid.com/","family":"cosmetics","segment":"fragrance"},"vonya":{"brand":"Vonya.sk","web":"https://www.vonya.sk/","family":"cosmetics","segment":"fragrance"},"essentique":{"brand":"Essentique","web":"https://www.essentique.sk/","family":"cosmetics","segment":"fragrance"},"fragrancesamples":{"brand":"Fragrance Samples","web":"https://www.fragrancesamples.cz/","family":"cosmetics","segment":"fragrance"},"alexmonhart":{"brand":"ALEXMONHART","web":"https://www.alexmonhart.com/","family":"cosmetics","segment":"fragrance"},"flakon":{"brand":"Flakon","web":"https://www.flakon.sk/","family":"cosmetics","segment":"fragrance"},"orion":{"brand":"Parfuméria ORION","web":"https://parfumeria-orion.sk/","family":"cosmetics","segment":"fragrance"},"inspirovane":{"brand":"Inspirované parfémy","web":"https://www.inspirovaneparfemy.cz/","family":"cosmetics","segment":"fragrance"},"leparfumlechic":{"brand":"Le Parfum & Le Chic","web":"https://www.leparfumlechic.sk/","family":"cosmetics","segment":"fragrance"},"vavavoom":{"brand":"VAVAVOOM Perfumery","web":"https://www.vava-voom.cz/","family":"cosmetics","segment":"fragrance"},"rafinad":{"brand":"RAFINAD Parfumerie","web":"https://www.rafinadparfumerie.com/cs","family":"cosmetics","segment":"fragrance"},myskino:{brand:'MYSKINO',web:'https://www.myskino.cz/',family:'cosmetics'},oraculum:{brand:'ORACULUM',web:'https://oraculum.store/',family:'cosmetics'},kintsugi:{brand:'Kintsugi Perfumes',web:'https://www.kintsugiperfumes.com/',family:'cosmetics'},scentisimo:{"brand": "Scentisimo", "web": "https://www.scentisimo.cz/", "family": "cosmetics"},nicheandglow:{"brand": "Niche & Glow", "web": "https://www.nicheandglow.cz/", "family": "cosmetics"},adoraniche:{"brand": "Adora Niche", "web": "https://www.adoraniche.sk/", "family": "cosmetics"},safran:{brand:"Mýdlárna Šafrán",web:"https://www.mydlarnasafran.cz/",family:"cosmetics"},rubens:{brand:"Mýdlárna Rubens",web:"https://www.mydlarnarubens.cz/",family:"cosmetics"},boemi:{brand:"BOEMI",web:"https://www.boemi.cz/",family:"cosmetics"},nafigate:{brand:"NAFIGATE Cosmetics",web:"https://www.nafigatecosmetics.cz/",family:"cosmetics"},eone:{brand:"Eoné",web:"https://eone.cz/cs/",family:"cosmetics"},janine:{brand:"Janine",web:"https://janinekozmetika.sk/",family:"cosmetics"},botanico:{brand:"Botanico",web:"https://www.botanico.cz/",family:"cosmetics"},capri:{brand:"Kosmetika Capri",web:"https://www.kosmetikacapri.cz/",family:"cosmetics"},jagaia:{brand:"JAGAIA",web:"https://www.jagaia.cz/",family:"cosmetics"},pleva:{brand:'Pleva',web:'https://www.pleva.cz/',family:'cosmetics'}, nutt: {brand: 'NUTT', web: 'https://www.nutt.cz/', family: 'cosmetics'}, tarani: {brand: "TARANI", web: "https://www.tarani.cz/", family: "cosmetics"}, teamountain: {brand: "Tea Mountain", web: "https://www.teamountain.cz/", family: "tea"}, vitellaria: {brand: "Vitellaria", web: "https://www.vitellaria.cz/", family: "hair"}, ethia: {brand: "Ethia", web: "https://ethia.cz/", family: "cosmetics"}, pureharmony: {brand: "Pure Harmony", web: "https://www.pureharmony.cz/", family: "cosmetics"}, mydlozfarmy: {brand: "Mydlo z farmy", web: "https://www.mydlozfarmy.sk/", family: "cosmetics"}, mydlenka: {brand: "MýdLenka", web: "https://www.mydlenka.cz/", family: "cosmetics"}, mydlove: {brand: "MYDLOVE", web: "https://www.mydlove.com/", family: "cosmetics"}, rae: {brand: "RaE", web: "https://www.raekosmetika.cz/", family: "cosmetics"}, vaanok: {brand: "VAANOK", web: "https://vaanok.sk/", family: "cosmetics"}};
const adapters = new Map();
const catalogues = () => globalThis.CX_CATALOGUES || {};

function brainReply(key, catalogue, text, history) {
  if (!catalogue?.products?.length || !globalThis.CXChatBrain) return '';
  if (!adapters.has(key)) adapters.set(key, globalThis.CXChatBrain.adapters.cosmetics(catalogue, {family: 'cosmetics'}));
  return globalThis.CXChatBrain.reply(adapters.get(key), text, history) || '';
}
function draft(slug, catalogue, text, history) {
  const s5 = globalThis.S5CatalogueReply?.reply(slug, catalogue, text, history);
  if(s5)return {text:s5};
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
  const excluded = globalThis.S5CatalogueReply?.exclusion?.(slug, latest, messages);
  if (excluded) return {status: 200, json: {reply: excluded, fallback: true}};
  const d = draft(slug, catalogues()[slug], latest, messages);
  if (slug === 'verticeramics') return {status: 200, json: {reply: d.text}};
  const extra = demo.segment==='fragrance' ? [
    'Cenu, balení a dostupnost berte z konkrétního přiloženého produktu. Jiné doložené velikosti jsou pouze ve výslovných source.upsellVariants; další ceny ani sklad nevymýšlejte.',
    'Vonné tóny jsou údaje prodejce, nikoli záruka obliby vůně. Intenzitu, příležitost, zdravotní účinky ani výdrž netvrďte bez konkrétního zdroje.',
    'Produkty isSample jsou malé vzorky nebo odstřiky v uvedeném objemu; fotografie původního flakonu je ilustrační. Tester a inspirovaný parfém musí zůstat jasně označen.',
    'Volitelný tělový doplněk source.resultOnlySupplement je jiný výrobek ze stejné pojmenované vonné řady, nikoli shodné chemické složení. Nezaručujte zdravotní kompatibilitu, neoznamujte vložení do košíku a neslibujte skladovou integraci.'
  ] : ['Cena platí pro uvedené balení; jiné velikosti balení mají jinou cenu, kterou v údajích nemáme. Neslibujte léčbu ani zdravotní účinky.'];
  if (demo.catalogueRestrictions) extra.push(demo.catalogueRestrictions);
  if (demo.scentedCandles) extra.push(
    'Katalog obsahuje interiérové vonné svíčky. Nepopisujte je jako parfémy na tělo či vůně na prádlo. Citujte pouze uvedené tóny, balení a ceny konkrétní varianty.',
    'Neslibujte zdravotní účinky, bezpečnost ani výdrž. U VONTREE cena nezahrnuje volitelné gravírování.'
  );
  if (d.guard) extra.push('Zákazník chce konkrétní věc. Doporučujte výhradně produkty z přiloženého katalogu (splňují požadavek). Pokud je katalog prázdný, řekněte, že takový produkt v nabídce není, a zeptejte se, s čím jiným pomoci. Nikdy nenabízejte levnější nebo jiný nesouvisející produkt jako náhradu.');
  const sm = d.guard?.summary;
  if (sm) {
    extra.push('Platné požadavky zákazníka z celé konverzace (pozdější zpráva je mění jen výslovně): ' + sm.asked + '. Odpověď je musí dodržet všechny současně – typ, rozpočet i vyloučené složky.');
    if (sm.excluded.length) extra.push('Zákazník výslovně NECHCE: ' + sm.excluded.join(', ') + '. Nedoporučujte produkt, který to obsahuje. Nepřítomnost tvrďte jen u produktů z přiloženého katalogu (mají ji doloženou ve složení); jinak ji neslibujte a zeptejte se.');
  }
  const reply = await ai({family: 'cosmetics', brand: demo.brand, web: demo.web, catalogue: d.sub || catalogues()[slug], messages, draft: d.text, extra});
  return {status: 200, json: reply ? {reply} : {reply: d.text, fallback: true}};
}
