(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  const displayName = slug === 'syncare' ? 'SynCare' : String(brand.name || slug || '').trim();

  const shortMark = () => {
    if (slug === 'syncare') return 'SC';
    const words = displayName
      .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
      .split(/[\s-]+/)
      .filter(Boolean);
    if (words.length >= 2) return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
    const compact = words[0] || displayName;
    return compact.slice(0, compact.length <= 4 ? 2 : 1).toUpperCase();
  };

  const rasterMarkup = /<img\b/i.test(String(brand.wordmark || ''));

  /* Rectangular raster badges do not belong inside a circular floating button.
     Keep the original logo in the page/widget header and use a clean wordmark
     in the closed launcher. */
  const hasRasterBadge =
    launcher.classList.contains('is-image-logo') ||
    Boolean(launcher.querySelector('img, picture, .cx-logo')) ||
    rasterMarkup;

  if (hasRasterBadge) {
    const label = document.createElement('span');
    label.className = `cx-launcher-label${displayName.length > 11 ? ' is-long' : ''}`;
    label.textContent = displayName;
    launcher.classList.remove('is-image-logo');
    launcher.replaceChildren(label);
  }

  /* Message avatars must read as one clean circle on every brand. Raster logos
     such as SynCare's blue rectangular badge are replaced by a short brand mark
     inside that circle; the full official logo remains visible in the header. */
  const patchMessageAvatars = () => {
    document.querySelectorAll('.cx-message-avatar').forEach((avatar) => {
      avatar.classList.add('cx-message-avatar--round');
      const hasImage = Boolean(avatar.querySelector('img, picture, .cx-logo'));
      if (!hasImage) return;
      const mark = document.createElement('span');
      mark.className = 'cx-avatar-label';
      mark.textContent = shortMark();
      avatar.replaceChildren(mark);
    });
  };

  patchMessageAvatars();
  const root = document.querySelector('#cosmetics-root');
  if (root) {
    new MutationObserver(patchMessageAvatars).observe(root, { childList: true, subtree: true });
  }
})();
