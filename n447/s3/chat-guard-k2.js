/* n447 dávka 2 (kozmetika2) – strážca konkrétnej požiadavky v chate. Používa ho IBA api/cosmetics-chat-447b.js (nová dávka);
   odoslané ukážky a zdieľaný chat-brain sa nemenia.
   Keď zákazník pomenuje zložku/vôňu (levanduľa, měsíček, káva…), typ produktu (mydlo, soľ do kúpeľa…) alebo rozpočet,
   do odpovede smú ísť iba produkty, ktoré to podľa názvu, popisu alebo overeného zaradenia (k2Terms) naozaj spĺňajú.
   Keď taký produkt nie je, povieme to a opýtame sa – nikdy ho nenahradíme lacnejším nesúvisiacim produktom. */
(function (scope) {
  'use strict';
  const norm = (v) => String(v || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[’']/g, '');

  // Zložky a vône: kľúč, popis (sk, cs), regex nad normalizovaným textom.
  const TERMS = [
    ['lavender', 'levanduľa', 'levandule', /\blevandul|\blavend|\blavandul/],
    ['calendula', 'nechtík (měsíček)', 'měsíček', /\bmesic(ek|k)|\bnechtik|\bcalendul/],
    ['rose', 'ruža', 'růže', /\bruz(e|i|a|ou|emi)\b|\bruzov|\bruzi\b|\brose\b|\broses\b|\brosa (damascena|centifolia|alba|gallica)/],
    ['coffee', 'káva', 'káva', /\bkav(a|y|u|ou|e|ov\w*)\b|\bcoffee/],
    ['coconut', 'kokos', 'kokos', /\bkokos|\bcoconut|\bcocos nucifera/],
    ['vanilla', 'vanilka', 'vanilka', /\bvanil/],
    ['honey', 'med', 'med', /\bmed(u|em|om|ov[aey]|ovy|ova|ove)?\b|\bhoney|\bmel\b/],
    ['lemonBalm', 'medovka', 'meduňka', /\bmedovk|\bmedunk|\blemon ?balm|\bmelissa/],
    ['yogurt', 'jogurt', 'jogurt', /\bjogurt|\byogh?urt/],
    ['whey', 'srvátka', 'syrovátka', /\bsyrovat|\bsrvatk/],
    ['charcoal', 'aktívne uhlie', 'aktivní uhlí', /\buhli(e|m)?\b|\bcharcoal/],
    ['salt', 'soľ', 'sůl', /\bsoln|\bsul\b|\bsol\b|\bsoli\b|\bsalt/],
    ['citrus', 'citrus', 'citrus', /\bcitrus|\bcitron(?!ov\w* trav)/],
    ['orange', 'pomaranč', 'pomeranč', /\bpomer?anc|\bpomaranc|\borange|\bcitrus aurantium dulcis|\bcitrus sinensis/],
    ['mandarin', 'mandarínka', 'mandarinka', /\bmandarin|\bcitrus reticulata/],
    ['grapefruit', 'grep', 'grep', /\bgrep|\bgrapefruit|\bcitrus paradisi/],
    ['matcha', 'matcha', 'matcha', /\bmatch/],
    ['opuntia', 'opuncia', 'opuncie', /\bopunc|\bopunti/],
    ['buckthorn', 'rakytník', 'rakytník', /\brakytn|\bbuckthorn/],
    ['nettle', 'žihľava', 'kopřiva', /\bkopriv|\bzihlav|\bnettle/],
    ['chamomile', 'harmanček', 'heřmánek', /\bhermank|\bhermanek|\bharmanc|\bchamomil|\bchamomilla|\bmatricaria/],
    ['mint', 'mäta', 'máta', /\bmat(a|ou|y|u)\b|\bmatov|\bmint|\bmentha/],
    ['neem', 'neem', 'neem', /\bneem/],
    ['sandal', 'santal', 'santal', /\bsantal|\bsandal/],
    ['eucalyptus', 'eukalyptus', 'eukalyptus', /\beukalypt|\beucalypt/],
    ['rosemary', 'rozmarín', 'rozmarýn', /\brozmar|\brosemar|\brosmarin/],
    ['teatree', 'čajovník', 'čajovník', /\bcajovn|\btea.?tree|\bmelaleuca/],
    ['aloe', 'aloe', 'aloe', /\baloe/],
    ['argan', 'argan', 'argan', /\bargan/],
    ['jojoba', 'jojoba', 'jojoba', /\bjojob|\bsimmondsia/],
    ['shea', 'bambucké maslo', 'bambucké máslo', /\bbambuck|\bshea\b|\bkarite|\bbutyrospermum/],
    ['cocoa', 'kakao', 'kakao', /\bkakao|\bkakaov|\bcocoa|\btheobroma/],
    ['chocolate', 'čokoláda', 'čokoláda', /\bcokolad|\bchoco/],
    ['cinnamon', 'škorica', 'skořice', /\bskoric|\bcinnamon/],
    ['clove', 'klinček', 'hřebíček', /\bhrebic|\bklinc|\bclove/],
    ['ylang', 'ylang-ylang', 'ylang-ylang', /\bylang|\bcananga/],
    ['patchouli', 'pačuli', 'pačuli', /\bpacul|\bpatchoul|\bpogostemon/],
    ['clay', 'íl', 'jíl', /\bjil(u|em|y|ov\w*)?\b|\bil(u|om|y)?\b|\bclay/],
    ['hemp', 'konope', 'konopí', /\bkonop|\bhemp|\bcbd\b|\bcannabis/],
    ['rosehip', 'šípky', 'šípek', /\bsipk|\bsipek|\brosehip|\brosa canina|\brosa moschata/],
    ['avocado', 'avokádo', 'avokádo', /\bavokad|\bavocad|\bpersea/],
    ['turmeric', 'kurkuma', 'kurkuma', /\bkurkum|\bturmeric/],
    ['ginger', 'zázvor', 'zázvor', /\bzazvor|\bginger/],
    ['bergamot', 'bergamot', 'bergamot', /\bbergamot|\bcitrus aurantium bergamia|\bcitrus bergamia/],
    ['lemongrass', 'citrónová tráva', 'citronová tráva', /\bcitronov\w* trav|\blemongrass|\blemon grass|\bcymbopogon/],
    ['oat', 'ovos', 'oves', /\bovos|\bovs|\boves|\bovesn|\boat/],
    ['goat', 'kozie mlieko', 'kozí mléko', /\bkoz(i|ie)\b|\bgoat/],
    ['milk', 'mlieko', 'mléko', /\bmlek|\bmliek|\bmilk/],
    ['hyaluron', 'kyselina hyalurónová', 'kyselina hyaluronová', /\bhyaluron/],
    ['vitaminC', 'vitamín C', 'vitamin C', /\bvitamin\w* c\b/],
    ['niacinamide', 'niacínamid', 'niacinamid', /\bniacin/],
    ['retinol', 'retinol', 'retinol', /\bretin/],
    ['bakuchiol', 'bakuchiol', 'bakuchiol', /\bbakuchiol/],
    ['mango', 'mango', 'mango', /\bmang(o|a|em)\b/],
    ['blueberry', 'čučoriedka', 'borůvka', /\bboruvk|\bcucoried|\bblueberr/],
    ['raspberry', 'malina', 'malina', /\bmalin(a|y|ov\w*|ou)\b|\braspberr/],
    ['strawberry', 'jahoda', 'jahoda', /\bjahod|\bstrawberr/],
    ['cucumber', 'uhorka', 'okurka', /\bokurk|\buhork|\bcucumber/],
    ['seaweed', 'riasa', 'řasa', /\bras(a|y|ou)\b|\brias(a|y|ou)\b|\bspirulin|\bseaweed/],
    ['jasmine', 'jazmín', 'jasmín', /\bjasmin|\bjazmin/],
    ['cedar', 'céder', 'cedr', /\bcedr|\bceder/],
    ['almond', 'mandľa', 'mandle', /\bmandl|\bmandel|\balmond|\bprunus amygdalus/],
    ['apricot', 'marhuľa', 'meruňka', /\bmarhul|\bmerunk|\bapricot/],
    ['immortelle', 'slamiha', 'smil', /\bslamih|\bsmil\b|\bimmortel/],
    ['men', 'pre mužov', 'pro muže', /\bmuz(i|um|ov|om)\b|\bmuzsk|\bpr[oe] muz|\bpansk|\bpro pany|\bpre panov|\bgentlem|\bfor men\b/],
    ['kids', 'pre deti', 'pro děti', /\bdet(i|em|sk\w*)\b|\bdite\b|\bdietat|\bbaby|\bkids?\b/],
    // potreby pleti/vlasov – overujú sa voči popisu, štítkom (tags) a overenému zaradeniu (k2Terms)
    ['oily', 'mastné', 'mastné', /\bmastn|\boily\b/],
    ['dry', 'suché', 'suché', /\bsuch(a|e|y|ou|ych|u|ej|ym)\b|\bdry\b/],
    ['sensitive', 'citlivé', 'citlivé', /\bcitliv|\bsensitiv/],
    ['dandruff', 'lupiny', 'lupy', /\blupin|\blup(y|u|ech)\b|\bdandruff/],
    ['blemish', 'problematická pleť / akné', 'problematická pleť / akné', /\bakn(e|e)\b|\bakne|\bproblemat|\bpupin|\bblemish/],
    ['mature', 'zrelá pleť / vrásky', 'zralá pleť / vrásky', /\bzral|\bzrel|\bvrask|\banti.?age|\bmature/],
    ['hairLoss', 'vypadávanie vlasov', 'vypadávání vlasů', /\bvypadav|\bvypadani|\bpadaj\w*( mi)? vlas|\bpadaju|\brednut|\bridnut|\bhair ?loss/],
    ['curly', 'kučeravé vlasy', 'kudrnaté vlasy', /\bkucerav|\bkudrn|\bvlnit|\bcurl/],
    ['unscented', 'bez vône', 'bez vůně', /\bneparfem|\bbez (vune|vone|parfem\w*)|\bunscented|\bfragrance.?free/],
  ].map(([key, sk, cs, re]) => ({key, sk, cs, re}));

  // Typ produktu – hľadá sa v názve a druhu produktu (nie v popise).
  const TYPES = [
    ['soap', 'mydlo', 'mýdlo', /\bmydl(o|a|u|em|ech|ov\w*|e)?\b|\bmydel\b|\bsoap/],
    ['shampoo', 'šampón', 'šampon', /\bsamp(on|un)\w*|\bshampoo/],
    ['conditioner', 'kondicionér', 'kondicionér', /\bkondicion/],
    ['bath', 'produkt do kúpeľa', 'produkt do koupele', /\bkoupel|\bkupel|\bbath\b|\bsumiv/],
    ['oil', 'olej', 'olej', /\bolej|\boil\b/],
    ['serum', 'sérum', 'sérum', /\bser(um|a)\b/],
    ['cream', 'krém', 'krém', /\bkrem/],
    ['mask', 'maska', 'maska', /\bmask/],
    ['scrub', 'peeling', 'peeling', /\bpeeling|\bpiling|\bscrub/],
    ['lip', 'balzam na pery', 'balzám na rty', /\bna rty|\bna pery|\blip\b|\bbalzam\w* na (rty|pery)/],
    ['deo', 'dezodorant', 'deodorant', /\bdeodor|\bdezodor/],
    ['tonic', 'tonikum/hydrolát', 'tonikum/hydrolát', /\btonik|\bhydrolat|\bkvetov\w* vod|\bpletov\w* vod/],
    ['butter', 'maslo', 'máslo', /\bmasl(o|a)\b|\bbutter/],
    ['set', 'sada', 'sada', /\bsad(a|u|y|ou|ach)\b|\bdarcek|\bdarek|\bdarkov|\bbalic|\bbalick|\bgift/],
    ['hand', 'krém na ruky', 'krém na ruce', /\bna ruce|\bna ruky|\bhand cream/],
  ].map(([key, sk, cs, re]) => ({key, sk, cs, re}));

  const BUDGET = /\b(?:do|pod|max(?:imalne|imálně)?|nanajvys|nejvys)\s*(\d+(?:[.,]\d+)?)\s*(kc|czk|eur|€|e)?\b/;
  const BUDGET2 = /\b(?:rozpoc\w*|limit\w*)(?:\s+(?:mam|je|mame|cca|okolo|do|max\w*))?\s*(\d+(?:[.,]\d+)?)\s*(kc|czk|eur|€|e)?\b/;

  /* Zápor: „bez levandule“, „nechcem levanduľu“, „nemám rada kokos“, „alergia na …“, „okrem …“. Úsek za záporom
     (najviac 5 slov, po čiarku/„ale“/„s“/„do“…) sa NEČÍTA ako požiadavka – zložky v ňom sú vylúčené. „bez vône“ je požiadavka. */
  const NEG = /\b(?:bez|nechc\w*|nechtel\w*|nechcel\w*|nemam\s+rad[a]?|nemame\s+radi|nesnas\w*|vadi\s+mi|neznes\w*|alergi\w*\s+na|alergick\w*\s+na|okrem|krome|neobsahuj\w*|ziadn\w*|zadn\w*|nie\s+s[eo]?|ne\s+s[e]?)\s+/g;
  const STOP = /[,.;!?]|\b(?:ale|no|lebo|pretoze|protoze|s|se|so|do|pod|na|pre|pro|max\w*|chcem|chci|hladam|hledam|mam|mate|mas|a\s+(?:s|se|so|do|na|pre|pro))\b/;
  function split(q) {
    const spans = [];
    let rest = q, m;
    NEG.lastIndex = 0;
    const found = [];
    while ((m = NEG.exec(q))) found.push(m);
    for (const f of found.reverse()) {
      const after = q.slice(f.index + f[0].length);
      if (/^(vune|vone|vonu|parfem\w*|parfum\w*|obalu)\b/.test(after)) continue; // „bez vône“ = požiadavka, „bez obalu“ = balenie
      const stop = after.search(STOP);
      const span = (stop < 0 ? after : after.slice(0, stop)).split(/\s+/).filter(Boolean).slice(0, 5).join(' ');
      if (!span) continue;
      spans.push(span);
      rest = rest.slice(0, f.index) + ' ' + rest.slice(f.index + f[0].length + span.length);
    }
    return {rest, spans};
  }

  function parse(text) {
    const q = norm(text);
    const {rest, spans} = split(q);
    // „máte“/„máš“ nie je mäta, „sada“ v „nasadiť“ nie je sada – regexy majú hranice slov.
    const excluded = TERMS.filter((t) => t.key !== 'unscented' && spans.some((x) => t.re.test(x)));
    const terms = TERMS.filter((t) => t.re.test(rest) && !excluded.includes(t));
    const types = TYPES.filter((t) => t.re.test(rest));
    const b = rest.match(BUDGET) || rest.match(BUDGET2) || q.match(BUDGET) || q.match(BUDGET2);
    const budget = b ? Number(b[1].replace(',', '.')) : null;
    return {terms, types, budget, excluded};
  }

  /* Požiadavka z celej konverzácie: typ, zložka, vylúčené zložky a rozpočet z predchádzajúcich správ zákazníka platia ďalej,
     kým ich nová správa výslovne nezmení (nový typ/zložka/rozpočet ich nahradí, „s levanduľou“ zruší „bez levandule“).
     Použije sa iba vtedy, keď posledná správa sama niečo upresňuje – inak (napr. otázka na dopravu) históriu nepreberáme. */
  function context(text, history) {
    const users = (history || []).filter((m) => m && m.role === 'user').map((m) => String(m.content || ''));
    if (!users.length || users[users.length - 1] !== text) users.push(text);
    const last = parse(text);
    const asks = last.terms.length || last.types.length || last.excluded.length || last.budget != null;
    const onlyBudget = !last.terms.length && !last.types.length && !last.excluded.length;
    const shipping = /\b(doprav|postov|dorucen|zasiel|zasilk|kurier|baliko)/.test(norm(text)); // „doprava zdarma do 50 €“ nie je rozpočet na produkt
    if (!asks || users.length < 2 || (onlyBudget && shipping)) return {...last, fromHistory: false};
    const st = {terms: [], types: [], excluded: [], budget: null};
    for (const u of users) {
      const p = parse(u);
      if (p.types.length) st.types = p.types;
      if (p.terms.length) { st.terms = p.terms; st.excluded = st.excluded.filter((x) => !p.terms.includes(x)); }
      if (p.excluded.length) { st.excluded = [...new Set([...st.excluded, ...p.excluded])]; st.terms = st.terms.filter((x) => !p.excluded.includes(x)); }
      if (p.budget != null) st.budget = p.budget;
    }
    const changed = JSON.stringify([st.terms, st.types, st.excluded, st.budget].map((x) => Array.isArray(x) ? x.map((y) => y.key) : x))
      !== JSON.stringify([last.terms, last.types, last.excluded, last.budget].map((x) => Array.isArray(x) ? x.map((y) => y.key) : x));
    return {...st, fromHistory: changed};
  }

  const TAGWORDS = {oily: 'mastne oily', dry: 'suche dry', sensitive: 'citlive sensitive', acne: 'akne problematicka', mature: 'zrala zrela mature', normal: 'normalni normalne', combination: 'smisena zmiesana'};
  const hay = (p) => norm([p.name, p.description, p.reason, p.kind, p.variantLabel, p.k2Terms, p.k2Inci, (p.tags || []).map((t) => TAGWORDS[t] || t).join(' ')].join(' | '));
  const typeHay = (p) => norm([p.name, p.kind, p.category === 'sets' ? 'sada' : ''].join(' | '));
  const typeOk = (p, types) => !types.length || types.some((t) => t.re.test(typeHay(p)) || (t.key === 'set' && p.category === 'sets'));
  const termsOk = (p, terms) => terms.every((t) => t.re.test(hay(p)));

  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  function money(p) { return p.price || (Number.isFinite(p.priceAmount) ? p.priceAmount + (p.currency === 'CZK' ? ' Kč' : ' €') : ''); }
  function line(p) { return `${p.name}${p.variantLabel ? ` (${p.variantLabel})` : ''} — ${money(p)}. ${p.url}`; }

  /* Vráti null (bez konkrétnej požiadavky – nechá zdieľaný mozog), alebo {products, draft, note}.
     history = predchádzajúce správy konverzácie ({role, content}); typ, zložka, zápor a rozpočet z nich platia ďalej. */
  function guard(catalogue, text, brand, history) {
    const all = (catalogue?.products || []).filter((p) => p.available !== false);
    const cs = all.some((p) => p.currency === 'CZK');
    const L = (sk, czk) => (cs ? czk : sk);
    const ctx = context(text, history);
    const {terms, types: rawTypes, budget, excluded} = ctx;
    // „soľ“ ako zložka aj typ: „koupelová sůl“ rieši typ bath, zložka salt ostáva (koupelové soli ju majú v názve).
    const types = rawTypes.filter((t) => all.some((p) => t.re.test(typeHay(p)) || (t.key === 'set' && p.category === 'sets')));
    const unknownTypes = rawTypes.filter((t) => !types.includes(t));
    if (!terms.length && !rawTypes.length && !excluded.length) return null; // samotný rozpočet (napr. „doprava do 1399 Kč“) rieši zdieľaný mozog
    const label = (arr) => arr.map((t) => L(t.sk, t.cs)).join(' + ');
    // úroveň dôkazu: 1 = názov, 2 = popis/druh/štítky, 3 = overené zaradenie (k2Terms) alebo zloženie; berieme len najsilnejšiu dostupnú úroveň
    const level = (p) => Math.max(0, ...terms.map((t) => t.re.test(norm(p.name)) ? 1 : t.re.test(norm([p.description, p.reason, p.kind, (p.tags || []).map((x) => TAGWORDS[x] || x).join(' ')].join(' '))) ? 2 : t.re.test(hay(p)) ? 3 : 9));
    /* Vylúčená zložka: produkt, ktorý ju má v názve, popise, zaradení, obsahu sady alebo v zložení, nikdy neodporučíme.
       Neprítomnosť tvrdíme iba pri produkte s uvedeným zložením (k2Inci); bez neho je produkt „neoverený“. */
    const byId = new Map(all.map((p) => [p.id, p]));
    /* sada obsahuje vylúčenú zložku, ak ju má ktorýkoľvek jej produkt (zloženie sady = zloženie jej položiek) */
    const containsEx = (p) => excluded.some((t) => t.re.test(hay(p))) || (p.set?.contains || []).some((id) => byId.has(id) && excluded.some((t) => t.re.test(hay(byId.get(id)))));
    const verifiedFree = (p) => !containsEx(p) && !!p.k2Inci;
    const matched = all.filter((p) => termsOk(p, terms) && !containsEx(p));
    const best = (list) => { const m = Math.min(9, ...list.map(level)); return list.filter((p) => level(p) === m); };
    const withTerms = matched;
    const withType = withTerms.filter((p) => typeOk(p, types));
    /* produkt pomenovaný pre opačnú potrebu (napr. „maska na suché vlasy“ pri mastných) sa nevyberá, ak názov nespomína aj požadovanú */
    const OPP = {oily: /\b(na|pre|pro) such/, dry: /\b(na|pre|pro) mastn/};
    const clash = (p) => terms.some((t) => OPP[t.key] && OPP[t.key].test(norm(p.name)) && !t.re.test(norm(p.name)));
    const inBudget = (p) => budget == null || (Number.isFinite(p.priceAmount) && p.priceAmount <= budget);
    const candidates = withType.filter((p) => !clash(p) && inBudget(p));
    const fit = best(excluded.length ? candidates.filter(verifiedFree) : candidates);
    const unverified = excluded.length ? best(candidates.filter((p) => !p.k2Inci)) : [];
    // poradie: zložka v názve > v titulku overeného zaradenia > na začiatku popisu > inde; sady až za jednotlivými produktmi
    const at = (re, text) => { const m = norm(text).match(re); return m ? m.index : -1; };
    const near = (re, text, w) => { const i = at(re, text); return i < 0 ? 0 : Math.max(0.2, 1 - i / w); };
    const score = (p) => terms.reduce((s, t) => s + (t.re.test(norm(p.name)) ? 6 : 0) + 4 * near(t.re, String(p.k2Terms || '').split('|').slice(0, 2).join(' '), 60)
      + 3 * near(t.re, p.description, 140) + (t.re.test(hay(p)) ? 1 : 0), 0) + (p.category === 'sets' && !types.some((t) => t.key === 'set') ? -3 : 0);
    const order = (list) => list.slice().sort((a, b) => score(b) - score(a) || (a.priceAmount ?? 1e9) - (b.priceAmount ?? 1e9));
    const ranked = order(fit);
    const exLabel = excluded.length ? L('bez zložky: ', 'bez složky: ') + excluded.map((t) => L(t.sk, t.cs)).join(', ') : '';
    const asked = [label(terms), label(rawTypes), exLabel, budget != null ? 'do ' + budget + (cs ? ' Kč' : ' €') : ''].filter(Boolean).join(', ');
    const summary = {terms: terms.map((t) => L(t.sk, t.cs)), types: rawTypes.map((t) => L(t.sk, t.cs)), excluded: excluded.map((t) => L(t.sk, t.cs)), budget, fromHistory: ctx.fromHistory, asked};
    const ex = excluded.map((t) => L(t.sk, t.cs)).join(', ');

    if (unknownTypes.length && !types.length && !terms.length) {
      return {products: [], summary, draft: L(`${label(unknownTypes)} v ponuke ${brand} nemám, preto vám nebudem ponúkať iný produkt namiesto toho. Môžem poradiť s niečím, čo v ponuke je – čo hľadáte?`,
        `${label(unknownTypes)} v nabídce ${brand} nemám, takže vám nebudu nabízet jiný produkt místo toho. Můžu poradit s něčím, co v nabídce je – co hledáte?`), strict: true};
    }
    if (ranked.length) {
      const top = ranked.slice(0, 3);
      const more = ranked.length - top.length;
      const exNote = excluded.length ? L(` Zložku „${ex}“ uvedené zloženie týchto produktov neobsahuje.`, ` Složku „${ex}“ uvedené složení těchto produktů neobsahuje.`) : '';
      return {products: ranked, summary, deterministic: terms.length > 0 || excluded.length > 0, draft: L(`Z ponuky ${brand} vašej požiadavke (${asked}) zodpovedá: `, `Z nabídky ${brand} vaší poptávce (${asked}) odpovídá: `)
        + top.map(line).join(' ') + (more > 0 ? L(` Ďalšie vhodné: ${more}.`, ` Další vhodné: ${more}.`) : '') + exNote, strict: true};
    }
    if (excluded.length) {
      /* Nič s overeným zložením – nesľubujeme neprítomnosť naslepo. */
      const containing = order(withType.length || types.length ? all.filter((p) => typeOk(p, types) && termsOk(p, terms) && containsEx(p) && p.k2Inci) : []);
      let draft = L(`Produkt, ktorý by spĺňal „${asked}“ a mal by to doložené v zložení, v ponuke ${brand} nenachádzam, preto vám nebudem ponúkať iný namiesto neho.`,
        `Produkt, který by splňoval „${asked}“ a měl by to doložené ve složení, v nabídce ${brand} nenacházím, takže vám nebudu nabízet jiný místo něj.`);
      if (containing.length && !unverified.length) draft += L(` Zložku „${ex}“ uvádza zloženie všetkých takých produktov.`, ` Složku „${ex}“ uvádí složení všech takových produktů.`);
      if (unverified.length) draft += L(` Pri ${unverified.length === 1 ? 'jednom produkte' : 'niektorých produktoch'} úplné zloženie v podkladoch nemám – ${ex} v názve ani popise neuvádzajú, ale neprítomnosť vám zaručiť neviem: `,
        ` U ${unverified.length === 1 ? 'jednoho produktu' : 'některých produktů'} úplné složení v podkladech nemám – ${ex} v názvu ani popisu neuvádějí, ale nepřítomnost vám zaručit nemůžu: `)
        + order(unverified).slice(0, 3).map(line).join(' ') + L(' Zloženie prosím overte na stránke produktu.', ' Složení prosím ověřte na stránce produktu.');
      draft += L(' Ide o alergiu, alebo len o preferenciu? Podľa toho vám poradím ďalej.', ' Jde o alergii, nebo jen o preferenci? Podle toho vám poradím dál.');
      return {products: [], summary, unverified: unverified.map((p) => p.id), draft, strict: true};
    }
    // Nič presne nevyhovuje – povieme to a nič iné nepodstrčíme. Môžeme uviesť, kde zložka JE (rovnaká požiadavka, iný typ).
    let draft = L(`Produkt, ktorý by spĺňal „${asked}“, podľa popisov v ponuke ${brand} nenachádzam, preto vám nebudem ponúkať iný namiesto neho.`,
      `Produkt, který by splňoval „${asked}“, podle popisů v nabídce ${brand} nenacházím, takže vám nebudu nabízet jiný místo něj.`);
    if (budget != null && withType.length) {
      const cheapest = withType.slice().sort((a, b) => a.priceAmount - b.priceAmount)[0];
      draft += L(` Najlacnejšia vyhovujúca možnosť stojí ${money(cheapest)}: `, ` Nejlevnější odpovídající možnost stojí ${money(cheapest)}: `) + line(cheapest);
    } else if (terms.length && withTerms.length && types.length) {
      draft += L(` ${cap(label(terms))} je v: `, ` ${cap(label(terms))} najdete v: `) + withTerms.slice(0, 3).map(line).join(' ');
    }
    draft += L(' Mám pomôcť podľa niečoho iného – napríklad typu pleti alebo vlasov?', ' Mám pomoct podle něčeho jiného – třeba typu pleti nebo vlasů?');
    return {products: [], summary, draft, strict: true};
  }

  scope.CXK2ChatGuard = {guard, parse, context, norm, hay, TERMS, TYPES};
})(globalThis);
