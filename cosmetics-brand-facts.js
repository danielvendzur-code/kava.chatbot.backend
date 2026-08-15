(() => {
  'use strict';
  const brands = window.COSMETICS_DEMOS?.brands;
  if (!brands) return;

  const markMissing = (image) => {
    if (!(image instanceof HTMLImageElement) || !image.closest('#cosmetics-root')) return;
    image.style.display = 'none';
    image.parentElement?.classList.add('is-image-missing');
  };

  const watchImage = (image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.cxWatched === 'true') return;
    image.dataset.cxWatched = 'true';
    image.addEventListener('error', () => markMissing(image), { once:true });
    const timer = window.setTimeout(() => {
      if (!image.complete || image.naturalWidth < 2) markMissing(image);
    }, 1800);
    image.addEventListener('load', () => window.clearTimeout(timer), { once:true });
    if (image.complete && image.naturalWidth < 2) markMissing(image);
  };

  // Third-party image hosts must never leave a broken icon or keep the demo visually unfinished.
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node instanceof HTMLImageElement) watchImage(node);
        node.querySelectorAll?.('img').forEach(watchImage);
      }
    }
  });
  const root = document.querySelector('#cosmetics-root');
  if (root) {
    observer.observe(root, { childList:true, subtree:true });
    root.querySelectorAll('img').forEach(watchImage);
  }

  // Fresh visual sources and product facts checked against the current shops.
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
