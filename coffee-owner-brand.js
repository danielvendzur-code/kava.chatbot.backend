/**
 * The page the roastery owner opens.
 *
 * It is one screen, no scrolling: what the advisor does, the price, and a
 * direct way to respond. The page is intentionally short because the owner
 * should understand the offer before opening the widget.
 */
(() => {
  'use strict';

  const slug = String(
    window.__COFFEE_DEMO_SLUG__ ||
    window.COFFEE_DEMO_SLUG ||
    document.body.dataset.demo ||
    (location.pathname.includes('jolka') ? 'jolka' : '')
  ).replace('-v13', '');


  const esc = (value = '') =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const icon = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const icons = {
    arrow: icon('M5 12h13m-5-6 6 6-6 6'),
    dot: '<svg viewBox="0 0 8 8" aria-hidden="true"><circle cx="4" cy="4" r="3" fill="currentColor"/></svg>',
    chat: icon('M5 5h14v10H9l-4 4V5Z'),
    check: icon('m5 12 4 4L19 6'),
    mail: icon('M3 7h18v10H3V7Zm0 0 9 6 9-6')
  };

  /* --------------------------------------------------------------- pricing */

  /* One offer, written the way it is quoted on the phone: each sum says what
     it buys. The feature list it replaced said things like "Váš katalóg
     pripravený pri spustení", which is a sentence nobody would say out loud. */
  /* The offer sheet behind "Mám záujem" listed what the owner gets, but the page
     itself said none of it, so the history and the deployment never reached
     anyone who did not click. Four of them sit under the buttons instead. */
  /* Approved on Pražiarnička's own page, then switched on for the rest. */
  const V2 = { has: () => true };

  const KEEPS = [
    ['Odpovedá aj o polnoci', 'aj cez víkend, bez vás'],
    ['História konverzácií', 'vidíte, na čo sa zákazníci pýtajú'],

    ['Nasadenie za vás', 'na web vložíte jeden riadok kódu']
  ];

  const PRICING = {
    sums: [
      ['247', 'jednorazovo', 'nastavenie a naplnenie vašimi kávami'],
      ['10', 'mesačne', 'prevádzka, zmeny v ponuke, opravy']
    ],
    trial: 'Prvý mesiac zdarma',
    note: 'Bez viazanosti, vypnete kedykoľvek.',
    // Only in the sheet: the strip stays short enough to read at a glance.
    addon: 'Napojenie na košík za príplatok.',
    // The sheet behind "Mám záujem" is the long version of the same offer.
    included: [
      ['Chatbot s vašimi kávami', 'Vaše kávy, ceny a odkazy do e-shopu, nie všeobecné odpovede.'],
      ['Odpovedá aj o polnoci', 'Pôvod, praženie, príprava aj porovnanie dvoch káv.'],
      ['Výber cez štyri otázky', 'Chuť, príprava, nápoj a kofeín — na konci jedna konkrétna káva.'],

      ['Vidíte, na čo sa pýtajú', 'História konverzácií, aj otázky, na ktoré ponuka neodpovedá.'],
      ['Nasadenie za vás', 'Vložíte na web jeden riadok kódu, o zvyšok sa postaráme.']
    ]
  };

  /* ------------------------------------------------------------------ data */

  /* Read from the owner's side: what the chatbot takes off his hands, not a
     description of the interface. */
  const commonFigures = () => [
    ['24/7', 'odpovedá za vás'],
    ['4', 'otázky k výberu'],
    ['1', 'káva na konci']
  ];

  const BRANDS = {
    praziarnicka: {
      name: 'Pražiarnička',
      place: 'Pražiarnička by Caffè Vita',
      root: '.pz13-site',
      shop: 'https://praziarnicka.sk/eshop',
      lockup: '<img src="/brand/praziarnicka-logo-official.png" alt="Pražiarnička">',
      theme: { ink: '#143f35', brand: '#1c5b4b', accent: '#c25a2b', soft: '#edf6f2', paper: '#ffffff' },
      hero: '/assets/praziarnicka/official-paganini.jpg',
      figures: commonFigures()
    },

    diamonds: {
      name: 'Diamonds Roastery',
      place: 'Diamonds Roastery · Dunajská Lužná',
      root: '.diamonds-page',
      shop: 'https://diroastery.sk/kategoria-produktu/kava/',
      lockup: '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery">',
      theme: { ink: '#0b0d0c', brand: '#0b0d0c', accent: '#6f8f19', soft: '#f2f6e8', paper: '#ffffff' },
      hero: '/assets/diamonds/kenya-mugaya-official.jpg',
      figures: commonFigures()
    },

    kaffa: {
      name: 'Kaffa Roastery',
      place: 'Kaffa Roastery · speciality coffee',
      mark: { text: 'K', font: 'Georgia, "Times New Roman", serif' },
      root: '.kf-shell',
      shop: 'https://kaffaroastery.sk/',
      lockup: '<span class="mcb-wordmark"><b>KAFFA</b><small>SPECIALITY COFFEE BEANS</small></span>',
      theme: { ink: '#111111', brand: '#111111', accent: '#3d7d97', soft: '#f2ede4', paper: '#fcfbf8' },
      display: { family: 'Georgia, "Times New Roman", serif', weight: '400', tracking: '-.03em' },
      hero: '/assets/kaffa/mokka-hero.webp',
      figures: commonFigures()
    },

    vitazov: {
      name: 'Káva Víťazov',
      place: 'Káva Víťazov · Prešov',
      root: '.demo-page',
      shop: 'https://kavavitazov.sk/obchod/',
      lockup: '<img src="/assets/vitazov-logo.svg" alt="Káva Víťazov">',
      theme: { ink: '#071f1a', brand: '#0c4438', accent: '#5f8a1f', soft: '#eef7e2', paper: '#ffffff' },
      hero: '/assets/vitazov-office.jpeg',
      figures: commonFigures()
    },

    concept: {
      name: 'Concept Coffee Roasters',
      place: 'Concept Coffee Roasters · Piešťany a Bratislava',
      mark: { text: 'C', font: '"DM Sans", system-ui, sans-serif' },
      root: '.concept-page',
      shop: 'https://www.conceptcoffee.sk/',
      lockup: '<img src="/brand/concept-official-logo.png" alt="Concept Coffee Roasters">',
      theme: { ink: '#1a1b19', brand: '#2c4038', accent: '#b8503c', soft: '#f4efe7', paper: '#fbfaf6' },
      hero: '/assets/concept/product-yellow-sunset.jpg',
      figures: commonFigures()
    },

    jolka: {
      name: 'Pražiareň Jolka',
      place: 'Pražiareň Jolka · Bratislava-Ružinov',
      root: '.page',
      shop: 'https://www.praziarenjolka.sk/eshop-kava/',
      lockup: '<img src="/assets/jolka/logo-ink.webp" alt="Pražiareň Jolka"><b>Pražiareň Jolka</b>',
      theme: { ink: '#23180f', brand: '#5e4834', accent: '#a8763f', soft: '#f3ece3', paper: '#fdfaf6' },
      display: { family: '"Playfair Display", Georgia, serif', weight: '600', tracking: '-.02em' },
      hero: '/assets/jolka/hero-bags.webp',
      figures: commonFigures()
    },

    goriffee: {
      name: "Goriffee roastery",
      place: "Goriffee roastery · Bratislava",
      root: '.goriffee-page',
      shop: "https://www.goriffee.com/shop/kava/",
      lockup: '<img src="/assets/goriffee/logo.svg" alt="Goriffee roastery">',
      theme: { ink: '#121212', brand: '#121212', accent: '#e01a37', soft: '#f3efeb', paper: '#fffdfb' },
      hero: '/assets/goriffee/hero.jpg',
      figures: commonFigures()
    },

    readyafter: {
      name: "Ready After",
      place: "Ready After · Bošany",
      root: '.readyafter-page',
      shop: "https://www.readyafter.sk/zrnkova-kava/",
      lockup: '<img src="/assets/readyafter/logo.png" alt="Ready After">',
      theme: { ink: '#1c1c1c', brand: '#e41d19', accent: '#e41d19', soft: '#f6f1ef', paper: '#fffdfc' },
      hero: '/assets/readyafter/hero.jpg',
      figures: commonFigures()
    },

    coffeesheep: {
      name: "Coffee Sheep",
      place: "Coffee Sheep · Trenčín",
      root: '.coffeesheep-page',
      shop: "https://www.coffeesheep.sk/kava/",
      lockup: '<img src="/assets/coffeesheep/logo.svg" alt="Coffee Sheep">',
      theme: { ink: '#3a2a16', brand: '#583408', accent: '#a8442b', soft: '#f4ede2', paper: '#fffdf8' },
      hero: '/assets/coffeesheep/hero.jpg',
      figures: commonFigures()
    },

    zlatezrnko: {
      name: "Zlaté Zrnko",
      place: "Zlaté Zrnko · Ivanka pri Dunaji",
      root: '.zlatezrnko-page',
      shop: "https://zlatezrnko.sk/obchod/",
      lockup: '<img src="/assets/zlatezrnko/logo.png" alt="Zlaté Zrnko">',
      theme: { ink: '#2e2113', brand: '#3a2a12', accent: '#c8891f', soft: '#f6efe2', paper: '#fffdf8' },
      hero: '/assets/zlatezrnko/hero.jpg',
      figures: commonFigures()
    },

    becafe: {
      name: "Be:Café",
      place: "Be:Café · Lietavská Lúčka",
      root: '.becafe-page',
      shop: "https://becafe.sk/kategoria-produktu/kava/",
      lockup: '<img src="/assets/becafe/logo.svg" alt="Be:Café">',
      theme: { ink: '#151310', brand: '#121212', accent: '#b3860d', soft: '#faf3d8', paper: '#fffefa' },
      hero: '/assets/becafe/hero.jpg',
      figures: commonFigures()
    },

    simplecoffee: {
      name: "Simple Coffee",
      place: "Simple Coffee · Bratislava",
      root: '.simplecoffee-page',
      shop: "https://simplecoffee.sk/kategorie/zrnkova-kava/",
      lockup: '<img src="/assets/simplecoffee/logo.png" alt="Simple Coffee">',
      theme: { ink: '#24262b', brand: '#24262b', accent: '#9a7c46', soft: '#f7f0e4', paper: '#fffaf4' },
      hero: '/assets/simplecoffee/hero.jpg',
      figures: commonFigures()
    },

    ebenica: {
      name: "EBENICA Coffee",
      place: "EBENICA Coffee · Modra",
      root: '.ebenica-page',
      shop: "https://ebenica.sk/kategoria-produktu/kava/",
      lockup: '<img src="/assets/ebenica/logo.png" alt="EBENICA Coffee">',
      theme: { ink: '#1a201a', brand: '#18211a', accent: '#467c45', soft: '#eaf2e9', paper: '#fbfdfa' },
      hero: '/assets/ebenica/hero.jpg',
      figures: commonFigures()
    },

    casadelcaffe: {
      name: "Casa del Caffé",
      place: "Casa del Caffé · Bratislava",
      root: '.casadelcaffe-page',
      shop: "https://casadelcaffe.sk/kategoria-produktu/kava/",
      lockup: '<img src="/assets/casadelcaffe/logo.png" alt="Casa del Caffé">',
      theme: { ink: '#221c14', brand: '#1c1a17', accent: '#a8823f', soft: '#f5efe3', paper: '#fffdf9' },
      hero: '/assets/casadelcaffe/hero.jpg',
      figures: commonFigures()
    },

    coffeeveronia: {
      name: "Coffee Veronia",
      place: "Coffee Veronia · Trnava",
      root: '.coffeeveronia-page',
      shop: "https://www.coffeeveronia.sk/arabika/",
      lockup: '<img src="/assets/coffeeveronia/logo.png" alt="Coffee Veronia">',
      theme: { ink: '#231a12', brand: '#231a12', accent: '#6c3608', soft: '#f6ece0', paper: '#fffdf9' },
      hero: '/assets/coffeeveronia/hero.jpg',
      figures: commonFigures()
    },

    grandroastery: {
      name: "Grand Roastery",
      place: "Grand Roastery · Bardejovské Kúpele",
      root: '.grandroastery-page',
      shop: "https://www.grandroastery.sk/cerstvo-prazena-kava-1",
      lockup: '<img src="/assets/grandroastery/logo.png" alt="Grand Roastery">',
      theme: { ink: '#1b1b1b', brand: '#161616', accent: '#14907a', soft: '#e8f4f0', paper: '#fdfefd' },
      hero: '/assets/grandroastery/hero.jpg',
      figures: commonFigures()
    },

    coffeein: {
      name: "COFFEEIN",
      place: "COFFEEIN · Šahy",
      root: '.coffeein-page',
      shop: "https://www.coffeein.sk/kategoria/2/cerstvo-prazena-zrnkova-kava/1/",
      lockup: '<img src="/assets/coffeein/logo.png" alt="COFFEEIN">',
      theme: { ink: '#1c1a19', brand: '#1e1c1b', accent: '#d4591f', soft: '#fdeee4', paper: '#fffdfb' },
      hero: '/assets/coffeein/hero.jpg',
      figures: commonFigures()
    },

    kavoholik: {
      name: "Kávoholik",
      place: "Kávoholik · vlastná pražiareň",
      root: '.kavoholik-page',
      shop: "https://kavoholik.sk/12-e-shop",
      lockup: '<img src="/assets/kavoholik/logo.png" alt="Kávoholik">',
      theme: { ink: '#1d1a17', brand: '#1d1a17', accent: '#5f7d21', soft: '#eef3e3', paper: '#fdfdfa' },
      hero: '/assets/kavoholik/hero.jpg',
      figures: commonFigures()
    }
  };

  /* The skincare pages say something about the shop they were built for; the
     roasteries all said the same sentence. A brand that carries its own
     headline and lead uses them, and these stay as the fallback. */
  /* Headline and lead are the same on every page. The lead used to open with
     a sentence about the shop's catalogue, which took two lines to say what
     the visitor cannot tell apart and never got round to the chatbot. */
  const HEADING = 'Poradí zákazníkovi kávu a odpovie mu na otázky.';
  const LEAD = 'Chatbot odpovie zákazníkovi na otázky o vašich kávach. Cez štyri otázky ' +
    'mu vyberie tú, ktorá mu sadne, a pošle ho rovno na ňu. Predáte aj vtedy, keď pri tom nie ste.';

  /* The brand table is the only list of roasteries this file keeps. A slug it
     does not know belongs to some other page, and the claim below must not be
     made on that page's behalf. */
  const brand = BRANDS[slug];
  if (!brand) return;

  // Claimed here, before any rendering: the older generic renderers in
  // coffee-usability-release.js check this and step aside instead of painting a
  // page that would be replaced a frame later.
  window.__MCB_OWNER__ = true;

  // Published so the widget-side modules can reuse the same brand facts.
  window.__MCB_BRAND__ = { slug, ...brand };

  /* ---------------------------------------------------------- contact link */

  function contactHref() {
    const params = new URLSearchParams({
      source: `coffee-demo-${slug}`,
      company: brand.name,
      web: brand.shop,
      demo: location.href
    });
    return `https://mojchatbot.sk/kontakt?${params.toString()}`;
  }

  /* --------------------------------------------------------------- markup */

  /* Both sums, each with the sentence that says what it buys, then the terms
     and the one place on the page where the owner can answer. */
  const priceCard = (contact) => `
    <article class="mcb-price">
      ${PRICING.sums.map(([sum, term, buys]) => `
        <div class="mcb-price-sum">
          <b>${esc(sum)}&nbsp;€</b><span>${esc(term)}</span>
          <small>${esc(buys)}</small>
        </div>`).join('')}
      <div class="mcb-price-terms">
        <b>${esc(PRICING.trial)}</b>
        <p>${esc(PRICING.note)}</p>
        <a class="mcb-btn mcb-btn--accent" href="${contact}" target="_blank" rel="noreferrer">
          ${icons.mail} Ozvite sa mi
        </a>
      </div>
    </article>`;

  const markup = () => {
    const contact = esc(contactHref());
    return `
    <header class="mcb-head">
      <span class="mcb-lockup">${brand.lockup}</span>
      <button class="mcb-btn mcb-btn--sm" type="button" data-mcb-offer="open" aria-haspopup="dialog">
        Mám záujem ${icons.arrow}
      </button>
    </header>

    <div class="mcb-offer" data-mcb-offer="sheet" role="dialog" aria-modal="true"
         aria-label="Čo dostanete" hidden>
      <div class="mcb-offer-card">
        <button class="mcb-offer-close" type="button" data-mcb-offer="close" aria-label="Zavrieť">×</button>
        <span class="mcb-offer-kicker">Čo dostanete</span>
        <h2>Kávový chatbot pre ${esc(brand.name)}</h2>
        <ul>
          ${PRICING.included.map(([title, note]) => `
            <li>${icons.dot}<span><b>${esc(title)}</b><small>${esc(note)}</small></span></li>`).join('')}
        </ul>
        <div class="mcb-offer-price">
          <b>${esc(PRICING.trial)}</b>
          <p>${PRICING.sums.map(([sum, term]) =>
            `<strong>${esc(sum)}&nbsp;€</strong> <span>${esc(term)}</span>`).join(' <i>·</i> ')}</p>
          <small>${esc(PRICING.note)} ${esc(PRICING.addon)}</small>
        </div>
        <a class="mcb-btn mcb-btn--accent" href="${contact}" target="_blank" rel="noreferrer">
          ${icons.mail} Chcem to na svoj web
        </a>
      </div>
    </div>

    <main class="mcb-main">
      <section class="mcb-copy">
        <span class="mcb-eyebrow">Chatbot pre váš e-shop</span>
        <h1>${esc(HEADING)}</h1>

        <div class="mcb-actions">
          <button class="mcb-btn" type="button" data-release-open="advisor">Otvoriť poradcu ${icons.arrow}</button>
          <button class="mcb-btn mcb-btn--ghost" type="button" data-release-open="chat">Skúsiť chat ${icons.chat}</button>
        </div>
      </section>

      <div class="mcb-frame">
        <div class="mcb-visual">
          <img src="${esc(brand.hero)}" alt="${esc(brand.name)} – produktová prezentácia" referrerpolicy="no-referrer"
               onerror="this.closest('.mcb-visual')?.setAttribute('data-image-failed','true')">
        </div>
        <ul class="mcb-keeps mcb-keeps--side">
          ${KEEPS.map(([title, note]) => `
            <li><span><b>${esc(title)}</b><small>${esc(note)}</small></span></li>`).join('')}
        </ul>
      </div>

    </main>

    <section class="mcb-pricing" aria-label="Cena">
      ${priceCard(contact)}
    </section>

    <footer class="mcb-foot">
      <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ${icons.arrow}</a>
      <span>Ukážka riešenia pre ${esc(brand.name)}</span>
    </footer>`;
  };

  /* -------------------------------------------------------------- opening */

  const launchers = {
    praziarnicka: '#open,#pz13-open', diamonds: '#open,#launcherButton', kaffa: '#open,#launcher',
    vitazov: '#open,#openWidget', concept: '#open,#openWidget', jolka: '#open'
  };
  const advisorButtons = {
    praziarnicka: '.mode__button[data-mode="advisor"],.pz13-mode button[data-mode="advisor"]',
    diamonds: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    kaffa: '.mode__button[data-mode="advisor"],.kf-switch button[data-view="advisor"],.kf-switch button[data-mode="advisor"]',
    vitazov: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    concept: '.mode__button[data-mode="advisor"],.mode-switch button[data-mode="advisor"]',
    jolka: '.mode__button[data-mode="advisor"]'
  };
  const chatButtons = {
    praziarnicka: '.mode__button[data-mode="chat"],.pz13-mode button[data-mode="chat"]',
    diamonds: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    kaffa: '.mode__button[data-mode="chat"],.kf-switch button[data-view="chat"],.kf-switch button[data-mode="chat"]',
    vitazov: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    concept: '.mode__button[data-mode="chat"],.mode-switch button[data-mode="chat"]',
    jolka: '.mode__button[data-mode="chat"]'
  };

  function openMode(mode) {
    const launcher = document.querySelector(launchers[slug] || '#open');
    if (launcher && launcher.offsetParent !== null) launcher.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const selector = mode === 'advisor'
        ? advisorButtons[slug] || '.mode__button[data-mode="advisor"]'
        : chatButtons[slug] || '.mode__button[data-mode="chat"]';
      document.querySelector(selector)?.click();
    }));
  }

  /* ---------------------------------------------------------- scroll lock */

  const OPEN_DIALOG = '#widget[aria-hidden="false"], #pz13-widget[aria-hidden="false"], ' +
    '.kf-panel[aria-hidden="false"], .widget[aria-hidden="false"], ' +
    '.widget.is-open, .kf-widget.is-open, .pz13-widget.is-open';

  function watchDialog() {
    const sync = () => {
      document.body.classList.toggle('mcb-dialog-open', Boolean(document.querySelector(OPEN_DIALOG)));
    };
    new MutationObserver(sync).observe(document.documentElement, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['aria-hidden', 'class']
    });
    sync();
  }

  /* --------------------------------------------------------------- render */

  const attachStyle = () => {
    if (document.querySelector('link[data-mcb-style]')) return;

    const cleanup = document.createElement('link');
    cleanup.rel = 'stylesheet';
    cleanup.href = '/coffee-header-cleanup.css?v=e64c70d2';
    cleanup.dataset.coffeeHeaderCleanup = 'true';
    cleanup.dataset.mcOrder = '25';
    document.body.appendChild(cleanup);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/coffee-owner-brand.css?v=78eccfea';
    link.dataset.mcbStyle = 'true';
    link.dataset.mcOrder = '30';
    document.body.appendChild(link);

    const sales = document.createElement('link');
    sales.rel = 'stylesheet';
    sales.href = '/coffee-owner-sales-polish.css?v=7787f148';
    sales.dataset.mcbSalesStyle = 'true';
    sales.dataset.mcOrder = '40';
    document.body.appendChild(sales);

    const refresh = document.createElement('link');
    refresh.rel = 'stylesheet';
    refresh.href = '/coffee-refresh.css?v=20260909d';
    refresh.dataset.mcbRefreshStyle = 'true';
    refresh.dataset.mcOrder = '95';
    document.body.appendChild(refresh);

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
    document.documentElement.style.setProperty('--mcb-paper', t.paper);
    document.body.style.setProperty('--mcb-paper', t.paper);
  }

  function findRoot() {
    return document.querySelector(`.page.${slug}-page`) ||
      document.querySelector(brand.root) ||
      document.querySelector('[data-owner-page="true"]') ||
      document.querySelector('.mc-owner') ||
      document.querySelector('.page');
  }

  function render() {
    const root = findRoot();
    if (!root || root.dataset.mcbPage === 'true') return Boolean(root);

    attachStyle();
    root.dataset.mcbPage = 'true';
    root.className = 'mcb-page';
    /* The reworked hero is switched on one demo at a time: the roastery sees it
       on its own page first, and the rest follow once it is approved. */
    if (V2.has(slug)) root.dataset.mcbV2 = 'true';
    root.removeAttribute('style');
    applyTheme(root);
    root.innerHTML = markup();

    const primary = root.querySelector('[data-release-open="advisor"]');
    if (primary) primary.id = slug === 'praziarnicka' ? 'pz13-hero-open' : 'heroOpen';

    root.querySelectorAll('[data-release-open]').forEach((button) => {
      button.addEventListener('click', () => openMode(button.dataset.releaseOpen));
    });

    const sheet = root.querySelector('[data-mcb-offer="sheet"]');
    const setOffer = (open) => {
      sheet.hidden = !open;
      document.body.classList.toggle('mcb-offer-open', open);
      if (open) sheet.querySelector('[data-mcb-offer="close"]').focus();
    };
    root.querySelectorAll('[data-mcb-offer="open"]').forEach((b) => b.addEventListener('click', () => setOffer(true)));
    root.querySelectorAll('[data-mcb-offer="close"]').forEach((b) => b.addEventListener('click', () => setOffer(false)));
    sheet.addEventListener('click', (event) => { if (event.target === sheet) setOffer(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !sheet.hidden) setOffer(false); });

    requestAnimationFrame(() => root.classList.add('is-in'));
    watchDialog();
    return true;
  }

  const usesCleanJolkaWidget = document.documentElement.dataset.coffeeReleaseReady === 'true';
  if (!usesCleanJolkaWidget && !document.querySelector('script[data-mcb-widget]')) {
    const polish = document.createElement('script');
    polish.src = '/coffee-widget-polish.js?v=a6b2ac52';
    polish.dataset.mcbWidget = 'true';
    polish.async = false;
    document.body.appendChild(polish);
  }

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
