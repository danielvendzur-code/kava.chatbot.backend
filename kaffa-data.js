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
      origin: 'Ethiopia · Brazil · Peru · India · Vietnam',
      process: 'Espresso blend · 80 % Arabica / 20 % Robusta',
      taste: 'kakao · mandle · lieskovce',
      prep: 'espresso · automat · moka',
      why: 'Najbezpečnejší smer pre zákazníka, ktorý chce krémové espresso, minimum ostrej acidity alebo kávu do mlieka.',
      packs: ['250 g', '1 kg'],
      grinds: ['Zrnková', 'Espresso', 'Moka', 'Automat'],
      keys: ['espresso', 'automatic', 'moka', 'chocolate', 'milk', 'classic']
    },
    {
      id: 'kamundu',
      name: 'Kenya Kamundu Estate AA',
      price: '13,98 €',
      url: 'https://kaffaroastery.sk/produkt/kenya-kamundu-estate-aa/',
      image: 'https://kaffaroastery.sk/wp-content/uploads/2025/11/kaffa-kamundu.webp',
      origin: 'Kenya',
      process: 'Washed',
      taste: 'ríbezle · malina · slivka · vanilka',
      prep: 'V60 · Kalita · AeroPress',
      why: 'Pre človeka, ktorý chce čistý a šťavnatý filter. Ovocnosť tu znamená zrelé bobuľové ovocie, nie nepríjemne ostrú kyslosť.',
      packs: ['250 g'],
      grinds: ['Zrnková', 'V60 / filter', 'AeroPress'],
      keys: ['filter', 'black', 'fruity', 'classic']
    },
    {
      id: 'decaf',
      name: 'Colombia Finca El Diviso Decaf',
      price: '16,42 €',
      url: 'https://kaffaroastery.sk/produkt/colombia-finca-el-diviso-decaf/',
      image: '',
      origin: 'Colombia · Huila, Pitalito',
      process: 'Sugar Cane Decaf (EA)',
      taste: 'vanilka · mandarínka · jazmín',
      prep: 'filter · AeroPress',
      why: 'Keď zákazník nechce kofeín, ale stále očakáva sladkosť, čistotu a aromatiku výberovej kávy.',
      packs: ['200 g'],
      grinds: ['Zrnková', 'V60 / filter', 'AeroPress'],
      keys: ['filter', 'black', 'fruity', 'decaf']
    },
    {
      id: 'geisha',
      name: 'Geisha Ninety Plus Stellar Origin',
      price: '21,42 €',
      url: 'https://kaffaroastery.sk/produkt/stellar-origin/',
      image: '',
      origin: 'Panama · Silla Del Pando',
      process: 'Anaerobic Natural',
      taste: 'mango · marakuja · med · pomarančový kvet',
      prep: 'V60 · Origami · Kalita',
      why: 'Pre zákazníka, ktorý chce výrazný zážitkový filter a je otvorený intenzívnej ovocnosti a experimentálnejšiemu spracovaniu.',
      packs: ['150 g'],
      grinds: ['Zrnková', 'V60 / filter'],
      keys: ['filter', 'black', 'adventurous', 'fruity', 'classic']
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
      hint: 'Začneme spôsobom prípravy. Ten najviac zúži vhodné kávy.',
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
      hint: 'Bez cuppingového slovníka. Stačí pocit, ktorý chcete v šálke.',
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
      hint: 'Kaffa má aj výberový decaf, takže bez kofeínu nemusí znamenať kompromis.',
      options: [
        ['classic', 'Áno, klasicky', 'Bežný obsah kofeínu'],
        ['decaf', 'Radšej bez kofeínu', 'Chuť bez povzbudenia']
      ]
    }
  ];

  K.byId = id => K.products.find(product => product.id === id) || K.products[0];

  K.fallbackBag = product => {
    const label = product.id === 'mokka' ? '#8fc5dc' : '#d7e7ef';
    const name = escapeHTML(product.name.split(' ').slice(0, 3).join(' '));
    return 'data:image/svg+xml,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 620">
        <defs>
          <filter id="s" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#111" flood-opacity=".16"/></filter>
        </defs>
        <rect width="520" height="620" fill="#fff"/>
        <g filter="url(#s)">
          <path d="M126 66h268l-12 458c-.7 26-22 46-48 46H186c-26 0-47-20-48-46L126 66Z" fill="#cdbb9b"/>
          <text x="260" y="148" text-anchor="middle" fill="#111" font-family="Georgia,serif" font-size="31" font-weight="700" letter-spacing="8">KAFFA</text>
          <text x="305" y="174" text-anchor="middle" fill="#111" font-family="monospace" font-size="11">speciality coffee beans</text>
          <path d="M177 228c56-27 116-37 169-13 32 15 46 57 27 90-27 48-106 69-166 39-43-22-59-91-30-116Z" fill="${label}"/>
          <text x="260" y="278" text-anchor="middle" fill="#111" font-family="monospace" font-size="16" font-weight="700">${name}</text>
          <text x="260" y="308" text-anchor="middle" fill="#111" font-family="monospace" font-size="12">KAFFA ROASTERY</text>
        </g>
      </svg>`);
  };

  K.productImage = (product, className = '') => `
    <img class="${className}" src="${K.fallbackBag(product)}" data-remote="${escapeHTML(product.image || '')}" alt="Balenie ${escapeHTML(product.name)}">`;

  K.hydrateImages = scope => {
    scope.querySelectorAll('img[data-remote]').forEach(node => {
      if (!node.dataset.remote) return;
      const image = new Image();
      image.onload = () => { node.src = node.dataset.remote; };
      image.src = node.dataset.remote;
    });
  };
})();
