(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { config, $, $$, escapeHTML, mark, persist, emit, time, lockBackground, unlockBackground, animateMarks } = app;
  const { widget, launcher, teaser, modeSwitch, chatScreen, advisorScreen, chat, chips } = app.refs;
  function openWidget({ focus = false } = {}) {
    widget.classList.add('is-open'); widget.setAttribute('aria-hidden', 'false'); $('#openWidget').setAttribute('aria-expanded', 'true');
    launcher.hidden = true; teaser.classList.remove('is-visible'); lockBackground(); animateMarks('is-mark-entering');
    if (focus) setTimeout(() => $('#closeWidget').focus(), 240); emit('widget_open');
  }
  function closeWidget() {
    widget.classList.remove('is-open'); widget.setAttribute('aria-hidden', 'true'); $('#openWidget').setAttribute('aria-expanded', 'false'); unlockBackground();
    setTimeout(() => { launcher.hidden = false; $('#openWidget').focus({ preventScroll: true }); }, 220);
  }
  function setMode(mode, { focusInput = false } = {}) {
    app.state.mode = mode; modeSwitch.classList.toggle('is-advisor', mode === 'advisor');
    $$('.mode__button').forEach((button) => button.classList.toggle('is-active', button.dataset.mode === mode));
    chatScreen.classList.toggle('is-active', mode === 'chat'); advisorScreen.classList.toggle('is-active', mode === 'advisor');
    if (mode === 'advisor') app.renderAdvisor();
    if (mode === 'chat' && focusInput && widget.classList.contains('is-open')) setTimeout(() => $('#chatInput').focus({ preventScroll: true }), 200);
    persist(); emit('mode_change', { mode });
  }
  function addMessage(text, user = false, options = {}) {
    const row = document.createElement('div'); row.className = `message${user ? ' message--user' : ''}`;
    const safeText = options.allowHTML ? text : escapeHTML(text);
    row.innerHTML = `${user ? '' : `<span class="message__avatar">${mark()}</span>`}<div class="message__stack"><div class="bubble">${safeText}</div><div class="timestamp">${time()}</div></div>`;
    chat.appendChild(row); requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }
  function showTyping() {
    $('#typingRow')?.remove(); const row = document.createElement('div'); row.id = 'typingRow'; row.className = 'message';
    row.innerHTML = `<span class="message__avatar">${mark()}</span><div class="message__stack"><div class="bubble typing"><i></i><i></i><i></i></div></div>`;
    chat.appendChild(row); requestAnimationFrame(() => { chat.scrollTop = chat.scrollHeight; });
  }
  function fallbackAnswer(text) {
    const query = text.toLowerCase(); const products = config.products;
    if (query.includes('bez kof') || query.includes('večer')) { const product = products.find((item) => item.caffeine.includes('decaf')); return `Momentálne odpovedám v lokálnom režime. Z aktuálnej ukážkovej ponuky je bez kofeínu <b>${escapeHTML(product.name)}</b>. <a href="${escapeHTML(product.url)}" target="_blank" rel="noreferrer">Pozrieť produkt</a>.`; }
    if (query.includes('mlie') || query.includes('capp') || query.includes('latte')) { const product = products.find((item) => item.id === 'holyshot'); return `Momentálne odpovedám v lokálnom režime. Do mlieka by som začal s <b>${escapeHTML(product.name)}</b>. ${escapeHTML(product.reason)}`; }
    if (query.includes('ovoc') || query.includes('filter') || query.includes('svie')) { const product = products.find((item) => item.id === 'weithaga'); return `Momentálne odpovedám v lokálnom režime. Prístupná ovocná voľba je <b>${escapeHTML(product.name)}</b>. ${escapeHTML(product.plainTaste)}`; }
    return 'Momentálne odpovedám v lokálnom režime. Najpresnejší výsledok dá Výber kávy: zohľadní prípravu, chuť, mlieko aj kofeín a odkáže priamo na konkrétny produkt.';
  }
  async function requestAI(text) {
    app.state.chatHistory.push({ role: 'user', content: text });
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ demoId: config.id, messages: app.state.chatHistory.slice(-8) }) });
    if (!response.ok) throw new Error(`API ${response.status}`); const data = await response.json(); if (!data.reply) throw new Error('Empty AI response');
    app.state.chatHistory.push({ role: 'assistant', content: data.reply }); return data.reply;
  }
  async function sendChat(text, chip = null) {
    const value = text.trim(); if (!value) return; addMessage(value, true); $('#chatInput').value = ''; showTyping(); emit('chat_question', { text: value });
    try { const reply = await requestAI(value); $('#typingRow')?.remove(); addMessage(reply); }
    catch (error) { await new Promise((resolve) => setTimeout(resolve, 300)); $('#typingRow')?.remove(); addMessage(fallbackAnswer(value), false, { allowHTML: true }); emit('chat_fallback', { reason: error.message }); }
    finally { chip?.classList.remove('is-sending'); }
  }
  function renderChips() {
    chips.innerHTML = config.quick.slice(0, 4).map((label) => `<button class="chip" type="button"><span>${escapeHTML(label)}</span></button>`).join('');
    $$('.chip', chips).forEach((button) => {
      button.addEventListener('pointerdown', (event) => { const rect = button.getBoundingClientRect(); button.style.setProperty('--fill-x', `${event.clientX - rect.left}px`); button.style.setProperty('--fill-y', `${event.clientY - rect.top}px`); });
      button.addEventListener('click', () => { if (button.classList.contains('is-sending')) return; button.classList.add('is-sending'); setTimeout(() => sendChat(button.textContent.trim(), button), 320); });
    });
  }
  function seedChat() { chat.innerHTML = ''; app.state.chatHistory = []; addMessage(config.welcome); }
  Object.assign(app, { openWidget, closeWidget, setMode, addMessage, showTyping, fallbackAnswer, requestAI, sendChat, renderChips, seedChat });
})();
