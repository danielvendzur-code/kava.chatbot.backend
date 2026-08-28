(() => {
  'use strict';

  const body = document.body;
  if (!body) return;

  body.dataset.coffeeLastMile = 'true';

  const setOwnerPrice = () => {
    let updated = false;
    document.querySelectorAll('.mcb-plan-price').forEach((row) => {
      const setup = row.querySelector('strong:first-child');
      if (!setup) return;
      const normalized = setup.textContent.replace(/\s+/g, ' ').trim();
      if (normalized !== '247 €') setup.textContent = '247 €';
      setup.dataset.lastMilePrice = 'true';
      updated = true;
    });
    return updated;
  };

  // Owner pages are mounted by a late runtime. Retry for a bounded number of
  // frames instead of leaving a permanent MutationObserver behind.
  let priceAttempts = 0;
  const syncPrice = () => {
    const done = setOwnerPrice();
    priceAttempts += 1;
    if (!done && priceAttempts < 90) requestAnimationFrame(syncPrice);
  };
  syncPrice();

  // Mark the product-led entry surfaces so QA can verify that the final layer
  // was applied even when an older renderer recreates their child content.
  const markProductEntries = () => {
    const selectors = [
      '.pz13-advisor-entry',
      'body[data-coffee-final="diamonds"] .advisor-entry',
      'body[data-coffee-final="kaffa"] .kf-advisor-entry',
      'body[data-coffee-final="concept"] .advisor-entry',
      'body[data-coffee-final="jolka"] .entry'
    ];
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((entry) => {
        entry.dataset.lastMileProductEntry = 'true';
      });
    });
  };

  markProductEntries();
  requestAnimationFrame(markProductEntries);
  window.setTimeout(markProductEntries, 350);
})();
