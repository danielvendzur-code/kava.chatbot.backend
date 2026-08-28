(() => {
  'use strict';

  const slug = () => document.body.dataset.coffeeFinal || String(window.COFFEE_DEMO_SLUG || '').replace('-v13', '');
  const setImportant = (node, property, value) => node?.style?.setProperty(property, value, 'important');

  function settleJolkaOrder() {
    if (slug() !== 'jolka') return;
    const screen = document.querySelector('#chatScreen');
    const chat = document.querySelector('#chat');
    const entry = document.querySelector('#entry');
    if (screen && chat && entry && chat.nextElementSibling !== entry) screen.insertBefore(chat, entry);
  }

  function settleFinishedResults() {
    document.querySelectorAll('.mcw-thinking-note').forEach((note) => note.remove());
    document.querySelectorAll('.mcw-thinking').forEach((result) => result.classList.remove('mcw-thinking'));
  }

  function settleKaffa() {
    if (slug() !== 'kaffa') return;
    const seed = document.querySelector('.kf-messages:not(.has-thread) .kf-chat-seed');
    if (seed) {
      setImportant(seed, 'min-height', '0');
      setImportant(seed, 'height', 'auto');
      setImportant(seed, 'flex', '0 0 auto');
      setImportant(seed, 'gap', '10px');
      const botRow = seed.querySelector('.kf-message-row--bot') || [...seed.querySelectorAll('.kf-message-row')].find((row) => row.querySelector('.kf-message.bot'));
      if (botRow) setImportant(botRow, 'margin-top', '0');
    }
    const entry = document.querySelector('.kf-advisor-entry');
    if (entry) setImportant(entry, 'align-items', 'center');
    const copy = document.querySelector('.kf-advisor-entry__copy');
    if (copy) {
      setImportant(copy, 'display', 'grid');
      setImportant(copy, 'align-content', 'center');
      setImportant(copy, 'align-self', 'stretch');
    }
    const footer = document.querySelector('.kf-chat-footer');
    const composer = document.querySelector('.kf-composer');
    [footer, composer].forEach((node) => {
      if (!node) return;
      setImportant(node, 'box-sizing', 'border-box');
      setImportant(node, 'min-width', '0');
      setImportant(node, 'max-width', 'none');
      setImportant(node, 'justify-self', 'stretch');
      setImportant(node, 'align-self', 'stretch');
    });
    if (footer) setImportant(footer, 'width', '100%');
    if (composer) setImportant(composer, 'width', '100%');
  }

  function settlePraziarnicka() {
    if (slug() !== 'praziarnicka') return;
    const entry = document.querySelector('#pz13-advisor-entry');
    if (entry) {
      setImportant(entry, 'margin', '0');
      setImportant(entry, 'transform', 'none');
      setImportant(entry, 'position', 'relative');
      setImportant(entry, 'z-index', '0');
    }
  }

  function settleConcept() {
    if (slug() !== 'concept') return;
    const launcher = document.querySelector('#openWidget.launcher__button');
    if (launcher && !launcher.querySelector('.cfr-concept-monogram')) {
      const monogram = document.createElement('span');
      monogram.className = 'cfr-concept-monogram';
      monogram.textContent = 'C';
      monogram.setAttribute('aria-hidden', 'true');
      launcher.appendChild(monogram);
    }

    const teaser = document.querySelector('#launcherTeaser');
    if (teaser) {
      const title = teaser.querySelector('b');
      const text = teaser.querySelector('.launcher-teaser__open span');
      if (title) title.textContent = 'Pomôžeme vám vybrať?';
      if (text) text.textContent = 'Odpovedzte na štyri krátke otázky.';
    }

    const headerLogo = document.querySelector('.concept-widget-logo');
    if (headerLogo) {
      headerLogo.src = '/brand/concept-official-logo.png';
      headerLogo.alt = 'Concept Coffee Roasters';
    }
  }

  function settleVitazov() {
    if (slug() !== 'vitazov') return;
    const headerLogo = document.querySelector('.widget-brand .cfr-vitazov-header-logo, .widget-brand .kv-widget-logo');
    if (headerLogo) {
      setImportant(headerLogo, 'width', '118px');
      setImportant(headerLogo, 'height', '50px');
      setImportant(headerLogo, 'max-width', '118px');
      setImportant(headerLogo, 'max-height', '50px');
      setImportant(headerLogo, 'object-fit', 'contain');
      setImportant(headerLogo, 'filter', 'none');
    }

    const entry = document.querySelector('#openAdvisor');
    const media = entry?.firstElementChild;
    if (media) {
      setImportant(media, 'width', '72px');
      setImportant(media, 'height', '64px');
    }

    const chatBottom = document.querySelector('#chatScreen .chat-bottom');
    if (chatBottom) {
      setImportant(chatBottom, 'width', '100%');
      setImportant(chatBottom, 'box-sizing', 'border-box');
    }
  }

  function settleDiamonds() {
    if (slug() !== 'diamonds') return;
    document.querySelectorAll('#advisorContent .answer-card').forEach((card) => {
      setImportant(card, 'grid-template-columns', '1fr');
      setImportant(card, 'opacity', '1');
    });
    document.querySelectorAll('#advisorContent .answer-photo').forEach((photo) => {
      setImportant(photo, 'width', '100%');
      setImportant(photo, 'min-width', '0');
    });
    document.querySelectorAll('#advisorContent .answer-copy, #advisorContent .answer-copy b, #advisorContent .answer-copy small').forEach((node) => setImportant(node, 'opacity', '1'));
  }

  function settleOwnerPrice() {
    if (slug() !== 'concept' || window.innerWidth > 480) return;
    const row = document.querySelector('.mcb-plan-price');
    if (!row) return;
    setImportant(row, 'flex-wrap', 'nowrap');
    setImportant(row, 'gap', '3px 4px');
    row.querySelectorAll('strong').forEach((node) => setImportant(node, 'font-size', '25px'));
    row.querySelectorAll('span').forEach((node) => {
      setImportant(node, 'font-size', '11px');
      setImportant(node, 'white-space', 'nowrap');
    });
  }

  function settle() {
    settleJolkaOrder();
    settleFinishedResults();
    settlePraziarnicka();
    settleKaffa();
    settleConcept();
    settleVitazov();
    settleDiamonds();
    settleOwnerPrice();
  }

  /* Concept had a real user-visible failure where the branded launcher rendered
     but an inherited layer prevented the panel from opening. Keep the native
     listener, then recover only if it did not open the dialog. */
  document.addEventListener('click', (event) => {
    const conceptTrigger = event.target.closest('#openWidget,#heroOpen,#openFromTeaser');
    if (slug() === 'concept' && conceptTrigger) {
      setTimeout(() => {
        const widget = document.querySelector('#widget.widget');
        if (!widget?.classList.contains('is-open') && typeof window.ConceptSeasonalApp?.openWidget === 'function') {
          window.ConceptSeasonalApp.openWidget({ focus: false });
        }
        settle();
      }, 0);
    }

    if (event.target.closest('#launcher,#launcherButton,#openWidget,#open,.kf-switch,.mode,#modeSwitch,#openAdvisor')) {
      requestAnimationFrame(() => requestAnimationFrame(settle));
      setTimeout(settle, 100);
      setTimeout(settle, 320);
    }
  }, true);

  window.addEventListener('resize', settle, { passive: true });
  const observer = new MutationObserver(() => requestAnimationFrame(settle));
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class','aria-hidden'] });

  setTimeout(() => {
    settle();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      settle();
      document.documentElement.dataset.coffeeReleaseReady = 'true';
    }));
  }, 420);
})();