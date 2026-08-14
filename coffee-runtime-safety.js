(() => {
  'use strict';
  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || '';
  if (String(slug).replace('-v13', '') !== 'kaffa') return;

  const ensureKaffaBrand = () => {
    const head = document.querySelector('.kf-panel-head');
    if (head) {
      let brand = head.querySelector('.kf-widget-brand');
      if (!brand) {
        brand = document.createElement('div');
        brand.className = 'kf-widget-brand';
        head.prepend(brand);
      }
      if (!brand.querySelector('.kf-wordmark')) {
        brand.insertAdjacentHTML('afterbegin', '<span class="kf-wordmark" aria-label="Kaffa Roastery"><strong>KAFFA</strong><small>speciality coffee beans</small></span>');
      }
    }

    /* Kaffa's native switch uses data-view rather than data-mode. Keep the
       shared owner CTA tied to the real control instead of duplicating state. */
    document.querySelectorAll('[data-release-open="advisor"]').forEach((button) => {
      if (button.dataset.kaffaPickerSafe === 'true') return;
      button.dataset.kaffaPickerSafe = 'true';
      button.addEventListener('click', () => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          document.querySelector('.kf-switch button[data-view="advisor"]')?.click();
        }));
      });
    });
  };

  let queued = false;
  const sync = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensureKaffaBrand();
    });
  };

  ensureKaffaBrand();
  new MutationObserver(sync).observe(document.documentElement, { childList:true, subtree:true });
})();
