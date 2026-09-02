/** Pražiarnička content for the shared Jolka layout. */
window.JOLKA = (() => {
  const brand = {
    name: 'Pražiarnička',
    place: 'Pražiarnička by Caffè Vita',
    shopUrl: 'https://praziarnicka.sk/eshop',
    storyUrl: 'https://praziarnicka.sk/',
    author: 'mojchatbot.sk'
  };

  const acidityScale = ['minimálna', 'jemná', 'stredná', 'výrazná'];
  const prepLabels = {
    automat: 'automatický kávovar', lever: 'pákové espresso', moka: 'moka kanvička', filter: 'filter'
  };

  const products = [
    {
      id:'paganini', name:'Paganini blend', line:'75 % arabica · 25 % robusta',
      url:'https://praziarnicka.sk/produkt/paganini-blend-75-arabica-25-robusta', photo:'/assets/praziarnicka/official-paganini.jpg', tile:'/assets/praziarnicka/official-paganini.jpg',
      price:'od 11,90 €', priceUnit:'balenie', priceFrom:'od 11,90 €', weights:'viac veľkostí',
      notes:['čokoláda','mandle','orechy'], acidity:1,
      acidityNote:'Plný, pokojný profil bez výraznej ovocnej acidity.', bestFor:'Automat, pákový kávovar a moka',
      why:'Plná, príjemná káva, ktorá sa nestratí ani v cappuccine. Dobrá voľba na každý deň.',
      taste:{ chocolate:.95, balanced:1, fruity:.15, bold:.8 }, prep:{ automat:1, lever:1, moka:.9, filter:.15 },
      drink:{ black:.75, milk:1, both:1 }, explore:.25
    },
    {
      id:'brazil', name:'Brazil Santos', line:'100 % arabica',
      url:'https://praziarnicka.sk/produkt/brazil-santos-100percent-arabica', photo:'/assets/praziarnicka/official-brazil.jpg', tile:'/assets/praziarnicka/official-brazil.jpg',
      price:'od 9,90 €', priceUnit:'balenie', priceFrom:'od 9,90 €', weights:'viac veľkostí',
      notes:['kakao','sladkosť','jemná chuť'], acidity:0,
      acidityNote:'Jemná každodenná arabica s veľmi nízkou aciditou.', bestFor:'Automat, espresso, moka aj filter',
      why:'Jemnejšia káva bez výraznej kyslosti. Ľahko sa pije a funguje pri viacerých spôsoboch prípravy.',
      taste:{ chocolate:1, balanced:.95, fruity:.15, bold:.35 }, prep:{ automat:1, lever:.95, moka:.9, filter:.7 },
      drink:{ black:1, milk:.6, both:.9 }, explore:.2
    },
    {
      id:'puccini', name:'Puccini blend', line:'60 % arabica · 40 % robusta',
      url:'https://praziarnicka.sk/produkt/puccini-60arabica-40-robusta', photo:'/assets/praziarnicka/official-puccini.jpg', tile:'/assets/praziarnicka/official-puccini.jpg',
      price:'od 11,50 €', priceUnit:'balenie', priceFrom:'od 11,50 €', weights:'viac veľkostí',
      notes:['tmavá čokoláda','marhuľa','hustá pena'], acidity:1,
      acidityNote:'Výraznejšie telo s aciditou skôr v pozadí.', bestFor:'Automat, pákový kávovar a moka',
      why:'Výrazná káva s plnou chuťou. Vhodná najmä vtedy, keď ju radi pijete s mliekom.',
      taste:{ chocolate:.85, balanced:.7, fruity:.2, bold:1 }, prep:{ automat:1, lever:1, moka:.95, filter:.1 },
      drink:{ black:.6, milk:1, both:.95 }, explore:.3
    },
    {
      id:'cuba', name:'Cuba Serrano', line:'100 % arabica',
      url:'https://praziarnicka.sk/produkt/cuba-serrano-lavado-100-arabica', photo:'/assets/praziarnicka/official-cuba.jpg', tile:'/assets/praziarnicka/official-cuba.jpg',
      price:'od 12,90 €', priceUnit:'balenie', priceFrom:'od 12,90 €', weights:'viac veľkostí',
      notes:['kakao','tabak','vlašské orechy'], acidity:0,
      acidityNote:'Sladký orechový profil s veľmi nízkou aciditou.', bestFor:'Pákový kávovar, moka a filter',
      why:'Plná a sladká káva s orechovou dochuťou. Najlepšie vynikne bez mlieka.',
      taste:{ chocolate:1, balanced:.9, fruity:.1, bold:.55 }, prep:{ automat:.35, lever:1, moka:1, filter:.7 },
      drink:{ black:1, milk:.35, both:.65 }, explore:.35
    },
    {
      id:'decaf', name:'Bezkofeínová Brazil', line:'100 % arabica · bez kofeínu',
      url:'https://praziarnicka.sk/produkt/bezkofeinova-kava-brazilia', photo:'/assets/praziarnicka/official-bezkofeinova.jpg', tile:'/assets/praziarnicka/official-bezkofeinova.jpg',
      price:'od 12,90 €', priceUnit:'balenie', priceFrom:'od 12,90 €', weights:'viac veľkostí',
      notes:['bez kofeínu','jemná','dobrá na večer'], acidity:1, decaf:true,
      acidityNote:'Jemná a sladká káva bez výraznej acidity.', bestFor:'Automat, espresso, moka aj filter',
      why:'Dobrá káva aj na večer. Je jemná a sladká, len bez povzbudenia.',
      taste:{ chocolate:.9, balanced:.9, fruity:.15, bold:.3 }, prep:{ automat:.9, lever:.9, moka:.85, filter:.65 },
      drink:{ black:.85, milk:.85, both:.9 }, explore:.15
    }
  ];

  const steps = [
    { key:'taste', name:'Chuť', title:'Čo chcete cítiť v šálke?', options:[
      { value:'chocolate', title:'Čokoláda a orechy', detail:'Plná, pokojná chuť', product:'brazil', photo:'/assets/praziarnicka/official-brazil.jpg' },
      { value:'balanced', title:'Sladká a vyvážená', detail:'Jemná chuť bez extrémov', product:'paganini', photo:'/assets/praziarnicka/official-paganini.jpg' },
      { value:'fruity', title:'Jemne ovocná', detail:'Ovocnosť skôr v pozadí', product:'puccini', photo:'/assets/praziarnicka/official-puccini.jpg' },
      { value:'bold', title:'Silná a výrazná', detail:'Plnšie telo a intenzita', product:'puccini', photo:'/assets/praziarnicka/official-puccini.jpg' }
    ]},
    { key:'prep', name:'Príprava', title:'Ako si kávu pripravujete?', options:[
      { value:'automat', title:'Automat', detail:'Káva stlačením tlačidla', photo:'/assets/praziarnicka/prep-automatic.webp' },
      { value:'lever', title:'Pákový kávovar', detail:'Espresso pripravujete ručne', photo:'/assets/praziarnicka/prep-lever.webp' },
      { value:'moka', title:'Moka kanvička', detail:'Silnejšia káva zo sporáka', photo:'/assets/praziarnicka/prep-moka.webp' },
      { value:'filter', title:'Filter', detail:'V60 alebo prekvapkávanie', photo:'/assets/praziarnicka/prep-filter.webp' }
    ]},
    { key:'drink', name:'Nápoj', title:'Ako ju pijete najčastejšie?', options:[
      { value:'black', title:'Čiernu', detail:'Espresso, lungo alebo filter', product:'cuba', photo:'/assets/praziarnicka/official-cuba.jpg' },
      { value:'milk', title:'S mliekom', detail:'Cappuccino, latte alebo flat white', product:'paganini', photo:'/assets/praziarnicka/official-paganini.jpg' },
      { value:'both', title:'Striedam oboje', detail:'Potrebujem univerzálnu kávu', product:'brazil', photo:'/assets/praziarnicka/official-brazil.jpg' }
    ]},
    { key:'acidity', name:'Acidita', title:'Koľko sviežosti chcete v šálke?', options:[
      { value:'none', title:'Čo najmenej', detail:'Kyslá káva mi nesedí', product:'brazil', photo:'/assets/praziarnicka/official-brazil.jpg' },
      { value:'mild', title:'Jemnú', detail:'Sviežosť len v pozadí', product:'paganini', photo:'/assets/praziarnicka/official-paganini.jpg' },
      { value:'bright', title:'Výraznejšiu', detail:'Nevadí mi sviežejší profil', product:'puccini', photo:'/assets/praziarnicka/official-puccini.jpg' },
      { value:'explore', title:'Prekvapte ma', detail:'Nechám si poradiť', product:'cuba', photo:'/assets/praziarnicka/official-cuba.jpg' }
    ]}
  ];

  const chat = {
    welcome:'Dobrý deň. Pomôžem vám vybrať kávu z ponuky Pražiarničky podľa chuti aj spôsobu prípravy.',
    placeholder:'Napíšte, akú kávu hľadáte…',
    chips:['Káva do automatu','Nie veľmi kyslú','Káva na cappuccino','Bezkofeínová']
  };

  const fallbacks = [
    { match:['acidit','kysl','nekysl'], product:'brazil', lead:'Ak nechcete výraznú aciditu, siahnite po' },
    { match:['mlie','cappucc','latte','flat white'], product:'paganini', lead:'Do mlieka sa veľmi dobre hodí' },
    { match:['automat'], product:'paganini', lead:'Do automatu odporúčam' },
    { match:['bez kofe','bezkofe','decaf','večer'], product:'decaf', lead:'Bez kofeínu je tu' },
    { match:['siln','výrazn'], product:'puccini', lead:'Ak chcete výraznejšiu kávu, vyberám' }
  ];

  const demo = {
    id:'praziarnicka', rootId:'praziarnicka-clean-root', pageClass:'praziarnicka-page', heroProductId:'paganini',
    logoInk:'/brand/praziarnicka-logo-official.png', logoBadge:'/brand/praziarnicka-mark.svg', logoHeader:'/brand/praziarnicka-wordmark.png', logoAvatar:'/brand/praziarnicka-mark.svg',
    heroImage:'/assets/praziarnicka/official-paganini.jpg', entryImage:'/assets/praziarnicka/official-paganini.jpg',
    eyebrow:'Pre tím Pražiarničky',
    heroTitle:'Vitajte vo vašom návrhu kávového poradcu pre Pražiarničku.',
    heroLead:'Poradca odpovie na pôvod, chuť aj prípravu a cez štyri krátke otázky odporučí jednu konkrétnu kávu.',
    heroHint:'Používa konkrétne kávy a fotografie z tejto ukážky Pražiarničky.',
    heroImageAlt:'Paganini blend Pražiarničky', ownerCredit:'ukážka pre Pražiarničku',
    teaserTitle:'Neviete, ktorú kávu vybrať?', teaserText:'4 otázky · jedno odporúčanie',
    dialogLabel:'Kávový poradca Pražiarnička', advisorLabel:'Online poradca',
    entryKicker:'Kávový výber', entryTitle:'Nájdite svoju kávu', entryText:'4 otázky · konkrétne odporúčanie'
  };

  return { brand, acidityScale, prepLabels, products, steps, chat, fallbacks, demo };
})();
