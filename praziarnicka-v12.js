(() => {
  'use strict';

  const root = document.querySelector('#praziarnicka-root');
  if (!root) return;

  const asset = (name) => `/assets/praziarnicka/${name}`;
  const logoUrl = '/brand/praziarnicka-logo-official.png';
  const iconUrl = '/brand/praziarnicka-icon-official.svg';
  const logo = (className = 'pz-logo') => `<img class="${className}" src="${logoUrl}" alt="Pražiarnička by Caffè Vita">`;
  const brandIcon = (className = 'pz-brand-icon') => `<img class="${className}" src="${iconUrl}" alt="">`;
  const svgIcon = (path) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${path}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = {
    arrow: svgIcon('M5 12h13m-5-6 6 6-6 6'),
    send: svgIcon('m4 4 16 8-16 8 3-8-3-8Zm3 8h13'),
    close: svgIcon('m6 6 12 12M18 6 6 18'),
    back: svgIcon('m15 18-6-6 6-6'),
    check: svgIcon('m5 12 4 4L19 6'),
    chat: svgIcon('M5 5h14v10H9l-4 4V5Z'),
    cup: svgIcon('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2'),
    reset: svgIcon('M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6'),
    clock: svgIcon('M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0'),
    list: svgIcon('M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01'),
    bag: svgIcon('M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2'),
    external: svgIcon('M14 5h5v5M19 5l-8 8M18 13v6H5V6h6')
  };

  const products = [
    {
      id: 'paganini', name: 'Paganini blend', price: 'od 11,90 €', profile: 'Plná a čokoládová',
      url: 'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta', photo: asset('official-paganini.jpg'),
      prep: ['automatic', 'lever', 'moka'], taste: ['balanced', 'chocolate', 'strong'], drink: ['milk', 'black', 'both'], caffeine: ['classic'],
      notes: ['čokoláda', 'mandle', 'orechy'], reason: 'Plná, príjemná káva, ktorá sa nestratí ani v cappuccine. Dobrá voľba na každý deň.'
    },
    {
      id: 'brazil', name: 'Brazil Santos', price: 'od 9,90 €', profile: 'Jemná a sladká',
      url: 'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica', photo: asset('official-brazil.jpg'),
      prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'both'], caffeine: ['classic'],
      notes: ['kakao', 'sladkosť', 'jemná chuť'], reason: 'Jemnejšia káva bez výraznej kyslosti. Ľahko sa pije a funguje pri viacerých spôsoboch prípravy.'
    },
    {
      id: 'puccini', name: 'Puccini blend', price: 'od 11,50 €', profile: 'Silná a výrazná',
      url: 'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta', photo: asset('official-puccini.jpg'),
      prep: ['automatic', 'lever', 'moka'], taste: ['strong', 'balanced', 'chocolate'], drink: ['milk', 'both'], caffeine: ['classic'],
      notes: ['tmavá čokoláda', 'marhuľa', 'hustá pena'], reason: 'Výrazná káva s plnou chuťou. Vhodná najmä vtedy, keď ju radi pijete s mliekom.'
    },
    {
      id: 'cuba', name: 'Cuba Serrano Lavado', price: 'od 12,90 €', profile: 'Sladká a orechová',
      url: 'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica', photo: asset('official-cuba.jpg'),
      prep: ['lever', 'moka', 'filter'], taste: ['balanced', 'chocolate'], drink: ['black'], caffeine: ['classic'],
      notes: ['kakao', 'tabak', 'vlašské orechy'], reason: 'Plná a sladká káva s orechovou dochuťou. Najlepšie vynikne bez mlieka.'
    },
    {
      id: 'decaf', name: 'Bezkofeínová Brazil', price: 'od 12,90 €', profile: 'Jemná a bez kofeínu',
      url: 'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia', photo: asset('official-bezkofeinova.jpg'),
      prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['decaf'],
      notes: ['sladká', 'jemná', 'dobrá na večer'], reason: 'Dobrá káva aj na večer. Je jemná a sladká, len bez povzbudenia.'
    }
  ];

  const questions = [
    { key: 'prep', label: 'Príprava', title: 'Ako si kávu pripravujete?', options: [
      ['automatic', 'Automat', 'Rýchlo stlačením tlačidla'],
      ['lever', 'Pákový kávovar', 'Espresso pripravujete ručne'],
      ['moka', 'Moka kanvička', 'Silnejšia káva zo sporáka'],
      ['filter', 'Filter', 'Ľahšia, pomalšia príprava']
    ] },
    { key: 'taste', label: 'Chuť', title: 'Aká chuť vám najviac sedí?', options: [
      ['chocolate', 'Čokoláda a orechy', 'Pokojná a plná chuť'],
      ['balanced', 'Sladká a vyvážená', 'Jemná, bez extrémov'],
      ['fruity', 'Ovocná a svieža', 'Ľahšia a voňavá'],
      ['strong', 'Silná a výrazná', 'Intenzívna chuť']
    ] },
    { key: 'drink', label: 'Nápoj', title: 'Ako ju najčastejšie pijete?', options: [
      ['black', 'Čiernu', 'Espresso, lungo alebo filter'],
      ['milk', 'S mliekom', 'Cappuccino alebo latte'],
      ['both', 'Striedam oboje', 'Univerzálna káva']
    ] },
    { key: 'caffeine', label: 'Kofeín', title: 'Má vás káva povzbudiť?', options: [
      ['classic', 'Áno', 'Klasická káva'],
      ['decaf', 'Radšej bez kofeínu', 'Dobrá aj na večer']
    ] }
  ];

  const state = {
    screen: 'chat', step: 0, answers: {}, result: null, ranked: [], messages: [],
    transitioning: false, typing: false, chipsHidden: false, open: false, lastFocus: null,
    pack: '500 g', addon: false, inCart: false, previewDismissed: false
  };
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const timeNow = () => new Intl.DateTimeFormat('sk-SK', { hour: '2-digit', minute: '2-digit' }).format(new Date());

  root.innerHTML = `
    <main class="pz-page" aria-labelledby="pz-title">
      <header class="pz-page-head">
        <a class="pz-page-brand" href="https://praziarnicka.sk/" target="_blank" rel="noreferrer">${logo('pz-page-logo')}</a>
        <a class="pz-built-by" href="https://mojchatbot.sk" target="_blank" rel="noreferrer"><span>Ukážka riešenia</span><b>mojchatbot.sk</b>${icons.external}</a>
      </header>
      <section class="pz-owner-copy">
        <h1 id="pz-title">Návrh AI chatbota pre Pražiarničku</h1>
        <p class="pz-owner-lead">Zákazník odpovie na štyri otázky o chuti a príprave. Poradca mu odporučí vhodnú kávu a pošle ju rovno do košíka.</p>
        <div class="pz-benefits" aria-label="Čo chatbot dokáže">
          <article><i>01</i><div><b>Odpovie 24/7</b><span>Pomôže aj mimo otváracích hodín.</span></div></article>
          <article><i>02</i><div><b>Vyberie kávu</b><span>Štyri otázky podľa chuti a prípravy.</span></div></article>
          <article><i>03</i><div><b>Zvýši objednávku</b><span>Ponúkne väčšie balenie alebo darček.</span></div></article>
        </div>
        <button class="pz-primary pz-open" type="button">Vyskúšať chatbot ${icons.arrow}</button>
        <div class="pz-owner-links"><a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a><a href="https://praziarnicka.sk/" target="_blank" rel="noreferrer">Web Pražiarničky</a></div>
      </section>
    </main>

    <div class="pz-launcher-wrap">
      <div class="pz-preview" id="pz-preview"><button id="pz-preview-close" type="button" aria-label="Zavrieť náhľad">${icons.close}</button><b>Hľadáte správnu kávu?</b><span>Pomôžem vám vybrať.</span></div>
      <button class="pz-launcher" id="pz-launcher" type="button" aria-label="Otvoriť poradcu Pražiarničky" aria-expanded="false">${brandIcon()}</button>
    </div>
    <div class="pz-backdrop" id="pz-backdrop" hidden></div>
    <section class="pz-widget" id="pz-widget" role="dialog" aria-modal="true" aria-label="Poradca Pražiarničky" aria-hidden="true" hidden>
      <header class="pz-widget-head">
        <div class="pz-widget-brand">${logo('pz-widget-logo')}</div>
        <div class="pz-widget-actions">
          <button class="pz-icon-btn" id="pz-reset" type="button" aria-label="Začať odznova">${icons.reset}</button>
          <button class="pz-icon-btn" id="pz-close" type="button" aria-label="Zavrieť poradcu">${icons.close}</button>
        </div>
      </header>
      <div class="pz-mode" role="tablist" aria-label="Režim poradcu">
        <span class="pz-mode-indicator" aria-hidden="true"></span>
        <button class="pz-mode-btn" data-mode="chat" role="tab" type="button">${icons.chat}<b>Chat</b></button>
        <button class="pz-mode-btn" data-mode="advisor" role="tab" type="button">${icons.cup}<b>Výber kávy</b></button>
      </div>
      <div class="pz-view" id="pz-view"></div>
    </section>`;

  const widget = root.querySelector('#pz-widget');
  const launcher = root.querySelector('#pz-launcher');
  const preview = root.querySelector('#pz-preview');
  const backdrop = root.querySelector('#pz-backdrop');
  const view = root.querySelector('#pz-view');
  const mode = root.querySelector('.pz-mode');

  function score(product) {
    const weights = { prep: 9, taste: 10, drink: 7, caffeine: 14 };
    return questions.reduce((total, question) => {
      const answer = state.answers[question.key];
      if (!answer) return total;
      return total + (product[question.key].includes(answer) ? weights[question.key] : question.key === 'caffeine' ? -14 : -2);
    }, 0);
  }

  function rankProducts() {
    const ranked = products.map((product) => ({ product, score: score(product) })).sort((a, b) => b.score - a.score);
    if (state.answers.caffeine === 'decaf') ranked.sort((a, b) => Number(b.product.id === 'decaf') - Number(a.product.id === 'decaf'));
    state.ranked = ranked;
    state.result = ranked[0].product;
  }

  function cannedReply(text) {
    const query = text.toLocaleLowerCase('sk');
    if (/automat/.test(query)) return 'Do automatu by som vybral Paganini alebo Brazil Santos. Obe sú príjemné a jednoducho sa nastavujú na každý deň.';
    if (/čokol|orech|ovoc/.test(query)) return 'Ak máte radi čokoládu a orechy, skúste Brazil Santos. Je jemná, sladká a bez výraznej kyslosti.';
    if (/mlie|capp|latte/.test(query)) return 'Do cappuccina sa hodí Paganini. Má plnú chuť, ktorá sa v mlieku nestratí.';
    if (/bez kofe|večer/.test(query)) return 'Na večer odporúčam Bezkofeínovú Brazil. Je jemná a sladká, len bez povzbudenia.';
    return 'Pomôžem vám. Najrýchlejšie to pôjde cez krátky výber podľa prípravy a chuti.';
  }

  function messageMarkup(message) {
    if (message.role === 'assistant') {
      return `<div class="pz-message-row pz-message-row-assistant"><span class="pz-assistant-avatar">${brandIcon()}</span><div class="pz-message-stack"><div class="pz-bubble pz-bubble-assistant">${escapeHtml(message.text)}</div><time>${escapeHtml(message.time)}</time></div></div>`;
    }
    return `<div class="pz-message-row pz-message-row-user"><div class="pz-message-stack"><div class="pz-bubble pz-bubble-user">${escapeHtml(message.text)}</div><time>${escapeHtml(message.time)}</time></div></div>`;
  }

  async function sendMessage(text, trigger) {
    const clean = text.trim();
    if (!clean || state.typing) return;
    if (trigger) trigger.classList.add('is-sending');
    state.chipsHidden = true;
    state.messages.push({ role: 'user', text: clean, time: timeNow() });
    state.typing = true;
    renderChat();

    await new Promise((resolve) => setTimeout(resolve, 360));
    const fallback = { role: 'assistant', text: cannedReply(clean), time: timeNow() };
    state.messages.push(fallback);
    state.typing = false;
    renderChat();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ demoId: 'praziarnicka', messages: state.messages.slice(-8).map((item) => ({ role: item.role, content: item.text })) })
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.reply) {
        fallback.text = data.reply;
        fallback.time = timeNow();
        renderChat();
      }
    } catch (_) {
      // The useful local answer remains available if the API is temporarily offline.
    }
  }

  function renderChat() {
    const chips = ['Káva do automatu', 'Na cappuccino', 'Skôr čokoládová', 'Bez kofeínu'];
    const intro = { role: 'assistant', text: 'Dobrý deň. Pomôžem vám vybrať kávu podľa toho, ako ju pripravujete a čo vám chutí.', time: timeNow() };
    view.innerHTML = `
      <div class="pz-chat-panel">
        <div class="pz-chat-scroll" id="pz-chat-scroll">
          <button class="pz-advisor-cta" id="pz-start-advisor" type="button"><span class="pz-advisor-thumb"><img src="${products[0].photo}" alt=""></span><span class="pz-advisor-cta-copy"><b>Nájsť svoju kávu</b><small>4 krátke otázky</small></span>${icons.arrow}</button>
          <div class="pz-day"><span>Dnes</span></div>
          ${messageMarkup(intro)}
          ${state.messages.map(messageMarkup).join('')}
          ${state.typing ? `<div class="pz-message-row pz-message-row-assistant"><span class="pz-assistant-avatar">${brandIcon()}</span><div class="pz-typing"><i></i><i></i><i></i></div></div>` : ''}
        </div>
        <div class="pz-chat-bottom">
          <div class="pz-chips ${state.chipsHidden ? 'is-hidden' : ''}" aria-label="Rýchle možnosti">${chips.map((chip, index) => `<button class="pz-chip" style="--delay:${index * 55}ms" type="button">${chip}</button>`).join('')}</div>
          <form class="pz-composer" id="pz-composer"><input id="pz-input" autocomplete="off" placeholder="Napíšte svoju otázku…" aria-label="Správa"><button class="pz-send" type="submit" aria-label="Odoslať správu">${icons.send}</button></form>
        </div>
      </div>`;
    view.querySelector('#pz-start-advisor').onclick = () => { state.screen = 'advisor'; render(); };
    view.querySelectorAll('.pz-chip').forEach((chip) => { chip.onclick = () => sendMessage(chip.textContent, chip); });
    view.querySelector('#pz-composer').onsubmit = (event) => {
      event.preventDefault();
      const input = view.querySelector('#pz-input');
      const text = input.value;
      input.value = '';
      sendMessage(text);
    };
    requestAnimationFrame(() => {
      const scroll = view.querySelector('#pz-chat-scroll');
      scroll.scrollTop = scroll.scrollHeight;
    });
  }

  function spritePosition(index, step) {
    const points = [0, 33.333, 66.667, 100];
    return `--photo-x:${points[index] || 0}%;--photo-y:${points[step] || 0}%`;
  }

  function renderAdvisor() {
    const question = questions[state.step];
    const selected = state.answers[question.key];
    view.innerHTML = `
      <div class="pz-advisor-panel">
        <div class="pz-advisor-head">
          <button class="pz-back" id="pz-back" type="button" aria-label="Späť" ${state.step === 0 ? 'disabled' : ''}>${icons.back}</button>
          <div class="pz-progress" aria-label="Krok ${state.step + 1} zo ${questions.length}">${questions.map((_, index) => `<i class="${index < state.step ? 'is-done' : index === state.step ? 'is-active' : ''}"></i>`).join('')}</div>
          <b id="stepLabel">${state.step + 1} z ${questions.length}</b>
        </div>
        <div class="pz-advisor-scroll">
          <div class="pz-advisor-copy"><small>${question.label}</small><h2>${question.title}</h2></div>
          <div class="pz-options" data-count="${question.options.length}">
            ${question.options.map(([value, title, help], index) => `
              <button class="pz-option ${selected === value ? 'is-selected' : ''}" data-value="${value}" type="button" aria-pressed="${selected === value}" style="--delay:${index * 55}ms;${spritePosition(index, state.step)}">
                <span class="pz-option-photo" role="img" aria-label="${escapeHtml(title)}"></span>
                <span class="pz-option-copy"><b>${escapeHtml(title)}</b><small>${escapeHtml(help)}</small></span>
                <i>${selected === value ? icons.check : ''}</i>
              </button>`).join('')}
          </div>
        </div>
      </div>`;

    view.querySelectorAll('.pz-option').forEach((option) => {
      option.onclick = () => {
        if (state.transitioning) return;
        state.transitioning = true;
        state.answers[question.key] = option.dataset.value;
        renderAdvisor();
        setTimeout(() => {
          if (state.step < questions.length - 1) {
            state.step += 1;
            state.transitioning = false;
            render();
          } else {
            rankProducts();
            state.transitioning = false;
            render();
          }
        }, 330);
      };
    });
    view.querySelector('#pz-back').onclick = () => {
      if (state.step > 0 && !state.transitioning) {
        state.step -= 1;
        render();
      }
    };
  }

  function renderResult() {
    const product = state.result;
    const alternative = state.ranked.find((item) => item.product.id !== product.id)?.product;
    view.innerHTML = `
      <div class="pz-result">
        <div class="pz-result-head"><button class="pz-back" id="pz-result-back" type="button" aria-label="Späť">${icons.back}</button><div class="pz-progress">${questions.map(() => '<i class="is-done"></i>').join('')}</div><b>Hotovo</b></div>
        <div class="pz-result-scroll">
          <article class="pz-result-card">
            <div class="pz-result-photo"><img src="${product.photo}" alt="${escapeHtml(product.name)}" loading="eager"></div>
            <div class="pz-result-copy"><small>Najlepší výber pre vás</small><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.profile)}</p><b>${escapeHtml(product.price)}</b></div>
          </article>
          <div class="pz-upsell" aria-label="Vyberte veľkosť balenia">
            <div><small>Veľkosť balenia</small><b>Viac kávy, menej objednávania</b></div>
            <div class="pz-pack-options">
              ${['250 g', '500 g', '1 kg'].map((pack) => `<button class="pz-pack ${state.pack === pack ? 'is-selected' : ''}" data-pack="${pack}" type="button">${pack}${pack === '500 g' ? '<em>TOP</em>' : ''}</button>`).join('')}
            </div>
          </div>
          <button class="pz-addon ${state.addon ? 'is-selected' : ''}" id="pz-addon" type="button" aria-pressed="${state.addon}">
            <span class="pz-addon-photos"><img src="${asset('official-brazil.jpg')}" alt=""><img src="${asset('official-cuba.jpg')}" alt=""></span>
            <span class="pz-addon-copy"><small>Pridať navyše</small><b>Degustačné balenie</b><span>Dve 100% arabicy · 39,90 €</span></span>
            <i>${state.addon ? icons.check : '+'}</i>
          </button>
          <button class="pz-product-cta ${state.inCart ? 'is-added' : ''}" id="pz-add-cart" type="button">${state.inCart ? `Pridané do košíka ${icons.check}` : `Pridať ${escapeHtml(state.pack)} do košíka ${icons.arrow}`}</button>
          ${state.inCart ? `<div class="pz-cart-note"><span>${escapeHtml(product.name)} · ${escapeHtml(state.pack)}${state.addon ? ' + degustačné balenie' : ''}</span><a href="${product.url}" target="_blank" rel="noreferrer">Otvoriť e-shop ${icons.external}</a></div>` : ''}
          <div class="pz-tags">${product.notes.map((note) => `<span>${escapeHtml(note)}</span>`).join('')}</div>
          <div class="pz-why"><b>Prečo práve táto?</b><p>${escapeHtml(product.reason)}</p></div>
          ${alternative ? `<article class="pz-alternative"><img src="${alternative.photo}" alt="${escapeHtml(alternative.name)}"><div><small>Ďalšia dobrá voľba</small><b>${escapeHtml(alternative.name)}</b><span>${escapeHtml(alternative.profile)}</span></div><a href="${alternative.url}" target="_blank" rel="noreferrer">Pozrieť ${icons.external}</a></article>` : ''}
          <button class="pz-restart" id="pz-restart" type="button">Skúsiť výber znova</button>
        </div>
      </div>`;
    view.querySelector('#pz-result-back').onclick = () => { state.result = null; state.step = questions.length - 1; render(); };
    view.querySelector('#pz-restart').onclick = resetAdvisor;
    view.querySelectorAll('.pz-pack').forEach((button) => {
      button.onclick = () => {
        state.pack = button.dataset.pack;
        state.inCart = false;
        renderResult();
      };
    });
    view.querySelector('#pz-addon').onclick = () => {
      state.addon = !state.addon;
      state.inCart = false;
      renderResult();
    };
    view.querySelector('#pz-add-cart').onclick = () => {
      state.inCart = true;
      renderResult();
    };
  }

  function render() {
    const activeMode = state.result ? 'advisor' : state.screen;
    mode.classList.toggle('is-advisor', activeMode === 'advisor');
    mode.querySelectorAll('.pz-mode-btn').forEach((button) => {
      const selected = button.dataset.mode === activeMode;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    if (state.result) renderResult();
    else if (state.screen === 'advisor') renderAdvisor();
    else renderChat();
  }

  function resetAdvisor() {
    state.step = 0;
    state.answers = {};
    state.result = null;
    state.ranked = [];
    state.pack = '500 g';
    state.addon = false;
    state.inCart = false;
    state.transitioning = false;
    state.screen = 'advisor';
    render();
  }

  function setWidget(open, screen) {
    if (screen) state.screen = screen;
    state.open = open;
    if (open) {
      state.lastFocus = document.activeElement;
      widget.hidden = false;
      backdrop.hidden = false;
      render();
      requestAnimationFrame(() => {
        widget.classList.add('is-open');
        backdrop.classList.add('is-visible');
      });
    } else {
      widget.classList.remove('is-open');
      backdrop.classList.remove('is-visible');
      setTimeout(() => {
        widget.hidden = true;
        backdrop.hidden = true;
        if (state.lastFocus?.focus) state.lastFocus.focus({ preventScroll: true });
      }, 240);
    }
    widget.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    launcher.classList.toggle('is-hidden', open);
    preview.classList.toggle('is-hidden', open || state.previewDismissed);
  }

  root.querySelectorAll('.pz-open').forEach((button) => { button.onclick = () => setWidget(true, 'chat'); });
  launcher.onclick = () => setWidget(true, 'chat');
  root.querySelector('#pz-preview-close').onclick = () => {
    state.previewDismissed = true;
    preview.classList.add('is-hidden');
  };
  root.querySelector('#pz-close').onclick = () => setWidget(false);
  backdrop.onclick = () => setWidget(false);
  root.querySelector('#pz-reset').onclick = () => {
    state.messages = [];
    state.chipsHidden = false;
    state.typing = false;
    resetAdvisor();
  };
  mode.querySelectorAll('.pz-mode-btn').forEach((button) => {
    button.onclick = () => {
      state.screen = button.dataset.mode;
      if (state.screen === 'chat') state.result = null;
      render();
    };
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && state.open) setWidget(false); });

  render();
  document.body.classList.add('pz-ready');
  if (new URLSearchParams(location.search).has('open')) setTimeout(() => setWidget(true, 'chat'), 320);
})();
