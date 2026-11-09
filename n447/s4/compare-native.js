/* Séria 4 – kozmetika a čaj: rýchla voľba „Porovnat dva produkty“ (bez volania modelu, iba overené údaje e-shopu v katalógu).
   Zákazník ťukne na dva produkty a v chate ich uvidí vedľa seba: fotka, druh, pre koho (kategória e-shopu), balenie, cena, odkaz.
   Zapína sa iba pre firmy série 4 (registry series "s4"), staršie ukážky sa nemenia. */
(() => {
  'use strict';
  const slug = document.body.dataset.cosmeticsDemo;
  const REG = window.S3_REG && window.S3_REG.demos && window.S3_REG.demos[slug];
  const cat = (window.CX_CATALOGUES || {})[slug], API = window.CX_CHAT_API;
  if (!REG || !['s4','s5'].includes(REG.series) || !cat || !API) return;
  const cs = (REG.brand && REG.brand.lang) === 'cs', T = (sk, c) => cs ? c : sk;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const list = (cat.products || []).filter((p) => p.available !== false && !p.isSample && p.photo);
  const byId = new Map(list.map((p) => [String(p.id), p]));
  const tr = (p) => (p.source && p.source.selectionTraits) || {};
  const label = (k) => { const c = (REG.traitCopy || {})[k]; return c ? (cs ? c[2] : c[0]) : ''; };
  /* compareTrait 'line': pri produkte sa namiesto názvu voľby ukáže jej podnadpis (napr. typy pleti, do ktorých produkt zaraďuje e-shop) */
  const focusText = (k) => { const c = (REG.traitCopy || {})[k]; return c && REG.compareTrait === 'line' ? (cs ? c[3] : c[1]) : label(k); };
  /* Ponuka: produkty jednej oblasti (najpočetnejšej – napr. pleť), rovnaký druh pri sebe, v poradí e-shopu; najviac 6. */
  function candidates() {
    const n = (k, f) => list.filter((p) => f(p) === k).length, use = (p) => tr(p).careUse || p.category;
    const top = [...new Set(list.map(use))].sort((x, y) => n(y, use) - n(x, use))[0];
    const g = list.filter((p) => use(p) === top), kinds = [...new Set(g.map((p) => p.kind))].sort((x, y) => n(y, (p) => p.kind) - n(x, (p) => p.kind));
    return kinds.flatMap((k) => g.filter((p) => p.kind === k)).slice(0, 6);
  }
  const say = (m) => { API.state.messages.push(m); API.state.interacted = true; API.render(); };
  function pickMessage() {
    const c = candidates();
    return {role: 'assistant', text: T('Ponuka na porovnanie: ', 'Nabídka k porovnání: ') + c.map((p) => p.name).join(', '),
      html: '<span class="s3-cmp-pick" data-s3-pick><span class="lg-text">' + esc(T('Ťuknite na dva produkty, ktoré chcete porovnať:', 'Ťukněte na dva produkty, které chcete porovnat:')) + '</span><span class="s3-cmp-grid">'
        + c.map((p) => '<button type="button" class="s3-cmp-tile" data-s4-prod="' + esc(p.id) + '" aria-pressed="false"><img src="' + esc(p.photo) + '" alt="" loading="eager"><span>' + esc(p.name) + '</span></button>').join('') + '</span></span>'};
  }
  const row = (k, v) => v ? '<span class="s3-cmp-row"><i>' + esc(k) + '</i>' + esc(v) + '</span>' : '';
  function compareMessage(a, b) {
    const col = (p) => {
      const t = tr(p), pack = /\d/.test(p.volume || '') ? p.volume : '';
      return '<span class="s3-cmp-col"><span class="s3-cmp-photo"><img src="' + esc(p.photo) + '" alt="" loading="eager"></span><b>' + esc(p.name) + '</b>'
        + row(T('Cena', 'Cena'), (p.source && p.source.priceFrom ? T('od ', 'od ') : '') + p.price)
        + row(T('Balenie', 'Balení'), pack)
        + row(T('Druh', 'Druh'), p.kind)
        + (REG.series === 's5' ? row(T('Vôňa', 'Vůně'), p.source?.scent) : '')
        + row(REG.series === 's5' ? T('Typ pokožky','Typ pokožky') : T('Podľa e-shopu', 'Podle e-shopu'), REG.series === 's5' ? (p.source?.skinTypesListed || []).join(', ') : [label(t.careUse), focusText(t.skinFocus)].filter(Boolean).join(' · '))
        + '<a class="s3-cmp-go" href="' + esc(p.url) + '">' + esc(T('Zobraziť produkt →', 'Zobrazit produkt →')) + '</a></span>';
    };
    return {role: 'assistant', text: T('Porovnanie: ', 'Porovnání: ') + a.name + ' / ' + b.name,
      html: '<span class="s3-cmp"><span class="lg-text">' + esc(document.body.dataset.series==='s5'?T('Porovnanie produktov:', 'Porovnání produktů:'):T('Porovnanie podľa údajov e-shopu:', 'Porovnání podle údajů e-shopu:')) + '</span><span class="s3-cmp-cols">' + col(a) + col(b) + '</span></span>'};
  }
  const isCmp = (c) => /^porovn/i.test(typeof c === 'object' ? c.label : String(c));
  window.CX_S3_CHIPS = (chips) => chips.map((c) => isCmp(c) ? {label: typeof c === 'object' ? c.label : c, action: 'compare'} : c);
  window.CX_S3_CHIP_ACTION = (action, lbl) => {
    if (action !== 'compare') return;
    API.state.messages.push({role: 'user', text: lbl});
    say(pickMessage());
  };
  let chosen = [];
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-s4-prod]'); if (!t) return;
    const box = t.closest('[data-s3-pick]'); if (!box || box.dataset.done) return;
    const id = t.dataset.s4Prod;
    chosen = chosen.includes(id) ? chosen.filter((x) => x !== id) : chosen.concat(id).slice(-2);
    box.querySelectorAll('[data-s4-prod]').forEach((x) => x.setAttribute('aria-pressed', String(chosen.includes(x.dataset.s4Prod))));
    if (chosen.length === 2) { box.dataset.done = '1'; const [a, b] = chosen.map((x) => byId.get(x)); chosen = [];
      const msgs = API.state.messages, i = msgs.findIndex((m) => m.html && m.html.includes('data-s3-pick'));
      if (i >= 0) msgs.splice(i, 1);
      setTimeout(() => say(compareMessage(a, b)), 60); }
  });
  /* Nadviazanie na výber: po „Spýtať sa poradcu“ jedna krátka veta k vybranému produktu, raz pre každý výsledok. */
  let announced = '';
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-result-chat]'); if (!b) return;
    const names = [...document.querySelectorAll('.cx-quality-stage h2')].map((h) => h.textContent.trim());
    const p = list.find((x) => names.includes(x.name)); if (!p || announced === p.id) return; announced = p.id;
    setTimeout(() => { API.state.messages.push({role: 'assistant', text: T('K vybranému produktu ' + p.name + ' sa môžete opýtať na použitie, zloženie alebo ho porovnať s iným.', 'K vybranému produktu ' + p.name + ' se můžete zeptat na použití, složení nebo ho porovnat s jiným.')}); API.render(); }, 60);
  }, true);
})();
