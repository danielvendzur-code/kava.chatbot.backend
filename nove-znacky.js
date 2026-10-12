/* Brand symbol for the new demos. Loaded last, after every older layer has
   settled the launcher. A brand with a `mark` (a square symbol cut from its
   official logo) shows that symbol in the round launcher and in every
   assistant avatar, the way Cyprianus and Modrá púpava already do; the full
   logo stays in the page and widget header. */
(() => {
  'use strict';

  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand) return;

  /* A logo drawn on its own badge (Mymkech) would turn into a white disc in
     the brand-coloured widget header; such brands name a flat version. */
  const headerLogo = document.querySelector('.cx-widget-brand > img.cx-logo');
  if (brand.headerLogo && headerLogo) headerLogo.src = brand.headerLogo;

  if (!brand.mark || !launcher) return;

  document.body.dataset.cxNewMark = 'true';
  /* A masked span, not an <img>: skincare-launcher-logo-fix.js swaps any
     avatar that contains an image for a letter, and the two observers would
     otherwise keep undoing each other. */
  /* `markColor` keeps a multi-colour symbol in its own colours on a light
     launcher; on hover the launcher turns dark and the symbol swaps to its
     reversed version (`markColor.reverse`). */
  const color = brand.markColor;
  const markup = color
    ? `<span class="cx-new-mark cx-new-mark--color" aria-hidden="true" style="--cx-mark:url('${brand.mark}');--cx-mark-reverse:url('${color.reverse}')"></span>`
    : `<span class="cx-new-mark${brand.markWide ? ' cx-new-mark--wide' : ''}" aria-hidden="true" style="--cx-mark:url('${brand.mark}')"></span>`;
  if (color) {
    document.body.dataset.cxNewMarkColor = 'true';
    document.body.style.setProperty('--cx-mark-bg', color.bg);
    document.body.style.setProperty('--cx-mark-bg-hover', color.bgHover);
  }

  launcher.classList.remove('is-image-logo', 'cx-launcher-has-wordmark', 'cx-launcher-has-image-logo');
  launcher.classList.add('cx-launcher-has-new-mark');
  launcher.innerHTML = markup;

  const syncAvatars = () => {
    document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      if (avatar.querySelector('.cx-new-mark')) return;
      avatar.innerHTML = markup;
    });
  };
  syncAvatars();
  const root = document.querySelector('#cosmetics-root');
  if (root) new MutationObserver(syncAvatars).observe(root, { childList: true, subtree: true });
})();
