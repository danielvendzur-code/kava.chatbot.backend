(() => {
  'use strict';

  const semanticPhotos = {
    dry:'/assets/cosmetics/choice-dry.webp',
    oily:'/assets/cosmetics/choice-hydrate.webp',
    sensitive:'/assets/cosmetics/choice-calm.webp',
    balanced:'/assets/cosmetics/choice-balanced.webp',
    hydrate:'/assets/cosmetics/choice-hydrate.webp',
    calm:'/assets/cosmetics/choice-calm.webp',
    clarity:'/assets/cosmetics/choice-balanced.webp',
    mature:'/assets/cosmetics/choice-mature.webp',
    simple:'/assets/cosmetics/choice-calm.webp',
    basic:'/assets/cosmetics/choice-dry.webp',
    full:'/assets/cosmetics/choice-balanced.webp',
    target:'/assets/cosmetics/choice-hydrate.webp',
    cream:'/assets/cosmetics/choice-dry.webp',
    serum:'/assets/cosmetics/choice-calm.webp',
    oil:'/assets/cosmetics/choice-hydrate.webp',
    any:'/assets/cosmetics/choice-balanced.webp'
  };

  const questions = [
    { key:'skin', kicker:'Vaša pleť', title:'Ako sa pleť správa najčastejšie?', options:[
      {value:'dry',title:'Suchá a napnutá',text:'Chýba jej komfort a hydratácia',image:semanticPhotos.dry},
      {value:'oily',title:'Viac mazu a lesku',text:'Najmä T-zóna alebo nedokonalosti',image:semanticPhotos.oily},
      {value:'sensitive',title:'Citlivá a reaktívna',text:'Ľahko ju niečo podráždi',image:semanticPhotos.sensitive},
      {value:'balanced',title:'Vyvážená / zmiešaná',text:'Bez jedného výrazného problému',image:semanticPhotos.balanced}
    ]},
    { key:'goal', kicker:'Priorita', title:'Čo chcete riešiť ako prvé?', options:[
      {value:'hydrate',title:'Hydratáciu',text:'Viac komfortu a menej pnutia',image:semanticPhotos.hydrate},
      {value:'calm',title:'Upokojenie',text:'Jemná starostlivosť bez zbytočnej záťaže',image:semanticPhotos.calm},
      {value:'clarity',title:'Maz a nedokonalosti',text:'Ľahšia a vyváženejšia rutina',image:semanticPhotos.clarity},
      {value:'mature',title:'Pružnosť a zrelú pleť',text:'Výživa a cielená starostlivosť',image:semanticPhotos.mature}
    ]},
    { key:'routine', kicker:'Rutina', title:'Koľko krokov vám reálne vyhovuje?', options:[
      {value:'simple',title:'Čo najjednoduchšie',text:'Jeden hlavný produkt',image:semanticPhotos.simple},
      {value:'basic',title:'2–3 kroky',text:'Praktický základ ráno a večer',image:semanticPhotos.basic},
      {value:'full',title:'Kompletná rutina',text:'Chcem starostlivosť vyskladať poriadne',image:semanticPhotos.full},
      {value:'target',title:'Len niečo doplniť',text:'Hľadám jeden cielený krok',image:semanticPhotos.target}
    ]},
    { key:'texture', kicker:'Pocit na pleti', title:'Aký typ produktu preferujete?', options:[
      {value:'cream',title:'Krém',text:'Klasická a pohodlná voľba',image:semanticPhotos.cream},
      {value:'serum',title:'Sérum',text:'Ľahká cielená starostlivosť',image:semanticPhotos.serum},
      {value:'oil',title:'Olej',text:'Výživnejší pocit a pár kvapiek',image:semanticPhotos.oil},
      {value:'any',title:'Je mi to jedno',text:'Nech rozhodne hlavne vhodnosť',image:semanticPhotos.any}
    ]}
  ];

  const brands = {
    mylo: {
      name:'mylo', domain:'mylo.sk', website:'https://www.mylo.sk/',
      theme:{brand:'#171717',accent:'#b27b51',soft:'#f2ece3',paper:'#fffdf9',ink:'#171717',line:'#ddd5ca'},
      wordmark:'<span class="cx-wordmark cx-wordmark--mylo">mylo</span>',
      hero:'/assets/cosmetics/mylo.webp',
      ownerTitle:'Pomôžte zákazníkovi vybrať starostlivosť, ktorá mu sadne.',
      ownerText:'Chat odpovie na otázku. Výber starostlivosti zúži ponuku podľa pleti, priority a preferovanej rutiny.',
      benefit:['Menej otázok pred nákupom','Jednoduchší výber produktu','Priamy preklik do e-shopu'],
      products:[
        {id:'rose-hemp',name:'Hydratačný krém RUŽA A KONOPE',price:'3–24 €',url:'https://www.mylo.sk/starostlivost-o-tvar/ruza-a-konope/',tags:['dry','sensitive','hydrate','calm','cream','simple','basic'],reason:'Jemný smer pre suchšiu alebo dehydrovanú pleť, keď chcete praktický hydratačný krém.'},
        {id:'vanok',name:'Pleťový olej AKO VÁNOK',price:'2,50–25,50 €',url:'https://www.mylo.sk/starostlivost-o-tvar/ako-vanok/',tags:['oily','clarity','oil','target','basic'],reason:'Ľahší olejový krok pre pleť s vyššou tvorbou mazu a sklonom k nedokonalostiam.'},
        {id:'radost',name:'Ceramidový krém s vitamínmi RADOSŤ',price:'14,75 €',url:'https://www.mylo.sk/starostlivost-o-tvar/ceramidovy-krem-s-vitaminmi-radost/',tags:['dry','sensitive','mature','hydrate','calm','cream','simple'],reason:'Komfortná krémová voľba, keď je prioritou hydratácia a podpora kožnej bariéry.'},
        {id:'inovat',name:'Hydratačné sérum INOVAŤ',price:'19 €',url:'https://www.mylo.sk/panska-kozmetika/inovat/',tags:['balanced','oily','hydrate','serum','target','basic'],reason:'Ľahké hydratačné sérum, ak chcete do existujúcej rutiny pridať jeden cielený krok.'}
      ]
    },
    ponio: {
      name:'ponio', domain:'ponio.sk', website:'https://ponio.sk/',
      theme:{brand:'#8d5b4d',accent:'#d6a08c',soft:'#f4e8df',paper:'#fffaf6',ink:'#3e2f2b',line:'#e6d5cc'},
      wordmark:'<span class="cx-wordmark cx-wordmark--ponio">ponio</span>',
      hero:'/assets/cosmetics/ponio.webp',
      ownerTitle:'Nájdite zákazníkovi jednoduchú rutinu za štyri otázky.',
      ownerText:'Poradca prepojí otázky zákazníka s krátkym výberom a pošle ho rovno na vhodný produkt.',
      benefit:['Menej váhania v katalógu','Výber podľa reálnej potreby','Konkrétny produkt na konci'],
      products:[
        {id:'vanilla',name:'Vanilka & kokos – pleťový krém',price:'13 €',url:'https://ponio.sk/products/vanilka-a-kokos-pletovy-krem',tags:['dry','sensitive','hydrate','calm','cream','simple','basic'],reason:'Jednoduchý výživný krém pre normálnu až suchšiu alebo citlivejšiu pleť.'},
        {id:'healthy',name:'Healthy aging – pleťový krém',price:'25,30 €',url:'https://ponio.sk/products/healthy-aging-pletovy-krem',tags:['mature','dry','hydrate','cream','simple','full'],reason:'Cielenejšia krémová voľba pre zrelšiu pleť, keď je prioritou pružnosť a výživa.'},
        {id:'lumina',name:'Lumina shield – denný pleťový krém',price:'25,30 €',url:'https://ponio.sk/products/lumina-shield-pletovy-krem',tags:['balanced','hydrate','cream','simple','basic'],reason:'Denný hydratačný krém pre zákazníka, ktorý chce jeden praktický produkt do rannej rutiny.'},
        {id:'rosewater',name:'Ružová voda Hanus 250 ml',price:'9,25 €',url:'https://ponio.sk/collections/pletove-kremy',tags:['sensitive','calm','target','any','basic'],reason:'Jemný doplnkový krok, keď zákazník nechce meniť celú rutinu a hľadá ľahkú starostlivosť.'}
      ]
    },
    two: {
      name:'two cosmetics', domain:'twocosmetics.sk', website:'https://www.twocosmetics.sk/',
      theme:{brand:'#101010',accent:'#e6a85f',soft:'#f4efe6',paper:'#ffffff',ink:'#101010',line:'#dedede'},
      wordmark:'<span class="cx-wordmark cx-wordmark--two">two</span>',
      hero:'/assets/cosmetics/two.webp',
      ownerTitle:'Z veľkého výberu urobte štyri jednoduché rozhodnutia.',
      ownerText:'Chat vysvetlí rozdiely. Výber starostlivosti spojí typ pleti, prioritu a preferovanú textúru s konkrétnym produktom.',
      benefit:['Menej filtrovania kategórií','Zrozumiteľný výber pre každého','Produkt podľa potrieb pleti'],
      products:[
        {id:'sensitive',name:'Krém pre citlivú pleť',price:'18 €',url:'https://www.twocosmetics.sk/p/krem-pre-citlivu-plet-s-kyselinou-hyaluronovou-a-bisabololom',tags:['sensitive','calm','hydrate','cream','simple','basic'],reason:'Jemná hydratačná voľba pre citlivejšiu pleť, keď je prioritou komfort.'},
        {id:'dry',name:'Krém pre suchú pleť',price:'19 €',url:'https://www.twocosmetics.sk/p/krem-na-suchu-plet-s-vitaminom-ce-a-skvalanom',tags:['dry','hydrate','cream','simple','basic'],reason:'Priama krémová voľba pre suchú a dehydrovanú pleť.'},
        {id:'problem',name:'Krém pre problematickú pleť',price:'18 €',url:'https://www.twocosmetics.sk/p/krem-pre-problematicku-plet-s-tea-tree-a-kyselinou-hyaluronovou',tags:['oily','clarity','cream','simple','basic'],reason:'Ľahší smer pre problematickú alebo mastnejšiu pleť, keď chcete jeden jasný základný produkt.'},
        {id:'routine',name:'Rutina pre zrelú pleť – PRO',price:'82 €',url:'https://www.twocosmetics.sk/p/rutina-pre-zrelu-plet-pro',tags:['mature','dry','full','cream','serum'],reason:'Kompletnejší výber pre zákazníka, ktorý chce zrelšej pleti vyskladať viac než jeden krok.'}
      ]
    },
    bellcoria: {
      name:'Bellcoria', domain:'bellcoria.sk', website:'https://bellcoria.sk/',
      theme:{brand:'#6d5539',accent:'#c58b52',soft:'#f3eee4',paper:'#fffdf8',ink:'#30281f',line:'#e3d8c8'},
      wordmark:'<span class="cx-wordmark cx-wordmark--bellcoria">Bellcoria</span>',
      hero:'/assets/cosmetics/bellcoria.webp',
      ownerTitle:'Filtre podľa typu pokožky nahraďte krátkym výberom.',
      ownerText:'Zákazník nemusí poznať kategórie ani zložky. Odpovie na štyri jednoduché otázky a dostane konkrétny smer.',
      benefit:['Jednoduchšie než filtre','Menej opakovaných otázok','Preklik na konkrétny produkt'],
      products:[
        {id:'opuntia',name:'Organický opunciový olej',price:'30,90 €',url:'https://bellcoria.sk/produkty/organicky-opunciovy-olej/',tags:['dry','sensitive','mature','hydrate','oil','target'],reason:'Výživnejší olejový smer pre suchšiu alebo citlivejšiu pleť a zákazníka, ktorý preferuje pár kvapiek.'},
        {id:'bakuchiol',name:'Elixír proti vráskam s bakuchiolom',price:'27,90 €',url:'https://bellcoria.sk/produkty/elixir-proti-vraskam-s-bakuchiolom/',tags:['mature','target','oil','serum','full'],reason:'Cielený elixír pre zrelšiu pleť, keď zákazník hľadá aktívnejší doplnok k rutine.'},
        {id:'cleanser',name:'Pleťový čistiaci gél',price:'9,90 €',url:'https://bellcoria.sk/produkty/pletovy-cistiaci-gel/',tags:['sensitive','balanced','calm','basic','full','any'],reason:'Jemný základ rutiny, keď je prioritou šetrné čistenie a jednoduchá každodenná starostlivosť.'},
        {id:'antiage',name:'Prírodný ANTI-AGING komplex',price:'40,90 €',url:'https://bellcoria.sk/produkty/prirodny-anti-aging-komplex/',tags:['mature','dry','full','serum','oil'],reason:'Kompletnejší cielený smer pre zákazníka, ktorý chce viacstupňovú starostlivosť o zrelšiu pleť.'}
      ]
    },
    biofy: {
      name:'BIOFY', domain:'biofy.sk', website:'https://biofy.sk/',
      theme:{brand:'#33483c',accent:'#839f74',soft:'#edf2e9',paper:'#fbfdf9',ink:'#253129',line:'#d4dfd0'},
      wordmark:'<span class="cx-wordmark cx-wordmark--biofy">BIOFY</span>',
      hero:'/assets/cosmetics/biofy.webp',
      ownerTitle:'Doveďte zákazníka k správnemu krému bez preklikávania.',
      ownerText:'Výber starostlivosti zjednoduší rozdiely medzi typmi pleti. Chat odpovie na otázky, ktoré by inak smerovali na podporu.',
      benefit:['Rýchlejší výber krému','Menej neistoty pred nákupom','Odporúčanie s dôvodom'],
      products:[
        {id:'dry',name:'Hydratačný krém – suchá a citlivá pleť',price:'15,20 €',url:'https://biofy.sk/produkty/hydratacny-krem-na-suchu-a-citlivu-plet-60ml/',tags:['dry','sensitive','hydrate','calm','cream','simple','basic'],reason:'Priama hydratačná voľba pre suchšiu alebo citlivejšiu pleť.'},
        {id:'problem',name:'Upokojujúci krém – problematická pleť',price:'13,90 €',url:'https://biofy.sk/produkty/upokojujuci-krem-na-akne-a-problematicku-plet-60ml/',tags:['oily','clarity','calm','cream','simple','basic'],reason:'Ľahký krémový smer pre pleť s vyššou tvorbou mazu a nedokonalosťami.'},
        {id:'mixed',name:'Výživný krém – normálna a zmiešaná pleť',price:'14,90 €',url:'https://biofy.sk/produkty/vyzivny-krem-na-normalnu-a-zmiesanu-plet-60ml/',tags:['balanced','hydrate','cream','simple','basic'],reason:'Univerzálny každodenný smer pre normálnu alebo zmiešanú pleť.'},
        {id:'hemp',name:'Konopný krém – suchá a problematická pleť',price:'16,80 €',url:'https://biofy.sk/zoznam/vsetky-produkty/',tags:['dry','sensitive','oily','calm','cream','target'],reason:'Alternatíva, keď zákazník rieši súčasne komfort suchej pleti aj sklony k problematickosti.'}
      ]
    },
    anemone: {
      name:'ANEMONE', domain:'anemone.sk', website:'https://anemone.sk/',
      theme:{brand:'#536575',accent:'#9faeb8',soft:'#edf1f3',paper:'#fbfcfc',ink:'#26333c',line:'#d8e0e4'},
      wordmark:'<span class="cx-wordmark cx-wordmark--anemone">ANEMONE</span>',
      hero:'/assets/cosmetics/anemone.webp',
      ownerTitle:'Malému e-shopu dá veľký rozdiel jedno dobré odporúčanie.',
      ownerText:'Namiesto prezerania každej kategórie dostane zákazník krátky výber a konkrétny produkt. Chat zostáva po ruke na bežné otázky.',
      benefit:['Ľahký výber aj pre nového zákazníka','Viac priestoru pre lokálnu značku','Priama cesta k nákupu'],
      products:[
        {id:'mature',name:'Pleťový olej na zrelú pleť',price:'8,90 €',url:'https://anemone.sk/pletove-oleje-a-sera/pletovy-olej-na-zrelu-plet.html',tags:['mature','dry','oil','target','simple'],reason:'Jednoduchý olejový krok pre zrelšiu alebo suchšiu pleť.'},
        {id:'dry',name:'Pleťový olej na normálnu & suchú pleť',price:'7,38 €',url:'https://anemone.sk/pletove-oleje-a-sera/',tags:['dry','hydrate','oil','simple','target'],reason:'Výživnejší jednoduchý smer pre normálnu až suchšiu pleť.'},
        {id:'oily',name:'Pleťový olej na mastnú & problematickú pleť',price:'7,38 €',url:'https://anemone.sk/pletove-oleje-a-sera/',tags:['oily','clarity','oil','simple','target'],reason:'Olejová voľba zameraná na mastnejšiu a problematickú pleť.'},
        {id:'chamomile',name:'Kvetinová voda Harmanček',price:'4 €',url:'https://anemone.sk/kvetinove-vody/kvetinova-voda-harmancek.html',tags:['sensitive','calm','target','any','basic'],reason:'Jemný doplnkový krok pre zákazníka, ktorý chce rutinu skôr upokojiť než rozširovať.'}
      ]
    }
  };

  window.COSMETICS_DEMOS = { brands, questions, semanticPhotos };
})();
