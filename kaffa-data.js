(() => {
  const K = window.KF = {};
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  K.e = escapeHTML;
  K.wordmark = () => `
    <span class="kf-wordmark" aria-label="Kaffa Roastery">
      <strong>KAFFA</strong>
      <small>speciality coffee beans</small>
    </span>`;

  K.products = [
    {
      id: 'mokka',
      name: 'Mokka Espresso Blend',
      price: '11,90 € – 32,13 €',
      url: 'https://kaffaroastery.sk/produkt/mokka-espresso-blend/',
      image: '/assets/kaffa/mokka-official.webp',
      origin: 'Etiópia, Brazília, Peru, India a Vietnam',
      process: 'Plná a krémová',
      taste: 'kakao, mandle, orechy a škorica',
      prep: 'espresso, automat alebo moka',
      why: 'Chcete sladšiu, plnú kávu bez výraznej ovocnosti. Výborne chutí samostatne aj s mliekom.',
      packs: ['250 g', '1 kg'],
      grinds: ['Zrnková', 'Espresso', 'Moka', 'Automat'],
      weights: { prep: { espresso: 10, automatic: 9, moka: 8, filter: 1 }, taste: { chocolate: 10, balanced: 7, fruity: 1, adventurous: 0 }, drink: { black: 6, milk: 10 }, caffeine: { classic: 6, decaf: -12 } }
    },
    {
      id: 'kamundu',
      name: 'Kenya Kamundu Estate AA',
      price: '13,98 €',
      url: 'https://kaffaroastery.sk/produkt/kenya-kamundu-estate-aa/',
      image: '/assets/kaffa/kamundu-official.webp',
      origin: 'Kamundu Estate, Keňa',
      process: 'Svieža a jemne ovocná',
      taste: 'ríbezle, malina, slivka a vanilka',
      prep: 'filter alebo AeroPress',
      why: 'Pijete kávu najmä čiernu a chcete v nej cítiť príjemné ovocie. Je svieža, no nie ostro kyslá.',
      packs: ['250 g'],
      grinds: ['Zrnková', 'Filter', 'AeroPress'],
      weights: { prep: { espresso: 2, automatic: 2, filter: 11, moka: 1 }, taste: { chocolate: 2, balanced: 7, fruity: 10, adventurous: 5 }, drink: { black: 8, milk: 2 }, caffeine: { classic: 6, decaf: 3 } }
    },
    {
      id: 'decaf',
      name: 'Colombia Finca El Diviso Decaf',
      price: '16,42 €',
      url: 'https://kaffaroastery.sk/produkt/colombia-finca-el-diviso-decaf/',
      image: '/assets/kaffa/decaf-official.jpg',
      origin: 'Huila, Kolumbia',
      process: 'Sladká a bez kofeínu',
      taste: 'vanilka, mandarínka a jazmín',
      prep: 'filter alebo AeroPress',
      why: 'Chcete si vychutnať voňavú kávu aj večer. Je bez kofeínu, ale chuťou zostáva plná a zaujímavá.',
      packs: ['200 g'],
      grinds: ['Zrnková', 'Filter', 'AeroPress'],
      weights: { prep: { espresso: 1, automatic: 1, filter: 9, moka: 1 }, taste: { chocolate: 4, balanced: 7, fruity: 8, adventurous: 5 }, drink: { black: 8, milk: 2 }, caffeine: { classic: -8, decaf: 18 } }
    },
    {
      id: 'geisha',
      name: 'Wilder Lazo Stellar Origin',
      price: '21,42 €',
      url: 'https://kaffaroastery.sk/produkt/wilder-lazo/',
      image: '/assets/kaffa/wilder-lazo-official.webp',
      origin: 'Huila, Kolumbia',
      process: 'Natural Mosto fermentácia',
      taste: 'mango, broskyňa, malina a biele kvety',
      prep: 'filter',
      why: 'Radi skúšate nové chute a chcete výraznú kávu s tónmi tropického ovocia a kvetov.',
      packs: ['150 g'],
      grinds: ['Zrnková', 'Filter'],
      weights: { prep: { espresso: 1, automatic: 1, filter: 11, moka: 0 }, taste: { chocolate: 0, balanced: 4, fruity: 9, adventurous: 13 }, drink: { black: 9, milk: 0 }, caffeine: { classic: 6, decaf: -8 } }
    }
  ];

  K.questions = [
    {
      key: 'prep',
      title: 'Ako si kávu pripravujete?',
      hint: 'Vyberte spôsob, ktorý používate najčastejšie.',
      options: [
        ['espresso', 'Pákový kávovar', 'Espresso doma alebo v práci'],
        ['automatic', 'Automat', 'Káva stlačením tlačidla'],
        ['filter', 'Filter', 'Prekvapkávaná káva alebo AeroPress'],
        ['moka', 'Moka kanvička', 'Silnejšia káva zo sporáka']
      ]
    },
    {
      key: 'taste',
      title: 'Aká chuť vám je najbližšia?',
      hint: 'Vyberte to, na čo by ste mali práve chuť.',
      options: [
        ['chocolate', 'Kakao a orechy', 'Plná a pokojná chuť'],
        ['balanced', 'Sladká s ovocím', 'Jemné a vyvážené ovocie'],
        ['fruity', 'Výrazne ovocná', 'Bobule, citrus a sviežosť'],
        ['adventurous', 'Niečo nové', 'Netradičná a prekvapivá chuť']
      ]
    },
    {
      key: 'drink',
      title: 'Ako ju najčastejšie pijete?',
      hint: 'Čiernu alebo s mliekom — podľa toho vyberieme správnu kávu.',
      options: [
        ['black', 'Čiernu', 'Bez mlieka'],
        ['milk', 'S mliekom', 'Cappuccino, flat white alebo latte']
      ]
    },
    {
      key: 'caffeine',
      title: 'Má vás káva povzbudiť?',
      hint: 'Vyberte klasickú kávu alebo kávu bez kofeínu.',
      options: [
        ['classic', 'Áno', 'Klasická káva'],
        ['decaf', 'Radšej bez kofeínu', 'Dobrá aj na večer']
      ]
    }
  ];

  K.byId = id => K.products.find(product => product.id === id) || K.products[0];

  K.productImage = (product, className = '') => product.image
    ? `<img class="kf-product-photo ${className}" data-remote="${escapeHTML(product.image)}" alt="Balenie ${escapeHTML(product.name)}">`
    : `<div class="kf-packshot ${className}" role="img" aria-label="Balenie ${escapeHTML(product.name)}">
        <span class="kf-packshot__seal"></span>
        <span class="kf-packshot__label"><strong>KAFFA</strong><small>${escapeHTML(product.name)}</small></span>
      </div>`;

  K.hydrateImages = scope => {
    scope.querySelectorAll('img[data-remote]').forEach(node => {
      const image = new Image();
      image.onload = () => { node.src = node.dataset.remote; };
      image.onerror = () => { node.classList.add('is-unavailable'); };
      image.src = node.dataset.remote;
    });
  };
})();
