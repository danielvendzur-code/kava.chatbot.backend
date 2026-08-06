(() => {
  'use strict';

  const foundation = window.DIAMONDS_ADVISOR_FOUNDATION || {};
  const { config, $, $$, escapeHtml, icon, advisorMark, productMedia, questions, state } = foundation;
  if (!config) return;

  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#launcherTeaser');
  const chatMessages = $('#chatMessages');
  const quickChips = $('#quickChips');
  const chatInput = $('#chatInput');
  const advisorContent = $('#advisorContent');
  const meterFill = $('#meterFill');
  const advisorCount = $('#advisorCount');
  const backButton = $('#backButton');
  const mode = $('.diamond-mode');

  function wireImageFallbacks(scope = document) {
    $$('img', scope).forEach((image) => {
      if (image.dataset.fallbackBound) return;
      image.dataset.fallbackBound = 'true';
      const settle = () => image.closest('.official-logo, .product-media')?.classList.add('has-image');
      const fail = () => image.closest('.official-logo, .product-media')?.classList.add('image-failed');
      image.addEventListener('load', settle, { once: true });
      image.addEventListener('error', fail, { once: true });
      if (image.complete) image.naturalWidth ? settle() : fail();
    });
  }

  function renderChat() {
    chatMessages.innerHTML = state.chat.map((message) => `
      <div class="chat-line chat-line--${message.role}">
        ${message.role === 'assistant' ? `<span class="chat-avatar">${advisorMark()}</span>` : ''}
        <div class="chat-bubble${message.fallback ? ' chat-bubble--fallback' : ''}">${escapeHtml(message.content)}</div>
      </div>
    `).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderQuickChips() {
    quickChips.innerHTML = config.quick.map((prompt) => `<button type="button" data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join('');
  }

  function lockPage() {
    if (window.innerWidth > 700) {
      document.documentElement.classList.add('widget-open');
      return;
    }
    state.scrollY = window.scrollY;
    document.documentElement.classList.add('widget-open-mobile');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${state.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockPage() {
    document.documentElement.classList.remove('widget-open', 'widget-open-mobile');
    if (document.body.style.position === 'fixed') {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, state.scrollY);
    }
  }

  function openWidget(nextMode = state.mode) {
    if (!state.open) {
      state.open = true;
      widget.classList.add('is-open');
      widget.setAttribute('aria-hidden', 'false');
      $('#openWidget').setAttribute('aria-expanded', 'true');
      launcher.classList.add('is-widget-open');
      teaser.classList.add('is-hidden');
      lockPage();
      requestAnimationFrame(() => widget.classList.add('is-settled'));
    }
    switchMode(nextMode);
  }

  function closeWidget() {
    state.open = false;
    widget.classList.remove('is-open', 'is-settled');
    widget.setAttribute('aria-hidden', 'true');
    $('#openWidget').setAttribute('aria-expanded', 'false');
    launcher.classList.remove('is-widget-open');
    unlockPage();
  }

  function switchMode(nextMode) {
    state.mode = nextMode;
    $$('.diamond-mode__button').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === nextMode));
    $('#chatScreen').classList.toggle('is-active', nextMode === 'chat');
    $('#advisorScreen').classList.toggle('is-active', nextMode === 'advisor');
    mode.dataset.mode = nextMode;
    if (nextMode === 'advisor') renderAdvisor();
  }

  function scoreProduct(product) {
    let score = 0;
    const weights = { prep: 6, taste: 5, drink: 2, caffeine: 10 };
    Object.entries(state.answers).forEach(([key, answer]) => {
      const values = product[key] || [];
      if (values.includes(answer) || values.includes('either')) score += weights[key] || 1;
      if (key === 'caffeine' && answer === 'either' && values.includes('classic')) score += 1;
    });
    return score;
  }

  function calculateResult() {
    const ranked = config.products
      .map((product, index) => ({ product, score: scoreProduct(product), index }))
      .sort((left, right) => right.score - left.score || left.index - right.index);

    state.result = ranked[0]?.product || config.products[0];
    state.alternative = ranked.find((item) => item.product.id !== state.result.id)?.product || config.products[1];
    state.packageSize = '250g';
    const prep = state.answers.prep;
    state.grind = prep === 'filter' ? 'Filter' : prep === 'lever' ? 'Espresso' : prep === 'automatic' ? 'Automat' : prep === 'moka' ? 'Moka' : 'Zrnková';
  }

  function renderOption(option, questionId) {
    const selected = state.answers[questionId] === option.value;
    return `
      <button class="answer-card${selected ? ' is-selected' : ''}${option.image ? ' answer-card--visual' : ''}" type="button" data-answer="${escapeHtml(option.value)}">
        ${option.image ? `<span class="answer-card__image"><img src="${escapeHtml(option.image)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>` : ''}
        <span class="answer-card__icon">${icon(option.icon)}</span>
        <span class="answer-card__copy"><b>${escapeHtml(option.title)}</b><small>${escapeHtml(option.description)}</small></span>
        <span class="answer-card__check">${icon('check')}</span>
      </button>`;
  }

  function renderQuestion() {
    const question = questions[state.step];
    advisorCount.textContent = `${state.step + 1} / ${questions.length}`;
    meterFill.style.width = `${((state.step + 1) / questions.length) * 100}%`;
    backButton.disabled = state.step === 0;

    advisorContent.innerHTML = `
      <div class="question-view" data-step="${state.step}">
        <p class="question-eyebrow">${escapeHtml(question.eyebrow)}</p>
        <h2>${escapeHtml(question.title)}</h2>
        <p class="question-help">${escapeHtml(question.help)}</p>
        <div class="answer-grid">${question.options.map((option) => renderOption(option, question.id)).join('')}</div>
      </div>`;

    wireImageFallbacks(advisorContent);

    $$('.answer-card', advisorContent).forEach((button) => {
      button.addEventListener('click', () => {
        state.answers[question.id] = button.dataset.answer;
        $$('.answer-card', advisorContent).forEach((item) => item.classList.toggle('is-selected', item === button));
        const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160;
        window.setTimeout(() => {
          if (state.step < questions.length - 1) {
            state.step += 1;
            renderQuestion();
          } else {
            calculateResult();
            renderResult();
          }
        }, delay);
      });
    });
  }

  function prepLabels(values) {
    const labels = { filter: 'filter', lever: 'espresso', automatic: 'automat', moka: 'moka' };
    return values.map((value) => labels[value] || value).join(' · ');
  }

  function renderResult() {
    const product = state.result;
    const alternative = state.alternative;
    advisorCount.textContent = 'Výsledok';
    meterFill.style.width = '100%';
    backButton.disabled = false;

    advisorContent.innerHTML = `
      <div class="result-view">
        <p class="question-eyebrow">Odporúčanie pripravené</p>
        <article class="result-card">
          <div class="result-card__visual">${productMedia(product, 'product-media--result')}<span class="result-badge">Najlepšia zhoda</span></div>
          <div class="result-card__copy">
            <div class="result-meta"><span>${escapeHtml(product.origin)}</span>${product.process ? `<span>${escapeHtml(product.process)}</span>` : ''}</div>
            <h2>${escapeHtml(product.name)}</h2>
            <div class="taste-tags">${product.tags.slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
            <div class="result-reason"><b>Prečo práve táto káva</b><p>${escapeHtml(product.reason)}</p></div>
            <dl class="result-details">
              <div><dt>Vhodná príprava</dt><dd>${escapeHtml(prepLabels(product.prep))}</dd></div>
              <div><dt>Cena na e-shope</dt><dd>${escapeHtml(product.price)}</dd></div>
            </dl>
          </div>
        </article>

        <div class="purchase-choice">
          <fieldset><legend>Balenie</legend><div>${['250g', '500g', '1000g'].map((size) => `<button type="button" class="choice-chip${state.packageSize === size ? ' is-selected' : ''}" data-size="${size}">${size}</button>`).join('')}</div></fieldset>
          <fieldset><legend>Mletie</legend><div>${['Zrnková', 'Espresso', 'Filter', 'Automat', 'Moka'].map((grind) => `<button type="button" class="choice-chip${state.grind === grind ? ' is-selected' : ''}" data-grind="${grind}">${grind}</button>`).join('')}</div></fieldset>
        </div>

        <a class="result-cta" href="${escapeHtml(product.url)}" target="_blank" rel="noreferrer">Otvoriť produkt na Diamonds Roastery ${icon('shop')}</a>

        <article class="alternative-card">
          ${productMedia(alternative, 'product-media--alternative')}
          <div><small>Relevantná alternatíva</small><b>${escapeHtml(alternative.name)}</b><span>${alternative.tags.slice(0, 3).map(escapeHtml).join(' · ')}</span></div>
          <a href="${escapeHtml(alternative.url)}" target="_blank" rel="noreferrer" aria-label="Otvoriť ${escapeHtml(alternative.name)}">${icon('arrow')}</a>
        </article>

        <button class="restart-advisor" id="restartAdvisor" type="button">Začať výber odznova</button>
        <a class="result-credit" href="${escapeHtml(config.mojChatbotUrl)}" target="_blank" rel="noreferrer">Takéto riešenie môže mať aj váš e-shop · Môj Chatbot ${icon('arrow')}</a>
      </div>`;

    wireImageFallbacks(advisorContent);

    $$('[data-size]', advisorContent).forEach((button) => button.addEventListener('click', () => {
      state.packageSize = button.dataset.size;
      $$('[data-size]', advisorContent).forEach((item) => item.classList.toggle('is-selected', item === button));
    }));

    $$('[data-grind]', advisorContent).forEach((button) => button.addEventListener('click', () => {
      state.grind = button.dataset.grind;
      $$('[data-grind]', advisorContent).forEach((item) => item.classList.toggle('is-selected', item === button));
    }));

    $('#restartAdvisor').addEventListener('click', resetAdvisor);
  }

  function renderAdvisor() {
    state.result ? renderResult() : renderQuestion();
  }

  function resetAdvisor() {
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
    if (!clean) return;

    state.chat.push({ role: 'user', content: clean });
    renderChat();
    chatInput.value = '';
    chatInput.disabled = true;
    $('.chat-composer button').disabled = true;

    const pending = { role: 'assistant', content: 'Hľadám najvhodnejšiu odpoveď…', pending: true };
    state.chat.push(pending);
    renderChat();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          demoId: 'diamonds',
          messages: state.chat.filter((item) => !item.pending).map(({ role, content }) => ({ role, content }))
        })
      });
      if (!response.ok) throw new Error(`Chat failed: ${response.status}`);
      const data = await response.json();
      pending.content = String(data.reply || '').trim() || 'Najpresnejšie odporúčanie získate cez krátky výber kávy.';
      delete pending.pending;
    } catch (error) {
      pending.content = 'Chat sa teraz nepodarilo načítať. Výber kávy funguje ďalej a odporučí konkrétny produkt podľa štyroch odpovedí.';
      delete pending.pending;
      pending.fallback = true;
    } finally {
      chatInput.disabled = false;
      $('.chat-composer button').disabled = false;
      renderChat();
      if (state.chat.at(-1)?.fallback) {
        const bubble = $('.chat-line:last-child .chat-bubble');
        const action = document.createElement('button');
        action.className = 'inline-fallback';
        action.type = 'button';
        action.textContent = 'Prejsť na výber kávy';
        action.addEventListener('click', () => switchMode('advisor'));
        bubble?.append(action);
      }
    }
  }

  $('#heroOpen').addEventListener('click', () => openWidget('chat'));
  $('#heroAdvisor').addEventListener('click', () => openWidget('advisor'));
  $('#openWidget').addEventListener('click', () => state.open ? closeWidget() : openWidget(state.mode));
  $('#teaserOpen').addEventListener('click', () => openWidget('advisor'));
  $('#closeTeaser').addEventListener('click', (event) => {
    event.stopPropagation();
    teaser.classList.add('is-hidden');
  });
  $('#closeWidget').addEventListener('click', closeWidget);
  $('#resetAll').addEventListener('click', resetAll);
  $$('.diamond-mode__button').forEach((button) => button.addEventListener('click', () => switchMode(button.dataset.mode)));

  backButton.addEventListener('click', () => {
    if (state.result) {
      state.result = null;
      state.alternative = null;
      state.step = questions.length - 1;
      renderQuestion();
      return;
    }
    if (state.step > 0) {
      state.step -= 1;
      renderQuestion();
    }
  });

  $('#chatForm').addEventListener('submit', (event) => {
    event.preventDefault();
    sendChat(chatInput.value);
  });

  quickChips.addEventListener('click', (event) => {
    const button = event.target.closest('[data-prompt]');
    if (button) sendChat(button.dataset.prompt);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open) closeWidget();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!state.open) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      unlockPage();
      lockPage();
    }, 120);
  });

  renderChat();
  renderQuickChips();
  renderAdvisor();
  wireImageFallbacks(document);
})();
