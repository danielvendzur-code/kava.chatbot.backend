(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const { mark, icons, products, grinds, questions } = window.JOLKA_DATA || {};
  if (!mark || !icons || !products || !questions) return;

  $$('[data-jolka-mark]').forEach((node) => { node.innerHTML = mark; });
  const productById = (id) => products.find((product) => product.id === id);
  const state = {
    mode: 'advisor', step: 0, answers: {}, stage: 'question', selectedProduct: null,
    weight: null, grind: 'beans', transitioning: false, chatHistory: [], lastFocused: null
  };
  const widget = $('#widget');
  const launcher = $('#launcher');
  const teaser = $('#teaser');
  const advisor = $('#advisor');
  const advisorScreen = $('#advisorScreen');
  const chatScreen = $('#chatScreen');
  const modeSwitch = $('#modeSwitch');
  const chat = $('#chatMessages');

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent('jolka-demo', { detail: { name, ...detail } }));
  }
  function openWidget(mode = 'advisor') {
    state.lastFocused = document.activeElement;
    widget.classList.add('is-open');
    widget.setAttribute('aria-hidden', 'false');
    $('#openWidget').setAttribute('aria-expanded', 'true');
    launcher.hidden = true;
    document.body.classList.add('widget-open');
    teaser.classList.remove('is-visible');
    setMode(mode);
    emit('widget_open', { mode });
  }
  function closeWidget() {
    widget.classList.remove('is-open');
    widget.setAttribute('aria-hidden', 'true');
    $('#openWidget').setAttribute('aria-expanded', 'false');
    document.body.classList.remove('widget-open');
    launcher.hidden = false;
    if (state.lastFocused instanceof HTMLElement) state.lastFocused.focus({ preventScroll: true });
  }
  function setMode(mode) {
    state.mode = mode;
    modeSwitch.classList.toggle('is-chat', mode === 'chat');
    $$('.mode-switch__button').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
    advisorScreen.classList.toggle('is-active', mode === 'advisor');
    chatScreen.classList.toggle('is-active', mode === 'chat');
    if (mode === 'advisor') renderAdvisor();
    // Deliberately do not focus chatInput here. On mobile that would open the software keyboard.
    emit('mode_change', { mode });
  }

  function scoreProduct(product) {
    const { intent, prep, drink, acidity } = state.answers;
    let score = 0;
    if (intent && product.intents.includes(intent)) score += 10;
    if (prep && product.prep.includes(prep)) score += 6;
    if (drink && product.drink.includes(drink)) score += 4;
    if (acidity && product.acidity.includes(acidity)) score += 6;
    if (intent === 'experiment' && product.id === 'vietnam') score += 9;
    if (intent === 'fruity' && product.id === 'sidamo') score += 8;
    if (intent === 'milk' && product.id === 'zmes-cokolada') score += 7;
    if (intent === 'classic' && product.id === 'zmes-jolka') score += 6;
    if (intent === 'balanced' && product.id === 'el-salvador') score += 8;
    if (drink === 'milk' && !product.drink.includes('milk')) score -= 9;
    if (acidity === 'low' && product.acidity.includes('bright')) score -= 8;
    return score;
  }
  function ranking() {
    return products.map((product, index) => ({ ...product, score: scoreProduct(product), index }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
  }
  function updateProgress() {
    const inQuestions = state.stage === 'question';
    $('#progressLabel').textContent = inQuestions ? `${state.step + 1} / ${questions.length}` : state.stage === 'result' ? 'Výsledok' : state.stage === 'package' ? 'Dokončenie' : 'Hotovo';
    $('#progressName').textContent = inQuestions ? questions[state.step].name : state.stage === 'result' ? 'Vaša káva' : state.stage === 'package' ? 'Balenie a mletie' : 'Prechod do e-shopu';
    $('#backButton').disabled = inQuestions && state.step === 0;
    $('#progressSteps').innerHTML = questions.map((_, index) => `<i class="${!inQuestions || index < state.step ? 'is-done ' : ''}${inQuestions && index === state.step ? 'is-active' : ''}"></i>`).join('');
  }
  function optionVisual(question, visualKey) {
    if (question.key === 'intent') {
      const product = productById(visualKey);
      return `<span class="option__visual"><img src="${product.image}" alt="" loading="lazy" onerror="this.hidden=true"></span>`;
    }
    return `<span class="option__icon">${icons[visualKey] || icons.classic}</span>`;
  }
  function renderQuestion() {
    const question = questions[state.step];
    const selected = state.answers[question.key];
    advisor.innerHTML = `
      <div class="question-head"><small>${question.name}</small><h2>${question.title}</h2></div>
      <div class="options options--${question.options.length}">
        ${question.options.map(([value, label, description, visualKey], index) => `<button class="option ${selected === value ? 'is-selected' : selected ? 'is-muted' : ''}" type="button" data-value="${value}" style="--delay:${index * 55}ms">${optionVisual(question, visualKey)}<span class="option__copy"><b>${label}</b><small>${description}</small></span><span class="option__state">${selected === value ? icons.check : icons.next}</span></button>`).join('')}
      </div>`;
    $$('.option', advisor).forEach((button) => button.addEventListener('click', () => selectAnswer(button.dataset.value)));
  }
  function selectAnswer(value) {
    if (state.transitioning || state.stage !== 'question') return;
    state.answers[questions[state.step].key] = value;
    state.transitioning = true;
    renderQuestion();
    emit('advisor_answer', { step: questions[state.step].key, value });
    window.setTimeout(() => {
      if (state.step < questions.length - 1) state.step += 1;
      else state.stage = 'result';
      state.transitioning = false;
      renderAdvisor();
    }, 430);
  }
  function productPhoto(product, extraClass = '') {
    return `<div class="product-photo ${extraClass}" data-fallback="jolka."><img src="${product.image}" alt="Balenie kávy ${product.name}" loading="eager" onerror="this.hidden=true"></div>`;
  }
  function renderResult() {
    const ranked = ranking();
    const best = ranked[0];
    const selected = ranked.find((item) => item.id === state.selectedProduct) || best;
    state.selectedProduct = selected.id;
    const alternative = ranked.find((item) => item.id !== selected.id);
    advisor.innerHTML = `
      <div class="result-head"><small>Osobné odporúčanie</small><h2>${selected.id === best.id ? 'Táto káva vám sedí najviac' : 'Alternatívna voľba'}</h2></div>
      <section class="result-card">
        <div class="result-card__meta result-card__meta--simple"><span><b>Odporúčanie podľa odpovedí</b><small>bez falošného skóre</small></span><b>${selected.price}</b></div>
        <div class="result-product">${productPhoto(selected, 'result-product__photo')}<div><h3>${selected.name}</h3><span class="result-product__origin">${selected.origin}</span><div class="taste-tags">${selected.tones.map((tone) => `<span>${tone}</span>`).join('')}</div></div></div>
        <div class="result-facts"><article><small>Acidita normálne</small><b>${selected.acidityText}</b></article><article><small>Najlepšia príprava</small><b>${selected.prepText}</b></article></div>
        <div class="result-reason"><b>Prečo práve táto</b><p>${selected.reason}</p></div>
        <div class="result-actions"><button class="result-actions__primary" id="choosePackage" type="button">Vybrať balenie a mletie</button><a class="result-actions__secondary" href="${selected.url}" target="_blank" rel="noreferrer">Pozrieť produkt</a></div>
        ${alternative ? `<div class="alternative-card"><div><small>Jedna alternatíva</small><b>${alternative.name} · ${alternative.tones.slice(0, 2).join(' · ')}</b></div><button type="button" data-alternative="${alternative.id}">Porovnať</button></div>` : ''}
      </section>`;
    $('#choosePackage').addEventListener('click', () => { state.stage = 'package'; state.weight = null; renderAdvisor(); });
    $('[data-alternative]', advisor)?.addEventListener('click', (event) => { state.selectedProduct = event.currentTarget.dataset.alternative; renderResult(); });
    emit('recommendation_view', { product: selected.id });
  }
  const weightLabel = (weight) => weight === 1000 ? '1 kg' : `${weight} g`;
  function renderPackage() {
    const product = productById(state.selectedProduct) || ranking()[0];
    advisor.innerHTML = `
      <div class="package-head"><h2>Balenie a mletie</h2><p>Aktuálnu cenu a dostupnosť potvrdí produktová stránka.</p></div>
      <div class="package-grid">${product.weights.map((weight) => `<button class="package-option ${state.weight === weight ? 'is-selected' : ''}" type="button" data-weight="${weight}"><i></i><b>${weightLabel(weight)}</b><small>${weight <= 150 ? 'na ochutnanie' : weight === 1000 ? 'veľké balenie' : 'bežná zásoba'}</small></button>`).join('')}</div>
      <div class="select-field"><label for="grindSelect">Mletie</label><select id="grindSelect">${grinds.map(([value, label]) => `<option value="${value}"${state.grind === value ? ' selected' : ''}>${label}</option>`).join('')}</select></div>
      <div class="order-summary"><div><span>Káva</span><b>${product.name}</b></div><div><span>Balenie</span><b>${state.weight ? weightLabel(state.weight) : 'vyberte'}</b></div><div><span>Mletie</span><b>${grinds.find(([value]) => value === state.grind)[1]}</b></div><div><span>Cena na webe</span><b>${product.price}</b></div></div>
      <button class="product-link" id="finishSelection" type="button" ${state.weight ? '' : 'disabled'}>${icons.check} Dokončiť výber</button>`;
    $$('.package-option', advisor).forEach((button) => button.addEventListener('click', () => { state.weight = Number(button.dataset.weight); renderPackage(); }));
    $('#grindSelect').addEventListener('change', (event) => { state.grind = event.target.value; renderPackage(); });
    $('#finishSelection').addEventListener('click', () => { if (state.weight) { state.stage = 'success'; renderAdvisor(); } });
  }
  function renderSuccess() {
    const product = productById(state.selectedProduct) || ranking()[0];
    const grind = grinds.find(([value]) => value === state.grind)?.[1] || 'Zrnková';
    advisor.innerHTML = `<div class="success"><div class="success__icon">${icons.check}</div><h2>Výber je pripravený</h2><p><b>${product.name}</b><br>${weightLabel(state.weight)} · ${grind}</p><a class="product-link" href="${product.url}" target="_blank" rel="noreferrer">${icons.shop} Otvoriť konkrétny produkt</a><button class="result-actions__secondary" id="startAgain" type="button">Vybrať inú kávu</button></div>`;
    $('#startAgain').addEventListener('click', resetAdvisor);
  }
  function renderAdvisor() {
    updateProgress();
    if (state.stage === 'question') renderQuestion();
    else if (state.stage === 'result') renderResult();
    else if (state.stage === 'package') renderPackage();
    else renderSuccess();
    advisor.scrollTop = 0;
  }
  function resetAdvisor() {
    Object.assign(state, { step: 0, answers: {}, stage: 'question', selectedProduct: null, weight: null, grind: 'beans', transitioning: false });
    renderAdvisor();
  }

  function addMessage(text, user = false) {
    const row = document.createElement('div');
    row.className = `message${user ? ' message--user' : ''}`;
    if (!user) { const avatar = document.createElement('span'); avatar.className = 'message__avatar'; avatar.innerHTML = mark; row.appendChild(avatar); }
    const bubble = document.createElement('div'); bubble.className = 'message__bubble'; bubble.textContent = text; row.appendChild(bubble); chat.appendChild(row);
    requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }
  function fallbackAnswer(query) {
    const text = query.toLocaleLowerCase('sk');
    if (text.includes('vietnam') || text.includes('experiment')) return 'Vietnam Lang Biang je najnetradičnejšia voľba: marakuja, pomaranč a vínna dochuť.';
    if (text.includes('ovoc') || text.includes('filter')) return 'Na čistý ovocný filter by som zvolil Ethiopia SIDAMO. Je svieža, kvetinová a citrusová.';
    if (text.includes('mlie') || text.includes('capp')) return 'Do mlieka je najistejšia Zmes Čokoláda. Má plnšie telo a veľmi nízku aciditu.';
    if (text.includes('kysl') || text.includes('acid')) return 'Pri čo najnižšej acidite siahnite po Zmesi Jolka alebo Zmesi Čokoláda.';
    return 'Najpresnejší výsledok dá štvorotázkový výber. Rozlíši klasiku, kávu do mlieka, vyváženú arabiku, ovocný filter a experimentálny Vietnam.';
  }
  async function sendChat(text) {
    const value = text.trim(); if (!value) return;
    addMessage(value, true); $('#chatInput').value = '';
    try {
      state.chatHistory.push({ role: 'user', content: value });
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ demoId: 'jolka', messages: state.chatHistory.slice(-10) }) });
      if (!response.ok) throw new Error('offline');
      const data = await response.json();
      const reply = String(data.reply || '').trim();
      if (!reply) throw new Error('empty');
      state.chatHistory.push({ role: 'assistant', content: reply });
      addMessage(reply);
    } catch (_) { addMessage(fallbackAnswer(value)); }
  }
  function seedChat() {
    chat.innerHTML = '';
    state.chatHistory = [];
    addMessage('Dobrý deň. Pomôžem vám vybrať kávu Jolka alebo stručne vysvetlím aciditu, prípravu a rozdiel medzi zmesami.');
    const chips = ['Nízka acidita', 'Káva na cappuccino', 'Ovocný filter', 'Niečo netradičné'];
    $('#quickQuestions').innerHTML = chips.map((label) => `<button type="button">${label}</button>`).join('');
    $$('#quickQuestions button').forEach((button) => button.addEventListener('click', () => sendChat(button.textContent)));
  }

  $('#heroOpen').addEventListener('click', () => openWidget('advisor'));
  $('#openWidget').addEventListener('click', () => openWidget('advisor'));
  $('#openFromTeaser').addEventListener('click', () => openWidget('advisor'));
  $('#closeTeaser').addEventListener('click', (event) => { event.stopPropagation(); teaser.classList.remove('is-visible'); });
  $('#closeWidget').addEventListener('click', closeWidget);
  $('#resetAll').addEventListener('click', () => { resetAdvisor(); seedChat(); setMode('advisor'); });
  $$('.mode-switch__button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
  $('#backButton').addEventListener('click', () => {
    if (state.stage !== 'question') { state.stage = 'question'; state.step = questions.length - 1; }
    else if (state.step > 0) state.step -= 1;
    state.transitioning = false; renderAdvisor();
  });
  $('#chatForm').addEventListener('submit', (event) => { event.preventDefault(); sendChat($('#chatInput').value); });

  seedChat(); renderAdvisor();
  window.setTimeout(() => teaser.classList.add('is-visible'), 1100);
})();
