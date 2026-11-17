/* S5 visuals: questions show the criteria; result cards keep the actual product photos. */
(() => {
  const demos = window.S3_REG?.demos;
  if (!demos) return;
  const root = '/assets/s3/scenes-k2/';
  const tea = '/assets/s3/tea/';
  const plant = '/assets/s5/zahradananiti/scenes/';
  const scene = name => root + name + '.jpg';
  const set = (slug, choices) => {
    if (!demos[slug]) return;
    demos[slug].choicePhotos ||= {};
    for (const [key, photo] of Object.entries(choices)) {
      demos[slug].choicePhotos[key] = [].concat(photo).map(value => value.startsWith('/') ? value : scene(value));
    }
  };
  const heroes = {
    nutt:'bath-milky', pleva:'honey', jagaia:'face-routine', capri:'skin-sensitive', botanico:'lavender-field',
    janine:'rose-bath', eone:'hair-oil', nafigate:'face-massage', boemi:'body-shower', rubens:'rosehip',
    safran:'nettle', adoraniche:'incense', nicheandglow:'rose', scentisimo:'neroli-blossom',
    kintsugi:'sandalwood', oraculum:'incense', myskino:'jasmine', furiosa:'cherry-blossom', scentium:'ocean-wave',
    medarek:'mint-herbs', dvoukocek:'calendula', mydlarnaerde:'sea-buckthorn'
  };
  for (const [slug, photo] of Object.entries(heroes)) if (demos[slug]?.brand) demos[slug].brand.hero = scene(photo);
  const more = 'sparkler';
  set('boemi', {footCare:'leg-massage'});
  set('safran', {'Peelingové mýdlo':'coffee-scrub-leg'});
  set('adoraniche', {'roasted-tea':tea+'s3Roasted.jpg', nucleus:'incense', nel:'grapes', swim:'black-tea', maamoul:'almonds', wood:'sandalwood'});
  set('nicheandglow', {mio:'mango', pivoine:'rose', ground:'incense', vetiver:'oak', 'navigation:more':more});
  set('scentisimo', {'eau-de-la-couronne':'white-rose', 'body-mist-sea-mist':'lemon-tree', 'navigation:more':more});
  set('kintsugi', {
    'navigation:more':more, 'taom-eau-de-parfum':'grapefruit', 'kaigan-eau-de-parfum':'ocean-wave',
    'hanzo-eau-de-parfum':'pine', 'tempo-eau-de-parfum':'bay-salt', 'muza-eau-de-parfum':'jasmine',
    'carnal-eau-de-parfum':'juniper', 'luna-eau-de-parfum':'sugar', 'ambre-extrait-de-parfum':'cocoa',
    'phenix-eau-de-parfum':'coffee-beans', 'santal-eau-de-parfum':'sandalwood', 'deus-eau-de-parfum':'lavender',
    'ambre-oud-extrait-de-parfum':'mango'
  });
  set('oraculum', {arabesque:'carrots', 'mio-dio':'mango'});
  set('myskino', {ambrelatte:'almonds', 'navigation:more':more});
  set('furiosa', {'furiosa-candy-as-fck':'sugar', 'furiosa-fizz':'grapes', 'furiosa-nude':'poppy'});
  set('scentium', {salt:'white-rose', 'blanc-sesame-1':'neroli-blossom', 'malkhut-109':'thyme'});
  set('medarek', {
    'bublinovy-sampuk':'mint-herbs', 'liskovy-sampuk':'almonds', 'arganovy-sampuk':'argan-tree',
    'hajanek-sampuk':'lavender-field', 'monoi-de-tahiti-mydlo':'coconut', 'bambucke-mydlo':'body-shower',
    'levandulove-mydlo':'lavender-bunch', 'bananove-mydlo':'milk', 'balzam-na-rty-mango':'mango',
    'balzam-na-rty-vanilka':'vanilla', 'balzam-na-rty-mata':'mint-herbs', 'balzam-na-rty-svestka':'plums'
  });
  set('dvoukocek', {
    'prirodni-mydlo-balzam-na-dusi':'calendula', 'prirodni-mydlo-levandulove-le':'lavender',
    'prirodni-mydlo-medunkove-le':'lemon-balm', 'prirodni-mydlo-muzna-paze':'man-face',
    'moringove-mydlo':'moringa', 'afrodiziakalni-mydlo':'rose-bath',
    'tuhy-sampon-suche-vlasy_maisoap':'hair-ends-dry', 'tuhy-sampon-mastici-se-vlasy_maisoap':'hair-roots'
  });
  set('mydlarnaerde', {
    'amla-oves-keratin-sampuk-95-g':'amla', 'merunka-a-hedvabi-sampuk-s-kondicionerem-90-g':'apricots',
    'jojoba-lneny-olej-modry-jil-80-g-kudrnate-vlasy-prirodni-sampuk':'hair-curly', 'sampuk--henna':'hair-smooth',
    'citrusovy-rakytnik-prirodni-mydlo':'sea-buckthorn', 'prirodni-horcikove-solne-mydlo-magnesium-soap-100-g':'sea-salt',
    'prirodni-intimni-mydlo-s-esencalnimi-oleji-100-g':'/assets/scenes/daily-care.jpg'
  });
  set('meetea', {
    meeteaOolong:tea+'s3Oolong.jpg', meeteaBlack:tea+'s3Black.jpg', meeteaSheng:tea+'s3Puerh.jpg', meeteaDark:tea+'s3Dark.jpg',
    'baozhong-2026':'jasmine', 'dong-ding-tradition-2026':'mango', 'gaba-oolong-sijichun-taiwan':'plums',
    'lusitania-2026':'grapes', 'hong-ding-2026':'raspberries', 'ruby-18-redjade-taiwan-hong':'cocoa',
    'thuong-son-2026':'sugar', 'wild-lao-cai-2026':'linden-blossom', 'lai-chau-2026':tea+'s3Roasted.jpg',
    'zhongcha-tuo-2003':'pine', 'kolac-2024':'coffee-beans', 'small-basket-liubao-2016':'oak'
  });
  const plants = ['slunecny-parapet','vychod-zapad','svetle-misto','polostin','senecio-snurka-perel',
    'sanseviera-bacularis-mikado-tchynin-jazyk','ceropegia-woodii-svicnik','cik-cak-kaktus',
    'epiphyllum-chrisocardium-listovy-kaktus','pilea-peprincova','zelvickova-peperomie','monstera-minima',
    'haworthia-fasciata-havortie','maranta-leuconeura-fascinator-modlivka','monstera-monkey-mask','platycerium-bifurcatum-paroznatka'];
  set('zahradananiti', Object.fromEntries(plants.map(key => [key, plant + key + '.webp'])));
  if (demos.zahradananiti?.brand) demos.zahradananiti.brand.hero = plant + 'svetle-misto.webp';
})();
