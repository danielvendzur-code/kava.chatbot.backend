/* k2 – obsahové regresné testy chatu novej dávky (api/cosmetics-chat-447b.js). Bez siete a bez platených modelov:
   AI vrstva je nahradená funkciou, ktorá vráti návrh odpovede (draft).
   node tools/k2/test_chat_k2.mjs            (spúšťať z koreňa repozitára)
   Každý prípad: must = produkty, ktoré v odpovedi MUSIA byť (stačí jeden z alternatív oddelených |),
                 not = produkty, ktoré v odpovedi NESMÚ byť, none = odpoveď nesmie odporučiť žiadny produkt,
                 maxPrice = žiadny menovaný produkt nesmie byť drahší. Navyše sa automaticky overí, že každý
                 menovaný produkt spĺňa zložku/typ z otázky (podľa CXK2ChatGuard). */
globalThis.fetch = () => { throw new Error('sieť počas testu'); };
const root = process.cwd();
const m = await import(root + '/api/cosmetics-chat-447b.js');
const G = globalThis.CXK2ChatGuard;

const CASES = [
  {slug: 'moravite', q: 'Máte mýdlo s levandulí?', not: ['Mýdlo Aktivní uhlí', 'Mýdlo Syrovátka', 'Mýdlo Měsíček lékařský'], noneOfType: 'soap'},
  {slug: 'moravite', q: 'Hledám mýdlo s měsíčkem', must: ['Mýdlo Měsíček lékařský'], not: ['Mýdlo Aktivní uhlí', 'Mýdlo Probiotický jogurt']},
  {slug: 'moravite', q: 'Hledám koupelovou sůl na relax', must: ['Koupelová sůl'], not: ['Vitamínový sprchový gel', 'Krém na ruce']},
  {slug: 'moravite', q: 'Máte něco s kokosem?', none: true},
  {slug: 'moravite', q: 'Máte mýdlo s měsíčkem do 100 Kč?', not: ['Mýdlo Aktivní uhlí']},
  {slug: 'moravite', q: 'Hledám dárek pro muže', must: ['Dárkový balíček pro muže']},
  {slug: 'bohemikus', q: 'Máte levandulové mýdlo?', must: ['Lady Provence|Královna jihu'], not: ['Bílá paní', 'Jogurtové mýdlo – čisté', 'Černá perla']},
  {slug: 'bohemikus', q: 'Máte mýdlo s medem?', must: ['Medová princezna'], not: ['Černá perla', 'Bílá paní']},
  {slug: 'bohemikus', q: 'Máte kávové mýdlo?', must: ['Lady Mocca'], not: ['Jogurtové mýdlo – čisté']},
  {slug: 'bohemikus', q: 'Máte šampon s kopřivou?', must: ['Tuhý šampon s kopřivou'], not: ['heřmánkem', 'neemovým']},
  {slug: 'bohemikus', q: 'Hledám mýdlo do 130 Kč', maxPrice: 130},
  {slug: 'bohemikus', q: 'Máte něco s eukalyptem?', none: true},
  {slug: 'bohemikus', q: 'Máte něco s kokosem?', must: ['Tuhý šampon'], not: ['Černá perla']},
  {slug: 'naturinka', q: 'Máte levandulové mýdlo?', must: ['Levandulové mýdlo']},
  {slug: 'goodie', q: 'Máte něco s matchou?', must: ['Matcha']},
  {slug: 'goodie', q: 'Hledám koupelovou sůl s eukalyptem', must: ['Epsomská sůl s eukalyptem'], not: ['Bath bomb']},
  {slug: 'akh', q: 'Máte něco s levandulí?', must: ['LEVANDUL|Levandul']},
  {slug: 'musk', q: 'Máte levanduľové mydlo?', must: ['VÔŇA PROVENCE|SOĽNÝ KVET'], not: ['ČIERNE ZLATO', 'DŽENTLMEN']},
  {slug: 'musk', q: 'Máte mydlo bez vône?', must: ['AŽ NA KOŽU|NEŽNÝ DOTYK'], not: ['VÔŇA PROVENCE', 'ČIERNE ZLATO']},
  {slug: 'musk', q: 'Hľadám šampón na mastné vlasy', must: ['SVIEŽE RÁNO'], not: ['KAPITÁN', 'LÁSKYKVET']},
  {slug: 'musk', q: 'Hľadám olej na suchú pleť', must: ['AVOKÁDOVÝ|BORÁKOVÝ|ŠÍPKOVÝ'], not: ['KONOPNÝ', 'JOJOBOVÝ']},
  {slug: 'musk', q: 'Máte mydlo s mätou do 5 €?', maxPrice: 5, not: ['VÔŇA PROVENCE']},
  {slug: 'musk', q: 'Máte niečo s kokosovým mliekom a vanilkou?', none: true},
  // bez konkrétnej požiadavky sa strážca nezapína (zdieľaný mozog odpovedá ako doteraz)
  {slug: 'moravite', q: 'Může mi poradit, jak vypadá doprava zdarma do 1399 Kč?', guard: false},
  {slug: 'andreine447', q: 'Vypadávajú mi vlasy', must: ['rast vlasov']},
  {slug: 'andreine447', q: 'Mám mastné vlasy', not: ['na suché vlasy']},
  {slug: 'mark', q: 'Hľadám šampón na mastné vlasy', must: ['mastné vlasy'], not: ['ROSEMARY']},
  {slug: 'mark', q: 'Máte niečo s kávou?', must: ['COFFEE|Coffee|káv']},
  // audit 30. 10. – zápor: vylúčená zložka sa nesmie odporučiť (overuje sa aj voči zloženiu), neprítomnosť iba so zložením
  {slug: 'bohemikus', q: 'Hledám mýdlo bez levandule', type: 'soap', must: ['Bílá paní|Medová princezna|Jogurtové mýdlo – čisté'], not: ['Lady Provence', 'Královna jihu', 'Levandulová sada']},
  {slug: 'bohemikus', q: 'Nechci levanduli, hledám mýdlo', type: 'soap', not: ['Lady Provence', 'Královna jihu', 'Levandulová sada']},
  {slug: 'bohemikus', q: 'Hledám mýdlo bez kokosového oleje', type: 'soap', not: ['Bílá paní', 'Medová princezna', 'Lady Mocca']},
  {slug: 'musk', q: 'Chcem mydlo, ale nechcem levanduľu', type: 'soap', must: ['AŽ NA KOŽU|NEŽNÝ DOTYK|MLIEČNA DRÁHA|SOĽNÝ DOTYK'], not: ['VÔŇA PROVENCE', 'SOĽNÝ KVET', 'MOZAIKA', 'MACKO', 'LÍŠKA']},
  {slug: 'musk', q: 'Mám alergiu na levanduľu, odporučte mi mydlo', type: 'soap', not: ['VÔŇA PROVENCE', 'SOĽNÝ KVET', 'MOZAIKA', '9 ¾']},
  {slug: 'musk', q: 'Hľadám mydlo bez kokosového oleja', type: 'soap', none: true},
  {slug: 'musk', q: 'Nemám rada levanduľu, máte šampón?', type: 'shampoo', not: ['VÁŽNA ZNÁMOSŤ']},
  // audit 30. 10. – kontext: typ, rozpočet a zápor z predchádzajúcich správ platia, kým ich zákazník výslovne nezmení
  {slug: 'musk', history: ['Hľadám mydlo do 5 €', 'Akú vôňu chcete?'], q: 'Levanduľové', type: 'soap', maxPrice: 5, must: ['SOĽNÝ KVET|MOZAIKA|MACKO|LÍŠKA'], not: ['HYDROLÁT', 'SÉRUM', 'MASLO', 'VÔŇA PROVENCE']},
  {slug: 'musk', history: ['Chcem mydlo s rozpočtom 5 eur', 'Akú vôňu máte radi?'], q: 'Levanduľa', type: 'soap', maxPrice: 5, not: ['HYDROLÁT', 'SÉRUM', 'MASLO']},
  {slug: 'musk', history: ['Hľadám mydlo do 5 €', 'Akú vôňu chcete?'], q: 'Levanduľové, kľudne aj do 6 €', type: 'soap', maxPrice: 6, must: ['VÔŇA PROVENCE|SOĽNÝ KVET|MOZAIKA|MACKO|LÍŠKA']},
  {slug: 'musk', history: ['Hľadám mydlo bez vône', 'Aký máte rozpočet?'], q: 'Do 10 eur', type: 'soap', maxPrice: 10, must: ['AŽ NA KOŽU|NEŽNÝ DOTYK'], not: ['VÔŇA PROVENCE']},
  {slug: 'musk', history: ['Chcem mydlo bez levandule', 'Aký máte rozpočet?'], q: 'do 4 €', type: 'soap', maxPrice: 4, not: ['SOĽNÝ KVET', 'MACKO', 'LÍŠKA']},
  {slug: 'bohemikus', history: ['Hledám mýdlo do 140 Kč', 'Jakou vůni máte rád?'], q: 'Levandulové', type: 'soap', maxPrice: 140, must: ['Lady Provence'], not: ['Levandulová sada']},
  {slug: 'bohemikus', history: ['Chci mýdlo bez levandule', 'Jaký máte rozpočet?'], q: 'Do 130 Kč', type: 'soap', maxPrice: 130, not: ['Lady Provence', 'Královna jihu']},
  {slug: 'musk', history: ['Hľadám mydlo do 5 €', 'Tu sú mydlá…'], q: 'Je doprava zdarma do 50 €?', guard: false},
];

