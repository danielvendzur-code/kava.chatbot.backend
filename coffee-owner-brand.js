/**
 * The page the roastery owner opens.
 *
 * It is one screen, no scrolling: what the advisor does, the price, and a
 * direct way to respond. The page is intentionally short because the owner
 * should understand the offer before opening the widget.
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
    check: icon('m5 12 4 4L19 6'),
    mail: icon('M3 7h18v10H3V7Zm0 0 9 6 9-6')
  };

  /* --------------------------------------------------------------- pricing */

  const PRICING = {
    currency: '€',
    setup: '247',
    monthly: '10',
    trial: 'Prvý mesiac zdarma',
    points: [
      'Odpovie na otázky a dovedie zákazníka ku káve',
      'Váš katalóg je pripravený už pri spustení',
      'História konverzácií — vidíte, na čo sa pýtajú',
      'Nasadenie na web jedným riadkom kódu'
    ],
    addon: 'Napojenie na košík e-shopu na požiadanie, za príplatok.',
    note: 'Po prvom bezplatnom mesiaci. Bez viazanosti, vypnúť sa dá kedykoľvek.'
  };

  /* ------------------------------------------------------------------ data */

  const commonFigures = (steps) => [
    ['24/7', 'chat odpovedá', 'pôvod · chuť · príprava · konkrétne kávy'],
    ['4', 'krátke otázky', steps],
    ['1', 'odporúčanie', 'konkrétna káva + dôvod, prečo sedí']
  ];

  const BRANDS = {
    praziarnicka: {
      name: 'Pražiarnička',
      place: 'Pražiarnička by Caffè Vita',
      root: '.pz13-site',
      shop: 'https://praziarnicka.sk/eshop',
      lockup: '<img src="/brand/praziarnicka-logo-official.png" alt="Pražiarnička">',
      theme: { ink: '#143f35', brand: '#1c5b4b', accent: '#c25a2b', soft: '#edf6f2', paper: '#ffffff' },
      chips: ['Káva do automatu', 'Nie veľmi kyslú', 'Odkiaľ je káva?', 'Porovnajte dve kávy'],
      figures: commonFigures('príprava · chuť · nápoj · kofeín')
    },

    diamonds: {
      name: 'Diamonds Roastery',
      place: 'Diamonds Roastery · Dunajská Lužná',
      root: '.diamonds-page',
      shop: 'https://diroastery.sk/kategoria-produktu/kava/',
      lockup: '<img src="/assets/diamonds/diroastery-logo.svg" alt="Diamonds Roastery">',
      theme: { ink: '#0b0d0c', brand: '#0b0d0c', accent: '#6f8f19', soft: '#f2f6e8', paper: '#ffffff' },
      chips: ['Káva na filter', 'Nie veľmi kyslú', 'Odkiaľ je káva?', 'Porovnajte dve kávy'],
      figures: commonFigures('príprava · chuť · nápoj · kofeín')
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
      chips: ['Espresso blend', 'Niečo na filter', 'Nechcem kyslú', 'Chcem ovocnú'],
      figures: commonFigures('príprava · chuť · nápoj · kofeín')
    },

    vitazov: {
      name: 'Káva Víťazov',
      place: 'Káva Víťazov · Prešov',
      root: '.demo-page',
      shop: 'https://kavavitazov.sk/obchod/',
      lockup: '<img src="/assets/vitazov-logo.svg" alt="Káva Víťazov">',
      theme: { ink: '#071f1a', brand: '#0c4438', accent: '#5f8a1f', soft: '#eef7e2', paper: '#ffffff' },
      chips: ['Káva do kancelárie', 'Káva do mlieka', 'Odkiaľ je káva?', 'Porovnajte dve kávy'],
      figures: commonFigures('použitie · chuť · príprava · nápoj')
    },

    concept: {
      name: 'Concept Coffee Roasters',
      place: 'Concept Coffee Roasters · Piešťany a Bratislava',
      mark: { text: 'C', font: '"DM Sans", system-ui, sans-serif' },
      root: '.concept-page',
      shop: 'https://www.conceptcoffee.sk/',
      lockup: '<img src="/brand/concept-official-logo.png" alt="Concept Coffee Roasters">',
      theme: { ink: '#1a1b19', brand: '#2c4038', accent: '#b8503c', soft: '#f4efe7', paper: '#fbfaf6' },
      chips: ['Káva na filter', 'Nie veľmi kyslú', 'Odkiaľ je káva?', 'Porovnajte dve kávy'],
      figures: commonFigures('príprava · chuť · nápoj · kofeín')
    },

    jolka: {
      name: 'Pražiareň Jolka',
      place: 'Pražiareň Jolka · Bratislava-Ružinov',
      root: '.page',
      shop: 'https://www.praziarenjolka.sk/eshop-kava/',
      lockup: '<img src="/assets/jolka/logo-ink.webp" alt="Pražiareň Jolka"><b>Pražiareň Jolka</b>',
      theme: { ink: '#23180f', brand: '#5e4834', accent: '#a8763f', soft: '#f3ece3', paper: '#fdfaf6' },
      display: { family: '"Playfair Display", Georgia, serif', weight: '600', tracking: '-.02em' },
      chips: ['Nízka acidita', 'Káva do mlieka', 'Odkiaľ je káva?', 'Porovnajte dve kávy'],
      figures: commonFigures('príprava · chuť · nápoj · acidita')
    }
  };

  const HEADING = 'Kávový poradca na váš web.';
  const LEAD = 'Chat odpovie na otázky o pôvode, chuti, príprave aj konkrétnych kávach z vašej ponuky. ' +
    'Keď zákazník nevie, čo vybrať, cez štyri krátke otázky sa dostane k jednému konkrétnemu odporúčaniu aj s dôvodom.';

  const brand = BRANDS[slug];

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

  const planCard = () => `
    <article class="mcb-plan">
      <span class="mcb-plan-label">Cena</span>
      <b class="mcb-plan-trial">${esc(PRICING.trial)}</b>
      <p class="mcb-plan-price">
        <b><em>potom</em><strong>${esc(PRICING.setup)}&nbsp;${esc(PRICING.currency)}</strong><span>jednorazovo</span></b>
        <b><i>+</i><strong>${esc(PRICING.monthly)}&nbsp;${esc(PRICING.currency)}</strong><span>mesačne</span></b>
      </p>
      <ul>${PRICING.points.map((point) => `<li>${icons.check}<span>${esc(point)}</span></li>`).join('')}</ul>
      ${PRICING.addon ? `<p class="mcb-plan-addon">${esc(PRICING.addon)}</p>` : ''}
    </article>`;

  const markup = () => {
    const contact = esc(contactHref());
    return `
    <header class="mcb-head">
      <span class="mcb-lockup">${brand.lockup}</span>
      <a class="mcb-btn mcb-btn--sm" href="${contact}" target="_blank" rel="noreferrer">
        Mám záujem ${icons.arrow}
      </a>
    </header>

    <main class="mcb-main">
      <section class="mcb-copy">
        <span class="mcb-eyebrow">${esc(brand.place)}</span>
        <h1>${esc(HEADING)}</h1>
        <p class="mcb-lead">${esc(LEAD)}</p>

        <div class="mcb-actions">
          <button class="mcb-btn" type="button" data-release-open="advisor">Otvoriť poradcu ${icons.arrow}</button>
          <button class="mcb-btn mcb-btn--ghost" type="button" data-release-open="chat">Skúsiť chat ${icons.chat}</button>
        </div>
      </section>

      <section class="mcb-figures" aria-label="Čo poradca robí">
        <ul>
          ${brand.figures.map(([value, name, note], i) => `
            <li style="--i:${i}">
              <strong>${esc(value)}</strong>
              <b>${esc(name)}</b>
              <small>${esc(note)}</small>
            </li>`).join('')}
        </ul>
      </section>
    </main>

    <section class="mcb-pricing" aria-label="Cena">
      ${planCard()}
      <div class="mcb-pricing-side">
        <p>${esc(PRICING.note)}</p>
        <a class="mcb-btn mcb-btn--accent" href="${contact}" target="_blank" rel="noreferrer">
          ${icons.mail} Ozvite sa mi
        </a>
      </div>
    </section>

    <footer class="mcb-foot" style="justify-content:flex-end">
      <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk ${icons.arrow}</a>
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
    const launcher = document.querySelector(launchers[slug]);
    if (launcher && launcher.offsetParent !== null) launcher.click();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelector(mode === 'advisor' ? advisorButtons[slug] : chatButtons[slug])?.click();
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

    const sales = document.createElement('link');
    sales.rel = 'stylesheet';
    sales.href = '/coffee-owner-sales-polish.css';
    sales.dataset.mcbSalesStyle = 'true';
    sales.dataset.mcOrder = '40';
    document.body.appendChild(sales);

    const refresh = document.createElement('link');
    refresh.rel = 'stylesheet';
    refresh.href = '/coffee-refresh.css';
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
    polish.src = '/coffee-widget-polish.js';
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
