(() => {
  const K = window.KF;
  const root = document.querySelector('#coffee-demo-root');
  if (!K || !root) return;

  const mokka = K.byId('mokka');
  const brewFilter = '/assets/kaffa/brew-filter.webp';
  const brewEspresso = '/assets/kaffa/brew-espresso.webp';
  const arrow = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h12M10 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  root.innerHTML = `
    <main class="kf-shell">
      <header class="kf-head">
        <div class="kf-brand">
          ${K.wordmark()}
          <span class="kf-brand-copy"><strong>Kaffa Roastery</strong><small>návrh AI poradcu</small></span>
        </div>
        <div class="kf-head-note"><span class="kf-head-dot"></span><span>Ukážka pre majiteľa</span></div>
      </header>

      <section class="kf-hero" aria-labelledby="ownerHeading">
        <div class="kf-copy">
          <h1 id="ownerHeading">Vitajte vo vašom návrhu AI poradcu pre Kaffa Roastery.</h1>
          <p class="kf-lead">Poradca zjednoduší výber medzi espresso blendmi a výberovými kávami bez toho, aby zákazník musel rozumieť odbornej terminológii.</p>
          <div class="kf-benefits" aria-label="Hlavné prínosy">
            <article class="kf-benefit"><span>01</span><div><b>Zjednoduší výber</b><p>Začne spôsobom prípravy a chuťou, nie odbornými názvami.</p></div></article>
            <article class="kf-benefit"><span>02</span><div><b>Odpovie pri rozhodovaní</b><p>Preloží rozdiel medzi blendom, filtrom, aciditou a mliekom.</p></div></article>
            <article class="kf-benefit"><span>03</span><div><b>Dovedie ku konkrétnej káve</b><p>Výsledkom je jeden produkt, jasný dôvod a priame CTA.</p></div></article>
          </div>
          <div class="kf-actions">
            <button class="kf-primary" id="openAdvisor" type="button">Vyskúšať návrh poradcu ${arrow}</button>
            <span class="kf-note">Chat aj 4-krokový výber v jednom kompaktnom widgete.</span>
          </div>
        </div>

        <aside class="kf-story" aria-label="Od prípravy ku konkrétnej káve">
          <div class="kf-story-photo">
            <img src="${brewFilter}" alt="Príprava filtrovanej kávy" />
            <span class="kf-story-photo__tag">Príprava → výber</span>
          </div>
          <div class="kf-story-body">
            <div class="kf-story-product">${K.productImage(mokka, 'kf-story-product__img')}</div>
            <div class="kf-story-copy">
              <span class="kf-story-kicker">Demonštračný výsledok</span>
              <h2>${K.e(mokka.name)}</h2>
              <p>Sladšie espresso s jemnou aciditou a kakaovo-orieškovým profilom.</p>
              <div class="kf-story-meta"><span>espresso</span><span>kakao</span><span>11,90 €</span></div>
            </div>
          </div>
          <div class="kf-story-foot"><span>Skutočný produkt. Konkrétny dôvod.</span><button id="openStoryAdvisor" type="button" aria-label="Otvoriť výber kávy">${arrow}</button></div>
        </aside>
      </section>
      <footer class="kf-foot"><span>Kaffa Roastery · interaktívna ukážka</span><a href="https://mojchatbot.sk" target="_blank" rel="noopener">mojchatbot.sk ↗</a></footer>
    </main>

    <div class="kf-launcher-wrap">
      <div class="kf-teaser" id="teaser">
        <b>Pomôcť s výberom kávy?</b><span>Krátky chat alebo štyri otázky podľa prípravy a chuti.</span>
        <button class="kf-teaser-close" id="closeTeaser" type="button" aria-label="Zavrieť upozornenie">×</button>
      </div>
      <button class="kf-launcher" id="launcher" type="button" aria-label="Otvoriť Kaffa poradcu"><span>KAFFA</span></button>
    </div>

    <div class="kf-widget" id="widget" role="dialog" aria-modal="true" aria-label="Kaffa Roastery AI poradca" aria-hidden="true">
      <section class="kf-panel" id="panel">
        <header class="kf-panel-head">
          <div class="kf-widget-brand">${K.wordmark()}<span class="kf-widget-brand__copy"><strong>Kaffa Roastery</strong><small>AI poradca · výber kávy</small></span></div>
          <button class="kf-icon-btn" id="closeWidget" type="button" aria-label="Zavrieť poradcu">×</button>
        </header>
        <div class="kf-switch" id="modeSwitch" role="tablist" aria-label="Režim poradcu">
          <button data-view="chat" role="tab" aria-selected="true" type="button">Chat</button>
          <button data-view="advisor" role="tab" aria-selected="false" type="button">Výber kávy</button>
        </div>
        <div class="kf-view" id="view" role="tabpanel"></div>
      </section>
    </div>`;

  K.hydrateImages(root);

  const view = root.querySelector('#view');
  const widget = root.querySelector('#widget');
  const panel = root.querySelector('#panel');
  const modeSwitch = root.querySelector('#modeSwitch');
  const closeButton = root.querySelector('#closeWidget');
  const state = { view: 'chat', step: 0, answers: {}, result: false, messages: [] };
  let lastFocus = null;

  const cannedReply = text => {
    const q = text.toLowerCase();
    if (/espresso|blend|automat|moka/.test(q)) return 'Ak chcete sladšie espresso alebo kávu do mlieka, začal by som Mokka Espresso Blend. Má kakaovo-orieškový profil a jemnú aciditu.';
    if (/filter|v60|aero/.test(q)) return 'Na filter je vhodnejší čistejší a aromatickejší profil. Kenya Kamundu je ovocná, ale šťavnatá a vyvážená, nie ostro kyslá.';
    if (/kysl|acid/.test(q)) return 'Ovocnosť a nepríjemná kyslosť nie sú to isté. Ak nechcete ostrý profil, začnite čokoládovejším smerom.';
    if (/ovoc|šťav|stav/.test(q)) return 'Ak chcete ovocnú kávu, začal by som Kenya Kamundu. Ak chcete výraznejší zážitok, Geisha Stellar Origin ide viac do tropického a kvetinového profilu.';
    if (/decaf|kofe/.test(q)) return 'Colombia El Diviso Decaf je výberová bezkofeínová káva. Sugar Cane proces zachováva sladkosť a aromatiku bez kofeínu.';
    return 'Najrýchlejšie vás ku konkrétnej káve dovedie 4-krokový výber. Začína spôsobom prípravy a odborné detaily vysvetlí až vo výsledku.';
  };

  async function send(text, trigger) {
    const clean = text.trim();
    if (!clean) return;
    if (trigger) {
      trigger.disabled = true;
      trigger.classList.add('is-sending');
      await new Promise(resolve => setTimeout(resolve, 240));
    }
    state.messages.push({ role: 'user', text: clean }, { role: 'bot', text: cannedReply(clean) });
    renderChat();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          demoId: 'kaffa',
          messages: state.messages.slice(-8).map(message => ({ role: message.role === 'bot' ? 'assistant' : 'user', content: message.text }))
        })
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.reply && state.messages.length) {
        state.messages[state.messages.length - 1].text = data.reply;
        renderChat();
      }
    } catch (_) {
      // The deterministic reply remains visible when the provider is unavailable.
    }
  }

  function renderChat() {
    const chips = ['Espresso blend', 'Niečo na filter', 'Nechcem kyslú', 'Chcem ovocnú'];
    view.innerHTML = `
      <div class="kf-chat">
        <div class="kf-messages ${state.messages.length ? 'has-thread' : ''}" id="messages">
          <div class="kf-chat-seed">
            <button class="kf-advisor-entry" id="advisorEntry" type="button">
              <span class="kf-advisor-entry__photo"><img src="${brewFilter}" alt="Príprava výberovej kávy"></span>
              <span class="kf-advisor-entry__copy"><small>4 otázky · podľa prípravy a chuti</small><b>Nájsť konkrétnu kávu</b><span>Začneme prípravou, odborný detail vysvetlíme až potom.</span></span>
              <span class="kf-advisor-entry__arrow">${arrow}</span>
            </button>
            <div class="kf-message bot">Dobrý deň. Povedzte, ako kávu pripravujete alebo čo v chuti hľadáte. Odpoviem stručne a bez zbytočnej terminológie.</div>
          </div>
          ${state.messages.map(message => `<div class="kf-message ${message.role}">${K.e(message.text)}</div>`).join('')}
        </div>
        <div class="kf-chat-footer">
          <div class="kf-chips" aria-label="Rýchle otázky">${chips.map(chip => `<button class="kf-chip" type="button">${chip}</button>`).join('')}</div>
          <form class="kf-composer" id="composer"><input id="chatInput" autocomplete="off" placeholder="Opýtajte sa na chuť alebo prípravu…" aria-label="Správa"><button class="kf-send" type="submit" aria-label="Odoslať">${arrow}</button></form>
          <div class="kf-credit">Návrh od <a href="https://mojchatbot.sk" target="_blank" rel="noopener">mojchatbot.sk</a></div>
        </div>
      </div>`;

    view.querySelector('#advisorEntry').onclick = () => { state.view = 'advisor'; render(); };
    view.querySelectorAll('.kf-chip').forEach(chip => { chip.onclick = () => send(chip.textContent, chip); });
    view.querySelector('#composer').onsubmit = event => {
      event.preventDefault();
      const input = view.querySelector('#chatInput');
      const text = input.value;
      input.value = '';
      send(text);
    };
    const messages = view.querySelector('#messages');
    messages.scrollTop = messages.scrollHeight;
  }

  const scoreProduct = product => K.questions.reduce((score, question) => {
    const answer = state.answers[question.key];
    return score + (product.weights[question.key]?.[answer] || 0);
  }, 0);

  const brewFor = product => product.id === 'mokka' ? brewEspresso : brewFilter;

  function renderResult(stage) {
    const ranked = [...K.products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
    const product = ranked[0];
    const alternative = ranked.find(item => item.id !== product.id) || ranked[1];
    const dailyPack = product.id === 'mokka' && product.packs.includes('1 kg');
    stage.innerHTML = `
      <section class="kf-result" aria-live="polite">
        <div class="kf-result-hero">
          <img class="kf-result-hero__brew" src="${brewFor(product)}" alt="Káva pripravená spôsobom vhodným pre odporúčanie">
          <div class="kf-result-hero__copy"><span>Odporúčanie podľa odpovedí</span><h2>${K.e(product.name)}</h2><strong>${K.e(product.price)}</strong></div>
          <div class="kf-result-product">${K.productImage(product, 'kf-result-product__img')}</div>
        </div>
        <div class="kf-result-meta">
          <div class="kf-result-detail"><small>Pôvod</small><b>${K.e(product.origin)}</b></div>
          <div class="kf-result-detail"><small>Spracovanie</small><b>${K.e(product.process)}</b></div>
          <div class="kf-result-detail"><small>Chuť</small><b>${K.e(product.taste)}</b></div>
          <div class="kf-result-detail"><small>Príprava</small><b>${K.e(product.prep)}</b></div>
        </div>
        <div class="kf-result-why"><b>Prečo práve táto</b><p>${K.e(product.why)}</p></div>
        <a class="kf-result-cta" href="${K.e(product.url)}" target="_blank" rel="noopener">Pozrieť kávu v e-shope ${arrow}</a>
        ${dailyPack ? '<div class="kf-result-next"><b>Hodí sa k tomu</b><span>Pijete ju denne? 1 kg balenie je praktickejšia zásoba pre každodenné espresso.</span></div>' : ''}
        <div class="kf-result-choice">
          <label>Balenie<select aria-label="Balenie">${product.packs.map(pack => `<option>${K.e(pack)}</option>`).join('')}</select></label>
          <label>Mletie<select aria-label="Mletie">${product.grinds.map(grind => `<option>${K.e(grind)}</option>`).join('')}</select></label>
        </div>
        <article class="kf-alternative">
          <div class="kf-alternative__image">${K.productImage(alternative, 'kf-alternative__img')}</div>
          <div class="kf-alternative__copy"><small>Jedna alternatíva</small><b>${K.e(alternative.name)}</b><span>${K.e(alternative.taste)}</span></div>
          <a href="${K.e(alternative.url)}" target="_blank" rel="noopener">Skúsiť ${arrow}</a>
        </article>
      </section>`;
    K.hydrateImages(stage);
  }

  function renderQuestion(stage) {
    const question = K.questions[state.step];
    stage.innerHTML = `
      <section class="kf-question">
        <h2>${K.e(question.title)}</h2>
        <p>${K.e(question.hint)}</p>
        <div class="kf-options">
          ${question.options.map((option, index) => {
            const [value, title, description, photoKey] = option;
            const selected = state.answers[question.key] === value;
            if (question.photo) {
              return `<button class="kf-option kf-option--photo ${selected ? 'is-selected' : ''}" style="--i:${index}" data-value="${K.e(value)}" type="button"><span class="kf-option__visual"><img src="${K.e(K.prepPhotos[photoKey])}" alt="${K.e(title)}"></span><span class="kf-option__copy"><b>${K.e(title)}</b><small>${K.e(description)}</small></span><i class="kf-option__state">${selected ? '✓' : '+'}</i></button>`;
            }
            return `<button class="kf-option ${selected ? 'is-selected' : ''}" style="--i:${index}" data-value="${K.e(value)}" type="button"><b>${K.e(title)}</b><small>${K.e(description)}</small><i class="kf-option__state">${selected ? '✓' : '+'}</i></button>`;
          }).join('')}
        </div>
      </section>`;

    stage.querySelectorAll('.kf-option').forEach(option => {
      option.onclick = () => {
        state.answers[question.key] = option.dataset.value;
        stage.querySelectorAll('.kf-option').forEach(candidate => {
          const on = candidate === option;
          candidate.classList.toggle('is-selected', on);
          candidate.querySelector('.kf-option__state').textContent = on ? '✓' : '+';
        });
        setTimeout(() => {
          if (state.step < K.questions.length - 1) {
            state.step += 1;
            renderAdvisor();
          } else {
            stage.innerHTML = '<div class="kf-confirm"><i>✓</i><b>Odporúčanie je pripravené.</b><span>Teraz už ukážeme aj odborný detail.</span></div>';
            setTimeout(() => { state.result = true; renderAdvisor(); }, 420);
          }
        }, 220);
      };
    });
  }

  function renderAdvisor() {
    view.innerHTML = `
      <div class="kf-advisor">
        <div class="kf-progress">
          <button class="kf-progress-back" type="button" aria-label="Späť" ${!state.result && state.step === 0 ? 'disabled' : ''}>${arrow}</button>
          <div class="kf-progress-dots">${K.questions.map((_, index) => `<i class="${state.result || index < state.step ? 'is-done' : index === state.step ? 'is-active' : ''}"></i>`).join('')}</div>
          <span>${state.result ? 'Hotovo' : `${state.step + 1} / ${K.questions.length}`}</span>
        </div>
        <div class="kf-stage" id="advisorStage"></div>
        <div class="kf-advisor-foot">Návrh od <a href="https://mojchatbot.sk" target="_blank" rel="noopener">mojchatbot.sk</a></div>
      </div>`;

    const stage = view.querySelector('#advisorStage');
    if (state.result) renderResult(stage); else renderQuestion(stage);
    view.querySelector('.kf-progress-back').onclick = () => {
      if (state.result) { state.result = false; state.step = K.questions.length - 1; }
      else if (state.step > 0) state.step -= 1;
      renderAdvisor();
    };
  }

  function render() {
    modeSwitch.classList.toggle('is-advisor', state.view === 'advisor');
    root.querySelectorAll('.kf-switch button').forEach(button => button.setAttribute('aria-selected', String(button.dataset.view === state.view)));
    if (state.view === 'chat') renderChat(); else renderAdvisor();
  }

  function syncViewport() {
    const vv = window.visualViewport;
    const height = vv ? Math.round(vv.height) : window.innerHeight;
    document.documentElement.style.setProperty('--kf-vh', `${height}px`);
    const keyboard = window.matchMedia('(max-width:560px)').matches && vv && (window.innerHeight - vv.height > 120);
    document.body.classList.toggle('kf-keyboard', Boolean(keyboard));
  }

  function focusables() {
    return [...panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node => node.offsetParent !== null);
  }

  function openWidget(mode) {
    if (mode) state.view = mode;
    lastFocus = document.activeElement;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    document.body.classList.add('kf-lock');
    render();
    syncViewport();
    setTimeout(() => closeButton.focus(), 30);
  }

  function closeWidget() {
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('kf-lock', 'kf-keyboard');
    document.documentElement.style.removeProperty('--kf-vh');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  root.querySelector('#openAdvisor').onclick = () => openWidget('advisor');
  root.querySelector('#openStoryAdvisor').onclick = () => openWidget('advisor');
  root.querySelector('#launcher').onclick = () => openWidget('chat');
  closeButton.onclick = closeWidget;
  root.querySelector('#closeTeaser').onclick = () => root.querySelector('#teaser')?.remove();
  root.querySelectorAll('.kf-switch button').forEach(button => { button.onclick = () => { state.view = button.dataset.view; render(); }; });
  widget.onclick = event => { if (event.target === widget && window.innerWidth > 560) closeWidget(); };

  document.addEventListener('keydown', event => {
    if (!widget.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeWidget(); return; }
    if (event.key !== 'Tab') return;
    const nodes = focusables();
    if (!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.addEventListener('resize', syncViewport, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewport, { passive: true });
    window.visualViewport.addEventListener('scroll', syncViewport, { passive: true });
  }

  render();
})();
