window.COFFEE_DEMOS = {
  praziarnicka: {
    id: 'praziarnicka', brand: 'Pražiarnička', subbrand: 'by Caffè Vita', ownerGreeting: 'Dobrý deň, tím Pražiarničky.',
    headline: 'Pomôžte zákazníkovi nájsť kávu, ktorá mu naozaj sadne.',
    intro: 'Poradca odpovie na otázky, vysvetlí rozdiely a cez krátky chuťový kvíz odporučí konkrétnu kávu, balenie aj mletie.',
    primary: '#123f35', accent: '#bdebd5', surface: '#f7faf8', shopUrl: 'https://praziarnicka.sk/eshop', contactUrl: 'https://praziarnicka.sk/kontakt', phone: '+421917502991',
    welcome: 'Dobrý deň. Pomôžem vám vybrať kávu z ponuky Pražiarničky podľa chuti aj spôsobu prípravy.',
    quick: ['Káva do automatu', 'Nechcem kyslú kávu', 'Káva na cappuccino', 'Bezkofeínová'],
    products: [
      { id:'paganini', name:'Paganini blend', origin:'75 % Arabica · 25 % Robusta', price:'od 11,90 €', prep:['automatic','lever','moka'], taste:['balanced','strong'], drink:['milk','black','both'], caffeine:['classic','either'], tags:['čokoláda','mandle','krémová'], reason:'Vyvážená zmes s plným telom, ktorá funguje ako espresso aj v mliečnych nápojoch.' },
      { id:'brazil', name:'Brazil Santos', origin:'100 % Arabica', price:'od 9,90 €', prep:['automatic','lever','moka','filter'], taste:['chocolate','balanced'], drink:['black','both'], caffeine:['classic','either'], tags:['kakao','sladká','nízka acidita'], reason:'Jemná arabica s čokoládovým profilom a nízkou aciditou. Bezpečná voľba na každý deň.' },
      { id:'puccini', name:'Puccini blend', origin:'60 % Arabica · 40 % Robusta', price:'od 11,50 €', prep:['automatic','lever','moka'], taste:['strong','balanced'], drink:['milk','both'], caffeine:['classic','either'], tags:['tmavá čokoláda','silná','kréma'], reason:'Výraznejšia zmes, ktorá sa nestratí v cappuccine ani latte.' },
      { id:'cuba', name:'Cuba Serrano Lavado', origin:'100 % Arabica', price:'od 12,90 €', prep:['lever','moka','filter'], taste:['chocolate','balanced'], drink:['black'], caffeine:['classic','either'], tags:['kakao','orechy','nízka acidita'], reason:'Plná a sladká arabica s kakaovým telom a veľmi nízkou aciditou.' },
      { id:'decaf', name:'Bezkofeínová Brazil', origin:'100 % Arabica · bez kofeínu', price:'od 12,90 €', prep:['automatic','lever','moka','filter'], taste:['chocolate','balanced'], drink:['black','milk','both'], caffeine:['decaf'], tags:['bez kofeínu','jemná','večer'], reason:'Plnohodnotná káva bez povzbudivého účinku, vhodná aj na večernú šálku.' }
    ]
  },
  diamonds: {
    id: 'diamonds', brand: 'Diamonds Roastery', subbrand: 'Dunajská Lužná', ownerGreeting: 'Dobrý deň, tím Diamonds Roastery.',
    headline: 'Premeňte široký výber káv na jednoduché osobné odporúčanie.', intro: 'Poradca pomôže zákazníkovi zorientovať sa v pôvode, spracovaní a chuťovom profile a privedie ho ku konkrétnej káve.',
    primary: '#152f38', accent: '#c8ecdf', surface: '#f6faf9', shopUrl: 'https://diroastery.sk/kategoria-produktu/kava/', contactUrl: 'https://diroastery.sk/kontakt/', phone: '+421902900728',
    welcome: 'Dobrý deň. Vyberieme spolu kávu z aktuálnej ponuky Diamonds Roastery podľa vašej prípravy a chutí.', quick: ['Káva na filter', 'Sladká bez acidity', 'Niečo ovocné', 'Decaf'],
    products: [
      { id:'brazil-fazenda', name:'Brazília Fazenda Pereira', origin:'Brazília', price:'od 10,00 €', prep:['automatic','lever','moka'], taste:['chocolate','balanced'], drink:['black','milk','both'], caffeine:['classic','either'], tags:['sladká','čokoládová','klasická'], reason:'Prístupná sladká káva pre zákazníkov, ktorí chcú istotu a minimum výraznej acidity.' },
      { id:'kongo-kisunga', name:'Kongo Kisunga', origin:'Kongo', price:'od 15,00 €', prep:['filter','lever'], taste:['fruity','balanced'], drink:['black'], caffeine:['classic','either'], tags:['ovocná','sladká','filter'], reason:'Zaujímavejší profil pre zákazníka, ktorý chce v šálke objavovať pôvod a ovocné tóny.' },
      { id:'kenya-mugaya', name:'Keňa Mugaya AB', origin:'Keňa', price:'od 16,00 €', prep:['filter'], taste:['fruity'], drink:['black'], caffeine:['classic','either'], tags:['svieža','ovocná','výrazná'], reason:'Výrazná výberová káva pre milovníkov sviežich filtrov a komplexných chutí.' },
      { id:'kumanday', name:'Kolumbia Kumanday Reserve', origin:'Kolumbia', price:'od 11,00 €', prep:['filter','lever','moka'], taste:['balanced','chocolate'], drink:['black','both'], caffeine:['classic','either'], tags:['jemná','sladká','citrus'], reason:'Vyvážená kolumbijská káva so sladkým základom a jemnou citrusovou dochuťou.' },
      { id:'el-buho', name:'Kolumbia El Buho Decaf', origin:'Kolumbia · bez kofeínu', price:'od 14,00 €', prep:['automatic','lever','moka','filter'], taste:['balanced','chocolate'], drink:['black','milk','both'], caffeine:['decaf'], tags:['decaf','sladká','večer'], reason:'Bezkofeínová voľba, ktorá nepôsobí ako náhrada a zostáva chuťovo plná.' }
    ]
  },
  kaffa: {
    id: 'kaffa', brand: 'Kaffa Roastery', subbrand: 'specialty coffee', ownerGreeting: 'Dobrý deň, tím Kaffa Roastery.',
    headline: 'Dajte výrazným kávam poradcu, ktorý ich vysvetlí bez odbornej bariéry.', intro: 'Zákazník si vyberie podľa bežných chutí a prípravy. Poradca preloží komplexné profily do zrozumiteľného odporúčania.',
    primary: '#182d2a', accent: '#c9f0df', surface: '#f7faf8', shopUrl: 'https://kaffaroastery.sk/', contactUrl: 'https://kaffaroastery.sk/kontakt/', phone: '+421907627466',
    welcome: 'Dobrý deň. Pomôžem vám nájsť kávu Kaffa podľa prípravy, intenzity a chuťového smeru.', quick: ['Espresso blend', 'Výrazný filter', 'Ovocná káva', 'Bezkofeínová'],
    products: [
      { id:'mokka', name:'Mokka Espresso Blend', origin:'80 % Arabica · 20 % Robusta', price:'pozrieť cenu', prep:['automatic','lever','moka'], taste:['strong','balanced'], drink:['milk','black','both'], caffeine:['classic','either'], tags:['espresso','kréma','plné telo'], reason:'Stabilný espresso blend vhodný do automatu aj pákového kávovaru a do mliečnych nápojov.' },
      { id:'quebraditas', name:'Colombia Quebraditas Peach', origin:'Kolumbia', price:'16,42 €', prep:['filter','lever'], taste:['fruity'], drink:['black'], caffeine:['classic','either'], tags:['broskyňa','ovocná','výberová'], reason:'Moderný ovocný profil pre zákazníka, ktorý chce neobyčajnú a aromatickú šálku.' },
      { id:'kabingara', name:'Kenya Kabingara Estate', origin:'Keňa', price:'13,69 €', prep:['filter'], taste:['fruity','balanced'], drink:['black'], caffeine:['classic','either'], tags:['svieža','ovocná','filter'], reason:'Svieža kenská káva, ktorá najlepšie ukáže charakter pri filtrovanej príprave.' },
      { id:'sonora', name:'Costa Rica Hacienda Sonora', origin:'Kostarika', price:'13,69 €', prep:['filter','lever','moka'], taste:['balanced','fruity'], drink:['black','both'], caffeine:['classic','either'], tags:['sladká','vyvážená','aromatická'], reason:'Vyvážená voľba medzi klasickým sladkým a modernejším ovocným profilom.' },
      { id:'diviso-decaf', name:'Colombia Finca El Diviso Decaf', origin:'Kolumbia · bez kofeínu', price:'pozrieť cenu', prep:['automatic','lever','moka','filter'], taste:['balanced','fruity'], drink:['black','milk','both'], caffeine:['decaf'], tags:['decaf','Kolumbia','aromatická'], reason:'Bezkofeínová káva pre zákazníka, ktorý nechce prísť o komplexnejšiu chuť.' }
    ]
  },
  vitazov: {
    id: 'vitazov', brand: 'Káva Víťazov', subbrand: 'Slovenská pražiareň · Prešov', ownerGreeting: 'Dobrý deň, tím Kávy Víťazov.',
    headline: 'Zákazník si vyberie správnu kávu bez preklikávania celého obchodu.',
    intro: 'Štyri praktické voľby rozlíšia kanceláriu, automat, klasickú arabiku, výberovú kávu aj bezkofeínovú voľbu.',
    primary: '#173f35', accent: '#b8df75', surface: '#f5f7f1', ink: '#1f2522',
    shopUrl: 'https://kavavitazov.sk/obchod/', contactUrl: 'https://kavavitazov.sk/kontakt/', businessUrl: 'https://kavavitazov.sk/kontakt/', email: 'kontakt@kavavitazov.sk', phone: '',
    welcome: 'Dobrý deň. Vyberieme kávu podľa toho, kde ju pijete, čo od nej čakáte a ako ju pripravujete.',
    quick: ['Káva do kancelárie', 'Silná bez kyslosti', 'Jemná 100 % arabika', 'Bezkofeínová na večer'],
    benefits: [
      ['Praktický výber', 'Rozlíši domácnosť, kanceláriu, automat a filter.'],
      ['Konkrétny produkt', 'Ukáže dôvod, prípravu aj priamy odkaz.'],
      ['Bez slepých údajov', 'Používa iba overenú ponuku a kontakty.']
    ],
    previewProductId: 'office',
    questions: [
      { key:'use', name:'Použitie', title:'Čo dnes vyberáte?', options:[
        ['home','Domov','Spoľahlivá káva na každý deň','home'],
        ['office','Do kancelárie','Stabilná chuť pre viac ľudí','office'],
        ['automatic','Do automatu','Zrná, ktoré fungujú bez laborovania','automatic'],
        ['discovery','Filter a objavovanie','Výraznejší pôvod a ovocnejšia chuť','discovery']
      ]},
      { key:'taste', name:'Chuť', title:'Ktorý smer je vám najbližší?', options:[
        ['strong','Silná, bez výraznej kyslosti','Plné telo, čokoláda a orechy','strong'],
        ['smooth','Jemnejšia 100 % arabika','Vyvážená a hladká každodenná káva','smooth'],
        ['fruity','Ovocnejšia výberová','Svieža aróma a výraznejší pôvod','fruity'],
        ['decaf','Bezkofeínová','Plná chuť aj bez povzbudenia','decaf']
      ]},
      { key:'prep', name:'Príprava', title:'V čom ju pripravujete?', options:[
        ['automatic','Automatický kávovar','Jednoduchá a stabilná extrakcia','automatic'],
        ['lever','Pákový kávovar','Espresso pripravujete ručne','lever'],
        ['moka','Moka alebo zalievanie','Výrazná domáca príprava','moka'],
        ['filter','Filter','V60, French press alebo prekvapkávanie','filter']
      ]},
      { key:'drink', name:'Nápoj', title:'Ako ju pijete najčastejšie?', options:[
        ['black','Čiernu','Espresso, lungo alebo filter','black'],
        ['milk','S mliekom','Cappuccino, flat white alebo latte','milk'],
        ['both','Striedam oboje','Potrebujete univerzálnu voľbu','both']
      ]}
    ],
    products: [
      { id:'office', name:'Office Blend', origin:'50 % Arabica · 50 % Robusta', price:'od 15,90 €', url:'https://kavavitazov.sk/espresso-blend/', use:['office','automatic','home'], taste:['strong'], prep:['automatic','lever','moka'], drink:['milk','black','both'], tags:['čokoláda','karamel','bez výraznej kyslosti'], bestFor:'Kancelárie, automaty a ľudí, ktorí chcú výraznú kávu s vyšším obsahom kofeínu.', machines:'Automatický alebo pákový kávovar, moka.', profile:'Plné telo, výrazná kréma, čokoláda, karamel a pražené orechy.', reason:'Je navrhnutý ako stabilný, menej kyslý blend, ktorý zostane čitateľný aj v mlieku a zvládne každodennú kancelársku prevádzku.', alternativeId:'victory' },
      { id:'victory', name:'Victory Blend', origin:'100 % Arabica · blend troch arabík', price:'od 17,90 €', url:'https://kavavitazov.sk/blend-arabica/', use:['home','office','automatic'], taste:['smooth','strong'], prep:['automatic','lever','moka','filter'], drink:['black','both','milk'], tags:['kakao','korenie','hladká arabika'], bestFor:'Domácnosti a firmy, ktoré chcú univerzálnu 100 % arabiku bez prehnanej horkosti alebo kyslosti.', machines:'Pákový a automatický kávovar; pri strednom pražení aj filter.', profile:'Stredne silné telo, kakao, korenie a jemný kvetinový záver.', reason:'Vlajkový blend spája tri arabiky do vyváženej, aromatickej kávy, ktorá je zrozumiteľná aj pre širší tím.', alternativeId:'brazil' },
      { id:'brazil', name:'Brazília', origin:'100 % Arabica · single origin', price:'od 16,90 €', url:'https://kavavitazov.sk/kava-brazilia/', use:['home','automatic','office'], taste:['smooth','strong'], prep:['automatic','lever','moka','filter'], drink:['black','both','milk'], tags:['lieskové orechy','jemná','mierna kyslosť'], bestFor:'Ľudí, ktorí chcú jemnú single-origin arabiku s neutrálnym telom a pokojnou aciditou.', machines:'Espresso alebo moka pri full city pražení; alternatívne metódy pri svetlom pražení.', profile:'Príjemná aróma, mierna kyslosť, neutrálne telo, lieskové orechy a jemná vínna dochuť.', reason:'Je to 100 % arabika z farmy Morada Da Prata, spracovaná natural metódou a hodnotená 84 bodmi podľa SCA.', alternativeId:'victory' },
      { id:'ethiopia', name:'Etiópia', origin:'Specialty Coffee · 100 % Arabica', price:'od 19,90 €', url:'https://kavavitazov.sk/prazena-kava-etiopia/', use:['discovery','home'], taste:['fruity'], prep:['filter','lever'], drink:['black'], tags:['višňa','korenistá','výberová'], bestFor:'Zvedavých kávičkárov, ktorí chcú objavovať výberovú arabiku zo Sidama.', machines:'Filter pri svetlom pražení; espresso alebo moka pri full city pražení.', profile:'Sladká vôňa, korenistá aróma, jemná kyslosť a elegantná višňová dochuť.', reason:'Etiópia Sidamo Organic je 100 % arabika vo výberovej kvalite, spracovaná natural metódou a hodnotená 85 bodmi podľa SCA.', alternativeId:'victory' },
      { id:'decaf', name:'Bezkofeínová', origin:'Decaf · 100 % Arabica', price:'od 17,90 €', url:'https://kavavitazov.sk/bezkofeinova-decaf/', use:['home','office','automatic','discovery'], taste:['decaf','smooth'], prep:['automatic','lever','moka','filter'], drink:['black','milk','both'], tags:['bez kofeínu','100 % arabika','Swiss Water'], bestFor:'Každého, kto chce brazílsku 100 % arabiku bez bežného obsahu kofeínu.', machines:'Espresso alebo moka; produkt ponúka aj viac hrúbok mletia.', profile:'Brazílska arabika zbavená kofeínu švajčiarskou vodnou metódou bez chemického rozpúšťadla.', reason:'Ako jediná presne rešpektuje požiadavku bez kofeínu a používa Swiss Water proces uvedený pri produkte.', alternativeId:'brazil' }
    ]
  },
  concept: {
    id: 'concept', brand: 'Concept Coffee Roasters', subbrand: 'Piešťany · Bratislava', ownerGreeting: 'Dobrý deň, tím Concept Coffee Roasters.',
    headline: 'Zjednodušte objavovanie sezónnych káv bez toho, aby sa stratil ich príbeh.', intro: 'Poradca premení chuťové poznámky a spôsob prípravy na osobné odporúčanie z aktuálnej ponuky.',
    primary: '#263630', accent: '#d6efdf', surface: '#f8faf8', shopUrl: 'https://www.conceptcoffee.sk/', contactUrl: 'https://www.conceptcoffee.sk/kontakty/', phone: '',
    welcome: 'Dobrý deň. Pomôžem vám zorientovať sa v aktuálnych kávach Concept podľa chuti a prípravy.', quick: ['Káva na filter', 'Sladké espresso', 'Niečo ovocné', 'Chcem novinku'],
    products: [
      { id:'weithaga', name:'Weithaga AA – Kenya', origin:'Keňa', price:'od 15,00 €', prep:['filter'], taste:['fruity'], drink:['black'], caffeine:['classic','either'], tags:['Keňa','svieža','filter'], reason:'Svieža kenská káva pre zákazníka, ktorý chce čistú a ovocnú filtrovanú šálku.' },
      { id:'nemba', name:'Nemba – Burundi', origin:'Burundi', price:'od 15,00 €', prep:['filter','lever'], taste:['balanced','fruity'], drink:['black'], caffeine:['classic','either'], tags:['sladká','ovocná','čistá'], reason:'Vyvážená africká káva medzi sladkosťou a sviežosťou.' },
      { id:'gedicho', name:'Gedicho – Ethiopia', origin:'Etiópia', price:'od 14,00 €', prep:['filter'], taste:['fruity'], drink:['black'], caffeine:['classic','either'], tags:['kvetinová','ovocná','ľahká'], reason:'Aromatická etiópska káva pre milovníkov ľahších, kvetinových profilov.' },
      { id:'berry-blast', name:'Berry Blast – Colombia', origin:'Kolumbia', price:'od 18,50 €', prep:['filter','lever'], taste:['fruity','strong'], drink:['black'], caffeine:['classic','either'], tags:['bobuľové ovocie','výrazná','novinka'], reason:'Výrazný moderný profil pre zákazníka, ktorý chce zážitok mimo klasickej čokoládovej kávy.' },
      { id:'summerjam', name:'Summerjam – Colombia', origin:'Kolumbia', price:'od 18,50 €', prep:['filter'], taste:['fruity','balanced'], drink:['black'], caffeine:['classic','either'], tags:['šťavnatá','sladká','sezónna'], reason:'Sezónna ovocná káva, ktorá zaujme sladkosťou a šťavnatosťou.' }
    ]
  },
  jolka: {
    id: 'jolka', brand: 'Pražiareň Jolka', subbrand: 'Bratislava – Ružinov', ownerGreeting: 'Dobrý deň, tím Pražiarne Jolka.',
    headline: 'Pomôžte zákazníkovi vybrať si medzi klasikou, ovocnou výberovkou a vašimi zmesami.', intro: 'Krátky poradca vysvetlí aciditu, praženie aj prípravu a odporučí konkrétnu kávu bez zdĺhavého hľadania.',
    primary: '#3d3035', accent: '#ead9df', surface: '#fbf8f9', shopUrl: 'https://www.praziarenjolka.sk/shop/', contactUrl: 'https://www.praziarenjolka.sk/kavarien-praziaren/', phone: '',
    welcome: 'Dobrý deň. Pomôžem vám vybrať kávu Jolka podľa chuti, prípravy a toho, či chcete klasiku alebo objavovať.', quick: ['Nízka acidita', 'Káva na cappuccino', 'Ovocný filter', 'Vietnam'],
    products: [
      { id:'zmes-jolka', name:'Zmes Jolka', origin:'Arabica blend · 20 % Robusta', price:'od 5,90 €', prep:['automatic','lever','moka'], taste:['strong','chocolate'], drink:['milk','black','both'], caffeine:['classic','either'], tags:['čokoláda','orechy','nízka acidita'], reason:'House blend s vyšším kofeínom a nízkou aciditou, vhodný na espresso aj cappuccino.' },
      { id:'zmes-cokolada', name:'Zmes Čokoláda', origin:'house blend', price:'od 5,90 €', prep:['automatic','lever','moka'], taste:['chocolate','balanced'], drink:['milk','black','both'], caffeine:['classic','either'], tags:['čokoládová','sladká','klasika'], reason:'Prístupná čokoládová voľba pre zákazníka, ktorý nechce výraznú ovocnosť.' },
      { id:'sidamo', name:'Ethiopia SIDAMO GR.2', origin:'Etiópia · light roast', price:'od 5,90 €', prep:['filter'], taste:['fruity'], drink:['black'], caffeine:['classic','either'], tags:['citrus','jazmín','bergamot'], reason:'Jemná a aromatická káva s ovocným profilom pre filtrovanú prípravu.' },
      { id:'vietnam-anaerobic', name:'Vietnam Lang Biang – Anaerobic Natural', origin:'Vietnam', price:'od 6,50 €', prep:['filter','lever'], taste:['fruity','strong'], drink:['black'], caffeine:['classic','either'], tags:['tropické ovocie','intenzívna','anaerobic'], reason:'Výrazná výberová káva pre zákazníka, ktorý chce netradičný ovocný zážitok.' },
      { id:'el-salvador', name:'El Salvador SHG EP', origin:'El Salvador', price:'od 5,90 €', prep:['filter','lever','moka'], taste:['balanced','chocolate'], drink:['black','both'], caffeine:['classic','either'], tags:['vyvážená','sladká','vulkanická pôda'], reason:'Vyvážená stredoamerická káva pre zákazníka medzi klasikou a jemnou ovocnosťou.' }
    ]
  }
};
