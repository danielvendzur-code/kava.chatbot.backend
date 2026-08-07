(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos) return;

  if (demos.jolka) {
    Object.assign(demos.jolka, {
      primary: '#263b37',
      accent: '#d8eee5',
      surface: '#f8faf9'
    });
  }

  if (!demos.vitazov) return;

  const vitazov = demos.vitazov;
  Object.assign(vitazov, {
    ownerGreeting: '',
    headline: 'Vitajte vo vašom návrhu AI poradcu pre Kávu Víťazov.',
    intro: 'Ukážka, ako môže poradca pomôcť zákazníkom vybrať kávu domov, do automatu aj kancelárie a skončiť pri konkrétnom produkte.',
    welcome: 'Dobrý deň. Pomôžem vám vybrať kávu domov, do kancelárie aj do automatu. Môžete sa opýtať priamo alebo prejsť cez krátky výber.',
    quick: ['Káva do kancelárie', 'Niečo jemné bez kyslosti', 'Káva do mlieka', 'Bezkofeínová'],
    benefits: [
      ['Menej váhania.', ''],
      ['Konkrétna káva.', ''],
      ['Domov aj firma.', '']
    ],
    questions: [
      {
        key: 'use', name: 'Použitie', title: 'Čo dnes vyberáte?',
        options: [
          ['home', 'Domov', 'Káva na bežné každodenné pitie', 'home'],
          ['office', 'Kancelária', 'Stabilná voľba pre viac ľudí', 'office'],
          ['automatic', 'Do automatu', 'Spoľahlivé zrná bez laborovania', 'automatic'],
          ['discovery', 'Filter / objavovanie', 'Výraznejší pôvod a zaujímavejšia chuť', 'discovery']
        ]
      },
      {
        key: 'profile', name: 'Chuť', title: 'Aký chuťový smer chcete?',
        options: [
          ['classic', 'Čokoláda a orechy', 'Klasickejší, pokojný profil', 'smooth'],
          ['balanced', 'Jemná a vyvážená', '100 % arabika bez extrémov', 'both'],
          ['fruity', 'Ovocná a objavná', 'Výberová káva s výraznejším pôvodom', 'fruity']
        ]
      },
      {
        key: 'drink', name: 'Nápoj', title: 'Ako ju pijete najčastejšie?',
        options: [
          ['black', 'Čiernu', 'Espresso, lungo alebo filter', 'black'],
          ['milk', 'S mliekom', 'Cappuccino, flat white alebo latte', 'milk'],
          ['both', 'Striedam oboje', 'Potrebujete univerzálnu voľbu', 'both']
        ]
      },
      {
        key: 'taste', name: 'Sila', title: 'Akú intenzitu a kofeín chcete?',
        options: [
          ['balanced', 'Jemnejšiu', 'Hladká a ľahšie pitná', 'smooth'],
          ['strong', 'Výraznú', 'Plnšie telo a silnejšia chuť', 'strong'],
          ['caffeine', 'Viac kofeínu', 'Praktická voľba na pracovný deň', 'strong'],
          ['decaf', 'Bez kofeínu', 'Na večer alebo bez povzbudenia', 'decaf']
        ]
      }
    ]
  });

  const products = Object.fromEntries(vitazov.products.map((product) => [product.id, product]));
  Object.assign(products.office || {}, { profile: ['classic'], taste: ['strong', 'caffeine'] });
  Object.assign(products.victory || {}, { profile: ['balanced'], taste: ['balanced', 'strong'] });
  Object.assign(products.brazil || {}, { profile: ['classic'], taste: ['balanced'] });
  Object.assign(products.ethiopia || {}, { profile: ['fruity'], taste: ['balanced'] });
  Object.assign(products.decaf || {}, { profile: ['classic'], taste: ['decaf'] });
})();
