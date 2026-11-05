/* Séria 3 – poradca kávy v paneli schválenej ukážky Andreine (rovnaké triedy, karty, výška kariet, postup aj animácie).
   Otázky, výsledok, balenie a ceny počíta overené jadro c2 (n447/c2/engine-c2.js) z dát pražiarne.
   Každá voľba má popisnú fotku a v rámci jednej otázky sa žiadna fotka neopakuje. */
(() => {
  'use strict';
  const slug = document.body.dataset.cosmeticsDemo, widget = document.querySelector('#cx-widget');
  const D = window.N447_DATA && window.N447_DATA[slug], E = window.N447Engine;
  if (!widget || !D || !E) return;
  const cs = D.lang === 'cs', T = (sk, c) => cs ? c : sk;
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const nav = widget.querySelector('.cx-mode'), stage = widget.querySelector('#cx-stage');
  const panel = document.createElement('section');
  panel.className = 'cx-quality-stage cx-catalogue-stage'; panel.hidden = true;
  panel.setAttribute('aria-label', T('Poradca pri výbere kávy', 'Poradce při výběru kávy'));
  stage.after(panel); widget.classList.add('cx-has-catalogue');

  const state = {answers: {}, trail: []};
  const key = (src) => String(src || '').replace(/^https?:/, '').split('?')[0].split('#')[0];
  const PHOTO = '/assets/s3/coffee/';
  /* Ilustrácie jadra c2 nahrádzajú fotky, ktoré ukazujú význam voľby (zdroje: assets/s3/coffee/sources.json). */
  const illustration = (src) => { const m = String(src || '').match(/\/assets\/n447\/ilustracie\/([\w-]+)\.svg$/); return m ? m[1] : null; };
  const NOTES = {
    prep: T('Podľa prípravy vyberiem praženie aj mletie.', 'Podle přípravy vyberu pražení i mletí.'),
    tool: T('Pomôcka rozhodne o mletí a o tom, ktorá káva sa hodí.', 'Pomůcka rozhodne o mletí a o tom, která káva se hodí.'),
    caffeine: T('V ponuke je káva s kofeínom aj bez neho.', 'V nabídce je káva s kofeinem i bez něj.'),
    taste: T('Podľa chuťového profilu, ktorý uvádza pražiareň.', 'Podle chuťového profilu, který uvádí pražírna.'),
    budget: T('Limit platí za celý nákup vrátane doplnku.', 'Limit platí za celý nákup včetně doplňku.'),
    detailProcess: T('Kávy sa ďalej líšia pôvodom alebo spracovaním.', 'Kávy se dál liší původem nebo zpracováním.'),
    detailMore: T('Ešte jeden overený rozdiel medzi kávami.', 'Ještě jeden ověřený rozdíl mezi kávami.'),
    pick: T('Vyberte chuťové tóny, ktoré vás lákajú najviac.', 'Vyberte chuťové tóny, které vás lákají nejvíc.'),
    dripPick: T('Káva vo vrecúškach na jednu šálku.', 'Káva v sáčcích na jeden šálek.')
  };
  NOTES.pick2 = NOTES.pick3 = NOTES.pick;

  /* Fotky káv, ktoré po tejto odpovedi ostanú – záložná, stále popisná fotka (čo dostanete). */
  const productPhotos = (a) => E.pool(D, a).map((p) => p.photo).filter(Boolean);
  function photoFor(q, o, used) {
    const next = E.answer(state.answers, q.key, o.value);
    const name = illustration(o.photo);
    const wanted = [];
    if (q.key === 'budget') {
      /* Rozpočet: káva, ktorá sa do limitu zmestí (najdrahšia, ktorá ešte vojde – ukazuje, čo za sumu dostanete). */
      const fit = E.pool(D, next).map((p) => ({p, v: E.packFor(D, p, next)})).filter((x) => x.v).sort((m, n) => n.v.price - m.v.price);
      wanted.push(...fit.map((x) => x.p.photo));
    } else if (name && /^(tool|proc|region|blend)-/.test(name)) wanted.push(PHOTO + name + '.jpg');
    else if (name && /^drip-/.test(name)) wanted.push(D.drip && D.drip.photo);
    else if (o.photo) wanted.push(o.photo);
    if (String(o.value).startsWith('more:')) wanted.push('/assets/scenes/coffee-beans.jpg', '/assets/scenes/coffee-explore.jpg');
    wanted.push(...productPhotos(next), '/assets/scenes/coffee-explore.jpg', '/assets/scenes/coffee-both.jpg', '/assets/scenes/coffee-black.jpg', '/assets/scenes/coffee-beans.jpg');
    const pick = wanted.filter(Boolean).find((src) => !used.has(key(src)));
    if (pick) used.add(key(pick));
    return pick || '/assets/quality-product-placeholder.svg';
  }
  function options(q) {
    const used = new Set();
    const list = q.options.map((o) => ({o, photo: photoFor(q, o, used)}));
    const budget = q.key === 'budget';
    const card = ({o, photo}) => '<button type="button" class="cx-catalogue-option cx-quality-option' + (budget ? ' is-budget-answer' : '') + (String(o.value).startsWith('more:') ? ' is-navigation' : '') + '" data-choice="' + esc(o.value) + '"><span class="cx-quality-photo' + (budget ? ' is-budget-photo' : ' is-scene') + '"><img src="' + esc(photo) + '" alt="" loading="eager" onerror="this.onerror=null;this.src=\'/assets/quality-product-placeholder.svg\'"></span><span class="cx-quality-copy"><b>' + esc(o.title) + '</b><small>' + esc(o.detail || '') + '</small></span></button>';
    return '<div style="--cx-choice-count:' + list.length + '" class="cx-catalogue-options' + (budget ? ' cx-budget-options' : '') + (!budget && list.length === 2 ? ' cx-category-pair' : '') + '" data-count="' + list.length + '">' + list.map(card).join('') + '</div>';
  }

  const shopLink = (u) => '<a href="' + esc(u) + '">' + esc(T('Pozrieť produkt', 'Zobrazit produkt')) + '</a>';
  function productCard(p, label, priceLabel, packLabel, tags, description, primary) {
    return '<article class="cx-quality-product' + (primary ? ' is-primary' : '') + '" data-product-id="' + esc(p.id || '') + '"><div class="cx-quality-product-photo"><img src="' + esc(p.photo || '/assets/quality-product-placeholder.svg') + '" alt="' + esc(p.name) + '" loading="eager" onerror="this.onerror=null;this.src=\'/assets/quality-product-placeholder.svg\'"></div><div class="cx-quality-product-copy"><small>' + esc(label) + '</small><h2>' + esc(p.name) + '</h2>' + (packLabel ? '<p>' + esc(packLabel) + '</p>' : '') + (tags && tags.length ? '<div class="cx-quality-tags">' + tags.map((x) => '<span>' + esc(x) + '</span>').join('') + '</div>' : '') + '<strong>' + esc(priceLabel || T('Cenu potvrdí e-shop', 'Cenu potvrdí e-shop')) + '</strong>' + shopLink(p.url) + '</div>' + (description ? '<p class="cx-product-description">' + esc(description) + '</p>' : '') + '</article>';
  }
  const money = (v, c) => E.money(v, c);
  function result() {
    const r = E.result(D, state.answers);
    if (!r) return {heading: T('Takúto kombináciu v ponuke nemáme', 'Takovou kombinaci v nabídce nemáme'), note: T('Vráťte sa o krok späť a zvoľte inú možnosť.', 'Vraťte se o krok zpět a zvolte jinou možnost.'), content: ''};
    const p = r.product;
    const tags = (r.facts || []).map((f) => f[1]).filter(Boolean).slice(0, 3);
    let content = productCard(p, T('Odporúčam vám', 'Doporučuji vám'), r.priceLabel, r.packLabel, tags, r.kind === 'drip' ? (r.option && r.option.detail) : p.summary, true);
    const why = (r.reasons || []).map(([t, x]) => '<p><b>' + esc(t) + ':</b> ' + esc(x) + '</p>').join('');
    const notes = [r.promoNote, r.grindNote, r.packNote].filter(Boolean).map((x) => '<p class="cx-quality-note">' + esc(x) + '</p>').join('');
    content += '<div class="cx-quality-why"><b>' + esc(T('Prečo práve táto', 'Proč právě tahle')) + '</b>' + why + notes + '</div>';
    let next = '';
    if (r.next && r.next.items && r.next.items.length) next += '<h3>' + esc(r.next.title) + '</h3>' + r.next.items.map((x) => '<p>' + esc(x) + '</p>').join('') + (r.next.link ? '<p><a href="' + esc(r.next.link.href) + '">' + esc(r.next.link.label) + '</a></p>' : '');
    if (r.addon) {
      next += '<p>' + esc(T('Hodí sa k nákupu · voliteľné', 'Hodí se k nákupu · volitelné')) + '</p>' + productCard(r.addon.product, T('Doplnok', 'Doplněk'), money(r.addon.price, p.currency), '', [], r.addon.note || '', false);
      if (r.total != null) next += '<p class="cx-bundle-total"><b>' + esc(T('Spolu za odporúčanú zostavu', 'Celkem za doporučenou sestavu')) + ': ' + esc(money(r.total, p.currency)) + '</b>' + (r.limit != null ? '<small>' + esc(T('V rámci vášho rozpočtu.', 'V rámci vašeho rozpočtu.')) + '</small>' : '') + '</p>';
    }
    if (r.set) next += '<p>' + esc(T('Hotový set od ', 'Hotový set od ') + D.brand.name) + '</p>' + productCard(r.set.product, T('Set s touto kávou', 'Set s touto kávou'), r.set.priceLabel, '', [], r.set.product.summary || '', false);
    if (r.alternative) {
      const alt = r.alternative;
      next += '<p>' + esc(T('Ak by ste chceli inú', 'Pokud byste chtěli jinou')) + (alt.diff && alt.diff.length ? ': ' + esc(alt.diff.join(' · ')) : '') + '</p>' + productCard(alt.product, T('Alternatíva', 'Alternativa'), alt.price, '', [], '', false);
    }
    if (r.shipping) next += '<p>' + esc(r.shipping) + '</p>';
    next += '<p>' + esc(T('Chcete sa opýtať na mletie, chuť alebo porovnať kávy? Pokračujte v chate.', 'Chcete se zeptat na mletí, chuť nebo porovnat kávy? Pokračujte v chatu.')) + '</p><button type="button" class="cx-quality-more" data-result-chat>' + esc(T('Spýtať sa poradcu', 'Zeptat se poradce')) + '</button>';
    content += '<section class="cx-result-next">' + next + '</section><button type="button" class="cx-quality-more" data-restart>' + esc(T('Vybrať znova', 'Vybrat znovu')) + '</button>';
    return {heading: T('Toto vám odporúčam', 'Tohle vám doporučuji'), note: T('Konkrétna káva podľa vašich odpovedí.', 'Konkrétní káva podle vašich odpovědí.'), content};
  }

  function settle() { const copies = [...panel.querySelectorAll('.cx-catalogue-options .cx-quality-copy')]; copies.forEach((c) => { c.style.minHeight = ''; }); const h = Math.max(0, ...copies.map((c) => c.offsetHeight)); copies.forEach((c) => { c.style.minHeight = h + 'px'; }); }
  function render() {
    const q = E.nextQuestion(D, state.answers);
    const done = state.trail.length, total = done + E.maxRemaining(D, state.answers);
    const progress = '<div class="cx-quality-progress"><button type="button" data-back' + (done ? '' : ' disabled') + '>‹ ' + esc(T('Späť', 'Zpět')) + '</button><div>' + Array.from({length: Math.max(total, 1)}, (_, i) => '<span class="' + (i <= done ? 'is-on' : '') + '"></span>').join('') + '</div><b>' + (q ? esc((done + 1) + '. ' + T('krok', 'krok')) : esc(T('Výsledok', 'Výsledek'))) + '</b></div>';
    let small, heading, note, content;
    if (q) { small = q.name; heading = q.title; note = NOTES[q.key] || ''; content = options(q); }
    else { const r = result(); small = T('Váš výber', 'Váš výběr'); heading = r.heading; note = r.note; content = r.content; }
    panel.innerHTML = progress + '<div class="cx-quality-body"><small>' + esc(small) + '</small><h2 tabindex="-1">' + esc(heading) + '</h2>' + (note ? '<p class="cx-quality-intro">' + esc(note) + '</p>' : '') + content + '</div>';
    const body = panel.querySelector('.cx-quality-body');
    body.classList.toggle('is-question', !!q); body.classList.toggle('is-budget', !!q && q.key === 'budget');
    body.scrollTop = 0; requestAnimationFrame(settle); body.querySelector('h2')?.focus({preventScroll: true});
  }
  function mode() { panel.hidden = false; widget.classList.add('cx-catalogue-active'); nav.querySelectorAll('button').forEach((b) => { const on = b.dataset.mode === 'advisor'; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); }); render(); }
  function chat() { panel.hidden = true; widget.classList.remove('cx-catalogue-active'); }
  function restart() { state.answers = {}; state.trail = []; render(); }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.mode === 'chat' || b.dataset.open === 'chat' || b.id === 'cx-open') { chat(); return; }
    if (b.dataset.open === 'advisor' || b.id === 'cx-teaser' || b.closest('.cx-teaser-open')) queueMicrotask(mode);
    if (b.dataset.mode === 'advisor') { e.preventDefault(); e.stopImmediatePropagation(); mode(); return; }
    if (b.id === 'cx-reset' && !panel.hidden) { e.preventDefault(); e.stopImmediatePropagation(); restart(); return; }
    if (!b.closest('.cx-quality-stage')) return;
    if (b.hasAttribute('data-result-chat')) { nav.querySelector('[data-mode="chat"]')?.click(); return; }
    if (b.hasAttribute('data-choice')) { const q = E.nextQuestion(D, state.answers); if (!q) return; state.trail.push(state.answers); state.answers = E.answer(state.answers, q.key, b.dataset.choice); render(); return; }
    if (b.hasAttribute('data-back') && state.trail.length) { state.answers = state.trail.pop(); render(); return; }
    if (b.hasAttribute('data-restart')) restart();
  }, true);
  document.fonts?.ready.then(() => { if (!panel.hidden) settle(); });
  let timer; window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(() => { if (!panel.hidden) settle(); }, 150); });
  /* Tlačidlo na úvodnej stránke môže otvoriť widget skôr, než sa tento modul načíta – prevezmeme jeho režim. */
  const advisorTab = nav.querySelector('[data-mode="advisor"]');
  const follow = () => { const on = advisorTab?.getAttribute('aria-pressed') === 'true'; if (on && panel.hidden) mode(); else if (!on && !panel.hidden) chat(); };
  new MutationObserver(follow).observe(nav, {attributes: true, subtree: true, attributeFilter: ['aria-pressed', 'class']}); follow();
  window.CXCoffeeAdvisorS3 = {state, render};
})();
