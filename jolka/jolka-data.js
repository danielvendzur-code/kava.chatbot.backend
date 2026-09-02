/**
 * Pražiareň Jolka — data layer.
 *
 * Every product name, price, weight, URL, flavour note and preparation hint below is
 * taken from the roastery's own store (WooCommerce Store API + product pages),
 * verified on 2026-08-08. Nothing here is invented.
 *
 *   catalogue : https://www.praziarenjolka.sk/eshop-kava/
 *   source    : https://www.praziarenjolka.sk/wp-json/wc/store/v1/products
 *
 * `taste`, `prep` and `drink` are 0–1 fit weights used by the deterministic scorer in
 * jolka-app.js. `acidity` is 0–3 and is derived from the roastery's own wording,
 * quoted in `acidityNote`.
 */
window.JOLKA = (() => {
  const SHOP = 'https://www.praziarenjolka.sk/eshop-kava/';

  const brand = {
    name: 'Pražiareň Jolka',
    place: 'Bratislava',
    shopUrl: SHOP,
    storyUrl: 'https://www.praziarenjolka.sk/moj-pribeh/',
    // Owner-facing demo footer only. No customer contact block anywhere in the widget.
    author: 'mojchatbot.sk',
    verifiedOn: '8. 8. 2026'
  };

  /** Acidity scale mirrors the dot scale printed on Jolka packaging. */
  const acidityScale = ['minimálna', 'jemná', 'stredná', 'výrazná'];

  const prepLabels = {
    automat: 'automatický kávovar',
    lever: 'pákové espresso',
    moka: 'moka kanvička',
    filter: 'filter a prekvapkávanie'
  };

  const products = [
    {
      id: 'zmes-jolka',
      name: 'Zmes Jolka',
      line: 'House blend · Brazil, India, El Salvador + 20 % robusta',
      url: 'https://www.praziarenjolka.sk/produkt/zmes-jolka/',
      photo: '/assets/jolka/zmes-jolka.webp',
      tile: '/assets/jolka/tile/zmes-jolka.webp',
      price: '13,50 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 44,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['čokoláda', 'orechy', 'škorica a karamel'],
      acidity: 0,
      acidityNote: 'Pražiareň ju popisuje ako kávu s minimálnou až žiadnou aciditou.',
      bestFor: 'Cappuccino, latte aj espresso',
      why: 'Originálny house blend Jolky. Vyšší obsah kofeínu vďaka robuste, žiadna kyslosť a dosť tela na to, aby chuť prešla cez mlieko.',
      taste: { chocolate: 1, balanced: 0.65, fruity: 0, bold: 0.6 },
      prep: { automat: 1, lever: 1, moka: 0.85, filter: 0.2 },
      drink: { black: 0.7, milk: 1, both: 1 },
      explore: 0.1
    },
    {
      id: 'zmes-cokolada',
      name: 'Zmes Čokoláda',
      line: 'House blend · Brazil, Honduras, El Salvador + 30 % robusta',
      url: 'https://www.praziarenjolka.sk/produkt/zmes-cokolada/',
      photo: '/assets/jolka/zmes-cokolada.webp',
      tile: '/assets/jolka/tile/zmes-cokolada.webp',
      price: '13,50 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 44,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['čokoláda', 'orechy', 'hustá kréma'],
      acidity: 0,
      acidityNote: 'Podľa pražiarne má takmer žiadnu aciditu.',
      bestFor: 'Mliečne nápoje aj espresso',
      why: 'Najpriamočiarejšia voľba pre zákazníka, ktorý chce čokoládovú klasiku a kyslosť v šálke nechce cítiť vôbec.',
      taste: { chocolate: 1, balanced: 0.5, fruity: 0, bold: 0.7 },
      prep: { automat: 1, lever: 1, moka: 0.85, filter: 0.15 },
      drink: { black: 0.65, milk: 1, both: 0.95 },
      explore: 0.05
    },
    {
      id: '9-to-fine',
      name: '9-to-Fine',
      line: 'Signature office blend · vyšší podiel robusty',
      url: 'https://www.praziarenjolka.sk/produkt/9-to-fine/',
      photo: '/assets/jolka/9-to-fine.webp',
      tile: '/assets/jolka/tile/9-to-fine.webp',
      price: '17,00 €',
      priceUnit: '500 g',
      priceFrom: '17,00 €',
      weights: '500 g a 1 kg',
      bulk: { label: '1 kg za 30,00 €', saving: 'o 4 € menej než dve 500 g balenia' },
      notes: ['čokoláda a oriešky', 'krémová textúra', 'plné telo'],
      acidity: 0,
      acidityNote: 'Pražiareň uvádza minimálnu až žiadnu aciditu.',
      bestFor: 'Automat a väčšia spotreba',
      why: 'Blend postavený priamo na automat. Viac kofeínu, plné telo a krémová textúra, ktorá zvládne aj desiatu kávu za deň.',
      taste: { chocolate: 0.95, balanced: 0.6, fruity: 0, bold: 0.8 },
      prep: { automat: 1, lever: 0.75, moka: 0.6, filter: 0.15 },
      drink: { black: 0.7, milk: 1, both: 1 },
      explore: 0.05
    },
    {
      id: 'horke-zlato',
      name: 'Horké zlato',
      line: 'Zmes pre milovníkov horkej chuti',
      url: 'https://www.praziarenjolka.sk/produkt/horke-zlato/',
      photo: '/assets/jolka/horke-zlato.webp',
      tile: '/assets/jolka/tile/horke-zlato.webp',
      price: '14,00 €',
      priceUnit: '250 g',
      priceFrom: '14,00 €',
      weights: '250 g – 1 kg',
      bulk: { label: '1 kg za 46,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['horkosladká', 'bohatá pena', 'bez ovocnej kyslosti'],
      acidity: 0,
      acidityNote: 'Pražiareň ju popisuje ako plnú horkosladkú chuť bez ovocnej kyslosti.',
      bestFor: 'Silné espresso aj do mlieka',
      why: 'Novinka pražiarne pre tých, čo chcú v šálke silu a bohatú penu, nie ovocie.',
      taste: { chocolate: 0.7, balanced: 0.35, fruity: 0, bold: 1 },
      prep: { automat: 0.85, lever: 1, moka: 0.9, filter: 0.15 },
      drink: { black: 1, milk: 0.9, both: 0.9 },
      explore: 0.15
    },
    {
      id: 'sviatocna-zmes',
      name: 'Sviatočná zmes',
      line: 'Signature blend · Brazil a Guatemala + 30 % vietnamská robusta',
      url: 'https://www.praziarenjolka.sk/produkt/sviatocna-zmes/',
      photo: '/assets/jolka/sviatocna-zmes.webp',
      tile: '/assets/jolka/tile/sviatocna-zmes.webp',
      price: '14,00 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 46,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['plná chuť', 'jemná acidita', 'vyšší kofeín'],
      acidity: 1,
      acidityNote: 'Pražiareň uvádza plnú chuť a jemnú aciditu vďaka vybraným arabikám.',
      bestFor: 'Mliečne nápoje aj espresso',
      why: 'Stred medzi klasikou a výberovkou. Plné telo z robusty, ale arabiky jej nechajú jemnú sladkú aciditu.',
      taste: { chocolate: 0.6, balanced: 1, fruity: 0.25, bold: 0.8 },
      prep: { automat: 0.9, lever: 1, moka: 0.85, filter: 0.3 },
      drink: { black: 0.85, milk: 1, both: 1 },
      explore: 0.25
    },
    {
      id: 'brazil-cerrado',
      name: 'Brazil Cerrado Doce Diamantina',
      line: '100 % Arabica · Brazília',
      url: 'https://www.praziarenjolka.sk/produkt/brazil-cerrado-doce-diamantina/',
      photo: '/assets/jolka/brazil-cerrado.webp',
      tile: '/assets/jolka/tile/brazil-cerrado.webp',
      price: '13,50 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 44,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['čokoláda a karamel', 'lieskové oriešky', 'zamatové telo'],
      acidity: 0,
      acidityNote: 'Pražiareň ju popisuje ako kávu s veľmi nízkou aciditou.',
      bestFor: 'Espresso, moka aj filter',
      why: 'Sladká jednodruhovka bez kyslosti. Plné zamatové telo, ktoré prechádza z čokolády do lieskových orieškov.',
      taste: { chocolate: 1, balanced: 0.8, fruity: 0.05, bold: 0.45 },
      prep: { automat: 0.9, lever: 0.95, moka: 0.95, filter: 0.7 },
      drink: { black: 1, milk: 0.8, both: 0.95 },
      explore: 0.15
    },
    {
      id: 'honduras-san-andres',
      name: 'Honduras SHG EP San Andres',
      line: '100 % Arabica · región Lempira, nad 1 650 m n. m.',
      url: 'https://www.praziarenjolka.sk/produkt/honduras-shg-ep-san-andres/',
      photo: '/assets/jolka/honduras-san-andres.webp',
      tile: '/assets/jolka/tile/honduras-san-andres.webp',
      price: '13,50 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 44,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['sladká až čokoládová', 'plné telo', 'vyšší kofeín'],
      acidity: 0,
      acidityNote: 'Pražiareň uvádza minimálnu, jemnú aciditu.',
      bestFor: 'Espresso, filter aj mlieko',
      why: 'Vysokohorská arabika so sladkou čokoládovou chuťou a plným telom, ale bez kyslosti, ktorá by prekážala.',
      taste: { chocolate: 0.9, balanced: 0.9, fruity: 0.1, bold: 0.6 },
      prep: { automat: 0.85, lever: 0.95, moka: 0.9, filter: 0.8 },
      drink: { black: 1, milk: 0.85, both: 1 },
      explore: 0.2
    },
    {
      id: 'colombia-sofia',
      name: 'Colombia Supremo Scr.19 Sofía',
      line: '100 % Arabica · Kolumbia, screen 19',
      url: 'https://www.praziarenjolka.sk/produkt/colombia-supremo-sofia/',
      photo: '/assets/jolka/colombia-sofia.webp',
      tile: '/assets/jolka/tile/colombia-sofia.webp',
      price: '13,50 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 44,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['kakao', 'karamel a vanilka', 'jemné korenie'],
      acidity: 1,
      acidityNote: 'Pražiareň uvádza nízku, príjemnú aciditu.',
      bestFor: 'Espresso, moka aj filter',
      why: 'Hutné telo, kakao a karamelová sladkosť s korenistým podtónom. Príjemná acidita, ktorá kávu oživí, ale netlačí sa dopredu.',
      taste: { chocolate: 0.85, balanced: 1, fruity: 0.3, bold: 0.5 },
      prep: { automat: 0.8, lever: 0.95, moka: 0.9, filter: 0.85 },
      drink: { black: 1, milk: 0.75, both: 0.9 },
      explore: 0.3
    },
    {
      id: 'india-plantation',
      name: 'India Plantation AA',
      line: '100 % Arabica · India',
      url: 'https://www.praziarenjolka.sk/produkt/india-plantation-aa/',
      photo: '/assets/jolka/india-plantation.webp',
      tile: '/assets/jolka/tile/india-plantation.webp',
      price: '14,00 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 46,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['slaný karamel', 'škorica', 'orechy'],
      acidity: 1,
      acidityNote: 'Pražiareň uvádza plné telo a príjemnú aciditu.',
      bestFor: 'Espresso, moka aj filter',
      why: 'Sladká a jemná káva s orieškovo-karamelovou vôňou. Plné telo a acidita akurát na to, aby chuť nebola plochá.',
      taste: { chocolate: 0.75, balanced: 1, fruity: 0.3, bold: 0.5 },
      prep: { automat: 0.8, lever: 0.9, moka: 0.9, filter: 0.85 },
      drink: { black: 1, milk: 0.8, both: 0.95 },
      explore: 0.3
    },
    {
      id: 'guatemala-shb',
      name: 'Guatemala SHB EP',
      line: '100 % Arabica · vysokohorská výberová káva',
      url: 'https://www.praziarenjolka.sk/produkt/guatemala-shb-ep/',
      photo: '/assets/jolka/guatemala-shb.webp',
      tile: '/assets/jolka/tile/guatemala-shb.webp',
      price: '14,00 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 46,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['ovocie', 'čokoláda', 'čistá šálka'],
      acidity: 3,
      acidityNote: 'Pražiareň ju popisuje ako kávu s vysokou aciditou a chuťou ovocia a čokolády.',
      bestFor: 'Espresso aj filter',
      why: 'Obľúbená arabika pražiarne. Spája ovocnú sviežosť s čokoládou, takže vás dostane k výberovke bez toho, aby ste stratili telo v šálke.',
      taste: { chocolate: 0.6, balanced: 0.8, fruity: 0.9, bold: 0.45 },
      prep: { automat: 0.5, lever: 1, moka: 0.75, filter: 0.95 },
      drink: { black: 1, milk: 0.5, both: 0.7 },
      explore: 0.6
    },
    {
      id: 'ethiopia-sidamo',
      name: 'Ethiopia SIDAMO GR.2',
      line: '100 % Arabica · Etiópia, 1 600–1 900 m n. m.',
      url: 'https://www.praziarenjolka.sk/produkt/ethiopia-sidamo/',
      photo: '/assets/jolka/ethiopia-sidamo.webp',
      tile: '/assets/jolka/tile/ethiopia-sidamo.webp',
      price: '14,00 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 46,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['citrusy', 'jazmín', 'bergamot'],
      acidity: 3,
      acidityNote: 'Pražiareň uvádza vysokú, citrónovú aciditu a dlhotrvajúcu dochuť.',
      bestFor: 'Filter a prekvapkávanie',
      roast: 'svetlé aj stredné praženie',
      why: 'Klasika medzi ovocnými výberovkami. Jazmín a bergamot s citrusovou aciditou, ktoré najlepšie vyniknú vo filtri.',
      taste: { chocolate: 0.15, balanced: 0.4, fruity: 1, bold: 0.1 },
      prep: { automat: 0.25, lever: 0.6, moka: 0.45, filter: 1 },
      drink: { black: 1, milk: 0.2, both: 0.5 },
      explore: 0.75
    },
    {
      id: 'vietnam-lang-biang',
      name: 'Vietnam Lang Biang',
      line: 'Anaerobic Natural · výberová káva priamo od farmára',
      url: 'https://www.praziarenjolka.sk/produkt/vietnam-lang-biang-anaerobic-natural/',
      photo: '/assets/jolka/vietnam-lang-biang.webp',
      tile: '/assets/jolka/tile/vietnam-lang-biang.webp',
      price: '17,00 €',
      priceUnit: '250 g',
      priceFrom: '6,50 €',
      weights: '75 g – 500 g',
      notes: ['tropické ovocie', 'vínna dochuť', 'anaeróbna fermentácia'],
      acidity: 3,
      acidityNote: 'Pražiareň ju popisuje ako acidnejšiu kávu s tónmi tropického ovocia.',
      bestFor: 'Filter — V60 a Chemex',
      roast: 'svetlé aj stredné praženie',
      why: 'Najnetradičnejšia káva v ponuke. Osemdesiat hodín anaeróbnej fermentácie dá tropické ovocie a jemnú vínnu dochuť, akú v bežnej káve nenájdete.',
      taste: { chocolate: 0.05, balanced: 0.35, fruity: 1, bold: 0.45 },
      prep: { automat: 0.2, lever: 0.75, moka: 0.4, filter: 1 },
      drink: { black: 1, milk: 0.15, both: 0.45 },
      explore: 1
    },
    {
      id: 'jamaica-blue-mountain',
      name: 'Jamaica Blue Mountain',
      line: 'Exkluzívny mikrolot · odroda Typica',
      url: 'https://www.praziarenjolka.sk/produkt/jamaica-blue-mountain/',
      photo: '/assets/jolka/jamaica-blue-mountain.webp',
      tile: '/assets/jolka/tile/jamaica-blue-mountain.webp',
      price: '80,00 €',
      priceUnit: '250 g',
      priceFrom: '30,00 €',
      weights: '75 g, 150 g a 250 g',
      notes: ['sladká a hladká', 'bez horkosti', 'jemná acidita'],
      acidity: 1,
      acidityNote: 'Pražiareň ju popisuje ako sladkú chuť s jemnou aciditou a bez horkosti.',
      bestFor: 'Filter alebo espresso',
      why: 'Jedna z najvzácnejších káv sveta a najdrahšia položka v ponuke Jolky. Hladká, sladká, bez horkosti — kupuje sa ako zážitok alebo darček.',
      taste: { chocolate: 0.5, balanced: 0.9, fruity: 0.5, bold: 0.2 },
      prep: { automat: 0.3, lever: 0.8, moka: 0.6, filter: 1 },
      drink: { black: 1, milk: 0.2, both: 0.5 },
      explore: 0.95
    },
    {
      id: 'decaf-etiopia',
      name: 'DECAF Etiópia',
      line: '100 % Arabica bez kofeínu · región Guji',
      url: 'https://www.praziarenjolka.sk/produkt/decaf-etiopia/',
      photo: '/assets/jolka/decaf-etiopia.webp',
      tile: '/assets/jolka/tile/decaf-etiopia.webp',
      price: '14,00 €',
      priceUnit: '250 g',
      priceFrom: '5,90 €',
      weights: '75 g – 1 kg',
      bulk: { label: '1 kg za 46,00 €', saving: 'o 10 € menej než štyri 250 g balenia' },
      notes: ['jahody a čučoriedky', 'citrusy', 'mliečna čokoláda'],
      acidity: 1,
      acidityNote: 'Pražiareň uvádza nízku aciditu a ovocnú chuť.',
      bestFor: 'Kedykoľvek počas dňa',
      why: 'Bezkofeínová káva, ktorá nepôsobí ako náhrada. Kofeín je odstránený prírodnou cestou, ovocné a kvetinové tóny Etiópie zostávajú.',
      taste: { chocolate: 0.5, balanced: 0.8, fruity: 0.8, bold: 0.2 },
      prep: { automat: 0.7, lever: 0.8, moka: 0.8, filter: 0.9 },
      drink: { black: 0.9, milk: 0.7, both: 0.85 },
      explore: 0.4,
      decaf: true
    }
  ];

  /**
   * Advisor — four steps, weighted scoring, no dead ends.
   *
   * Every option is illustrated. Taste and acidity steps use a real coffee from the
   * catalogue (`product`), so the customer sees genuine Jolka photography. The method
   * steps use `photo`: placeholder brewing and drink shots under assets/jolka/method,
   * documented in that folder's SOURCES.md and meant to be swapped for the roastery's
   * own once it has them.
   */
  const steps = [
    {
      key: 'taste',
      name: 'Chuť',
      title: 'Aká chuť vám v šálke sadne?',
      options: [
        // The four taste directions used to be four photographs of the same kraft
        // bag, so the picture carried no information. Each answer now shows the
        // flavour it stands for; the coffee that represents it stays as the badge.
        { value: 'chocolate', title: 'Čokoláda a orechy', detail: 'Klasika bez ovocnosti', product: 'zmes-cokolada', photo: '/assets/jolka/taste/chocolate.webp' },
        { value: 'balanced', title: 'Vyvážená a sladká', detail: 'Plné telo, karamel', product: 'honduras-san-andres', photo: '/assets/jolka/taste/sweet.webp' },
        { value: 'fruity', title: 'Ovocná a svieža', detail: 'Citrusy a kvety', product: 'ethiopia-sidamo', photo: '/assets/jolka/taste/fruity.webp' },
        { value: 'bold', title: 'Výrazná a horká', detail: 'Sila a hustá kréma', product: 'horke-zlato', photo: '/assets/jolka/taste/intense.webp' }
      ]
    },
    {
      key: 'prep',
      name: 'Príprava',
      title: 'Ako kávu pripravujete?',
      options: [
        { value: 'automat', title: 'Automatický kávovar', detail: 'Jedno tlačidlo', photo: '/assets/jolka/method/automat.webp' },
        { value: 'lever', title: 'Pákový kávovar', detail: 'Espresso ručne', photo: '/assets/jolka/method/lever.webp' },
        { value: 'moka', title: 'Moka alebo džezva', detail: 'Príprava na sporáku', photo: '/assets/jolka/method/moka.webp' },
        { value: 'filter', title: 'Filter alebo V60', detail: 'Prekvapkávanie', photo: '/assets/jolka/method/filter.webp' }
      ]
    },
    {
      key: 'drink',
      name: 'Nápoj',
      title: 'Pijete ju čiernu alebo s mliekom?',
      options: [
        { value: 'black', title: 'Čiernu', detail: 'Espresso alebo filter', photo: '/assets/jolka/method/black.webp' },
        { value: 'milk', title: 'S mliekom', detail: 'Cappuccino a latte', photo: '/assets/jolka/method/milk.webp' },
        { value: 'both', title: 'Striedam oboje', detail: 'Musí zvládnuť aj mlieko', photo: '/assets/jolka/method/both.webp' }
      ]
    },
    {
      key: 'acidity',
      name: 'Acidita',
      title: 'Koľko sviežej kyslosti znesiete?',
      options: [
        { value: 'none', title: 'Čo najmenej', detail: 'Kyslá káva mi nesedí', product: 'brazil-cerrado', dots: 0 },
        { value: 'mild', title: 'Jemnú', detail: 'Ak je decentná, nevadí', product: 'india-plantation', dots: 1 },
        { value: 'bright', title: 'Mám rád svieže', detail: 'Citrusy a ovocie vítam', product: 'ethiopia-sidamo', dots: 3 },
        { value: 'explore', title: 'Prekvapte ma', detail: 'Chcem niečo netradičné', product: 'jamaica-blue-mountain', glyph: 'explore' }
      ]
    }
  ];

  const chat = {
    welcome: 'Dobrý deň. Pomôžem vám nájsť kávu podľa toho, ako ju pijete a pripravujete.',
    cta: 'Pomôžte mi vybrať kávu',
    placeholder: 'Napíšte, akú kávu hľadáte…',
    chips: ['Nízka acidita', 'Káva na filter', 'Niečo netradičné', 'Bez kofeínu']
  };

  /** Deterministic answers used when /api/chat is unavailable. */
  const fallbacks = [
    { match: ['acidit', 'kysl', 'nekysl'], product: 'zmes-jolka', lead: 'Ak nechcete v šálke cítiť kyslosť, siahnite po' },
    { match: ['cappucc', 'mlie', 'latte', 'flat white', 'penu'], product: 'zmes-jolka', lead: 'Do mlieka sa najlepšie hodí' },
    { match: ['automat', 'kancel', 'práca', 'praca', 'firm'], product: '9-to-fine', lead: 'Do automatu a na väčšiu spotrebu je stavaná' },
    { match: ['filter', 'v60', 'chemex', 'french', 'prekvapk', 'zaliev'], product: 'ethiopia-sidamo', lead: 'Na filter odporúčam' },
    { match: ['ovocn', 'sviež', 'sviez', 'citrus', 'kvetin'], product: 'ethiopia-sidamo', lead: 'Z ovocných výberoviek je najvýraznejšia' },
    { match: ['netradičn', 'netradicn', 'zaujímav', 'zaujimav', 'objav', 'experiment', 'anaerob'], product: 'vietnam-lang-biang', lead: 'Najnetradičnejšia káva v ponuke je' },
    { match: ['bez kofe', 'bezkofe', 'decaf', 'večer', 'vecer'], product: 'decaf-etiopia', lead: 'Bez kofeínu má Jolka' },
    { match: ['čokolád', 'cokolad', 'orech', 'sladk', 'klasik'], product: 'zmes-cokolada', lead: 'Na čokoládovú klasiku je tu' },
    { match: ['espresso', 'páko', 'pako', 'krém', 'krem', 'siln', 'hork'], product: 'horke-zlato', lead: 'Na výrazné espresso sa hodí' },
    { match: ['darček', 'darcek', 'degust', 'ochutn', 'vzork'], product: 'jamaica-blue-mountain', lead: 'Ako darček alebo zážitok funguje' },
    { match: ['cena', 'koľko', 'kolko', 'stoj', 'draho', 'lacn'], product: 'zmes-jolka', lead: 'Ceny závisia od gramáže. Napríklad' }
  ];

  return { brand, acidityScale, prepLabels, products, steps, chat, fallbacks };
})();
