(() => {
  'use strict';
  const demo = window.COFFEE_DEMOS?.diamonds;
  if (!demo) return;

  const localImages = {
    'peru-valley': '/assets/diamonds/peru-valley.webp',
    'brazil-fazenda': '/assets/diamonds/brazil-fazenda.webp',
    'kenya-mugaya': '/assets/diamonds/kenya-mugaya.webp',
    'kumanday': '/assets/diamonds/kumanday.webp',
    'el-buho': '/assets/diamonds/el-buho.webp'
  };

  demo.products = demo.products.map((product) => ({
    ...product,
    image: localImages[product.id] || product.image
  }));
})();
