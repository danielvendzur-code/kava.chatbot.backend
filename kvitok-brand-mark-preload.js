(() => {
  'use strict';

  const brand = window.COSMETICS_DEMOS?.brands?.kvitok;
  if (!brand) return;

  const src = '/assets/cosmetics/kvitok-logo.png?v=20260914g';

  /* Closed launcher starts from the real Kvitok artwork; the Kvitok-only final
     script replaces only the visible badge with the cleaned real wordmark. */
  brand.launcherMark = `<img class="cx-kvitok-direct-mark" src="${src}" alt="Kvitok">`;

  /* Message avatars do not need the full badge. Keep a compact, stable K so the
     source artwork is never stretched or awkwardly cropped inside messages. */
  brand.avatarMark = '<span class="cx-kvitok-message-letter" aria-label="Kvitok">K</span>';
})();
