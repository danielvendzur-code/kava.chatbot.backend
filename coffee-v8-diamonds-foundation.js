(() => {
  'use strict';

  const root = document.querySelector('#coffee-demo-root');
  const config = window.COFFEE_DEMOS?.diamonds;
  if (!root || !config) return;

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const iconPaths = {
    arrow: '<path d="m8 5 7 7-7 7"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    reset: '<path d="M20 11a8 8 0 1 0-2.4 5.7M20 5v6h-6"/>',
    chat: '<path d="M5 18.5 3.5 21v-5A8.5 8.5 0 1 1 12 20.5c-2.7 0-5.1-.7-7-2Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/>',
    select: '<path d="M5 6h14M5 12h14M5 18h8"/><path d="m16 16 2 2 4-5"/>',
    send: '<path d="m4 4 16 8-16 8 3-8-3-8Z"/><path d="M7 12h13"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    shop: '<path d="M5 9h14l-1 11H6L5 9ZM8 9V6a4 4 0 0 1 8 0v3"/>',
    filter: '<path d="M5 5h14l-5 8v6h-4v-6L5 5Z"/><path d="M8 5c2 2 6 2 8 0"/>',
    espresso: '<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
    automatic: '<path d="M5 3h14v18H5z"/><path d="M8 7h8M8 11h8M9 15h6v3H9z"/>',
    moka: '<path d="m8 3 8 1 2 7-3 10H9L6 11l2-8Z"/><path d="M7 10h10M16 6h3"/>',
    chocolate: '<path d="M5 5h14v14H5zM9.7 5v14M14.3 5v14M5 9.7h14M5 14.3h14"/>',
    balanced: '<path d="M12 3v18M5 7h14M6 7l-3 7h6L6 7Zm12 0-3 7h6l-3-7Z"/>',
    fruity: '<path d="M12 7c4-3 7 0 7 4 0 5-3 9-7 10-4-1-7-5-7-10 0-4 3-7 7-4ZM12 7c0-2 1-4 4-5"/>',
    black: '<path d="M5 8h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h2a2 2 0 0 1 0 4h-2"/>',
    milk: '<path d="M7 3h10l1 4v14H6V7l1-4ZM6 8h12M9 12c2 2 4 2 6 0"/>',
    both: '<path d="M4 6h7v12H4zM13 6h7v12h-7zM6 9h3M15 9h3"/>',
    classic: '<path d="m13 2-7 11h6l-1 9 7-12h-6l1-8Z"/>',
    decaf: '<path d="M20 15.5A8 8 0 1 1 8.5 4 7 7 0 0 0 20 15.5ZM15 5h.01M18 8h.01"/>',
    either: '<path d="M5 8h14M5 16h14M16 5l3 3-3 3M8 13l-3 3 3 3"/>'
  };

  const icon = (name) => `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name] || iconPaths.select}</svg>`;

  const advisorMark = () => `
    <svg class="diamond-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path class="diamond-mark__outline" d="M18 10.5h18.5C47.3 10.5 55 18.3 55 29S47.3 47.5 36.5 47.5H26l-10.5 7 2.3-9.4C12.4 41.7 9 35.8 9 29 9 18.8 16.2 11 26.4 10.5"/>
      <path class="diamond-mark__bean" d="M25.8 38.5c8.4-3.7 13.8-10.9 14.8-19.6-6.8-1.4-13.7 1.7-16.8 7.7-2.1 4.1-1.3 8.8 2 11.9Z"/>
    </svg>`;

  const officialLogo = (compact = false) => `
    <span class="official-logo${compact ? ' official-logo--compact' : ''}">
      <img src="${escapeHtml(compact ? config.officialMark : config.officialLogo)}" alt="Diamonds Roastery" decoding="async" referrerpolicy="no-referrer">
      <span class="official-logo__fallback">${advisorMark()}<b>DIAMONDS<br>ROASTERY</b></span>
    </span>`;

  const productMedia = (product, className = '') => `
    <span class="product-media ${className}" data-product-id="${escapeHtml(product.id)}">
      <span class="product-media__fallback"><small>DIAMONDS</small><b>${escapeHtml(product.short || product.name)}</b><em>${escapeHtml(product.origin.split('·')[0].trim())}</em></span>
      <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
    </span>`;

  const questions = [
    {
      id: 'prep',
      eyebrow: '1 z 4 · Príprava',
      title: 'Ako si zákazník pripravuje kávu?',
      help: 'Poradca najprv zúži ponuku na kávy, ktoré pri danej príprave dávajú zmysel.',
      options: [
        { value: 'filter', title: 'Filter', description: 'V60, Chemex, AeroPress', icon: 'filter' },
        { value: 'lever', title: 'Espresso', description: 'Pákový kávovar', icon: 'espresso' },
        { value: 'automatic', title: 'Automat', description: 'Automatický kávovar', icon: 'automatic' },
        { value: 'moka', title: 'Moka', description: 'Moka kanvička', icon: 'moka' }
      ]
    },
    {
      id: 'taste',
      eyebrow: '2 z 4 · Chuť',
      title: 'Ktorý chuťový smer mu je najbližší?',
      help: 'Fotky reálnych produktov pomáhajú prepojiť chuť s ponukou bez odbornej bariéry.',
      options: [
        { value: 'chocolate', title: 'Sladká a čokoládová', description: 'Kakao, orechy, karamel', icon: 'chocolate', image: config.products[1].image },
        { value: 'balanced', title: 'Vyvážená', description: 'Čistá, jemná a univerzálna', icon: 'balanced', image: config.products[0].image },
        { value: 'fruity', title: 'Ovocná a svieža', description: 'Výraznejší pôvod a ľahšia šálka', icon: 'fruity', image: config.products[2].image }
      ]
    },
    {
      id: 'drink',
      eyebrow: '3 z 4 · Spôsob pitia',
      title: 'Pije ju čiernu alebo s mliekom?',
      help: 'Mlieko potrebuje profil, ktorý sa v nápoji nestratí.',
      options: [
        { value: 'black', title: 'Čiernu', description: 'Chcem cítiť kávu naplno', icon: 'black' },
        { value: 'milk', title: 'S mliekom', description: 'Cappuccino alebo flat white', icon: 'milk' },
        { value: 'both', title: 'Oboje', description: 'Striedam podľa nálady', icon: 'both' }
      ]
    },
    {
      id: 'caffeine',
      eyebrow: '4 z 4 · Kofeín',
      title: 'Má to byť klasická alebo bezkofeínová káva?',
      help: 'Pri decafe poradca odporučí konkrétny produkt, nie všeobecnú kategóriu.',
      options: [
        { value: 'classic', title: 'Klasická', description: 'S kofeínom', icon: 'classic' },
        { value: 'decaf', title: 'Bezkofeínová', description: 'Aj na večer', icon: 'decaf', image: config.products[4].image },
        { value: 'either', title: 'Je mi to jedno', description: 'Rozhodne najlepšia zhoda', icon: 'either' }
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
    packageSize: '250g',
    grind: 'Zrnková',
    chat: [{ role: 'assistant', content: config.welcome }],
    scrollY: 0
  };

  const featured = [config.products[3], config.products[2], config.products[0]];

  root.innerHTML = `
    <main class="diamond-page">
      <header class="diamond-header">
        <a class="diamond-brand" href="${escapeHtml(config.shopUrl)}" target="_blank" rel="noreferrer" aria-label="Otvoriť e-shop Diamonds Roastery">
          ${officialLogo(false)}
        </a>
        <div class="diamond-header__meta"><span></span>Personalizovaná ukážka pre majiteľa</div>
      </header>

      <section class="diamond-hero" aria-labelledby="hero-title">
        <div class="diamond-hero__copy">
          <h1 id="hero-title">Vitajte vo vašom návrhu AI poradcu pre Diamonds Roastery.</h1>
          <p class="diamond-lead">Takto môže na vašom e-shope vyzerať pomocník, ktorý zákazníkovi vysvetlí rozdiely medzi kávami, odpovie na opakujúce sa otázky a dovedie ho ku konkrétnemu produktu.</p>
          <div class="diamond-actions">
            <button class="diamond-primary" id="heroOpen" type="button">Otvoriť návrh poradcu ${icon('arrow')}</button>
            <button class="diamond-secondary" id="heroAdvisor" type="button">Prejsť rovno na výber kávy</button>
          </div>
          <div class="owner-benefits" aria-label="Hodnota riešenia pre Diamonds Roastery">
            <div><b>Pomoc pri rozhodovaní</b><span>Zákazník sa nestratí medzi pôvodmi, spracovaním a pražením.</span></div>
            <div><b>Menej opakujúcich sa otázok</b><span>Chat vysvetlí prípravu, aciditu, mletie aj rozdiely medzi produktmi.</span></div>
            <div><b>Priamy prechod k nákupu</b><span>Odporúčanie končí na konkrétnej produktovej stránke.</span></div>
          </div>
        </div>

        <div class="diamond-hero__visual" aria-label="Náhľad poradcu s aktuálnymi produktmi">
          <div class="brand-stage">
            <div class="brand-stage__top"><span>AI poradca na vašom e-shope</span><b>Diamonds Roastery</b></div>
            <div class="product-stack">
              ${featured.map((product, index) => `<div class="product-stack__item product-stack__item--${index + 1}">${productMedia(product)}</div>`).join('')}
            </div>
            <article class="advisor-preview">
              <small>ODPORÚČANIE PRE ZÁKAZNÍKA</small>
              <h2>Kolumbia Kumanday Reserve</h2>
              <p>Sladšia, menej ovocná a vhodná do automatu aj pákového kávovaru.</p>
              <span>Otvoriť konkrétny produkt ${icon('arrow')}</span>
            </article>
          </div>
        </div>
      </section>

      <section class="mode-explainer" aria-label="Dva spôsoby pomoci zákazníkovi">
        <div class="mode-explainer__intro"><span>Jedno rozhranie, dve jasné úlohy</span><b>Zákazník do troch sekúnd vie, kam má kliknúť.</b></div>
        <div class="mode-explainer__item"><i>${icon('chat')}</i><span><b>Chat</b><small>Rýchle odpovede na otázky o káve a príprave.</small></span></div>
        <div class="mode-explainer__item"><i>${icon('select')}</i><span><b>Výber kávy</b><small>Štyri kroky a jedno konkrétne odporúčanie.</small></span></div>
        <a href="${escapeHtml(config.mojChatbotUrl)}" target="_blank" rel="noreferrer">Riešenie od Môj Chatbot ${icon('arrow')}</a>
      </section>

      <footer class="diamond-footer">
        <span>Neoficiálna ukážka pripravená na mieru pre Diamonds Roastery.</span>
        <a href="${escapeHtml(config.shopUrl)}" target="_blank" rel="noreferrer">Otvoriť aktuálny e-shop ${icon('arrow')}</a>
      </footer>
    </main>

    <div class="diamond-launcher" id="launcher">
      <div class="diamond-teaser" id="launcherTeaser" role="status">
        <button class="diamond-teaser__close" id="closeTeaser" type="button" aria-label="Skryť oznam">${icon('close')}</button>
        <button class="diamond-teaser__body" id="teaserOpen" type="button">
          <span>Diamonds poradca</span>
          <strong>Pomôžem vybrať správnu kávu.</strong>
          <small>Chat alebo 4-krokový výber</small>
        </button>
      </div>
      <button class="diamond-launcher__button" id="openWidget" type="button" aria-label="Otvoriť kávového poradcu" aria-expanded="false">
        ${officialLogo(true)}<span class="diamond-launcher__status" aria-hidden="true"></span>
      </button>
    </div>

    <section class="diamond-widget" id="widget" aria-label="AI poradca Diamonds Roastery" aria-hidden="true">
      <header class="diamond-widget__header">
        <div class="widget-brand">
          ${officialLogo(true)}
          <span><strong>Diamonds poradca</strong><small><i></i> ukážka pre váš e-shop</small></span>
        </div>
        <div class="widget-actions">
          <button class="round-button" id="resetAll" type="button" aria-label="Začať odznova">${icon('reset')}</button>
          <button class="round-button" id="closeWidget" type="button" aria-label="Zavrieť poradcu">${icon('close')}</button>
        </div>
      </header>

      <nav class="diamond-mode" aria-label="Spôsob pomoci">
        <button type="button" class="diamond-mode__button is-active" data-mode="chat">
          ${icon('chat')}<span><b>Chat</b><small>Opýtať sa na kávu</small></span>
        </button>
        <button type="button" class="diamond-mode__button" data-mode="advisor">
          ${icon('select')}<span><b>Výber kávy</b><small>Nájsť konkrétny produkt</small></span>
        </button>
        <span class="diamond-mode__indicator" aria-hidden="true"></span>
      </nav>

      <div class="diamond-stage">
        <section class="diamond-screen is-active" id="chatScreen" aria-label="Chat s poradcom">
          <div class="chat-context">
            <span>${advisorMark()}</span>
            <div><b>Otázka alebo osobný výber?</b><small>Na rýchlu odpoveď použite chat. Na konkrétny produkt prepnite na Výber kávy.</small></div>
          </div>
          <div class="chat-messages" id="chatMessages" aria-live="polite"></div>
          <div class="chat-bottom">
            <div class="quick-chips" id="quickChips" aria-label="Rýchle otázky"></div>
            <form class="chat-composer" id="chatForm">
              <label class="sr-only" for="chatInput">Otázka o káve</label>
              <input id="chatInput" name="message" type="text" autocomplete="off" inputmode="text" placeholder="Opýtajte sa na kávu…">
              <button type="submit" aria-label="Odoslať správu">${icon('send')}</button>
            </form>
            <a class="widget-credit" href="${escapeHtml(config.mojChatbotUrl)}" target="_blank" rel="noreferrer">Ukážka riešenia od Môj Chatbot ${icon('arrow')}</a>
          </div>
        </section>

        <section class="diamond-screen" id="advisorScreen" aria-label="Výber kávy">
          <header class="advisor-topbar">
            <button class="advisor-back" id="backButton" type="button" aria-label="Predchádzajúci krok">${icon('back')}<span>Späť</span></button>
            <div class="advisor-meter" aria-label="Priebeh výberu"><span id="meterFill"></span></div>
            <span class="advisor-count" id="advisorCount">1 / 4</span>
          </header>
          <div class="advisor-content" id="advisorContent"></div>
        </section>
      </div>
    </section>
  `;

  window.DIAMONDS_ADVISOR_FOUNDATION = {
    root, config, $, $$, escapeHtml, icon, advisorMark, officialLogo, productMedia, questions, state
  };
})();
