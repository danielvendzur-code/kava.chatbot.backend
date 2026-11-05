/* c2 – izolovaná kópia n447/reply.js pre BLACK a Nordbeans: najlacnejšie výhodné balenie (nie menšie za rovnakú cenu),
   akciová cena s bežnou, rozpočet „do X“ zo zostavy, hotový set firmy. Pôvodne: Overená odpoveď chatu pre novú dávku (447 € + 10 €/mes.). Odpovedá iba z dát konkrétnej pražiarne,
   po slovensky alebo po česky podľa jazyka firmy. Používa ju izolovaný poradca (okamžitá odpoveď)
   aj API (návrh, ktorý AI môže preformulovať). Cena konkrétneho balenia iba z overených variantov;
   inak výslovne „orientačne od“. */
(function (g) {
  'use strict';
  const E = g.N447Engine || (typeof require === 'function' ? require('./engine-c2.js') : null);
  const money = (v, c) => E.money(v, c).replace(/ /g, ' ');
  const fold = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const verified = (p) => (p.variants || []).filter((v) => v.verifiedAt && Number.isFinite(v.price));
  /* c2: balenie na odporúčanie – bez menšieho balenia, ktoré nie je lacnejšie než väčšie (akcia 500 g za cenu 200 g). */
  const best = (p) => { const l = verified(p); return l.filter((v) => !l.some((w) => w !== v && w.grams > v.grams && w.price <= v.price && (!v.roast || w.roast === v.roast)))
    .sort((a, b) => a.price - b.price || b.grams - a.grams); };
  const promo = (v, c, cs) => v && v.regularPrice > v.price ? (cs ? ' (akce, běžně ' : ' (akcia, bežne ') + E.money(v.regularPrice, c).replace(/ /g, ' ') + ')' : '';
  const tones = (p) => p.notes && p.notes.length ? p.notes.slice(0, 4).join(', ') : (p.profile || '');
  const roastText = (p, cs) => p.roasts ? p.roasts.join(cs ? ' i ' : ' aj ') : (p.roastLabel || '');
  const weights = (p) => (p.weights || []).map(E.grams).join(', ');

  function keyWords(p) {
    const tail = fold(p.name.split('•').pop()).replace(/\b(aa|ab|decaf|blend|g1|g2|fc|shg)\b/g, '').replace(/\s+/g, ' ').trim();
    return [tail].concat(tail.split(/\s+/).filter((w) => w.length >= 5));
  }
  /* Najkonkrétnejšia zhoda vyhráva (viac zhodných slov názvu), pri rovnosti skoršia v otázke. */
  function mentioned(data, text) {
    const brand = fold(data.brand.name).replace(/[^a-z0-9]/g, '');
    const q = fold(text).replace(/https?:\/\/\S+/g, ' ');
    return data.products.concat(data.drip ? [data.drip] : []).map((p) => {
      const kws = keyWords(p).filter((k) => k && k !== brand);
      const idx = kws.map((k) => q.indexOf(k)).filter((i) => i >= 0);
      if (p.kind === 'drip' && q.includes(fold(p.name).replace(/[^a-z]/g, ''))) idx.push(q.indexOf(fold(p.name).replace(/[^a-z]/g, '')));
      return [idx.length ? Math.min.apply(null, idx) : Infinity, p, idx.length + (q.includes(kws[0]) ? 10 : 0)];
    }).filter((x) => Number.isFinite(x[0])).sort((a, b) => b[2] - a[2] || a[0] - b[0]).map((x) => x[1]);
  }

  function coffeeReply(data, text, history) {
    history = history || [];
    const cs = data.lang === 'cs', T = (sk, c) => cs ? c : sk;
    const packText = (p) => verified(p).map((v) => E.grams(v.grams) + (v.roast ? ' ' + v.roast + ' roast' : '') + ', ' + T(String(v.grind || 'zrnková').toLowerCase(), 'zrnková') + ': ' + money(v.price, p.currency) + promo(v, p.currency, cs)).join('; ');
    const priceShort = (p) => p.kind === 'drip' ? money(p.price, p.currency) : best(p).length ? E.grams(best(p)[0].grams) + T(' za ', ' za ') + money(best(p)[0].price, p.currency) + promo(best(p)[0], p.currency, cs) : T('orientačne od ', 'orientačně od ') + money(p.priceFrom, p.currency);
    const line = (p) => p.name + ' — ' + priceShort(p) + '\n' + p.url;
    const withTones = (p) => line(p) + '\n(' + T('V chuti: ', 'V chuti: ') + tones(p) + '.)';
    const facts = (p) => {
      if (p.kind === 'drip') return p.name + T(' je balenie ', ' je balení ') + p.pack + ' za ' + money(p.price, p.currency) + '. ' + T('Vyberáte si kávu: ', 'Vybíráte si kávu: ') + p.options.map((o) => o.title).join(T(' alebo ', ' nebo ')) + '.\n' + p.url;
      const bits = [p.name + ':', p.summary, tones(p) ? T('V chuti: ', 'V chuti: ') + tones(p) + '.' : '', T('Pôvod: ', 'Původ: ') + p.origin + (p.process ? T(', spracovanie ', ', zpracování ') + p.process : '') + '.', T('Praženie: ', 'Pražení: ') + roastText(p, cs) + T('; balenia ', '; balení ') + weights(p) + '.'];
      return bits.filter(Boolean).join(' ') + (packText(p) ? T('\nCeny: ', '\nCeny: ') + packText(p) + '.' : T('\nOrientačne od ', '\nOrientačně od ') + money(p.priceFrom, p.currency) + T('; presnú cenu balenia ukáže e-shop po výbere.', '; přesnou cenu balení ukáže e-shop po výběru.')) + '\n' + p.url;
    };
    const q = fold(text);
    const coffees = data.products.filter((p) => p.available !== false && p.kind === 'coffee');
    const regular = coffees.filter((p) => !p.decaf);
    const byTaste = (t, prep) => regular.filter((p) => p.taste === t && (!prep || E.suits(p, prep))).sort((a, b) => a.priceFrom - b.priceFrom).slice(0, 2);
    /* c2: rozpočet „do X €/Kč“ – iba kávy, ktorých najlacnejšie overené balenie sa zmestí; inak úprimne nič. */
    const bm = q.replace(/\s+/g, ' ').match(/(?:do|pod|max(?:imalne|imalne)?|nanajvys|nejvys)\s*(\d+(?:[.,]\d+)?)\s*(?:€|eur|e\b|kc|czk)?/);
    if (bm && !mentioned(data, text).length) {
      const lim = Number(bm[1].replace(',', '.'));
      const fit = regular.map((p) => [p, best(p).find((v) => v.price <= lim + 1e-9)]).filter((x) => x[1]).sort((a, b) => a[1].price - b[1].price);
      const cur = coffees[0] && coffees[0].currency;
      if (!fit.length) return T('Do ', 'Do ') + money(lim, cur) + T(' v ponuke nie je žiadne balenie kávy; najlacnejšie je ', ' v nabídce není žádné balení kávy; nejlevnější je ') + line(regular.slice().sort((a, b) => best(a)[0].price - best(b)[0].price)[0]);
      return T('Do ', 'Do ') + money(lim, cur) + T(' sa zmestia napríklad:\n', ' se vejdou například:\n') + fit.slice(0, 3).map((x) => x[0].name + ' — ' + E.grams(x[1].grams) + ' za ' + money(x[1].price, x[0].currency) + promo(x[1], x[0].currency, cs) + '\n' + x[0].url).join('\n')
        + (fit.length > 3 ? T('\nĎalšie: ', '\nDalší: ') + (fit.length - 3) + T('; vo Výbere kávy ich zúžite podľa prípravy a chuti.', '; ve Výběru kávy je zúžíte podle přípravy a chuti.') : '');
    }
    if ((data.sets || []).length && /\bset|sada|sadu|sady|balicek|darek|darcek|four|degust|ochutn/.test(q)) {
      const st = data.sets[0];
      return T('Hotový set: ', 'Hotový set: ') + st.name + ' — ' + st.pack + ' za ' + money(st.price, st.currency) + '. ' + T('Obsahuje: ', 'Obsahuje: ') + st.containsNames.join(', ') + '.\n' + st.url;
    }
    let named = mentioned(data, text);
    if (!named.length && /cen|stoj|kolko|kolik|balen|prazen|mlet|chut|povod|puvod|odkial|odkud|kysl|kysel/.test(q)) {
      /* Najprv produkt, na ktorý sa zákazník naposledy pýtal; inak ten, ktorým sa začína posledná odpoveď
         (nie produkt spomenutý iba v popise inej kávy). */
      const prevUser = history.slice().reverse().find((m) => m.role === 'user' && mentioned(data, m.content).length);
      const last = history.slice().reverse().find((m) => m.role === 'assistant');
      if (prevUser) named = mentioned(data, prevUser.content).slice(0, 1);
      else if (last) {
        const lead = fold(last.content);
        named = mentioned(data, last.content).map((p) => [lead.indexOf(fold(p.name).split(/[^a-z0-9]+/).filter(Boolean)[0] || '~'), p])
          .filter((x) => x[0] >= 0).sort((m, n) => m[0] - n[0]).map((x) => x[1]).slice(0, 1);
      }
    }
    if (named.length >= 2 && /porovn|rozdiel|rozdil|alebo|nebo|vs|lepsi|ktor|ktera|kterou/.test(q)) {
      const desc = (p) => p.kind === 'drip' ? p.name + ': ' + p.pack : p.name + ': ' + tones(p) + '; ' + (p.process || '') + T('; praženie ', '; pražení ') + roastText(p, cs);
      return desc(named[0]) + '.\n' + desc(named[1]) + '.\n' + line(named[0]) + '\n' + line(named[1]);
    }
    if (named.length && /cen|stoj|kolko|kolik/.test(q) && named[0].kind !== 'drip') {
      const p = named[0];
      return packText(p) ? p.name + ': ' + packText(p) + '.\n' + p.url
        : p.name + T(' má v e-shope orientačnú cenu od ', ' má v e-shopu orientační cenu od ') + money(p.priceFrom, p.currency) + T('; balenia ', '; balení ') + weights(p) + T('. Presnú cenu konkrétneho balenia e-shop ukáže po výbere.\n', '. Přesnou cenu konkrétního balení ukáže e-shop po výběru.\n') + p.url;
    }
    if (named.length) return facts(named[0]);
    if (/bez ?kofe|decaf|vecer/.test(q)) {
      const d = coffees.find((p) => p.decaf);
      return d ? T('Bez kofeínu je ', 'Bez kofeinu je ') + d.name + '. ' + d.summary + '\n' + line(d) : T('Kávu bez kofeínu v ponuke momentálne nevidím.', 'Kávu bez kofeinu v nabídce momentálně nevidím.');
    }
    if (/kapsl|kapsul|nespresso/.test(q)) return T('Tento výber odporúča zrnkovú a mletú kávu. Kapsule nájdete v e-shope samostatne; kompatibilitu si overte priamo pri produkte.\n', 'Tento výběr doporučuje zrnkovou a mletou kávu. Kapsle najdete v e-shopu samostatně; kompatibilitu si ověřte přímo u produktu.\n') + data.brand.shopUrl;
    if (data.drip && /drip|vreck|vrecus|sacek|sacky|cest|kancel|bez kavovar|bez pomuc|hotel|chata/.test(q)) return T('Na cesty sa hodí ', 'Na cesty se hodí ') + data.drip.name + ': ' + data.drip.pack + T(', stačí šálka a horúca voda.\n', ', stačí šálek a horká voda.\n') + line(data.drip);
    if (/doprav|postovn|doruc|zasiel|zasil/.test(q)) return data.shop && data.shop.freeShipping ? data.shop.freeShipping + T(' Ďalšie možnosti dopravy a platby nájdete pri objednávke v e-shope.', ' Další možnosti dopravy a platby najdete při objednávce v e-shopu.') : T('Možnosti dopravy a platby nájdete pri objednávke v e-shope.\n', 'Možnosti dopravy a platby najdete při objednávce v e-shopu.\n') + data.brand.shopUrl;
    if (/kontakt|mail|telef|adres/.test(q)) return data.brand.name + T(' je k dispozícii na ', ' je k dispozici na ') + data.brand.contact + '.';
    if (/v60|hario|filtr|filter|aeropress|french|chemex|prekvap|prekap/.test(q)) {
      /* c2: na filter najprv kávy, ktoré pražiareň uvádza na prelievaný filter (V60/chemex), až potom ostatné vhodné */
      const pour = (t) => regular.filter((p) => p.taste === t && Array.isArray(p.tools) && p.tools.includes('v60')).sort((a, b) => a.priceFrom - b.priceFrom);
      const recs = pour('fresh').concat(pour('fruitFull')).concat(byTaste('fresh', 'filter'), byTaste('fruitFull', 'filter')).filter((p, i, l) => l.indexOf(p) === i).slice(0, 2);
      const recipe = /v60|hario/.test(q) && data.guides && data.guides.v60 ? T('\nRecept pražiarne na V60: ', '\nRecept pražírny na V60: ') + data.guides.v60.steps[0] + ' ' + data.guides.v60.url : '';
      return (data.beansOnly || !recs.every((p) => p.roasts && p.roasts.includes('filter')) ? T('Na filter sa podľa e-shopu hodia napríklad:\n', 'Na filtr se podle e-shopu hodí například:\n') : T('Na filter sa hodia kávy vo filter pražení, napríklad:\n', 'Na filtr se hodí kávy ve filtrovém pražení, například:\n')) + recs.map(line).join('\n')
        + (data.beansOnly ? T('\nKáva sa predáva zrnková, pomeľte ju tesne pred prípravou.', '\nKáva se prodává zrnková, umelte ji těsně před přípravou.') : T('\nPri objednávke zvoľte mletie podľa pomôcky alebo zrnkovú (uvedená cena platí pre zrnkovú; cenu mletej e-shop ukáže po výbere).', '\nPři objednávce zvolte mletí podle pomůcky nebo zrnkovou (uvedená cena platí pro zrnkovou).')) + recipe;
    }
    if (/cokol|karamel|orech|oriesk|horka|tmav|klasick|mliek|mlek|capp|latte|automat|pakov|espresso|moka/.test(q)) {
      const recs = byTaste('choco', 'espresso');
      return T('Čokoládovú a orieškovú chuť do automatu či kávovaru majú napríklad:\n', 'Čokoládovou a oříškovou chuť do automatu či kávovaru mají například:\n') + recs.map(withTones).join('\n') + (data.beansOnly ? '' : T('\nDo automatu zvoľte zrnkovú.', '\nDo automatu zvolte zrnkovou.'));
    }
    if (/ovoc|bobul|visn|malin|cucori|boruv|tropic/.test(q)) return T('Plnú ovocnú chuť majú napríklad:\n', 'Plnou ovocnou chuť mají například:\n') + byTaste('fruitFull').map(withTones).join('\n');
    if (/kysl|kysel|sviez|svez|citrus|ribez|rybiz|caj|lahk|lehk|jemn/.test(q)) return T('Sviežu, šťavnatú chuť majú napríklad:\n', 'Svěží, šťavnatou chuť mají například:\n') + (byTaste('fresh').length ? byTaste('fresh') : byTaste('fruitFull')).map(withTones).join('\n');
    if (/cen|lacn|levn|najlacn|nejlevn|stoj|kolko|kolik|rozpoc/.test(q)) {
      const cheap = regular.slice().sort((a, b) => a.priceFrom - b.priceFrom).slice(0, 2);
      return T('Najnižšie ceny v ponuke majú:\n', 'Nejnižší ceny v nabídce mají:\n') + cheap.map(line).join('\n') + T('\nPresná cena závisí od balenia; vo Výbere kávy nájdete aj výber podľa rozpočtu.', '\nPřesná cena závisí na balení; ve Výběru kávy najdete i výběr podle rozpočtu.');
    }
    const start = byTaste('choco', 'espresso')[0] || regular[0];
    return T('Rád pomôžem vybrať kávu z ponuky ', 'Rád pomohu vybrat kávu z nabídky ') + data.brand.name.replace(/\.$/, '') + T('. Napíšte, ako kávu pripravujete a akú chuť máte radi, alebo skúste krátky výber vo Výbere kávy. Na začiatok napríklad:\n', '. Napište, jak kávu připravujete a jakou chuť máte rádi, nebo zkuste krátký výběr ve Výběru kávy. Pro začátek například:\n') + line(start);
  }
  const api = {coffeeReply, mentioned};
  g.N447Reply = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
