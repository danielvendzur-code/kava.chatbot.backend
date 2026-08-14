(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  const icon = (body) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${body}</svg>`;
  const path = (d) => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icons = {
    chat: icon(path('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + path('M8 12h.01M12 12h.01M16 12h.01')),
    spark: icon(path('M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z')),
    refresh: icon(path('M20 11a8 8 0 1 0-2.3 5.7') + path('M20 5v6h-6')),
    close: icon(path('m6 6 12 12M18 6 6 18')),
    back: icon(path('m15 18-6-6 6-6')),
    next: icon(path('m9 18 6-6-6-6')),
    send: icon(path('m4 4 16 8-16 8 3-8-3-8Z') + path('M7 12h13')),
    check: icon(path('m5 12 4 4L19 6')),
    shop: icon(path('M4 9h16l-1 11H5L4 9ZM7 9V6a5 5 0 0 1 10 0v3')),
    web: icon('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + path('M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18')),
    mail: icon(path('M3 6h18v12H3zM3 7l9 7 9-7')),
    home: icon(path('m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6')),
    office: icon(path('M4 21V5h10v16M14 10h6v11M7 9h2M7 13h2M7 17h2M17 14h1M17 18h1')),
    automatic: icon(path('M6 3h12v7H6zM8 10v3h8v-3M5 13h14v8H5zM9 17h6')),
    discovery: icon(path('M12 3a9 9 0 1 0 9 9M12 3v9l6-4M9 16l3-4')),
    strong: icon(path('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
    smooth: icon(path('M5 13c3-7 11-8 14-3-2 7-9 10-14 7 3 0 7-2 9-6')),
    fruity: icon(path('M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5')),
    decaf: icon(path('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01')),
    lever: icon(path('M5 4h11v7H5zM8 11v8M13 11v8M5 19h11M16 7h5')),
    moka: icon(path('M8 3h8l2 6-2 12H8L6 9l2-6ZM6 9h12M18 11h3v5h-4')),
    filter: icon(path('M5 4h14l-5 8v7H10v-7L5 4ZM8 21h8')),
    black: icon(path('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2')),
    milk: icon(path('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: icon(path('M4 6h7v12H4zM13 6h7v12h-7zM6 9h3M15 9h3M6 13h3M15 13h3')),
    arrowUp: icon(path('M12 19V5M6 11l6-6 6 6'))
  };

  function advisorLogo(extraClass = '') {
    return `<svg class="advisor-logo ${extraClass}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path class="advisor-logo__bean advisor-logo__bean--left" d="M11 15c8-8 20-7 24 2 3 7 0 17-8 25L15 54c-7-7-10-15-9-23 .6-6 2-11 5-16Z" fill="currentColor"/>
      <path class="advisor-logo__bean advisor-logo__bean--right" d="M53 15c-8-8-20-7-24 2-3 7 0 17 8 25l12 12c7-7 10-15 9-23-.6-6-2-11-5-16Z" fill="currentColor" opacity=".82"/>
      <path d="M20 20c4 7 8 14 12 24 4-10 8-17 12-24" stroke="var(--surface)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M23 49h15c5 0 9-3 10-8" stroke="var(--surface)" stroke-width="2.6" stroke-linecap="round" opacity=".92"/>
      <circle cx="49" cy="39" r="3" fill="var(--accent)"/>
    </svg>`;
  }

  const requested = new URLSearchParams(location.search).get('demo');
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pathSlug = pathParts.at(-1) || 'praziarnicka';
  const slug = requested || (['index.html', 'ukazka'].includes(pathSlug) ? 'praziarnicka' : pathSlug);
  const demos = window.COFFEE_DEMOS || {};
  const config = demos[slug] || demos.praziarnicka;
  if (!config) { document.body.textContent = 'Ukážka sa nenašla.'; return; }

  const defaults = {
    questions: [
      { key:'prep', name:'Príprava', title:'Ako kávu pripravujete?', options:[['automatic','Automatický kávovar','Rýchla príprava jedným tlačidlom','automatic'],['lever','Pákový kávovar','Espresso pripravujete ručne','lever'],['moka','Moka kanvička','Výrazná domáca príprava','moka'],['filter','Filter','V60, French press alebo prekvapkávanie','filter']] },
      { key:'taste', name:'Chuť', title:'Ktorý chuťový smer vám sedí?', options:[['chocolate','Čokoládová a sladká','Minimum ovocnej acidity','smooth'],['balanced','Vyvážená','Plná chuť bez extrémov','both'],['fruity','Ovocná a svieža','Aromatická výberová káva','fruity'],['strong','Silná a výrazná','Intenzívne telo a dochuť','strong']] },
      { key:'drink', name:'Nápoj', title:'Ako ju pijete najčastejšie?', options:[['black','Čiernu','Espresso, lungo alebo filter','black'],['milk','S mliekom','Cappuccino, flat white alebo latte','milk'],['both','Striedam oboje','Potrebujete univerzálnu kávu','both']] },
      { key:'caffeine', name:'Kofeín', title:'Klasickú alebo bezkofeínovú?', options:[['classic','Klasickú','Bežná káva s kofeínom','strong'],['decaf','Bezkofeínovú','Na večer alebo bez povzbudenia','decaf'],['either','Je mi to jedno','Rozhodnite hlavne podľa chuti','both']] }
    ],
    benefits: [['Pomôže s výberom','Odporučí konkrétnu kávu, nie iba kategóriu.'],['Vysvetlí rozdiely','Preloží aciditu, mletie aj prípravu do bežnej reči.'],['Krátky postup','Štyri voľby bez odbornej bariéry.']]
  };
  const questions = config.questions || defaults.questions;
  const benefits = config.benefits || defaults.benefits;
  const previewProduct = config.products.find((item) => item.id === config.previewProductId) || config.products[0];

  document.documentElement.style.setProperty('--brand', config.primary);
  document.documentElement.style.setProperty('--accent', config.accent);
  document.documentElement.style.setProperty('--surface', config.surface);
  document.documentElement.style.setProperty('--ink', config.ink || config.primary);
  document.title = `${config.brand} – kávový poradca`;

  const root = $('#coffee-demo-root');
  root.innerHTML = `
    <main class="demo-page" aria-label="Kávový poradca ${esc(config.brand)}">
      <header class="demo-header">
        <div class="demo-brand"><span class="demo-brand__mark">${advisorLogo()}</span><span class="demo-brand__copy"><strong>${esc(config.brand)}</strong><small>${esc(config.subbrand)}</small></span></div>
        <a class="demo-tag" href="${esc(config.shopUrl)}" target="_blank" rel="noreferrer">kavavitazov.sk ${icons.next}</a>
      </header>
      <section class="demo-hero">
        <div class="demo-copy">
          <span class="owner-note">${esc(config.ownerGreeting)}</span>
          <h1>${esc(config.headline)}</h1>
          <p>${esc(config.intro)}</p>
          <div class="demo-benefits">${benefits.map(([title, text], index) => `<article class="demo-benefit"><span>${String(index + 1).padStart(2,'0')}</span><div><b>${esc(title)}</b><small>${esc(text)}</small></div></article>`).join('')}</div>
          <div class="demo-actions"><button class="primary-action" id="heroOpen" type="button">Vyskúšať výber kávy ${icons.next}</button></div>
        </div>
        <aside class="demo-visual" aria-label="Odporúčaná káva">
          <div class="preview-panel">
            <div class="preview-panel__top"><div><small>Osobné odporúčanie</small><b>${esc(previewProduct.name)}</b></div><span><i></i> pripravené</span></div>
            <div class="preview-product"><div class="preview-pack">${advisorLogo('advisor-logo--pack')}<small>${esc(config.brand)}</small><strong>${esc(previewProduct.name)}</strong></div><div class="preview-product__copy"><span>${esc(previewProduct.price)}</span><h2>${esc(previewProduct.bestFor || previewProduct.reason)}</h2><div>${(previewProduct.tags || []).slice(0,3).map((tag) => `<b>${esc(tag)}</b>`).join('')}</div></div></div>
            <div class="preview-reason"><b>Prečo ho poradca vybral</b><p>${esc(previewProduct.reason)}</p></div>
            <div class="preview-cta">Pozrieť konkrétny produkt ${icons.next}</div>
          </div>
        </aside>
      </section>
      <footer class="demo-footer"><span>Poradca pre jednoduchší výber kávy.</span><a href="${esc(config.shopUrl)}" target="_blank" rel="noreferrer">kavavitazov.sk</a></footer>
    </main>

    <div class="launcher" id="launcher">
      <div class="launcher__teaser" id="launcherTeaser" role="button" tabindex="0" aria-label="Otvoriť kávového poradcu"><button class="launcher__teaser-close" id="closeTeaser" type="button" aria-label="Skryť ukážku">×</button><b>Neviete, ktorú kávu vybrať?</b><span>Štyri voľby a dostanete konkrétny produkt aj dôvod.</span></div>
      <button class="launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">${advisorLogo()}<span class="launcher__status" aria-hidden="true"></span></button>
    </div>

    <section class="widget" id="widget" aria-label="Kávový poradca ${esc(config.brand)}" aria-hidden="true">
      <header class="widget__header"><div class="widget-brand"><span class="widget-brand__mark">${advisorLogo()}</span><span class="widget-brand__copy"><strong>${esc(config.brand)}</strong><small><i></i> Online</small></span></div><div class="widget-actions"><button class="icon-button" id="resetAll" type="button" aria-label="Začať odznova">${icons.refresh}</button><button class="icon-button" id="closeWidget" type="button" aria-label="Zavrieť">${icons.close}</button></div></header>
      <nav class="mode" id="modeSwitch" aria-label="Režim poradcu"><span class="mode__indicator" aria-hidden="true"></span><button class="mode__button is-active" type="button" data-mode="chat">${icons.chat}<b>Opýtať sa</b></button><button class="mode__button" type="button" data-mode="advisor">${icons.spark}<b>Vybrať kávu</b></button></nav>
      <div class="stage">
        <section class="screen is-active" id="chatScreen"><button class="advisor-entry" id="openAdvisor" type="button"><span>${icons.spark}</span><div><b>Nájsť kávu na mieru</b><em>4 otázky · výsledok do minúty</em></div>${icons.next}</button><div class="chat" id="chatMessages" aria-live="polite"></div><div class="chips" id="quickChips"></div><form class="composer" id="chatForm"><input id="chatInput" autocomplete="off" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve"><button type="submit" aria-label="Odoslať">${icons.send}</button></form><div class="support-row" id="supportRow"></div></section>
        <section class="screen" id="advisorScreen"><div class="advisor-progress"><button class="progress-back" id="prevBtn" type="button" aria-label="Predchádzajúca otázka">${icons.back}</button><div><b id="stepLabel">1 z ${questions.length}</b><span id="stepName">${esc(questions[0].name)}</span></div><div class="progress" id="progress"></div></div><div class="advisor" id="advisorBody" aria-live="polite"></div></section>
      </div>
    </section>`;

  const state = { mode:'chat', step:0, answers:{}, stage:'questions', selectedProduct:null, transitioning:false, chatHistory:[], scrollY:0, apiFallbackShown:false };
  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#launcherTeaser');
  const chat = $('#chatMessages');
  const advisor = $('#advisorBody');
  const modeSwitch = $('#modeSwitch');

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent('coffee-demo', { detail:{ name, demoId:config.id, ...detail } }));
    try { const events = JSON.parse(sessionStorage.getItem('coffee-demo-events') || '[]'); events.push({ name, demoId:config.id, detail, at:Date.now() }); sessionStorage.setItem('coffee-demo-events', JSON.stringify(events.slice(-80))); } catch (_) {}
  }

  function lockPage() {
    state.scrollY = window.scrollY;
    document.body.style.top = `-${state.scrollY}px`;
    document.body.classList.add('widget-open');
  }
  function unlockPage() {
    document.body.classList.remove('widget-open');
    document.body.style.top = '';
    window.scrollTo(0, state.scrollY);
  }
  function openWidget() {
    widget.classList.add('is-open'); widget.setAttribute('aria-hidden','false'); $('#openWidget').setAttribute('aria-expanded','true'); launcher.hidden = true; lockPage(); teaser.classList.remove('is-visible');
    widget.querySelector('.advisor-logo')?.classList.add('is-building'); setTimeout(() => widget.querySelector('.advisor-logo')?.classList.remove('is-building'), 900); emit('widget_open');
  }
  function closeWidget() {
    widget.classList.remove('is-open'); widget.setAttribute('aria-hidden','true'); $('#openWidget').setAttribute('aria-expanded','false'); unlockPage(); setTimeout(() => { launcher.hidden = false; }, 220); emit('widget_close');
  }
  function setMode(mode) {
    state.mode = mode; modeSwitch.classList.toggle('is-advisor', mode === 'advisor'); $$('.mode__button').forEach((b) => b.classList.toggle('is-active', b.dataset.mode === mode)); $('#chatScreen').classList.toggle('is-active', mode === 'chat'); $('#advisorScreen').classList.toggle('is-active', mode === 'advisor');
    if (mode === 'advisor') renderAdvisor(); emit('mode_change', { mode });
  }
  // No timestamps and no "overená lokálna odpoveď" plumbing note: a customer is
  // buying coffee, not reading a transport log.
  function addMessage(text, user = false, fallback = false) {
    const row = document.createElement('div'); row.className = `message${user ? ' message--user' : ''}${fallback ? ' message--fallback' : ''}`;
    row.innerHTML = `${user ? '' : `<span class="message__avatar">${advisorLogo()}</span>`}<div><div class="bubble">${text}</div></div>`;
    chat.appendChild(row); requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }
  function showTyping() { const row = document.createElement('div'); row.id='typingRow'; row.className='message'; row.innerHTML=`<span class="message__avatar">${advisorLogo()}</span><div><div class="bubble typing"><i></i><i></i><i></i></div></div>`; chat.appendChild(row); }

  function scoreProduct(product) {
    let score = 0;
    for (const [key, value] of Object.entries(state.answers)) {
      if (product[key]?.includes(value)) score += key === 'taste' ? 5 : key === 'use' ? 4 : 3;
      else if (key === 'taste' && value === 'decaf' && product.id !== 'decaf') score -= 20;
      else if (key === 'prep' && product.prep && !product.prep.includes(value)) score -= 2;
    }
    if (state.answers.taste === 'decaf' && product.id === 'decaf') score += 30;
    if (state.answers.use === 'office' && product.id === 'office') score += 8;
    if (state.answers.use === 'automatic' && product.id === 'office') score += 5;
    if (state.answers.use === 'discovery' && product.id === 'ethiopia') score += 8;
    return score;
  }
  function rankings() { return config.products.map((p, order) => ({ ...p, order, score:scoreProduct(p) })).sort((a,b) => b.score - a.score || a.order - b.order); }

  function fallbackAnswer(text) {
    const q = text.toLowerCase(); const list = config.products;
    const byId = (id) => list.find((p) => p.id === id);
    if (config.id === 'vitazov') {
      if (q.includes('kancel') || q.includes('automat')) return `Na praktickú každodennú prevádzku odporúčam <b>${byId('office').name}</b>: plné telo, nízka acidita a dobrá čitateľnosť aj v mlieku.`;
      if (q.includes('bez') || q.includes('večer')) return `Najpresnejšia voľba je <b>${byId('decaf').name}</b>. Je to 100 % arabika bez kofeínu a funguje v automate, páke, moka aj na filtri.`;
      if (q.includes('ovoc') || q.includes('filter')) return `Na objavovanie a ovocnejší filter vyberte <b>${byId('ethiopia').name}</b>. Ide o výberovú 100 % arabiku zo Sidama.`;
      if (q.includes('arab')) return `Pre jemnejšiu univerzálnu 100 % arabiku odporúčam <b>${byId('victory').name}</b>; sladšia single-origin alternatíva je <b>${byId('brazil').name}</b>.`;
    }
    const ranked = rankings(); return `Najlepšie vám poradí krátky výber. Aktuálne by som začal produktom <b>${ranked[0].name}</b>.`;
  }
  async function requestAI(text) {
    state.chatHistory.push({ role:'user', content:text });
    const response = await fetch('/api/chat', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ demoId:config.id, messages:state.chatHistory.slice(-10) }) });
    if (!response.ok) throw new Error('AI unavailable'); const data = await response.json(); if (!data.reply) throw new Error('Empty reply'); state.chatHistory.push({ role:'assistant', content:data.reply }); return data.reply;
  }
  async function sendChat(text, chip) {
    const value = text.trim(); if (!value) return; addMessage(esc(value), true); $('#chatInput').value=''; showTyping();
    try { const reply = await requestAI(value); $('#typingRow')?.remove(); addMessage(reply); }
    catch (_) { await new Promise((r) => setTimeout(r, 320)); $('#typingRow')?.remove(); addMessage(fallbackAnswer(value), false, true); state.apiFallbackShown = true; }
    finally { chip?.classList.remove('is-sending'); }
  }

  function renderChips() {
    $('#quickChips').innerHTML = config.quick.map((label) => `<button class="chip" type="button"><span>${esc(label)}</span></button>`).join('');
    $$('.chip').forEach((button) => button.addEventListener('click', () => { if (button.classList.contains('is-sending')) return; button.classList.add('is-sending'); sendChat(button.textContent.trim(), button); }));
  }
  function renderSupport() {
    const items = [{label:'E-shop',href:config.shopUrl,icon:icons.shop},{label:'Kontakt',href:config.contactUrl || config.shopUrl,icon:icons.web}];
    if (config.email) items.push({label:'E-mail',href:`mailto:${config.email}`,icon:icons.mail}); else if (config.phone) items.push({label:'Zavolať',href:`tel:${config.phone}`,icon:icons.chat}); else items.push({label:'Web',href:config.shopUrl,icon:icons.web});
    $('#supportRow').innerHTML = items.map((item) => `<a href="${esc(item.href)}" ${item.href.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>${item.icon}<span>${esc(item.label)}</span></a>`).join('');
  }

  function updateProgress() {
    const result = state.stage === 'result'; $('#stepLabel').textContent = result ? 'Výsledok' : `${state.step + 1} z ${questions.length}`; $('#stepName').textContent = result ? 'Vaša káva' : questions[state.step].name; $('#prevBtn').disabled = state.stage === 'questions' && state.step === 0;
    $('#progress').innerHTML = questions.map((_, i) => `<i class="${result || i < state.step ? 'is-done ' : ''}${!result && i === state.step ? 'is-active' : ''}"></i>`).join('');
  }
  function renderQuestion() {
    const q = questions[state.step]; const selected = state.answers[q.key];
    advisor.innerHTML = `<div class="question"><span>${esc(q.name)}</span><h2>${esc(q.title)}</h2></div><div class="options ${selected ? 'has-selection' : ''}">${q.options.map(([value,label,desc,iconName], index) => `<button class="option ${selected === value ? 'is-selected' : ''}" type="button" data-value="${esc(value)}" aria-pressed="${selected === value}" style="--delay:${index * 55}ms"><span class="option__photo option__photo--${esc(value)}">${icons[iconName] || icons.spark}</span><span class="option__copy"><b>${esc(label)}</b><small>${esc(desc)}</small></span><span class="option__state">${selected === value ? icons.check : icons.next}</span></button>`).join('')}</div>`;
    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => selectAnswer(button.dataset.value)));
  }
  function selectAnswer(value) {
    if (state.stage !== 'questions' || state.transitioning) return;
    const q = questions[state.step];
    state.transitioning = true;
    state.answers[q.key] = value;
    $$('.option', advisor).forEach((button) => {
      const selected = button.dataset.value === value;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.disabled = true;
      button.querySelector('.option__state').innerHTML = selected ? icons.check : icons.next;
    });
    emit('advisor_answer',{step:q.key,value});
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 300;
    setTimeout(advanceQuestion, delay);
  }
  function advanceQuestion() {
    const q = questions[state.step];
    if (!state.answers[q.key]) { state.transitioning = false; return; }
    if (state.step < questions.length - 1) state.step += 1; else state.stage = 'result';
    state.transitioning = false;
    renderAdvisor();
  }

  function productVisual(product) { return `<div class="product-visual">${advisorLogo('advisor-logo--pack')}<small>${esc(config.brand)}</small><strong>${esc(product.name)}</strong><i></i></div>`; }
  function detailItem(label, value, iconName) { return `<div class="result-detail"><span>${icons[iconName] || icons.check}</span><div><small>${esc(label)}</small><b>${esc(value)}</b></div></div>`; }
  function renderOfficeFollowup(product) {
    if (config.id !== 'vitazov' || state.answers.use !== 'office') return '';
    return `<div class="office-followup"><div><span>Voliteľne pre firmu</span><b>Aká je približná mesačná spotreba?</b><small>Odporúčanie už máte. Toto iba spresní ďalší kontakt.</small></div><div class="usage-options"><button type="button" data-usage="do 1 kg">do 1 kg</button><button type="button" data-usage="1–3 kg">1–3 kg</button><button type="button" data-usage="4+ kg">4+ kg</button></div><a href="${esc(config.businessUrl || config.contactUrl)}" target="_blank" rel="noreferrer">Pozrieť riešenie pre firmy ${icons.next}</a></div>`;
  }
  function renderResult() {
    const list = rankings(); const best = list[0]; state.selectedProduct = state.selectedProduct || best.id; const product = list.find((p) => p.id === state.selectedProduct) || best; const alternative = list.find((p) => p.id === product.alternativeId) || list.find((p) => p.id !== product.id);
    advisor.innerHTML = `<div class="result-head"><span>Osobné odporúčanie</span><h2>${esc(product.name)}</h2><p>Výber vychádza zo všetkých štyroch odpovedí.</p></div><section class="result-card"><div class="result-main">${productVisual(product)}<div class="result-main__copy"><span>${esc(product.price)}</span><h3>${esc(product.origin)}</h3><div class="taste-tags">${(product.tags||[]).map((tag)=>`<b>${esc(tag)}</b>`).join('')}</div></div></div><div class="result-details">${detailItem('Pre koho', product.bestFor || product.reason, 'home')}${detailItem('Do čoho', product.machines || 'Podľa zvoleného mletia', 'automatic')}${detailItem('Chuť', typeof product.profile === 'string' ? product.profile : (product.tags||[]).join(' · '), 'smooth')}</div><div class="reason"><span>${icons.check}</span><div><b>Prečo práve táto</b><p>${esc(product.reason)}</p></div></div><div class="result-actions"><a class="result-button result-button--primary" href="${esc(product.url || config.shopUrl)}" target="_blank" rel="noreferrer">Pozrieť produkt ${icons.next}</a><button class="result-button result-button--secondary" id="restartResult" type="button">Zmeniť odpovede</button></div>${alternative ? `<div class="alternative"><div><small>Rozumná alternatíva</small><b>${esc(alternative.name)}</b><span>${esc(alternative.tags?.slice(0,2).join(' · ') || alternative.origin)}</span></div><button type="button" data-product="${esc(alternative.id)}">Zobraziť ${icons.next}</button></div>` : ''}${renderOfficeFollowup(product)}</section>`;
    $('#restartResult').addEventListener('click', resetAdvisor); $('.alternative button', advisor)?.addEventListener('click', (e) => { state.selectedProduct=e.currentTarget.dataset.product; renderResult(); });
    $$('.usage-options button', advisor).forEach((button) => button.addEventListener('click', () => { $$('.usage-options button', advisor).forEach((b)=>b.classList.toggle('is-selected', b===button)); emit('office_usage',{usage:button.dataset.usage, product:product.name}); }));
    advisor.querySelector('.advisor-logo')?.classList.add('is-confirmed'); emit('recommendation_view',{product:product.name});
  }
  function renderAdvisor() { updateProgress(); if (state.stage === 'questions') renderQuestion(); else renderResult(); advisor.scrollTop=0; }
  function resetAdvisor() { state.step=0; state.answers={}; state.stage='questions'; state.selectedProduct=null; state.transitioning=false; renderAdvisor(); }
  function seedChat() { chat.innerHTML=''; state.chatHistory=[]; addMessage(esc(config.welcome)); }
  function resetAll() { resetAdvisor(); seedChat(); setMode('chat'); }

  $('#heroOpen').addEventListener('click', openWidget); $('#openWidget').addEventListener('click', openWidget); $('#closeWidget').addEventListener('click', closeWidget); $('#resetAll').addEventListener('click', resetAll); $('#openAdvisor').addEventListener('click', () => setMode('advisor')); $$('.mode__button').forEach((b)=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  teaser.addEventListener('click', (event) => { if (!event.target.closest('#closeTeaser')) openWidget(); }); teaser.addEventListener('keydown', (event) => { if (['Enter',' '].includes(event.key)) { event.preventDefault(); openWidget(); } }); $('#closeTeaser').addEventListener('click', (event)=>{event.stopPropagation(); teaser.classList.remove('is-visible');});
  $('#chatForm').addEventListener('submit',(event)=>{event.preventDefault();sendChat($('#chatInput').value);}); $('#prevBtn').addEventListener('click',()=>{ if(state.stage==='result'){state.stage='questions';state.step=questions.length-1;} else if(state.step>0)state.step-=1;state.transitioning=false;renderAdvisor(); });
  document.addEventListener('keydown',(event)=>{ if(event.key==='Escape' && widget.classList.contains('is-open')) closeWidget(); });

  renderSupport(); renderChips(); seedChat(); renderAdvisor(); setTimeout(()=>teaser.classList.add('is-visible'),800);

  const qa = new URLSearchParams(location.search).get('qa');
  if (qa) {
    const presets = {
      office:{use:'office',taste:'strong',prep:'automatic',drink:'both'},
      home:{use:'home',taste:'smooth',prep:'automatic',drink:'black'},
      decaf:{use:'home',taste:'decaf',prep:'automatic',drink:'both'},
      discovery:{use:'discovery',taste:'fruity',prep:'filter',drink:'black'}
    };
    if (qa === 'chat') { openWidget(); setMode('chat'); }
    else if (qa === 'advisor') { openWidget(); setMode('advisor'); }
    else if (presets[qa]) { state.answers={...presets[qa]}; state.stage='result'; openWidget(); setMode('advisor'); renderAdvisor(); }
  }
})();
