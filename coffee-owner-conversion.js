/**
 * Superseded by coffee-owner-brand.js.
 *
 * This module used to overwrite every roastery's page with one generic block of
 * markup, so all six demos arrived in the owner's inbox looking identical apart
 * from the logo. It now only loads the brand-aware renderer, which builds the
 * page from that roastery's own catalogue, photography and palette.
 *
 * Kept as a file because index.html and jolka.html both reference it.
 */
(() => {
  'use strict';
  if (document.querySelector('script[data-mcb-owner]')) return;
  const script = document.createElement('script');
  script.src = '/coffee-owner-brand.js?v=939599e5';
  script.dataset.mcbOwner = 'true';
  script.async = false;
  document.body.appendChild(script);
})();
