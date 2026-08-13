/**
 * Widget behaviour parity for the four routed demos.
 *
 * Two things the earlier stack got wrong and CSS alone cannot fix:
 *
 * 1. The advisor handoff card stayed pinned above the conversation forever, so
 *    a customer who had already started chatting kept looking at a second,
 *    redundant way into the configurator. Jolka removes it after the first
 *    customer message and leaves the mode switch as the only mode control;
 *    this does the same for the rest.
 * 2. The polish stylesheet has to win over three parity layers that append
 *    themselves to <head> on a timer, so it is kept last in the document.
 */
(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || '';
  if (!['diamonds', 'kaffa', 'vitazov', 'concept'].includes(slug)) return;

  /* ------------------------------------------------- keep the polish last */

  // index.html ends with two <link> elements inside <body>, and the parity layer
  // appends three more to <head> on a timer. A stylesheet in <head> therefore
  // loses every specificity tie to those. This one is kept last in <body>.
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/coffee-widget-final.css';
  link.dataset.widgetFinal = 'true';
  document.body.appendChild(link);

  const keepLast = () => {
    if (document.body.lastElementChild !== link) document.body.appendChild(link);
  };
  new MutationObserver(keepLast).observe(document.body, { childList: true });
  new MutationObserver(keepLast).observe(document.head, { childList: true });

  /* ------------------------------------------- single entry into the advisor */

  const ENTRY = '#openAdvisor, .advisor-entry, .kf-advisor-entry, #advisorEntry';
  const LOG = '#chatMessages, .chat-messages, .kf-messages, .chat';
  const USER_MESSAGE = '.message--user, .chat-line--user, .kf-message.user, .kf-message-row.user, .message.is-user';

  const syncEntry = () => {
    const log = document.querySelector(LOG);
    const started = Boolean(log && log.querySelector(USER_MESSAGE));
    document.querySelectorAll(ENTRY).forEach((entry) => {
      entry.hidden = started;
    });
  };

  let queued = false;
  const observer = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      syncEntry();
      keepLast();
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  syncEntry();

  // Starting over brings the conversation back to its opening state, so the
  // handoff is offered again.
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#resetAll, #resetWidget, .kf-reset-btn')) return;
    requestAnimationFrame(syncEntry);
  });
})();
