(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* PONIO is the approved reference and must not be touched. */
  if (slug === 'ponio') return;

  /* These source marks remain readable at launcher size. Restore the real logo
     after the generic raster fallback script has run. SynCare is deliberately
     excluded because its source PNG is a wide rectangular badge. */
  const REAL_LOGO = new Set([
    'modrapupava',
    'facederma',
    'cyprianus',
    'panakeia',
    'bellmedi',
    'lavelin',
    'kvitok',
    'soaphoria',
    'natureal'
  ]);

  if (slug === 'syncare') {
    const mark = document.createElement('span');
    mark.className = 'cx-launcher-fallback';
    mark.textContent = 'SC';
    launcher.classList.remove('is-image-logo');
    launcher.replaceChildren(mark);
    return;
  }

  if (!REAL_LOGO.has(slug)) return;

  const template = document.createElement('template');
  template.innerHTML = String(brand.wordmark || '').trim();
  const source = template.content.querySelector('img');
  if (!source) return;

  const img = document.createElement('img');
  img.className = 'cx-launcher-real-logo';
  img.src = source.getAttribute('src') || '';
  img.alt = source.getAttribute('alt') || brand.name || '';
  img.decoding = 'async';
  launcher.classList.remove('is-image-logo');
  launcher.replaceChildren(img);
})();
