/**
 * Owner-facing page behind the widget for Diamonds, Kaffa, Káva Víťazov and
 * Concept.
 *
 * This page is shown to the roastery's owner, not to their customer. A fake
 * shop with an e-shop menu, a contact link and a product grid gives the owner
 * nothing — they already have a shop. What they need is the advisor: what it
 * does, how it works, and who built it.
 *
 * Same structure as Jolka's page, brand by brand.
 */
(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || '';
  if (!['diamonds', 'kaffa', 'vitazov', 'concept'].includes(slug)) return;

  const esc = (value = '') =>
    String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const brands = {
    diamonds: {
      root: '.diamonds-page',
      name: 'Diamonds Roastery',
      logo: { src: '/assets/diamonds/diroastery-logo.svg', height: 38, width: 190 },
      lead: 'Takto môže zákazníkovi vysvetliť rozdiel medzi zmesou do espressa a jednodruhovou kávou a odporučiť konkrétny produkt z vašej ponuky.',
      photo: '/assets/diamonds/peru-valley-official.jpg',
      product: 'Peru Valley Coffee',
      notes: 'hruška · čokoláda · mandle'
    },
    kaffa: {
      root: '.kf-shell',
      name: 'Kaffa Roastery',
      wordmark: { title: 'KAFFA', note: 'SPECIALITY COFFEE BEANS' },
      lead: 'Takto môže zákazníkovi preložiť ovocnosť a aciditu do zrozumiteľnej reči a odporučiť konkrétnu kávu z aktuálnej ponuky.',
      photo: '/assets/kaffa/mokka-official.webp',
      product: 'Mokka Espresso Blend',
      notes: 'kakao · mandle · škorica'
    },
    vitazov: {
      root: '.demo-page',
      name: 'Káva Víťazov',
      forName: 'Kávu Víťazov',
      logo: { src: '/assets/vitazov-logo.svg', height: 46, width: 120 },
      lead: 'Takto môže zákazníkovi vybrať kávu podľa toho, či ju pije doma alebo vo firme, a odporučiť konkrétny produkt z vašej ponuky.',
      photo: '/assets/vitazov-victory.jpeg',
      product: 'Victory Blend',
      notes: 'kakao · korenie · jemná arabika'
    },
    concept: {
      root: '.concept-page',
      name: 'Concept Coffee Roasters',
      logo: { src: '/brand/concept-official-logo.png', height: 46, width: 160 },
      lead: 'Takto môže zákazníkovi vysvetliť sezónnu ponuku a odporučiť konkrétnu kávu podľa chuti a spôsobu prípravy.',
      photo: '/assets/concept/product-weithaga.jpg',
      product: 'Weithaga AA',
      notes: 'ríbezle · grep · vanilka'
    }
  };

  const brand = brands[slug];
  const root = document.querySelector(brand.root);
  if (!root || root.dataset.ownerPage === 'true') return;

  // Kept at the end of <body>, after index.html's own two stylesheets.
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = '/coffee-owner-page.css';
  styles.dataset.ownerPage = 'true';
  document.body.appendChild(styles);

  const forName = brand.forName || brand.name;

  const lockup = brand.logo
    ? `<img src="${esc(brand.logo.src)}" alt="${esc(brand.name)}" style="height:${brand.logo.height}px;max-width:${brand.logo.width}px">`
    : `<span class="op-wordmark"><b>${esc(brand.wordmark.title)}</b><small>${esc(brand.wordmark.note)}</small></span>`;

  const steps = [
    ['01', 'Zákazník otvorí poradcu', 'Bublinu vidí na každej stránke, otvorí sa jedným klikom.'],
    ['02', 'Odpovie na štyri otázky', 'Príprava, chuť, nápoj a acidita — každá otázka má štyri veľké voľby.'],
    ['03', 'Dostane jednu konkrétnu kávu', 'S dôvodom, prečo mu sadne, a s pridaním do košíka.']
  ];

  const perks = [
    ['Poradí 24/7', 'Aj v nedeľu o polnoci, keď nemá kto odpísať.'],
    ['Odbúra otázky', 'Aciditu, praženie aj mletie vysvetlí hneď v chate.'],
    ['Zvyšuje hodnotu košíka', 'Ukáže väčšie balenie aj druhú vhodnú kávu.'],
    ['Vedie k nákupu', 'Z odporúčania jedným klikom do košíka.']
  ];

  root.dataset.ownerPage = 'true';
  root.innerHTML = `
    <header class="op-head">
      <span class="op-lockup">${lockup}</span>
      <span class="op-flag"><i></i> Kávový poradca · ukážka</span>
    </header>

    <section class="op-hero">
      <div class="op-copy">
        <span class="op-eyebrow">Pre tím ${esc(brand.name)}</span>
        <h1>Vitajte vo vašom návrhu kávového poradcu pre ${esc(forName)}.</h1>
        <p class="op-lead">${esc(brand.lead)}</p>

        <ol class="op-steps">
          ${steps.map(([n, title, note]) => `<li><span class="op-steps__num">${n}</span><div><b>${esc(title)}</b><span>${esc(note)}</span></div></li>`).join('')}
        </ol>

        <div class="op-actions">
          <button class="op-cta" type="button" data-owner-open>Otvoriť ukážku poradcu ${arrow}</button>
          <span class="op-hint">4 otázky · konkrétne odporúčanie · pridanie do košíka.</span>
        </div>
      </div>

      <aside class="op-showcase" aria-label="Ukážka odporúčania">
        <span class="op-showcase__tag">Ukážka odporúčania</span>
        <img class="op-showcase__photo" src="${esc(brand.photo)}" alt="${esc(brand.product)}">
        <div class="op-showcase__card">
          <small>Odporúčanie</small>
          <b>${esc(brand.product)}</b>
          <span>${esc(brand.notes)}</span>
        </div>
      </aside>
    </section>

    <footer class="op-foot">
      <ul class="op-perks">
        ${perks.map(([title, note]) => `<li><b>${esc(title)}</b><span>${esc(note)}</span></li>`).join('')}
      </ul>
      <p class="op-by">Návrh pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a> · ukážka pre ${esc(forName)}</p>
    </footer>`;

  /** Opens the demo's own launcher, then asks it for the advisor mode. */
  const openAdvisor = () => {
    const launcher = document.querySelector('#launcherButton, #openWidget, .kf-launcher, .launcher__button, .launcher-button');
    if (launcher && !document.querySelector('.widget.is-open, .kf-widget.is-open')) launcher.click();
    window.setTimeout(() => {
      const advisorButton = [...document.querySelectorAll('.mode__button, .mode-switch button, .kf-switch button')].find(
        (button) => (button.textContent || '').toLowerCase().includes('výber')
      );
      advisorButton?.click();
    }, 220);
  };

  root.querySelectorAll('[data-owner-open]').forEach((button) => button.addEventListener('click', openAdvisor));

  // The parity layer appends its own strip to this root on a timer.
  const dropStrip = () => root.querySelector('.parity-bottom')?.remove();
  dropStrip();
  new MutationObserver(dropStrip).observe(root, { childList: true });
})();
