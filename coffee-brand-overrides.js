(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos) return;

  Object.assign(demos.diamonds, {
    id: 'diamonds',
    brand: 'Diamonds Roastery',
    ownerGreeting: 'Vitajte vo vašom návrhu AI poradcu pre Diamonds Roastery.',
    primary: '#0b0d0c',
    accent: '#b7dc45',
    surface: '#ffffff',
    shopUrl: 'https://diroastery.sk/obchod/',
    categoryUrl: 'https://diroastery.sk/kategoria-produktu/kava/',
    mojChatbotUrl: 'https://mojchatbot.sk/',
    officialLogo: '/assets/diamonds/diroastery-logo.svg',
    officialMark: '/assets/diamonds/diroastery-logo.svg',
    welcome: 'Dobrý deň. Pomôžem vám vybrať kávu Diamonds podľa prípravy, chuti a toho, či ju chcete piť aj večer.',
    quick: ['Káva do automatu', 'Niečo na filter', 'Menej ovocná', 'Bez kofeínu'],
    products: [
      {
        id: 'peru-valley', name: 'Peru Valley Coffee', origin: 'Peru', process: 'mokré spracovanie', price: 'od 10,00 €',
        prep: ['automatic', 'espresso'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['classic'],
        tags: ['hruška', 'čokoláda', 'sušené ovocie', 'mandle'], acidity: 'nízka',
        reason: 'Vyvážená každodenná voľba s minimálnou aciditou; funguje v automate, espresse aj s mliekom.',
        url: 'https://diroastery.sk/produkt/peru-valley-coffee-zrnkova-kava/',
        image: '/assets/diamonds/peru-valley-official.jpg',
        upsell: 'Pijete ju každý deň? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'brazil-fazenda', name: 'Brazília Fazenda Pereira', origin: 'Brazília', process: '', price: 'od 10,00 €',
        prep: ['automatic', 'espresso', 'moka'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['classic'],
        tags: ['čokoláda', 'oriešky', 'sladkosť'], acidity: 'nízka',
        reason: 'Sladká a prístupná káva pre zákazníka, ktorý nechce výraznú ovocnosť ani aciditu.',
        url: 'https://diroastery.sk/produkt/brazilia-fazenda-pereira-zrnkova-kava/',
        image: '/assets/diamonds/brazil-fazenda-official.jpg',
        upsell: 'Pijete ju každý deň? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'kenya-mugaya', name: 'Keňa Mugaya AB', origin: 'Keňa · Kirinyaga', process: 'mokré spracovanie', price: 'od 16,00 €',
        prep: ['filter'], taste: ['fruity'], drink: ['black'], caffeine: ['classic'],
        tags: ['egreše', 'černice', 'jablko'], acidity: 'svieža',
        reason: 'Čistá a šťavnatá filtrovaná káva pre človeka, ktorý chce v šálke objavovať výraznejší pôvod.',
        url: 'https://diroastery.sk/produkt/kena-mugaya-ab-zrnkova-kava/',
        image: '/assets/diamonds/kenya-mugaya-official.jpg',
        upsell: 'Chcete si ju vychutnávať častejšie? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'kumanday', name: 'Kolumbia Kumanday Reserve', origin: 'Kolumbia · Caldas', process: 'mokré spracovanie', price: 'od 11,00 €',
        prep: ['automatic', 'espresso'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['classic'],
        tags: ['karamel', 'kakao', 'sladký citrus'], acidity: 'jemná',
        reason: 'Vyvážená, menej ovocná káva s čistou sladkosťou; prirodzene sedí do espressa aj automatu.',
        url: 'https://diroastery.sk/produkt/kolumbia-kumanday-reserve/',
        image: '/assets/diamonds/kumanday-official.jpg',
        upsell: 'Pijete ju každý deň? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'el-buho', name: 'Kolumbia El Buho Decaf', origin: 'Kolumbia · Huila a Tolima', process: 'sugar cane decaf · omni', price: 'od 14,00 €',
        prep: ['espresso', 'filter', 'moka'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['decaf'],
        tags: ['javorový sirup', 'karamel', 'oriešky'], acidity: 'jemná',
        reason: 'Plná a všestranná bezkofeínová káva, ktorá funguje na espresso aj filter bez pocitu náhrady.',
        url: 'https://diroastery.sk/produkt/kolumbia-el-buho-decaf-bezkofeinova-kava/',
        image: '/assets/diamonds/el-buho-official.jpg',
        upsell: 'Chcete ju mať poruke aj na večer? Na produkte nájdete aj 500 g a 1000 g balenie.'
      }
    ]
  });
})();
