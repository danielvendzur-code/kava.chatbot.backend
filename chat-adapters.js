/* Family adapters for CXChatBrain: they turn one shop catalogue into the brain's product shape and
   bring the family's own rules (coffee preparation, wine colour and sweetness, skin profile, tea type,
   plant light and form). Only facts present in the catalogue are stated. */
(function (scope) {
  'use strict';
  const B = scope.CXChatBrain;
  if (!B) return;
  const norm = B.norm, money = B.money;
  const uniq = list => [...new Set(list)];
  const isCs = url => /\.cz(?:\/|$)|\/cs\//.test(String(url || ''));
  const has = (text, rx) => rx.test(text);
  const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
  const firstSentence = (text, max = 140) => { const s = String(text || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s/)[0] || ''; return s.length > max ? s.slice(0, max).replace(/\s+\S*$/, '') + '…' : s; };
  const L = (lang, sk, cs) => lang === 'cs' ? cs : sk;

  /* ======================= COFFEE ======================= */
  const COUNTRIES = [['brazil', 'Brazílie', 'Brazílie'], ['brasil', 'Brazílie', 'Brazílie'], ['brazil', 'Brazílie', 'Brazílie'], ['colombia', 'Kolumbie', 'Kolumbie'], ['kolumb', 'Kolumbie', 'Kolumbie'], ['ethiop', 'Etiópie', 'Etiopie'], ['etiop', 'Etiópie', 'Etiopie'], ['guatemal', 'Guatemaly', 'Guatemaly'], ['kenya', 'Kene', 'Keni'], ['keni', 'Kene', 'Keni'], ['costa rica', 'Kostariky', 'Kostariky'], ['kostarik', 'Kostariky', 'Kostariky'], ['hondur', 'Hondurasu', 'Hondurasu'], ['peru', 'Peru', 'Peru'], ['mexic', 'Mexika', 'Mexika'], ['mexik', 'Mexika', 'Mexika'], ['nicarag', 'Nikaraguy', 'Nikaraguy'], ['nikarag', 'Nikaraguy', 'Nikaraguy'], ['salvador', 'Salvádoru', 'Salvadoru'], ['tanzan', 'Tanzánie', 'Tanzanie'], ['rwand', 'Rwandy', 'Rwandy'], ['burundi', 'Burundi', 'Burundi'], ['uganda', 'Ugandy', 'Ugandy'], ['india', 'Indie', 'Indie'], ['vietnam', 'Vietnamu', 'Vietnamu'], ['indones', 'Indonézie', 'Indonésie'], ['sumatr', 'Sumatry', 'Sumatry'], ['papua', 'Papuy-Novej Guiney', 'Papuy-Nové Guineje'], ['cuba', 'Kuby', 'Kuby'], ['kuba', 'Kuby', 'Kuby'], ['panam', 'Panamy', 'Panamy'], ['bolivi', 'Bolívie', 'Bolívie'], ['ecuador', 'Ekvádoru', 'Ekvádoru'], ['ekvador', 'Ekvádoru', 'Ekvádoru'], ['yemen', 'Jemenu', 'Jemenu'], ['jamaic', 'Jamajky', 'Jamajky'], ['jamajk', 'Jamajky', 'Jamajky'], ['dominik', 'Dominikánskej republiky', 'Dominikánské republiky'], ['china', 'Číny', 'Číny'], ['laos', 'Laosu', 'Laosu']];
  const PREP_LABEL = {sk: {filter: 'filter', automat: 'automat', moka: 'moka kanvičku', lever: 'espresso'}, cs: {filter: 'filtr', automat: 'automat', moka: 'moka konvičku', lever: 'espresso'}};
  const COFFEE_KNOW = {
    sk: {filter: 'Na V60 alebo iný filter: približne 15 g stredne nahrubo mletej kávy na 250 ml vody s teplotou 92–96 °C, celkový čas 2,5–3,5 minúty.', frenchpress: 'Do french pressu: hrubo mletá káva, približne 30 g na 500 ml vody tesne pod bodom varu, 4 minúty lúhovať a pomaly stlačiť piest.', aeropress: 'Do AeroPressu: 15 g stredne jemne mletej kávy na 220–250 ml vody (85–95 °C), 1,5–2 minúty.', moka: 'Do moka kanvičky: stredne jemné mletie, sitko naplniť bez utláčania, voda po ventil, mierny oheň.', lever: 'Na espresso: jemné mletie, približne 18 g kávy na dvojitú dávku a 36–40 g nápoja za 25–30 sekúnd.', automat: 'Do automatu použite zrnkovú kávu; hrubosť mletia nastavíte na mlynčeku automatu.', storage: 'Kávu skladujte vo vzduchotesnej nádobe v suchu, v tme a pri izbovej teplote, nie v chladničke.'},
    cs: {filter: 'Na V60 nebo jiný filtr: přibližně 15 g středně nahrubo mleté kávy na 250 ml vody o teplotě 92–96 °C, celkový čas 2,5–3,5 minuty.', frenchpress: 'Do french pressu: hrubě mletá káva, přibližně 30 g na 500 ml vody těsně pod bodem varu, 4 minuty louhovat a pomalu stlačit píst.', aeropress: 'Do AeroPressu: 15 g středně jemně mleté kávy na 220–250 ml vody (85–95 °C), 1,5–2 minuty.', moka: 'Do moka konvičky: středně jemné mletí, sítko naplnit bez utlačování, voda po ventil, mírný oheň.', lever: 'Na espresso: jemné mletí, přibližně 18 g kávy na dvojitou dávku a 36–40 g nápoje za 25–30 sekund.', automat: 'Do automatu použijte zrnkovou kávu; hrubost mletí nastavíte na mlýnku automatu.', storage: 'Kávu skladujte ve vzduchotěsné nádobě v suchu, ve tmě a při pokojové teplotě, ne v lednici.'}
  };
  const gramsOf = s => { const m = String(s || '').match(/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/i); return m ? Math.round(Number(m[1].replace(',', '.')) * (/kg/i.test(m[2]) ? 1000 : 1)) : null; };
  const packLabel = g => g >= 1000 && g % 1000 === 0 ? (g / 1000) + ' kg' : g + ' g';
  function coffeeAdapter(c) {
    const lang = isCs(c.source) ? 'cs' : 'sk';
    const seen = new Set();
    const raw = [...(c.products || []), ...(c.offer || [])].filter(p => p && p.url && !seen.has(p.url) && seen.add(p.url));
    const currency = raw.find(p => p.currency)?.currency || 'EUR';
    const tidyPrice = v => typeof v === 'string' ? v.replace(/(\d),(\d)(?!\d)/g, '$1,$20') : v;
    const generic = /viac balen|vice balen|balenie podla|baleni podle|^balenie$/i;
    const products = raw.map(p => {
      const live = (p.variants || []).filter(v => v.available);
      const namePack = gramsOf(p.name);
      const pack = live.length && uniq(live.map(v => v.grams)).length === 1 && live[0].grams ? packLabel(live[0].grams) : (!generic.test(norm(p.priceUnit || '')) && p.priceUnit && !/^balenie/i.test(p.priceUnit) ? p.priceUnit : namePack ? packLabel(namePack) : '');
      const variantGrinds = uniq(live.map(v => v.grind).filter(Boolean));
      // Grind form only from evidence: variants, the shop's own grind options (p.grinds) or the product name.
      const grindKnown = variantGrinds.length ? variantGrinds : (p.grinds || []).length ? p.grinds.slice() : /zrnkov|zrnková|zrnkova|zrno|beans|celé zrn|cele zrn/i.test(p.name) ? ['beans'] : /mlet/i.test(p.name) && !/nemlet/i.test(p.name) ? ['ground'] : [];
      const main = !p.kind || p.kind === 'Káva';
      return {
        id: String(p.id || p.url), name: p.name, url: p.url, price: tidyPrice(p.price), amount: Number.isFinite(p.priceAmount) ? p.priceAmount : null, currency: p.currency || currency,
        pack, available: p.available !== false, main, kind: p.kind || 'Káva', raw: p, grinds: grindKnown,
        variantFor(answers) {
          if (!p.variants?.length || (!answers.grind && !answers.size)) return null;
          const isSample = x => /vzork|vzorek|sample|tester/i.test(x.label || '') || (x.grams && x.grams < 150 && !answers.size);
          const v = p.variants.filter(x => x.available && (!answers.grind || x.grind === answers.grind) && (!answers.size || x.grams === answers.size)).sort((a, b) => isSample(a) - isSample(b) || a.price - b.price)[0];
          return v ? {label: v.label.replace('Zrnková', lang === 'cs' ? 'zrnková' : 'zrnková'), price: v.price} : null;
        }
      };
    });
    const grindData = products.some(p => p.main && p.grinds.length);
    // Acidity scale of the catalogues: 0 minimal, 1 gentle, 2 medium, 3 pronounced. A generic explainer is not a fact.
    const ACID = {sk: ['nízka kyslosť', 'jemná kyslosť', 'stredná kyslosť', 'výrazná kyslosť'], cs: ['nízká kyselost', 'jemná kyselost', 'střední kyselost', 'výrazná kyselost']};
    const acidText = r => {
      const own = r.acidityNote && !/opisuje|nie kvalitu|popisuje/i.test(r.acidityNote) && /kysl|acid/i.test(r.acidityNote) ? lc(r.acidityNote.replace(/\.$/, '')) : '';
      return own && lang === 'sk' ? own : ACID[lang][Math.max(0, Math.min(3, Math.round(r.acidity)))];
    };
    const CS_NOTE = {'orechy': 'ořechy', 'oriešky': 'oříšky', 'kvety': 'květy', 'nízka acidita': 'nízká acidita', 'bohatá pena': 'bohatá pěna', 'hutná pena': 'hutná pěna', 'slivky': 'švestky', 'čierne ríbezle': 'černý rybíz', 'horkosť': 'hořkost', 'vyvážená chuť': 'vyvážená chuť', 'zmes troch arabík': 'směs tří arabik', 'bobuľové ovocie': 'bobulové ovoce', 'sušené ovocie': 'sušené ovoce', 'horká čokoláda': 'hořká čokoláda', 'kávovina': 'kávovina', 'ovocie': 'ovoce', 'plné telo': 'plné tělo', 'bez kyslosti': 'bez kyselosti', 'nízka kyslosť': 'nízká kyselost', 'čerešne': 'třešně', 'korenie': 'koření'};
    // Taste notes without repeats ("vyvážená" twice) and in the shop's language.
    const tasteNotes = r => uniq((r.notes || []).map(n => lang === 'cs' ? CS_NOTE[n] || n : n).map(n => n.trim()).filter(Boolean)).slice(0, 3);
    const describe = (a = {}, not = {}) => {
      const out = [];
      if (a.prep) out.push(L(lang, a.prep === 'automat' ? 'do automatu' : 'na ' + PREP_LABEL.sk[a.prep], a.prep === 'automat' ? 'do automatu' : 'na ' + PREP_LABEL.cs[a.prep]));
      if (a.decaf === 'yes') out.push(L(lang, 'bez kofeínu', 'bez kofeinu'));
      if (a.decaf === 'no') out.push(L(lang, 's kofeínom', 's kofeinem'));
      if (a.milk === 'yes') out.push(L(lang, 'do mlieka', 'do mléka'));
      if (a.taste === 'fruity') out.push(L(lang, 'ovocná chuť', 'ovocná chuť'));
      if (a.taste === 'chocolate') out.push(L(lang, 'čokoládová chuť', 'čokoládová chuť'));
      if (a.lowAcid) out.push(L(lang, 'nízka kyslosť', 'nízká kyselost'));
      if (a.grind === 'beans' && grindData) out.push(L(lang, 'zrnková', 'zrnková'));
      if (a.grind === 'ground' && grindData) out.push(L(lang, 'mletá', 'mletá'));
      if (a.size) out.push(L(lang, 'balenie ', 'balení ') + packLabel(a.size));
      if (a.arabica) out.push(L(lang, 'bez robusty', 'bez robusty'));
      if (not.prep?.length) out.push(L(lang, 'nie ', 'ne ') + not.prep.map(k => PREP_LABEL[lang][k]).join(', '));
      if (not.robusta) out.push(L(lang, 'bez robusty', 'bez robusty'));
      if (not.blend) out.push(L(lang, 'bez zmesí', 'bez směsí'));
      return uniq(out);
    };
    function parse(pos, neg, q) {
      const set = {}, not = {};
      if (/bez\s*kofein|bezkofein|decaf|odkofein/.test(pos) || /kofein/.test(neg)) set.decaf = 'yes';
      else if (/s kofeinom|s kofeinem|kofeinov\w* kav|normaln\w* kav|klasick\w* kav|kavu s kofein/.test(pos)) set.decaf = 'no';
      if (/filtr|filter|v60|chemex|aeropress|french|frenc|prekap|prekvap|kalita|zalievan|zalivan|pour.?over/.test(pos)) set.prep = 'filter';
      else if (/automat|plnoautomat|super.?automat/.test(pos)) set.prep = 'automat';
      else if (/\bmok[ay]\b|kanvick|konvick|kotog|bialetti/.test(pos)) set.prep = 'moka';
      else if (/espresso|pakov|portafilter|paka\b/.test(pos)) set.prep = 'lever';
      if (/espresso|pakov/.test(neg)) not.prep = ['lever'];
      if (/automat/.test(neg)) not.prep = [...(not.prep || []), 'automat'];
      if (/s mliek|do mliek|s mlek|do mlek|cappucc|latte|flat ?white|mliecn/.test(pos)) set.milk = 'yes';
      else if (/bez mliek|bez mlek|cierna kava|cernou kavu|ciernu|cernou/.test(pos)) set.milk = 'no';
      if (/ovocn|fruity|kysl\w* chut|svieza|sviez|kvetin/.test(pos) && !/nekysl|nizk\w* kysl|bez kysl|menej kysl|jemn\w* kysl/.test(pos)) set.taste = 'fruity';
      else if (/cokol|orech|oriesk|karamel|chocol/.test(pos)) set.taste = 'chocolate';
      if (/nekysl|nizk\w* kysl|bez kysl|menej kysl|malo kysl|jemn\w* kysl|nizk\w* acid|nizsi\w* acid|nizka acid|nizkou kysel|nekysel|bez kysel/.test(pos) || /kysl|kysel|acid/.test(neg)) set.lowAcid = true;
      if (/zrnk|cele zrn|celé zrn|nemlet|\bzrna\b|\bzrno\b|beans/.test(pos) || /mlet|pomlet/.test(neg)) set.grind = 'beans';
      else if (/\bmlet|pomlet/.test(pos) || /zrnk|zrna/.test(neg)) set.grind = 'ground';
      const size = pos.match(/(\d+(?:[.,]\d+)?)\s*(kg|g)\b/) || (/\bkilo\b|kilov|kilogram/.test(pos) ? ['', '1', 'kg'] : null);
      if (size) { const g = Math.round(Number(size[1].replace(',', '.')) * (size[2] === 'kg' ? 1000 : 1)); if (g >= 100 && g <= 5000) set.size = g; }
      if (/robust/.test(neg)) not.robusta = true;
      if (/100\s*% arabik|100\s*% arabic|iba arabik|len arabik|jen arabik|cista arabik/.test(pos)) set.arabica = true;
      if (/zmes|smes|blend/.test(neg)) not.blend = true;
      return {set, not};
    }
    const isBlend = p => /blend|zmes|směs|smes|\d+\s*\/\s*\d+/.test(norm(p.name + ' ' + (p.raw.line || '')));
    const hasRobusta = p => /robust/.test(norm(p.name + ' ' + (p.raw.line || '')));
    function rank(a = {}, not = {}, st = {}) {
      let list = products.filter(p => p.main && p.available);
      if (a.decaf === 'yes') list = list.filter(p => p.raw.decaf);
      if (a.decaf === 'no') list = list.filter(p => !p.raw.decaf);
      if (a.prep) list = list.filter(p => (p.raw.prep?.[a.prep] || 0) >= 0.6);
      if (not.prep?.length) list = list.filter(p => { const fits = Object.entries(p.raw.prep || {}).filter(([, v]) => v >= 0.6).map(([k]) => k); return !fits.length || fits.some(k => !not.prep.includes(k)) && !(not.prep.includes('lever') && (p.raw.prep?.lever || 0) >= 0.6 && (p.raw.prep?.filter || 0) < 0.6 && !a.prep); });
      if (a.milk === 'yes') list = list.filter(p => (p.raw.drink?.milk || 0) >= 0.6);
      if (a.taste) list = list.filter(p => (p.raw.taste?.[a.taste] || 0) >= 0.6);
      if (a.lowAcid) list = list.filter(p => Number.isFinite(p.raw.acidity) && p.raw.acidity <= 1);
      if (a.grind && grindData) list = list.filter(p => p.grinds.includes(a.grind));
      if (a.size) list = list.filter(p => p.raw.variants?.length ? p.raw.variants.some(v => v.available && v.grams === a.size) : gramsOf(p.pack) === a.size || gramsOf(p.raw.weights) === a.size && !/,/.test(p.raw.weights || ''));
      if (not.robusta || a.arabica) list = list.filter(p => !hasRobusta(p));
      if (not.blend) list = list.filter(p => !isBlend(p));
      const named = p => { const n = norm(p.name); if (a.prep === 'filter') return /filter|filtr/.test(n) ? 0.5 : /espresso/.test(n) ? -0.6 : 0; if (a.prep === 'lever') return /espresso/.test(n) ? 0.5 : /filter|filtr/.test(n) ? -0.6 : 0; return 0; };
      // Samples and tasting packs are not a main recommendation unless the size was asked for.
      const sample = p => !a.size && (/vzork|vzorek|sample|degust|ochutn|tester|testovac/.test(norm(p.name)) || (gramsOf(p.pack) || 999) < 150);
      const score = p => (a.prep ? p.raw.prep?.[a.prep] || 0 : 0) + named(p) + (a.taste ? p.raw.taste?.[a.taste] || 0 : 0) + (a.milk === 'yes' ? p.raw.drink?.milk || 0 : 0) + ((p.raw.notes || []).length ? 0.2 : 0) - (sample(p) ? 1 : 0);
      const price = p => { const v = p.variantFor(a); return v ? v.price : Number.isFinite(p.amount) ? p.amount : Infinity; };
      const budget = st.budget?.amount;
      return list.sort((x, y) => score(y) - score(x) || (budget ? price(y) - price(x) : price(x) - price(y)) || x.name.localeCompare(y.name));
    }
    function facts(p) {
      const r = p.raw, f = [];
      if (!p.main) return /ďalšia ponuka|další nabídka/i.test(r.kind || '') ? [] : [{k: 'kind', v: lc(r.kind || '')}];
      const text = norm(p.name + ' ' + (r.line || ''));
      if (hasRobusta(p) && /arabi/.test(text)) f.push({k: 'beans', v: L(lang, 'zmes arabiky a robusty', 'směs arabiky a robusty'), hint: L(lang, 'ak chcete plnšiu, hutnejšiu chuť s výraznou crema', 'pokud chcete plnější chuť s výraznou cremou')});
      else if (hasRobusta(p)) f.push({k: 'beans', v: L(lang, 'robusta', 'robusta'), hint: L(lang, 'ak chcete silnú a horkejšiu kávu', 'pokud chcete silnou a hořčí kávu')});
      else if (/arabi/.test(text)) f.push({k: 'beans', v: L(lang, 'arabika', 'arabika'), hint: L(lang, 'ak chcete jemnejšiu chuť bez robusty', 'pokud chcete jemnější chuť bez robusty')});
      const country = COUNTRIES.find(([k]) => norm(p.name).includes(k));
      if (country && !isBlend(p)) f.push({k: 'origin', v: L(lang, 'z ', 'z ') + (lang === 'cs' ? country[2] : country[1])});
      else if (isBlend(p) && !f.some(x => x.k === 'beans' && /zmes|směs/.test(x.v))) f.push({k: 'origin', v: L(lang, 'zmes', 'směs')});
      if (r.decaf) f.push({k: 'decaf', v: L(lang, 'bez kofeínu', 'bez kofeinu'), hint: L(lang, 'ak nechcete kofeín', 'pokud nechcete kofein')});
      if ((r.notes || []).length) f.push({k: 'taste', v: L(lang, 'chuť: ', 'chuť: ') + tasteNotes(r).join(', '), hint: (r.taste?.fruity || 0) >= 0.6 && !(r.taste?.chocolate >= 0.6) ? L(lang, 'ak máte radi ovocnejšiu chuť', 'pokud máte rádi ovocnější chuť') : L(lang, 'ak máte radi čokoládové tóny', 'pokud máte rádi čokoládové tóny')});
      if (Number.isFinite(r.acidity) && !tasteNotes(r).some(n => /kysl|kysel|acid/.test(norm(n)))) f.push({k: 'acidity', v: acidText(r), hint: r.acidity <= 0 ? L(lang, 'ak nechcete kyslú kávu', 'pokud nechcete kyselou kávu') : ''});
      const preps = Object.entries(r.prep || {}).filter(([, v]) => v >= 0.6).sort((a, b) => b[1] - a[1]).map(([k]) => PREP_LABEL[lang][k]);
      if (preps.length) f.push({k: 'prep', v: L(lang, 'podľa e-shopu na ', 'podle e-shopu na ') + preps.join(', '), hint: L(lang, 'na ', 'na ') + preps[0]});
      if (r.variants?.length) {
        const live = r.variants.filter(v => v.available);
        const packs = uniq(live.map(v => v.grams).filter(Boolean)).sort((a, b) => a - b).map(packLabel);
        const g = uniq(live.map(v => v.grind).filter(Boolean));
        if (packs.length || g.length) f.push({k: 'packs', v: (packs.length ? L(lang, 'balenia ', 'balení ') + packs.join(', ') : '') + (g.length === 2 ? L(lang, ', zrnková aj mletá', ', zrnková i mletá') : g[0] === 'beans' ? L(lang, ', zrnková', ', zrnková') : g[0] === 'ground' ? L(lang, ', mletá', ', mletá') : '')});
      }
      return f;
    }
    function attribute(p, q) {
      const r = p.raw;
      if (/kofein|decaf/.test(q)) return r.decaf ? L(lang, `Áno, ${p.name} je podľa e-shopu bezkofeínová.`, `Ano, ${p.name} je podle e-shopu bezkofeinová.`) : L(lang, `${p.name} nie je označená ako bezkofeínová.`, `${p.name} není označená jako bezkofeinová.`);
      if (/zrnk|mlet|zrna/.test(q)) { const g = p.grinds; return g.length === 2 ? L(lang, `${p.name} sa predáva zrnková aj mletá.`, `${p.name} se prodává zrnková i mletá.`) : g[0] === 'beans' ? L(lang, `${p.name} je v ponuke zrnková.`, `${p.name} je v nabídce zrnková.`) : g[0] === 'ground' ? L(lang, `${p.name} je v ponuke mletá.`, `${p.name} je v nabídce mletá.`) : L(lang, `Či je ${p.name} zrnková alebo mletá, e-shop pri produkte neuvádza.`, `Zda je ${p.name} zrnková nebo mletá, e-shop u produktu neuvádí.`); }
      if (/kysl|kysel|acid/.test(q)) return Number.isFinite(r.acidity) ? `${p.name}: ${acidText(r)}.` : L(lang, `Kyslosť e-shop pri produkte ${p.name} neuvádza.`, `Kyselost e-shop u produktu ${p.name} neuvádí.`);
      if (/baleni|balenie|gramaz|gram|velkost|kolko stoj|kolik stoj|cena|cenu/.test(q) && r.variants?.length) {
        const live = r.variants.filter(v => v.available);
        if (live.length) return L(lang, 'Ceny podľa balenia: ', 'Ceny podle balení: ') + live.slice(0, 6).map(v => `${v.label} ${money(v.price, p.currency)}`).join('; ') + '.';
      }
      return null;
    }
    function usage(p, q) {
      const r = p.raw;
      const asked = /v60|filtr|filter|chemex|kalita|pour/.test(q) ? 'filter' : /french/.test(q) ? 'frenchpress' : /aeropress/.test(q) ? 'aeropress' : /\bmok|kanvick|konvick|kotog/.test(q) ? 'moka' : /espresso|pakov/.test(q) ? 'lever' : /automat/.test(q) ? 'automat' : /sklad|uchov/.test(q) ? 'storage' : null;
      const prepKey = asked === 'frenchpress' || asked === 'aeropress' ? 'filter' : asked;
      const out = [];
      let alt = null;
      if (prepKey && prepKey !== 'storage' && r.prep) {
        const fit = r.prep[prepKey] || 0;
        const best = Object.entries(r.prep).filter(([, v]) => v >= 0.6).sort((x, y) => y[1] - x[1]).map(([k]) => PREP_LABEL[lang][k]);
        if (fit >= 0.6) out.push(L(lang, `Áno, ${p.name} sa podľa e-shopu na ${PREP_LABEL.sk[prepKey]} hodí.`, `Ano, ${p.name} se podle e-shopu na ${PREP_LABEL.cs[prepKey]} hodí.`));
        else {
          out.push(L(lang, `Použiť ju môžete, ale ${p.name} je podľa e-shopu určená hlavne ${best.length ? 'na ' + best.join(', ') : 'na iný spôsob prípravy'}; na ${PREP_LABEL.sk[prepKey]} bude chutiť plnšie a menej sviežo, než pražiareň zamýšľa.`, `Použít ji můžete, ale ${p.name} je podle e-shopu určená hlavně ${best.length ? 'na ' + best.join(', ') : 'na jiný způsob přípravy'}; na ${PREP_LABEL.cs[prepKey]} bude chutnat plněji a méně svěže, než pražírna zamýšlí.`));
          alt = rank({prep: prepKey, decaf: r.decaf ? 'yes' : undefined}).filter(x => x.id !== p.id)[0] || null;
        }
      }
      if (asked) out.push(COFFEE_KNOW[lang][asked]);
      if (prepKey && prepKey !== 'storage') {
        const ground = (r.variants || []).find(v => v.available && v.grind === 'ground' && new RegExp(prepKey === 'filter' ? 'filter|filtr|french' : prepKey === 'moka' ? 'moka|kotog' : prepKey === 'lever' ? 'espresso' : '^$').test(norm(v.label)));
        if (ground) out.push(L(lang, `Mletú na tento spôsob predáva e-shop ako ${ground.label} za ${money(ground.price, p.currency)}.`, `Namletou na tento způsob prodává e-shop jako ${ground.label} za ${money(ground.price, p.currency)}.`));
        else if (p.grinds.includes('beans')) out.push(L(lang, 'Zrnkovú kávu si pomeľte tesne pred prípravou.', 'Zrnkovou kávu si namelte těsně před přípravou.'));
      }
      if (alt) out.push(L(lang, `Na ${PREP_LABEL.sk[prepKey]} sa z ponuky viac hodí ${alt.name} (${alt.price}). ${alt.url}`, `Na ${PREP_LABEL.cs[prepKey]} se z nabídky více hodí ${alt.name} (${alt.price}). ${alt.url}`));
      if (!asked) {
        // No preparation named: answer for the preparation the shop recommends for this coffee.
        const top = Object.entries(r.prep || {}).filter(([, v]) => v >= 0.6).sort((x, y) => y[1] - x[1])[0]?.[0];
        if (top) out.push(L(lang, `${p.name} je podľa e-shopu určená hlavne na ${PREP_LABEL.sk[top]}.`, `${p.name} je podle e-shopu určená hlavně na ${PREP_LABEL.cs[top]}.`), COFFEE_KNOW[lang][top === 'filter' ? 'filter' : top]);
      }
      if (!out.length) out.push(L(lang, `Pri produkte ${p.name} e-shop spôsob prípravy neuvádza. Napíšte, ako kávu pripravujete (espresso, filter, moka), a poviem vám pomer a mletie.`, `U produktu ${p.name} e-shop způsob přípravy neuvádí. Napište, jak kávu připravujete (espresso, filtr, moka), a řeknu vám poměr a mletí.`));
      return out.join(' ');
    }
    const ACC = {storage: /doz[auy]?\b|doza|vakuov|airscape|tightvac|fellow atmos|zasobnik|nadob/, grinder: /mlyn/, filters: /papierov\w* filtr|filtre|filtry|filter papier|filtracn/, dripper: /v60|dripper|chemex|kalita|french press|aeropress|moka|kanvick|konvick/, cups: /salk|salek|hrnc|hrnek|pohar/, scale: /vah[ay]|vaha|scale/};
    function accessories(main, q) {
      const offer = products.filter(p => !p.main && p.available);
      let want = /doz|vakuov|sklad|uchov|airscape|tightvac/.test(q) ? ['storage'] : /mlyn/.test(q) ? ['grinder'] : /filtr|filter/.test(q) && /papier|papir/.test(q) ? ['filters'] : /salk|salek|hrnc|hrnek/.test(q) ? ['cups'] : /vah/.test(q) ? ['scale'] : null;
      if (!want) want = main && main.grinds.includes('beans') ? ['storage', 'grinder'] : ['storage'];
      const list = offer.filter(p => want.some(k => ACC[k].test(norm(p.name))));
      const mainGrams = main ? gramsOf(main.pack) || (main.raw.variants?.find(v => v.available)?.grams) || null : null;
      return list.sort((a, b) => { const ga = gramsOf(a.name), gb = gramsOf(b.name); const fa = mainGrams && ga ? Math.abs(ga - Math.max(mainGrams, 250)) : 1e6, fb = mainGrams && gb ? Math.abs(gb - Math.max(mainGrams, 250)) : 1e6; return fa - fb || (a.amount ?? 1e9) - (b.amount ?? 1e9); });
    }
    const accessoryReason = (p) => ACC.storage.test(norm(p.name)) ? L(lang, 'Vákuová alebo vzduchotesná dóza udrží otvorené balenie dlhšie čerstvé.', 'Vakuová nebo vzduchotěsná dóza udrží otevřené balení déle čerstvé.') : ACC.grinder.test(norm(p.name)) ? L(lang, 'Zrnkovú kávu pomeliete čerstvo pred prípravou.', 'Zrnkovou kávu namelete čerstvě před přípravou.') : '';
    const general = q => { const kind = scope.CXCoffeeReplyKind?.(q); return kind?.kind === 'general' || kind?.kind === 'health'; };
    return {family: 'coffee', lang, currency, source: c.source, shipping: c.shipping || null, products, parse, rank, facts, attribute, usage, accessories, accessoryReason, describe, relax: ['taste', 'milk', 'lowAcid', 'prep'], reasonKeys: ['taste', 'acidity', 'decaf', 'origin', 'beans', 'prep', 'packs'], general, preNote: a => a.grind && !grindData ? L(lang, 'Či je káva zrnková alebo mletá, tento e-shop pri produktoch neuvádza, preto to neviem overiť.', 'Zda je káva zrnková nebo mletá, tento e-shop u produktů neuvádí, proto to nemohu ověřit.') : '', similar: p => ({decaf: p.raw.decaf ? 'yes' : undefined})};
  }

  /* ======================= WINE ======================= */
  function wineAdapter(c) {
    const lang = isCs(c.source) ? 'cs' : 'sk';
    const core = scope.CXWineAdvisorCore;
    const currency = c.products.find(p => p.currency)?.currency || 'EUR';
    const products = c.products.map(p => ({id: String(p.id), name: p.name, url: p.url, price: p.price, amount: Number.isFinite(p.priceAmount) ? p.priceAmount : null, currency: p.currency || currency, pack: p.volume || '', available: p.available !== false, main: p.kind === 'Víno', kind: p.kind, cat: p.category, raw: p}));
    const byId = new Map(products.map(p => [p.id, p]));
    const COLOR = {sk: {white: 'biele', red: 'červené', rose: 'ružové', orange: 'oranžové', sparkling: 'šumivé alebo perlivé'}, cs: {white: 'bílé', red: 'červené', rose: 'růžové', orange: 'oranžové', sparkling: 'šumivé nebo perlivé'}};
    const STYLE = {sk: {dry: 'suché', 'medium-dry': 'polosuché', 'medium-sweet': 'polosladké', sweet: 'sladké'}, cs: {dry: 'suché', 'medium-dry': 'polosuché', 'medium-sweet': 'polosladké', sweet: 'sladké'}};
    const CHAR = {sk: {fruity: 'ovocné', bold: 'plné a výrazné', crisp: 'svieže a ľahké'}, cs: {fruity: 'ovocné', bold: 'plné a výrazné', crisp: 'svěží a lehké'}};
    const FOOD = {sk: {fish: 'k rybe, hydine a šalátom', meat: 'k mäsu a grilovaniu', cheese: 'k syrom a dezertom'}, cs: {fish: 'k rybě, drůbeži a salátům', meat: 'k masu a grilování', cheese: 'k sýrům a dezertům'}};
    const colorOf = s => /ruzov|růzov|rose|klaret/.test(s) ? 'rose' : /oranz|orange/.test(s) ? 'orange' : /sumiv|perliv|sekt|prosecco|frizz|pet.?nat|cremant|bublin/.test(s) ? 'sparkling' : /cerven|\bred\b/.test(s) ? 'red' : /biel|\bbil[ae]|\bbile|white/.test(s) ? 'white' : null;
    const stylesOf = s => { const out = []; if (/polosuch/.test(s)) out.push('medium-dry'); if (/polosladk/.test(s)) out.push('medium-sweet'); if (/(?<!polo)such/.test(s)) out.push('dry'); if (/(?<!polo)sladk/.test(s)) out.push('sweet'); return out; };
    function parse(pos, neg) {
      const set = {}, not = {};
      const col = colorOf(pos); if (col) set.color = col;
      const st = stylesOf(pos); if (st.length === 1) set.style = st[0];
      const nc = colorOf(neg); if (nc) not.color = [nc];
      const ns = stylesOf(neg); if (ns.length) not.style = uniq([...ns, ...(ns.includes('sweet') ? ['medium-sweet'] : [])]);
      if (/ovocn/.test(pos)) set.character = 'fruity'; else if (/\bpln|vyrazn|barrique|sudov|drev/.test(pos)) set.character = 'bold'; else if (/sviez|svez|lahk|lehk/.test(pos)) set.character = 'crisp';
      if (/ryb|hydin|drubez|kurac|kure|salat|morsk/.test(pos)) set.food = 'fish'; else if (/\bmas[oau]\b|steak|gril|divin|hovadz|hovez|bravc|veprov|jahnac/.test(pos)) set.food = 'meat'; else if (/syr|sýr|dezert|kolac|kolač|cokolad/.test(pos)) set.food = 'cheese';
      return {set, not};
    }
    function rank(a = {}, not = {}, st = {}) {
      const engine = core ? core.create(c.products) : null;
      let list = engine ? engine.recommend({color: a.color || 'mixed', style: a.style || 'any', character: a.character || 'any', food: a.food}).map(p => byId.get(String(p.id))).filter(Boolean) : products.filter(p => p.main && p.available);
      if (not.color?.length) list = list.filter(p => !not.color.some(cl => (p.raw.tags || []).includes(cl)));
      if (not.style?.length) list = list.filter(p => !not.style.includes(p.raw.wineFacts?.style));
      // "Štyri fľaše" means bottles: no cans, bag-in-box or 0,25 l formats.
      if (st.qty || /flas|flias|lahv|lahev/.test(st.lastQ || '')) list = list.filter(p => !/plechov|\bplech\b|bag.?in.?box|\bbib\b|\b0[,.]2\s*l|\b0[,.]25\s*l|\b0[,.]187|\b(?:187|200|250|330)\s*ml|\b[2-9]\s*l\b|litr|bez alkohol|nealko/.test(norm(p.name + ' ' + (p.pack || ''))));
      const budget = st.budget?.amount;
      if (budget && !st.qty) list = list.slice().sort((x, y) => (y.amount ?? -1) - (x.amount ?? -1));
      return list;
    }
    function facts(p) {
      const r = p.raw, wf = r.wineFacts || {}, f = [];
      if (!p.main) return [{k: 'kind', v: lc(r.reason ? r.reason.replace(/\.$/, '') : r.kind)}];
      const tags = r.tags || [];
      const color = wf.color || ['white', 'red', 'rose', 'orange'].find(t => tags.includes(t));
      if (color) f.push({k: 'color', v: COLOR[lang][color] + (tags.includes('sparkling') && color !== 'sparkling' ? L(lang, ', perlivé alebo šumivé', ', perlivé nebo šumivé') : '')});
      else if (tags.includes('sparkling')) f.push({k: 'color', v: COLOR[lang].sparkling});
      if (wf.style) f.push({k: 'style', v: STYLE[lang][wf.style] + (wf.residualSugar ? ` (${L(lang, 'zvyškový cukor', 'zbytkový cukr')} ${wf.residualSugar})` : ''), hint: wf.style === 'dry' ? L(lang, 'ak chcete suché víno', 'pokud chcete suché víno') : wf.style === 'medium-dry' ? L(lang, 'ak chcete jemne zaokrúhlené, ale nie sladké', 'pokud chcete jemně zakulacené, ale ne sladké') : L(lang, 'ak máte radi sladšie víno', 'pokud máte rádi sladší víno')});
      if (wf.year) f.push({k: 'year', v: L(lang, 'ročník ', 'ročník ') + wf.year});
      const ch = ['crisp', 'fruity', 'bold'].find(t => tags.includes(t));
      if (ch) f.push({k: 'character', v: CHAR[lang][ch], hint: ch === 'bold' ? L(lang, 'ak chcete plnšie víno', 'pokud chcete plnější víno') : ch === 'crisp' ? L(lang, 'ak chcete ľahšie a sviežejšie', 'pokud chcete lehčí a svěžejší') : L(lang, 'ak chcete ovocné víno', 'pokud chcete ovocné víno')});
      const food = ['fish', 'meat', 'cheese'].filter(t => tags.includes(t));
      if (food.length) f.push({k: 'food', v: food.map(t => FOOD[lang][t]).join(L(lang, ' a ', ' a ')), who: L(lang, 'hodí sa ', 'hodí se ') + food.map(t => FOOD[lang][t]).join(' a ')});
      if (p.pack) f.push({k: 'volume', v: p.pack});
      if (r.description) f.push({k: 'description', v: lc(firstSentence(r.description, 120).replace(/\.$/, ''))});
      return f;
    }
    function attribute(p, q) {
      const wf = p.raw.wineFacts || {};
      if (/such|sladk|polosuch|polosladk|cukor|cukr/.test(q)) return wf.style ? L(lang, `${p.name} je podľa e-shopu ${STYLE.sk[wf.style]} víno.`, `${p.name} je podle e-shopu ${STYLE.cs[wf.style]} víno.`) + (wf.residualSugar ? L(lang, ` Zvyškový cukor: ${wf.residualSugar}.`, ` Zbytkový cukr: ${wf.residualSugar}.`) : '') + (wf.style === 'dry' && (p.raw.tags || []).includes('fruity') ? L(lang, ' Ovocné tóny v chuti neznamenajú sladkosť.', ' Ovocné tóny v chuti neznamenají sladkost.') : '') : L(lang, `Sladkosť e-shop pri víne ${p.name} neuvádza.`, `Sladkost e-shop u vína ${p.name} neuvádí.`);
      if (/farb|barv|biel|cerven|ruzov/.test(q)) { const col = wf.color; return col ? L(lang, `${p.name} je ${COLOR.sk[col]} víno.`, `${p.name} je ${COLOR.cs[col]} víno.`) : null; }
      if (/rocnik|rok\b/.test(q)) return wf.year ? L(lang, `${p.name}: ročník ${wf.year}.`, `${p.name}: ročník ${wf.year}.`) : L(lang, 'Ročník e-shop pri tomto víne neuvádza.', 'Ročník e-shop u tohoto vína neuvádí.');
      return null;
    }
    function usage(p) {
      const wf = p.raw.wineFacts || {}, tags = p.raw.tags || [];
      const color = wf.color || tags.find(t => ['white', 'red', 'rose', 'orange'].includes(t));
      const temp = tags.includes('sparkling') ? '6–8 °C' : color === 'red' ? '15–18 °C' : color === 'orange' ? '12–14 °C' : '8–12 °C';
      return L(lang, `${p.name} podávajte približne pri ${temp}. Fľaša 0,75 l je zhruba 5 pohárov po 150 ml. Otvorené víno uzavrite a uložte do chladničky.`, `${p.name} podávejte přibližně při ${temp}. Láhev 0,75 l je zhruba 5 sklenic po 150 ml. Otevřené víno uzavřete a uložte do lednice.`);
    }
    function accessories(main, q) {
      const offer = products.filter(p => !p.main && p.available && p.raw.category !== 'sets');
      const rx = /pohar|sklenic|otvarac|otvirak|vyvrtk|krabic|krabick|taska|tasky|obal|chladic|zatk|uzaver|stojan|karaf|dekant/;
      return offer.filter(p => rx.test(norm(p.name))).sort((a, b) => (a.amount ?? 1e9) - (b.amount ?? 1e9));
    }
    const describe = (a = {}, not = {}) => {
      const out = [];
      if (a.color) out.push(COLOR[lang][a.color]);
      if (a.style) out.push(STYLE[lang][a.style]);
      if (a.character) out.push(CHAR[lang][a.character]);
      if (a.food) out.push(FOOD[lang][a.food]);
      if (not.style?.length) out.push(L(lang, 'nie ', 'ne ') + uniq(not.style.map(s => STYLE[lang][s])).join(L(lang, ' ani ', ' ani ')));
      if (not.color?.length) out.push(L(lang, 'nie ', 'ne ') + not.color.map(s => COLOR[lang][s]).join(', '));
      return out;
    };
    return {family: 'wine', lang, currency, source: c.source, shipping: c.shipping || null, products, parse, rank, facts, attribute, usage, accessories, describe, relax: ['food', 'character', 'style'], reasonKeys: ['style', 'color', 'character', 'food', 'year', 'description'], similar: p => ({color: p.raw.wineFacts?.color || undefined})};
  }

  /* ======================= COSMETICS AND HAIR ======================= */
  const AREA = {sk: {face: 'pleť', body: 'telo', hair: 'vlasy', eyes: 'okolie očí', lips: 'pery', baby: 'deti a mamičky', makeup: 'líčenie', beard: 'brada', sets: 'sady a darčeky', home: 'domácnosť', tea: 'čaje', wellness: 'doplnky výživy', other: 'ďalšia ponuka'}, cs: {face: 'pleť', body: 'tělo', hair: 'vlasy', eyes: 'oční okolí', lips: 'rty', baby: 'děti a maminky', makeup: 'líčení', beard: 'vousy', sets: 'sady a dárky', home: 'domácnost', tea: 'čaje', wellness: 'doplňky stravy', other: 'další nabídka'}};
  const PROFILE = {sk: {dry: 'suchú', oily: 'mastnú', sensitive: 'citlivú', balanced: 'normálnu'}, cs: {dry: 'suchou', oily: 'mastnou', sensitive: 'citlivou', balanced: 'normální'}};
  const FORMS = [['krem', /krem|balzam|cream|mast\b|maslo|butter/], ['serum', /serum|sera\b|ampul|esenc/], ['olej', /olej|oil/], ['maska', /mask/], ['sampon', /sampon|sampuk|shampoo/], ['kondicioner', /kondicion|conditioner|balzam na vlasy/], ['tonikum', /tonik|hydrolat|kvetinov\w* vod|pletov\w* vod|toner/], ['mydlo', /mydl|soap/], ['peeling', /peeling|piling|scrub/], ['deodorant', /deodor|dezodor/], ['cistenie', /cistic|cistiac|odlicov|umyvac|myci|pena|foam|cleans|wash|gel na umyv|sprchov|sprch\w* gel/]];
  const FORM_LABEL = {krem: 'krém', serum: 'sérum', olej: 'olej', maska: 'maska', sampon: 'šampón', kondicioner: 'kondicionér', tonikum: 'tonikum alebo hydrolát', mydlo: 'mydlo', peeling: 'peeling', deodorant: 'dezodorant', cistenie: 'čistenie a odličovanie'};
  const FRAGRANCE_FREE = /bez parfem|bez parfum|bez vone|bez vune|bez vůně|bez vône|bez esencial|bez eteric|bez vonn|parfum.?free|perfume.?free|fragrance.?free|unscented|neparfum|bez arómy|bez aromy|bez aroma/;
  function cosmeticsAdapter(catalogue, opts = {}) {
    const family = opts.family || 'cosmetics';
    const lang = isCs(catalogue.source) ? 'cs' : 'sk';
    const core = scope.CXAdvisorCore;
    const engine = core.create(catalogue.products);
    const currency = engine.products.find(p => p.currency)?.currency || 'EUR';
    const notMainKind = /^vzorky|darcekove poukazy|^doplnky$|dalsia ponuka|potraviny|doplnky vyzivy|^sviecky$|laky na nechty/;
    const products = engine.products.map(p => ({
      id: String(p.id), name: p.name, url: p.url, price: p.price, amount: Number.isFinite(p.priceAmount) ? p.priceAmount : null, currency: p.currency || currency,
      pack: p.volume && !/balenie podla|baleni podle/.test(norm(p.volume)) ? p.volume : '', available: p.available !== false,
      main: !['other', 'home', 'wellness', 'tea'].includes(p.category) && !notMainKind.test(norm(p.kind)) && !p.isSample, kind: p.kind, cat: p.category, raw: p,
      text: norm([p.name, p.kind, p.description || ''].join(' '))
    }));
    const byId = new Map(products.map(p => [p.id, p]));
    function parse(pos, neg) {
      const set = {}, not = {};
      const cat = s => /licen|pudr|rten|ruz\b|make.?up|riasenk|maskar/.test(s) ? 'makeup' : /brad|vous|fuz/.test(s) ? 'beard' : /\bdetsk|\bdeti\b|\bdieta|babat|\bbaby|miminko|novorozen/.test(s) ? 'baby' : /\bocn[yei]\b|okolie oci|okoli oci|ocne okolie/.test(s) ? 'eyes' : /\bpery\b|\brty\b|na pery|na rty|balzam na per/.test(s) ? 'lips' : /svieck|svick|difuz|vone do dom/.test(s) ? 'home' : /vlas|samp|kondicion|pokozk\w* hlavy/.test(s) ? 'hair' : /telov|\btelo\b|\btela\b|na telo|body\b|sprch|kupel|koupel|nohy|chodidl|ruky|\bruce\b|deodor|dezodor/.test(s) ? 'body' : /sada|sady|darcek|darek|darkov|balicek|vianoc/.test(s) ? 'sets' : /plet|tvar|\bface\b|vrask|akne|pory|odlic/.test(s) ? 'face' : null;
      const c1 = cat(pos); if (c1) set.category = c1;
      const c2 = cat(neg); if (c2) not.category = [c2];
      if (/\btelo\b|\btela\b|telov/.test(neg) && !not.category?.includes('body')) not.category = [...(not.category || []), 'body'];
      if (/such|pnut|napjat|dehydr/.test(pos)) set.profile = 'dry'; else if (/mastn|mastic|maz\b|akne|nedokonal|lesk/.test(pos)) set.profile = 'oily'; else if (/citliv|reakt|podraz|zcervena/.test(pos)) set.profile = 'sensitive';
      if (/vrask|zrel|zral|anti.?ag|pevnost|spevn/.test(pos)) set.goal = 'mature'; else if (/hydrat/.test(pos)) set.goal = 'hydrate'; else if (/odlic|cisten|cistit|umyt|umyv/.test(pos) && !/cistiac|cistic/.test(pos)) set.goal = 'clean'; else if (/upokoj|zklid/.test(pos)) set.goal = 'calm';
      const form = FORMS.find(([, rx]) => rx.test(pos)); if (form) set.form = form[0];
      const nform = FORMS.filter(([, rx]) => rx.test(neg)).map(([k]) => k); if (nform.length) not.form = nform;
      if (FRAGRANCE_FREE.test(pos) || /parfum|vone|vune|eteric|esencial/.test(neg) || /alergi\w* na (?:parfum|vone|vune)/.test(pos)) set.fragranceFree = true;
      if (/tmav|cierne vlasy|cerne vlasy|hned|brunet|gastan|kastan/.test(pos)) set.hairColour = 'dark'; else if (/svetl|blond|plav|siv[eé] vlas|sediv/.test(pos)) set.hairColour = 'light';
      if (/plne balenie|velke balenie|velke plne|velk\w* baleni|plne baleni/.test(pos) || /vzork|vzorek|sample|tester/.test(neg)) set.noSample = true;
      if (/vypad|rednut|ridnut|podpor\w* rast|podpor\w* rust/.test(pos)) set.hairNeed = 'growth'; else if (/lupin|lupy|lupu/.test(pos)) set.hairNeed = 'dandruff';
      return {set, not};
    }
    function rank(a = {}, not = {}, st = {}) {
      let list = engine.recommend({category: a.category, profile: a.profile, goal: a.goal}).matches.map(p => byId.get(String(p.id))).filter(Boolean);
      const allowNonMain = ['other', 'home', 'wellness', 'tea'].includes(a.category);
      list = list.filter(p => p.main || allowNonMain);
      if (a.form) { const rx = FORMS.find(([k]) => k === a.form)[1]; list = list.filter(p => rx.test(norm(p.kind + ' ' + p.name))); }
      if (not.form?.length) list = list.filter(p => !not.form.some(k => FORMS.find(([kk]) => kk === k)[1].test(norm(p.kind + ' ' + p.name))));
      if (not.category?.length) list = list.filter(p => !not.category.includes(p.cat) && !(not.category.includes('body') && /telov|\btelo\b|body|sprch|ruky|ruce|nohy/.test(norm(p.name))));
      if (a.fragranceFree) list = list.filter(p => FRAGRANCE_FREE.test(p.text) || p.raw.source?.fragranceFree === true);
      if (a.hairColour) { const opposite = a.hairColour === 'dark' ? /svetl|blond|plav|sediv|\bsiv/ : /tmav|cern|ciern|hned|brunet/; const same = a.hairColour === 'dark' ? /tmav|cern|ciern|hned|brunet/ : /svetl|blond|plav/; list = list.filter(p => !opposite.test(norm(p.name))).sort((x, y) => (same.test(norm(y.name)) ? 1 : 0) - (same.test(norm(x.name)) ? 1 : 0)); }
      if (a.noSample) list = list.filter(p => !p.raw.isSample && !/vzork|vzorek|sample|tester|cestovn|mini\b/.test(norm(p.name + ' ' + p.kind)));
      if (a.hairNeed === 'growth') list = list.filter(p => /vypad|rast|rust|growth|posiln|rednut|ridnut/.test(p.text) || (p.raw.features?.hairNeed === 'growth'));
      if (a.hairNeed === 'dandruff') list = list.filter(p => /lupin|lupy|dandruff/.test(p.text));
      const budget = st.budget?.amount;
      if (budget) list = list.slice().sort((x, y) => (y.amount ?? -1) - (x.amount ?? -1));
      return list;
    }
    const SIGNAL = {sk: {hydrate: 'hydratácia', calm: 'upokojenie', balance: 'pre pleť so sklonom k mastnote', mature: 'proti vráskam', clean: 'čistenie'}, cs: {hydrate: 'hydratace', calm: 'zklidnění', balance: 'pro pleť se sklonem k mastnotě', mature: 'proti vráskám', clean: 'čištění'}};
    function facts(p) {
      const r = p.raw, f = [];
      f.push({k: 'kind', v: lc(r.kind)});
      if (r.category && AREA[lang][r.category] && !['other'].includes(r.category)) f.push({k: 'area', v: L(lang, 'oblasť: ', 'oblast: ') + AREA[lang][r.category]});
      if (p.pack) f.push({k: 'volume', v: p.pack});
      const ev = Object.keys(r.source?.suitabilityEvidence || {});
      const profiles = ['dry', 'oily', 'sensitive'].filter(t => (r.tags || []).includes(t) && (ev.includes(t) || !r.source?.suitabilityEvidence));
      const hair = r.category === 'hair';
      if (profiles.length) f.push({k: 'profile', v: L(lang, 'podľa popisu pre ', 'podle popisu pro ') + profiles.map(t => hair ? {dry: 'suché', oily: 'mastné', sensitive: 'citlivú pokožku'}[t] : PROFILE[lang][t]).join(L(lang, ' a ', ' a ')) + (hair ? L(lang, ' vlasy', ' vlasy') : L(lang, ' pleť', ' pleť')), hint: L(lang, 'ak máte ', 'pokud máte ') + profiles.map(t => hair ? {dry: 'suché vlasy', oily: 'mastné vlasy', sensitive: 'citlivú pokožku hlavy'}[t] : PROFILE[lang][t] + L(lang, ' pleť', ' pleť'))[0], who: L(lang, 'výrobca ho uvádza pre ', 'výrobce ho uvádí pro ') + profiles.map(t => hair ? {dry: 'suché vlasy', oily: 'mastné vlasy', sensitive: 'citlivú pokožku hlavy'}[t] : PROFILE[lang][t] + L(lang, ' pleť', ' pleť')).join(L(lang, ' a ', ' a '))});
      else if (r.source?.allSkinTypes) f.push({k: 'profile', v: L(lang, 'výrobca uvádza pre všetky typy pleti', 'výrobce uvádí pro všechny typy pleti'), who: L(lang, 'výrobca ho uvádza pre všetky typy pleti', 'výrobce ho uvádí pro všechny typy pleti')});
      const goals = (r.tags || []).filter(t => ['hydrate', 'calm', 'mature', 'balance'].includes(t));
      if (goals.length) f.push({k: 'goal', v: goals.slice(0, 2).map(t => SIGNAL[lang][t]).join(', '), hint: L(lang, 'ak vám ide o ', 'pokud vám jde o ') + SIGNAL[lang][goals[0]]});
      const ft = r.features || {};
      if (ft.time === 'spf') f.push({k: 'time', v: L(lang, 's ochranným faktorom SPF', 's ochranným faktorem SPF')});
      else if (ft.time === 'night') f.push({k: 'time', v: L(lang, 'na noc', 'na noc')});
      else if (ft.time === 'day') f.push({k: 'time', v: L(lang, 'na deň', 'na den')});
      if (FRAGRANCE_FREE.test(p.text)) f.push({k: 'fragrance', v: L(lang, 'bez parfumácie podľa názvu alebo popisu', 'bez parfemace podle názvu nebo popisu')});
      return f;
    }
    function attribute(p, q) {
      if (/parfum|parfem|vona|vone|vune|vůně|eteric|esencial|alergi/.test(q)) return FRAGRANCE_FREE.test(p.text) ? L(lang, `${p.name} je pri produkte označený ako bez parfumácie. Úplné zloženie overte pri produkte.`, `${p.name} je u produktu označený jako bez parfemace. Úplné složení ověřte u produktu.`) : L(lang, `Či ${p.name} obsahuje parfumáciu alebo éterické oleje, v ukážke overené nemám; nebudem tvrdiť, že je bez vône. Úplné zloženie je pri produkte.`, `Zda ${p.name} obsahuje parfemaci nebo éterické oleje, v ukázce ověřené nemám; nebudu tvrdit, že je bez vůně. Úplné složení je u produktu.`);
      if (/zlozen|slozen|ingredien|obsahuj/.test(q)) return L(lang, `Úplné zloženie produktu ${p.name} uvádza výrobca pri produkte.`, `Úplné složení produktu ${p.name} uvádí výrobce u produktu.`);
      if (/svetl|tmav|blond/.test(q) && p.raw.category === 'hair') { const n = norm(p.name); const kind = /svetl|blond/.test(n) ? 'light' : /tmav|cern|ciern|hned/.test(n) ? 'dark' : null; const asked = /tmav|cern|ciern|hned/.test(q) ? 'dark' : 'light'; if (kind && kind !== asked) return L(lang, `${p.name} je podľa názvu určený na ${kind === 'light' ? 'svetlé' : 'tmavé'} vlasy, nie na ${asked === 'dark' ? 'tmavé' : 'svetlé'}.`, `${p.name} je podle názvu určený na ${kind === 'light' ? 'světlé' : 'tmavé'} vlasy, ne na ${asked === 'dark' ? 'tmavé' : 'světlé'}.`); }
      return null;
    }
    const KIND_USE = {
      sk: {serum: 'Sérum sa zvyčajne nanáša v malom množstve (pár kvapiek) na vyčistenú pleť pred krémom.', krem: 'Krém sa zvyčajne nanáša v tenkej vrstve na vyčistenú pokožku; denný ráno, nočný večer podľa označenia.', olej: 'Olej sa zvyčajne používa v malom množstve (pár kvapiek), najlepšie na mierne vlhkú pokožku.', maska: 'Masku nanášajte podľa návodu na vyčistenú pleť a po určenom čase ju zmyte alebo nechajte vstrebať, podľa typu masky.', sampon: 'Šampón naneste na mokré vlasy, napeňte, umyte pokožku hlavy a dôkladne opláchnite.', kondicioner: 'Kondicionér sa zvyčajne nanáša po umytí na dĺžky vlasov a po chvíli opláchne, ak nie je bezoplachový.', tonikum: 'Tonikum alebo hydrolát naneste po umytí na pleť (sprejom alebo vatovým tampónom) pred sérom a krémom.', mydlo: 'Mydlo napeňte vo vlhkých rukách a dôkladne opláchnite.', peeling: 'Peeling sa zvyčajne používa jemne a nie denne; presnú frekvenciu uvádza výrobca.', cistenie: 'Čistiaci prípravok naneste na vlhkú alebo suchú pleť podľa typu, jemne premasírujte a opláchnite.', deodorant: 'Dezodorant naneste na čistú a suchú pokožku.'},
      cs: {serum: 'Sérum se obvykle nanáší v malém množství (pár kapek) na vyčištěnou pleť před krémem.', krem: 'Krém se obvykle nanáší v tenké vrstvě na vyčištěnou pokožku; denní ráno, noční večer podle označení.', olej: 'Olej se obvykle používá v malém množství (pár kapek), nejlépe na mírně vlhkou pokožku.', maska: 'Masku naneste podle návodu na vyčištěnou pleť a po určené době ji smyjte nebo nechte vstřebat, podle typu masky.', sampon: 'Šampon naneste na mokré vlasy, napěňte, umyjte pokožku hlavy a důkladně opláchněte.', kondicioner: 'Kondicionér se obvykle nanáší po umytí na délky vlasů a po chvíli opláchne, pokud není bezoplachový.', tonikum: 'Tonikum nebo hydrolát naneste po umytí na pleť (sprejem nebo tamponem) před sérem a krémem.', mydlo: 'Mýdlo napěňte ve vlhkých rukou a důkladně opláchněte.', peeling: 'Peeling se obvykle používá jemně a ne denně; přesnou frekvenci uvádí výrobce.', cistenie: 'Čisticí přípravek naneste na vlhkou nebo suchou pleť podle typu, jemně promasírujte a opláchněte.', deodorant: 'Deodorant naneste na čistou a suchou pokožku.'}
    };
    function usage(p) {
      const n = norm(p.kind + ' ' + p.name);
      if (/poukaz|voucher/.test(n)) return L(lang, 'Darčekový poukaz sa uplatní pri objednávke v e-shope podľa podmienok obchodu.', 'Dárkový poukaz se uplatní při objednávce v e-shopu podle podmínek obchodu.');
      if (/\bsada\b|\bset\b|darcekov\w* sad|balicek|kolekc/.test(n)) return L(lang, 'Sada obsahuje viac produktov; postup a množstvo pre každý z nich uvádza výrobca pri produkte.', 'Sada obsahuje více produktů; postup a množství pro každý z nich uvádí výrobce u produktu.');
      if (/sprch|shower|sprchov/.test(n)) return L(lang, 'Sprchový gél napeňte na vlhkej pokožke a opláchnite.', 'Sprchový gel napěňte na vlhké pokožce a opláchněte.');
      if (/arom|difuz|vona do|vune do|eteric|esencial/.test(n)) return L(lang, 'Vonný alebo éterický olej sa používa v malom množstve (pár kvapiek) do aromalampy alebo difuzéra; na pokožku iba zriedený, ak to výrobca uvádza.', 'Vonný nebo éterický olej se používá v malém množství (pár kapek) do aromalampy nebo difuzéru; na pokožku jen zředěný, pokud to výrobce uvádí.');
      if (/parfem|parfum|toaletn|eau de/.test(n)) return L(lang, 'Parfum nastriekajte na pokožku (zápästie, krk) z menšej vzdialenosti.', 'Parfém nastříkejte na pokožku (zápěstí, krk) z menší vzdálenosti.');
      if (/svick|sviec|svíč/.test(n)) return L(lang, 'Sviečku nechajte pri prvom zapálení horieť, kým sa roztopí celý povrch; knôt skracujte.', 'Svíčku nechte při prvním zapálení hořet, dokud se neroztaví celý povrch; knot zkracujte.');
      const form = FORMS.find(([, rx]) => rx.test(n))?.[0];
      return form ? KIND_USE[lang][form] : null;
    }
    const NEXT = {krem: ['cistenie', 'tonikum', 'serum'], serum: ['krem', 'cistenie'], olej: ['cistenie', 'krem'], maska: ['cistenie', 'krem'], cistenie: ['tonikum', 'krem', 'serum'], tonikum: ['serum', 'krem'], sampon: ['kondicioner', 'maska'], kondicioner: ['sampon'], mydlo: ['krem'], peeling: ['krem'], deodorant: []};
    function accessories(main, q, st) {
      const wanted = FORMS.filter(([, rx]) => rx.test(q.replace(/doplnok|doplnk/g, ''))).map(([k]) => k).filter(k => !main || !FORMS.find(([kk]) => kk === k)[1].test(norm(main.kind + ' ' + main.name)));
      const mainForm = main ? FORMS.find(([, rx]) => rx.test(norm(main.kind + ' ' + main.name)))?.[0] : null;
      const forms = wanted.length ? wanted : (NEXT[mainForm] || []);
      let list = products.filter(p => p.main && p.available && p.id !== main?.id && p.cat !== 'sets' && (!main || p.cat === main.cat) && forms.some(k => FORMS.find(([kk]) => kk === k)[1].test(norm(p.kind + ' ' + p.name))));
      if (/vecer|večer|nocn|na noc/.test(q)) list = list.filter(p => !/\bdenn|day\b|spf/.test(norm(p.name)));
      if (main) { const sig = new Set((main.raw.tags || []).filter(t => ['dry', 'oily', 'sensitive'].includes(t))); list.sort((a, b) => (b.raw.tags || []).filter(t => sig.has(t)).length - (a.raw.tags || []).filter(t => sig.has(t)).length || forms.indexOf(FORMS.find(([, rx]) => rx.test(norm(a.kind + ' ' + a.name)))?.[0]) - forms.indexOf(FORMS.find(([, rx]) => rx.test(norm(b.kind + ' ' + b.name)))?.[0]) || (a.amount ?? 1e9) - (b.amount ?? 1e9)); }
      // A complement should not cost several times the main product unless the customer asks for a set.
      if (main && Number.isFinite(main.amount) && !st?.budget) list = list.filter(p => !Number.isFinite(p.amount) || p.amount <= main.amount * 2.5);
      return list;
    }
    const accessoryReason = (p, main) => { const form = FORMS.find(([, rx]) => rx.test(norm(p.kind + ' ' + p.name)))?.[0]; return form === 'cistenie' ? L(lang, 'Čistiaci krok pred ďalšou starostlivosťou.', 'Čisticí krok před další péčí.') : form === 'tonikum' ? L(lang, 'Krok po umytí, pred sérom alebo krémom.', 'Krok po umytí, před sérem nebo krémem.') : form === 'krem' ? L(lang, 'Krém na záver rutiny.', 'Krém na závěr rutiny.') : form === 'serum' ? L(lang, 'Sérum pred krémom.', 'Sérum před krémem.') : form === 'kondicioner' ? L(lang, 'Po šampóne na dĺžky vlasov.', 'Po šamponu na délky vlasů.') : ''; };
    const describe = (a = {}, not = {}) => {
      const out = [];
      if (a.category) out.push(AREA[lang][a.category]);
      if (a.profile) out.push(L(lang, 'pre ', 'pro ') + PROFILE[lang][a.profile] + (a.category === 'hair' ? '' : L(lang, ' pleť', ' pleť')));
      if (a.goal) out.push({mature: L(lang, 'proti vráskam', 'proti vráskám'), hydrate: L(lang, 'hydratácia', 'hydratace'), clean: L(lang, 'čistenie', 'čištění'), calm: L(lang, 'upokojenie', 'zklidnění')}[a.goal]);
      if (a.form) out.push(FORM_LABEL[a.form]);
      if (a.fragranceFree) out.push(L(lang, 'bez parfumácie (overené pri produkte)', 'bez parfemace (ověřené u produktu)'));
      if (a.hairColour) out.push(a.hairColour === 'dark' ? L(lang, 'na tmavé vlasy', 'na tmavé vlasy') : L(lang, 'na svetlé vlasy', 'na světlé vlasy'));
      if (a.noSample) out.push(L(lang, 'plné balenie', 'plné balení'));
      if (not.category?.length) out.push(L(lang, 'nie ', 'ne ') + not.category.map(k => AREA[lang][k]).join(', '));
      if (not.form?.length) out.push(L(lang, 'nie ', 'ne ') + not.form.map(k => FORM_LABEL[k]).join(', '));
      return out;
    };
    const noMatchNote = a => a.fragranceFree ? L(lang, 'Produkt s overeným zložením bez parfumácie a éterických olejov v ukážke nemám, preto vám ho neodporučím. Úplné zloženie je uvedené pri každom produkte v e-shope.', 'Produkt s ověřeným složením bez parfemace a éterických olejů v ukázce nemám, proto vám ho nedoporučím. Úplné složení je uvedeno u každého produktu v e-shopu.') : '';
    return {family, lang, currency, source: catalogue.source, shipping: catalogue.shipping || null, products, parse, rank, facts, attribute, usage, accessories, accessoryReason, describe, noMatchNote, relax: ['goal', 'profile', 'form'], reasonKeys: ['profile', 'goal', 'fragrance', 'time', 'kind', 'volume'], similar: p => ({category: p.cat})};
  }

  /* ======================= TEA ======================= */
  function teaAdapter(catalogue) {
    const lang = isCs(catalogue.source || catalogue.products?.[0]?.url) ? 'cs' : 'sk';
    const core = scope.CXTeaCore;
    const engine = core.create(catalogue.products);
    const currency = engine.products.find(p => p.currency)?.currency || 'EUR';
    const products = engine.products.map(p => ({id: String(p.id), name: p.name, url: p.url, price: p.price, amount: p.priceAmount, currency: p.currency || currency, pack: p.volume || '', available: p.available !== false, main: ['tea', 'sets'].includes(p.category), kind: p.kind, cat: p.category, raw: p}));
    const byId = new Map(products.map(p => [p.id, p]));
    const TYPE = {sk: {fruit: 'ovocný', herbal: 'bylinný', rooibos: 'rooibos', white: 'biely', green: 'zelený', black: 'čierny', set: 'darčeková sada'}, cs: {fruit: 'ovocný', herbal: 'bylinný', rooibos: 'rooibos', white: 'bílý', green: 'zelený', black: 'černý', set: 'dárková sada'}};
    const typeOf = s => /bylin|herbal/.test(s) ? 'herbal' : /ovoc/.test(s) ? 'fruit' : /rooibos|rojbos/.test(s) ? 'rooibos' : /\bbiel|\bbil[yeý]|white/.test(s) ? 'white' : /zelen|green/.test(s) ? 'green' : /cier|cern|pu-?erh|black/.test(s) ? 'black' : null;
    function parse(pos, neg) {
      const set = {}, not = {};
      if (/sad[auy]|balicek|kolekc|kazet|darcek|darek|darkov/.test(pos) || /jednotliv|lacny caj|obycajn/.test(neg)) set.category = 'sets';
      if (/bez\s*kofein|bezkofein|vecer|na noc/.test(pos) || /kofein/.test(neg)) set.caffeine = 'no'; else if (/s kofeinom|s kofeinem|povzbud|nakopn|na rano/.test(pos)) set.caffeine = 'yes';
      const t = typeOf(pos); if (t && set.category !== 'sets') set.type = t;
      const nt = []; for (const part of neg.split(/,|\bani\b|\ba\b|\bnebo\b|\balebo\b/)) { const x = typeOf(part); if (x) nt.push(x); }
      if (nt.length) not.type = uniq(nt);
      return {set, not};
    }
    function rank(a = {}, not = {}, st = {}) {
      let list = engine.recommend({category: a.category || undefined, caffeine: a.caffeine, type: a.type}).matches.map(p => byId.get(String(p.id))).filter(Boolean);
      if (not.type?.length) list = list.filter(p => !not.type.includes(p.raw.type));
      if (a.caffeine === 'no') list = list.filter(p => p.raw.caffeine === false || p.raw.type === 'set' && !/cier|cern|zelen|biel|bil/.test(norm(p.name)));
      // Gift sets: real gift packs first, then the fuller ones; a sampler is not a gift set.
      if (a.category === 'sets') list = list.slice().sort((x, y) => (/darkov|darcek|kazet|kolekc/.test(norm(y.name)) ? 1 : 0) - (/darkov|darcek|kazet|kolekc/.test(norm(x.name)) ? 1 : 0) || (y.amount ?? 0) - (x.amount ?? 0));
      const budget = st.budget?.amount;
      if (budget) list = list.slice().sort((x, y) => (y.amount ?? -1) - (x.amount ?? -1));
      return list;
    }
    function facts(p) {
      const r = p.raw, f = [];
      f.push({k: 'type', v: TYPE[lang][r.type] ? TYPE[lang][r.type] + (r.type === 'set' ? '' : L(lang, ' čaj', ' čaj')) : lc(r.kind)});
      if (r.caffeine === false) f.push({k: 'caffeine', v: L(lang, 'bez kofeínu', 'bez kofeinu'), hint: L(lang, 'ak chcete čaj aj na večer', 'pokud chcete čaj i na večer')});
      else if (r.caffeine === true) f.push({k: 'caffeine', v: L(lang, 's kofeínom', 's kofeinem'), hint: L(lang, 'ak chcete čaj na povzbudenie', 'pokud chcete čaj na povzbuzení')});
      if (r.form === 'bags') f.push({k: 'form', v: L(lang, `porciovaný, ${r.bagCount} vrecúšok`, `porcovaný, ${r.bagCount} sáčků`), hint: L(lang, 'ak chcete pohodlné vrecúška', 'pokud chcete pohodlné sáčky')});
      else if (r.form === 'loose') f.push({k: 'form', v: L(lang, `sypaný, ${r.looseWeight}`, `sypaný, ${r.looseWeight}`), hint: L(lang, 'ak chcete sypaný čaj', 'pokud chcete sypaný čaj')});
      else if (p.pack) f.push({k: 'form', v: p.pack});
      return f;
    }
    const TEA_USE = {sk: {black: 'Čierny čaj: voda 95–100 °C, lúhovať 3–5 minút.', green: 'Zelený čaj: voda 70–80 °C, lúhovať 2–3 minúty.', white: 'Biely čaj: voda 75–85 °C, lúhovať 3–5 minút.', herbal: 'Bylinný čaj: vriaca voda, lúhovať 5–10 minút pod pokrievkou.', fruit: 'Ovocný čaj: vriaca voda, lúhovať 5–8 minút.', rooibos: 'Rooibos: vriaca voda, lúhovať 5–7 minút.'}, cs: {black: 'Černý čaj: voda 95–100 °C, louhovat 3–5 minut.', green: 'Zelený čaj: voda 70–80 °C, louhovat 2–3 minuty.', white: 'Bílý čaj: voda 75–85 °C, louhovat 3–5 minut.', herbal: 'Bylinný čaj: vroucí voda, louhovat 5–10 minut pod pokličkou.', fruit: 'Ovocný čaj: vroucí voda, louhovat 5–8 minut.', rooibos: 'Rooibos: vroucí voda, louhovat 5–7 minut.'}};
    const usage = p => (TEA_USE[lang][p.raw.type] || '') + L(lang, ' Množstvo: jedno vrecúško alebo približne 2 g sypaného čaju na 200–250 ml, ak výrobca neuvádza inak.', ' Množství: jeden sáček nebo přibližně 2 g sypaného čaje na 200–250 ml, pokud výrobce neuvádí jinak.');
    const accessories = () => products.filter(p => !p.main && p.available && /sitk|sitek|sítk|konvic|kanvic|hrnek|hrnc|infuz|caj(?:o|e)vn/.test(norm(p.name)));
    const describe = (a = {}, not = {}) => { const out = []; if (a.category === 'sets') out.push(L(lang, 'darčeková sada', 'dárková sada')); if (a.type) out.push(TYPE[lang][a.type] + L(lang, ' čaj', ' čaj')); if (a.caffeine === 'no') out.push(L(lang, 'bez kofeínu', 'bez kofeinu')); if (a.caffeine === 'yes') out.push(L(lang, 's kofeínom', 's kofeinem')); if (not.type?.length) out.push(L(lang, 'nie ', 'ne ') + not.type.map(t => TYPE[lang][t]).join(L(lang, ' ani ', ' ani '))); return out; };
    return {family: 'tea', lang, currency, source: catalogue.source || '', shipping: catalogue.shipping || null, products, parse, rank, facts, usage, accessories, describe, relax: ['type'], reasonKeys: ['type', 'caffeine', 'form'], similar: p => ({category: p.cat === 'sets' ? 'sets' : undefined})};
  }

  /* ======================= PLANTS ======================= */
  function plantsAdapter(brand, fns = {}) {
    const lang = isCs(brand.website) ? 'cs' : 'sk';
    const currency = brand.currency || 'EUR';
    const tidy = fns.tidy || (s => s);
    const NON_MAIN = ['pots', 'substrates', 'accessories', 'terrariums'];
    const products = brand.products.map(p => ({id: String(p.id), name: p.name, url: p.url, price: p.price, amount: Number.isFinite(p.priceValue) ? p.priceValue : null, currency: p.currency || currency, pack: '', available: p.available !== false, main: !NON_MAIN.includes(p.kind), kind: p.kind, raw: p}));
    const byId = new Map(products.map(p => [p.id, p]));
    const kindOf = s => /semien|semink|\bsemena\b|\bsemeno\b|osivo/.test(s) && !/semenac/.test(s) ? 'seeds' : /odrez|\brizek\b|\brizky\b|zakorenit/.test(s) ? 'cuttings' : /masozrav/.test(s) ? 'carnivorous' : /kvetinac|crepnik|obal na kvet|\bobal\b|kaspo|truhlik/.test(s) ? 'pots' : /substrat|zemin|hlin\b|hlina|raselin/.test(s) ? 'substrates' : /hnojiv|postrek|postrik|opora|tyc|drziak|kvapkadl/.test(s) ? 'accessories' : /kaktus|cactus/.test(s) ? 'cacti' : /sukulent/.test(s) ? 'succulents' : /orchid/.test(s) ? 'orchids' : /terari/.test(s) ? 'terrariums' : /ovocn|jablon|hrusk|broskyn|ceresn|slivk/.test(s) ? 'fruits' : /trvalk|skalnick|zahrad|vonkajs|na zahon|na balkon/.test(s) ? 'outdoor' : null;
    function parse(pos, neg) {
      const set = {}, not = {};
      const k = kindOf(pos); if (k) set.kind = k;
      const nk = kindOf(neg); if (nk) not.kind = [nk];
      if (/ziv\w* rastlin|ziv\w* rostlin|rastlinu nechcem|hotov\w* rastlin/.test(neg)) not.kind = uniq([...(not.kind || []), 'plants', 'rareplants', 'cacti', 'succulents', 'orchids', 'carnivorous', 'outdoor', 'fruits', 'airplants', 'cuttings', 'seeds', 'propagules']);
      if (/hotov|zakorenen|vzrastl|dospel/.test(pos)) set.grown = true;
      if (/polotien|polostin|menej svetla|malo svetla|do tien|tienist/.test(pos)) set.facet = 'low'; else if (/rozptylen|bez priameho|nie.*priame.*sln/.test(pos)) set.facet = 'bright'; else if (/priame slnko|slnecn|plne slnko|na slnko/.test(pos)) set.facet = 'sun';
      if (/nenaroc|zaciatoc|zacatec|lahk\w* starost|snadn/.test(pos)) set.priority = 'easy';
      return {set, not};
    }
    function rank(a = {}, not = {}, st = {}) {
      const answers = {kind: a.kind, facet: a.facet, priority: a.priority};
      let raw = fns.rankProducts ? fns.rankProducts(brand, answers) : brand.products.filter(p => (!a.kind || p.kind === a.kind));
      let list = raw.map(p => byId.get(String(p.id))).filter(Boolean);
      if (!a.kind) list = list.filter(p => p.main);
      if (a.grown) list = list.filter(p => !['seeds', 'cuttings', 'propagules'].includes(p.kind));
      if (not.kind?.length) list = list.filter(p => !not.kind.includes(p.kind));
      const budget = st.budget?.amount;
      if (budget) list = list.slice().sort((x, y) => (y.amount ?? -1) - (x.amount ?? -1));
      return list;
    }
    const LABELS = {seeds: L(lang, 'semená na výsev', 'semena k výsevu'), cuttings: L(lang, 'odrezok', 'řízek'), carnivorous: L(lang, 'mäsožravá rastlina', 'masožravá rostlina'), pots: L(lang, 'kvetináč alebo obal', 'květináč nebo obal'), substrates: L(lang, 'substrát', 'substrát'), accessories: L(lang, 'pomôcka alebo doplnok', 'pomůcka nebo doplněk'), cacti: L(lang, 'kaktus', 'kaktus'), succulents: L(lang, 'sukulent', 'sukulent'), orchids: L(lang, 'orchidea', 'orchidej'), fruits: L(lang, 'ovocná rastlina', 'ovocná rostlina'), outdoor: L(lang, 'vonkajšia rastlina', 'venkovní rostlina'), plants: L(lang, 'izbová rastlina', 'pokojová rostlina'), rareplants: L(lang, 'raritná rastlina', 'raritní rostlina')};
    function facts(p) {
      const f = [{k: 'kind', v: LABELS[p.kind] || p.kind}];
      for (const x of (p.raw.facts || []).map(tidy).filter(Boolean)) {
        const n = norm(x);
        const k = /svetl|tien|slnk|slun/.test(n) ? 'light' : /nenaroc|starostliv|zaciatoc/.test(n) ? 'care' : /priemer|vysk|cm\b|velkost/.test(n) ? 'size' : /variant/.test(n) ? 'variant' : /semien|semen/.test(n) ? 'form' : 'info' + f.length;
        if (f.some(y => y.k === k)) continue;
        f.push({k, v: lc(x.replace(/\.$/, '')), hint: k === 'light' ? L(lang, 'ak máte ', 'pokud máte ') + lc(x.replace(/\.$/, '')) : k === 'care' ? L(lang, 'ak chcete nenáročnú rastlinu', 'pokud chcete nenáročnou rostlinu') : ''});
      }
      return f;
    }
    const usage = p => { const care = (p.raw.facts || []).map(tidy).filter(x => /svetl|tien|slnk|poliev|zalev|vod|teplot|nenaroc/.test(norm(x))); return care.length ? care.join(' ') : L(lang, 'Konkrétne pokyny k pestovaniu tejto položky uvádza predajca pri produkte.', 'Konkrétní pokyny k pěstování této položky uvádí prodejce u produktu.'); };
    function accessories(main, q) {
      const kinds = /kvetinac|crepnik|obal/.test(q) ? ['pots'] : /substrat|zemin|hlin/.test(q) ? ['substrates'] : /hnojiv|vyziv/.test(q) ? ['accessories'] : /misk|podmisk|tanier|talir/.test(q) ? ['pots', 'accessories'] : ['pots', 'substrates'];
      let list = products.filter(p => p.available && kinds.includes(p.kind));
      if (/misk|podmisk|tanier|talir/.test(q)) list = list.filter(p => /misk|podmisk|tanier|talir|talirek/.test(norm(p.name)));
      if (/hnojiv/.test(q)) list = list.filter(p => /hnojiv/.test(norm(p.name)));
      return list.sort((a, b) => (a.amount ?? 1e9) - (b.amount ?? 1e9));
    }
    const describe = (a = {}, not = {}) => { const out = []; if (a.kind) out.push(LABELS[a.kind] || a.kind); if (a.facet) out.push({low: L(lang, 'polotieň', 'polostín'), bright: L(lang, 'svetlo bez priameho slnka', 'světlo bez přímého slunce'), sun: L(lang, 'priame slnko', 'přímé slunce')}[a.facet]); if (a.priority === 'easy') out.push(L(lang, 'nenáročná', 'nenáročná')); if (a.grown) out.push(L(lang, 'hotová rastlina', 'hotová rostlina')); if (not.kind?.length && not.kind.length < 4) out.push(L(lang, 'nie ', 'ne ') + not.kind.map(k => LABELS[k] || k).join(', ')); return out; };
    const pre = q => /mack|macka|macky|kock|kocka|\bpes\b|\bpsa\b|psov|zvierat|zvirat|jedovat|toxick|morcat|kralik|papagaj/.test(q) ? null : undefined;
    return {family: 'plants', lang, currency, source: brand.website, shipping: brand.shipping || null, products, parse, rank, facts, usage, accessories, describe, relax: ['priority', 'facet'], reasonKeys: ['light', 'care', 'size', 'kind'], pre, similar: p => ({kind: p.kind})};
  }

  B.adapters.coffee = coffeeAdapter;
  B.adapters.wine = wineAdapter;
  B.adapters.cosmetics = cosmeticsAdapter;
  B.adapters.tea = teaAdapter;
  B.adapters.plants = plantsAdapter;
})(typeof globalThis !== 'undefined' ? globalThis : window);
