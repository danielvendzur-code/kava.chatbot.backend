(() => {
  'use strict';

  const root = document.querySelector('#coffee-demo-root');
  const config = window.COFFEE_DEMOS?.diamonds;
  if (!root || !config) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const esc = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

  const iconPaths = {
    arrow: '<path d="m8 5 7 7-7 7"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    reset: '<path d="M20 11a8 8 0 1 0-2.4 5.7M20 5v6h-6"/>',
    chat: '<path d="M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    select: '<path d="M5 7h14M5 12h10M5 17h7"/><path d="m16 16 2 2 4-5"/>',
    send: '<path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/>',
    shop: '<path d="M5 9h14l-1 11H6L5 9ZM8 9V6a4 4 0 0 1 8 0v3"/>',
    filter: '<path d="M5 5h14l-5 8v6h-4v-6L5 5Z"/>',
    espresso: '<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
    automatic: '<path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M9 15h6v3H9z"/>',
    moka: '<path d="m8 3 8 1 2 7-3 10H9L6 11l2-8Z"/><path d="M7 10h10"/>',
    chocolate: '<path d="M5 5h14v14H5zM10 5v14M14 5v14M5 10h14M5 14h14"/>',
    balanced: '<path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z"/>',
    fruity: '<path d="M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5"/>',
    black: '<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
    milk: '<path d="M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0"/>',
    both: '<path d="M4 6h7v12H4zM13 6h7v12h-7z"/>',
    classic: '<path d="M5 17c3-7 7-11 14-12-1 7-5 12-12 14"/><path d="M7 19c3-3 6-6 10-9"/>',
    decaf: '<path d="M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
  };
  const icon = (name) => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || iconPaths.info}</svg>`;

  const officialLogo = (className = '') => `<span class="brand-lockup ${className}"><img src="${esc(config.officialLogo)}" alt="Diamonds Roastery" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="brand-lockup__fallback" hidden>DIAMONDS<br>ROASTERY</span></span>`;
  const productImage = (product, className = '') => `<figure class="product-photo ${className}"><img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy" decoding="async" onerror="this.parentNode.classList.add('is-offline')"><span class="product-photo__fallback"><b>${esc(product.name)}</b><small>Oficiálna produktová fotografia</small></span></figure>`;

  const questions = [
    {
      id: 'prep', eyebrow: 'Príprava', title: 'Ako si pripravujete kávu?', help: 'Vyberte spôsob, ktorý používate najčastejšie.',
      options: [
        { value: 'automatic', title: 'Automat', description: 'Rýchla každodenná šálka', icon: 'automatic' },
        { value: 'espresso', title: 'Espresso', description: 'Pákový kávovar', icon: 'espresso' },
        { value: 'filter', title: 'Filter', description: 'Prekvapkávaná káva', icon: 'filter' },
        { value: 'moka', title: 'Moka', description: 'Moka kanvička', icon: 'moka' }
      ]
    },
    {
      id: 'taste', eyebrow: 'Chuť', title: 'Čo chcete cítiť v šálke?', help: 'Vyberte chuť, ktorá vám je najbližšia.',
      options: [
        { value: 'chocolate', title: 'Sladká a čokoládová', description: 'Kakao, orechy, karamel', icon: 'chocolate' },
        { value: 'balanced', title: 'Vyvážená', description: 'Čistá, jemná a univerzálna', icon: 'balanced' },
        { value: 'fruity', title: 'Ovocná a svieža', description: 'Výraznejší pôvod a iskra', icon: 'fruity' }
      ]
    },
    {
      id: 'drink', eyebrow: 'Spôsob pitia', title: 'Pijete ju čiernu alebo s mliekom?', help: 'Podľa toho vyberieme kávu, ktorá sa v šálke nestratí.',
      options: [
        { value: 'black', title: 'Čiernu', description: 'Chcem cítiť kávu naplno', icon: 'black' },
        { value: 'milk', title: 'S mliekom', description: 'Cappuccino alebo flat white', icon: 'milk' },
        { value: 'both', title: 'Oboje', description: 'Striedam podľa nálady', icon: 'both' }
      ]
    },
    {
      id: 'caffeine', eyebrow: 'Kofeín', title: 'Kedy ju pijete najčastejšie?', help: 'Vyberte klasickú alebo bezkofeínovú kávu.',
      options: [
        { value: 'classic', title: 'Počas dňa', description: 'Chcem klasickú kávu s kofeínom', icon: 'classic' },
        { value: 'decaf', title: 'Aj večer', description: 'Chcem chuť bez kofeínu', icon: 'decaf' }
      ]
    }
  ];

  const state = {
    open: false,
    mode: 'chat',
    step: 0,
    answers: {},
    result: null,
    alternative: null,
    chat: [{ role: 'assistant', content: config.welcome }],
    scrollY: 0,
    lastFocused: null
  };
  const products = config.products;
  const findProduct = (id) => products.find((product) => product.id === id);

  root.innerHTML = `
    <main class="diamonds-page">
      <header class="site-head">
        <a class="brand-link" href="${esc(config.shopUrl)}" target="_blank" rel="noreferrer">${officialLogo()}</a>
        <span class="owner-context"><i></i>Online</span>
      </header>
      <section class="owner-hero">
        <div class="owner-copy">
          <h1>Káva, ktorá vám sadne.</h1>
          <p>Odpovieme 24/7 a podľa chuti aj prípravy odporučíme konkrétnu kávu.</p>
          <div class="hero-actions">
            <button id="heroOpen" class="button-primary" type="button">Nájsť svoju kávu ${icon('arrow')}</button>
            <a class="button-secondary" href="${esc(config.categoryUrl)}" target="_blank" rel="noreferrer">Všetky kávy ${icon('arrow')}</a>
          </div>
          <ul class="owner-benefits" aria-label="Obchodná hodnota poradcu">
            <li><span class="benefit-icon">${icon('filter')}</span><span><b>Jednoduchý výber</b><small>Pár otázok a nájdeme kávu, ktorá vám sadne.</small></span></li>
            <li><span class="benefit-icon">${icon('chat')}</span><span><b>Pomoc 24/7</b><small>Poradíme aj vtedy, keď práve nie sme online.</small></span></li>
            <li><span class="benefit-icon">${icon('shop')}</span><span><b>Konkrétna káva</b><small>Odporúčanie podľa vašej chuti aj prípravy.</small></span></li>
          </ul>
          <div class="advisor-flow" aria-label="Štyri kroky odporúčania">
            <div><span>1</span><small>Príprava</small></div><i></i><div><span>2</span><small>Chuť</small></div><i></i><div><span>3</span><small>Spôsob pitia</small></div><i></i><div><span>4</span><small>Produkt</small></div>
          </div>
        </div>
        <div class="hero-media">
          <figure class="hero-photo-frame">${productImage(findProduct('peru-valley'), 'hero-photo')}<figcaption><span>Reálna káva z ponuky Diamonds</span><b>Peru Valley Coffee</b><small>hruška · čokoláda · sušené ovocie · mandle</small></figcaption></figure>
          <div class="hero-rail"><div>${productImage(findProduct('kenya-mugaya'), 'rail-photo')}<span>Pre objaviteľov</span></div><div>${productImage(findProduct('el-buho'), 'rail-photo')}<span>Aj bez kofeínu</span></div></div>
        </div>
      </section>
      <section class="owner-strip" aria-label="Výber kávy"><div><span>Chat</span><b>Odpovie na konkrétnu otázku.</b></div><div><span>Výber kávy</span><b>Štyri odpovede a konkrétna káva.</b></div><a href="${esc(config.categoryUrl)}" target="_blank" rel="noreferrer">Pozrieť ponuku ${icon('arrow')}</a></section>
    </main>

    <div class="launcher" id="launcher">
      <div class="teaser" id="teaser"><button id="teaserClose" type="button" aria-label="Skryť pozvánku">${icon('close')}</button><strong>Skúste si vybrať kávu.</strong><span>4 otázky k reálnej ponuke Diamonds.</span></div>
      <button id="launcherButton" class="launcher-button" type="button" aria-label="Otvoriť Diamonds poradcu" aria-expanded="false">${officialLogo('launcher-logo')}<i></i></button>
    </div>

    <section class="widget" id="widget" role="dialog" aria-modal="true" aria-labelledby="widgetTitle" aria-describedby="widgetDescription" aria-hidden="true" tabindex="-1">
      <header class="widget-head"><div class="widget-brand">${officialLogo('widget-logo')}<span><strong id="widgetTitle">Diamonds Roastery</strong><small id="widgetDescription"><i></i> Online</small></span></div><div class="head-actions"><button id="resetAll" type="button" aria-label="Začať odznova">${icon('reset')}</button><button id="closeWidget" type="button" aria-label="Zavrieť poradcu">${icon('close')}</button></div></header>
      <nav class="mode-switch" aria-label="Režim poradcu"><button data-mode="chat" type="button" aria-pressed="true" class="is-active">${icon('chat')}<span><b>Chat</b></span></button><button data-mode="advisor" type="button" aria-pressed="false">${icon('select')}<span><b>Výber kávy</b></span></button></nav>
      <div class="widget-stage">
        <section class="screen chat-screen is-active" id="chatScreen" aria-label="Chat s poradcom">
          <button class="advisor-entry" id="openAdvisor" type="button"><span>${icon('select')}</span><span><b>Nájsť svoju kávu</b><em>4 otázky · výsledok do minúty</em></span>${icon('arrow')}</button>
          <div class="chat-messages" id="chatMessages" aria-live="polite"></div>
          <div class="chat-bottom"><div class="quick-grid" id="quickChips" aria-label="Rýchle otázky"></div><form id="chatForm" class="composer"><input id="chatInput" autocomplete="off" placeholder="Opýtajte sa na kávu…" aria-label="Otázka o káve"><button type="submit" aria-label="Odoslať otázku">${icon('send')}</button></form></div>
        </section>
        <section class="screen advisor-screen" id="advisorScreen" aria-label="Výber kávy"><header class="advisor-top"><button id="backButton" type="button">${icon('back')}<span>Späť</span></button><div class="progress" aria-hidden="true"><span id="progressFill"></span></div><span id="progressText">1 z 4</span></header><div class="advisor-content" id="advisorContent"></div></section>
      </div>
    </section>`;

  window.DIAMONDS_APP = { root, config, $, $$, esc, icon, officialLogo, productImage, questions, state, products, findProduct };
})();
