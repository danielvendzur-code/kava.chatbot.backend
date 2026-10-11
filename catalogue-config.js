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
    // Retain curated suitability from the original brand records when the
    // expanded catalogue uses a newer URL or an exact pack size.
    for (const product of face) {
      const old = brand.products.find(p => product.url.replace(/\/$/, '').endsWith(p.url.split('/').filter(Boolean).at(-1)));
      if (old) {
        product.tags = [...new Set([...product.tags, ...old.tags])];
        product.reason = old.reason;
      }
      if (/mastn.*aknózn/i.test(product.name) && !product.tags.includes('clarity')) product.tags.push('clarity');
    }
    if (face.length) brand.products = face;
  }
  window.CX_CATALOGUE_REPLY = (slug,text) => globalThis.CXCatalogueReplyCore?.(catalogues,slug,text) || '';
})();
