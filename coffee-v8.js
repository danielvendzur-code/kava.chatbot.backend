(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const path = (d) => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icon = (body) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${body}</svg>`;

  const icons = {
    chat: icon(path('M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z') + path('M8 12h.01M12 12h.01M16 12h.01')),
    spark: icon(path('M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z') + path('M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z')),
    question: icon('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + path('M9.8 9a2.3 2.3 0 1 1 3.7 1.8c-.9.6-1.5 1-1.5 2.2M12 17h.01')),
    quiz: icon(path('M5 4h14v16H5zM8 8h8M8 12h5M8 16h3')),
    solve: icon(path('M4 13l5-5 4 4 7-7M16 5h4v4')),
    refresh: icon(path('M20 11a8 8 0 1 0-2.3 5.7') + path('M20 5v6h-6')),
    close: icon(path('m6 6 12 12M18 6 6 18')),
    back: icon(path('m15 18-6-6 6-6')),
    next: icon(path('m9 18 6-6-6-6')),
    send: icon(path('m4 4 16 8-16 8 3-8-3-8Z') + path('M7 12h13')),
    check: icon(path('m5 12 4 4L19 6')),
    shop: icon(path('M4 9h16l-1 11H5L4 9ZM7 9V6a5 5 0 0 1 10 0v3')),
    web: icon('<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.9"/>' + path('M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18')),
    phone: icon(path('M7.2 3.5 4.7 5.8c-.8.8-.4 3.4 2.8 6.7 3.3 3.3 5.9 3.7 6.7 2.8l2.3-2.5-3-2-1.7 1.7c-1.2-.5-2.3-1.4-3.2-2.3-.9-.9-1.8-2-2.3-3.2L8 5.3l-.8-1.8Z')),
    bulb: icon(path('M9 18h6M10 21h4M8.2 14.5A7 7 0 1 1 15.8 14.5c-.7.6-1 1.3-1 2.5H9.2c0-1.2-.3-1.9-1-2.5Z')),
    chocolate: icon(path('M5 5h14v14H5zM9.7 5v14M14.3 5v14M5 9.7h14M5 14.3h14')),
    balanced: icon(path('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
    fruity: icon(path('M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5')),
    strong: icon(path('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
    black: icon(path('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2')),
    milk: icon(path('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: icon('<path d="M4 6h7v12H4zM13 6h7v12h-7z" stroke="currentColor" stroke-width="1.9"/>' + path('M6 9h3M15 9h3M6 13h3M15 13h3')),
    classic: icon(path('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
    decaf: icon(path('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01')),
    either: icon(path('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3'))
  };

  function advisorLogo() {
    return `<svg class="advisor-logo" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 5.5C17.3 5.5 6 15.9 6 29.4c0 7.5 3.6 14.1 9.6 18.5L13 57.6l10.6-5.2c2.7.7 5.5 1.1 8.4 1.1 14.8 0 26-10.4 26-24.1S46.8 5.5 32 5.5Z" fill="currentColor"/>
      <path d="M24.2 37.6c0-10.2 6.2-17.6 14-17.6 6.1 0 10.7 4.7 10.7 11.2 0 9.6-7.5 17.8-16.3 18.5-4.8.4-8.4-4.7-8.4-12.1Z" fill="var(--surface)"/>
      <path d="M30.5 45.9c7.4-5.5 10.2-12.6 9.8-21" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M17.4 26.2c3.8.3 6.9 1.9 9.1 4.8" stroke="var(--surface)" stroke-width="2.7" stroke-linecap="round"/>
    </svg>`;
  }

  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastPath = pathParts.at(-1) || 'praziarnicka';
  const slug = lastPath === 'index.html' || lastPath === 'ukazka' ? 'praziarnicka' : lastPath;
  const demos = window.COFFEE_DEMOS || {};
  const config = demos[slug] || demos.praziarnicka;

  if (!config) {
    document.body.textContent = 'Ukážka sa nenašla.';
    return;
  }

  document.documentElement.style.setProperty('--brand', config.primary);
  document.documentElement.style.setProperty('--accent', config.accent);
  document.documentElement.style.setProperty('--surface', config.surface);
  document.title = `${config.brand} – návrh kávového poradcu`;

  const root = $('#coffee-demo-root');
  root.innerHTML = `
    <main class="demo-page" aria-label="Personalizovaný návrh pre ${config.brand}">
      <header class="demo-header">
        <div class="demo-brand">
          <span class="demo-brand__mark">${advisorLogo()}</span>
          <span class="demo-brand__copy"><strong>${config.brand}</strong><small>${config.subbrand}</small></span>
        </div>
        <span class="demo-tag"><i></i> Interaktívna ukážka</span>
      </header>

      <section class="demo-hero">
        <div class="demo-copy">
          <span class="owner-note">${config.ownerGreeting}</span>
          <h1>${config.headline}</h1>
          <p>${config.intro}</p>
          <div class="demo-benefits" aria-label="Čo poradca rieši">
            <article class="demo-benefit"><span class="demo-benefit__icon">${icons.spark}</span><b>Pomôže s výberom</b><span>Odporučí konkrétnu kávu, nie iba kategóriu.</span></article>
            <article class="demo-benefit"><span class="demo-benefit__icon">${icons.question}</span><b>Odpovie na otázky</b><span>Vysvetlí aciditu, mletie aj vhodnú prípravu.</span></article>
            <article class="demo-benefit"><span class="demo-benefit__icon">${icons.quiz}</span><b>Kvíz podľa chuti</b><span>Štyri krátke otázky bez odbornej bariéry.</span></article>
          </div>
          <div class="demo-actions">
            <button class="primary-action" id="heroOpen" type="button">Vyskúšať poradcu ${icons.next}</button>
            <small>Funkčná ukážka s produktmi a obsahom prispôsobeným pre ${config.brand}.</small>
          </div>
        </div>

        <aside class="demo-visual" aria-label="Ukážka odporúčania">
          <div class="preview-panel">
            <div class="preview-panel__top"><b>Osobné odporúčanie</b><span><i class="online-dot"></i> pripravené za minútu</span></div>
            <div class="preview-panel__body">
              <div class="preview-answer"><span class="preview-answer__mark">${icons.spark}</span><div><small>Najlepšia zhoda</small><strong>${config.products[0].name}</strong><span>${config.products[0].tags.slice(0, 3).join(' · ')}</span></div></div>
              <div class="preview-steps"><span></span><span></span><span></span><span></span></div>
              <p class="preview-note">Zákazník dostane zrozumiteľný dôvod odporúčania a môže pokračovať k baleniu alebo do e-shopu.</p>
            </div>
          </div>
        </aside>
      </section>

      <footer class="demo-footer">
        <span>Neoficiálna ukážka pripravená pre ${config.brand}. Nie je súčasťou oficiálneho webu firmy.</span>
        <a href="${config.shopUrl}" target="_blank" rel="noreferrer">Otvoriť aktuálny e-shop</a>
      </footer>
    </main>

    <div class="launcher" id="launcher">
      <button class="launcher__teaser" id="launcherTeaser" type="button">
        <button class="launcher__teaser-close" id="closeTeaser" type="button" aria-label="Skryť ukážku">×</button>
        <b>Neviete, ktorú kávu vybrať?</b>
        <span>Odpoviem na otázky alebo ju nájdeme cez krátky chuťový kvíz.</span>
      </button>
      <button class="launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        ${advisorLogo()}<span class="launcher__status" aria-hidden="true"></span>
      </button>
    </div>

    <section class="widget" id="widget" aria-label="Kávový poradca ${config.brand}" aria-hidden="true">
      <header class="widget__header">
        <div class="widget-brand">
          <span class="widget-brand__mark">${advisorLogo()}</span>
          <span class="widget-brand__copy"><strong>${config.brand}</strong><small><i class="online-dot"></i> Online</small></span>
        </div>
        <div class="widget-actions">
          <button class="icon-button" id="resetAll" type="button" aria-label="Začať odznova">${icons.refresh}</button>
          <button class="icon-button" id="closeWidget" type="button" aria-label="Zavrieť">${icons.close}</button>
        </div>
      </header>

      <nav class="mode" id="modeSwitch" aria-label="Režim poradcu">
        <span class="mode__indicator" aria-hidden="true"></span>
        <button class="mode__button is-active" type="button" data-mode="chat">${icons.chat}<b>Chat</b></button>
        <button class="mode__button" type="button" data-mode="advisor">${icons.spark}<b>Výber kávy</b></button>
      </nav>

      <div class="stage">
        <section class="screen is-active" id="chatScreen">
          <button class="advisor-entry" id="openAdvisor" type="button">
            <span class="advisor-entry__mark">${icons.spark}</span>
            <span class="advisor-entry__copy"><small>Chuťový kvíz</small><b>Nájsť kávu na mieru</b><span>4 otázky · približne 1 minúta</span></span>
            <span class="advisor-entry__arrow">${icons.next}</span>
          </button>
          <div class="chat" id="chatMessages" aria-live="polite"></div>
          <div class="chips" id="quickChips" aria-label="Rýchle otázky"></div>
          <form class="composer" id="chatForm">
            <div class="composer__shell">
              <input id="chatInput" autocomplete="off" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve">
              <button class="composer__send" type="submit" aria-label="Odoslať">${icons.send}</button>
            </div>
          </form>
          <div class="support-row" id="supportRow" aria-label="Kontaktné možnosti"></div>
        </section>

        <section class="screen" id="advisorScreen">
          <div class="advisor-progress">
            <button class="progress-back" id="prevBtn" type="button" aria-label="Predchádzajúca otázka">${icons.back}</button>
            <div class="advisor-progress__copy"><b id="stepLabel">1 / 4</b><span id="stepName">Príprava</span></div>
            <div class="progress" id="progress" aria-label="Priebeh výberu"></div>
          </div>
          <div class="advisor" id="advisorBody" aria-live="polite"></div>
        </section>
      </div>
    </section>`;

  const questions = [
    {
      key: 'prep', name: 'Príprava', title: 'Ako kávu pripravujete?',
      options: [
        ['automatic', 'Automatický kávovar', 'Rýchla príprava jedným tlačidlom', true],
        ['lever', 'Pákový kávovar', 'Espresso pripravujete ručne', true],
        ['moka', 'Moka kanvička', 'Výrazná domáca príprava', true],
        ['filter', 'Filter alebo zalievanie', 'V60, French press či prekvapkávanie', true]
      ]
    },
    {
      key: 'taste', name: 'Chuť', title: 'Ktorý chuťový smer vám sedí?',
      options: [
        ['chocolate', 'Čokoládová a sladká', 'Minimum ovocnej acidity', false, 'chocolate'],
        ['balanced', 'Vyvážená', 'Plná chuť bez extrémov', false, 'balanced'],
        ['fruity', 'Ovocná a svieža', 'Aromatická výberová káva', false, 'fruity'],
        ['strong', 'Silná a výrazná', 'Intenzívne telo a dochuť', false, 'strong']
      ]
    },
    {
      key: 'drink', name: 'Nápoj', title: 'Ako ju pijete najčastejšie?',
      options: [
        ['black', 'Čiernu', 'Espresso, lungo alebo filter', false, 'black'],
        ['milk', 'S mliekom', 'Cappuccino, flat white alebo latte', false, 'milk'],
        ['both', 'Striedam oboje', 'Potrebujete univerzálnu kávu', false, 'both']
      ]
    },
    {
      key: 'caffeine', name: 'Kofeín', title: 'Klasickú alebo bezkofeínovú?',
      options: [
        ['classic', 'Klasickú', 'Bežná káva s kofeínom', false, 'classic'],
        ['decaf', 'Bezkofeínovú', 'Na večer alebo bez povzbudenia', false, 'decaf'],
        ['either', 'Je mi to jedno', 'Rozhodnite hlavne podľa chuti', false, 'either']
      ]
    }
  ];

  const state = {
    mode: 'chat',
    step: 0,
    answers: {},
    stage: 'questions',
    selectedProduct: null,
    weight: null,
    grind: 'beans',
    transitioning: false,
    chatHistory: []
  };

  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#launcherTeaser');
  const modeSwitch = $('#modeSwitch');
  const chatScreen = $('#chatScreen');
  const advisorScreen = $('#advisorScreen');
  const chat = $('#chatMessages');
  const chips = $('#quickChips');
  const advisor = $('#advisorBody');

  function time() {
    return new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent('coffee-demo', { detail: { name, demoId: config.id, ...detail } }));
    try {
      const events = JSON.parse(sessionStorage.getItem('coffee-demo-events') || '[]');
      events.push({ name, demoId: config.id, detail, at: Date.now() });
      sessionStorage.setItem('coffee-demo-events', JSON.stringify(events.slice(-80)));
    } catch (_) {}
  }

  function openWidget() {
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    $('#openWidget').setAttribute('aria-expanded', 'true');
    launcher.style.display = 'none';
    document.body.classList.add('widget-open');
    teaser.classList.remove('is-visible');
    emit('widget_open');
  }

  function closeWidget() {
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    $('#openWidget').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('widget-open');
    setTimeout(() => {
      launcher.style.display = 'block';
      setTimeout(() => teaser.classList.add('is-visible'), 420);
    }, 250);
  }

  function setMode(mode) {
    state.mode = mode;
    modeSwitch.classList.toggle('is-advisor', mode === 'advisor');
    $$('.mode__button').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
    chatScreen.classList.toggle('is-active', mode === 'chat');
    advisorScreen.classList.toggle('is-active', mode === 'advisor');
    if (mode === 'advisor') renderAdvisor();
    else if (matchMedia('(min-width: 641px)').matches) requestAnimationFrame(() => $('#chatInput')?.focus());
    emit('mode_change', { mode });
  }

  function addMessage(text, user = false) {
    const row = document.createElement('div');
    row.className = `message${user ? ' message--user' : ''}`;
    row.innerHTML = `${user ? '' : `<span class="message__avatar">${advisorLogo()}</span>`}<div class="message__stack"><div class="bubble">${text}</div><div class="timestamp">${time()}</div></div>`;
    chat.appendChild(row);
    requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }

  function showTyping() {
    const row = document.createElement('div');
    row.id = 'typingRow';
    row.className = 'message';
    row.innerHTML = `<span class="message__avatar">${advisorLogo()}</span><div class="message__stack"><div class="bubble typing"><i></i><i></i><i></i></div></div>`;
    chat.appendChild(row);
    requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }

  function fallbackAnswer(text) {
    const query = text.toLowerCase();
    const ranked = rankings();
    if (query.includes('automat')) return `Do automatu by som z aktuálneho výberu odporučil <b>${ranked.find((p) => p.prep.includes('automatic'))?.name || ranked[0].name}</b>. Má stabilnejší profil a dobre funguje pri každodennej príprave.`;
    if (query.includes('kysl') || query.includes('acid')) return `Skúste <b>${ranked.find((p) => p.taste.includes('chocolate'))?.name || ranked[0].name}</b>. Patrí medzi sladšie a pokojnejšie profily bez výraznej ovocnej acidity.`;
    if (query.includes('mlie') || query.includes('capp')) return `Do mliečnych nápojov sa hodí <b>${ranked.find((p) => p.drink.includes('milk'))?.name || ranked[0].name}</b>, pretože má dosť tela a zostane chuťovo čitateľná.`;
    if (query.includes('bez') || query.includes('večer')) return `Najvhodnejšia bezkofeínová voľba je <b>${ranked.find((p) => p.caffeine.includes('decaf'))?.name || 'bezkofeínová káva z ponuky'}</b>.`;
    return 'Najpresnejšie odporúčanie dostanete vo výbere kávy. Zohľadní spôsob prípravy, chuť, mlieko aj kofeín.';
  }

  async function requestAI(text) {
    state.chatHistory.push({ role: 'user', content: text });
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ demoId: config.id, messages: state.chatHistory.slice(-10) })
    });
    if (!response.ok) throw new Error('AI unavailable');
    const data = await response.json();
    if (!data.reply) throw new Error('Empty AI reply');
    state.chatHistory.push({ role: 'assistant', content: data.reply });
    return data.reply;
  }

  async function sendChat(text, chip = null) {
    const value = text.trim();
    if (!value) return;
    addMessage(value, true);
    $('#chatInput').value = '';
    showTyping();
    emit('chat_question', { text: value });
    try {
      const reply = await requestAI(value);
      $('#typingRow')?.remove();
      addMessage(reply);
    } catch (_) {
      await new Promise((resolve) => setTimeout(resolve, 420));
      $('#typingRow')?.remove();
      addMessage(fallbackAnswer(value));
    } finally {
      if (chip) chip.classList.remove('is-sending');
    }
  }

  function renderChips() {
    chips.innerHTML = config.quick.map((label) => `<button class="chip" type="button"><span>${label}</span></button>`).join('');
    $$('.chip', chips).forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty('--fill-x', `${event.clientX - rect.left}px`);
        button.style.setProperty('--fill-y', `${event.clientY - rect.top}px`);
      });
      button.addEventListener('click', () => {
        if (button.classList.contains('is-sending')) return;
        button.classList.add('is-sending');
        setTimeout(() => sendChat(button.textContent.trim(), button), 460);
      });
    });
  }

  function renderSupport() {
    const items = [
      { label: 'E-shop', href: config.shopUrl, icon: icons.shop },
      { label: 'Web', href: config.contactUrl || config.shopUrl, icon: icons.web }
    ];
    if (config.phone) items.push({ label: 'Zavolať', href: `tel:${config.phone}`, icon: icons.phone });
    else items.push({ label: 'Kontakt', href: config.contactUrl || config.shopUrl, icon: icons.chat });
    $('#supportRow').innerHTML = items.map((item) => `<a href="${item.href}" ${item.href.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>${item.icon}${item.label}</a>`).join('');
  }

  function scoreProduct(product) {
    let score = 0;
    Object.entries(state.answers).forEach(([key, value]) => {
      if (product[key]?.includes(value)) score += key === 'caffeine' ? 4 : 3;
    });
    return score;
  }

  function rankings() {
    return [...config.products].map((product) => ({ ...product, score: scoreProduct(product) })).sort((a, b) => b.score - a.score);
  }

  function matchPercent(product) {
    const best = rankings()[0];
    return Math.max(74, Math.min(98, 90 + (product.score - best.score) * 4 + (product.id === best.id ? 7 : 0)));
  }

  function updateProgress() {
    const resultStage = state.stage !== 'questions';
    $('#stepLabel').textContent = resultStage ? 'Výsledok' : `${state.step + 1} / 4`;
    $('#stepName').textContent = resultStage ? 'Vaša káva' : questions[state.step].name;
    $('#prevBtn').disabled = state.stage === 'questions' && state.step === 0;
    $('#progress').innerHTML = [0, 1, 2, 3].map((index) => `<i class="${index < state.step || resultStage ? 'is-done ' : ''}${index === state.step && !resultStage ? 'is-active' : ''}"></i>`).join('');
  }

  function renderQuestion() {
    const question = questions[state.step];
    const selected = state.answers[question.key];
    const fact = selected && config.funFacts?.[selected];
    advisor.innerHTML = `
      <div class="question"><span class="question__kicker">${question.name}</span><h2>${question.title}</h2></div>
      <div class="options">
        ${question.options.map((option, index) => {
          const [value, label, description, photo, iconName] = option;
          const visual = photo ? `<span class="option__photo option__photo--${value}" aria-hidden="true"></span>` : `<span class="option__icon">${icons[iconName] || icons.spark}</span>`;
          return `<button class="option ${selected === value ? 'is-selected' : selected ? 'is-muted' : ''}" type="button" data-value="${value}" style="animation-delay:${index * 85}ms">${visual}<span class="option__copy"><b>${label}</b><small>${description}</small></span><span class="option__state">${selected === value ? icons.check : icons.next}</span></button>`;
        }).join('')}
      </div>
      ${fact ? `<div class="fun-fact">${icons.bulb}<span>${fact}</span></div>` : ''}`;

    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => selectAnswer(button.dataset.value)));
  }

  function selectAnswer(value) {
    if (state.transitioning || state.stage !== 'questions') return;
    const question = questions[state.step];
    state.answers[question.key] = value;
    state.transitioning = true;
    renderQuestion();
    emit('advisor_answer', { step: question.key, value });
    setTimeout(() => {
      if (state.step < questions.length - 1) state.step += 1;
      else state.stage = 'result';
      state.transitioning = false;
      renderAdvisor();
    }, 680);
  }

  function productVisual(product) {
    return `<div class="product-visual"><span>${config.brand.toUpperCase()}</span><strong>${product.name}</strong><i></i></div>`;
  }

  function renderResult() {
    const list = rankings();
    const best = list[0];
    state.selectedProduct = state.selectedProduct || best.id;
    const product = list.find((item) => item.id === state.selectedProduct) || best;
    const alternatives = list.filter((item) => item.id !== product.id).slice(0, 2);
    const percent = matchPercent(product);
    advisor.innerHTML = `
      <div class="result-head"><span class="result-head__badge">Osobné odporúčanie</span><h2>Táto káva vám sedí najviac</h2></div>
      <section class="result-card">
        <div class="result-card__top"><div class="match"><span class="match__ring" style="--score:${percent}"><b>${percent}%</b></span><div><b>Zhoda s odpoveďami</b><small>${product.id === best.id ? 'Najsilnejšie odporúčanie' : 'Alternatívna voľba'}</small></div></div><span>${product.price}</span></div>
        <div class="result-product">${productVisual(product)}<div><h3>${product.name}</h3><span class="result-product__origin">${product.origin}</span><div class="taste-tags">${product.tags.map((tag) => `<span>${tag}</span>`).join('')}</div></div></div>
        <div class="reason"><b>Prečo práve táto</b><p>${product.reason}</p></div>
        <div class="result-actions"><button class="result-button result-button--primary" id="choosePack" type="button">Vybrať balenie</button><button class="result-button result-button--secondary" id="restartResult" type="button">Zmeniť odpovede</button></div>
        <div class="alternatives"><span>Ďalšie vhodné kávy</span><div class="alternative-grid">${alternatives.map((item) => `<button class="alternative" type="button" data-product="${item.id}"><b>${item.name}</b><small>${item.tags.slice(0, 2).join(' · ')}</small><em>${matchPercent(item)} % zhoda</em></button>`).join('')}</div></div>
      </section>`;
    $('#choosePack').addEventListener('click', () => { state.stage = 'package'; renderAdvisor(); });
    $('#restartResult').addEventListener('click', resetAdvisor);
    $$('.alternative', advisor).forEach((button) => button.addEventListener('click', () => { state.selectedProduct = button.dataset.product; renderResult(); }));
    emit('recommendation_view', { product: product.name });
  }

  const grindOptions = [
    ['beans', 'Zrnková'], ['espresso', 'Espresso'], ['moka', 'Moka'], ['filter', 'Filter']
  ];

  function renderPackage() {
    const product = config.products.find((item) => item.id === state.selectedProduct) || rankings()[0];
    advisor.innerHTML = `
      <div class="choice-head"><h2>Balenie a mletie</h2></div>
      <div class="choice-grid">${[250, 500, 1000].map((weight) => `<button class="choice-card ${state.weight === weight ? 'is-selected' : ''}" type="button" data-weight="${weight}"><i></i><b>${weight === 1000 ? '1 kg' : `${weight} g`}</b><small>${weight === 250 ? 'na ochutnanie' : weight === 500 ? 'bežná zásoba' : 'najväčšie balenie'}</small></button>`).join('')}</div>
      <div class="choice-section"><span>Ako ju pripraviť?</span><div class="grind-grid">${grindOptions.map(([value, label]) => `<button class="grind ${state.grind === value ? 'is-selected' : ''}" type="button" data-grind="${value}"><b>${label}</b></button>`).join('')}</div></div>
      <div class="summary"><div class="summary__row"><span>Káva</span><b>${product.name}</b></div><div class="summary__row"><span>Balenie</span><b>${state.weight ? state.weight === 1000 ? '1 kg' : `${state.weight} g` : '—'}</b></div><div class="summary__row"><span>Úprava</span><b>${grindOptions.find(([value]) => value === state.grind)[1]}</b></div><div class="summary__row summary__row--total"><span>Cena</span><b>${product.price}</b></div></div>
      <button class="checkout-button" id="checkout" type="button" ${state.weight ? '' : 'disabled'}>Pokračovať do e-shopu</button>`;
    $$('.choice-card', advisor).forEach((button) => button.addEventListener('click', () => { state.weight = Number(button.dataset.weight); renderPackage(); }));
    $$('.grind', advisor).forEach((button) => button.addEventListener('click', () => { state.grind = button.dataset.grind; renderPackage(); }));
    $('#checkout').addEventListener('click', () => { state.stage = 'success'; renderAdvisor(); });
  }

  function renderSuccess() {
    const product = config.products.find((item) => item.id === state.selectedProduct) || rankings()[0];
    advisor.innerHTML = `<div class="success"><div class="success__icon">${icons.check}</div><h2>Výber je pripravený</h2><p>${product.name}, ${state.weight === 1000 ? '1 kg' : `${state.weight} g`}. V reálnom nasadení by zákazník pokračoval na konkrétny produkt v e-shope.</p><a class="primary-action" href="${config.shopUrl}" target="_blank" rel="noreferrer">Otvoriť e-shop ${icons.next}</a><button class="result-button result-button--secondary" id="startAgain" type="button">Vybrať ďalšiu kávu</button></div>`;
    $('#startAgain').addEventListener('click', resetAdvisor);
    emit('purchase_intent', { product: product.name, weight: state.weight, grind: state.grind });
  }

  function renderAdvisor() {
    updateProgress();
    if (state.stage === 'questions') renderQuestion();
    else if (state.stage === 'result') renderResult();
    else if (state.stage === 'package') renderPackage();
    else renderSuccess();
    advisor.scrollTop = 0;
  }

  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.stage = 'questions';
    state.selectedProduct = null;
    state.weight = null;
    state.grind = 'beans';
    state.transitioning = false;
    renderAdvisor();
  }

  function seedChat() {
    chat.innerHTML = '';
    state.chatHistory = [];
    addMessage(config.welcome);
    setTimeout(() => addMessage('Môžete sa opýtať priamo alebo použiť krátky výber kávy.'), 190);
  }

  function resetAll() {
    resetAdvisor();
    seedChat();
    setMode('chat');
  }

  $('#heroOpen').addEventListener('click', openWidget);
  $('#openWidget').addEventListener('click', openWidget);
  teaser.addEventListener('click', (event) => { if (!event.target.closest('#closeTeaser')) openWidget(); });
  $('#closeTeaser').addEventListener('click', (event) => { event.stopPropagation(); teaser.classList.remove('is-visible'); });
  $('#closeWidget').addEventListener('click', closeWidget);
  $('#resetAll').addEventListener('click', resetAll);
  $('#openAdvisor').addEventListener('click', () => setMode('advisor'));
  $$('.mode__button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  $('#chatForm').addEventListener('submit', (event) => { event.preventDefault(); sendChat($('#chatInput').value); });
  $('#prevBtn').addEventListener('click', () => {
    if (state.stage !== 'questions') { state.stage = 'questions'; state.step = 3; }
    else if (state.step > 0) state.step -= 1;
    state.transitioning = false;
    renderAdvisor();
  });

  renderSupport();
  renderChips();
  seedChat();
  renderAdvisor();
  setTimeout(() => teaser.classList.add('is-visible'), 1300);
})();
