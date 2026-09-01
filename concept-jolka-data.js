/** Concept Coffee Roasters content for the shared Jolka widget structure. */
window.JOLKA = (() => {
  const brand = {
    name: 'Concept Coffee Roasters',
    place: 'Piešťany · Bratislava',
    shopUrl: 'https://www.conceptcoffee.sk/kava/',
    storyUrl: 'https://www.conceptcoffee.sk/',
    author: 'mojchatbot.sk',
    verifiedOn: '7. 8. 2026'
  };

  const acidityScale = ['minimálna', 'jemná', 'stredná', 'výrazná'];
  const prepLabels = {
    automat: 'automatický kávovar',
    lever: 'pákové espresso',
    moka: 'moka kanvička',
    filter: 'filter a prekvapkávanie'
  };

  const products = [
    {
      id: 'holyshot', name: 'Holysh*t! espresso', line: 'Signature espresso blend · Concept Coffee Roasters',
      url: 'https://www.conceptcoffee.sk/holysht-espresso/', photo: '/assets/concept/product-holyshot.jpg', tile: '/assets/concept/product-holyshot.jpg',
      price: '17,50 €', priceUnit: '500 g', priceFrom: '17,50 €', weights: '500 g a 1 kg',
      bulk: { label: '1 kg za 34,00 €', saving: 'výhodnejšie balenie na pravidelnú prípravu' },
      notes: ['čokoláda', 'jahody', 'marcipán'], acidity: 1,
      acidityNote: 'Sladký espresso profil s jemnou ovocnosťou a plným telom.', bestFor: 'Pákový kávovar, automat a moka',
      why: 'Plnšie sladké espresso s čokoládovým základom, ktoré ostane čitateľné aj v mlieku.',
      taste: { chocolate: 1, balanced: .9, fruity: .35, bold: .8 }, prep: { automat: 1, lever: 1, moka: .9, filter: .2 },
      drink: { black: .85, milk: 1, both: 1 }, explore: .25
    },
    {
      id: 'yellow-sunset', name: 'Yellow Sunset', line: 'Kolumbia · natural EA decaf',
      url: 'https://www.conceptcoffee.sk/yellow-sunset/', photo: '/assets/concept/product-yellow-sunset.jpg', tile: '/assets/concept/product-yellow-sunset.jpg',
      price: '12,50 €', priceUnit: '250 g', priceFrom: '12,50 €', weights: '250 g – 1 kg',
      notes: ['sušené slivky', 'kakao', 'nugát'], acidity: 1, decaf: true,
      acidityNote: 'Jemná acidita a sladký, plný profil bez kofeínu.', bestFor: 'Espresso, automat a moka',
      why: 'Plná bezkofeínová káva s kakaom, nugátom a orechovým záverom.',
      taste: { chocolate: .95, balanced: .9, fruity: .3, bold: .45 }, prep: { automat: .9, lever: 1, moka: .85, filter: .35 },
      drink: { black: .85, milk: 1, both: 1 }, explore: .25
    },
    {
      id: 'weithaga', name: 'Weithaga AA', line: 'Keňa · Nyeri · washed',
      url: 'https://www.conceptcoffee.sk/weithaga-aa---kenya/', photo: '/assets/concept/product-weithaga.jpg', tile: '/assets/concept/product-weithaga.jpg',
      price: '15,00 €', priceUnit: '250 g', priceFrom: '15,00 €', weights: '250 g a 1 kg',
      notes: ['červené ríbezle', 'grep', 'vanilka'], acidity: 3,
      acidityNote: 'Jasná a iskrivá káva s čistým čajovým záverom.', bestFor: 'V60, Kalita a batch brew',
      why: 'Ovocný filter s červenými ríbezľami, grepom a elegantným čajovým záverom.',
      taste: { chocolate: .1, balanced: .75, fruity: 1, bold: .35 }, prep: { automat: .1, lever: .35, moka: .15, filter: 1 },
      drink: { black: 1, milk: .1, both: .3 }, explore: .8
    },
    {
      id: 'berry-blast', name: 'Berry Blast', line: 'Kolumbia · sezónny lot',
      url: 'https://www.conceptcoffee.sk/berry-blast-colombia/', photo: '/assets/concept/product-berry-blast.jpg', tile: '/assets/concept/product-berry-blast.jpg',
      price: '18,50 €', priceUnit: '250 g', priceFrom: '18,50 €', weights: '250 g a 1 kg',
      notes: ['černica', 'čučoriedka', 'pomaranč'], acidity: 3,
      acidityNote: 'Výrazný ovocný profil s citrusovým zdvihom.', bestFor: 'Filter alebo experimentálne espresso',
      why: 'Najvýraznejšia sezónna voľba pre človeka, ktorý chce tmavé lesné ovocie a sviežosť.',
      taste: { chocolate: .1, balanced: .45, fruity: 1, bold: .85 }, prep: { automat: .05, lever: .6, moka: .15, filter: 1 },
      drink: { black: 1, milk: .05, both: .2 }, explore: 1
    },
    {
      id: 'gedicho', name: 'Gedicho', line: 'Etiópia · Yirgacheffe · natural',
      url: 'https://www.conceptcoffee.sk/gedicho-ethiopia/', photo: '/assets/concept/result-filter.webp', tile: '/assets/concept/result-filter.webp',
      price: '14,00 €', priceUnit: '250 g', priceFrom: '14,00 €', weights: '250 g a 1 kg',
      notes: ['malina', 'broskyňa', 'bergamot'], acidity: 2,
      acidityNote: 'Ľahká, voňavá a čajová káva s jasnou vôňou.', bestFor: 'V60, Chemex a AeroPress',
      why: 'Aromatický filter s ľahkým telom, malinou, broskyňou a bergamotom.',
      taste: { chocolate: .1, balanced: .7, fruity: 1, bold: .35 }, prep: { automat: .05, lever: .25, moka: .1, filter: 1 },
      drink: { black: 1, milk: .05, both: .2 }, explore: .75
    },
    {
      id: 'summerjam', name: 'Summerjam', line: 'Kolumbia · sezónny filter',
      url: 'https://www.conceptcoffee.sk/summerjam-colombia/', photo: '/assets/concept/result-filter.webp', tile: '/assets/concept/result-filter.webp',
      price: '18,50 €', priceUnit: '250 g', priceFrom: '18,50 €', weights: '250 g a 1 kg',
      notes: ['ananás', 'žlté ovocie', 'kakao'], acidity: 2,
      acidityNote: 'Šťavnatá ovocnosť s krémovým dojmom a sviežim záverom.', bestFor: 'V60, batch brew a cold brew',
      why: 'Prístupná ovocná voľba s ananásom, žltým ovocím a jemne krémovým profilom.',
      taste: { chocolate: .3, balanced: .85, fruity: .9, bold: .4 }, prep: { automat: .05, lever: .25, moka: .1, filter: 1 },
      drink: { black: 1, milk: .1, both: .25 }, explore: .7
    }
  ];

  const steps = [
    { key: 'taste', name: 'Chuť', title: 'Ktorý chuťový smer vám sedí?', options: [
      { value: 'chocolate', title: 'Sladké a čokoládové', detail: 'Kakao, orechy a nugát', product: 'holyshot', photo: '/assets/concept/taste/chocolate.webp' },
      { value: 'balanced', title: 'Vyvážené', detail: 'Sladkosť aj jemné ovocie', product: 'summerjam', photo: '/assets/concept/taste/sweet.webp' },
      { value: 'fruity', title: 'Ovocné a svieže', detail: 'Bobuľové a citrusové tóny', product: 'weithaga', photo: '/assets/concept/taste/fruity.webp' },
      { value: 'bold', title: 'Výrazné a netradičné', detail: 'Intenzívny sezónny profil', product: 'berry-blast', photo: '/assets/concept/taste/intense.webp' }
    ]},
    { key: 'prep', name: 'Príprava', title: 'Ako si kávu pripravujete?', options: [
      { value: 'automat', title: 'Automat', detail: 'Káva stlačením tlačidla', photo: '/assets/concept/prep-automatic.webp' },
      { value: 'lever', title: 'Pákový kávovar', detail: 'Espresso pripravujete ručne', photo: '/assets/concept/prep-lever.webp' },
      { value: 'moka', title: 'Moka kanvička', detail: 'Silnejšia káva zo sporáka', photo: '/assets/concept/prep-moka.webp' },
      { value: 'filter', title: 'Filter', detail: 'V60 alebo prekvapkávanie', photo: '/assets/concept/prep-filter.webp' }
    ]},
    { key: 'drink', name: 'Nápoj', title: 'Ako kávu najčastejšie pijete?', options: [
      { value: 'black', title: 'Čistú', detail: 'Espresso, lungo alebo filter', photo: '/assets/concept/taste/drink-black.webp' },
      { value: 'milk', title: 'S mliekom', detail: 'Cappuccino alebo flat white', photo: '/assets/concept/taste/drink-milk.webp' },
      { value: 'both', title: 'Striedam oboje', detail: 'Káva musí zvládnuť aj mlieko', photo: '/assets/concept/taste/drink-both.webp' }
    ]},
    { key: 'acidity', name: 'Acidita', title: 'Koľko sviežosti chcete v šálke?', options: [
      { value: 'none', title: 'Čo najmenej', detail: 'Kyslá káva mi nesedí', product: 'holyshot', photo: '/assets/concept/taste/chocolate.webp' },
      { value: 'mild', title: 'Jemnú', detail: 'Sviežosť len v pozadí', product: 'summerjam', photo: '/assets/concept/taste/sweet.webp' },
      { value: 'bright', title: 'Výraznú', detail: 'Citrusy a ovocie vítam', product: 'weithaga', photo: '/assets/concept/taste/fruity.webp' },
      { value: 'explore', title: 'Prekvapte ma', detail: 'Chcem niečo netradičné', product: 'berry-blast', photo: '/assets/concept/taste/intense.webp' }
    ]}
  ];

  const chat = {
    welcome: 'Dobrý deň. Pomôžem vám vybrať sezónnu kávu podľa prípravy a chuti.',
    placeholder: 'Napíšte, akú kávu hľadáte…',
    chips: ['Káva na filter', 'Nie veľmi kyslú', 'Odkiaľ je káva?', 'Porovnajte dve kávy']
  };

  const fallbacks = [
    { match: ['acidit', 'kysl', 'nekysl'], product: 'holyshot', lead: 'Ak nechcete výraznú aciditu, siahnite po' },
    { match: ['mlie', 'cappucc', 'latte', 'flat white'], product: 'holyshot', lead: 'Do mlieka sa najlepšie hodí' },
    { match: ['filter', 'v60', 'chemex', 'prekvapk'], product: 'weithaga', lead: 'Na čistý ovocný filter odporúčam' },
    { match: ['ovoc', 'sviež', 'citrus', 'netradi'], product: 'berry-blast', lead: 'Z výrazných sezónnych káv vyberám' },
    { match: ['bez kofe', 'bezkofe', 'decaf', 'večer'], product: 'yellow-sunset', lead: 'Bez kofeínu je tu' },
    { match: ['espresso', 'automat', 'moka', 'čokolád'], product: 'holyshot', lead: 'Na sladké espresso odporúčam' }
  ];

  const demo = {
    id: 'concept', rootId: 'concept-root', pageClass: 'concept-page', heroProductId: 'holyshot',
    logoInk: '/brand/concept-official-logo.png', logoBadge: '/brand/concept-official-logo.png', logoHeader: '/brand/concept-official-logo.png',
    heroImage: '/assets/concept/product-holyshot.jpg', entryImage: '/assets/concept/result-espresso.webp',
    eyebrow: 'Pre tím Concept Coffee Roasters',
    heroTitle: 'Vitajte vo vašom návrhu kávového poradcu pre Concept Coffee Roasters.',
    heroLead: 'Poradca vysvetlí chuť, pôvod aj prípravu a odporučí jednu konkrétnu sezónnu kávu.',
    heroImageAlt: 'Káva Concept Coffee Roasters', ownerCredit: 'ukážka pre Concept Coffee Roasters',
    teaserTitle: 'Nájdite svoju kávu', teaserText: '4 otázky · jedno odporúčanie',
    dialogLabel: 'Kávový poradca Concept Coffee Roasters', advisorLabel: 'Online poradca',
    entryKicker: 'Kávový výber', entryTitle: 'Nájdite svoju kávu', entryText: '4 otázky · jedno odporúčanie'
  };

  return { brand, acidityScale, prepLabels, products, steps, chat, fallbacks, demo };
})();
