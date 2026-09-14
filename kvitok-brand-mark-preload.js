(() => {
  'use strict';

  const brand = window.COSMETICS_DEMOS?.brands?.kvitok;
  if (!brand) return;

  const src = '/assets/cosmetics/kvitok-logo.png?v=20260914g';

  /* Closed launcher keeps the real Kvitok badge. */
  brand.launcherMark = `<img class="cx-kvitok-direct-mark" src="${src}" alt="Kvitok">`;

  /* Chat messages use the K taken directly from the real Kvitok artwork.
     This is an image crop of the original logo, not a typed/generated letter. */
  brand.avatarMark = `<svg class="cx-kvitok-message-k" viewBox="0 60 82 82" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Kvitok"><image href="${src}" x="0" y="0" width="220" height="220" preserveAspectRatio="none"></image></svg>`;
})();
