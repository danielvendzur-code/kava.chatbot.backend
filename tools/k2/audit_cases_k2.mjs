/* k2 – prípady z nezávislého auditu Codexu (claude-k2-independent-chat-2026-10-30.json) presne v jeho znení, bez siete a bez plateného modelu.
   node tools/k2/audit_cases_k2.mjs   – vypíše odpoveď a overí: žiadny menovaný produkt s vylúčenou zložkou, nad limitom ani iného typu. */
globalThis.fetch = () => { throw new Error('sieť počas testu'); };
const m = await import(process.cwd() + '/api/cosmetics-chat-447b.js');
const G = globalThis.CXK2ChatGuard;
const CASES = [
  ['excluded-lavender-cs', 'bohemikus', 'Hledám mýdlo bez levandule', []],
  ['excluded-lavender-sk', 'musk', 'Chcem mydlo, ale nechcem levanduľu', []],
  ['excluded-coconut', 'musk', 'Hľadám mydlo bez kokosového oleja', []],
  ['limit-ordinary-sk', 'musk', 'Chcem mydlo a mám rozpočet 5 eur', []],
  ['limit-ordinary-cs', 'bohemikus', 'Chci mýdlo, rozpočet mám 130 Kč', []],
  ['history-budget', 'musk', 'Levanduľové', [{role: 'user', content: 'Hľadám mydlo do 5 €'}, {role: 'assistant', content: 'Akú vôňu chcete?'}]],
  ['history-type', 'musk', 'Do 10 eur', [{role: 'user', content: 'Hľadám mydlo bez vône'}, {role: 'assistant', content: 'Aký máte rozpočet?'}]],
];
let fail = 0, calls = 0;
for (const [id, slug, q, history] of CASES) {
  const out = await m.answer({demoId: slug, messages: [...history, {role: 'user', content: q}]}, {ai: async ({draft}) => { calls++; return draft; }});
  const reply = out.json.reply || '';
  const named = globalThis.CX_CATALOGUES[slug].products.filter((p) => reply.includes(p.name));
  const {excluded, budget, types} = G.context(q, history);
  const errs = [];
  for (const p of named) {
    for (const t of excluded) if (t.re.test(G.hay(p))) errs.push('vylúčené ' + t.sk + ': ' + p.name);
    if (budget != null && !(p.priceAmount <= budget)) errs.push(`nad limit ${p.name} ${p.priceAmount} > ${budget}`);
    for (const t of types) if (!t.re.test(G.norm(p.name + ' ' + p.kind))) errs.push(`iný typ: ${p.name}`);
  }
  if (errs.length) fail++;
  console.log(`${errs.length ? 'FAIL' : 'ok  '} ${id}: ${reply.replace(/\s+/g, ' ').slice(0, 420)}${errs.length ? '\n     ' + errs.join('\n     ') : ''}`);
}
console.log(`${CASES.length - fail}/${CASES.length} ok · AI volaní ${calls} (mock, platené 0)`);
process.exit(fail ? 1 : 0);
