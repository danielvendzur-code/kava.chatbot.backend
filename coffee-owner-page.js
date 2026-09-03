/**
 * Owner-facing page behind the widget for Diamonds, Kaffa, Káva Víťazov and
 * Concept.
 *
 * This page is shown to the roastery's owner, not to their customer. A fake
 * shop with an e-shop menu, a contact link and a product grid gives the owner
 * nothing — they already have a shop. What they need is the widget: what it
 * does and how it works.
 *
 * The widget does two separate things, so the page says so in two blocks: the
 * chat, where the customer asks in their own words, and the picker, where four
 * questions lead to one coffee. The examples in each block are that roastery's
 * own — the questions their customers actually ask about their catalogue.
 */
(() => {
  'use strict';

  const slug = window.__COFFEE_DEMO_SLUG__ || window.COFFEE_DEMO_SLUG || document.body.dataset.demo || '';
  if (!['diamonds', 'kaffa', 'vitazov', 'concept'].includes(slug)) return;
  // coffee-owner-brand.js builds the roastery's page and covers all six demos.
  // Rendering here first only produces a page that is replaced a frame later,
  // which the owner sees as a flash.
  if (window.__MCB_OWNER__ || document.querySelector('[data-mcb-page="true"]')) return;

  const esc = (value = '') =>
    String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const chatIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5.5h14v10.2H10l-5 3.8V5.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const cupIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 7.5h11v6.2a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V7.5Zm11 2h1.8a2.2 2.2 0 0 1 0 4.4H16M4 21.5h13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const brands = {
    diamonds: {
      root: '.diamonds-page',
      name: 'Diamonds Roastery',
      logo: { src: '/assets/diamonds/diroastery-logo.svg', height: 38, width: 190 },
      lead: 'Widget robí dve veci naraz: odpovedá na otázky o vašich kávach a v štyroch krokoch dovedie zákazníka k jednej konkrétnej.',
      photo: '/assets/diamonds/peru-valley-official.jpg',
      product: 'Peru Valley Coffee',
      notes: 'hruška · čokoláda · mandle',
      asks: ['Máte niečo ovocné na filter?', 'Ktorá káva ide do automatu?', 'Čo znamená washed?'],
      answer: 'Odpovedá z vášho katalógu — nikdy si nevymyslí kávu, ktorú nepražíte.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, a pridanie do košíka.'
    },
    kaffa: {
      root: '.kf-shell',
      name: 'Kaffa Roastery',
      wordmark: { title: 'KAFFA', note: 'SPECIALITY COFFEE BEANS' },
      lead: 'Widget robí dve veci naraz: odpovedá na otázky o vašich kávach a v štyroch krokoch dovedie zákazníka k jednej konkrétnej.',
      photo: '/assets/kaffa/mokka-hero.webp',
      product: 'Mokka Espresso Blend',
      notes: 'kakao · mandle · škorica',
      asks: ['Je Kamundu kyslá?', 'Čo mi sadne, keď pijem s mliekom?', 'Máte niečo bez kofeínu?'],
      answer: 'Ovocnosť a aciditu preloží do reči, ktorej zákazník rozumie.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, a pridanie do košíka.'
    },
    vitazov: {
      root: '.demo-page',
      name: 'Káva Víťazov',
      forName: 'Kávu Víťazov',
      teamName: 'Kávy Víťazov',
      logo: { src: '/assets/vitazov-logo.svg', height: 46, width: 120 },
      lead: 'Widget robí dve veci naraz: odpovedá na otázky o vašich kávach a v štyroch krokoch dovedie zákazníka k jednej konkrétnej.',
      photo: '/assets/vitazov-victory.jpeg',
      product: 'Victory Blend',
      notes: 'kakao · korenie · jemná arabika',
      asks: ['Aká káva do kancelárie?', 'Ktorá sa nestratí v mlieku?', 'Máte kávu na večer?'],
      answer: 'Rozlíši domácnosť od firmy a podľa toho odporúča.',
      steps: ['Použitie', 'Chuť', 'Nápoj', 'Sila'],
      result: 'Jedna káva, dôvod prečo sedí, a pridanie do košíka.'
    },
    concept: {
      root: '.concept-page',
      name: 'Concept Coffee Roasters',
      logo: { src: '/brand/concept-official-logo.png', height: 46, width: 160 },
      lead: 'Widget robí dve veci naraz: odpovedá na otázky o vašich kávach a v štyroch krokoch dovedie zákazníka k jednej konkrétnej.',
      photo: '/assets/concept/product-weithaga.jpg',
      product: 'Weithaga AA',
      notes: 'ríbezle · grep · vanilka',
      asks: ['Čo máte teraz čerstvé?', 'Ktorá je najmenej kyslá?', 'Hodí sa Berry Blast do espressa?'],
      answer: 'Hovorí o sezónnej ponuke, nie o katalógu spred roka.',
      steps: ['Príprava', 'Chuť', 'Nápoj', 'Kofeín'],
      result: 'Jedna káva, dôvod prečo sedí, a pridanie do košíka.'
    }
  };

  const brand = brands[slug];
  const root = document.querySelector(brand.root);
  if (!root || root.dataset.ownerPage === 'true') return;

  // Kept at the end of <body>, after index.html's own two stylesheets.
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = '/coffee-owner-page.css?v=7b3bb783';
  styles.dataset.ownerPage = 'true';
  document.body.appendChild(styles);

  const forName = brand.forName || brand.name;
  const teamName = brand.teamName || brand.name;

  const lockup = brand.logo
    ? `<img src="${esc(brand.logo.src)}" alt="${esc(brand.name)}" style="height:${brand.logo.height}px;max-width:${brand.logo.width}px">`
    : `<span class="op-wordmark"><b>${esc(brand.wordmark.title)}</b><small>${esc(brand.wordmark.note)}</small></span>`;

  root.dataset.ownerPage = 'true';
  root.innerHTML = `
    <header class="op-head">
      <span class="op-lockup">${lockup}</span>
      <span class="op-flag"><i></i> Kávový poradca · ukážka</span>
    </header>

    <section class="op-hero">
      <div class="op-copy">
        <span class="op-eyebrow">Pre tím ${esc(teamName)}</span>
        <h1>Chat a výber kávy na vašom webe.</h1>
        <p class="op-lead">${esc(brand.lead)}</p>
        <div class="op-actions">
          <button class="op-cta" type="button" data-owner-open>Otvoriť ukážku ${arrow}</button>
          <span class="op-hint">Bublina vpravo dole. Otvorí sa jedným klikom.</span>
        </div>
      </div>

      <aside class="op-showcase" aria-label="Ukážka odporúčania">
        <span class="op-showcase__tag">Ukážka odporúčania</span>
        <div class="op-showcase__card">
          <img src="${esc(brand.photo)}" alt="${esc(brand.product)}">
          <div class="op-showcase__copy">
            <small>Odporúčanie</small>
            <b>${esc(brand.product)}</b>
            <span>${esc(brand.notes)}</span>
            <em>Pridať do košíka</em>
          </div>
        </div>
      </aside>
    </section>

    <section class="op-modes" aria-label="Čo widget robí">
      <article class="op-mode">
        <header><span class="op-mode__icon">${chatIcon}</span><div><small>Prvá časť</small><b>Chat</b></div></header>
        <p>Zákazník sa pýta vlastnými slovami, tak ako by sa spýtal vás.</p>
        <ul class="op-asks">
          ${brand.asks.map((ask) => `<li>„${esc(ask)}“</li>`).join('')}
        </ul>
        <p class="op-mode__note">${esc(brand.answer)}</p>
      </article>

      <article class="op-mode">
        <header><span class="op-mode__icon">${cupIcon}</span><div><small>Druhá časť</small><b>Výber kávy</b></div></header>
        <p>Kto sa pýtať nechce, prejde štyri kroky s veľkými fotkami.</p>
        <ol class="op-flow">
          ${brand.steps.map((step, index) => `<li><i>${index + 1}</i>${esc(step)}</li>`).join('')}
        </ol>
        <p class="op-mode__note">${esc(brand.result)}</p>
      </article>
    </section>

    <footer class="op-foot">
      <p class="op-by">Návrh pripravil <a href="https://mojchatbot.sk" target="_blank" rel="noreferrer">mojchatbot.sk</a> · ukážka pre ${esc(forName)}</p>
    </footer>`;

  /** Opens the demo's own launcher, then asks it for the advisor mode. */
  const openAdvisor = () => {
    const launcher = document.querySelector('#launcherButton, #openWidget, .kf-launcher, .launcher__button, .launcher-button');
    if (launcher && !document.querySelector('.widget.is-open, .kf-widget.is-open')) launcher.click();
  };

  root.querySelectorAll('[data-owner-open]').forEach((button) => button.addEventListener('click', openAdvisor));

  // The parity layer appends its own strip to this root on a timer.
  const dropStrip = () => root.querySelector('.parity-bottom')?.remove();
  dropStrip();
  new MutationObserver(dropStrip).observe(root, { childList: true });
})();
