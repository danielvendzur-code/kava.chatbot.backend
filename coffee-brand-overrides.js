(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos) return;

  Object.assign(demos.jolka, {
    primary: '#263b37',
    accent: '#d8eee5',
    surface: '#f8faf9'
  });

  Object.assign(demos.diamonds, {
    primary: '#171c20',
    accent: '#b7845c',
    surface: '#f5f2ec',
    subbrand: 'Rodinná pražiareň · Dunajská Lužná',
    ownerGreeting: 'Personalizovaný návrh pre Diamonds Roastery',
    headline: 'Jedna správna káva namiesto neistého preklikávania.',
    intro: 'Poradca zrozumiteľne preloží prípravu a chuť do konkrétneho odporúčania z aktuálnej ponuky.',
    shopUrl: 'https://diroastery.sk/kategoria-produktu/kava/',
    contactUrl: 'https://diroastery.sk/kontakt/',
    phone: '+421902900728',
    email: 'shop@diroastery.sk',
    products: [
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
        tags: ['čokoláda', 'orechy', 'sladkosť'],
        reason: 'Je prístupná, sladká a prirodzene funguje v espresse, automate aj s mliekom.',
        url: 'https://diroastery.sk/produkt/brazilia-fazenda-pereira-zrnkova-kava/'
      },
      {
        id: 'yabitu-tume',
        name: 'Etiópia Yabitu Tume',
        origin: 'Etiópia · Guji',
        process: 'mokré spracovanie',
        price: 'od 15,00 €',
        prep: ['filter', 'lever'],
        taste: ['fruity', 'balanced'],
        drink: ['black'],
        caffeine: ['classic', 'either'],
        tags: ['citrusy', 'kôstkové ovocie', 'med'],
        reason: 'Čistá, čajová a elegantná káva pre človeka, ktorý chce vo filtri cítiť pôvod bez divokej fermentácie.',
        url: 'https://diroastery.sk/produkt/etiopia-yabitu-tume-zrnkova-kava/'
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
        url: 'https://diroastery.sk/produkt/kena-mugaya-ab-zrnkova-kava/'
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
        reason: 'Vyvážená a menej ovocná voľba do espressa alebo automatu, ktorá ostáva čistá aj bez mlieka.',
        url: 'https://diroastery.sk/produkt/kolumbia-kumanday-reserve/'
      },
      {
        id: 'el-buho',
        name: 'Kolumbia El Buho Decaf',
        origin: 'Kolumbia · Huila a Tolima',
        process: 'sugar cane decaf · omni roast',
        price: 'od 14,00 €',
        prep: ['automatic', 'lever', 'moka', 'filter'],
        taste: ['chocolate', 'balanced'],
        drink: ['black', 'milk', 'both'],
        caffeine: ['decaf'],
        tags: ['javorový sirup', 'karamel', 'oriešky'],
        reason: 'Plná a všestranná bezkofeínová káva, ktorá funguje na espresso aj filter bez pocitu náhrady.',
        url: 'https://diroastery.sk/produkt/kolumbia-el-buho-decaf-bezkofeinova-kava/'
      }
    ]
  });
})();
