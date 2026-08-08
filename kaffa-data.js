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
      image: 'https://kaffaroastery.sk/wp-content/uploads/2025/11/mokka250g.webp',
      origin: 'Ethiopia Harar · Brazil Santos · Peru Cuzco · India Kappi Royale · Vietnam Dak Lak',
      process: '80 % Arabica / 20 % Robusta',
      taste: 'kakao · mandle · lieskovce · škorica',
      prep: 'espresso · automat · moka',
      why: 'Dobrá voľba, ak chcete sladšie a krémové espresso s jemnou aciditou. V mlieku zostane plná a čokoládová.',
      packs: ['250 g', '1 kg'],
      grinds: ['Zrnková', 'Espresso', 'Moka', 'Automat'],
      weights: { prep: { espresso: 10, automatic: 9, moka: 8, filter: 1 }, taste: { chocolate: 10, balanced: 7, fruity: 1, adventurous: 0 }, drink: { black: 6, milk: 10 }, caffeine: { classic: 6, decaf: -12 } }
    },
    {
      id: 'kamundu',
      name: 'Kenya Kamundu Estate AA',
      price: '13,98 €',
      url: 'https://kaffaroastery.sk/produkt/kenya-kamundu-estate-aa/',
      image: 'https://kaffaroastery.sk/wp-content/uploads/2025/11/kaffa-kamundu.webp',
      origin: 'Kiambu, Nairobi · Kamundu Estate',
      process: 'Washed',
      taste: 'čierne ríbezle · smotana · ibištek · malina · slivka · vanilka',
      prep: 'V60 · Kalita · AeroPress',
      why: 'Pre filter a čiernu kávu, ak chcete čistý, šťavnatý profil. Ovocnosť tu znamená zrelé bobuľové ovocie, nie ostrú kyslosť.',
      packs: ['250 g'],
      grinds: ['Zrnková', 'V60 / filter', 'AeroPress'],
      weights: { prep: { espresso: 2, automatic: 2, filter: 11, moka: 1 }, taste: { chocolate: 2, balanced: 7, fruity: 10, adventurous: 5 }, drink: { black: 8, milk: 2 }, caffeine: { classic: 6, decaf: 3 } }
    },
    {
      id: 'decaf',
      name: 'Colombia Finca El Diviso Decaf',
      price: '16,42 €',
      url: 'https://kaffaroastery.sk/produkt/colombia-finca-el-diviso-decaf/',
      image: '',
      origin: 'Huila, Pitalito · Finca El Diviso',
      process: 'Sugar Cane Decaf (EA)',
      taste: 'vanilka · citrónová tráva · mandarínka · jazmínový kvet',
      prep: 'filter · AeroPress',
      why: 'Výberový decaf, keď chcete sladkosť a aromatiku bez povzbudenia. Sugar Cane proces zachováva charakter kávy, nie iba „bez kofeínu“.',
      packs: ['200 g'],
      grinds: ['Zrnková', 'V60 / filter', 'AeroPress'],
      weights: { prep: { espresso: 1, automatic: 1, filter: 9, moka: 1 }, taste: { chocolate: 4, balanced: 7, fruity: 8, adventurous: 5 }, drink: { black: 8, milk: 2 }, caffeine: { classic: -8, decaf: 18 } }
    },
    {
      id: 'geisha',
      name: 'Geisha Ninety Plus Stellar Origin',
      price: '21,42 €',
      url: 'https://kaffaroastery.sk/produkt/wilder-lazo/',
      image: '',
      origin: 'Silla Del Pando, Panama · Volcan Valley',
      process: 'Anaerobic Natural',
      taste: 'žltý melón · mango · med · marakuja · pomarančový kvet',
      prep: 'V60 · Origami · Kalita',
      why: 'Ak chcete výrazný, tropický filter s dlhým dozvukom a nevadí vám experimentálnejšie spracovanie.',
      packs: ['150 g'],
      grinds: ['Zrnková', 'V60 / filter'],
      weights: { prep: { espresso: 1, automatic: 1, filter: 11, moka: 0 }, taste: { chocolate: 0, balanced: 4, fruity: 9, adventurous: 13 }, drink: { black: 9, milk: 0 }, caffeine: { classic: 6, decaf: -8 } }
    }
  ];

  K.prepPhotos = {
    espresso: '/assets/kaffa/prep-espresso.webp',
    automatic: '/assets/kaffa/prep-automatic.webp',
    filter: '/assets/kaffa/prep-filter.webp',
    moka: '/assets/kaffa/prep-moka.webp'
  };

  K.questions = [
    {
      key: 'prep',
      title: 'Ako si kávu najčastejšie pripravujete?',
      hint: 'Začneme tým, čo poznáte najlepšie. Odborné názvy môžu počkať.',
      photo: true,
      options: [
        ['espresso', 'Espresso', 'Pákový kávovar', 'espresso'],
        ['automatic', 'Automat', 'Jedno tlačidlo, stabilný výsledok', 'automatic'],
        ['filter', 'Filter / AeroPress', 'Čistejšie chute a viac detailu', 'filter'],
        ['moka', 'Moka', 'Plnšie a intenzívnejšie', 'moka']
      ]
    },
    {
      key: 'taste',
      title: 'Ktorý chuťový smer vám je najbližší?',
      hint: 'Vyberte pocit, ktorý chcete v šálke. Cuppingový slovník netreba.',
      options: [
        ['chocolate', 'Čokoláda a orechy', 'Sladké, pokojné, minimum ostrosti'],
        ['balanced', 'Sladké s jemným ovocím', 'Moderné, ale stále prístupné'],
        ['fruity', 'Šťavnaté ovocie', 'Bobule, citrus a jasnejšia chuť'],
        ['adventurous', 'Výrazné a netradičné', 'Tropické, kvetinové, vrstvené']
      ]
    },
    {
      key: 'drink',
      title: 'Pijete kávu skôr čiernu alebo s mliekom?',
      hint: 'Mlieko potrebuje výraznejší základ, čierna káva ukáže viac detailu.',
      options: [
        ['black', 'Najčastejšie čiernu', 'Chcem cítiť pôvod a arómu'],
        ['milk', 'Často s mliekom', 'Cappuccino, flat white alebo latte']
      ]
    },
    {
      key: 'caffeine',
      title: 'Má vás káva povzbudiť?',
      hint: 'Aj bez kofeínu sa dá vybrať plnohodnotná výberová káva.',
      options: [
        ['classic', 'Áno, klasicky', 'Bežný obsah kofeínu'],
        ['decaf', 'Radšej bez kofeínu', 'Chuť bez povzbudenia']
      ]
    }
  ];

  K.byId = id => K.products.find(product => product.id === id) || K.products[0];

  K.productImage = (product, className = '') => product.image
    ? `<img class="${className}" src="${escapeHTML(product.image)}" data-remote="${escapeHTML(product.image)}" alt="Oficiálna fotografia balenia ${escapeHTML(product.name)}">`
    : `<div class="kf-product-photo-missing ${className}" role="img" aria-label="Oficiálna produktová fotografia nie je v tomto deme vložená"><span>Produktová fotografia<br>na e-shope</span></div>`;

  K.hydrateImages = scope => {
    scope.querySelectorAll('img[data-remote]').forEach(node => {
      const image = new Image();
      image.onload = () => { node.src = node.dataset.remote; };
      image.onerror = () => { node.classList.add('is-unavailable'); };
      image.src = node.dataset.remote;
    });
  };
})();
