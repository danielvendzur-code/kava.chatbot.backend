(() => {
  'use strict';
  if (typeof window.__COFFEE_STABLE_FETCH__ !== 'function') return;
  window.fetch = window.__COFFEE_STABLE_FETCH__;
  document.documentElement.dataset.coffeeApiRoute = 'stable';
})();
