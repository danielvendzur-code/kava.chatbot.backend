(() => {
  'use strict';

  const root = document.querySelector('#praziarnicka-root');
  if (!root) return;

  const asset = (name) => `/assets/praziarnicka/${name}`;
  const mark = `<svg class="pz-mark" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false"><path d="M31.9 5.8c14.7 0 26.3 10.7 26.3 24.8 0 15.3-12.4 27.6-28.5 27.6-14.4 0-23.9-9.6-23.9-22.6C5.8 18.2 17.2 5.8 31.9 5.8Z" fill="#F8F2E8"/><path d="M17.3 37.1c0-12.8 7.8-22 17.7-22 7.7 0 13.5 5.8 13.5 13.9 0 12-9.4 22.3-20.4 23.2-6 .5-10.8-5.8-10.8-15.1Z" fill="#173F37"/><path d="M25.9 47.3c9.5-7 13-15.9 12.4-26.5" stroke="#F8F2E8" stroke-width="3.6" stroke-linecap="round"/><path d="M15 21.3c5.2.2 9.4 2.7 12.1 7.3" stroke="#C66B49" stroke-width="2.5" stroke-linecap="round"/><path d="M18.6 14.3c5.4.9 9.4 3.9 11.4 8.7" stroke="#C66B49" stroke-width="2.5" stroke-linecap="round"/></svg>`;
  const icons = {
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 16 8-16 8 3-8-3-8Zm3 8h13"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    coffee: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8Zm12 2h2a2 2 0 0 1 0 4h-2M8 4c0 1 1 1 1 2m3-2c0 1 1 1 1 2"/></svg>',
    milk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0"/></svg>',
    machine: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M8 7h8M8 11h5v3H8zM7 21h10M17 10v5"/></svg>',
    lever: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14M7 20V9h10v11M9 9V5h6v4M15 12h4M19 12v5M9 14h6v3H9z"/></svg>',
    moka: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3 8 1 2 6-2 11H8L6 10l2-7Zm-1 7h10M9 5h6M18 8h2.5v6H18"/></svg>',
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12l-2 10H8L6 4Zm3 14h6M12 14v4M8 4l4 10 4-10"/></svg>',
    dot: '<span class="pz-dot" aria-hidden="true"></span>'
  };

  const products = [
    {
      id: 'paganini', name: 'Paganini blend', price: 'od 11,90 €', detail: '75 % arabica · 25 % robusta',
      url: 'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta', photo: asset('result-espresso.webp'),
      prep: ['automatic', 'lever', 'moka'], taste: ['balanced', 'chocolate', 'strong', 'fruity'], drink: ['milk', 'black', 'both'], caffeine: ['classic', 'either'],
      notes: ['čokoláda', 'mandle', 'lieskové orechy'], acidity: 'nízka',
      reason: 'Plné, vyvážené espresso s čokoládovým telom, ktoré zostane výrazné aj v mlieku.',
      alternative: 'Skvelá voľba pre každodenné espresso aj cappuccino.'
    },
    {
      id: 'brazil', name: 'Brazil Santos', price: 'od 9,90 €', detail: '100 % arabica · jemná a sladšia',
      url: 'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica', photo: asset('result-filter.webp'),
      prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'both'], caffeine: ['classic', 'either'],
      notes: ['kakao', 'sladkosť', 'nízka acidita'], acidity: 'veľmi nízka',
      reason: 'Jemná, sladšia arabica s pokojnou chuťou pre každodenné pitie bez výraznej acidity.',
      alternative: 'Bezpečná voľba, keď nechcete ovocný ani príliš horký profil.'
    },
    {
      id: 'puccini', name: 'Puccini blend', price: 'od 11,50 €', detail: '60 % arabica · 40 % robusta',
      url: 'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta', photo: asset('result-espresso.webp'),
      prep: ['automatic', 'lever', 'moka'], taste: ['strong', 'balanced', 'chocolate'], drink: ['milk', 'both'], caffeine: ['classic', 'either'],
      notes: ['tmavá čokoláda', 'marhuľa', 'hustá kréma'], acidity: 'bez výraznej acidity',
      reason: 'Výrazná zmes s hustou krémou, ktorá sa nestratí v cappuccine, latte ani automate.',
      alternative: 'Vyberte ju, ak chcete viac intenzity a dlhšiu dochuť.'
    },
    {
      id: 'cuba', name: 'Cuba Serrano Lavado', price: 'od 12,90 €', detail: '100 % arabica · Sierra Maestra',
      url: 'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica', photo: asset('result-filter.webp'),
      prep: ['lever', 'moka', 'filter'], taste: ['balanced', 'chocolate'], drink: ['black'], caffeine: ['classic', 'either'],
      notes: ['kakaová pasta', 'tabak', 'vlašské orechy'], acidity: 'nulová',
      reason: 'Sladká kubánska arabica s kakaovým telom a orechovou dochuťou bez acidity.',
      alternative: 'Elegantná voľba pre čiernu kávu bez kyslosti.'
    },
    {
      id: 'decaf', name: 'Bezkofeínová káva Brazil', price: 'od 12,90 €', detail: '100 % arabica · bez kofeínu',
      url: 'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia', photo: asset('result-decaf.webp'),
      prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['decaf'],
      notes: ['sladká Brazília', 'jemné telo', 'na večer'], acidity: 'veľmi nízka',
      reason: 'Plnohodnotná brazílska káva na večer, keď chcete chuť bez povzbudivého účinku.',
      alternative: 'Rozhoduje chuť, nie kofeín? Pozrite aj Brazil Santos.'
    }
  ];

  const questions = [
    { key: 'prep', label: 'Príprava', title: 'Ako kávu najčastejšie pripravujete?', help: 'Zúžime výber na kávy, ktoré pri vašej príprave dávajú zmysel.', options: [
      ['automatic', 'Automatický kávovar', 'Jedno tlačidlo, stabilná každodenná šálka', 'machine'],
      ['lever', 'Pákový kávovar', 'Espresso pripravované ručne', 'lever'],
      ['moka', 'Moka kanvička', 'Výrazná domáca príprava', 'moka'],
      ['filter', 'Filter alebo zalievanie', 'V60, French press alebo prekvapkávanie', 'filter']
    ] },
    { key: 'taste', label: 'Chuť', title: 'Aký chuťový smer hľadáte?', help: 'Bežné slová namiesto odborných cuppingových termínov.', options: [
      ['chocolate', 'Sladká a čokoládová', 'Minimum výraznej acidity', 'coffee'],
      ['balanced', 'Vyvážená', 'Plná chuť bez extrémov', 'coffee'],
      ['fruity', 'Ovocná a svieža', 'Aromatickejší profil s iskrou', 'coffee'],
      ['strong', 'Silná a výrazná', 'Intenzívne telo a dlhšia dochuť', 'coffee']
    ] },
    { key: 'drink', label: 'Nápoj', title: 'Ako ju pijete najčastejšie?', help: 'Mlieko potrebuje viac tela, čierna káva ukáže viac detailu.', options: [
      ['black', 'Čiernu', 'Espresso, lungo alebo filter', 'coffee'],
      ['milk', 'S mliekom', 'Cappuccino, flat white alebo latte', 'milk'],
      ['both', 'Striedam oboje', 'Potrebujem univerzálnu kávu', 'coffee']
    ] },
    { key: 'caffeine', label: 'Kofeín', title: 'Klasickú alebo bezkofeínovú?', help: 'Posledný krok odstráni odporúčanie, ktoré sa nedá použiť.', options: [
      ['classic', 'Klasickú', 'Bežná káva s kofeínom', 'coffee'],
      ['decaf', 'Bezkofeínovú', 'Na večer alebo bez povzbudenia', 'coffee'],
      ['either', 'Je mi to jedno', 'Rozhodnite hlavne podľa chuti', 'coffee']
    ] }
  ];

  const state = {
    screen: 'chat', step: 0, answers: {}, result: null, ranked: [], chat: [], lastFocus: null,
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const productById = (id) => products.find((product) => product.id === id) || products[0];
  const getAnswer = (key) => state.answers[key];
  const currentQuestion = () => questions[state.step];

  function scoreProduct(product, answers) {
    const weights = { prep: 9, taste: 10, drink: 7, caffeine: 12 };
    let score = 0;
    for (const question of questions) {
      const wanted = answers[question.key];
      if (!wanted) continue;
      if (product[question.key]?.includes(wanted)) score += weights[question.key];
      else if (wanted === 'either' && question.key === 'caffeine') score += 3;
      else score -= question.key === 'caffeine' ? 12 : 2;
    }
    if (answers.taste === 'fruity' && product.id === 'paganini') score += 4;
    if (answers.drink === 'milk' && product.id === 'puccini') score += 5;
    if (answers.prep === 'filter' && product.id === 'cuba') score += 3;
    return score;
  }

  function rankLocal() {
    const ranked = products.map((product) => ({ product, score: scoreProduct(product, state.answers) }))
      .sort((a, b) => b.score - a.score || a.product.price.localeCompare(b.product.price));
    if (state.answers.caffeine === 'decaf') ranked.sort((a, b) => (b.product.id === 'decaf') - (a.product.id === 'decaf'));
    return ranked;
  }

  async function recommendWithFallback() {
    const local = rankLocal();
    state.ranked = local;
    state.result = local[0].product;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 900);
      const response = await fetch('/api/recommend', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ answers: state.answers }), signal: controller.signal });
      clearTimeout(timer);
      if (response.ok) {
        const payload = await response.json();
        const remote = productById(payload.productId || payload.id);
        if (remote) state.result = remote;
      }
    } catch (_) {
      // Local deterministic scoring is the intentional offline/API fallback.
    }
  }

  function renderShell() {
    root.innerHTML = `
      <main class="pz-page">
        <header class="pz-page-head">
          <a class="pz-brand" href="https://praziarnicka.sk/" target="_blank" rel="noreferrer">
            ${mark}<span><strong>Pražiarnička</strong><small>by Caffè Vita · Trenčín</small></span>
          </a>
          <span class="pz-owner-tag">návrh predajného poradcu</span>
        </header>
        <section class="pz-hero" aria-labelledby="owner-title">
          <div class="pz-owner-copy">
            <p class="pz-overline">Váš kávový výber v jednom rozhovore</p>
            <h1 id="owner-title">Vitajte vo vašom návrhu AI poradcu pre <em>Pražiarničku.</em></h1>
            <p class="pz-lead">Pomôže zákazníkovi zorientovať sa v ponuke, vysvetlí rozdiely a dovedie ho ku konkrétnej káve bez dlhého hľadania.</p>
            <div class="pz-benefits" aria-label="Obchodné prínosy">
              <div><b>Jednoduchší výber</b><span>Menej otázok, viac istoty pri nákupe.</span></div>
              <div><b>Konkrétny produkt</b><span>Od preferencie priamo k ponuke.</span></div>
              <div><b>Prirodzený upsell</b><span>Relevantná ďalšia rada až po odporúčaní.</span></div>
            </div>
            <button class="pz-primary pz-open" type="button">Spustiť poradcu ${icons.arrow}</button>
          </div>
          <div class="pz-showcase" aria-label="Ukážka zákazníckej skúsenosti">
            <figure class="pz-photo"><img src="${asset('result-filter.webp')}" alt="Čerstvá káva pripravená cez filter" loading="eager"><figcaption>Skutočná príprava · čerstvá káva</figcaption></figure>
            <div class="pz-preview">
              <div class="pz-preview-head"><span>Výsledok poradcu</span>${icons.dot}</div>
              <div class="pz-preview-body"><img src="${asset('result-espresso.webp')}" alt="Espresso pripravené v kaviarni" loading="lazy"><div><strong>Paganini blend</strong><p>Plné espresso s čokoládou, ktoré funguje aj v mlieku.</p><span>od 11,90 €</span></div></div>
              <button class="pz-preview-link pz-open" type="button">Pozrieť ukážku ${icons.arrow}</button>
            </div>
          </div>
        </section>
        <footer class="pz-page-foot"><span>Pražiarnička · čerstvo pražená káva</span><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a></footer>
      </main>
      <div class="pz-launcher-wrap"><div class="pz-teaser" id="pz-teaser" hidden><button class="pz-teaser-close" type="button" aria-label="Zavrieť pozvánku">×</button><strong>Pomôžeme s výberom?</strong><span>Štyri krátke otázky a konkrétna káva.</span></div><button class="pz-launcher" id="pz-launcher" type="button" aria-label="Otvoriť kávového poradcu">${mark}</button></div>
      <div class="pz-backdrop" id="pz-backdrop" hidden></div>
      <section class="pz-widget" id="pz-widget" role="dialog" aria-modal="true" aria-labelledby="pz-dialog-title" hidden>
        <header class="pz-widget-head"><div class="pz-widget-brand">${mark}<span><strong id="pz-dialog-title">Pražiarnička</strong><small>Kávový poradca</small></span></div><button class="pz-icon-btn" id="pz-close" type="button" aria-label="Zavrieť poradcu">${icons.close}</button></header>
        <div class="pz-mode" role="tablist" aria-label="Režim poradcu"><button class="pz-mode-btn" data-mode="chat" role="tab" aria-controls="pz-chat" type="button">Chat</button><button class="pz-mode-btn" data-mode="advisor" role="tab" aria-controls="pz-advisor" type="button">Výber kávy</button></div>
        <div class="pz-panel" id="pz-chat" role="tabpanel"><div class="pz-chat-scroll" id="pz-chat-scroll"><div class="pz-chat-intro"><div class="pz-assistant-avatar">PN</div><div class="pz-bubble pz-bubble-assistant">Ahoj, som poradca Pražiarničky. Pomôžem vám vybrať kávu podľa prípravy a chuti.</div></div><button class="pz-advisor-cta" id="pz-start-advisor" type="button"><span><b>Chcem odporúčanie</b><small>Štyri krátke otázky, jeden jasný výsledok.</small></span>${icons.arrow}</button><div id="pz-chat-messages" aria-live="polite"></div></div><div class="pz-chat-bottom"><div class="pz-chips" aria-label="Rýchle otázky"><button class="pz-chip" type="button" data-chip="advisor">Pomôžte mi vybrať</button><button class="pz-chip" type="button" data-chip="automatic">Do automatu</button><button class="pz-chip" type="button" data-chip="chocolate">Skôr čokoládová</button><button class="pz-chip" type="button" data-chip="decaf">Bez kofeínu</button></div><form class="pz-composer" id="pz-composer"><label class="sr-only" for="pz-input">Napíšte správu</label><input id="pz-input" name="message" autocomplete="off" placeholder="Napíšte správu…"><button class="pz-send" type="submit" aria-label="Odoslať správu">${icons.send}</button></form><small class="pz-credit">mojchatbot.sk</small></div></div>
        <div class="pz-panel" id="pz-advisor" role="tabpanel" hidden><div class="pz-advisor-head"><button class="pz-back pz-icon-btn" id="pz-back" type="button" aria-label="Späť" hidden>${icons.back}</button><div><span id="pz-step-label">1 / 4</span><b id="pz-step-name">Príprava</b></div><button class="pz-reset" id="pz-reset" type="button">Začať odznova</button></div><div class="pz-progress"><span id="pz-progress-bar"></span></div><div class="pz-advisor-scroll" id="pz-advisor-scroll"><div class="pz-advisor-copy"><h2 id="pz-question-title"></h2><p id="pz-question-help"></p></div><div class="pz-options" id="pz-options"></div></div></div>
        <div class="pz-panel" id="pz-result" role="tabpanel" hidden><div class="pz-result-scroll" id="pz-result-scroll"></div></div>
      </section>`;
  }

  function setWidget(open) {
    const widget = document.querySelector('#pz-widget');
    const backdrop = document.querySelector('#pz-backdrop');
    const launcher = document.querySelector('#pz-launcher');
    if (open) {
      state.lastFocus = document.activeElement;
      widget.hidden = false; backdrop.hidden = false; document.body.classList.add('pz-lock');
      requestAnimationFrame(() => { widget.classList.add('is-open'); backdrop.classList.add('is-visible'); document.querySelector('#pz-close')?.focus(); });
      renderMode();
    } else {
      widget.classList.remove('is-open'); backdrop.classList.remove('is-visible'); document.body.classList.remove('pz-lock');
      setTimeout(() => { widget.hidden = true; backdrop.hidden = true; }, state.reducedMotion ? 0 : 240);
      state.lastFocus?.focus?.();
    }
    launcher.setAttribute('aria-expanded', String(open));
  }

  function renderMode() {
    const chat = document.querySelector('#pz-chat');
    const advisor = document.querySelector('#pz-advisor');
    const result = document.querySelector('#pz-result');
    const mode = state.result ? 'result' : state.screen;
    document.querySelectorAll('.pz-mode-btn').forEach((button) => { const selected = button.dataset.mode === (mode === 'result' ? 'advisor' : mode); button.classList.toggle('is-selected', selected); button.setAttribute('aria-selected', String(selected)); });
    chat.hidden = mode !== 'chat'; advisor.hidden = mode !== 'advisor'; result.hidden = mode !== 'result';
    if (mode === 'advisor') renderAdvisor();
    if (mode === 'result') renderResult();
    if (mode === 'chat') setTimeout(() => document.querySelector('#pz-chat-scroll')?.scrollTo({ top: 0, behavior: state.reducedMotion ? 'auto' : 'smooth' }), 0);
  }

  function renderAdvisor() {
    const question = currentQuestion();
    const options = document.querySelector('#pz-options');
    document.querySelector('#pz-step-label').textContent = `${state.step + 1} / ${questions.length}`;
    document.querySelector('#pz-step-name').textContent = question.label;
    document.querySelector('#pz-question-title').textContent = question.title;
    document.querySelector('#pz-question-help').textContent = question.help;
    document.querySelector('#pz-progress-bar').style.width = `${((state.step + 1) / questions.length) * 100}%`;
    document.querySelector('#pz-back').hidden = state.step === 0;
    options.innerHTML = question.options.map(([value, title, help, iconKey], index) => `<button class="pz-option ${getAnswer(question.key) === value ? 'is-selected' : ''}" type="button" data-option="${value}" style="--delay:${index * 45}ms"><span class="pz-option-icon">${icons[iconKey] || icons.coffee}</span><span><b>${title}</b><small>${help}</small></span><i>${icons.check}</i></button>`).join('');
    document.querySelector('#pz-advisor-scroll').scrollTop = 0;
  }

  function renderResult() {
    const product = state.result || products[0];
    const alt = (state.ranked.find((entry) => entry.product.id !== product.id) || { product: products[1] }).product;
    const bigger = product.id === 'decaf' ? 'Vybrať 500 g alebo 1 kg' : 'Pozrieť väčšie balenie';
    const why = product.reason;
    document.querySelector('#pz-result-scroll').innerHTML = `<div class="pz-result-head"><button class="pz-back pz-icon-btn" id="pz-result-back" type="button" aria-label="Späť na otázky">${icons.back}</button><span>Vaše odporúčanie</span><button class="pz-reset" id="pz-result-reset" type="button">Začať znova</button></div><div class="pz-result-photo"><img src="${product.photo}" alt="${escapeHtml(product.name)} · reálna fotografia prípravy kávy"></div><div class="pz-result-copy"><span class="pz-result-kicker">Najlepšia zhoda s vašimi odpoveďami</span><h2>${escapeHtml(product.name)}</h2><p class="pz-result-detail">${escapeHtml(product.detail)}</p><div class="pz-tags">${product.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join('')}</div><div class="pz-result-facts"><div><small>Príprava</small><b>${formatPrep(getAnswer('prep'))}</b></div><div><small>Acidita</small><b>${escapeHtml(product.acidity)}</b></div></div><p class="pz-why"><strong>Prečo vám sedí</strong>${escapeHtml(why)}</p><a class="pz-primary pz-product-cta" href="${product.url}" target="_blank" rel="noreferrer">Pozrieť produkt ${icons.arrow}</a><div class="pz-alternative"><small>Skvelá alternatíva</small><a href="${alt.url}" target="_blank" rel="noreferrer"><span><b>${escapeHtml(alt.name)}</b><em>${escapeHtml(alt.alternative)}</em></span>${icons.arrow}</a></div><div class="pz-upsell"><small>Hodí sa k tomu</small><button type="button" id="pz-upsell-button"><span><b>${escapeHtml(bigger)}</b><em>Na produktovej stránke si zvolíte balenie podľa spotreby.</em></span>${icons.arrow}</button></div></div>`;
    document.querySelector('#pz-result-back').addEventListener('click', () => { state.result = null; state.screen = 'advisor'; renderMode(); });
    document.querySelector('#pz-result-reset').addEventListener('click', resetAdvisor);
    document.querySelector('#pz-upsell-button').addEventListener('click', () => window.open(product.url, '_blank', 'noopener,noreferrer'));
  }

  function formatPrep(value) { return ({ automatic: 'automat', lever: 'pákový kávovar', moka: 'moka kanvička', filter: 'filter / zalievanie' }[value] || 'podľa preferencie'); }

  function resetAdvisor() { state.screen = 'advisor'; state.step = 0; state.answers = {}; state.result = null; state.ranked = []; renderMode(); }

  async function chooseOption(value) {
    const question = currentQuestion();
    state.answers[question.key] = value;
    renderAdvisor();
    const next = state.step + 1;
    if (next < questions.length) {
      setTimeout(() => { state.step = next; renderAdvisor(); }, state.reducedMotion ? 0 : 330);
    } else {
      await recommendWithFallback();
      state.screen = 'result';
      renderMode();
    }
  }

  function openAdvisor(prefill = {}) { Object.assign(state.answers, prefill); state.result = null; state.screen = 'advisor'; state.step = state.answers.prep ? 1 : 0; renderMode(); }

  function appendChat(author, message) { state.chat.push({ author, message }); const list = document.querySelector('#pz-chat-messages'); if (!list) return; list.innerHTML = state.chat.map((item) => `<div class="pz-chat-row ${item.author === 'user' ? 'is-user' : ''}"><div class="pz-bubble pz-bubble-${item.author}">${escapeHtml(item.message)}</div></div>`).join(''); document.querySelector('#pz-chat-scroll')?.scrollTo({ top: document.querySelector('#pz-chat-scroll').scrollHeight, behavior: state.reducedMotion ? 'auto' : 'smooth' }); }

  function chatReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes('automat')) return 'Do automatu sa hodí stabilný profil s telom. Začnime štyrmi otázkami a vyberieme konkrétnu kávu.';
    if (lower.includes('bez kofe') || lower.includes('decaf')) return 'Rozumiem. Bezkofeínová Brazil je skutočný produkt v ponuke — v poradenstve ju porovnáme s chuťovo podobnými kávami.';
    if (lower.includes('čokol') || lower.includes('cokol')) return 'Čokoládový smer nájdeme najmä v Brazil Santos, Paganini a Puccini. Poradca ešte overí prípravu a mlieko.';
    return 'Pomôžem vám skrátiť výber na jednu konkrétnu kávu. Spustite výber a odpovedzte podľa toho, ako ju pijete.';
  }

  async function sendChat(text) {
    const value = text.trim(); if (!value) return;
    appendChat('user', value);
    let reply = chatReply(value);
    try {
      const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 700);
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: value }), signal: controller.signal });
      clearTimeout(timer);
      if (response.ok) { const payload = await response.json(); reply = payload.reply || reply; }
    } catch (_) { /* Local copy is the graceful API fallback. */ }
    appendChat('assistant', reply);
  }

  function wireEvents() {
    document.querySelectorAll('.pz-open').forEach((button) => button.addEventListener('click', () => setWidget(true)));
    document.querySelector('#pz-launcher').addEventListener('click', () => setWidget(true));
    document.querySelector('#pz-close').addEventListener('click', () => setWidget(false));
    document.querySelector('#pz-backdrop').addEventListener('click', () => setWidget(false));
    document.querySelector('#pz-start-advisor').addEventListener('click', () => openAdvisor());
    document.querySelectorAll('.pz-mode-btn').forEach((button) => button.addEventListener('click', () => { if (button.dataset.mode === 'advisor') openAdvisor(); else { state.result = null; state.screen = 'chat'; renderMode(); } }));
    document.querySelector('#pz-back').addEventListener('click', () => { if (state.step > 0) { state.step -= 1; renderAdvisor(); } });
    document.querySelector('#pz-reset').addEventListener('click', resetAdvisor);
    document.querySelector('#pz-options').addEventListener('click', (event) => { const button = event.target.closest('[data-option]'); if (button) chooseOption(button.dataset.option); });
    document.querySelector('#pz-composer').addEventListener('submit', (event) => { event.preventDefault(); const input = document.querySelector('#pz-input'); const text = input.value; input.value = ''; sendChat(text); });
    document.querySelectorAll('.pz-chip').forEach((button) => button.addEventListener('click', () => {
      const action = button.dataset.chip;
      if (action === 'advisor') { openAdvisor(); return; }
      if (action === 'automatic') { sendChat('Do automatu'); openAdvisor({ prep: 'automatic' }); return; }
      if (action === 'chocolate') { sendChat('Skôr čokoládová'); openAdvisor({ taste: 'chocolate' }); return; }
      if (action === 'decaf') { sendChat('Bez kofeínu'); openAdvisor({ caffeine: 'decaf' }); return; }
    }));
    document.querySelector('.pz-teaser-close').addEventListener('click', () => { document.querySelector('#pz-teaser').hidden = true; });
    document.addEventListener('keydown', (event) => {
      const widget = document.querySelector('#pz-widget');
      if (event.key === 'Escape' && widget.classList.contains('is-open')) { setWidget(false); return; }
      if (event.key !== 'Tab' || !widget.classList.contains('is-open')) return;
      const focusables = [...widget.querySelectorAll('button:not([hidden]), input, a')].filter((element) => !element.disabled && element.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0]; const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  renderShell();
  wireEvents();
  const teaser = document.querySelector('#pz-teaser');
  setTimeout(() => { if (!document.body.classList.contains('pz-lock')) teaser.hidden = false; }, 1000);
})();
