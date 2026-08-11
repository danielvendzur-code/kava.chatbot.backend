(() => {
  const K = window.KF;
  const root = document.querySelector('#coffee-demo-root');
  if (!K || !root) return;

  const mokka = K.byId('mokka');
  const brewFilter = '/assets/kaffa/brew-filter.webp';
  const brewEspresso = '/assets/kaffa/brew-espresso.webp';
  const arrow = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h12M10 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const chatIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 4.5h11v8h-6l-3.5 3v-3H4.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>';
  const cupIcon = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h9v5.5A3.5 3.5 0 0 1 9.5 15h-2A3.5 3.5 0 0 1 4 11.5V6Zm9 2h1.5a2 2 0 0 1 0 4H13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';

  root.innerHTML = `
    <main class="kf-shell">
      <header class="kf-head">
        <div class="kf-brand">
          ${K.wordmark()}
          <span class="kf-brand-copy"><strong>Kaffa Roastery</strong><small>Výberová káva</small></span>
        </div>
        <div class="kf-head-note"><span class="kf-head-dot"></span><span>Online</span></div>
      </header>

      <section class="kf-hero" aria-labelledby="coffeeHeading">
        <div class="kf-copy">
          <h1 id="coffeeHeading">Káva, ktorá vám sadne.</h1>
          <p class="kf-lead">Povedzte nám, ako si kávu pripravujete a čo vám chutí. Za chvíľu vám ukážeme konkrétnu kávu z našej ponuky.</p>
          <div class="kf-benefits" aria-label="Ako vám poradca pomôže">
            <article class="kf-benefit"><span>01</span><div><b>Vyberiete bez hádania</b><p>Stačia štyri krátke odpovede.</p></div></article>
            <article class="kf-benefit"><span>02</span><div><b>Pomoc kedykoľvek</b><p>Na bežné otázky odpovieme aj večer.</p></div></article>
            <article class="kf-benefit"><span>03</span><div><b>Jedna konkrétna káva</b><p>Dostanete jasný tip aj dôvod, prečo vám sadne.</p></div></article>
          </div>
          <div class="kf-actions">
            <button class="kf-primary" id="openAdvisor" type="button">Nájsť svoju kávu ${arrow}</button>
          </div>
        </div>

        <aside class="kf-story" aria-label="Od prípravy ku konkrétnej káve">
          <div class="kf-story-photo">
            <img src="${brewFilter}" alt="Príprava filtrovanej kávy" />
            <span class="kf-story-photo__tag">Príprava → káva</span>
          </div>
          <div class="kf-story-body">
            <div class="kf-story-product">${K.productImage(mokka, 'kf-story-product__img')}</div>
            <div class="kf-story-copy">
              <span class="kf-story-kicker">Pre espresso a mlieko</span>
              <h2>${K.e(mokka.name)}</h2>
              <p>Plná káva s chuťou kakaa a orechov.</p>
              <div class="kf-story-meta"><span>espresso</span><span>kakao a orechy</span><span>od 11,90 €</span></div>
            </div>
          </div>
          <div class="kf-story-foot"><span>Podľa vašej prípravy a chuti</span><button id="openStoryAdvisor" type="button" aria-label="Nájsť svoju kávu">${arrow}</button></div>
        </aside>
      </section>
      <footer class="kf-foot"><span>© Kaffa Roastery</span><a href="https://kaffaroastery.sk" target="_blank" rel="noopener">kaffaroastery.sk ↗</a></footer>
    </main>

    <div class="kf-launcher-wrap">
      <div class="kf-teaser" id="teaser">
        <b>Pomôžeme vám vybrať?</b><span>Odpovedzte na štyri krátke otázky.</span>
        <button class="kf-teaser-close" id="closeTeaser" type="button" aria-label="Zavrieť upozornenie">×</button>
      </div>
      <button class="kf-launcher" id="launcher" type="button" aria-label="Otvoriť Kaffa poradcu"><span>KAFFA</span></button>
    </div>

    <div class="kf-widget" id="widget" role="dialog" aria-modal="true" aria-label="Kaffa Roastery poradca" aria-hidden="true">
      <section class="kf-panel" id="panel">
        <header class="kf-panel-head">
          <div class="kf-widget-brand">
            ${K.wordmark()}
            <span class="kf-widget-brand__copy"><strong>Kaffa Roastery</strong><small><i></i>Online</small></span>
          </div>
          <div class="kf-head-actions">
            <button class="kf-icon-btn kf-reset-btn" id="resetWidget" type="button" aria-label="Začať odznova">↻</button>
            <button class="kf-icon-btn" id="closeWidget" type="button" aria-label="Zavrieť poradcu">×</button>
          </div>
        </header>
        <div class="kf-switch" id="modeSwitch" role="tablist" aria-label="Čo chcete urobiť">
          <button data-view="chat" role="tab" aria-selected="true" type="button"><span>${chatIcon}</span>Chat</button>
          <button data-view="advisor" role="tab" aria-selected="false" type="button"><span>${cupIcon}</span>Výber kávy</button>
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
  const state = { view: 'chat', step: 0, answers: {}, result: false, transitioning: false, messages: [] };
  let lastFocus = null;

  const cannedReply = text => {
    const q = text.toLowerCase();
    if (/automat|espresso|moka|mlie/.test(q)) return 'Do automatu, na espresso aj do mlieka by som začal kávou Mokka. Je plná, sladká a chutí po kakau a orechoch.';
    if (/filter|prekvap|nov/.test(q)) return 'Na filter by vám mohla sadnúť Kenya Kamundu. Je svieža, jemne ovocná a veľmi príjemná aj bez mlieka.';
    if (/kysl|ovoc/.test(q)) return 'Ak nechcete výrazne ovocnú kávu, vyberte Mokka. Ak máte ovocnejšie chute radi, skúste Kenya Kamundu.';
    if (/bez kofe|decaf|večer/.test(q)) return 'Na večer odporúčam Colombia El Diviso bez kofeínu. Stále je sladká a voňavá, len vás nebude zbytočne povzbudzovať.';
    return 'Najistejšie vám poradím cez krátky výber. Odpoviete na štyri otázky a ukážem vám konkrétnu kávu.';
  };

  const messageMarkup = message => message.role === 'bot'
    ? `<div class="kf-message-row"><span class="kf-bot-avatar" aria-hidden="true">K</span><div class="kf-message bot">${K.e(message.text)}</div></div>`
    : `<div class="kf-message user">${K.e(message.text)}</div>`;

  async function send(text, trigger) {
    const clean = text.trim();
    if (!clean) return;
    if (trigger) {
      trigger.disabled = true;
      trigger.classList.add('is-sending');
      await new Promise(resolve => setTimeout(resolve, 180));
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
      // Keep the instant local answer when the live provider is unavailable.
    }
  }

  function renderChat() {
    const chips = ['Káva do automatu', 'Káva na filter', 'Nie veľmi ovocnú', 'Ovocnejšiu kávu'];
    view.innerHTML = `
      <div class="kf-chat">
        <div class="kf-messages ${state.messages.length ? 'has-thread' : ''}" id="messages">
          <div class="kf-chat-seed">
            <button class="kf-advisor-entry" id="advisorEntry" type="button">
              <span class="kf-advisor-entry__mark" aria-hidden="true">K</span>
              <span class="kf-advisor-entry__copy"><b>Nájsť svoju kávu</b><small>4 otázky · výsledok do minúty</small></span>
              <span class="kf-advisor-entry__arrow">${arrow}</span>
            </button>
            <div class="kf-message-row"><span class="kf-bot-avatar" aria-hidden="true">K</span><div class="kf-message bot">Dobrý deň. Povedzte mi, ako si kávu pripravujete alebo čo vám najviac chutí. Pomôžem vám vybrať.</div></div>
            <figure class="kf-chat-editorial">
              <img src="${brewEspresso}" alt="Čerstvo pripravené espresso">
              <figcaption><small>Jednoduchý výber</small><b>Stačí vedieť, ako ju pripravujete a čo vám chutí.</b></figcaption>
            </figure>
          </div>
          ${state.messages.map(messageMarkup).join('')}
        </div>
        <div class="kf-chat-footer">
          <div class="kf-chips" aria-label="Rýchle otázky">${chips.map(chip => `<button class="kf-chip" type="button">${chip}</button>`).join('')}</div>
          <form class="kf-composer" id="composer"><input id="chatInput" autocomplete="off" placeholder="Napíšte svoju otázku…" aria-label="Správa"><button class="kf-send" type="submit" aria-label="Odoslať">${arrow}</button></form>
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
          <img class="kf-result-hero__brew" src="${brewFor(product)}" alt="Pripravená káva">
          <div class="kf-result-hero__copy"><span>Táto vám môže sadnúť</span><h2>${K.e(product.name)}</h2><strong>${K.e(product.price)}</strong></div>
          <div class="kf-result-product">${K.productImage(product, 'kf-result-product__img')}</div>
        </div>
        <div class="kf-result-meta">
          <div class="kf-result-detail"><small>Odkiaľ je</small><b>${K.e(product.origin)}</b></div>
          <div class="kf-result-detail"><small>Aká je</small><b>${K.e(product.process)}</b></div>
          <div class="kf-result-detail"><small>Chutí po</small><b>${K.e(product.taste)}</b></div>
          <div class="kf-result-detail"><small>Hodí sa na</small><b>${K.e(product.prep)}</b></div>
        </div>
        <div class="kf-result-why"><b>Prečo sme ju vybrali</b><p>${K.e(product.why)}</p></div>
        <a class="kf-result-cta" href="${K.e(product.url)}" target="_blank" rel="noopener">Pozrieť kávu ${arrow}</a>
        ${dailyPack ? '<div class="kf-result-next"><b>Praktický tip</b><span>Ak ju pijete denne, väčšie balenie vám vydrží dlhšie.</span></div>' : ''}
        <div class="kf-result-choice">
          <label>Balenie<select aria-label="Balenie">${product.packs.map(pack => `<option>${K.e(pack)}</option>`).join('')}</select></label>
          <label>Pomlieť na<select aria-label="Mletie">${product.grinds.map(grind => `<option>${K.e(grind)}</option>`).join('')}</select></label>
        </div>
        <article class="kf-alternative">
          <div class="kf-alternative__image">${K.productImage(alternative, 'kf-alternative__img')}</div>
          <div class="kf-alternative__copy"><small>Ďalšia možnosť</small><b>${K.e(alternative.name)}</b><span>${K.e(alternative.taste)}</span></div>
          <a href="${K.e(alternative.url)}" target="_blank" rel="noopener">Pozrieť ${arrow}</a>
        </article>
      </section>`;
    K.hydrateImages(stage);
  }

  function spritePosition(index, row) {
    const x = index === 0 ? 0 : index === 1 ? 33.333 : index === 2 ? 66.667 : 100;
    const y = row === 0 ? 0 : row === 1 ? 33.333 : row === 2 ? 66.667 : 100;
    return `--sprite-x:${x}%;--sprite-y:${y}%`;
  }

  function renderQuestion(stage) {
    const question = K.questions[state.step];
    stage.innerHTML = `
      <section class="kf-question">
        <h2>${K.e(question.title)}</h2>
        <div class="kf-options">
          ${question.options.map((option, index) => {
            const [value, title, description] = option;
            const selected = state.answers[question.key] === value;
            return `<button class="kf-option kf-option--photo ${selected ? 'is-selected' : ''}" style="--i:${index};${spritePosition(index, state.step)}" data-value="${K.e(value)}" type="button" aria-pressed="${selected}"><span class="kf-option__visual" role="img" aria-label="${K.e(title)}"></span><span class="kf-option__copy"><b>${K.e(title)}</b><small>${K.e(description)}</small></span><i class="kf-option__state">${selected ? '✓' : '+'}</i></button>`;
          }).join('')}
        </div>
      </section>`;

    stage.querySelectorAll('.kf-option').forEach(option => {
      option.onclick = () => {
        if (state.transitioning) return;
        state.transitioning = true;
        state.answers[question.key] = option.dataset.value;
        stage.querySelectorAll('.kf-option').forEach(candidate => {
          const on = candidate === option;
          candidate.classList.toggle('is-selected', on);
          candidate.setAttribute('aria-pressed', String(on));
          candidate.querySelector('.kf-option__state').textContent = on ? '✓' : '+';
          candidate.disabled = true;
        });
        const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 300;
        setTimeout(advanceQuestion, delay);
      };
    });

    function advanceQuestion() {
      if (!state.answers[question.key]) return;
      if (state.step < K.questions.length - 1) {
        state.step += 1;
        state.transitioning = false;
        renderAdvisor();
      } else {
        stage.innerHTML = '<div class="kf-confirm"><i>✓</i><b>Vaša káva je pripravená.</b><span>Pripravujeme odporúčanie…</span></div>';
        setTimeout(() => { state.result = true; state.transitioning = false; renderAdvisor(); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 10 : 220);
      }
    }
  }

  function renderAdvisor() {
    view.innerHTML = `
      <div class="kf-advisor">
        <div class="kf-progress">
          <button class="kf-progress-back" type="button" aria-label="Späť" ${!state.result && state.step === 0 ? 'disabled' : ''}>${arrow}</button>
          <div class="kf-progress-dots">${K.questions.map((_, index) => `<i class="${state.result || index < state.step ? 'is-done' : index === state.step ? 'is-active' : ''}"></i>`).join('')}</div>
          <span id="stepLabel">${state.result ? 'Hotovo' : `${state.step + 1} z ${K.questions.length}`}</span>
        </div>
        <div class="kf-stage" id="advisorStage"></div>
      </div>`;

    const stage = view.querySelector('#advisorStage');
    if (state.result) renderResult(stage); else renderQuestion(stage);
    view.querySelector('.kf-progress-back').onclick = () => {
      state.transitioning = false;
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

  function resetAll() {
    state.view = 'chat';
    state.step = 0;
    state.answers = {};
    state.result = false;
    state.transitioning = false;
    state.messages = [];
    render();
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
  root.querySelector('#resetWidget').onclick = resetAll;
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
