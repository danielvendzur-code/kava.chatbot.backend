(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos) return;

  Object.assign(demos.diamonds, {
    id: 'diamonds',
    brand: 'Diamonds Roastery',
    ownerGreeting: 'Vitajte vo vašom návrhu AI poradcu pre Diamonds Roastery.',
    primary: '#0d0f0e',
    accent: '#9bdc45',
    surface: '#f7f4ee',
    shopUrl: 'https://diroastery.sk/obchod/',
    categoryUrl: 'https://diroastery.sk/kategoria-produktu/kava/',
    mojChatbotUrl: 'https://mojchatbot.sk/',
    officialLogo: 'https://diroastery.sk/wp-content/uploads/2024/12/diroastery_logo_horizontal-1.svg',
    officialMark: 'https://diroastery.sk/wp-content/uploads/2020/10/logo-DR-5-1-50x45.png',
    welcome: 'Dobrý deň. Môžete sa opýtať na chuť, prípravu alebo konkrétnu kávu. Ak chcete odporúčanie, prejdite cez krátky 4-krokový výber.',
    quick: ['Káva do automatu', 'Niečo na filter', 'Menej ovocná káva', 'Chcem objavovať'],
    products: [
      {
        id: 'peru-valley', name: 'Peru Valley Coffee', origin: 'Peru', process: 'mokré spracovanie', price: 'od 10,00 €',
        prep: ['automatic', 'lever'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], direction: ['classic'],
        tags: ['hruška', 'čokoláda', 'mandle'],
        reason: 'Vyvážená voľba s nižšou aciditou, ktorá funguje v automate, espresse aj s mliekom.',
        url: 'https://diroastery.sk/produkt/peru-valley-coffee-zrnkova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/01/peru-valley-espresso.jpg'
      },
      {
        id: 'brazil-fazenda', name: 'Brazília Fazenda Pereira', origin: 'Brazília', process: '', price: 'od 10,00 €',
        prep: ['automatic', 'lever', 'moka'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], direction: ['classic'],
        tags: ['čokoláda', 'oriešky', 'sladkosť'],
        reason: 'Sladká a prístupná káva pre zákazníka, ktorý nechce výraznú ovocnosť ani aciditu.',
        url: 'https://diroastery.sk/produkt/brazilia-fazenda-pereira-zrnkova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/07/brazil-fazenda-pereira-mockup-600x600.jpg'
      },
      {
        id: 'kenya-mugaya', name: 'Keňa Mugaya AB', origin: 'Keňa · Kirinyaga', process: 'mokré spracovanie', price: 'od 16,00 €',
        prep: ['filter'], taste: ['fruity'], drink: ['black'], direction: ['explore'],
        tags: ['egreše', 'černice', 'jablko'],
        reason: 'Čistá a šťavnatá filtrovaná káva pre človeka, ktorý chce v šálke objavovať výraznejší pôvod.',
        url: 'https://diroastery.sk/produkt/kena-mugaya-ab-zrnkova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/06/Kenya-Mugaya-ab-mockup-600x600.jpg'
      },
      {
        id: 'kumanday', name: 'Kolumbia Kumanday Reserve', origin: 'Kolumbia · Caldas', process: 'mokré spracovanie', price: 'od 11,00 €',
        prep: ['automatic', 'lever'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], direction: ['classic', 'explore'],
        tags: ['karamel', 'kakao', 'sladký citrus'],
        reason: 'Vyvážená, menej ovocná káva s čistou sladkosťou; prirodzene sedí do espressa aj automatu.',
        url: 'https://diroastery.sk/produkt/kolumbia-kumanday-reserve/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/06/kolumbia-kumanday-espresso-mockup-600x600.jpg'
      },
      {
        id: 'el-buho', name: 'Kolumbia El Buho Decaf', origin: 'Kolumbia · Huila a Tolima', process: 'sugar cane decaf · omni', price: 'od 14,00 €',
        prep: ['automatic', 'lever', 'moka', 'filter'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], direction: ['decaf'],
        tags: ['javorový sirup', 'karamel', 'oriešky'],
        reason: 'Plná a všestranná bezkofeínová káva, ktorá funguje na espresso aj filter bez pocitu náhrady.',
        url: 'https://diroastery.sk/produkt/kolumbia-el-buho-decaf-bezkofeinova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/05/Colombia-el-buho-decaf-omni-600x600.jpg'
      }
    ]
  });
})();
