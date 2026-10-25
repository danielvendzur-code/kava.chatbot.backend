/**
 * Izolovaná kópia schválenej stránky majiteľa (coffee-owner-brand.js) pre novú dávku.
 * Rovnaké rozloženie a štýly; iná je iba ponuka: 447 € jednorazovo + 10 € mesačne, bez skúšobného
 * obdobia, bez nepreukázanej „Histórie konverzácií“ a bez pevného počtu otázok. Značky sa berú
 * z n447/data/<slug>.js; staré ukážky tento súbor nenačítavajú.
 *
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


  /* Nové texty ponuky po česky pre české firmy (ostatné preloží schválený lang-cs.js). */
  const CS = ((window.N447_DATA || {})[slug] || {}).lang === 'cs';
  const L = (sk, cs) => CS ? cs : sk;

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
    ['Pozná vašu ponuku', 'pracuje s vašimi kávami a cenami'],
    ['Výber podľa vašich potrieb', 'na konci jedna konkrétna káva'],
    [L('Rozpočet na celý nákup', 'Rozpočet na celý nákup'), L('káva aj doplnok spolu v rámci sumy', 'káva i doplněk dohromady v rámci částky')]
  ];

  const PRICING = {
    sums: [
      ['447', 'jednorazovo', L('príprava poradcu pre váš sortiment a nasadenie na e-shop', 'příprava poradce pro váš sortiment a nasazení na e-shop')],
      ['10', 'mesačne', 'prevádzka']
    ],
    trial: L('Nastavenie pre vašu značku', 'Nastavení pro vaši značku'),
    note: L('Otázky podľa skutočných rozdielov vašich káv a úplné odporúčanie s odkazom na produkt.', 'Otázky podle skutečných rozdílů vašich káv a úplné doporučení s odkazem na produkt.'),
    // Only in the sheet: the strip stays short enough to read at a glance.
    addon: 'Preklik na produkt alebo napojenie na košík za príplatok.',
    // The sheet behind "Mám záujem" is the long version of the same offer.
    included: [
      ['Chatbot s vašimi kávami', 'Vaše kávy a ceny, nie všeobecné odpovede.'],
      ['Odpovedá aj o polnoci', 'Pôvod, praženie, príprava aj porovnanie dvoch káv.'],
      ['Výber podľa vašich potrieb', L('Príprava, chuť a skutočné rozdiely vašich káv — na konci jedna konkrétna káva.', 'Příprava, chuť a skutečné rozdíly vašich káv — na konci jedna konkrétní káva.')],

      [L('Rozpočet na celý nákup', 'Rozpočet na celý nákup'), L('Celá zostava vrátane doplnku sa zmestí do zvolenej sumy.', 'Celá sestava včetně doplňku se vejde do zvolené částky.')]
    ]
  };

  /* ------------------------------------------------------------------ data */

  /* Read from the owner's side: what the chatbot takes off his hands, not a
     description of the interface. */
  const commonFigures = () => [
    ['24/7', 'odpovedá za vás'],
    ['1', 'káva na konci']
  ];

  const N447 = window.N447_DATA || {};
  const BRANDS = Object.fromEntries(Object.values(N447).map((d) => [d.slug, {
    name: d.brand.name, place: d.brand.place, root: '.' + d.slug + '-page', shop: d.brand.shopUrl,
    lockup: '<img src="' + d.brand.logo + '" alt="' + d.brand.name.replace(/"/g, '&quot;') + '">',
    theme: d.brand.theme, hero: d.brand.hero, display: d.brand.display, figures: commonFigures()
  }]));

  /* The skincare pages say something about the shop they were built for; the
     roasteries all said the same sentence. A brand that carries its own
     headline and lead uses them, and these stay as the fallback. */
  /* Headline and lead are the same on every page. The lead used to open with
     a sentence about the shop's catalogue, which took two lines to say what
     the visitor cannot tell apart and never got round to the chatbot. */
  const HEADING = 'Poradí zákazníkovi kávu a odpovie mu na otázky.';
  const LEAD = L('Chatbot odpovie zákazníkovi na otázky o vašich kávach. Krátkym výberom podľa jeho potrieb ' +
    'mu odporučí tú, ktorá mu sadne. Predáte aj vtedy, keď pri tom nie ste.', 'Chatbot odpoví zákazníkovi na otázky o vašich kávách. Krátkým výběrem podle jeho potřeb ' +
    'mu doporučí tu, která mu sedne. Prodáte i tehdy, když u toho nejste.');

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
  /* "Viac info": the same approved wording as on the other demos; price is already on the page. */
  const MORE = [
    ['Preklik priamo na produkt', 'Po odporúčaní zákazník pokračuje rovno na konkrétny produkt vo vašom e-shope.'],
    [L('Nasadenie na váš e-shop', 'Nasazení na váš e-shop'), L('Spôsob vloženia pripravíme podľa vášho e-shopu a pred spustením ho vyskúšame.', 'Způsob vložení připravíme podle vašeho e-shopu a před spuštěním ho vyzkoušíme.')],
    ['Funguje aj mimo pracovného času', 'Zákazník dostane odpoveď a pomoc s výberom aj večer či cez víkend.'],
    ['Priebežné úpravy', 'Sortiment, ceny aj odpovede sa dajú kedykoľvek aktualizovať.'],
    ['Ďalšie funkcie podľa vašej firmy', 'Neskôr sa dá doplniť napríklad košík, formulár, rezervácia, zber kontaktov alebo iný typ výberu.']
  ];

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
      <a class="mcb-btn mcb-btn--sm" href="${contact}" target="_blank" rel="noopener noreferrer">
        Mám záujem ${icons.arrow}
      </a>
    </header>

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
      <span>${L('Ukážka riešenia pre ', 'Ukázka řešení pro ')}${esc(brand.name)}</span>
    </footer>`;
  };

  /* -------------------------------------------------------------- opening */

  const launchers = {
    praziarnicka: '#open,#pz13-open', diamonds: '#open,#launcherButton', kaffa: '#open,button#launcher',
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
    const selector = mode === 'advisor'
      ? advisorButtons[slug] || '.mode__button[data-mode="advisor"]'
      : chatButtons[slug] || '.mode__button[data-mode="chat"]';
    document.querySelector(selector)?.click();
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
    cleanup.href = '/coffee-header-cleanup.css?v=bc30d145';
    cleanup.dataset.coffeeHeaderCleanup = 'true';
    cleanup.dataset.mcOrder = '25';
    document.body.appendChild(cleanup);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/coffee-owner-brand.css?v=266a9330';
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
    refresh.href = '/coffee-refresh.css?v=6da6246d';
    refresh.dataset.mcbRefreshStyle = 'true';
    refresh.dataset.mcOrder = '95';
    document.body.appendChild(refresh);

    if (!document.querySelector('script[data-owner-info]')) {
      const info = document.createElement('script');
      info.src = '/n447/owner-more-info-n447.js';
      info.dataset.ownerInfo = 'true';
      document.body.appendChild(info);
    }

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
    return document.querySelector(`.page.${CSS.escape(slug + "-page")}`) ||
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


    requestAnimationFrame(() => root.classList.add('is-in'));
    watchDialog();
    return true;
  }

  const usesCleanJolkaWidget = document.documentElement.dataset.coffeeReleaseReady === 'true';
  if (!usesCleanJolkaWidget && !document.querySelector('script[data-mcb-widget]')) {
    const polish = document.createElement('script');
    polish.src = '/coffee-widget-polish.js?v=6a54d790';
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
