(() => {
  'use strict';
  const { config, $, $$, escapeHtml, icon, advisorMark, products, questions, state } = window.DIAMONDS_ADVISOR_FOUNDATION || {};
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

  function validPhone(value) {
    return /^\+?[0-9\s]{9,16}$/.test(value || '');
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
  }

  function renderContacts() {
    const links = [];
    if (validPhone(config.phone)) {
      links.push(`<a href="tel:${escapeHtml(config.phone)}">${icon('phone')} Zavolať</a>`);
    }
    if (validEmail(config.email)) {
      links.push(`<a href="mailto:${escapeHtml(config.email)}">${icon('mail')} Napísať</a>`);
    }
    $('#contactRow').innerHTML = links.join('');
    $('#contactRow').hidden = links.length === 0;
  }

  function renderChat() {
    chatMessages.innerHTML = state.chat.map((message) => `
      <div class="chat-line chat-line--${message.role}">
        ${message.role === 'assistant' ? `<span class="chat-avatar">${advisorMark()}</span>` : ''}
        <div class="chat-bubble">${escapeHtml(message.content)}</div>
      </div>
    `).join('');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderQuickChips() {
    const prompts = ['Káva do automatu', 'Niečo na filter', 'Nechcem výraznú aciditu', 'Bezkofeínová káva'];
    quickChips.innerHTML = prompts.map((prompt) => `<button type="button" data-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join('');
  }

  function lockPage() {
    if (window.innerWidth > 680) {
      document.documentElement.classList.add('widget-open');
      return;
    }
    state.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${state.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockPage() {
    document.documentElement.classList.remove('widget-open');
    if (document.body.style.position === 'fixed') {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, state.scrollY);
    }
  }

  function openWidget(mode = state.mode) {
    if (state.open) {
      switchMode(mode);
      return;
    }
    state.open = true;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    $('#openWidget').setAttribute('aria-expanded', 'true');
    launcher.classList.add('is-widget-open');
    teaser.classList.add('is-hidden');
    lockPage();
    switchMode(mode);
    requestAnimationFrame(() => widget.classList.add('is-settled'));
  }

  function closeWidget() {
    state.open = false;
    widget.classList.remove('is-open', 'is-settled');
    widget.setAttribute('aria-hidden', 'true');
    $('#openWidget').setAttribute('aria-expanded', 'false');
    launcher.classList.remove('is-widget-open');
    unlockPage();
  }

  function switchMode(mode) {
    state.mode = mode;
    $$('.diamond-mode__button').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
    $('#chatScreen').classList.toggle('is-active', mode === 'chat');
    $('#advisorScreen').classList.toggle('is-active', mode === 'advisor');
    $('.diamond-mode').dataset.mode = mode;
    if (mode === 'advisor') renderAdvisor();
  }

  function scoreProduct(product) {
    let score = 0;
    const weights = { prep: 5, taste: 4, drink: 2, caffeine: 8 };
    for (const [key, answer] of Object.entries(state.answers)) {
      const productValues = product[key] || [];
      if (productValues.includes(answer) || productValues.includes('either')) score += weights[key] || 1;
      if (key === 'caffeine' && answer === 'either') score += product.caffeine.includes('classic') ? 1 : 0;
    }
    return score;
  }

  function calculateResult() {
    const ranked = products
      .map((product, index) => ({ product, score: scoreProduct(product), index }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    state.result = ranked[0]?.product || products[0];
    state.alternative = ranked.find((item) => item.product.id !== state.result.id)?.product || products[1];
    state.packageSize = '250g';
    const prep = state.answers.prep;
    state.grind = prep === 'filter' ? 'Filter' : prep === 'lever' ? 'Espresso' : prep === 'automatic' ? 'Automat' : prep === 'moka' ? 'Moka' : 'Zrnková';
  }

  function optionButton(option, questionId) {
    const [value, title, description, iconName] = option;
    const selected = state.answers[questionId] === value;
    return `
      <button class="answer-card${selected ? ' is-selected' : ''}" type="button" data-answer="${value}">
        <span class="answer-card__icon">${icon(iconName)}</span>
        <span><b>${escapeHtml(title)}</b><small>${escapeHtml(description)}</small></span>
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
        <div class="answer-grid">${question.options.map((option) => optionButton(option, question.id)).join('')}</div>
      </div>`;

    $$('.answer-card', advisorContent).forEach((button) => {
      button.addEventListener('click', () => {
        state.answers[question.id] = button.dataset.answer;
        $$('.answer-card', advisorContent).forEach((item) => item.classList.toggle('is-selected', item === button));
        window.setTimeout(() => {
          if (state.step < questions.length - 1) {
            state.step += 1;
            renderQuestion();
          } else {
            calculateResult();
            renderResult();
          }
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
      });
    });
  }

  function productPack(product) {
    const originCode = product.origin.split('·')[0].trim().slice(0, 3).toUpperCase();
    const title = product.name.replace(/^(Brazília|Etiópia|Keňa|Kolumbia)\s+/i, '').replace(/\s+Decaf$/i, '');
    return `<div class="result-pack" aria-hidden="true"><span>DIAMONDS</span><b>${escapeHtml(title)}</b><small>${escapeHtml(originCode)}</small><i></i></div>`;
  }

  function renderResult() {
    const product = state.result;
    const alternative = state.alternative;
    advisorCount.textContent = 'Výsledok';
    meterFill.style.width = '100%';
    backButton.disabled = false;
    advisorContent.innerHTML = `
      <div class="result-view">
        <p class="question-eyebrow">Vaša najlepšia zhoda</p>
        <article class="result-card">
          <div class="result-card__visual">${productPack(product)}</div>
          <div class="result-card__copy">
            <div class="result-origin"><span>${escapeHtml(product.origin)}</span>${product.process ? `<span>${escapeHtml(product.process)}</span>` : ''}</div>
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

        <a class="result-cta" href="${escapeHtml(product.url)}" target="_blank" rel="noreferrer">Otvoriť ${escapeHtml(product.name)} ${icon('shop')}</a>
        <p class="selection-note">Výber balenia a mletia slúži v ukážke na spresnenie dopytu. Nákup dokončíte na oficiálnom e-shope.</p>

        <article class="alternative-card">
          <div><small>Jedna relevantná alternatíva</small><b>${escapeHtml(alternative.name)}</b><span>${alternative.tags.slice(0, 3).map(escapeHtml).join(' · ')}</span></div>
          <a href="${escapeHtml(alternative.url)}" target="_blank" rel="noreferrer" aria-label="Otvoriť ${escapeHtml(alternative.name)}">${icon('arrow')}</a>
        </article>
        <button class="restart-advisor" id="restartAdvisor" type="button">Začať výber odznova</button>
      </div>`;

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

  function prepLabels(values) {
    const labels = { filter: 'filter', lever: 'espresso', automatic: 'automat', moka: 'moka' };
    return values.map((value) => labels[value] || value).join(' · ');
  }

  function renderAdvisor() {
    if (state.result) renderResult();
    else renderQuestion();
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
    state.chat = [{ role: 'assistant', content: 'Dobrý deň. Môžete sa opýtať na prípravu, chuť alebo konkrétnu kávu. Na osobné odporúčanie slúži krátky výber v druhej záložke.' }];
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

    const pending = { role: 'assistant', content: 'Premýšľam…', pending: true };
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
      pending.content = 'Chat sa teraz nepodarilo načítať. Výber kávy funguje ďalej a odporučí produkt podľa štyroch odpovedí.';
      delete pending.pending;
      pending.fallback = true;
    } finally {
      chatInput.disabled = false;
      $('.chat-composer button').disabled = false;
      renderChat();
      if (state.chat.at(-1)?.fallback) {
        const lastBubble = $('.chat-line:last-child .chat-bubble');
        const action = document.createElement('button');
        action.className = 'inline-fallback';
        action.type = 'button';
        action.textContent = 'Prejsť na výber kávy';
        action.addEventListener('click', () => switchMode('advisor'));
        lastBubble?.append(action);
      }
    }
  }

  $('#heroOpen').addEventListener('click', () => openWidget('advisor'));
  $('#heroChat').addEventListener('click', () => openWidget('chat'));
  $('#openWidget').addEventListener('click', () => state.open ? closeWidget() : openWidget(state.mode));
  $('#teaserOpen').addEventListener('click', () => openWidget('advisor'));
  $('#closeTeaser').addEventListener('click', (event) => {
    event.stopPropagation();
    teaser.classList.add('is-hidden');
  });
  $('#closeWidget').addEventListener('click', closeWidget);
  $('#resetAll').addEventListener('click', resetAll);
  $('#openAdvisor').addEventListener('click', () => switchMode('advisor'));
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
  window.addEventListener('resize', () => {
    if (!state.open) return;
    unlockPage();
    lockPage();
  });

  renderContacts();
  renderChat();
  renderQuickChips();
  renderAdvisor();
})();
