(() => {
  const demos = window.COFFEE_DEMOS;
  if (!demos?.vitazov) return;

  const vitazov = demos.vitazov;
  Object.assign(vitazov, {
    ownerGreeting: '',
    headline: 'Káva, ktorú si zákazník vyberie s istotou.',
    intro: 'Poradca odpovie 24/7, zistí, kde a ako zákazník pije kávu, a odporučí konkrétny produkt.',
    welcome: 'Dobrý deň. Pomôžem vám vybrať kávu domov, do kancelárie aj do automatu. Napíšte mi, čo máte radi.',
    quick: ['Káva do kancelárie', 'Niečo jemné', 'Káva do mlieka', 'Bez kofeínu'],
    benefits: [
      ['Jednoduchý výber', 'Pár otázok a zákazník vie, po ktorej káve siahnuť.'],
      ['Pomoc 24/7', 'Odpoveď dostane aj vtedy, keď práve nie ste online.'],
      ['Domov aj do firmy', 'Poradca rozlíši domácnosť, automat aj kanceláriu.']
    ],
    questions: [
      {
        key: 'use', name: 'Použitie', title: 'Čo dnes vyberáte?',
        options: [
          ['home', 'Domov', 'Káva na bežné každodenné pitie', 'home'],
          ['office', 'Kancelária', 'Stabilná voľba pre viac ľudí', 'office'],
          ['automatic', 'Do automatu', 'Spoľahlivá káva bez skúšania naslepo', 'automatic'],
          ['discovery', 'Chcem skúsiť niečo nové', 'Ovocnejšia a zaujímavejšia chuť', 'discovery']
        ]
      },
      {
        key: 'profile', name: 'Chuť', title: 'Aký chuťový smer chcete?',
        options: [
          ['classic', 'Čokoláda a orechy', 'Známa a príjemná chuť', 'smooth'],
          ['balanced', 'Jemná a vyvážená', 'Pokojná káva na každý deň', 'both'],
          ['fruity', 'Ovocná a svieža', 'Ľahšia chuť s ovocnými tónmi', 'fruity']
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
