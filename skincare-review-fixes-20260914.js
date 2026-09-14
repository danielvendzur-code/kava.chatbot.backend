(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  if (slug !== 'cyprianus') return;

  const launcher = document.querySelector('#cx-open');
  if (!launcher) return;

  /* The source SVG is a 150x35 horizontal logo. The actual emblem occupies the
     left 35x35 area. Crop that area with an SVG viewport so no wordmark text can
     leak into the round launcher. */
  const symbolMarkup = '<span class="cx-cyprianus-symbol" aria-label="Cyprianus"><svg viewBox="0 0 35 35" aria-hidden="true" focusable="false"><image href="/assets/cosmetics/cyprianus-logo.svg" x="0" y="0" width="150" height="35" preserveAspectRatio="xMinYMid meet"></image></svg></span>';

  launcher.classList.remove('is-image-logo', 'cx-launcher-has-image-logo', 'cx-launcher-has-wordmark');
  launcher.classList.add('cx-launcher-has-image-logo');
  launcher.innerHTML = symbolMarkup;

  /* Chat message avatars use exactly the same emblem markup as the preview. */
  const syncAvatars = () => {
    document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      if (avatar.querySelector('.cx-cyprianus-symbol')) return;
      avatar.innerHTML = symbolMarkup;
    });
  };

  syncAvatars();
  const root = document.querySelector('#cosmetics-root');
  if (root) {
    const observer = new MutationObserver(syncAvatars);
    observer.observe(root, { childList: true, subtree: true });
  }
})();
