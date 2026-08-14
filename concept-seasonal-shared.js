(() => {
  'use strict';
  const app = window.ConceptSeasonalApp;
  const { $, $$, config, stateKey } = app;
  const { widget, launcher, teaser } = app.refs;
  app.lockedScrollY = 0;
  function persist() {
    const snapshot = { ...app.state, transitioning: false, chatHistory: [] };
    try { sessionStorage.setItem(stateKey, JSON.stringify(snapshot)); } catch (_) {}
  }

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent('coffee-demo', { detail: { name, demoId: config.id, ...detail } }));
  }

  function time() {
    return new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });
  }

  function lockBackground() {
    if (document.body.classList.contains('widget-scroll-locked')) return;
    app.lockedScrollY = window.scrollY;
    document.body.style.top = `-${app.lockedScrollY}px`;
    document.body.classList.add('widget-scroll-locked');
  }

  function unlockBackground() {
    if (!document.body.classList.contains('widget-scroll-locked')) return;
    document.body.classList.remove('widget-scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, app.lockedScrollY);
  }

  function animateMarks(className) {
    $$('.assistant-mark').forEach((node) => {
      node.classList.remove(className);
      void node.getBoundingClientRect();
      node.classList.add(className);
      setTimeout(() => node.classList.remove(className), 700);
    });
  }

  Object.assign(app, { persist, emit, time, lockBackground, unlockBackground, animateMarks });
})();
