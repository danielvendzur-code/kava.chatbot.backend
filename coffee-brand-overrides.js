(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos) return;

  Object.assign(demos.diamonds, {
    id: 'diamonds',
    brand: 'Diamonds Roastery',
    ownerGreeting: 'Vitajte vo vašom návrhu chatbotu pre Diamonds Roastery.',
    primary: '#0b0d0c',
    accent: '#84c64b',
    surface: '#ffffff',
    shopUrl: 'https://diroastery.sk/obchod/',
    categoryUrl: 'https://diroastery.sk/kategoria-produktu/kava/',
    mojChatbotUrl: 'https://mojchatbot.sk/',
    officialLogo: 'https://diroastery.sk/wp-content/uploads/2024/12/diroastery_logo_horizontal-1.svg',
    officialMark: 'https://diroastery.sk/wp-content/uploads/2020/10/logo-DR-5-1-50x45.png',
    welcome: 'Dobrý deň. Odpoviem na otázky o káve alebo vám cez štyri krátke kroky pomôžem vybrať konkrétny produkt.',
    quick: ['Káva do automatu', 'Niečo na filter', 'Nechcem výraznú aciditu', 'Bezkofeínová káva'],
    products: [
      {
        id: 'peru-valley',
        name: 'Peru Valley Coffee',
        origin: 'Peru',
        process: 'mokré spracovanie',
        price: 'od 10,00 €',
        prep: ['automatic', 'lever'],
        taste: ['chocolate', 'balanced'],
        drink: ['black', 'milk', 'both'],
        caffeine: ['classic', 'either'],
        tags: ['hruška', 'čokoláda', 'mandle'],
        reason: 'Je vyvážená, má nižšiu aciditu a prirodzene funguje v automate, espresse aj s mliekom.',
        url: 'https://diroastery.sk/produkt/peru-valley-coffee-zrnkova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/01/peru-valley-espresso.jpg',
        short: 'PERU VALLEY'
      },
      {
        id: 'brazil-fazenda',
        name: 'Brazília Fazenda Pereira',
        origin: 'Brazília',
        process: '',
        price: 'od 10,00 €',
        prep: ['automatic', 'lever', 'moka'],
        taste: ['chocolate', 'balanced'],
        drink: ['black', 'milk', 'both'],
        caffeine: ['classic', 'either'],
        tags: ['čokoláda', 'oriešky', 'sladkosť'],
        reason: 'Je prístupná, sladká a vhodná pre zákazníka, ktorý nechce výraznú ovocnosť ani aciditu.',
        url: 'https://diroastery.sk/produkt/brazilia-fazenda-pereira-zrnkova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/07/brazil-fazenda-pereira-mockup-600x600.jpg',
        short: 'FAZENDA'
      },
      {
        id: 'kenya-mugaya',
        name: 'Keňa Mugaya AB',
        origin: 'Keňa · Kirinyaga',
        process: 'mokré spracovanie',
        price: 'od 16,00 €',
        prep: ['filter'],
        taste: ['fruity'],
        drink: ['black'],
        caffeine: ['classic', 'either'],
        tags: ['egreše', 'černice', 'jablko'],
        reason: 'Najlepšie sedí človeku, ktorý chce výraznú, šťavnatú a pritom čistú filtrovanú kávu.',
        url: 'https://diroastery.sk/produkt/kena-mugaya-ab-zrnkova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/06/Kenya-Mugaya-ab-mockup-600x600.jpg',
        short: 'MUGAYA AB'
      },
      {
        id: 'kumanday',
        name: 'Kolumbia Kumanday Reserve',
        origin: 'Kolumbia · Caldas',
        process: 'mokré spracovanie',
        price: 'od 11,00 €',
        prep: ['automatic', 'lever'],
        taste: ['chocolate', 'balanced'],
        drink: ['black', 'milk', 'both'],
        caffeine: ['classic', 'either'],
        tags: ['karamel', 'kakao', 'sladký citrus'],
        reason: 'Vyvážená a menej ovocná voľba do espressa alebo automatu, ktorá zostáva čistá aj bez mlieka.',
        url: 'https://diroastery.sk/produkt/kolumbia-kumanday-reserve/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/06/kolumbia-kumanday-espresso-mockup-600x600.jpg',
        short: 'KUMANDAY'
      },
      {
        id: 'el-buho',
        name: 'Kolumbia El Buho Decaf',
        origin: 'Kolumbia · Huila a Tolima',
        process: 'sugar cane decaf · omni',
        price: 'od 14,00 €',
        prep: ['automatic', 'lever', 'moka', 'filter'],
        taste: ['chocolate', 'balanced'],
        drink: ['black', 'milk', 'both'],
        caffeine: ['decaf'],
        tags: ['javorový sirup', 'karamel', 'oriešky'],
        reason: 'Plná a všestranná bezkofeínová káva, ktorá funguje na espresso aj filter bez pocitu náhrady.',
        url: 'https://diroastery.sk/produkt/kolumbia-el-buho-decaf-bezkofeinova-kava/',
        image: 'https://diroastery.sk/wp-content/uploads/2026/05/Colombia-el-buho-decaf-omni-600x600.jpg',
        short: 'EL BUHO'
      }
    ]
  });
})();
