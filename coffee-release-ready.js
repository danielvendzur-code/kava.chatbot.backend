(() => {
  'use strict';

  // The final stylesheet is loaded immediately before this script. A short
  // settle window lets late brand mutations and the initial CSS transition
  // reach their final state before QA (or diagnostics) reads geometry/colors.
  setTimeout(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.dataset.coffeeReleaseReady = 'true';
    }));
  }, 380);
})();
