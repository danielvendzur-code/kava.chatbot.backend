(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || '';
  if (!['diamonds', 'kaffa', 'vitazov', 'concept'].includes(slug)) return;

  // Structural/widget polish loads once before the final client-ready layer.
  // Do not keep moving this stylesheet to the end: the client-ready brand layer
  // is intentionally the final visual source of truth.
  if (!document.querySelector('link[data-widget-final]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/coffee-widget-final.css';
    link.dataset.widgetFinal = 'true';
    document.head.appendChild(link);
  }

  const ENTRY = '#openAdvisor, .advisor-entry, .kf-advisor-entry, #advisorEntry';
  const LOG = '#chatMessages, .chat-messages, .kf-messages, .chat';
  const USER_MESSAGE = '.message--user, .chat-line--user, .kf-message.user, .kf-message-row.user, .message.is-user';

  const syncEntry = () => {
    const log = document.querySelector(LOG);
    const started = Boolean(log && log.querySelector(USER_MESSAGE));
    document.querySelectorAll(ENTRY).forEach((entry) => { entry.hidden = started; });
  };

  const TEASER = '#teaser, #launcherTeaser, .teaser, .launcher__teaser, .launcher-teaser, .kf-teaser';
  function addTeaserClose() {
    document.querySelectorAll(TEASER).forEach((teaser) => {
      if (teaser.dataset.dismissable === 'true') return;
      teaser.dataset.dismissable = 'true';
      if (teaser.querySelector('.mc-teaser-close, .teaser__close, .launcher-teaser__close')) return;
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'mc-teaser-close';
      close.setAttribute('aria-label', 'Skryť pozvánku');
      close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      close.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        teaser.hidden = true;
        teaser.classList.remove('is-visible');
        teaser.dataset.dismissed = 'true';
      });
      teaser.appendChild(close);
    });
  }

  function keepDismissed() {
    document.querySelectorAll('[data-dismissed="true"]').forEach((teaser) => {
      teaser.hidden = true;
      teaser.classList.remove('is-visible');
    });
  }

  const CTA = '.result-cta, .kf-result-cta, .kv-final-cta, .result-button--primary';
  const NAME = {
    diamonds: '.result-copy h2',
    kaffa: '.kf-result-hero__copy h2',
    vitazov: '.result-head h2',
    concept: '.result-main__copy h3'
  }[slug];
  const cartIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4.5 7.5h15l-1.2 11a1.6 1.6 0 0 1-1.6 1.4H7.3a1.6 1.6 0 0 1-1.6-1.4L4.5 7.5Zm4 0V5.6a3.5 3.5 0 1 1 7 0v1.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const checkIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function enhanceCheckout() {
    document.querySelectorAll(CTA).forEach((cta) => {
      if (cta.dataset.cartReady === 'true' || cta.closest('.mc-buy')) return;
      const name = document.querySelector(NAME)?.textContent?.trim() || 'Vybraná káva';
      const href = cta.getAttribute('href') || '';
      const buy = document.createElement('div');
      buy.className = 'mc-buy';
      buy.innerHTML = `<button class="mc-buy__add" type="button">${cartIcon}<span>Pridať do košíka</span></button>${href ? `<a class="mc-buy__link" href="${href}" target="_blank" rel="noreferrer">Detail produktu</a>` : ''}<p class="mc-buy__note" role="status" hidden></p>`;
      cta.dataset.cartReady = 'true';
      cta.replaceWith(buy);
      const add = buy.querySelector('.mc-buy__add');
      const note = buy.querySelector('.mc-buy__note');
      add.addEventListener('click', () => {
        if (add.classList.contains('is-added')) return;
        add.classList.add('is-added');
        add.innerHTML = `${checkIcon}<span>Pridané do košíka</span>`;
        note.textContent = `${name} je v košíku.`;
        note.hidden = false;
      });
    });
  }

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncEntry();
      addTeaserClose();
      keepDismissed();
      enhanceCheckout();
    });
  });
  observer.observe(document.documentElement, { childList:true, subtree:true });
  syncEntry();
  addTeaserClose();
  enhanceCheckout();

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#resetAll, #resetWidget, .kf-reset-btn')) return;
    requestAnimationFrame(syncEntry);
  });
})();
