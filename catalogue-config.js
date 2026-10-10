(() => {
  'use strict';
  const catalogues = globalThis.CX_CATALOGUES || {};
  const data = window.COSMETICS_DEMOS;
  if (!data) return;
  if(data.brands.modrapupava)data.brands.modrapupava.avatarIcon="/assets/catalogue/logos/modrapupava-symbol.png";
  for (const [slug, catalogue] of Object.entries(catalogues)) {
    const brand = data.brands[slug];
    if (!brand) continue;
    if(slug!=='ponio')brand.avatarIcon='/assets/catalogue/logos/'+slug+'-symbol.png';
    brand.catalogue = catalogue.products;
    brand.catalogueVerifiedAt = catalogue.verifiedAt;
    const face = catalogue.products.filter(p => p.category === 'face' && !p.isSample);
    if (face.length) brand.products = face;
  }
  window.CX_CATALOGUE_REPLY = (slug,text) => globalThis.CXCatalogueReplyCore?.(catalogues,slug,text) || '';
})();
