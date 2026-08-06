(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, $$, defaultState, stateKey, questions, persist, emit, renderSupport, renderChips, seedChat, setMode, renderAdvisor, openWidget, closeWidget, sendChat } = app;
  const { widget, teaser } = app.refs;
  function resetAll() {
    app.state = defaultState();
    try { sessionStorage.removeItem(stateKey); } catch (_) {}
    seedChat();
    renderChips();
    setMode('chat', { focusInput: widget.classList.contains('is-open') });
    renderAdvisor();
    emit('reset_all');
  }

  function applyLocalQAState() {
    if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;
    const qa = new URLSearchParams(location.search).get('qa');
    if (!qa) return;
    teaser.classList.remove('is-visible');
    if (qa === 'chat') {
      openWidget();
      setMode('chat');
    } else if (qa === 'prep') {
      openWidget();
      app.state = defaultState();
      setMode('advisor');
    } else if (qa === 'result') {
      openWidget();
      app.state = { ...defaultState(), mode: 'advisor', stage: 'result', answers: { prep: 'filter', taste: 'fruity', drink: 'black', caffeine: 'classic' } };
      setMode('advisor');
    } else if (qa === 'package') {
      openWidget();
      app.state = { ...defaultState(), mode: 'advisor', stage: 'package', selectedProduct: 'weithaga', answers: { prep: 'filter', taste: 'fruity', drink: 'black', caffeine: 'classic' } };
      setMode('advisor');
    }
  }

  $('#heroOpen').addEventListener('click', () => openWidget({ focus: true }));
  $('#openWidget').addEventListener('click', () => openWidget({ focus: true }));
  $('#openFromTeaser').addEventListener('click', () => openWidget({ focus: true }));
  $('#closeTeaser').addEventListener('click', () => teaser.classList.remove('is-visible'));
  $('#closeWidget').addEventListener('click', closeWidget);
  $('#resetAll').addEventListener('click', resetAll);
  $('#openAdvisor').addEventListener('click', () => setMode('advisor'));
  $$('.mode__button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode, { focusInput: button.dataset.mode === 'chat' })));
  $('#chatForm').addEventListener('submit', (event) => {
    event.preventDefault();
    sendChat($('#chatInput').value);
  });
  $('#prevBtn').addEventListener('click', () => {
    if (app.state.stage !== 'questions') {
      app.state.stage = 'questions';
      app.state.step = questions.length - 1;
    } else if (app.state.step > 0) {
      app.state.step -= 1;
    }
    app.state.transitioning = false;
    persist();
    renderAdvisor();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && widget.classList.contains('is-open')) closeWidget();
  });

  renderSupport();
  renderChips();
  seedChat();
  renderAdvisor();
  if (app.state.mode === 'advisor') setMode('advisor');
  setTimeout(() => teaser.classList.add('is-visible'), 900);
  applyLocalQAState();
})();
