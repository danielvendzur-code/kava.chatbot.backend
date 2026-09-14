(() => {
  'use strict';

  const brand = window.COSMETICS_DEMOS?.brands?.kvitok;
  if (!brand) return;

  const src = '/assets/cosmetics/kvitok-logo.png?v=20260914f';

  /* Use the real Kvitok artwork everywhere the compact mark is needed.
     No generated letter, no canvas recolouring, no text fallback. */
  brand.launcherMark = `<img class="cx-kvitok-direct-mark" src="${src}" alt="Kvitok">`;
  brand.avatarMark = `<img class="cx-kvitok-message-mark" src="${src}" alt="Kvitok">`;
})();
