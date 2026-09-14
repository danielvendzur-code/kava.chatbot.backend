(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  if (slug !== 'cyprianus') return;

  const launcher = document.querySelector('#cx-open');
  if (!launcher) return;

  /* Restore the exact compact Cyprianus preview mark used before the last
     follow-up. Do not alter the launcher fill or geometry here. */
  launcher.classList.remove('is-image-logo', 'cx-launcher-has-image-logo', 'cx-launcher-has-wordmark');
  launcher.classList.add('cx-launcher-has-image-logo');
  launcher.innerHTML = '<span class="cx-cyprianus-symbol" aria-label="Cyprianus"><img src="/assets/cosmetics/cyprianus-logo.svg" alt=""></span>';

  /* Assistant message avatars must use the very same mark as the preview,
     not the full Cyprianus wordmark. */
  const syncAvatars = () => {
    const markup = launcher.innerHTML;
    document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      if (avatar.innerHTML === markup) return;
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
