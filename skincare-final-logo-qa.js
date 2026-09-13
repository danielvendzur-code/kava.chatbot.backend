(() => {
  'use strict';

  const data = window.COSMETICS_DEMOS;
  const slug = document.body?.dataset?.cosmeticsDemo;
  const brand = data?.brands?.[slug];
  const launcher = document.querySelector('#cx-open');
  if (!brand || !launcher) return;

  /* PONIO is the approved reference and must remain exactly as it is. */
  if (slug === 'ponio') return;

  /* The closed preview must always carry the firm's real mark from the same
     wordmark used in the page header. Never replace it with SC/N/BM initials. */
  const template = document.createElement('template');
  template.innerHTML = String(brand.wordmark || '').trim();
  const source = template.content.firstElementChild;
  if (!source) return;

  const mark = source.cloneNode(true);
  launcher.classList.remove('is-image-logo');
  launcher.replaceChildren(mark);

  if (mark.matches('img')) {
    mark.classList.add('cx-launcher-real-logo');
    mark.removeAttribute('width');
    mark.removeAttribute('height');
    mark.decoding = 'async';
  } else {
    mark.classList.add('cx-launcher-real-wordmark');
  }
})();
