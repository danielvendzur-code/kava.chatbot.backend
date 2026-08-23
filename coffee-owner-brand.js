/**
 * Brand-aware owner presentation page.
 *
 * The page behind the widget is what the roastery owner reads first, so it is
 * built from that roastery's own catalogue, photography, palette and the
 * questions their customers actually ask. Everything here comes from data that
 * already exists in this repository (coffee-configs.js, the per-brand data
 * layers and the /assets photography), so no product, price or claim is
 * invented.
 *
 * This module owns the page. `coffee-owner-conversion.js` and
 * `coffee-usability-release.js` both step aside once `data-mcb-page` is set.
 */
(() => {
  'use strict';

  const SLUGS = ['praziarnicka', 'diamonds', 'kaffa', 'vitazov', 'concept', 'jolka'];

  const slug = String(
    window.__COFFEE_DEMO_SLUG__ ||
    window.COFFEE_DEMO_SLUG ||
    document.body.dataset.demo ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  ).replace('-v13', '');

  if (!SLUGS.includes(slug)) return;

  // Claimed immediately, before any rendering: the older generic renderers in
  // coffee-usability-release.js check this and step aside instead of painting a
  // page that would be replaced a frame later.
  window.__MCB_OWNER__ = true;

  const esc = (value = '') =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const icon = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const icons = {
    arrow: icon('M5 12h13m-5-6 6 6-6 6'),
    chat: icon('M5 5h14v10H9l-4 4V5Z'),
    cup: icon('M5 7h11v7a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7Zm11 2h2a2 2 0 0 1 0 4h-2M4 21h13'),
    check: icon('m5 12 4 4L19 6'),
    clock: icon('M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.2 2'),
    bag: icon('M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2'),
    code: icon('m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14'),
    minus: icon('M6 12h12'),
    spark: icon('M12 3l1.4 5.4L19 10l-5.6 1.6L12 17l-1.4-5.4L5 10l5.6-1.6L12 3Z')
  };

  /* ------------------------------------------------------------------ data */

  const BRANDS = {
    praziarnicka: {
      name: 'Pražiarnička',
      place: 'Pražiarnička by Caffè Vita',
      root: '.pz13-site',
      shop: 'https://praziarnicka.sk/eshop',
      lockup: '<img src="/brand/praziarnicka-logo-official.png" alt="Pražiarnička">',
      theme: { ink: '#143f35', brand: '#1c5b4b', accent: '#c25a2b', soft: '#edf6f2', paper: '#ffffff' },
      eyebrow: 'Ukážka pre Pražiarničku',
      headline: 'Zákazník Pražiarničky si <em>vyberie kávu sám</em>. Aj o jednej v noci.',
      lead: 'Poradca sa opýta na prípravu, chuť a to, či kávu pije s mliekom — a odporučí jednu konkrétnu kávu z vašej ponuky. Nie zoznam, nie odkaz na kategóriu. Jednu kávu a dôvod, prečo práve tú.',
      stage: { photo: '/assets/praziarnicka/prep-lever.webp', alt: 'Príprava espressa' },
      ask: 'Mám automat a nemám rád kyslú kávu. Čo by ste odporučili?',
      pick: { photo: '/assets/praziarnicka/official-paganini.jpg', name: 'Paganini blend', notes: 'čokoláda · mandle · orechy', price: 'od 11,90 €', fit: 92 },
      asks: ['Ktorá káva ide do automatu?', 'Nechcem kyslú kávu, čo mi dáte?', 'Máte niečo bez kofeínu na večer?'],
      answer: 'Odpovedá výhradne z vašich piatich káv. Kávu, ktorú nepražíte, neponúkne.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, jedna alternatíva a odkaz priamo na produkt.',
      shelf: [
        { photo: '/assets/praziarnicka/official-paganini.jpg', name: 'Paganini blend', note: '75 % arabica · 25 % robusta', price: 'od 11,90 €' },
        { photo: '/assets/praziarnicka/official-brazil.jpg', name: 'Brazil Santos', note: '100 % arabica, nízka acidita', price: 'od 9,90 €' },
        { photo: '/assets/praziarnicka/official-cuba.jpg', name: 'Cuba Serrano', note: 'kakao · tabak · vlašské orechy', price: 'od 12,90 €' },
        { photo: '/assets/praziarnicka/official-bezkofeinova.jpg', name: 'Bezkofeínová Brazil', note: 'jemná, dobrá na večer', price: 'od 12,90 €' }
      ]
    },

    diamonds: {
      name: 'Diamonds Roastery',
      place: 'Diamonds Roastery · Dunajská Lužná',
      root: '.diamonds-page',
      shop: 'https://diroastery.sk/kategoria-produktu/kava/',
      lockup: '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery">',
      theme: { ink: '#0b0d0c', brand: '#0b0d0c', accent: '#7d9e1f', soft: '#f2f6e8', paper: '#ffffff' },
      eyebrow: 'Ukážka pre Diamonds Roastery',
      headline: 'Vaša ponuka je široká. Zákazník potrebuje <em>jednu kávu</em>.',
      lead: 'Pôvod, spracovanie a chuťové poznámky sú pre vás bežná reč. Pre zákazníka sú to štyri rozhodnutia, ktoré nevie urobiť. Poradca ich premení na štyri jednoduché otázky a jedno odporúčanie.',
      stage: { photo: '/assets/diamonds/kenya-mugaya-official.jpg', alt: 'Káva Diamonds Roastery' },
      ask: 'Máte niečo ovocné na filter? V kávach sa až tak nevyznám.',
      pick: { photo: '/assets/diamonds/peru-valley-official.jpg', name: 'Peru Valley Coffee', notes: 'hruška · čokoláda · mandle', price: 'od 11,00 €', fit: 90 },
      asks: ['Máte niečo ovocné na filter?', 'Ktorá káva ide do automatu?', 'Čo znamená washed?'],
      answer: 'Odbornú terminológiu preloží do vety, ktorej zákazník rozumie — bez toho, aby ju zjednodušil na nezmysel.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, a priame pokračovanie do košíka.',
      shelf: [
        { photo: '/assets/diamonds/brazil-fazenda-official.jpg', name: 'Brazília Fazenda Pereira', note: 'sladká · čokoládová', price: 'od 10,00 €' },
        { photo: '/assets/diamonds/kenya-mugaya-official.jpg', name: 'Keňa Mugaya AB', note: 'svieža · ovocná · filter', price: 'od 16,00 €' },
        { photo: '/assets/diamonds/kumanday-official.jpg', name: 'Kolumbia Kumanday', note: 'jemná · sladká · citrus', price: 'od 11,00 €' },
        { photo: '/assets/diamonds/el-buho-official.jpg', name: 'El Buho Decaf', note: 'bez kofeínu · sladká', price: 'od 14,00 €' }
      ]
    },

    kaffa: {
      name: 'Kaffa Roastery',
      place: 'Kaffa Roastery · speciality coffee',
      root: '.kf-shell',
      shop: 'https://kaffaroastery.sk/',
      lockup: '<span class="mcb-wordmark"><b>KAFFA</b><small>SPECIALITY COFFEE BEANS</small></span>',
      theme: { ink: '#111111', brand: '#111111', accent: '#4a7f97', soft: '#f2ede4', paper: '#fcfbf8' },
      display: { family: 'Georgia, "Times New Roman", serif', weight: '400', tracking: '-.03em' },
      eyebrow: 'Ukážka pre Kaffa Roastery',
      headline: 'Výberová káva <em>bez odbornej bariéry</em>.',
      lead: 'Zákazník nevie, či chce washed alebo natural. Vie ale, že pije s mliekom a nemá rád kyslé. Poradca sa pýta na to druhé a odpovie prvým — konkrétnou kávou z vašej ponuky.',
      stage: { photo: '/assets/kaffa/brew-filter.webp', alt: 'Filtrovaná káva Kaffa' },
      ask: 'Pijem hlavne cappuccino. Čo z vašej ponuky mi sadne?',
      pick: { photo: '/assets/kaffa/mokka-official.webp', name: 'Mokka Espresso Blend', notes: 'kakao · mandle · škorica', price: 'od 11,90 €', fit: 93 },
      asks: ['Je Kamundu kyslá?', 'Čo mi sadne, keď pijem s mliekom?', 'Máte niečo bez kofeínu?'],
      answer: 'Ovocnosť a aciditu preloží do reči, ktorej zákazník rozumie, bez straty presnosti.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, a pokračovanie do košíka.',
      shelf: [
        { photo: '/assets/kaffa/mokka-official.webp', name: 'Mokka Espresso Blend', note: 'kakao · mandle · lieskovce', price: '11,90 – 32,13 €' },
        { photo: '/assets/kaffa/kamundu-official.webp', name: 'Kenya Kamundu Estate AA', note: 'ríbezle · malina · slivka', price: '13,98 €' },
        { photo: '/assets/kaffa/decaf-official.jpg', name: 'Finca El Diviso Decaf', note: 'vanilka · mandarínka · jazmín', price: '16,42 €' },
        { photo: '/assets/kaffa/wilder-lazo-official.webp', name: 'Wilder Lazo Stellar Origin', note: 'výberový mikrolot', price: '21,42 €' }
      ]
    },

    vitazov: {
      name: 'Káva Víťazov',
      place: 'Káva Víťazov · slovenská pražiareň, Prešov',
      root: '.demo-page',
      shop: 'https://kavavitazov.sk/obchod/',
      lockup: '<img src="/assets/vitazov-logo.svg" alt="Káva Víťazov">',
      theme: { ink: '#071f1a', brand: '#0c4438', accent: '#6f9c25', soft: '#eef7e2', paper: '#ffffff' },
      eyebrow: 'Ukážka pre Kávu Víťazov',
      headline: 'Káva domov, do kancelárie aj do automatu — <em>bez hádania</em>.',
      lead: 'Firma, ktorá kupuje kávu do kancelárie, hľadá niečo iné než človek, čo si robí espresso doma. Poradca sa na to opýta ako prvé a podľa toho vedie celý zvyšok rozhovoru.',
      stage: { photo: '/assets/vitazov-office.jpeg', alt: 'Office Blend Káva Víťazov' },
      ask: 'Kupujem kávu pre firmu, asi 15 ľudí. Čo odporúčate?',
      pick: { photo: '/assets/vitazov-office.jpeg', name: 'Office Blend', notes: 'čokoláda · karamel · pražené orechy', price: 'od 15,90 €', fit: 94 },
      asks: ['Aká káva do kancelárie?', 'Ktorá sa nestratí v mlieku?', 'Máte kávu na večer?'],
      answer: 'Rozlíši domácnosť, kanceláriu aj automat a podľa toho odporúča iný produkt.',
      steps: ['Použitie', 'Chuť', 'Príprava', 'Nápoj'],
      result: 'Jedna káva, dôvod prečo sedí, jedna alternatíva a odkaz na produkt.',
      shelf: [
        { photo: '/assets/vitazov-office.jpeg', name: 'Office Blend', note: 'čokoláda · karamel · bez kyslosti', price: 'od 15,90 €' },
        { photo: '/assets/vitazov-victory.jpeg', name: 'Victory Blend', note: '100 % arabica · kakao · korenie', price: 'od 17,90 €' },
        { photo: '/assets/vitazov-brazil.jpeg', name: 'Brazília', note: 'lieskové orechy · jemná', price: 'od 16,90 €' },
        { photo: '/assets/vitazov-decaf.jpeg', name: 'Bezkofeínová', note: 'bez kofeínu · na večer', price: 'od 17,90 €' }
      ]
    },

    concept: {
      name: 'Concept Coffee Roasters',
      place: 'Concept Coffee Roasters · Piešťany a Bratislava',
      root: '.concept-page',
      shop: 'https://www.conceptcoffee.sk/',
      lockup: '<img src="/brand/concept-official-logo.png" alt="Concept Coffee Roasters">',
      theme: { ink: '#1a1b19', brand: '#2c4038', accent: '#b8503c', soft: '#f4efe7', paper: '#fbfaf6' },
      eyebrow: 'Ukážka pre Concept Coffee Roasters',
      headline: 'Sezónna ponuka, ktorú zákazník pochopí <em>na prvý raz</em>.',
      lead: 'Loty sa menia, popisy sú komplexné a zákazník sa v nich stráca. Poradca hovorí o tom, čo máte teraz, a preloží chuťové poznámky na rozhodnutie, ktoré vie zákazník urobiť.',
      stage: { photo: '/assets/concept/product-berry-blast.jpg', alt: 'Sezónna káva Concept' },
      ask: 'Čo máte teraz čerstvé? Mám rád skôr ovocné kávy.',
      pick: { photo: '/assets/concept/product-weithaga.jpg', name: 'Weithaga AA – Keňa', notes: 'ríbezle · grep · vanilka', price: 'od 15,00 €', fit: 91 },
      asks: ['Čo máte teraz čerstvé?', 'Ktorá je najmenej kyslá?', 'Hodí sa Berry Blast do espressa?'],
      answer: 'Hovorí o aktuálnej sezónnej ponuke, nie o katalógu spred roka.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, a pokračovanie do košíka.',
      shelf: [
        { photo: '/assets/concept/product-weithaga.jpg', name: 'Weithaga AA – Keňa', note: 'washed · Nyeri · filter', price: 'od 15,00 €' },
        { photo: '/assets/concept/product-berry-blast.jpg', name: 'Berry Blast – Kolumbia', note: 'bobuľové ovocie · novinka', price: 'od 18,50 €' },
        { photo: '/assets/concept/product-holyshot.jpg', name: 'Holysh*t! espresso', note: 'signature espresso blend', price: 'od 17,50 €' },
        { photo: '/assets/concept/product-yellow-sunset.jpg', name: 'Yellow Sunset (decaf)', note: 'Kolumbia · Tolima · bez kofeínu', price: 'od 12,50 €' }
      ]
    },

    jolka: {
      name: 'Pražiareň Jolka',
      place: 'Pražiareň Jolka · Bratislava-Ružinov',
      root: '.page',
      shop: 'https://www.praziarenjolka.sk/eshop-kava/',
      lockup: '<img src="/assets/jolka/logo-ink.webp" alt="Pražiareň Jolka"><b>Pražiareň Jolka</b>',
      theme: { ink: '#23180f', brand: '#5e4834', accent: '#a8763f', soft: '#f3ece3', paper: '#fdfaf6' },
      display: { family: '"Playfair Display", Georgia, serif', weight: '600', tracking: '-.02em' },
      eyebrow: 'Ukážka pre Pražiareň Jolka',
      headline: 'Klasika, výberovka a vaše zmesi — <em>bez zdĺhavého vysvetľovania</em>.',
      lead: 'Časť zákazníkov chce istotu a minimálnu aciditu. Časť chce objavovať. Poradca zistí, do ktorej skupiny zákazník patrí, skôr než mu ukáže čokoľvek z ponuky.',
      stage: { photo: '/assets/jolka/hero-bags.webp', alt: 'Kávy Pražiarne Jolka' },
      ask: 'Robím si kávu v moke a nemám rád kyslé. Čo mi sadne?',
      pick: { photo: '/assets/jolka/zmes-jolka.webp', name: 'Zmes Jolka', notes: 'čokoláda · orechy · minimálna acidita', price: '13,50 € / 250 g', fit: 93 },
      asks: ['Ktorá má najnižšiu aciditu?', 'Čo si dám do cappuccina?', 'Aký je Vietnam Lang Biang?'],
      answer: 'Aciditu vysvetlí na stupnici, ktorú máte na vlastných obaloch.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Acidita'],
      result: 'Jedna káva, dôvod prečo sedí, a odkaz priamo do e-shopu.',
      shelf: [
        { photo: '/assets/jolka/zmes-jolka.webp', name: 'Zmes Jolka', note: 'house blend · nízka acidita', price: '13,50 € / 250 g' },
        { photo: '/assets/jolka/zmes-cokolada.webp', name: 'Zmes Čokoláda', note: 'sladká · čokoládová klasika', price: '13,50 € / 250 g' },
        { photo: '/assets/jolka/9-to-fine.webp', name: '9-to-Fine', note: 'plná · čokoládovo-orechová', price: '17,00 € / 500 g' },
        { photo: '/assets/jolka/horke-zlato.webp', name: 'Horké zlato', note: 'výraznejší profil', price: '14,00 € / 250 g' }
      ]
    }
  };

  const brand = BRANDS[slug];

  // Published so coffee-chat-starter.js can show the same three coffees inside
  // the widget without a second copy of the catalogue.
  window.__MCB_BRAND__ = { slug, ...brand };

  /* --------------------------------------------------------------- markup */

  const gains = [
    [icons.bag, 'Menej opustených košíkov', 'Nerozhodnutý zákazník väčšinou odíde. Poradca mu dá jednu konkrétnu kávu a dôvod, prečo práve tú — namiesto ďalšieho zoznamu na porovnávanie.'],
    [icons.chat, 'Menej otázok na váš tím', 'Otázky o acidite, mletí a príprave chodia stále dokola. Poradca ich vybaví za vás a vaši ľudia sa venujú praženiu a objednávkam.'],
    [icons.clock, 'Predaj aj mimo pracovných hodín', 'Objednávky chodia večer a cez víkend, keď nikto z tímu nie je pri telefóne. Poradca je v tom čase online.']
  ];

  const before = [
    'Zákazník otvorí ponuku a nevie, kde začať.',
    'Napíše správu na Instagram a čaká do rána.',
    'Porovnáva popisy, neurobí rozhodnutie a odíde.'
  ];

  const after = [
    'Za štyri kliknutia má jednu kávu a dôvod, prečo mu sadne.',
    'Odpoveď dostane hneď, v ktorúkoľvek hodinu.',
    'Z odporúčania vedie priama cesta do košíka.'
  ];

  const shelfCard = (item, index) => `
    <article class="mcb-card mcb-reveal" style="--i:${index}">
      <figure><img src="${esc(item.photo)}" alt="${esc(item.name)}" loading="lazy" decoding="async"></figure>
      <div class="mcb-card-body">
        <b>${esc(item.name)}</b>
        <span>${esc(item.note)}</span>
        <em>${esc(item.price)}</em>
      </div>
    </article>`;

  const markup = () => `
    <header class="mcb-head">
      <div class="mcb-wrap" style="display:flex;align-items:center;justify-content:space-between;gap:20px">
        <span class="mcb-lockup">${brand.lockup}</span>
        <span class="mcb-head-right">
          <span class="mcb-head-note"><i></i> Ukážka pripravená pre ${esc(brand.name)}</span>
          <a class="mcb-btn" href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Chcem to na svoj web ${icons.arrow}</a>
        </span>
      </div>
    </header>

    <main>
      <section class="mcb-wrap mcb-hero">
        <div class="mcb-hero-copy">
          <span class="mcb-eyebrow mcb-reveal">${esc(brand.eyebrow)}</span>
          <h1 class="mcb-reveal" style="--i:1">${brand.headline}</h1>
          <p class="mcb-lead mcb-reveal" style="--i:2">${esc(brand.lead)}</p>
          <div class="mcb-actions mcb-reveal" style="--i:3">
            <button class="mcb-btn mcb-btn--lg" type="button" data-release-open="advisor">Vyskúšať Výber kávy ${icons.arrow}</button>
            <button class="mcb-btn mcb-btn--ghost mcb-btn--lg" type="button" data-release-open="chat">Skúsiť Chat ${icons.chat}</button>
          </div>
          <ul class="mcb-facts mcb-reveal" style="--i:4">
            <li>${icons.clock} Odpovedá nonstop</li>
            <li>${icons.check} Pozná iba vaše kávy</li>
            <li>${icons.code} Jeden riadok kódu</li>
          </ul>
        </div>

        <div class="mcb-stage mcb-reveal" style="--i:2">
          <div class="mcb-stage-frame">
            <img src="${esc(brand.stage.photo)}" alt="${esc(brand.stage.alt)}" decoding="async">
          </div>
          <p class="mcb-ask"><small>Zákazník píše</small>${esc(brand.ask)}</p>
          <div class="mcb-pick" style="--mcb-fit:${brand.pick.fit}%">
            <img src="${esc(brand.pick.photo)}" alt="${esc(brand.pick.name)}" loading="lazy" decoding="async">
            <div class="mcb-pick-body">
              <small>Odporúčanie poradcu</small>
              <b>${esc(brand.pick.name)}</b>
              <span>${esc(brand.pick.notes)}</span>
              <span class="mcb-meter" aria-hidden="true"><i></i></span>
              <span class="mcb-pick-foot"><b>${esc(brand.pick.price)}</b><em>${icons.bag} Do košíka</em></span>
            </div>
          </div>
        </div>
      </section>

      <section class="mcb-wrap mcb-section">
        <div class="mcb-section-head mcb-reveal">
          <span class="mcb-eyebrow">Rozdiel</span>
          <h2>Čo sa na vašom webe zmení</h2>
        </div>
        <div class="mcb-shift">
          <div class="mcb-reveal" style="--i:1">
            <h3>${icons.minus} Dnes</h3>
            <ul>${before.map((line) => `<li>${icons.minus}<span>${esc(line)}</span></li>`).join('')}</ul>
          </div>
          <div class="is-after mcb-reveal" style="--i:2">
            <h3>${icons.check} S poradcom</h3>
            <ul>${after.map((line) => `<li>${icons.check}<span>${esc(line)}</span></li>`).join('')}</ul>
          </div>
        </div>
      </section>

      <section class="mcb-wrap mcb-section">
        <div class="mcb-section-head mcb-reveal">
          <span class="mcb-eyebrow">Váš katalóg</span>
          <h2>Poradca pozná vaše kávy, nie kávy vo všeobecnosti</h2>
          <p>Odporúča len z toho, čo naozaj pražíte. Ceny, profily aj balenia sedia s vaším e-shopom a menia sa spolu s ním.</p>
        </div>
        <div class="mcb-shelf">${brand.shelf.map(shelfCard).join('')}</div>
      </section>

      <section class="mcb-wrap mcb-section">
        <div class="mcb-section-head mcb-reveal">
          <span class="mcb-eyebrow">Ako to funguje</span>
          <h2>Dve cesty k tej istej káve</h2>
          <p>Zákazník si vyberie, ktorá mu sedí. Obe končia rovnako — jedným konkrétnym produktom.</p>
        </div>
        <div class="mcb-modes">
          <article class="mcb-mode mcb-reveal" style="--i:1">
            <header>
              <span class="mcb-mode-icon">${icons.chat}</span>
              <div><small>Prvá cesta</small><b>Chat</b></div>
            </header>
            <p>Zákazník sa pýta vlastnými slovami — tak, ako by sa spýtal vás cez pult.</p>
            <ul class="mcb-asks">${brand.asks.map((ask) => `<li>„${esc(ask)}“</li>`).join('')}</ul>
            <p class="mcb-reply"><i>${esc(brand.name.slice(0, 1))}</i><span>${esc(brand.answer)}<span class="mcb-dots" aria-hidden="true"><i></i><i></i><i></i></span></span></p>
          </article>
          <article class="mcb-mode mcb-reveal" style="--i:2">
            <header>
              <span class="mcb-mode-icon">${icons.cup}</span>
              <div><small>Druhá cesta</small><b>Výber kávy</b></div>
            </header>
            <p>Kto sa pýtať nechce, prejde štyri kroky s veľkými tlačidlami a fotografiami.</p>
            <ol class="mcb-steps">${brand.steps.map((step, i) => `<li><i>${i + 1}</i>${esc(step)}</li>`).join('')}</ol>
            <p class="mcb-mode-note">${esc(brand.result)}</p>
          </article>
        </div>
      </section>

      <section class="mcb-wrap mcb-section">
        <div class="mcb-section-head mcb-reveal">
          <span class="mcb-eyebrow">Čo z toho máte</span>
          <h2>Prečo to stojí za zavedenie</h2>
        </div>
        <div class="mcb-gains">
          ${gains.map(([mark, title, text], i) => `
            <article class="mcb-gain mcb-reveal" style="--i:${i}">
              <span>${mark}</span>
              <b>${esc(title)}</b>
              <p>${esc(text)}</p>
            </article>`).join('')}
        </div>
      </section>

      <section class="mcb-wrap mcb-section">
        <div class="mcb-install mcb-reveal">
          <div>
            <span class="mcb-eyebrow">Nasadenie</span>
            <h2>Jeden riadok vo vašom e-shope</h2>
            <p>Widget sa vkladá jedným skriptom — Shoptet, WooCommerce, Shopify aj vlastné riešenie. Do dizajnu e-shopu nezasahuje a dá sa kedykoľvek vypnúť.</p>
          </div>
          <pre class="mcb-code"><span>&lt;!-- ${esc(brand.name)} --&gt;</span>
&lt;script <b>src</b>="https://mojchatbot.sk/widget.js"
        <b>data-shop</b>="${esc(slug)}" defer&gt;&lt;/script&gt;</pre>
        </div>
      </section>

      <section class="mcb-wrap mcb-close mcb-reveal">
        <span class="mcb-eyebrow">Ďalší krok</span>
        <h2>Pozrite si ho tak, ako ho uvidí váš zákazník</h2>
        <p>Bublina vpravo dole je živá. Otvorte ju, prejdite výber a pozrite sa, kam vás dovedie.</p>
        <div class="mcb-actions" style="justify-content:center">
          <button class="mcb-btn mcb-btn--lg" type="button" data-release-open="advisor">Otvoriť poradcu ${icons.arrow}</button>
          <a class="mcb-btn mcb-btn--ghost mcb-btn--lg" href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Ozvať sa ${icons.arrow}</a>
        </div>
      </section>

      <footer class="mcb-wrap mcb-foot">
        <span>Ukážku pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a> · ${esc(brand.place)}</span>
        <a href="https://mojchatbot.sk/kontakt" target="_blank" rel="noreferrer">Kontakt ${icons.arrow}</a>
      </footer>
    </main>`;

  /* -------------------------------------------------------------- opening */

  const launchers = {
    praziarnicka: '#pz13-open', diamonds: '#launcherButton', kaffa: '#launcher',
    vitazov: '#openWidget', concept: '#openWidget', jolka: '#open'
  };
  const advisorButtons = {
    praziarnicka: '.pz13-mode button[data-mode="advisor"]',
    diamonds: '.mode-switch button[data-mode="advisor"]',
    kaffa: '.kf-switch button[data-view="advisor"],.kf-switch button[data-mode="advisor"]',
    vitazov: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    concept: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    jolka: '.mode__button[data-mode="advisor"]'
  };
  const chatButtons = {
    praziarnicka: '.pz13-mode button[data-mode="chat"]',
    diamonds: '.mode-switch button[data-mode="chat"]',
    kaffa: '.kf-switch button[data-view="chat"],.kf-switch button[data-mode="chat"]',
    vitazov: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    concept: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    jolka: '.mode__button[data-mode="chat"]'
  };

  function openMode(mode) {
    const launcher = document.querySelector(launchers[slug]);
    if (launcher && launcher.offsetParent !== null) launcher.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector(mode === 'advisor' ? advisorButtons[slug] : chatButtons[slug])?.click();
    }));
  }

  /* ---------------------------------------------------------- scroll lock */

  // Each demo locks page scrolling while its widget dialog is open, and the
  // focus trap depends on that lock. The presentation page is scrollable, so it
  // marks the body while a dialog is open and hands the lock back.
  const OPEN_DIALOG = '#widget[aria-hidden="false"], #pz13-widget[aria-hidden="false"], ' +
    '.kf-panel[aria-hidden="false"], .widget[aria-hidden="false"], ' +
    '.widget.is-open, .kf-widget.is-open, .pz13-widget.is-open';

  function watchDialog() {
    const sync = () => {
      document.body.classList.toggle('mcb-dialog-open', Boolean(document.querySelector(OPEN_DIALOG)));
    };
    // classList.toggle is a no-op when the state already matches, so this
    // observer cannot retrigger itself through the class it sets.
    new MutationObserver(sync).observe(document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['aria-hidden', 'class']
    });
    sync();
  }

  /* --------------------------------------------------------------- render */

  // Ranked last, behind coffee-usability-release.css (10) and
  // coffee-widget-final.css (20), so the page styling wins without any of the
  // observer ping-pong those two used to run.
  const attachStyle = () => {
    if (document.querySelector('link[data-mcb-style]')) return;

    // Widget-level corrections that used to ride along with the generic page:
    // image sizing inside the panels and the Prazarnicka header treatment.
    const cleanup = document.createElement('link');
    cleanup.rel = 'stylesheet';
    cleanup.href = '/coffee-header-cleanup.css';
    cleanup.dataset.coffeeHeaderCleanup = 'true';
    cleanup.dataset.mcOrder = '25';
    document.body.appendChild(cleanup);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/coffee-owner-brand.css';
    link.dataset.mcbStyle = 'true';
    link.dataset.mcOrder = '30';
    document.body.appendChild(link);

    const orderStyles = () => {
      const ranked = [...document.body.querySelectorAll('link[rel="stylesheet"][data-mc-order]')];
      const sorted = [...ranked].sort((a, b) => Number(a.dataset.mcOrder) - Number(b.dataset.mcOrder));
      const settled = ranked.every((node, index) => node === sorted[index]) &&
        document.body.lastElementChild === sorted.at(-1);
      if (!settled) sorted.forEach((node) => document.body.appendChild(node));
    };
    [0, 120, 500, 1400].forEach((delay) => setTimeout(orderStyles, delay));
    addEventListener('load', orderStyles, { once: true });
  };

  function applyTheme(root) {
    const t = brand.theme;
    root.style.setProperty('--mcb-ink', t.ink);
    root.style.setProperty('--mcb-brand', t.brand);
    root.style.setProperty('--mcb-accent', t.accent);
    root.style.setProperty('--mcb-soft', t.soft);
    root.style.setProperty('--mcb-paper', t.paper);
    if (brand.display) {
      root.style.setProperty('--mcb-display', brand.display.family);
      root.style.setProperty('--mcb-display-weight', brand.display.weight);
      root.style.setProperty('--mcb-display-tracking', brand.display.tracking);
    }
    // The page background has to match, or the brand tint stops at the root edge.
    document.documentElement.style.setProperty('--mcb-paper', t.paper);
    document.body.style.setProperty('--mcb-paper', t.paper);
  }

  function findRoot() {
    return document.querySelector(brand.root) ||
      document.querySelector('[data-owner-page="true"]') ||
      document.querySelector('.mc-owner');
  }

  function animate(root) {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = root.querySelectorAll('.mcb-reveal, .mcb-stage');
    if (still || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach((el) => observer.observe(el));
  }

  function render() {
    const root = findRoot();
    if (!root || root.dataset.mcbPage === 'true') return Boolean(root);

    attachStyle();
    root.dataset.mcbPage = 'true';
    // Drop every earlier owner-page class so none of the older !important
    // layers keep the root locked to a single clipped viewport.
    root.className = 'mcb-page';
    root.removeAttribute('style');
    applyTheme(root);
    root.innerHTML = markup();

    const primary = root.querySelector('[data-release-open="advisor"]');
    if (primary) primary.id = slug === 'praziarnicka' ? 'pz13-hero-open' : 'heroOpen';

    root.querySelectorAll('[data-release-open]').forEach((button) => {
      button.addEventListener('click', () => openMode(button.dataset.releaseOpen));
    });

    animate(root);
    watchDialog();
    return true;
  }

  // The widget's own empty state is filled by a separate module, loaded once the
  // catalogue above is published on window.
  if (!document.querySelector('script[data-mcs-starter]')) {
    const starter = document.createElement('script');
    starter.src = '/coffee-chat-starter.js';
    starter.dataset.mcsStarter = 'true';
    starter.async = false;
    document.body.appendChild(starter);
  }

  // Every brand runtime builds its page asynchronously, so wait for the root.
  if (!render()) {
    let queued = false;
    const observer = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (render()) observer.disconnect();
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
