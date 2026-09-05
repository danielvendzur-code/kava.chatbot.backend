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
    },
    modrapupava: {
      name:"Modrá púpava", domain:"modrapupava.sk", website:"https://www.modrapupava.sk/",
      theme:{brand:'#1c5850',accent:'#108474',soft:'#e8f1ee',paper:'#fbfdfc',ink:'#1d2b28',line:'#d2e2dd'},
      wordmark:"<img class=\"cx-wordmark cx-logo\" src=\"/assets/cosmetics/modrapupava-logo.png\" alt=\"Modrá púpava\">",
      hero:'/assets/cosmetics/modrapupava.jpg',
      ownerTitle:"Chatbot poradí, ktorým produktom z rady začať.",
      ownerText:"Modrá púpava má oleje, séra aj krémy pre rôzne typy pleti. Chatbot prevedie zákazníka ponukou, odpovie na otázky o zložení a podľa pleti, priority a preferovanej textúry odporučí jeden konkrétny produkt.",
      benefit:["Menej otázok pred nákupom","Výber podľa pleti, nie podľa kategórie","Preklik rovno na produkt"],
      products:[
        {id:'antiage',name:"Inspiral Anti-age – krém na spevnenie pleti",price:"51,35 €",url:"https://www.modrapupava.sk/products/krem-na-spevnenie-pleti-inspiral-anti-age",photo:'/assets/cosmetics/modrapupava-antiage.jpg',tags:['mature','dry','hydrate','cream','full','simple'],reason:"Krém pre zrelú a suchú pleť — spevňuje kontúry, zmierňuje vrásky a zjednocuje tón. Jemný natoľko, že sadne aj citlivejšej pleti."},
        {id:'energy',name:"Inspiral Energy – pleťové sérum",price:"50,65 €",url:"https://www.modrapupava.sk/products/pletove-serum-inspiral-energy",photo:'/assets/cosmetics/modrapupava-energy.jpg',tags:['balanced','dry','hydrate','serum','target','basic'],reason:"Rozjasňujúce sérum s piatimi druhmi kyseliny hyalurónovej a vitamínom C — cielený krok do existujúcej rutiny."},
        {id:'problem',name:"Problematická pleť – pleťový a telový olej",price:"26,11 €",url:"https://www.modrapupava.sk/products/pletovy-a-telovy-olej-problematicka-plet",photo:'/assets/cosmetics/modrapupava-problem.jpg',tags:['oily','clarity','oil','simple','basic'],reason:"Ľahký olej s čajovníkom a moringou pre mastnú a problematickú pleť. Udržiava póry čisté a zároveň upokojuje podráždenie."},
        {id:'fialka',name:"Fialka – pleťová olejová kúra",price:"22,48 €",url:"https://www.modrapupava.sk/products/pletova-kura-fialka",photo:'/assets/cosmetics/modrapupava-fialka.jpg',tags:['sensitive','calm','oil','target','simple'],reason:"Jemná olejová kúra pre citlivú, začervenanú a namáhanú pleť — posilňuje kožnú bariéru a vracia komfort."}
      ]
    },
    facederma: {
      name:"Facederma", domain:"facederma.sk", website:"https://facederma.sk/",
      theme:{brand:'#1b1b1b',accent:'#a9736c',soft:'#f3ece5',paper:'#fffefc',ink:'#161312',line:'#e2dace'},
      wordmark:"<img class=\"cx-wordmark cx-logo\" src=\"/assets/cosmetics/facederma-logo.png\" alt=\"Facederma\">",
      hero:'/assets/cosmetics/facederma.jpg',
      ownerTitle:"Chatbot vysvetlí rozdiely a odporučí jeden produkt.",
      ownerText:"Séra aj krémy Facederma stoja podobne a líšia sa zložením — zákazník to z názvu nevyčíta. Chatbot ho prevedie ponukou, odpovie na otázky a podľa pleti, priority a rutiny mu odporučí jeden konkrétny produkt.",
      benefit:["Menej otázok na podporu","Rozdiel medzi produktmi zrozumiteľne","Preklik rovno na produkt"],
      products:[
        {id:'akne',name:"ANTI-AKNÉ krém pre problematickú pleť",price:"26,90 €",url:"https://facederma.sk/products/anti-akne-krem-pre-problematicku-plet",photo:'/assets/cosmetics/facederma-akne.jpg',tags:['oily','clarity','cream','simple','basic'],reason:"Krém na akné a vyrážky — zmierňuje zápalové aj nezápalové prejavy a podporuje obnovu rovnováhy mikrobiómu pleti."},
        {id:'hyaluron',name:"Sérum kyseliny hyalurónovej",price:"58,90 €",url:"https://facederma.sk/products/facederma-serum-kyseliny-hyaluronovej",photo:'/assets/cosmetics/facederma-hyaluron.jpg',tags:['balanced','dry','hydrate','serum','target','basic'],reason:"Hĺbková hydratácia, ktorá zjemňuje jemné linky a zároveň vyrovnáva tvorbu kožného mazu — cielený krok do rutiny."},
        {id:'lifting',name:"Liftingový krém na vrásky a kontúry tváre",price:"72,90 €",url:"https://facederma.sk/products/liftingovy-krem",photo:'/assets/cosmetics/facederma-lifting.jpg',tags:['mature','dry','cream','full','simple'],reason:"Extrakty z goji a vitexu podporujú pevnosť a pružnosť pokožky. Pre zákazníka, ktorý rieši vrásky a kontúry tváre."},
        {id:'hodvab',name:"Pleťový krém s hodvábom a kmeňovými bunkami",price:"72,90 €",url:"https://facederma.sk/products/pletovy-krem-s-hodvabom-a-bunkami-kostihoja-lekarskeho",photo:'/assets/cosmetics/facederma-hodvab.jpg',tags:['sensitive','calm','mature','hydrate','cream','simple','full'],reason:"Výživný krém s kašmírovo jemnou textúrou — komfortná voľba, keď pleť potrebuje skôr upokojiť než zaťažiť."}
      ]
    },
    cyprianus: {
      name:"Cyprianus", domain:"cyprianus.sk", website:"https://www.cyprianus.sk/",
      theme:{brand:'#2c3d31',accent:'#4c7c22',soft:'#eef3ea',paper:'#fdfbf6',ink:'#24312a',line:'#dae4d6'},
      wordmark:"<img class=\"cx-wordmark cx-logo\" src=\"/assets/cosmetics/cyprianus-logo.svg\" alt=\"Cyprianus\">",
      hero:'/assets/cosmetics/cyprianus.jpg',
      ownerTitle:"Chatbot vyberie z ručnej kozmetiky ten správny krém.",
      ownerText:"Krémy Cyprianus sa volajú podľa vône, nie podľa typu pleti — zákazník z názvu nespozná, ktorý je preňho. Chatbot ho prevedie ponukou, odpovie na otázky o zložení a podľa pleti, priority a textúry mu odporučí jeden konkrétny produkt.",
      benefit:["Názov vône prestane byť prekážkou","Výber podľa pleti, nie podľa kategórie","Preklik rovno na produkt"],
      products:[
        {id:'mandla',name:"Hydratačný pleťový krém Mandľa a Malina 50 ml",price:"14,63 €",url:"https://www.cyprianus.sk/hydratacny-pletovy-krem-mandla-a-malina-50ml/",photo:'/assets/cosmetics/cyprianus-mandla.jpg',tags:['dry','balanced','hydrate','cream','simple','basic'],reason:"Mandľovo-malinový hydratačný krém s niacínamidom a hyalurónom — jemnosť a svieži vzhľad pre bežnú každodennú starostlivosť."},
        {id:'q10',name:"Omladzujúci denný krém proti vráskam Q10 50 ml",price:"14,63 €",url:"https://www.cyprianus.sk/omladzujuci-denny-krem-proti-vraskam-50ml/",photo:'/assets/cosmetics/cyprianus-q10.jpg',tags:['mature','dry','hydrate','cream','full','simple'],reason:"Denný krém s koenzýmom Q10, skvalánom a vitamínom E — hebkosť a žiarivejší vzhľad bez lepivého filmu."},
        {id:'jojoba',name:"Pleťové sérum Jojobový olej a ruža 50 ml",price:"8,93 €",url:"https://www.cyprianus.sk/pletove-serum-jojoba-a-ruza-50ml/",photo:'/assets/cosmetics/cyprianus-jojoba.jpg',tags:['sensitive','calm','serum','oil','target','basic'],reason:"Olejové sérum z jojoby a ruže — jemný cielený krok, keď zákazník nechce meniť celú rutinu."},
        {id:'bergamot',name:"Hydratačný pleťový krém Pižmo a Bergamot 50 ml",price:"16,25 €",url:"https://www.cyprianus.sk/hydratacny-pletovy-krem-bergamot-50ml/",photo:'/assets/cosmetics/cyprianus-bergamot.jpg',tags:['oily','clarity','cream','simple','basic'],reason:"Denný krém s niacínamidom a hyalurónom, ktorý zjednotí vzhľad pleti a nechá ľahký zamatový finiš."}
      ]
    },
    panakeia: {
      name:"Panakeia", domain:"panakeia.sk", website:"https://www.panakeia.sk/",
      theme:{brand:'#1b6f9c',accent:'#178fcf',soft:'#e7f2f9',paper:'#fbfdfe',ink:'#17303d',line:'#d2e4ef'},
      wordmark:"<img class=\"cx-wordmark cx-logo\" src=\"/assets/cosmetics/panakeia-logo.png\" alt=\"Panakeia\">",
      hero:'/assets/cosmetics/panakeia.jpg',
      ownerTitle:"Chatbot preloží názvy produktov na typ pleti.",
      ownerText:"Báthoryčka, Bosorkin lektvar, Kopaničiarska žehlička — mená, ktoré si zákazník zapamätá, ale nič mu nepovedia o pleti. Chatbot ho prevedie ponukou, odpovie na otázky o zložení a podľa pleti, priority a textúry mu odporučí jeden konkrétny produkt.",
      benefit:["Názov produktu prestane byť hádankou","Menej otázok pred nákupom","Preklik rovno na produkt"],
      products:[
        {id:'noc',name:"BÁTHORYČKA – nočný krém s dračou krvou 30 ml",price:"15,28 €",url:"https://www.panakeia.sk/bathorycka---nocny-krem-s-dracou-krvou-30ml/",photo:'/assets/cosmetics/panakeia-noc.jpg',tags:['dry','sensitive','hydrate','calm','cream','simple','basic'],reason:"Nočný krém so živicou Sangre de Drago — intenzívne vyživuje, podporuje regeneráciu a obnovuje ochrannú bariéru pleti."},
        {id:'bakuchiol',name:"BOSORKIN LEKTVAR – bakuchiol pleťové sérum 15 ml",price:"15,28 €",url:"https://www.panakeia.sk/bosorkin-lektvar-bakuchiol-pletove-serum-15ml/",photo:'/assets/cosmetics/panakeia-bakuchiol.jpg',tags:['mature','balanced','serum','target','full'],reason:"Bakuchiol 1 % podporuje tvorbu kolagénu a elastínu, zjemňuje vrásky a upokojuje podráždenie. Ručne vyrobené na Slovensku."},
        {id:'zehlicka',name:"Kopaničiarska žehlička s peptidom Argireline 20 ml",price:"16,10 €",url:"https://www.panakeia.sk/kopaniciarska-zehlicka-s-peptidom-argireline-20ml--pletove-olejove-serum/",photo:'/assets/cosmetics/panakeia-zehlicka.jpg',tags:['mature','dry','hydrate','oil','target','full'],reason:"Olejové sérum s peptidom Argirelin, vitamínom E, skvalánom a vzácnymi olejmi — pár kvapiek namiesto ďalšieho kroku navyše."},
        {id:'pena',name:"BÁTHORYČKA – čistiaca pleťová pena s dračou krvou 100 ml",price:"8,78 €",url:"https://www.panakeia.sk/bathorycka-cistiaca-pletova-pena-s-dracou-krvou-100ml/",photo:'/assets/cosmetics/panakeia-pena.jpg',tags:['oily','clarity','simple','basic','any'],reason:"Jemná exfoliácia a čistenie vrátane zvyškov líčidiel — základ rutiny, keď je prvým problémom maz a nečistoty."}
      ]
    },
    barboralori: {
      name:"Barbora Lori", domain:"barboralori.sk", website:"https://www.barboralori.sk/",
      theme:{brand:'#2b2b2b',accent:'#117e6f',soft:'#e9f2f0',paper:'#fdfdfc',ink:'#232323',line:'#dbe7e3'},
      wordmark:"<img class=\"cx-wordmark cx-logo\" src=\"/assets/cosmetics/barboralori-logo.png\" alt=\"Barbora Lori\">",
      hero:'/assets/cosmetics/barboralori.jpg',
      ownerTitle:"Chatbot dovedie zákazníka k správnej fľaštičke.",
      ownerText:"Krémy, tonikum aj čistiace mlieko Barbora Lori vyzerajú v katalógu rovnako a líšia sa typom pleti. Chatbot prevedie zákazníka ponukou, odpovie na otázky o zložení a podľa pleti, priority a rutiny mu odporučí jeden konkrétny produkt.",
      benefit:["Rovnaké fľaštičky prestanú miasť","Menej otázok pred nákupom","Preklik rovno na produkt"],
      products:[
        {id:'sucha',name:"Denný krém pre suchú a zrelšiu pleť s liftingovým účinkom",price:"5,50 – 18,50 €",url:"https://www.barboralori.sk/ochranny-denny-krem-pre-suchu-a-zrelsiu-plet/",photo:'/assets/cosmetics/barboralori-sucha.jpg',tags:['dry','mature','hydrate','cream','simple','basic'],reason:"Denný krém pre suchú a zrelšiu pleť s liftingovým účinkom — probiotická receptúra vhodná aj pre veľmi citlivú pleť."},
        {id:'spf',name:"Opaľovací krém na tvár SPF 50 s nízkym komedogénnym indexom",price:"24,40 €",url:"https://www.barboralori.sk/opalovaci-krem-na-tvar-s-nizkym-komedogennym-indexom-spf-50/",photo:'/assets/cosmetics/barboralori-spf.jpg',tags:['oily','balanced','clarity','cream','target','basic'],reason:"Ochrana SPF 50 s nízkym komedogénnym indexom — pre pleť, ktorá sa maslí a bežné opaľovacie krémy jej upchávajú póry."},
        {id:'mlieko',name:"Čistiace mlieko na tvár",price:"17,70 €",url:"https://www.barboralori.sk/cistiace-mlieko-na-tvar/",photo:'/assets/cosmetics/barboralori-mlieko.jpg',tags:['sensitive','calm','simple','basic'],reason:"Jemné čistenie ako základ rutiny — vhodné aj pre veľmi citlivú pleť so sklonom k ekzému či seborei."},
        {id:'tonikum',name:"Upokojujúce a hydratačné tonikum",price:"14,99 €",url:"https://www.barboralori.sk/upokojujuce-a-hydratacne-tonikum/",photo:'/assets/cosmetics/barboralori-tonikum.jpg',tags:['sensitive','calm','hydrate','target','full'],reason:"Krok navyše po čistení, keď zákazník nechce meniť celú rutinu a hľadá len upokojenie a hydratáciu."}
      ]
    },
    bellmedi: {
      name:"BellMedi", domain:"bellmedi.sk", website:"https://bellmedi.sk/",
      theme:{brand:'#2a2622',accent:'#b08200',soft:'#fbf3dd',paper:'#fffef9',ink:'#241f19',line:'#eee2c3'},
      wordmark:"<img class=\"cx-wordmark cx-logo\" src=\"/assets/cosmetics/bellmedi-logo.png\" alt=\"BellMedi\">",
      hero:'/assets/cosmetics/bellmedi.jpg',
      ownerTitle:"Chatbot sa v stovke olejov vyzná za zákazníka.",
      ownerText:"BellMedi má vyše sto za studena lisovaných olejov, masiel a kvetových vôd — v takom katalógu sa zákazník sám nevyzná. Chatbot ho prevedie ponukou, odpovie na otázky o použití a podľa pleti, priority a textúry mu odporučí jeden konkrétny produkt.",
      benefit:["Stovka olejov prestane byť labyrint","Výber podľa pleti, nie podľa názvu rastliny","Preklik rovno na produkt"],
      products:[
        {id:'hyaluron',name:"Kyselina hyalurónová",price:"22,90 €",url:"https://bellmedi.sk/produkt/kyselina-hyaluronova/",photo:'/assets/cosmetics/bellmedi-hyaluron.jpg',tags:['dry','balanced','hydrate','serum','target','basic'],reason:"Udržuje pokožku pevnú a pružnú, redukuje a vypĺňa vrásky — cielený hydratačný krok do existujúcej rutiny."},
        {id:'ibistek',name:"Ibištekový olej",price:"9,90 €",url:"https://bellmedi.sk/produkt/ibistekovy-olej/",photo:'/assets/cosmetics/bellmedi-ibistek.jpg',tags:['mature','dry','oil','target','full'],reason:"Podporuje elasticitu a spevnenie pleti, prispieva k zmierneniu jemných vrások a pomáha pri ochabnutej a unavenej pokožke."},
        {id:'kakao',name:"Kakaové maslo",price:"7,90 €",url:"https://bellmedi.sk/produkt/kakaove-maslo/",photo:'/assets/cosmetics/bellmedi-kakao.jpg',tags:['dry','sensitive','calm','cream','simple','basic'],reason:"Intenzívne vyživuje, vytvára jemný ochranný film a upokojuje podráždenú, suchú a citlivú pokožku."},
        {id:'ceder',name:"Cédrová kvetová voda",price:"6,90 €",url:"https://bellmedi.sk/produkt/cedrova-voda/",photo:'/assets/cosmetics/bellmedi-ceder.jpg',tags:['oily','clarity','calm','simple','basic','any'],reason:"Vyrovnáva pleť a reguluje maz — pri akné a zanesených póroch, s jemným sťahujúcim a antibakteriálnym účinkom."}
      ]
    }
  };

  window.COSMETICS_DEMOS = { brands, questions, semanticPhotos };
})();
