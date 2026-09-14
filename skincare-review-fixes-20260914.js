(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  if (slug !== 'cyprianus') return;

  const launcher = document.querySelector('#cx-open');
  if (!launcher) return;

  /* Use the original Cyprianus asset directly and clip its left 35x35 emblem.
     This avoids the async SVG parsing path that could fail and leave the full
     wordmark in the launcher. The exact same markup is used in chat avatars. */
  const markup = '<span class="cx-cyprianus-symbol" aria-label="Cyprianus"><img src="/assets/cosmetics/cyprianus-logo.svg" alt=""></span>';

  launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark');
  launcher.classList.add('cx-launcher-has-image-logo');
  launcher.innerHTML = markup;

  const syncAvatars = () => {
    document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      if (avatar.querySelector('.cx-cyprianus-symbol')) return;
      avatar.innerHTML = markup;
    });
  };

  syncAvatars();
  const root = document.querySelector('#cosmetics-root');
  if (root) {
    const observer = new MutationObserver(syncAvatars);
    observer.observe(root, { childList: true, subtree: true });
  }
})();
