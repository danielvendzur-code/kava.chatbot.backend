/* Séria 3 – káva: dva malé doplnky chatu, oba bez volania modelu (overené dáta pražiarne v prehliadači).
   1) Rýchla voľba „Porovnat 2 kávy“: zákazník ťukne na dve kávy a v chate ich uvidí vedľa seba
      (fotka, cena za balenie a za 100 g, pôvod, spracovanie, chuťové tóny, škály pražiarne, odkaz).
   2) Po výsledku vo Výbere chat nadviaže jednou krátkou vetou na vybranú kávu (nič viac). */
(() => {
  'use strict';
  const slug = document.body.dataset.cosmeticsDemo;
  const D = window.N447_DATA && window.N447_DATA[slug], E = window.N447Engine, API = window.CX_CHAT_API;
  if (!D || !E || !API) return;
  const cs = D.lang === 'cs', T = (sk, c) => cs ? c : sk;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const coffees = D.products.filter((p) => p.available !== false && p.kind === 'coffee' && p.photo);
  const byId = new Map(coffees.map((p) => [p.id, p]));
  const cheapest = (p) => (p.variants || []).filter((v) => v.verifiedAt && Number.isFinite(v.price) && v.available !== false).sort((m, n) => m.price - n.price || m.grams - n.grams)[0];
  const scalesOf = (p) => { const src = String(p.tasteSource || ''), max = /1[–-]10/.test(src) ? 10 : 5;
    return [...src.matchAll(/(kyselost|hořkost|sladkost|tělo|kyslosť|horkosť|sladkosť|telo)\s*(\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+))?/gi)]
      .map((m) => ({name: m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase(), value: Number(m[2].replace(',', '.')), max: Number(m[3] || max)})).filter((x) => x.value <= x.max); };
  const advisorResult = () => { const st = window.CXCoffeeAdvisorS3 && window.CXCoffeeAdvisorS3.state; if (!st || E.nextQuestion(D, st.answers)) return null; try { return E.result(D, st.answers); } catch (_) { return null; } };

  /* Kandidáti na porovnanie: po výbere najprv odporúčaná a alternatívna káva a ďalšie vhodné; inak kávy v poradí e-shopu, striedavo podľa chuti. */
  function candidates() {
    const r = advisorResult(), out = [];
    const add = (p) => { if (p && byId.has(p.id) && !out.some((x) => x.id === p.id)) out.push(p); };
    if (r && r.product) { add(r.product); add(r.alternative && r.alternative.product); const st = window.CXCoffeeAdvisorS3.state;
      E.pool(D, {prep: st.answers.prep, tool: st.answers.tool, caffeine: st.answers.caffeine, machine: st.answers.machine}).forEach(add); }
    const groups = ['choco', 'fruitFull', 'fresh'].map((k) => coffees.filter((p) => (p.tastes || [p.taste]).includes(k)));
    for (let i = 0; out.length < 6 && i < coffees.length; i++) groups.forEach((g) => g[i] && out.length < 6 && add(g[i]));
    coffees.forEach((p) => out.length < 6 && add(p));
    return out.slice(0, 6);
  }

  const say = (m) => { API.state.messages.push(m); API.state.interacted = true; API.render(); };
  function pickMessage() {
    const list = candidates();
    return {role: 'assistant', text: T('Ponuka káv na porovnanie: ', 'Nabídka káv k porovnání: ') + list.map((p) => p.name).join(', '), html: '<span class="s3-cmp-pick" data-s3-pick><span class="lg-text">' + esc(T('Ťuknite na dve kávy, ktoré chcete porovnať:', 'Ťukněte na dvě kávy, které chcete porovnat:')) + '</span><span class="s3-cmp-grid">'
      + list.map((p) => '<button type="button" class="s3-cmp-tile" data-s3-coffee="' + esc(p.id) + '" aria-pressed="false"><img src="' + esc(p.photo) + '" alt="" loading="eager"><span>' + esc(p.name) + '</span></button>').join('') + '</span></span>'};
  }
  function compareMessage(a, b) {
    const col = (p) => { const v = cheapest(p), sc = scalesOf(p);
      return '<span class="s3-cmp-col"><span class="s3-cmp-photo"><img src="' + esc(p.photo) + '" alt="" loading="eager"></span><b>' + esc(p.name) + '</b>'
        + '<span class="s3-cmp-row"><i>' + esc(T('Cena', 'Cena')) + '</i>' + esc(v ? E.grams(v.grams) + ' · ' + E.money(v.price, p.currency) : '') + '</span>'
        + (v && v.grams !== 100 ? '<span class="s3-cmp-row"><i>' + esc(T('Za 100 g', 'Za 100 g')) + '</i>' + esc(E.money(D.price100 === 'cents' ? Math.round(v.price / v.grams * 10000) / 100 : Math.round(v.price / v.grams * 100), p.currency)) + '</span>' : '')
        + (p.origin ? '<span class="s3-cmp-row"><i>' + esc(T('Pôvod', 'Původ')) + '</i>' + esc(String(p.origin).split(/[·(]/)[0].trim()) + '</span>' : '')
        + (p.process ? '<span class="s3-cmp-row"><i>' + esc(T('Spracovanie', 'Zpracování')) + '</i>' + esc(String(p.process).split(/[,(]/)[0].trim()) + '</span>' : '')
        + ((p.notes || []).length ? '<span class="s3-cmp-row"><i>' + esc(T('Chuť', 'Chuť')) + '</i>' + esc(p.notes.slice(0, 3).join(', ')) + '</span>' : '')
        + (!sc.length ? (p.tasteProfile || []).map((x) => '<span class="s3-cmp-row"><i>' + esc(x.name) + '</i>' + esc(x.text) + '</span>').join('') : '')
        + sc.map((x) => '<span class="s3-scale"><i>' + esc(x.name) + '</i><span class="s3-scale-bar" style="--s3-v:' + (x.value / x.max) + '"></span><b>' + esc(x.value + '/' + x.max) + '</b></span>').join('')
        + '<a class="s3-cmp-go" href="' + esc(p.url) + '">' + esc(T('Zobraziť kávu →', 'Zobrazit kávu →')) + '</a></span>'; };
    return {role: 'assistant', text: T('Porovnanie: ', 'Porovnání: ') + a.name + ' / ' + b.name, html: '<span class="s3-cmp"><span class="lg-text">' + esc(T('Porovnanie podľa údajov e-shopu:', 'Porovnání podle údajů e-shopu:')) + '</span><span class="s3-cmp-cols">' + col(a) + col(b) + '</span></span>'};
  }

  /* 4 rovnaké rýchle voľby ostávajú – tretia (chuť) sa nahradí porovnaním; na chuť sa pýta aj Výber kávy. */
  window.CX_S3_CHIPS = (chips) => chips.map((c, i) => i === 2 ? {label: T('Porovnať 2 kávy', 'Porovnat 2 kávy'), action: 'compare'} : c);
  window.CX_S3_CHIP_ACTION = (action, label) => {
    if (action !== 'compare') return;
    API.state.messages.push({role: 'user', text: label});
    say(pickMessage());
  };
  let chosen = [];
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-s3-coffee]'); if (!t) return;
    const box = t.closest('[data-s3-pick]'); if (!box || box.dataset.done) return;
    const id = t.dataset.s3Coffee;
    chosen = chosen.includes(id) ? chosen.filter((x) => x !== id) : chosen.concat(id).slice(-2);
    box.querySelectorAll('[data-s3-coffee]').forEach((b) => b.setAttribute('aria-pressed', String(chosen.includes(b.dataset.s3Coffee))));
    if (chosen.length === 2) { box.dataset.done = '1'; const [a, b] = chosen.map((x) => byId.get(x)); chosen = [];
      /* zoznam na výber sa po porovnaní nahradí výsledkom (správa ostane jedna, nie dlhý chat) */
      const msgs = API.state.messages, i = msgs.findIndex((m) => m.html && m.html.includes('data-s3-pick'));
      if (i >= 0) msgs.splice(i, 1);
      setTimeout(() => say(compareMessage(a, b)), 60); }
  });

  /* Nadviazanie na výber: jedna krátka veta, raz pre každý výsledok. */
  let announced = '';
  const follow = () => {
    const r = advisorResult(); if (!r || !r.product || r.kind === 'drip') return;
    const key = r.product.id + '|' + (r.pack && r.pack.grams);
    if (announced === key) return; announced = key;
    API.state.messages.push({role: 'assistant', text: T('K vybranej káve ' + r.product.name + ' sa môžete opýtať na mletie, recept alebo ju porovnať s inou.', 'K vybrané kávě ' + r.product.name + ' se můžete zeptat na mletí, recept nebo ji porovnat s jinou.')});
    API.render();
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-result-chat') || b.dataset.mode === 'chat') setTimeout(follow, 30);
  }, true);
})();
