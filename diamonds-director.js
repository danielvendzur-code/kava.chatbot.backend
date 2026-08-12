(() => {
  'use strict';
  const demo = window.COFFEE_DEMOS?.diamonds;
  if (!demo) return;

  const localImages = {
    'peru-valley': '/assets/diamonds/peru-valley-official.jpg',
    'brazil-fazenda': '/assets/diamonds/brazil-fazenda-official.jpg',
    'kenya-mugaya': '/assets/diamonds/kenya-mugaya-official.jpg',
    'kumanday': '/assets/diamonds/kumanday-official.jpg',
    'el-buho': '/assets/diamonds/el-buho-official.jpg'
  };

  demo.products = demo.products.map((product) => ({
    ...product,
    image: localImages[product.id] || product.image
  }));
})();
