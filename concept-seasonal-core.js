(() => {
  'use strict';
  const app = window.ConceptSeasonalApp = {};
  const config = window.CONCEPT_SEASONAL_CONFIG;
  const root = document.querySelector('#coffee-demo-root');
  if (!config || !root) throw new Error('Concept seasonal configuration is missing.');

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);

  const svg = (body, viewBox = '0 0 24 24') => `<svg viewBox="${viewBox}" fill="none" aria-hidden="true">${body}</svg>`;
  const stroke = (d, width = 1.8) => `<path d="${d}" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const icons = {
    arrow: svg(stroke('M5 12h14M14 7l5 5-5 5')),
    chat: svg(stroke('M5 17.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.6 0-5-.8-7-3Z') + stroke('M8 12h.01M12 12h.01M16 12h.01')),
    compass: svg(stroke('M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z') + stroke('m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z')),
    reset: svg(stroke('M20 11a8 8 0 1 0-2.4 5.7') + stroke('M20 5v6h-6')),
    close: svg(stroke('m6 6 12 12M18 6 6 18')),
    back: svg(stroke('m15 18-6-6 6-6')),
    check: svg(stroke('m5 12 4 4L19 6', 2)),
    send: svg(stroke('m4 4 16 8-16 8 3-8-3-8Z') + stroke('M7 12h13')),
    bean: svg(stroke('M12 3c4.8 0 8 3.7 8 9s-3.2 9-8 9-8-3.7-8-9 3.2-9 8-9Z') + stroke('M8 18c5-3 3-9 8-12')),
    balance: svg(stroke('M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z')),
    fruit: svg(stroke('M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5')),
    bold: svg(stroke('M8 21c-2-4 1-6 2-9 1-2 0-5 2-9 4 4 5 7 4 10 3-1 4-2 4-4 3 6 0 12-6 12H8Z')),
    black: svg(stroke('M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2')),
    milk: svg(stroke('M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0')),
    both: svg(stroke('M4 6h7v12H4zM13 6h7v12h-7z')),
    bolt: svg(stroke('m13 2-7 11h6l-1 9 7-12h-6l1-8Z')),
    moon: svg(stroke('M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z')),
    either: svg(stroke('M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3'))
  };

  function mark(extraClass = '') {
    return `<svg class="assistant-mark ${extraClass}" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path class="assistant-mark__c" d="M49 13.4A23.5 23.5 0 1 0 50.4 48L57 54l-1.8-12.4" stroke="currentColor" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="assistant-mark__bean" d="M38.8 21.5c8.3 5.1 7.7 15.4.7 21.7-7.1 6.4-16.9 4.3-19.5-4.1-2.7-8.6 4-17.2 13.5-18.4 2-.3 3.7 0 5.3.8Zm-14 20.2c7.1-3.7 7.6-11.2 14.9-17.3" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function brandSeal() {
    return `<svg class="concept-seal" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path d="M18 18 54 54M54 18 18 54" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M30 13h10v5h-2v4h-6v-4h-2v-5Zm10 4h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M30 51h12l-2.5 8h-7L30 51Zm2-5h8l2 5H30l2-5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
      <text x="9" y="39" fill="currentColor" font-size="9" font-weight="700" font-family="Arial, sans-serif">20</text>
      <text x="51" y="39" fill="currentColor" font-size="9" font-weight="700" font-family="Arial, sans-serif">15</text>
    </svg>`;
  }

  const productById = (id) => config.products.find((product) => product.id === id);
  const stateKey = 'concept-seasonal-state-v2';
  const defaultState = () => ({
    mode: 'chat', step: 0, answers: {}, stage: 'questions', selectedProduct: null,
    packageGrams: null, grind: 'beans', transitioning: false, chatHistory: []
  });

  let state = defaultState();
  try {
    const saved = JSON.parse(sessionStorage.getItem(stateKey) || 'null');
    if (saved && typeof saved === 'object') state = { ...state, ...saved, transitioning: false, chatHistory: [] };
  } catch (_) {}

  const questions = [
    {
      key: 'prep', name: 'Príprava', title: 'Ako kávu pripravuješ?',
      note: 'Vyber najbližší spôsob. Poradca podľa neho upraví praženie aj odporúčanie.',
      options: [
        { value: 'automatic', label: 'Automatický kávovar', description: 'Jedno tlačidlo, espresso aj mliečne nápoje', photo: '/assets/concept/prep-automatic.webp' },
        { value: 'lever', label: 'Pákový kávovar', description: 'Espresso si nastavuješ ručne', photo: '/assets/concept/prep-lever.webp' },
        { value: 'moka', label: 'Moka kanvička', description: 'Výrazná domáca šálka', photo: '/assets/concept/prep-moka.webp' },
        { value: 'filter', label: 'Filter alebo zalievanie', description: 'V60, AeroPress, batch brew či French press', photo: '/assets/concept/prep-filter.webp' }
      ]
    },
    {
      key: 'taste', name: 'Chuť', title: 'Čo chceš cítiť v šálke?',
      note: 'Chuťové tóny opisujú prirodzený charakter kávy, nie pridanú arómu.',
      options: [
        { value: 'chocolate', label: 'Sladké a čokoládové', description: 'Kakao, orechy, nugát a pokojnejšia acidita', photo: '/assets/concept/result-espresso.webp', icon: 'bean' },
        { value: 'balanced', label: 'Vyvážené', description: 'Sladkosť, ovocnosť aj telo bez extrému', photo: '/assets/concept/prep-lever.webp', icon: 'balance' },
        { value: 'fruity', label: 'Ovocné a svieže', description: 'Bobuľové, citrusové alebo kvetinové tóny', photo: '/assets/concept/result-filter.webp', icon: 'fruit' },
        { value: 'strong', label: 'Výrazné a netradičné', description: 'Intenzívny profil, ktorý je hlavnou témou šálky', photo: '/assets/concept/prep-moka.webp', icon: 'bold' }
      ]
    },
    {
      key: 'drink', name: 'Nápoj', title: 'Ako ju piješ najčastejšie?',
      note: 'Mlieko potrebuje kávu s dostatočnou sladkosťou a telom.',
      options: [
        { value: 'black', label: 'Čiernu', description: 'Espresso, lungo alebo filter', icon: 'black' },
        { value: 'milk', label: 'S mliekom', description: 'Cappuccino, flat white alebo latte', icon: 'milk' },
        { value: 'both', label: 'Striedam oboje', description: 'Univerzálna káva na viac nápojov', icon: 'both' }
      ]
    },
    {
      key: 'caffeine', name: 'Kofeín', title: 'Klasickú alebo bez kofeínu?',
      note: 'Bezkofeínová voľba môže zostať plná a výberová.',
      options: [
        { value: 'classic', label: 'Klasickú', description: 'Bežná káva s kofeínom', icon: 'bolt' },
        { value: 'decaf', label: 'Bezkofeínovú', description: 'Na večer alebo pri obmedzení kofeínu', photo: '/assets/concept/result-decaf.webp', icon: 'moon' },
        { value: 'either', label: 'Rozhodni podľa chuti', description: 'Kofeín nie je hlavné kritérium', icon: 'either' }
      ]
    }
  ];

  Object.assign(app, { config, root, $, $$, escapeHTML, icons, mark, brandSeal, productById, stateKey, defaultState, questions });
  app.state = state;
})();
