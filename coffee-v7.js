(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const path = (d) => `<path d="${d}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>`;
  const svg = (body) => `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${body}</svg>`;

  const verifiedCorrections = document.createElement('link');
  verifiedCorrections.rel = 'stylesheet';
  verifiedCorrections.href = 'coffee-v7-qa.css';
  document.head.appendChild(verifiedCorrections);

  const extensionIcons = {
    shop: svg(path('M4 9h16l-1 11H5L4 9ZM7 9V6a5 5 0 0 1 10 0v3')),
    pin: svg(path('M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z') + '<circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="1.9"/>'),
    phone: svg(path('M7.2 3.5 4.7 5.8c-.8.8-.4 3.4 2.8 6.7 3.3 3.3 5.9 3.7 6.7 2.8l2.3-2.5-3-2-1.7 1.7c-1.2-.5-2.3-1.4-3.2-2.3-.9-.9-1.8-2-2.3-3.2L8 5.3l-.8-1.8Z'))
  };

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent('praziarnicka-demo', { detail: { name, ...detail } }));
    try {
      const stored = JSON.parse(sessionStorage.getItem('praziarnicka-demo-events') || '[]');
      stored.push({ name, detail, at: Date.now() });
      sessionStorage.setItem('praziarnicka-demo-events', JSON.stringify(stored.slice(-60)));
    } catch (_) {
      // Analytics must never interrupt the demo.
    }
  }

  function openAdvisor() {
    $('#openWidget')?.click();
    requestAnimationFrame(() => $('[data-mode="advisor"]')?.click());
  }

  function bindProposalControls() {
    $('#headerOpen')?.addEventListener('click', () => {
      $('#openWidget')?.click();
      emit('proposal_cta', { source: 'header' });
    });
    $('#footerOpen')?.addEventListener('click', () => {
      $('#openWidget')?.click();
      emit('proposal_cta', { source: 'footer' });
    });
    $$('[data-open-advisor]').forEach((button) => button.addEventListener('click', () => {
      openAdvisor();
      emit('proposal_product_click', { product: button.querySelector('b')?.textContent?.trim() || '' });
    }));

    Object.entries(extensionIcons).forEach(([name, icon]) => {
      $$(`[data-icon="${name}"]`).forEach((element) => { element.innerHTML = icon; });
    });

    document.addEventListener('click', (event) => {
      const target = event.target.closest('button, a');
      if (!target) return;
      if (target.matches('#heroOpen, #openWidget, #launcherLabel')) emit('widget_open_intent', { source: target.id });
      if (target.matches('.mode__button')) emit('mode_change', { mode: target.dataset.mode });
      if (target.matches('.chip')) emit('quick_question', { text: target.textContent.trim() });
      if (target.matches('.option')) emit('advisor_answer', { value: target.dataset.value });
      if (target.matches('#choosePack')) emit('recommendation_continue');
      if (target.matches('#checkout')) emit('demo_add_to_cart');
      if (target.matches('.support-row a')) emit('support_click', { label: target.textContent.trim() });
    });

    // Keep mobile mode switching calm: never summon the keyboard without a direct tap in the field.
    $$('.mode__button').forEach((button) => button.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 640px)').matches) requestAnimationFrame(() => $('#chatInput')?.blur());
    }));
  }

  const runtime = document.createElement('script');
  runtime.src = 'coffee-v6.js';
  runtime.async = false;
  runtime.addEventListener('load', bindProposalControls, { once: true });
  runtime.addEventListener('error', () => {
    console.error('[Praziarnicka v7] The advisor runtime could not be loaded.');
  }, { once: true });
  document.head.appendChild(runtime);
})();
