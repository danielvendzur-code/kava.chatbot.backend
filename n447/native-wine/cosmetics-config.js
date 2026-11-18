(() => {
  'use strict';

  /* Wine advisor. The engine and its answer keys come from the skincare demos
     (skin, goal, routine, texture); here they mean colour, style, how many
     bottles and what the wine goes with. Every answer has its own photograph
     (Pexels licence, see ZDROJE.md). */
  const photo = (value) => `/assets/vino/choice-${value}.jpg`;

  const semanticPhotos = Object.fromEntries([
    'white','red','rose','sparkling',
    'crisp','fruity','bold','sweet',
    'simple','basic','full','target',
    'fish','meat','cheese','any'
  ].map((value) => [value, photo(value)]));

  const questions = [
    { key:'skin', kicker:'Farba', title:'Aké víno máte najradšej?', options:[
      {value:'white',title:'Biele',text:'Svieže, ovocné aj plnšie biele',image:semanticPhotos.white},
      {value:'red',title:'Červené',text:'Od ľahkých po plné a zamatové',image:semanticPhotos.red},
      {value:'rose',title:'Ružové',text:'Ľahké, ovocné a na leto',image:semanticPhotos.rose},
      {value:'sparkling',title:'Šumivé',text:'Sekt, pét-nat, niečo na oslavu',image:semanticPhotos.sparkling}
    ]},
    { key:'goal', kicker:'Chuť', title:'Aký štýl vám chutí?', options:[
      {value:'crisp',title:'Suché a svieže',text:'Kyselinka, citrusy, ľahkosť',image:semanticPhotos.crisp},
      {value:'fruity',title:'Ovocné a jemné',text:'Zrelé ovocie, prípadne jemný cukor',image:semanticPhotos.fruity},
      {value:'bold',title:'Plné a výrazné',text:'Telo, drevo, dlhá dochuť',image:semanticPhotos.bold},
      {value:'sweet',title:'Sladšie',text:'Polosladké, sladké, dezertné',image:semanticPhotos.sweet}
    ]},
    { key:'routine', kicker:'Výber', title:'Koľko vín hľadáte?', options:[
      {value:'simple',title:'Jednu fľašu',text:'Jedno víno presne na mieru',image:semanticPhotos.simple},
      {value:'basic',title:'Trio na ochutnanie',text:'Tri vína, ktoré sa dopĺňajú',image:semanticPhotos.basic},
      {value:'full',title:'Výber do kartónu',text:'Štyri vína pre partiu alebo domov',image:semanticPhotos.full},
      {value:'target',title:'Na darček',text:'Jedna fľaša, ktorá poteší',image:semanticPhotos.target}
    ]},
    { key:'texture', kicker:'K čomu', title:'K čomu bude víno?', options:[
      {value:'fish',title:'Ryba, hydina, šaláty',text:'Ľahšie jedlá a letná kuchyňa',image:semanticPhotos.fish},
      {value:'meat',title:'Mäso a gril',text:'Steak, divina, výdatné jedlá',image:semanticPhotos.meat},
      {value:'cheese',title:'Syry a dezerty',text:'Syrová misa, koláče, ovocie',image:semanticPhotos.cheese},
      {value:'any',title:'Len tak, na posedenie',text:'Bez jedla, s priateľmi',image:semanticPhotos.any}
    ]}
  ];

  const brands = {};

  window.COSMETICS_DEMOS = { brands, questions, semanticPhotos };
})();
