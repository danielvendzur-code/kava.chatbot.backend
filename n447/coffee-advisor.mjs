/* Rozhranie novej dávky kávových ukážok (447 € + 10 €/mes.). Izolované od starších ukážok:
   žiadne zdieľané úložisko, žiadny prepínač iných firiem, vlastný API endpoint. */
import {nextQuestion, result, answer, maxRemaining, money} from './coffee-engine.mjs';
import {coffeeReply} from './coffee-reply.mjs';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const I = {back: svg('M15 18l-6-6 6-6'), close: svg('M6 6l12 12M18 6L6 18'), reset: svg('M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19 4v4.5h-4.5'), send: svg('M4.5 12h13M4.5 12 3 4.5 20.5 12 3 19.5 4.5 12Z'), cup: svg('M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8ZM16 10h1.8a2.2 2.2 0 0 1 0 4.4H16M4 22h13'), out: svg('M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4')};

export function mount(data, {root = document.getElementById('app'), api = '/api/chat-447'} = {}) {
  const B = data.brand;
  const state = {answers: {}, history: [], page: 0, chosen: null, busy: false, chat: [], generation: 0};
  const coffees = data.products.filter((p) => p.available !== false);
  const shots = ['doce-citrus', 'gotiti', 'hospura'].map((id) => coffees.find((p) => p.id === id)).filter(Boolean);
  document.documentElement.lang = data.lang;
  document.documentElement.dataset.demo = data.slug;

  root.innerHTML = `
  <main class="n447-page">
    <header class="n447-top"><img src="${esc(B.logo)}" alt="${esc(B.name)}" width="108" height="34"><span class="n447-flag">Ukážka poradcu · ${esc(B.name)}</span></header>
    <section class="n447-hero">
      <div>
        <span class="n447-eyebrow">Návrh pre ${esc(B.legal)}</span>
        <h1>Poradca, ktorý zákazníkovi vyberie kávu z vašej ponuky</h1>
        <p class="n447-lead">Pracuje s ${coffees.length} kávami a drip vrecúškami z e-shopu ${esc(B.name)} (overené ${esc(data.checkedAt.split('-').reverse().map(Number).join('. '))}). Pýta sa len to, čo naozaj mení výber, a skončí konkrétnou kávou s prípravou, pražením a odkazom na produkt.</p>
        <button class="n447-cta" id="heroOpen" type="button">Vyskúšať poradcu ${I.cup}</button>
      </div>
      <div class="n447-shots">${shots.map((p) => `<figure><img src="${esc(p.photo)}" alt="${esc(p.name)}" width="300" height="300" loading="lazy"></figure>`).join('')}</div>
    </section>
    <section class="n447-owner" aria-label="Čo poradca robí">
      <article><b>Krátky výber podľa potreby</b><p>Príprava, kofeín, chuť a rozpočet. Keď sa hodí viac káv naraz, poradca sa opýta na konkrétne chuťové tóny.</p></article>
      <article><b>Úplné odporúčanie</b><p>Pôvod, spracovanie, aké praženie a mletie zvoliť, alternatíva s vysvetleným rozdielom a postup prípravy.</p></article>
      <article><b>Chat nad vašou ponukou</b><p>Odpovedá na otázky o kávach, príprave a doprave iba z overených údajov vášho e-shopu.</p></article>
    </section>
    <section class="n447-offer" aria-label="Cena"><strong>447 € jednorazovo + 10 € mesačne</strong><span>Nastavenie pre vašu značku, overenie sortimentu a vloženie na váš web. Prevádzka 10 € mesačne.</span></section>
    <p class="n447-by">Ukážku pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noopener">mojchatbot.sk</a>. Kontakt pražiarne použitý v ukážke: ${esc(B.contact)}.</p>
  </main>
  <button class="n447-launcher" id="launch" type="button" aria-controls="w" aria-expanded="false">${I.cup}<span>Poradím s kávou</span></button>
  <section class="n447-w" id="w" role="dialog" aria-modal="true" aria-label="Poradca ${esc(B.name)}" tabindex="-1">
    <header class="n447-head">
      <div class="brand"><img src="${esc(B.logo)}" alt="${esc(B.name)}" width="76" height="24"><small><i></i>online poradca</small></div>
      <div class="n447-icons"><button class="n447-icon" id="reset" type="button" aria-label="Začať odznova">${I.reset}</button><button class="n447-icon" id="close" type="button" aria-label="Zavrieť poradcu">${I.close}</button></div>
    </header>
    <div class="n447-tabs" role="tablist"><button class="n447-tab" role="tab" id="tabA" aria-selected="true" aria-controls="scrA">Výber kávy</button><button class="n447-tab" role="tab" id="tabC" aria-selected="false" aria-controls="scrC">Chat</button></div>
    <section class="n447-screen" id="scrA" role="tabpanel" aria-labelledby="tabA">
      <div class="n447-bar"><button class="n447-back" id="back" type="button">${I.back}Späť</button><div class="n447-prog" aria-hidden="true"><i id="prog"></i></div><span class="n447-step" id="step"></span></div>
      <div class="n447-body" id="body" aria-live="polite"></div>
      <div class="n447-foot" id="foot" hidden></div>
    </section>
    <section class="n447-screen" id="scrC" role="tabpanel" aria-labelledby="tabC" hidden>
      <div class="n447-chat" id="log" role="log" aria-live="polite"></div>
      <div class="n447-chips" id="chips"></div>
      <form class="n447-form" id="form"><input id="input" type="text" autocomplete="off" placeholder="Napíšte otázku o káve" aria-label="Otázka o káve"><button type="submit" aria-label="Odoslať">${I.send}</button></form>
    </section>
    <p class="n447-note"><a href="https://mojchatbot.sk" target="_blank" rel="noopener">mojchatbot.sk</a></p>
  </section>`;

  const $ = (s) => root.querySelector(s);
  const w = $('#w'), body = $('#body'), foot = $('#foot');
  let lastFocus = null;

  function open() { lastFocus = document.activeElement; w.classList.add('is-open'); $('#launch').hidden = true; $('#launch').setAttribute('aria-expanded', 'true'); document.body.classList.add('n447-open'); requestAnimationFrame(() => w.focus()); }
  function close() { w.classList.remove('is-open'); $('#launch').hidden = false; $('#launch').setAttribute('aria-expanded', 'false'); document.body.classList.remove('n447-open'); (lastFocus instanceof HTMLElement ? lastFocus : $('#launch')).focus(); }
  function tab(chat) {
    $('#tabA').setAttribute('aria-selected', String(!chat)); $('#tabC').setAttribute('aria-selected', String(chat));
    $('#scrA').hidden = chat; $('#scrC').hidden = !chat;
    if (chat && matchMedia('(min-width:561px)').matches) $('#input').focus();
  }

  /* ----- výber ----- */
  const answeredKeys = () => Object.keys(state.answers);
  function render() {
    const q = nextQuestion(data, state.answers);
    const done = answeredKeys().length;
    const left = q ? maxRemaining(data, state.answers) : 0;
    $('#back').disabled = done === 0 && !!q;
    $('#prog').style.width = q ? Math.round(100 * done / (done + left)) + '%' : '100%';
    $('#step').textContent = q ? `Krok ${done + 1}` + (left > 1 ? ` · ešte najviac ${left - 1}` : ' · posledný') : 'Odporúčanie';
    body.scrollTop = 0;
    if (q) renderQuestion(q); else renderResult();
  }
  function renderQuestion(q) {
    body.classList.remove('is-result'); foot.hidden = true; foot.innerHTML = '';
    const size = q.pageSize || 4, pages = Math.ceil(q.options.length / size);
    state.page = Math.min(state.page, pages - 1);
    const opts = q.options.slice(state.page * size, state.page * size + size);
    const chosen = state.answers[q.key];
    body.innerHTML = `<h2 class="n447-q">${esc(q.title)}</h2>${q.key === 'pick' ? '<p class="n447-sub">Tieto kávy sa hodia rovnako dobre; líšia sa chuťou.</p>' : ''}
      <div class="n447-opts" role="group" aria-label="${esc(q.title)}">${opts.map((o) => `<button type="button" class="n447-opt${q.layout === 'photo' && o.photo ? '' : ' text'}" data-v="${esc(o.value)}" aria-pressed="${chosen === o.value}">
        ${q.layout === 'photo' && o.photo ? `<span class="ph${o.contain ? ' contain' : ''}"><img src="${esc(o.photo)}" alt="" width="84" height="64"></span>` : ''}
        <span class="tx"><b>${esc(o.title)}</b><small>${esc(o.detail)}</small></span></button>`).join('')}</div>
      ${pages > 1 ? `<div class="n447-pager"><button type="button" id="prev" ${state.page ? '' : 'disabled'}>Predchádzajúce</button><span>${state.page + 1} / ${pages}</span><button type="button" id="next" ${state.page < pages - 1 ? '' : 'disabled'}>Ďalšie tóny</button></div>` : ''}`;
    body.querySelectorAll('.n447-opt').forEach((b) => b.addEventListener('click', () => choose(q.key, b.dataset.v)));
    $('#prev')?.addEventListener('click', () => { state.page--; renderQuestion(q); });
    $('#next')?.addEventListener('click', () => { state.page++; renderQuestion(q); });
  }
  function choose(key, value) {
    if (state.busy) return;
    state.busy = true;
    state.answers = answer(state.answers, key, value);
    state.chosen = null; state.page = 0;
    setTimeout(() => { state.busy = false; render(); }, 160);
  }
  function back() {
    const keys = answeredKeys();
    if (!keys.length) return;
    const last = keys[keys.length - 1];
    const a = {...state.answers}; delete a[last];
    state.answers = a; state.chosen = null; state.page = 0; render();
  }
  function renderResult() {
    let r = result(data, state.answers);
    body.classList.add('is-result');
    if (!r) { body.innerHTML = '<div class="n447-res"><h2>Takú kombináciu v ponuke nemáme</h2><p class="sum">Skúste zmeniť niektorú odpoveď.</p></div>'; return; }
    if (state.chosen && r.alternative && state.chosen === r.alternative.product.id) {
      /* Zákazník si otvoril alternatívu: zobrazí sa ako hlavná, pôvodná ako alternatíva. */
      const pick = r.product; r = result(data, {...state.answers, pick: state.chosen, budget: r.alternative.note ? 'any' : state.answers.budget}) || r;
      if (r.product.id !== pick.id) r.alternative = {product: pick, diff: [], note: 'pôvodné odporúčanie', back: true};
    }
    const p = r.product;
    const isDrip = r.kind === 'drip';
    body.innerHTML = `<div class="n447-res">
      <span class="badge">${state.chosen ? 'Vaša voľba' : 'Odporúčam vám'}</span>
      <div class="hero"><img src="${esc(p.photo)}" alt="${esc(p.name)}" width="104" height="104">
        <div><h2>${esc(p.name)}</h2><p class="origin">${esc(isDrip ? r.option.title : [p.origin, p.process].filter(Boolean).join(' · '))}</p>
        <div class="price">${esc(r.priceLabel)}<small>${esc(isDrip ? r.pack : 'presná cena podľa balenia a mletia v e-shope')}</small></div></div></div>
      <p class="sum">${esc(p.summary)}</p>
      ${r.promoNote ? `<p class="ship">${esc(r.promoNote)}</p>` : ''}
      <h3>Prečo práve táto</h3><ul class="reasons">${r.reasons.map(([t, d]) => `<li><b>${esc(t)}</b>${esc(d)}</li>`).join('')}</ul>
      <h3>Pri objednávke zvoľte</h3><dl class="order">${r.order.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      ${r.facts?.length ? `<h3>O káve</h3><dl>${r.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>` : ''}
      ${r.alternative ? `<h3>${r.alternative.back ? 'Pôvodné odporúčanie' : 'Ak chcete inú'}</h3><button class="alt" type="button" id="alt" data-id="${esc(r.alternative.product.id)}"><img src="${esc(r.alternative.product.photo)}" alt="" width="52" height="52" loading="lazy"><span><b>${esc(r.alternative.product.name)}</b><small>${esc([r.alternative.diff.join('; '), r.alternative.note].filter(Boolean).join(' · ') || 'od ' + money(r.alternative.product.priceFrom, r.alternative.product.currency))}</small></span></button>` : ''}
      <h3>${esc(r.next.title)}</h3><ol>${r.next.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
      ${r.next.link ? `<p class="more"><a href="${esc(r.next.link.href)}" target="_blank" rel="noopener">${esc(r.next.link.label)} ↗</a></p>` : ''}
      ${r.shipping ? `<p class="ship">${esc(r.shipping)}</p>` : ''}
    </div>`;
    foot.hidden = false;
    foot.innerHTML = `<a href="${esc(p.url)}" target="_blank" rel="noopener" id="cta">Pozrieť produkt ${I.out}</a><button type="button" id="again">Znova</button>`;
    $('#again').addEventListener('click', reset);
    $('#alt')?.addEventListener('click', (e) => { const id = e.currentTarget.dataset.id; state.chosen = r.alternative.back ? null : id; render(); });
  }
  function reset() { state.answers = {}; state.chosen = null; state.page = 0; render(); }

  /* ----- chat ----- */
  const shopHost = new URL(B.web).hostname;
  const linkify = (text) => esc(text).replace(/https:\/\/[^\s<]+/g, (u) => { const clean = u.replace(/[.,;)]+$/, ''); const tail = u.slice(clean.length); let host = ''; try { host = new URL(clean.replace(/&amp;/g, '&')).hostname; } catch {} return host === shopHost ? `<a href="${clean}" target="_blank" rel="noopener">Pozrieť v e-shope ↗</a>${tail}` : u; }).replace(/\n/g, '<br>');
  function say(html, me = false) { const d = document.createElement('div'); d.className = 'n447-msg' + (me ? ' me' : ''); d.innerHTML = html; $('#log').append(d); $('#log').scrollTop = $('#log').scrollHeight; return d; }
  async function ask(text) {
    const v = String(text || '').trim();
    if (!v || state.chatBusy) return;
    state.chatBusy = true; const gen = state.generation;
    say(esc(v), true); $('#input').value = ''; $('#chips').hidden = true;
    const typing = say('Píšem odpoveď…'); typing.classList.add('typing');
    const prior = state.history.slice();
    state.history.push({role: 'user', content: v});
    const offline = coffeeReply(data, v, prior);
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 12000);
    const remote = fetch(api, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({demoId: data.slug, messages: state.history.slice(-10)}), signal: ctrl.signal})
      .then((r) => r.ok ? r.json() : null).then((j) => j && typeof j.reply === 'string' && j.reply.trim() ? j.reply : null).catch(() => null).finally(() => clearTimeout(timer));
    const first = await Promise.race([remote, new Promise((res) => setTimeout(() => res(undefined), 4500))]);
    if (gen !== state.generation) return;
    const shown = first || offline;
    typing.classList.remove('typing'); typing.innerHTML = linkify(shown);
    const entry = {role: 'assistant', content: shown}; state.history.push(entry);
    state.chatBusy = false;
    if (first === undefined) { const late = await remote; if (late && gen === state.generation) { typing.innerHTML = linkify(late); entry.content = late; } }
  }
  function seed() {
    state.generation++; state.chatBusy = false; state.history = []; $('#log').innerHTML = '';
    say(esc(`Dobrý deň, poradím s výberom kávy z ponuky ${B.name}. Opýtajte sa na chuť, prípravu alebo konkrétnu kávu.`));
    $('#chips').hidden = false; $('#chips').innerHTML = ['Čo do automatu?', 'Káva na V60', 'Máte kávu bez kofeínu?'].map((c) => `<button type="button">${esc(c)}</button>`).join('');
    $('#chips').querySelectorAll('button').forEach((b) => b.addEventListener('click', () => ask(b.textContent)));
  }

  $('#heroOpen').addEventListener('click', open); $('#launch').addEventListener('click', open); $('#close').addEventListener('click', close);
  $('#reset').addEventListener('click', () => { reset(); seed(); tab(false); });
  $('#back').addEventListener('click', back);
  $('#tabA').addEventListener('click', () => tab(false)); $('#tabC').addEventListener('click', () => tab(true));
  $('#form').addEventListener('submit', (e) => { e.preventDefault(); ask($('#input').value); });
  document.addEventListener('keydown', (e) => {
    if (!w.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = [...w.querySelectorAll('button:not([disabled]),a[href],input')].filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    if (e.shiftKey && (document.activeElement === items[0] || document.activeElement === w)) { e.preventDefault(); items.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0].focus(); }
  });
  seed(); render();
  document.documentElement.dataset.ready = 'true';
  return {state, open, ask, render};
}
