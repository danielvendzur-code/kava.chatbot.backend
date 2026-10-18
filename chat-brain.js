/* Shared chat understanding for every demo family (coffee, cosmetics, hair, wine, tea, plants).
   - The latest explicit condition wins (a raised budget replaces the old one, other conditions stay).
   - A named product is understood as the subject of a question, one side of a comparison or an
     exclusion; an excluded product or word never comes back in later answers.
   - "Another option" never repeats products the customer has already been shown.
   - Product facts come only from the shop catalogue the family adapter passes in; a missing fact is
     named as missing, never presented as a match.
   The file is plain script so the same copy runs in the API and in the browser. */
(function (scope) {
  'use strict';
  const norm = v => String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const words = s => norm(s).split(/[^a-z0-9]+/).filter(Boolean);
  const stem = w => w.length >= 6 ? w.slice(0, 5) : w;
  const uniq = list => [...new Set(list)];

  /* ---------- wording ---------- */
  const T = {
    sk: {
      nothing: 'V aktuálnej ponuke nemám produkt, ktorý by spĺňal všetky tieto podmienky.',
      noOther: 'Ďalšiu vhodnú možnosť s týmito podmienkami v ponuke nemám; to, čo som ukázal, je všetko.',
      change: 'Môžete zmeniť jednu podmienku',
      nearest: 'Najbližšia možnosť',
      notMet: 'nespĺňa',
      unknownProduct: 'Takýto produkt v overenej ponuke nemám. Upresnite prosím jeho názov.',
      notExact: (asked, found) => `${asked} v ponuke nevidím; najbližší názov je ${found}.`,
      compareMissing: (missing) => `${missing} v ponuke nevidím, preto ich neviem porovnať. V ponuke je:`,
      soldOut: 'Momentálne nie je skladom.',
      gone: name => `${name} teraz v ponuke nie je.`,
      sameOther: 'Tá istá v inom balení, ktoré je skladom:',
      byName: 'V ponuke s týmto názvom:',
      similarNow: 'Podobné, ktoré sú teraz skladom:',
      notSold: name => `${name} tento e-shop nepredáva.`,
      over: (name, price, limit) => `${name} stojí ${price}, čo je nad váš limit ${limit}.`,
      fits: (name, price, limit) => `${name} stojí ${price}, teda zmestí sa do limitu ${limit}.`,
      cheapest: (name, price) => `Najlacnejšia dostupná možnosť je ${name} za ${String(price).replace(/^od /, '')}${/^od /.test(price) ? ' (najmenšie balenie)' : ''}.`,
      underLimit: limit => `Do ${limit} máte z ponuky:`,
      noneUnder: (limit, cond) => cond ? `Do ${limit} v ponuke nie je nič, čo spĺňa: ${cond}.` : `Do ${limit} v ponuke nič vhodné nie je.`,
      chosen: 'Vyberám',
      also: 'Ďalšia možnosť',
      why: 'Prečo',
      diff: 'Rozdiel',
      choose: (a, ha, b, hb) => `${a} zvoľte, ${ha}; ${b}, ${hb}.`,
      compareSame: 'V údajoch, ktoré e-shop pri nich uvádza, sa zhodujú; líšia sa druhom alebo zložením podľa názvu, cenou a balením.',
      missing: what => `Údaj ${what} e-shop pri produkte neuvádza.`,
      forWhomUnknown: 'Pre koho presne je určený, e-shop pri produkte bližšie neuvádza.',
      usageSource: 'Presný postup a množstvo uvádza výrobca pri produkte:',
      accHead: main => `K produktu ${main} sa z ponuky hodí:`,
      accNone: main => `Vhodný doplnok k produktu ${main} v tejto ponuke nevidím.`,
      accNoneGeneric: 'Takýto produkt v tejto ponuke nevidím.',
      accOver: (name, price, left) => `${name} (${price}) by už prekročil zvyšok rozpočtu ${left}.`,
      total: sum => `Spolu ${sum}.`,
      totalNo: (n, limit, sum) => `${n} ks do ${limit} spolu nevyjde: najlacnejšia možnosť stojí spolu ${sum}.`,
      pick: n => `Na ${n} ks vyberám:`,
      shippingHead: 'Doprava podľa e-shopu',
      shippingUnknown: 'Cenu dopravy pre vašu krajinu v ukážke overenú nemám. Aktuálne možnosti a ceny sú v e-shope:',
      excludedNote: 'Vynechávam:',
      conditions: 'podľa vašich podmienok',
      priceFrom: 'od',
      perUnitNote: 'Cena „od“ je za najmenšie balenie; ostatné veľkosti sú pri produkte.',
      variantPrice: (v, p) => `${v} za ${p}`
    },
    cs: {
      nothing: 'V aktuální nabídce nemám produkt, který by splňoval všechny tyto podmínky.',
      noOther: 'Další vhodnou možnost s těmito podmínkami v nabídce nemám; co jsem ukázal, je vše.',
      change: 'Můžete změnit jednu podmínku',
      nearest: 'Nejbližší možnost',
      notMet: 'nesplňuje',
      unknownProduct: 'Takový produkt v ověřené nabídce nemám. Upřesněte prosím jeho název.',
      notExact: (asked, found) => `${asked} v nabídce nevidím; nejbližší název je ${found}.`,
      compareMissing: (missing) => `${missing} v nabídce nevidím, proto je nemohu porovnat. V nabídce je:`,
      soldOut: 'Momentálně není skladem.',
      gone: name => `${name} teď v nabídce není.`,
      sameOther: 'Stejná v jiném balení, které je skladem:',
      byName: 'V nabídce s tímto názvem:',
      similarNow: 'Podobné, které jsou teď skladem:',
      notSold: name => `${name} tento e-shop neprodává.`,
      over: (name, price, limit) => `${name} stojí ${price}, což je nad váš limit ${limit}.`,
      fits: (name, price, limit) => `${name} stojí ${price}, takže se vejde do limitu ${limit}.`,
      cheapest: (name, price) => `Nejlevnější dostupná možnost je ${name} za ${String(price).replace(/^od /, '')}${/^od /.test(price) ? ' (nejmenší balení)' : ''}.`,
      underLimit: limit => `Do ${limit} máte z nabídky:`,
      noneUnder: (limit, cond) => cond ? `Do ${limit} v nabídce není nic, co splňuje: ${cond}.` : `Do ${limit} v nabídce nic vhodného není.`,
      chosen: 'Vybírám',
      also: 'Další možnost',
      why: 'Proč',
      diff: 'Rozdíl',
      choose: (a, ha, b, hb) => `${a} zvolte, ${ha}; ${b}, ${hb}.`,
      compareSame: 'V údajích, které e-shop u nich uvádí, se shodují; liší se druhem nebo složením podle názvu, cenou a balením.',
      missing: what => `Údaj ${what} e-shop u produktu neuvádí.`,
      forWhomUnknown: 'Pro koho přesně je určen, e-shop u produktu blíže neuvádí.',
      usageSource: 'Přesný postup a množství uvádí výrobce u produktu:',
      accHead: main => `K produktu ${main} se z nabídky hodí:`,
      accNone: main => `Vhodný doplněk k produktu ${main} v této nabídce nevidím.`,
      accNoneGeneric: 'Takový produkt v této nabídce nevidím.',
      accOver: (name, price, left) => `${name} (${price}) by už překročil zbytek rozpočtu ${left}.`,
      total: sum => `Celkem ${sum}.`,
      totalNo: (n, limit, sum) => `${n} ks do ${limit} celkem nevyjde: nejlevnější možnost stojí celkem ${sum}.`,
      pick: n => `Na ${n} ks vybírám:`,
      shippingHead: 'Doprava podle e-shopu',
      shippingUnknown: 'Cenu dopravy pro vaši zemi v ukázce ověřenou nemám. Aktuální možnosti a ceny jsou v e-shopu:',
      excludedNote: 'Vynechávám:',
      conditions: 'podle vašich podmínek',
      priceFrom: 'od',
      perUnitNote: 'Cena „od“ je za nejmenší balení; ostatní velikosti jsou u produktu.',
      variantPrice: (v, p) => `${v} za ${p}`
    }
  };

  const money = (amount, currency) => {
    if (!Number.isFinite(amount)) return '';
    const fixed = Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace('.', ',');
    return fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (currency === 'CZK' ? ' Kč' : ' €');
  };

  /* ---------- budget and quantity ---------- */
  const NUMBER_WORDS = {jeden: 1, jedna: 1, jedno: 1, jednu: 1, dve: 2, dva: 2, tri: 3, styri: 4, ctyri: 4, pat: 5, pet: 5, sest: 6, sedem: 7, sedm: 7, osem: 8, osm: 8, devat: 9, devet: 9, desat: 10, deset: 10};
  function parseBudget(raw) {
    const q = norm(raw);
    if (/bez (?:cenoveho )?limitu|bez rozpoctu|rozpocet (?:nerie|neres|nehra)|na cene nezalez|cena nehra/.test(q)) return {clear: true};
    const rx = /(?:\bdo\b|\bmax(?:imalne|imalně)?\b|\bnajviac\b|\bnanajvys\b|\bnejvyse\b|\bpod\b|\blimit\w*(?:\s+(?:je|na|do))?|\brozpo[cč]et\w*(?:\s+(?:je|mam|mám|na|do))?|\bzvys\w*\s+(?:rozpocet\s+|limit\s+)?na|\bzvys\w*\s+na|\bnajviac\s+za|\bza\s+max\w*|\blacnejs\w*\s+(?:ako|nez)|\blevnejs\w*\s+(?:nez|jak)|\bmenej\s+(?:ako|nez)|\bmene\s+nez|\bnepresahuj\w*)\s*(\d+(?:[.,]\d+)?)\s*(kc\b|czk\b|eur\w*|€|e\b|korun\w*)?/g;
    let m, best = null;
    while ((m = rx.exec(q))) {
      const after = q.slice(m.index + m[0].length, m.index + m[0].length + 12);
      if (!m[2] && /^\s*(?:dni|dn[ií]|hod|tyzd|týžd|min|cm|mm|ml|l\b|g\b|kg|ks|°|stup|rok|mesia|osob|percent|%)/.test(after)) continue;
      if (!m[2] && !/rozpo|limit|cen|stoj|eur|kc|€|zaplat|nakup|nákup|produkt|kav|vin|caj|krem|rastlin|kvet|darc|sad/.test(q)) continue;
      best = m;
    }
    const totalWord = /spolu|celkom|dokopy|celkov|za vsetk|za vsetky|za cel[yu]|dohromady|celkem|za oba|za obe|za vsetko/;
    if (!best) {
      const m2 = q.match(/(\d+(?:[.,]\d+)?)\s*(kc\b|czk\b|eur\w*|€)\s*(?:spolu|celkom|dokopy|celkovo|celkem|dohromady)/);
      if (!m2) return null;
      return {amount: Number(m2[1].replace(',', '.')), currency: /kc|czk/.test(m2[2]) ? 'CZK' : 'EUR', total: true};
    }
    const amount = Number(best[1].replace(',', '.'));
    const currency = /kc|czk|korun/.test(best[2] || '') ? 'CZK' : /eur|€|^e$/.test(best[2] || '') ? 'EUR' : null;
    return {amount, currency, total: totalWord.test(q)};
  }
  function parseQty(q) {
    const m = q.match(/\b(\d{1,2}|jedn[auo]|dve|dva|tri|styri|ctyri|pat|pet|sest|sedem|sedm|osem|osm|devat|devet|desat|deset)\s*(?:ks\b|kus\w*|flias|flas\w*|flaš\w*|lahv\w*|lahev|lahve|lahvi|baleni\w*|vin\b|vina\b|vín\b|kav\b|kavy\b|caj\w*|produkt\w*|kusov)/);
    if (!m) return null;
    const n = NUMBER_WORDS[m[1]] || Number(m[1]);
    return n > 1 && n <= 24 ? n : null;
  }

  /* ---------- polarity: what the customer wants vs. refuses ---------- */
  const NEG_VERB = /(?:\bneodporuc\w*|\bnedoporuc\w*|\bnechc\w*|\bnenavrh\w*|\bnesmi\w*|\bnemoz\w*|\bzi[ad]dn\w*|\bvynech\w*|\bokrem\b|\bnie\b|\bne\b|\bnepotrebuj\w*|\bnemam rad\w*|\bnemusi\w*|\bvyhn\w*)/;
  const POS_START = /\b(?:ale|len|iba|jen|pouze|vyhradne|vylucne|hladam|hledam|chcem|chci|potrebujem|potrebuji|odporuc\w*|doporuc\w*|vyber\w*|radsej|radeji|skor|spis|daj|dajte)\b/;
  function polarity(raw) {
    const q = norm(raw);
    const pos = [], neg = [];
    for (const sentence of q.split(/[.!?;\n]+/)) {
      const s = sentence.trim();
      if (!s) continue;
      const m = s.match(NEG_VERB);
      if (!m) { pos.push(s); continue; }
      const before = s.slice(0, m.index).trim(), after = s.slice(m.index + m[0].length).trim();
      if (!after || /^(?:mi|nam|ho|ju|to|ich|uz|tie|tuto|tento)?\s*$/.test(after) || /^(?:mi |nam )?(?:prekroc|odporuc|doporuc)/.test(after) && !before) {
        // "… X nechcem." / "… X mi neodporúčajte."
        if (/rozpoc|limit|prekroc/.test(s)) { pos.push(s); continue; }
        neg.push(before.replace(/^(?:a|ale|uz|tiez)\s+/, ''));
        continue;
      }
      // Negated clause ends where a positive request starts (", len pleť", " ale …", ". Hľadám …").
      const cut = after.search(new RegExp(',\\s*' + POS_START.source + '|\\s' + POS_START.source));
      const negPart = cut >= 0 ? after.slice(0, cut) : after;
      const rest = cut >= 0 ? after.slice(cut) : '';
      if (/^(?:prekroc|prekroci)/.test(negPart) || /^(?:mi\s+)?(?:prekroc|vadi)/.test(negPart)) { pos.push(s); continue; }
      neg.push(negPart.replace(/^(?:mi|nam|mat|mať|v nazve|odporucit|odporucat|doporucit|ziadny|ziadnu|ziadne)\s+/, ''));
      pos.push((before + ' ' + rest).trim());
    }
    return {pos: pos.join('. '), neg: neg.filter(Boolean).join('. ')};
  }

  /* ---------- product index and named products ---------- */
  const GENERIC = /^(?:produkt\w*|vyrobok|vyrobky|kava|kavy|kavu|coffee|vino|vina|wine|caj|caje|caju|cajov|tea|krem|kremy|serum|sera|olej|oleje|oil|maska|masky|sampon|mydlo|balzam|tonikum|voda|gel|pena|set|sada|sady|bio|natural|naturalny|prirodny|prirodni|rastlina|rostlina|kvetinac|crepnik|zrnkova|zrnkovu|mleta|mletu|espresso|filter|filtr|blend|zmes|smes|biele|biela|cervene|cervena|ruzove|suche|polosuche|sladke|polosladke|darcek|darkova|darcekova|balenie|baleni|male|velke|mini|maxi|extra|premium|classic|klasik|original|special|edition|limited|new|novinka|akce|akcia|vzorka|vzorek|ml|kg|pre|pro|pleť|plet|telo|telove|vlasy|vlasov|pletovy|pletova|hydratacny|hydratacni|vyzivny|vyzivujuci|jemny|jemna|cisty|cista|denny|nocny|suchu|suchou|mastnu|mastnou|citlivu|citlivou|svetle|tmave|light|dark|medium|roast|arabica|arabika|robusta|single|origin|honey|washed|natural|lot|farm|finca|estate)$/;
  // Pack sizes of one product share a core name; a multipack ("2x1kg") is a different product.
  const coreOf = name => norm(name).replace(/\(\s*[^)]*\)/g, ' ').replace(/\b(\d+)\s*x\s*(\d+(?:[.,]\d+)?)\s*(ml|g|kg|l)\b/g, '$1x$2$3').replace(/(^|\s)\d+(?:[.,]\d+)?\s*(?:ml|g|kg|l|ks|cm|mm|kc|eur)\b/g, ' ').replace(/[–—|,]/g, ' ').replace(/\s+/g, ' ').trim();
  /* Words customers use to describe a need; they identify a product only together with a real name. */
  const COMMON = new Set(['mate', 'mam', 'mas', 'mame', 'chcem', 'chci', 'hlada', 'hleda', 'citli', 'pokoz', 'plet', 'pleti', 'suchu', 'sucha', 'suche', 'suchy', 'mastn', 'zrelu', 'zrela', 'vrask', 'hydra', 'vyziv', 'regen', 'upoko', 'zklid', 'jemna', 'jemny', 'jemne', 'parfu', 'alerg', 'vonav', 'vone', 'vune', 'olejo', 'olej', 'vlasy', 'vlasu', 'vlaso', 'tmave', 'svetl', 'darce', 'darek', 'darko', 'kavu', 'kavy', 'vino', 'vina', 'sladk', 'polos', 'cerve', 'biele', 'biely', 'bila', 'ruzov', 'filte', 'filtr', 'espre', 'autom', 'mliek', 'mleko', 'rastl', 'rostl', 'kveti', 'macka', 'macku', 'svetl', 'tien', 'polot', 'slnko', 'izbov', 'pokoj', 'telo', 'telov', 'tvar', 'krem', 'serum', 'maska', 'sampo', 'mydlo', 'balza', 'tonik', 'cista', 'cisti', 'odlic', 'akne', 'vlhke', 'pevna', 'velke', 'male', 'mini', 'veľk', 'cajov', 'caj', 'bylin', 'ovocn', 'zelen', 'ciern', 'cerny', 'kofei', 'bezko', 'zrnko', 'zrna', 'zrno', 'zrnka', 'kavov', 'kavou', 'cele', 'celu', 'mleta', 'mletu', 'mlete', 'pomle', 'balen', 'kilo', 'gram', 'cena', 'lacne', 'lacny', 'drahy', 'kvali', 'prirod', 'natur', 'organ', 'zdrav', 'vegan', 'sensi', 'probl', 'citro', 'levan', 'ruza', 'ruze', 'mandl', 'kokos', 'argan', 'konop', 'aloe']);
  function buildIndex(products) {
    const items = products.map(p => {
      const name = norm(p.name);
      const core = coreOf(p.name);
      const toks = uniq(words(core).filter(w => (w.length >= 3 || /^\d{2,}$/.test(w)) && !/^(?:pre|pro|the|and|with|bez|na|s|so|do|od|ze|zo|ve|vo)$/.test(w)));
      return {p, name, core, toks, stems: toks.map(stem)};
    });
    const df = new Map();
    const coreDf = new Map();
    for (const it of items) for (const s of uniq(it.stems)) { df.set(s, (df.get(s) || 0) + 1); }
    for (const it of uniq(items.map(i => i.core))) coreDf.set(it, (coreDf.get(it) || 0) + 1);
    const cores = new Map();
    for (const it of items) { if (!cores.has(it.core)) cores.set(it.core, []); cores.get(it.core).push(it); }
    const stemCores = new Map();
    for (const [core, list] of cores) for (const s of uniq(list[0].stems)) { if (!stemCores.has(s)) stemCores.set(s, new Set()); stemCores.get(s).add(core); }
    return {items, df, cores, stemCores, n: items.length};
  }
  function idf(index, s) { const d = index.df.get(s) || 0; return d ? Math.log(1 + index.n / d) : 0; }
  /* Products named in a text, best first; each core name (all pack sizes of one product) once. */
  function mentions(index, raw, opts = {}) {
    const q = ' ' + norm(raw).replace(/[^a-z0-9%/&+.,'’ -]+/g, ' ').replace(/\s+/g, ' ') + ' ';
    const qWords = words(q), qStems = new Set(qWords.map(stem));
    const qCoreFlat = ' ' + words(coreOf(raw)).join(' ') + ' ';
    // Words written with a capital letter are likely names ("Guatemalou"), plain words are not.
    // The first word of a sentence is capitalised anyway ("Máte …"), so it is no sign of a name.
    const capitalStems = new Set(String(opts.raw || raw).replace(/(^|[.!?]\s+)\p{L}+/gu, '$1').split(/[^\p{L}\p{N}]+/u).filter(w => /^\p{Lu}/u.test(w)).map(w => stem(norm(w))));
    const found = new Map();
    for (const [core, list] of index.cores) {
      const head = list[0];
      if (!head.toks.length) continue;
      let score = 0, pos = -1, exact = false, weak = false;
      const coreWords = words(core);
      const allGeneric = coreWords.every(w => GENERIC.test(w) || w.length < 3 || /^\d+$/.test(w));
      const coreFlat = ' ' + coreWords.join(' ') + ' ';
      if (!allGeneric && core.length >= 4 && qCoreFlat.includes(coreFlat)) { score = 10 + core.length / 10; pos = qCoreFlat.indexOf(coreFlat); exact = true; }
      else {
        const significant = head.stems.filter(s => !GENERIC.test(s) && !GENERIC.test(head.toks[head.stems.indexOf(s)]) && (!COMMON.has(s) || capitalStems.has(s)));
        if (!significant.length) continue;
        const total = significant.reduce((a, s) => a + idf(index, s), 0);
        const hit = significant.filter(s => qStems.has(s));
        if (!hit.length) continue;
        const got = hit.reduce((a, s) => a + idf(index, s), 0);
        const coverage = total ? got / total : 0;
        const unique = hit.some(s => (index.stemCores.get(s)?.size || 0) === 1 && s.length >= 4);
        const uniqueCapital = hit.some(s => (index.stemCores.get(s)?.size || 0) === 1 && s.length >= 4 && capitalStems.has(s));
        if (coverage >= 0.6 && (hit.length >= 2 || unique && (significant.length <= 2 || uniqueCapital) || significant.length === 1 && (capitalStems.has(hit[0]) || hit[0].length >= 5 && unique))) score = 5 * coverage + hit.length;
        else if (uniqueCapital && !opts.strict) score = 3 + coverage;
        // "Máte kupelnu kavu?": one distinctive word of a name, written without capitals or diacritics and with any ending.
        else if (opts.loose && !opts.strict && hit.some(s => (index.stemCores.get(s)?.size || 0) === 1 && s.length >= 5 && !COMMON.has(s))) score = 2.5 + coverage;
        // A name word shared by several products ("Etiópiu"): a weak match the reply resolves by pack size or lists.
        else if (opts.loose && !opts.strict && coverage >= 0.6 && hit.some(s => s.length >= 5 && !COMMON.has(s) && (capitalStems.has(s) || (index.stemCores.get(s)?.size || 0) <= 8))) { score = 1 + coverage; weak = true; }
        else continue;
        pos = Math.min(...hit.map(s => { const i = qWords.findIndex(w => stem(w) === s); return i < 0 ? 1e9 : q.indexOf(' ' + qWords[i]); }));
      }
      // Prefer the pack size the customer named, else the first available variant.
      const size = q.match(/(\d+(?:[.,]\d+)?)\s*(ml|g|kg|l)\b/);
      let pick = list.find(it => it.p.available !== false) || list[0];
      if (size) { const s = size[1].replace(',', '.') + ' ' + size[2]; const sized = list.find(it => norm(it.p.pack || it.p.name).replace(',', '.').includes(s) || norm(it.p.pack || it.p.name).replace(',', '.').includes(s.replace(' ', ''))); if (sized) pick = sized; }
      found.set(core, {p: pick.p, all: list.map(i => i.p), score, pos, exact, core, weak});
    }
    let list = [...found.values()].sort((a, b) => b.score - a.score || a.pos - b.pos);
    if (!list.length) return [];
    // A name that is part of a longer named product ("ECM stojan" in "ECM stojan …, nerez") is not a second product.
    const exacts = list.filter(m => m.exact).sort((a, b) => b.core.length - a.core.length);
    const kept = [];
    for (const m of exacts) { const span = [m.pos, m.pos + m.core.length]; if (!kept.some(k => span[0] < k[1] && k[0] < span[1])) kept.push(span); else m.drop = true; }
    list = list.filter(m => !m.drop);
    // Weak partial matches are dropped when a clearly better one exists.
    const top = list[0].score;
    return list.filter(m => m.score >= Math.min(top * 0.55, 6) || m.exact);
  }

  /* ---------- conversation state ---------- */
  const SHIPPING = /doprav|postovn|poštovn|dorucen|doruc|zasiel|zasilk|posielat|posielate|posilat|posilate|odosielat|odesilat|kurier|kuryr|balikov|packeta|zasielkov|gls|dpd|ppl\b|posta\b|osobn\w* odber|zadarmo od|zdarma od|platb|dobier|dobirk/;
  const HEALTH = /\bliec|vyliec|\blecb|\blecit|vylec|chorob|nemoc|ekzem|rosacea|dermatit|\bliek\b|\blek\b|tehot|dojc|kojen|alergick\w* reakc|diagnoz|zdravotn|cukrovk|diabet|hypertenz/;
  const OTHER = /\b(?:in[auyeoi]|inej|inu|jin[auyeoi]|jinou|dals\w*|dalsi\w*|nieco ine|neco jine|niekto ine|ukaz(?:te)? (?:mi )?(?:viac|vic|dalsi\w*|ine|inu|jine)|este (?:nieco|jednu|jeden|dalsi\w*|iny|inu|ine)|alternativ\w*|iba to\?|nic ine)\b/;
  const COMPARE = /porovn|srovn|rozdiel|rozdil|\blisi\b|\bliši\b|odlis|\bvs\.?\b|versus|lepsi[ae]?\b.*\balebo\b|\balebo\b.*\blepsi|ktor[aáyeý]\s.*\b(?:lepsi|vybrat|zvolit)/;
  const USAGE = /\bako (?:ju |ho |ich |to )?(?:sa )?(?:spravne )?(?:pouzi|pouziv|aplik|nanies|nanas|pripr|uvar|varit|davk|pit|podav|pest|polie|zalie|skladov|pouzit)|\bjak (?:ji |ho |je |to )?(?:se )?(?:spravne )?(?:pouzi|pouziv|aplik|nanes|pripr|uvar|varit|davk|pit|podav|pest|zali|skladov)|navod|postup|mnozstv|kolko (?:gram|ml|kvap|krat|lyzic)|kolik (?:gram|ml|kap|krat)|\bv60\b|french ?press|aeropress|chemex|moka|dzezv|mozem .* (?:pouzit|pripravit)|muzu .* (?:pouzit|pripravit)|na (?:v60|filter|filtr|french|aeropress)\b.*\?/;
  const DETAIL = /\bco je\b|\bco su\b|\bco jsou\b|\bpre koho\b|\bpro koho\b|povedz|povedzte|popis|informac|viac o|vic o|o (?:tomto|tomhle|produkte|vyrobku)|\bje (?:to )?\w+.*\?|\bma\b.*\?|\bobsahuje\b|\bkolko stoj|\bkolik stoj|\bcena\b|\bskladom\b|\bskladem\b|\bdostupn|\bmate (?:produkt|na sklade)|\bmate\b.*\?|\bje vhodn|\bhodi sa\b|\bhodi se\b|\bsuche alebo|\bsladke alebo|\bpolosuche alebo/;
  const ACCESSORY = /doplnok|doplnk|doplnek|prislusenstv|k tomu|k nej\b|k nemu\b|k nim\b|k tejto|k tomuto|k tomu|co este|co jeste|\bdoz[auy]\b|doza\b|vakuov|sitk|sitek|sítk|infuz|kanvick|konvick|kvetinac|crepnik|obal na|podmisk|misk[auy]\b|substrat|hnojiv|pohar|otvarac|vyvrtk|darcekov\w* (?:taska|krabic|obal)|na skladovanie|na skladovani/;
  const ASK_NAME = /^(?:a\s+)?(?:mate|mas|mame|predavate|prodavate|ponukate|nabizite|vediete|vedete|je u vas|dostanem|seženiem|da sa kupit|kolko stoji|kolik stoji)\b/;
  const OWNED = /\bkav[auy]\s+(?:do|na|pre|k)\s|\b(?:mam|mame|pouzivam|pouzivame)\b/;
  const ASK_REC = /odporuc|doporuc|porad|vyber|hladam|hledam|chcem|chci|potrebujem|potrebuji|nieco|neco|\btip\b|ake mate|jake mate|mate nieco|mate neco|ponuk|nabid|najlep|nejlep|ukaz/;

  function shownProducts(ad, messages) {
    const byUrl = new Map(ad.products.map(p => [p.url, p]));
    const byName = new Map();
    for (const p of ad.products) { const k = norm(p.name); if (!byName.has(k)) byName.set(k, []); byName.get(k).push(p); }
    const shown = [];
    for (const m of messages) {
      if (m.role !== 'assistant') continue;
      for (const u of String(m.content).match(/https?:\/\/[^\s]+/g) || []) { const p = byUrl.get(u.replace(/[.,;)]+$/, '')); if (p) shown.push(p); }
      // Lines "Name (pack) — price." name a product even without a link.
      for (const line of String(m.content).split('\n')) { const colon = line.match(/^(?:Áno, |Ano, |Nie, |Ne, )?([^:]{6,}?)(?::| je | sa | se | obsahuje | v balení )/); if (colon && byName.has(norm(colon[1]))) shown.push(...byName.get(norm(colon[1]))); const head = line.split(' — ')[0].replace(/^\d+\s*×\s*/, ''); for (const k of [norm(head), norm(head.replace(/\s*\([^)]*\)\s*$/, ''))]) if (byName.has(k)) shown.push(...byName.get(k)); }
    }
    return uniq(shown);
  }

  function exclusionsFrom(ad, index, raw) {
    const {neg} = polarity(raw);
    const q = norm(raw);
    const ids = new Set(), wordsOut = [];
    if (neg) {
      for (const part of neg.split(/,|\bani\b|\ba ani\b|\bani\b|\bnebo\b|\balebo\b|\ba\b(?= [a-z]+$)/)) {
        const t = part.trim();
        if (!t || t.length < 3) continue;
        const ms = mentions(index, t, {strict: true});
        if (ms.length && (ms[0].exact || ms[0].score >= 5)) { for (const p of ms[0].all) ids.add(p.id); continue; }
        // A word the shop uses in product names (e.g. "Espresso", "Philodendron") is excluded by name.
        const ws = words(t).filter(w => w.length >= 4 && !/^(?:produkt\w*|vyrobk\w*|ziadn\w*|tento|tuto|toto|konkret\w*|odporuc\w*|nazve|nazvu|mat|mate|prosim|vobec|uplne|takyto|takuto|take|druh|typ)$/.test(w));
        for (const w of ws) if (index.df.get(stem(w))) wordsOut.push(stem(w));
      }
    }
    const inName = q.match(/(?:v nazve|v nazvu)\s+(?:nesmie byt|nema byt|nech nie je|nesmi byt)?\s*(?:slovo\s+)?([a-z0-9]+)/) || q.match(/nesmie mat v nazve\s+(?:slovo\s+)?([a-z0-9]+)/) || q.match(/bez slova\s+([a-z0-9]+)/);
    if (inName && inName[1].length >= 3) wordsOut.push(stem(inName[1]));
    // "Tento konkrétny produkt nechcem" refers to the product named in the same message.
    if (/tento (?:konkretny )?produkt nechc|tuto (?:konkretnu )?vec nechc|ten(?:to)? nechc|tenhle nechc|tento nechcem|tento ne\b/.test(q)) {
      const ms = mentions(index, raw);
      if (ms.length) for (const p of ms[0].all) ids.add(p.id);
    }
    return {ids, words: uniq(wordsOut)};
  }

  function stateOf(ad, index, messages) {
    const st = {answers: {}, not: {}, budget: null, qty: null, excluded: new Set(), exWords: [], named: null, lastQ: ''};
    const users = messages.filter(m => m.role === 'user');
    users.forEach((m, i) => {
      const raw = String(m.content || '');
      const q = norm(raw);
      const latest = i === users.length - 1;
      if (!latest && (SHIPPING.test(q) && !ASK_REC.test(q) || HEALTH.test(q))) return;
      const b = parseBudget(raw);
      if (b?.clear) st.budget = null;
      else if (b) st.budget = {...b, currency: b.currency || ad.currency};
      const n = parseQty(q);
      if (n) st.qty = n; else if (b && !b.total && st.qty && !/spolu|celkom|kus|ks|flas|lahv/.test(q)) st.qty = st.qty;
      const pol = polarity(raw);
      // "Akú kávu do french pressu?", "Mám french press": a brewer the customer owns is the preparation, not the subject.
      const ms = mentions(index, raw).filter(m => m.p.main !== false || !OWNED.test(q));
      // A question about a named product is not a new condition ("Je Perešek suché alebo sladké?").
      const asking = !/chcem|chci|hladam|hledam|potrebujem|potrebuji|odporuc|doporuc|vyber/.test(q);
      const productQuestion = ms.length && (DETAIL.test(q) || COMPARE.test(q) || USAGE.test(q)) && asking
        // An earlier "Máte Etiópiu?" asked about products; it does not narrow the next request.
        || !latest && ASK_NAME.test(q) && asking && !(i === users.length - 2 && OTHER.test(norm(users.at(-1).content)));
      // A product's own name is not a condition either ("Tramín červený" does not mean red wine).
      let posText = norm(pol.pos);
      for (const mm of ms) if (mm.exact) posText = posText.split(mm.core).join(' ');
      const parsed = productQuestion ? {set: {}, not: {}} : ad.parse(posText, norm(pol.neg), q);
      for (const [k, v] of Object.entries(parsed.set || {})) { st.answers[k] = v; delete st.not[k]; }
      for (const [k, v] of Object.entries(parsed.not || {})) { st.not[k] = uniq([...(st.not[k] || []), ...[].concat(v)]); if ([].concat(v).includes(st.answers[k])) delete st.answers[k]; }
      const ex = exclusionsFrom(ad, index, raw);
      for (const id of ex.ids) st.excluded.add(id);
      st.exWords.push(...ex.words);
      // Asking for a product again lifts an earlier exclusion of that product.
      if (/(?:predsa|nakoniec|naspat|zase|znova|predsalen|presto) (?:chcem|chci)|chcem (?:predsa|nakoniec)/.test(q)) { for (const mm of mentions(index, raw)) for (const p of mm.all) st.excluded.delete(p.id); }
      if (latest) st.lastQ = q;
    });
    st.exWords = uniq(st.exWords);
    return st;
  }

  /* ---------- product lines ---------- */
  function priceOf(p, st) {
    const v = p.variantFor ? p.variantFor(st?.answers || {}, st?.budget && !st.budget.total ? st.budget.amount : null) : null;
    if (v) return {amount: v.price, label: money(v.price, p.currency), variant: v.label};
    return {amount: Number.isFinite(p.amount) ? p.amount : null, label: p.price, variant: ''};
  }
  function line(ad, p, st, reason) {
    if (ad._listed) ad._listed.push(p.id);
    const pr = priceOf(p, st);
    const pack = pr.variant ? pr.variant : p.pack ? p.pack : '';
    const label = p.name + (pack && !norm(p.name).replace(/\s+/g, '').includes(norm(pack).replace(/\s+/g, '')) ? ' (' + pack + ')' : '');
    const tail = ad.family === 'plants' ? '' : ' ' + p.url;
    return `${label} — ${pr.label || ''}.${reason ? ' ' + reason : ''}${tail}`.replace(/\s+—\s+\./, '.').trim();
  }
  const capital = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const gramsIn = s => { const m = String(s || '').match(/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i); return m ? Math.round(Number(m[1].replace(',', '.')) * (/kg/i.test(m[2]) ? 1000 : 1)) : null; };
  /* Two short verified facts that help to decide; a fact that only repeats the customer's own
     condition comes after the ones that tell something new. */
  function reasonFor(ad, p, st) {
    const facts = (ad.facts(p) || []).filter(f => f.v);
    const order = ad.reasonKeys || [];
    const rankOf = f => { const i = order.indexOf(f.k); return i < 0 ? 50 : i; };
    const picked = facts.slice().sort((a, b) => rankOf(a) - rankOf(b)).slice(0, 2).map(f => f.v);
    // "Chuť: čokoláda, mandle; nízka kyslosť." keeps a listed fact apart from the next one.
    return picked.length ? capital(picked.join(picked.some(v => v.includes(':')) ? '; ' : ', ')) + '.' : '';
  }

  function fitsBudget(p, st) {
    if (!st.budget) return true;
    const pr = priceOf(p, st);
    if (!Number.isFinite(pr.amount)) return false;
    const unitLimit = st.budget.total && st.qty ? st.budget.amount / st.qty : st.budget.amount;
    // A parent "from" price only fits when every size fits or the customer did not ask for a size.
    return pr.amount <= unitLimit + 1e-9;
  }
  function wordExcluded(p, st) {
    if (!st.exWords.length) return false;
    const stems = new Set(words(p.name).map(stem));
    return st.exWords.some(w => stems.has(w));
  }
  function candidates(ad, st, extra = {}) {
    let list = ad.rank(st.answers, st.not, st) || [];
    list = list.filter(p => p.available !== false && !st.excluded.has(p.id) && !wordExcluded(p, st) && !(extra.skip && extra.skip.has(p.id)));
    const budgeted = list.filter(p => fitsBudget(p, st));
    return {all: list, fit: budgeted};
  }

  function conditionText(ad, st) {
    const parts = (ad.describe ? ad.describe(st.answers, st.not) : []).filter(Boolean);
    if (st.budget?.below) parts.push((ad.lang === 'cs' ? 'levnější než ' : 'lacnejšie ako ') + money(st.budget.below, st.budget.currency || ad.currency));
    else if (st.budget) parts.push((st.budget.total ? (st.qty ? st.qty + ' ks ' : '') + 'do ' : 'do ') + money(st.budget.amount, st.budget.currency || ad.currency) + (st.budget.total ? ' spolu' : ''));
    return parts.join(', ');
  }

  /* ---------- answers ---------- */
  function recommendReply(ad, st, opts = {}) {
    const t = T[ad.lang];
    const skip = new Set(opts.skip || []);
    const {all, fit} = candidates(ad, st, {skip});
    const cond = conditionText(ad, st);
    if (st.budget && st.budget.currency && st.budget.currency !== ad.currency) return ad.lang === 'cs' ? 'Tato nabídka má ceny v ' + (ad.currency === 'CZK' ? 'Kč' : 'eurech') + '. Zadejte prosím rozpočet ve stejné měně.' : 'Táto ponuka má ceny v ' + (ad.currency === 'CZK' ? 'Kč' : 'eurách') + '. Zadajte prosím rozpočet v rovnakej mene.';
    if (st.qty && st.budget?.total) return totalReply(ad, st, fit.length ? fit : all);
    if (!fit.length) {
      if (opts.other && opts.skip?.length) return t.noOther + (cond ? ' (' + cond + ')' : '') + ' ' + t.change + (ad.lang === 'cs' ? ', třeba rozpočet nebo typ.' : ', napríklad rozpočet alebo typ.');
      if (all.length && st.budget) {
        const cheapest = all.slice().sort((a, b) => (priceOf(a, st).amount ?? 1e12) - (priceOf(b, st).amount ?? 1e12))[0];
        const condNoBudget = conditionText(ad, {...st, budget: null, answers: {...st.answers, sort: undefined}});
        return `${t.noneUnder(money(st.budget.amount, st.budget.currency || ad.currency), condNoBudget)} ${t.cheapest(cheapest.name, priceOf(cheapest, st).label)}\n\n${line(ad, cheapest, st)}`;
      }
      // A coffee that fits but is sold out right now is named rather than denied.
      const so = ad.soldOutMatch && !st.budget ? ad.soldOutMatch(st.answers, st.not) : null;
      const soText = so ? (ad.lang === 'cs' ? `${so.name} v nabídce je, ale momentálně není skladem.` : `${so.name} v ponuke je, ale momentálne nie je skladom.`) : '';
      // Nearest option: relax soft preferences, never exclusions or the budget.
      for (const key of ad.relax || []) {
        if (st.answers[key] === undefined) continue;
        const relaxed = {...st, answers: {...st.answers, [key]: undefined}};
        delete relaxed.answers[key];
        const c = candidates(ad, relaxed, {skip}).fit;
        if (c.length) {
          const what = ad.describe ? ad.describe({[key]: st.answers[key]}, {}).join(', ') : key;
          const head = soText ? soText + ' ' + (ad.lang === 'cs' ? 'Ze zboží skladem je nejblíže' : 'Zo skladových je najbližšia možnosť') : `${cond ? t.nothing.replace(/\.$/, '') + ' (' + cond + ').' : t.nothing} ${t.nearest}`;
          return `${head}${ad.lang === 'cs' ? ' (nesplňuje: ' : ' (nespĺňa: '}${what}):\n\n${line(ad, c[0], relaxed, reasonFor(ad, c[0], relaxed))}`;
        }
      }
      if (so) {
        const sim = (ad.similarTo ? ad.similarTo(so, st.answers || {}) : []).filter(x => x.available !== false && fitsBudget(x, st)).slice(0, 2);
        return soText + '\n\n' + line(ad, so, st) + (sim.length ? '\n\n' + t.similarNow + '\n\n' + sim.map(x => line(ad, x, st, reasonFor(ad, x, st))).join('\n\n') : '');
      }
      if (!ad.products.some(p => p.main && p.available !== false)) return null;
      const note = ad.noMatchNote ? ad.noMatchNote(st.answers, st.not) : '';
      // The family's own note ("Kávu s robustou e-shop v ponuke nemá.") says it plainly on its own.
      if (note) return note;
      return (cond ? t.nothing.replace(/\.$/, '') + ' (' + cond + ').' : t.nothing) + ' ' + t.change + '.';
    }
    const shown = fit.slice(0, opts.limit || 3);
    const head = cond ? (ad.lang === 'cs' ? 'Z nabídky vybírám (' : 'Z ponuky vyberám (') + cond + '):' : (ad.lang === 'cs' ? 'Z nabídky vybírám:' : 'Z ponuky vyberám:');
    const excluded = [...st.excluded].map(id => ad.products.find(p => p.id === id)).filter(Boolean);
    const exNote = excluded.length ? (ad.lang === 'cs' ? 'Bez ' : 'Bez ') + uniq(excluded.map(p => p.name)).slice(0, 2).join(', ') + '.' : '';
    const fromNote = shown.some(p => /^od\s/i.test(priceOf(p, st).label || '')) && (st.budget || st.answers.size) ? '\n\n' + t.perUnitNote : '';
    const pre = ad.preNote ? ad.preNote(st.answers, st.not) : '';
    return (pre ? pre + '\n\n' : '') + [head + (exNote ? ' ' + exNote : ''), ...shown.map(p => line(ad, p, st, reasonFor(ad, p, st)))].join('\n\n') + fromNote;
  }

  function totalReply(ad, st, list) {
    const t = T[ad.lang];
    const n = st.qty, limit = st.budget.amount, cur = st.budget.currency || ad.currency;
    const priced = list.map(p => ({p, a: priceOf(p, st).amount})).filter(x => Number.isFinite(x.a));
    if (!priced.length) return t.nothing;
    const cheapest = priced.slice().sort((a, b) => a.a - b.a);
    // Distinct products first, in the family's order, as long as the rest can still be filled cheaply.
    const pick = [];
    let sum = 0;
    for (const x of priced) {
      if (pick.length >= n) break;
      const remaining = n - pick.length - 1;
      const fill = cheapest.filter(c => !pick.includes(c) && c !== x).slice(0, remaining).reduce((s, c) => s + c.a, 0);
      const fillOk = remaining <= cheapest.filter(c => !pick.includes(c) && c !== x).length;
      if (sum + x.a + (fillOk ? fill : remaining * cheapest[0].a) <= limit + 1e-9) { pick.push(x); sum += x.a; }
    }
    while (pick.length < n && cheapest.length) {
      const next = cheapest.find(c => sum + c.a <= limit + 1e-9);
      if (!next) break;
      pick.push(next); sum += next.a;
    }
    if (pick.length < n) {
      const minSum = cheapest[0].a * n;
      return t.totalNo(n, money(limit, cur), money(minSum, cur)) + '\n\n' + line(ad, cheapest[0].p, st);
    }
    const counts = new Map();
    for (const x of pick) counts.set(x.p, (counts.get(x.p) || 0) + 1);
    return [t.pick(n), ...[...counts].map(([p, c]) => (c > 1 ? c + ' × ' : '') + line(ad, p, st)), t.total(money(Math.round(sum * 100) / 100, cur)) + (ad.lang === 'cs' ? ' Doprava není v ceně.' : ' Doprava nie je v cene.')].join('\n\n');
  }

  function detailReply(ad, st, m, q, qi) {
    const t = T[ad.lang];
    const p = m.p;
    const out = [];
    const attr = ad.attribute ? ad.attribute(p, qi ?? q) : null;
    if (attr) out.push(attr);
    // "Je skladom?" gets a plain yes before the details.
    else if (/\bskladom\b|\bskladem\b|\bdostupn/.test(q) && p.available !== false) out.push(ad.lang === 'cs' ? `Ano, ${p.name} je skladem.` : `Áno, ${p.name} je skladom.`);
    out.push(line(ad, p, st));
    const facts = (ad.facts(p) || []).filter(f => f.v);
    if (facts.length) out.push(capital(facts.slice(0, 4).map(f => f.v).join(', ')) + '.');
    if (/pre koho|pro koho|vhodn|hodi/.test(q)) {
      const who = facts.map(f => f.who).filter(Boolean);
      out.push(who.length ? capital(uniq(who).slice(0, 2).join('; ')) + '.' : t.forWhomUnknown);
    }
    if (p.available === false) return unavailableReply(ad, st, m, attr);
    if (st.budget && !fitsBudget(p, st)) out.push(t.over(p.name, priceOf(p, st).label, money(st.budget.amount, st.budget.currency || ad.currency)));
    return out.join('\n\n');
  }

  /* A named product the shop does not sell now: say so, then the same product in a pack that is in
     stock and one or two similar products in stock, each with price and link. A page that no longer
     exists is not linked. */
  function unavailableReply(ad, st, m, attr) {
    const t = T[ad.lang];
    const p = m.p;
    const out = [];
    if (p.gone) out.push(t.gone(p.name));
    else { if (attr) out.push(attr); out.push(line(ad, p, st)); out.push(t.soldOut); }
    const same = (m.all || []).filter(x => x.available !== false && x.id !== p.id && x.main !== false).sort((a, b) => (a.sample ? 1 : 0) - (b.sample ? 1 : 0) || (a.amount ?? 1e9) - (b.amount ?? 1e9));
    const skip = new Set([...(m.all || []).map(x => x.id), ...st.excluded]);
    const similar = (ad.similarTo ? ad.similarTo(p, st.answers || {}) : []).filter(x => !skip.has(x.id) && fitsBudget(x, st));
    if (same.length) out.push(t.sameOther + '\n\n' + line(ad, same[0], st));
    const n = same.length ? 1 : 2;
    if (similar.length) out.push(t.similarNow + '\n\n' + similar.slice(0, n).map(x => line(ad, x, st, reasonFor(ad, x, st))).join('\n\n'));
    return out.join('\n\n');
  }

  function compareReply(ad, st, a, b) {
    const t = T[ad.lang];
    const fa = ad.facts(a.p) || [], fb = ad.facts(b.p) || [];
    const keys = uniq([...fa, ...fb].map(f => f.k));
    const diffs = [];
    for (const k of keys) {
      const x = fa.find(f => f.k === k), y = fb.find(f => f.k === k);
      if ((x?.v || '') !== (y?.v || '')) diffs.push({k, x, y});
    }
    const pa = priceOf(a.p, st), pb = priceOf(b.p, st);
    const desc = (m, f) => `${m.p.name} — ${priceOf(m.p, st).label}: ${f.filter(x => x.v).slice(0, 4).map(x => x.v).join(', ') || (ad.lang === 'cs' ? 'bez dalších údajů v e-shopu' : 'bez ďalších údajov v e-shope')}. ${ad.family === 'plants' ? '' : m.p.url}`.trim();
    const out = [desc(a, fa), desc(b, fb)];
    const decisive = diffs.filter(d => d.x?.v && d.y?.v).slice(0, 3);
    if (decisive.length) out.push(t.diff + ': ' + decisive.map(d => `${d.x.v} vs. ${d.y.v}`).join('; ') + '.');
    else if (diffs.length) out.push(t.diff + ': ' + diffs.slice(0, 2).map(d => d.x?.v ? `${a.p.name}: ${d.x.v}` : `${b.p.name}: ${d.y.v}`).join('; ') + '.');
    else out.push(t.compareSame);
    const ha = (decisive.find(d => d.x?.hint) || diffs.find(d => d.x?.hint))?.x?.hint;
    const hb = (decisive.find(d => d.y?.hint) || diffs.find(d => d.y?.hint))?.y?.hint;
    if (ha && hb && ha !== hb) out.push(t.choose(a.p.name, ha, b.p.name, hb));
    else if (Number.isFinite(pa.amount) && Number.isFinite(pb.amount) && pa.amount !== pb.amount) out.push(ad.lang === 'cs' ? `Levnější je ${pa.amount < pb.amount ? a.p.name : b.p.name}.` : `Lacnejšia je ${pa.amount < pb.amount ? a.p.name : b.p.name}.`);
    return out.join('\n\n');
  }

  function usageReply(ad, st, m, q) {
    const t = T[ad.lang];
    const u = ad.usage ? ad.usage(m.p, q, st) : null;
    const out = [];
    if (u) out.push(norm(u).includes(norm(m.p.name).slice(0, 12)) ? u : m.p.name + ': ' + u.charAt(0).toLowerCase() + u.slice(1));
    out.push(t.usageSource.replace(/:$/, '') + (ad.lang === 'cs' ? ' (' + m.p.name + '):' : ' (' + m.p.name + '):') + ' ' + (ad.family === 'plants' ? '' : m.p.url));
    return out.join('\n\n');
  }

  function accessoryReply(ad, st, main, q) {
    const t = T[ad.lang];
    const list = (ad.accessories ? ad.accessories(main?.p || null, q, st) : []).filter(p => p.available !== false && !st.excluded.has(p.id));
    if (!list.length) {
      // The shop does sell it, only not now: say so instead of "not in the offer".
      const gone = !main && ad.accessories ? ad.accessories(null, q, st, {all: true}).filter(p => p.available === false && !st.excluded.has(p.id)) : [];
      if (gone.length) return (ad.lang === 'cs' ? 'Takový produkt e-shop v nabídce má, momentálně ale není skladem:' : 'Takýto produkt e-shop v ponuke má, momentálne však nie je skladom:') + '\n\n' + gone.slice(0, 2).map(p => line(ad, p, st)).join('\n\n');
      return main ? t.accNone(main.p.name) : t.accNoneGeneric;
    }
    const mainPrice = main ? priceOf(main.p, st).amount : 0;
    let pick = list;
    let note = '';
    if (st.budget) {
      const left = st.budget.total || main ? st.budget.amount - (Number.isFinite(mainPrice) ? mainPrice : 0) : st.budget.amount;
      const within = list.filter(p => Number.isFinite(priceOf(p, st).amount) && priceOf(p, st).amount <= left + 1e-9);
      if (!within.length) {
        const c = list[0];
        return (main ? t.accHead(main.p.name) + '\n\n' : '') + t.accOver(c.name, priceOf(c, st).label, money(Math.max(left, 0), st.budget.currency || ad.currency));
      }
      pick = within;
      if (main && Number.isFinite(mainPrice)) note = t.total(money(Math.round((mainPrice + priceOf(pick[0], st).amount) * 100) / 100, st.budget.currency || ad.currency)) + (ad.lang === 'cs' ? ' (bez dopravy)' : ' (bez dopravy)');
    }
    const head = main ? t.accHead(main.p.name) : (ad.lang === 'cs' ? 'Z nabídky:' : 'Z ponuky:');
    const why = p => (ad.accessoryReason ? ad.accessoryReason(p, main?.p, q) : '') || '';
    return [head, ...pick.slice(0, 2).map(p => line(ad, p, st, why(p))), note].filter(Boolean).join('\n\n');
  }

  /* Country lines start with the country ("Slovensko: …"); a named country narrows the answer. */
  const COUNTRY_LINE = /^(?:Slovensk|Česk|Cesk|Rak[úo]|Nemeck|Maďar|Poľsk|Polsk|Ostatn|Ostatní|Jiné|Zahrani|EU\b|EÚ\b|USA)[^:]{0,40}:/;
  const COUNTRY = [[/sloven|\bsk\b|\bslovak/, /^Slovensk/], [/cesk|\bcz\b|cesko|czech|\bcr\b/, /^Česk|^Česká|^Cesk/], [/rakus|rakous|austri/, /^Rak/]];
  function shippingReply(ad, q = '') {
    const t = T[ad.lang];
    const s = ad.shipping;
    if (!s || !s.lines?.length) return t.shippingUnknown + ' ' + (s?.url || ad.source);
    const byCountry = s.lines.filter(l => COUNTRY_LINE.test(l));
    const asked = COUNTRY.find(([rx]) => rx.test(q));
    let lines = s.lines;
    // Prices that name no country are the shop's home prices (Slovakia, or Czechia for a Czech shop); another country is not assumed to cost the same.
    if (asked && !byCountry.length && !asked[1].test(ad.lang === 'cs' ? 'Česko' : 'Slovensko')) return (ad.lang === 'cs' ? 'Cenu dopravy do této země e-shop na své stránce neuvádí. Aktuální možnosti jsou v e-shopu:' : 'Cenu dopravy do tejto krajiny e-shop na svojej stránke neuvádza. Aktuálne možnosti sú v e-shope:') + ' ' + (s.url || ad.source);
    if (asked && byCountry.length) {
      const own = s.lines.filter(l => asked[1].test(l));
      const general = s.lines.filter(l => !byCountry.includes(l));
      lines = own.length ? [...own, ...general] : [(ad.lang === 'cs' ? 'Pro tuto zemi e-shop cenu dopravy neuvádí. Uvedené ceny:' : 'Pre túto krajinu e-shop cenu dopravy neuvádza. Uvedené ceny:'), ...s.lines];
    }
    return [t.shippingHead + (s.checkedAt ? ' (' + s.checkedAt + ')' : '') + ':', ...lines, s.url || ''].filter(Boolean).join('\n');
  }

  /* Personal pickup and the shop's own premises, in the shop's words. */
  const PICKUP = /vyzdvihn|vyzdvihnut|osobn\w* (?:odber|prevzat|vyzdvih)|\bosobne\b|predajn|prevadzk|kamenn\w* obchod|otvaracie|oteviraci|kde (?:vas|ste|sidlite) |adresa (?:predajne|obchodu)/;
  function pickupReply(ad) {
    const s = ad.shipping || {};
    const clauses = s.pickup?.length ? s.pickup.map(c => c.replace(/[.;,]+$/, '')) : uniq([...(s.lines || []), ...(s.delivery || []), ...(s.payment || [])].flatMap(l => l.split(/(?<=[.;])\s+|,\s+/)).filter(c => /osobn|odber|vyzdvih|predajn|prazia|pražia/i.test(c)).map(c => c.replace(/[.;,]+$/, '').replace(/^\w/, ch => ch.toUpperCase())));
    // Without the shop's facts in the demo nothing is claimed about its pages.
    if (!ad.shipping) return (ad.lang === 'cs' ? 'Osobní odběr v ukázce ověřený nemám. Aktuální možnosti jsou v e-shopu: ' : 'Osobný odber v ukážke overený nemám. Aktuálne možnosti sú v e-shope: ') + ad.source;
    if (!clauses.length) return (ad.lang === 'cs' ? 'Osobní odběr ani prodejnu e-shop na svých stránkách neuvádí. Aktuální možnosti jsou v e-shopu: ' : 'Osobný odber ani predajňu e-shop na svojej stránke neuvádza. Aktuálne možnosti sú v e-shope: ') + (s.termsUrl || s.url || ad.source);
    const more = s.pickup?.length ? (ad.lang === 'cs' ? 'Podrobnosti najdete v e-shopu: ' : 'Podrobnosti nájdete v e-shope: ') : (ad.lang === 'cs' ? 'Otevírací dobu a adresu najdete v e-shopu: ' : 'Otváracie hodiny a adresu nájdete v e-shope: ');
    return [(ad.lang === 'cs' ? 'Osobní odběr podle e-shopu' : 'Osobný odber podľa e-shopu') + (s.checkedAt ? ' (' + s.checkedAt + ')' : '') + ':', clauses.join('. ') + '.', more + (s.pickup?.length ? s.url || s.termsUrl || '' : s.termsUrl || s.url || '')].join('\n');
  }

  /* Payment methods and delivery time exactly as the shop's terms state them. */
  const PAYMENT = /platit|platb|kartou|\bkarta\b|\bkartu\b|dobierk|dobirk|prevod|apple pay|google pay|zaplat/;
  const DELIVERY = /kedy (?:mi |nam )?(?:to |ju |ho |objednavka |balik |zasielka |tovar )?(?:pride|prid|dorazi|dojde|dostanem|odoslete|odosielate|expedujete|bude doma)|kdy (?:mi |nam )?(?:to |ji |ho |objednavka |balik |zasilka )?(?:prijde|dorazi|dojde|bude doma)|ako dlho|jak dlouho|dodac\w* (?:leh|dob)|lehot|ako rychlo|jak rychle|do kolkych dni|kolko dni/;
  function termsReply(ad, kind) {
    const s = ad.shipping || {};
    const lines = kind === 'payment' ? s.payment : s.delivery;
    const head = kind === 'payment' ? (ad.lang === 'cs' ? 'Platba podle e-shopu' : 'Platba podľa e-shopu') : (ad.lang === 'cs' ? 'Dodání podle e-shopu' : 'Doručenie podľa e-shopu');
    // A shop whose pages were read but state no payment methods or delivery time is quoted as such.
    if (!lines?.length && s.checkedAt) return (kind === 'payment' ? (ad.lang === 'cs' ? 'Způsoby platby e-shop na svých stránkách neuvádí; zobrazí se při objednávce. Podmínky najdete v e-shopu:' : 'Spôsoby platby e-shop na svojej stránke neuvádza; zobrazia sa pri objednávke. Podmienky nájdete v e-shope:') : (ad.lang === 'cs' ? 'Dodací lhůtu e-shop na svých stránkách neuvádí. Podmínky najdete v e-shopu:' : 'Dodaciu lehotu e-shop na svojej stránke neuvádza. Podmienky nájdete v e-shope:')) + ' ' + (s.termsUrl || s.url || ad.source);
    if (!lines?.length) return (kind === 'payment' ? (ad.lang === 'cs' ? 'Způsoby platby v ukázce ověřené nemám. Aktuální možnosti jsou v e-shopu:' : 'Spôsoby platby v ukážke overené nemám. Aktuálne možnosti sú v e-shope:') : (ad.lang === 'cs' ? 'Dodací lhůtu v ukázce ověřenou nemám. Aktuální informace jsou v e-shopu:' : 'Dodaciu lehotu v ukážke overenú nemám. Aktuálne informácie sú v e-shope:')) + ' ' + (s.termsUrl || s.url || ad.source);
    return [head + (s.checkedAt ? ' (' + s.checkedAt + ')' : '') + ':', ...lines, s.termsUrl || s.url || ''].filter(Boolean).join('\n');
  }

  /* ---------- main entry ---------- */
  function reply(ad, latestRaw, history) {
    if (!ad || !ad.products?.length) return null;
    const messages = (Array.isArray(history) ? history : []).filter(m => m && (m.role === 'user' || m.role === 'assistant')).map(m => ({role: m.role, content: String(m.content || '')}));
    if (!messages.length || messages.at(-1).role !== 'user' || messages.at(-1).content !== latestRaw) messages.push({role: 'user', content: String(latestRaw || '')});
    const q = norm(latestRaw);
    if (!q.trim()) return null;
    // Greetings and thanks are answered as such in every family, never with a product.
    const bare = q.replace(/[!?.,\s]+$/, '').trim();
    if (/^(?:ahoj|ahojte|dobry den|dobry vecer|dobre rano|zdravim|cau|cauko|hello|hi|hej|nazdar)(?: \w+)?$/.test(bare)) return ad.lang === 'cs' ? 'Dobrý den! Rád vám poradím s výběrem z nabídky. Napište, co hledáte.' : 'Dobrý deň! Rád vám poradím s výberom z ponuky. Napíšte, čo hľadáte.';
    if (/^(?:dakujem|dakujeme|dakujem pekne|dakujem vam|vdaka|velka vdaka|diky|dik|dekuji|dekujeme|dekuji moc|super dakujem|ok dakujem|dobre dakujem)$/.test(bare)) return ad.lang === 'cs' ? 'Rádo se stalo. Pokud budete chtít poradit s dalším výběrem, napište.' : 'Rado sa stalo. Ak budete chcieť poradiť s ďalším výberom, napíšte.';
    if (HEALTH.test(q)) return ad.health ? ad.health(q, messages) : null;
    const index = ad.index || (ad.index = buildIndex(ad.products));
    // "Posielate rastliny aj v zime?" asks about sending, even though it names the goods.
    const notProduct = !/produkt|odporuc|doporuc|kav[auy]|vin[oa]|krem|caj|rastlin/.test(q.replace(/doprav\w*/g, '')) || /^(?:a\s+)?(?:posielate|posilate|zasielate|zasilate|dorucujete|odosielate|odesilate)\b/.test(q);
    if (DELIVERY.test(q) && notProduct) return termsReply(ad, 'delivery');
    if (PAYMENT.test(q) && !/doprav|postovn|poštovn/.test(q) && notProduct) return termsReply(ad, 'payment');
    if (PICKUP.test(q) && notProduct && !/odporuc|doporuc|\bmate\b.*\bkav/.test(q)) return pickupReply(ad);
    if (SHIPPING.test(q) && notProduct) return shippingReply(ad, q);
    // "A do Česka?" right after a shipping answer is the same question for another country.
    const lastBot = [...messages].reverse().find(m => m.role === 'assistant')?.content || '';
    if (lastBot.startsWith(T[ad.lang].shippingHead) && COUNTRY.some(([rx]) => rx.test(q)) && q.split(' ').length <= 6) return shippingReply(ad, q);
    if (ad.pre) { const early = ad.pre(q, messages); if (early !== undefined) return early; }
    const st = stateOf(ad, index, messages);
    const pol = polarity(latestRaw);
    // A short question or "Máte …?" names a product even by one distinctive word of its name.
    const loose = ASK_NAME.test(q) || words(q).length <= 3 && !OTHER.test(q) && !ASK_REC.test(q) && !COMPARE.test(q);
    let named = mentions(index, pol.pos || latestRaw, {raw: pol.neg ? '' : latestRaw, loose}).filter(m => !st.excluded.has(m.p.id) || COMPARE.test(q));
    // "Akú kávu do french pressu?" asks for coffee: a brewer or syrup named only in passing is not the subject.
    if (/\bkav[auy]\b/.test(q)) named = named.filter(m => m.p.main !== false || m.exact && !new RegExp('\\bkav[auy]\\s+(?:do|na|pre|k)\\s').test(q));
    if (OWNED.test(q) && ASK_REC.test(q)) named = named.filter(m => m.p.main !== false);
    // A weak name match next to real conditions ("z Kolumbie na filter") is a condition, not a product question.
    // "kávu z Dominikánskej republiky" loosely resembling one name is a country of origin, not that product.
    if (named.length && named.every(m => !m.exact && !m.weak && m.score < 5 && words(m.p.name).map(stem).filter(x => x.length >= 4 && words(q).map(stem).includes(x)).length < 2) && ad.parse) { const pl0 = ad.parse(norm(pol.pos || latestRaw), norm(pol.neg), q); if (pl0.set?.origin) { named = []; st.answers = {...st.answers, ...pl0.set}; } }
    if (named.length && named.every(m => m.weak) && ad.parse) { const nameStems = new Set(named.flatMap(m => words(m.core).map(stem))); const rest = words(pol.pos || latestRaw).filter(w => !nameStems.has(stem(w))).join(' '); const pl = ad.parse(rest, norm(pol.neg), q); if (Object.keys(pl.set || {}).some(k => k !== 'size')) named = []; }
    // Only weak matches (one word shared by several products): the asked pack size decides, else the products are listed.
    if (named.length && named.every(m => m.weak)) {
      const size = st.answers?.size;
      const pool = named.flatMap(m => m.all.map(p => ({m, p})));
      const sized = size ? pool.filter(({p}) => !/\d\s*x\s*\d/.test(norm(p.name)) && (gramsIn(p.pack) === size || gramsIn(p.name) === size)) : [];
      if (sized.length) { const hit = sized.find(x => x.p.available !== false) || sized[0]; named = [{...hit.m, p: hit.p}]; }
      else if (named.length > 1 && !COMPARE.test(q)) {
        const gearOnly = pool.every(x => x.p.main === false);
        const list = uniq(pool.map(x => x.p)).filter(p => p.available !== false && (p.main !== false || gearOnly) && !p.sample && !/\d\s*x\s*\d/.test(norm(p.name)) && fitsBudget(p, st)).slice(0, 3);
        if (list.length) return T[ad.lang].byName + '\n\n' + list.map(p => line(ad, p, st, reasonFor(ad, p, st))).join('\n\n');
      }
    }
    // "Koľko stojí?", "Je skladom?" right after one product was shown asks about that product.
    const PRICE_Q = /kolko stoj|kolik stoj|\bcena\b|\bcenu\b|za kolko|za kolik/;
    const lastBotMsg = [...messages].slice(0, -1).reverse().find(m => m.role === 'assistant');
    // The products just shown; after a short answer about them ("Stoja rovnako …"), the list before it.
    const bots = [...messages].slice(0, -1).reverse().filter(m => m.role === 'assistant').slice(0, 2);
    const shownLast = named.length ? [] : uniq(shownProducts(ad, [bots[0]].filter(Boolean))).length ? uniq(shownProducts(ad, [bots[0]])) : bots[1] && !/https?:\/\//.test(bots[0]?.content || '') ? uniq(shownProducts(ad, [bots[1]])) : [];
    const PRONOUN = /\b(?:ju|ho|tuto|tuhle|tento|tenhle|tu istu|tu kavu|tuto kavu|tato|tata|ta)\b/;
    // "A lacnejšiu?", "Ešte lacnejší": cheaper than everything just shown.
    if (shownLast.length >= 2 && /\bktor\w*|\bktery\w*|\bktera\b|\bktere\b/.test(q) && /lacnejs|levnejs|drahs|draz/.test(q) && !/\d/.test(q)) {
      const pair = shownLast.slice(0, /prv\w* dv|dvoch|dvou|tych dvoch|oboch/.test(q) || shownLast.length === 2 ? 2 : 3).map(x => ({x, a: priceOf(x, st).amount})).filter(o => Number.isFinite(o.a));
      if (pair.length >= 2) {
        const cheap = /lacnejs|levnejs/.test(q);
        const best = pair.slice().sort((u, v) => cheap ? u.a - v.a : v.a - u.a);
        const tied = best.filter(o => o.a === best[0].a);
        if (tied.length === best.length) return (ad.lang === 'cs' ? 'Stojí stejně, ' : 'Stoja rovnako, ') + money(best[0].a, ad.currency) + '.';
        // Two of three at the same price: both are named, with what the other one costs.
        if (tied.length > 1) return tied.map(o => o.x.name).join(ad.lang === 'cs' ? ' a ' : ' a ') + (ad.lang === 'cs' ? ' stojí stejně, ' : ' stoja rovnako, ') + money(best[0].a, ad.currency) + '; ' + best.filter(o => !tied.includes(o)).map(o => o.x.name + (ad.lang === 'cs' ? ' stojí ' : ' stojí ') + money(o.a, ad.currency)).join(', ') + '.';
        const most = /\bnaj|\bnej/.test(q);
        return (cheap ? (most ? (ad.lang === 'cs' ? 'Nejnižší cenu má ' : 'Najnižšiu cenu má ') : (ad.lang === 'cs' ? 'Levnější je ' : 'Lacnejší je ')) : (most ? (ad.lang === 'cs' ? 'Nejvyšší cenu má ' : 'Najvyššiu cenu má ') : (ad.lang === 'cs' ? 'Dražší je ' : 'Drahší je '))) + line(ad, best[0].x, st);
      }
    }
    const lastListed = !named.length ? [...messages].slice(0, -1).reverse().filter(m => m.role === 'assistant').slice(0, 3).map(m => uniq(shownProducts(ad, [m]))).find(l => l.length) || [] : [];
    if (lastListed.length && /lacnejs|levnejs/.test(q) && !/najlacn|nejlevn/.test(q) && !/\d/.test(q) && words(q).length <= 6) {
      const shownLast = lastListed;
      if (shownLast.every(x => x.main === false) && ad.cheaperGear) return ad.cheaperGear(shownLast);
      // The prices and pack the customer saw in that answer ("(1 kg · zrnková) — 29 €").
      const listedMsg = [...messages].slice(0, -1).reverse().filter(m => m.role === 'assistant').slice(0, 3).find(m => uniq(shownProducts(ad, [m])).length) || {content: ''};
      const seen = String(listedMsg.content).split('\n').map(l => l.match(/\((\d+(?:[.,]\d+)?\s*k?g)[^)]*\)\s+—\s+(?:od\s+)?([\d\s]+(?:,\d+)?)\s*(?:€|Kč)|—\s+(?:od\s+)?([\d\s]+(?:,\d+)?)\s*(?:€|Kč)/)).filter(Boolean);
      const seenPrices = seen.map(m => Number(String(m[2] || m[3]).replace(/\s/g, '').replace(',', '.'))).filter(Number.isFinite);
      const seenSizes = uniq(seen.map(m => m[1] ? gramsIn(m[1]) : null));
      const floor = seenPrices.length ? Math.min(...seenPrices) : Math.min(...shownLast.map(x => priceOf(x, st).amount).filter(Number.isFinite));
      if (Number.isFinite(floor)) {
        const cheaper = {...st, budget: {amount: floor - 0.01, currency: ad.currency, below: floor}, answers: {...st.answers, ...(seenSizes.length === 1 && seenSizes[0] ? {size: seenSizes[0]} : {})}};
        delete cheaper.answers.sort;
        const {fit} = candidates(ad, cheaper, {});
        const thing = ad.family === 'coffee' ? (ad.lang === 'cs' ? ['Levnější kávu, která splňuje', 'nejlevnější jsou'] : ['Lacnejšiu kávu, ktorá spĺňa', 'najlacnejšie sú']) : (ad.lang === 'cs' ? ['Levnější produkt, který splňuje', 'nejlevnější je'] : ['Lacnejší produkt, ktorý spĺňa', 'najlacnejší je']);
        if (!fit.length) return thing[0] + (ad.lang === 'cs' ? ' vaše podmínky, e-shop nemá; ' : ' vaše podmienky, e-shop nemá; ') + thing[1] + (ad.lang === 'cs' ? ' za ' : ' za ') + money(floor, ad.currency) + '.';
        return recommendReply(ad, cheaper);
      }
    }
    if (shownLast.length && words(q).length <= 8) {
      // "Ktorá z nich je najlacnejšia / najmenej kyslá?": chosen among the coffees just shown.
      // "Je prvá z nich kyslá?", "Koľko stojí tá druhá?": that coffee in the list.
      const ord = /\b(?:prv[aáyeýu]|prvn[ií])\b/.test(q) ? 0 : /\b(?:druh[aáyeýu]|druh[aá])\b/.test(q) ? 1 : /\b(?:tret[iíia]\w*)\b/.test(q) ? 2 : -1;
      if (ord >= 0 && shownLast[ord] && !named.length) named = [{p: shownLast[ord], all: [shownLast[ord]], exact: false, core: '', score: 10, pos: 0}];
      else if (/\bz (?:nich|tychto|tych|tejto|techto|tech)\b|ktor\w* z |kter\w* z /.test(q) && shownLast.length > 1 && /\bnaj|\bnej/.test(q)) {
        const by = /najlacn|nejlevn/.test(q) ? (x => priceOf(x, st).amount ?? 1e9) : /najdrah|nejdraz/.test(q) ? (x => -(priceOf(x, st).amount ?? 0)) : /kysl|kysel|acid/.test(q) ? (x => Number.isFinite(x.raw?.acidity) ? x.raw.acidity : 9) : null;
        if (by) {
          const best = shownLast.filter(x => x.available !== false).slice().sort((a, b) => by(a) - by(b))[0];
          if (best) return (ad.lang === 'cs' ? 'Z nich: ' : 'Z nich: ') + line(ad, best, st, reasonFor(ad, best, st));
        }
      }
      // "Aký je medzi nimi rozdiel?": the first two coffees just shown.
      if (COMPARE.test(q) && shownLast.length >= 2 && /nimi|nich|tymi|tyma|tymito|dvoma|oboma|nima/.test(q)) return compareReply(ad, st, {p: shownLast[0], all: [shownLast[0]]}, {p: shownLast[1], all: [shownLast[1]]});
      // "Je mletá alebo zrnková?", "Sú bez kofeínu?" about the coffees just shown.
      if (!named.length && shownLast.length > 1 && ad.attribute && /^(?:a\s+)?(?:je|su|ma|maju|jsou|sa predava|predavaju|da sa|daju sa)\b/.test(q) && !ASK_REC.test(q)) {
        const answers = shownLast.slice(0, 3).map(x => ad.attribute(x, q)).filter(Boolean);
        if (answers.length) return answers.join('\n');
      }
    }
    if (!named.length && words(q).length <= 8 && (DETAIL.test(q) || USAGE.test(q) || PRICE_Q.test(q) || /\bhodi\b|vhodn|balen/.test(q)) && (!/^(?:a\s+)?(?:mate|mas|predavate|prodavate|ponukate|nabizite)\b/.test(q) || PRONOUN.test(q))) {
      // The product the customer named in the previous question, when the answer also listed alternatives.
      const prevUsers = [...messages].slice(0, -1).reverse().filter(m => m.role === 'user').slice(0, 3);
      const prevHit = shownLast.length > 1 ? prevUsers.map(u => mentions(index, u.content, {raw: u.content, loose: true}).find(m => shownLast.includes(m.p))).find(Boolean) : null;
      if (shownLast.length === 1) named = [{p: shownLast[0], all: [shownLast[0]], exact: false, core: '', score: 10, pos: 0}];
      else if (prevHit) named = [{...prevHit, exact: false, score: 10, pos: 0}];
      // Several were shown: their prices side by side.
      else if (shownLast.length > 1 && PRICE_Q.test(q)) return shownLast.slice(0, 4).map(p => line(ad, p, st)).join('\n\n');
      // "Máte ju aj v kilovom balení?" after a list: the first coffee shown.
      else if (shownLast.length > 1 && PRONOUN.test(q)) named = [{p: shownLast[0], all: [shownLast[0]], exact: false, core: '', score: 10, pos: 0}];
    }
    // "Hodí sa na filter?" about a named coffee is a preparation question.
    if (named.length && /\bhodi\b|vhodn|da sa|\bmozem\b|\bmuzu\b|\bide\b|pouzit/.test(q) && /\b(?:na|do|pre|pro)\s+(?:v60|filter|filtr|french|aeropress|moka|mok[uy]|espresso|automat|dzezv|chemex|kanvick|konvick|pakov)/.test(q)) return usageReply(ad, st, named[0], q);
    const t = T[ad.lang];
    // Intent words inside a product's own name ("… na príslušenstvo") are not the customer's intent.
    const qi = named.filter(m => m.exact).reduce((text, m) => (' ' + text + ' ').split(' ' + words(m.core).join(' ') + ' ').join(' '), ' ' + words(q).join(' ') + ' ').trim();
    // "Máte Lavazza Qualità Rossa?": a proper name the shop does not sell is said plainly, then what the shop has instead.
    if (!named.length && ASK_NAME.test(q) && ad.notSoldSuggest) {
      const body = String(latestRaw).replace(/^\s*(?:a\s+)?\S+\s+/i, '').replace(/[?!.\s]+$/, '').trim();
      const nameWords = body.split(/\s+/).filter(w => /^\p{Lu}/u.test(w));
      const parsed = ad.parse(norm(body), '', norm(body));
      if (nameWords.length && !/^(?:produkt|vyrobok|vyrobek)\b/.test(norm(body)) && !/[_\d]{3,}/.test(body) && !Object.keys(parsed.set).some(k => !['form', 'category'].includes(k)) && !(ad.notBrand && ad.notBrand(norm(body)))) {
        const sug = ad.notSoldSuggest(parsed);
        const list = sug.list.filter(x => x.available !== false && fitsBudget(x, st)).slice(0, 2);
        return t.notSold(capital(body)) + (list.length ? '\n\n' + sug.head + '\n\n' + list.map(x => line(ad, x, st, reasonFor(ad, x, st))).join('\n\n') : '');
      }
    }
    // General knowledge questions without a named product stay with the family's own answers.
    if (!named.length && ad.general && ad.general(q)) return null;

    // "Máte produkt X?" for an unknown name.
    const asked = q.match(/(?:mate|predavate|prodavate|mas)\s+(?:produkt|vyrobok|vyrobek)\s+(.+?)\??$/);
    if (asked) {
      // "Máte produkt XYZ?" needs most of the asked words in one product name, not one shared word.
      const askedWords = words(asked[1]).filter(w => w.length >= 3 && !/^\d+$/.test(w));
      const best = named[0];
      const nameStems = best ? new Set(words(best.p.name).map(stem)) : new Set();
      const hit = askedWords.filter(w => nameStems.has(stem(w))).length;
      if (!best || askedWords.length && hit / askedWords.length <= 0.5) return t.unknownProduct;
    }

    // "Čo je produkt X?", "Ako použiť X?", "Porovnaj X a Y" about a name the shop does not sell.
    if (!named.length && (/\bprodukt\s+\S+.*(?:\?|pre koho|pro koho)/.test(q) && DETAIL.test(q) || /^porovn\w*\s+\S/.test(q) || /\bpouzit\s+\S+.*\?/.test(q))) return t.unknownProduct;
    if (COMPARE.test(qi)) {
      // Two sides of "Porovnaj X a Y" / "rozdiel medzi X a Y" / "X alebo Y": the best product on each side.
      const body = norm(pol.pos || latestRaw).replace(/^.*?(?:porovn\w*|srovn\w*|rozdiel\w*\s+(?:medzi|mezi)?|rozdil\w*\s+(?:mezi)?|lisi\s+sa|lisi\s+se)\s+/, '').replace(/\.\s+(?:aky|aka|ake|ktory|ktora|ktore|co|cim|ako|jaky|jaka|jake|ktery|ktera|chcem|chci|ktor\w*)\b.*$/, '').replace(/[?!].*$/, '').replace(/\.\s*$/, '');
      let best = null;
      const cuts = [...body.matchAll(/\s(?:a|vs\.?|versus|alebo|nebo|oproti|od)\s/g)];
      for (const c of cuts) {
        const left = body.slice(0, c.index), right = body.slice(c.index + c[0].length);
        const l = mentions(index, left)[0], r = mentions(index, right)[0];
        if (!l || !r || l.core === r.core) continue;
        const score = l.score + r.score;
        if (!best || score > best.score) best = {score, l, r};
      }
      if (best) return compareReply(ad, st, best.l, best.r);
      // One side is not in the offer: say which, then describe the side that is.
      if (named.length) {
        const rawBody = String(latestRaw).replace(/^[\s\S]*?(?:porovn\S*|srovn\S*|rozdiel\S*\s+(?:medzi\s+)?|rozdíl\S*\s+(?:mezi\s+)?)\s+/i, '').replace(/\.\s+\S[\s\S]*$/, '').replace(/[?!.]+\s*$/, '');
        const sides = rawBody.split(/\s(?:a|vs\.?|versus|alebo|nebo|oproti)\s/i).map(s => s.trim()).filter(Boolean);
        const missing = sides.find(s => !mentions(index, s).length);
        if (sides.length === 2 && missing) return t.compareMissing(missing) + '\n\n' + detailReply(ad, st, named[0], q, qi);
      }
    }
    if (COMPARE.test(qi) && named.length >= 2) return compareReply(ad, st, named[0].pos <= named[1].pos ? named[0] : named[1], named[0].pos <= named[1].pos ? named[1] : named[0]);
    // "Máte french press?" asks for the brewer itself; a brewer's name alone is a usage question only about a coffee.
    const BREWER = /french ?press|aeropress|chemex|moka|dzezv\w*|\bv60\b/g;
    const ownName = named.length ? norm(named[0].p.name) : '';
    const usageQ = named.length && USAGE.test(named[0].p.main === false ? qi.replace(BREWER, ' ') : qi.replace(BREWER, w => ownName.includes(w.slice(0, 5)) && ASK_NAME.test(q) ? ' ' : w));
    if (usageQ) return usageReply(ad, st, named[0], q);
    if (ACCESSORY.test(qi) && ad.accessories) {
      const main = named[0] || (() => { const shown = shownProducts(ad, messages).filter(p => p.main); return shown.length ? {p: shown[0], all: [shown[0]]} : null; })();
      const wantsAcc = /doplnok|doplnk|doplnek|prislusenstv|k tomu|k nej\b|k nemu\b|co este|co jeste|\bdoz|vakuov|sitk|sítk|infuz|kvetinac|crepnik|obal|podmisk|misk|substrat|hnojiv|pohar|otvarac|vyvrtk|skladovan/.test(qi);
      if (wantsAcc) return accessoryReply(ad, st, main, q);
    }
    const otherAsked = OTHER.test(qi) && !named.length;
    if (otherAsked) {
      const shown = shownProducts(ad, messages).map(p => p.id);
      return recommendReply(ad, st, {skip: shown, other: true});
    }
    // A named product that is not excluded: detail, attribute or price check against the budget.
    if (named.length && !st.excluded.has(named[0].p.id)) {
      const m = named[0];
      const inexact = (() => { const ws = words(pol.pos || latestRaw).filter(w => w.length >= 5 && !(index.df.get(stem(w))) && !/^(?:nieco|neco|nejak|niekto|niekt|rozpoc|limit|chcem|teraz|stale|povod|plati|neplat|prosim|hladam|odpor|konkr|produk|vyber|dostup|moznos|zvys|nizsi|vyssi|porov|rozdi|lisi|ktory|ktora|ktore|preco|kupuj|chcel|chcela|kolko|kolik|stoji|stoja|cena|ceny|cenu|skladom|skladem|baleni|predav|prodav|mletu|mleta|zrnkov|kilov)/.test(w)); return ws; })();
      if (DETAIL.test(qi) || /\?$/.test(q.trim()) || asked) {
        const head = inexact.length && !m.exact && m.score < 5 ? t.notExact(capital(inexact.slice(0, 2).join(' ')), m.p.name) + '\n\n' : '';
        return head + detailReply(ad, st, m, q, qi);
      }
      if (st.budget) {
        const pr = priceOf(m.p, st);
        const limit = money(st.budget.amount, st.budget.currency || ad.currency);
        if (m.p.available === false) return unavailableReply(ad, st, m, null);
        if (fitsBudget(m.p, st)) return t.fits(m.p.name, pr.label, limit) + '\n\n' + line(ad, m.p, st, reasonFor(ad, m.p, st));
        const alt = recommendReply(ad, {...st, answers: {...st.answers, ...(ad.similar ? ad.similar(m.p) : {})}, excluded: new Set([...st.excluded, ...m.all.map(p => p.id)])});
        return t.over(m.p.name, pr.label, limit) + (alt ? '\n\n' + alt : '');
      }
      if (!ASK_REC.test(q) || /chcem|chci|kupujem|kupuji|mam rad|mam rada/.test(q)) return detailReply(ad, st, m, q, qi);
    }
    const hasCondition = Object.keys(st.answers).length || st.budget || st.excluded.size || st.exWords.length || Object.keys(st.not).length;
    if (hasCondition || ASK_REC.test(q)) return recommendReply(ad, st);
    return null;
  }

  scope.CXChatBrain = {reply, norm, words, parseBudget, parseQty, polarity, buildIndex, mentions, money, adapters: {}};
  if (typeof module !== 'undefined' && module.exports) module.exports = scope.CXChatBrain;
})(typeof globalThis !== 'undefined' ? globalThis : window);
