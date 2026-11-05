/* Séria 3 – overená odpoveď chatu pre čaj (Tea Mountain): iba z katalógu firmy – druh, charakter z e-shopu a rozpočet.
   Keď požiadavku nič nespĺňa, povie to otvorene. Používa ju server (lib/cosmetics-chat.js) aj prehliadač bez servera. */
(function (g) {
  'use strict';
  const norm = (s) => String(s || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const TYPE = [[/zelen|sencha|matcha|gyokuro|green/, 's3Green', 'zelený'], [/cern|black|darjeeling|assam/, 's3Black', 'černý'], [/oolong|polozelen/, 's3Oolong', 'polozelený (oolong)'],
    [/pu-?erh|puer|hei.?cha|shu|sheng/, 's3Puerh', 'pu-erh'], [/bil[yea]|white/, 's3White', 'bílý']];
  const FOCUS = [[/mene povzbud|vecer|bez kofein|malo kofein|nepovzbud/, 's3LowCaf', 'méně povzbudivé'], [/pecen|prazen/, 's3Roasted', 'pečené'], [/tmav|silnejs|plnejs/, 's3Dark', 'tmavé'],
    [/svetl|jemn/, 's3Light', 'světlé'], [/jarn|first flush|prvni sber/, 's3Spring', 'jarní sběr'], [/letni|second flush/, 's3Summer', 'letní sběr'], [/podzim|autumn/, 's3Autumn', 'podzimní sběr'],
    [/vysokohor|hory|horsk/, 's3High', 'vysokohorské'], [/divok/, 's3Wild', 'z divokých čajovníků'], [/star[ey] cajovn/, 's3Old', 'ze starých čajovníků']];
  function teaReply(catalogue, text, history) {
    const all = (catalogue && catalogue.products || []).filter((p) => p.available !== false);
    const q = norm([...(history || []).filter((m) => m.role === 'user').map((m) => m.content), text].slice(-3).join(' '));
    const t = TYPE.find(([rx]) => rx.test(q)), f = FOCUS.find(([rx]) => rx.test(q));
    const lim = (q.match(/do\s*(\d{2,5})\s*(kc|korun|czk)?/) || [])[1];
    let list = all.filter((p) => (!t || p.source.selectionTraits.careUse === t[1]) && (!f || p.source.selectionTraits.skinFocus === f[1]) && (!lim || p.priceAmount <= Number(lim)));
    const asked = [t && t[2] + ' čaj', f && f[2], lim && 'do ' + lim + ' Kč'].filter(Boolean).join(', ');
    const line = (p) => `${p.name} (${p.kind.toLowerCase()}, ${p.volume}) — ${p.price}. ${p.url}`;
    if (!t && !f && !lim) return 'V nabídce Tea Mountain jsou čaje černé, zelené, polozelené (oolongy), pu-erh a bílé. Napište, jaký druh máte rádi, nebo jestli hledáte něco méně povzbudivého – vyberu konkrétní čaj. Rychle to jde i přes Výběr čaje.';
    if (!list.length) return `Čaj, který by splňoval všechno najednou (${asked}), teď v nabídce nemám. Zkuste uvolnit jednu podmínku – třeba jiný druh nebo rozpočet – a vyberu z toho, co je skladem.`;
    list = list.sort((a, b) => a.priceAmount - b.priceAmount).slice(0, 3);
    return `Podle toho, co hledáte (${asked}), z nabídky vybírám:\n` + list.map(line).join('\n') + (list[0].description ? `\n\n${list[0].name}: ${list[0].description}` : '') + '\nCena platí pro uvedené balení.';
  }
  g.S3TeaReply = {teaReply};
  if (typeof module !== 'undefined' && module.exports) module.exports = {teaReply};
})(typeof globalThis !== 'undefined' ? globalThis : window);
