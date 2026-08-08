(() => {
  'use strict';

  const app = window.DIAMONDS_APP;
  if (!app) return;

  const { config, $, $$, esc, icon, officialLogo, productImage, questions, state, products } = app;
  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#teaser');
  const launcherButton = $('#launcherButton');
  const chatMessages = $('#chatMessages');
  const quickChips = $('#quickChips');
  const chatInput = $('#chatInput');
  const advisorContent = $('#advisorContent');
  const progressFill = $('#progressFill');
  const progressText = $('#progressText');
  const backButton = $('#backButton');
  let transitionTimer = null;

  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const visibleFocusable = () => $$(focusableSelector, widget).filter((element) => element.offsetParent !== null);

  function renderChat() {
    chatMessages.innerHTML = state.chat.map((message) => `<div class="chat-line chat-line--${message.role}"><div class="chat-bubble">${esc(message.content)}</div></div>`).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderQuick() {
    quickChips.innerHTML = config.quick.map((prompt) => `<button type="button" data-prompt="${esc(prompt)}">${esc(prompt)}</button>`).join('');
  }

  function lockPage() {
    state.scrollY = window.scrollY;
    if (window.innerWidth > 680) {
      document.documentElement.classList.add('widget-open');
      return;
    }
    Object.assign(document.body.style, { position: 'fixed', top: `-${state.scrollY}px`, left: '0', right: '0', width: '100%' });
  }

  function unlockPage() {
    document.documentElement.classList.remove('widget-open');
    if (document.body.style.position === 'fixed') {
      document.body.removeAttribute('style');
      window.scrollTo(0, state.scrollY);
    }
  }

  function syncVisualViewport() {
    if (window.innerWidth > 680 || !window.visualViewport) {
      widget.style.removeProperty('height');
      widget.style.removeProperty('top');
      return;
    }
    widget.style.height = `${Math.round(window.visualViewport.height)}px`;
    widget.style.top = `${Math.round(window.visualViewport.offsetTop)}px`;
  }

  function focusWidget() {
    window.requestAnimationFrame(() => $('#closeWidget')?.focus());
  }

  function openWidget(mode = state.mode) {
    if (!state.open) state.lastFocused = document.activeElement;
    state.open = true;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    launcherButton.setAttribute('aria-expanded', 'true');
    launcher.classList.add('is-hidden');
    teaser.classList.add('is-hidden');
    lockPage();
    syncVisualViewport();
    switchMode(mode);
    focusWidget();
  }

  function closeWidget() {
    state.open = false;
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    launcherButton.setAttribute('aria-expanded', 'false');
    launcher.classList.remove('is-hidden');
    widget.classList.remove('keyboard-open');
    unlockPage();
    widget.style.removeProperty('height');
    widget.style.removeProperty('top');
    if (state.lastFocused && typeof state.lastFocused.focus === 'function') state.lastFocused.focus();
  }

  function switchMode(mode) {
    state.mode = mode;
    $$('.mode-switch button').forEach((button) => {
      const active = button.dataset.mode === mode;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('.mode-switch').dataset.mode = mode;
    $('#chatScreen').classList.toggle('is-active', mode === 'chat');
    $('#advisorScreen').classList.toggle('is-active', mode === 'advisor');
    if (mode === 'advisor') renderAdvisor();
  }

  function scoreProduct(product) {
    const weights = { prep: 6, taste: 5, drink: 3, caffeine: 10 };
    let score = 0;
    Object.entries(state.answers).forEach(([key, answer]) => {
      if ((product[key] || []).includes(answer)) score += weights[key];
      else score -= key === 'caffeine' ? 14 : 4;
    });
    if (state.answers.taste === 'fruity' && product.id === 'kenya-mugaya') score += 3;
    if (state.answers.caffeine === 'decaf' && product.id === 'el-buho') score += 3;
    if (state.answers.prep === 'filter' && product.id === 'kenya-mugaya') score += 2;
    return score;
  }

  function calculateResult() {
    const ranked = products.map((product, index) => ({ product, index, score: scoreProduct(product) })).sort((a, b) => b.score - a.score || a.index - b.index);
    state.result = ranked[0]?.product || products[0];
    state.alternative = ranked.find((item) => item.product.id !== state.result.id)?.product || products[1];
  }

  function optionCard(option, questionId) {
    const selected = state.answers[questionId] === option.value;
    return `<button type="button" class="answer-card${selected ? ' is-selected' : ''}" data-answer="${esc(option.value)}" aria-pressed="${String(selected)}"><span class="answer-icon">${icon(option.icon)}</span><span class="answer-copy"><b>${esc(option.title)}</b><small>${esc(option.description)}</small></span><span class="answer-radio" aria-hidden="true"></span></button>`;
  }

  function renderQuestion() {
    const question = questions[state.step];
    progressText.textContent = `${state.step + 1} / ${questions.length}`;
    progressFill.style.width = `${((state.step + 1) / questions.length) * 100}%`;
    backButton.disabled = state.step === 0;
    advisorContent.innerHTML = `<div class="question-view"><span class="question-kicker">${esc(question.eyebrow)}</span><h2>${esc(question.title)}</h2><p>${esc(question.help)}</p><div class="answers">${question.options.map((option) => optionCard(option, question.id)).join('')}</div></div>`;
    $$('.answer-card', advisorContent).forEach((button) => button.addEventListener('click', () => {
      if (state.transitioning) return;
      state.transitioning = true;
      state.answers[question.id] = button.dataset.answer;
      $$('.answer-card', advisorContent).forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      transitionTimer = window.setTimeout(() => {
        state.transitioning = false;
        if (state.step < questions.length - 1) {
          state.step += 1;
          renderQuestion();
        } else {
          calculateResult();
          renderResult();
        }
      }, reducedMotion() ? 0 : 180);
    }));
  }

  function prepLabel(values) {
    const labels = { filter: 'Filter', espresso: 'Espresso', automatic: 'Automat', moka: 'Moka' };
    return values.map((value) => labels[value] || value).join(' · ');
  }

  function renderResult() {
    const product = state.result;
    const alternative = state.alternative;
    progressText.textContent = 'Výsledok';
    progressFill.style.width = '100%';
    backButton.disabled = false;
    advisorContent.innerHTML = `<div class="result-view"><span class="question-kicker">Odporúčanie pripravené</span><article class="result-editorial"><div class="result-photo-wrap">${productImage(product, 'result-photo')}</div><div class="result-copy"><span class="result-label">Vaša káva</span><h2>${esc(product.name)}</h2><p class="result-taste"><b>Chuťový profil</b>${product.tags.join(' · ')}</p><div class="result-meta"><span>${esc(product.origin)}</span>${product.process ? `<span>${esc(product.process)}</span>` : ''}</div><dl class="result-facts"><div><dt>Príprava</dt><dd>${esc(prepLabel(product.prep))}</dd></div><div><dt>Sviežosť / acidita</dt><dd>${esc(product.acidity)}</dd></div><div><dt>Cena na e-shope</dt><dd>${esc(product.price)}</dd></div></dl><div class="result-why"><b>Prečo práve táto</b><p>${esc(product.reason)}</p></div><a class="result-cta" href="${esc(product.url)}" target="_blank" rel="noreferrer">Pozrieť produkt ${icon('shop')}</a></div></article><article class="alternative"><div class="alternative-media">${productImage(alternative, 'alternative-photo')}</div><div><small>Jedna relevantná alternatíva</small><b>${esc(alternative.name)}</b><span>${esc(alternative.tags.slice(0, 3).join(' · '))}</span></div><a href="${esc(alternative.url)}" target="_blank" rel="noreferrer" aria-label="Pozrieť ${esc(alternative.name)}">${icon('arrow')}</a></article><div class="next-best-action"><span>${icon('info')}</span><p>${esc(product.upsell)}</p><a href="${esc(product.url)}" target="_blank" rel="noreferrer">Väčšie balenia ${icon('arrow')}</a></div><button id="restartAdvisor" class="restart" type="button">Začať výber odznova</button></div>`;
    $('#restartAdvisor').addEventListener('click', resetAdvisor);
  }

  function renderAdvisor() {
    if (state.result) renderResult();
    else renderQuestion();
  }

  function resetAdvisor() {
    if (transitionTimer) window.clearTimeout(transitionTimer);
    state.transitioning = false;
    state.step = 0;
    state.answers = {};
    state.result = null;
    state.alternative = null;
    renderQuestion();
  }

  function resetAll() {
    resetAdvisor();
    state.chat = [{ role: 'assistant', content: config.welcome }];
    renderChat();
    switchMode('chat');
  }

  async function sendChat(message) {
    const clean = message.trim().slice(0, 700);
    if (!clean || chatInput.disabled) return;
    state.chat.push({ role: 'user', content: clean });
    renderChat();
    chatInput.value = '';
    chatInput.disabled = true;
    $('.composer button').disabled = true;
    const pending = { role: 'assistant', content: 'Premýšľam…', pending: true };
    state.chat.push(pending);
    renderChat();
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ demoId: 'diamonds', messages: state.chat.filter((item) => !item.pending).map(({ role, content }) => ({ role, content })) }) });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      pending.content = String(data.reply || '').trim() || 'Najpresnejšie odporúčanie získate cez krátky výber kávy.';
    } catch {
      pending.content = 'Chat sa teraz nepodarilo načítať. Výber kávy funguje ďalej a odporučí produkt podľa štyroch odpovedí.';
    } finally {
      delete pending.pending;
      chatInput.disabled = false;
      $('.composer button').disabled = false;
      renderChat();
    }
  }

  function trapFocus(event) {
    if (!state.open || event.key !== 'Tab') return;
    const items = visibleFocusable();
    if (!items.length) {
      event.preventDefault();
      widget.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  $('#heroOpen').addEventListener('click', () => openWidget('chat'));
  $('#heroAdvisor').addEventListener('click', () => openWidget('advisor'));
  launcherButton.addEventListener('click', () => openWidget(state.mode));
  $('#teaserClose').addEventListener('click', () => teaser.classList.add('is-hidden'));
  $('#closeWidget').addEventListener('click', closeWidget);
  $('#resetAll').addEventListener('click', resetAll);
  $('#openAdvisor').addEventListener('click', () => switchMode('advisor'));
  $$('.mode-switch button').forEach((button) => button.addEventListener('click', () => switchMode(button.dataset.mode)));
  backButton.addEventListener('click', () => {
    if (state.result) {
      state.result = null;
      state.alternative = null;
      state.step = questions.length - 1;
      renderQuestion();
    } else if (state.step > 0) {
      state.step -= 1;
      renderQuestion();
    }
  });
  $('#chatForm').addEventListener('submit', (event) => { event.preventDefault(); sendChat(chatInput.value); });
  quickChips.addEventListener('click', (event) => { const button = event.target.closest('[data-prompt]'); if (button) sendChat(button.dataset.prompt); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open) closeWidget();
    trapFocus(event);
  });
  chatInput.addEventListener('focus', () => { widget.classList.add('keyboard-open'); syncVisualViewport(); });
  chatInput.addEventListener('blur', () => window.setTimeout(() => widget.classList.remove('keyboard-open'), 120));
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncVisualViewport, { passive: true });
    window.visualViewport.addEventListener('scroll', syncVisualViewport, { passive: true });
  }

  renderQuick();
  renderChat();
  renderQuestion();
})();
