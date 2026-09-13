(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  // Some brands (SynCare in particular) use a raster rectangular badge as the
  // wordmark. That must never be rendered inside the circular floating button.
  // Detect the actual DOM as well as the source markup so this remains robust
  // even if the base renderer stops adding the is-image-logo helper class.
  const hasRasterBadge =
    launcher.classList.contains('is-image-logo') ||
    Boolean(launcher.querySelector('img, picture, .cx-logo')) ||
    /<img\b/i.test(String(brand.wordmark || ''));

  if (!hasRasterBadge) return;

  const displayName = slug === 'syncare' ? 'SynCare' : String(brand.name || slug || '').trim();
  const label = document.createElement('span');
  label.className = `cx-launcher-label${displayName.length > 11 ? ' is-long' : ''}`;
  label.textContent = displayName;

  launcher.classList.remove('is-image-logo');
  launcher.replaceChildren(label);
})();
