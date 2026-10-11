/* Catalogue facts enrich chat and recommendations. The native needs-based
   advisor owns selection, transitions, reset and the final recommendation. */
(() => {
  const slug = document.body.dataset.cosmeticsDemo;
  const brand = window.COSMETICS_DEMOS?.brands?.[slug];
  if (brand?.catalogue?.length) document.querySelector('#cx-widget')?.classList.add('cx-has-catalogue');
})();