const products = (slug) => globalThis.CX_CATALOGUES[slug].products;
let fail = 0, calls = 0;
for (const c of CASES) {
  const hist = (c.history || []).map((content, i) => ({role: i % 2 ? 'assistant' : 'user', content}));
  const out = await m.answer({demoId: c.slug, messages: [...hist, {role: 'user', content: c.q}]}, {ai: async ({draft}) => { calls++; return draft; }});
  const reply = out.json.reply || '';
  const named = products(c.slug).filter((p) => reply.includes(p.name));
  const errs = [];
  for (const alt of c.must || []) if (!alt.split('|').some((x) => named.some((p) => p.name.includes(x)))) errs.push('chýba ' + alt);
  for (const x of c.not || []) if (named.some((p) => p.name.includes(x))) errs.push('zakázaný ' + x);
  if (c.none && named.length) errs.push('nemal odporučiť nič, menuje ' + named.map((p) => p.name).join(', '));
  if (c.maxPrice != null) for (const p of named) if (p.priceAmount > c.maxPrice) errs.push('nad rozpočet ' + p.name + ' ' + p.priceAmount);
  if (c.noneOfType) { const t = G.TYPES.find((x) => x.key === c.noneOfType); for (const p of named) if (t.re.test(G.norm(p.name + ' ' + p.kind))) errs.push('menuje ' + c.noneOfType + ' bez požadovanej zložky: ' + p.name); }
  // každý menovaný produkt musí niesť zložku z celej konverzácie (popis, názov, overené zaradenie alebo zloženie),
  // nesmie obsahovať vylúčenú zložku a musí byť požadovaného typu; neprítomnosť bez zloženia iba s výhradou
  const {terms, excluded, types} = G.context(c.q, hist);
  const hay = (p) => G.hay(p);
  for (const p of named) for (const t of terms) if (!t.re.test(hay(p))) errs.push(`${p.name} nespĺňa „${t.cs}“`);
  for (const p of named) for (const t of excluded) if (t.re.test(hay(p))) errs.push(`${p.name} obsahuje vylúčené „${t.cs}“`);
  if (excluded.length) for (const p of named) if (!p.k2Inci && !/neviem|nemůžu|nemuzu/.test(G.norm(reply))) errs.push(`${p.name} bez zloženia odporučený bez výhrady`);
  if (c.type) { const t = G.TYPES.find((x) => x.key === c.type); for (const p of named) if (!t.re.test(G.norm(p.name + ' ' + p.kind))) errs.push(`${p.name} nie je typu ${c.type}`); }
  if (c.guard === false && G.guard(globalThis.CX_CATALOGUES[c.slug], c.q, 'x', hist)) errs.push('strážca sa zapol bez konkrétnej požiadavky');
  if (out.status !== 200) errs.push('status ' + out.status);
  console.log((errs.length ? 'FAIL' : 'ok  ') + ` [${c.slug}] ${c.q} → ${named.map((p) => p.name).slice(0, 3).join(' ; ') || '(bez produktu)'}` + (errs.length ? '\n      ' + errs.join('\n      ') : ''));
  if (errs.length) fail++;
}
console.log(`${CASES.length - fail}/${CASES.length} ok · AI volaní: ${calls} (mock, platené 0)`);
process.exit(fail ? 1 : 0);
