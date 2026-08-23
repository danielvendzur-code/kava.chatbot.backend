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
  // loses every specificity tie to those. This one belongs late in <body>.
  //
  // It used to be held there by a MutationObserver — and so did the one in
  // coffee-usability-release.js. Each move fired the other's observer, which
  // produced ~920 <body> mutations in four seconds, forever. Worse, the constant
  // detach/attach kept aborting the stylesheet load, so on some runs neither
  // sheet ever reached document.styleSheets: the brand custom properties went
  // undefined and the primary call to action rendered white on white.
  //
  // Both sheets now declare a fixed rank and a bounded pass puts them in that
  // order. No observer, so it terminates.
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/coffee-widget-final.css';
  link.dataset.widgetFinal = 'true';
  link.dataset.mcOrder = '20';
  document.body.appendChild(link);

  const orderStyles = () => {
    const ranked = [...document.body.querySelectorAll('link[rel="stylesheet"][data-mc-order]')];
    if (!ranked.length) return;
    const sorted = [...ranked].sort((a, b) => Number(a.dataset.mcOrder) - Number(b.dataset.mcOrder));
    const settled = ranked.every((node, index) => node === sorted[index]) &&
      document.body.lastElementChild === sorted.at(-1);
    if (settled) return;
    sorted.forEach((node) => document.body.appendChild(node));
  };

  orderStyles();
  [80, 400, 1200].forEach((delay) => setTimeout(orderStyles, delay));
  addEventListener('load', orderStyles, { once: true });

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

  /* ------------------------------------------------- dismissable invitation */

  // The invitation is a suggestion, not a banner the visitor has to live with.
  const TEASER = '#teaser, #launcherTeaser, .teaser, .launcher__teaser, .launcher-teaser, .kf-teaser';

  function addTeaserClose() {
    document.querySelectorAll(TEASER).forEach((teaser) => {
      if (teaser.dataset.dismissable === 'true') return;
      teaser.dataset.dismissable = 'true';
      // Every demo ships its own close control under a different class name.
      // The old list missed three of them, so Vitazov, Kaffa and Diamonds each
      // ended up with two close buttons stacked on the same corner.
      if (teaser.querySelector([
        '.mc-teaser-close', '.teaser__close', '.launcher-teaser__close',
        '.launcher__teaser-close', '.kf-teaser-close', '#closeTeaser', '#teaserClose'
      ].join(','))) return;

      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'mc-teaser-close';
      close.setAttribute('aria-label', 'Skryť pozvánku');
      // Sized inline as well as in CSS. If the stylesheet is slow or missing the
      // bare SVG expands to fill the invitation, which is how the Vitazov demo
      // came to greet the owner with a black X across the whole bubble.
      close.style.cssText = 'position:absolute;top:9px;right:9px;width:26px;height:26px;' +
        'display:grid;place-items:center;padding:0;border:0;border-radius:50%;' +
        'background:transparent;color:inherit;cursor:pointer;line-height:0';
      close.innerHTML = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="width:13px;height:13px"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
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

  // Whatever re-runs the demo's own teaser logic must not bring it back.
  function keepDismissed() {
    document.querySelectorAll('[data-dismissed="true"]').forEach((teaser) => {
      teaser.hidden = true;
      teaser.classList.remove('is-visible');
    });
  }

  /* ------------------------------------------------- the closing action */

  // The demo stands in for a widget already installed on the roastery's shop,
  // so the recommendation ends the way it would there: the coffee goes into the
  // basket. The product page stays reachable as a quiet second link.
  const CTA = '.result-cta, .kf-result-cta, .kv-final-cta, .result-button--primary';
  // Each demo puts the product name in a different place, and a shared guess
  // picks up the wrong one: on Víťazov the sibling block holds the origin, on
  // Concept the heading is the label "Vaša káva".
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
      buy.innerHTML = `
        <button class="mc-buy__add" type="button">${cartIcon}<span>Pridať do košíka</span></button>
        ${href ? `<a class="mc-buy__link" href="${href}" target="_blank" rel="noreferrer">Detail produktu</a>` : ''}
        <p class="mc-buy__note" role="status" hidden></p>`;
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
  observer.observe(document.documentElement, { childList: true, subtree: true });
  syncEntry();
  addTeaserClose();
  enhanceCheckout();

  // Starting over brings the conversation back to its opening state, so the
  // handoff is offered again.
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#resetAll, #resetWidget, .kf-reset-btn')) return;
    requestAnimationFrame(syncEntry);
  });
})();
