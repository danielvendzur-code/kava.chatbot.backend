/**
 * Branded storefront for the four routed demos (Diamonds, Kaffa, Víťazov, Concept).
 *
 * Before this layer each of those demos rendered the same owner-facing pitch —
 * "Zákazník odpovie na štyri otázky…" plus an "Odpovie 24/7 / Zvýši objednávku"
 * strip. Three different roasteries, one identical page about a chatbot.
 *
 * The page behind the widget now reads as the roastery's own shop: logo, menu,
 * hero, real products with real prices and links, and a service strip. The
 * advisor is offered the way a shop offers help, not the way a vendor demos a
 * product. Pražiarnička already had such a page (praziarnicka-v13.js); this is
 * the same idea generalised over the remaining four brands.
 */
(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || '';
  const BRANDS = ['diamonds', 'kaffa', 'vitazov', 'concept'];
  if (!BRANDS.includes(slug)) return;

  const esc = (value = '') =>
    String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const svg = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const icons = {
    arrow: svg('M5 12h13m-5-6 6 6-6 6'),
    bag: svg('M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2'),
    spark: svg('M12 3l1.4 5.4L19 10l-5.6 1.6L12 17l-1.4-5.4L5 10l5.6-1.6L12 3Z')
  };

  /* ------------------------------------------------------------ brand data */

  /** Prices, names and links come from each demo's own catalogue where it has
   *  one, so the shop page can never drift away from what the advisor says. */
  const catalogue = () => {
    if (slug === 'kaffa') {
      return (window.KF?.products || []).map((product) => ({
        name: product.name,
        meta: product.origin,
        price: product.price,
        photo: product.image,
        url: product.url
      }));
    }
    if (slug === 'concept') {
      // Concept stores package prices as numbers, so they need formatting into
      // the same "od 15,00 €" shape the other shops already use.
      const price = (value) => `od ${Number(value).toFixed(2).replace('.', ',')} €`;
      return (window.CONCEPT_SEASONAL_CONFIG?.products || []).map((product) => ({
        name: product.name,
        meta: [product.country, product.process].filter(Boolean).join(' · '),
        price: product.packages?.[0] ? price(product.packages[0].price) : '',
        photo: product.productPhoto,
        url: product.url
      }));
    }
    const demo = window.COFFEE_DEMOS?.[slug];
    return (demo?.products || []).map((product) => ({
      name: product.name,
      meta: product.origin,
      price: product.price,
      photo: product.image,
      url: product.url || demo.shopUrl
    }));
  };

  const brands = {
    diamonds: {
      root: '.diamonds-page',
      logo: { src: '/assets/diamonds/diroastery-logo.svg', alt: 'Diamonds Roastery', height: 34 },
      site: 'https://diroastery.sk/',
      shop: 'https://diroastery.sk/kategoria-produktu/kava/',
      nav: [['O pražiarni', 'https://diroastery.sk/o-nas/'], ['Káva', 'https://diroastery.sk/kategoria-produktu/kava/'], ['Kontakt', 'https://diroastery.sk/kontakt/']],
      eyebrow: 'VÝBEROVÁ KÁVA · DUNAJSKÁ LUŽNÁ',
      title: 'Káva, ktorú pražíme pre chuť.',
      lead: 'Malé dávky, jednodruhové kávy z rodinných fariem a zmesi do espressa. Vyberte si z ponuky alebo si nechajte poradiť podľa chuti a prípravy.',
      stamp: 'ČERSTVO PRAŽENÉ · MALÉ DÁVKY',
      heroPhoto: '/assets/diamonds/peru-valley-official.jpg',
      heroName: 'Peru Valley Coffee',
      heroMeta: 'hruška · čokoláda · mandle',
      heroPrice: 'od 10,00 €',
      sidePhoto: '/assets/diamonds/kenya-mugaya-official.jpg',
      offer: 'Naša ponuka kávy',
      pick: ['Brazília Fazenda Pereira', 'Kolumbia Kumanday Reserve', 'Keňa Mugaya AB', 'Kolumbia El Buho bez kofeínu'],
      proof: [
        ['Vlastná pražiareň', 'pražíme v malých dávkach'],
        ['Jednodruhové kávy', 'aj zmesi do espressa'],
        ['Zrnková aj mletá', 'mletie podľa prípravy'],
        ['Poradíme s výberom', 'chuť, príprava aj balenie']
      ]
    },

    kaffa: {
      root: '.kf-shell',
      wordmark: 'KAFFA',
      wordmarkNote: 'ROASTERY',
      site: 'https://kaffaroastery.sk/',
      shop: 'https://kaffaroastery.sk/',
      nav: [['O nás', 'https://kaffaroastery.sk/o-nas/'], ['Káva', 'https://kaffaroastery.sk/'], ['Kontakt', 'https://kaffaroastery.sk/kontakt/']],
      eyebrow: 'VÝBEROVÁ KÁVA · SPECIALTY ROASTERY',
      title: 'Výberová káva, ktorej chuti rozumiete.',
      lead: 'Sezónne mikrošarže aj vyladené espresso zmesi. Pri každej káve píšeme, ako chutí a na akú prípravu sa hodí — aby ste nemuseli hádať.',
      stamp: 'SEZÓNNE MIKROŠARŽE',
      heroPhoto: '/assets/kaffa/mokka-official.webp',
      heroName: 'Mokka Espresso Blend',
      heroMeta: 'kakao · mandle · škorica',
      heroPrice: 'od 11,90 €',
      sidePhoto: '/assets/kaffa/kamundu-official.webp',
      offer: 'Aktuálna ponuka',
      pick: ['Mokka Espresso Blend', 'Kenya Kamundu Estate AA', 'Wilder Lazo Stellar Origin', 'Colombia Finca El Diviso Decaf'],
      proof: [
        ['Pražíme na Slovensku', 'malé sezónne šarže'],
        ['Popis chuti pri každej káve', 'bez odbornej hantýrky'],
        ['Zrnková aj mletá', 'mletie na vašu prípravu'],
        ['Poradíme s výberom', 'podľa chuti a prípravy']
      ]
    },

    vitazov: {
      root: '.demo-page',
      logo: { src: '/assets/vitazov-logo.svg', alt: 'Káva Víťazov', height: 40 },
      site: 'https://kavavitazov.sk/',
      shop: 'https://kavavitazov.sk/obchod/',
      nav: [['O nás', 'https://kavavitazov.sk/o-nas/'], ['E-shop', 'https://kavavitazov.sk/obchod/'], ['Kontakt', 'https://kavavitazov.sk/kontakt/']],
      eyebrow: 'SLOVENSKÁ PRAŽIAREŇ · PREŠOV',
      title: 'Káva domov aj do firmy.',
      lead: 'Pražíme na Slovensku a dodávame kávu domácnostiam aj firmám. Vyberte si z ponuky alebo si nechajte odporučiť kávu podľa chuti a spôsobu prípravy.',
      stamp: 'PRAŽENÉ NA SLOVENSKU',
      heroPhoto: '/assets/vitazov-victory.jpeg',
      heroName: 'Victory Blend',
      heroMeta: 'kakao · korenie · jemná arabika',
      heroPrice: 'od 17,90 €',
      sidePhoto: '/assets/vitazov-brazil.jpeg',
      offer: 'Naša ponuka kávy',
      photos: {
        'Office Blend': '/assets/vitazov-office.jpeg',
        'Victory Blend': '/assets/vitazov-victory.jpeg',
        'Brazília': '/assets/vitazov-brazil.jpeg',
        'Etiópia': '/assets/vitazov-ethiopia.jpeg',
        'Bezkofeínová': '/assets/vitazov-decaf.jpeg'
      },
      pick: ['Office Blend', 'Victory Blend', 'Brazília', 'Etiópia'],
      proof: [
        ['Pražíme v Prešove', 'čerstvé pražiarenské dávky'],
        ['Domov aj do firmy', 'aj pravidelné dodávky'],
        ['Zrnková aj mletá', 'mletie podľa kávovaru'],
        ['Poradíme s výberom', 'podľa chuti aj použitia']
      ]
    },

    concept: {
      root: '.concept-page',
      logo: { src: '/brand/concept-official-logo.png', alt: 'Concept Coffee Roasters', height: 40 },
      site: 'https://www.conceptcoffee.sk/',
      shop: 'https://www.conceptcoffee.sk/kava/',
      nav: [['O nás', 'https://www.conceptcoffee.sk/o-nas/'], ['Káva', 'https://www.conceptcoffee.sk/kava/'], ['Kontakty', 'https://www.conceptcoffee.sk/kontakty/']],
      eyebrow: 'VÝBEROVÁ KÁVA · PIEŠŤANY A BRATISLAVA',
      title: 'Sezónna káva z malej pražiarne.',
      lead: 'Ponuku meníme podľa toho, čo je na farmách čerstvé. Pri každej káve nájdete chuťový profil aj odporúčanú prípravu — alebo vám ju pomôžeme vybrať.',
      stamp: 'SEZÓNNA PONUKA',
      heroPhoto: '/assets/concept/product-weithaga.jpg',
      heroName: 'Weithaga AA',
      heroMeta: 'ríbezle · grep · vanilka',
      heroPrice: 'od 15,00 €',
      sidePhoto: '/assets/concept/product-berry-blast.jpg',
      offer: 'Aktuálna sezóna',
      pick: ['Weithaga AA', 'Berry Blast', 'Holysh*t! espresso', 'Yellow Sunset (decaf)'],
      proof: [
        ['Sezónne mikrošarže', 'ponuka sa mení počas roka'],
        ['Chuťový profil pri káve', 'viete, čo si kupujete'],
        ['Zrnková aj mletá', 'mletie na vašu prípravu'],
        ['Poradíme s výberom', 'espresso, filter aj mlieko']
      ]
    }
  };

  const brand = brands[slug];
  const root = document.querySelector(brand.root);
  if (!root || root.dataset.storefront === 'true') return;

  // Kept at the end of <body>, after index.html's own two stylesheets, so the
  // shop layout is not overridden by the landing rules it replaces.
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = '/coffee-storefront.css';
  styles.dataset.storefront = 'true';
  document.body.appendChild(styles);

  /* -------------------------------------------------------------- products */

  const products = (() => {
    const all = catalogue();
    const byName = new Map(all.map((product) => [product.name, product]));
    const chosen = brand.pick.map((name) => byName.get(name)).filter(Boolean);
    const list = chosen.length >= 4 ? chosen : all;
    return list.slice(0, 4).map((product) => ({
      ...product,
      photo: brand.photos?.[product.name] || product.photo,
      url: product.url || brand.shop
    }));
  })();

  const productCard = (product) => `
    <a class="cs-card" href="${esc(product.url)}" target="_blank" rel="noreferrer">
      <span class="cs-card__photo">${product.photo ? `<img src="${esc(product.photo)}" alt="${esc(product.name)}" loading="lazy">` : ''}</span>
      <span class="cs-card__copy">
        ${product.meta ? `<small>${esc(product.meta)}</small>` : ''}
        <b>${esc(product.name)}</b>
        ${product.price ? `<strong>${esc(product.price)}</strong>` : ''}
      </span>
      <span class="cs-card__arrow">${icons.arrow}</span>
    </a>`;

  const lockup = brand.logo
    ? `<img src="${esc(brand.logo.src)}" alt="${esc(brand.logo.alt)}" style="height:${brand.logo.height}px">`
    : `<span class="cs-wordmark"><b>${esc(brand.wordmark)}</b><small>${esc(brand.wordmarkNote)}</small></span>`;

  root.dataset.storefront = 'true';
  root.innerHTML = `
    <header class="cs-head">
      <a class="cs-logo" href="${esc(brand.site)}" target="_blank" rel="noreferrer">${lockup}</a>
      <nav class="cs-nav" aria-label="Navigácia">
        ${brand.nav.map(([label, href]) => `<a href="${esc(href)}" target="_blank" rel="noreferrer">${esc(label)}</a>`).join('')}
        <button class="cs-nav__cta" type="button" data-storefront-advisor>Vybrať kávu ${icons.arrow}</button>
      </nav>
    </header>

    <section class="cs-hero">
      <div class="cs-hero__copy">
        <span class="cs-eyebrow">${esc(brand.eyebrow)}</span>
        <h1>${esc(brand.title)}</h1>
        <p>${esc(brand.lead)}</p>
        <div class="cs-actions">
          <a class="cs-btn" href="${esc(brand.shop)}" target="_blank" rel="noreferrer">Do e-shopu ${icons.bag}</a>
          <a class="cs-btn is-ghost" href="${esc(brand.site)}" target="_blank" rel="noreferrer">O pražiarni ${icons.arrow}</a>
        </div>
      </div>

      <div class="cs-hero__visual">
        <span class="cs-stamp">${esc(brand.stamp)}</span>
        <figure class="cs-hero__main">
          <img src="${esc(brand.heroPhoto)}" alt="${esc(brand.heroName)}">
          <figcaption><small>${esc(brand.heroMeta)}</small><b>${esc(brand.heroName)}</b><strong>${esc(brand.heroPrice)}</strong></figcaption>
        </figure>
        <figure class="cs-hero__side"><img src="${esc(brand.sidePhoto)}" alt="" loading="lazy"></figure>
        <button class="cs-hero__advisor" type="button" data-storefront-advisor>
          <span class="cs-hero__advisor-mark">${icons.spark}</span>
          <span class="cs-hero__advisor-copy"><small>NEVIETE, KTORÚ?</small><b>Nájdeme vašu kávu za 4 kroky.</b></span>
          ${icons.arrow}
        </button>
      </div>
    </section>

    <section class="cs-products" aria-label="${esc(brand.offer)}">
      <div class="cs-products__title">
        <span>NAŠA PONUKA</span>
        <b>${esc(brand.offer)}</b>
        <a href="${esc(brand.shop)}" target="_blank" rel="noreferrer">Pozrieť všetky ${icons.arrow}</a>
      </div>
      <div class="cs-products__grid">${products.map(productCard).join('')}</div>
    </section>

    <footer class="cs-proof">
      ${brand.proof.map(([title, note]) => `<div><b>${esc(title)}</b><span>${esc(note)}</span></div>`).join('')}
    </footer>`;

  /* --------------------------------------------------------------- wiring */

  /** Opens whatever launcher the underlying demo renders, then asks it for the
   *  advisor mode. Each demo owns its own widget, so we drive it through the
   *  same controls a customer would use. */
  const openAdvisor = () => {
    const launcher = document.querySelector('#launcherButton, #openWidget, #launcher.kf-launcher, .kf-launcher, .launcher__button, .launcher-button');
    if (launcher) launcher.click();
    window.setTimeout(() => {
      const advisorButton = [...document.querySelectorAll('.mode__button, .mode-switch button, .kf-switch button')].find(
        (button) => (button.textContent || '').toLowerCase().includes('výber')
      );
      advisorButton?.click();
    }, 220);
  };

  root.querySelectorAll('[data-storefront-advisor]').forEach((button) => button.addEventListener('click', openAdvisor));

  // The parity layer appends its "čo poradca uľahčí" strip to this same root on
  // a timer. That strip is vendor copy, not shop content, so keep it out.
  const dropVendorStrip = () => root.querySelector('.parity-bottom')?.remove();
  dropVendorStrip();
  new MutationObserver(dropVendorStrip).observe(root, { childList: true });
})();
