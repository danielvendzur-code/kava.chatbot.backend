(() => {
  'use strict';
  const brands = window.COSMETICS_DEMOS?.brands;
  if (!brands) return;

  // Keep the public demo resilient when a third-party image host blocks hotlinking.
  document.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.closest('#cosmetics-root')) return;
    image.style.display = 'none';
    image.parentElement?.classList.add('is-image-missing');
  }, true);

  // Fresh, stable visual sources and product facts checked against the current shops.
  brands.two.hero = 'https://gravitywrite.sgp1.digitaloceanspaces.com/ai-images/ee41c03eb8e5_20251128_072941_120025.png';

  brands.biofy.hero = 'https://biofy.sk/media/images/kremy-na-tvar/fullsizes/821-hydratacny_krem_biofy.png';
  const biofyDry = brands.biofy.products.find((product) => product.id === 'dry');
  if (biofyDry) biofyDry.price = '21,20 €';
  const biofyHemp = brands.biofy.products.find((product) => product.id === 'hemp');
  if (biofyHemp) biofyHemp.price = '17,80 €';

  brands.anemone.hero = 'https://anemone.sk/img/cms/uvod1.webp';
  const anemoneChamomileIndex = brands.anemone.products.findIndex((product) => product.id === 'chamomile');
  if (anemoneChamomileIndex >= 0) {
    brands.anemone.products[anemoneChamomileIndex] = {
      id:'rosewater',
      name:'Kvetinová voda Ruža Damascénska',
      price:'5,30 €',
      url:'https://anemone.sk/kvetinove-vody/kvetinova-voda-ruza-damascenska.html',
      tags:['sensitive','calm','target','any','basic'],
      reason:'Jemný doplnkový krok pre zákazníka, ktorý chce rutinu skôr zjednodušiť a osviežiť.'
    };
  }

  const ponioLumina = brands.ponio.products.find((product) => product.id === 'lumina');
  if (ponioLumina) ponioLumina.name = 'Lumina shield – denný ochranný pleťový krém';
})();
