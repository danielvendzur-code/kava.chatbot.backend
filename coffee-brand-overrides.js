(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos) return;

  Object.assign(demos.diamonds, {
    id: 'diamonds',
    brand: 'Diamonds Roastery',
    ownerGreeting: '',
    primary: '#0b0d0c',
    accent: '#b7dc45',
    surface: '#ffffff',
    shopUrl: 'https://diroastery.sk/obchod/',
    categoryUrl: 'https://diroastery.sk/kategoria-produktu/kava/',
    officialLogo: '/assets/diamonds/diroastery-logo.svg',
    officialMark: '/assets/diamonds/diroastery-logo.svg',
    welcome: 'Dobrý deň. Pomôžem vám nájsť kávu Diamonds podľa chuti a spôsobu prípravy.',
    quick: ['Káva do automatu', 'Káva na filter', 'Niečo jemné', 'Bez kofeínu'],
    products: [
      {
        id: 'peru-valley', name: 'Peru Valley Coffee', origin: 'Peru', process: 'spracovaná vodou', price: 'od 10,00 €',
        prep: ['automatic', 'espresso'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['classic'],
        tags: ['hruška', 'čokoláda', 'sušené ovocie', 'mandle'], acidity: 'nízka',
        reason: 'Vyvážená káva s veľmi jemnou kyslosťou. Chutí dobre z automatu, ako espresso aj s mliekom.',
        url: 'https://diroastery.sk/produkt/peru-valley-coffee-zrnkova-kava/',
        image: '/assets/diamonds/peru-valley-official.jpg',
        upsell: 'Pijete ju každý deň? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'brazil-fazenda', name: 'Brazília Fazenda Pereira', origin: 'Brazília', process: '', price: 'od 10,00 €',
        prep: ['automatic', 'espresso', 'moka'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['classic'],
        tags: ['čokoláda', 'oriešky', 'sladkosť'], acidity: 'nízka',
        reason: 'Sladká a príjemná káva pre každého, kto nechce výraznú ovocnosť ani kyslosť.',
        url: 'https://diroastery.sk/produkt/brazilia-fazenda-pereira-zrnkova-kava/',
        image: '/assets/diamonds/brazil-fazenda-official.jpg',
        upsell: 'Pijete ju každý deň? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'kenya-mugaya', name: 'Keňa Mugaya AB', origin: 'Keňa · Kirinyaga', process: 'spracovaná vodou', price: 'od 16,00 €',
        prep: ['filter'], taste: ['fruity'], drink: ['black'], caffeine: ['classic'],
        tags: ['egreše', 'černice', 'jablko'], acidity: 'svieža',
        reason: 'Svieža filtrovaná káva pre človeka, ktorý chce v šálke cítiť černice, egreše a jablko.',
        url: 'https://diroastery.sk/produkt/kena-mugaya-ab-zrnkova-kava/',
        image: '/assets/diamonds/kenya-mugaya-official.jpg',
        upsell: 'Chcete si ju vychutnávať častejšie? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'kumanday', name: 'Kolumbia Kumanday Reserve', origin: 'Kolumbia · Caldas', process: 'spracovaná vodou', price: 'od 11,00 €',
        prep: ['automatic', 'espresso'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['classic'],
        tags: ['karamel', 'kakao', 'sladký citrus'], acidity: 'jemná',
        reason: 'Vyvážená, menej ovocná káva s príjemnou sladkosťou. Hodí sa na espresso aj do automatu.',
        url: 'https://diroastery.sk/produkt/kolumbia-kumanday-reserve/',
        image: '/assets/diamonds/kumanday-official.jpg',
        upsell: 'Pijete ju každý deň? Na produkte nájdete aj 500 g a 1000 g balenie.'
      },
      {
        id: 'el-buho', name: 'Kolumbia El Buho bez kofeínu', origin: 'Kolumbia · Huila a Tolima', process: 'bez kofeínu', price: 'od 14,00 €',
        prep: ['espresso', 'filter', 'moka'], taste: ['chocolate', 'balanced'], drink: ['black', 'milk', 'both'], caffeine: ['decaf'],
        tags: ['javorový sirup', 'karamel', 'oriešky'], acidity: 'jemná',
        reason: 'Plná bezkofeínová káva na espresso aj filter, vhodná aj na večernú šálku.',
        url: 'https://diroastery.sk/produkt/kolumbia-el-buho-decaf-bezkofeinova-kava/',
        image: '/assets/diamonds/el-buho-official.jpg',
        upsell: 'Chcete ju mať poruke aj na večer? Na produkte nájdete aj 500 g a 1000 g balenie.'
      }
    ]
  });
})();
