(() => {
  const K = window.KF;
  const root = document.querySelector('#coffee-demo-root');
  if (!K || !root) return;

  const mokka = K.byId('mokka');
  const filterCoffee = K.byId('kamundu');
  const brew = '/assets/kaffa/brew-filter.webp';

  root.innerHTML = `
    <main class="kf-shell">
      <header class="kf-head">
        <div class="kf-brand">
          ${K.wordmark()}
          <span class="kf-brand-copy"><strong>Kaffa Roastery</strong><small>návrh AI poradcu</small></span>
        </div>
        <div class="kf-status"><span>Personalizovaná ukážka pre majiteľa</span></div>
      </header>

      <section class="kf-hero">
        <div class="kf-copy">
          <p class="kf-owner-label">Návrh pre Kaffa Roastery</p>
          <h1>Vitajte vo vašom návrhu <span>AI poradcu pre Kaffa Roastery.</span></h1>
          <p class="kf-lead">Takto môže váš e-shop zákazníkovi zjednodušiť výber medzi espresso blendmi a výberovými kávami bez toho, aby musel rozumieť odbornej terminológii.</p>
          <div class="kf-benefits" aria-label="Hlavné prínosy">
            <article class="kf-benefit"><i></i><b>Zjednoduší výber</b><span>Začne prípravou a chuťou, nie odbornými názvami spracovania.</span></article>
            <article class="kf-benefit"><i></i><b>Odpovie pri rozhodovaní</b><span>Vysvetlí aciditu, mlieko, filter aj rozdiel medzi profilmi.</span></article>
            <article class="kf-benefit"><i></i><b>Dovedie ku konkrétnej káve</b><span>Výsledkom je produkt, dôvod odporúčania a priame CTA do e-shopu.</span></article>
          </div>
          <div class="kf-actions">
            <button class="kf-primary" id="openAdvisor" type="button">Vyskúšať návrh poradcu →</button>
            <small class="kf-note">Chat a 4-krokový výber sú v jednom kompaktnom widgete.</small>
          </div>
        </div>

        <aside class="kf-story" aria-label="Ukážka produktového príbehu">
          <section class="kf-story-main">
            <div class="kf-story-photo">
              <img src="${brew}" alt="Príprava filtrovanej kávy">
              <span class="kf-story-photo__tag">od prípravy k produktu</span>
            </div>
            <div class="kf-story-body">
              <div class="kf-story-product">${K.productImage(mokka)}</div>
              <div class="kf-story-copy">
                <small>Ukážka odporúčania</small>
                <h2>${K.e(mokka.name)}</h2>
                <p>Zákazník dostane jasný dôvod výberu a až potom odborný detail.</p>
                <div class="kf-story-meta"><span>espresso</span><span>kakao</span><span>mlieko</span></div>
              </div>
            </div>
          </section>
          <div class="kf-story-note"><b>Nie ďalší katalóg.</b>Poradca zúži výber a odporučí jednu kávu podľa reálneho spôsobu prípravy.</div>
        </aside>
      </section>
      <footer class="kf-foot"><a href="https://mojchatbot.sk" target="_blank" rel="noopener">mojchatbot.sk ↗</a></footer>
    </main>

    <div class="kf-launcher-wrap">
      <div class="kf-teaser" id="teaser">
        <b>Pomôcť s výberom kávy?</b><span>Krátky chat alebo 4 otázky podľa chuti.</span>
        <button class="kf-teaser-close" id="closeTeaser" type="button" aria-label="Zavrieť teaser">×</button>
      </div>
      <button class="kf-launcher" id="launcher" type="button" aria-label="Otvoriť Kaffa poradcu"><span class="kf-mini-mark">KF</span></button>
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
    if (/kysl|acid/.test(q)) return 'Ovocnosť a nepríjemná kyslosť nie sú to isté. Ak nechcete ostrý profil, zvoľte čokoládovejší smer alebo Mokka Espresso Blend.';
    if (/ovoc|šťav|stav/.test(q)) return 'Ak chcete ovocnú kávu, na filtri by som začal Kenya Kamundu. Ak chcete výraznejší zážitok, Geisha Stellar Origin ide viac do tropického a kvetinového profilu.';
    if (/decaf|kofe/.test(q)) return 'Colombia El Diviso Decaf je výberová bezkofeínová káva. Sugar Cane proces zachováva sladkosť a aromatiku bez kofeínu.';
    return 'Najrýchlejšie vás ku konkrétnej káve dovedie 4-krokový výber. Začína spôsobom prípravy a až na konci vysvetlí odborné detaily.';
  };

  async function send(text, trigger) {
    const clean = text.trim();
    if (!clean) return;
    if (trigger) {
      trigger.disabled = true;
      trigger.classList.add('is-sending');
      await new Promise(resolve => setTimeout(resolve, 320));
    }
    state.messages.push({ role: 'user', text: clean }, { role: 'bot', text: cannedReply(clean) });
    renderChat();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          demoId: 'kaffa',
          messages: state.messages.slice(-8).map(message => ({
            role: message.role === 'bot' ? 'assistant' : 'user',
            content: message.text
          }))
        })
      });
      if (!response.ok) return;
      const data = await response.json();
      if (data.reply && state.messages.length) {
        state.messages[state.messages.length - 1].text = data.reply;
        renderChat();
      }
    } catch (_) {}
  }

  function renderChat() {
    const chips = ['Espresso blend', 'Niečo na filter', 'Nechcem kyslú', 'Chcem ovocnú'];
    view.innerHTML = `
      <div class="kf-chat">
        <div class="kf-messages ${state.messages.length ? 'has-thread' : ''}" id="messages">
          <div class="kf-chat-seed">
            <button class="kf-advisor-entry" id="advisorEntry" type="button">
              <span class="kf-advisor-entry__photo"><img src="${brew}" alt="Príprava výberovej kávy"></span>
              <span class="kf-advisor-entry__copy"><small>4 otázky · podľa chuti</small><b>Nájsť konkrétnu kávu</b><span>Príprava → chuť → mlieko → kofeín.</span></span>
              <span class="kf-advisor-entry__arrow">→</span>
            </button>
            <div class="kf-message bot">Dobrý deň. Povedzte, ako kávu pripravujete alebo čo v chuti hľadáte. Odpoviem stručne a bez zbytočnej terminológie.</div>
          </div>
          ${state.messages.map(message => `<div class="kf-message ${message.role}">${K.e(message.text)}</div>`).join('')}
        </div>
        <div class="kf-chat-footer">
          <div class="kf-chips" aria-label="Rýchle otázky">${chips.map(chip => `<button class="kf-chip" type="button">${chip}</button>`).join('')}</div>
          <form class="kf-composer" id="composer"><input id="chatInput" autocomplete="off" placeholder="Opýtajte sa na chuť alebo prípravu…" aria-label="Správa"><button class="kf-send" type="submit" aria-label="Odoslať">→</button></form>
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

  const scoreProduct = product => {
    let score = 0;
    Object.values(state.answers).forEach(answer => { if (product.keys.includes(answer)) score += 4; });
    if (state.answers.caffeine === 'decaf') score += product.id === 'decaf' ? 20 : -20;
    if (state.answers.drink === 'milk' && product.id === 'mokka') score += 8;
    if (state.answers.prep === 'automatic' && product.id === 'mokka') score += 6;
    if (state.answers.taste === 'balanced' && product.id === 'mokka') score += 3;
    if (state.answers.taste === 'adventurous' && product.id === 'geisha') score += 8;
    return score;
  };

  const brewFor = product => product.keys.includes('filter') ? '/assets/kaffa/brew-filter.webp' : '/assets/kaffa/brew-espresso.webp';

  function renderResult(stage) {
    const ranked = [...K.products].sort((a, b) => scoreProduct(b) - scoreProduct(a));
    const product = ranked[0];
    const alternative = ranked.find(item => item.id !== product.id) || ranked[1];
    stage.innerHTML = `
      <section class="kf-result" aria-live="polite">
        <div class="kf-result-hero">
          <img class="kf-result-hero__brew" src="${brewFor(product)}" alt="Káva pripravená spôsobom vhodným pre odporúčanie">
          ${K.productImage(product, 'kf-result-bag')}
          <div class="kf-result-hero__copy"><small>Odporúčanie podľa odpovedí</small><h2>${K.e(product.name)}</h2><div class="kf-result-price">${K.e(product.price)}</div></div>
        </div>
        <div class="kf-result-meta">
          <div class="kf-result-detail"><small>Pôvod</small><b>${K.e(product.origin)}</b></div>
          <div class="kf-result-detail"><small>Spracovanie</small><b>${K.e(product.process)}</b></div>
          <div class="kf-result-detail"><small>Chuť</small><b>${K.e(product.taste)}</b></div>
          <div class="kf-result-detail"><small>Príprava</small><b>${K.e(product.prep)}</b></div>
        </div>
        <div class="kf-result-why"><b>Prečo práve táto</b><p>${K.e(product.why)}</p></div>
        <a class="kf-result-cta" href="${K.e(product.url)}" target="_blank" rel="noopener">Pozrieť ${K.e(product.name)} v e-shope ↗</a>
        <div class="kf-result-choice">
          <label>Balenie<select aria-label="Balenie">${product.packs.map(pack => `<option>${K.e(pack)}</option>`).join('')}</select></label>
          <label>Mletie<select aria-label="Mletie">${product.grinds.map(grind => `<option>${K.e(grind)}</option>`).join('')}</select></label>
        </div>
        <article class="kf-alternative">
          <div class="kf-alternative__image">${K.productImage(alternative)}</div>
          <div class="kf-alternative__copy"><small>Alternatíva</small><b>${K.e(alternative.name)}</b><span>${K.e(alternative.taste)}</span></div>
          <a href="${K.e(alternative.url)}" target="_blank" rel="noopener">Pozrieť ↗</a>
        </article>
      </section>`;
    K.hydrateImages(stage);
  }

  function renderQuestion(stage) {
    const question = K.questions[state.step];
    stage.innerHTML = `
      <section class="kf-question">
        <span class="kf-question__kicker">Krok ${state.step + 1} z ${K.questions.length}</span>
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
            stage.innerHTML = '<div class="kf-confirm"><i>✓</i><b>Odporúčanie je pripravené.</b><span>Teraz už môžeme ukázať aj odborný detail.</span></div>';
            setTimeout(() => { state.result = true; renderAdvisor(); }, 520);
          }
        }, 240);
      };
    });
  }

  function renderAdvisor() {
    view.innerHTML = `
      <div class="kf-advisor">
        <div class="kf-progress">
          <button class="kf-progress-back" type="button" aria-label="Späť" ${!state.result && state.step === 0 ? 'disabled' : ''}>←</button>
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
