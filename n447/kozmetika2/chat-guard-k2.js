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
    ['honey', 'med', 'med', /\bmed(u|em|ov[aey]|ovy|ova|ove)?\b|\bhoney|\bmel\b/],
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

  function parse(text) {
    const q = norm(text);
    // „máte“/„máš“ nie je mäta, „sada“ v „nasadiť“ nie je sada – regexy majú hranice slov.
    const terms = TERMS.filter((t) => t.re.test(q));
    const types = TYPES.filter((t) => t.re.test(q));
    const b = q.match(BUDGET);
    const budget = b ? Number(b[1].replace(',', '.')) : null;
    return {terms, types, budget};
  }

  const TAGWORDS = {oily: 'mastne oily', dry: 'suche dry', sensitive: 'citlive sensitive', acne: 'akne problematicka', mature: 'zrala zrela mature', normal: 'normalni normalne', combination: 'smisena zmiesana'};
  const hay = (p) => norm([p.name, p.description, p.reason, p.kind, p.variantLabel, p.k2Terms, p.k2Inci, (p.tags || []).map((t) => TAGWORDS[t] || t).join(' ')].join(' | '));
  const typeHay = (p) => norm([p.name, p.kind, p.category === 'sets' ? 'sada' : ''].join(' | '));
  const typeOk = (p, types) => !types.length || types.some((t) => t.re.test(typeHay(p)) || (t.key === 'set' && p.category === 'sets'));
  const termsOk = (p, terms) => terms.every((t) => t.re.test(hay(p)));

  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  function money(p) { return p.price || (Number.isFinite(p.priceAmount) ? p.priceAmount + (p.currency === 'CZK' ? ' Kč' : ' €') : ''); }
  function line(p) { return `${p.name}${p.variantLabel ? ` (${p.variantLabel})` : ''} — ${money(p)}. ${p.url}`; }

  /* Vráti null (bez konkrétnej požiadavky – nechá zdieľaný mozog), alebo {products, draft, note}. */
  function guard(catalogue, text, brand) {
    const all = (catalogue?.products || []).filter((p) => p.available !== false);
    const cs = all.some((p) => p.currency === 'CZK');
    const L = (sk, czk) => (cs ? czk : sk);
    const {terms, types: rawTypes, budget} = parse(text);
    // „soľ“ ako zložka aj typ: „koupelová sůl“ rieši typ bath, zložka salt ostáva (koupelové soli ju majú v názve).
    const types = rawTypes.filter((t) => all.some((p) => t.re.test(typeHay(p)) || (t.key === 'set' && p.category === 'sets')));
    const unknownTypes = rawTypes.filter((t) => !types.includes(t));
    if (!terms.length && !rawTypes.length) return null; // samotný rozpočet (napr. „doprava do 1399 Kč“) rieši zdieľaný mozog
    const label = (arr) => arr.map((t) => L(t.sk, t.cs)).join(' + ');
    // úroveň dôkazu: 1 = názov, 2 = popis/druh/štítky, 3 = overené zaradenie (k2Terms); berieme len najsilnejšiu dostupnú úroveň
    const level = (p) => Math.max(0, ...terms.map((t) => t.re.test(norm(p.name)) ? 1 : t.re.test(norm([p.description, p.reason, p.kind, (p.tags || []).map((x) => TAGWORDS[x] || x).join(' ')].join(' '))) ? 2 : t.re.test(hay(p)) ? 3 : 9));
    const matched = all.filter((p) => termsOk(p, terms));
    const best = (list) => { const m = Math.min(9, ...list.map(level)); return list.filter((p) => level(p) === m); };
    const withTerms = matched;
    const withType = withTerms.filter((p) => typeOk(p, types));
    const fit = best(withType.filter((p) => budget == null || (Number.isFinite(p.priceAmount) && p.priceAmount <= budget)));
    // poradie: zložka v názve > v titulku overeného zaradenia > na začiatku popisu > inde; sady až za jednotlivými produktmi
    const at = (re, text) => { const m = norm(text).match(re); return m ? m.index : -1; };
    const near = (re, text, w) => { const i = at(re, text); return i < 0 ? 0 : Math.max(0.2, 1 - i / w); };
    const score = (p) => terms.reduce((s, t) => s + (t.re.test(norm(p.name)) ? 6 : 0) + 4 * near(t.re, String(p.k2Terms || '').split('|').slice(0, 2).join(' '), 60)
      + 3 * near(t.re, p.description, 140) + (t.re.test(hay(p)) ? 1 : 0), 0) + (p.category === 'sets' && !types.some((t) => t.key === 'set') ? -3 : 0);
    const ranked = fit.slice().sort((a, b) => score(b) - score(a) || (a.priceAmount ?? 1e9) - (b.priceAmount ?? 1e9));
    const asked = [label(terms), label(rawTypes), budget != null ? L('do ', 'do ') + budget + (cs ? ' Kč' : ' €') : ''].filter(Boolean).join(', ');

    if (unknownTypes.length && !types.length && !terms.length) {
      return {products: [], draft: L(`${label(unknownTypes)} v ponuke ${brand} nemám, preto vám nebudem ponúkať iný produkt namiesto toho. Môžem poradiť s niečím, čo v ponuke je – čo hľadáte?`,
        `${label(unknownTypes)} v nabídce ${brand} nemám, takže vám nebudu nabízet jiný produkt místo toho. Můžu poradit s něčím, co v nabídce je – co hledáte?`), strict: true};
    }
    if (ranked.length) {
      const top = ranked.slice(0, 3);
      const more = ranked.length - top.length;
      return {products: ranked, deterministic: terms.length > 0, draft: L(`Z ponuky ${brand} vašej požiadavke (${asked}) zodpovedá: `, `Z nabídky ${brand} vaší poptávce (${asked}) odpovídá: `)
        + top.map(line).join(' ') + (more > 0 ? L(` Ďalšie vhodné: ${more}.`, ` Další vhodné: ${more}.`) : ''), strict: true};
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
    return {products: [], draft, strict: true};
  }

  scope.CXK2ChatGuard = {guard, parse, norm, TERMS, TYPES};
})(globalThis);
